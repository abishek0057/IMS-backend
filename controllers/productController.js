const mongoose = require("mongoose");
const Product = require("../models/productModel");
const { fileSizeFormatter } = require("../utils/fileUpload");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const createProduct = async (req, res, next) => {
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
        fileName: uploadedFile.Original_filename,
        filePath: uploadedFile.secure_url,
        fileType: req.file.mimetype,
        fileSize: fileSizeFormatter(req.file.size, 2),
        publicId: uploadedFile.public_id,
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

const deleteProduct = async (req, res, next) => {
  try {
    const productId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      res.status(400);
      throw new Error("Invalid product ID");
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
    if (product.image.publicId)
      await cloudinary.uploader.destroy(product.image.publicId);
    const delProduct = await Product.deleteOne({ _id: productId });
    res.status(200).json({ delProduct });
  } catch (err) {
    next(err);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const { name, category, quantity, price, description } = req.body;
    const productId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      res.status(400);
      throw new Error("Invalid product ID");
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
        fileName: uploadedFile.Original_filename,
        filePath: uploadedFile.secure_url,
        fileType: req.file.mimetype,
        fileSize: fileSizeFormatter(req.file.size, 2),
        publicId: uploadedFile.public_id,
      };
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      { _id: productId },
      {
        name,
        category,
        quantity,
        price,
        description,
        image: Object.keys(fileData).length === 0 ? product?.image : fileData,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    if (Object.keys(fileData).length > 0 && product.image.publicId) {
      await cloudinary.uploader.destroy(product.image.publicId);
    }

    res.status(201).json({ updatedProduct });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProduct,
  deleteProduct,
  updateProduct,
};
