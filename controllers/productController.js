const mongoose = require("mongoose");
const Product = require("../models/productModel");
const { fileSizeFormatter } = require("../utils/fileUpload");
const cloudinary = require("cloudinary").v2;

const createProduct = async (req, res, next) => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  try {
    const { name, sku, category, quantity, price, description } = req.body;
    if (!name || !category || !quantity || !price || !description) {
      res.status(400);
      throw new Error("Please fill in all fields");
    }

    let fileData = {};
    if (req.file) {
      let uploadedFile;
      try {
        uploadedFile = await cloudinary.uploader.upload(req.file.path, {
          folder: "IMS",
          resource_type: "image",
        });
      } catch (err) {
        res.status(500);
        throw new Error("Image could not be uploaded");
      }
      fileData = {
        fileName: req.file.Originalname,
        filePath: uploadedFile.secure_url,
        fileType: req.file.mimetype,
        fileSize: fileSizeFormatter(req.file.size, 2),
      };
    }

    const product = await Product.create({
      user: req.user.id,
      name,
      sku,
      category,
      quantity,
      price,
      description,
      image: fileData,
    });
    res.status(201).json({ newProduct: product });
  } catch (err) {
    next(err);
  }
};

const getProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ user: req.user.id }).sort(
      "-createdAt"
    );
    res.status(200).json({ products });
  } catch (err) {
    next(err);
  }
};

const getProduct = async (req, res, next) => {
  try {
    const productId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      res.status(400);
      throw new Error("Invalid product ID");
      return;
    }

    const product = await Product.findById(productId);
    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }
    if (product.user.toString() !== req.user.id) {
      res.status(404);
      throw new Error("User not authorized");
    }
    res.status(200).json({ product });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProduct,
};
