const express = require("express");
const categoryController = require("../controller/category.Controller");

const authMiddleware = require("../middleware.js/auth.middleware");
const router = express.Router();

router.get("/", authMiddleware, categoryController.getcategories);

router.post("/", authMiddleware, categoryController.InsertCategory);

router.put("/:id", authMiddleware, categoryController.EditCategory);

router.delete("/:id", authMiddleware, categoryController.DeleteCategory);

router.delete("/", authMiddleware, categoryController.TruncateData);

module.exports = router