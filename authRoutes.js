import express from 'express';
const router = express.Router();
import { registerUser, loginUser, getUserProfile } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getUserProfile);

export default router;