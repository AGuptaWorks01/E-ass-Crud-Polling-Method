// Import the MySQL2 module
const mysql = require("mysql2");

// Import database configuration settings
const dbConfig = require("../config/db.config.js");

// Create a MySQL connection pool
// A pool manages multiple connections for better performance and scalability
const pool = mysql.createPool({
  host: dbConfig.HOST, // Database host (e.g., localhost)
  user: dbConfig.USER, // Database username
  password: dbConfig.PASSWORD, // Database password
  database: dbConfig.DB, // Database name
  connectionLimit: dbConfig.pool.max, // Maximum number of connections in the pool
});

// Convert pool to use promises for async/await support
const promisePool = pool.promise();

// Optional: Test database connection when the server starts
pool.getConnection((err, connection) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    // Log connection error
  } else {
    console.log("Database connected successfully");
    // Log success message
    connection.release(); // Release the connection back to the pool
  }
});

// Export 
module.exports = promisePool;
