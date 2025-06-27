import axios from 'axios';

// ArangoDB API configuration
const ARANGO_API_URL = process.env.NEXT_PUBLIC_ARANGO_API_URL || 'http://ec2-13-50-232-194.eu-north-1.compute.amazonaws.com:18529/_db/evaluationResults/_api';
const ARANGO_USERNAME = process.env.NEXT_PUBLIC_ARANGO_USERNAME || 'root';
const ARANGO_PASSWORD = process.env.NEXT_PUBLIC_ARANGO_PASSWORD || '';

// Error handling
class ArangoError extends Error {
  statusCode: number;
  
  constructor(message: string, statusCode: number) {
    super(message);
    this.name = 'ArangoError';
    this.statusCode = statusCode;
  }
}

// Type definitions
export interface ArangoTransaction {
  _id?: string;
  _key?: string;
  _rev?: string;
  transaction_id?: string;
  customer_id?: string;
  amount?: number;
  currency?: string;
  transaction_type?: string;
  channel?: string;
  counterparty?: {
    name?: string;
    account?: string;
    bank?: string;
  };
  location?: {
    country?: string;
    city?: string;
    coordinates?: {
      lat?: number;
      lng?: number;
    };
  };
  device_info?: Record<string, any>;
  ip_address?: string;
  timestamp?: string;
  metadata?: Record<string, any>;
  status?: string;
  risk_score?: number;
  risk_factors?: string[];
}

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
    
    try {
      const response = await axios({
        method,
        url,
        data,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Basic ${this.auth}`,
        }
      });
      
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new ArangoError(
          error.response?.data?.errorMessage || `ArangoDB API error: ${error.message}`,
          error.response?.status || 500
        );
      }
      
      throw new ArangoError(
        error instanceof Error ? error.message : 'Unknown error occurred',
        500
      );
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
    try {
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
      
      // Use our API endpoint instead of direct ArangoDB access
      const response = await axios.get('/api/tazama/arango/transactions', {
        params: {
          limit,
          ...(filters.customer_id && { customer_id: filters.customer_id }),
          ...(filters.id && { id: filters.id })
        }
      });
      
      if (response.data.success) {
        return response.data.data || [];
      } else {
        throw new Error(response.data.error || 'Failed to fetch transactions');
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
      return [];
    }
  }
  
  /**
   * Get a transaction by ID
   */
  async getTransactionById(id: string): Promise<ArangoTransaction | null> {
    try {
      const response = await axios.get(`/api/tazama/arango/transactions`, {
        params: { id }
      });
      
      if (response.data.success && response.data.data && response.data.data.length > 0) {
        return response.data.data[0];
      }
      
      return null;
    } catch (error) {
      console.error(`Error fetching transaction ${id}:`, error);
      return null;
    }
  }
  
  /**
   * Get health status of the ArangoDB
   */
  async getHealth(): Promise<{ status: string; version: string }> {
    try {
      const response = await axios.get('/api/tazama/arango/stats');
      
      if (response.data.success) {
        return {
          status: 'connected',
          version: response.data.data.version || 'unknown',
        };
      } else {
        throw new Error(response.data.error || 'Failed to get health status');
      }
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