import { useState, useEffect } from 'react';
import { CurrencyService } from '../services/CurrencyService';
import { CurrencyRate, CurrencyRateHistory } from '../db/repositories/CurrencyRepository';
import { useAuth } from '../auth';
import { toast } from 'react-hot-toast';

export const useCurrency = () => {
  const [rates, setRates] = useState<CurrencyRate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const currencyService = CurrencyService.getInstance();

  const fetchRates = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const fetchedRates = await currencyService.getAllRates();
      if (fetchedRates && Array.isArray(fetchedRates)) {
        setRates(fetchedRates);
      } else {
        throw new Error('Invalid rates data received');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch rates';
      setError(errorMessage);
      console.error('Error fetching rates:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateRate = async (fromCurrency: string, toCurrency: string, rate: number) => {
    if (!user) {
      const errorMessage = 'User must be authenticated to update rates';
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }

    try {
      setIsLoading(true);
      setError(null);
      await currencyService.updateRate(fromCurrency, toCurrency, rate, user.id);
      await fetchRates(); // Refresh rates after update
      toast.success('Rate updated successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update rate';
      setError(errorMessage);
      console.error('Error updating rate:', err);
      toast.error(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getRateHistory = async (fromCurrency: string, toCurrency: string): Promise<CurrencyRateHistory[]> => {
    try {
      const history = await currencyService.getRateHistory(fromCurrency, toCurrency);
      return Array.isArray(history) ? history : [];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch rate history';
      setError(errorMessage);
      console.error('Error fetching rate history:', err);
      return [];
    }
  };

  const convertAmount = async (amount: number, fromCurrency: string, toCurrency: string): Promise<number> => {
    if (isNaN(amount) || amount < 0) {
      throw new Error('Invalid amount');
    }

    try {
      if (fromCurrency === toCurrency) {
        return amount;
      }
      return await currencyService.convertAmount(amount, fromCurrency, toCurrency);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to convert amount';
      setError(errorMessage);
      console.error('Error converting amount:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchRates();
  }, []);

  return {
    rates,
    isLoading,
    error,
    updateRate,
    getRateHistory,
    convertAmount,
    refreshRates: fetchRates
  };
};