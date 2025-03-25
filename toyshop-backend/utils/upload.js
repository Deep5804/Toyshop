const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

// ✅ Allowed image formats including AVIF
const allowedMimeTypes = [
    "image/jpeg", "image/png", "image/jpg", "image/webp",
    "image/gif", "image/bmp", "image/tiff", "image/x-icon",
    "image/svg+xml", "image/vnd.adobe.photoshop", "image/avif"
];

// ✅ Multer file filter to validate image formats
const fileFilter = (req, file, cb) => {
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true); // Accept file
    } else {
        cb(new Error("Invalid file type. Only JPG, PNG, JPEG, WebP, AVIF, etc., are allowed."), false);
    }
};

// ✅ Cloudinary storage configuration
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "toyshop",
        allowed_formats: ["jpg", "png", "jpeg", "webp", "avif", "gif", "bmp", "tiff", "ico", "svg"],
    },
});

// ✅ Multer upload configuration
const upload = multer({ 
    storage, 
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB file size limit
});

module.exports = upload;
