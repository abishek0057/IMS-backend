const multer = require("multer");
const DatauriParser = require("datauri/parser");

const storage = multer.memoryStorage();

const upload = multer({ storage });

const fileSizeFormatter = (bytes) => {
  if (bytes === 0) {
    return "0 Bytes";
  }
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB"];
  const index = Math.trunc(Math.log(bytes) / Math.log(1024));
  return (
    parseFloat((bytes / Math.pow(1024, index)).toFixed(2)) + " " + sizes[index]
  );
};

const bufferToDataURI = (buffer, mimetype) => {
  const parser = new DatauriParser();
  parser.format(mimetype, buffer);
  return parser.content;
};

module.exports = { upload, fileSizeFormatter, bufferToDataURI };
