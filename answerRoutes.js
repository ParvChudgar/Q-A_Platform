import express from 'express';
const router = express.Router();
import { voteOnTarget } from '../controllers/voteController.js';
// Note: Answer creation is handled under question routes for context
import { protect } from '../middleware/authMiddleware.js';

router.post('/:id/vote', protect, voteOnTarget);
// Commenting routes could be added here if needed

export default router;