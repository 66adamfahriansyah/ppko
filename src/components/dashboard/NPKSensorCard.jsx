function NPKSensorCard({ data, isLoaded }) {
  // Pengecekan apakah data dari MQTT sudah masuk (tidak lagi bernilai default '-' atau 'Menunggu')
  const hasNpkData = isLoaded && data.npk.status !== '-' && data.npk.status !== 'Menunggu' && (data.npk.nitrogen > 0 || data.npk.phosphor > 0 || data.npk.potassium > 0);

  const statusLahan = hasNpkData ? data.npk.status : "Menunggu data";
  const nitrogen = hasNpkData ? `${data.npk.nitrogen} mg/kg` : "Menunggu data";
  const nitrogenPct = hasNpkData ? data.npk.nitrogen : 0;
  const phosphor = hasNpkData ? `${data.npk.phosphor} mg/kg` : "Menunggu data";
  const phosphorPct = hasNpkData ? data.npk.phosphor : 0;
  const potassium = hasNpkData ? `${data.npk.potassium} mg/kg` : "Menunggu data";
  const potassiumPct = hasNpkData ? data.npk.potassium : 0;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:col-span-7">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
        <div>
          <h5 className="text-sm font-semibold text-gray-600 flex items-center">
            <i className="bi bi-bar-chart-fill text-emerald-600 mr-2 text-base"></i>Nutrisi Tanah (NPK Sensor)
          </h5>
          <span className="text-xs text-gray-400 block mt-1 font-medium">
            {isLoaded ? "Data Terakhir: Hari ini" : "Menghubungkan sensor..."}
          </span>
        </div>
        <span className="bg-[#0b5924] text-white px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider">
          Status Lahan: {statusLahan}
        </span>
      </div>

      <div className="space-y-4">
        {/* Nitrogen */}
        <div>
          <div className="flex justify-between items-center text-xs mb-1.5">
            <span className="text-gray-700 font-medium flex items-center">
              <i className="bi bi-dot text-emerald-600 text-xl mr-1 leading-none"></i> Nitrogen (N)
            </span>
            <strong className="text-gray-700 font-bold">{nitrogen}</strong>
          </div>
          <div className="w-full bg-emerald-50 h-2 rounded-full overflow-hidden">
            <div className="bg-emerald-600 h-full rounded-full transition-all duration-500" style={{ width: `${nitrogenPct}%` }}></div>
          </div>
        </div>

        {/* Phosphor */}
        <div>
          <div className="flex justify-between items-center text-xs mb-1.5">
            <span className="text-gray-700 font-medium flex items-center">
              <i className="bi bi-dot text-emerald-600 text-xl mr-1 leading-none"></i> Fosfor (P)
            </span>
            <strong className="text-gray-700 font-bold">{phosphor}</strong>
          </div>
          <div className="w-full bg-emerald-50 h-2 rounded-full overflow-hidden">
            <div className="bg-emerald-600 h-full rounded-full transition-all duration-500" style={{ width: `${phosphorPct}%` }}></div>
          </div>
        </div>

        {/* Potassium */}
        <div>
          <div className="flex justify-between items-center text-xs mb-1.5">
            <span className="text-gray-700 font-medium flex items-center">
              <i className="bi bi-dot text-amber-500 text-xl mr-1 leading-none"></i> Kalium (K)
            </span>
            <strong className="text-gray-700 font-bold">{potassium}</strong>
          </div>
          <div className="w-full bg-emerald-50 h-2 rounded-full overflow-hidden">
            <div className="bg-amber-500 h-full rounded-full transition-all duration-500" style={{ width: `${potassiumPct}%` }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NPKSensorCard;
