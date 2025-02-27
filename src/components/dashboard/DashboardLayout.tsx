import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Server,
  Database,
  Globe,
  Mail,
  Shield,
  HardDrive,
  Settings,
  LifeBuoy,
  CreditCard,
  DollarSign
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  
  const menuItems = [
    { icon: <LayoutDashboard className="w-5 h-5" />, label: 'Overview', path: '/dashboard' },
    { icon: <Server className="w-5 h-5" />, label: 'Hosting', path: '/dashboard/hosting' },
    { icon: <Database className="w-5 h-5" />, label: 'Databases', path: '/dashboard/databases' },
    { icon: <Globe className="w-5 h-5" />, label: 'Domains', path: '/dashboard/domains' },
    { icon: <Mail className="w-5 h-5" />, label: 'Email', path: '/dashboard/email' },
    { icon: <Shield className="w-5 h-5" />, label: 'SSL', path: '/dashboard/ssl' },
    { icon: <DollarSign className="w-5 h-5" />, label: 'Currency', path: '/dashboard/currency' },
    { icon: <HardDrive className="w-5 h-5" />, label: 'Backups', path: '/dashboard/backups' },
    { icon: <CreditCard className="w-5 h-5" />, label: 'Billing', path: '/dashboard/billing' },
    { icon: <LifeBuoy className="w-5 h-5" />, label: 'Support', path: '/dashboard/support' },
    { icon: <Settings className="w-5 h-5" />, label: 'Settings', path: '/dashboard/settings' },
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Sidebar */}
      <div className="fixed top-16 left-0 w-64 h-full bg-gray-900 border-r border-gray-800">
        <nav className="mt-8 px-4">
          <ul className="space-y-2">
            {menuItems.map((item, index) => (
              <li key={index}>
                <button
                  onClick={() => navigate(item.path)}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="ml-64 pt-16">
        <div className="p-8">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;