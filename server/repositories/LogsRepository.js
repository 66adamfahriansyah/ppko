class LogsRepository {
  constructor(pool) {
    this.pool = pool;
  }

  async getAll() {
    // Join with users to see who created the log (confidentiality and audit trails)
    const [rows] = await this.pool.query(`
      SELECT ml.*, u.username as creator 
      FROM manual_logs ml
      LEFT JOIN users u ON ml.user_id = u.id
      ORDER BY ml.tanggal DESC, ml.id DESC
    `);
    return rows;
  }

  async create(userId, logData) {
    const { tanggal, lokasi, hama, pestisida, catatan } = logData;
    const [result] = await this.pool.query(
      'INSERT INTO manual_logs (user_id, tanggal, lokasi, hama, pestisida, catatan) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, tanggal, lokasi, hama, pestisida, catatan || '-']
    );
    return result.insertId;
  }
}

export default LogsRepository;
