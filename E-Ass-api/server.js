// Import the main Express application
const app = require("./src/app");

// Import the application configuration such as port number
const appConfig = require("./src/config/app.config");

// console.log("DB_USER:", process.env.DB_USER);
// console.log("DB_PASSWORD:", process.env.DB_PASSWORD);

// Function to start the server
async function startServer() {
  try {
    // Start listening on the configured port
    app.listen(appConfig.APP_PORT, () =>
      console.log("Server is started on http://localhost:" + appConfig.APP_PORT)
    );
  } catch (error) {
    console.log("Error starting the server:", error);
  }
}

// Start the server
startServer();
