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
        console.log(`[MQTT] Pesan Telemetry diterima (type: ${payload.type || 'telemetry'})`);

        // 1. Olah data Sensor Hujan & Relay Light Trap dari 4 Node menggunakan Logika Fuzzy
        const fusedData = processFuzzy4Nodes(payload);

        // Dapatkan mode kontrol terbaru dari database
        let triggerMode = 'Otomatis';
        try {
          const currentControl = await monitoringService.monitoringRepository.getControlStatus();
          if (currentControl) {
            triggerMode = currentControl.auto_mode === 1 ? 'Otomatis' : 'Manual';
          }
        } catch (err) {
          console.error('[MQTT] Gagal mengambil status kontrol:', err.message);
        }

        const rain = fusedData.rain;
        const lightTrap = {
          active: fusedData.lightTrap.active,
          triggerMode: triggerMode,
          duration: 4
        };

        // 2. Olah NPK Langsung dari 1 Sensor Tunggal (1 Node, Tanpa Fuzzy Logic)
        const aggregate = payload.aggregate || {};
        const npkObj = payload.npk || aggregate.npk || payload;
        const n = Math.round(payload.nitrogenMgKg ?? aggregate.nitrogenMgKg ?? npkObj.n ?? npkObj.nitrogen ?? 0);
        const p = Math.round(payload.phosphorusMgKg ?? aggregate.phosphorusMgKg ?? npkObj.p ?? npkObj.phosphorus ?? 0);
        const k = Math.round(payload.potassiumMgKg ?? aggregate.potassiumMgKg ?? npkObj.k ?? npkObj.potassium ?? 0);
        
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
