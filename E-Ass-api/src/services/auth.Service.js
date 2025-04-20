const bcrypt = require("bcrypt"); // Import bcrypt for password hashing and comparison
const { generateToken } = require("../utils/jwt.util"); // Import the function to generate JWT tokens
const UserModel = require("../models/auth.Model"); // Import the UserModel for interacting with the database

// Function to register a new user
const registerUser = async (email, password) => {
  try {
    // Check if a user with the given email already exists in the database
    const existingUser = await UserModel.findUserByEmail(email);
    if (existingUser.length > 0) {
      // If the user exists, throw an error with a custom message
      throw { status: 400, message: "User already exists" };
    }

    // Hash the user's password before saving it to the database (salt rounds = 10)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user in the database with the hashed password
    await UserModel.createUser(email, hashedPassword);
  } catch (error) {
    // If an error occurs (e.g., database issue), rethrow it for handling in the controller
    throw error;
  }
};

// Function to log in a user
const loginUser = async (email, password) => {
  try {
    // Check if a user with the given email exists
    const users = await UserModel.findUserByEmail(email);
    if (!users.length) {
      // If no user is found with that email, throw an error
      throw { status: 400, message: "Invalid credentials" };
    }

    // Get the user data
    const user = users[0];

    // Compare the entered password with the stored hashed password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      // If passwords do not match, throw an error
      throw { status: 400, message: "Invalid credentials" };
    }

    // Generate a JWT token for the user upon successful login
    const token = generateToken(user.id);

    // Return the generated token to the client
    return { token };
  } catch (error) {
    // If any error occurs during the login process, rethrow it
    throw error;
  }
};

module.exports = {
  registerUser, // Export the register function
  loginUser, // Export the login function
};
