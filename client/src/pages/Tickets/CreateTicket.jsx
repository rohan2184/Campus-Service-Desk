import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTicket } from '../../context/TicketContext';
import { useToast } from '../../context/ToastContext';
import { Send, Loader2 } from 'lucide-react';
import RichTextEditor from '../../components/RichTextEditor';

export default function CreateTicketForm() {
    const { createTicket } = useTicket();
    const { showToast } = useToast();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: '',
        category: 'IT Support',
        description: '',
        location: '',
        priority: 'Low'
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title.trim()) {
            showToast('Please enter a title for your ticket', 'error');
            return;
        }
        if (!formData.description || formData.description === '<p><br></p>' || formData.description.replace(/<[^>]*>/g, '').trim() === '') {
            showToast('Please add a description of the issue', 'error');
            return;
        }

        setLoading(true);
        try {
            const ticket = await createTicket(formData);
            showToast(`Ticket ${ticket.ticketID} created successfully!`, 'success');
            navigate('/dashboard/tickets');
        } catch (err) {
            showToast(err.response?.data?.message || 'Failed to create ticket', 'error');
        }
        setLoading(false);
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Submit a New Ticket</h1>
            <p className="text-gray-500 text-sm mb-6">Describe your issue and we'll get back to you as soon as possible.</p>

            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 space-y-5">
                {/* Title */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title <span className="text-red-500">*</span></label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        maxLength={100}
                        placeholder="Brief description of the issue"
                        className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-400 mt-1 text-right">{formData.title.length}/100</p>
                </div>

                {/* Category & Priority Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category <span className="text-red-500">*</span></label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 bg-white"
                        >
                            <option value="IT Support">IT Support</option>
                            <option value="Facilities">Facilities</option>
                            <option value="Academic Services">Academic Services</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                        <select
                            name="priority"
                            value={formData.priority}
                            onChange={handleChange}
                            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 bg-white"
                        >
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                            <option value="Urgent">Urgent</option>
                        </select>
                    </div>
                </div>

                {/* Location */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="e.g., Library 2nd Floor, Room 204"
                        className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description <span className="text-red-500">*</span></label>
                    <RichTextEditor
                        value={formData.description}
                        onChange={(val) => setFormData({ ...formData, description: val })}
                        placeholder="Provide detailed information about the issue..."
                        minHeight="150px"
                    />
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-orange-600 text-white py-2.5 rounded-lg font-medium hover:bg-orange-700 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <><Loader2 size={18} className="animate-spin" /> Submitting...</>
                    ) : (
                        <><Send size={18} /> Submit Ticket</>
                    )}
                </button>
            </form>
        </div>
    );
}
