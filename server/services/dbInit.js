import bcrypt from 'bcryptjs';
import pool from '../config/db.js';

export async function initializeDatabase() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Terkoneksi ke database MySQL (XAMPP) dengan sukses.');
    
    // Buat tabel users jika belum ada
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) NOT NULL UNIQUE,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Buat tabel manual_logs jika belum ada
    await connection.query(`
      CREATE TABLE IF NOT EXISTS manual_logs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        tanggal DATE NOT NULL,
        lokasi VARCHAR(100) NOT NULL,
        hama VARCHAR(100) NOT NULL,
        pestisida VARCHAR(50) NOT NULL,
        catatan TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
    
    // Seed default logs jika tabel manual_logs kosong
    const [logRows] = await connection.query('SELECT COUNT(*) as count FROM manual_logs');
    if (logRows[0].count === 0) {
      await connection.query(`
        INSERT INTO manual_logs (tanggal, lokasi, hama, pestisida, catatan) VALUES 
        ('2026-06-01', 'Tiang A-01 (Sektor Utara)', '100 Ekor Ngengat', '30%', 'Normal'),
        ('2026-06-02', 'Tiang A-02 (Sektor Timur)', '120 Ekor Ngengat', '35%', 'Kondisi stabil'),
        ('2026-06-03', 'Tiang B-01 (Sektor Selatan)', '110 Ekor Ngengat', '38%', 'Normal'),
        ('2026-06-04', 'Tiang A-01 (Sektor Utara)', '154 Ekor Ngengat', '40%', 'Pertumbuhan daun normal')
      `);
      console.log('🌱 Seeded default manual logs.');
    }
    
    // Buat admin bawaan jika tabel users kosong
    const [rows] = await connection.query('SELECT COUNT(*) as count FROM users');
    if (rows[0].count === 0) {
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash('admin123', salt);
      await connection.query(
        'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
        ['admin', 'admin@ebio.com', hashPassword, 'admin']
      );
      console.log('🌱 Seeded default admin: admin@ebio.com / admin123');
    }
    
    connection.release();
  } catch (err) {
    console.error('❌ Gagal terkoneksi atau menginisialisasi database MySQL:', err.message);
  }
}
