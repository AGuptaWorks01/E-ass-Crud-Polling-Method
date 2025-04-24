const promisePool = require("../utils/dbConnection.Util");

// Function to calculate the total number of product pages
const tostalProduct = async () => {
  const limit = 10; // Set the number of items per page
  const countQuery = `SELECT COUNT(*) AS total FROM products`; // Query to get total number of products
  const [countResult] = await promisePool.execute(countQuery); // Execute query
  const totalRecords = countResult[0].total; // Get the total record count from the query result
  return Math.ceil(totalRecords / limit); // Return the number of pages
};

// Function to get all products with pagination, sorting, and filtering options
const getAllproducts = async (
  page,
  sort = "asc",
  search = "",
  category = ""
) => {
  try {
    const limit = 10; // Set the number of items per page
    const offset = (page - 1) * limit; // Calculate offset based on page number

    // Build dynamic WHERE clause for search and category filtering
    let whereClause = `WHERE 1=1`; // Start with a default condition
    const params = []; // Array to hold query parameters

    if (search) {
      whereClause += ` AND p.name LIKE ?`; // Filter by product name
      params.push(`%${search}%`);
    }

    if (category) {
      whereClause += ` AND c.name LIKE ?`; // Filter by category name
      params.push(`%${category}%`);
    }

    const query = `
            SELECT 
                p.id, 
                p.name, 
                p.price,
                p.created_at, 
                p.updated_at, 
                p.category_id,
                c.name AS category_name,
                GROUP_CONCAT(pi.image_url) AS images
            FROM products p
            JOIN categories c ON p.category_id = c.id
            LEFT JOIN product_images pi ON p.id = pi.product_id
            ${whereClause}
            GROUP BY p.id
            ORDER BY p.price ${sort.toUpperCase()}
            LIMIT ? OFFSET ?;
        `;

    params.push(limit, offset); // Add limit and offset to parameters

    const [rows] = await promisePool.query(query, params); // Execute query and get products

    // Map products with images, split image URLs into an array
    const productsWithImages = rows.map((product) => ({
      ...product,
      images: product.images ? product.images.split(",") : [],
    }));

    return productsWithImages; // Return products with image URLs
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error; // Throw error if query fails
  }
};

// Function to add a new product
const { v4: uuidv4 } = require("uuid");
const postproducts = async (name, price, category_id) => {
  try {
    const uuid = uuidv4(); // Generate a unique identifier for the product

    // Insert the new product into the database
    const [result] = await promisePool.execute(
      `INSERT INTO products (uuid, name, price, category_id) VALUES (?,?,?,?)`,
      [uuid, name, price, category_id]
    );
    return result; // Return the result of the insert operation
  } catch (error) {
    console.log("Error inserting in products", error);
    throw error; // Throw error if the insert operation fails
  }
};

// Function to check if a category exists
const checkCategoryExists = async (category_id) => {
  const [rows] = await promisePool.execute(
    `SELECT id FROM categories WHERE id = ?`,
    [category_id]
  );
  return rows.length > 0; // Return true if category exists, otherwise false
};

// Function to update product details
const putproducts = async (id, name, price, category_id, imagePaths = []) => {
  try {
    const categoryExists = await checkCategoryExists(category_id); // Check if category exists
    if (!categoryExists) {
      throw new Error(`Category with ID ${category_id} does not exist`); // Throw error if category does not exist
    }

    // Update product data
    await promisePool.execute(
      `UPDATE products SET name = ?, price = ?, category_id = ? WHERE id = ?`,
      [name, price, category_id, id]
    );

    // Delete old images associated with the product
    await deleteProductImages(id);

    // Insert new images if provided
    if (imagePaths.length > 0) {
      await InsertProductImage(id, imagePaths);
    }

    return {
      id,
      name,
      price,
      category_id,
      images: imagePaths,
    };
  } catch (error) {
    console.log("Error updating product:", error);
    throw error; // Throw error if update fails
  }
};

// Function to delete a product
const deleteproducts = async (id) => {
  try {
    const [rows] = await promisePool.execute(
      `DELETE FROM products WHERE id = ?`,
      [id]
    );
    return rows; // Return the result of the delete operation
  } catch (error) {
    console.log("Error deleting the product", error);
    throw error; // Throw error if delete operation fails
  }
};

// Function to insert images for a product
const InsertProductImage = async (productId, imageUrls) => {
  try {
    const Values = imageUrls.map((url) => [productId, url]); // Map image URLs to insert format
    const [result] = await promisePool.query(
      `INSERT INTO product_images (product_id, image_url) VALUES ?`,
      [Values]
    );
    return result; // Return result of insert operation
  } catch (error) {
    console.error("Error inserting product images:", error);
    throw error; // Throw error if image insertion fails
  }
};

// Function to get product details by ID
const getProductById = async (id) => {
  const [rows] = await promisePool.query(
    `SELECT 
            p.*, 
            GROUP_CONCAT(pi.image_url) AS images 
        FROM products p 
        LEFT JOIN product_images pi ON p.id = pi.product_id 
        WHERE p.id = ? 
        GROUP BY p.id`,
    [id]
  );

  if (rows.length === 0) return null; // Return null if no product found

  return {
    ...rows[0], // Return product with image URLs split into an array
    images: rows[0].images ? rows[0].images.split(",") : [],
  };
};

// Function to delete product images by product ID
const deleteProductImages = async (productId) => {
  await promisePool.execute("DELETE FROM product_images WHERE product_id = ?", [
    productId,
  ]);
};

// Function to get all products for reporting (e.g., export to CSV)
const getAllProductsForReport = async () => {
  try {
    const query = `
            SELECT 
                p.id, 
                p.name, 
                p.price,
                p.created_at, 
                p.updated_at, 
                c.name AS category_name
            FROM products p
            JOIN categories c ON p.category_id = c.id
            ORDER BY p.created_at DESC;
        `;
    const [rows] = await promisePool.query(query);
    return rows; // Return products for the report
  } catch (error) {
    console.error("Error fetching products for report:", error);
    throw error; // Throw error if the query fails
  }
};

module.exports = {
  getAllproducts,
  postproducts,
  putproducts,
  deleteproducts,
  tostalProduct,
  InsertProductImage,
  deleteProductImages,
  getProductById,
  getAllProductsForReport,
};
