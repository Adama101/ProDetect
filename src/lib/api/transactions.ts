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
    const { query } = await import("@/lib/database/postgres");

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
          JSON.stringify(data.counterparty || {}),
          JSON.stringify(data.location || {}),
          JSON.stringify(data.device_info || {}),
          data.ip_address,
          data.timestamp,
          data.status || "pending",
          data.risk_score,
          JSON.stringify(data.metadata || {}),
        ]
      );

      return result.rows[0] || null;
    } catch (error) {
      console.error("Error creating transaction:", error);
      return null;
    }
  }

  // Get transaction statistics
  async getTransactionStats(): Promise<{
    total: number;
    byStatus: Record<string, number>;
    byType: Record<string, number>;
    totalAmount: number;
    averageAmount: number;
  }> {
    const { query } = await import("@/lib/database/postgres");

    try {
      const [totalResult, statusStats, typeStats, amountStats] =
        await Promise.all([
          query("SELECT COUNT(*) as count FROM transactions"),
          query(
            "SELECT status, COUNT(*) as count FROM transactions GROUP BY status"
          ),
          query(
            "SELECT transaction_type, COUNT(*) as count FROM transactions GROUP BY transaction_type"
          ),
          query(
            "SELECT SUM(amount) as total, AVG(amount) as average FROM transactions"
          ),
        ]);

      return {
        total: parseInt(totalResult.rows[0]?.count || "0"),
        byStatus: Object.fromEntries(
          statusStats.rows.map((stat: any) => [
            stat.status,
            parseInt(stat.count),
          ])
        ),
        byType: Object.fromEntries(
          typeStats.rows.map((stat: any) => [
            stat.transaction_type,
            parseInt(stat.count),
          ])
        ),
        totalAmount: parseFloat(amountStats.rows[0]?.total || "0"),
        averageAmount: parseFloat(amountStats.rows[0]?.average || "0"),
      };
    } catch (error) {
      console.error("Error getting transaction stats:", error);
      return {
        total: 0,
        byStatus: {},
        byType: {},
        totalAmount: 0,
        averageAmount: 0,
      };
    }
  }
}

export const transactionService = new TransactionService();
