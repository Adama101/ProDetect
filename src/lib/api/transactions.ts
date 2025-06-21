import { db, PaginationOptions, PaginatedResult, buildPaginationQuery } from '@/lib/database/connection';
import { tazamaService } from '@/lib/tazama/service';

export interface Transaction {
  id: string;
  transaction_id: string;
  customer_id: string;
  amount: number;
  currency: string;
  transaction_type: 'credit' | 'debit' | 'transfer' | 'payment' | 'withdrawal';
  channel: 'online' | 'mobile' | 'atm' | 'branch' | 'pos' | 'ussd';
  counterparty_name?: string;
  counterparty_account?: string;
  counterparty_bank?: string;
  description?: string;
  reference_number?: string;
  location?: any;
  device_info?: any;
  ip_address?: string;
  status: 'pending' | 'completed' | 'failed' | 'flagged' | 'blocked';
  risk_score: number;
  risk_factors?: any[];
  processed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateTransactionData {
  transaction_id: string;
  customer_id: string;
  amount: number;
  currency?: string;
  transaction_type: Transaction['transaction_type'];
  channel: Transaction['channel'];
  counterparty_name?: string;
  counterparty_account?: string;
  counterparty_bank?: string;
  description?: string;
  reference_number?: string;
  location?: any;
  device_info?: any;
  ip_address?: string;
}

export interface TransactionAnalytics {
  totalVolume: number;
  totalCount: number;
  averageAmount: number;
  riskDistribution: Record<string, number>;
  channelDistribution: Record<string, number>;
  statusDistribution: Record<string, number>;
  flaggedTransactions: number;
  highRiskTransactions: number;
}

export class TransactionService {
  // Get all transactions with pagination and filtering
  async getTransactions(
    options: PaginationOptions & {
      customer_id?: string;
      status?: string;
      transaction_type?: string;
      channel?: string;
      min_amount?: number;
      max_amount?: number;
      start_date?: string;
      end_date?: string;
      min_risk_score?: number;
    } = {}
  ): Promise<PaginatedResult<Transaction & { customer_name?: string }>> {
    let baseQuery = `
      SELECT t.*, 
             c.first_name || ' ' || c.last_name as customer_name
      FROM transactions t
      LEFT JOIN customers c ON t.customer_id = c.id
      WHERE 1=1
    `;
    const params: any[] = [];
    let paramIndex = 1;

    // Add filters
    if (options.customer_id) {
      baseQuery += ` AND t.customer_id = $${paramIndex}`;
      params.push(options.customer_id);
      paramIndex++;
    }

    if (options.status) {
      baseQuery += ` AND t.status = $${paramIndex}`;
      params.push(options.status);
      paramIndex++;
    }

    if (options.transaction_type) {
      baseQuery += ` AND t.transaction_type = $${paramIndex}`;
      params.push(options.transaction_type);
      paramIndex++;
    }

    if (options.channel) {
      baseQuery += ` AND t.channel = $${paramIndex}`;
      params.push(options.channel);
      paramIndex++;
    }

    if (options.min_amount !== undefined) {
      baseQuery += ` AND t.amount >= $${paramIndex}`;
      params.push(options.min_amount);
      paramIndex++;
    }

    if (options.max_amount !== undefined) {
      baseQuery += ` AND t.amount <= $${paramIndex}`;
      params.push(options.max_amount);
      paramIndex++;
    }

    if (options.start_date) {
      baseQuery += ` AND t.created_at >= $${paramIndex}`;
      params.push(options.start_date);
      paramIndex++;
    }

    if (options.end_date) {
      baseQuery += ` AND t.created_at <= $${paramIndex}`;
      params.push(options.end_date);
      paramIndex++;
    }

    if (options.min_risk_score !== undefined) {
      baseQuery += ` AND t.risk_score >= $${paramIndex}`;
      params.push(options.min_risk_score);
      paramIndex++;
    }

    const { query, countQuery, limit } = buildPaginationQuery(baseQuery, {
      ...options,
      sortBy: options.sortBy || 't.created_at',
    });

    const [data, countResult] = await Promise.all([
      db.query<Transaction & { customer_name: string }>(query, params),
      db.queryOne<{ count: string }>(countQuery, params),
    ]);

    const total = parseInt(countResult?.count || '0');
    const page = options.page || 1;
    const totalPages = Math.ceil(total / limit);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  // Get transaction by ID
  async getTransactionById(id: string): Promise<Transaction | null> {
    return db.queryOne<Transaction>(
      'SELECT * FROM transactions WHERE id = $1',
      [id]
    );
  }

  // Create new transaction
  async createTransaction(data: CreateTransactionData): Promise<Transaction> {
    // Calculate initial risk score
    const riskScore = await this.calculateRiskScore(data);

    const query = `
      INSERT INTO transactions (
        transaction_id, customer_id, amount, currency, transaction_type,
        channel, counterparty_name, counterparty_account, counterparty_bank,
        description, reference_number, location, device_info, ip_address, risk_score
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      RETURNING *
    `;

    const params = [
      data.transaction_id,
      data.customer_id,
      data.amount,
      data.currency || 'NGN',
      data.transaction_type,
      data.channel,
      data.counterparty_name,
      data.counterparty_account,
      data.counterparty_bank,
      data.description,
      data.reference_number,
      JSON.stringify(data.location),
      JSON.stringify(data.device_info),
      data.ip_address,
      riskScore,
    ];

    const result = await db.query<Transaction>(query, params);
    const transaction = result[0];

    // Process transaction through Tazama rules engine
    try {
      await tazamaService.processTransaction(transaction.id);
    } catch (error) {
      console.error('Error processing transaction through Tazama:', error);
      // Continue with traditional rule processing as fallback
      await this.processTransactionRules(transaction);
    }

    return transaction;
  }

  // Update transaction status
  async updateTransactionStatus(
    id: string,
    status: Transaction['status'],
    notes?: string
  ): Promise<Transaction | null> {
    const query = `
      UPDATE transactions 
      SET status = $1, processed_at = CASE WHEN $1 IN ('completed', 'failed') THEN now() ELSE processed_at END, updated_at = now()
      WHERE id = $2
      RETURNING *
    `;

    const result = await db.query<Transaction>(query, [status, id]);
    return result.length > 0 ? result[0] : null;
  }

  // Calculate risk score for transaction
  private async calculateRiskScore(data: CreateTransactionData): Promise<number> {
    let riskScore = 0;

    // Amount-based risk
    if (data.amount > 100000) riskScore += 30;
    else if (data.amount > 50000) riskScore += 20;
    else if (data.amount > 10000) riskScore += 10;

    // Channel-based risk
    const channelRisk = {
      online: 15,
      mobile: 10,
      atm: 5,
      branch: 0,
      pos: 5,
      ussd: 8,
    };
    riskScore += channelRisk[data.channel] || 0;

    // Transaction type risk
    const typeRisk = {
      transfer: 15,
      withdrawal: 10,
      payment: 5,
      credit: 8,
      debit: 5,
    };
    riskScore += typeRisk[data.transaction_type] || 0;

    // Get customer risk profile
    const customer = await db.queryOne<{ risk_score: number; risk_rating: string }>(
      'SELECT risk_score, risk_rating FROM customers WHERE id = $1',
      [data.customer_id]
    );

    if (customer) {
      // Add customer risk component
      riskScore += Math.floor(customer.risk_score * 0.3);
    }

    // Check velocity (transactions in last hour)
    const recentTransactions = await db.queryOne<{ count: string }>(
      `SELECT COUNT(*) as count FROM transactions 
       WHERE customer_id = $1 AND created_at >= NOW() - INTERVAL '1 hour'`,
      [data.customer_id]
    );

    const recentCount = parseInt(recentTransactions?.count || '0');
    if (recentCount > 10) riskScore += 25;
    else if (recentCount > 5) riskScore += 15;
    else if (recentCount > 3) riskScore += 10;

    return Math.min(100, Math.max(0, riskScore));
  }

  // Process transaction through rules engine
  private async processTransactionRules(transaction: Transaction): Promise<void> {
    const activeRules = await db.query<{
      id: string;
      rule_id: string;
      name: string;
      conditions: any;
      actions: any;
      category: string;
    }>('SELECT * FROM rules WHERE enabled = true');

    for (const rule of activeRules) {
      const triggered = await this.evaluateRule(transaction, rule.conditions);
      
      if (triggered) {
        // Execute rule actions
        await this.executeRuleActions(transaction, rule);
        
        // Update rule execution count
        await db.query(
          'UPDATE rules SET execution_count = execution_count + 1, last_executed = now() WHERE id = $1',
          [rule.id]
        );
      }
    }
  }

  // Evaluate if transaction triggers a rule
  private async evaluateRule(transaction: Transaction, conditions: any): Promise<boolean> {
    try {
      // Amount threshold check
      if (conditions.amount_threshold && transaction.amount >= conditions.amount_threshold) {
        return true;
      }

      // Velocity check
      if (conditions.max_transactions && conditions.timeframe) {
        const timeframeHours = this.parseTimeframe(conditions.timeframe);
        const recentTransactions = await db.queryOne<{ count: string }>(
          `SELECT COUNT(*) as count FROM transactions 
           WHERE customer_id = $1 AND created_at >= NOW() - INTERVAL '${timeframeHours} hours'`,
          [transaction.customer_id]
        );
        
        const count = parseInt(recentTransactions?.count || '0');
        if (count >= conditions.max_transactions) {
          return true;
        }
      }

      // Geographic check
      if (conditions.risk_countries && transaction.location?.country) {
        if (conditions.risk_countries.includes(transaction.location.country)) {
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error('Error evaluating rule:', error);
      return false;
    }
  }

  // Execute rule actions
  private async executeRuleActions(transaction: Transaction, rule: any): Promise<void> {
    const actions = rule.actions;

    if (actions.create_alert) {
      await this.createAlert(transaction, rule);
    }

    if (actions.freeze_transaction) {
      await this.updateTransactionStatus(transaction.id, 'blocked');
    }

    if (actions.freeze_account) {
      await db.query(
        'UPDATE customers SET account_status = $1 WHERE id = $2',
        ['frozen', transaction.customer_id]
      );
    }
  }

  // Create alert for transaction
  private async createAlert(transaction: Transaction, rule: any): Promise<void> {
    const alertId = `ALT${Date.now()}`;
    
    await db.query(
      `INSERT INTO alerts (
        alert_id, customer_id, transaction_id, alert_type, severity,
        description, risk_score, triggered_rules
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        alertId,
        transaction.customer_id,
        transaction.id,
        rule.category,
        this.determineSeverity(transaction.risk_score),
        `Rule triggered: ${rule.name}`,
        transaction.risk_score,
        JSON.stringify([rule.rule_id]),
      ]
    );
  }

  // Determine alert severity based on risk score
  private determineSeverity(riskScore: number): string {
    if (riskScore >= 80) return 'critical';
    if (riskScore >= 60) return 'high';
    if (riskScore >= 40) return 'medium';
    return 'low';
  }

  // Parse timeframe string to hours
  private parseTimeframe(timeframe: string): number {
    const match = timeframe.match(/(\d+)\s*(hour|day|minute)s?/i);
    if (!match) return 1;

    const value = parseInt(match[1]);
    const unit = match[2].toLowerCase();

    switch (unit) {
      case 'minute': return value / 60;
      case 'hour': return value;
      case 'day': return value * 24;
      default: return 1;
    }
  }

  // Get transaction analytics
  async getTransactionAnalytics(
    startDate?: string,
    endDate?: string,
    customerId?: string
  ): Promise<TransactionAnalytics> {
    let whereClause = 'WHERE 1=1';
    const params: any[] = [];
    let paramIndex = 1;

    if (startDate) {
      whereClause += ` AND created_at >= $${paramIndex}`;
      params.push(startDate);
      paramIndex++;
    }

    if (endDate) {
      whereClause += ` AND created_at <= $${paramIndex}`;
      params.push(endDate);
      paramIndex++;
    }

    if (customerId) {
      whereClause += ` AND customer_id = $${paramIndex}`;
      params.push(customerId);
      paramIndex++;
    }

    const [
      volumeResult,
      riskDistribution,
      channelDistribution,
      statusDistribution,
      flaggedCount,
      highRiskCount,
    ] = await Promise.all([
      db.queryOne<{ total_volume: string; total_count: string; avg_amount: string }>(
        `SELECT 
          COALESCE(SUM(amount), 0) as total_volume,
          COUNT(*) as total_count,
          COALESCE(AVG(amount), 0) as avg_amount
         FROM transactions ${whereClause}`,
        params
      ),
      db.query<{ risk_range: string; count: string }>(
        `SELECT 
          CASE 
            WHEN risk_score >= 80 THEN 'Critical'
            WHEN risk_score >= 60 THEN 'High'
            WHEN risk_score >= 40 THEN 'Medium'
            ELSE 'Low'
          END as risk_range,
          COUNT(*) as count
         FROM transactions ${whereClause}
         GROUP BY risk_range`,
        params
      ),
      db.query<{ channel: string; count: string }>(
        `SELECT channel, COUNT(*) as count FROM transactions ${whereClause} GROUP BY channel`,
        params
      ),
      db.query<{ status: string; count: string }>(
        `SELECT status, COUNT(*) as count FROM transactions ${whereClause} GROUP BY status`,
        params
      ),
      db.queryOne<{ count: string }>(
        `SELECT COUNT(*) as count FROM transactions ${whereClause} AND status = 'flagged'`,
        params
      ),
      db.queryOne<{ count: string }>(
        `SELECT COUNT(*) as count FROM transactions ${whereClause} AND risk_score >= 70`,
        params
      ),
    ]);

    return {
      totalVolume: parseFloat(volumeResult?.total_volume || '0'),
      totalCount: parseInt(volumeResult?.total_count || '0'),
      averageAmount: parseFloat(volumeResult?.avg_amount || '0'),
      riskDistribution: Object.fromEntries(
        riskDistribution.map(item => [item.risk_range, parseInt(item.count)])
      ),
      channelDistribution: Object.fromEntries(
        channelDistribution.map(item => [item.channel, parseInt(item.count)])
      ),
      statusDistribution: Object.fromEntries(
        statusDistribution.map(item => [item.status, parseInt(item.count)])
      ),
      flaggedTransactions: parseInt(flaggedCount?.count || '0'),
      highRiskTransactions: parseInt(highRiskCount?.count || '0'),
    };
  }

  // Get customer transaction summary
  async getCustomerTransactionSummary(customerId: string, days: number = 30): Promise<{
    totalTransactions: number;
    totalVolume: number;
    averageAmount: number;
    riskScore: number;
    flaggedTransactions: number;
    channels: Record<string, number>;
    recentActivity: Transaction[];
  }> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const [summary, channels, recentActivity] = await Promise.all([
      db.queryOne<{
        total_transactions: string;
        total_volume: string;
        avg_amount: string;
        avg_risk_score: string;
        flagged_count: string;
      }>(
        `SELECT 
          COUNT(*) as total_transactions,
          COALESCE(SUM(amount), 0) as total_volume,
          COALESCE(AVG(amount), 0) as avg_amount,
          COALESCE(AVG(risk_score), 0) as avg_risk_score,
          COUNT(CASE WHEN status = 'flagged' THEN 1 END) as flagged_count
         FROM transactions 
         WHERE customer_id = $1 AND created_at >= $2`,
        [customerId, startDate.toISOString()]
      ),
      db.query<{ channel: string; count: string }>(
        `SELECT channel, COUNT(*) as count 
         FROM transactions 
         WHERE customer_id = $1 AND created_at >= $2 
         GROUP BY channel`,
        [customerId, startDate.toISOString()]
      ),
      db.query<Transaction>(
        `SELECT * FROM transactions 
         WHERE customer_id = $1 
         ORDER BY created_at DESC 
         LIMIT 10`,
        [customerId]
      ),
    ]);

    return {
      totalTransactions: parseInt(summary?.total_transactions || '0'),
      totalVolume: parseFloat(summary?.total_volume || '0'),
      averageAmount: parseFloat(summary?.avg_amount || '0'),
      riskScore: parseFloat(summary?.avg_risk_score || '0'),
      flaggedTransactions: parseInt(summary?.flagged_count || '0'),
      channels: Object.fromEntries(
        channels.map(item => [item.channel, parseInt(item.count)])
      ),
      recentActivity,
    };
  }
}

export const transactionService = new TransactionService();