function DeviceMapCard() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:col-span-5 flex flex-col justify-between">
      <h5 className="text-sm font-semibold text-gray-600 flex items-center mb-4">
        <i className="bi bi-map-fill text-emerald-600 mr-2 text-base"></i>Peta Sebaran Tiang
      </h5>
      
      {/* Graphical Network Representation */}
      <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 flex justify-around items-center h-40 relative">
        
        {/* Tiang 1 */}
        <div className="flex flex-col items-center z-10">
          <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-md mb-2 text-base">
            <i className="bi bi-broadcast"></i>
          </div>
          <span className="text-[10px] font-bold bg-emerald-600 text-white px-2 py-0.5 rounded-full">Tiang 1 [ON]</span>
        </div>

        {/* Line Connection */}
        <div className="flex-1 border-t-2 border-dashed border-emerald-200 mx-[-12px]"></div>

        {/* Main Station (Tiang 3) */}
        <div className="flex flex-col items-center z-10 relative">
          <div className="w-14 h-14 rounded-full bg-[#0b5924] text-white flex items-center justify-center shadow-md mb-2 text-lg relative">
            <i className="bi bi-diagram-3-fill"></i>
            <span className="absolute -top-1 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-[8px] font-bold px-1 rounded">MAIN</span>
          </div>
          <span className="text-[10px] font-bold bg-gray-900 text-white px-2 py-0.5 rounded-full">Tiang 3 [OFF]</span>
        </div>

        {/* Line Connection */}
        <div className="flex-1 border-t-2 border-dashed border-emerald-200 mx-[-12px]"></div>

        {/* Tiang 2 */}
        <div className="flex flex-col items-center z-10">
          <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-md mb-2 text-base">
            <i className="bi bi-broadcast"></i>
          </div>
          <span className="text-[10px] font-bold bg-emerald-600 text-white px-2 py-0.5 rounded-full">Tiang 2 [ON]</span>
        </div>

      </div>
    </div>
  );
}

export default DeviceMapCard;
