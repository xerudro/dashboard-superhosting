import React, { useState } from 'react';
import { Shield, Plus, RefreshCw, Download, AlertTriangle, CheckCircle, XCircle, Clock, Upload, X } from 'lucide-react';

const SSLServices = () => {
  const [certificates] = useState([
    {
      id: '1',
      domain: 'example.com',
      provider: 'Let\'s Encrypt',
      status: 'active',
      issueDate: '2024-01-25',
      expiryDate: '2024-04-25',
      autoRenew: true,
      type: 'DV',
      daysUntilExpiry: 30,
    },
    {
      id: '2',
      domain: 'mysite.com',
      provider: 'Let\'s Encrypt',
      status: 'pending',
      issueDate: '2024-02-25',
      expiryDate: '2024-05-25',
      autoRenew: true,
      type: 'DV',
      daysUntilExpiry: 90,
    },
    {
      id: '3',
      domain: 'store.example.com',
      provider: 'Cloudflare',
      status: 'warning',
      issueDate: '2023-11-25',
      expiryDate: '2024-02-28',
      autoRenew: false,
      type: 'DV',
      daysUntilExpiry: 3,
    }
  ]);

  const [showAddCertModal, setShowAddCertModal] = useState(false);
  const [certType, setCertType] = useState<'letsencrypt' | 'manual'>('letsencrypt');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState('');
  const [certFiles, setCertFiles] = useState<{
    certificate: File | null;
    privateKey: File | null;
    chainCertificate: File | null;
  }>({
    certificate: null,
    privateKey: null,
    chainCertificate: null,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/10 text-green-500';
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-500';
      case 'warning':
        return 'bg-orange-500/10 text-orange-500';
      default:
        return 'bg-gray-500/10 text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      default:
        return <XCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const handleFileChange = (type: keyof typeof certFiles) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCertFiles(prev => ({
        ...prev,
        [type]: file
      }));
    }
  };

  const handleGenerateLetsEncrypt = async () => {
    try {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setShowAddCertModal(false);
      // You would typically make an API call to your backend here
      // to initiate the Let's Encrypt certificate generation process
    } catch (error) {
      console.error('Failed to generate certificate:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadCertificate = async () => {
    try {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setShowAddCertModal(false);
      // You would typically make an API call to your backend here
      // to upload and validate the certificate files
    } catch (error) {
      console.error('Failed to upload certificate:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">SSL Certificates</h1>
        <button 
          onClick={() => setShowAddCertModal(true)}
          className="flex items-center space-x-2 bg-orangered hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Add Certificate</span>
        </button>
      </div>

      {/* SSL Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-900 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400">Active Certificates</p>
              <h3 className="text-3xl font-bold text-white mt-2">3</h3>
            </div>
            <Shield className="w-12 h-12 text-green-500" />
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400">Expiring Soon</p>
              <h3 className="text-3xl font-bold text-orange-500 mt-2">1</h3>
            </div>
            <AlertTriangle className="w-12 h-12 text-orange-500" />
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400">Auto-Renewal</p>
              <h3 className="text-3xl font-bold text-blue-500 mt-2">Enabled</h3>
            </div>
            <RefreshCw className="w-12 h-12 text-blue-500" />
          </div>
        </div>
      </div>

      {/* Certificates List */}
      <div className="grid grid-cols-1 gap-6">
        {certificates.map((cert) => (
          <div key={cert.id} className="bg-gray-900 rounded-xl p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="bg-gray-800 rounded-full p-3">
                  {getStatusIcon(cert.status)}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">{cert.domain}</h3>
                  <p className="text-gray-400">{cert.provider} • {cert.type}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(cert.status)}`}>
                {cert.status.charAt(0).toUpperCase() + cert.status.slice(1)}
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-800 rounded-lg p-4">
                <p className="text-gray-400 text-sm">Issue Date</p>
                <p className="text-white font-semibold mt-1">{cert.issueDate}</p>
              </div>

              <div className="bg-gray-800 rounded-lg p-4">
                <p className="text-gray-400 text-sm">Expiry Date</p>
                <p className="text-white font-semibold mt-1">{cert.expiryDate}</p>
              </div>

              <div className="bg-gray-800 rounded-lg p-4">
                <p className="text-gray-400 text-sm">Days Until Expiry</p>
                <p className={`font-semibold mt-1 ${
                  cert.daysUntilExpiry <= 30 
                    ? 'text-orange-500' 
                    : 'text-white'
                }`}>
                  {cert.daysUntilExpiry} days
                </p>
              </div>

              <div className="bg-gray-800 rounded-lg p-4">
                <p className="text-gray-400 text-sm">Auto-Renewal</p>
                <p className="text-white font-semibold mt-1 flex items-center">
                  {cert.autoRenew ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Enabled
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-red-500 mr-2" />
                      Disabled
                    </>
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                <RefreshCw className="w-4 h-4" />
                <span>Renew Now</span>
              </button>
              <button className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors">
                <Download className="w-4 h-4" />
                <span>Download Certificate</span>
              </button>
              <button className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors">
                <Shield className="w-4 h-4" />
                <span>View Details</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Certificate Modal */}
      {showAddCertModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl p-8 max-w-2xl w-full mx-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Add SSL Certificate</h2>
              <button
                onClick={() => setShowAddCertModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Certificate Type Selection */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setCertType('letsencrypt')}
                  className={`p-4 rounded-lg border-2 ${
                    certType === 'letsencrypt'
                      ? 'border-orangered bg-orangered/10'
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <Shield className="h-8 w-8 mx-auto mb-2 text-orangered" />
                  <h3 className="text-white font-medium">Let's Encrypt</h3>
                  <p className="text-sm text-gray-400">Automatic SSL generation</p>
                </button>

                <button
                  onClick={() => setCertType('manual')}
                  className={`p-4 rounded-lg border-2 ${
                    certType === 'manual'
                      ? 'border-orangered bg-orangered/10'
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <Upload className="h-8 w-8 mx-auto mb-2 text-orangered" />
                  <h3 className="text-white font-medium">Upload Certificate</h3>
                  <p className="text-sm text-gray-400">Use your own SSL</p>
                </button>
              </div>

              {/* Let's Encrypt Form */}
              {certType === 'letsencrypt' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Domain Name
                    </label>
                    <input
                      type="text"
                      value={selectedDomain}
                      onChange={(e) => setSelectedDomain(e.target.value)}
                      placeholder="example.com"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orangered"
                    />
                  </div>

                  <button
                    onClick={handleGenerateLetsEncrypt}
                    disabled={isLoading || !selectedDomain}
                    className="w-full bg-orangered hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center"
                  >
                    {isLoading ? (
                      <RefreshCw className="h-5 w-5 animate-spin" />
                    ) : (
                      <>
                        <Shield className="h-5 w-5 mr-2" />
                        Generate Certificate
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Manual Certificate Upload Form */}
              {certType === 'manual' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Domain Name
                    </label>
                    <input
                      type="text"
                      value={selectedDomain}
                      onChange={(e) => setSelectedDomain(e.target.value)}
                      placeholder="example.com"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orangered"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Certificate File
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        onChange={handleFileChange('certificate')}
                        className="hidden"
                        id="certificate"
                      />
                      <label
                        htmlFor="certificate"
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white flex items-center justify-between cursor-pointer hover:bg-gray-700 transition-colors"
                      >
                        <span className="text-gray-400">
                          {certFiles.certificate?.name || 'Choose certificate file'}
                        </span>
                        <Upload className="h-5 w-5" />
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Private Key
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        onChange={handleFileChange('privateKey')}
                        className="hidden"
                        id="privateKey"
                      />
                      <label
                        htmlFor="privateKey"
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white flex items-center justify-between cursor-pointer hover:bg-gray-700 transition-colors"
                      >
                        <span className="text-gray-400">
                          {certFiles.privateKey?.name || 'Choose private key file'}
                        </span>
                        <Upload className="h-5 w-5" />
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Chain Certificate (Optional)
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        onChange={handleFileChange('chainCertificate')}
                        className="hidden"
                        id="chainCertificate"
                      />
                      <label
                        htmlFor="chainCertificate"
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white flex items-center justify-between cursor-pointer hover:bg-gray-700 transition-colors"
                      >
                        <span className="text-gray-400">
                          {certFiles.chainCertificate?.name || 'Choose chain certificate file'}
                        </span>
                        <Upload className="h-5 w-5" />
                      </label>
                    </div>
                  </div>

                  <button
                    onClick={handleUploadCertificate}
                    disabled={isLoading || !selectedDomain || !certFiles.certificate || !certFiles.privateKey}
                    className="w-full bg-orangered hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center"
                  >
                    {isLoading ? (
                      <RefreshCw className="h-5 w-5 animate-spin" />
                    ) : (
                      <>
                        <Upload className="h-5 w-5 mr-2" />
                        Upload Certificate
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SSLServices;