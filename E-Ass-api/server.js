const app = require("./src/app");
const appConfig = require("./src/config/app.config");



// console.log("DB_USER:", process.env.DB_USER);
// console.log("DB_PASSWORD:", process.env.DB_PASSWORD);

async function startServer() {
    try {
        app.listen(appConfig.APP_PORT, () =>
            console.log("Server is started on http://localhost:" + appConfig.APP_PORT)
        );
    } catch (error) {
        console.log("Error starting the server:", error);
    }
}

startServer();
