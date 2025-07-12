import { v2 as cloudinary } from 'cloudinary';
import DataURIParser from 'datauri/parser.js';
import path from 'path';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const dUri = new DataURIParser();

const dataUri = (req) => {
  return dUri.format(path.extname(req.file.originalname).toString(), req.file.buffer);
};

export { cloudinary, dataUri };
