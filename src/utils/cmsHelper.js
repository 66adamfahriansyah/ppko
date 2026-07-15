const DEFAULT_CMS_DATA = {
  hero: {
    title: "Pertanian Bawang Merah di Desa Sajen",
    subtitle: "Menggabungkan kearifan lokal bertani Mojokerto dengan inovasi teknologi IoT untuk hasil panen yang maksimal.",
    bgImage: "https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&q=80&w=1200"
  },
  komoditas: [
    {
      id: "1",
      bulan: "Juni 2026",
      tonase: "14.5 Ton",
      kualitas: "Super (Grade A)",
      luas: "1.2 Hektar",
      gambar: "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&q=80&w=600"
    },
    {
      id: "2",
      bulan: "April 2026",
      tonase: "11.2 Ton",
      kualitas: "Standar (Grade B)",
      luas: "0.9 Hektar",
      gambar: "https://images.unsplash.com/photo-1508747703725-719ae2c73ee8?auto=format&fit=crop&q=80&w=600"
    },
    {
      id: "3",
      bulan: "Februari 2026",
      tonase: "15.1 Ton",
      kualitas: "Super (Grade A)",
      luas: "1.3 Hektar",
      gambar: "https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&q=80&w=600"
    }
  ],
  marketplace: [
    {
      id: "1",
      nama: "Bawang Merah Bibit Unggul",
      harga: "35.000",
      satuan: "kg",
      deskripsi: "Bibit bawang merah varietas Tajuk asli Desa Sajen, Pacet. Kering gaskeb (jemur matahari 14 hari), siap tanam.",
      petani: "Poktan Tani Makmur (Pak Subur)",
      whatsapp: "6281234567890",
      gambar: "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&q=80&w=600",
      status: true
    },
    {
      id: "2",
      nama: "Bawang Merah Konsumsi Super",
      harga: "28.000",
      satuan: "kg",
      deskripsi: "Bawang merah segar hasil panen langsung dari Demplot Sajen. Ukuran sedang-besar, aroma kuat, dan segar.",
      petani: "Taruna Tani Sajen",
      whatsapp: "6285711223344",
      gambar: "https://images.unsplash.com/photo-1508747703725-719ae2c73ee8?auto=format&fit=crop&q=80&w=600",
      status: true
    }
  ],
  about: {
    cerita: "Kelompok Tani Desa Sajen, Pacet, Mojokerto berkomitmen mengembangkan budidaya pertanian bawang merah ramah lingkungan dengan pemanfaatan teknologi IoT (Internet of Things). Berlokasi di lereng gunung dengan elevasi 600mdpl, tanah vulkanik yang subur dipadukan dengan pemantauan nutrisi NPK real-time serta otomatisasi perangkap hama (Light Trap) bertenaga surya (PLTS), menghasilkan produk pertanian unggul dan sehat bagi konsumen.",
    kontak: [
      {
        id: "1",
        poktan: "Kelompok Tani Makmur Utama",
        ketua: "Bapak H. Sukardi",
        alamat: "Dusun Sajen RT 02 RW 01, Pacet, Mojokerto",
        telepon: "6281234567890"
      },
      {
        id: "2",
        poktan: "Taruna Tani E-Bio Sajen",
        ketua: "Mas Rian Kurniawan",
        alamat: "Area Demplot Sektor Utara, Desa Sajen, Mojokerto",
        telepon: "6285711223344"
      }
    ]
  }
};

const STORAGE_KEY = 'ebio_cms_data';

export function getCmsData() {
  if (typeof window === 'undefined') return DEFAULT_CMS_DATA;
  
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_CMS_DATA));
    return DEFAULT_CMS_DATA;
  }
  
  try {
    return JSON.parse(saved);
  } catch (e) {
    console.error("Gagal membaca CMS data dari localStorage:", e);
    return DEFAULT_CMS_DATA;
  }
}

export function saveCmsData(data) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
