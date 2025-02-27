import React, { useState } from 'react';
import { Database, Plus, Settings, BarChart2, RefreshCw, Trash2, Terminal } from 'lucide-react';

const DatabaseServices = () => {
  const [databases] = useState([
    {
      id: '1',
      name: 'main_db',
      type: 'MySQL',
      status: 'active',
      host: 'localhost',
      port: 3306,
      usage: {
        storage: 65,
        connections: 40
      }
    },
    {
      id: '2',
      name: 'analytics_db',
      type: 'MySQL',
      status: 'active',
      host: 'localhost',
      port: 3306,
      usage: {
        storage: 45,
        connections: 25
      }
    }
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Database Services</h1>
        <button className="flex items-center space-x-2 bg-orangered hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors">
          <Plus className="w-5 h-5" />
          <span>New Database</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {databases.map((db) => (
          <div key={db.id} className="bg-gray-900 rounded-xl p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="bg-gray-800 rounded-full p-3">
                  <Database className="w-8 h-8 text-blue-500" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">{db.name}</h3>
                  <p className="text-gray-400">{db.type} • {db.host}:{db.port}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                db.status === 'active' 
                  ? 'bg-green-500/10 text-green-500' 
                  : 'bg-yellow-500/10 text-yellow-500'
              }`}>
                {db.status.charAt(0).toUpperCase() + db.status.slice(1)}
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-800 rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-2">Storage Usage</p>
                <div className="flex items-center justify-between">
                  <span className="text-white font-semibold">{db.usage.storage}%</span>
                  <div className="w-32 h-2 bg-gray-700 rounded-full">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${db.usage.storage}%` }}
                    />
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-2">Active Connections</p>
                <div className="flex items-center justify-between">
                  <span className="text-white font-semibold">{db.usage.connections}%</span>
                  <div className="w-32 h-2 bg-gray-700 rounded-full">
                    <div
                      className="h-full bg-green-500 rounded-full"
                      style={{ width: `${db.usage.connections}%` }}
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
                <Terminal className="w-4 h-4" />
                <span>phpMyAdmin</span>
              </button>
              <button className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors">
                <BarChart2 className="w-4 h-4" />
                <span>Statistics</span>
              </button>
              <button className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors">
                <RefreshCw className="w-4 h-4" />
                <span>Optimize</span>
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

export default DatabaseServices