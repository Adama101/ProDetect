import { NextRequest, NextResponse } from 'next/server';
import { tazamaService } from '@/lib/tazama/service';

/**
 * POST /api/tazama/batch-sync-customers
 * Sync multiple customers to the Tazama Rules Engine
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.customer_ids || !Array.isArray(body.customer_ids) || body.customer_ids.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Customer IDs array is required' },
        { status: 400 }
      );
    }

    const success = await tazamaService.batchSyncCustomers(body.customer_ids);
    
    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Failed to sync customers' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Customers synced successfully',
    });
  } catch (error) {
    console.error('Error batch syncing customers to Tazama:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to sync customers' },
      { status: 500 }
    );
  }
}