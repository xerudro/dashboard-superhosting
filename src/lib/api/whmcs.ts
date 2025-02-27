import { config } from '../config';
import { z } from 'zod';

const whmcsResponseSchema = z.object({
  result: z.string(),
  message: z.string().optional(),
});

export class WhmcsAPI {
  private static instance: WhmcsAPI;
  private baseUrl: string;
  private identifier: string;
  private secret: string;

  private constructor() {
    this.baseUrl = config.WHMCS_API_URL;
    this.identifier = config.WHMCS_IDENTIFIER;
    this.secret = config.WHMCS_SECRET;
  }

  public static getInstance(): WhmcsAPI {
    if (!WhmcsAPI.instance) {
      WhmcsAPI.instance = new WhmcsAPI();
    }
    return WhmcsAPI.instance;
  }

  private async makeRequest(action: string, params: Record<string, any> = {}) {
    const requestParams = new URLSearchParams({
      identifier: this.identifier,
      secret: this.secret,
      action,
      responsetype: 'json',
      ...params,
    });

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: requestParams.toString(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return whmcsResponseSchema.parse(data);
    } catch (error) {
      console.error('WHMCS API Error:', error);
      throw error;
    }
  }

  // Client Management
  async getClients() {
    return this.makeRequest('GetClients');
  }

  async getClientDetails(clientId: string) {
    return this.makeRequest('GetClientsDetails', { clientid: clientId });
  }

  async createClient(clientData: {
    firstname: string;
    lastname: string;
    email: string;
    password2: string;
  }) {
    return this.makeRequest('AddClient', clientData);
  }

  // Products & Services
  async getProducts() {
    return this.makeRequest('GetProducts');
  }

  async getClientProducts(clientId: string) {
    return this.makeRequest('GetClientsProducts', { clientid: clientId });
  }

  // Orders
  async createOrder(orderData: {
    clientid: string;
    pid: string;
    domain?: string;
    billingcycle: string;
  }) {
    return this.makeRequest('AddOrder', orderData);
  }

  // Billing
  async getInvoices(clientId: string) {
    return this.makeRequest('GetInvoices', { userid: clientId });
  }

  // Support Tickets
  async getTickets(clientId: string) {
    return this.makeRequest('GetTickets', { clientid: clientId });
  }

  async createTicket(ticketData: {
    clientid: string;
    deptid: string;
    subject: string;
    message: string;
    priority: string;
  }) {
    return this.makeRequest('OpenTicket', ticketData);
  }
}