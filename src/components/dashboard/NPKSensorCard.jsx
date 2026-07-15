function NPKSensorCard({ data }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:col-span-7">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
        <div>
          <h5 className="text-sm font-semibold text-gray-600 flex items-center">
            <i className="bi bi-bar-chart-fill text-emerald-600 mr-2 text-base"></i>Nutrisi Tanah (NPK Sensor)
          </h5>
          <span className="text-xs text-gray-400 block mt-1 font-medium">Data Terakhir: Hari ini, 08:30 WIB</span>
        </div>
        <span className="bg-[#0b5924] text-white px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider">
          Status Lahan: {data.npk.status}
        </span>
      </div>

      <div className="space-y-4">
        {/* Nitrogen */}
        <div>
          <div className="flex justify-between items-center text-xs mb-1.5">
            <span className="text-gray-700 font-medium flex items-center">
              <i className="bi bi-dot text-emerald-600 text-xl mr-1 leading-none"></i> Nitrogen (N)
            </span>
            <strong className="text-gray-700 font-bold">{data.npk.nitrogen} mg/kg</strong>
          </div>
          <div className="w-full bg-emerald-50 h-2 rounded-full overflow-hidden">
            <div className="bg-emerald-600 h-full rounded-full transition-all duration-500" style={{ width: `${data.npk.nitrogen}%` }}></div>
          </div>
        </div>

        {/* Phosphor */}
        <div>
          <div className="flex justify-between items-center text-xs mb-1.5">
            <span className="text-gray-700 font-medium flex items-center">
              <i className="bi bi-dot text-emerald-600 text-xl mr-1 leading-none"></i> Fosfor (P)
            </span>
            <strong className="text-gray-700 font-bold">{data.npk.phosphor} mg/kg</strong>
          </div>
          <div className="w-full bg-emerald-50 h-2 rounded-full overflow-hidden">
            <div className="bg-emerald-600 h-full rounded-full transition-all duration-500" style={{ width: `${data.npk.phosphor}%` }}></div>
          </div>
        </div>

        {/* Potassium */}
        <div>
          <div className="flex justify-between items-center text-xs mb-1.5">
            <span className="text-gray-700 font-medium flex items-center">
              <i className="bi bi-dot text-amber-500 text-xl mr-1 leading-none"></i> Kalium (K)
            </span>
            <strong className="text-gray-700 font-bold">{data.npk.potassium} mg/kg</strong>
          </div>
          <div className="w-full bg-emerald-50 h-2 rounded-full overflow-hidden">
            <div className="bg-amber-500 h-full rounded-full transition-all duration-500" style={{ width: `${data.npk.potassium}%` }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NPKSensorCard;
