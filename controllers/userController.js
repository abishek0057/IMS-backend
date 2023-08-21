const User = require("../models/userModel");
const Token = require("../models/tokenModel");
const crypto = require("crypto");
const { generateToken, verifyToken } = require("../utils/jwt");
const { validatePassword } = require("../utils/password");
const message = require("../utils/emailContent");
const sendEmail = require("../utils/sendEmail");
const { bufferToDataURI } = require("../utils/fileUpload");
const cloudinary = require("cloudinary").v2;

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

const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (user) {
      res.status(201).json({ user });
    } else {
      res.status(400);
      throw new Error("User not found");
    }
  } catch (err) {
    next(err);
  }
};

const loginStatus = async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.json(false);
  const verified = verifyToken(token, process.env.JWT_SECRET);
  if (verified) return res.json(true);
  else return res.json(false);
};

const updateUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const imageLinkArr = user.photo.split("/");
    let uploadedFile;
    if (req.file) {
      try {
        await cloudinary.uploader.destroy(
          `userImage/${imageLinkArr[imageLinkArr.length - 1].replace(
            ".jpg",
            ""
          )}`
        );
        const fileString = bufferToDataURI(req.file.buffer, req.file.mimetype);
        uploadedFile = await cloudinary.uploader.upload(fileString, {
          folder: "userImage",
          resource_type: "image",
        });
      } catch (err) {
        res.status(500);
        throw new Error("Image could not be uploaded");
      }
    }
    if (user) {
      user.name = req.body.name || user.name;
      user.phone = req.body.phone || user.phone;
      user.bio = req.body.bio || user.bio;
      user.photo = uploadedFile.secure_url || user.photo;

      const updateduser = await user.save();
      res.status(200).json({ updateduser });
    } else {
      res.status(400);
      throw new Error("user not found");
    }
  } catch (err) {
    next(err);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const { oldPassword, password } = req.body;

    if (!user) {
      res.status(400);
      throw new Error("Please signup");
    }
    if (!oldPassword || !password) {
      res.status(400);
      throw new Error("Please add old and new password");
    }
    const isValidPassword = await validatePassword(oldPassword, user.password);

    if (isValidPassword) {
      user.password = password;
      await user.save();
      res.status(200).json({ message: "password change successfully" });
    } else {
      res.status(400);
      throw new Error("Incorrect old password");
    }
  } catch (err) {
    next(err);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      res.status(404);
      throw new Error("User does not exist");
    }

    let token = await Token.findOne({ userId: user._id });
    if (token) {
      await token.deleteOne();
    }

    let resetToken = crypto.randomBytes(32).toString("hex") + user._id;

    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    const resetTokenInfo = new Token({
      userId: user._id,
      token: hashedToken,
      createdAt: Date.now(),
      expiresAt: Date.now() + 30 * 60 * 1000,
    });
    const result = await resetTokenInfo.save();
    const resetUrl = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;

    const msg = message(user.name, process.env.FRONTEND_URL, resetUrl);
    const subject = "Password Reset Request";
    const send_to = user.email;
    const send_from = process.env.EMAIL_USER;
    const emailResult = await sendEmail(send_from, send_to, subject, msg);
    if (emailResult.accepted.length > 0)
      res.status(200).json({ success: true, message: "Reset Email send" });
    else
      res.status(400).json({ success: false, message: "Reset Email not send" });
  } catch (err) {
    next(err);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { password } = req.body;
    const { resetToken } = req.params;

    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    const userToken = await Token.findOne({
      token: hashedToken,
      expiresAt: { $gt: Date.now() },
    });
    if (!userToken) {
      res.status(400);
      throw new Error("Invalid or expired token");
    }
    const user = await User.findOne({ _id: userToken.userId });
    user.password = password;
    await user.save();
    res.status(200).json({ message: "Password reset successfull" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getUser,
  loginStatus,
  updateUser,
  changePassword,
  forgotPassword,
  resetPassword,
};
