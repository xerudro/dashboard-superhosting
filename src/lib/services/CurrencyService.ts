import { Database } from '../db';
import { CurrencyRate, CurrencyRateHistory } from '../db/repositories/CurrencyRepository';
import { toast } from 'react-hot-toast';

export class CurrencyService {
  private static instance: CurrencyService;
  private db: Database;
  private retryAttempts: number = 3;
  private retryDelay: number = 1000;

  private constructor() {
    this.db = Database.getInstance();
  }

  public static getInstance(): CurrencyService {
    if (!CurrencyService.instance) {
      CurrencyService.instance = new CurrencyService();
    }
    return CurrencyService.instance;
  }

  private async retryOperation<T>(operation: () => Promise<T>): Promise<T> {
    let lastError: any;
    
    for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        if (attempt < this.retryAttempts) {
          await new Promise(resolve => setTimeout(resolve, this.retryDelay * attempt));
          await this.db.reconnect();
        }
      }
    }
    
    throw lastError;
  }

  async getAllRates(): Promise<CurrencyRate[]> {
    return this.retryOperation(async () => {
      const { data, error } = await this.db.getClient()
        .from('currency_rates')
        .select('*')
        .order('from_currency', { ascending: true });

      if (error) throw error;
      return data || [];
    });
  }

  async updateRate(fromCurrency: string, toCurrency: string, rate: number, userId: string): Promise<CurrencyRate> {
    return this.retryOperation(async () => {
      if (!fromCurrency || !toCurrency || !rate || !userId) {
        throw new Error('Missing required parameters');
      }

      if (rate <= 0) {
        throw new Error('Rate must be greater than 0');
      }

      const { data: existingRate, error: checkError } = await this.db.getClient()
        .from('currency_rates')
        .select('*')
        .eq('from_currency', fromCurrency)
        .eq('to_currency', toCurrency)
        .maybeSingle();

      if (checkError) throw checkError;

      let result;
      if (existingRate) {
        const { data, error } = await this.db.getClient()
          .from('currency_rates')
          .update({
            rate,
            updated_by: userId,
            updated_at: new Date().toISOString()
          })
          .eq('from_currency', fromCurrency)
          .eq('to_currency', toCurrency)
          .select()
          .single();

        if (error) throw error;
        result = data;

        await this.updateInverseRate(fromCurrency, toCurrency, rate, userId);
      } else {
        const { data, error } = await this.db.getClient()
          .from('currency_rates')
          .insert({
            from_currency: fromCurrency,
            to_currency: toCurrency,
            rate,
            created_by: userId,
            updated_by: userId
          })
          .select()
          .single();

        if (error) throw error;
        result = data;

        await this.createInverseRate(fromCurrency, toCurrency, rate, userId);
      }

      return result;
    });
  }

  private async updateInverseRate(fromCurrency: string, toCurrency: string, rate: number, userId: string) {
    try {
      const inverseRate = 1 / rate;
      await this.db.getClient()
        .from('currency_rates')
        .update({
          rate: inverseRate,
          updated_by: userId,
          updated_at: new Date().toISOString()
        })
        .eq('from_currency', toCurrency)
        .eq('to_currency', fromCurrency);
    } catch (error) {
      console.error('Failed to update inverse rate:', error);
    }
  }

  private async createInverseRate(fromCurrency: string, toCurrency: string, rate: number, userId: string) {
    try {
      const inverseRate = 1 / rate;
      await this.db.getClient()
        .from('currency_rates')
        .insert({
          from_currency: toCurrency,
          to_currency: fromCurrency,
          rate: inverseRate,
          created_by: userId,
          updated_by: userId
        });
    } catch (error) {
      console.error('Failed to create inverse rate:', error);
    }
  }

  async getRateHistory(fromCurrency: string, toCurrency: string): Promise<CurrencyRateHistory[]> {
    return this.retryOperation(async () => {
      const { data, error } = await this.db.getClient()
        .from('currency_rate_history')
        .select(`
          *,
          currency_rates!inner(from_currency, to_currency)
        `)
        .eq('currency_rates.from_currency', fromCurrency)
        .eq('currency_rates.to_currency', toCurrency)
        .order('changed_at', { ascending: false });

      if (error) throw error;
      return data || [];
    });
  }

  async convertAmount(amount: number, fromCurrency: string, toCurrency: string): Promise<number> {
    return this.retryOperation(async () => {
      if (!amount || !fromCurrency || !toCurrency) {
        throw new Error('Missing required parameters');
      }

      if (fromCurrency === toCurrency) {
        return amount;
      }

      const { data, error } = await this.db.getClient()
        .from('currency_rates')
        .select('rate')
        .eq('from_currency', fromCurrency.toUpperCase())
        .eq('to_currency', toCurrency.toUpperCase())
        .single();

      if (error) {
        // Try to find inverse rate
        const { data: inverseData, error: inverseError } = await this.db.getClient()
          .from('currency_rates')
          .select('rate')
          .eq('from_currency', toCurrency.toUpperCase())
          .eq('to_currency', fromCurrency.toUpperCase())
          .single();

        if (inverseError) {
          throw new Error(`No conversion rate found for ${fromCurrency} to ${toCurrency}`);
        }

        return Number((amount * (1 / inverseData.rate)).toFixed(2));
      }

      return Number((amount * data.rate).toFixed(2));
    });
  }
}