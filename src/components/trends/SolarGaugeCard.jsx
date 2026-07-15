function SolarGaugeCard({ summary }) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
      <div>
        <h3 className="text-sm font-bold text-gray-800">Panel Surya</h3>
        <p className="text-xs text-gray-400 font-medium mb-4">Efisiensi Energi Mandiri</p>
      </div>

      {/* SVG Radial Gauge */}
      <div className="relative flex justify-center items-center my-2">
        <svg className="w-32 h-32 transform -rotate-90">
          <circle cx="64" cy="64" r="50" stroke="#f1f5f9" strokeWidth="10" fill="transparent" />
          <circle 
            cx="64" 
            cy="64" 
            r="50" 
            stroke="#10b981" 
            strokeWidth="10" 
            fill="transparent" 
            strokeDasharray={2 * Math.PI * 50} 
            strokeDashoffset={2 * Math.PI * 50 * (1 - summary.solarEfficiency / 100)} 
            strokeLinecap="round"
            className="transition-all duration-1000"
          />
        </svg>
        <div className="absolute text-center">
          <span className="text-2xl font-extrabold text-gray-800 block">{summary.solarEfficiency}%</span>
          <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">Optimal</span>
        </div>
      </div>

      <div className="space-y-2.5 border-t border-gray-100 pt-4 text-xs">
        <div className="flex justify-between items-center">
          <span className="text-gray-400 font-medium">Produksi Hari Ini</span>
          <strong className="text-gray-700 font-bold">{summary.solarProduction}</strong>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-400 font-medium">Konsumsi Alat</span>
          <strong className="text-gray-700 font-bold">{summary.solarConsumption}</strong>
        </div>
        <div className="flex justify-between items-center border-t border-dashed border-gray-100 pt-2 font-semibold">
          <span className="text-gray-700">Surplus Baterai</span>
          <strong className="text-emerald-700 font-extrabold">{summary.solarSurplus}</strong>
        </div>
      </div>
    </div>
  );
}

export default SolarGaugeCard;
