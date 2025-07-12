import mongoose from 'mongoose';

const questionSchema = mongoose.Schema({
    title: { type: String, required: true, index: true },
    description: { type: String, required: true },
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag', required: true }],
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    answers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Answer' }],
    votes: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    acceptedAnswer: { type: mongoose.Schema.Types.ObjectId, ref: 'Answer', default: null },
}, {
    timestamps: true,
});

const Question = mongoose.model('Question', questionSchema);
export default Question;