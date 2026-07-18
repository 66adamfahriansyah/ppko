import { useState } from 'react';
import { useDeviceData } from '../hooks/useDeviceData';
import MetricCards from '../components/trends/MetricCards';
import NPKTrendCard from '../components/trends/NPKTrendCard';
import AIInsightCard from '../components/trends/AIInsightCard';
import SensorLogsTable from '../components/trends/SensorLogsTable';

function Trends() {
  const { selectedDevice, setSelectedDevice, devicesList, trendData } = useDeviceData();
  const [npkTab, setNpkTab] = useState('all'); // all, nitrogen, phosphor, potassium

  // Mock data for sensor log
  const sensorLogs = [];

  // Function to export table to CSV
  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "ID Sensor,Waktu,Tipe,Status,Nilai\n";
    
    sensorLogs.forEach((log) => {
      csvContent += `${log.id},${log.time},${log.type},${log.status},${log.value}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `sensor_log_${selectedDevice}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* FILTER & DEVICE SELECTOR */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-150 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full md:w-auto">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Pilih Node Tiang:</label>
          <div className="relative flex-1 sm:flex-none">
            <select 
              value={selectedDevice} 
              onChange={(e) => setSelectedDevice(e.target.value)}
              className="bg-emerald-50 text-emerald-800 text-xs font-bold px-3 py-2 rounded-xl outline-none border border-emerald-100 cursor-pointer w-full sm:w-auto"
            >
              {devicesList.map((dev) => (
                <option key={dev.id} value={dev.id}>{dev.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button className="bg-emerald-800 text-white hover:bg-emerald-900 transition px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm">
            <i className="bi bi-arrow-left-right"></i> Bandingkan Bulan Lalu
          </button>
          <button className="bg-gray-100 text-gray-700 hover:bg-gray-200 transition px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5">
            <i className="bi bi-filter"></i> Filter Lanjutan
          </button>
        </div>
      </div>

      {/* KPI METRIC CARDS */}
      <MetricCards trendData={trendData} />

      {/* ROW CHARTS 2 (Soil Nutrients NPK Trend Chart with Side Details) */}
      <NPKTrendCard npkData={trendData.npk} npkTab={npkTab} setNpkTab={setNpkTab} />

      {/* AI PREDICTIONS & RECOMMENDATIONS PANEL */}
      <AIInsightCard predictions={trendData.predictions} />

      {/* TABLE SENSOR LOGS */}
      <SensorLogsTable sensorLogs={sensorLogs} handleExportCSV={handleExportCSV} />

    </div>
  );
}

export default Trends;
