const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

const verifyToken = (token, secret) => jwt.verify(token, secret);

module.exports = {
  generateToken,
  verifyToken,
};
