import { useState, useEffect } from 'react';
import { getMonitoring, updateControl } from '../services/monitoringService';
import DeviceStatusCards from '../components/dashboard/DeviceStatusCards';
import NPKSensorCard from '../components/dashboard/NPKSensorCard';
import DeviceMapCard from '../components/dashboard/DeviceMapCard';
import ManualControlPanel from '../components/dashboard/ManualControlPanel';

const defaultData = {
  plts: {
    voltage: 0.0,
    current: 0.0,
    battery: 0
  },
  rain: {
    status: "-",
    detection: "-",
    intensity: 0
  },
  lightTrap: {
    active: false,
    triggerMode: "-",
    duration: 0
  },
  npk: {
    nitrogen: 0,
    phosphor: 0,
    potassium: 0,
    status: "-"
  },
  control: {
    autoMode: false,
    manualActive: false
  }
};

function Dashboard() {
  const [data, setData] = useState(defaultData);
  const [lastUpdate, setLastUpdate] = useState("Menghubungkan...");
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchData = async () => {
    try {
      const val = await getMonitoring();
      setData(val);
      const now = new Date();
      setLastUpdate(now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + " WIB");
    } catch (error) {
      console.warn("Backend read error, using mock/default data:", error);
      setData(defaultData);
      setLastUpdate("Offline Mode");
    }
  };

  useEffect(() => {
    fetchData(); // Load data immediately
    const interval = setInterval(fetchData, 3000); // Polling every 3 seconds

    return () => clearInterval(interval);
  }, []);

  const handleAutoModeChange = (e) => {
    const checked = e.target.checked;
    updateControl({ autoMode: checked })
      .then(result => {
        if (result.success) {
          setData(prev => ({
            ...prev,
            control: { ...prev.control, autoMode: checked }
          }));
        }
      })
      .catch(err => console.warn("Failed to update autoMode:", err));
  };

  const handleManualModeToggle = () => {
    const nextManualActive = !data.control.manualActive;
    updateControl({ manualActive: nextManualActive })
      .then(result => {
        if (result.success) {
          setData(prev => ({
            ...prev,
            control: { ...prev.control, manualActive: nextManualActive }
          }));
        }
      })
      .catch(err => console.warn("Failed to update manualActive:", err));
  };

  const handleRefresh = async () => {
    setIsUpdating(true);
    await fetchData();
    setIsUpdating(false);
  };

  return (
    <div className="space-y-6">
      {/* Heading Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-emerald-900 leading-tight">Ringkasan Sawah</h1>
          <p className="text-sm text-gray-500 flex items-center mt-1">
            <i className="bi bi-geo-alt-fill text-emerald-600 mr-1.5"></i>
            Demplot Desa Sajen, Pacet - Lokasi Strategis Elevasi 600mdpl
          </p>
        </div>
        <button 
          onClick={handleRefresh}
          className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition rounded-full flex items-center gap-2 py-2 px-4 text-xs font-semibold"
        >
          <i className={`bi bi-arrow-repeat text-sm ${isUpdating ? 'animate-spin' : ''}`}></i>
          Update: {lastUpdate}
        </button>
      </div>

      {/* Cards Row 1 (PLTS, Hujan, Light Trap) */}
      <DeviceStatusCards data={data} />

      {/* Cards Row 2 (NPK & Tiang Map) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <NPKSensorCard data={data} />
        <DeviceMapCard />
      </div>

      {/* Bottom Banner: Panel Kendali Manual */}
      <ManualControlPanel 
        autoMode={data.control.autoMode}
        manualActive={data.control.manualActive}
        handleAutoModeChange={handleAutoModeChange}
        handleManualModeToggle={handleManualModeToggle}
      />
    </div>
  );
}

export default Dashboard;
