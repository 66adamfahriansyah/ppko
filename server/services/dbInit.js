import bcrypt from 'bcryptjs';
import pool from '../config/db.js';

export async function initializeDatabase() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Terkoneksi ke database MySQL (XAMPP) dengan sukses.');

    // Buat tabel-tabel monitoring jika belum ada
    await connection.query(`
      CREATE TABLE IF NOT EXISTS plts_monitoring (
        id INT AUTO_INCREMENT PRIMARY KEY,
        voltage FLOAT DEFAULT 0.0,
        current FLOAT DEFAULT 0.0,
        battery INT DEFAULT 0,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS rain_monitoring (
        id INT AUTO_INCREMENT PRIMARY KEY,
        status VARCHAR(50) DEFAULT '-',
        detection VARCHAR(50) DEFAULT '-',
        intensity INT DEFAULT 0,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS light_trap_monitoring (
        id INT AUTO_INCREMENT PRIMARY KEY,
        active TINYINT(1) DEFAULT 0,
        trigger_mode VARCHAR(50) DEFAULT '-',
        duration INT DEFAULT 0,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS npk_monitoring (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nitrogen INT DEFAULT 0,
        phosphor INT DEFAULT 0,
        potassium INT DEFAULT 0,
        status VARCHAR(50) DEFAULT '-',
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS control_monitoring (
        id INT AUTO_INCREMENT PRIMARY KEY,
        auto_mode TINYINT(1) DEFAULT 0,
        manual_active TINYINT(1) DEFAULT 0,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Seed data awal jika kosong
    const seedTable = async (tableName, insertQuery) => {
      const [rows] = await connection.query(`SELECT COUNT(*) as count FROM \`${tableName}\``);
      if (rows[0].count === 0) {
        await connection.query(insertQuery);
        console.log(`🌱 Seeded initial row for ${tableName}.`);
      }
    };

    await seedTable('plts_monitoring', 'INSERT INTO plts_monitoring (id, voltage, current, battery) VALUES (1, 0.0, 0.0, 0)');
    await seedTable('rain_monitoring', "INSERT INTO rain_monitoring (id, status, detection, intensity) VALUES (1, '-', '-', 0)");
    await seedTable('light_trap_monitoring', "INSERT INTO light_trap_monitoring (id, active, trigger_mode, duration) VALUES (1, 0, '-', 0)");
    await seedTable('npk_monitoring', "INSERT INTO npk_monitoring (id, nitrogen, phosphor, potassium, status) VALUES (1, 0, 0, 0, '-')");
    await seedTable('control_monitoring', 'INSERT INTO control_monitoring (id, auto_mode, manual_active) VALUES (1, 0, 0)');

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

    // Tambah kolom user_id ke tabel manual_logs jika belum ada (backward compatibility)
    try {
      await connection.query('ALTER TABLE manual_logs ADD COLUMN user_id INT NULL');
    } catch (e) { /* ignore if column exists */ }
    try {
      await connection.query('ALTER TABLE manual_logs ADD CONSTRAINT fk_manual_logs_users FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL');
    } catch (e) { /* ignore if constraint exists */ }


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

    // Buat tabel education_books jika belum ada
    await connection.query(`
      CREATE TABLE IF NOT EXISTS education_books (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        file_link TEXT NOT NULL,
        cover_image LONGTEXT NULL,
        type VARCHAR(50) DEFAULT 'panduan',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Migrasi kolom type ke tabel education_books jika belum ada
    try {
      await connection.query("ALTER TABLE education_books ADD COLUMN type VARCHAR(50) DEFAULT 'panduan'");
    } catch (e) { /* ignore if column exists */ }

    // Migrasi kolom cover_image menjadi LONGTEXT jika masih TEXT
    try {
      await connection.query('ALTER TABLE education_books MODIFY COLUMN cover_image LONGTEXT NULL');
    } catch (e) { /* ignore */ }

    // Seed default education books jika tabel kosong
    const [bookRows] = await connection.query('SELECT COUNT(*) as count FROM education_books');
    if (bookRows[0].count === 0) {
      await connection.query(`
        INSERT INTO education_books (title, description, file_link, cover_image) VALUES 
        ('Buku Panduan E-BIO PENS v1.0', 'Panduan teknis pengoperasian alat monitoring sawah berbasis IoT E-BIO PENS untuk petani.', 'https://example.com/panduan-ebio.pdf', ''),
        ('Budidaya Padi Organik Ramah Lingkungan', 'Buku panduan mengenai budidaya padi secara organik, mengurangi bahan kimia, dan meningkatkan kesehatan tanah.', 'https://example.com/padi-organik.pdf', ''),
        ('Pengendalian Hama Terpadu (PHT)', 'Konsep pengendalian hama menggunakan Light Trap mekanis untuk meminimalkan kerugian hasil panen.', 'https://example.com/pht-light-trap.pdf', '')
      `);
      console.log('🌱 Seeded default education books.');
    }



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
