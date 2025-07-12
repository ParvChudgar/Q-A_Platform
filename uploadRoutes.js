import express from 'express';
import multer from 'multer';
import { uploadImage } from '../controllers/uploadController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Use memory storage to avoid saving files to the server before uploading to Cloudinary
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/image', protect, upload.single('image'), uploadImage);

export default router;