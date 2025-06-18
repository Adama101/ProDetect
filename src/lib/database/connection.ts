import { Pool, PoolClient } from 'pg';

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'prodetect',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
};

// Create connection pool
const pool = new Pool(dbConfig);

// Handle pool errors
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// Database connection wrapper
export class Database {
  private static instance: Database;
  private pool: Pool;

  private constructor() {
    this.pool = pool;
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  // Execute a query with parameters
  async query<T = any>(text: string, params?: any[]): Promise<T[]> {
    const client = await this.pool.connect();
    try {
      const result = await client.query(text, params);
      return result.rows;
    } finally {
      client.release();
    }
  }

  // Execute a query and return a single row
  async queryOne<T = any>(text: string, params?: any[]): Promise<T | null> {
    const rows = await this.query<T>(text, params);
    return rows.length > 0 ? rows[0] : null;
  }

  // Execute multiple queries in a transaction
  async transaction<T>(callback: (client: PoolClient) => Promise<T>): Promise<T> {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // Get a client for manual transaction management
  async getClient(): Promise<PoolClient> {
    return this.pool.connect();
  }

  // Close all connections
  async close(): Promise<void> {
    await this.pool.end();
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      await this.query('SELECT 1');
      return true;
    } catch (error) {
      console.error('Database health check failed:', error);
      return false;
    }
  }
}

// Export singleton instance
export const db = Database.getInstance();

// Utility function for setting user context (for audit logging)
export async function setUserContext(client: PoolClient, userId: string): Promise<void> {
  await client.query('SELECT set_config($1, $2, true)', ['app.current_user_id', userId]);
}

// Utility function for pagination
export interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export function buildPaginationQuery(
  baseQuery: string,
  options: PaginationOptions = {}
): { query: string; countQuery: string; offset: number; limit: number } {
  const page = Math.max(1, options.page || 1);
  const limit = Math.min(100, Math.max(1, options.limit || 20));
  const offset = (page - 1) * limit;
  
  let query = baseQuery;
  
  if (options.sortBy) {
    const sortOrder = options.sortOrder || 'DESC';
    query += ` ORDER BY ${options.sortBy} ${sortOrder}`;
  }
  
  query += ` LIMIT ${limit} OFFSET ${offset}`;
  
  // Create count query by removing ORDER BY and LIMIT clauses
  const countQuery = baseQuery.replace(/ORDER BY.*$/i, '').replace(/LIMIT.*$/i, '');
  
  return { query, countQuery: `SELECT COUNT(*) FROM (${countQuery}) as count_query`, offset, limit };
}