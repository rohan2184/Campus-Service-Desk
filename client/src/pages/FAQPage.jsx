import { useState, useEffect } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Search, Info, Plus, Edit2, Trash2, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';
import { API_BASE_URL } from '../config';

const api = axios.create({ baseURL: API_BASE_URL });
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export default function FAQPage() {
    const { user } = useAuth();
    const { showToast } = useToast();
    
    const [faqs, setFaqs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [openIndex, setOpenIndex] = useState(null);

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingFaq, setEditingFaq] = useState(null);
    const [formData, setFormData] = useState({ question: '', answer: '', category: 'General' });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchFaqs();
    }, []);

    const fetchFaqs = async () => {
        setLoading(true);
        try {
            const res = await api.get('/faqs');
            setFaqs(res.data);
        } catch (error) {
            showToast('Failed to load FAQs', 'error');
        }
        setLoading(false);
    };

    // Group FAQs by category
    const groupedFaqsArray = [];
    const grouped = faqs.reduce((acc, faq) => {
        const cat = faq.category || 'General';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(faq);
        return acc;
    }, {});
    
    // Default categories to show if empty (acts as placeholders until populated)
    const displayCategories = ['Network & WiFi', 'Accounts & Access', 'Facilities & Printing', 'General'];
    
    for (const category of displayCategories) {
        if (grouped[category]) {
            groupedFaqsArray.push({ category, questions: grouped[category] });
            delete grouped[category];
        }
    }
    for (const [category, questions] of Object.entries(grouped)) {
        groupedFaqsArray.push({ category, questions });
    }

    // Filter FAQs based on search
    const filteredFaqs = groupedFaqsArray.map(category => {
        const matchingQuestions = category.questions.filter(
            q => q.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                 q.answer.toLowerCase().includes(searchQuery.toLowerCase())
        );
        return { ...category, questions: matchingQuestions };
    }).filter(category => category.questions.length > 0);

    const toggleAccordion = (idx) => {
        setOpenIndex(openIndex === idx ? null : idx);
    };

    const handleOpenModal = (faq = null) => {
        if (faq) {
            setEditingFaq(faq);
            setFormData({ question: faq.question, answer: faq.answer, category: faq.category || 'General' });
        } else {
            setEditingFaq(null);
            setFormData({ question: '', answer: '', category: 'General' });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingFaq(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (editingFaq) {
                await api.put(`/faqs/${editingFaq._id}`, formData);
                showToast('FAQ updated successfully', 'success');
            } else {
                await api.post('/faqs', formData);
                showToast('FAQ added successfully', 'success');
            }
            fetchFaqs();
            handleCloseModal();
        } catch (error) {
            showToast(error.response?.data?.message || 'Failed to save FAQ', 'error');
        }
        setSubmitting(false);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this FAQ?')) return;
        try {
            await api.delete(`/faqs/${id}`);
            showToast('FAQ deleted', 'success');
            fetchFaqs();
        } catch (error) {
            showToast('Failed to delete FAQ', 'error');
        }
    };

    if (loading) return <LoadingSpinner message="Loading knowledge base..." />;

    return (
        <div className="max-w-3xl mx-auto space-y-8 pb-12">
            <div className="text-center space-y-4 mb-10 mt-6 relative">
                {user?.role === 'admin' && (
                    <button
                        onClick={() => handleOpenModal()}
                        className="absolute right-0 top-0 flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-700 transition shadow-sm"
                    >
                        <Plus size={16} /> Add FAQ
                    </button>
                )}

                <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600 mx-auto shadow-sm">
                    <HelpCircle size={32} />
                </div>
                <h1 className="text-3xl font-bold text-gray-800">How can we help you?</h1>
                <p className="text-gray-500 max-w-lg mx-auto">
                    Search our knowledge base for quick answers to common questions before submitting a ticket.
                </p>

                <div className="max-w-xl mx-auto relative mt-6">
                    <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
                    <input 
                        type="text" 
                        placeholder="Search for answers..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-shadow text-gray-700"
                    />
                </div>
            </div>

            {filteredFaqs.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl border border-gray-100 shadow-sm">
                    <Info size={40} className="mx-auto text-gray-300 mb-3" />
                    <h3 className="text-lg font-medium text-gray-700">No matching articles found</h3>
                    <p className="text-gray-500 mt-1">Try adjusting your search terms or submit a new ticket.</p>
                </div>
            ) : (
                <div className="space-y-8">
                    {filteredFaqs.map((category, catIdx) => (
                        <div key={catIdx}>
                            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <span className="w-2 h-6 bg-orange-500 rounded-full"></span>
                                {category.category}
                            </h2>
                            <div className="space-y-3">
                                {category.questions.map((faq, qIdx) => {
                                    const globalIdx = `${catIdx}-${qIdx}`;
                                    const isOpen = openIndex === globalIdx;

                                    return (
                                        <div 
                                            key={faq._id} 
                                            className={`bg-white border rounded-xl overflow-hidden transition-all duration-200 ${isOpen ? 'border-orange-200 shadow-sm ring-1 ring-orange-50' : 'border-gray-100 hover:border-gray-200'}`}
                                        >
                                            <div className="flex items-center">
                                                <button
                                                    onClick={() => toggleAccordion(globalIdx)}
                                                    className="flex-1 text-left px-5 py-4 flex items-center justify-between gap-4 focus:outline-none"
                                                >
                                                    <span className={`font-medium ${isOpen ? 'text-orange-700' : 'text-gray-800'}`}>
                                                        {faq.question}
                                                    </span>
                                                    {isOpen ? (
                                                        <ChevronUp size={18} className="text-orange-500 flex-shrink-0" />
                                                    ) : (
                                                        <ChevronDown size={18} className="text-gray-400 flex-shrink-0" />
                                                    )}
                                                </button>
                                                {user?.role === 'admin' && (
                                                    <div className="pr-4 flex items-center gap-2">
                                                        <button 
                                                            onClick={(e) => { e.stopPropagation(); handleOpenModal(faq); }}
                                                            className="p-1.5 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded transition"
                                                            title="Edit"
                                                        >
                                                            <Edit2 size={16} />
                                                        </button>
                                                        <button 
                                                            onClick={(e) => { e.stopPropagation(); handleDelete(faq._id); }}
                                                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition"
                                                            title="Delete"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                            
                                            <div 
                                                className={`text-gray-600 text-sm leading-relaxed transition-all duration-300 ease-in-out ${
                                                    isOpen ? 'px-5 py-4 border-t border-gray-100 opacity-100' : 'max-h-0 opacity-0 py-0 px-5'
                                                }`}
                                            >
                                                {isOpen && <div className="whitespace-pre-wrap">{faq.answer}</div>}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Admin FAQ Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col">
                        <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
                            <h3 className="font-bold text-lg text-gray-800">{editingFaq ? 'Edit FAQ' : 'Add FAQ'}</h3>
                            <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600">
                                <X size={20} />
                            </button>
                        </div>
                        
                        <div className="p-6">
                            <form id="faq-form" onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                                    <input
                                        type="text"
                                        list="faq-categories"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        required
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                                        placeholder="e.g. Network & WiFi"
                                    />
                                    <datalist id="faq-categories">
                                        <option value="Network & WiFi" />
                                        <option value="Accounts & Access" />
                                        <option value="Facilities & Printing" />
                                        <option value="General" />
                                    </datalist>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Question *</label>
                                    <input
                                        type="text"
                                        value={formData.question}
                                        onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                                        required
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                                        placeholder="What is the question?"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Answer *</label>
                                    <textarea
                                        value={formData.answer}
                                        onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                                        required
                                        rows="5"
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 outline-none resize-none"
                                        placeholder="Provide the detailed answer here..."
                                    ></textarea>
                                </div>
                            </form>
                        </div>
                        
                        <div className="px-6 py-4 border-t bg-gray-50 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={handleCloseModal}
                                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                form="faq-form"
                                disabled={submitting}
                                className="px-5 py-2 text-sm font-medium bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 transition"
                            >
                                {submitting ? 'Saving...' : (editingFaq ? 'Save Changes' : 'Add FAQ')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
