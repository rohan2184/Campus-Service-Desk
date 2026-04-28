import { useNavigate } from 'react-router-dom';
import { useNotification } from '../context/NotificationContext';
import { Bell, MessageSquare, UserCheck, FileText, CheckCheck, InboxIcon } from 'lucide-react';

const TYPE_ICONS = {
    status_change: FileText,
    comment: MessageSquare,
    assignment: UserCheck,
    new_ticket: Bell,
};

const TYPE_LABELS = {
    status_change: 'Status Update',
    comment: 'New Comment',
    assignment: 'Assignment',
    new_ticket: 'New Ticket',
};

const timeAgo = (date) => {
    const secs = Math.floor((new Date() - new Date(date)) / 1000);
    if (secs < 60) return 'just now';
    const mins = Math.floor(secs / 60);
    if (mins < 60) return `${mins} min ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(date).toLocaleDateString();
};

export default function NotificationsPage() {
    const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotification();
    const navigate = useNavigate();

    const unread = notifications.filter(n => !n.read);
    const read = notifications.filter(n => n.read);

    const handleClick = (n) => {
        if (!n.read) markAsRead(n._id);
        if (n.ticketId) navigate(`/dashboard/tickets/${n.ticketId}`);
    };

    const NotificationItem = ({ n }) => {
        const Icon = TYPE_ICONS[n.type] || Bell;
        const label = TYPE_LABELS[n.type] || 'Notification';
        return (
            <div
                onClick={() => handleClick(n)}
                className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer hover:shadow-md transition group ${!n.read ? 'bg-orange-50 border-orange-100' : 'bg-white border-gray-100'}`}
            >
                <div className={`p-2.5 rounded-lg flex-shrink-0 ${!n.read ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-400'}`}>
                    <Icon size={16} />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                        <span className={`text-xs font-semibold uppercase tracking-wide ${!n.read ? 'text-orange-600' : 'text-gray-400'}`}>
                            {label}
                        </span>
                        {!n.read && <span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>}
                    </div>
                    <p className={`text-sm ${!n.read ? 'text-gray-800 font-medium' : 'text-gray-600'}`}>
                        {n.message}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">{timeAgo(n.createdAt)}</p>
                </div>
                {n.ticketId && (
                    <span className="text-xs text-orange-400 opacity-0 group-hover:opacity-100 transition mt-1 flex-shrink-0">
                        View →
                    </span>
                )}
            </div>
        );
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
                    </p>
                </div>
                {unreadCount > 0 && (
                    <button
                        onClick={markAllAsRead}
                        className="flex items-center gap-2 text-sm text-orange-600 hover:text-orange-800 font-medium border border-orange-200 px-3 py-2 rounded-lg hover:bg-orange-50 transition"
                    >
                        <CheckCheck size={15} /> Mark all as read
                    </button>
                )}
            </div>

            {notifications.length === 0 ? (
                <div className="text-center py-20">
                    <InboxIcon size={48} className="mx-auto text-gray-200 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-400">No notifications yet</h3>
                    <p className="text-gray-400 text-sm mt-1">You'll be notified about ticket updates, comments, and assignments here.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {unread.length > 0 && (
                        <div>
                            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                                Unread ({unread.length})
                            </h2>
                            <div className="space-y-2">
                                {unread.map(n => <NotificationItem key={n._id} n={n} />)}
                            </div>
                        </div>
                    )}
                    {read.length > 0 && (
                        <div>
                            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                                Earlier
                            </h2>
                            <div className="space-y-2">
                                {read.map(n => <NotificationItem key={n._id} n={n} />)}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
