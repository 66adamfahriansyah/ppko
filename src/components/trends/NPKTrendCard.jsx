import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

function NPKTrendCard({ npkData, npkTab, setNpkTab }) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
        <div>
          <h3 className="text-sm font-bold text-gray-800">Trend Nutrisi Tanah (NPK)</h3>
          <p className="text-xs text-gray-400 font-medium">Monitoring kestabilan unsur hara makro selama 6 bulan terakhir</p>
        </div>

        {/* TAB CONTROL */}
        <div className="flex bg-gray-100 p-0.5 rounded-xl border border-gray-200 text-[10px] font-bold">
          <button 
            onClick={() => setNpkTab('all')} 
            className={`px-3 py-1.5 rounded-lg transition-all ${npkTab === 'all' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
          >
            Semua
          </button>
          <button 
            onClick={() => setNpkTab('nitrogen')} 
            className={`px-3 py-1.5 rounded-lg transition-all ${npkTab === 'nitrogen' ? 'bg-white text-emerald-800 shadow-sm' : 'text-gray-500 hover:text-emerald-700'}`}
          >
            Nitrogen
          </button>
          <button 
            onClick={() => setNpkTab('phosphor')} 
            className={`px-3 py-1.5 rounded-lg transition-all ${npkTab === 'phosphor' ? 'bg-white text-emerald-800 shadow-sm' : 'text-gray-500 hover:text-emerald-700'}`}
          >
            Fosfor
          </button>
          <button 
            onClick={() => setNpkTab('potassium')} 
            className={`px-3 py-1.5 rounded-lg transition-all ${npkTab === 'potassium' ? 'bg-white text-amber-800 shadow-sm' : 'text-gray-500 hover:text-amber-700'}`}
          >
            Kalium
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* NPK Line Chart */}
        <div className="h-64 lg:col-span-8 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={npkData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
              <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
              
              {(npkTab === 'all' || npkTab === 'nitrogen') && (
                <Line type="monotone" dataKey="nitrogen" stroke="#2e7d32" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Nitrogen (N)" />
              )}
              {(npkTab === 'all' || npkTab === 'phosphor') && (
                <Line type="monotone" dataKey="phosphor" stroke="#81c784" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Fosfor (P)" />
              )}
              {(npkTab === 'all' || npkTab === 'potassium') && (
                <Line type="monotone" dataKey="potassium" stroke="#ffa000" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Kalium (K)" />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* NPK Status side detail cards */}
        <div className="lg:col-span-4 space-y-3">
          <div className="bg-[#f8faf9] p-3 rounded-xl border border-gray-100 flex items-start border-l-4 border-l-[#2e7d32]">
            <div className="flex-1">
              <span className="text-[10px] font-bold text-gray-400 block uppercase">Nitrogen (N)</span>
              <span className="text-xs font-bold text-gray-800 block mt-0.5">Optimal / High</span>
              <p className="text-[10px] text-gray-400 font-medium">Sangat baik untuk mendukung fase vegetatif tanaman padi.</p>
            </div>
          </div>
          <div className="bg-[#f8faf9] p-3 rounded-xl border border-gray-100 flex items-start border-l-4 border-l-[#81c784]">
            <div className="flex-1">
              <span className="text-[10px] font-bold text-gray-400 block uppercase">Fosfor (P)</span>
              <span className="text-xs font-bold text-gray-800 block mt-0.5">Cukup / Medium</span>
              <p className="text-[10px] text-gray-400 font-medium">Kadar stabil dan cukup untuk memperkuat perkembangan akar padi.</p>
            </div>
          </div>
          <div className="bg-[#fcfaf7] p-3 rounded-xl border border-gray-100 flex items-start border-l-4 border-l-[#ffa000]">
            <div className="flex-1">
              <span className="text-[10px] font-bold text-gray-400 block uppercase">Kalium (K)</span>
              <span className="text-xs font-bold text-gray-800 block mt-0.5">Perlu Pengawasan</span>
              <p className="text-[10px] text-gray-400 font-medium">Mulai menurun, butuh pengawasan saat masuk fase pembuahan padi.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NPKTrendCard;
