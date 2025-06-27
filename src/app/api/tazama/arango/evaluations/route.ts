import { NextRequest, NextResponse } from 'next/server';
import { arangoClient } from '@/lib/tazama/arangodb';

/**
 * GET /api/tazama/arango/evaluations
 * Fetch evaluation results from ArangoDB
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '100');
    const transactionId = searchParams.get('transaction_id');
    
    let data;
    
    if (transactionId) {
      // Fetch evaluation results for a specific transaction
      data = await arangoClient.getEvaluationResultsByTransactionId(transactionId);
    } else {
      // Fetch all evaluation results
      data = await arangoClient.getAllEvaluationResults(limit);
    }
    
    // Ensure we always return an array for consistent handling
    const responseData = Array.isArray(data) ? data : data ? [data] : [];
    
    return NextResponse.json({
      success: true,
      data: responseData,
    });
  } catch (error) {
    console.error('Error fetching evaluation results from ArangoDB:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch evaluation results' },
      { status: 500 }
    );
  }
}