import {
  postgresService,
  PaginationOptions,
  PaginatedResult,
  Alert as PostgresAlert,
} from "@/lib/database/postgresService";

export interface Alert extends PostgresAlert {
  // Additional fields that might not be in the base interface
  escalated_at?: string;
  resolved_at?: string;
  resolution_notes?: string;
}

export interface CreateAlertData {
  alert_id: string;
  customer_id: string;
  transaction_id?: string;
  alert_type: string;
  severity: Alert["severity"];
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
  ): Promise<
    PaginatedResult<Alert & { customer_name?: string; assignee_name?: string }>
  > {
    // Use the PostgreSQL service for basic pagination
    const result = await postgresService.getAlerts(options);

    // Filter by additional criteria if needed
    let filteredData = result.data;

    if (options.customer_id) {
      filteredData = filteredData.filter(
        (alert) => alert.customer_id === options.customer_id
      );
    }

    if (options.status) {
      filteredData = filteredData.filter(
        (alert) => alert.status === options.status
      );
    }

    if (options.severity) {
      filteredData = filteredData.filter(
        (alert) => alert.severity === options.severity
      );
    }

    if (options.alert_type) {
      filteredData = filteredData.filter(
        (alert) => alert.alert_type === options.alert_type
      );
    }

    if (options.assigned_to) {
      filteredData = filteredData.filter(
        (alert) => alert.assigned_to === options.assigned_to
      );
    }

    if (options.start_date) {
      filteredData = filteredData.filter(
        (alert) => alert.created_at >= options.start_date
      );
    }

    if (options.end_date) {
      filteredData = filteredData.filter(
        (alert) => alert.created_at <= options.end_date
      );
    }

    return {
      ...result,
      data: filteredData,
      total: filteredData.length,
    };
  }

  // Get alert by ID
  async getAlertById(id: string): Promise<Alert | null> {
    return postgresService.getAlertById(id);
  }

  // Create new alert
  async createAlert(data: CreateAlertData): Promise<Alert | null> {
    return postgresService.createAlert(data);
  }

  // Update alert status
  async updateAlertStatus(
    id: string,
    status: Alert["status"],
    resolutionNotes?: string
  ): Promise<Alert | null> {
    const { query } = await import("@/lib/database/postgres");

    try {
      const result = await query(
        `UPDATE alerts 
         SET status = $1, 
             resolved_at = CASE WHEN $1 IN ('resolved', 'false_positive') THEN now() ELSE resolved_at END,
             notes = COALESCE($2, notes),
             updated_at = now()
         WHERE id = $3
         RETURNING *`,
        [status, resolutionNotes, id]
      );

      return result.rows[0] || null;
    } catch (error) {
      console.error("Error updating alert status:", error);
      return null;
    }
  }

  // Assign alert to user
  async assignAlert(id: string, userId: string): Promise<Alert | null> {
    const { query } = await import("@/lib/database/postgres");

    try {
      const result = await query(
        `UPDATE alerts 
         SET assigned_to = $1, updated_at = now()
         WHERE id = $2
         RETURNING *`,
        [userId, id]
      );

      return result.rows[0] || null;
    } catch (error) {
      console.error("Error assigning alert:", error);
      return null;
    }
  }

  // Escalate alert
  async escalateAlert(id: string, reason?: string): Promise<Alert | null> {
    const { query } = await import("@/lib/database/postgres");

    try {
      const result = await query(
        `UPDATE alerts 
         SET severity = CASE 
           WHEN severity = 'low' THEN 'medium'
           WHEN severity = 'medium' THEN 'high'
           WHEN severity = 'high' THEN 'critical'
           ELSE severity
         END,
         metadata = jsonb_set(
           COALESCE(metadata, '{}'), 
           '{escalation_reason}', 
           to_jsonb($2)
         ),
         updated_at = now()
         WHERE id = $1
         RETURNING *`,
        [id, reason || "Manual escalation"]
      );

      return result.rows[0] || null;
    } catch (error) {
      console.error("Error escalating alert:", error);
      return null;
    }
  }

  // Get alert analytics
  async getAlertAnalytics(
    startDate?: string,
    endDate?: string
  ): Promise<AlertAnalytics> {
    const { query } = await import("@/lib/database/postgres");

    try {
      let whereClause = "WHERE 1=1";
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
        query(
          `SELECT 
            COUNT(*) as total_alerts,
            COUNT(CASE WHEN status = 'open' THEN 1 END) as open_alerts,
            COUNT(CASE WHEN status IN ('resolved', 'false_positive') THEN 1 END) as resolved_alerts,
            COUNT(CASE WHEN status = 'false_positive' THEN 1 END) as false_positives
           FROM alerts ${whereClause}`,
          params
        ),
        query(
          `SELECT severity, COUNT(*) as count FROM alerts ${whereClause} GROUP BY severity`,
          params
        ),
        query(
          `SELECT alert_type, COUNT(*) as count FROM alerts ${whereClause} GROUP BY alert_type`,
          params
        ),
        query(
          `SELECT 
            DATE(created_at) as date,
            COUNT(*) as count,
            COUNT(CASE WHEN status IN ('resolved', 'false_positive') THEN 1 END) as resolved
           FROM alerts ${whereClause}
           GROUP BY DATE(created_at)
           ORDER BY date DESC
           LIMIT 30`,
          params
        ),
        query(
          `SELECT 
            COALESCE(AVG(EXTRACT(EPOCH FROM (updated_at - created_at))/3600), 0) as avg_resolution_hours
           FROM alerts 
           ${whereClause} AND status IN ('resolved', 'false_positive')`,
          params
        ),
      ]);

      return {
        totalAlerts: parseInt(totalsResult.rows[0]?.total_alerts || "0"),
        openAlerts: parseInt(totalsResult.rows[0]?.open_alerts || "0"),
        resolvedAlerts: parseInt(totalsResult.rows[0]?.resolved_alerts || "0"),
        falsePositives: parseInt(totalsResult.rows[0]?.false_positives || "0"),
        averageResolutionTime: parseFloat(
          resolutionTimeResult.rows[0]?.avg_resolution_hours || "0"
        ),
        severityDistribution: Object.fromEntries(
          severityDistribution.rows.map((item: any) => [
            item.severity,
            parseInt(item.count),
          ])
        ),
        typeDistribution: Object.fromEntries(
          typeDistribution.rows.map((item: any) => [
            item.alert_type,
            parseInt(item.count),
          ])
        ),
        trendsData: trendsData.rows.map((item: any) => ({
          date: item.date,
          count: parseInt(item.count),
          resolved: parseInt(item.resolved),
        })),
      };
    } catch (error) {
      console.error("Error getting alert analytics:", error);
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

  // Get alerts for a specific customer
  async getCustomerAlerts(
    customerId: string,
    options: PaginationOptions = {}
  ): Promise<PaginatedResult<Alert>> {
    return this.getAlerts({ ...options, customer_id: customerId });
  }

  // Get high-priority alerts
  async getHighPriorityAlerts(limit: number = 10): Promise<Alert[]> {
    const { query } = await import("@/lib/database/postgres");

    try {
      const result = await query(
        `SELECT * FROM alerts 
         WHERE status IN ('open') 
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

      return result.rows;
    } catch (error) {
      console.error("Error getting high priority alerts:", error);
      return [];
    }
  }

  // Bulk update alerts
  async bulkUpdateAlerts(
    alertIds: string[],
    updates: {
      status?: Alert["status"];
      assigned_to?: string;
      notes?: string;
    }
  ): Promise<number> {
    if (alertIds.length === 0) return 0;

    const { query } = await import("@/lib/database/postgres");

    try {
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

      if (updates.notes !== undefined) {
        fields.push(`notes = $${paramIndex}`);
        params.push(updates.notes);
        paramIndex++;
      }

      if (fields.length === 0) return 0;

      fields.push("updated_at = now()");

      const queryText = `
        UPDATE alerts 
        SET ${fields.join(", ")}
        WHERE id = ANY($${paramIndex})
      `;
      params.push(alertIds);

      const result = await query(queryText, params);
      return result.rowCount || 0;
    } catch (error) {
      console.error("Error bulk updating alerts:", error);
      return 0;
    }
  }

  // Get alert summary for dashboard
  async getAlertSummary(): Promise<{
    total: number;
    open: number;
    critical: number;
    high: number;
    recentTrend: number;
  }> {
    const { query } = await import("@/lib/database/postgres");

    try {
      const [summary, trendResult] = await Promise.all([
        query(
          `SELECT 
            COUNT(*) as total,
            COUNT(CASE WHEN status = 'open' THEN 1 END) as open,
            COUNT(CASE WHEN severity = 'critical' THEN 1 END) as critical,
            COUNT(CASE WHEN severity = 'high' THEN 1 END) as high
           FROM alerts`
        ),
        query(
          `SELECT 
            COUNT(*) as trend
           FROM alerts 
           WHERE created_at >= NOW() - INTERVAL '24 hours'`
        ),
      ]);

      return {
        total: parseInt(summary.rows[0]?.total || "0"),
        open: parseInt(summary.rows[0]?.open || "0"),
        critical: parseInt(summary.rows[0]?.critical || "0"),
        high: parseInt(summary.rows[0]?.high || "0"),
        recentTrend: parseInt(trendResult.rows[0]?.trend || "0"),
      };
    } catch (error) {
      console.error("Error getting alert summary:", error);
      return {
        total: 0,
        open: 0,
        critical: 0,
        high: 0,
        recentTrend: 0,
      };
    }
  }
}

export const alertService = new AlertService();
