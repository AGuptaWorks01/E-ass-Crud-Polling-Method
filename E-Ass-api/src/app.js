// Import required modules
const express = require("express");
const cors = require("cors");

// Import route handlers
const Categoryrouter = require("./route/category.Route");
const Productrouter = require("./route/product.Route");
const authUser = require("./route/user.Route");

const app = express();

// CORS configuration to allow requests from the Angular frontend running on port 4200
const corsOptions = {
  origin: "http://localhost:4200", // Allow requests only from this origin
  methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
  allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers in requests
};

// Middleware setup
app.use(cors(corsOptions)); // Enable CORS with the defined options
app.use(express.json({ extended: true })); // Enable JSON parsing for incoming requests

// Register API routes
app.use("/api/categories", Categoryrouter); // Routes for category CRUD operations
app.use("/api/products", Productrouter); // Routes for product CRUD, pagination, sorting, search, and reports
app.use("/api/auth", authUser); // Routes for user authentication (register and login)

// Serve uploaded images from the uploads folder
app.use("/api/uploads", express.static("uploads")); // Make uploaded files publicly accessible

// Export the configured app
module.exports = app;
