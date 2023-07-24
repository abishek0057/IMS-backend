const User = require("../models/userModel");
const { generateToken } = require("../utils/jwt");
const { validatePassword } = require("../utils/password");

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

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400);
      throw new Error("please add email and password");
    }
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400);
      throw new Error("User not found!!");
    }
    const hashedPassword = user.password;
    const isCorrectPassword = await validatePassword(password, hashedPassword);
    const token = generateToken(user._id);
    res.cookie("token", token, {
      path: "/",
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 86400),
      sameSite: "none",
      secure: true,
    });
    if (user && isCorrectPassword) {
      const result = { ...user.toObject(), token };
      res.status(201).json({ userInfo: result });
    } else {
      res.status(400);
      throw new Error("Invalid email or password");
    }
  } catch (err) {
    next(err);
  }
};

const logoutUser = async (req, res) => {
  res.cookie("token", "", {
    path: "/",
    httpOnly: true,
    expires: new Date(0),
    sameSite: "none",
    secure: true,
  });
  return res.status(200).json({ message: "successfully logout" });
};

const getUser = async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  if (user) {
    res.status(201).json({ user });
  } else {
    res.status(400);
    throw new Error("User not found");
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getUser,
};
