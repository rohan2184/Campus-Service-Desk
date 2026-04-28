import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useTicket } from '../../context/TicketContext';
import RoleBadge from '../../components/RoleBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import axios from 'axios';
import { Search, Users, GraduationCap, Shield, UserCog, Filter, CheckCircle, XCircle } from 'lucide-react';

import { API_BASE_URL } from '../../config';
const authAxios = axios.create({ baseURL: API_BASE_URL });
authAxios.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export default function AdminUserManagement() {
    const { user: currentUser } = useAuth();
    const { showToast } = useToast();
    const { tickets, fetchAllTickets } = useTicket();

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('All');
    const [selectedUser, setSelectedUser] = useState(null);
    const [confirmAction, setConfirmAction] = useState(null); // { type, userId, value }

    useEffect(() => {
        fetchUsers();
        fetchAllTickets();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await authAxios.get('/users');
            setUsers(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            showToast(err.response?.data?.message || 'Failed to fetch users', 'error');
        }
        setLoading(false);
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            const res = await authAxios.put(`/users/${userId}/role`, { role: newRole });
            setUsers(users.map(u => u._id === userId ? res.data : u));
            showToast(`Role updated to "${newRole}" successfully`, 'success');
        } catch (err) {
            showToast(err.response?.data?.message || 'Failed to update role', 'error');
        }
        setConfirmAction(null);
    };

    const handleToggleStatus = async (userId) => {
        try {
            const res = await authAxios.put(`/users/${userId}/status`);
            setUsers(users.map(u => u._id === userId ? res.data : u));
            showToast(`Account ${res.data.isActive ? 'activated' : 'deactivated'} successfully`, 'success');
        } catch (err) {
            showToast(err.response?.data?.message || 'Failed to update status', 'error');
        }
        setConfirmAction(null);
    };

    // Filter users
    const filtered = users.filter(u => {
        const matchesSearch = search === '' ||
            u.name?.toLowerCase().includes(search.toLowerCase()) ||
            u.email?.toLowerCase().includes(search.toLowerCase());
        const matchesRole = roleFilter === 'All' || u.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    const totalStudents = users.filter(u => u.role === 'student').length;
    const totalStaff = users.filter(u => u.role === 'staff').length;
    const totalAdmins = users.filter(u => u.role === 'admin').length;

    if (loading) {
        return <LoadingSpinner message="Loading users..." />;
    }

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">User Management</h1>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-gray-500 text-sm">Total Users</p>
                        <h3 className="text-3xl font-bold text-gray-800">{users.length}</h3>
                    </div>
                    <Users className="text-gray-200" size={32} />
                </div>
                <div className="bg-green-50 p-5 rounded-lg border border-green-100 flex items-center justify-between">
                    <div>
                        <p className="text-green-700 text-sm">Students</p>
                        <h3 className="text-3xl font-bold text-green-800">{totalStudents}</h3>
                    </div>
                    <GraduationCap className="text-green-300" size={32} />
                </div>
                <div className="bg-orange-50 p-5 rounded-lg border border-orange-100 flex items-center justify-between">
                    <div>
                        <p className="text-orange-700 text-sm">Staff</p>
                        <h3 className="text-3xl font-bold text-orange-800">{totalStaff}</h3>
                    </div>
                    <UserCog className="text-orange-300" size={32} />
                </div>
                <div className="bg-purple-50 p-5 rounded-lg border border-purple-100 flex items-center justify-between">
                    <div>
                        <p className="text-purple-700 text-sm">Admins</p>
                        <h3 className="text-3xl font-bold text-purple-800">{totalAdmins}</h3>
                    </div>
                    <Shield className="text-purple-300" size={32} />
                </div>
            </div>

            {/* Search & Filter */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-6">
                <div className="flex flex-wrap gap-3 items-center">
                    <div className="relative flex-1 min-w-[220px]">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Filter size={16} className="text-gray-400" />
                        <select
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                            className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-orange-500"
                        >
                            <option value="All">All Roles</option>
                            <option value="student">Students</option>
                            <option value="staff">Staff</option>
                            <option value="admin">Admins</option>
                        </select>
                    </div>
                    <span className="text-sm text-gray-500">{filtered.length} user{filtered.length !== 1 ? 's' : ''}</span>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                            <tr>
                                <th className="p-4">User</th>
                                <th className="p-4">Role</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Department</th>
                                <th className="p-4">Joined</th>
                                <th className="p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filtered.length === 0 ? (
                                <tr><td colSpan="6" className="p-8 text-center text-gray-400">No users found</td></tr>
                            ) : (
                                filtered.map((u) => {
                                    const isSelf = u._id === currentUser?._id;
                                    return (
                                        <tr key={u._id} className={`hover:bg-gray-50 ${isSelf ? 'bg-orange-50/30' : ''}`}>
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-700 text-xs font-bold">
                                                        {u.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-800">
                                                            {u.name} {isSelf && <span className="text-xs text-orange-500">(You)</span>}
                                                        </p>
                                                        <p className="text-xs text-gray-400">{u.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4"><RoleBadge role={u.role} /></td>
                                            <td className="p-4">
                                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${u.isActive !== false ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                    {u.isActive !== false ? <><CheckCircle size={12} /> Active</> : <><XCircle size={12} /> Inactive</>}
                                                </span>
                                            </td>
                                            <td className="p-4 text-gray-600">{u.department || '—'}</td>
                                            <td className="p-4 text-gray-500 text-xs">
                                                {new Date(u.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </td>
                                            <td className="p-4">
                                                {isSelf ? (
                                                    <span className="text-xs text-gray-400 italic">Can't edit self</span>
                                                ) : (
                                                    <div className="flex items-center gap-2">
                                                        <button 
                                                            onClick={() => setSelectedUser(u)}
                                                            className="text-orange-600 hover:text-orange-700 text-xs font-medium hover:underline"
                                                        >
                                                            View Details
                                                        </button>
                                                        {/* Role Change */}
                                                        {confirmAction?.type === 'role' && confirmAction.userId === u._id ? (
                                                            <div className="flex items-center gap-1">
                                                                <select
                                                                    className="border border-orange-300 rounded px-2 py-1 text-xs"
                                                                    defaultValue={u.role}
                                                                    onChange={(e) => handleRoleChange(u._id, e.target.value)}
                                                                >
                                                                    <option value="student">Student</option>
                                                                    <option value="staff">Staff</option>
                                                                    <option value="admin">Admin</option>
                                                                </select>
                                                                <button
                                                                    onClick={() => setConfirmAction(null)}
                                                                    className="text-gray-400 hover:text-gray-600 text-xs"
                                                                >
                                                                    ✕
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <button
                                                                onClick={() => setConfirmAction({ type: 'role', userId: u._id })}
                                                                className="text-orange-600 hover:text-orange-700 text-xs font-medium hover:underline"
                                                            >
                                                                Change Role
                                                            </button>
                                                        )}

                                                        {/* Toggle Status */}
                                                        {confirmAction?.type === 'status' && confirmAction.userId === u._id ? (
                                                            <div className="flex items-center gap-1">
                                                                <button
                                                                    onClick={() => handleToggleStatus(u._id)}
                                                                    className={`px-2 py-1 rounded text-xs font-medium ${u.isActive !== false ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
                                                                >
                                                                    Confirm {u.isActive !== false ? 'Deactivate' : 'Activate'}
                                                                </button>
                                                                <button
                                                                    onClick={() => setConfirmAction(null)}
                                                                    className="text-gray-400 hover:text-gray-600 text-xs"
                                                                >
                                                                    ✕
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <button
                                                                onClick={() => setConfirmAction({ type: 'status', userId: u._id })}
                                                                className={`text-xs font-medium hover:underline ${u.isActive !== false ? 'text-red-500 hover:text-red-600' : 'text-green-600 hover:text-green-700'}`}
                                                            >
                                                                {u.isActive !== false ? 'Deactivate' : 'Activate'}
                                                            </button>
                                                        )}
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* User Details Modal */}
            {selectedUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
                            <h3 className="font-bold text-lg text-gray-800">User Details</h3>
                            <button onClick={() => setSelectedUser(null)} className="text-gray-400 hover:text-gray-600">
                                <XCircle size={20} />
                            </button>
                        </div>
                        <div className="p-6 overflow-y-auto">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center text-orange-700 text-2xl font-bold">
                                    {selectedUser.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-800">{selectedUser.name}</h2>
                                    <p className="text-gray-500">{selectedUser.email}</p>
                                    <div className="flex gap-2 mt-2">
                                        <RoleBadge role={selectedUser.role} />
                                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${selectedUser.isActive !== false ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {selectedUser.isActive !== false ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-gray-50 rounded-lg p-5 border border-gray-100 mb-6">
                                <h3 className="font-semibold text-gray-700 mb-3">Statistics</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {selectedUser.role === 'staff' || selectedUser.role === 'admin' ? (() => {
                                        const assigned = tickets.filter(t => t.assignedTo?._id === selectedUser._id || t.assignedTo === selectedUser._id);
                                        const resolved = assigned.filter(t => t.status === 'Resolved' || t.status === 'Closed').length;
                                        return (
                                            <>
                                                <div>
                                                    <p className="text-xs text-gray-500 mb-1">Total Assigned</p>
                                                    <p className="text-xl font-bold">{assigned.length}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 mb-1">Resolved</p>
                                                    <p className="text-xl font-bold text-green-600">{resolved}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 mb-1">In Progress</p>
                                                    <p className="text-xl font-bold text-orange-600">{assigned.filter(t => t.status === 'In Progress').length}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 mb-1">Completion Rate</p>
                                                    <p className="text-xl font-bold text-purple-600">{assigned.length > 0 ? Math.round((resolved/assigned.length)*100) : 0}%</p>
                                                </div>
                                            </>
                                        );
                                    })() : (() => {
                                        const generated = tickets.filter(t => t.requester?._id === selectedUser._id || t.requester === selectedUser._id);
                                        const resolved = generated.filter(t => t.status === 'Resolved' || t.status === 'Closed').length;
                                        return (
                                            <>
                                                <div>
                                                    <p className="text-xs text-gray-500 mb-1">Tickets Generated</p>
                                                    <p className="text-xl font-bold">{generated.length}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 mb-1">Resolved</p>
                                                    <p className="text-xl font-bold text-green-600">{resolved}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 mb-1">Open/In Progress</p>
                                                    <p className="text-xl font-bold text-yellow-600">{generated.length - resolved}</p>
                                                </div>
                                            </>
                                        );
                                    })()}
                                </div>
                            </div>
                            
                            <h3 className="font-semibold text-gray-700 mb-3">Quick Actions</h3>
                            <div className="flex flex-wrap gap-3">
                                <button onClick={() => { setConfirmAction({ type: 'role', userId: selectedUser._id }); setSelectedUser(null); }} className="px-4 py-2 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 text-sm font-medium transition">Change Role</button>
                                <button onClick={() => { setConfirmAction({ type: 'status', userId: selectedUser._id }); setSelectedUser(null); }} className={`px-4 py-2 ${selectedUser.isActive !== false ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-green-50 text-green-600 hover:bg-green-100'} rounded-lg text-sm font-medium transition`}>
                                    {selectedUser.isActive !== false ? 'Deactivate User' : 'Activate User'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
