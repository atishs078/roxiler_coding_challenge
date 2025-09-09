-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 09, 2025 at 07:23 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `roxiler_coding_challenge`
--

-- --------------------------------------------------------

--
-- Table structure for table `stores`
--

CREATE TABLE `stores` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `address` text DEFAULT NULL,
  `ispasswordupdated` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `stores`
--

INSERT INTO `stores` (`id`, `name`, `email`, `password`, `address`, `ispasswordupdated`, `created_at`) VALUES
(1, 'Sai Service', 'sai@gmail.com', '', 'Bembli', 0, '2025-09-06 12:41:47'),
(2, 'Sai Service', 'saiservice@gmail.com', '$2b$10$5hwaptee4xMWaYSUX9Ihm.6zJ3F0uJ7wQh9GpsO5Nyr.9LhtFfxOy', 'Bembli', 1, '2025-09-06 14:36:10'),
(3, 'Sai ', 'saiservice1@gmail.com', '$2b$10$Mfhic9.BcldmxmfyySD6HeBIeSxYOo5yVhDzwrVDvzOO58aoPjxDK', 'Bembli', 0, '2025-09-06 14:41:18'),
(4, 'xyz', 'xyz@gmail.com', '$2b$10$3b2ZmznJSn3UInXkFjr1POCIXB10R1GPfZ0J21pLiXo4IBjBhzSo2', 'bembli', 1, '2025-09-06 16:19:08'),
(5, 'xyz', 'xyz1@gmail.com', '$2b$10$W4DBtYubo.XNknZJw.yg1.Iy9/3gS4dY98ARfJIdpTALJOhPGV9ci', 'bembli', 1, '2025-09-06 16:43:41'),
(6, 'xyz', 'xyz2@gmail.com', '$2b$10$mlVMCfpRnCf1LHUcRTjckeSYjZovKQh7nEzpW4mNKxXTDBHNSY5am', 'bembli', 0, '2025-09-06 17:49:45');

-- --------------------------------------------------------

--
-- Table structure for table `store_ratings`
--

CREATE TABLE `store_ratings` (
  `id` int(11) NOT NULL,
  `storeID` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `rating` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `store_ratings`
--

INSERT INTO `store_ratings` (`id`, `storeID`, `userId`, `rating`, `created_at`, `name`, `email`) VALUES
(4, 5, 1, 5, '2025-09-06 17:23:35', 'Atish', 'abc@gmail.com'),
(5, 4, 1, 4, '2025-09-06 17:23:38', 'Atish', 'abc@gmail.com'),
(6, 1, 1, 5, '2025-09-06 17:23:41', 'Atish', 'abc@gmail.com'),
(7, 6, 1, 5, '2025-09-06 20:43:16', 'Atish', 'abc@gmail.com'),
(8, 1, 9, 4, '2025-09-07 01:00:48', 'Atish', 'a@gmail.com'),
(9, 6, 9, 5, '2025-09-07 01:00:52', 'Atish', 'a@gmail.com'),
(10, 2, 1, 5, '2025-09-09 04:09:55', 'Atish', 'abc@gmail.com'),
(11, 3, 1, 3, '2025-09-09 04:10:02', 'Atish', 'abc@gmail.com');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `role` enum('systemAdmin','normalUser','storeOwner') DEFAULT 'normalUser',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `address`, `role`, `created_at`) VALUES
(1, 'Atish', 'abc@gmail.com', '$2b$10$7Hfbi9bVcrYECrriv6fyJO8O5rCmEgLWttGL9p4f7MGgOfv4xaC3.', 'Bembli\n', 'normalUser', '2025-09-06 12:37:28'),
(2, 'Sai ', 'saiservice1@gmail.com', '$2b$10$Mfhic9.BcldmxmfyySD6HeBIeSxYOo5yVhDzwrVDvzOO58aoPjxDK', 'Bembli', 'storeOwner', '2025-09-06 14:41:18'),
(3, 'atish', 'atish@gmail.com', '$2b$10$r4GUqb4vCz3zKVw.pf9x2uP6FxvSTryye9De8Iyg0pAbHRzmIgsgu', 'Bembli', 'systemAdmin', '2025-09-06 16:18:19'),
(4, 'xyz', 'xyz@gmail.com', '$2b$10$3b2ZmznJSn3UInXkFjr1POCIXB10R1GPfZ0J21pLiXo4IBjBhzSo2', 'bembli', 'storeOwner', '2025-09-06 16:19:08'),
(5, 'ATISH ANIL SHINDE', 'vijayalaxmibiradar2001@gmail.com', '$2b$10$tTobAY3E4UIqzVdgfCkcrepa5geiaDwjhjhbuqHC1T8nLDWTVh44K', 'Sambaji Nagar Bembali', 'normalUser', '2025-09-06 16:43:27'),
(6, 'xyz', 'xyz1@gmail.com', '$2b$10$W4DBtYubo.XNknZJw.yg1.Iy9/3gS4dY98ARfJIdpTALJOhPGV9ci', 'bembli', 'storeOwner', '2025-09-06 16:43:41'),
(7, 'xyz', 'xyz2@gmail.com', '$2b$10$mlVMCfpRnCf1LHUcRTjckeSYjZovKQh7nEzpW4mNKxXTDBHNSY5am', 'bembli', 'storeOwner', '2025-09-06 17:49:45'),
(8, 'Atish', 'xyz34@gmail.com', '$2b$10$gS4DXxPm43RmH7mlwfH5ROJO99kiVThY.zPEHq70x5IIBHaJr7.O.', 'ssd', 'normalUser', '2025-09-06 20:39:25'),
(9, 'Atish', 'a@gmail.com', '$2b$10$o3RHUyNw4PAnDwNNYsP4WOc1SkEWd09ilbX0ebZhC/6J5zALiOfwK', 'bembli       ', 'normalUser', '2025-09-07 01:00:28');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `stores`
--
ALTER TABLE `stores`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `store_ratings`
--
ALTER TABLE `store_ratings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `stores`
--
ALTER TABLE `stores`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `store_ratings`
--
ALTER TABLE `store_ratings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
