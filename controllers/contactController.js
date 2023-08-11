const User = require("../models/userModel");
const sendEmail = require("../utils/sendEmail");

const contactUs = async (req, res, next) => {
  try {
    const { subject, message } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      res.status(400);
      throw new Error("User not found");
    }
    if (!subject || !message) {
      res.status(400);
      throw new Error("Please add subject and message");
    }

    const reply_to = user.email;
    const send_to = process.env.EMAIL_USER;
    const send_from = process.env.EMAIL_USER;

    const emailResult = await sendEmail(
      send_from,
      send_to,
      subject,
      message,
      reply_to
    );
    if (emailResult.accepted.length > 0)
      res.status(200).json({ success: true, message: "Reset Email send" });
    else
      res.status(400).json({ success: false, message: "Reset Email not send" });
  } catch (err) {
    next(err);
  }
};

module.exports = { contactUs };
