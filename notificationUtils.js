import Notification from '../models/notificationModel.js';

export const createNotification = async (req, recipient, type, target, targetModel, sender = null) => {
    try {
        if (recipient.toString() === (sender ? sender.toString() : null)) {
            return; // Don't notify users of their own actions
        }
        
        const notification = await Notification.create({
            recipient,
            sender: sender || req.user._id,
            type,
            target,
            targetModel,
        });

        // Emit a real-time event to the recipient
        const io = req.app.get('socketio');
        io.to(recipient.toString()).emit('new_notification', notification);

    } catch (error) {
        console.error('Error creating notification:', error);
    }
};