const express = require("express");
const { getProducts, InsertProducts, EditProducts, DeleteProducts, TruncateData } = require("../controller/product.Controller")

const upload = require("../middleware.js/upload");

const router = express.Router();

// getProducts,
//     InsertProducts,
//     EditProducts,


router.get("/products", getProducts);

router.post("/products", upload.array('images', 5), InsertProducts);

router.put("/products/:id", EditProducts);

router.delete("/products/:id", DeleteProducts);

router.delete("/products", TruncateData);


module.exports = router

