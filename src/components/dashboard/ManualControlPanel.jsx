function ManualControlPanel({ autoMode, manualActive, handleAutoModeChange, handleManualModeToggle }) {
  return (
    <div className="bg-[#0b5924] text-white p-6 rounded-3xl shadow-md">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
        
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 bg-white text-emerald-800 rounded-full flex items-center justify-center flex-shrink-0 text-2xl shadow-sm">
            <i className="bi bi-hand-index-thumb-fill"></i>
          </div>
          <div>
            <h4 className="text-lg font-bold leading-tight">Panel Kendali Manual</h4>
            <p className="text-xs text-emerald-100 mt-0.5">Gunakan mode ini untuk mengabaikan sensor otomatis dan mengaktifkan perangkat secara langsung.</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6 flex-wrap justify-center">
          {/* Auto Mode Switch */}
          <div className="flex items-center space-x-3">
            <span className="text-[10px] font-bold text-emerald-100 text-right leading-tight">
              Mode<br/>Otomatis<br/>Aktif
            </span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={autoMode}
                onChange={handleAutoModeChange}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-emerald-800/60 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-white peer-checked:after:bg-[#0b5924]"></div>
            </label>
          </div>

          {/* Toggle Button */}
          <button 
            onClick={handleManualModeToggle}
            className={`px-5 py-3.5 text-xs font-bold rounded-xl text-uppercase tracking-wider transition-all duration-200 ${manualActive ? 'bg-white text-[#0b5924]' : 'border-2 border-[#8edc9c] text-white hover:bg-white hover:text-[#0b5924]'}`}
          >
            {manualActive ? 'Nonaktifkan Mode Manual' : 'Aktifkan Mode Manual'}
          </button>
        </div>

      </div>
    </div>
  );
}

export default ManualControlPanel;
