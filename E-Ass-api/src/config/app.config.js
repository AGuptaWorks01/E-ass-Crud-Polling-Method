// Load environment variables from a .env file into process.env
require("dotenv").config();

// Export the APP_PORT from environment variables to be used in other parts of the app
module.exports = {
  APP_PORT: process.env.APP_PORT, // Fetch the application port from the environment variables
};
