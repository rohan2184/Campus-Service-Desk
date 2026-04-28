import { useEffect, useState } from 'react';
import axios from 'axios';
import LoadingSpinner from '../../components/LoadingSpinner';
import {
    PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, LineChart, Line, ResponsiveContainer
} from 'recharts';
import { BarChart3, FileText, CheckCircle, Clock, TrendingUp, Users, Activity, Download } from 'lucide-react';

import { API_BASE_URL } from '../../config';
const authAxios = axios.create({ baseURL: API_BASE_URL });
authAxios.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

const COLORS = ['#EAB308', '#3B82F6', '#22C55E', '#6B7280'];
const CATEGORY_COLORS = ['#6366F1', '#8B5CF6', '#EC4899', '#F97316', '#14B8A6'];

export default function AnalyticsPage() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const res = await authAxios.get('/analytics');
            setData(res.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load analytics');
        } finally {
            setLoading(false);
        }
    };

    const exportTicketsToCSV = async () => {
        try {
            const res = await authAxios.get('/tickets');
            const tickets = res.data;

            if (!tickets.length) return alert('No tickets to export');

            // Define CSV Headers
            const headers = ['Ticket ID', 'Title', 'Status', 'Priority', 'Category', 'Created At', 'Resolved At', 'Requester Name', 'Assigned Staff'];
            
            // Map data to CSV rows
            const rows = tickets.map(t => {
                const requester = t.requester ? t.requester.name : 'Unknown';
                const assigned = t.assignedTo ? t.assignedTo.name : 'Unassigned';
                const created = new Date(t.createdAt).toLocaleDateString();
                const resolved = t.status === 'Resolved' || t.status === 'Closed' ? new Date(t.updatedAt).toLocaleDateString() : '';
                
                // Escape quotes and wrap in quotes to handle commas in text
                const escapeCSV = (str) => `"${String(str).replace(/"/g, '""')}"`;

                return [
                    t.ticketID,
                    escapeCSV(t.title),
                    t.status,
                    t.priority,
                    t.category,
                    created,
                    resolved,
                    escapeCSV(requester),
                    escapeCSV(assigned)
                ].join(',');
            });

            const csvContent = [headers.join(','), ...rows].join('\n');
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            
            const link = document.createElement('a');
            link.setAttribute('href', url);
            link.setAttribute('download', `ticket_report_${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (err) {
            console.error('Failed to export tickets', err);
            alert('Failed to export data');
        }
    };

    if (loading) return <LoadingSpinner message="Loading analytics..." />;
    if (error) return <div className="text-center py-16 text-red-500">{error}</div>;
    if (!data) return null;

    const { ticketStats, statusDistribution, categoryBreakdown, priorityDistribution, trends, staffPerformance, userCounts } = data;

    // Format resolution time
    const formatTime = (hours) => {
        if (hours < 1) return `${Math.round(hours * 60)}m`;
        if (hours < 24) return `${hours}h`;
        return `${(hours / 24).toFixed(1)}d`;
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                        <BarChart3 className="text-orange-600" size={28} />
                        Analytics & Reports
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">Data-driven insights for your service desk</p>
                </div>
                <button
                    onClick={exportTicketsToCSV}
                    className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 hover:text-orange-600 transition shadow-sm"
                >
                    <Download size={18} /> Export CSV
                </button>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">Total Tickets</p>
                            <h3 className="text-3xl font-bold text-gray-900 mt-1">{ticketStats.total}</h3>
                        </div>
                        <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
                            <FileText size={24} />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">Open Tickets</p>
                            <h3 className="text-3xl font-bold text-yellow-600 mt-1">{ticketStats.open}</h3>
                        </div>
                        <div className="p-3 bg-yellow-50 text-yellow-600 rounded-xl">
                            <Clock size={24} />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">Resolution Rate</p>
                            <h3 className="text-3xl font-bold text-green-600 mt-1">{ticketStats.resolutionRate}%</h3>
                        </div>
                        <div className="p-3 bg-green-50 text-green-600 rounded-xl">
                            <CheckCircle size={24} />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">Avg Resolution</p>
                            <h3 className="text-3xl font-bold text-purple-600 mt-1">{formatTime(ticketStats.avgResolutionTime)}</h3>
                        </div>
                        <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                            <TrendingUp size={24} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Row 1 — Status Pie + Category Bar */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Ticket Status Distribution — Pie Chart */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="font-semibold text-lg text-gray-800 mb-4">Ticket Status Distribution</h3>
                    {statusDistribution.length > 0 ? (
                        <ResponsiveContainer width="100%" height={280}>
                            <PieChart>
                                <Pie
                                    data={statusDistribution}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {statusDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="text-gray-400 text-center py-12">No ticket data available</p>
                    )}
                </div>

                {/* Tickets by Category — Bar Chart */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="font-semibold text-lg text-gray-800 mb-4">Tickets by Category</h3>
                    {categoryBreakdown.length > 0 ? (
                        <ResponsiveContainer width="100%" height={280}>
                            <BarChart data={categoryBreakdown}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="category" tick={{ fontSize: 12 }} />
                                <YAxis allowDecimals={false} />
                                <Tooltip />
                                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                                    {categoryBreakdown.map((entry, index) => (
                                        <Cell key={`cat-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="text-gray-400 text-center py-12">No category data available</p>
                    )}
                </div>
            </div>

            {/* Chart Row 2 — Ticket Trends Line Chart */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-semibold text-lg text-gray-800 mb-4">Ticket Trends (Last 7 Days)</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={trends}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="created"
                            stroke="#6366F1"
                            strokeWidth={2}
                            dot={{ r: 4 }}
                            activeDot={{ r: 6 }}
                            name="Created"
                        />
                        <Line
                            type="monotone"
                            dataKey="resolved"
                            stroke="#22C55E"
                            strokeWidth={2}
                            dot={{ r: 4 }}
                            activeDot={{ r: 6 }}
                            name="Resolved"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Charts Row 3 — Priority Distribution + Staff Performance */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Priority Distribution — Horizontal Bar */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="font-semibold text-lg text-gray-800 mb-4">Priority Distribution</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={priorityDistribution} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis type="number" allowDecimals={false} />
                            <YAxis dataKey="priority" type="category" tick={{ fontSize: 12 }} width={70} />
                            <Tooltip />
                            <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                                {priorityDistribution.map((entry, index) => (
                                    <Cell key={`pri-${index}`} fill={entry.color} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Staff Performance — Stacked Bar */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="font-semibold text-lg text-gray-800 mb-4 flex items-center gap-2">
                        <Activity size={18} className="text-orange-500" />
                        Staff Performance
                    </h3>
                    {staffPerformance.length > 0 ? (
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={staffPerformance}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                                <YAxis allowDecimals={false} />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="resolved" stackId="a" fill="#22C55E" name="Resolved" radius={[0, 0, 0, 0]} />
                                <Bar dataKey="inProgress" stackId="a" fill="#3B82F6" name="In Progress" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="text-gray-400 text-center py-12">No staff assignment data available</p>
                    )}
                </div>
            </div>

            {/* User Stats Footer */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-semibold text-lg text-gray-800 mb-4 flex items-center gap-2">
                    <Users size={18} className="text-orange-500" />
                    User Overview
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <p className="text-2xl font-bold text-gray-800">{userCounts.total}</p>
                        <p className="text-xs text-gray-500 mt-1">Total Users</p>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                        <p className="text-2xl font-bold text-orange-700">{userCounts.students}</p>
                        <p className="text-xs text-gray-500 mt-1">Students</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                        <p className="text-2xl font-bold text-green-700">{userCounts.staff}</p>
                        <p className="text-xs text-gray-500 mt-1">Staff</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <p className="text-2xl font-bold text-purple-700">{userCounts.admins}</p>
                        <p className="text-xs text-gray-500 mt-1">Admins</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
