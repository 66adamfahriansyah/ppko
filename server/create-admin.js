import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ppko',
});

async function createAdmin() {
  try {
    const connection = await pool.getConnection();
    console.log('🔄 Menghubungkan ke database...');

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

    const adminUsername = 'admin';
    const adminEmail = 'admin@ebio.com';
    const adminPassword = 'admin123';

    // Cek apakah admin sudah ada
    const [rows] = await connection.query('SELECT * FROM users WHERE username = ? OR email = ?', [adminUsername, adminEmail]);
    
    if (rows.length > 0) {
      console.log(`⚠️ Admin dengan username "${adminUsername}" atau email "${adminEmail}" sudah ada.`);
      // Update password & role just in case
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(adminPassword, salt);
      await connection.query(
        'UPDATE users SET password = ?, role = "admin" WHERE username = ? OR email = ?',
        [hashPassword, adminUsername, adminEmail]
      );
      console.log(`✅ Berhasil memperbarui password admin menjadi: ${adminPassword}`);
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(adminPassword, salt);
      await connection.query(
        'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
        [adminUsername, adminEmail, hashPassword, 'admin']
      );
      console.log(`✅ Berhasil membuat user admin baru!`);
      console.log(`   Username: ${adminUsername}`);
      console.log(`   Email: ${adminEmail}`);
      console.log(`   Password: ${adminPassword}`);
    }

    connection.release();
    process.exit(0);
  } catch (error) {
    console.error('❌ Gagal membuat user admin:', error.message);
    process.exit(1);
  }
}

createAdmin();
