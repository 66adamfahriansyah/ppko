import { useState, useEffect } from 'react';
import { getCmsData, saveCmsData } from '../utils/cmsHelper';

function CmsAdmin() {
  const [data, setData] = useState(getCmsData());
  const [activeTab, setActiveTab] = useState('hero');
  const [successMsg, setSuccessMsg] = useState('');
  
  // Temp states for Modals/Adding new items
  const [showKomoditasModal, setShowKomoditasModal] = useState(false);
  const [editingKomoditas, setEditingKomoditas] = useState(null);
  const [komForm, setKomForm] = useState({ bulan: '', tonase: '', kualitas: 'Super (Grade A)', luas: '', gambar: '' });

  const [showMarketModal, setShowMarketModal] = useState(false);
  const [editingMarket, setEditingMarket] = useState(null);
  const [marketForm, setMarketForm] = useState({ nama: '', harga: '', satuan: 'kg', deskripsi: '', petani: '', whatsapp: '', gambar: '', status: true });

  const [showContactModal, setShowContactModal] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [contactForm, setContactForm] = useState({ poktan: '', ketua: '', alamat: '', telepon: '' });

  useEffect(() => {
    setData(getCmsData());
  }, []);

  const triggerNotification = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleSaveAll = () => {
    saveCmsData(data);
    triggerNotification('Perubahan CMS berhasil disimpan ke sistem!');
  };

  // --- HERO ---
  const handleHeroChange = (field, val) => {
    setData(prev => ({
      ...prev,
      hero: { ...prev.hero, [field]: val }
    }));
  };

  // --- ABOUT ---
  const handleAboutStoryChange = (val) => {
    setData(prev => ({
      ...prev,
      about: { ...prev.about, cerita: val }
    }));
  };

  // --- KOMODITAS ACTIONS ---
  const openAddKomoditas = () => {
    setEditingKomoditas(null);
    setKomForm({ bulan: '', tonase: '', kualitas: 'Super (Grade A)', luas: '', gambar: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&q=80&w=600' });
    setShowKomoditasModal(true);
  };

  const openEditKomoditas = (item) => {
    setEditingKomoditas(item.id);
    setKomForm({ ...item });
    setShowKomoditasModal(true);
  };

  const handleSaveKomoditas = (e) => {
    e.preventDefault();
    if (editingKomoditas) {
      setData(prev => ({
        ...prev,
        komoditas: prev.komoditas.map(k => k.id === editingKomoditas ? { ...komForm } : k)
      }));
    } else {
      const newItem = { ...komForm, id: Date.now().toString() };
      setData(prev => ({
        ...prev,
        komoditas: [...prev.komoditas, newItem]
      }));
    }
    setShowKomoditasModal(false);
    triggerNotification('Data panen komoditas diperbarui!');
  };

  const handleDeleteKomoditas = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data panen ini?')) {
      setData(prev => ({
        ...prev,
        komoditas: prev.komoditas.filter(k => k.id !== id)
      }));
      triggerNotification('Data panen telah dihapus!');
    }
  };

  // --- MARKETPLACE ACTIONS ---
  const openAddMarket = () => {
    setEditingMarket(null);
    setMarketForm({ nama: '', harga: '', satuan: 'kg', deskripsi: '', petani: '', whatsapp: '628', gambar: 'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&q=80&w=600', status: true });
    setShowMarketModal(true);
  };

  const openEditMarket = (prod) => {
    setEditingMarket(prod.id);
    setMarketForm({ ...prod });
    setShowMarketModal(true);
  };

  const handleSaveMarket = (e) => {
    e.preventDefault();
    if (editingMarket) {
      setData(prev => ({
        ...prev,
        marketplace: prev.marketplace.map(m => m.id === editingMarket ? { ...marketForm } : m)
      }));
    } else {
      const newItem = { ...marketForm, id: Date.now().toString() };
      setData(prev => ({
        ...prev,
        marketplace: [...prev.marketplace, newItem]
      }));
    }
    setShowMarketModal(false);
    triggerNotification('Produk tani diperbarui!');
  };

  const handleDeleteMarket = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus produk ini dari marketplace?')) {
      setData(prev => ({
        ...prev,
        marketplace: prev.marketplace.filter(m => m.id !== id)
      }));
      triggerNotification('Produk telah dihapus!');
    }
  };

  const toggleMarketStatus = (id) => {
    setData(prev => ({
      ...prev,
      marketplace: prev.marketplace.map(m => m.id === id ? { ...m, status: !m.status } : m)
    }));
    triggerNotification('Status tayang produk berhasil diubah!');
  };

  // --- CONTACT ACTIONS ---
  const openAddContact = () => {
    setEditingContact(null);
    setContactForm({ poktan: '', ketua: '', alamat: '', telepon: '628' });
    setShowContactModal(true);
  };

  const openEditContact = (con) => {
    setEditingContact(con.id);
    setContactForm({ ...con });
    setShowContactModal(true);
  };

  const handleSaveContact = (e) => {
    e.preventDefault();
    if (editingContact) {
      setData(prev => ({
        ...prev,
        about: {
          ...prev.about,
          kontak: prev.about.kontak.map(c => c.id === editingContact ? { ...contactForm } : c)
        }
      }));
    } else {
      const newItem = { ...contactForm, id: Date.now().toString() };
      setData(prev => ({
        ...prev,
        about: {
          ...prev.about,
          kontak: [...prev.about.kontak, newItem]
        }
      }));
    }
    setShowContactModal(false);
    triggerNotification('Kontak poktan diperbarui!');
  };

  const handleDeleteContact = (id) => {
    if (window.confirm('Hapus kontak kelompok tani ini?')) {
      setData(prev => ({
        ...prev,
        about: {
          ...prev.about,
          kontak: prev.about.kontak.filter(c => c.id !== id)
        }
      }));
      triggerNotification('Kontak kelompok tani dihapus!');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header CMS */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-emerald-900 leading-tight">Kelola Tampilan Website</h1>
          <p className="text-xs text-gray-500 mt-1">Ubah konten landing page publik (Hero, Hasil Bumi, dan Marketplace) di sini.</p>
        </div>
        
        <button 
          onClick={handleSaveAll}
          className="bg-[#0b5924] hover:bg-[#073c18] text-white py-2.5 px-6 rounded-xl text-xs font-bold transition shadow-sm flex items-center gap-2 cursor-pointer"
        >
          <i className="bi bi-save-fill"></i> Simpan Semua Perubahan
        </button>
      </div>

      {/* Success Banner */}
      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-2xl flex items-center gap-2 animate-pulse">
          <i className="bi bi-check-circle-fill text-lg"></i>
          {successMsg}
        </div>
      )}

      {/* Tabs Selector */}
      <div className="flex bg-white p-1 rounded-2xl border border-gray-150 text-xs font-bold max-w-2xl">
        <button 
          onClick={() => setActiveTab('hero')}
          className={`flex-1 py-3 rounded-xl transition-all ${activeTab === 'hero' ? 'bg-[#0b5924] text-white shadow-sm' : 'text-gray-500 hover:text-[#0b5924]'}`}
        >
          Hero Section
        </button>
        <button 
          onClick={() => setActiveTab('komoditas')}
          className={`flex-1 py-3 rounded-xl transition-all ${activeTab === 'komoditas' ? 'bg-[#0b5924] text-white shadow-sm' : 'text-gray-500 hover:text-[#0b5924]'}`}
        >
          Hasil Panen
        </button>
        <button 
          onClick={() => setActiveTab('marketplace')}
          className={`flex-1 py-3 rounded-xl transition-all ${activeTab === 'marketplace' ? 'bg-[#0b5924] text-white shadow-sm' : 'text-gray-500 hover:text-[#0b5924]'}`}
        >
          Marketplace
        </button>
        <button 
          onClick={() => setActiveTab('about')}
          className={`flex-1 py-3 rounded-xl transition-all ${activeTab === 'about' ? 'bg-[#0b5924] text-white shadow-sm' : 'text-gray-500 hover:text-[#0b5924]'}`}
        >
          Tentang & Kontak
        </button>
      </div>

      {/* TAB CONTENT */}
      <div className="bg-white rounded-3xl border border-gray-150 p-6 md:p-8 shadow-sm">
        
        {/* 1. HERO TAB */}
        {activeTab === 'hero' && (
          <div className="space-y-6 max-w-3xl">
            <h3 className="text-base font-bold text-gray-800 border-b border-gray-100 pb-3">Edit Area Banner Utama</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Judul Utama (Headline)</label>
                <input 
                  type="text" 
                  value={data.hero.title}
                  onChange={(e) => handleHeroChange('title', e.target.value)}
                  className="w-full bg-gray-50 border border-gray-150 rounded-xl py-3 px-4 text-xs outline-none focus:border-[#0b5924] focus:bg-white transition-all font-semibold"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Sub-judul (Sub-headline)</label>
                <textarea 
                  rows="3"
                  value={data.hero.subtitle}
                  onChange={(e) => handleHeroChange('subtitle', e.target.value)}
                  className="w-full bg-gray-50 border border-gray-150 rounded-xl py-3 px-4 text-xs outline-none focus:border-[#0b5924] focus:bg-white transition-all font-medium"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">URL Gambar Latar Belakang (Unsplash/Imgur Link)</label>
                <input 
                  type="text" 
                  value={data.hero.bgImage}
                  onChange={(e) => handleHeroChange('bgImage', e.target.value)}
                  className="w-full bg-gray-50 border border-gray-150 rounded-xl py-3 px-4 text-xs outline-none focus:border-[#0b5924] focus:bg-white transition-all text-blue-600 font-mono"
                />
                {data.hero.bgImage && (
                  <div className="mt-3 relative h-32 rounded-2xl overflow-hidden border border-gray-100 max-w-md">
                    <img src={data.hero.bgImage} alt="Hero Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 2. KOMODITAS TAB */}
        {activeTab === 'komoditas' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-gray-800">Slider Hasil Bumi / Panen</h3>
              <button 
                onClick={openAddKomoditas}
                className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <i className="bi bi-plus-circle"></i> Tambah Data Panen
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.komoditas.map((item) => (
                <div key={item.id} className="border border-gray-100 rounded-3xl overflow-hidden bg-gray-50/50 flex flex-col justify-between p-4">
                  <div className="space-y-3">
                    <img src={item.gambar} alt={item.bulan} className="w-full h-32 object-cover rounded-2xl" />
                    <div>
                      <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full uppercase">{item.kualitas}</span>
                      <h4 className="font-bold text-sm text-gray-800 mt-2">{item.bulan}</h4>
                      <p className="text-xs text-gray-400 mt-1">Tonase: <strong>{item.tonase}</strong> | Luas: <strong>{item.luas}</strong></p>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4 pt-3 border-t border-gray-200/50">
                    <button 
                      onClick={() => openEditKomoditas(item)}
                      className="flex-1 bg-white hover:bg-emerald-50 text-emerald-700 py-2 border border-emerald-100 rounded-xl text-[11px] font-bold transition cursor-pointer"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteKomoditas(item.id)}
                      className="flex-1 bg-white hover:bg-red-50 text-red-600 py-2 border border-red-100 rounded-xl text-[11px] font-bold transition cursor-pointer"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. MARKETPLACE TAB */}
        {activeTab === 'marketplace' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-gray-800">Daftar Produk Dagangan Poktan</h3>
              <button 
                onClick={openAddMarket}
                className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <i className="bi bi-plus-circle"></i> Tambah Dagangan Baru
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.marketplace.map((prod) => (
                <div key={prod.id} className="border border-gray-100 bg-gray-50/50 rounded-3xl p-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="relative">
                      <img src={prod.gambar} alt={prod.nama} className="w-full h-32 object-cover rounded-2xl" />
                      <button 
                        onClick={() => toggleMarketStatus(prod.id)}
                        className={`absolute top-2 right-2 px-2.5 py-1 rounded-lg text-[9px] font-bold text-white shadow-sm ${prod.status ? 'bg-green-600' : 'bg-gray-500'}`}
                      >
                        {prod.status ? 'TAYANG' : 'DRAFT/SEMBUYIKAN'}
                      </button>
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-gray-800">{prod.nama}</h4>
                      <p className="text-xs text-emerald-700 font-bold mt-1">Rp {prod.harga} / {prod.satuan}</p>
                      <p className="text-xs text-gray-400 line-clamp-2 mt-1.5">{prod.deskripsi}</p>
                      <div className="flex items-center text-[10px] text-gray-500 mt-2 font-semibold">
                        <i className="bi bi-person mr-1"></i> {prod.petani}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4 pt-3 border-t border-gray-200/50">
                    <button 
                      onClick={() => openEditMarket(prod)}
                      className="flex-1 bg-white hover:bg-emerald-50 text-emerald-700 py-2 border border-emerald-100 rounded-xl text-[11px] font-bold transition cursor-pointer"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteMarket(prod.id)}
                      className="flex-1 bg-white hover:bg-red-50 text-red-600 py-2 border border-red-100 rounded-xl text-[11px] font-bold transition cursor-pointer"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. TENTANG & KONTAK TAB */}
        {activeTab === 'about' && (
          <div className="space-y-6">
            <div className="space-y-4 max-w-3xl border-b border-gray-100 pb-6">
              <h3 className="text-base font-bold text-gray-800">Cerita Lahan Poktan (Tentang Kami)</h3>
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Narasi Deskripsi Lahan</label>
                <textarea 
                  rows="4"
                  value={data.about.cerita}
                  onChange={(e) => handleAboutStoryChange(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-150 rounded-xl py-3 px-4 text-xs outline-none focus:border-[#0b5924] focus:bg-white transition-all font-medium leading-relaxed"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center pb-2">
                <h3 className="text-base font-bold text-gray-800">Direktori & Kontak Pengelola Lahan</h3>
                <button 
                  onClick={openAddContact}
                  className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                >
                  <i className="bi bi-plus-circle"></i> Tambah Kontak Poktan
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {data.about.kontak.map((con) => (
                  <div key={con.id} className="p-5 border border-gray-100 bg-gray-50/50 rounded-3xl flex flex-col justify-between">
                    <div className="space-y-2">
                      <h4 className="text-xs font-extrabold text-emerald-950 uppercase tracking-wider">{con.poktan}</h4>
                      <div className="text-xs space-y-1 text-gray-500">
                        <p><strong>Ketua:</strong> {con.ketua}</p>
                        <p><strong>Alamat:</strong> {con.alamat}</p>
                        <p><strong>WhatsApp:</strong> +{con.telepon}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 mt-4 pt-3 border-t border-gray-200/50">
                      <button 
                        onClick={() => openEditContact(con)}
                        className="flex-1 bg-white hover:bg-emerald-50 text-emerald-700 py-2 border border-emerald-100 rounded-xl text-[11px] font-bold transition cursor-pointer"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteContact(con.id)}
                        className="flex-1 bg-white hover:bg-red-50 text-red-600 py-2 border border-red-100 rounded-xl text-[11px] font-bold transition cursor-pointer"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* --- MODAL KOMODITAS --- */}
      {showKomoditasModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-xl border border-gray-100">
            <h3 className="font-extrabold text-base text-gray-800">{editingKomoditas ? 'Edit Data Panen' : 'Tambah Data Panen'}</h3>
            <form onSubmit={handleSaveKomoditas} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-gray-400 block mb-1">Periode Bulan/Tahun</label>
                <input type="text" required placeholder="Contoh: Juli 2026" value={komForm.bulan} onChange={e => setKomForm({...komForm, bulan: e.target.value})} className="w-full bg-gray-50 border rounded-xl py-2.5 px-3 text-xs outline-none focus:border-[#0b5924]" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 block mb-1">Total Tonase</label>
                  <input type="text" required placeholder="Contoh: 12.4 Ton" value={komForm.tonase} onChange={e => setKomForm({...komForm, tonase: e.target.value})} className="w-full bg-gray-50 border rounded-xl py-2.5 px-3 text-xs outline-none focus:border-[#0b5924]" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 block mb-1">Luas Lahan</label>
                  <input type="text" required placeholder="Contoh: 1.1 Hektar" value={komForm.luas} onChange={e => setKomForm({...komForm, luas: e.target.value})} className="w-full bg-gray-50 border rounded-xl py-2.5 px-3 text-xs outline-none focus:border-[#0b5924]" />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 block mb-1">Kualitas Panen</label>
                <select value={komForm.kualitas} onChange={e => setKomForm({...komForm, kualitas: e.target.value})} className="w-full bg-gray-50 border rounded-xl py-2.5 px-3 text-xs outline-none focus:border-[#0b5924]">
                  <option>Super (Grade A)</option>
                  <option>Standar (Grade B)</option>
                  <option>Rendah (Grade C)</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 block mb-1">URL Link Gambar</label>
                <input type="text" required value={komForm.gambar} onChange={e => setKomForm({...komForm, gambar: e.target.value})} className="w-full bg-gray-50 border rounded-xl py-2.5 px-3 text-xs outline-none focus:border-[#0b5924] font-mono text-[10px]" />
              </div>
              <div className="flex gap-3 pt-3">
                <button type="button" onClick={() => setShowKomoditasModal(false)} className="flex-1 py-2.5 border rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-50 cursor-pointer">Batal</button>
                <button type="submit" className="flex-1 py-2.5 bg-[#0b5924] text-white rounded-xl text-xs font-bold hover:bg-emerald-800 cursor-pointer">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL MARKET --- */}
      {showMarketModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-xl border border-gray-100 overflow-y-auto max-h-[90vh]">
            <h3 className="font-extrabold text-base text-gray-800">{editingMarket ? 'Edit Produk Dagangan' : 'Tambah Produk Dagangan'}</h3>
            <form onSubmit={handleSaveMarket} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-gray-400 block mb-1">Nama Produk</label>
                <input type="text" required placeholder="Contoh: Bawang Merah Konsumsi Super" value={marketForm.nama} onChange={e => setMarketForm({...marketForm, nama: e.target.value})} className="w-full bg-gray-50 border rounded-xl py-2.5 px-3 text-xs outline-none focus:border-[#0b5924]" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 block mb-1">Harga (Rupiah)</label>
                  <input type="text" required placeholder="Contoh: 28.000" value={marketForm.harga} onChange={e => setMarketForm({...marketForm, harga: e.target.value})} className="w-full bg-gray-50 border rounded-xl py-2.5 px-3 text-xs outline-none focus:border-[#0b5924]" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 block mb-1">Satuan</label>
                  <input type="text" required placeholder="Contoh: kg / kuintal" value={marketForm.satuan} onChange={e => setMarketForm({...marketForm, satuan: e.target.value})} className="w-full bg-gray-50 border rounded-xl py-2.5 px-3 text-xs outline-none focus:border-[#0b5924]" />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 block mb-1">Deskripsi Produk</label>
                <textarea rows="3" required placeholder="Jelaskan kualitas bawang merah..." value={marketForm.deskripsi} onChange={e => setMarketForm({...marketForm, deskripsi: e.target.value})} className="w-full bg-gray-50 border rounded-xl py-2.5 px-3 text-xs outline-none focus:border-[#0b5924] font-medium" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 block mb-1">Nama Petani / Kelompok Tani</label>
                <input type="text" required placeholder="Contoh: Poktan Tani Makmur" value={marketForm.petani} onChange={e => setMarketForm({...marketForm, petani: e.target.value})} className="w-full bg-gray-50 border rounded-xl py-2.5 px-3 text-xs outline-none focus:border-[#0b5924]" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 block mb-1">No WhatsApp Petani (Gunakan Kode Negara '62')</label>
                <input type="text" required placeholder="Contoh: 6281234567890" value={marketForm.whatsapp} onChange={e => setMarketForm({...marketForm, whatsapp: e.target.value})} className="w-full bg-gray-50 border rounded-xl py-2.5 px-3 text-xs outline-none focus:border-[#0b5924]" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 block mb-1">URL Link Gambar</label>
                <input type="text" required value={marketForm.gambar} onChange={e => setMarketForm({...marketForm, gambar: e.target.value})} className="w-full bg-gray-50 border rounded-xl py-2.5 px-3 text-xs outline-none focus:border-[#0b5924] font-mono text-[10px]" />
              </div>
              <div className="flex gap-3 pt-3">
                <button type="button" onClick={() => setShowMarketModal(false)} className="flex-1 py-2.5 border rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-50 cursor-pointer">Batal</button>
                <button type="submit" className="flex-1 py-2.5 bg-[#0b5924] text-white rounded-xl text-xs font-bold hover:bg-emerald-800 cursor-pointer">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL CONTACT --- */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-xl border border-gray-100">
            <h3 className="font-extrabold text-base text-gray-800">{editingContact ? 'Edit Kontak Poktan' : 'Tambah Kontak Poktan'}</h3>
            <form onSubmit={handleSaveContact} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-gray-400 block mb-1">Nama Kelompok Tani (Poktan)</label>
                <input type="text" required placeholder="Contoh: Poktan Mulyo Jaya" value={contactForm.poktan} onChange={e => setContactForm({...contactForm, poktan: e.target.value})} className="w-full bg-gray-50 border rounded-xl py-2.5 px-3 text-xs outline-none focus:border-[#0b5924]" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 block mb-1">Nama Ketua Poktan</label>
                <input type="text" required placeholder="Contoh: Bapak Mulyadi" value={contactForm.ketua} onChange={e => setContactForm({...contactForm, ketua: e.target.value})} className="w-full bg-gray-50 border rounded-xl py-2.5 px-3 text-xs outline-none focus:border-[#0b5924]" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 block mb-1">Alamat Posko Lahan</label>
                <input type="text" required placeholder="Contoh: Dusun Sajen RT 01 RW 01, Pacet" value={contactForm.alamat} onChange={e => setContactForm({...contactForm, alamat: e.target.value})} className="w-full bg-gray-50 border rounded-xl py-2.5 px-3 text-xs outline-none focus:border-[#0b5924]" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 block mb-1">No WhatsApp Kontak (Gunakan Kode Negara '62')</label>
                <input type="text" required placeholder="Contoh: 6281234567890" value={contactForm.telepon} onChange={e => setContactForm({...contactForm, telepon: e.target.value})} className="w-full bg-gray-50 border rounded-xl py-2.5 px-3 text-xs outline-none focus:border-[#0b5924]" />
              </div>
              <div className="flex gap-3 pt-3">
                <button type="button" onClick={() => setShowContactModal(false)} className="flex-1 py-2.5 border rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-50 cursor-pointer">Batal</button>
                <button type="submit" className="flex-1 py-2.5 bg-[#0b5924] text-white rounded-xl text-xs font-bold hover:bg-emerald-800 cursor-pointer">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default CmsAdmin;
