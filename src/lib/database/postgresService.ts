import { query, transaction } from "./postgres";

export interface PaginationOptions {
  limit?: number;
  offset?: number;
  searchTerm?: string;
  status?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface Customer {
  id: string;
  customer_id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  date_of_birth?: string;
  nationality?: string;
  address?: any;
  occupation?: string;
  risk_rating?: "low" | "medium" | "high" | "critical";
  kyc_status?: "pending" | "verified" | "rejected" | "expired";
  onboarding_date: string;
  metadata?: any;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  transaction_id: string;
  customer_id: string;
  amount: number;
  currency: string;
  transaction_type: string;
  channel?: string;
  counterparty?: any;
  location?: any;
  device_info?: any;
  ip_address?: string;
  timestamp: string;
  status: "pending" | "completed" | "flagged" | "blocked";
  risk_score?: number;
  metadata?: any;
  created_at: string;
  updated_at: string;
}

export interface Alert {
  id: string;
  alert_id: string;
  customer_id: string;
  transaction_id?: string;
  alert_type: string;
  severity: "low" | "medium" | "high" | "critical";
  description: string;
  risk_score?: number;
  triggered_rules?: string[];
  status: "open" | "investigating" | "resolved" | "false_positive";
  assigned_to?: string;
  notes?: string;
  metadata?: any;
  created_at: string;
  updated_at: string;
}

export class PostgresService {
  /**
   * Build pagination query with filters
   */
  private buildPaginationQuery(
    baseQuery: string,
    filters: PaginationOptions,
    tableAlias: string = "t"
  ): { query: string; params: any[] } {
    const conditions: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    if (filters.searchTerm) {
      conditions.push(
        `(${tableAlias}.transaction_id ILIKE $${paramIndex} OR ${tableAlias}.amount::text ILIKE $${paramIndex})`
      );
      params.push(`%${filters.searchTerm}%`);
      paramIndex++;
    }

    if (filters.status && filters.status !== "all") {
      conditions.push(`${tableAlias}.status = $${paramIndex}`);
      params.push(filters.status);
      paramIndex++;
    }

    if (filters.dateFrom) {
      conditions.push(`${tableAlias}.timestamp >= $${paramIndex}`);
      params.push(filters.dateFrom);
      paramIndex++;
    }

    if (filters.dateTo) {
      conditions.push(`${tableAlias}.timestamp <= $${paramIndex}`);
      params.push(filters.dateTo);
      paramIndex++;
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    return {
      query: `${baseQuery} ${whereClause}`,
      params,
    };
  }

  /**
   * Get customers with pagination and filters
   */
  async getCustomers(
    filters: PaginationOptions = {}
  ): Promise<PaginatedResult<Customer>> {
    const limit = filters.limit || 50;
    const offset = filters.offset || 0;

    // Build base query
    const baseQuery = "FROM customers c";
    const { query: whereQuery, params } = this.buildPaginationQuery(
      baseQuery,
      filters,
      "c"
    );

    // Get total count
    const countQuery = `SELECT COUNT(*) ${whereQuery}`;
    const countResult = await query(countQuery, params);
    const total = parseInt(countResult.rows[0].count);

    // Get paginated data
    const dataQuery = `
      SELECT c.*, 
             CONCAT(c.first_name, ' ', c.last_name) as full_name
      ${whereQuery}
      ORDER BY c.created_at DESC
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `;

    const dataParams = [...params, limit, offset];
    const dataResult = await query(dataQuery, dataParams);

    return {
      data: dataResult.rows,
      total,
      page: Math.floor(offset / limit) + 1,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Get customer by ID
   */
  async getCustomerById(id: string): Promise<Customer | null> {
    const result = await query("SELECT * FROM customers WHERE id = $1", [id]);
    return result.rows[0] || null;
  }

  /**
   * Get customer by customer_id
   */
  async getCustomerByCustomerId(customerId: string): Promise<Customer | null> {
    const result = await query(
      "SELECT * FROM customers WHERE customer_id = $1",
      [customerId]
    );
    return result.rows[0] || null;
  }

  /**
   * Get transactions with pagination and filters
   */
  async getTransactions(
    filters: PaginationOptions = {}
  ): Promise<PaginatedResult<Transaction>> {
    const limit = filters.limit || 50;
    const offset = filters.offset || 0;

    // Build base query with customer join
    const baseQuery = `
      FROM transactions t
      JOIN customers c ON t.customer_id = c.id
    `;
    const { query: whereQuery, params } = this.buildPaginationQuery(
      baseQuery,
      filters,
      "t"
    );

    // Get total count
    const countQuery = `SELECT COUNT(*) ${whereQuery}`;
    const countResult = await query(countQuery, params);
    const total = parseInt(countResult.rows[0].count);

    // Get paginated data
    const dataQuery = `
      SELECT t.*, 
             c.first_name, 
             c.last_name,
             CONCAT(c.first_name, ' ', c.last_name) as customer_name
      ${whereQuery}
      ORDER BY t.timestamp DESC
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `;

    const dataParams = [...params, limit, offset];
    const dataResult = await query(dataQuery, dataParams);

    return {
      data: dataResult.rows,
      total,
      page: Math.floor(offset / limit) + 1,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Get transaction by ID
   */
  async getTransactionById(id: string): Promise<Transaction | null> {
    const result = await query("SELECT * FROM transactions WHERE id = $1", [
      id,
    ]);
    return result.rows[0] || null;
  }

  /**
   * Get transaction by transaction_id
   */
  async getTransactionByTransactionId(
    transactionId: string
  ): Promise<Transaction | null> {
    const result = await query(
      "SELECT * FROM transactions WHERE transaction_id = $1",
      [transactionId]
    );
    return result.rows[0] || null;
  }

  /**
   * Get alerts with pagination and filters
   */
  async getAlerts(
    filters: PaginationOptions = {}
  ): Promise<PaginatedResult<Alert>> {
    const limit = filters.limit || 50;
    const offset = filters.offset || 0;

    // Build base query with customer join
    const baseQuery = `
      FROM alerts a
      JOIN customers c ON a.customer_id = c.id
    `;
    const { query: whereQuery, params } = this.buildPaginationQuery(
      baseQuery,
      filters,
      "a"
    );

    // Get total count
    const countQuery = `SELECT COUNT(*) ${whereQuery}`;
    const countResult = await query(countQuery, params);
    const total = parseInt(countResult.rows[0].count);

    // Get paginated data
    const dataQuery = `
      SELECT a.*, 
             c.first_name, 
             c.last_name,
             CONCAT(c.first_name, ' ', c.last_name) as customer_name
      ${whereQuery}
      ORDER BY a.created_at DESC
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `;

    const dataParams = [...params, limit, offset];
    const dataResult = await query(dataQuery, dataParams);

    return {
      data: dataResult.rows,
      total,
      page: Math.floor(offset / limit) + 1,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Get alert by ID
   */
  async getAlertById(id: string): Promise<Alert | null> {
    const result = await query("SELECT * FROM alerts WHERE id = $1", [id]);
    return result.rows[0] || null;
  }

  /**
   * Update transaction status
   */
  async updateTransactionStatus(
    id: string,
    status: string,
    reason?: string
  ): Promise<boolean> {
    try {
      await query(
        "UPDATE transactions SET status = $1, updated_at = NOW() WHERE id = $2",
        [status, id]
      );
      return true;
    } catch (error) {
      console.error("Error updating transaction status:", error);
      return false;
    }
  }

  /**
   * Update customer risk assessment
   */
  async updateCustomerRiskAssessment(
    id: string,
    riskRating: string,
    riskScore: number
  ): Promise<boolean> {
    try {
      await query(
        "UPDATE customers SET risk_rating = $1, updated_at = NOW() WHERE id = $2",
        [riskRating, id]
      );
      return true;
    } catch (error) {
      console.error("Error updating customer risk assessment:", error);
      return false;
    }
  }

  /**
   * Create alert
   */
  async createAlert(
    alertData: Omit<Alert, "id" | "created_at" | "updated_at">
  ): Promise<Alert | null> {
    try {
      const result = await query(
        `INSERT INTO alerts (
          alert_id, customer_id, transaction_id, alert_type, severity, 
          description, risk_score, triggered_rules, status, metadata
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *`,
        [
          alertData.alert_id,
          alertData.customer_id,
          alertData.transaction_id,
          alertData.alert_type,
          alertData.severity,
          alertData.description,
          alertData.risk_score,
          alertData.triggered_rules,
          alertData.status || "open",
          alertData.metadata,
        ]
      );
      return result.rows[0] || null;
    } catch (error) {
      console.error("Error creating alert:", error);
      return null;
    }
  }

  /**
   * Update transaction risk score
   */
  async updateTransactionRiskScore(
    id: string,
    riskScore: number
  ): Promise<boolean> {
    try {
      await query(
        "UPDATE transactions SET risk_score = $1, updated_at = NOW() WHERE id = $2",
        [riskScore, id]
      );
      return true;
    } catch (error) {
      console.error("Error updating transaction risk score:", error);
      return false;
    }
  }

  async createCustomer(data: {
    customer_id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
    date_of_birth?: string;
    nationality?: string;
    address?: any;
    occupation?: string;
    employer?: string;
    monthly_income?: number;
  }): Promise<Customer> {
    const result = await query(
      `INSERT INTO customers (
        customer_id, first_name, last_name, email, phone, date_of_birth,
        nationality, address, occupation, metadata
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *`,
      [
        data.customer_id,
        data.first_name,
        data.last_name,
        data.email,
        data.phone ?? null,
        data.date_of_birth ?? null,
        data.nationality ?? null,
        JSON.stringify({
          address: data.address,
          employer: data.employer,
          monthly_income: data.monthly_income,
        }),
        data.occupation ?? null,
        "{}",
      ]
    );
    return result.rows[0];
  }

  async updateCustomer(
    id: string,
    data: Record<string, any>
  ): Promise<Customer | null> {
    const fields: string[] = [];
    const params: any[] = [];
    let i = 1;
    const allowed = [
      "first_name", "last_name", "email", "phone", "date_of_birth",
      "nationality", "occupation", "kyc_status", "risk_rating", "risk_score",
      "pep_status", "sanctions_match", "account_status",
    ];
    for (const key of allowed) {
      if (data[key] !== undefined) {
        fields.push(`${key} = $${i}`);
        params.push(data[key]);
        i++;
      }
    }
    if (fields.length === 0) return this.getCustomerById(id);
    fields.push("updated_at = NOW()");
    params.push(id);
    const result = await query(
      `UPDATE customers SET ${fields.join(", ")} WHERE id = $${i} RETURNING *`,
      params
    );
    return result.rows[0] ?? null;
  }

  async updateKycStatus(
    id: string,
    status: string,
    _documents?: any[]
  ): Promise<Customer | null> {
    const result = await query(
      "UPDATE customers SET kyc_status = $1, updated_at = NOW() WHERE id = $2 RETURNING *",
      [status, id]
    );
    return result.rows[0] ?? null;
  }

  async getCustomerStats(): Promise<{
    total: number;
    byRiskRating: Record<string, number>;
    byKycStatus: Record<string, number>;
    byAccountStatus: Record<string, number>;
    recentOnboarding: number;
  }> {
    const [totalR, riskR, kycR, recentR] = await Promise.all([
      query("SELECT COUNT(*) as count FROM customers"),
      query("SELECT risk_rating, COUNT(*) as count FROM customers GROUP BY risk_rating"),
      query("SELECT kyc_status, COUNT(*) as count FROM customers GROUP BY kyc_status"),
      query("SELECT COUNT(*) as count FROM customers WHERE onboarding_date >= NOW() - INTERVAL '30 days'"),
    ]);
    return {
      total: parseInt(totalR.rows[0]?.count ?? "0"),
      byRiskRating: Object.fromEntries(
        riskR.rows.map((r: any) => [r.risk_rating, parseInt(r.count)])
      ),
      byKycStatus: Object.fromEntries(
        kycR.rows.map((r: any) => [r.kyc_status, parseInt(r.count)])
      ),
      byAccountStatus: { active: 0, suspended: 0, closed: 0, frozen: 0 },
      recentOnboarding: parseInt(recentR.rows[0]?.count ?? "0"),
    };
  }

  async deleteCustomer(id: string): Promise<boolean> {
    try {
      await query("DELETE FROM customers WHERE id = $1", [id]);
      return true;
    } catch {
      return false;
    }
  }

  async createTransaction(
    data: Omit<Transaction, "id" | "created_at" | "updated_at">
  ): Promise<Transaction | null> {
    try {
      const result = await query(
        `INSERT INTO transactions (
          transaction_id, customer_id, amount, currency, transaction_type,
          channel, counterparty, location, device_info, ip_address, timestamp, status, risk_score, metadata
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        RETURNING *`,
        [
          data.transaction_id,
          data.customer_id,
          data.amount,
          data.currency,
          data.transaction_type,
          data.channel,
          JSON.stringify(data.counterparty ?? {}),
          JSON.stringify(data.location ?? {}),
          JSON.stringify(data.device_info ?? {}),
          data.ip_address,
          data.timestamp,
          data.status ?? "pending",
          data.risk_score,
          JSON.stringify(data.metadata ?? {}),
        ]
      );
      return result.rows[0] ?? null;
    } catch (error) {
      console.error("Error creating transaction:", error);
      return null;
    }
  }

  async getTransactionStats(): Promise<{
    total: number;
    byStatus: Record<string, number>;
    byType: Record<string, number>;
    totalAmount: number;
    averageAmount: number;
  }> {
    const [totalR, statusR, typeR, amountR] = await Promise.all([
      query("SELECT COUNT(*) as count FROM transactions"),
      query("SELECT status, COUNT(*) as count FROM transactions GROUP BY status"),
      query("SELECT transaction_type, COUNT(*) as count FROM transactions GROUP BY transaction_type"),
      query("SELECT SUM(amount) as total, AVG(amount) as average FROM transactions"),
    ]);
    return {
      total: parseInt(totalR.rows[0]?.count ?? "0"),
      byStatus: Object.fromEntries(
        statusR.rows.map((r: any) => [r.status, parseInt(r.count)])
      ),
      byType: Object.fromEntries(
        typeR.rows.map((r: any) => [r.transaction_type, parseInt(r.count)])
      ),
      totalAmount: parseFloat(amountR.rows[0]?.total ?? "0"),
      averageAmount: parseFloat(amountR.rows[0]?.average ?? "0"),
    };
  }

  async updateAlertStatus(
    id: string,
    status: string,
    resolutionNotes?: string
  ): Promise<Alert | null> {
    try {
      const result = await query(
        `UPDATE alerts SET status = $1,
          resolved_at = CASE WHEN $1 IN ('resolved', 'false_positive') THEN now() ELSE resolved_at END,
          notes = COALESCE($2, notes), updated_at = now()
         WHERE id = $3 RETURNING *`,
        [status, resolutionNotes, id]
      );
      return result.rows[0] ?? null;
    } catch {
      return null;
    }
  }

  async assignAlert(id: string, userId: string): Promise<Alert | null> {
    try {
      const result = await query(
        "UPDATE alerts SET assigned_to = $1, updated_at = now() WHERE id = $2 RETURNING *",
        [userId, id]
      );
      return result.rows[0] ?? null;
    } catch {
      return null;
    }
  }

  async escalateAlert(id: string, reason?: string): Promise<Alert | null> {
    try {
      const result = await query(
        `UPDATE alerts SET
          severity = CASE WHEN severity = 'low' THEN 'medium' WHEN severity = 'medium' THEN 'high' WHEN severity = 'high' THEN 'critical' ELSE severity END,
          metadata = jsonb_set(COALESCE(metadata, '{}'), '{escalation_reason}', to_jsonb($2)),
          updated_at = now()
         WHERE id = $1 RETURNING *`,
        [id, reason ?? "Manual escalation"]
      );
      return result.rows[0] ?? null;
    } catch {
      return null;
    }
  }

  async getAlertAnalytics(
    _startDate?: string,
    _endDate?: string
  ): Promise<{
    totalAlerts: number;
    openAlerts: number;
    resolvedAlerts: number;
    falsePositives: number;
    averageResolutionTime: number;
    severityDistribution: Record<string, number>;
    typeDistribution: Record<string, number>;
    trendsData: Array<{ date: string; count: number; resolved: number }>;
  }> {
    try {
      const [totalsR, severityR, typeR, trendsR, resolutionR] = await Promise.all([
        query(`SELECT COUNT(*) as total_alerts,
          COUNT(CASE WHEN status = 'open' THEN 1 END) as open_alerts,
          COUNT(CASE WHEN status IN ('resolved','false_positive') THEN 1 END) as resolved_alerts,
          COUNT(CASE WHEN status = 'false_positive' THEN 1 END) as false_positives FROM alerts`),
        query("SELECT severity, COUNT(*) as count FROM alerts GROUP BY severity"),
        query("SELECT alert_type, COUNT(*) as count FROM alerts GROUP BY alert_type"),
        query(`SELECT DATE(created_at) as date, COUNT(*) as count,
          COUNT(CASE WHEN status IN ('resolved','false_positive') THEN 1 END) as resolved
          FROM alerts GROUP BY DATE(created_at) ORDER BY date DESC LIMIT 30`),
        query(`SELECT COALESCE(AVG(EXTRACT(EPOCH FROM (updated_at - created_at))/3600), 0) as avg_resolution_hours
          FROM alerts WHERE status IN ('resolved','false_positive')`),
      ]);
      return {
        totalAlerts: parseInt(totalsR.rows[0]?.total_alerts ?? "0"),
        openAlerts: parseInt(totalsR.rows[0]?.open_alerts ?? "0"),
        resolvedAlerts: parseInt(totalsR.rows[0]?.resolved_alerts ?? "0"),
        falsePositives: parseInt(totalsR.rows[0]?.false_positives ?? "0"),
        averageResolutionTime: parseFloat(resolutionR.rows[0]?.avg_resolution_hours ?? "0"),
        severityDistribution: Object.fromEntries(
          severityR.rows.map((r: any) => [r.severity, parseInt(r.count)])
        ),
        typeDistribution: Object.fromEntries(
          typeR.rows.map((r: any) => [r.alert_type, parseInt(r.count)])
        ),
        trendsData: trendsR.rows.map((r: any) => ({
          date: r.date,
          count: parseInt(r.count),
          resolved: parseInt(r.resolved),
        })),
      };
    } catch {
      return {
        totalAlerts: 0,
        openAlerts: 0,
        resolvedAlerts: 0,
        falsePositives: 0,
        averageResolutionTime: 0,
        severityDistribution: {},
        typeDistribution: {},
        trendsData: [],
      };
    }
  }

  async getHighPriorityAlerts(limit: number = 10): Promise<Alert[]> {
    try {
      const result = await query(
        `SELECT * FROM alerts WHERE status = 'open' AND severity IN ('high','critical')
         ORDER BY CASE severity WHEN 'critical' THEN 1 WHEN 'high' THEN 2 ELSE 3 END, created_at DESC LIMIT $1`,
        [limit]
      );
      return result.rows;
    } catch {
      return [];
    }
  }

  async bulkUpdateAlerts(
    alertIds: string[],
    updates: { status?: string; assigned_to?: string; notes?: string }
  ): Promise<number> {
    if (alertIds.length === 0) return 0;
    try {
      const sets: string[] = ["updated_at = now()"];
      const params: any[] = [];
      let i = 1;
      if (updates.status !== undefined) {
        sets.push(`status = $${i}`);
        params.push(updates.status);
        i++;
      }
      if (updates.assigned_to !== undefined) {
        sets.push(`assigned_to = $${i}`);
        params.push(updates.assigned_to);
        i++;
      }
      if (updates.notes !== undefined) {
        sets.push(`notes = $${i}`);
        params.push(updates.notes);
        i++;
      }
      params.push(alertIds);
      const result = await query(
        `UPDATE alerts SET ${sets.join(", ")} WHERE id = ANY($${i})`,
        params
      );
      return result.rowCount ?? 0;
    } catch {
      return 0;
    }
  }

  async getAlertSummary(): Promise<{
    total: number;
    open: number;
    critical: number;
    high: number;
    recentTrend: number;
  }> {
    try {
      const [summaryR, trendR] = await Promise.all([
        query(`SELECT COUNT(*) as total, COUNT(CASE WHEN status = 'open' THEN 1 END) as open,
          COUNT(CASE WHEN severity = 'critical' THEN 1 END) as critical,
          COUNT(CASE WHEN severity = 'high' THEN 1 END) as high FROM alerts`),
        query("SELECT COUNT(*) as trend FROM alerts WHERE created_at >= NOW() - INTERVAL '24 hours'"),
      ]);
      return {
        total: parseInt(summaryR.rows[0]?.total ?? "0"),
        open: parseInt(summaryR.rows[0]?.open ?? "0"),
        critical: parseInt(summaryR.rows[0]?.critical ?? "0"),
        high: parseInt(summaryR.rows[0]?.high ?? "0"),
        recentTrend: parseInt(trendR.rows[0]?.trend ?? "0"),
      };
    } catch {
      return { total: 0, open: 0, critical: 0, high: 0, recentTrend: 0 };
    }
  }
}

function getDbService(): PostgresService {
  if (
    typeof process !== 'undefined' &&
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.SUPABASE_SERVICE_ROLE_KEY
  ) {
    const { supabaseService } = require('./supabaseService');
    return supabaseService as PostgresService;
  }
  return new PostgresService();
}

export const postgresService = getDbService();



