function DeviceStatusCards({ data, isLoaded }) {
  // Pengecekan apakah data dari MQTT sudah masuk (tidak lagi bernilai default '-' atau 'Menunggu')
  const hasRainData = isLoaded && data.rain.status !== '-' && data.rain.status !== 'Menunggu';
  const hasLightTrapData = isLoaded && data.lightTrap.triggerMode !== '-' && data.lightTrap.triggerMode !== 'Menunggu';

  const rainStatus = hasRainData ? data.rain.status : "Menunggu data";
  const rainDetection = hasRainData ? data.rain.detection : "Menunggu data";
  const rainIntensity = hasRainData ? data.rain.intensity : 0;
  
  const lightTrapStatusText = hasLightTrapData 
    ? (data.lightTrap.active ? `NYALA (${data.lightTrap.triggerMode})` : 'MATI') 
    : 'Menunggu data';
  const lightTrapTrigger = hasLightTrapData ? data.lightTrap.triggerMode : "Menunggu data";
  const lightTrapDurationText = hasLightTrapData ? `${data.lightTrap.duration} Jam` : "Menunggu data";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Rain Sensor Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between min-h-[180px]">
        <div>
          <div className="flex justify-between items-center mb-4">
            <h5 className="text-sm font-semibold text-gray-600 flex items-center">
              <i className="bi bi-cloud-rain-heavy-fill text-emerald-600 mr-2 text-base"></i>Sensor Air Hujan
            </h5>
            <i className={`text-base ${isLoaded && data.rain.detection === 'Hujan' ? 'bi bi-cloud-rain-fill text-blue-500' : 'bi bi-sun-fill text-amber-500'}`}></i>
          </div>

          <div className="grid grid-cols-2 gap-4 py-2 border-b border-gray-100 mb-4">
            <div>
              <span className="text-xs text-gray-400 block font-medium">STATUS</span>
              <strong className="text-base font-bold text-gray-800">{rainStatus}</strong>
            </div>
            <div className="pl-4 border-l border-gray-100">
              <span className="text-xs text-gray-400 block font-medium">DETEKSI</span>
              <strong className="text-base font-bold text-gray-800">{rainDetection}</strong>
            </div>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center text-xs mb-1.5">
            <span className="text-gray-400 font-medium">Tingkat Curah Hujan</span>
            <strong className="text-gray-700 font-bold">{hasRainData ? `${rainIntensity}%` : 'Menunggu data'}</strong>
          </div>
          <div className="w-full bg-emerald-50 h-2 rounded-full overflow-hidden">
            <div className="bg-blue-500 h-full rounded-full transition-all duration-500" style={{ width: `${rainIntensity}%` }}></div>
          </div>
        </div>
      </div>

      {/* Light Trap Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between min-h-[180px]">
        <div>
          <div className="flex justify-between items-center mb-4">
            <h5 className="text-sm font-semibold text-gray-600 flex items-center">
              <i className="bi bi-bug-fill text-emerald-600 mr-2 text-base"></i>Status Light Trap
            </h5>
            <span className={`w-2 h-2 rounded-full ${isLoaded && data.lightTrap.active ? 'bg-emerald-600 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-red-500'}`}></span>
          </div>

          <div className="flex items-center py-2 mb-4">
            <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center mr-4 text-emerald-700 text-lg">
              <i className="bi bi-lightning-charge-fill"></i>
            </div>
            <div>
              <strong className="text-base font-bold text-gray-800 block leading-tight">{lightTrapStatusText}</strong>
              <span className="text-xs text-gray-400 font-medium">Pemicu: {lightTrapTrigger}</span>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-3 flex justify-between items-center text-xs">
          <span className="text-gray-400 font-medium">Durasi Aktif</span>
          <strong className="text-gray-700 font-bold">{lightTrapDurationText}</strong>
        </div>
      </div>
    </div>
  );
}

export default DeviceStatusCards;
