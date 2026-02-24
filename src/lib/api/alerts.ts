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
    return postgresService.updateAlertStatus(id, status, resolutionNotes);
  }

  // Assign alert to user
  async assignAlert(id: string, userId: string): Promise<Alert | null> {
    return postgresService.assignAlert(id, userId);
  }

  // Escalate alert
  async escalateAlert(id: string, reason?: string): Promise<Alert | null> {
    return postgresService.escalateAlert(id, reason);
  }

  // Get alert analytics
  async getAlertAnalytics(
    startDate?: string,
    endDate?: string
  ): Promise<AlertAnalytics> {
    return postgresService.getAlertAnalytics(startDate, endDate);
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
    return postgresService.getHighPriorityAlerts(limit);
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
    return postgresService.bulkUpdateAlerts(alertIds, updates);
  }

  // Get alert summary for dashboard
  async getAlertSummary(): Promise<{
    total: number;
    open: number;
    critical: number;
    high: number;
    recentTrend: number;
  }> {
    return postgresService.getAlertSummary();
  }
}

export const alertService = new AlertService();
