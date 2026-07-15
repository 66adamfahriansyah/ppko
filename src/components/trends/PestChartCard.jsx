import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

function PestChartCard({ pestsData }) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 lg:col-span-2">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-sm font-bold text-gray-800">Populasi Hama & Efektivitas</h3>
          <p className="text-xs text-gray-400 font-medium">Data historis harian dari sensor ebio-Sajen</p>
        </div>
        <div className="flex items-center gap-3 text-[10px] font-semibold text-gray-500">
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span> Terperangkap</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-red-400"></span> Terdeteksi</span>
        </div>
      </div>
      
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={pestsData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <defs>
              <linearGradient id="colorTrap" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorDetect" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f87171" stopOpacity={0.15}/>
                <stop offset="95%" stopColor="#f87171" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
            <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
            <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
            <Area type="monotone" dataKey="terperangkap" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorTrap)" />
            <Area type="monotone" dataKey="terdeteksi" stroke="#f87171" strokeWidth={1.5} strokeDasharray="4 4" fillOpacity={1} fill="url(#colorDetect)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default PestChartCard;
