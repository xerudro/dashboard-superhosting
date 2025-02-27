import { Database } from '../index';
import { Plan, Client, Service, Quota, SSLCertificate, EmailConfig, Database as DBType, WordPressInstallation, Backup } from '../models';

export class Repository<T> {
  protected db: Database;
  protected tableName: string;

  constructor(tableName: string) {
    this.db = Database.getInstance();
    this.tableName = tableName;
  }

  async findById(id: string): Promise<T | null> {
    const result = await this.db.query<T[]>(
      `SELECT * FROM ${this.tableName} WHERE id = ?`,
      [id]
    );
    return result[0] || null;
  }

  async findAll(): Promise<T[]> {
    return this.db.query<T[]>(`SELECT * FROM ${this.tableName}`);
  }

  async create(data: Partial<T>): Promise<T> {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = keys.map(() => '?').join(', ');
    
    const result = await this.db.query<T>(
      `INSERT INTO ${this.tableName} (${keys.join(', ')}) VALUES (${placeholders}) RETURNING *`,
      values
    );
    
    return result[0];
  }

  async update(id: string, data: Partial<T>): Promise<T | null> {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const setClause = keys.map((key) => `${key} = ?`).join(', ');
    
    const result = await this.db.query<T>(
      `UPDATE ${this.tableName} SET ${setClause} WHERE id = ? RETURNING *`,
      [...values, id]
    );
    
    return result[0] || null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.db.query<{ affectedRows: number }>(
      `DELETE FROM ${this.tableName} WHERE id = ?`,
      [id]
    );
    return result.affectedRows > 0;
  }
}

export class PlanRepository extends Repository<Plan> {
  constructor() {
    super('plans');
  }

  async findByType(type: string): Promise<Plan[]> {
    return this.db.query<Plan[]>(
      'SELECT * FROM plans WHERE type = ?',
      [type]
    );
  }
}

export class ClientRepository extends Repository<Client> {
  constructor() {
    super('clients');
  }

  async findByEmail(email: string): Promise<Client | null> {
    const result = await this.db.query<Client[]>(
      'SELECT * FROM clients WHERE email = ?',
      [email]
    );
    return result[0] || null;
  }
}

export class ServiceRepository extends Repository<Service> {
  constructor() {
    super('services');
  }

  async findByClientId(clientId: string): Promise<Service[]> {
    return this.db.query<Service[]>(
      'SELECT * FROM services WHERE client_id = ?',
      [clientId]
    );
  }

  async findActiveServices(): Promise<Service[]> {
    return this.db.query<Service[]>(
      "SELECT * FROM services WHERE status = 'active'"
    );
  }
}

export class QuotaRepository extends Repository<Quota> {
  constructor() {
    super('quotas');
  }

  async findByServiceId(serviceId: string): Promise<Quota[]> {
    return this.db.query<Quota[]>(
      'SELECT * FROM quotas WHERE service_id = ?',
      [serviceId]
    );
  }
}

export class SSLCertificateRepository extends Repository<SSLCertificate> {
  constructor() {
    super('ssl_certificates');
  }

  async findByDomain(domain: string): Promise<SSLCertificate | null> {
    const result = await this.db.query<SSLCertificate[]>(
      'SELECT * FROM ssl_certificates WHERE domain = ?',
      [domain]
    );
    return result[0] || null;
  }
}

export class EmailConfigRepository extends Repository<EmailConfig> {
  constructor() {
    super('email_configs');
  }

  async findByEmail(email: string): Promise<EmailConfig | null> {
    const result = await this.db.query<EmailConfig[]>(
      'SELECT * FROM email_configs WHERE email = ?',
      [email]
    );
    return result[0] || null;
  }
}

export class DatabaseRepository extends Repository<DBType> {
  constructor() {
    super('databases');
  }

  async findByName(name: string): Promise<DBType | null> {
    const result = await this.db.query<DBType[]>(
      'SELECT * FROM databases WHERE name = ?',
      [name]
    );
    return result[0] || null;
  }
}

export class WordPressRepository extends Repository<WordPressInstallation> {
  constructor() {
    super('wordpress_installations');
  }

  async findByDomain(domain: string): Promise<WordPressInstallation | null> {
    const result = await this.db.query<WordPressInstallation[]>(
      'SELECT * FROM wordpress_installations WHERE domain = ?',
      [domain]
    );
    return result[0] || null;
  }
}

export class BackupRepository extends Repository<Backup> {
  constructor() {
    super('backups');
  }

  async findByServiceId(serviceId: string): Promise<Backup[]> {
    return this.db.query<Backup[]>(
      'SELECT * FROM backups WHERE service_id = ?',
      [serviceId]
    );
  }

  async findPendingBackups(): Promise<Backup[]> {
    return this.db.query<Backup[]>(
      "SELECT * FROM backups WHERE status = 'pending'"
    );
  }
}