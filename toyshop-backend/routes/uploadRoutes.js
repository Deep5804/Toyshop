const express = require("express");
const router = express.Router();
const upload = require("../utils/upload"); // ✅ Import Multer setup

// ✅ Upload Multiple Images Route
router.post("/", upload.array("images", 5), (req, res) => { 
    console.log("Files received:", req.files); 

    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: "No files uploaded!" });
    }

    // ✅ Extract image URLs from Cloudinary response
    const imageUrls = req.files.map(file => file.path);

    res.json({ success: true, imageUrls }); // ✅ Ensure JSON response
});

module.exports = router;
