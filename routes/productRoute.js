const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { createProduct } = require("../controllers/productController");
const { upload } = require("../utils/fileUpload");

const router = express.Router();

router.post("/", protect, upload.single("image"), createProduct);

module.exports = router;
