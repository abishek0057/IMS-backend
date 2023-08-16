const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv").config();
const { errorHandler } = require("./middleware/errorMiddleware");
const app = express();
const PORT = process.env.PORT || 8888;
const dbConString =
  process.env.NODE_ENV === "docker"
    ? process.env.DB_CONNECTION_STRING_FOR_DOCKER
    : process.env.DB_CONNECTION_STRING;
const cookieParser = require("cookie-parser");
const path = require("path");

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());

const userRoute = require("./routes/userRoute");
const productRoute = require("./routes/productRoute");
const contactRoute = require("./routes/contactRoute");

app.use("/api/user", userRoute);
app.use("/api/product", productRoute);
app.use("/api/contact", contactRoute);

app.get("/", (req, res) => {
  res.send("Wellcome to Inventory Management System");
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
