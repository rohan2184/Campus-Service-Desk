import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTicket } from '../../context/TicketContext';
import StatusBadge from '../../components/StatusBadge';
import PriorityBadge from '../../components/PriorityBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import axios from 'axios';
import { BarChart3, Users, FileText, CheckCircle, Clock, TrendingUp, ArrowRight } from 'lucide-react';

import { API_BASE_URL } from '../../config';
const authAxios = axios.create({ baseURL: API_BASE_URL });
authAxios.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export default function AdminDashboard() {
    const { tickets: contextTickets, fetchAllTickets, loading } = useTicket();
    const tickets = contextTickets || [];
    const navigate = useNavigate();
    const [analytics, setAnalytics] = useState(null);

    useEffect(() => {
        fetchAllTickets();
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const res = await authAxios.get('/analytics');
            setAnalytics(res.data);
        } catch {
            // silently fail — fallback to ticket-based stats
        }
    };

    const totalTickets = analytics?.ticketStats?.total ?? tickets.length;
    const resolvedTickets = analytics?.ticketStats?.resolved ?? tickets.filter(t => t.status === 'Resolved' || t.status === 'Closed').length;
    const openTickets = analytics?.ticketStats?.open ?? tickets.filter(t => t.status === 'Open').length;
    const resolutionRate = analytics?.ticketStats?.resolutionRate ?? (totalTickets > 0 ? ((resolvedTickets / totalTickets) * 100).toFixed(1) : 0);
    const avgResolutionTime = analytics?.ticketStats?.avgResolutionTime ?? 0;
    const activeUsers = analytics?.userCounts?.active ?? '--';
    const userCounts = analytics?.userCounts ?? null;

    const formatTime = (hours) => {
        if (!hours || hours === 0) return 'N/A';
        if (hours < 1) return `${Math.round(hours * 60)}m`;
        if (hours < 24) return `${hours}h`;
        return `${(hours / 24).toFixed(1)}d`;
    };

    const categoryStats = tickets.reduce((acc, ticket) => {
        acc[ticket.category] = (acc[ticket.category] || 0) + 1;
        return acc;
    }, {});

    if (loading && !analytics) {
        return <LoadingSpinner message="Loading dashboard..." />;
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">System Overview</h1>
                    <p className="text-gray-500 text-sm mt-1">Campus Service Desk Analytics</p>
                </div>
                <button
                    onClick={() => navigate('/dashboard/admin/analytics')}
                    className="flex items-center gap-2 text-orange-600 hover:text-orange-700 text-sm font-medium"
                >
                    View Full Analytics <ArrowRight size={16} />
                </button>
            </div>

            {/* Analytics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-8">
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-orange-50 text-orange-600 rounded-lg">
                            <FileText size={20} />
                        </div>
                        <div>
                            <p className="text-gray-400 text-xs font-medium">Total Tickets</p>
                            <h3 className="text-2xl font-bold">{totalTickets}</h3>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-yellow-50 text-yellow-600 rounded-lg">
                            <Clock size={20} />
                        </div>
                        <div>
                            <p className="text-gray-400 text-xs font-medium">Open</p>
                            <h3 className="text-2xl font-bold">{openTickets}</h3>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-green-50 text-green-600 rounded-lg">
                            <CheckCircle size={20} />
                        </div>
                        <div>
                            <p className="text-gray-400 text-xs font-medium">Resolved</p>
                            <h3 className="text-2xl font-bold">{resolvedTickets}</h3>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg">
                            <TrendingUp size={20} />
                        </div>
                        <div>
                            <p className="text-gray-400 text-xs font-medium">Resolution Rate</p>
                            <h3 className="text-2xl font-bold">{resolutionRate}%</h3>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-purple-50 text-purple-600 rounded-lg">
                            <Users size={20} />
                        </div>
                        <div>
                            <p className="text-gray-400 text-xs font-medium">Active Users</p>
                            <h3 className="text-2xl font-bold">{activeUsers}</h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* User Breakdown + Avg Resolution */}
            {userCounts && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-orange-50 p-4 rounded-lg border border-orange-100 text-center">
                        <p className="text-2xl font-bold text-orange-800">{userCounts.students}</p>
                        <p className="text-xs text-orange-600 font-medium mt-1">Students</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg border border-green-100 text-center">
                        <p className="text-2xl font-bold text-green-800">{userCounts.staff}</p>
                        <p className="text-xs text-green-600 font-medium mt-1">Staff</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-100 text-center">
                        <p className="text-2xl font-bold text-purple-800">{userCounts.admins}</p>
                        <p className="text-xs text-purple-600 font-medium mt-1">Admins</p>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg border border-orange-100 text-center">
                        <p className="text-2xl font-bold text-orange-800">{formatTime(avgResolutionTime)}</p>
                        <p className="text-xs text-orange-600 font-medium mt-1">Avg Resolution</p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Category Breakdown */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="font-semibold text-lg mb-4">Requests by Category</h3>
                    <div className="space-y-4">
                        {Object.keys(categoryStats).length > 0 ? Object.entries(categoryStats).map(([cat, count]) => (
                            <div key={cat}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span>{cat}</span>
                                    <span className="font-semibold">{count}</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2">
                                    <div
                                        className="bg-orange-500 h-2 rounded-full transition-all duration-500"
                                        style={{ width: `${(count / totalTickets) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        )) : (
                            <p className="text-gray-400">No data available</p>
                        )}
                    </div>
                </div>

                {/* Recent Activity Feed */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="font-semibold text-lg mb-4">Recent System Activity</h3>
                    <div className="space-y-3">
                        {tickets.slice(0, 5).map(t => (
                            <div
                                key={t._id}
                                onClick={() => navigate(`/dashboard/tickets/${t._id}`)}
                                className="flex items-start gap-3 text-sm pb-3 border-b border-gray-50 last:border-0 cursor-pointer hover:bg-gray-50 rounded-lg p-2 -mx-2 transition"
                            >
                                <div className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${t.status === 'Resolved' || t.status === 'Closed' ? 'bg-green-500' : t.status === 'In Progress' ? 'bg-orange-500' : 'bg-yellow-500'}`}></div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-gray-800 truncate">
                                        <strong className="font-mono text-xs text-gray-400">#{t.ticketID}</strong>{' '}
                                        {t.title}
                                    </p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-xs text-gray-400">{t.category}</span>
                                        <StatusBadge status={t.status} />
                                        <PriorityBadge priority={t.priority} />
                                    </div>
                                </div>
                            </div>
                        ))}
                        {tickets.length === 0 && <p className="text-gray-400">No recent activity</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}
