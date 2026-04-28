import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TicketProvider } from './context/TicketContext';
import { NotificationProvider } from './context/NotificationContext';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
import LandingPage from './pages/LandingPage';
import Login from './pages/Auth/Login';
import GetInTouch from './pages/Auth/GetInTouch';
import DashboardLayout from './layouts/DashboardLayout';
import StudentDashboard from './pages/Dashboards/StudentDashboard';
import CreateTicketForm from './pages/Tickets/CreateTicket';
import TicketList from './pages/Tickets/TicketList';
import TicketDetails from './pages/Tickets/TicketDetails';
import KanbanBoard from './pages/Tickets/KanbanBoard';
import ProtectedRoute from './components/ProtectedRoute';
import StaffDashboard from './pages/Dashboards/StaffDashboard';
import AdminDashboard from './pages/Dashboards/AdminDashboard';
import AdminUserManagement from './pages/Admin/AdminUserManagement';
import AdminApprovalQueue from './pages/Admin/AdminApprovalQueue';
import AnalyticsPage from './pages/Admin/AnalyticsPage';
import NotificationsPage from './pages/NotificationsPage';
import ProfilePage from './pages/ProfilePage';
import FAQPage from './pages/FAQPage';

function RoleBasedRedirect() {
    const { user } = useAuth();
    if (user?.role === 'admin') return <Navigate to="admin" replace />;
    if (user?.role === 'staff') return <Navigate to="staff" replace />;
    return <Navigate to="student" replace />;
}

function App() {
  return (
    <ThemeProvider>
    <BrowserRouter>
      <AuthProvider>
        <TicketProvider>
          <NotificationProvider>
            <ToastProvider>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/get-in-touch" element={<GetInTouch />} />

                {/* Protected Routes */}
                <Route path="/dashboard" element={<ProtectedRoute />}>
                  <Route element={<DashboardLayout />}>
                    <Route index element={<RoleBasedRedirect />} />

                    {/* Student Routes */}
                    <Route path="student" element={<StudentDashboard />} />
                    <Route path="create-ticket" element={<CreateTicketForm />} />

                    {/* Shared Ticket Routes */}
                    <Route path="tickets" element={<TicketList />} />
                    <Route path="tickets/:id" element={<TicketDetails />} />
                    
                    {/* Kanban Board (Staff only) */}
                    <Route path="kanban" element={
                      <ProtectedRoute allowedRoles={['staff']}>
                        <KanbanBoard />
                      </ProtectedRoute>
                    } />

                    {/* Staff Routes */}
                    <Route path="staff" element={
                      <ProtectedRoute allowedRoles={['staff', 'admin']}>
                        <StaffDashboard />
                      </ProtectedRoute>
                    } />

                    {/* Admin Routes */}
                    <Route path="admin" element={
                      <ProtectedRoute allowedRoles={['admin']}>
                        <AdminDashboard />
                      </ProtectedRoute>
                    } />
                    <Route path="admin/users" element={
                      <ProtectedRoute allowedRoles={['admin']}>
                        <AdminUserManagement />
                      </ProtectedRoute>
                    } />
                    <Route path="admin/approvals" element={
                      <ProtectedRoute allowedRoles={['admin']}>
                        <AdminApprovalQueue />
                      </ProtectedRoute>
                    } />
                    <Route path="admin/analytics" element={
                      <ProtectedRoute allowedRoles={['admin']}>
                        <AnalyticsPage />
                      </ProtectedRoute>
                    } />

                    {/* Notifications (all roles) */}
                    <Route path="notifications" element={<NotificationsPage />} />
                    <Route path="profile" element={<ProfilePage />} />
                    <Route path="faq" element={<FAQPage />} />
                  </Route>
                </Route>

                {/* Catch all */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </ToastProvider>
          </NotificationProvider>
        </TicketProvider>
      </AuthProvider>
    </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
