import { Database } from '../index';
import { z } from 'zod';

// Validation schemas
export const currencyRateSchema = z.object({
  id: z.string().uuid(),
  from_currency: z.string(),
  to_currency: z.string(),
  rate: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
  created_by: z.string().uuid().nullable(),
  updated_by: z.string().uuid().nullable()
});

export const currencyRateHistorySchema = z.object({
  id: z.string().uuid(),
  rate_id: z.string().uuid(),
  old_rate: z.number(),
  new_rate: z.number(),
  changed_at: z.string(),
  changed_by: z.string().uuid().nullable()
});

export type CurrencyRate = z.infer<typeof currencyRateSchema>;
export type CurrencyRateHistory = z.infer<typeof currencyRateHistorySchema>;

export class CurrencyRepository {
  private db: Database;

  constructor() {
    this.db = Database.getInstance();
  }

  async findAllRates(): Promise<CurrencyRate[]> {
    return this.db.query<CurrencyRate[]>(
      'SELECT * FROM currency_rates ORDER BY from_currency, to_currency'
    );
  }

  async findRate(fromCurrency: string, toCurrency: string): Promise<CurrencyRate | null> {
    const result = await this.db.query<CurrencyRate[]>(
      'SELECT * FROM currency_rates WHERE from_currency = ? AND to_currency = ?',
      [fromCurrency, toCurrency]
    );
    return result[0] || null;
  }

  async updateRate(fromCurrency: string, toCurrency: string, rate: number, userId: string): Promise<CurrencyRate> {
    return this.db.transaction(async (connection) => {
      const [updatedRate] = await connection.execute<CurrencyRate[]>(
        `UPDATE currency_rates 
         SET rate = ?, updated_by = ?
         WHERE from_currency = ? AND to_currency = ?
         RETURNING *`,
        [rate, userId, fromCurrency, toCurrency]
      );

      return updatedRate[0];
    });
  }

  async getRateHistory(fromCurrency: string, toCurrency: string): Promise<CurrencyRateHistory[]> {
    return this.db.query<CurrencyRateHistory[]>(
      `SELECT h.* 
       FROM currency_rate_history h
       JOIN currency_rates r ON r.id = h.rate_id
       WHERE r.from_currency = ? AND r.to_currency = ?
       ORDER BY h.changed_at DESC`,
      [fromCurrency, toCurrency]
    );
  }

  async createRate(data: {
    fromCurrency: string;
    toCurrency: string;
    rate: number;
    userId: string;
  }): Promise<CurrencyRate> {
    return this.db.transaction(async (connection) => {
      const [newRate] = await connection.execute<CurrencyRate[]>(
        `INSERT INTO currency_rates (
          from_currency, 
          to_currency, 
          rate, 
          created_by,
          updated_by
        ) VALUES (?, ?, ?, ?, ?)
        RETURNING *`,
        [data.fromCurrency, data.toCurrency, data.rate, data.userId, data.userId]
      );

      return newRate[0];
    });
  }
}