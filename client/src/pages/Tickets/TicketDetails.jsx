import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTicket } from '../../context/TicketContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import StatusBadge from '../../components/StatusBadge';
import PriorityBadge from '../../components/PriorityBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import { ArrowLeft, Send, Clock, MessageSquare, History } from 'lucide-react';

export default function TicketDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { fetchTicket, addComment, updateTicket, deleteTicket, submitFeedback } = useTicket();
    const { showToast } = useToast();

    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [activeTab, setActiveTab] = useState('comments');
    const [rating, setRating] = useState(0);
    const [feedbackText, setFeedbackText] = useState('');

    useEffect(() => {
        loadTicket();
    }, [id]);

    const loadTicket = async () => {
        setLoading(true);
        try {
            const data = await fetchTicket(id);
            setTicket(data);
        } catch {
            showToast('Failed to load ticket details', 'error');
        }
        setLoading(false);
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!comment.trim()) return;

        setSubmitting(true);
        try {
            const updated = await addComment(id, comment.trim());
            setTicket(updated);
            setComment('');
            showToast('Comment added successfully', 'success');
        } catch {
            showToast('Failed to add comment', 'error');
        }
        setSubmitting(false);
    };

    const handleStatusChange = async (newStatus) => {
        try {
            const updated = await updateTicket(id, { status: newStatus });
            setTicket(updated);
            showToast(`Status updated to "${newStatus}"`, 'success');
        } catch {
            showToast('Failed to update status', 'error');
        }
    };

    const handlePriorityChange = async (newPriority) => {
        try {
            const updated = await updateTicket(id, { priority: newPriority });
            setTicket(updated);
            showToast(`Priority updated to "${newPriority}"`, 'success');
        } catch {
            showToast('Failed to update priority', 'error');
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this ticket?')) return;
        try {
            await deleteTicket(id);
            showToast('Ticket deleted successfully', 'success');
            navigate('/dashboard/tickets');
        } catch {
            showToast('Failed to delete ticket', 'error');
        }
    };

    const handleFeedbackSubmit = async () => {
        if (!rating) return;
        setSubmitting(true);
        try {
            const updated = await submitFeedback(id, rating, feedbackText);
            setTicket(updated);
            showToast('Feedback submitted successfully', 'success');
        } catch {
            showToast('Failed to submit feedback', 'error');
        }
        setSubmitting(false);
    };

    const getInitials = (name) => {
        if (!name) return '?';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const timeAgo = (date) => {
        const secs = Math.floor((new Date() - new Date(date)) / 1000);
        if (secs < 60) return 'just now';
        const mins = Math.floor(secs / 60);
        if (mins < 60) return `${mins}m ago`;
        const hours = Math.floor(mins / 60);
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        if (days < 7) return `${days}d ago`;
        return formatDate(date);
    };

    const getRoleStyle = (role) => {
        if (role === 'admin') return { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-l-4 border-purple-300', badge: 'bg-purple-50 text-purple-600' };
        if (role === 'staff') return { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-l-4 border-orange-300', badge: 'bg-orange-50 text-orange-600' };
        return { bg: 'bg-orange-100', text: 'text-orange-700', border: '', badge: 'bg-gray-50 text-gray-500' };
    };

    if (loading) {
        return <LoadingSpinner message="Loading ticket details..." />;
    }

    if (!ticket) {
        return (
            <div className="text-center py-12">
                <h2 className="text-xl font-semibold text-gray-600 mb-2">Ticket not found</h2>
                <button
                    onClick={() => navigate('/dashboard/tickets')}
                    className="text-orange-600 hover:underline text-sm"
                >
                    Back to tickets
                </button>
            </div>
        );
    }

    const isStaffOrAdmin = user?.role === 'staff' || user?.role === 'admin';

    return (
        <div>
            {/* Header Actions */}
            <div className="flex items-center justify-between mb-4">
                <button
                    onClick={() => navigate('/dashboard/tickets')}
                    className="flex items-center gap-2 text-gray-500 hover:text-orange-600 transition text-sm font-medium"
                >
                    <ArrowLeft size={16} /> Back to Tickets
                </button>
                {ticket.status === 'Approval' && (user?.id === ticket.requester?._id || user?._id === ticket.requester?._id) && (
                    <button
                        onClick={handleDelete}
                        className="text-red-600 hover:bg-red-50 px-3 py-1.5 rounded transition text-sm font-medium border border-red-200"
                    >
                        Delete Ticket
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Ticket Header Card */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center gap-3 mb-3">
                            <span className="text-xs font-mono text-gray-400 bg-gray-50 px-2 py-0.5 rounded">
                                {ticket.ticketID}
                            </span>
                            <StatusBadge status={ticket.status} />
                            <PriorityBadge priority={ticket.priority} />
                        </div>
                        <h1 className="text-xl font-bold text-gray-800 mb-3">{ticket.title}</h1>
                        <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: ticket.description }} />

                        <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-gray-100 text-sm text-gray-500">
                            <div>
                                <span className="text-gray-400">Category:</span>{' '}
                                <span className="font-medium text-gray-700">{ticket.category}</span>
                            </div>
                            {ticket.location && (
                                <div>
                                    <span className="text-gray-400">Location:</span>{' '}
                                    <span className="font-medium text-gray-700">{ticket.location}</span>
                                </div>
                            )}
                            <div>
                                <span className="text-gray-400">Submitted by:</span>{' '}
                                <span className="font-medium text-gray-700">{ticket.requester?.name || 'Unknown'}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Clock size={14} />
                                {formatDate(ticket.createdAt)}
                            </div>
                        </div>
                    </div>

                    {/* Tabs: Comments / History */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100">
                        <div className="flex border-b border-gray-100">
                            <button
                                onClick={() => setActiveTab('comments')}
                                className={`flex items-center gap-2 px-5 py-3 text-sm font-medium transition ${
                                    activeTab === 'comments'
                                        ? 'text-orange-600 border-b-2 border-orange-600'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                <MessageSquare size={16} />
                                Comments ({ticket.comments?.length || 0})
                            </button>
                            <button
                                onClick={() => setActiveTab('history')}
                                className={`flex items-center gap-2 px-5 py-3 text-sm font-medium transition ${
                                    activeTab === 'history'
                                        ? 'text-orange-600 border-b-2 border-orange-600'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                <History size={16} />
                                History ({ticket.history?.length || 0})
                            </button>
                        </div>

                        <div className="p-5">
                            {activeTab === 'comments' ? (
                                <>
                                    {/* Review & Feedback Prompt for Student */}
                                    {ticket.status === 'Review' && (user?.id === ticket.requester?._id || user?._id === ticket.requester?._id) && (
                                        <div className="mb-6 p-4 border border-orange-200 bg-orange-50 rounded-lg">
                                            <h4 className="font-semibold text-orange-800 mb-2">Review & Feedback</h4>
                                            <p className="text-sm text-orange-700 mb-4">Your ticket has been marked as complete. Please provide feedback to close it.</p>
                                            <div className="flex gap-2 mb-3">
                                                {[1,2,3,4,5].map(star => (
                                                    <button 
                                                        key={star}
                                                        type="button"
                                                        onClick={() => setRating(star)}
                                                        className={`text-2xl outline-none ${rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                                                    >★</button>
                                                ))}
                                            </div>
                                            <textarea
                                                value={feedbackText}
                                                onChange={(e) => setFeedbackText(e.target.value)}
                                                placeholder="Tell us how we did..."
                                                rows={2}
                                                className="w-full border border-orange-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 mb-3"
                                            />
                                            <button
                                                onClick={handleFeedbackSubmit}
                                                disabled={!rating || submitting}
                                                className="bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-700 disabled:opacity-50"
                                            >
                                                Submit & Close Ticket
                                            </button>
                                        </div>
                                    )}

                                    {/* Comment Thread */}
                                    {ticket.comments && ticket.comments.length > 0 ? (
                                        <div className="space-y-4 mb-6">
                                            {ticket.comments.map((c, idx) => {
                                                const style = getRoleStyle(c.user?.role);
                                                return (
                                                    <div key={idx} className={`flex gap-3 rounded-lg p-3 bg-gray-50 ${style.border}`}>
                                                        <div className={`w-8 h-8 rounded-full ${style.bg} ${style.text} flex items-center justify-center text-xs font-bold flex-shrink-0`}>
                                                            {getInitials(c.user?.name)}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <span className="text-sm font-semibold text-gray-800">
                                                                    {c.user?.name || 'Unknown'}
                                                                </span>
                                                                <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${style.badge}`}>
                                                                    {c.user?.role || 'student'}
                                                                </span>
                                                                <span className="text-xs text-gray-400 ml-auto" title={formatDate(c.createdAt)}>
                                                                    {timeAgo(c.createdAt)}
                                                                </span>
                                                            </div>
                                                            <p className="text-sm text-gray-600 leading-relaxed">{c.content}</p>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <p className="text-gray-400 text-sm text-center py-4 mb-4">No comments yet</p>
                                    )}

                                    {/* Add Comment Form */}
                                    <form onSubmit={handleAddComment} className="flex gap-3">
                                        <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 text-xs font-bold flex-shrink-0">
                                            {getInitials(user?.name)}
                                        </div>
                                        <div className="flex-1 relative">
                                            <textarea
                                                value={comment}
                                                onChange={(e) => setComment(e.target.value)}
                                                placeholder="Write a comment..."
                                                rows={2}
                                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                                            />
                                            <button
                                                type="submit"
                                                disabled={!comment.trim() || submitting}
                                                className="absolute bottom-2 right-2 bg-orange-600 text-white p-1.5 rounded-md hover:bg-orange-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
                                            >
                                                <Send size={14} />
                                            </button>
                                        </div>
                                    </form>
                                </>
                            ) : (
                                /* History Tab */
                                <div className="space-y-3">
                                    {ticket.history && ticket.history.length > 0 ? (
                                        ticket.history.map((h, idx) => (
                                            <div key={idx} className="flex items-start gap-3 text-sm">
                                                <div className="w-2 h-2 rounded-full bg-orange-400 mt-1.5 flex-shrink-0"></div>
                                                <div className="flex-1">
                                                    <p className="text-gray-700">{h.action}</p>
                                                    <p className="text-xs text-gray-400 mt-0.5">
                                                        {h.by?.name || 'System'} · {formatDate(h.timestamp)}
                                                    </p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-400 text-sm text-center py-4">No history recorded</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Details Card */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5">
                        <h3 className="font-semibold text-gray-800 mb-4">Details</h3>

                        <div className="space-y-4 text-sm">
                            <div>
                                <p className="text-gray-400 mb-1">Status</p>
                                {isStaffOrAdmin ? (
                                    <select
                                        value={ticket.status}
                                        onChange={(e) => handleStatusChange(e.target.value)}
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500"
                                    >
                                        <option value="Open">Open</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Resolved">Resolved</option>
                                        <option value="Closed">Closed</option>
                                    </select>
                                ) : (
                                    <StatusBadge status={ticket.status} />
                                )}
                            </div>

                            <div>
                                <p className="text-gray-400 mb-1">Priority</p>
                                {isStaffOrAdmin ? (
                                    <select
                                        value={ticket.priority}
                                        onChange={(e) => handlePriorityChange(e.target.value)}
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500"
                                    >
                                        <option value="Low">Low</option>
                                        <option value="Medium">Medium</option>
                                        <option value="High">High</option>
                                        <option value="Urgent">Urgent</option>
                                    </select>
                                ) : (
                                    <PriorityBadge priority={ticket.priority} />
                                )}
                            </div>

                            <div>
                                <p className="text-gray-400 mb-1">Category</p>
                                <p className="font-medium text-gray-700">{ticket.category}</p>
                            </div>

                            {ticket.location && (
                                <div>
                                    <p className="text-gray-400 mb-1">Location</p>
                                    <p className="font-medium text-gray-700">{ticket.location}</p>
                                </div>
                            )}

                            <div>
                                <p className="text-gray-400 mb-1">Submitted by</p>
                                <p className="font-medium text-gray-700">{ticket.requester?.name || 'Unknown'}</p>
                                <p className="text-xs text-gray-400">{ticket.requester?.email}</p>
                            </div>

                            {ticket.satisfactionTag && (
                                <div>
                                    <p className="text-gray-400 mb-1">Feedback Tag</p>
                                    <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded uppercase tracking-wide">
                                        {ticket.satisfactionTag}
                                    </span>
                                </div>
                            )}

                            {ticket.assignedTo && (
                                <div>
                                    <p className="text-gray-400 mb-1">Assigned to</p>
                                    <p className="font-medium text-gray-700">{ticket.assignedTo?.name}</p>
                                    <p className="text-xs text-gray-400">{ticket.assignedTo?.email}</p>
                                </div>
                            )}

                            <div className="pt-3 border-t border-gray-100">
                                <p className="text-gray-400 mb-1">Created</p>
                                <p className="text-gray-600">{formatDate(ticket.createdAt)}</p>
                            </div>
                            {ticket.updatedAt !== ticket.createdAt && (
                                <div>
                                    <p className="text-gray-400 mb-1">Last Updated</p>
                                    <p className="text-gray-600">{formatDate(ticket.updatedAt)}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
