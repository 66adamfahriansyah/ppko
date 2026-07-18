import { useState, useEffect } from 'react';
import { getLogs, addLog } from '../services/logsService';
import { getMonitoring } from '../services/monitoringService';

export function useDeviceData() {
  const [selectedDevice, setSelectedDevice] = useState('all');
  const [realtimeData, setRealtimeData] = useState(null);
  const [logs, setLogs] = useState([]);
  
  const [devicesList] = useState([
    { id: 'all', name: 'Semua Tiang (Akumulatif)' },
    { id: 'tiang_1', name: 'Tiang 1 (ON - Barat Sawah)' },
    { id: 'tiang_2', name: 'Tiang 2 (ON - Timur Sawah)' },
    { id: 'tiang_3', name: 'Tiang 3 (OFF - Tengah Sawah)' }
  ]);

  // Load logs from database
  const fetchLogsData = async () => {
    try {
      const val = await getLogs();
      setLogs(val);
    } catch (e) {
      console.error("Gagal mengambil logs:", e);
    }
  };

  useEffect(() => {
    fetchLogsData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const val = await getMonitoring();
        setRealtimeData(val);
      } catch (error) {
        console.warn("Error reading database API:", error);
      }
    };

    fetchData(); // Fetch immediately
    const interval = setInterval(fetchData, 3000); // Poll every 3 seconds

    return () => clearInterval(interval);
  }, []);

  const addManualLog = async (newLog) => {
    try {
      await addLog(newLog);
      await fetchLogsData();
    } catch (e) {
      console.error("Gagal menyimpan manual log:", e);
    }
  };

  // Helper to compute trendData dynamically from the logs
  const computeTrendData = () => {
    let totalPests = 0;
    let totalPesticide = 0;
    let pesticideCount = 0;

    // Filter logs if a specific device is selected
    const filteredLogs = logs.filter(log => {
      if (selectedDevice === 'all') return true;
      if (selectedDevice === 'tiang_1' && log.lokasi.includes('Utara')) return true;
      if (selectedDevice === 'tiang_2' && log.lokasi.includes('Timur')) return true;
      if (selectedDevice === 'tiang_3' && log.lokasi.includes('Selatan')) return true;
      return false;
    });

    // Group by date to draw chart
    const pestsByDate = {};
    filteredLogs.forEach(log => {
      const hamaVal = parseInt(log.hama) || 0;
      const pestisidaVal = parseFloat(log.pestisida) || 0;
      
      totalPests += hamaVal;
      if (pestisidaVal > 0) {
        totalPesticide += pestisidaVal;
        pesticideCount++;
      }

      let label = log.tanggal;
      try {
        const d = new Date(log.tanggal);
        if (!isNaN(d.getTime())) {
          const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
          label = `${String(d.getDate()).padStart(2, '0')} ${months[d.getMonth()]}`;
        }
      } catch {}

      if (!pestsByDate[label]) {
        pestsByDate[label] = { terperangkap: 0, terdeteksi: 0 };
      }
      pestsByDate[label].terperangkap += hamaVal;
      pestsByDate[label].terdeteksi += Math.round(hamaVal * 1.25);
    });

    // Convert to Recharts friendly format sorted by date
    const pestsChart = Object.keys(pestsByDate).map(label => ({
      name: label,
      terperangkap: pestsByDate[label].terperangkap,
      terdeteksi: pestsByDate[label].terdeteksi
    })).reverse(); // Newest input at the end of chart

    // Fallbacks if no data
    const pests = pestsChart.length > 0 ? pestsChart : [
      { name: '01 Jan', terdeteksi: 120, terperangkap: 90 },
      { name: '02 Jan', terdeteksi: 145, terperangkap: 110 },
      { name: '03 Jan', terdeteksi: 180, terperangkap: 130 },
      { name: '04 Jan', terdeteksi: 140, terperangkap: 120 },
      { name: '05 Jan', terdeteksi: 200, terperangkap: 154 },
    ];

    const avgPesticide = pesticideCount > 0 ? (totalPesticide / pesticideCount).toFixed(1) : '42.5';

    return {
      pests: pests,
      npk: [
        { name: 'Aug', nitrogen: 80, phosphor: 65, potassium: 50 },
        { name: 'Sep', nitrogen: 82, phosphor: 68, potassium: 48 },
        { name: 'Oct', nitrogen: 85, phosphor: 67, potassium: 45 },
        { name: 'Nov', nitrogen: 88, phosphor: 70, potassium: 42 },
        { name: 'Dec', nitrogen: 86, phosphor: 72, potassium: 40 },
        { name: 'Jan', nitrogen: 88, phosphor: 70, potassium: 38 }
      ],
      summary: {
        totalPests: totalPests || 1284,
        pestChange: '+12%',
        chemicalReduction: `${avgPesticide}%`,
        chemicalChange: '-24%',
        soilHealth: 88,
        solarEfficiency: 94,
        solarProduction: '12.4 kWh',
        solarConsumption: '2.1 kWh',
        solarSurplus: '+10.3 kWh'
      },
      predictions: {
        rainStatus: 'Potensi hujan terdeteksi dalam 6 jam ke depan. Pastikan sistem drainase sawah berfungsi dengan baik.',
        lightTrapStatus: 'Light Trap dalam kondisi aktif. Disarankan tetap dinyalakan pada malam hari untuk pengendalian hama secara mekanis.',
        soilAdvice: 'Kadar Kalium (K) menurun. Disarankan pemupukan NPK tambahan minggu depan.'
      }
    };
  };

  return {
    selectedDevice,
    setSelectedDevice,
    devicesList,
    realtimeData,
    logs,
    addManualLog,
    trendData: computeTrendData()
  };
}
