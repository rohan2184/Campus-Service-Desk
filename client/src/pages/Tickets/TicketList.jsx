import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTicket } from '../../context/TicketContext';
import { useAuth } from '../../context/AuthContext';
import StatusBadge from '../../components/StatusBadge';
import PriorityBadge from '../../components/PriorityBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Search, Filter, Plus, Inbox } from 'lucide-react';

export default function TicketList() {
    const { user } = useAuth();
    const { tickets, fetchMyTickets, fetchAllTickets, loading } = useTicket();
    const navigate = useNavigate();

    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [priorityFilter, setPriorityFilter] = useState('All');
    const [categoryFilter, setCategoryFilter] = useState('All');

    useEffect(() => {
        if (user?.role === 'student') {
            fetchMyTickets();
        } else {
            fetchAllTickets();
        }
    }, []);

    // Filter tickets
    const filtered = tickets.filter(ticket => {
        const matchesSearch = search === '' ||
            ticket.title?.toLowerCase().includes(search.toLowerCase()) ||
            ticket.ticketID?.toLowerCase().includes(search.toLowerCase()) ||
            ticket.description?.toLowerCase().includes(search.toLowerCase());

        const matchesStatus = statusFilter === 'All' || ticket.status === statusFilter;
        const matchesPriority = priorityFilter === 'All' || ticket.priority === priorityFilter;
        const matchesCategory = categoryFilter === 'All' || ticket.category === categoryFilter;

        return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
    });

    if (loading) {
        return <LoadingSpinner message="Loading tickets..." />;
    }

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        {user?.role === 'student' ? 'My Tickets' : 'All Tickets'}
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        {filtered.length} ticket{filtered.length !== 1 ? 's' : ''} found
                    </p>
                </div>
                {user?.role === 'student' && (
                    <button
                        onClick={() => navigate('/dashboard/create-ticket')}
                        className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2.5 rounded-lg hover:bg-orange-700 transition font-medium text-sm"
                    >
                        <Plus size={18} /> New Ticket
                    </button>
                )}
            </div>

            {/* Search & Filters */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-6">
                <div className="flex flex-wrap gap-3 items-center">
                    <div className="relative flex-1 min-w-[220px]">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by title, ticket ID, or description..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Filter size={16} className="text-gray-400" />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-orange-500"
                        >
                            <option value="All">All Status</option>
                            <option value="Open">Open</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Resolved">Resolved</option>
                            <option value="Closed">Closed</option>
                        </select>
                        <select
                            value={priorityFilter}
                            onChange={(e) => setPriorityFilter(e.target.value)}
                            className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-orange-500"
                        >
                            <option value="All">All Priority</option>
                            <option value="Urgent">Urgent</option>
                            <option value="High">High</option>
                            <option value="Medium">Medium</option>
                            <option value="Low">Low</option>
                        </select>
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-orange-500"
                        >
                            <option value="All">All Category</option>
                            <option value="IT Support">IT Support</option>
                            <option value="Facilities">Facilities</option>
                            <option value="Academic Services">Academic Services</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Ticket List */}
            {filtered.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-12 text-center">
                    <Inbox className="mx-auto text-gray-300 mb-4" size={48} />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">
                        {tickets.length === 0 ? 'No tickets yet' : 'No tickets match your filters'}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4">
                        {tickets.length === 0 ? 'Create your first ticket to get started' : 'Try adjusting your search or filters'}
                    </p>
                    {tickets.length === 0 && user?.role === 'student' && (
                        <button
                            onClick={() => navigate('/dashboard/create-ticket')}
                            className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition text-sm font-medium"
                        >
                            Create First Ticket
                        </button>
                    )}
                </div>
            ) : (
                <div className="space-y-3">
                    {filtered.map((ticket) => (
                        <div
                            key={ticket._id}
                            onClick={() => navigate(`/dashboard/tickets/${ticket._id}`)}
                            className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 hover:shadow-md hover:border-orange-200 transition cursor-pointer group"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-xs font-mono text-gray-400 bg-gray-50 px-2 py-0.5 rounded">
                                            {ticket.ticketID}
                                        </span>
                                        <StatusBadge status={ticket.status} />
                                        <PriorityBadge priority={ticket.priority} />
                                    </div>
                                    <h3 className="font-semibold text-gray-800 group-hover:text-orange-600 transition truncate">
                                        {ticket.title}
                                    </h3>
                                    <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                                        {ticket.description}
                                    </p>
                                </div>
                                <div className="text-right flex-shrink-0">
                                    <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded">
                                        {ticket.category}
                                    </span>
                                    <p className="text-xs text-gray-400 mt-2">
                                        {new Date(ticket.createdAt).toLocaleDateString('en-IN', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric'
                                        })}
                                    </p>
                                    {ticket.comments && ticket.comments.length > 0 && (
                                        <p className="text-xs text-orange-500 mt-1">
                                            💬 {ticket.comments.length} comment{ticket.comments.length !== 1 ? 's' : ''}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
