const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { createProduct } = require("../controllers/productController");

const router = express.Router();

router.post("/", protect, createProduct);

module.exports = router;
