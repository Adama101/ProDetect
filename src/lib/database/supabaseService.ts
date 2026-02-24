import { getSupabaseAdmin } from '@/lib/supabase/admin';
import type {
  PaginationOptions,
  PaginatedResult,
  Customer,
  Transaction,
  Alert,
} from './postgresService';

/** Map Supabase transaction row (processed_at) to Transaction (timestamp). */
function mapTransactionRow(row: any): Transaction {
  return {
    ...row,
    timestamp: row.processed_at ?? row.created_at ?? new Date().toISOString(),
  };
}

/** Map Supabase alert row; normalize status/notes for app. */
function mapAlertRow(row: any): Alert {
  return {
    ...row,
    notes: row.resolution_notes ?? row.notes,
  };
}

export class SupabaseService {
  /**
   * Get customers with pagination and filters
   */
  async getCustomers(
    filters: PaginationOptions = {}
  ): Promise<PaginatedResult<Customer>> {
    const supabase = getSupabaseAdmin();
    const limit = filters.limit ?? 50;
    const offset = filters.offset ?? 0;

    let q = supabase.from('customers').select('*', { count: 'exact', head: true });

    if (filters.searchTerm) {
      q = q.or(
        `first_name.ilike.%${filters.searchTerm}%,last_name.ilike.%${filters.searchTerm}%,email.ilike.%${filters.searchTerm}%,customer_id.ilike.%${filters.searchTerm}%`
      );
    }
    if (filters.status && filters.status !== 'all') {
      q = q.eq('risk_rating', filters.status);
    }

    const { data, error, count } = await q
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    const total = count ?? 0;

    return {
      data: (data ?? []).map((r) => ({ ...r, full_name: `${r.first_name} ${r.last_name}` })),
      total,
      page: Math.floor(offset / limit) + 1,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  async getCustomerById(id: string): Promise<Customer | null> {
    const { data, error } = await getSupabaseAdmin()
      .from('customers')
      .select('*')
      .eq('id', id)
      .single();
    if (error || !data) return null;
    return data;
  }

  async getCustomerByCustomerId(customerId: string): Promise<Customer | null> {
    const { data, error } = await getSupabaseAdmin()
      .from('customers')
      .select('*')
      .eq('customer_id', customerId)
      .single();
    if (error || !data) return null;
    return data;
  }

  /**
   * Get transactions with pagination and filters
   */
  async getTransactions(
    filters: PaginationOptions = {}
  ): Promise<PaginatedResult<Transaction>> {
    const supabase = getSupabaseAdmin();
    const limit = filters.limit ?? 50;
    const offset = filters.offset ?? 0;

    let q = supabase
      .from('transactions')
      .select('*, customers!inner(first_name, last_name)', { count: 'exact', head: true });

    if (filters.searchTerm) {
      q = q.or(
        `transaction_id.ilike.%${filters.searchTerm}%,amount.ilike.%${filters.searchTerm}%`
      );
    }
    if (filters.status && filters.status !== 'all') {
      q = q.eq('status', filters.status);
    }
    if (filters.dateFrom) {
      q = q.gte('processed_at', filters.dateFrom.toISOString());
    }
    if (filters.dateTo) {
      q = q.lte('processed_at', filters.dateTo.toISOString());
    }

    const { data, error, count } = await q
      .order('processed_at', { ascending: false })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    const total = count ?? 0;

    const rows = (data ?? []).map((r: any) => {
      const cust = r.customers;
      const { customers: _, ...tx } = r;
      return {
        ...mapTransactionRow(tx),
        customer_name: cust ? `${cust.first_name} ${cust.last_name}` : null,
        first_name: cust?.first_name,
        last_name: cust?.last_name,
      };
    });

    return {
      data: rows,
      total,
      page: Math.floor(offset / limit) + 1,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  async getTransactionById(id: string): Promise<Transaction | null> {
    const { data, error } = await getSupabaseAdmin()
      .from('transactions')
      .select('*')
      .eq('id', id)
      .single();
    if (error || !data) return null;
    return mapTransactionRow(data);
  }

  async getTransactionByTransactionId(
    transactionId: string
  ): Promise<Transaction | null> {
    const { data, error } = await getSupabaseAdmin()
      .from('transactions')
      .select('*')
      .eq('transaction_id', transactionId)
      .single();
    if (error || !data) return null;
    return mapTransactionRow(data);
  }

  /**
   * Get alerts with pagination and filters
   */
  async getAlerts(
    filters: PaginationOptions = {}
  ): Promise<PaginatedResult<Alert>> {
    const supabase = getSupabaseAdmin();
    const limit = filters.limit ?? 50;
    const offset = filters.offset ?? 0;

    let q = supabase
      .from('alerts')
      .select('*, customers!inner(first_name, last_name)', { count: 'exact', head: true });

    if (filters.searchTerm) {
      q = q.or(
        `alert_id.ilike.%${filters.searchTerm}%,description.ilike.%${filters.searchTerm}%`
      );
    }
    if (filters.status && filters.status !== 'all') {
      q = q.eq('status', filters.status);
    }
    if (filters.dateFrom) {
      q = q.gte('created_at', filters.dateFrom.toISOString());
    }
    if (filters.dateTo) {
      q = q.lte('created_at', filters.dateTo.toISOString());
    }

    const { data, error, count } = await q
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    const total = count ?? 0;

    const rows = (data ?? []).map((r: any) => {
      const cust = r.customers;
      const { customers: _, ...a } = r;
      return {
        ...mapAlertRow(a),
        customer_name: cust ? `${cust.first_name} ${cust.last_name}` : null,
      };
    });

    return {
      data: rows,
      total,
      page: Math.floor(offset / limit) + 1,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  async getAlertById(id: string): Promise<Alert | null> {
    const { data, error } = await getSupabaseAdmin()
      .from('alerts')
      .select('*')
      .eq('id', id)
      .single();
    if (error || !data) return null;
    return mapAlertRow(data);
  }

  async updateTransactionStatus(
    id: string,
    status: string,
    _reason?: string
  ): Promise<boolean> {
    const { error } = await getSupabaseAdmin()
      .from('transactions')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id);
    return !error;
  }

  async updateCustomerRiskAssessment(
    id: string,
    riskRating: string,
    _riskScore: number
  ): Promise<boolean> {
    const { error } = await getSupabaseAdmin()
      .from('customers')
      .update({ risk_rating: riskRating, updated_at: new Date().toISOString() })
      .eq('id', id);
    return !error;
  }

  async createAlert(
    alertData: Omit<Alert, 'id' | 'created_at' | 'updated_at'>
  ): Promise<Alert | null> {
    const row: any = {
      alert_id: alertData.alert_id,
      customer_id: alertData.customer_id,
      transaction_id: alertData.transaction_id ?? null,
      alert_type: alertData.alert_type,
      severity: alertData.severity,
      description: alertData.description,
      risk_score: alertData.risk_score ?? 0,
      triggered_rules: alertData.triggered_rules ?? [],
      status: alertData.status ?? 'open',
      metadata: alertData.metadata ?? {},
    };
    const { data, error } = await getSupabaseAdmin()
      .from('alerts')
      .insert(row)
      .select('*')
      .single();
    if (error) return null;
    return mapAlertRow(data);
  }

  async updateTransactionRiskScore(
    id: string,
    riskScore: number
  ): Promise<boolean> {
    const { error } = await getSupabaseAdmin()
      .from('transactions')
      .update({ risk_score: riskScore, updated_at: new Date().toISOString() })
      .eq('id', id);
    return !error;
  }

  // --- Customers: full CRUD ---
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
    const row: any = {
      customer_id: data.customer_id,
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      phone: data.phone ?? null,
      date_of_birth: data.date_of_birth ?? null,
      nationality: data.nationality ?? null,
      address: data.address ?? null,
      occupation: data.occupation ?? null,
      employer: data.employer ?? null,
      monthly_income: data.monthly_income ?? null,
    };
    const { data: inserted, error } = await getSupabaseAdmin()
      .from('customers')
      .insert(row)
      .select('*')
      .single();
    if (error) throw error;
    return inserted;
  }

  async updateCustomer(
    id: string,
    data: Record<string, any>
  ): Promise<Customer | null> {
    const allowed = [
      'first_name', 'last_name', 'email', 'phone', 'date_of_birth',
      'nationality', 'address', 'occupation', 'employer', 'monthly_income',
      'kyc_status', 'risk_rating', 'risk_score', 'pep_status', 'sanctions_match',
      'account_status',
    ];
    const updates: Record<string, any> = { updated_at: new Date().toISOString() };
    for (const key of allowed) {
      if (data[key] !== undefined) updates[key] = data[key];
    }
    const { data: updated, error } = await getSupabaseAdmin()
      .from('customers')
      .update(updates)
      .eq('id', id)
      .select('*')
      .single();
    if (error) return null;
    return updated;
  }

  async updateKycStatus(
    id: string,
    status: string,
    _documents?: any[]
  ): Promise<Customer | null> {
    const { data, error } = await getSupabaseAdmin()
      .from('customers')
      .update({ kyc_status: status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select('*')
      .single();
    if (error) return null;
    return data;
  }

  async getCustomerStats(): Promise<{
    total: number;
    byRiskRating: Record<string, number>;
    byKycStatus: Record<string, number>;
    byAccountStatus: Record<string, number>;
    recentOnboarding: number;
  }> {
    const supabase = getSupabaseAdmin();
    const [totalR, riskR, kycR, recentR] = await Promise.all([
      supabase.from('customers').select('*', { count: 'exact', head: true }),
      supabase.from('customers').select('risk_rating'),
      supabase.from('customers').select('kyc_status'),
      supabase
        .from('customers')
        .select('*', { count: 'exact', head: true })
        .gte('onboarding_date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),
    ]);
    const byRisk: Record<string, number> = {};
    (riskR.data ?? []).forEach((r: any) => {
      byRisk[r.risk_rating] = (byRisk[r.risk_rating] ?? 0) + 1;
    });
    const byKyc: Record<string, number> = {};
    (kycR.data ?? []).forEach((r: any) => {
      byKyc[r.kyc_status] = (byKyc[r.kyc_status] ?? 0) + 1;
    });
    return {
      total: totalR.count ?? 0,
      byRiskRating: byRisk,
      byKycStatus: byKyc,
      byAccountStatus: { active: 0, suspended: 0, closed: 0, frozen: 0 },
      recentOnboarding: recentR.count ?? 0,
    };
  }

  async deleteCustomer(id: string): Promise<boolean> {
    const { error } = await getSupabaseAdmin()
      .from('customers')
      .delete()
      .eq('id', id);
    return !error;
  }

  // --- Transactions: create + stats ---
  async createTransaction(
    data: Omit<Transaction, 'id' | 'created_at' | 'updated_at'>
  ): Promise<Transaction | null> {
    const row: any = {
      transaction_id: data.transaction_id,
      customer_id: data.customer_id,
      amount: data.amount,
      currency: data.currency ?? 'USD',
      transaction_type: data.transaction_type,
      channel: data.channel ?? 'online',
      status: data.status ?? 'pending',
      risk_score: data.risk_score ?? 0,
      processed_at: data.timestamp ?? new Date().toISOString(),
    };
    const { data: inserted, error } = await getSupabaseAdmin()
      .from('transactions')
      .insert(row)
      .select('*')
      .single();
    if (error) return null;
    return mapTransactionRow(inserted);
  }

  async getTransactionStats(): Promise<{
    total: number;
    byStatus: Record<string, number>;
    byType: Record<string, number>;
    totalAmount: number;
    averageAmount: number;
  }> {
    const supabase = getSupabaseAdmin();
    const { data: rows } = await supabase.from('transactions').select('status, transaction_type, amount');
    const byStatus: Record<string, number> = {};
    const byType: Record<string, number> = {};
    let totalAmount = 0;
    (rows ?? []).forEach((r: any) => {
      byStatus[r.status] = (byStatus[r.status] ?? 0) + 1;
      byType[r.transaction_type] = (byType[r.transaction_type] ?? 0) + 1;
      totalAmount += Number(r.amount ?? 0);
    });
    return {
      total: rows?.length ?? 0,
      byStatus,
      byType,
      totalAmount,
      averageAmount: rows?.length ? totalAmount / rows.length : 0,
    };
  }

  // --- Alerts: update, assign, escalate, analytics ---
  async updateAlertStatus(
    id: string,
    status: string,
    resolutionNotes?: string
  ): Promise<Alert | null> {
    const updates: any = {
      status,
      updated_at: new Date().toISOString(),
      resolution_notes: resolutionNotes ?? undefined,
    };
    if (['resolved', 'false_positive', 'closed'].includes(status)) {
      updates.resolved_at = new Date().toISOString();
    }
    const { data, error } = await getSupabaseAdmin()
      .from('alerts')
      .update(updates)
      .eq('id', id)
      .select('*')
      .single();
    if (error) return null;
    return data ? mapAlertRow(data) : null;
  }

  async assignAlert(id: string, userId: string): Promise<Alert | null> {
    const { data, error } = await getSupabaseAdmin()
      .from('alerts')
      .update({ assigned_to: userId, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select('*')
      .single();
    if (error) return null;
    return data ? mapAlertRow(data) : null;
  }

  async escalateAlert(id: string, reason?: string): Promise<Alert | null> {
    const supabase = getSupabaseAdmin();
    const { data: current } = await supabase.from('alerts').select('severity').eq('id', id).single();
    const next: Record<string, string> = {
      low: 'medium',
      medium: 'high',
      high: 'critical',
      critical: 'critical',
    };
    const severity = next[(current as any)?.severity ?? 'low'] ?? 'high';
    const { data, error } = await supabase
      .from('alerts')
      .update({
        severity,
        metadata: { escalation_reason: reason ?? 'Manual escalation' },
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select('*')
      .single();
    if (error) return null;
    return data ? mapAlertRow(data) : null;
  }

  async getAlertAnalytics(
    startDate?: string,
    endDate?: string
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
    const supabase = getSupabaseAdmin();
    let q = supabase.from('alerts').select('*');
    if (startDate) q = q.gte('created_at', startDate);
    if (endDate) q = q.lte('created_at', endDate);
    const { data: rows } = await q;
    const list = rows ?? [];
    const totalAlerts = list.length;
    const openAlerts = list.filter((r: any) => r.status === 'open').length;
    const resolvedAlerts = list.filter((r: any) =>
      ['resolved', 'closed', 'false_positive'].includes(r.status)
    ).length;
    const falsePositives = list.filter((r: any) => r.status === 'false_positive').length;
    const severityDistribution: Record<string, number> = {};
    const typeDistribution: Record<string, number> = {};
    list.forEach((r: any) => {
      severityDistribution[r.severity] = (severityDistribution[r.severity] ?? 0) + 1;
      typeDistribution[r.alert_type] = (typeDistribution[r.alert_type] ?? 0) + 1;
    });
    const trendsData = list.slice(0, 30).map((r: any) => ({
      date: r.created_at?.slice(0, 10) ?? '',
      count: 1,
      resolved: ['resolved', 'closed', 'false_positive'].includes(r.status) ? 1 : 0,
    }));
    return {
      totalAlerts,
      openAlerts,
      resolvedAlerts,
      falsePositives,
      averageResolutionTime: 0,
      severityDistribution,
      typeDistribution,
      trendsData,
    };
  }

  async getHighPriorityAlerts(limit: number = 10): Promise<Alert[]> {
    const { data } = await getSupabaseAdmin()
      .from('alerts')
      .select('*')
      .eq('status', 'open')
      .in('severity', ['high', 'critical'])
      .order('created_at', { ascending: false })
      .limit(limit);
    return (data ?? []).map(mapAlertRow);
  }

  async bulkUpdateAlerts(
    alertIds: string[],
    updates: { status?: string; assigned_to?: string; notes?: string }
  ): Promise<number> {
    if (alertIds.length === 0) return 0;
    const payload: any = { updated_at: new Date().toISOString() };
    if (updates.status !== undefined) payload.status = updates.status;
    if (updates.assigned_to !== undefined) payload.assigned_to = updates.assigned_to;
    if (updates.notes !== undefined) payload.resolution_notes = updates.notes;
    const { error } = await getSupabaseAdmin()
      .from('alerts')
      .update(payload)
      .in('id', alertIds);
    return error ? 0 : alertIds.length;
  }

  async getAlertSummary(): Promise<{
    total: number;
    open: number;
    critical: number;
    high: number;
    recentTrend: number;
  }> {
    const supabase = getSupabaseAdmin();
    const [all, open, critical, high, trend] = await Promise.all([
      supabase.from('alerts').select('*', { count: 'exact', head: true }),
      supabase.from('alerts').select('*', { count: 'exact', head: true }).eq('status', 'open'),
      supabase.from('alerts').select('*', { count: 'exact', head: true }).eq('severity', 'critical'),
      supabase.from('alerts').select('*', { count: 'exact', head: true }).eq('severity', 'high'),
      supabase
        .from('alerts')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()),
    ]);
    return {
      total: all.count ?? 0,
      open: open.count ?? 0,
      critical: critical.count ?? 0,
      high: high.count ?? 0,
      recentTrend: trend.count ?? 0,
    };
  }
}

export const supabaseService = new SupabaseService();
