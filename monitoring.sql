-- 1. Tabel Monitoring PLTS
CREATE TABLE `plts_monitoring` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `voltage` FLOAT DEFAULT 0.0,
  `current` FLOAT DEFAULT 0.0,
  `battery` INT DEFAULT 0,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Tabel Monitoring Sensor Hujan
CREATE TABLE `rain_monitoring` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `status` VARCHAR(50) DEFAULT '-',
  `detection` VARCHAR(50) DEFAULT '-',
  `intensity` INT DEFAULT 0,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Tabel Monitoring Light Trap (Perangkap Cahaya Tegangan Tinggi)
CREATE TABLE `light_trap_monitoring` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `active` TINYINT(1) DEFAULT 0,
  `trigger_mode` VARCHAR(50) DEFAULT '-',
  `duration` INT DEFAULT 0,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Tabel Monitoring Sensor NPK (Nutrisi Tanah)
CREATE TABLE `npk_monitoring` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nitrogen` INT DEFAULT 0,
  `phosphor` INT DEFAULT 0,
  `potassium` INT DEFAULT 0,
  `status` VARCHAR(50) DEFAULT '-',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Tabel Kontrol Sistem (Auto / Manual)
CREATE TABLE `control_monitoring` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `auto_mode` TINYINT(1) DEFAULT 0,
  `manual_active` TINYINT(1) DEFAULT 0,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Masukkan data awal nol (id = 1) untuk kelima tabel tersebut
INSERT INTO `plts_monitoring` (`id`, `voltage`, `current`, `battery`) VALUES (1, 0.0, 0.0, 0);
INSERT INTO `rain_monitoring` (`id`, `status`, `detection`, `intensity`) VALUES (1, '-', '-', 0);
INSERT INTO `light_trap_monitoring` (`id`, `active`, `trigger_mode`, `duration`) VALUES (1, 0, '-', 0);
INSERT INTO `npk_monitoring` (`id`, `nitrogen`, `phosphor`, `potassium`, `status`) VALUES (1, 0, 0, 0, '-');
INSERT INTO `control_monitoring` (`id`, `auto_mode`, `manual_active`) VALUES (1, 0, 0);


-- 6. Tabel Akun Pengguna (Otentikasi)
CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(100) NOT NULL UNIQUE,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `role` VARCHAR(50) DEFAULT 'user',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Masukkan akun admin bawaan (Password: admin123, terenkripsi bcrypt)
INSERT INTO `users` (`username`, `email`, `password`, `role`) 
VALUES ('admin', 'admin@ebio.com', '$2a$10$e0MYz4wQf2NqE3g5o/jOPOF9jTqRsh2r/k2V40G/N6gR3l78Gk.3S', 'admin');
