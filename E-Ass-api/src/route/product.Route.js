const express = require("express");
const { getProducts, InsertProducts, EditProducts, DeleteProducts, getProductById, downloadProductReport } = require("../controller/product.Controller")

const upload = require("../middleware.js/upload");
const authMiddleware = require("../middleware.js/auth.middleware");

const router = express.Router();

// getProducts,
//     InsertProducts,
//     EditProducts,


router.get("/", authMiddleware, getProducts);

router.get("/:id", authMiddleware, getProductById);

router.post("/", authMiddleware, upload.array('images', 5), InsertProducts);

router.put("/:id", authMiddleware, upload.array('images', 5), EditProducts);

router.delete("/:id", authMiddleware, DeleteProducts);

router.get('/report/download', authMiddleware, downloadProductReport);

module.exports = router

