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

  async create(username, email, hashPassword) {
    const [result] = await this.pool.query(
      'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
      [username, email, hashPassword, 'user']
    );
    return { id: result.insertId, username, email, role: 'user' };
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
