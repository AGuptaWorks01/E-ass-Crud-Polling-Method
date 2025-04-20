# 🧩 E-assessment: Full-Stack Product Management System

This project is a full-stack web application built using **Angular**, **Node.js (Express)**, and **MySQL**, designed as part of a technical assessment to evaluate full-stack development skills. It supports user authentication, product and category management, server-side pagination, sorting, searching, and product report downloads in CSV/XLSX format.


---

## 🚀 Tech Stack

- **Frontend**: Angular
- **Backend**: Node.js + Express
- **Database**: MySQL
- **Authentication**: JWT (JSON Web Token)
- **Encryption**: bcrypt
- **Reports**: exceljs / fast-csv

---

## 📂 Features

### 👥 User Management
- Register and login with email and password
- Passwords are securely hashed using bcrypt
- JWT-based authentication and route protection

### 🗂️ Category Management
- Create, update, delete, and list categories
- Each category has a unique UUID

### 📦 Product Management
- Create, update, delete, and list products
- Each product is associated with a category
- Unique UUID for every product
- Support for product image upload and storage

### 📊 Reports
- Download product data as CSV or XLSX
- Handles large datasets without timeout errors

### 🔍 Product API Functionalities
- **Server-side pagination**
- **Sorting by price (asc/desc)**
- **Search by product name or category name**

---

## 🛠️ Database Schema (MySQL)

```sql
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
  `uuid` CHAR(36) NOT NULL UNIQUE,
  `name` VARCHAR(255) NOT NULL UNIQUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Products Table
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

-- Product Images Table
CREATE TABLE `product_images` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `product_id` INT NOT NULL,
  `image_url` TEXT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE
);


---
---
## 📬 API Endpoints

### ✅ Authentication

| Method | Endpoint                      | Description                          |
|--------|-------------------------------|--------------------------------------|
| POST   | /api/auth/register             | Register a new user                  |
| POST   | /api/auth/login                | Login and receive a JWT              |

### 📁 Category Management

| Method | Endpoint                      | Description                          |
|--------|-------------------------------|--------------------------------------|
| POST   | /api/categories                | Add new category                     |
| GET    | /api/categories                | Get all categories                   |
| PUT    | /api/categories/:id            | Update category by ID                |
| DELETE | /api/categories/:id            | Delete category by ID                |

### 📦 Product Management

| Method | Endpoint                      | Description                          |
|--------|-------------------------------|--------------------------------------|
| POST   | /api/products                  | Add new product                      |
| GET    | /api/products                  | Get all products                     |
| GET    | /api/products/:id              | Get product by ID                    |
| PUT    | /api/products/:id              | Update product by ID                 |
| DELETE | /api/products/:id              | Delete product by ID                 |

### 📄 Product Listing with Pagination, Sorting, and Search

#### 🔢 Pagination:

| Method | Endpoint                      | Example                               |
|--------|-------------------------------|---------------------------------------|
| GET    | /api/products?page=1           | /api/products?page=1                 |
| GET    | /api/products?page=2           | /api/products?page=2                 |

#### 💸 Sorting by Price:

| Method | Endpoint                      | Example                               |
|--------|-------------------------------|---------------------------------------|
| GET    | /api/products?page=1&sort=asc  | /api/products?page=1&sort=asc        |
| GET    | /api/products?page=1&sort=desc | /api/products?page=1&sort=desc       |

#### 🔍 Search by Product Name or Category:

| Method | Endpoint                      | Example                               |
|--------|-------------------------------|---------------------------------------|
| GET    | /api/products?search=Computer  | /api/products?search=Computer        |
| GET    | /api/products?category=Computer  | /api/products?category=Computer    |

### 📊 Report Generation

| Format | Endpoint                                   |
|--------|--------------------------------------------|
| CSV    | /api/products/report/download?format=csv  |
| XLSX   | /api/products/report/download?format=xlsx |

---

## ⚙️ Setup Instructions

### 🔧 Backend

1. Navigate to the backend folder:

    ```bash
    cd backend
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Create a `.env` file with the following configuration:

    ```ini
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=yourpassword
    DB_NAME=CrudAssessment
    JWT_SECRET=your_jwt_secret
    ```

4. Start the server:

    ```bash
    npm start
    ```

### 💻 Frontend

1. Navigate to the frontend folder:

    ```bash
    cd frontend
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Run the Angular app:

    ```bash
    ng serve
    ```

---