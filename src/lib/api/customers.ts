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
    return postgresService.createCustomer(data);
  }

  // Update customer
  async updateCustomer(
    id: string,
    data: UpdateCustomerData
  ): Promise<Customer | null> {
    return postgresService.updateCustomer(id, data as Record<string, any>);
  }

  // Update KYC status
  async updateKycStatus(
    id: string,
    status: Customer["kyc_status"],
    documents?: any[]
  ): Promise<Customer | null> {
    return postgresService.updateKycStatus(id, status, documents);
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
    return postgresService.getCustomerStats();
  }

  // Delete customer
  async deleteCustomer(id: string): Promise<boolean> {
    return postgresService.deleteCustomer(id);
  }
}

export const customerService = new CustomerService();
