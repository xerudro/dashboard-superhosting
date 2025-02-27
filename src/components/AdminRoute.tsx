import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useRole } from '../lib/hooks/useRole';
import { useAuth, validateUserRole } from '../lib/auth';
import { Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface AdminRouteProps {
  children: React.ReactNode;
  requireSuperAdmin?: boolean;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children, requireSuperAdmin = false }) => {
  const { isAdmin, isSuperAdmin, isLoading } = useRole();
  const { user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // Clear any existing error toasts
    toast.dismiss();

    if (!isLoading) {
      if (!user) {
        toast.error('Please log in to access the admin area');
      } else if (!validateUserRole(user)) {
        toast.error('You do not have permission to access this area');
      }
    }
  }, [isLoading, user]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orangered" />
      </div>
    );
  }

  if (!user || !validateUserRole(user)) {
    return <Navigate to="/dashboard" state={{ from: location }} replace />;
  }

  if (requireSuperAdmin && !isSuperAdmin()) {
    toast.error('This area is restricted to super administrators');
    return <Navigate to="/dashboard" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;

export { AdminRoute }