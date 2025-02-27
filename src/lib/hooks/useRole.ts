import { useAuth } from '../auth';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Database } from '../db';

export const useRole = () => {
  const { user } = useAuth();
  const [roles, setRoles] = useState<string[]>([]);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRolesAndPermissions = async () => {
      if (!user) {
        setRoles([]);
        setPermissions([]);
        setIsLoading(false);
        return;
      }

      try {
        // Get role from user metadata
        const userRole = user.raw_user_meta_data?.role?.toLowerCase();
        
        if (!userRole) {
          setRoles(['user']);
          setPermissions(['view_reports']);
          setIsLoading(false);
          return;
        }

        // Verify database connection
        const db = Database.getInstance();
        const isHealthy = await db.healthCheck();

        if (!isHealthy) {
          throw new Error('Database connection failed');
        }

        switch (userRole) {
          case 'superadmin':
            setRoles(['superadmin', 'admin', 'user']);
            setPermissions([
              'manage_users',
              'manage_roles',
              'manage_permissions',
              'manage_services',
              'manage_billing',
              'manage_currency',
              'view_admin_dashboard',
              'view_reports'
            ]);
            break;
          case 'admin':
            setRoles(['admin', 'user']);
            setPermissions([
              'manage_users',
              'manage_services',
              'manage_billing',
              'manage_currency',
              'view_admin_dashboard',
              'view_reports'
            ]);
            break;
          default:
            setRoles(['user']);
            setPermissions(['view_reports']);
        }
      } catch (error) {
        console.error('Failed to fetch roles:', error);
        // Set default user role if there's an error
        setRoles(['user']);
        setPermissions(['view_reports']);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRolesAndPermissions();
  }, [user]);

  const hasRole = (role: string): boolean => {
    return roles.includes(role.toLowerCase());
  };

  const hasPermission = (permission: string): boolean => {
    return permissions.includes(permission.toLowerCase());
  };

  const isAdmin = (): boolean => {
    return hasRole('admin') || hasRole('superadmin');
  };

  const isSuperAdmin = (): boolean => {
    return hasRole('superadmin');
  };

  return {
    roles,
    permissions,
    isLoading,
    hasRole,
    hasPermission,
    isAdmin,
    isSuperAdmin
  };
};

export default useRole;