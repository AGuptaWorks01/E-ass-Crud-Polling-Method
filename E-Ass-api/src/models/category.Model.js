const promisePool = require("../utils/dbConnection.Util");

// Function to calculate the total number of category pages
const tostalCategory = async () => {
  const limit = 10; // Set the number of items per page
  const countQuery = `SELECT COUNT(*) AS total FROM categories`; // Query to get the total count of categories
  const [countResult] = await promisePool.execute(countQuery); // Execute the query
  const totalRecords = countResult[0].total; // Get the total record count from the query result
  return Math.ceil(totalRecords / limit); // Return the number of pages based on the total count
};

// Function to get all categories with pagination
const getAllCategory = async (page) => {
  try {
    const limit = "10"; // Set the number of items per page
    const offset = (page - 1) * parseInt(limit); // Calculate offset based on page number

    const [rows] = await promisePool.execute(
      `SELECT * FROM categories LIMIT ? OFFSET ?`,
      [limit, offset.toString()]
    ); // Fetch categories with limit and offset
    return rows; // Return the list of categories
  } catch (error) {
    console.error("Error fetching categories:", error); // Log any errors
    throw error; // Rethrow error if query fails
  }
};

// Function to add a new category with a unique UUID
const { v4: uuidv4 } = require("uuid"); // Import UUID generator
const postCategory = async (name) => {
  const uuid = uuidv4(); // Generate a unique UUID for the category

  try {
    // Insert the new category into the database
    const [result] = await promisePool.execute(
      `INSERT INTO categories (uuid, name) VALUES (?,?)`,
      [uuid, name]
    );
    return result; // Return the result of the insert operation
  } catch (error) {
    // Log any errors
    throw error; // Rethrow error if insert operation fails
  }
};

// Function to update an existing category by ID
const putCategory = async (id, name) => {
  try {
    // Update the category name in the database
    const [rows] = await promisePool.execute(
      `UPDATE categories SET name = ? WHERE id = ?`,
      [name, id]
    );

    // Check if no rows were affected, meaning the ID does not exist
    if (rows.affectedRows === 0) {
      throw new Error("No category found with the provided ID"); // Throw error if category is not found
    }

    return rows; // Return the result of the update operation
  } catch (error) {
    console.log("Error updating category:", error); // Log any errors
    throw error; // Rethrow error if update fails
  }
};

// Function to delete a category by ID
const deleteCategory = async (id) => {
  try {
    // Delete the category from the database
    const [rows] = await promisePool.execute(
      `DELETE FROM categories WHERE id = ?`,
      [id]
    );
    return rows; // Return the result of the delete operation
  } catch (error) {
    console.log("Error deleting category:", error); // Log any errors
    throw error; // Rethrow error if delete operation fails
  }
};

module.exports = {
  getAllCategory,
  postCategory,
  putCategory,
  deleteCategory,
  tostalCategory,
};
