import multer from "multer";
import DataParser from "datauri/parser.js";
import path from "path";

// Multer configuration for file upload
const storage = multer.memoryStorage();
const multerUpload = multer({ storage });
const dataUri = new DataParser();

export const formateImage = (file) => {
  const fileExtension = path.extname(file.originalname).toString();
  return dataUri.format(fileExtension, file.buffer).content;
};

export default multerUpload;
