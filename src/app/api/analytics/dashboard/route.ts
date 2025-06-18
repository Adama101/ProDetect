import { NextRequest, NextResponse } from 'next/server';
import { customerService } from '@/lib/api/customers';
import { transactionService } from '@/lib/api/transactions';
import { alertService } from '@/lib/api/alerts';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date');

    // Get analytics data in parallel
    const [
      customerStats,
      transactionAnalytics,
      alertAnalytics,
      alertSummary,
      highPriorityAlerts,
    ] = await Promise.all([
      customerService.getCustomerStats(),
      transactionService.getTransactionAnalytics(startDate || undefined, endDate || undefined),
      alertService.getAlertAnalytics(startDate || undefined, endDate || undefined),
      alertService.getAlertSummary(),
      alertService.getHighPriorityAlerts(5),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        customers: customerStats,
        transactions: transactionAnalytics,
        alerts: alertAnalytics,
        alertSummary,
        highPriorityAlerts,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Error fetching dashboard analytics:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch dashboard analytics' },
      { status: 500 }
    );
  }
}