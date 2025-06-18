import { db, PaginationOptions, PaginatedResult, buildPaginationQuery } from '@/lib/database/connection';

export interface Alert {
  id: string;
  alert_id: string;
  customer_id: string;
  transaction_id?: string;
  alert_type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in_review' | 'resolved' | 'closed' | 'false_positive';
  description: string;
  risk_score: number;
  triggered_rules?: string[];
  metadata?: any;
  assigned_to?: string;
  escalated_at?: string;
  resolved_at?: string;
  resolution_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateAlertData {
  alert_id: string;
  customer_id: string;
  transaction_id?: string;
  alert_type: string;
  severity: Alert['severity'];
  description: string;
  risk_score: number;
  triggered_rules?: string[];
  metadata?: any;
}

export interface AlertAnalytics {
  totalAlerts: number;
  openAlerts: number;
  resolvedAlerts: number;
  falsePositives: number;
  averageResolutionTime: number;
  severityDistribution: Record<string, number>;
  typeDistribution: Record<string, number>;
  trendsData: Array<{
    date: string;
    count: number;
    resolved: number;
  }>;
}

export class AlertService {
  // Get all alerts with pagination and filtering
  async getAlerts(
    options: PaginationOptions & {
      customer_id?: string;
      status?: string;
      severity?: string;
      alert_type?: string;
      assigned_to?: string;
      start_date?: string;
      end_date?: string;
    } = {}
  ): Promise<PaginatedResult<Alert & { customer_name?: string; assignee_name?: string }>> {
    let baseQuery = `
      SELECT a.*, 
             c.first_name || ' ' || c.last_name as customer_name,
             u.first_name || ' ' || u.last_name as assignee_name
      FROM alerts a
      LEFT JOIN customers c ON a.customer_id = c.id
      LEFT JOIN users u ON a.assigned_to::uuid = u.id
      WHERE 1=1
    `;
    const params: any[] = [];
    let paramIndex = 1;

    // Add filters
    if (options.customer_id) {
      baseQuery += ` AND a.customer_id = $${paramIndex}`;
      params.push(options.customer_id);
      paramIndex++;
    }

    if (options.status) {
      baseQuery += ` AND a.status = $${paramIndex}`;
      params.push(options.status);
      paramIndex++;
    }

    if (options.severity) {
      baseQuery += ` AND a.severity = $${paramIndex}`;
      params.push(options.severity);
      paramIndex++;
    }

    if (options.alert_type) {
      baseQuery += ` AND a.alert_type = $${paramIndex}`;
      params.push(options.alert_type);
      paramIndex++;
    }

    if (options.assigned_to) {
      baseQuery += ` AND a.assigned_to = $${paramIndex}`;
      params.push(options.assigned_to);
      paramIndex++;
    }

    if (options.start_date) {
      baseQuery += ` AND a.created_at >= $${paramIndex}`;
      params.push(options.start_date);
      paramIndex++;
    }

    if (options.end_date) {
      baseQuery += ` AND a.created_at <= $${paramIndex}`;
      params.push(options.end_date);
      paramIndex++;
    }

    const { query, countQuery, limit } = buildPaginationQuery(baseQuery, {
      ...options,
      sortBy: options.sortBy || 'a.created_at',
    });

    const [data, countResult] = await Promise.all([
      db.query<Alert & { customer_name: string; assignee_name: string }>(query, params),
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

  // Get alert by ID
  async getAlertById(id: string): Promise<Alert | null> {
    return db.queryOne<Alert>(
      'SELECT * FROM alerts WHERE id = $1',
      [id]
    );
  }

  // Create new alert
  async createAlert(data: CreateAlertData): Promise<Alert> {
    const query = `
      INSERT INTO alerts (
        alert_id, customer_id, transaction_id, alert_type, severity,
        description, risk_score, triggered_rules, metadata
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;

    const params = [
      data.alert_id,
      data.customer_id,
      data.transaction_id,
      data.alert_type,
      data.severity,
      data.description,
      data.risk_score,
      JSON.stringify(data.triggered_rules || []),
      JSON.stringify(data.metadata || {}),
    ];

    const result = await db.query<Alert>(query, params);
    const alert = result[0];

    // Auto-assign based on severity and type
    await this.autoAssignAlert(alert);

    return alert;
  }

  // Update alert status
  async updateAlertStatus(
    id: string,
    status: Alert['status'],
    resolutionNotes?: string
  ): Promise<Alert | null> {
    const query = `
      UPDATE alerts 
      SET status = $1, 
          resolved_at = CASE WHEN $1 IN ('resolved', 'closed', 'false_positive') THEN now() ELSE resolved_at END,
          resolution_notes = COALESCE($2, resolution_notes),
          updated_at = now()
      WHERE id = $3
      RETURNING *
    `;

    const result = await db.query<Alert>(query, [status, resolutionNotes, id]);
    return result.length > 0 ? result[0] : null;
  }

  // Assign alert to user
  async assignAlert(id: string, userId: string): Promise<Alert | null> {
    const query = `
      UPDATE alerts 
      SET assigned_to = $1, updated_at = now()
      WHERE id = $2
      RETURNING *
    `;

    const result = await db.query<Alert>(query, [userId, id]);
    return result.length > 0 ? result[0] : null;
  }

  // Escalate alert
  async escalateAlert(id: string, reason?: string): Promise<Alert | null> {
    const query = `
      UPDATE alerts 
      SET severity = CASE 
        WHEN severity = 'low' THEN 'medium'
        WHEN severity = 'medium' THEN 'high'
        WHEN severity = 'high' THEN 'critical'
        ELSE severity
      END,
      escalated_at = now(),
      metadata = jsonb_set(
        COALESCE(metadata, '{}'), 
        '{escalation_reason}', 
        to_jsonb($2)
      ),
      updated_at = now()
      WHERE id = $1
      RETURNING *
    `;

    const result = await db.query<Alert>(query, [id, reason || 'Manual escalation']);
    return result.length > 0 ? result[0] : null;
  }

  // Auto-assign alert based on rules
  private async autoAssignAlert(alert: Alert): Promise<void> {
    // Get available users for assignment based on alert type and severity
    const assignmentQuery = `
      SELECT id FROM users 
      WHERE role IN ('compliance_officer', 'analyst', 'investigator') 
        AND is_active = true
      ORDER BY last_login DESC NULLS LAST
      LIMIT 1
    `;

    const assignee = await db.queryOne<{ id: string }>(assignmentQuery);
    
    if (assignee) {
      await this.assignAlert(alert.id, assignee.id);
    }
  }

  // Get alert analytics
  async getAlertAnalytics(
    startDate?: string,
    endDate?: string
  ): Promise<AlertAnalytics> {
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

    const [
      totalsResult,
      severityDistribution,
      typeDistribution,
      trendsData,
      resolutionTimeResult,
    ] = await Promise.all([
      db.queryOne<{
        total_alerts: string;
        open_alerts: string;
        resolved_alerts: string;
        false_positives: string;
      }>(
        `SELECT 
          COUNT(*) as total_alerts,
          COUNT(CASE WHEN status = 'open' THEN 1 END) as open_alerts,
          COUNT(CASE WHEN status IN ('resolved', 'closed') THEN 1 END) as resolved_alerts,
          COUNT(CASE WHEN status = 'false_positive' THEN 1 END) as false_positives
         FROM alerts ${whereClause}`,
        params
      ),
      db.query<{ severity: string; count: string }>(
        `SELECT severity, COUNT(*) as count FROM alerts ${whereClause} GROUP BY severity`,
        params
      ),
      db.query<{ alert_type: string; count: string }>(
        `SELECT alert_type, COUNT(*) as count FROM alerts ${whereClause} GROUP BY alert_type`,
        params
      ),
      db.query<{ date: string; count: string; resolved: string }>(
        `SELECT 
          DATE(created_at) as date,
          COUNT(*) as count,
          COUNT(CASE WHEN status IN ('resolved', 'closed') THEN 1 END) as resolved
         FROM alerts ${whereClause}
         GROUP BY DATE(created_at)
         ORDER BY date DESC
         LIMIT 30`,
        params
      ),
      db.queryOne<{ avg_resolution_hours: string }>(
        `SELECT 
          COALESCE(AVG(EXTRACT(EPOCH FROM (resolved_at - created_at))/3600), 0) as avg_resolution_hours
         FROM alerts 
         ${whereClause} AND resolved_at IS NOT NULL`,
        params
      ),
    ]);

    return {
      totalAlerts: parseInt(totalsResult?.total_alerts || '0'),
      openAlerts: parseInt(totalsResult?.open_alerts || '0'),
      resolvedAlerts: parseInt(totalsResult?.resolved_alerts || '0'),
      falsePositives: parseInt(totalsResult?.false_positives || '0'),
      averageResolutionTime: parseFloat(resolutionTimeResult?.avg_resolution_hours || '0'),
      severityDistribution: Object.fromEntries(
        severityDistribution.map(item => [item.severity, parseInt(item.count)])
      ),
      typeDistribution: Object.fromEntries(
        typeDistribution.map(item => [item.alert_type, parseInt(item.count)])
      ),
      trendsData: trendsData.map(item => ({
        date: item.date,
        count: parseInt(item.count),
        resolved: parseInt(item.resolved),
      })),
    };
  }

  // Get alerts for a specific customer
  async getCustomerAlerts(
    customerId: string,
    options: PaginationOptions = {}
  ): Promise<PaginatedResult<Alert>> {
    return this.getAlerts({ ...options, customer_id: customerId });
  }

  // Get high-priority alerts
  async getHighPriorityAlerts(limit: number = 10): Promise<Alert[]> {
    return db.query<Alert>(
      `SELECT * FROM alerts 
       WHERE status IN ('open', 'in_review') 
         AND severity IN ('high', 'critical')
       ORDER BY 
         CASE severity 
           WHEN 'critical' THEN 1 
           WHEN 'high' THEN 2 
           ELSE 3 
         END,
         created_at DESC
       LIMIT $1`,
      [limit]
    );
  }

  // Bulk update alerts
  async bulkUpdateAlerts(
    alertIds: string[],
    updates: {
      status?: Alert['status'];
      assigned_to?: string;
      resolution_notes?: string;
    }
  ): Promise<number> {
    if (alertIds.length === 0) return 0;

    const fields: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    if (updates.status !== undefined) {
      fields.push(`status = $${paramIndex}`);
      params.push(updates.status);
      paramIndex++;
    }

    if (updates.assigned_to !== undefined) {
      fields.push(`assigned_to = $${paramIndex}`);
      params.push(updates.assigned_to);
      paramIndex++;
    }

    if (updates.resolution_notes !== undefined) {
      fields.push(`resolution_notes = $${paramIndex}`);
      params.push(updates.resolution_notes);
      paramIndex++;
    }

    if (fields.length === 0) return 0;

    fields.push('updated_at = now()');

    const query = `
      UPDATE alerts 
      SET ${fields.join(', ')}
      WHERE id = ANY($${paramIndex})
    `;
    params.push(alertIds);

    const result = await db.query(query, params);
    return result.length;
  }

  // Get alert summary for dashboard
  async getAlertSummary(): Promise<{
    total: number;
    open: number;
    critical: number;
    high: number;
    recentTrend: number;
  }> {
    const [summary, trendResult] = await Promise.all([
      db.queryOne<{
        total: string;
        open: string;
        critical: string;
        high: string;
      }>(
        `SELECT 
          COUNT(*) as total,
          COUNT(CASE WHEN status = 'open' THEN 1 END) as open,
          COUNT(CASE WHEN severity = 'critical' THEN 1 END) as critical,
          COUNT(CASE WHEN severity = 'high' THEN 1 END) as high
         FROM alerts`
      ),
      db.queryOne<{ trend: string }>(
        `SELECT 
          COUNT(*) as trend
         FROM alerts 
         WHERE created_at >= NOW() - INTERVAL '24 hours'`
      ),
    ]);

    return {
      total: parseInt(summary?.total || '0'),
      open: parseInt(summary?.open || '0'),
      critical: parseInt(summary?.critical || '0'),
      high: parseInt(summary?.high || '0'),
      recentTrend: parseInt(trendResult?.trend || '0'),
    };
  }
}

export const alertService = new AlertService();