import { config } from '../config';

export class EnhanceAPI {
  private static instance: EnhanceAPI;
  private baseUrl: string;
  private orgId: string;
  private accessToken: string;

  private constructor() {
    this.baseUrl = config.ENHANCE_API_URL;
    this.orgId = config.ENHANCE_ORG_ID;
    this.accessToken = config.ENHANCE_ACCESS_TOKEN;
  }

  public static getInstance(): EnhanceAPI {
    if (!EnhanceAPI.instance) {
      EnhanceAPI.instance = new EnhanceAPI();
    }
    return EnhanceAPI.instance;
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}/${this.orgId}/${endpoint}`;
    
    const headers = {
      'Authorization': `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json',
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Enhance API Error:', error);
      throw error;
    }
  }

  // Websites Management
  async getWebsites() {
    return this.makeRequest('websites');
  }

  async createWebsite(data: {
    domain: string;
    plan: string;
    // Add other required fields
  }) {
    return this.makeRequest('websites', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // DNS Management
  async getDnsRecords(domain: string) {
    return this.makeRequest(`dns/${domain}/records`);
  }

  // SSL Certificates
  async requestSSL(domain: string) {
    return this.makeRequest(`letsencrypt/${domain}`, {
      method: 'POST',
    });
  }

  // Database Management
  async getDatabases() {
    return this.makeRequest('mysql/databases');
  }

  async createDatabase(data: {
    name: string;
    user: string;
    password: string;
  }) {
    return this.makeRequest('mysql/databases', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Backups
  async getBackups(websiteId: string) {
    return this.makeRequest(`backups/${websiteId}`);
  }

  // Reports
  async getReports() {
    return this.makeRequest('reports');
  }

  // Metrics
  async getMetrics(websiteId: string) {
    return this.makeRequest(`metrics/${websiteId}`);
  }
}