import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles, children }) => {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />; // Or forbidden page
    }

    // If children provided, render them directly
    // Otherwise use Outlet for nested routes
    return children || <Outlet />;
};

export default ProtectedRoute;
