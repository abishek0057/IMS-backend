const multer = require("multer");
const DatauriParser = require("datauri/parser");

const storage = multer.memoryStorage();

const upload = multer({ storage });

const fileSizeFormatter = (bytes, decimal) => {
  if (bytes === 0) {
    return "0 Bytes";
  }
  const dm = decimal || 2;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB"];
  const index = Math.floor(Math.log(bytes) / Math.log(1000));
  return (
    parseFloat((bytes / Math.pow(1000, index)).toFixed(dm)) + " " + sizes[index]
  );
};

const bufferToDataURI = (buffer, mimetype) => {
  const parser = new DatauriParser();
  parser.format(mimetype, buffer);
  return parser.content;
};

module.exports = { upload, fileSizeFormatter, bufferToDataURI };
