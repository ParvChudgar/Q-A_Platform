import express from 'express';
const router = express.Router();
import { createQuestion, getQuestions, getQuestionById, acceptAnswer } from '../controllers/questionController.js';
import { createAnswer } from '../controllers/answerController.js';
import { voteOnTarget } from '../controllers/voteController.js';
import { protect } from '../middleware/authMiddleware.js';

router.route('/').get(getQuestions).post(protect, createQuestion);
router.route('/:id').get(getQuestionById);
router.post('/:id/answers', protect, createAnswer);
router.post('/:id/vote', protect, voteOnTarget);
router.post('/:questionId/accept/:answerId', protect, acceptAnswer);

export default router;