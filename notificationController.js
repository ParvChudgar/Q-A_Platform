import Notification from '../models/notificationModel.js';

// @desc    Get user's notifications
// @route   GET /api/notifications
// @access  Private
const getNotifications = async (req, res) => {
    const notifications = await Notification.find({ recipient: req.user._id })
        .populate('sender', 'username')
        .populate('target') // This will populate either a Question or Answer
        .sort({ createdAt: -1 })
        .limit(20);

    const unreadCount = await Notification.countDocuments({ recipient: req.user._id, read: false });

    res.json({ notifications, unreadCount });
};

// @desc    Mark notifications as read
// @route   POST /api/notifications/mark-read
// @access  Private
const markNotificationsAsRead = async (req, res) => {
    await Notification.updateMany(
        { recipient: req.user._id, read: false },
        { $set: { read: true } }
    );
    res.json({ message: 'Notifications marked as read' });
};

export { getNotifications, markNotificationsAsRead };