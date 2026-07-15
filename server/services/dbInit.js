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
        nama_lengkap VARCHAR(255) NULL,
        no_telp VARCHAR(20) NULL,
        asal_poktan VARCHAR(255) NULL,
        alamat VARCHAR(255) NULL,
        jenis_kelamin VARCHAR(20) NULL,
        is_verified TINYINT(1) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Tambah kolom ke tabel users jika belum ada (backward compatibility)
    try {
      await connection.query('ALTER TABLE users ADD COLUMN nama_lengkap VARCHAR(255) NULL');
    } catch (e) { /* ignore if column exists */ }
    try {
      await connection.query('ALTER TABLE users ADD COLUMN no_telp VARCHAR(20) NULL');
    } catch (e) { /* ignore if column exists */ }
    try {
      await connection.query('ALTER TABLE users ADD COLUMN asal_poktan VARCHAR(255) NULL');
    } catch (e) { /* ignore if column exists */ }
    try {
      await connection.query('ALTER TABLE users ADD COLUMN alamat VARCHAR(255) NULL');
    } catch (e) { /* ignore if column exists */ }
    try {
      await connection.query('ALTER TABLE users ADD COLUMN jenis_kelamin VARCHAR(20) NULL');
    } catch (e) { /* ignore if column exists */ }
    try {
      await connection.query('ALTER TABLE users ADD COLUMN is_verified TINYINT(1) DEFAULT 0');
    } catch (e) { /* ignore if column exists */ }




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
    
    // Buat tabel products jika belum ada (e-commerce anggota tani)
    await connection.query(`
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        address VARCHAR(255) NOT NULL,
        contact VARCHAR(20) NOT NULL,
        price VARCHAR(50) DEFAULT '0',
        image LONGTEXT NULL,
        is_active TINYINT(1) DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Migrasi kolom image tabel products agar bertipe LONGTEXT
    try {
      await connection.query('ALTER TABLE products MODIFY COLUMN image LONGTEXT NULL');
    } catch (e) { /* ignore */ }


    
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
