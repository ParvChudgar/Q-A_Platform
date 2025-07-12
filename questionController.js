import Question from '../models/questionModel.js';
import Tag from '../models/tagModel.js';
import Answer from '../models/answerModel.js';
import { createNotification } from '../utils/notificationUtils.js';

const getTagIds = async (tags) => {
    const tagIds = [];
    for (const tagName of tags) {
        const name = tagName.toLowerCase().trim();
        if (name) {
            let tag = await Tag.findOne({ name });
            if (!tag) {
                tag = new Tag({ name });
                await tag.save();
            }
            tagIds.push(tag._id);
        }
    }
    return tagIds;
};

const createQuestion = async (req, res) => {
    try {
        const { title, description, tags } = req.body;
        if (!title || !description || !tags || !Array.isArray(tags) || tags.length === 0) {
            return res.status(400).json({ message: 'Title, description, and at least one tag are required.' });
        }

        const tagIds = await getTagIds(tags);

        const question = new Question({
            title,
            description,
            tags: tagIds,
            author: req.user._id,
        });

        const createdQuestion = await question.save();
        await Tag.updateMany({ _id: { $in: tagIds } }, { $inc: { questionCount: 1 } });

        res.status(201).json(createdQuestion);
    } catch (error) {
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};

const getQuestions = async (req, res) => {
    const pageSize = 10;
    const page = Number(req.query.pageNumber) || 1;

    const keyword = req.query.keyword 
        ? { title: { $regex: req.query.keyword, $options: 'i' } } 
        : {};

    const count = await Question.countDocuments({ ...keyword });
    const questions = await Question.find({ ...keyword })
        .populate('author', 'username reputation')
        .populate('tags', 'name')
        .sort({ createdAt: -1 })
        .limit(pageSize)
        .skip(pageSize * (page - 1));

    res.json({ questions, page, pages: Math.ceil(count / pageSize) });
};

const getQuestionById = async (req, res) => {
    const question = await Question.findById(req.params.id)
        .populate('author', 'username reputation')
        .populate('tags', 'name')
        .populate({
            path: 'answers',
            populate: {
                path: 'author',
                select: 'username reputation'
            },
            options: { sort: { votes: -1, createdAt: 1 } }
        });

    if (question) {
        question.views += 1;
        await question.save();
        res.json(question);
    } else {
        res.status(404).json({ message: 'Question not found' });
    }
};

const acceptAnswer = async (req, res) => {
    const { questionId, answerId } = req.params;

    const question = await Question.findById(questionId);
    const answer = await Answer.findById(answerId);

    if (!question || !answer) {
        return res.status(404).json({ message: 'Question or Answer not found' });
    }

    if (question.author.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized' });
    }

    if (question.acceptedAnswer) {
        await Answer.findByIdAndUpdate(question.acceptedAnswer, { isAccepted: false });
    }

    question.acceptedAnswer = answerId;
    answer.isAccepted = true;

    await question.save();
    await answer.save();

    await createNotification(req, answer.author, 'accepted_answer', question._id, 'Question');

    res.json({ message: 'Answer accepted' });
};

export { createQuestion, getQuestions, getQuestionById, acceptAnswer };
