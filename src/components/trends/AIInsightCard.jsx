function AIInsightCard({ predictions }) {
  return (
    <div className="bg-[#0b5924] text-white p-6 rounded-3xl shadow-md space-y-4">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-white text-emerald-800 rounded-full flex items-center justify-center text-xl">
          <i className="bi bi-cpu-fill"></i>
        </div>
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider">Prediksi & Rekomendasi Pintar (AI Insight)</h4>
          <p className="text-xs text-emerald-100 mt-0.5">Analisis tren otomatis berdasarkan data sensor sawah demplot Sajen</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-medium mt-2">
        <div className="bg-white/10 p-4 rounded-2xl space-y-2 border border-white/5">
          <span className="text-[10px] text-emerald-200 uppercase font-bold tracking-wider block">1. SOLAR PANEL & BATERAI</span>
          <p className="leading-relaxed text-emerald-50">{predictions.batteryDrop}</p>
        </div>
        <div className="bg-white/10 p-4 rounded-2xl space-y-2 border border-white/5">
          <span className="text-[10px] text-emerald-200 uppercase font-bold tracking-wider block">2. SIKLUS HAMA PERANGKAP</span>
          <p className="leading-relaxed text-emerald-50">{predictions.pestPeak}</p>
        </div>
        <div className="bg-white/10 p-4 rounded-2xl space-y-2 border border-white/5">
          <span className="text-[10px] text-emerald-200 uppercase font-bold tracking-wider block">3. KESUBURAN TANAH NPK</span>
          <p className="leading-relaxed text-emerald-50">{predictions.soilAdvice}</p>
        </div>
      </div>
    </div>
  );
}

export default AIInsightCard;
