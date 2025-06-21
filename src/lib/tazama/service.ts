import { tazamaClient, TazamaRuleEvaluationResult } from './client';
import { TazamaMapper } from './mapper';
import { db } from '@/lib/database/connection';
import { customerService } from '@/lib/api/customers';
import { transactionService } from '@/lib/api/transactions';
import { alertService } from '@/lib/api/alerts';

/**
 * Service for integrating with Tazama Rules Engine
 */
export class TazamaService {
  /**
   * Process a transaction through the Tazama Rules Engine
   * @param transactionId The ID of the transaction to process
   * @returns The evaluation result from Tazama
   */
  async processTransaction(transactionId: string): Promise<TazamaRuleEvaluationResult | null> {
    try {
      // Fetch transaction from database
      const transaction = await transactionService.getTransactionById(transactionId);
      if (!transaction) {
        console.error(`Transaction not found: ${transactionId}`);
        return null;
      }

      // Fetch customer data
      const customer = await customerService.getCustomerById(transaction.customer_id);
      if (!customer) {
        console.error(`Customer not found: ${transaction.customer_id}`);
        return null;
      }

      // Map to Tazama models
      const tazamaTransaction = TazamaMapper.mapTransactionToTazama(transaction);
      const tazamaCustomer = TazamaMapper.mapCustomerToTazama(customer);

      // Evaluate transaction against rules
      const result = await tazamaClient.evaluateTransaction(tazamaTransaction, tazamaCustomer);

      // Process evaluation results
      await this.processEvaluationResult(result, transaction.id);

      return result;
    } catch (error) {
      console.error('Error processing transaction through Tazama:', error);
      return null;
    }
  }

  /**
   * Process a batch of transactions through the Tazama Rules Engine
   * @param transactionIds Array of transaction IDs to process
   * @returns Map of transaction IDs to evaluation results
   */
  async batchProcessTransactions(transactionIds: string[]): Promise<Record<string, TazamaRuleEvaluationResult>> {
    try {
      // Fetch transactions from database
      const transactions = await Promise.all(
        transactionIds.map(id => transactionService.getTransactionById(id))
      );
      const validTransactions = transactions.filter(t => t !== null) as any[];

      if (validTransactions.length === 0) {
        console.error('No valid transactions found');
        return {};
      }

      // Fetch customers
      const customerIds = [...new Set(validTransactions.map(t => t.customer_id))];
      const customersPromises = customerIds.map(id => customerService.getCustomerById(id));
      const customers = await Promise.all(customersPromises);
      const validCustomers = customers.filter(c => c !== null) as any[];

      // Create customer lookup map
      const customerMap: Record<string, any> = {};
      validCustomers.forEach(customer => {
        customerMap[customer.id] = customer;
      });

      // Map to Tazama models
      const tazamaTransactions = validTransactions.map(transaction => 
        TazamaMapper.mapTransactionToTazama(transaction)
      );
      
      const tazamaCustomers: Record<string, any> = {};
      validCustomers.forEach(customer => {
        tazamaCustomers[customer.id] = TazamaMapper.mapCustomerToTazama(customer);
      });

      // Batch evaluate transactions
      const results = await tazamaClient.batchEvaluateTransactions(tazamaTransactions, tazamaCustomers);

      // Process evaluation results
      for (const [transactionId, result] of Object.entries(results)) {
        const transaction = validTransactions.find(t => t.transaction_id === transactionId);
        if (transaction) {
          await this.processEvaluationResult(result, transaction.id);
        }
      }

      return results;
    } catch (error) {
      console.error('Error batch processing transactions through Tazama:', error);
      return {};
    }
  }

  /**
   * Process the evaluation result from Tazama
   * @param result The evaluation result from Tazama
   * @param transactionId The internal transaction ID
   */
  private async processEvaluationResult(result: TazamaRuleEvaluationResult, transactionId: string): Promise<void> {
    try {
      // Update transaction risk score
      if (result.risk_score !== undefined) {
        await db.query(
          'UPDATE transactions SET risk_score = $1, updated_at = NOW() WHERE id = $2',
          [result.risk_score, transactionId]
        );
      }

      // Process alerts
      if (result.alerts && result.alerts.length > 0) {
        for (const tazamaAlert of result.alerts) {
          const alertData = TazamaMapper.mapAlertFromTazama(tazamaAlert);
          
          // Check if alert already exists
          const existingAlert = await db.queryOne(
            'SELECT id FROM alerts WHERE alert_id = $1',
            [tazamaAlert.alert_id]
          );

          if (!existingAlert) {
            // Create new alert
            await alertService.createAlert({
              alert_id: alertData.alert_id!,
              customer_id: alertData.customer_id!,
              transaction_id: alertData.transaction_id,
              alert_type: alertData.alert_type!,
              severity: alertData.severity as any,
              description: alertData.description!,
              risk_score: alertData.risk_score!,
              triggered_rules: alertData.triggered_rules,
              metadata: alertData.metadata,
            });
          }
        }
      }

      // Process actions
      if (result.actions && result.actions.length > 0) {
        for (const action of result.actions) {
          switch (action.type) {
            case 'block_transaction':
              await transactionService.updateTransactionStatus(
                transactionId, 
                'blocked', 
                action.params?.reason || 'Blocked by Tazama Rules Engine'
              );
              break;
            
            case 'flag_transaction':
              await transactionService.updateTransactionStatus(
                transactionId, 
                'flagged', 
                action.params?.reason || 'Flagged by Tazama Rules Engine'
              );
              break;
              
            case 'update_customer_risk':
              if (action.params?.customer_id && action.params?.risk_rating && action.params?.risk_score) {
                await customerService.updateRiskAssessment(
                  action.params.customer_id,
                  action.params.risk_rating,
                  action.params.risk_score
                );
              }
              break;
              
            default:
              console.log(`Unhandled action type: ${action.type}`);
          }
        }
      }
    } catch (error) {
      console.error('Error processing evaluation result:', error);
    }
  }

  /**
   * Sync a customer to Tazama
   * @param customerId The ID of the customer to sync
   */
  async syncCustomer(customerId: string): Promise<boolean> {
    try {
      const customer = await customerService.getCustomerById(customerId);
      if (!customer) {
        console.error(`Customer not found: ${customerId}`);
        return false;
      }

      const tazamaCustomer = TazamaMapper.mapCustomerToTazama(customer);
      await tazamaClient.syncCustomer(tazamaCustomer);
      return true;
    } catch (error) {
      console.error('Error syncing customer to Tazama:', error);
      return false;
    }
  }

  /**
   * Batch sync customers to Tazama
   * @param customerIds Array of customer IDs to sync
   */
  async batchSyncCustomers(customerIds: string[]): Promise<boolean> {
    try {
      const customers = await Promise.all(
        customerIds.map(id => customerService.getCustomerById(id))
      );
      const validCustomers = customers.filter(c => c !== null) as any[];

      if (validCustomers.length === 0) {
        console.error('No valid customers found');
        return false;
      }

      const tazamaCustomers = validCustomers.map(customer => 
        TazamaMapper.mapCustomerToTazama(customer)
      );

      await tazamaClient.batchSyncCustomers(tazamaCustomers);
      return true;
    } catch (error) {
      console.error('Error batch syncing customers to Tazama:', error);
      return false;
    }
  }

  /**
   * Get the health status of the Tazama API
   */
  async getHealth(): Promise<{ status: string; version: string } | null> {
    try {
      return await tazamaClient.getHealth();
    } catch (error) {
      console.error('Error checking Tazama health:', error);
      return null;
    }
  }
}

// Export singleton instance
export const tazamaService = new TazamaService();