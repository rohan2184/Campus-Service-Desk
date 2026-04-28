import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTicket } from '../../context/TicketContext';
import { useAuth } from '../../context/AuthContext';
import StatusBadge from '../../components/StatusBadge';
import PriorityBadge from '../../components/PriorityBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Plus, FileText, CheckCircle, Clock, AlertTriangle, Activity } from 'lucide-react';

export default function StudentDashboard() {
    const { user } = useAuth();
    const { tickets, fetchMyTickets, loading } = useTicket();
    const navigate = useNavigate();

    useEffect(() => {
        fetchMyTickets();
    }, []);

    const firstName = user?.name?.split(' ')[0] || 'Student';
    const activeCount = tickets.filter(t => t.status === 'Open' || t.status === 'In Progress').length;
    const resolvedCount = tickets.filter(t => t.status === 'Resolved' || t.status === 'Closed').length;
    const openCount = tickets.filter(t => t.status === 'Open').length;
    const inProgressCount = tickets.filter(t => t.status === 'In Progress').length;

    if (loading) {
        return <LoadingSpinner message="Loading dashboard..." />;
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Welcome back, {firstName}! 👋</h1>
                    <p className="text-gray-500 text-sm mt-1">Here's what's happening with your tickets</p>
                </div>
                <button
                    onClick={() => navigate('/dashboard/create-ticket')}
                    className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2.5 rounded-lg hover:bg-orange-700 transition font-medium text-sm"
                >
                    <Plus size={18} /> New Ticket
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-gray-500 text-xs font-medium">Active</p>
                        <h3 className="text-2xl font-bold text-orange-800 mt-1">{activeCount}</h3>
                    </div>
                    <Clock className="text-orange-200" size={28} />
                </div>
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-gray-500 text-xs font-medium">Open</p>
                        <h3 className="text-2xl font-bold text-yellow-700 mt-1">{openCount}</h3>
                    </div>
                    <AlertTriangle className="text-yellow-200" size={28} />
                </div>
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-gray-500 text-xs font-medium">In Progress</p>
                        <h3 className="text-2xl font-bold text-orange-700 mt-1">{inProgressCount}</h3>
                    </div>
                    <Activity className="text-orange-200" size={28} />
                </div>
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-gray-500 text-xs font-medium">Resolved</p>
                        <h3 className="text-2xl font-bold text-green-700 mt-1">{resolvedCount}</h3>
                    </div>
                    <CheckCircle className="text-green-200" size={28} />
                </div>
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-gray-500 text-xs font-medium">Total</p>
                        <h3 className="text-2xl font-bold text-gray-700 mt-1">{tickets.length}</h3>
                    </div>
                    <FileText className="text-gray-200" size={28} />
                </div>
            </div>

            {/* Recent Tickets */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="font-semibold text-lg">Recent Tickets</h2>
                    <button
                        onClick={() => navigate('/dashboard/tickets')}
                        className="text-sm text-orange-600 hover:underline font-medium"
                    >
                        View All →
                    </button>
                </div>
                <div className="divide-y divide-gray-50">
                    {tickets.length === 0 ? (
                        <div className="p-8 text-center">
                            <FileText className="mx-auto text-gray-300 mb-3" size={40} />
                            <p className="text-gray-500 text-sm mb-3">No tickets yet</p>
                            <button
                                onClick={() => navigate('/dashboard/create-ticket')}
                                className="text-orange-600 hover:underline text-sm font-medium"
                            >
                                Create your first ticket →
                            </button>
                        </div>
                    ) : (
                        tickets.slice(0, 5).map((ticket) => (
                            <div
                                key={ticket._id}
                                onClick={() => navigate(`/dashboard/tickets/${ticket._id}`)}
                                className="p-4 hover:bg-gray-50 transition cursor-pointer flex items-center justify-between"
                            >
                                <div className="flex items-center gap-4 flex-1 min-w-0">
                                    <span className="text-xs font-mono text-gray-400">{ticket.ticketID}</span>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-gray-800 truncate">{ticket.title}</p>
                                        <p className="text-xs text-gray-400 mt-0.5">{ticket.category} · {new Date(ticket.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    <PriorityBadge priority={ticket.priority} />
                                    <StatusBadge status={ticket.status} />
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
