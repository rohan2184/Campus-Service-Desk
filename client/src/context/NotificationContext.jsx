import { createContext, useState, useContext, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { io } from 'socket.io-client';
import { API_BASE_URL, SOCKET_URL } from '../config';

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const { user } = useAuth();
    const socketRef = useRef(null);

    const authAxios = axios.create({ baseURL: API_BASE_URL });
    authAxios.interceptors.request.use((config) => {
        const token = localStorage.getItem('token');
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
    });

    const fetchNotifications = async () => {
        if (!user) return;
        try {
            const res = await authAxios.get('/notifications');
            setNotifications(res.data);
            setUnreadCount(res.data.filter(n => !n.read).length);
        } catch (err) {
            console.error('Failed to fetch notifications', err);
        }
    };

    const markAsRead = async (id) => {
        try {
            await authAxios.put(`/notifications/${id}/read`);
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (err) {
            console.error('Failed to mark notification as read', err);
        }
    };

    const markAllAsRead = async () => {
        try {
            await authAxios.put('/notifications/read-all');
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
            setUnreadCount(0);
        } catch (err) {
            console.error('Failed to mark all as read', err);
        }
    };

    // Socket.io real-time connection
    useEffect(() => {
        if (!user) return;

        // Initial fetch
        fetchNotifications();

        // Connect Socket.io
        const socket = io(SOCKET_URL, { transports: ['websocket'] });
        socketRef.current = socket;

        socket.on('connect', () => {
            socket.emit('join', user._id || user.id);
        });

        socket.on('notification:new', (notification) => {
            setNotifications(prev => [notification, ...prev]);
            setUnreadCount(prev => prev + 1);
        });

        // Polling fallback every 10s
        const interval = setInterval(fetchNotifications, 10000);

        return () => {
            socket.disconnect();
            clearInterval(interval);
        };
    }, [user]);

    return (
        <NotificationContext.Provider value={{ notifications, unreadCount, fetchNotifications, markAsRead, markAllAsRead }}>
            {children}
        </NotificationContext.Provider>
    );
};
