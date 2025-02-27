import React, { useState, useEffect } from 'react';
import { RefreshCw, ArrowRight } from 'lucide-react';
import { useCurrency } from '../lib/hooks/useCurrency';
import { toast } from 'react-hot-toast';

const currencies = [
  { code: 'USD', symbol: '$' },
  { code: 'EUR', symbol: '€' },
  { code: 'RON', symbol: 'RON' }
];

const CurrencyConverter: React.FC = () => {
  const [amount, setAmount] = useState<string>('1');
  const [fromCurrency, setFromCurrency] = useState('EUR');
  const [toCurrency, setToCurrency] = useState('USD');
  const { convertAmount, isLoading, error } = useCurrency();
  const [convertedAmount, setConvertedAmount] = useState<string>('0.00');
  const [isConverting, setIsConverting] = useState(false);

  const handleConvert = async () => {
    if (!amount || isNaN(parseFloat(amount))) {
      setConvertedAmount('0.00');
      return;
    }

    try {
      setIsConverting(true);
      if (fromCurrency === toCurrency) {
        setConvertedAmount(parseFloat(amount).toFixed(2));
        return;
      }
      const result = await convertAmount(parseFloat(amount), fromCurrency, toCurrency);
      setConvertedAmount(result.toFixed(2));
    } catch (err) {
      console.error('Conversion failed:', err);
      setConvertedAmount('0.00');
      toast.error(err instanceof Error ? err.message : 'Failed to convert currency');
    } finally {
      setIsConverting(false);
    }
  };

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers and one decimal point
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  useEffect(() => {
    if (amount && !isNaN(parseFloat(amount))) {
      const timeoutId = setTimeout(() => {
        handleConvert();
      }, 500); // Debounce conversion
      return () => clearTimeout(timeoutId);
    }
  }, [amount, fromCurrency, toCurrency]);

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Currency Converter</h3>
      </div>

      {error && (
        <div className="bg-red-500/10 text-red-500 p-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Amount
          </label>
          <input
            type="text"
            value={amount}
            onChange={handleAmountChange}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orangered"
            placeholder="Enter amount"
            disabled={isLoading || isConverting}
          />
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-400 mb-2">
              From
            </label>
            <select
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orangered"
              disabled={isLoading || isConverting}
            >
              {currencies.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.code} ({currency.symbol})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleSwap}
            className="mt-6 p-2 rounded-full hover:bg-gray-800 transition-colors"
            disabled={isLoading || isConverting}
          >
            <ArrowRight className="h-5 w-5 text-orangered" />
          </button>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-400 mb-2">
              To
            </label>
            <select
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orangered"
              disabled={isLoading || isConverting}
            >
              {currencies.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.code} ({currency.symbol})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4 text-center">
          <p className="text-gray-400 text-sm">Converted Amount</p>
          <p className="text-2xl font-bold text-white mt-1">
            {currencies.find(c => c.code === toCurrency)?.symbol}
            {isConverting ? (
              <RefreshCw className="inline-block h-6 w-6 animate-spin ml-2" />
            ) : (
              convertedAmount
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CurrencyConverter;