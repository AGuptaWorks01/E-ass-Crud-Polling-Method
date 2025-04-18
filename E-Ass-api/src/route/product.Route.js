const express = require("express");
const { getProducts, InsertProducts, EditProducts, DeleteProducts, getProductById, downloadProductReport } = require("../controller/product.Controller")

const upload = require("../middleware.js/upload");
const authMiddleware = require("../middleware.js/auth.middleware");

const router = express.Router();

// getProducts,
//     InsertProducts,
//     EditProducts,


router.get("/products", authMiddleware, getProducts);

router.get("/products/:id", authMiddleware, getProductById);

router.post("/products", authMiddleware, upload.array('images', 5), InsertProducts);

router.put("/products/:id", authMiddleware, upload.array('images', 5), EditProducts);

router.delete("/products/:id", authMiddleware, DeleteProducts);

router.get('/report/download', downloadProductReport);

module.exports = router

