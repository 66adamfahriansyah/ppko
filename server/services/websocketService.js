import { WebSocketServer } from 'ws';
import pool from '../config/db.js';
import MonitoringRepository from '../repositories/MonitoringRepository.js';
import MonitoringService from '../services/MonitoringService.js';

const monitoringRepository = new MonitoringRepository(pool);
const monitoringService = new MonitoringService(monitoringRepository);

const webClients = new Set();
const gatewayClients = new Set();

export function initializeWebSocketServer() {
  const WS_PORT = process.env.WS_PORT ? parseInt(process.env.WS_PORT) : 8080;
  const BEARER_TOKEN = process.env.WS_BEARER_TOKEN || '';

  const wss = new WebSocketServer({ port: WS_PORT });

  console.log(`🔌 WebSocket Server berjalan di port ${WS_PORT}`);

  wss.on('connection', async (ws, req) => {
    const parsedUrl = new URL(req.url || '', `http://${req.headers.host || 'localhost'}`);
    const pathname = parsedUrl.pathname;
    
    // 1. Otorisasi (jika dikonfigurasi di env)
    if (BEARER_TOKEN && pathname === '/ws/lighttrap') {
      const authHeader = req.headers['authorization'] || '';
      const token = authHeader.replace(/^Bearer\s+/i, '');
      if (token !== BEARER_TOKEN) {
        console.warn(`⚠️ WS Connection Rejected: Token tidak cocok dari IP ${req.socket.remoteAddress}`);
        ws.send(JSON.stringify({ type: 'error', gatewayId: 'system', code: 'UNAUTHORIZED', detail: 'Invalid bearer token' }));
        ws.close(4001, 'Unauthorized');
        return;
      }
    }

    if (pathname === '/ws/lighttrap') {
      // Koneksi dari ESP32 Gateway
      console.log(`🟢 ESP32 Gateway terhubung dari ${req.socket.remoteAddress}`);
      gatewayClients.add(ws);

      ws.on('message', async (message) => {
        let payload;
        try {
          payload = JSON.parse(message.toString());
          console.log(`📥 WS Message Received dari ESP32: type=${payload.type}`);

          if (payload.type === 'ping') {
            // Balas ping
            ws.send(JSON.stringify({
              type: 'pong',
              gatewayId: payload.gatewayId || 'unknown',
              gatewayUptimeMs: payload.gatewayUptimeMs || 0
            }));
          } else if (payload.type === 'telemetry') {
            // Proses telemetry
            const ackMsg = {
              type: 'ack',
              messageSequence: payload.messageSequence || 1
            };
            ws.send(JSON.stringify(ackMsg));

            // Map data dari format JSON v5 ESP32 ke format database
            const aggregate = payload.aggregate || {};
            const nodes = payload.nodes || [];

            // a. Hitung rata-rata voltase baterai dari node yang online
            let avgVoltage = 0.0;
            let onlineNodeCount = 0;
            if (nodes.length > 0) {
              let sumMilliVolt = 0;
              nodes.forEach(n => {
                if (n.online && n.batteryMilliVolt !== null && n.batteryMilliVolt > 0) {
                  sumMilliVolt += n.batteryMilliVolt;
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

            const plts = {
              voltage: parseFloat(avgVoltage.toFixed(2)),
              current: onlineNodeCount > 0 ? 0.2 : 0.0, // dummy charging current atau load kecil
              battery: batteryPercent
            };

            // b. Hujan
            const rainCondition = aggregate.rainCondition || 'BELUM ADA DATA';
            const rain = {
              status: rainCondition,
              detection: (rainCondition === 'HUJAN' || rainCondition === 'LEMBAP/GERIMIS') ? 'Hujan' : (rainCondition === 'BELUM ADA DATA' ? '-' : 'Tidak Hujan'),
              intensity: Math.round(aggregate.rainFuzzyScore ?? aggregate.rainInputPercent ?? 0)
            };

            // c. Light Trap (Relay status)
            const relayOnCount = aggregate.relayOnCount || 0;
            
            // Ambil status control terbaru dari db untuk triggerMode
            let triggerMode = 'Otomatis';
            try {
              const currentControl = await monitoringService.monitoringRepository.getControlStatus();
              if (currentControl) {
                triggerMode = currentControl.auto_mode === 1 ? 'Otomatis' : 'Manual';
              }
            } catch (err) {
              console.error('WS error getting control status:', err.message);
            }

            const lightTrap = {
              active: relayOnCount > 0,
              triggerMode: triggerMode,
              duration: 4 // default duration
            };

            // d. NPK
            const n = Math.round(aggregate.nitrogenMgKg ?? 0);
            const p = Math.round(aggregate.phosphorusMgKg ?? 0);
            const k = Math.round(aggregate.potassiumMgKg ?? 0);
            
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

            // Simpan ke database
            console.log('💾 Menyimpan telemetry ke database...');
            await monitoringService.updateSensors({ plts, rain, lightTrap, npk });

            // Ambil data terbaru yang terformat lengkap, lalu broadcast ke frontend
            const latestData = await monitoringService.getData();
            broadcastToWebClients(latestData);
          }
        } catch (error) {
          console.error('❌ Gagal memproses pesan WS dari ESP32:', error.message);
          try {
            ws.send(JSON.stringify({
              type: 'error',
              gatewayId: payload?.gatewayId || 'unknown',
              code: 'BAD_REQUEST',
              detail: error.message
            }));
          } catch (sendErr) {
            // ignore if socket already closed
          }
        }
      });

      ws.on('close', () => {
        console.log(`🔴 ESP32 Gateway terputus dari ${req.socket.remoteAddress}`);
        gatewayClients.delete(ws);
      });
    } else if (pathname === '/ws/client') {
      // Koneksi dari Web Client (React Frontend)
      console.log(`🔵 Web Client terhubung dari ${req.socket.remoteAddress}`);
      webClients.add(ws);

      // Kirim data snapshot awal
      try {
        const latestData = await monitoringService.getData();
        ws.send(JSON.stringify({ type: 'snapshot', data: latestData }));
      } catch (error) {
        console.error('❌ Gagal mengirim snapshot ke web client:', error.message);
      }

      ws.on('message', (message) => {
        // Web client bisa mengirim trigger jika diperlukan, untuk saat ini hanya log
        console.log(`📥 Pesan diterima dari Web Client: ${message.toString()}`);
      });

      ws.on('close', () => {
        console.log(`🔴 Web Client terputus dari ${req.socket.remoteAddress}`);
        webClients.delete(ws);
      });
    } else {
      // Path tidak dikenal
      ws.close(4004, 'Not Found');
    }
  });
}

function broadcastToWebClients(data) {
  const messageStr = JSON.stringify({ type: 'update', data });
  let count = 0;
  webClients.forEach((client) => {
    if (client.readyState === 1) { // OPEN
      client.send(messageStr);
      count++;
    }
  });
  console.log(`📡 Broadcast telemetry ke ${count} web client(s).`);
}
