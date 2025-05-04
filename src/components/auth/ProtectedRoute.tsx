import { ReactNode, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { UserRole } from '../../types/auth';
import LoadingSpinner from '../ui/LoadingSpinner';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles: UserRole[];
}

function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading, checkAuth } = useAuthStore();
  const location = useLocation();
  
  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      checkAuth();
    }
  }, [isAuthenticated, isLoading, checkAuth]);
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  if (!isAuthenticated || !user) {
    // Redirect to login and remember where they were trying to go
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  
  if (!allowedRoles.includes(user.role)) {
    // User doesn't have permission for this route
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
}

export default ProtectedRoute;