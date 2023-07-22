const bcrypt = require("bcryptjs");
const saltRound = 10;

const hashPassword = async (password) => {
  try {
    const hashedPassword = await bcrypt.hash(password, saltRound);
    return hashedPassword;
  } catch (err) {
    console.log(err.message);
  }
};

module.exports = { hashPassword };
