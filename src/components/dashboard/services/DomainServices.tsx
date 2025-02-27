import React, { useState } from 'react';
import { Globe, Plus, Settings, RefreshCw, Lock, Trash2, ExternalLink } from 'lucide-react';

const DomainServices = () => {
  const [domains] = useState([
    {
      id: '1',
      name: 'example.com',
      registrar: 'Enhance Panel',
      status: 'active',
      expiryDate: '2025-02-25',
      ssl: true,
      nameservers: ['ns1.enhance.com', 'ns2.enhance.com'],
      dns: {
        records: 12,
        lastUpdated: '2024-02-25'
      }
    },
    {
      id: '2',
      name: 'mysite.com',
      registrar: 'Enhance Panel',
      status: 'active',
      expiryDate: '2025-03-15',
      ssl: true,
      nameservers: ['ns1.enhance.com', 'ns2.enhance.com'],
      dns: {
        records: 8,
        lastUpdated: '2024-02-20'
      }
    }
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Domain Services</h1>
        <button className="flex items-center space-x-2 bg-orangered hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors">
          <Plus className="w-5 h-5" />
          <span>Add Domain</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {domains.map((domain) => (
          <div key={domain.id} className="bg-gray-900 rounded-xl p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="bg-gray-800 rounded-full p-3">
                  <Globe className="w-8 h-8 text-green-500" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">{domain.name}</h3>
                  <p className="text-gray-400">{domain.registrar}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                domain.status === 'active' 
                  ? 'bg-green-500/10 text-green-500' 
                  : 'bg-yellow-500/10 text-yellow-500'
              }`}>
                {domain.status.charAt(0).toUpperCase() + domain.status.slice(1)}
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-800 rounded-lg p-4">
                <p className="text-gray-400 text-sm">Expiry Date</p>
                <p className="text-white font-semibold mt-1">{domain.expiryDate}</p>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-4">
                <p className="text-gray-400 text-sm">SSL Status</p>
                <p className="text-white font-semibold mt-1 flex items-center">
                  {domain.ssl ? (
                    <>
                      <Lock className="w-4 h-4 text-green-500 mr-2" />
                      <span>Secure</span>
                    </>
                  ) : (
                    'Not Secured'
                  )}
                </p>
              </div>

              <div className="bg-gray-800 rounded-lg p-4">
                <p className="text-gray-400 text-sm">DNS Records</p>
                <p className="text-white font-semibold mt-1">
                  {domain.dns.records} records • Updated {domain.dns.lastUpdated}
                </p>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-4 mb-6">
              <p className="text-gray-400 text-sm mb-2">Nameservers</p>
              <div className="grid grid-cols-2 gap-2">
                {domain.nameservers.map((ns, index) => (
                  <div key={index} className="bg-gray-900 rounded px-3 py-2 text-white">
                    {ns}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                <Settings className="w-4 h-4" />
                <span>Manage DNS</span>
              </button>
              <button className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors">
                <Lock className="w-4 h-4" />
                <span>SSL Settings</span>
              </button>
              <button className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors">
                <RefreshCw className="w-4 h-4" />
                <span>Renew Domain</span>
              </button>
              <button className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors">
                <ExternalLink className="w-4 h-4" />
                <span>Visit Site</span>
              </button>
              <button className="flex items-center space-x-2 bg-red-600/10 hover:bg-red-600/20 text-red-500 px-4 py-2 rounded-lg transition-colors ml-auto">
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DomainServices