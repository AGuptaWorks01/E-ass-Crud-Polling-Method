const express = require("express");
const cors = require("cors");
const Categoryrouter = require("./route/category.Route");
const Productrouter = require("./route/product.Route");
const authUser = require("./route/user.Route")

const app = express();

// CORS configuration
const corsOptions = {
    origin: "http://localhost:4200",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json({ extended: true }));

// Routes
app.use("/api/categories", Categoryrouter);
app.use("/api/products", Productrouter);
app.use("/api/auth", authUser);

// For upload image
app.use("/api/uploads", express.static("uploads"));


module.exports = app;
