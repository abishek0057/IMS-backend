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

const getProducts = async (req, res) => {
  try {
    const products = await Product.find({ user: req.user.id }).sort(
      "-createdAt"
    );
    res.status(200).json({ products });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createProduct,
  getProducts,
};
