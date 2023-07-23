const User = require("../models/userModel");
const { generateToken } = require("../utils/jwt");

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

    let result = await newUser.save();

    const token = generateToken(result._id);
    res.cookie("token", token, {
      path: "/",
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 86400),
      sameSite: "none",
      secure: true,
    });

    result = { ...result.toObject(), token };

    res.status(201).json({ newuser: result });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  registerUser,
};
