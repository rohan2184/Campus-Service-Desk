import { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowLeft } from 'lucide-react';

export default function GetInTouch() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        organization: '',
        requirements: ''
    });
    const [status, setStatus] = useState({ loading: false, error: null, success: false });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ loading: true, error: null, success: false });
        
        try {
            await axios.post(`${API_BASE_URL}/auth/contact`, formData);
            setStatus({ loading: false, error: null, success: true });
            setFormData({ name: '', email: '', organization: '', requirements: '' });
        } catch (error) {
            setStatus({ 
                loading: false, 
                error: error.response?.data?.message || 'Failed to send request. Please try again.',
                success: false 
            });
        }
    };

    return (
        <main className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <Link to="/" className="flex items-center justify-center text-orange-600 hover:text-orange-800 mb-6 font-medium">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Home
                </Link>
                <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900">
                    Get in Touch
                </h2>
                <p className="mt-3 text-center text-md text-gray-600">
                    Interested in using Campus Service Desk at your institution? Fill out the form below and our team will contact you.
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
                <div className="bg-white py-8 px-4 shadow-xl sm:rounded-xl sm:px-10 border border-gray-100">
                    {status.success ? (
                        <div className="text-center py-8">
                            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Request Sent!</h3>
                            <p className="text-gray-600 mb-8">
                                Thank you for your interest. Our team has received your requirements and will be in touch with you shortly at the provided email address.
                            </p>
                            <Link to="/" className="inline-block bg-orange-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-700 transition shadow-sm">
                                Return to Homepage
                            </Link>
                        </div>
                    ) : (
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            {status.error && (
                                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                                    <p className="text-sm text-red-700">{status.error}</p>
                                </div>
                            )}
                            
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name *</label>
                                    <div className="mt-1">
                                        <input
                                            id="name"
                                            name="name"
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 transition"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address *</label>
                                    <div className="mt-1">
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 transition"
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="organization" className="block text-sm font-medium text-gray-700">Institution / Organization</label>
                                <div className="mt-1">
                                    <input
                                        id="organization"
                                        name="organization"
                                        type="text"
                                        value={formData.organization}
                                        onChange={handleChange}
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 transition"
                                        placeholder="University of Example"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="requirements" className="block text-sm font-medium text-gray-700">Requirements & Use Case *</label>
                                <div className="mt-1">
                                    <textarea
                                        id="requirements"
                                        name="requirements"
                                        rows={4}
                                        required
                                        value={formData.requirements}
                                        onChange={handleChange}
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 transition resize-y"
                                        placeholder="Please describe how you plan to use the system, number of expected users, and any specific requirements..."
                                    />
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={status.loading}
                                    className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${status.loading ? 'bg-orange-400 cursor-not-allowed' : 'bg-orange-600 hover:bg-orange-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition`}
                                >
                                    {status.loading ? 'Sending Request...' : 'Submit Request'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link to="/login" className="font-medium text-orange-600 hover:text-orange-500 transition">
                            Sign in here
                        </Link>
                    </p>
                </div>
            </div>
        </main>
    );
}
