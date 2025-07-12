import mongoose from 'mongoose';

const voteSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    target: { type: mongoose.Schema.Types.ObjectId, required: true },
    targetModel: { type: String, enum: ['Question', 'Answer'], required: true },
    voteType: { type: String, enum: ['upvote', 'downvote'], required: true },
}, {
    timestamps: true,
});

// Compound index to ensure a user can only vote once per target
voteSchema.index({ user: 1, target: 1 }, { unique: true });

const Vote = mongoose.model('Vote', voteSchema);
export default Vote;