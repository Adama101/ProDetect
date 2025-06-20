import { NextRequest, NextResponse } from 'next/server';
import { tazamaService } from '@/lib/tazama/service';

/**
 * POST /api/tazama/process-transaction
 * Process a transaction through the Tazama Rules Engine
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.transaction_id) {
      return NextResponse.json(
        { success: false, error: 'Transaction ID is required' },
        { status: 400 }
      );
    }

    const result = await tazamaService.processTransaction(body.transaction_id);
    
    if (!result) {
      return NextResponse.json(
        { success: false, error: 'Failed to process transaction' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Error processing transaction through Tazama:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process transaction' },
      { status: 500 }
    );
  }
}