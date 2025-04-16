const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directory exists
const uploadDir = 'uploads/';
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
    destination: uploadDir,
    filename: (_, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const fileFilter = (_, file, cb) => {
    const isImage = ["image/jpeg", "image/png", "image/jpg"].includes(file.mimetype);
    cb(isImage ? null : new Error("Only images allowed"), isImage);
};

const upload = multer({
    storage,
    fileFilter,
});

module.exports = upload;
