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

const validatePassword = async (password, hashPass) => {
  try {
    const isValidPass = await bcrypt.compare(password, hashPass);
    return isValidPass;
  } catch (err) {
    console.log(err.message);
  }
};

module.exports = { hashPassword, validatePassword };
