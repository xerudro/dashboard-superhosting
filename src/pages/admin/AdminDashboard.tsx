import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useRole } from '../../lib/hooks/useRole';
import { useAuth } from '../../lib/auth';
import {
  Users,
  Shield,
  Settings,
  Database,
  Server,
  Mail,
  Globe,
  DollarSign,
  BarChart2,
  Loader2
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import CurrencyManagement from '../../components/admin/CurrencyManagement';

const AdminDashboard = () => {
  const { isAdmin, isSuperAdmin, isLoading: roleLoading } = useRole();
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: '1,234',
    activeServices: '567',
    sslCertificates: '89',
    domains: '123'
  });

  const [recentActivity] = useState([
    {
      type: 'user_signup',
      message: 'New user registration: john.doe@example.com',
      time: '5 minutes ago'
    },
    {
      type: 'service_created',
      message: 'New hosting service activated for client #12345',
      time: '15 minutes ago'
    },
    {
      type: 'payment_received',
      message: 'Payment received: $199.99 from client #12345',
      time: '1 hour ago'
    }
  ]);

  useEffect(() => {
    // Check if user has admin access
    if (!roleLoading && !user?.raw_user_meta_data?.role) {
      toast.error('Access denied: Admin privileges required');
    }
  }, [roleLoading, user]);

  // Show loading state
  if (roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-orangered mx-auto mb-4" />
          <p className="text-gray-400">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  // Redirect non-admin users
  if (!user || !user.raw_user_meta_data?.role || !['admin', 'superadmin'].includes(user.raw_user_meta_data.role)) {
    toast.error('Access denied');
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">
          {isSuperAdmin() ? 'Super Admin Dashboard' : 'Admin Dashboard'}
        </h1>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gray-900 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400">Total Users</p>
              <h3 className="text-3xl font-bold text-white mt-2">{stats.totalUsers}</h3>
            </div>
            <Users className="w-12 h-12 text-orangered" />
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400">Active Services</p>
              <h3 className="text-3xl font-bold text-white mt-2">{stats.activeServices}</h3>
            </div>
            <Server className="w-12 h-12 text-orangered" />
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400">SSL Certificates</p>
              <h3 className="text-3xl font-bold text-white mt-2">{stats.sslCertificates}</h3>
            </div>
            <Shield className="w-12 h-12 text-orangered" />
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400">Domains</p>
              <h3 className="text-3xl font-bold text-white mt-2">{stats.domains}</h3>
            </div>
            <Globe className="w-12 h-12 text-orangered" />
          </div>
        </div>
      </div>

      {/* Currency Management (Super Admin Only) */}
      {isSuperAdmin() && (
        <CurrencyManagement />
      )}

      {/* Quick Actions */}
      <div className="bg-gray-900 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-white mb-6">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <button className="flex flex-col items-center justify-center p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
            <Users className="h-8 w-8 text-orangered mb-2" />
            <span className="text-sm text-white">Manage Users</span>
          </button>
          <button className="flex flex-col items-center justify-center p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
            <Server className="h-8 w-8 text-orangered mb-2" />
            <span className="text-sm text-white">Services</span>
          </button>
          <button className="flex flex-col items-center justify-center p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
            <Database className="h-8 w-8 text-orangered mb-2" />
            <span className="text-sm text-white">Databases</span>
          </button>
          <button className="flex flex-col items-center justify-center p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
            <Mail className="h-8 w-8 text-orangered mb-2" />
            <span className="text-sm text-white">Email</span>
          </button>
          <button className="flex flex-col items-center justify-center p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
            <DollarSign className="h-8 w-8 text-orangered mb-2" />
            <span className="text-sm text-white">Billing</span>
          </button>
          <button className="flex flex-col items-center justify-center p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
            <Settings className="h-8 w-8 text-orangered mb-2" />
            <span className="text-sm text-white">Settings</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-gray-900 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="bg-gray-800 rounded-lg p-4">
                <p className="text-white">{activity.message}</p>
                <p className="text-sm text-gray-400 mt-1">{activity.time}</p>
              </div>
            ))}
          </div>
        </div>

        {/* System Status */}
        <div className="bg-gray-900 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-6">System Status</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-gray-800 rounded-lg p-4">
              <div className="flex items-center">
                <Server className="h-5 w-5 text-green-500 mr-3" />
                <span className="text-white">Hosting Services</span>
              </div>
              <span className="text-green-500">Operational</span>
            </div>
            <div className="flex items-center justify-between bg-gray-800 rounded-lg p-4">
              <div className="flex items-center">
                <Database className="h-5 w-5 text-green-500 mr-3" />
                <span className="text-white">Database Services</span>
              </div>
              <span className="text-green-500">Operational</span>
            </div>
            <div className="flex items-center justify-between bg-gray-800 rounded-lg p-4">
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-green-500 mr-3" />
                <span className="text-white">Email Services</span>
              </div>
              <span className="text-green-500">Operational</span>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Preview */}
      <div className="bg-gray-900 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Analytics Overview</h2>
          <button className="text-orangered hover:text-red-600 transition-colors">
            View Full Report
          </button>
        </div>
        <div className="flex items-center justify-center h-64 bg-gray-800 rounded-lg">
          <BarChart2 className="h-12 w-12 text-gray-600" />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;