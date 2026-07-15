# Dokumen Desain Backend (backend1.md)

Dokumen ini adalah **panduan lengkap tingkat tinggi** untuk membangun ulang dan memperkuat arsitektur backend aplikasi E-BIO PENS. Dokumen ditulis agar model AI yang lebih murah sekalipun dapat memahami dan mengimplementasikannya secara akurat.

> **Konteks Proyek:** Aplikasi monitoring pertanian IoT bawang merah Desa Sajen, Mojokerto. Stack backend menggunakan **Node.js + Express.js + MySQL (XAMPP)**. Frontend menggunakan React + Vite.

---

## DAFTAR ISI

1. [Prinsip Keamanan (OWASP Top 10 & CIA Triad)](#1-prinsip-keamanan-owasp-top-10--cia-triad)
2. [Arsitektur OOP & Struktur Folder](#2-arsitektur-oop--struktur-folder)
3. [Skema Database Lengkap](#3-skema-database-lengkap)
4. [Konfigurasi Environment](#4-konfigurasi-environment)
5. [Class-Class Utama (OOP)](#5-class-class-utama-oop)
6. [Middleware Pipeline](#6-middleware-pipeline)
7. [Endpoint API Lengkap](#7-endpoint-api-lengkap)
8. [Alur Kerja (Flow) Utama](#8-alur-kerja-flow-utama)
9. [Checklist Keamanan](#9-checklist-keamanan)

---

## 1. Prinsip Keamanan (OWASP Top 10 & CIA Triad)

### 1.1 CIA Triad (Diterapkan di Setiap Layer)

| Prinsip               | Arti                                   | Cara Penerapan di Proyek Ini                                                                                                     |
| :--------------------- | :-------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------- |
| **Confidentiality**    | Data hanya bisa diakses yang berhak     | JWT untuk autentikasi sesi, bcrypt untuk hash password, role-based access (admin vs user), env variable untuk secret              |
| **Integrity**          | Data tidak bisa diubah tanpa otorisasi  | Validasi input di setiap endpoint, parameterized query (anti SQL Injection), middleware otorisasi sebelum operasi tulis           |
| **Availability**       | Sistem tetap bisa diakses               | Rate limiting untuk cegah DDoS/brute-force, connection pooling MySQL, error handling global agar server tidak crash               |

### 1.2 OWASP Top 10 — Langkah Mitigasi

| #  | Ancaman OWASP                        | Solusi yang Diterapkan                                                                                     |
| :- | :----------------------------------- | :--------------------------------------------------------------------------------------------------------- |
| 1  | **Broken Access Control**            | Middleware `authenticateToken` (cek JWT) dan `authorizeRole('admin')` di setiap rute sensitif               |
| 2  | **Cryptographic Failures**           | Password di-hash pakai `bcrypt` (salt 12 round). Secret JWT disimpan di `.env`, bukan di kode              |
| 3  | **Injection (SQL Injection)**        | Seluruh query MySQL menggunakan **parameterized query** (`?` placeholder), TIDAK pernah string concat      |
| 4  | **Insecure Design**                  | Arsitektur berlapis (Controller → Service → Repository). Validasi terjadi di Service layer                 |
| 5  | **Security Misconfiguration**        | CORS dibatasi ke origin frontend saja. Helmet.js untuk HTTP security headers. `.env` masuk `.gitignore`    |
| 6  | **Vulnerable Components**            | Pakai versi terbaru dependency. Tambahkan script `npm audit` di pipeline                                   |
| 7  | **Auth Failures**                    | JWT token punya masa kadaluwarsa (`expiresIn`). Rate limiter pada endpoint login untuk cegah brute-force   |
| 8  | **Software & Data Integrity**        | Token JWT di-sign pakai secret kuat. Validasi payload JWT di setiap request                                |
| 9  | **Logging & Monitoring Failures**    | Middleware logging global mencatat setiap request beserta IP, method, path, dan timestamp                  |
| 10 | **SSRF (Server Side Request Forgery)** | Tidak ada endpoint yang menerima URL eksternal untuk di-fetch oleh server                                  |

---

## 2. Arsitektur OOP & Struktur Folder

### 2.1 Pola Arsitektur: 3-Layer (Controller → Service → Repository)

```
┌───────────────────────────────────────────────────────┐
│  REQUEST masuk dari Frontend / ESP32                  │
│                  ↓                                    │
│  [Middleware Pipeline]                                │
│    1. helmet()         → Security Headers             │
│    2. cors()           → Batasi origin                │
│    3. rateLimiter()    → Anti brute-force             │
│    4. express.json()   → Parse body JSON              │
│    5. requestLogger()  → Catat log request            │
│                  ↓                                    │
│  [Router]  → Memetakan URL ke Controller              │
│                  ↓                                    │
│  [Controller]  → Terima request, panggil Service      │
│                  ↓                                    │
│  [Service]     → Logika bisnis, validasi data         │
│                  ↓                                    │
│  [Repository]  → Query database (parameterized)       │
│                  ↓                                    │
│  [MySQL Pool]  → Database                             │
└───────────────────────────────────────────────────────┘
```

**Penjelasan singkat konsep OOP yang dipakai:**
- **Encapsulation:** Setiap class (Service, Repository) menyembunyikan detail internalnya. Controller tidak perlu tahu cara query SQL ditulis.
- **Single Responsibility:** Setiap class hanya punya satu tugas. `AuthService` hanya urus logika auth, `UserRepository` hanya urus query tabel `users`.
- **Separation of Concerns:** Controller urus HTTP (req/res), Service urus logika bisnis, Repository urus akses database.

### 2.2 Struktur Folder Baru

```
server/
├── .env                          # Variabel rahasia (TIDAK masuk Git)
├── .env.example                  # Contoh variabel (masuk Git)
├── package.json
├── server.js                     # Entry point: setup Express & jalankan server
│
├── config/
│   └── db.js                     # Konfigurasi MySQL connection pool
│
├── middleware/
│   ├── authMiddleware.js          # authenticateToken() & authorizeRole()
│   ├── rateLimiter.js             # Rate limiting per IP
│   ├── requestLogger.js           # Logging setiap request masuk
│   └── errorHandler.js            # Global error handler
│
├── repositories/                  # (BARU) Layer akses database
│   ├── UserRepository.js          # Query tabel `users`
│   ├── MonitoringRepository.js    # Query tabel sensor IoT
│   ├── LogsRepository.js          # Query tabel `manual_logs`
│   └── CmsRepository.js          # (BARU) Query tabel CMS (landing page)
│
├── services/                      # (BARU) Layer logika bisnis
│   ├── dbInit.js                  # Inisialisasi tabel + seed data
│   ├── AuthService.js             # Logika login, register, hash password
│   ├── MonitoringService.js       # Logika format data sensor
│   ├── LogsService.js             # Logika validasi log manual
│   └── CmsService.js             # (BARU) Logika validasi konten CMS
│
├── controllers/                   # Layer HTTP handler
│   ├── authController.js          # Handle /api/auth/*
│   ├── monitoringController.js    # Handle /api/monitoring/*
│   ├── logsController.js          # Handle /api/logs/*
│   └── cmsController.js          # (BARU) Handle /api/cms/*
│
├── routes/
│   ├── authRoutes.js
│   ├── monitoringRoutes.js
│   ├── logsRoutes.js
│   └── cmsRoutes.js              # (BARU) Rute CMS
│
└── utils/
    └── AppError.js                # (BARU) Custom error class
```

---

## 3. Skema Database Lengkap

### 3.1 Tabel yang Sudah Ada (Tidak Diubah Struktur Kolomnya)

Tabel-tabel sensor IoT berikut **tidak berubah** dari `monitoring.sql` yang sudah ada:

| Tabel                    | Fungsi                              |
| :----------------------- | :---------------------------------- |
| `plts_monitoring`        | Data PLTS (voltage, current, battery) |
| `rain_monitoring`        | Data sensor hujan                   |
| `light_trap_monitoring`  | Data perangkap cahaya               |
| `npk_monitoring`         | Data nutrisi tanah NPK              |
| `control_monitoring`     | Status kontrol (auto/manual)        |

### 3.2 Tabel `users` — Diperkuat

Tabel users yang sudah ada **ditambahkan kolom `is_active`** untuk menonaktifkan akun tanpa menghapusnya (soft-disable), mendukung prinsip Integrity.

```sql
CREATE TABLE IF NOT EXISTS `users` (
  `id`         INT AUTO_INCREMENT PRIMARY KEY,
  `username`   VARCHAR(100)  NOT NULL UNIQUE,
  `email`      VARCHAR(100)  NOT NULL UNIQUE,
  `password`   VARCHAR(255)  NOT NULL,          -- Hash bcrypt (12 salt rounds)
  `role`       ENUM('admin', 'user') DEFAULT 'user',  -- ENUM lebih aman dari VARCHAR bebas
  `is_active`  TINYINT(1)    DEFAULT 1,         -- (BARU) 1=aktif, 0=nonaktif
  `created_at` TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

**Perubahan dari versi lama:**
- `role` diubah dari `VARCHAR(50)` menjadi `ENUM('admin', 'user')` → mencegah role sembarangan.
- Ditambahkan kolom `is_active` → admin bisa menonaktifkan akun tanpa menghapus data.
- Ditambahkan `updated_at` → jejak audit terakhir kali data diubah.

### 3.3 Tabel `manual_logs` — Diperkuat

```sql
CREATE TABLE IF NOT EXISTS `manual_logs` (
  `id`         INT AUTO_INCREMENT PRIMARY KEY,
  `user_id`    INT           NOT NULL,           -- (BARU) Siapa yang input log ini
  `tanggal`    DATE          NOT NULL,
  `lokasi`     VARCHAR(100)  NOT NULL,
  `hama`       VARCHAR(100)  NOT NULL,
  `pestisida`  VARCHAR(50)   NOT NULL,
  `catatan`    TEXT,
  `created_at` TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

**Perubahan:**
- Ditambahkan `user_id` + Foreign Key → kita tahu siapa yang menulis log (akuntabilitas = Integrity).

### 3.4 Tabel CMS Baru (Landing Page)

Data landing page saat ini tersimpan di `localStorage` browser. Untuk mendukung prinsip **Availability** (data tidak hilang kalau cache browser dihapus) dan **Integrity** (hanya admin yang bisa ubah), data CMS dipindahkan ke database server.

#### 3.4.1 Tabel `cms_hero`
Menyimpan konten banner utama landing page. Hanya ada 1 baris (singleton).

```sql
CREATE TABLE IF NOT EXISTS `cms_hero` (
  `id`         INT AUTO_INCREMENT PRIMARY KEY,
  `title`      VARCHAR(255)  NOT NULL DEFAULT 'Pertanian Bawang Merah di Desa Sajen',
  `subtitle`   TEXT          NOT NULL,
  `bg_image`   VARCHAR(500)  NOT NULL DEFAULT '',  -- URL gambar latar
  `updated_at` TIMESTAMP     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` INT,                                -- ID admin yang terakhir mengubah
  FOREIGN KEY (`updated_by`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

#### 3.4.2 Tabel `cms_komoditas`
Menyimpan item-item slider hasil panen bawang merah.

```sql
CREATE TABLE IF NOT EXISTS `cms_komoditas` (
  `id`         INT AUTO_INCREMENT PRIMARY KEY,
  `bulan`      VARCHAR(100)  NOT NULL,             -- Contoh: "Juni 2026"
  `tonase`     VARCHAR(50)   NOT NULL,             -- Contoh: "14.5 Ton"
  `kualitas`   ENUM('Super (Grade A)', 'Standar (Grade B)', 'Rendah (Grade C)') DEFAULT 'Super (Grade A)',
  `luas`       VARCHAR(50)   NOT NULL,             -- Contoh: "1.2 Hektar"
  `gambar`     VARCHAR(500)  NOT NULL DEFAULT '',  -- URL gambar
  `is_active`  TINYINT(1)    DEFAULT 1,            -- 1=tampil di slider, 0=tersembunyi
  `sort_order` INT           DEFAULT 0,            -- Urutan tampil di carousel
  `created_at` TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

#### 3.4.3 Tabel `cms_marketplace`
Menyimpan produk dagangan kelompok tani beserta link WhatsApp.

```sql
CREATE TABLE IF NOT EXISTS `cms_marketplace` (
  `id`         INT AUTO_INCREMENT PRIMARY KEY,
  `nama`       VARCHAR(200)  NOT NULL,             -- Nama produk
  `harga`      VARCHAR(50)   NOT NULL,             -- Harga format string "28.000"
  `satuan`     VARCHAR(30)   NOT NULL DEFAULT 'kg',
  `deskripsi`  TEXT          NOT NULL,
  `petani`     VARCHAR(200)  NOT NULL,             -- Nama petani/poktan
  `whatsapp`   VARCHAR(20)   NOT NULL,             -- Nomor WA format "628xxx"
  `gambar`     VARCHAR(500)  NOT NULL DEFAULT '',
  `is_active`  TINYINT(1)    DEFAULT 1,            -- 1=tayang, 0=draft/sembunyi
  `sort_order` INT           DEFAULT 0,
  `created_at` TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

#### 3.4.4 Tabel `cms_about`
Menyimpan narasi cerita tentang kelompok tani. Singleton (1 baris).

```sql
CREATE TABLE IF NOT EXISTS `cms_about` (
  `id`         INT AUTO_INCREMENT PRIMARY KEY,
  `cerita`     TEXT          NOT NULL,
  `updated_at` TIMESTAMP     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` INT,
  FOREIGN KEY (`updated_by`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

#### 3.4.5 Tabel `cms_kontak`
Menyimpan direktori kontak kelompok tani.

```sql
CREATE TABLE IF NOT EXISTS `cms_kontak` (
  `id`         INT AUTO_INCREMENT PRIMARY KEY,
  `poktan`     VARCHAR(200)  NOT NULL,             -- Nama kelompok tani
  `ketua`      VARCHAR(200)  NOT NULL,             -- Nama ketua poktan
  `alamat`     VARCHAR(500)  NOT NULL,
  `telepon`    VARCHAR(20)   NOT NULL,             -- Nomor WA format "628xxx"
  `is_active`  TINYINT(1)    DEFAULT 1,
  `created_at` TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### 3.5 Diagram Relasi (ERD Ringkas)

```
users (1) ──────→ (N) manual_logs        [user_id FK]
users (1) ──────→ (1) cms_hero           [updated_by FK]
users (1) ──────→ (1) cms_about          [updated_by FK]

cms_komoditas     → standalone (tidak ada FK)
cms_marketplace   → standalone (tidak ada FK)
cms_kontak        → standalone (tidak ada FK)
```

---

## 4. Konfigurasi Environment

### 4.1 File `.env` (Contoh Lengkap)

```env
# Server
PORT=3001

# Database MySQL (XAMPP)
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=ppko

# JWT (BARU — wajib diisi dengan string random panjang)
JWT_SECRET=masukkan_string_random_minimal_32_karakter_di_sini
JWT_EXPIRES_IN=24h

# CORS (BARU — URL frontend yang diizinkan)
CORS_ORIGIN=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 4.2 File `.env.example` (Masuk Git, Tanpa Nilai Rahasia)

```env
PORT=3001
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=ppko
JWT_SECRET=
JWT_EXPIRES_IN=24h
CORS_ORIGIN=http://localhost:5173
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 4.3 Dependency Baru (Tambahkan di `package.json`)

```json
{
  "dependencies": {
    "bcryptjs": "^3.0.3",
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.19.2",
    "express-rate-limit": "^7.x",
    "helmet": "^8.x",
    "jsonwebtoken": "^9.x",
    "mysql2": "^3.11.0"
  }
}
```

**Package baru yang harus diinstal:**
- `jsonwebtoken` → Membuat dan memverifikasi token JWT.
- `helmet` → Menambahkan HTTP security headers otomatis.
- `express-rate-limit` → Membatasi jumlah request per IP per jendela waktu.

---

## 5. Class-Class Utama (OOP)

Di bawah ini adalah penjelasan **peran dan method** setiap class. Kode ditulis bergaya ES Module (`import/export`) sesuai `"type": "module"` di `package.json`.

### 5.1 `utils/AppError.js` — Custom Error Class

**Tujuan:** Membuat objek error yang sudah terstruktur (punya `statusCode` dan `message`) sehingga global error handler bisa menangani secara konsisten.

```javascript
// Class ini meng-extend Error bawaan JavaScript.
// Kapan digunakan: throw new AppError('Pesan error', 400) di mana saja di Service/Controller.
// Global error handler di middleware akan menangkap error ini.

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // Bedakan error operasional vs bug crash
  }
}
```

### 5.2 Repository Classes (Layer Database)

Setiap Repository class bertugas **hanya** mengurus query SQL ke satu tabel. Tidak ada logika bisnis di sini.

#### `repositories/UserRepository.js`

```
Class UserRepository:
  - constructor(pool)              → Simpan reference ke MySQL pool
  - findByEmailOrUsername(identity) → SELECT * FROM users WHERE email=? OR username=?
  - findById(id)                   → SELECT * FROM users WHERE id=?
  - create(username, email, hash)  → INSERT INTO users (username, email, password, role)
  - updateActiveStatus(id, status) → UPDATE users SET is_active=? WHERE id=?
```

#### `repositories/MonitoringRepository.js`

```
Class MonitoringRepository:
  - constructor(pool)
  - getAllSensorData()              → SELECT paralel dari 5 tabel sensor (Promise.all)
  - updateControl(fields)          → UPDATE control_monitoring SET ... WHERE id=1
  - updateSensors(plts, rain, ...)  → BEGIN TRANSACTION → UPDATE masing-masing tabel → COMMIT
  - getControlStatus()             → SELECT * FROM control_monitoring WHERE id=1
```

#### `repositories/LogsRepository.js`

```
Class LogsRepository:
  - constructor(pool)
  - getAll()                       → SELECT * FROM manual_logs ORDER BY tanggal DESC
  - create(userId, data)           → INSERT INTO manual_logs (user_id, tanggal, lokasi, ...)
```

#### `repositories/CmsRepository.js` (BARU)

```
Class CmsRepository:
  - constructor(pool)

  # Hero (singleton, id=1)
  - getHero()                      → SELECT * FROM cms_hero WHERE id=1
  - updateHero(title, subtitle, bgImage, adminId)  → UPDATE cms_hero SET ... WHERE id=1

  # Komoditas (CRUD banyak baris)
  - getAllKomoditas()               → SELECT * FROM cms_komoditas ORDER BY sort_order ASC
  - getActiveKomoditas()            → SELECT * FROM cms_komoditas WHERE is_active=1 ORDER BY sort_order
  - createKomoditas(data)           → INSERT INTO cms_komoditas (bulan, tonase, ...)
  - updateKomoditas(id, data)       → UPDATE cms_komoditas SET ... WHERE id=?
  - deleteKomoditas(id)             → DELETE FROM cms_komoditas WHERE id=?

  # Marketplace (CRUD banyak baris)
  - getAllMarketplace()             → SELECT * FROM cms_marketplace ORDER BY sort_order ASC
  - getActiveMarketplace()          → SELECT * FROM cms_marketplace WHERE is_active=1 ORDER BY sort_order
  - createMarketplace(data)         → INSERT INTO cms_marketplace (nama, harga, ...)
  - updateMarketplace(id, data)     → UPDATE cms_marketplace SET ... WHERE id=?
  - deleteMarketplace(id)           → DELETE FROM cms_marketplace WHERE id=?

  # About (singleton, id=1)
  - getAbout()                     → SELECT * FROM cms_about WHERE id=1
  - updateAbout(cerita, adminId)   → UPDATE cms_about SET cerita=?, updated_by=? WHERE id=1

  # Kontak (CRUD banyak baris)
  - getAllKontak()                  → SELECT * FROM cms_kontak ORDER BY id ASC
  - createKontak(data)             → INSERT INTO cms_kontak (poktan, ketua, alamat, telepon)
  - updateKontak(id, data)         → UPDATE cms_kontak SET ... WHERE id=?
  - deleteKontak(id)               → DELETE FROM cms_kontak WHERE id=?

  # Bulk read untuk landing page publik (1 query gabungan)
  - getFullLandingPageData()       → Panggil getHero + getActiveKomoditas + getActiveMarketplace + getAbout + getAllKontak secara paralel, return objek gabungan
```

### 5.3 Service Classes (Layer Logika Bisnis)

Service class bertugas **validasi data** dan **menjalankan logika bisnis** sebelum memanggil Repository.

#### `services/AuthService.js`

```
Class AuthService:
  - constructor(userRepository)
  
  - async register(username, email, password):
      1. Validasi: username, email, password WAJIB diisi (throw AppError 400 jika kosong)
      2. Validasi: panjang password minimal 6 karakter
      3. Validasi: format email valid (regex sederhana)
      4. Cek duplikasi: panggil userRepo.findByEmailOrUsername() → jika ada, throw AppError 400
      5. Hash password: bcrypt.hash(password, 12) → salt 12 rounds
      6. Simpan: panggil userRepo.create(username, email, hashedPassword)
      7. Return { success: true }

  - async login(identity, password):
      1. Validasi: identity dan password WAJIB diisi
      2. Cari user: panggil userRepo.findByEmailOrUsername(identity)
      3. Jika tidak ditemukan → throw AppError 400 "Kredensial salah" (jangan spesifik "email/username tidak ada")
      4. Cek is_active: jika user.is_active === 0 → throw AppError 403 "Akun dinonaktifkan"
      5. Bandingkan password: bcrypt.compare(password, user.password)
      6. Jika tidak cocok → throw AppError 400 "Kredensial salah" (pesan sama dengan poin 3, anti enumeration)
      7. Buat JWT token: jwt.sign({ id, username, role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
      8. Return { token, user: { id, username, email, role } }
```

#### `services/MonitoringService.js`

```
Class MonitoringService:
  - constructor(monitoringRepository)

  - async getData():
      1. Panggil repo.getAllSensorData()
      2. Format angka: parseFloat/parseInt untuk setiap field
      3. Return objek terformat { plts, rain, lightTrap, npk, control }

  - async updateControl(autoMode, manualActive):
      1. Validasi: minimal 1 field harus ada
      2. Panggil repo.updateControl(fields)

  - async updateSensors(plts, rain, lightTrap, npk):
      1. Panggil repo.updateSensors(...) dalam transaksi
      2. Ambil dan return status kontrol terbaru (untuk response ke ESP32)
```

#### `services/LogsService.js`

```
Class LogsService:
  - constructor(logsRepository)

  - async getAllLogs():
      1. Panggil repo.getAll()
      2. Format tanggal ke string ISO (YYYY-MM-DD)

  - async addLog(userId, data):
      1. Validasi: tanggal, lokasi, hama, pestisida WAJIB diisi
      2. Sanitasi: catatan default ke '-' jika kosong
      3. Panggil repo.create(userId, data)
```

#### `services/CmsService.js` (BARU)

```
Class CmsService:
  - constructor(cmsRepository)

  # Akses publik (tanpa auth)
  - async getPublicData():
      1. Panggil repo.getFullLandingPageData()
      2. Format hasilnya menjadi objek { hero, komoditas, marketplace, about }
      3. about.kontak diisi dari tabel cms_kontak
      4. Return objek CMS lengkap

  # Akses admin (butuh auth)
  - async updateHero(title, subtitle, bgImage, adminId):
      1. Validasi: title dan subtitle WAJIB diisi, bgImage opsional
      2. Validasi: bgImage jika diisi harus berupa URL valid (startsWith 'http')
      3. Panggil repo.updateHero(...)

  - async createKomoditas(data):
      1. Validasi: bulan, tonase, kualitas, luas WAJIB diisi
      2. Validasi: kualitas harus salah satu dari enum yang diizinkan
      3. Panggil repo.createKomoditas(validatedData)

  - async updateKomoditas(id, data):
      1. Validasi sama seperti create
      2. Panggil repo.updateKomoditas(id, validatedData)

  - async deleteKomoditas(id):
      1. Validasi: id harus angka positif
      2. Panggil repo.deleteKomoditas(id)

  - async createMarketplace(data):
      1. Validasi: nama, harga, deskripsi, petani, whatsapp WAJIB diisi
      2. Validasi: whatsapp harus dimulai dengan '62' dan hanya berisi angka
      3. Panggil repo.createMarketplace(validatedData)

  - async updateMarketplace(id, data):
      1. Validasi sama seperti create
      2. Panggil repo.updateMarketplace(id, validatedData)

  - async deleteMarketplace(id):
      1. Panggil repo.deleteMarketplace(id)

  - async updateAbout(cerita, adminId):
      1. Validasi: cerita WAJIB diisi dan minimal 10 karakter
      2. Panggil repo.updateAbout(cerita, adminId)

  - async createKontak(data):
      1. Validasi: poktan, ketua, alamat, telepon WAJIB diisi
      2. Validasi: telepon harus dimulai '62' dan hanya angka
      3. Panggil repo.createKontak(validatedData)

  - async updateKontak(id, data):
      1. Validasi sama seperti create
      2. Panggil repo.updateKontak(id, validatedData)

  - async deleteKontak(id):
      1. Panggil repo.deleteKontak(id)
```

---

## 6. Middleware Pipeline

### 6.1 `middleware/authMiddleware.js` — JWT Authentication & Role Authorization

```
Fungsi authenticateToken(req, res, next):
  1. Ambil header: req.headers['authorization']
  2. Jika tidak ada atau tidak diawali "Bearer " → return 401 "Token tidak tersedia"
  3. Ekstrak token: split(' ')[1]
  4. Verifikasi: jwt.verify(token, JWT_SECRET)
  5. Jika gagal (expired/invalid) → return 401 "Token tidak valid atau kadaluwarsa"
  6. Jika berhasil → simpan payload ke req.user = { id, username, role }
  7. Panggil next()

Fungsi authorizeRole(...allowedRoles):
  Return middleware function(req, res, next):
    1. Cek: apakah req.user.role ada di dalam array allowedRoles
    2. Jika tidak → return 403 "Akses ditolak: hak akses tidak mencukupi"
    3. Jika ya → panggil next()
```

**Cara pakai di router:**
```javascript
// Endpoint hanya untuk admin:
router.put('/hero', authenticateToken, authorizeRole('admin'), controller.updateHero);

// Endpoint untuk semua user yang login:
router.get('/data', authenticateToken, controller.getData);

// Endpoint publik (tanpa middleware auth):
router.get('/public', controller.getPublicData);
```

### 6.2 `middleware/rateLimiter.js` — Rate Limiting

```
Import express-rate-limit.

Export 2 jenis limiter:

1. globalLimiter:
   - windowMs: 15 menit (900000 ms, dari env RATE_LIMIT_WINDOW_MS)
   - max: 100 request per IP per window (dari env RATE_LIMIT_MAX_REQUESTS)
   - message: { error: 'Terlalu banyak permintaan, coba lagi nanti' }
   - standardHeaders: true (kirim header RateLimit-* ke client)
   - legacyHeaders: false

2. authLimiter (khusus endpoint login/register, lebih ketat):
   - windowMs: 15 menit
   - max: 15 request per IP per window
   - message: { error: 'Terlalu banyak percobaan login, coba lagi dalam 15 menit' }
```

### 6.3 `middleware/requestLogger.js` — Logging

```
Fungsi requestLogger(req, res, next):
  1. Catat timestamp ISO, method HTTP, path URL, dan IP pengirim
  2. Format: "[2026-07-14T00:00:00Z] GET /api/monitoring - 192.168.1.1"
  3. Tulis ke console.log (atau ke file jika diperlukan nanti)
  4. Panggil next()
```

### 6.4 `middleware/errorHandler.js` — Global Error Handler

```
Fungsi errorHandler(err, req, res, next):
  1. Jika err adalah instance AppError (isOperational === true):
     → Kirim res.status(err.statusCode).json({ error: err.message })
  2. Jika err bukan AppError (bug tak terduga):
     → console.error('❌ UNEXPECTED ERROR:', err)
     → Kirim res.status(500).json({ error: 'Terjadi kesalahan internal server' })
     → JANGAN kirim detail error ke client (anti information leakage)
```

---

## 7. Endpoint API Lengkap

### 7.1 Auth Endpoints (`/api/auth`)

| Method | Path               | Auth?     | Rate Limit  | Deskripsi                              |
| :----- | :----------------- | :-------- | :---------- | :------------------------------------- |
| POST   | `/api/auth/register` | ❌ Publik | authLimiter | Daftarkan akun baru (role: user)       |
| POST   | `/api/auth/login`    | ❌ Publik | authLimiter | Login dan dapatkan JWT token           |

**Request & Response Login:**
```
POST /api/auth/login
Body: { "identity": "admin@ebio.com", "password": "admin123" }

Response 200:
{
  "success": true,
  "token": "eyJhbGciOiJIUz...",     ← (BARU) JWT token
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@ebio.com",
    "role": "admin"
  }
}

Response 400: { "error": "Kredensial salah" }
Response 403: { "error": "Akun Anda telah dinonaktifkan" }
```

**Request & Response Register:**
```
POST /api/auth/register
Body: { "username": "petani1", "email": "petani1@gmail.com", "password": "katasandi123" }

Response 200: { "success": true, "message": "Registrasi berhasil!" }
Response 400: { "error": "Username atau email sudah terdaftar" }
```

### 7.2 Monitoring Endpoints (`/api/monitoring`)

| Method | Path                    | Auth?        | Deskripsi                              |
| :----- | :---------------------- | :----------- | :------------------------------------- |
| GET    | `/api/monitoring`        | ✅ Login     | Ambil seluruh data sensor terkini      |
| POST   | `/api/monitoring/control`| ✅ Admin     | Ubah mode kontrol (auto/manual)        |
| POST   | `/api/monitoring/update` | ❌ Publik*   | Terima data dari ESP32 / IoT device    |

> \* Endpoint `/update` dari ESP32 tidak pakai JWT karena microcontroller sulit menyimpan token. Sebagai gantinya, gunakan **API Key** sederhana via header `X-API-Key` yang dicek di middleware khusus. Tambahkan variabel `ESP_API_KEY` di `.env`.

### 7.3 Logs Endpoints (`/api/logs`)

| Method | Path         | Auth?       | Deskripsi                              |
| :----- | :----------- | :---------- | :------------------------------------- |
| GET    | `/api/logs`   | ✅ Login    | Ambil semua log manual                 |
| POST   | `/api/logs`   | ✅ Admin    | Tambah log manual baru                 |

### 7.4 CMS Endpoints (`/api/cms`) — BARU

#### Endpoint Publik (Tanpa Login)

| Method | Path             | Auth?      | Deskripsi                                        |
| :----- | :--------------- | :--------- | :----------------------------------------------- |
| GET    | `/api/cms/public` | ❌ Publik | Ambil seluruh data CMS untuk Landing Page        |

**Response `/api/cms/public`:**
```json
{
  "hero": {
    "title": "Pertanian Bawang Merah di Desa Sajen",
    "subtitle": "Menggabungkan kearifan lokal...",
    "bgImage": "https://images.unsplash.com/..."
  },
  "komoditas": [
    { "id": 1, "bulan": "Juni 2026", "tonase": "14.5 Ton", "kualitas": "Super (Grade A)", "luas": "1.2 Hektar", "gambar": "..." }
  ],
  "marketplace": [
    { "id": 1, "nama": "Bawang Merah Bibit Unggul", "harga": "35.000", "satuan": "kg", "deskripsi": "...", "petani": "Poktan Tani Makmur", "whatsapp": "6281234567890", "gambar": "..." }
  ],
  "about": {
    "cerita": "Kelompok Tani Desa Sajen...",
    "kontak": [
      { "id": 1, "poktan": "Kelompok Tani Makmur Utama", "ketua": "Bapak H. Sukardi", "alamat": "...", "telepon": "6281234567890" }
    ]
  }
}
```

#### Endpoint Admin (Butuh Login + Role Admin)

| Method | Path                       | Auth?       | Deskripsi                             |
| :----- | :------------------------- | :---------- | :------------------------------------ |
| GET    | `/api/cms/admin/all`        | ✅ Admin   | Ambil semua data CMS (termasuk draft) |
| PUT    | `/api/cms/hero`             | ✅ Admin   | Update hero section                   |
| POST   | `/api/cms/komoditas`        | ✅ Admin   | Tambah data panen baru                |
| PUT    | `/api/cms/komoditas/:id`    | ✅ Admin   | Edit data panen                       |
| DELETE | `/api/cms/komoditas/:id`    | ✅ Admin   | Hapus data panen                      |
| POST   | `/api/cms/marketplace`      | ✅ Admin   | Tambah produk dagangan baru           |
| PUT    | `/api/cms/marketplace/:id`  | ✅ Admin   | Edit produk dagangan                  |
| DELETE | `/api/cms/marketplace/:id`  | ✅ Admin   | Hapus produk dagangan                 |
| PUT    | `/api/cms/about`            | ✅ Admin   | Update narasi tentang poktan          |
| POST   | `/api/cms/kontak`           | ✅ Admin   | Tambah kontak poktan baru             |
| PUT    | `/api/cms/kontak/:id`       | ✅ Admin   | Edit kontak poktan                    |
| DELETE | `/api/cms/kontak/:id`       | ✅ Admin   | Hapus kontak poktan                   |

---

## 8. Alur Kerja (Flow) Utama

### 8.1 Flow Login → Dapatkan Token → Akses Admin

```
[Frontend]                            [Backend]
    │                                      │
    │  POST /api/auth/login                │
    │  { identity, password }         ───→ │
    │                                      │  1. AuthService.login()
    │                                      │  2. Cek user di DB
    │                                      │  3. Compare bcrypt
    │                                      │  4. Buat JWT token
    │  ←───  { token, user }               │
    │                                      │
    │  Simpan token di localStorage        │
    │                                      │
    │  GET /api/monitoring                 │
    │  Header: Authorization: Bearer xxx ─→│
    │                                      │  5. authenticateToken()
    │                                      │  6. Verifikasi JWT
    │                                      │  7. req.user = payload
    │                                      │  8. MonitoringService.getData()
    │  ←───  { plts, rain, npk, ... }      │
```

### 8.2 Flow CMS: Admin Ubah Hero → Pengunjung Lihat Perubahan

```
[Admin Frontend]                      [Backend]                    [Public Frontend]
    │                                      │                              │
    │  PUT /api/cms/hero                   │                              │
    │  Header: Bearer <token>              │                              │
    │  { title, subtitle, bgImage }   ───→ │                              │
    │                                      │  1. authenticateToken()       │
    │                                      │  2. authorizeRole('admin')    │
    │                                      │  3. CmsService.updateHero()   │
    │                                      │  4. Validasi input            │
    │                                      │  5. UPDATE cms_hero SET...    │
    │  ←── { success: true }               │                              │
    │                                      │                              │
    │                                      │  GET /api/cms/public          │
    │                                      │ ←───────────────────────────  │
    │                                      │  6. CmsService.getPublicData()│
    │                                      │  7. SELECT dari semua tabel   │
    │                                      │  ────────────────────────── → │
    │                                      │  { hero, komoditas, ... }     │
    │                                      │                              │
    │                                      │              Landing Page menampilkan
    │                                      │              data terbaru dari server
```

### 8.3 Flow ESP32 Kirim Data Sensor

```
[ESP32 / IoT]                          [Backend]
    │                                      │
    │  POST /api/monitoring/update         │
    │  Header: X-API-Key: <key>            │
    │  { plts, rain, lightTrap, npk } ───→ │
    │                                      │  1. Cek X-API-Key cocok dgn env
    │                                      │  2. MonitoringService.updateSensors()
    │                                      │  3. BEGIN TRANSACTION
    │                                      │  4. UPDATE masing-masing tabel
    │                                      │  5. COMMIT
    │                                      │  6. Ambil control status terbaru
    │  ←── { success, control }            │
    │                                      │
    │  ESP32 baca control.autoMode         │
    │  untuk menentukan aksi relay         │
```

---

## 9. Checklist Keamanan

Daftar ini bisa digunakan untuk verifikasi setelah implementasi selesai:

### Confidentiality ✓
- [ ] Password di-hash pakai bcrypt dengan **12 salt rounds** (bukan 10)
- [ ] JWT secret disimpan di `.env`, panjang minimal 32 karakter
- [ ] `.env` masuk `.gitignore` dan TIDAK pernah di-commit
- [ ] Response error login menggunakan **pesan generik** ("Kredensial salah"), bukan spesifik
- [ ] Data user `password` **TIDAK pernah** dikirim ke response frontend
- [ ] CORS dibatasi hanya ke `CORS_ORIGIN` dari `.env`

### Integrity ✓
- [ ] Seluruh query SQL menggunakan **parameterized query** (`?` placeholder)
- [ ] Setiap endpoint tulis (POST/PUT/DELETE) melewati middleware `authenticateToken`
- [ ] Endpoint admin melewati tambahan middleware `authorizeRole('admin')`
- [ ] `role` di database menggunakan `ENUM` bukan `VARCHAR` bebas
- [ ] Kolom `updated_by` di tabel CMS mencatat siapa yang mengubah data
- [ ] Validasi input (tipe, format, panjang) dilakukan di **Service layer** sebelum menyentuh database

### Availability ✓
- [ ] Rate limiter aktif di semua endpoint (`globalLimiter`)
- [ ] Rate limiter ketat di endpoint auth (`authLimiter`: 15 req/15 menit)
- [ ] MySQL connection pooling aktif (max 10 koneksi)
- [ ] Global error handler mencegah server crash dari uncaught error
- [ ] Data CMS berpindah dari `localStorage` browser ke database server (tahan clear cache)

---

## Catatan Migrasi dari Versi Lama

Perubahan kritis yang perlu diperhatikan saat mengimplementasikan dokumen ini:

1. **AuthContext.jsx (Frontend):** Setelah backend mengembalikan JWT token, simpan token tersebut di `localStorage` bersama data user. Setiap request API ke endpoint terproteksi harus menyertakan header `Authorization: Bearer <token>`.

2. **api.js (Frontend):** Modifikasi fungsi `request()` untuk otomatis menyisipkan header `Authorization` dari token yang tersimpan di `localStorage`.

3. **cmsHelper.js (Frontend):** Ubah dari baca/tulis `localStorage` menjadi pemanggilan API ke `/api/cms/public` (untuk landing page) dan `/api/cms/*` (untuk admin CMS).

4. **dbInit.js (Backend):** Tambahkan pembuatan tabel CMS baru (`cms_hero`, `cms_komoditas`, `cms_marketplace`, `cms_about`, `cms_kontak`) beserta data seed awal.

5. **Endpoint ESP32 `/api/monitoring/update`:** Tambahkan pengecekan header `X-API-Key` sebagai pengganti JWT karena microcontroller tidak cocok untuk mengelola token JWT.
