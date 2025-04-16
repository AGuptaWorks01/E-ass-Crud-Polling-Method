const express = require("express");
const cors = require("cors");
const Categoryrouter = require("./route/category.Route");
const Productrouter = require("./route/product.Route");
const authUser = require('./route/user.Route')

const app = express();

// CORS configuration
const corsOptions = {
    origin: "http://localhost:4200",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use("/category", Categoryrouter);
app.use("/product", Productrouter);
app.use("/auth", authUser)

module.exports = app;
