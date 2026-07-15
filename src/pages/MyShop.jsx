import { useState, useEffect } from 'react';
import { getMyProducts, createProduct, updateProduct, deleteProduct } from '../services/productService';
import { getMe } from '../services/authService';
import { useAuth } from '../context/AuthContext';

function MyShop() {
  const { user } = useAuth();
  const [userFresh, setUserFresh] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); // Null for Add, product object for Edit

  // Form State
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [address, setAddress] = useState('');
  const [contact, setContact] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [isActive, setIsActive] = useState(true);

  // Preset Images
  const presetImages = [
    { name: 'Bawang Merah Super', url: 'https://images.unsplash.com/photo-1608797178974-15b35a61d121?w=500&auto=format&fit=crop&q=60' },
    { name: 'Bawang Merah Jumbo', url: 'https://images.unsplash.com/photo-1508747703725-719777637510?w=500&auto=format&fit=crop&q=60' },
    { name: 'Benih Unggul Sajen', url: 'https://images.unsplash.com/photo-1580196782151-519d1fa98a6a?w=500&auto=format&fit=crop&q=60' }
  ];

  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getMyProducts();
      setProducts(data);
    } catch (err) {
      setError(err.message || 'Gagal memuat produk toko Anda');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const data = await getMe();
      setUserFresh(data);
    } catch (err) {
      console.warn("Gagal memuat profil terbaru:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchUserProfile();
  }, []);

  // Pre-fill fields on Add/Edit modal open
  const openModal = (product = null) => {
    setEditingProduct(product);
    if (product) {
      setName(product.name);
      setPrice(product.price);
      setAddress(product.address);
      setContact(product.contact);
      setDescription(product.description);
      setImage(product.image);
      setIsActive(product.is_active === 1);
    } else {
      setName('');
      setPrice('Rp 28.000 / kg'); // default price structure
      // Auto-fill from user profile details
      setAddress(userFresh?.alamat || user?.alamat || '');
      setContact(userFresh?.no_telp || user?.no_telp || '');
      setDescription('');
      setImage(presetImages[0].url);
      setIsActive(true);
    }
    setIsModalOpen(true);
    setError('');
    setSuccess('');
  };


  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const payload = {
      name,
      price,
      address,
      contact,
      description,
      image,
      isActive: isActive ? 1 : 0
    };

    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, payload);
        setSuccess('Produk berhasil diperbarui!');
      } else {
        await createProduct(payload);
        setSuccess('Produk baru berhasil ditambahkan!');
      }
      fetchProducts();
      setTimeout(closeModal, 1500);
    } catch (err) {
      setError(err.message || 'Gagal menyimpan produk');
    }
  };

  // Delete Handler
  const handleDelete = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus produk ini dari toko Anda?')) return;
    setError('');
    setSuccess('');
    try {
      await deleteProduct(id);
      setSuccess('Produk berhasil dihapus!');
      fetchProducts();
    } catch (err) {
      setError(err.message || 'Gagal menghapus produk');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-150">
        <div>
          <h2 className="text-xl font-extrabold text-emerald-950 flex items-center gap-2">
            <i className="bi bi-shop text-emerald-700"></i> Kelola Toko E-BIO Saya
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Unggah dan perbarui dagangan bawang merah Anda langsung ke katalog e-commerce publik desa Sajen.
          </p>
        </div>
        <button
          onClick={() => openModal()}
          disabled={userFresh?.is_verified === 0}
          className={`py-2.5 px-5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm w-full sm:w-auto ${
            userFresh?.is_verified === 0 
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed border-gray-200' 
              : 'bg-[#0b5924] hover:bg-[#073c18] text-white shadow-emerald-950/10 cursor-pointer'
          }`}
        >
          <i className="bi bi-plus-lg"></i> Tambah Produk Baru
        </button>
      </div>


      {/* Warning Banner for Unverified Accounts */}
      {userFresh && userFresh.is_verified === 0 && (
        <div className="p-5 bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl flex items-start gap-4 shadow-sm">
          <div className="bg-amber-100 p-2.5 rounded-xl text-amber-700 text-lg leading-none">
            <i className="bi bi-exclamation-triangle-fill"></i>
          </div>
          <div>
            <h4 className="font-extrabold text-amber-950 text-xs uppercase tracking-wider">Akun Belum Diverifikasi</h4>
            <p className="text-[11px] text-amber-800 mt-1 font-medium leading-relaxed">
              Toko Anda belum diverifikasi oleh Administrator Poktan. Produk Anda saat ini **tidak akan ditayangkan** di katalog e-commerce publik desa Sajen. Hubungi admin atau tunggu proses verifikasi kelompok tani agar produk Anda tayang ke pembeli.
            </p>
          </div>
        </div>
      )}


      {/* Messages */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl flex items-center gap-2">
          <i className="bi bi-exclamation-triangle-fill"></i> {error}
        </div>
      )}
      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2">
          <i className="bi bi-check-circle-fill"></i> {success}
        </div>
      )}

      {/* Grid List */}
      {loading ? (
        <div className="min-h-[250px] flex items-center justify-center bg-white rounded-2xl border border-gray-150">
          <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-gray-150 text-center">
          <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#0b5924] text-3xl">
            <i className="bi bi-inboxes-fill"></i>
          </div>
          <h3 className="text-sm font-extrabold text-gray-700">Toko Anda Masih Kosong</h3>
          <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
            Mulailah mengunggah hasil panen bawang merah Anda sekarang agar dapat dihubungi oleh pembeli potensial.
          </p>
          <button
            onClick={() => openModal()}
            disabled={userFresh?.is_verified === 0}
            className={`mt-4 border font-bold text-xs py-2.5 px-4 rounded-xl transition ${
              userFresh?.is_verified === 0
                ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                : 'border-[#0b5924] text-[#0b5924] hover:bg-emerald-50 cursor-pointer'
            }`}
          >
            Unggah Produk Pertama Anda
          </button>
        </div>

      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-2xl border border-gray-150 shadow-sm overflow-hidden flex flex-col justify-between group hover:shadow-md transition duration-300">
              <div>
                <div className="h-44 relative bg-gray-50 overflow-hidden">
                  <img
                    src={product.image || presetImages[0].url}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold ${product.is_active === 1 ? 'bg-emerald-500/90 text-white' : 'bg-gray-400/90 text-white'}`}>
                    {product.is_active === 1 ? 'Tayang' : 'Draft'}
                  </div>
                </div>
                <div className="p-5 space-y-3">
                  <div>
                    <h3 className="font-extrabold text-gray-800 text-sm truncate">{product.name}</h3>
                    <span className="text-xs font-bold text-emerald-800 block mt-0.5">{product.price}</span>
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{product.description}</p>
                  
                  <div className="space-y-1 pt-2 border-t border-gray-100 text-[11px] text-gray-600 font-medium">
                    <p className="flex items-center gap-1.5"><i className="bi bi-geo-alt text-emerald-700"></i> <span className="truncate">{product.address}</span></p>
                    <p className="flex items-center gap-1.5"><i className="bi bi-whatsapp text-emerald-700"></i> {product.contact}</p>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0 flex gap-2">
                <button
                  onClick={() => openModal(product)}
                  className="flex-1 border border-gray-200 text-gray-600 hover:bg-gray-50 font-bold text-xs py-2 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <i className="bi bi-pencil"></i> Edit
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="border border-red-100 hover:bg-red-50 text-red-600 font-bold text-xs py-2 px-3.5 rounded-xl transition cursor-pointer flex items-center justify-center"
                  title="Hapus Produk"
                >
                  <i className="bi bi-trash-fill"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Dialog Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-emerald-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-emerald-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-150 flex items-center justify-between bg-emerald-900 text-white">
              <h3 className="font-extrabold text-sm flex items-center gap-1.5">
                <i className="bi bi-shop"></i> {editingProduct ? 'Edit Informasi Produk' : 'Tambah Produk Toko Baru'}
              </h3>
              <button onClick={closeModal} className="text-white/80 hover:text-white"><i className="bi bi-x-lg"></i></button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Nama Produk</label>
                  <input
                    type="text"
                    required
                    placeholder="Bawang Merah Sajen Super"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-3 text-xs outline-none focus:border-emerald-600 focus:bg-white transition-all font-semibold text-gray-700"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Harga & Satuan</label>
                  <input
                    type="text"
                    required
                    placeholder="Rp 28.000 / kg"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-3 text-xs outline-none focus:border-emerald-600 focus:bg-white transition-all font-semibold text-gray-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Alamat Penjualan</label>
                  <input
                    type="text"
                    required
                    placeholder="Dusun Sajen, Mojokerto"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-3 text-xs outline-none focus:border-emerald-600 focus:bg-white transition-all font-semibold text-gray-700"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Kontak WA Pembeli</label>
                  <input
                    type="text"
                    required
                    placeholder="628123456789"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-3 text-xs outline-none focus:border-emerald-600 focus:bg-white transition-all font-semibold text-gray-700"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Deskripsi Produk</label>
                <textarea
                  required
                  placeholder="Ceritakan kelebihan bawang merah Anda (ukuran, kualitas panen, kesegaran)..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows="3"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-3 text-xs outline-none focus:border-emerald-600 focus:bg-white transition-all font-medium text-gray-700 resize-none"
                />
              </div>

              {/* Preset Image Selector */}
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">Pilih Ilustrasi Gambar</label>
                <div className="grid grid-cols-3 gap-3">
                  {presetImages.map((img, idx) => (
                    <div
                      key={idx}
                      onClick={() => setImage(img.url)}
                      className={`relative rounded-xl overflow-hidden h-16 border-2 cursor-pointer transition ${image === img.url ? 'border-emerald-600 ring-2 ring-emerald-600/20' : 'border-transparent opacity-70 hover:opacity-100'}`}
                    >
                      <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/35 flex items-end justify-center p-1">
                        <span className="text-[8px] text-white font-bold text-center leading-none truncate w-full">{img.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Custom URL Option */}
                <div className="mt-3">
                  <label className="text-[9px] font-bold text-gray-400 block mb-1">Atau Masukkan URL Gambar Custom</label>
                  <input
                    type="text"
                    placeholder="https://..."
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-[10px] outline-none focus:border-emerald-600 focus:bg-white transition-all font-semibold text-gray-600"
                  />
                </div>
              </div>

              {/* Toggle Active status */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="activeToggle"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 accent-emerald-700 cursor-pointer"
                />
                <label htmlFor="activeToggle" className="text-xs font-bold text-gray-700 cursor-pointer">
                  Tampilkan Produk Ini ke Publik (Katalog E-Commerce)
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 border border-gray-200 hover:bg-gray-50 text-gray-600 font-bold text-xs py-3 rounded-xl transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#0b5924] hover:bg-[#073c18] text-white font-bold text-xs py-3 rounded-xl transition shadow-md shadow-emerald-950/15 cursor-pointer"
                >
                  {editingProduct ? 'Simpan Perubahan' : 'Tambahkan Produk'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyShop;
