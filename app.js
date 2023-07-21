const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 8888;
const dbConString = process.env.DB_CONNECTION_STRING;

const start = async () => {
  try {
    await mongoose.connect(dbConString);
    app.listen(PORT, () => console.log(`server is running in ${PORT}`));
  } catch (err) {
    console.log(err);
  }
};
start();
