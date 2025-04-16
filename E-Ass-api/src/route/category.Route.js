const express = require("express");
const { getcategories, InsertCategory, EditCategory, DeleteCategory, TruncateData } = require("../controller/category.Controller");
const authMiddleware = require("../middleware.js/auth.middleware");
const router = express.Router();

router.get("/categories", authMiddleware, getcategories);
router.post("/categories", authMiddleware, InsertCategory);
router.put("/categories/:id", authMiddleware, EditCategory);
router.delete("/categories/:id", authMiddleware, DeleteCategory);
router.delete("/categories", authMiddleware, TruncateData);

module.exports = router