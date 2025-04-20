const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Create the upload directory if it doesn't already exist
const uploadDir = "uploads/";
fs.mkdirSync(uploadDir, { recursive: true });

/**
 * Multer storage configuration
 * - Saves files in the 'uploads/' directory
 * - Filenames are prepended with the current timestamp to avoid name collisions
 */
const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (_, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

/**
 * File filter to allow only image uploads
 * - Accepts JPEG, PNG, and JPG formats
 * - Rejects other MIME types
 */
const fileFilter = (_, file, cb) => {
  const isImage = ["image/jpeg", "image/png", "image/jpg"].includes(
    file.mimetype
  );
  cb(isImage ? null : new Error("Only images allowed"), isImage);
};

// Initialize multer with defined storage and filter
const upload = multer({
  storage,
  fileFilter,
});

module.exports = upload;
