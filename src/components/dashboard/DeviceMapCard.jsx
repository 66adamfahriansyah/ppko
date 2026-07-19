function DeviceMapCard() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:col-span-5 flex flex-col justify-between">
      <div className="flex justify-between items-center mb-4">
        <h5 className="text-sm font-semibold text-gray-600 flex items-center">
          <i className="bi bi-map-fill text-emerald-600 mr-2 text-base"></i>Peta Sebaran 4 Tiang Node
        </h5>
        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
          4 Node Active
        </span>
      </div>

      {/* Graphical Network Representation 4 Nodes */}
      <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 flex justify-around items-center h-44 relative">
        
        {/* Node 1 */}
        <div className="flex flex-col items-center z-10">
          <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-sm mb-1.5 text-sm">
            <i className="bi bi-broadcast"></i>
          </div>
          <span className="text-[9px] font-bold bg-emerald-600 text-white px-1.5 py-0.5 rounded-full">Node 1</span>
        </div>

        {/* Line Connection */}
        <div className="flex-1 border-t-2 border-dashed border-emerald-300 mx-[-6px]"></div>

        {/* Node 2 */}
        <div className="flex flex-col items-center z-10">
          <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-sm mb-1.5 text-sm">
            <i className="bi bi-broadcast"></i>
          </div>
          <span className="text-[9px] font-bold bg-emerald-600 text-white px-1.5 py-0.5 rounded-full">Node 2</span>
        </div>

        {/* Line Connection */}
        <div className="flex-1 border-t-2 border-dashed border-emerald-300 mx-[-6px]"></div>

        {/* Node 3 (Main Gateway) */}
        <div className="flex flex-col items-center z-10 relative">
          <div className="w-12 h-12 rounded-full bg-[#0b5924] text-white flex items-center justify-center shadow-md mb-1.5 text-base relative">
            <i className="bi bi-diagram-3-fill"></i>
            <span className="absolute -top-1 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-[7px] font-bold px-1 rounded">GW</span>
          </div>
          <span className="text-[9px] font-bold bg-gray-900 text-white px-1.5 py-0.5 rounded-full">Node 3</span>
        </div>

        {/* Line Connection */}
        <div className="flex-1 border-t-2 border-dashed border-emerald-300 mx-[-6px]"></div>

        {/* Node 4 */}
        <div className="flex flex-col items-center z-10">
          <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-sm mb-1.5 text-sm">
            <i className="bi bi-broadcast"></i>
          </div>
          <span className="text-[9px] font-bold bg-emerald-600 text-white px-1.5 py-0.5 rounded-full">Node 4</span>
        </div>

      </div>
    </div>
  );
}

export default DeviceMapCard;
