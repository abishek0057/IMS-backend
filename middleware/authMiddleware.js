const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const { verifyToken } = require("../utils/jwt");

const protect = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      res.status(401);
      throw new Error("Not authorized, please login");
    }
    const verified = verifyToken(token, process.env.JWT_SECRET);

    const user = await User.findById(verified.id).select("-password");
    if (!user) {
      res.status(401);
      throw new Error("User not found");
    }
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = { protect };
