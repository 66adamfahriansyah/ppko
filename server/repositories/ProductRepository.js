class ProductRepository {
  constructor(pool) {
    this.pool = pool;
  }

  async findAllActive() {
    const [rows] = await this.pool.query(
      'SELECT p.*, u.username as owner_username, u.nama_lengkap as owner_name, u.asal_poktan as owner_poktan FROM products p JOIN users u ON p.user_id = u.id WHERE p.is_active = 1 AND u.is_verified = 1 ORDER BY p.created_at DESC'
    );
    return rows;
  }



  async findByUserId(userId) {
    const [rows] = await this.pool.query(
      'SELECT * FROM products WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
    return rows;
  }

  async findById(id) {
    const [rows] = await this.pool.query(
      'SELECT * FROM products WHERE id = ?',
      [id]
    );
    return rows[0] || null;
  }

  async create(productData) {
    const { userId, name, description, address, contact, price, image } = productData;
    const [result] = await this.pool.query(
      'INSERT INTO products (user_id, name, description, address, contact, price, image, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, 1)',
      [userId, name, description, address, contact, price, image || '']
    );
    return { id: result.insertId, ...productData, isActive: 1 };
  }

  async update(id, productData) {
    const { name, description, address, contact, price, image, isActive } = productData;
    const [result] = await this.pool.query(
      'UPDATE products SET name = ?, description = ?, address = ?, contact = ?, price = ?, image = ?, is_active = ? WHERE id = ?',
      [name, description, address, contact, price, image || '', isActive ? 1 : 0, id]
    );
    return result.affectedRows > 0;
  }

  async delete(id) {
    const [result] = await this.pool.query(
      'DELETE FROM products WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }
}

export default ProductRepository;
