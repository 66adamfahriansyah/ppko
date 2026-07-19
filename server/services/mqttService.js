import mqtt from 'mqtt';
import pool from '../config/db.js';
import MonitoringRepository from '../repositories/MonitoringRepository.js';
import MonitoringService from '../services/MonitoringService.js';
import { processFuzzy4Nodes } from '../utils/fuzzyLogic.js';

const monitoringRepository = new MonitoringRepository(pool);
const monitoringService = new MonitoringService(monitoringRepository);

export function initializeMqttService() {
  const MQTT_BROKER = process.env.MQTT_BROKER || 'mqtt://broker.emqx.io:1883';
  const MQTT_TOPIC = process.env.MQTT_TOPIC || 'lighttrap/gateway/telemetry';

  console.log(`Mencoba menyambung ke MQTT Broker: ${MQTT_BROKER}...`);
  const client = mqtt.connect(MQTT_BROKER);

  client.on('connect', () => {
    console.log(`Terkoneksi ke MQTT Broker: ${MQTT_BROKER}`);
    client.subscribe(MQTT_TOPIC, (err) => {
      if (!err) {
        console.log(`Berhasil subscribe ke topik: ${MQTT_TOPIC}`);
      } else {
        console.error(`Gagal subscribe ke topik: ${MQTT_TOPIC}`, err.message);
      }
    });
  });

  client.on('message', async (topic, message) => {
    if (topic === MQTT_TOPIC) {
      try {
        const payload = JSON.parse(message.toString());
        console.log(`MQTT Message Received: type=${payload.type}`);

        const isTelemetry = payload.type === 'telemetry' || payload.aggregate !== undefined || payload.nodes !== undefined;

        if (isTelemetry) {
          const aggregate = payload.aggregate || {};
          const nodes = payload.nodes || [];

          // a. Hitung rata-rata voltase baterai untuk battery percentage
          let avgVoltage = 0.0;
          let onlineNodeCount = 0;
          if (nodes.length > 0) {
            let sumMilliVolt = 0;
            nodes.forEach(n => {
              const mv = n.batteryMilliVolt ?? n.battery_mv ?? n.voltage ?? 0;
              if (n.online && mv > 0) {
                sumMilliVolt += mv;
                onlineNodeCount++;
              }
            });
            if (onlineNodeCount > 0) {
              avgVoltage = (sumMilliVolt / onlineNodeCount) / 1000.0;
            } else {
              avgVoltage = 3.7; // default average Li-ion voltage
            }
          } else {
            avgVoltage = 3.7;
          }

          // Map voltage (3.0V - 4.2V) ke battery percentage (0 - 100%)
          const minV = 3.0;
          const maxV = 4.2;
          const batteryPercent = Math.min(100, Math.max(0, Math.round(((avgVoltage - minV) / (maxV - minV)) * 100)));

          // Hilangkan voltage dari plts, hanya simpan current & battery
          const plts = {
            current: onlineNodeCount > 0 ? 0.2 : 0.0, // dummy charging current atau load kecil
            battery: batteryPercent
          };

          // b. Hujan (mendukung flat dan nested objek dari ESP32)
          const rainObj = aggregate.rain || {};
          const rainCondition = aggregate.rainCondition || rainObj.condition || aggregate.rain_condition || 'BELUM ADA DATA';

          let mappedStatus = '-';
          if (rainCondition === 'HUJAN' || rainCondition === 'LEMBAP/GERIMIS' || rainCondition === 'Basah' || rainCondition === 'Rain') {
            mappedStatus = 'BASAH';
          } else if (rainCondition === 'TIDAK HUJAN' || rainCondition === 'Kering' || rainCondition === 'No Rain') {
            mappedStatus = 'KERING';
          }

          let mappedDetection = '-';
          if (rainCondition === 'HUJAN' || rainCondition === 'LEMBAP/GERIMIS' || rainCondition === 'Basah' || rainCondition === 'Rain') {
            mappedDetection = 'HUJAN';
          } else if (rainCondition === 'TIDAK HUJAN' || rainCondition === 'Kering' || rainCondition === 'No Rain') {
            mappedDetection = 'TIDAK HUJAN';
          }

          const rainIntensityRaw = aggregate.rainFuzzyScore ?? aggregate.rainInputPercent ?? rainObj.val ?? rainObj.intensity ?? 0;
          const rain = {
            status: mappedStatus,
            detection: mappedDetection,
            intensity: Math.round(rainIntensityRaw)
          };

          // c. Light Trap (Relay status)
          const relayObj = aggregate.relay || {};
          const relayOnCount = aggregate.relayOnCount ?? relayObj.active_count ?? aggregate.relay_on_count ?? 0;

          // Ambil status control terbaru dari db untuk triggerMode
          let triggerMode = 'Otomatis';
          try {
            const currentControl = await monitoringService.monitoringRepository.getControlStatus();
            if (currentControl) {
              triggerMode = currentControl.auto_mode === 1 ? 'Otomatis' : 'Manual';
            }
          } catch (err) {
            console.error('MQTT error getting control status:', err.message);
          }

          const lightTrap = {
            active: relayOnCount > 0,
            triggerMode: triggerMode,
            duration: 4 // default duration
          };

          // d. NPK (mendukung flat dan nested objek dari ESP32)
          const npkObj = aggregate.npk || {};
          const n = Math.round(aggregate.nitrogenMgKg ?? npkObj.n ?? aggregate.nitrogen ?? 0);
          const p = Math.round(aggregate.phosphorusMgKg ?? npkObj.p ?? aggregate.phosphorus ?? 0);
          const k = Math.round(aggregate.potassiumMgKg ?? npkObj.k ?? aggregate.potassium ?? 0);

          let npkStatus = 'Normal';
          if (n === 0 && p === 0 && k === 0) {
            npkStatus = '-';
          } else if (n > 20 && p > 20 && k > 20) {
            npkStatus = 'Subur';
          } else {
            npkStatus = 'Kurang Subur';
          }

          const npk = {
            nitrogen: n,
            phosphor: p,
            potassium: k,
            status: npkStatus
          };

          console.log(`[MQTT Telemetry Result]:`, {
            rain: `Intensity ${rain.intensity}% (${rain.detection} - ${rain.status}) [Fuzzy 4 Node]`,
            lightTrap: `Active: ${lightTrap.active} (Relays Active: ${fusedData.fuzzyDetails.relayActiveCount}/4, Score: ${fusedData.fuzzyDetails.relayFuzzyScore}) [Fuzzy 4 Node]`,
            npk: `N:${npk.nitrogen} P:${npk.phosphor} K:${npk.potassium} (${npk.status}) [1 Node Direct]`
          });

          // Simpan data valid ke database (tanpa PLTS/baterai)
          await monitoringService.updateSensors({ rain, lightTrap, npk });
          console.log('[MQTT] Berhasil memperbarui database dengan data valid.');
        } catch (error) {
          console.error('[MQTT] Gagal memproses telemetry:', error.message);
        }
      }
  });

  client.on('error', (err) => {
    console.error('[MQTT] Connection Error:', err.message);
  });
}
