class UserRepository {
  constructor(pool) {
    this.pool = pool;
  }

  async findByEmailOrUsername(identity) {
    const [rows] = await this.pool.query(
      'SELECT * FROM users WHERE (email = ? OR username = ?)',
      [identity, identity]
    );
    return rows[0] || null;
  }

  async findById(id) {
    const [rows] = await this.pool.query(
      'SELECT * FROM users WHERE id = ?',
      [id]
    );
    return rows[0] || null;
  }

  async create(username, email, hashPassword, namaLengkap, noTelp, asalPoktan, alamat, jenisKelamin) {
    const [result] = await this.pool.query(
      'INSERT INTO users (username, email, password, role, nama_lengkap, no_telp, asal_poktan, alamat, jenis_kelamin) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [username, email, hashPassword, 'user', namaLengkap || null, noTelp || null, asalPoktan || null, alamat || null, jenisKelamin || null]
    );
    return { 
      id: result.insertId, 
      username, 
      email, 
      role: 'user',
      nama_lengkap: namaLengkap,
      no_telp: noTelp,
      asal_poktan: asalPoktan,
      alamat,
      jenis_kelamin: jenisKelamin,
      is_verified: 0
    };
  }

  async findUnverified() {
    const [rows] = await this.pool.query(
      "SELECT id, username, email, role, nama_lengkap, no_telp, asal_poktan, alamat, jenis_kelamin, is_verified, created_at FROM users WHERE role = 'user' AND is_verified = 0 ORDER BY created_at DESC"
    );
    return rows;
  }

  async verifyUser(id) {
    const [result] = await this.pool.query(
      'UPDATE users SET is_verified = 1 WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }

  async updateActiveStatus(id, isActive) {
    const [result] = await this.pool.query(
      'UPDATE users SET is_active = ? WHERE id = ?',
      [isActive ? 1 : 0, id]
    );
    return result.affectedRows > 0;
  }

}

export default UserRepository;
