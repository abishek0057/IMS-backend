const Product = require("../models/productModel");

const createProduct = async (req, res, next) => {
  try {
    const { name, sku, category, quantity, price, description } = req.body;
    if (!name || !category || !quantity || !price || !description) {
      res.status(400);
      throw new Error("Please fill in all fields");
    }
    const product = await Product.create({
      user: req.user.id,
      name,
      sku,
      category,
      quantity,
      price,
      description,
    });
    res.status(201).json({ newProduct: product });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createProduct,
};
