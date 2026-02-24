import { postgresService, Transaction } from "@/lib/database/postgresService";

export interface TransactionWithCustomer extends Transaction {
  customer_name?: string;
  first_name?: string;
  last_name?: string;
}

export class TransactionService {
  // Get all transactions with pagination and filters
  async getTransactions(
    filters: {
      limit?: number;
      offset?: number;
      searchTerm?: string;
      status?: string;
      dateFrom?: Date;
      dateTo?: Date;
    } = {}
  ): Promise<{
    data: TransactionWithCustomer[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    return postgresService.getTransactions(filters);
  }

  // Get transaction by ID
  async getTransactionById(
    id: string
  ): Promise<TransactionWithCustomer | null> {
    return postgresService.getTransactionById(id);
  }

  // Get transaction by transaction_id
  async getTransactionByTransactionId(
    transactionId: string
  ): Promise<TransactionWithCustomer | null> {
    return postgresService.getTransactionByTransactionId(transactionId);
  }

  // Update transaction status
  async updateTransactionStatus(
    id: string,
    status: string,
    reason?: string
  ): Promise<boolean> {
    return postgresService.updateTransactionStatus(id, status, reason);
  }

  // Update transaction risk score
  async updateTransactionRiskScore(
    id: string,
    riskScore: number
  ): Promise<boolean> {
    return postgresService.updateTransactionRiskScore(id, riskScore);
  }

  // Create new transaction
  async createTransaction(
    data: Omit<Transaction, "id" | "created_at" | "updated_at">
  ): Promise<Transaction | null> {
    return postgresService.createTransaction(data);
  }

  // Get transaction statistics
  async getTransactionStats(): Promise<{
    total: number;
    byStatus: Record<string, number>;
    byType: Record<string, number>;
    totalAmount: number;
    averageAmount: number;
  }> {
    return postgresService.getTransactionStats();
  }
}

export const transactionService = new TransactionService();
