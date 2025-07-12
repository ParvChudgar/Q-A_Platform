import express from 'express';
const router = express.Router();
import { getNotifications, markNotificationsAsRead } from '../controllers/notificationController.js';
import { protect } from '../middleware/authMiddleware.js';

router.get('/', protect, getNotifications);
router.post('/mark-read', protect, markNotificationsAsRead);

export default router;