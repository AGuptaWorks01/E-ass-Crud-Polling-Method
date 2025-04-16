const express = require("express");
const categoryController = require("../controller/category.Controller");

const authMiddleware = require("../middleware.js/auth.middleware");
const router = express.Router();

router.get("/categories", authMiddleware, categoryController.getcategories);
router.post("/categories", authMiddleware, categoryController.InsertCategory);
router.put("/categories/:id", authMiddleware, categoryController.EditCategory);
router.delete("/categories/:id", authMiddleware, categoryController.DeleteCategory);
router.delete("/categories", authMiddleware, categoryController.TruncateData);

module.exports = router