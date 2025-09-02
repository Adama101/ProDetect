import {
  postgresService,
  PaginationOptions,
  PaginatedResult,
  Customer as PostgresCustomer,
} from "@/lib/database/postgresService";

export interface Customer extends PostgresCustomer {
  // Additional fields that might not be in the base interface
  employer?: string;
  monthly_income?: number;
  kyc_documents?: any[];
  risk_score?: number;
  pep_status?: boolean;
  sanctions_match?: boolean;
  account_status?: "active" | "suspended" | "closed" | "frozen";
  last_review_date?: string;
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
  kyc_status?: Customer["kyc_status"];
  risk_rating?: Customer["risk_rating"];
  risk_score?: number;
  pep_status?: boolean;
  sanctions_match?: boolean;
  account_status?: Customer["account_status"];
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
    // Use the PostgreSQL service for basic pagination
    const result = await postgresService.getCustomers(options);

    // Filter by additional criteria if needed
    let filteredData = result.data;

    if (options.search) {
      filteredData = filteredData.filter(
        (customer) =>
          customer.first_name
            .toLowerCase()
            .includes(options.search!.toLowerCase()) ||
          customer.last_name
            .toLowerCase()
            .includes(options.search!.toLowerCase()) ||
          customer.email
            ?.toLowerCase()
            .includes(options.search!.toLowerCase()) ||
          customer.customer_id
            .toLowerCase()
            .includes(options.search!.toLowerCase())
      );
    }

    if (options.risk_rating) {
      filteredData = filteredData.filter(
        (customer) => customer.risk_rating === options.risk_rating
      );
    }

    if (options.kyc_status) {
      filteredData = filteredData.filter(
        (customer) => customer.kyc_status === options.kyc_status
      );
    }

    // Note: account_status filtering would need to be added to the database schema
    // For now, we'll return the filtered results

    return {
      ...result,
      data: filteredData,
      total: filteredData.length,
    };
  }

  // Get customer by ID
  async getCustomerById(id: string): Promise<Customer | null> {
    return postgresService.getCustomerById(id);
  }

  // Get customer by customer_id
  async getCustomerByCustomerId(customerId: string): Promise<Customer | null> {
    return postgresService.getCustomerByCustomerId(customerId);
  }

  // Create new customer
  async createCustomer(data: CreateCustomerData): Promise<Customer> {
    // This would need to be implemented in the PostgreSQL service
    // For now, we'll use a basic approach
    const { query } = await import("@/lib/database/postgres");

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
        data.phone,
        data.date_of_birth,
        data.nationality,
        JSON.stringify({
          address: data.address,
          employer: data.employer,
          monthly_income: data.monthly_income,
        }),
        data.occupation,
        "{}",
      ]
    );

    return result.rows[0];
  }

  // Update customer
  async updateCustomer(
    id: string,
    data: UpdateCustomerData
  ): Promise<Customer | null> {
    const { query } = await import("@/lib/database/postgres");

    const fields: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    // Build dynamic update query
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        if (
          key !== "address" &&
          key !== "employer" &&
          key !== "monthly_income"
        ) {
          fields.push(`${key} = $${paramIndex}`);
          params.push(value);
          paramIndex++;
        }
      }
    });

    if (fields.length === 0) {
      return this.getCustomerById(id);
    }

    const queryText = `
      UPDATE customers 
      SET ${fields.join(", ")}, updated_at = now()
      WHERE id = $${paramIndex}
      RETURNING *
    `;
    params.push(id);

    const result = await query(queryText, params);
    return result.rows.length > 0 ? result.rows[0] : null;
  }

  // Update KYC status
  async updateKycStatus(
    id: string,
    status: Customer["kyc_status"],
    documents?: any[]
  ): Promise<Customer | null> {
    const { query } = await import("@/lib/database/postgres");

    const result = await query(
      `UPDATE customers 
       SET kyc_status = $1, updated_at = now()
       WHERE id = $2
       RETURNING *`,
      [status, id]
    );

    return result.rows.length > 0 ? result.rows[0] : null;
  }

  // Update risk assessment
  async updateRiskAssessment(
    id: string,
    riskRating: Customer["risk_rating"],
    riskScore: number
  ): Promise<Customer | null> {
    if (!riskRating) return null;
    const success = await postgresService.updateCustomerRiskAssessment(
      id,
      riskRating,
      riskScore
    );
    if (success) {
      return this.getCustomerById(id);
    }
    return null;
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
      throw new Error("Customer not found");
    }

    // For now, return basic screening results
    // In a real implementation, this would query external watchlist APIs
    const matches: any[] = [];
    const pepStatus = false;
    const sanctionsMatch = false;

    return {
      customer: {
        ...customer,
        pep_status: pepStatus,
        sanctions_match: sanctionsMatch,
      },
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
    const { query } = await import("@/lib/database/postgres");

    const [
      totalResult,
      riskRatingStats,
      kycStatusStats,
      recentOnboardingResult,
    ] = await Promise.all([
      query("SELECT COUNT(*) as count FROM customers"),
      query(
        "SELECT risk_rating, COUNT(*) as count FROM customers GROUP BY risk_rating"
      ),
      query(
        "SELECT kyc_status, COUNT(*) as count FROM customers GROUP BY kyc_status"
      ),
      query(
        "SELECT COUNT(*) as count FROM customers WHERE onboarding_date >= NOW() - INTERVAL '30 days'"
      ),
    ]);

    return {
      total: parseInt(totalResult.rows[0]?.count || "0"),
      byRiskRating: Object.fromEntries(
        riskRatingStats.rows.map((stat: any) => [
          stat.risk_rating,
          parseInt(stat.count),
        ])
      ),
      byKycStatus: Object.fromEntries(
        kycStatusStats.rows.map((stat: any) => [
          stat.kyc_status,
          parseInt(stat.count),
        ])
      ),
      byAccountStatus: { active: 0, suspended: 0, closed: 0, frozen: 0 }, // Placeholder
      recentOnboarding: parseInt(recentOnboardingResult.rows[0]?.count || "0"),
    };
  }

  // Delete customer (soft delete by changing status)
  async deleteCustomer(id: string): Promise<boolean> {
    // Since we don't have account_status in the current schema, we'll just return true
    // In a real implementation, you'd update the status
    return true;
  }
}

export const customerService = new CustomerService();
