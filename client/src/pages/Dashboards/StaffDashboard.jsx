import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTicket } from '../../context/TicketContext';
import { useToast } from '../../context/ToastContext';
import StatusBadge from '../../components/StatusBadge';
import PriorityBadge from '../../components/PriorityBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import axios from 'axios';
import { CheckCircle, Clock, AlertTriangle, Filter, Search, Users } from 'lucide-react';

import { API_BASE_URL } from '../../config';
const authAxios = axios.create({ baseURL: API_BASE_URL });
authAxios.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export default function StaffDashboard() {
    const { tickets: contextTickets, fetchAllTickets, updateTicket, loading } = useTicket();
    const tickets = contextTickets || [];
    const { showToast } = useToast();
    const navigate = useNavigate();

    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [staffList, setStaffList] = useState([]);

    useEffect(() => {
        fetchAllTickets();
        fetchStaffList();
    }, []);

    const fetchStaffList = async () => {
        try {
            const res = await authAxios.get('/users/staff');
            setStaffList(Array.isArray(res.data) ? res.data : []);
        } catch {
            // silently fail — assignment dropdown just won't populate
        }
    };

    const handleStatusChange = async (e, ticketId) => {
        e.stopPropagation();
        try {
            await updateTicket(ticketId, { status: e.target.value });
            showToast('Status updated', 'success');
        } catch {
            showToast('Failed to update status', 'error');
        }
    };

    const handlePriorityChange = async (e, ticketId) => {
        e.stopPropagation();
        try {
            await updateTicket(ticketId, { priority: e.target.value });
            showToast('Priority updated', 'success');
        } catch {
            showToast('Failed to update priority', 'error');
        }
    };

    // Filtered tickets
    const filtered = tickets.filter(t => {
        const matchesSearch = search === '' ||
            t.title?.toLowerCase().includes(search.toLowerCase()) ||
            t.ticketID?.toLowerCase().includes(search.toLowerCase()) ||
            t.description?.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
        const matchesCategory = categoryFilter === 'All' || t.category === categoryFilter;
        return matchesSearch && matchesStatus && matchesCategory;
    });

    const openCount = tickets.filter(t => t.status === 'Open').length;
    const progressCount = tickets.filter(t => t.status === 'In Progress').length;
    const urgentCount = tickets.filter(t => t.priority === 'Urgent').length;
    const resolvedCount = tickets.filter(t => t.status === 'Resolved' || t.status === 'Closed').length;
    const overdueCount = tickets.filter(t => {
        if (t.status === 'Resolved' || t.status === 'Closed') return false;
        const created = new Date(t.createdAt);
        const now = new Date();
        return (now - created) > (48 * 60 * 60 * 1000); // > 48 hours
    }).length;

    if (loading) {
        return <LoadingSpinner message="Loading ticket queue..." />;
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Staff Workspace</h1>
                    <p className="text-gray-500 text-sm mt-1">{filtered.length} ticket{filtered.length !== 1 ? 's' : ''} in queue</p>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                    <p className="text-red-700 text-xs font-medium">Urgent</p>
                    <h3 className="text-2xl font-bold text-red-800 mt-1">{urgentCount}</h3>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                    <p className="text-yellow-700 text-xs font-medium">Open</p>
                    <h3 className="text-2xl font-bold text-yellow-800 mt-1">{openCount}</h3>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
                    <p className="text-orange-700 text-xs font-medium">In Progress</p>
                    <h3 className="text-2xl font-bold text-orange-800 mt-1">{progressCount}</h3>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                    <p className="text-green-700 text-xs font-medium">Resolved</p>
                    <h3 className="text-2xl font-bold text-green-800 mt-1">{resolvedCount}</h3>
                </div>
                <div className={`p-4 rounded-lg border ${overdueCount > 0 ? 'bg-orange-50 border-orange-200' : 'bg-gray-50 border-gray-200'}`}>
                    <p className={`text-xs font-medium ${overdueCount > 0 ? 'text-orange-700' : 'text-gray-600'}`}>Overdue (&gt;48h)</p>
                    <h3 className={`text-2xl font-bold mt-1 ${overdueCount > 0 ? 'text-orange-800' : 'text-gray-800'}`}>{overdueCount}</h3>
                </div>
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

            {/* Ticket Queue Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                            <tr>
                                <th className="p-4">ID</th>
                                <th className="p-4">Title</th>
                                <th className="p-4">Category</th>
                                <th className="p-4">Priority</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filtered.length === 0 ? (
                                <tr><td colSpan="7" className="p-8 text-center text-gray-400">No tickets match your search</td></tr>
                            ) : (
                                filtered.map((ticket) => (
                                    <tr
                                        key={ticket._id}
                                        className="hover:bg-gray-50 cursor-pointer"
                                        onClick={() => navigate(`/dashboard/tickets/${ticket._id}`)}
                                    >
                                        <td className="p-4 font-mono text-xs text-orange-600">{ticket.ticketID}</td>
                                        <td className="p-4">
                                            <p className="font-medium text-gray-900 truncate max-w-[200px]">{ticket.title}</p>
                                            <p className="text-gray-400 text-xs truncate max-w-[200px]">{ticket.description}</p>
                                        </td>
                                        <td className="p-4 text-gray-600 text-xs">{ticket.category}</td>
                                        <td className="p-4" onClick={(e) => e.stopPropagation()}>
                                            <select
                                                className="border border-gray-200 rounded px-2 py-1 text-xs bg-white"
                                                value={ticket.priority}
                                                onChange={(e) => handlePriorityChange(e, ticket._id)}
                                            >
                                                <option value="Low">Low</option>
                                                <option value="Medium">Medium</option>
                                                <option value="High">High</option>
                                                <option value="Urgent">Urgent</option>
                                            </select>
                                        </td>
                                        <td className="p-4"><StatusBadge status={ticket.status} /></td>
                                        <td className="p-4" onClick={(e) => e.stopPropagation()}>
                                            <select
                                                className="border border-gray-200 rounded px-2 py-1 text-xs bg-white"
                                                value={ticket.status}
                                                onChange={(e) => handleStatusChange(e, ticket._id)}
                                            >
                                                <option value="Open">Open</option>
                                                <option value="In Progress">In Progress</option>
                                                <option value="Resolved">Resolved</option>
                                                <option value="Closed">Closed</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
