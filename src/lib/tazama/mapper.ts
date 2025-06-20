import type { Customer } from '@/lib/api/customers';
import type { Transaction } from '@/lib/api/transactions';
import type { Alert } from '@/lib/api/alerts';
import type { TazamaCustomer, TazamaTransaction, TazamaAlert } from './client';

/**
 * Maps ProDetect data models to Tazama data models and vice versa
 */
export class TazamaMapper {
  /**
   * Map a ProDetect Customer to a Tazama Customer
   */
  static mapCustomerToTazama(customer: Customer): TazamaCustomer {
    return {
      customer_id: customer.customer_id,
      first_name: customer.first_name,
      last_name: customer.last_name,
      email: customer.email,
      phone: customer.phone,
      date_of_birth: customer.date_of_birth,
      nationality: customer.nationality,
      address: customer.address,
      occupation: customer.occupation,
      risk_rating: customer.risk_rating as any,
      kyc_status: customer.kyc_status as any,
      onboarding_date: customer.onboarding_date,
      metadata: {
        pep_status: customer.pep_status,
        sanctions_match: customer.sanctions_match,
        employer: customer.employer,
        monthly_income: customer.monthly_income,
        account_status: customer.account_status,
        last_review_date: customer.last_review_date,
      },
    };
  }

  /**
   * Map a ProDetect Transaction to a Tazama Transaction
   */
  static mapTransactionToTazama(transaction: Transaction): TazamaTransaction {
    return {
      transaction_id: transaction.transaction_id,
      customer_id: transaction.customer_id,
      amount: transaction.amount,
      currency: transaction.currency,
      transaction_type: transaction.transaction_type,
      channel: transaction.channel,
      counterparty: {
        name: transaction.counterparty_name,
        account: transaction.counterparty_account,
        bank: transaction.counterparty_bank,
      },
      location: transaction.location,
      device_info: transaction.device_info,
      ip_address: transaction.ip_address,
      timestamp: transaction.created_at,
      metadata: {
        description: transaction.description,
        reference_number: transaction.reference_number,
        status: transaction.status,
        risk_score: transaction.risk_score,
        risk_factors: transaction.risk_factors,
        processed_at: transaction.processed_at,
      },
    };
  }

  /**
   * Map a Tazama Alert to a ProDetect Alert
   */
  static mapAlertFromTazama(tazamaAlert: TazamaAlert): Partial<Alert> {
    return {
      alert_id: tazamaAlert.alert_id,
      customer_id: tazamaAlert.customer_id,
      transaction_id: tazamaAlert.transaction_id,
      alert_type: tazamaAlert.alert_type,
      severity: tazamaAlert.severity as any,
      description: tazamaAlert.description,
      risk_score: tazamaAlert.risk_score,
      triggered_rules: tazamaAlert.triggered_rules,
      metadata: tazamaAlert.metadata,
      created_at: tazamaAlert.timestamp,
      updated_at: tazamaAlert.timestamp,
    };
  }

  /**
   * Map a ProDetect Alert to a Tazama Alert
   */
  static mapAlertToTazama(alert: Alert): TazamaAlert {
    return {
      alert_id: alert.alert_id,
      customer_id: alert.customer_id,
      transaction_id: alert.transaction_id,
      alert_type: alert.alert_type,
      severity: alert.severity as any,
      description: alert.description,
      risk_score: alert.risk_score,
      triggered_rules: alert.triggered_rules,
      timestamp: alert.created_at,
      metadata: alert.metadata,
    };
  }
}