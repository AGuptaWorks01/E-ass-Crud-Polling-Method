const multer = require('multer')
const path = require('path')
const fs = require('fs')

// Ensure upload directory exists

const uploadDir = "uploads/";
fs.mkdirSync(uploadDir, { recursive: true })

const upload = multer({
    storage: multer.diskStorage({
        destination: uploadDir,
        filename: (_, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
    }),
    fileFilter: (_, file, cb) => {
        const isImage = ["image/jpg", "image/png", "image/jpg"].includes(file.mimetype);
        cb(isImage ? null : new Error("Only images allowed"), isImage);
    }
})