import React, { useState } from 'react';
import { RefreshCw, Save, AlertTriangle, Plus, X } from 'lucide-react';
import { useCurrency } from '../../lib/hooks/useCurrency';
import { useRole } from '../../lib/hooks/useRole';
import type { CurrencyRateHistory } from '../../lib/db/repositories/CurrencyRepository';
import { toast } from 'react-hot-toast';

const CurrencyManagement = () => {
  const { rates, isLoading, error, updateRate, getRateHistory, refreshRates } = useCurrency();
  const { isSuperAdmin } = useRole();
  const [editingRate, setEditingRate] = useState<string | null>(null);
  const [newRate, setNewRate] = useState<string>('');
  const [rateHistory, setRateHistory] = useState<CurrencyRateHistory[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCurrency, setNewCurrency] = useState({
    fromCurrency: '',
    toCurrency: '',
    rate: ''
  });

  const handleUpdateRate = async (fromCurrency: string, toCurrency: string) => {
    if (!isSuperAdmin()) {
      toast.error('Only super admins can update currency rates');
      return;
    }

    try {
      const rate = parseFloat(newRate);
      if (isNaN(rate) || rate <= 0) {
        toast.error('Please enter a valid rate greater than 0');
        return;
      }

      await updateRate(fromCurrency, toCurrency, rate);
      setEditingRate(null);
      setNewRate('');
      
      // Fetch updated history
      const history = await getRateHistory(fromCurrency, toCurrency);
      setRateHistory(history);
    } catch (error) {
      console.error('Failed to update rate:', error);
    }
  };

  const handleAddNewRate = async () => {
    if (!isSuperAdmin()) {
      toast.error('Only super admins can add currency rates');
      return;
    }

    try {
      const rate = parseFloat(newCurrency.rate);
      if (isNaN(rate) || rate <= 0) {
        toast.error('Please enter a valid rate greater than 0');
        return;
      }

      await updateRate(newCurrency.fromCurrency, newCurrency.toCurrency, rate);
      setShowAddModal(false);
      setNewCurrency({ fromCurrency: '', toCurrency: '', rate: '' });
      toast.success('New currency rate added successfully');
    } catch (error) {
      console.error('Failed to add new rate:', error);
      toast.error('Failed to add new currency rate');
    }
  };

  const handleViewHistory = async (fromCurrency: string, toCurrency: string) => {
    try {
      const history = await getRateHistory(fromCurrency, toCurrency);
      setRateHistory(history);
    } catch (error) {
      console.error('Failed to fetch rate history:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Currency Management</h2>
        <div className="flex items-center space-x-4">
          <button
            onClick={refreshRates}
            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
            disabled={isLoading}
          >
            <RefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh Rates</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 bg-orangered hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>Add Rate</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 text-red-500 p-4 rounded-xl">
          {error}
        </div>
      )}

      {/* Currency Rate Overview */}
      <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">Exchange Rates</h3>
          <div className="flex items-center space-x-2 text-gray-400">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            <span className="text-sm">Rates should be updated regularly</span>
          </div>
        </div>

        <div className="space-y-4">
          {rates.map((rate) => (
            <div
              key={`${rate.from_currency}-${rate.to_currency}`}
              className="bg-gray-800 rounded-lg p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-semibold text-white">
                      {rate.from_currency} → {rate.to_currency}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mt-1">
                    Last updated: {new Date(rate.updated_at).toLocaleString()}
                  </p>
                </div>

                <div className="flex items-center space-x-4">
                  {editingRate === `${rate.from_currency}-${rate.to_currency}` ? (
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        value={newRate}
                        onChange={(e) => setNewRate(e.target.value)}
                        className="w-24 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white"
                        step="0.0001"
                        min="0"
                      />
                      <button
                        onClick={() => handleUpdateRate(rate.from_currency, rate.to_currency)}
                        disabled={isLoading}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded transition-colors disabled:opacity-50"
                      >
                        {isLoading ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          <Save className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className="text-xl font-bold text-white">
                        1 {rate.from_currency} = {rate.rate} {rate.to_currency}
                      </span>
                      <button
                        onClick={() => {
                          setEditingRate(`${rate.from_currency}-${rate.to_currency}`);
                          setNewRate(rate.rate.toString());
                          handleViewHistory(rate.from_currency, rate.to_currency);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
                      >
                        Update
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rate History */}
      <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-6">Rate History</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-gray-800">
                <th className="pb-4 text-gray-400">Currency Pair</th>
                <th className="pb-4 text-gray-400">Old Rate</th>
                <th className="pb-4 text-gray-400">New Rate</th>
                <th className="pb-4 text-gray-400">Changed At</th>
                <th className="pb-4 text-gray-400">Changed By</th>
              </tr>
            </thead>
            <tbody>
              {rateHistory.map((history) => (
                <tr key={history.id} className="border-b border-gray-800">
                  <td className="py-4 text-white">
                    {rates.find(r => r.id === history.rate_id)?.from_currency} → 
                    {rates.find(r => r.id === history.rate_id)?.to_currency}
                  </td>
                  <td className="py-4 text-white">{history.old_rate}</td>
                  <td className="py-4 text-white">{history.new_rate}</td>
                  <td className="py-4 text-gray-400">
                    {new Date(history.changed_at).toLocaleString()}
                  </td>
                  <td className="py-4 text-gray-400">Super Admin</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add New Rate Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl p-8 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-white">Add New Rate</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  From Currency
                </label>
                <input
                  type="text"
                  value={newCurrency.fromCurrency}
                  onChange={(e) => setNewCurrency(prev => ({ ...prev, fromCurrency: e.target.value.toUpperCase() }))}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orangered"
                  placeholder="EUR"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  To Currency
                </label>
                <input
                  type="text"
                  value={newCurrency.toCurrency}
                  onChange={(e) => setNewCurrency(prev => ({ ...prev, toCurrency: e.target.value.toUpperCase() }))}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orangered"
                  placeholder="USD"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Rate
                </label>
                <input
                  type="number"
                  value={newCurrency.rate}
                  onChange={(e) => setNewCurrency(prev => ({ ...prev, rate: e.target.value }))}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orangered"
                  placeholder="1.0000"
                  step="0.0001"
                  min="0"
                />
              </div>

              <button
                onClick={handleAddNewRate}
                disabled={isLoading || !newCurrency.fromCurrency || !newCurrency.toCurrency || !newCurrency.rate}
                className="w-full bg-orangered hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center"
              >
                {isLoading ? (
                  <RefreshCw className="h-5 w-5 animate-spin" />
                ) : (
                  'Add Rate'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CurrencyManagement;