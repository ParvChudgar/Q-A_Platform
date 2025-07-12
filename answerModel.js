import mongoose from 'mongoose';

const answerSchema = mongoose.Schema({
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
    votes: { type: Number, default: 0 },
    isAccepted: { type: Boolean, default: false },
    comments: [{
        text: String,
        author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        createdAt: { type: Date, default: Date.now }
    }],
}, {
    timestamps: true,
});

const Answer = mongoose.model('Answer', answerSchema);
export default Answer;