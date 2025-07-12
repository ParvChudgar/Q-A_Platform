import Vote from '../models/voteModel.js';
import Question from '../models/questionModel.js';
import Answer from '../models/answerModel.js';
import User from '../models/userModel.js';

// @desc    Vote on a question or an answer
// @route   POST /api/questions/:id/vote or /api/answers/:id/vote
// @access  Private
const voteOnTarget = async (req, res) => {
    const { voteType } = req.body; // 'upvote' or 'downvote'
    const targetId = req.params.id;
    const userId = req.user._id;
    const targetModel = req.baseUrl.includes('questions') ? 'Question' : 'Answer';

    const Model = targetModel === 'Question' ? Question : Answer;
    const target = await Model.findById(targetId);

    if (!target) {
        return res.status(404).json({ message: `${targetModel} not found` });
    }

    const existingVote = await Vote.findOne({ user: userId, target: targetId });

    let voteChange = 0;
    
    if (existingVote) {
        if (existingVote.voteType === voteType) {
            // User is undoing their vote
            await Vote.findByIdAndDelete(existingVote._id);
            voteChange = voteType === 'upvote' ? -1 : 1;
        } else {
            // User is changing their vote
            existingVote.voteType = voteType;
            await existingVote.save();
            voteChange = voteType === 'upvote' ? 2 : -2; // e.g., from down to up is +2
        }
    } else {
        // New vote
        await Vote.create({
            user: userId,
            target: targetId,
            targetModel,
            voteType,
        });
        voteChange = voteType === 'upvote' ? 1 : -1;
    }

    target.votes += voteChange;
    await target.save();
    
    // Update author's reputation
    const author = await User.findById(target.author);
    if (author) {
        author.reputation += voteChange; // Simple reputation logic
        await author.save();
    }

    res.json({ votes: target.votes });
};

export { voteOnTarget };