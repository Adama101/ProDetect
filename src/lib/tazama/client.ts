import { z } from 'zod';

// Tazama API configuration
const TAZAMA_API_URL = process.env.TAZAMA_API_URL || 'https://api.tazama.io/v1';
const TAZAMA_API_KEY = process.env.TAZAMA_API_KEY;

// Error handling
class TazamaError extends Error {
  statusCode: number;
  
  constructor(message: string, statusCode: number) {
    super(message);
    this.name = 'TazamaError';
    this.statusCode = statusCode;
  }
}

// Validation schemas
const TazamaRuleSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  category: z.string(),
  priority: z.enum(['low', 'medium', 'high', 'critical']),
  conditions: z.record(z.any()),
  actions: z.record(z.any()),
  enabled: z.boolean().default(true),
  version: z.number().default(1),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

const TazamaTransactionSchema = z.object({
  transaction_id: z.string(),
  customer_id: z.string(),
  amount: z.number(),
  currency: z.string(),
  transaction_type: z.string(),
  channel: z.string(),
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
  timestamp: z.string(),
  metadata: z.record(z.any()).optional(),
});

const TazamaCustomerSchema = z.object({
  customer_id: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  date_of_birth: z.string().optional(),
  nationality: z.string().optional(),
  address: z.record(z.any()).optional(),
  occupation: z.string().optional(),
  risk_rating: z.enum(['low', 'medium', 'high', 'critical']).optional(),
  kyc_status: z.enum(['pending', 'verified', 'rejected', 'expired']).optional(),
  onboarding_date: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

const TazamaAlertSchema = z.object({
  alert_id: z.string(),
  customer_id: z.string(),
  transaction_id: z.string().optional(),
  alert_type: z.string(),
  severity: z.enum(['low', 'medium', 'high', 'critical']),
  description: z.string(),
  risk_score: z.number(),
  triggered_rules: z.array(z.string()).optional(),
  timestamp: z.string(),
  metadata: z.record(z.any()).optional(),
});

const TazamaRuleEvaluationResultSchema = z.object({
  transaction_id: z.string(),
  customer_id: z.string(),
  triggered_rules: z.array(z.string()),
  risk_score: z.number(),
  alerts: z.array(TazamaAlertSchema).optional(),
  actions: z.array(z.object({
    type: z.string(),
    params: z.record(z.any()).optional(),
  })).optional(),
  timestamp: z.string(),
});

// Type definitions
export type TazamaRule = z.infer<typeof TazamaRuleSchema>;
export type TazamaTransaction = z.infer<typeof TazamaTransactionSchema>;
export type TazamaCustomer = z.infer<typeof TazamaCustomerSchema>;
export type TazamaAlert = z.infer<typeof TazamaAlertSchema>;
export type TazamaRuleEvaluationResult = z.infer<typeof TazamaRuleEvaluationResultSchema>;

/**
 * Tazama API Client for integrating with the Tazama Rules Engine
 */
export class TazamaClient {
  private apiUrl: string;
  private apiKey: string | undefined;
  
  constructor(apiUrl?: string, apiKey?: string) {
    this.apiUrl = apiUrl || TAZAMA_API_URL;
    this.apiKey = apiKey || TAZAMA_API_KEY;
    
    if (!this.apiKey) {
      console.warn('Tazama API key not provided. API calls will likely fail.');
    }
  }
  
  /**
   * Make an authenticated request to the Tazama API
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
    };
    
    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`;
    }
    
    const options: RequestInit = {
      method,
      headers,
      body: data ? JSON.stringify(data) : undefined,
    };
    
    try {
      const response = await fetch(url, options);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new TazamaError(
          errorData.message || `Tazama API error: ${response.statusText}`,
          response.status
        );
      }
      
      return await response.json() as T;
    } catch (error) {
      if (error instanceof TazamaError) {
        throw error;
      }
      
      throw new TazamaError(
        error instanceof Error ? error.message : 'Unknown error occurred',
        500
      );
    }
  }
  
  /**
   * Get all rules from Tazama
   */
  async getRules(): Promise<TazamaRule[]> {
    return this.request<TazamaRule[]>('/rules');
  }
  
  /**
   * Get a specific rule by ID
   */
  async getRule(ruleId: string): Promise<TazamaRule> {
    return this.request<TazamaRule>(`/rules/${ruleId}`);
  }
  
  /**
   * Create a new rule
   */
  async createRule(rule: Omit<TazamaRule, 'id' | 'created_at' | 'updated_at'>): Promise<TazamaRule> {
    return this.request<TazamaRule>('/rules', 'POST', rule);
  }
  
  /**
   * Update an existing rule
   */
  async updateRule(ruleId: string, rule: Partial<TazamaRule>): Promise<TazamaRule> {
    return this.request<TazamaRule>(`/rules/${ruleId}`, 'PUT', rule);
  }
  
  /**
   * Delete a rule
   */
  async deleteRule(ruleId: string): Promise<void> {
    await this.request<void>(`/rules/${ruleId}`, 'DELETE');
  }
  
  /**
   * Evaluate a transaction against all active rules
   */
  async evaluateTransaction(transaction: TazamaTransaction, customer?: TazamaCustomer): Promise<TazamaRuleEvaluationResult> {
    return this.request<TazamaRuleEvaluationResult>('/evaluate', 'POST', {
      transaction,
      customer,
    });
  }
  
  /**
   * Batch evaluate multiple transactions
   */
  async batchEvaluateTransactions(
    transactions: TazamaTransaction[], 
    customers?: Record<string, TazamaCustomer>
  ): Promise<Record<string, TazamaRuleEvaluationResult>> {
    return this.request<Record<string, TazamaRuleEvaluationResult>>('/evaluate/batch', 'POST', {
      transactions,
      customers,
    });
  }
  
  /**
   * Sync customer data to Tazama
   */
  async syncCustomer(customer: TazamaCustomer): Promise<void> {
    await this.request<void>('/customers', 'POST', customer);
  }
  
  /**
   * Batch sync multiple customers
   */
  async batchSyncCustomers(customers: TazamaCustomer[]): Promise<void> {
    await this.request<void>('/customers/batch', 'POST', { customers });
  }
  
  /**
   * Get rule evaluation history for a specific transaction
   */
  async getTransactionEvaluationHistory(transactionId: string): Promise<TazamaRuleEvaluationResult[]> {
    return this.request<TazamaRuleEvaluationResult[]>(`/history/transaction/${transactionId}`);
  }
  
  /**
   * Get rule evaluation history for a specific customer
   */
  async getCustomerEvaluationHistory(customerId: string, limit?: number): Promise<TazamaRuleEvaluationResult[]> {
    const queryParams = limit ? `?limit=${limit}` : '';
    return this.request<TazamaRuleEvaluationResult[]>(`/history/customer/${customerId}${queryParams}`);
  }
  
  /**
   * Get health status of the Tazama API
   */
  async getHealth(): Promise<{ status: string; version: string }> {
    return this.request<{ status: string; version: string }>('/health');
  }
}

// Export singleton instance
export const tazamaClient = new TazamaClient();