import { z } from 'zod';

// ArangoDB API configuration
const ARANGO_API_URL = 'http://ec2-13-50-232-194.eu-north-1.compute.amazonaws.com:18529/_db/evaluationResults/_api';
const ARANGO_USERNAME = 'root';
const ARANGO_PASSWORD = '';  // Add password if required

// Error handling
class ArangoError extends Error {
  statusCode: number;
  
  constructor(message: string, statusCode: number) {
    super(message);
    this.name = 'ArangoError';
    this.statusCode = statusCode;
  }
}

// Validation schema for transaction
const ArangoTransactionSchema = z.object({
  _id: z.string(),
  _key: z.string(),
  _rev: z.string(),
  transaction_id: z.string().optional(),
  customer_id: z.string().optional(),
  amount: z.number().optional(),
  currency: z.string().optional(),
  transaction_type: z.string().optional(),
  channel: z.string().optional(),
  counterparty: z.object({
    name: z.string().optional(),
    account: z.string().optional(),
    bank: z.string().optional(),
  }).optional(),
  location: z.object({
    country: z.string().optional(),
    city: z.string().optional(),
    coordinates: z.object({
      lat: z.number().optional(),
      lng: z.number().optional(),
    }).optional(),
  }).optional(),
  device_info: z.record(z.any()).optional(),
  ip_address: z.string().optional(),
  timestamp: z.string().optional(),
  metadata: z.record(z.any()).optional(),
  status: z.string().optional(),
  risk_score: z.number().optional(),
  risk_factors: z.array(z.string()).optional(),
});

// Type definition
export type ArangoTransaction = z.infer<typeof ArangoTransactionSchema>;

/**
 * ArangoDB API Client for fetching data from Tazama's ArangoDB
 */
export class ArangoClient {
  private apiUrl: string;
  private auth: string;
  
  constructor(apiUrl?: string, username?: string, password?: string) {
    this.apiUrl = apiUrl || ARANGO_API_URL;
    
    // Create Basic Auth header
    const authUsername = username || ARANGO_USERNAME;
    const authPassword = password || ARANGO_PASSWORD;
    this.auth = Buffer.from(`${authUsername}:${authPassword}`).toString('base64');
  }
  
  /**
   * Make an authenticated request to the ArangoDB API
   */
  private async request<T>(
    endpoint: string, 
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET', 
    data?: any
  ): Promise<T> {
    const url = `${this.apiUrl}${endpoint}`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Basic ${this.auth}`,
    };
    
    const options: RequestInit = {
      method,
      headers,
      body: data ? JSON.stringify(data) : undefined,
    };
    
    try {
      const response = await fetch(url, options);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ArangoError(
          errorData.errorMessage || `ArangoDB API error: ${response.statusText}`,
          response.status
        );
      }
      
      return await response.json() as T;
    } catch (error) {
      if (error instanceof ArangoError) {
        throw error;
      }
      
      throw new ArangoError(
        error instanceof Error ? error.message : 'Unknown error occurred',
        500
      );
    }
  }
  
  /**
   * Get all transactions from the transactions collection
   */
  async getAllTransactions(): Promise<ArangoTransaction[]> {
    const query = {
      query: "FOR doc IN transactions RETURN doc",
      bindVars: {}
    };
    
    const result = await this.request<{ result: any[] }>('/cursor', 'POST', query);
    
    // Validate and parse the results
    return result.result.map(transaction => {
      try {
        return ArangoTransactionSchema.parse(transaction);
      } catch (error) {
        console.error('Error parsing transaction:', error);
        return null;
      }
    }).filter((t): t is ArangoTransaction => t !== null);
  }
  
  /**
   * Get a transaction by ID
   */
  async getTransactionById(id: string): Promise<ArangoTransaction | null> {
    const query = {
      query: "FOR doc IN transactions FILTER doc._key == @id RETURN doc",
      bindVars: { id }
    };
    
    const result = await this.request<{ result: any[] }>('/cursor', 'POST', query);
    
    if (result.result.length === 0) {
      return null;
    }
    
    try {
      return ArangoTransactionSchema.parse(result.result[0]);
    } catch (error) {
      console.error('Error parsing transaction:', error);
      return null;
    }
  }
  
  /**
   * Get transactions with filtering
   */
  async getTransactions(options: {
    limit?: number;
    offset?: number;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
    filters?: Record<string, any>;
  } = {}): Promise<ArangoTransaction[]> {
    const { limit = 20, offset = 0, sortBy = 'timestamp', sortOrder = 'DESC', filters = {} } = options;
    
    // Build filter conditions
    let filterConditions = '';
    const bindVars: Record<string, any> = {};
    
    Object.entries(filters).forEach(([key, value], index) => {
      if (value !== undefined && value !== null) {
        const paramName = `param${index}`;
        filterConditions += filterConditions ? ` AND doc.${key} == @${paramName}` : `FILTER doc.${key} == @${paramName}`;
        bindVars[paramName] = value;
      }
    });
    
    // Build query
    const query = {
      query: `
        FOR doc IN transactions
        ${filterConditions}
        SORT doc.${sortBy} ${sortOrder}
        LIMIT ${offset}, ${limit}
        RETURN doc
      `,
      bindVars
    };
    
    const result = await this.request<{ result: any[] }>('/cursor', 'POST', query);
    
    // Validate and parse the results
    return result.result.map(transaction => {
      try {
        return ArangoTransactionSchema.parse(transaction);
      } catch (error) {
        console.error('Error parsing transaction:', error);
        return null;
      }
    }).filter((t): t is ArangoTransaction => t !== null);
  }
  
  /**
   * Get health status of the ArangoDB
   */
  async getHealth(): Promise<{ status: string; version: string }> {
    try {
      const result = await this.request<any>('/version', 'GET');
      return {
        status: 'connected',
        version: result.version || 'unknown',
      };
    } catch (error) {
      return {
        status: 'disconnected',
        version: 'unknown',
      };
    }
  }
}

// Export singleton instance
export const arangoClient = new ArangoClient();