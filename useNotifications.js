import { useState, useEffect, useContext } from 'react';
import io from 'socket.io-client';
import AuthContext from '../context/AuthContext';
import api from '../api/axios';

export const useNotifications = () => {
    const { user } = useContext(AuthContext);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        if (!user) return;

        const fetchNotifications = async () => {
            try {
                const { data } = await api.get('/api/notifications');
                setNotifications(data.notifications);
                setUnreadCount(data.unreadCount);
            } catch (error) {
                console.error("Failed to fetch notifications", error);
            }
        };

        fetchNotifications();

        const socket = io(import.meta.env.VITE_API_URL);

        // Join a room specific to the user ID
        socket.emit('joinRoom', user._id);

        socket.on('new_notification', (newNotification) => {
            setNotifications(prev => [newNotification, ...prev]);
            setUnreadCount(prev => prev + 1);
        });

        return () => {
            socket.disconnect();
        };

    }, [user]);

    const markAsRead = async () => {
        if (unreadCount > 0) {
            try {
                await api.post('/api/notifications/mark-read');
                setUnreadCount(0);
                setNotifications(prev => prev.map(n => ({ ...n, read: true })));
            } catch (error) {
                console.error("Failed to mark notifications as read", error);
            }
        }
    };

    return { notifications, unreadCount, markAsRead };
};