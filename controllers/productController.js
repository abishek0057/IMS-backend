const Product = require("../models/productModel");
const { fileSizeFormatter } = require("../utils/fileUpload");

const createProduct = async (req, res, next) => {
  try {
    const { name, sku, category, quantity, price, description } = req.body;
    if (!name || !category || !quantity || !price || !description) {
      res.status(400);
      throw new Error("Please fill in all fields");
    }

    let fileData = {};
    if (req.file) {
      fileData = {
        fileName: req.file.Originalname,
        filePath: req.file.path,
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

module.exports = {
  createProduct,
};
