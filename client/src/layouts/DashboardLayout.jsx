import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { useTheme } from '../context/ThemeContext';
import {
    LogOut, User as UserIcon, LayoutDashboard, ListTodo, PlusCircle,
    Users, Shield, BarChart3, Bell, KanbanSquare, HelpCircle,
    Moon, Sun
} from 'lucide-react';
import csdLogoLight from '../assets/CSD-arch-gemini-light.png';
import csdLogoDark from '../assets/CSD-arch-gemini-dark.png';

// Sidebar modes: 'expanded', 'collapsed', 'autohide'
export default function DashboardLayout() {
    const { user, logout, loading } = useAuth();
    const { unreadCount } = useNotification();
    const { darkMode, toggleDarkMode } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path) => {
        if (path === '/dashboard/admin' || path === '/dashboard/staff' || path === '/dashboard/student') {
            return location.pathname === path;
        }
        return location.pathname === path || location.pathname.startsWith(path + '/');
    };

    const linkClass = (path) =>
        `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
            isActive(path)
                ? 'text-[var(--csd-sidebar-active-text)] bg-[var(--csd-sidebar-active-bg)]'
                : 'text-[var(--csd-sidebar-text)] hover:bg-[var(--csd-sidebar-active-bg)] hover:text-[var(--csd-accent)]'
        }`;

    if (loading) {
        return <div className="flex items-center justify-center h-screen" style={{ backgroundColor: 'var(--csd-bg-main)' }}>Loading...</div>;
    }

    const sidebarClasses = "sidebar sidebar-expanded flex flex-col shadow-md";

    return (
        <div className="flex h-screen" style={{ backgroundColor: 'var(--csd-bg-main)' }}>
            {/* Sidebar */}
            <aside className={sidebarClasses} style={{ backgroundColor: 'var(--csd-sidebar-bg)' }}>
                {/* Header */}
                <div className="p-4 border-b flex items-center gap-3" style={{ borderColor: 'var(--csd-bg-subtle)' }}>
                    <img
                        src={darkMode ? csdLogoDark : csdLogoLight}
                        alt="CSD Logo"
                        className="w-10 h-10 object-contain"
                    />
                    <div className="min-w-0">
                        <h2 className="text-lg font-bold truncate" style={{ color: 'var(--csd-brand-primary)' }}>Campus Desk</h2>
                        <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded inline-block"
                                style={{ color: 'var(--csd-text-muted)', backgroundColor: 'var(--csd-bg-subtle)' }}>
                            {user?.role} Portal
                        </span>
                    </div>
                </div>

                {/* Nav */}
                <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                    <p className="text-[10px] uppercase font-semibold mb-2 px-3" style={{ color: 'var(--csd-text-muted)' }}>Menu</p>

                    <Link to={user?.role === 'staff' ? '/dashboard/staff' : `/dashboard/${user?.role || 'student'}`} className={linkClass(user?.role === 'staff' ? '/dashboard/staff' : `/dashboard/${user?.role || 'student'}`)}>
                        <LayoutDashboard size={18} /> Dashboard
                    </Link>

                    <Link to="/dashboard/tickets" className={linkClass('/dashboard/tickets')}>
                        <ListTodo size={18} /> {user?.role === 'student' ? 'My Tickets' : 'All Tickets'}
                    </Link>

                    {user?.role === 'student' && (
                        <Link to="/dashboard/create-ticket" className={linkClass('/dashboard/create-ticket')}>
                            <PlusCircle size={18} /> New Ticket
                        </Link>
                    )}

                    {user?.role === 'admin' && (
                        <Link to="/dashboard/staff" className={linkClass('/dashboard/staff')}>
                            <Users size={18} /> Staff Queue
                        </Link>
                    )}

                    {user?.role === 'staff' && (
                        <Link to="/dashboard/kanban" className={linkClass('/dashboard/kanban')}>
                            <KanbanSquare size={18} /> Kanban Board
                        </Link>
                    )}

                    {user?.role === 'admin' && (
                        <Link to="/dashboard/admin/users" className={linkClass('/dashboard/admin/users')}>
                            <UserIcon size={18} /> User Management
                        </Link>
                    )}

                    {user?.role === 'admin' && (
                        <Link to="/dashboard/admin/approvals" className={linkClass('/dashboard/admin/approvals')}>
                            <ListTodo size={18} /> Approval Queue
                        </Link>
                    )}

                    {user?.role === 'admin' && (
                        <Link to="/dashboard/admin/analytics" className={linkClass('/dashboard/admin/analytics')}>
                            <BarChart3 size={18} /> Analytics
                        </Link>
                    )}

                    {/* Notifications — all roles */}
                    <Link to="/dashboard/notifications" className={linkClass('/dashboard/notifications')}>
                        <div className="relative">
                            <Bell size={18} />
                            {unreadCount > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-red-500 rounded-full text-white text-[8px] flex items-center justify-center font-bold">
                                    {unreadCount > 9 ? '9+' : unreadCount}
                                </span>
                            )}
                        </div>
                        Notifications
                    </Link>

                    {/* Separator */}
                    <div className="pt-3 mt-2 border-t" style={{ borderColor: 'var(--csd-bg-subtle)' }}></div>

                    <Link to="/dashboard/faq" className={linkClass('/dashboard/faq')}>
                        <HelpCircle size={18} /> Support FAQ
                    </Link>
                </nav>

                {/* User Footer */}
                <div className="p-3 border-t" style={{ borderColor: 'var(--csd-bg-subtle)' }}>
                    <div className="flex items-center justify-between mb-3">
                        <Link to="/dashboard/profile" className="flex items-center gap-3 hover:opacity-80 transition min-w-0">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0" style={{ backgroundColor: 'var(--csd-bg-subtle)', color: 'var(--csd-brand-primary)' }}>
                                <UserIcon size={16} />
                            </div>
                            <div className="min-w-0">
                                <p className="font-medium text-sm truncate" style={{ color: 'var(--csd-text-primary)' }}>{user?.name}</p>
                                <p className="text-xs truncate w-32" style={{ color: 'var(--csd-text-muted)' }}>{user?.email}</p>
                            </div>
                        </Link>
                        <button
                            onClick={toggleDarkMode}
                            className="p-1.5 rounded-lg transition hover:bg-[var(--csd-bg-subtle)] shrink-0"
                            style={{ color: 'var(--csd-accent)' }}
                            title={darkMode ? 'Light mode' : 'Dark mode'}
                        >
                            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                        </button>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-red-500 text-sm font-medium hover:text-red-600 w-full"
                    >
                        <LogOut size={16} /> Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-8" style={{ marginLeft: '0' }}>
                <Outlet />
            </main>
        </div>
    );
}
