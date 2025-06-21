import { NextRequest, NextResponse } from 'next/server';
import { tazamaService } from '@/lib/tazama/service';

/**
 * POST /api/tazama/batch-process
 * Process multiple transactions through the Tazama Rules Engine
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.transaction_ids || !Array.isArray(body.transaction_ids) || body.transaction_ids.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Transaction IDs array is required' },
        { status: 400 }
      );
    }

    const results = await tazamaService.batchProcessTransactions(body.transaction_ids);
    
    return NextResponse.json({
      success: true,
      data: results,
    });
  } catch (error) {
    console.error('Error batch processing transactions through Tazama:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to batch process transactions' },
      { status: 500 }
    );
  }
}