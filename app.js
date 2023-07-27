const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv").config();
const { errorHandler } = require("./middleware/errorMiddleware");
const app = express();
const PORT = process.env.PORT || 8888;
const dbConString = process.env.DB_CONNECTION_STRING;
const cookieParser = require("cookie-parser");

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());

const userRoute = require("./routes/userRoute");
const productRoute = require("./routes/productRoute");
app.use("/api/user", userRoute);
app.use("/api/product", productRoute);

app.get("/", (req, res) => {
  res.send("yohohohoho");
});

app.use(errorHandler);

const start = async () => {
  try {
    await mongoose.connect(dbConString);
    app.listen(PORT, () => console.log(`server is running on port ${PORT}`));
  } catch (err) {
    console.log(err);
  }
};
start();
