import mongoose from 'mongoose';

const tagSchema = mongoose.Schema({
    name: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
    description: { type: String },
    questionCount: { type: Number, default: 0 },
}, {
    timestamps: true,
});

const Tag = mongoose.model('Tag', tagSchema);
export default Tag;