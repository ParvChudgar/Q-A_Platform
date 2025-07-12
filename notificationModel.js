import mongoose from 'mongoose';

const notificationSchema = mongoose.Schema({
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    type: { type: String, enum: ['new_answer', 'accepted_answer', 'new_comment', 'mention'], required: true },
    target: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'targetModel' },
    targetModel: { type: String, required: true, enum: ['Question', 'Answer'] },
    read: { type: Boolean, default: false },
}, {
    timestamps: true,
});

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;