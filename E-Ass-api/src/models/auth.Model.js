// Import the database connection utility
const db = require("../utils/dbConnection.Util");

// Function to find a user in the database by their email
const findUserByEmail = async (email) => {
  try {
    // Execute a query to select a user with the given email
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    return rows; // Return the result
  } catch (error) {
    // Throw a custom error object if the query fails
    throw { status: 500, message: "Database error while finding user", error };
  }
};

// Function to create a new user with email and hashed password
const createUser = async (email, hashedPassword) => {
  try {
    // Insert a new user record into the users table
    await db.query("INSERT INTO users (email, password) VALUES (?, ?)", [
      email,
      hashedPassword,
    ]);
  } catch (error) {
    // Handle duplicate entry error when email already exists
    if (error.code === "ER_DUP_ENTRY") {
      throw { status: 400, message: "User already exists", error };
    }
    // Handle general database errors
    throw { status: 500, message: "Database error while creating user", error };
  }
};

// Export the functions to be used in other parts of the application
module.exports = {
  findUserByEmail,
  createUser,
};
