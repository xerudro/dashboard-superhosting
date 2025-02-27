import React, { useState } from 'react';
import { Server, Plus, Settings, BarChart2, Power, Trash2, ExternalLink } from 'lucide-react';

const HostingServices = () => {
  const [services] = useState([
    {
      id: '1',
      name: 'Stellar Standard',
      domain: 'example.com',
      status: 'active',
      plan: 'Standard Hosting',
      usage: {
        disk: 45,
        bandwidth: 30,
        cpu: 25,
        memory: 40
      }
    },
    {
      id: '2',
      name: 'Nebula Boost',
      domain: 'mysite.com',
      status: 'active',
      plan: 'Premium Hosting',
      usage: {
        disk: 60,
        bandwidth: 45,
        cpu: 35,
        memory: 55
      }
    }
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Hosting Services</h1>
        <button className="flex items-center space-x-2 bg-orangered hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors">
          <Plus className="w-5 h-5" />
          <span>New Service</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {services.map((service) => (
          <div key={service.id} className="bg-gray-900 rounded-xl p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="bg-gray-800 rounded-full p-3">
                  <Server className="w-8 h-8 text-orangered" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">{service.name}</h3>
                  <p className="text-gray-400">{service.domain}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                service.status === 'active' 
                  ? 'bg-green-500/10 text-green-500' 
                  : 'bg-yellow-500/10 text-yellow-500'
              }`}>
                {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
              </span>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-800 rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-2">Disk Usage</p>
                <div className="flex items-center justify-between">
                  <span className="text-white font-semibold">{service.usage.disk}%</span>
                  <div className="w-32 h-2 bg-gray-700 rounded-full">
                    <div
                      className="h-full bg-orangered rounded-full"
                      style={{ width: `${service.usage.disk}%` }}
                    />
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-2">Bandwidth</p>
                <div className="flex items-center justify-between">
                  <span className="text-white font-semibold">{service.usage.bandwidth}%</span>
                  <div className="w-32 h-2 bg-gray-700 rounded-full">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${service.usage.bandwidth}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-2">CPU Usage</p>
                <div className="flex items-center justify-between">
                  <span className="text-white font-semibold">{service.usage.cpu}%</span>
                  <div className="w-32 h-2 bg-gray-700 rounded-full">
                    <div
                      className="h-full bg-green-500 rounded-full"
                      style={{ width: `${service.usage.cpu}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-2">Memory Usage</p>
                <div className="flex items-center justify-between">
                  <span className="text-white font-semibold">{service.usage.memory}%</span>
                  <div className="w-32 h-2 bg-gray-700 rounded-full">
                    <div
                      className="h-full bg-purple-500 rounded-full"
                      style={{ width: `${service.usage.memory}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                <Settings className="w-4 h-4" />
                <span>Manage</span>
              </button>
              <button className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors">
                <BarChart2 className="w-4 h-4" />
                <span>Statistics</span>
              </button>
              <button className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors">
                <Power className="w-4 h-4" />
                <span>Restart</span>
              </button>
              <button className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors">
                <ExternalLink className="w-4 h-4" />
                <span>Access</span>
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

export default HostingServices