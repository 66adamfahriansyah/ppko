import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCmsData } from '../utils/cmsHelper';
import { getPublicProducts } from '../services/productService';


function Home() {
  const navigate = useNavigate();
  const [cmsData, setCmsData] = useState(getCmsData());
  const [dbProducts, setDbProducts] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const carouselRef = useRef(null);

  const fetchDbProducts = async () => {
    try {
      const data = await getPublicProducts();
      setDbProducts(data);
    } catch (err) {
      console.error("Gagal mengambil data produk dari database:", err);
    }
  };

  // Sync data on load
  useEffect(() => {
    setCmsData(getCmsData());
    fetchDbProducts();
  }, []);


  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollCarousel = (direction) => {
    if (carouselRef.current) {
      const { scrollLeft, clientWidth } = carouselRef.current;
      const scrollAmount = clientWidth * 0.75;
      carouselRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#f8faf8] font-sans text-gray-800 scroll-smooth">
      {/* 1. HEADER / NAVBAR */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-emerald-50 shadow-sm py-4 px-6 md:px-12 flex justify-between items-center transition-all relative">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="w-10 h-10 bg-[#0b5924] rounded-xl flex items-center justify-center text-white text-lg shadow-sm">
            <i className="bi bi-flower1"></i>
          </div>
          <div>
            <span className="font-extrabold text-emerald-950 text-base block leading-none">E-BIO PENS</span>
            <span className="text-[10px] text-emerald-600 font-bold tracking-wider">DESA SAJEN</span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-600">
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-emerald-700 transition">Beranda</button>
          <button onClick={() => scrollToSection('komoditas')} className="hover:text-emerald-700 transition">Komoditas</button>
          <button onClick={() => scrollToSection('marketplace')} className="hover:text-emerald-700 transition">Marketplace</button>
          <button onClick={() => scrollToSection('about')} className="hover:text-emerald-700 transition">Tentang Kami</button>
        </nav>

        {/* Desktop Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <button 
            onClick={() => navigate('/admin')}
            className="border border-[#0b5924] text-[#0b5924] hover:bg-emerald-50 px-4 py-2.5 rounded-full text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
          >
            <i className="bi bi-cpu-fill"></i> Monitor Lahan
          </button>
          <button 
            onClick={() => navigate('/login')}
            className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2.5 rounded-full text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
          >
            <i className="bi bi-box-arrow-in-right"></i> Masuk
          </button>
          <button 
            onClick={() => navigate('/register')}
            className="bg-[#0b5924] hover:bg-[#073c18] text-white px-5 py-2.5 rounded-full text-xs font-bold transition shadow-sm hover:shadow-md cursor-pointer flex items-center gap-1.5"
          >
            <i className="bi bi-person-plus-fill"></i> Daftar
          </button>
        </div>

        {/* Mobile Hamburger Toggle Button */}
        <div className="flex md:hidden items-center">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)} 
            className="text-gray-700 hover:text-emerald-700 p-2 text-2xl focus:outline-none cursor-pointer"
            aria-label="Toggle menu"
          >
            <i className={isMenuOpen ? "bi bi-x-lg" : "bi bi-list"}></i>
          </button>
        </div>

        {/* Mobile Drawer Dropdown Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-emerald-50 shadow-lg px-6 py-5 flex flex-col gap-4 animate-in slide-in-from-top-5 duration-200 z-50">
            <button 
              onClick={() => { setIsMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
              className="text-left font-bold text-gray-700 hover:text-emerald-700 py-2 border-b border-gray-50 flex items-center gap-2 cursor-pointer"
            >
              <i className="bi bi-house"></i> Beranda
            </button>
            <button 
              onClick={() => { setIsMenuOpen(false); scrollToSection('komoditas'); }} 
              className="text-left font-bold text-gray-700 hover:text-emerald-700 py-2 border-b border-gray-50 flex items-center gap-2 cursor-pointer"
            >
              <i className="bi bi-flower1"></i> Komoditas
            </button>
            <button 
              onClick={() => { setIsMenuOpen(false); scrollToSection('marketplace'); }} 
              className="text-left font-bold text-gray-700 hover:text-emerald-700 py-2 border-b border-gray-50 flex items-center gap-2 cursor-pointer"
            >
              <i className="bi bi-shop"></i> Marketplace
            </button>
            <button 
              onClick={() => { setIsMenuOpen(false); scrollToSection('about'); }} 
              className="text-left font-bold text-gray-700 hover:text-emerald-700 py-2 border-b border-gray-50 flex items-center gap-2 cursor-pointer"
            >
              <i className="bi bi-info-circle"></i> Tentang Kami
            </button>
            
            <div className="flex flex-col gap-2.5 pt-3">
              <button 
                onClick={() => { setIsMenuOpen(false); navigate('/admin'); }}
                className="w-full justify-center border border-[#0b5924] text-[#0b5924] hover:bg-emerald-50 py-3 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <i className="bi bi-cpu-fill"></i> Monitor Lahan
              </button>
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => { setIsMenuOpen(false); navigate('/login'); }}
                  className="w-full justify-center border border-gray-300 text-gray-700 hover:bg-gray-50 py-3 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                >
                  <i className="bi bi-box-arrow-in-right"></i> Masuk
                </button>
                <button 
                  onClick={() => { setIsMenuOpen(false); navigate('/register'); }}
                  className="w-full justify-center bg-[#0b5924] hover:bg-[#073c18] text-white py-3 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                >
                  <i className="bi bi-person-plus-fill"></i> Daftar
                </button>
              </div>
            </div>
          </div>
        )}
      </header>


      {/* 2. HERO SECTION */}
      <section
        id="home"
        className="relative min-h-[85vh] flex items-center justify-center bg-cover bg-center py-20 px-6 text-center text-white"
        style={{ backgroundImage: `linear-gradient(to bottom, rgba(11, 89, 36, 0.75), rgba(6, 64, 26, 0.9)), url(${cmsData.hero.bgImage})` }}
      >
        <div className="max-w-3xl space-y-6">
          <div className="inline-block bg-emerald-700/50 backdrop-blur-sm border border-emerald-500/30 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest text-emerald-200 uppercase">
            <i className="bi bi-geo-alt-fill mr-1"></i> Pacet - Mojokerto
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
            {cmsData.hero.title}
          </h1>
          <p className="text-base md:text-xl text-emerald-100/90 font-medium max-w-2xl mx-auto leading-relaxed">
            {cmsData.hero.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
            <button
              onClick={() => scrollToSection('komoditas')}
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3.5 rounded-2xl text-sm font-bold transition shadow-md cursor-pointer"
            >
              Lihat Hasil Panen
            </button>
            <button
              onClick={() => scrollToSection('marketplace')}
              className="w-full sm:w-auto border-2 border-white/80 hover:bg-white hover:text-emerald-900 text-white px-8 py-3.5 rounded-2xl text-sm font-bold transition cursor-pointer"
            >
              Marketplace Petani
            </button>
          </div>
        </div>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce cursor-pointer" onClick={() => scrollToSection('komoditas')}>
          <i className="bi bi-chevron-double-down text-2xl text-emerald-200"></i>
        </div>
      </section>

      {/* 3. KOMODITAS SECTION */}
      <section id="komoditas" className="py-20 px-6 md:px-12 bg-emerald-50/30">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-end mb-10">
            <div>
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest block mb-1">Hasil Bumi</span>
              <h2 className="text-3xl font-extrabold text-emerald-950">Komoditas Utama Bawang Merah</h2>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => scrollCarousel('left')}
                className="w-10 h-10 bg-white hover:bg-emerald-50 text-emerald-800 rounded-full flex items-center justify-center shadow-sm border border-gray-150 transition cursor-pointer"
              >
                <i className="bi bi-chevron-left"></i>
              </button>
              <button
                onClick={() => scrollCarousel('right')}
                className="w-10 h-10 bg-white hover:bg-emerald-50 text-emerald-800 rounded-full flex items-center justify-center shadow-sm border border-gray-150 transition cursor-pointer"
              >
                <i className="bi bi-chevron-right"></i>
              </button>
            </div>
          </div>

          <div
            ref={carouselRef}
            className="flex gap-6 overflow-x-auto scrollbar-none snap-x snap-mandatory pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {cmsData.komoditas.map((item) => (
              <div
                key={item.id}
                className="min-w-[280px] md:min-w-[360px] bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col justify-between snap-start hover:shadow-md transition-all duration-300 group"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={item.gambar}
                    alt={item.bulan}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-emerald-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase">
                    {item.kualitas}
                  </div>
                </div>
                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-semibold text-gray-400">Periode Panen</span>
                    <h3 className="text-lg font-bold text-gray-800 mt-0.5">{item.bulan}</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4 py-3 border-y border-gray-50 text-xs">
                    <div>
                      <span className="text-gray-400 block">Total Tonase</span>
                      <strong className="text-emerald-800 font-bold text-base">{item.tonase}</strong>
                    </div>
                    <div>
                      <span className="text-gray-400 block">Luas Lahan</span>
                      <strong className="text-gray-700 font-bold text-base">{item.luas}</strong>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. MARKETPLACE SECTION */}
      <section id="marketplace" className="py-20 px-6 md:px-12 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest block mb-1">Dukung Petani Lokal</span>
            <h2 className="text-3xl font-extrabold text-emerald-950">Marketplace Anggota Tani</h2>
            <p className="text-sm text-gray-500 mt-2">Beli langsung produk bawang merah terbaik tanpa perantara. Hubungi petani kami langsung via WhatsApp.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {dbProducts.length === 0 ? (
              <div className="col-span-full py-12 text-center text-gray-400 font-semibold text-xs bg-gray-50 border border-gray-100 rounded-3xl">
                <i className="bi bi-inboxes-fill text-2xl block mb-2 text-gray-300"></i>
                Belum ada produk hasil panen yang diunggah oleh petani terverifikasi.
              </div>
            ) : (
              dbProducts.map((prod) => {
                // Parse first image
                let mainImg = 'https://images.unsplash.com/photo-1608797178974-15b35a61d121?w=500&auto=format&fit=crop&q=60';
                try {
                  const arr = JSON.parse(prod.image || '[]');
                  if (Array.isArray(arr) && arr.length > 0) {
                    mainImg = arr[0];
                  } else if (prod.image) {
                    mainImg = prod.image;
                  }
                } catch {
                  if (prod.image) {
                    mainImg = prod.image;
                  }
                }

                return (
                  <div
                    key={prod.id}
                    onClick={() => navigate(`/product/${prod.id}`)}
                    className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer group hover:-translate-y-1"
                  >
                    <div className="relative h-32 sm:h-48 bg-gray-50 overflow-hidden">
                      <img 
                        src={mainImg} 
                        alt={prod.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                    </div>
                    <div className="p-3 sm:p-5 space-y-3">
                      <div>
                        <h3 className="text-xs sm:text-sm font-extrabold text-gray-900 group-hover:text-[#0b5924] transition-colors line-clamp-1">{prod.name}</h3>
                        <div className="text-emerald-800 text-xs sm:text-sm font-black mt-0.5 sm:mt-1">{prod.price}</div>
                      </div>

                      <div className="space-y-1.5 pt-2.5 border-t border-gray-100 text-[10px] sm:text-xs text-gray-600 font-semibold">
                        <div className="flex items-center gap-1 sm:gap-2">
                          <i className="bi bi-people-fill text-xs sm:text-base text-emerald-600"></i>
                          <span className="font-extrabold text-gray-800 truncate">
                            {prod.owner_poktan || 'Poktan Mandiri'}{' '}
                            <span className="text-[8px] sm:text-[10px] text-gray-400 font-bold ml-0.5">({prod.owner_username})</span>
                          </span>
                        </div>
                        <div className="flex items-center gap-1 sm:gap-2">
                          <i className="bi bi-geo-alt-fill text-xs sm:text-base text-emerald-600"></i>
                          <span className="truncate text-gray-500 font-medium">{prod.address}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}



          </div>
        </div>
      </section>

      {/* 5. ABOUT & CONTACT SECTION */}
      <section id="about" className="py-20 px-6 md:px-12 bg-emerald-50/20 border-t border-emerald-50/50">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest block mb-1">Tentang Kelompok Tani</span>
            <h2 className="text-3xl font-extrabold text-emerald-950 leading-tight">Mewujudkan Kemandirian Pertanian Modern</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              {cmsData.about.cerita}
            </p>
            <div className="p-5 bg-white border border-emerald-50 rounded-3xl flex items-center gap-4 shadow-sm max-w-md">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-700 rounded-2xl flex items-center justify-center text-xl flex-shrink-0">
                <i className="bi bi-award-fill"></i>
              </div>
              <div>
                <h4 className="text-sm font-bold text-emerald-950">Lahan Terakreditasi IoT</h4>
                <p className="text-[11px] text-gray-400 mt-0.5">Pemantauan otomatis & ramah lingkungan berbasis riset PPK Ormawa E-BIO PENS.</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <i className="bi bi-telephone-fill text-emerald-600"></i> Kontak Pengelola Lahan
            </h3>

            <div className="space-y-4">
              {cmsData.about.kontak.map((contact) => (
                <div key={contact.id} className="p-4 bg-gray-50 rounded-2xl space-y-2 border border-gray-100">
                  <h4 className="text-xs font-extrabold text-emerald-900 uppercase tracking-wider">{contact.poktan}</h4>
                  <div className="text-xs space-y-1 text-gray-600">
                    <p><strong className="text-gray-700">Ketua:</strong> {contact.ketua}</p>
                    <p className="flex items-start gap-1"><i className="bi bi-geo-alt-fill text-emerald-700 mt-0.5"></i> {contact.alamat}</p>
                  </div>
                  <a
                    href={`https://wa.me/${contact.telepon}?text=Halo%20${encodeURIComponent(contact.ketua)},%20saya%20ingin%20bertanya%20mengenai%20lahan%20pertanian%20bawang%20merah%20Sajen.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-xs font-bold text-emerald-700 hover:text-emerald-800 gap-1 mt-1"
                  >
                    <i className="bi bi-whatsapp"></i> Hubungi WA Kelompok
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. FOOTER */}
      <footer className="bg-emerald-950 text-emerald-100/70 py-12 px-6 md:px-12 border-t border-emerald-900/60">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-800 rounded-lg flex items-center justify-center text-white text-base">
              <i className="bi bi-flower1"></i>
            </div>
            <span className="font-extrabold text-white text-sm">E-BIO PENS</span>
          </div>
          <span className="text-[11px] text-center md:text-right">
            © 2026 E-BIO PENS. Dikembangkan oleh Tim R&D PPK Ormawa E-BIO PENS.
          </span>
        </div>
      </footer>
    </div>
  );
}

export default Home;
