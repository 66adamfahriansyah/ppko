import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById } from '../services/productService';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Touch swipe states
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const minSwipeDistance = 50;

  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (imagesLength) => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      setActiveImageIndex(prev => (prev === imagesLength - 1 ? 0 : prev + 1));
    }
    if (isRightSwipe) {
      setActiveImageIndex(prev => (prev === 0 ? imagesLength - 1 : prev - 1));
    }
  };

  // Default fallback image if list is empty
  const fallbackImage = 'https://images.unsplash.com/photo-1608797178974-15b35a61d121?w=800&auto=format&fit=crop&q=80';


  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const data = await getProductById(id);
        setProduct(data);
      } catch (err) {
        setError(err.message || 'Gagal memuat detail produk');
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-xl mx-auto my-12 text-center p-8 bg-white border border-gray-150 rounded-3xl space-y-4">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto text-2xl">
          <i className="bi bi-exclamation-octagon-fill"></i>
        </div>
        <h2 className="text-lg font-extrabold text-gray-800">Detail Produk Tidak Ditemukan</h2>
        <p className="text-xs text-gray-500 leading-relaxed">
          {error || 'Produk mungkin telah dihapus oleh pemilik toko atau dinonaktifkan oleh administrator.'}
        </p>
        <button
          onClick={() => navigate('/admin')}
          className="bg-[#0b5924] hover:bg-[#073c18] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer"
        >
          Kembali ke Beranda
        </button>
      </div>
    );
  }

  // Parse images array from serialized JSON string in DB
  let images = [];
  try {
    images = JSON.parse(product.image || '[]');
    if (!Array.isArray(images)) {
      images = product.image ? [product.image] : [];
    }
  } catch {
    images = product.image ? [product.image] : [];
  }
  if (images.length === 0) {
    images = [fallbackImage];
  }

  return (
    <div className="min-h-screen bg-[#f8faf8] font-sans pb-12">
      {/* Dynamic Dedicated Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-emerald-50 shadow-sm py-4 px-6 md:px-12 flex justify-between items-center transition-all mb-6">
        <button
          onClick={() => navigate('/')}
          className="group flex items-center gap-2 cursor-pointer bg-transparent border-none text-left"
        >
          <div className="w-10 h-10 bg-[#0b5924] rounded-xl flex items-center justify-center text-white text-lg shadow-sm">
            <i className="bi bi-flower1"></i>
          </div>
          <div>
            <span className="font-extrabold text-emerald-950 text-base block leading-none">E-BIO PENS</span>
            <span className="text-[10px] text-emerald-600 font-bold tracking-wider">DESA SAJEN</span>
          </div>
        </button>
        <button
          onClick={() => navigate('/')}
          className="group flex items-center gap-1.5 text-xs font-extrabold text-gray-600 hover:text-[#0b5924] transition cursor-pointer bg-gray-50 hover:bg-emerald-50 px-4 py-2 rounded-full border border-gray-200"
        >
          <i className="bi bi-house-door-fill text-emerald-700"></i> Beranda Utama
        </button>
      </header>

      <div className="max-w-5xl mx-auto px-4 space-y-4">
        {/* Back button */}
        <div>
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-[#0b5924] transition cursor-pointer"
          >
            <i className="bi bi-arrow-left group-hover:-translate-x-1 transition-transform"></i> Kembali ke Halaman Sebelumnya
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-6 md:p-8 rounded-[32px] border border-gray-100 shadow-sm">
          {/* Left Column: Image Gallery Slider */}
          <div className="space-y-4">
            <div 
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={() => handleTouchEnd(images.length)}
              className="h-80 md:h-[420px] w-full rounded-[24px] overflow-hidden bg-gray-50 border border-gray-100 relative group select-none shadow-sm"
            >
              <img
                src={images[activeImageIndex]}
                alt={product.name}
                className="w-full h-full object-cover transition-all duration-300 pointer-events-none"
              />
              
              {/* Sliding navigation overlays */}
              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => setActiveImageIndex(prev => (prev === 0 ? images.length - 1 : prev - 1))}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white text-emerald-950 rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition active:scale-90 cursor-pointer z-10 opacity-0 group-hover:opacity-100 duration-200 border border-gray-100"
                  >
                    <i className="bi bi-chevron-left text-base font-black"></i>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveImageIndex(prev => (prev === images.length - 1 ? 0 : prev + 1))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white text-emerald-950 rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition active:scale-90 cursor-pointer z-10 opacity-0 group-hover:opacity-100 duration-200 border border-gray-100"
                  >
                    <i className="bi bi-chevron-right text-base font-black"></i>
                  </button>
                </>
              )}

              {/* Pagination count text overlay */}
              {images.length > 1 && (
                <div className="absolute bottom-4 left-4 bg-black/55 backdrop-blur-sm px-3.5 py-1 rounded-full text-[10px] text-white font-bold tracking-wider">
                  Foto {activeImageIndex + 1} dari {images.length}
                </div>
              )}
            </div>

            {/* Dot Indicators for sliding state */}
            {images.length > 1 && (
              <div className="flex justify-center items-center gap-2 pt-2">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      idx === activeImageIndex ? 'w-6 bg-[#0b5924]' : 'w-2 bg-gray-300 hover:bg-gray-400'
                    }`}
                    aria-label={`Buka slide ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>


        {/* Right Column: Details & Farmer Info */}
        <div className="flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Header info */}
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                Petani Terverifikasi
              </span>
              <h1 className="text-2xl md:text-3xl font-black text-gray-900 mt-2 leading-tight">
                {product.name}
              </h1>
              <div className="text-xl font-black text-emerald-800 mt-1">
                {product.price}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5 pt-4 border-t border-gray-100">
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Deskripsi Hasil Panen</h3>
              <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-line font-medium">
                {product.description}
              </p>
            </div>

            {/* Farmer Profile details */}
            <div className="p-4 bg-emerald-50/40 border border-emerald-50 rounded-2xl space-y-3 mt-6">
              <h3 className="text-[10px] font-bold text-emerald-900 uppercase tracking-wider border-b border-emerald-950/5 pb-2 flex items-center gap-1.5">
                <i className="bi bi-person-badge-fill text-emerald-700"></i> Informasi Penjual (Petani)
              </h3>
              <div className="grid grid-cols-2 gap-y-3 text-[11px] font-medium text-gray-700">
                <div>
                  <span className="text-[9px] text-gray-400 uppercase block">Nama Lengkap</span>
                  <span className="font-extrabold text-gray-800">{product.owner_name}</span>
                </div>
                <div>
                  <span className="text-[9px] text-gray-400 uppercase block">Kelompok Tani (Poktan)</span>
                  <span className="font-extrabold text-gray-800">{product.owner_poktan}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-[9px] text-gray-400 uppercase block">Alamat Pengambilan</span>
                  <span className="font-bold text-gray-800">{product.owner_address}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action CTA buttons */}
          <div className="pt-6 border-t border-gray-100">
            <a
              href={`https://wa.me/${product.owner_phone}?text=Halo%20${encodeURIComponent(product.owner_name)},%20saya%20tertarik%20dengan%20produk%20${encodeURIComponent(product.name)}%20di%20Website%20E-BIO%20PENS.`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#0b5924] hover:bg-[#073c18] text-white py-3.5 rounded-2xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-md shadow-emerald-950/15 cursor-pointer text-center"
            >
              <i className="bi bi-whatsapp text-sm leading-none"></i> Hubungi Petani via WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
}

export default ProductDetail;

