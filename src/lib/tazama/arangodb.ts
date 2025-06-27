import { Database, aql } from 'arangojs';
import axios from 'axios';

// ArangoDB connection configuration
const ARANGO_URL = process.env.ARANGO_URL || 'http://ec2-13-50-232-194.eu-north-1.compute.amazonaws.com:18529';
const ARANGO_DB = process.env.ARANGO_DB || '_db/evaluationResults';
const ARANGO_USERNAME = process.env.ARANGO_USERNAME || 'root';
const ARANGO_PASSWORD = process.env.ARANGO_PASSWORD || '';

/**
 * ArangoDB client for Tazama integration
 */
export class ArangoDBClient {
  private db: Database;
  private isConnected: boolean = false;
  private baseUrl: string;

  constructor() {
    this.baseUrl = `${ARANGO_URL}/${ARANGO_DB}`;
    
    // Initialize ArangoDB connection
    this.db = new Database({
      url: ARANGO_URL,
      databaseName: ARANGO_DB.replace('_db/', ''),
      auth: {
        username: ARANGO_USERNAME,
        password: ARANGO_PASSWORD
      }
    });
  }

  /**
   * Connect to ArangoDB
   */
  async connect(): Promise<boolean> {
    try {
      if (this.isConnected) return true;
      
      // Test connection
      const info = await this.db.get();
      console.log('Connected to ArangoDB:', info.name);
      
      this.isConnected = true;
      return true;
    } catch (error) {
      console.error('Failed to connect to ArangoDB:', error);
      this.isConnected = false;
      return false;
    }
  }

  /**
   * Get all transactions from the transactions collection
   */
  async getAllTransactions(limit: number = 100): Promise<any[]> {
    try {
      await this.connect();
      
      const transactionsCollection = this.db.collection('transactions');
      const cursor = await this.db.query(aql`
        FOR doc IN ${transactionsCollection}
        LIMIT ${limit}
        RETURN doc
      `);
      
      return await cursor.all();
    } catch (error) {
      console.error('Error fetching transactions from ArangoDB:', error);
      return [];
    }
  }

  /**
   * Get a transaction by ID
   */
  async getTransactionById(id: string): Promise<any | null> {
    try {
      await this.connect();
      
      const transactionsCollection = this.db.collection('transactions');
      const cursor = await this.db.query(aql`
        FOR doc IN ${transactionsCollection}
        FILTER doc._key == ${id}
        RETURN doc
      `);
      
      const results = await cursor.all();
      return results.length > 0 ? results[0] : null;
    } catch (error) {
      console.error(`Error fetching transaction ${id} from ArangoDB:`, error);
      return null;
    }
  }

  /**
   * Get transactions by customer ID
   */
  async getTransactionsByCustomerId(customerId: string, limit: number = 50): Promise<any[]> {
    try {
      await this.connect();
      
      const transactionsCollection = this.db.collection('transactions');
      const cursor = await this.db.query(aql`
        FOR doc IN ${transactionsCollection}
        FILTER doc.customer_id == ${customerId}
        LIMIT ${limit}
        RETURN doc
      `);
      
      return await cursor.all();
    } catch (error) {
      console.error(`Error fetching transactions for customer ${customerId} from ArangoDB:`, error);
      return [];
    }
  }

  /**
   * Get all evaluation results
   */
  async getAllEvaluationResults(limit: number = 100): Promise<any[]> {
    try {
      await this.connect();
      
      const evaluationResultsCollection = this.db.collection('evaluationResults');
      const cursor = await this.db.query(aql`
        FOR doc IN ${evaluationResultsCollection}
        LIMIT ${limit}
        RETURN doc
      `);
      
      return await cursor.all();
    } catch (error) {
      console.error('Error fetching evaluation results from ArangoDB:', error);
      return [];
    }
  }

  /**
   * Get evaluation results for a specific transaction
   */
  async getEvaluationResultsByTransactionId(transactionId: string): Promise<any[]> {
    try {
      await this.connect();
      
      const evaluationResultsCollection = this.db.collection('evaluationResults');
      const cursor = await this.db.query(aql`
        FOR doc IN ${evaluationResultsCollection}
        FILTER doc.transaction_id == ${transactionId}
        RETURN doc
      `);
      
      return await cursor.all();
    } catch (error) {
      console.error(`Error fetching evaluation results for transaction ${transactionId} from ArangoDB:`, error);
      return [];
    }
  }

  /**
   * Alternative method to fetch data using axios if arangojs has issues
   * This is a fallback method that uses the HTTP API directly
   */
  async fetchTransactionsViaHttp(limit: number = 100): Promise<any[]> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/_api/cursor`,
        {
          query: `FOR doc IN transactions LIMIT ${limit} RETURN doc`,
          batchSize: limit
        },
        {
          auth: {
            username: ARANGO_USERNAME,
            password: ARANGO_PASSWORD
          },
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      return response.data.result || [];
    } catch (error) {
      console.error('Error fetching transactions via HTTP API:', error);
      return [];
    }
  }

  /**
   * Get database statistics
   */
  async getDatabaseStats(): Promise<any> {
    try {
      await this.connect();
      
      // Get collections
      const collections = await this.db.collections();
      
      // Get counts for each collection
      const stats: Record<string, number> = {};
      
      for (const collection of collections) {
        const count = await collection.count();
        stats[collection.name] = count;
      }
      
      return {
        collections: collections.length,
        stats
      };
    } catch (error) {
      console.error('Error fetching database statistics:', error);
      return { error: 'Failed to fetch database statistics' };
    }
  }
}

// Export singleton instance
export const arangoClient = new ArangoDBClient();