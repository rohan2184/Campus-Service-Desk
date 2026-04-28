import { useEffect, useState } from 'react';
import { useTicket } from '../../context/TicketContext';
import { useToast } from '../../context/ToastContext';
import axios from 'axios';
import { Clock, User, CheckCircle, X, Search, FileText } from 'lucide-react';
import PriorityBadge from '../../components/PriorityBadge';
import LoadingSpinner from '../../components/LoadingSpinner';

import { API_BASE_URL } from '../../config';
const authAxios = axios.create({ baseURL: API_BASE_URL });
authAxios.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export default function AdminApprovalQueue() {
    const { tickets: contextTickets, fetchAllTickets, updateTicket, loading: ticketsLoading } = useTicket();
    const { showToast } = useToast();
    const [staffList, setStaffList] = useState([]);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Modal State
    const [assignedTo, setAssignedTo] = useState('');
    const [optimalCompletionTime, setOptimalCompletionTime] = useState('');
    const [priority, setPriority] = useState('Low');
    const [adminRemarks, setAdminRemarks] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchAllTickets();
        fetchStaff();
    }, []);

    const fetchStaff = async () => {
        try {
            const res = await authAxios.get('/users/staff');
            setStaffList(res.data);
        } catch (error) {
            showToast('Failed to load staff list', 'error');
        }
    };

    const approvalTickets = (contextTickets || []).filter(t => t.status === 'Approval');
    
    const filteredTickets = approvalTickets.filter(t => 
        t.ticketID?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.requester?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const openModal = (ticket) => {
        setSelectedTicket(ticket);
        setAssignedTo('');
        setOptimalCompletionTime('');
        setPriority(ticket.priority || 'Low');
        setAdminRemarks('');
    };

    const closeModal = () => {
        setSelectedTicket(null);
    };

    const handleApprove = async (e) => {
        e.preventDefault();
        
        // Validation
        if (!assignedTo) {
            showToast('Please assign a staff member', 'error');
            return;
        }

        setSubmitting(true);
        try {
            await updateTicket(selectedTicket._id, {
                status: 'Open',
                assignedTo,
                priority,
                optimalCompletionTime: optimalCompletionTime || undefined,
                adminRemarks
            });
            showToast(`Ticket ${selectedTicket.ticketID} approved successfully`, 'success');
            closeModal();
            // Refetch to clear from list
            fetchAllTickets();
        } catch (error) {
            showToast('Failed to approve ticket', 'error');
        }
        setSubmitting(false);
    };

    if (ticketsLoading && !contextTickets?.length) {
        return <LoadingSpinner message="Loading approval queue..." />;
    }

    return (
        <div className="max-w-6xl mx-auto">
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Approval Queue</h1>
                    <p className="text-gray-500 text-sm mt-1">Review and assign newly generated tickets</p>
                </div>
                
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search tickets..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-full sm:w-64 focus:ring-2 focus:ring-orange-500"
                    />
                </div>
            </div>

            {/* Ticket List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600">
                        <thead className="bg-gray-50 text-gray-700 text-xs uppercase font-semibold border-b border-gray-100">
                            <tr>
                                <th className="px-5 py-4">Ticket</th>
                                <th className="px-5 py-4">Requester</th>
                                <th className="px-5 py-4">Category</th>
                                <th className="px-5 py-4">Submitted</th>
                                <th className="px-5 py-4">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredTickets.map(ticket => (
                                <tr key={ticket._id} className="hover:bg-gray-50/50 transition">
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-yellow-50 text-yellow-600 rounded-lg hidden sm:block">
                                                <FileText size={16} />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-800">{ticket.title}</p>
                                                <span className="text-xs font-mono text-gray-400">#{ticket.ticketID}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4">
                                        <p className="font-medium text-gray-800">{ticket.requester?.name || 'Unknown'}</p>
                                        <p className="text-xs text-gray-500">{ticket.requester?.email}</p>
                                    </td>
                                    <td className="px-5 py-4">
                                        <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded text-xs font-medium">
                                            {ticket.category}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4">
                                        {new Date(ticket.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'})}
                                    </td>
                                    <td className="px-5 py-4">
                                        <button
                                            onClick={() => openModal(ticket)}
                                            className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 text-orange-600 hover:bg-orange-100 rounded-lg text-xs font-semibold transition"
                                        >
                                            <CheckCircle size={14} /> Review & Approve
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filteredTickets.length === 0 && (
                    <div className="p-12 text-center text-gray-500">
                        <CheckCircle size={48} className="mx-auto text-green-200 mb-3" />
                        <p className="text-lg font-medium text-gray-700">All caught up!</p>
                        <p className="text-sm mt-1">There are no tickets waiting for approval.</p>
                    </div>
                )}
            </div>

            {/* Approval Modal */}
            {selectedTicket && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
                            <h3 className="font-bold text-lg text-gray-800">Approve Ticket</h3>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                                <X size={20} />
                            </button>
                        </div>
                        
                        <div className="px-6 py-4 overflow-y-auto">
                            <div className="mb-4 p-3 bg-orange-50 text-orange-800 rounded-lg border border-orange-100">
                                <p className="font-semibold text-sm mb-1">#{selectedTicket.ticketID}: {selectedTicket.title}</p>
                                <p className="text-xs opacity-80">{selectedTicket.description}</p>
                            </div>

                            <form id="approve-form" onSubmit={handleApprove} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Assign Staff *</label>
                                    <select
                                        value={assignedTo}
                                        onChange={(e) => setAssignedTo(e.target.value)}
                                        required
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                                    >
                                        <option value="" disabled>Select a staff member...</option>
                                        {staffList.map(staff => (
                                            <option key={staff._id} value={staff._id}>
                                                {staff.name} - {staff.department || 'No Dept'}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                                    <select
                                        value={priority}
                                        onChange={(e) => setPriority(e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                                    >
                                        <option value="Low">Low</option>
                                        <option value="Medium">Medium</option>
                                        <option value="High">High</option>
                                        <option value="Urgent">Urgent</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Optimal Completion Time (SLA)</label>
                                    <input
                                        type="datetime-local"
                                        value={optimalCompletionTime}
                                        onChange={(e) => setOptimalCompletionTime(e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Optional. Sets a deadline for Kanban warnings.</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Admin Remarks</label>
                                    <textarea
                                        value={adminRemarks}
                                        onChange={(e) => setAdminRemarks(e.target.value)}
                                        placeholder="Add instructions or notes for the staff..."
                                        rows="3"
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 outline-none resize-none"
                                    ></textarea>
                                </div>
                            </form>
                        </div>
                        
                        <div className="px-6 py-4 border-t bg-gray-50 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={closeModal}
                                disabled={submitting}
                                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                form="approve-form"
                                disabled={submitting}
                                className="px-5 py-2 text-sm font-medium bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 transition flex items-center gap-2"
                            >
                                {submitting ? 'Approving...' : 'Approve & Delegate'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
