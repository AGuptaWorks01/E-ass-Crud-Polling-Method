
-- CREATE DATABASE  IF NOT EXISTS `CrudAssesment` ;
-- USE `CrudAssesment`;

-- CREATE TABLE `categories` (
--   `id` int(11) NOT NULL AUTO_INCREMENT,
--   `name` varchar(255) NOT NULL,
--   `created_at` timestamp NULL DEFAULT current_timestamp(),
--   `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
--   PRIMARY KEY (`id`)
-- ) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- CREATE TABLE `userdata` (
--   `id` INT AUTO_INCREMENT PRIMARY KEY,
--   `email` VARCHAR(255) UNIQUE NOT NULL,
--   `password` VARCHAR(255) NOT NULL
-- );








CREATE DATABASE IF NOT EXISTS `CrudAssessment`;
USE `CrudAssessment`;

-- Users Table
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Categories Table
CREATE TABLE `categories` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `uuid` CHAR(36) NOT NULL UNIQUE, -- for external reference
  `name` VARCHAR(255) NOT NULL UNIQUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


CREATE TABLE `products` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `uuid` CHAR(36) NOT NULL UNIQUE,
  `name` VARCHAR(255) NOT NULL,
  `price` DECIMAL(10,2) NOT NULL,
  `category_id` INT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE CASCADE
);


CREATE TABLE `product_images` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `product_id` INT NOT NULL,
  `image_url` TEXT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE
);


-- Products Table
-- CREATE TABLE `products` (
--   `id` INT AUTO_INCREMENT PRIMARY KEY,
--   `uuid` CHAR(36) NOT NULL UNIQUE, -- for external reference
--   `name` VARCHAR(255) NOT NULL,
--   `image` TEXT,
--   `price` DECIMAL(10,2) NOT NULL,
--   `category_id` INT NOT NULL,
--   `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--   `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
--   FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE
-- );
