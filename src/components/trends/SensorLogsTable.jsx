function SensorLogsTable({ sensorLogs, handleExportCSV }) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-bold text-gray-800">Log Aktivitas Sensor</h3>
        <button 
          onClick={handleExportCSV}
          className="text-emerald-700 hover:text-emerald-950 font-bold text-xs flex items-center gap-1.5"
        >
          Ekspor CSV <i className="bi bi-download"></i>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-gray-100 text-gray-400 uppercase font-bold tracking-wider">
              <th className="py-3 px-2">ID Sensor</th>
              <th className="py-3 px-2">Waktu</th>
              <th className="py-3 px-2">Tipe</th>
              <th className="py-3 px-2 text-center">Status</th>
              <th className="py-3 px-2 text-right">Nilai</th>
            </tr>
          </thead>
          <tbody>
            {sensorLogs.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-8 text-center text-gray-400 font-semibold">
                  <i className="bi bi-cpu text-lg block mb-1 text-gray-300"></i>
                  Belum ada data sensor masuk
                </td>
              </tr>
            ) : (
              sensorLogs.map((log, index) => (
                <tr key={index} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                  <td className="py-3.5 px-2 font-semibold text-gray-600">{log.id}</td>
                  <td className="py-3.5 px-2 text-gray-500 font-medium">{log.time}</td>
                  <td className="py-3.5 px-2 text-gray-700 font-medium">{log.type}</td>
                  <td className="py-3.5 px-2 text-center">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                      log.status === 'KRITIS' ? 'bg-red-50 text-red-600 border border-red-100' :
                      log.status === 'NORMAL' ? 'bg-gray-50 text-gray-600 border border-gray-100' :
                      'bg-emerald-50 text-emerald-700 border border-emerald-100'
                    }`}>
                      {log.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-2 text-right font-bold text-gray-800">{log.value}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SensorLogsTable;
