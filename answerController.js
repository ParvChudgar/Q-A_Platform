import Answer from '../models/answerModel.js';
import Question from '../models/questionModel.js';
import { createNotification } from '../utils/notificationUtils.js';

// @desc    Create a new answer
// @route   POST /api/questions/:id/answers
// @access  Private
const createAnswer = async (req, res) => {
    const { content } = req.body;
    const questionId = req.params.id;

    const question = await Question.findById(questionId);

    if (!question) {
        res.status(404).json({ message: 'Question not found' });
        return;
    }

    const answer = new Answer({
        content,
        author: req.user._id,
        question: questionId,
    });

    const createdAnswer = await answer.save();

    question.answers.push(createdAnswer._id);
    await question.save();
    
    // Notify the question author
    await createNotification(req, question.author, 'new_answer', question._id, 'Question');

    // Populate author before sending response
    const populatedAnswer = await Answer.findById(createdAnswer._id).populate('author', 'username reputation');

    res.status(201).json(populatedAnswer);
};


export { createAnswer };