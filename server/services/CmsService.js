import AppError from '../utils/AppError.js';

class CmsService {
  constructor(cmsRepository) {
    this.cmsRepository = cmsRepository;
  }

  // Get full landing page public content
  async getPublicData() {
    return await this.cmsRepository.getFullLandingPageData();
  }

  // Get all CMS items (for admin panel, including inactive/draft items)
  async getAdminAllData() {
    const [hero, komoditas, marketplace, about, kontak] = await Promise.all([
      this.cmsRepository.getHero(),
      this.cmsRepository.getAllKomoditas(),
      this.cmsRepository.getAllMarketplace(),
      this.cmsRepository.getAbout(),
      this.cmsRepository.getAllKontak()
    ]);

    return {
      hero: {
        title: hero?.title || '',
        subtitle: hero?.subtitle || '',
        bgImage: hero?.bg_image || ''
      },
      komoditas: komoditas.map(k => ({
        id: k.id.toString(),
        bulan: k.bulan,
        tonase: k.tonase,
        kualitas: k.kualitas,
        luas: k.luas,
        gambar: k.gambar,
        isActive: k.is_active === 1,
        sortOrder: k.sort_order
      })),
      marketplace: marketplace.map(m => ({
        id: m.id.toString(),
        nama: m.nama,
        harga: m.harga,
        satuan: m.satuan,
        deskripsi: m.deskripsi,
        petani: m.petani,
        whatsapp: m.whatsapp,
        gambar: m.gambar,
        status: m.is_active === 1,
        sortOrder: m.sort_order
      })),
      about: {
        cerita: about?.cerita || '',
        kontak: kontak.map(c => ({
          id: c.id.toString(),
          poktan: c.poktan,
          ketua: c.ketua,
          alamat: c.alamat,
          telepon: c.telepon
        }))
      }
    };
  }

  // --- HERO ---
  async updateHero(title, subtitle, bgImage, adminId) {
    if (!title || !subtitle) {
      throw new AppError('Judul utama dan sub-judul wajib diisi', 400);
    }
    const success = await this.cmsRepository.updateHero(title, subtitle, bgImage || '', adminId);
    if (!success) {
      throw new AppError('Gagal memperbarui banner hero', 500);
    }
    return { success: true, message: 'Banner hero berhasil diperbarui' };
  }

  // --- KOMODITAS ---
  async createKomoditas(data) {
    const { bulan, tonase, kualitas, luas, gambar } = data;
    if (!bulan || !tonase || !kualitas || !luas || !gambar) {
      throw new AppError('Bulan, total tonase, kualitas, luas lahan, dan link gambar wajib diisi', 400);
    }
    const id = await this.cmsRepository.createKomoditas(data);
    return { success: true, id };
  }

  async updateKomoditas(id, data) {
    if (!id) throw new AppError('ID komoditas tidak valid', 400);
    const { bulan, tonase, kualitas, luas, gambar } = data;
    if (!bulan || !tonase || !kualitas || !luas || !gambar) {
      throw new AppError('Bulan, total tonase, kualitas, luas lahan, dan link gambar wajib diisi', 400);
    }
    const success = await this.cmsRepository.updateKomoditas(id, data);
    if (!success) throw new AppError('Komoditas tidak ditemukan atau gagal diperbarui', 404);
    return { success: true };
  }

  async deleteKomoditas(id) {
    if (!id) throw new AppError('ID komoditas tidak valid', 400);
    const success = await this.cmsRepository.deleteKomoditas(id);
    if (!success) throw new AppError('Komoditas tidak ditemukan atau gagal dihapus', 404);
    return { success: true };
  }

  // --- MARKETPLACE ---
  async createMarketplace(data) {
    const { nama, harga, satuan, deskripsi, petani, whatsapp, gambar } = data;
    if (!nama || !harga || !satuan || !deskripsi || !petani || !whatsapp || !gambar) {
      throw new AppError('Semua field produk wajib diisi', 400);
    }

    if (!whatsapp.startsWith('62')) {
      throw new AppError('Nomor WhatsApp harus diawali dengan kode negara 62', 400);
    }

    const id = await this.cmsRepository.createMarketplace(data);
    return { success: true, id };
  }

  async updateMarketplace(id, data) {
    if (!id) throw new AppError('ID produk tidak valid', 400);
    const { nama, harga, satuan, deskripsi, petani, whatsapp, gambar } = data;
    if (!nama || !harga || !satuan || !deskripsi || !petani || !whatsapp || !gambar) {
      throw new AppError('Semua field produk wajib diisi', 400);
    }

    if (!whatsapp.startsWith('62')) {
      throw new AppError('Nomor WhatsApp harus diawali dengan kode negara 62', 400);
    }

    const success = await this.cmsRepository.updateMarketplace(id, data);
    if (!success) throw new AppError('Produk tidak ditemukan atau gagal diperbarui', 404);
    return { success: true };
  }

  async deleteMarketplace(id) {
    if (!id) throw new AppError('ID produk tidak valid', 400);
    const success = await this.cmsRepository.deleteMarketplace(id);
    if (!success) throw new AppError('Produk tidak ditemukan atau gagal dihapus', 404);
    return { success: true };
  }

  // --- ABOUT ---
  async updateAbout(cerita, adminId) {
    if (!cerita || cerita.length < 10) {
      throw new AppError('Cerita/Narasi tentang poktan minimal 10 karakter', 400);
    }
    const success = await this.cmsRepository.updateAbout(cerita, adminId);
    if (!success) {
      throw new AppError('Gagal memperbarui narasi tentang poktan', 500);
    }
    return { success: true, message: 'Narasi tentang poktan berhasil diperbarui' };
  }

  // --- KONTAK ---
  async createKontak(data) {
    const { poktan, ketua, alamat, telepon } = data;
    if (!poktan || !ketua || !alamat || !telepon) {
      throw new AppError('Nama kelompok, nama ketua, alamat, dan nomor telepon wajib diisi', 400);
    }

    if (!telepon.startsWith('62')) {
      throw new AppError('Nomor telepon harus diawali dengan kode negara 62', 400);
    }

    const id = await this.cmsRepository.createKontak(data);
    return { success: true, id };
  }

  async updateKontak(id, data) {
    if (!id) throw new AppError('ID kontak tidak valid', 400);
    const { poktan, ketua, alamat, telepon } = data;
    if (!poktan || !ketua || !alamat || !telepon) {
      throw new AppError('Nama kelompok, nama ketua, alamat, dan nomor telepon wajib diisi', 400);
    }

    if (!telepon.startsWith('62')) {
      throw new AppError('Nomor telepon harus diawali dengan kode negara 62', 400);
    }

    const success = await this.cmsRepository.updateKontak(id, data);
    if (!success) throw new AppError('Kontak tidak ditemukan atau gagal diperbarui', 404);
    return { success: true };
  }

  async deleteKontak(id) {
    if (!id) throw new AppError('ID kontak tidak valid', 400);
    const success = await this.cmsRepository.deleteKontak(id);
    if (!success) throw new AppError('Kontak tidak ditemukan atau gagal dihapus', 404);
    return { success: true };
  }
}

export default CmsService;
