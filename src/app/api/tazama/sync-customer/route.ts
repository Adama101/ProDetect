import { NextRequest, NextResponse } from 'next/server';
import { tazamaService } from '@/lib/tazama/service';

/**
 * POST /api/tazama/sync-customer
 * Sync a customer to the Tazama Rules Engine
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.customer_id) {
      return NextResponse.json(
        { success: false, error: 'Customer ID is required' },
        { status: 400 }
      );
    }

    const success = await tazamaService.syncCustomer(body.customer_id);
    
    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Failed to sync customer' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Customer synced successfully',
    });
  } catch (error) {
    console.error('Error syncing customer to Tazama:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to sync customer' },
      { status: 500 }
    );
  }
}