class EducationRepository {
  constructor(pool) {
    this.pool = pool;
  }

  async findAll() {
    const [rows] = await this.pool.query(
      'SELECT * FROM education_books ORDER BY created_at DESC'
    );
    return rows;
  }

  async findById(id) {
    const [rows] = await this.pool.query(
      'SELECT * FROM education_books WHERE id = ?',
      [id]
    );
    return rows[0] || null;
  }

  async create(bookData) {
    const { title, description, file_link, cover_image, type } = bookData;
    const [result] = await this.pool.query(
      'INSERT INTO education_books (title, description, file_link, cover_image, type) VALUES (?, ?, ?, ?, ?)',
      [title, description, file_link, cover_image || '', type || 'panduan']
    );
    return { id: result.insertId, ...bookData };
  }

  async update(id, bookData) {
    const { title, description, file_link, cover_image, type } = bookData;
    const [result] = await this.pool.query(
      'UPDATE education_books SET title = ?, description = ?, file_link = ?, cover_image = ?, type = ? WHERE id = ?',
      [title, description, file_link, cover_image || '', type || 'panduan', id]
    );
    return result.affectedRows > 0;
  }

  async delete(id) {
    const [result] = await this.pool.query(
      'DELETE FROM education_books WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }
}

export default EducationRepository;
