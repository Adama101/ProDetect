import { db, PaginationOptions, PaginatedResult, buildPaginationQuery } from '@/lib/database/arangoTransactionService';

export interface Customer {
  id: string;
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
  kyc_status: 'pending' | 'verified' | 'rejected' | 'expired';
  kyc_documents?: any[];
  risk_rating: 'low' | 'medium' | 'high' | 'critical';
  risk_score: number;
  pep_status: boolean;
  sanctions_match: boolean;
  account_status: 'active' | 'suspended' | 'closed' | 'frozen';
  onboarding_date: string;
  last_review_date?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateCustomerData {
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
}

export interface UpdateCustomerData extends Partial<CreateCustomerData> {
  kyc_status?: Customer['kyc_status'];
  risk_rating?: Customer['risk_rating'];
  risk_score?: number;
  pep_status?: boolean;
  sanctions_match?: boolean;
  account_status?: Customer['account_status'];
}

export class CustomerService {
  // Get all customers with pagination and filtering
  async getCustomers(
    options: PaginationOptions & {
      search?: string;
      risk_rating?: string;
      kyc_status?: string;
      account_status?: string;
    } = {}
  ): Promise<PaginatedResult<Customer>> {
    let baseQuery = `
      SELECT * FROM customers
      WHERE 1=1
    `;
    const params: any[] = [];
    let paramIndex = 1;

    // Add search filter
    if (options.search) {
      baseQuery += ` AND (
        first_name ILIKE $${paramIndex} OR 
        last_name ILIKE $${paramIndex} OR 
        email ILIKE $${paramIndex} OR 
        customer_id ILIKE $${paramIndex}
      )`;
      params.push(`%${options.search}%`);
      paramIndex++;
    }

    // Add filters
    if (options.risk_rating) {
      baseQuery += ` AND risk_rating = $${paramIndex}`;
      params.push(options.risk_rating);
      paramIndex++;
    }

    if (options.kyc_status) {
      baseQuery += ` AND kyc_status = $${paramIndex}`;
      params.push(options.kyc_status);
      paramIndex++;
    }

    if (options.account_status) {
      baseQuery += ` AND account_status = $${paramIndex}`;
      params.push(options.account_status);
      paramIndex++;
    }

    const { query, countQuery, limit } = buildPaginationQuery(baseQuery, {
      ...options,
      sortBy: options.sortBy || 'created_at',
    });

    const [data, countResult] = await Promise.all([
      db.query<Customer>(query, params),
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

  // Get customer by ID
  async getCustomerById(id: string): Promise<Customer | null> {
    return db.queryOne<Customer>(
      'SELECT * FROM customers WHERE id = $1',
      [id]
    );
  }

  // Get customer by customer_id
  async getCustomerByCustomerId(customerId: string): Promise<Customer | null> {
    return db.queryOne<Customer>(
      'SELECT * FROM customers WHERE customer_id = $1',
      [customerId]
    );
  }

  // Create new customer
  async createCustomer(data: CreateCustomerData): Promise<Customer> {
    const query = `
      INSERT INTO customers (
        customer_id, first_name, last_name, email, phone, date_of_birth,
        nationality, address, occupation, employer, monthly_income
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `;

    const params = [
      data.customer_id,
      data.first_name,
      data.last_name,
      data.email,
      data.phone,
      data.date_of_birth,
      data.nationality,
      JSON.stringify(data.address),
      data.occupation,
      data.employer,
      data.monthly_income,
    ];

    const result = await db.query<Customer>(query, params);
    return result[0];
  }

  // Update customer
  async updateCustomer(id: string, data: UpdateCustomerData): Promise<Customer | null> {
    const fields: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    // Build dynamic update query
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        fields.push(`${key} = $${paramIndex}`);
        params.push(key === 'address' ? JSON.stringify(value) : value);
        paramIndex++;
      }
    });

    if (fields.length === 0) {
      return this.getCustomerById(id);
    }

    const query = `
      UPDATE customers 
      SET ${fields.join(', ')}, updated_at = now()
      WHERE id = $${paramIndex}
      RETURNING *
    `;
    params.push(id);

    const result = await db.query<Customer>(query, params);
    return result.length > 0 ? result[0] : null;
  }

  // Update KYC status
  async updateKycStatus(
    id: string, 
    status: Customer['kyc_status'], 
    documents?: any[]
  ): Promise<Customer | null> {
    const query = `
      UPDATE customers 
      SET kyc_status = $1, kyc_documents = $2, last_review_date = now(), updated_at = now()
      WHERE id = $3
      RETURNING *
    `;

    const result = await db.query<Customer>(query, [
      status,
      JSON.stringify(documents || []),
      id,
    ]);
    return result.length > 0 ? result[0] : null;
  }

  // Update risk assessment
  async updateRiskAssessment(
    id: string,
    riskRating: Customer['risk_rating'],
    riskScore: number
  ): Promise<Customer | null> {
    const query = `
      UPDATE customers 
      SET risk_rating = $1, risk_score = $2, last_review_date = now(), updated_at = now()
      WHERE id = $3
      RETURNING *
    `;

    const result = await db.query<Customer>(query, [riskRating, riskScore, id]);
    return result.length > 0 ? result[0] : null;
  }

  // Screen customer against watchlists
  async screenCustomer(id: string): Promise<{
    customer: Customer;
    matches: any[];
    pepStatus: boolean;
    sanctionsMatch: boolean;
  }> {
    const customer = await this.getCustomerById(id);
    if (!customer) {
      throw new Error('Customer not found');
    }

    // Screen against watchlists
    const watchlistQuery = `
      SELECT * FROM watchlists 
      WHERE entity_name ILIKE $1 OR $2 = ANY(aliases)
    `;
    const fullName = `${customer.first_name} ${customer.last_name}`;
    const matches = await db.query(watchlistQuery, [`%${fullName}%`, fullName]);

    const pepStatus = matches.some(match => match.list_type === 'pep');
    const sanctionsMatch = matches.some(match => match.list_type === 'sanctions');

    // Update customer with screening results
    if (pepStatus !== customer.pep_status || sanctionsMatch !== customer.sanctions_match) {
      await this.updateCustomer(id, { pep_status: pepStatus, sanctions_match: sanctionsMatch });
    }

    return {
      customer: { ...customer, pep_status: pepStatus, sanctions_match: sanctionsMatch },
      matches,
      pepStatus,
      sanctionsMatch,
    };
  }

  // Get customer statistics
  async getCustomerStats(): Promise<{
    total: number;
    byRiskRating: Record<string, number>;
    byKycStatus: Record<string, number>;
    byAccountStatus: Record<string, number>;
    recentOnboarding: number;
  }> {
    const [
      totalResult,
      riskRatingStats,
      kycStatusStats,
      accountStatusStats,
      recentOnboardingResult,
    ] = await Promise.all([
      db.queryOne<{ count: string }>('SELECT COUNT(*) as count FROM customers'),
      db.query<{ risk_rating: string; count: string }>(
        'SELECT risk_rating, COUNT(*) as count FROM customers GROUP BY risk_rating'
      ),
      db.query<{ kyc_status: string; count: string }>(
        'SELECT kyc_status, COUNT(*) as count FROM customers GROUP BY kyc_status'
      ),
      db.query<{ account_status: string; count: string }>(
        'SELECT account_status, COUNT(*) as count FROM customers GROUP BY account_status'
      ),
      db.queryOne<{ count: string }>(
        'SELECT COUNT(*) as count FROM customers WHERE onboarding_date >= NOW() - INTERVAL \'30 days\''
      ),
    ]);

    return {
      total: parseInt(totalResult?.count || '0'),
      byRiskRating: Object.fromEntries(
        riskRatingStats.map(stat => [stat.risk_rating, parseInt(stat.count)])
      ),
      byKycStatus: Object.fromEntries(
        kycStatusStats.map(stat => [stat.kyc_status, parseInt(stat.count)])
      ),
      byAccountStatus: Object.fromEntries(
        accountStatusStats.map(stat => [stat.account_status, parseInt(stat.count)])
      ),
      recentOnboarding: parseInt(recentOnboardingResult?.count || '0'),
    };
  }

  // Delete customer (soft delete by changing status)
  async deleteCustomer(id: string): Promise<boolean> {
    const result = await db.query(
      'UPDATE customers SET account_status = $1, updated_at = now() WHERE id = $2',
      ['closed', id]
    );
    return result.length > 0;
  }
}

export const customerService = new CustomerService();