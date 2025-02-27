import React, { useState } from 'react';
import { Mail, Plus, Settings, HardDrive, RefreshCw, Trash2, AlertCircle, Search } from 'lucide-react';

const EmailServices = () => {
  const [emailAccounts] = useState([
    {
      id: '1',
      email: 'admin@example.com',
      domain: 'example.com',
      status: 'active',
      quota: {
        used: 450,
        total: 1000,
      },
      lastLogin: '2024-02-25 14:30',
      spam: {
        blocked: 25,
        quarantined: 3
      }
    },
    {
      id: '2',
      email: 'info@example.com',
      domain: 'example.com',
      status: 'active',
      quota: {
        used: 750,
        total: 1000,
      },
      lastLogin: '2024-02-25 12:15',
      spam: {
        blocked: 15,
        quarantined: 1
      }
    }
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Email Management</h1>
        <button className="flex items-center space-x-2 bg-orangered hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors">
          <Plus className="w-5 h-5" />
          <span>New Email Account</span>
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-gray-900 rounded-xl p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search email accounts..."
            className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orangered"
          />
        </div>
      </div>

      {/* Email Accounts */}
      <div className="grid grid-cols-1 gap-6">
        {emailAccounts.map((account) => (
          <div key={account.id} className="bg-gray-900 rounded-xl p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="bg-gray-800 rounded-full p-3">
                  <Mail className="w-8 h-8 text-blue-500" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">{account.email}</h3>
                  <p className="text-gray-400">{account.domain}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                account.status === 'active' 
                  ? 'bg-green-500/10 text-green-500' 
                  : 'bg-yellow-500/10 text-yellow-500'
              }`}>
                {account.status.charAt(0).toUpperCase() + account.status.slice(1)}
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
              {/* Storage Usage */}
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-gray-400 text-sm">Storage Usage</p>
                  <span className="text-sm text-white">
                    {account.quota.used} MB / {account.quota.total} MB
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-700 rounded-full">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${(account.quota.used / account.quota.total) * 100}%` }}
                  />
                </div>
              </div>

              {/* Spam Protection */}
              <div className="bg-gray-800 rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-2">Spam Protection</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white text-sm">
                      {account.spam.blocked} blocked
                    </p>
                    <p className="text-gray-400 text-xs">
                      {account.spam.quarantined} in quarantine
                    </p>
                  </div>
                  <AlertCircle className="h-5 w-5 text-yellow-500" />
                </div>
              </div>

              {/* Last Login */}
              <div className="bg-gray-800 rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-2">Last Login</p>
                <p className="text-white">{account.lastLogin}</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </button>
              <button className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors">
                <HardDrive className="w-4 h-4" />
                <span>Manage Storage</span>
              </button>
              <button className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors">
                <RefreshCw className="w-4 h-4" />
                <span>Reset Password</span>
              </button>
              <button className="flex items-center space-x-2 bg-red-600/10 hover:bg-red-600/20 text-red-500 px-4 py-2 rounded-lg transition-colors ml-auto">
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Email Service Status */}
      <div className="bg-gray-900 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Service Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-800 rounded-lg p-4">
            <p className="text-gray-400 text-sm">IMAP Server</p>
            <div className="flex items-center mt-2">
              <div className="w-2 h-2 rounded-full bg-green-500 mr-2" />
              <p className="text-white">Operational</p>
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <p className="text-gray-400 text-sm">SMTP Server</p>
            <div className="flex items-center mt-2">
              <div className="w-2 h-2 rounded-full bg-green-500 mr-2" />
              <p className="text-white">Operational</p>
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <p className="text-gray-400 text-sm">Spam Filter</p>
            <div className="flex items-center mt-2">
              <div className="w-2 h-2 rounded-full bg-green-500 mr-2" />
              <p className="text-white">Active</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailServices;