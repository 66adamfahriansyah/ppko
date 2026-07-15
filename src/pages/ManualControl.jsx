import { useState } from 'react';
import { useDeviceData } from '../hooks/useDeviceData';

function ManualControl() {
  const { logs, addManualLog } = useDeviceData();

  // Form states
  const [tanggal, setTanggal] = useState('2026-06-04');
  const [lokasi, setLokasi] = useState('Tiang A-01 (Sektor Utara)');
  const [jumlahHama, setJumlahHama] = useState('154');
  const [hamaTipe, setHamaTipe] = useState('Ekor Ngengat');
  const [pestisidaPersen, setPestisidaPersen] = useState('40');
  const [catatan, setCatatan] = useState('');
  
  // App alerts/notifications
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showModal, setShowModal] = useState(false);

  // Form submit handler
  const handleSave = (e) => {
    e.preventDefault();
    if (!tanggal || !jumlahHama || !pestisidaPersen) {
      alert('Mohon isi semua data yang diperlukan.');
      return;
    }

    const newLog = {
      tanggal,
      lokasi,
      hama: `${jumlahHama} ${hamaTipe}`,
      pestisida: `${pestisidaPersen}%`,
      catatan: catatan || '-'
    };

    addManualLog(newLog);
    
    // Trigger toast notification
    setToastMessage(`Data Logbook untuk ${lokasi} berhasil disimpan ke sistem!`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);

    // Optional reset
    setCatatan('');
  };

  // Format date helper to Indonesian local string
  const formatIndoDate = (dateStr) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans relative">
      
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-800 text-white px-5 py-4 rounded-2xl shadow-2xl border border-emerald-700 flex items-center gap-3 animate-bounce">
          <div className="w-8 h-8 bg-emerald-950/40 rounded-full flex items-center justify-center">
            <i className="bi bi-check-circle-fill text-lg"></i>
          </div>
          <div>
            <p className="text-xs font-bold">Data Disimpan!</p>
            <p className="text-[10px] text-emerald-100">{toastMessage}</p>
          </div>
        </div>
      )}

      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-l-4 border-[#0b5924] pl-4 mb-2">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-gray-800 uppercase tracking-tight">
            INPUT TANGKAPAN HAMA & PENGGUNAAN PESTISIDA
          </h1>
          <p className="text-sm text-gray-500 font-medium mt-1">
            Sistem Pemantauan Hama Bawang Merah Terintegrasi
          </p>
        </div>
        <div className="bg-[#e8f5e9] text-[#0b5924] px-4 py-2.5 rounded-xl text-xs font-bold border border-emerald-100 flex items-center gap-2 shadow-sm whitespace-nowrap">
          <i className="bi bi-calendar3"></i> {formatIndoDate(tanggal)}
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: FORM */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-150 h-full">
            <div className="flex items-center gap-2 text-[#0b5924] font-bold text-lg mb-6">
              <i className="bi bi-clipboard2-data"></i>
              <h2>Entri Data Lapangan</h2>
            </div>
            
            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Date Input with Native Calendar */}
                <div>
                  <label className="text-[11px] font-bold text-gray-600 mb-2 block">Tanggal Pengamatan</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 pointer-events-none">
                      <i className="bi bi-calendar-date text-sm"></i>
                    </span>
                    <input 
                      type="date" 
                      value={tanggal}
                      onChange={(e) => setTanggal(e.target.value)}
                      className="w-full bg-[#f8faf9] border border-gray-200 rounded-xl py-3 pl-10 pr-3 text-sm font-semibold text-gray-700 outline-none focus:border-emerald-600 transition cursor-pointer" 
                    />
                  </div>
                </div>

                {/* Location Select */}
                <div>
                  <label className="text-[11px] font-bold text-gray-600 mb-2 block">Pilih Lokasi Tiang</label>
                  <select 
                    value={lokasi}
                    onChange={(e) => setLokasi(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl py-3 px-3 text-sm font-semibold text-gray-700 outline-none focus:border-emerald-600 transition cursor-pointer appearance-none bg-no-repeat bg-[right_1rem_center] bg-[length:1em_1em] [background-image:url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2224%22%20height%3D%2224%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M7%2010l5%205%205-5z%22%20fill%3D%22%236b7280%22%2F%3E%3C%2Fsvg%3E')]"
                  >
                    <option value="Tiang A-01 (Sektor Utara)">Tiang A-01 (Sektor Utara)</option>
                    <option value="Tiang A-02 (Sektor Timur)">Tiang A-02 (Sektor Timur)</option>
                    <option value="Tiang B-01 (Sektor Selatan)">Tiang B-01 (Sektor Selatan)</option>
                    <option value="Tiang B-02 (Sektor Barat)">Tiang B-02 (Sektor Barat)</option>
                  </select>
                </div>
              </div>
              
              {/* Bug Count Input Group */}
              <div>
                 <label className="text-[11px] font-bold text-gray-600 mb-2 flex items-center gap-1.5">
                   Jumlah Hama Terperangkap di Baskom <i className="bi bi-info-circle text-gray-400"></i>
                 </label>
                 <div className="flex gap-2">
                   <div className="relative flex-1">
                     <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[#0b5924]">
                        <i className="bi bi-bug text-base"></i>
                     </span>
                     <input 
                      type="number" 
                      placeholder="154"
                      value={jumlahHama}
                      onChange={(e) => setJumlahHama(e.target.value)}
                      className="w-full bg-white border border-emerald-200 rounded-xl py-3 pl-10 pr-3 text-sm font-bold text-gray-800 outline-none focus:border-[#0b5924] transition shadow-sm" 
                     />
                   </div>
                   <select 
                     value={hamaTipe}
                     onChange={(e) => setHamaTipe(e.target.value)}
                     className="bg-[#f8faf9] border border-gray-200 rounded-xl px-3 py-3 text-xs font-bold text-gray-700 outline-none cursor-pointer"
                   >
                     <option value="Ekor Ngengat">Ekor Ngengat</option>
                     <option value="Ulat Grayak">Ulat Grayak</option>
                     <option value="Hama Wereng">Hama Wereng</option>
                     <option value="Kepik Hijau">Kepik Hijau</option>
                   </select>
                 </div>
              </div>

              {/* Chemical Reduction Input */}
              <div>
                 <label className="text-[11px] font-bold text-gray-600 mb-2 block">
                   Pengurangan Penggunaan Semprotan Kimia Mingguan
                 </label>
                 <div className="relative flex items-center">
                   <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[#0b5924] font-bold text-base">
                      %
                   </span>
                   <input 
                    type="number" 
                    placeholder="40"
                    value={pestisidaPersen}
                    onChange={(e) => setPestisidaPersen(e.target.value)}
                    className="w-full bg-white border border-emerald-200 rounded-xl py-3 pl-10 pr-24 text-sm font-bold text-gray-800 outline-none focus:border-[#0b5924] transition shadow-sm" 
                   />
                   <span className={`absolute right-2 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wider ${
                     parseInt(pestisidaPersen) >= 30 ? 'bg-[#e8f5e9] text-[#0b5924]' : 'bg-amber-50 text-amber-700'
                   }`}>
                     {parseInt(pestisidaPersen) >= 30 ? 'EFISIEN' : 'MODERAT'}
                   </span>
                 </div>
              </div>
              
              {/* Notes Textarea */}
              <div>
                 <label className="text-[11px] font-bold text-gray-600 mb-2 block">
                   Catatan Kondisi Tanaman Bawang Merah
                 </label>
                 <textarea 
                  rows="4" 
                  value={catatan}
                  onChange={(e) => setCatatan(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl p-3.5 text-sm font-medium text-gray-600 outline-none focus:border-[#0b5924] transition resize-none leading-relaxed" 
                  placeholder="Deskripsikan pertumbuhan, warna daun, atau anomali lainnya..."
                 ></textarea>
              </div>
              
              {/* Submit Button */}
              <button 
                type="submit" 
                className="w-full bg-[#0b5924] hover:bg-[#073c18] text-white py-3.5 rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer"
              >
                <i className="bi bi-save"></i> Simpan Data Logbook
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT COLUMN: WIDGETS */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Graph Widget */}
          <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-150">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-sm font-bold text-gray-800">Grafik Tren Efektivitas Alat</h3>
                <p className="text-[10px] text-gray-400 font-medium mt-0.5">Populasi Hama (3 Minggu Terakhir)</p>
              </div>
              <div className="w-8 h-8 bg-emerald-50 rounded-full flex items-center justify-center text-[#0b5924]">
                <i className="bi bi-graph-up-arrow"></i>
              </div>
            </div>
            
            {/* SVG Trend Line */}
            <div className="h-32 w-full flex flex-col justify-end relative mb-5">
              <svg width="100%" height="100%" viewBox="0 0 100 60" preserveAspectRatio="none" className="absolute top-0 left-0">
                <path 
                  d="M 15 10 Q 50 30 85 55" 
                  fill="none" 
                  stroke="#0b5924" 
                  strokeWidth="3.5" 
                  strokeDasharray="6 6" 
                  strokeLinecap="round"
                />
              </svg>
              {/* X axis labels */}
              <div className="w-full flex justify-between text-[10px] text-gray-400 font-bold border-t border-gray-100 pt-2 z-10">
                <span className="w-1/3 text-center pl-2">W1</span>
                <span className="w-1/3 text-center">W2</span>
                <span className="w-1/3 text-center pr-2">W3</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center bg-[#f8faf9] p-3.5 rounded-2xl border border-emerald-50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-white border border-gray-100 rounded-full flex items-center justify-center text-emerald-600 shadow-sm">
                  <i className="bi bi-graph-down-arrow"></i>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 font-medium">Penurunan Populasi</p>
                  <p className="text-xs font-black text-gray-800 mt-0.5">-81.1% Total</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setShowModal(true)}
                className="text-[10px] font-bold text-[#0b5924] hover:underline cursor-pointer"
              >
                Detail Laporan
              </button>
            </div>
          </div>
          
          {/* Alert Widget */}
          <div className="bg-[#115e29] text-white p-5 rounded-3xl shadow-md flex gap-4 items-center">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl flex-shrink-0 shadow-inner">
              <i className="bi bi-shield-check"></i>
            </div>
            <div>
              <h3 className="font-bold text-[13px] mb-1">Populasi Ulat Grayak Terkendali!</h3>
              <p className="text-[10.5px] text-emerald-50/90 leading-relaxed font-medium">
                Intervensi ebio-Sajen berhasil menekan populasi di bawah ambang ekonomi (85 ekor/malam).
              </p>
            </div>
          </div>
          
          {/* Healthy Card */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-3xl border border-gray-150 flex flex-col justify-center items-center text-center shadow-sm">
              <div className="text-[#a16207] text-2xl mb-1.5">
                <i className="bi bi-flower1"></i>
              </div>
              <h3 className="font-black text-gray-800 text-sm">Healthy</h3>
              <p className="text-[8.5px] text-gray-400 uppercase font-bold tracking-widest mt-0.5">STATUS TANAMAN</p>
            </div>
            <div className="bg-white p-2 rounded-3xl border border-gray-150 shadow-sm">
              <div className="w-full h-full min-h-[90px] bg-emerald-50 rounded-2xl overflow-hidden relative border border-emerald-100">
                 <img 
                   src="https://images.unsplash.com/photo-1592494804071-faea15d93a8a?q=80&w=200&auto=format&fit=crop" 
                   alt="Tanaman Bawang" 
                   className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity" 
                 />
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* REPORT DETAIL MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl p-6 shadow-2xl space-y-4 animate-scale-up">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2 text-[#0b5924]">
                <i className="bi bi-journals text-xl"></i>
                <h3 className="font-bold text-base text-gray-800">Riwayat Pengamatan & Logbook</h3>
              </div>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 text-xl cursor-pointer"
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            <div className="overflow-x-auto max-h-96">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-gray-150 text-gray-400 uppercase font-bold tracking-wider">
                    <th className="py-2.5 px-2">Tanggal</th>
                    <th className="py-2.5 px-2">Lokasi Tiang</th>
                    <th className="py-2.5 px-2">Jumlah Hama</th>
                    <th className="py-2.5 px-2">Reduksi Kimia</th>
                    <th className="py-2.5 px-2">Catatan</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((item, idx) => (
                    <tr key={idx} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                      <td className="py-3 px-2 font-bold text-gray-600">{formatIndoDate(item.tanggal)}</td>
                      <td className="py-3 px-2 text-gray-500 font-medium">{item.lokasi}</td>
                      <td className="py-3 px-2 text-emerald-700 font-bold">{item.hama}</td>
                      <td className="py-3 px-2 font-bold text-gray-800">{item.pestisida}</td>
                      <td className="py-3 px-2 text-gray-500 font-medium italic">{item.catatan}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="text-right border-t border-gray-100 pt-3">
              <button 
                onClick={() => setShowModal(false)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-4 py-2 rounded-xl text-xs cursor-pointer transition"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default ManualControl;
