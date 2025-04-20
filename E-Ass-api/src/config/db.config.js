// Load environment variables from a .env file into process.env
require("dotenv").config();

// Export the database configuration, fetching values from environment variables or using default values
module.exports = {
  HOST: process.env.DB_HOST || "127.0.0.1", // Database host (default: '127.0.0.1')
  USER: process.env.DB_USER || "root", // Database user (default: 'root')
  PASSWORD: process.env.DB_PASSWORD || "root@123", // Database password (default: 'root@123')
  DB: process.env.DB_NAME || "CrudAssesment", // Database name (default: 'CrudAssesment')
  dialect: "mysql", // Database dialect (using MySQL)

  // Database connection pool configuration
  pool: {
    max: 5, // Maximum number of connections in the pool
    min: 0, // Minimum number of connections in the pool
    acquire: 30000, // Maximum time (in ms) that pool will try to get a connection before throwing an error
    idle: 10000, // Maximum time (in ms) that a connection can be idle before being released
  },
};
