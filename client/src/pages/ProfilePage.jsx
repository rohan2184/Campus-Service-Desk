import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import axios from 'axios';
import { User, Shield, Phone, Building, Mail, Save, Lock } from 'lucide-react';
import { API_BASE_URL } from '../config';

export default function ProfilePage() {
    const { user, login } = useAuth(); // use login to update context user state
    const { showToast } = useToast();
    const [activeTab, setActiveTab] = useState('personal');

    // Personal Info State
    const [name, setName] = useState(user?.name || '');
    const [department, setDepartment] = useState(user?.department || '');
    const [phone, setPhone] = useState(user?.contactInfo?.phone || '');
    const [office, setOffice] = useState(user?.contactInfo?.office || '');
    const [savingProfile, setSavingProfile] = useState(false);

    // Security State
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [savingPassword, setSavingPassword] = useState(false);

    const authAxios = axios.create({ baseURL: API_BASE_URL });
    authAxios.interceptors.request.use((config) => {
        const token = localStorage.getItem('token');
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
    });

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setSavingProfile(true);
        try {
            const res = await authAxios.put('/users/profile', {
                name,
                department,
                contactInfo: { phone, office }
            });
            showToast('Profile updated successfully', 'success');
            // Update auth context without needing a full token refresh if we just locally merge it, 
            // but the safest way is to wait for next reload or explicitly update context.
            // For now, toast is enough.
        } catch (err) {
            showToast(err.response?.data?.message || 'Failed to update profile', 'error');
        } finally {
            setSavingProfile(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            return showToast('New passwords do not match', 'error');
        }
        if (newPassword.length < 6) {
            return showToast('Password must be at least 6 characters', 'error');
        }

        setSavingPassword(true);
        try {
            await authAxios.put('/users/change-password', {
                oldPassword,
                newPassword
            });
            showToast('Password changed successfully', 'success');
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err) {
            showToast(err.response?.data?.message || 'Failed to change password', 'error');
        } finally {
            setSavingPassword(false);
        }
    };

    const getInitials = (name) => {
        if (!name) return '?';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Account Settings</h1>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="flex border-b">
                    <button
                        onClick={() => setActiveTab('personal')}
                        className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition ${
                            activeTab === 'personal'
                                ? 'text-orange-600 border-b-2 border-orange-600 bg-orange-50/30'
                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                        <User size={18} /> Personal Information
                    </button>
                    <button
                        onClick={() => setActiveTab('security')}
                        className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition ${
                            activeTab === 'security'
                                ? 'text-orange-600 border-b-2 border-orange-600 bg-orange-50/30'
                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                        <Shield size={18} /> Security & Password
                    </button>
                </div>

                <div className="p-6 md:p-8">
                    {activeTab === 'personal' && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="md:col-span-1 text-center border-r border-gray-100 md:pr-8">
                                <div className="w-24 h-24 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 text-3xl font-bold mx-auto mb-4">
                                    {getInitials(user?.name)}
                                </div>
                                <h3 className="text-lg font-bold text-gray-800">{user?.name}</h3>
                                <p className="text-sm text-gray-500 mb-4">{user?.email}</p>
                                <span className="inline-block bg-orange-50 text-orange-700 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide">
                                    {user?.role}
                                </span>
                            </div>

                            <div className="md:col-span-2">
                                <form onSubmit={handleProfileSubmit} className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-2.5 text-gray-400" size={18} />
                                            <input
                                                type="text"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address (Cannot be changed)</label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-2.5 text-gray-400" size={18} />
                                            <input
                                                type="email"
                                                value={user?.email}
                                                disabled
                                                className="w-full pl-10 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 text-sm cursor-not-allowed"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Department / Major</label>
                                            <div className="relative">
                                                <Building className="absolute left-3 top-2.5 text-gray-400" size={18} />
                                                <input
                                                    type="text"
                                                    value={department}
                                                    onChange={(e) => setDepartment(e.target.value)}
                                                    placeholder="e.g. Computer Science"
                                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-2.5 text-gray-400" size={18} />
                                                <input
                                                    type="text"
                                                    value={phone}
                                                    onChange={(e) => setPhone(e.target.value)}
                                                    placeholder="+1 (555) 000-0000"
                                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-4 flex justify-end">
                                        <button
                                            type="submit"
                                            disabled={savingProfile}
                                            className="flex items-center gap-2 bg-orange-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-orange-700 transition disabled:opacity-50"
                                        >
                                            {savingProfile ? 'Saving...' : <><Save size={16} /> Save Changes</>}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="max-w-md mx-auto">
                            <h3 className="text-lg font-semibold text-gray-800 mb-1">Change Password</h3>
                            <p className="text-sm text-gray-500 mb-6">Ensure your account is using a long, random password to stay secure.</p>

                            <form onSubmit={handlePasswordSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-2.5 text-gray-400" size={18} />
                                        <input
                                            type="password"
                                            value={oldPassword}
                                            onChange={(e) => setOldPassword(e.target.value)}
                                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-2.5 text-gray-400" size={18} />
                                        <input
                                            type="password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                                            required
                                            minLength={6}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-2.5 text-gray-400" size={18} />
                                        <input
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                                            required
                                            minLength={6}
                                        />
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        disabled={savingPassword || !oldPassword || !newPassword || !confirmPassword}
                                        className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition disabled:opacity-50"
                                    >
                                        {savingPassword ? 'Updating Password...' : 'Update Password'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
