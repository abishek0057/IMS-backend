const User = require("../models/userModel");

const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      res.status(400);
      throw new Error("please fill in all require fields");
    }
    if (password.length < 8) {
      res.status(400);
      throw new Error("Password must be 8 character or more");
    }
    const userExist = await User.findOne({ email });
    if (userExist) {
      res.status(409);
      throw new Error("Email already exist");
    }
    const newUser = await User({
      name,
      email,
      password,
    });

    const result = await newUser.save();
    res.status(201).json({ newuser: result });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  registerUser,
};
