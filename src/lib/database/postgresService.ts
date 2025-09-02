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
}

export const postgresService = new PostgresService();

