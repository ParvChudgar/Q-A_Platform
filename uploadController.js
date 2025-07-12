import { cloudinary, dataUri } from '../utils/cloudinary.js';

// @desc    Upload an image for the rich text editor
// @route   POST /api/upload/image
// @access  Private
const uploadImage = async (req, res) => {
    if (req.file) {
        try {
            const file = dataUri(req).content;
            const result = await cloudinary.uploader.upload(file, {
                folder: 'stackit_uploads' // Optional: organize uploads in Cloudinary
            });
            res.status(200).json({ url: result.secure_url });
        } catch (error) {
            console.error('Cloudinary upload error:', error);
            res.status(500).json({ message: 'Image upload failed' });
        }
    } else {
        res.status(400).json({ message: 'No file provided' });
    }
};

export { uploadImage };