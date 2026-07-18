import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { request } from '../services/api';

// localStorage helpers as fallback
const STORAGE_KEY = 'education_books';

function getLocalBooks() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return [
    {
      id: '1',
      title: 'Buku Panduan E-BIO PENS v1.0',
      description: 'Panduan teknis pengoperasian alat monitoring sawah berbasis IoT E-BIO PENS untuk petani.',
      file_link: 'https://example.com/panduan-ebio.pdf',
      cover_image: ''
    },
    {
      id: '2',
      title: 'Budidaya Padi Organik Ramah Lingkungan',
      description: 'Buku panduan mengenai budidaya padi secara organik, mengurangi bahan kimia, dan meningkatkan kesehatan tanah.',
      file_link: 'https://example.com/padi-organik.pdf',
      cover_image: ''
    },
    {
      id: '3',
      title: 'Pengendalian Hama Terpadu (PHT)',
      description: 'Konsep pengendalian hama menggunakan Light Trap mekanis untuk meminimalkan kerugian hasil panen.',
      file_link: 'https://example.com/pht-light-trap.pdf',
      cover_image: ''
    }
  ];
}

function saveLocalBooks(books) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
}

function Education() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState('');

  // Form states (For Add / Edit)
  const [showModal, setShowModal] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', file_link: '', cover_image: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [useApi, setUseApi] = useState(false);

  const triggerNotification = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  // Fetch books — try API first, fallback to localStorage
  const fetchBooks = async () => {
    try {
      setLoading(true);
      const data = await request('/education', { method: 'GET' });
      setBooks(data);
      setUseApi(true);
    } catch {
      // API not available, use localStorage
      setBooks(getLocalBooks());
      setUseApi(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // Open add modal
  const openAddModal = () => {
    setEditingBook(null);
    setForm({ title: '', description: '', file_link: '', cover_image: '' });
    setShowModal(true);
  };

  // Open edit modal
  const openEditModal = (book) => {
    setEditingBook(book);
    setForm({
      title: book.title,
      description: book.description,
      file_link: book.file_link,
      cover_image: book.cover_image || ''
    });
    setShowModal(true);
  };

  // Save (Create / Update)
  const handleSave = async (e) => {
    e.preventDefault();

    if (useApi) {
      try {
        const endpoint = editingBook ? `/education/${editingBook.id}` : '/education';
        const method = editingBook ? 'PUT' : 'POST';
        await request(endpoint, { method, body: JSON.stringify(form) });
        await fetchBooks();
      } catch (err) {
        alert(err.message);
        return;
      }
    } else {
      // localStorage mode
      if (editingBook) {
        const updated = books.map(b => b.id === editingBook.id ? { ...form, id: editingBook.id } : b);
        setBooks(updated);
        saveLocalBooks(updated);
      } else {
        const newBook = { ...form, id: Date.now().toString() };
        const updated = [...books, newBook];
        setBooks(updated);
        saveLocalBooks(updated);
      }
    }

    setShowModal(false);
    triggerNotification(editingBook ? 'Buku panduan berhasil diperbarui!' : 'Buku panduan berhasil ditambahkan!');
  };

  // Delete
  const handleDelete = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus buku panduan ini?')) return;

    if (useApi) {
      try {
        await request(`/education/${id}`, { method: 'DELETE' });
        await fetchBooks();
      } catch (err) {
        alert(err.message);
        return;
      }
    } else {
      const updated = books.filter(b => b.id !== id && String(b.id) !== String(id));
      setBooks(updated);
      saveLocalBooks(updated);
    }

    triggerNotification('Buku panduan berhasil dihapus!');
  };

  // Filter books based on search query
  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">

      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-emerald-900 leading-tight">Materi Edukasi & Buku Panduan</h1>
          <p className="text-xs text-gray-500 mt-1">
            Kumpulan panduan teknis, edukasi tani pintar, dan operasional peralatan IoT sawah.
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={openAddModal}
            className="bg-[#0b5924] hover:bg-[#073c18] text-white py-2.5 px-6 rounded-xl text-xs font-bold transition shadow-sm flex items-center gap-2 cursor-pointer"
          >
            <i className="bi bi-plus-circle"></i> Tambah Buku Panduan
          </button>
        )}
      </div>

      {/* Success Banner */}
      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-2xl flex items-center gap-2 animate-pulse">
          <i className="bi bi-check-circle-fill text-lg"></i>
          {successMsg}
        </div>
      )}

      {/* SEARCH BAR */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 flex items-center gap-3">
        <i className="bi bi-search text-gray-400"></i>
        <input
          type="text"
          placeholder="Cari buku panduan atau artikel edukasi..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full text-xs outline-none border-none bg-transparent font-semibold text-gray-700 placeholder-gray-400"
        />
      </div>

      {/* CONTENT AREA */}
      <div className="bg-white rounded-3xl border border-gray-150 p-6 md:p-8 shadow-sm">

        {/* LOADING STATE */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-3">
            <div className="flex space-x-1.5">
              <div className="w-2.5 h-2.5 bg-emerald-700 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2.5 h-2.5 bg-emerald-700 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2.5 h-2.5 bg-emerald-700 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
            </div>
            <span className="text-[10px] font-bold text-emerald-800 tracking-wider">Memuat materi edukasi...</span>
          </div>
        ) : filteredBooks.length === 0 ? (
          /* EMPTY STATE */
          <div className="text-center py-12 space-y-3">
            <div className="w-16 h-16 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mx-auto text-2xl">
              <i className="bi bi-journal-x"></i>
            </div>
            <h4 className="text-sm font-bold text-gray-700">Materi Edukasi Belum Tersedia</h4>
            <p className="text-xs text-gray-400 max-w-sm mx-auto">
              {searchQuery ? 'Tidak ada hasil pencarian yang cocok.' : 'Buku panduan dan materi edukasi belum ditambahkan oleh admin.'}
            </p>
          </div>
        ) : (
          /* BOOKS GRID */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks.map((book) => (
              <div key={book.id} className="border border-gray-100 bg-gray-50/50 rounded-3xl overflow-hidden flex flex-col justify-between p-4">
                <div className="space-y-3">
                  {/* Cover Image */}
                  <div className="h-40 bg-emerald-50 rounded-2xl flex items-center justify-center border border-emerald-100 overflow-hidden relative">
                    {book.cover_image ? (
                      <img
                        src={book.cover_image}
                        alt={book.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center space-y-1">
                        <i className="bi bi-book-half text-3xl text-emerald-700"></i>
                        <span className="text-[10px] font-bold text-emerald-800 uppercase block tracking-widest">E-BIO TANI</span>
                      </div>
                    )}
                    <span className="absolute top-3 left-3 bg-emerald-800 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Buku Panduan
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-sm text-gray-800 line-clamp-1">{book.title}</h4>
                    <p className="text-xs text-gray-400 line-clamp-3 leading-relaxed mt-1.5">
                      {book.description}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 mt-4 pt-3 border-t border-gray-200/50">
                  <a
                    href={book.file_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-white hover:bg-emerald-50 text-emerald-700 py-2 border border-emerald-100 rounded-xl text-[11px] font-bold transition text-center"
                  >
                    <i className="bi bi-box-arrow-up-right mr-1"></i> Buka
                  </a>

                  {isAdmin && (
                    <>
                      <button
                        onClick={() => openEditModal(book)}
                        className="flex-1 bg-white hover:bg-emerald-50 text-emerald-700 py-2 border border-emerald-100 rounded-xl text-[11px] font-bold transition cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(book.id)}
                        className="flex-1 bg-white hover:bg-red-50 text-red-600 py-2 border border-red-100 rounded-xl text-[11px] font-bold transition cursor-pointer"
                      >
                        Hapus
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* --- MODAL ADD/EDIT BUKU PANDUAN --- */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-xl border border-gray-100 overflow-y-auto max-h-[90vh]">
            <h3 className="font-extrabold text-base text-gray-800">{editingBook ? 'Edit Buku Panduan' : 'Tambah Buku Panduan'}</h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-gray-400 block mb-1">Judul Buku / Materi</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Buku Panduan Light Trap v2"
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  className="w-full bg-gray-50 border rounded-xl py-2.5 px-3 text-xs outline-none focus:border-[#0b5924]"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 block mb-1">Deskripsi Singkat</label>
                <textarea
                  rows="3"
                  required
                  placeholder="Tulis ringkasan isi buku atau materi edukasi..."
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  className="w-full bg-gray-50 border rounded-xl py-2.5 px-3 text-xs outline-none focus:border-[#0b5924] font-medium"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 block mb-1">Link File (PDF / Drive)</label>
                <input
                  type="url"
                  required
                  placeholder="Contoh: https://drive.google.com/..."
                  value={form.file_link}
                  onChange={e => setForm({ ...form, file_link: e.target.value })}
                  className="w-full bg-gray-50 border rounded-xl py-2.5 px-3 text-xs outline-none focus:border-[#0b5924]"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 block mb-1">Unggah Cover Buku (PNG/JPG/JPEG)</label>
                <label className="w-full flex items-center justify-center gap-2 border border-dashed border-gray-300 hover:border-emerald-600 rounded-xl py-3 px-4 text-xs font-semibold text-gray-600 cursor-pointer bg-gray-50/50 hover:bg-white transition-all">
                  <i className="bi bi-image text-emerald-700"></i>
                  <span>Pilih File Gambar</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => setForm({ ...form, cover_image: reader.result });
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
                {form.cover_image && (
                  <div className="mt-2 relative h-20 rounded-xl overflow-hidden border border-gray-100 max-w-xs">
                    <img src={form.cover_image} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
              <div className="flex gap-3 pt-3">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2.5 border rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-50 cursor-pointer">Batal</button>
                <button type="submit" className="flex-1 py-2.5 bg-[#0b5924] text-white rounded-xl text-xs font-bold hover:bg-emerald-800 cursor-pointer">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default Education;
