-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 15, 2026 at 05:25 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ppko`
--

-- --------------------------------------------------------

--
-- Table structure for table `control_monitoring`
--

CREATE TABLE `control_monitoring` (
  `id` int(11) NOT NULL,
  `auto_mode` tinyint(1) DEFAULT 0,
  `manual_active` tinyint(1) DEFAULT 0,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `control_monitoring`
--

INSERT INTO `control_monitoring` (`id`, `auto_mode`, `manual_active`, `updated_at`) VALUES
(1, 1, 0, '2026-07-13 16:30:29');

-- --------------------------------------------------------

--
-- Table structure for table `light_trap_monitoring`
--

CREATE TABLE `light_trap_monitoring` (
  `id` int(11) NOT NULL,
  `active` tinyint(1) DEFAULT 0,
  `trigger_mode` varchar(50) DEFAULT '-',
  `duration` int(11) DEFAULT 0,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `light_trap_monitoring`
--

INSERT INTO `light_trap_monitoring` (`id`, `active`, `trigger_mode`, `duration`, `updated_at`) VALUES
(1, 0, 'Otomatis', 69, '2026-07-13 16:46:50');

-- --------------------------------------------------------

--
-- Table structure for table `manual_logs`
--

CREATE TABLE `manual_logs` (
  `id` int(11) NOT NULL,
  `tanggal` date NOT NULL,
  `lokasi` varchar(100) NOT NULL,
  `hama` varchar(100) NOT NULL,
  `pestisida` varchar(50) NOT NULL,
  `catatan` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `manual_logs`
--

INSERT INTO `manual_logs` (`id`, `tanggal`, `lokasi`, `hama`, `pestisida`, `catatan`, `created_at`) VALUES
(1, '2026-06-01', 'Tiang A-01 (Sektor Utara)', '100 Ekor Ngengat', '30%', 'Normal', '2026-07-03 13:59:38'),
(2, '2026-06-02', 'Tiang A-02 (Sektor Timur)', '120 Ekor Ngengat', '35%', 'Kondisi stabil', '2026-07-03 13:59:38'),
(3, '2026-06-03', 'Tiang B-01 (Sektor Selatan)', '110 Ekor Ngengat', '38%', 'Normal', '2026-07-03 13:59:38'),
(4, '2026-06-04', 'Tiang A-01 (Sektor Utara)', '154 Ekor Ngengat', '40%', 'Pertumbuhan daun normal', '2026-07-03 13:59:38'),
(5, '2026-06-04', 'Tiang A-01 (Sektor Utara)', '100 Ekor Ngengat', '12%', '-', '2026-07-03 14:14:00'),
(6, '2026-06-04', 'Tiang A-01 (Sektor Utara)', '154 Ekor Ngengat', '40%', 'wtessss', '2026-07-03 14:17:03'),
(7, '2026-06-04', 'Tiang A-01 (Sektor Utara)', '154 Ekor Ngengat', '40%', '-', '2026-07-11 08:12:11');

-- --------------------------------------------------------

--
-- Table structure for table `npk_monitoring`
--

CREATE TABLE `npk_monitoring` (
  `id` int(11) NOT NULL,
  `nitrogen` int(11) DEFAULT 0,
  `phosphor` int(11) DEFAULT 0,
  `potassium` int(11) DEFAULT 0,
  `status` varchar(50) DEFAULT '-',
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `npk_monitoring`
--

INSERT INTO `npk_monitoring` (`id`, `nitrogen`, `phosphor`, `potassium`, `status`, `updated_at`) VALUES
(1, 62, 36, 63, 'Subur', '2026-07-13 16:46:50');

-- --------------------------------------------------------

--
-- Table structure for table `plts_monitoring`
--

CREATE TABLE `plts_monitoring` (
  `id` int(11) NOT NULL,
  `voltage` float DEFAULT 0,
  `current` float DEFAULT 0,
  `battery` int(11) DEFAULT 0,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `plts_monitoring`
--

INSERT INTO `plts_monitoring` (`id`, `voltage`, `current`, `battery`, `updated_at`) VALUES
(1, 11.6, 1.1, 90, '2026-07-13 16:46:50');

-- --------------------------------------------------------

--
-- Table structure for table `rain_monitoring`
--

CREATE TABLE `rain_monitoring` (
  `id` int(11) NOT NULL,
  `status` varchar(50) DEFAULT '-',
  `detection` varchar(50) DEFAULT '-',
  `intensity` int(11) DEFAULT 0,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `rain_monitoring`
--

INSERT INTO `rain_monitoring` (`id`, `status`, `detection`, `intensity`, `updated_at`) VALUES
(1, 'Cerah', 'Aman', 10, '2026-07-13 16:46:50');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(50) DEFAULT 'user',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `role`, `created_at`) VALUES
(1, 'admin', 'admin@ebio.com', '$2b$10$zOi142D2Y.IngVlfLaiS0e.bkglqIs4hUL5Ity5N535ludN85mWgK', 'admin', '2026-07-03 13:11:20'),
(2, 'adam', 'adamfahriansyah25@gmail.com', '$2b$10$dLSTOTDKG.YVsO.wmsl8wOnHy7LcFL3Uh2VnfEAyfvh2QqvF8Y2H.', 'user', '2026-07-03 13:18:36');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `control_monitoring`
--
ALTER TABLE `control_monitoring`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `light_trap_monitoring`
--
ALTER TABLE `light_trap_monitoring`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `manual_logs`
--
ALTER TABLE `manual_logs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `npk_monitoring`
--
ALTER TABLE `npk_monitoring`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `plts_monitoring`
--
ALTER TABLE `plts_monitoring`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `rain_monitoring`
--
ALTER TABLE `rain_monitoring`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `control_monitoring`
--
ALTER TABLE `control_monitoring`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `light_trap_monitoring`
--
ALTER TABLE `light_trap_monitoring`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `manual_logs`
--
ALTER TABLE `manual_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `npk_monitoring`
--
ALTER TABLE `npk_monitoring`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `plts_monitoring`
--
ALTER TABLE `plts_monitoring`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `rain_monitoring`
--
ALTER TABLE `rain_monitoring`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
