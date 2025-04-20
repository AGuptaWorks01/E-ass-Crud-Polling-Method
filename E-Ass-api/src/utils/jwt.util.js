// Import the jsonwebtoken library for creating and verifying JWT tokens
const jwt = require("jsonwebtoken");

// Load the secret key from environment variables for signing the token
const SECRET_KEY = process.env.SECRET_KEY;

// Function to generate a JWT token for a given user ID
exports.generateToken = (userId) => {
  try {
    // Create a token that includes the user's ID and expires in 1 hour
    const token = jwt.sign({ id: userId }, SECRET_KEY, { expiresIn: "1h" });
    return token; // Return the generated token
  } catch (err) {
    // Throw an error if token generation fails
    throw new Error("Error generating token");
  }
};

// Function to verify a given JWT token
exports.verifyToken = (token) => {
  try {
    // Decode and verify the token using the secret key
    const decoded = jwt.verify(token, SECRET_KEY);
    return decoded; // Return the decoded data (e.g., user ID)
  } catch (err) {
    // Throw an error if the token is invalid or expired
    throw new Error("Invalid or expired token");
  }
};
