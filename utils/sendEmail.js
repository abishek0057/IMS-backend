const nodemailer = require("nodemailer");

const sendEmail = async (
  send_from,
  send_to,
  subject,
  message,
  reply_to = null
) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: process.env.EMAIL_HOST,
      port: 587,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const mailOptions = {
      from: send_from,
      to: send_to,
      subject,
      html: message,
      replyTo: reply_to,
    };

    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (err) {
    return err;
  }
};

module.exports = sendEmail;
