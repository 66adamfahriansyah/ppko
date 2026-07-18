function MetricCards({ trendData }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Reduksi Bahan Kimia */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Reduksi Bahan Kimia</span>
            <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full flex items-center gap-0.5">
              <i className="bi bi-arrow-down-short"></i> {trendData.summary.chemicalChange}
            </span>
          </div>
          <div className="flex items-baseline space-x-2 my-2">
            <span className="text-3xl font-extrabold text-gray-800">{trendData.summary.chemicalReduction}</span>
            <span className="text-xs text-gray-400 font-medium">pestisida</span>
          </div>
        </div>
        <div className="mt-3">
          <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden mb-1">
            <div className="bg-blue-600 h-full" style={{ width: '65%' }}></div>
          </div>
          <span className="text-[10px] text-gray-400 font-semibold block">Hemat biaya Rp 4.2jt bulan ini</span>
        </div>
      </div>

      {/* Kesehatan Tanah */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Rata-rata Kesehatan Tanah</span>
            <span className="text-[10px] font-bold text-emerald-800 bg-[#e8f5e9] px-2 py-0.5 rounded-full flex items-center gap-0.5">
              <i className="bi bi-check-circle-fill text-[8px] mr-1"></i> Stabil
            </span>
          </div>
          <div className="flex items-baseline space-x-2 my-2">
            <span className="text-3xl font-extrabold text-gray-800">{trendData.summary.soilHealth}/100</span>
          </div>
        </div>
        <div className="mt-3">
          <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden mb-1">
            <div className="bg-emerald-800 h-full" style={{ width: `${trendData.summary.soilHealth}%` }}></div>
          </div>
          <span className="text-[10px] text-gray-400 font-semibold block">Kandungan NPK Optimal</span>
        </div>
      </div>
    </div>
  );
}

export default MetricCards;
