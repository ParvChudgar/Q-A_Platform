import React, { useState } from 'react';
import { BellIcon } from '@heroicons/react/24/outline';
import { useNotifications } from '../hooks/useNotifications';
import { Link } from 'react-router-dom';

const NotificationBell = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { notifications, unreadCount, markAsRead } = useNotifications();

    const handleToggle = () => {
        if (!isOpen && unreadCount > 0) {
            markAsRead();
        }
        setIsOpen(!isOpen);
    };
    
    // Helper to format notification text
    const formatNotification = (notif) => {
        switch(notif.type) {
            case 'new_answer':
                return `${notif.sender.username} answered your question: "${notif.target.title.substring(0, 30)}..."`;
            case 'accepted_answer':
                 return `Your answer to "${notif.target.title.substring(0, 30)}..." was accepted!`;
            default:
                return 'You have a new notification.';
        }
    }

    return (
        <div className="relative">
            <button onClick={handleToggle} className="relative p-2 text-gray-400 hover:text-white">
                <BellIcon className="h-6 w-6" />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                        {unreadCount}
                    </span>
                )}
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-secondary rounded-lg shadow-lg z-20">
                    <div className="p-3 font-bold border-b border-gray-700">Notifications</div>
                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length > 0 ? (
                            notifications.map(notif => (
                                <Link to={`/questions/${notif.target._id || notif.target}`} key={notif._id} onClick={() => setIsOpen(false)}>
                                    <div className={`p-3 border-b border-gray-700 hover:bg-primary ${!notif.read ? 'bg-blue-900/30' : ''}`}>
                                        <p className="text-sm">{formatNotification(notif)}</p>
                                        <p className="text-xs text-gray-400">{new Date(notif.createdAt).toLocaleString()}</p>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <p className="p-4 text-center text-gray-400">No notifications yet.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;