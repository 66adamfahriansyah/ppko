class CmsRepository {
  constructor(pool) {
    this.pool = pool;
  }

  // --- HERO ---
  async getHero() {
    const [rows] = await this.pool.query('SELECT * FROM cms_hero WHERE id = 1');
    return rows[0] || null;
  }

  async updateHero(title, subtitle, bgImage, adminId) {
    const [result] = await this.pool.query(
      'UPDATE cms_hero SET title = ?, subtitle = ?, bg_image = ?, updated_by = ? WHERE id = 1',
      [title, subtitle, bgImage, adminId]
    );
    return result.affectedRows > 0;
  }

  // --- KOMODITAS ---
  async getAllKomoditas() {
    const [rows] = await this.pool.query('SELECT * FROM cms_komoditas ORDER BY sort_order ASC, id DESC');
    return rows;
  }

  async getActiveKomoditas() {
    const [rows] = await this.pool.query('SELECT * FROM cms_komoditas WHERE is_active = 1 ORDER BY sort_order ASC, id DESC');
    return rows;
  }

  async createKomoditas(data) {
    const { bulan, tonase, kualitas, luas, gambar, isActive, sortOrder } = data;
    const [result] = await this.pool.query(
      'INSERT INTO cms_komoditas (bulan, tonase, kualitas, luas, gambar, is_active, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [bulan, tonase, kualitas, luas, gambar, isActive !== undefined ? (isActive ? 1 : 0) : 1, sortOrder || 0]
    );
    return result.insertId;
  }

  async updateKomoditas(id, data) {
    const { bulan, tonase, kualitas, luas, gambar, isActive, sortOrder } = data;
    const [result] = await this.pool.query(
      'UPDATE cms_komoditas SET bulan = ?, tonase = ?, kualitas = ?, luas = ?, gambar = ?, is_active = ?, sort_order = ? WHERE id = ?',
      [bulan, tonase, kualitas, luas, gambar, isActive ? 1 : 0, sortOrder || 0, id]
    );
    return result.affectedRows > 0;
  }

  async deleteKomoditas(id) {
    const [result] = await this.pool.query('DELETE FROM cms_komoditas WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  // --- MARKETPLACE ---
  async getAllMarketplace() {
    const [rows] = await this.pool.query('SELECT * FROM cms_marketplace ORDER BY sort_order ASC, id DESC');
    return rows;
  }

  async getActiveMarketplace() {
    const [rows] = await this.pool.query('SELECT * FROM cms_marketplace WHERE is_active = 1 ORDER BY sort_order ASC, id DESC');
    return rows;
  }

  async createMarketplace(data) {
    const { nama, harga, satuan, deskripsi, petani, whatsapp, gambar, isActive, sortOrder } = data;
    const [result] = await this.pool.query(
      'INSERT INTO cms_marketplace (nama, harga, satuan, deskripsi, petani, whatsapp, gambar, is_active, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [nama, harga, satuan, deskripsi, petani, whatsapp, gambar, isActive !== undefined ? (isActive ? 1 : 0) : 1, sortOrder || 0]
    );
    return result.insertId;
  }

  async updateMarketplace(id, data) {
    const { nama, harga, satuan, deskripsi, petani, whatsapp, gambar, isActive, sortOrder } = data;
    const [result] = await this.pool.query(
      'UPDATE cms_marketplace SET nama = ?, harga = ?, satuan = ?, deskripsi = ?, petani = ?, whatsapp = ?, gambar = ?, is_active = ?, sort_order = ? WHERE id = ?',
      [nama, harga, satuan, deskripsi, petani, whatsapp, gambar, isActive ? 1 : 0, sortOrder || 0, id]
    );
    return result.affectedRows > 0;
  }

  async deleteMarketplace(id) {
    const [result] = await this.pool.query('DELETE FROM cms_marketplace WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  // --- ABOUT ---
  async getAbout() {
    const [rows] = await this.pool.query('SELECT * FROM cms_about WHERE id = 1');
    return rows[0] || null;
  }

  async updateAbout(cerita, adminId) {
    const [result] = await this.pool.query(
      'UPDATE cms_about SET cerita = ?, updated_by = ? WHERE id = 1',
      [cerita, adminId]
    );
    return result.affectedRows > 0;
  }

  // --- KONTAK POKTAN ---
  async getAllKontak() {
    const [rows] = await this.pool.query('SELECT * FROM cms_kontak WHERE is_active = 1 ORDER BY id ASC');
    return rows;
  }

  async createKontak(data) {
    const { poktan, ketua, alamat, telepon } = data;
    const [result] = await this.pool.query(
      'INSERT INTO cms_kontak (poktan, ketua, alamat, telepon) VALUES (?, ?, ?, ?)',
      [poktan, ketua, alamat, telepon]
    );
    return result.insertId;
  }

  async updateKontak(id, data) {
    const { poktan, ketua, alamat, telepon } = data;
    const [result] = await this.pool.query(
      'UPDATE cms_kontak SET poktan = ?, ketua = ?, alamat = ?, telepon = ? WHERE id = ?',
      [poktan, ketua, alamat, telepon, id]
    );
    return result.affectedRows > 0;
  }

  async deleteKontak(id) {
    const [result] = await this.pool.query('DELETE FROM cms_kontak WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  // --- FULL LANDING PAGE DATA ---
  async getFullLandingPageData() {
    const [hero, komoditas, marketplace, about, kontak] = await Promise.all([
      this.getHero(),
      this.getActiveKomoditas(),
      this.getActiveMarketplace(),
      this.getAbout(),
      this.getAllKontak()
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
        gambar: k.gambar
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
        status: m.is_active === 1
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
}

export default CmsRepository;
