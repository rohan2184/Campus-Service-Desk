import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../context/NotificationContext';
import { Bell, MessageSquare, UserCheck, FileText, CheckCheck } from 'lucide-react';

const TYPE_ICONS = {
    status_change: FileText,
    comment: MessageSquare,
    assignment: UserCheck,
    new_ticket: Bell,
};

const timeAgo = (date) => {
    const secs = Math.floor((new Date() - new Date(date)) / 1000);
    if (secs < 60) return 'just now';
    const mins = Math.floor(secs / 60);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
};

export default function NotificationBell() {
    const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotification();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleNotificationClick = (n) => {
        if (!n.read) markAsRead(n._id);
        if (n.ticketId) {
            navigate(`/dashboard/tickets/${n.ticketId}`);
            setIsOpen(false);
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-gray-600 hover:text-orange-600 relative transition"
                aria-label="Notifications"
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex items-center justify-center rounded-full h-4 w-4 bg-red-600 text-white text-[10px] font-bold">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-84 w-[340px] bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
                    {/* Header */}
                    <div className="px-4 py-3 border-b bg-gray-50 flex justify-between items-center">
                        <span className="text-sm font-semibold text-gray-700">
                            Notifications {unreadCount > 0 && <span className="ml-1 text-xs text-orange-600">({unreadCount} new)</span>}
                        </span>
                        <div className="flex gap-3">
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllAsRead}
                                    className="flex items-center gap-1 text-xs text-orange-600 hover:text-orange-800 font-medium"
                                    title="Mark all as read"
                                >
                                    <CheckCheck size={13} /> All read
                                </button>
                            )}
                            <button
                                onClick={() => { navigate('/dashboard/notifications'); setIsOpen(false); }}
                                className="text-xs text-gray-400 hover:text-gray-600"
                            >
                                See all
                            </button>
                        </div>
                    </div>

                    {/* List */}
                    <div className="max-h-96 overflow-y-auto divide-y divide-gray-50">
                        {notifications.length === 0 ? (
                            <div className="p-6 text-center">
                                <Bell size={28} className="mx-auto text-gray-300 mb-2" />
                                <p className="text-sm text-gray-400">No notifications yet</p>
                            </div>
                        ) : (
                            notifications.slice(0, 15).map((n) => {
                                const Icon = TYPE_ICONS[n.type] || Bell;
                                return (
                                    <div
                                        key={n._id}
                                        onClick={() => handleNotificationClick(n)}
                                        className={`flex items-start gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 transition ${!n.read ? 'bg-orange-50' : ''}`}
                                    >
                                        <div className={`mt-0.5 p-1.5 rounded-full flex-shrink-0 ${!n.read ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-400'}`}>
                                            <Icon size={13} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-xs leading-relaxed ${!n.read ? 'text-gray-800 font-medium' : 'text-gray-600'}`}>
                                                {n.message}
                                            </p>
                                            <p className="text-[10px] text-gray-400 mt-0.5">{timeAgo(n.createdAt)}</p>
                                        </div>
                                        {!n.read && (
                                            <span className="mt-1.5 w-2 h-2 bg-orange-500 rounded-full flex-shrink-0"></span>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
