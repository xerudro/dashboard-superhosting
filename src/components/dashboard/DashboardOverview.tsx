import React from 'react';
import { Server, Database, Globe, Mail, Shield, HardDrive, AlertCircle } from 'lucide-react';

const DashboardOverview = () => {
  const services = [
    {
      icon: <Server className="w-8 h-8 text-orangered" />,
      name: 'Stellar Standard',
      type: 'Hosting',
      status: 'active',
      usage: {
        disk: 45,
        bandwidth: 30,
      },
    },
    {
      icon: <Database className="w-8 h-8 text-blue-500" />,
      name: 'MySQL Database',
      type: 'Database',
      status: 'active',
      usage: {
        disk: 60,
      },
    },
    {
      icon: <Globe className="w-8 h-8 text-green-500" />,
      name: 'example.com',
      type: 'Domain',
      status: 'active',
      expiresIn: '11 months',
    },
  ];

  const alerts = [
    {
      type: 'warning',
      message: 'SSL Certificate expires in 30 days',
      service: 'example.com',
    },
    {
      type: 'info',
      message: 'Backup completed successfully',
      service: 'Hosting',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gray-900 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400">Active Services</p>
              <h3 className="text-3xl font-bold text-white mt-2">8</h3>
            </div>
            <Server className="w-12 h-12 text-orangered" />
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400">Domains</p>
              <h3 className="text-3xl font-bold text-white mt-2">3</h3>
            </div>
            <Globe className="w-12 h-12 text-blue-500" />
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400">SSL Certificates</p>
              <h3 className="text-3xl font-bold text-white mt-2">2</h3>
            </div>
            <Shield className="w-12 h-12 text-green-500" />
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400">Email Accounts</p>
              <h3 className="text-3xl font-bold text-white mt-2">5</h3>
            </div>
            <Mail className="w-12 h-12 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Active Services */}
      <div className="bg-gray-900 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-white mb-6">Active Services</h2>
        <div className="space-y-4">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-gray-800 rounded-lg p-4 flex items-center justify-between"
            >
              <div className="flex items-center space-x-4">
                {service.icon}
                <div>
                  <h3 className="text-white font-medium">{service.name}</h3>
                  <p className="text-gray-400 text-sm">{service.type}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                {service.usage && (
                  <div className="flex items-center space-x-4">
                    {service.usage.disk && (
                      <div className="text-sm">
                        <p className="text-gray-400">Disk Usage</p>
                        <div className="w-32 h-2 bg-gray-700 rounded-full mt-1">
                          <div
                            className="h-full bg-orangered rounded-full"
                            style={{ width: `${service.usage.disk}%` }}
                          />
                        </div>
                      </div>
                    )}
                    {service.usage.bandwidth && (
                      <div className="text-sm">
                        <p className="text-gray-400">Bandwidth</p>
                        <div className="w-32 h-2 bg-gray-700 rounded-full mt-1">
                          <div
                            className="h-full bg-blue-500 rounded-full"
                            style={{ width: `${service.usage.bandwidth}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
                {service.expiresIn && (
                  <div className="text-sm text-gray-400">
                    Expires in {service.expiresIn}
                  </div>
                )}
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-500">
                  Active
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Alerts */}
      <div className="bg-gray-900 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-white mb-6">Recent Alerts</h2>
        <div className="space-y-4">
          {alerts.map((alert, index) => (
            <div
              key={index}
              className="bg-gray-800 rounded-lg p-4 flex items-center space-x-4"
            >
              <AlertCircle className={`w-6 h-6 ${
                alert.type === 'warning' ? 'text-yellow-500' : 'text-blue-500'
              }`} />
              <div>
                <p className="text-white">{alert.message}</p>
                <p className="text-gray-400 text-sm">{alert.service}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview