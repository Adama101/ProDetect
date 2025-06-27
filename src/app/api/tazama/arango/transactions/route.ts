import { NextRequest, NextResponse } from 'next/server';
import { arangoClient } from '@/lib/tazama/arangodb';

/**
 * GET /api/tazama/arango/transactions
 * Fetch transactions from ArangoDB
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '100');
    const customerId = searchParams.get('customer_id');
    const id = searchParams.get('id');
    
    let data;
    
    if (id) {
      // Fetch specific transaction by ID
      data = await arangoClient.getTransactionById(id);
      
      if (!data) {
        return NextResponse.json(
          { success: false, error: 'Transaction not found' },
          { status: 404 }
        );
      }
    } else if (customerId) {
      // Fetch transactions for a specific customer
      data = await arangoClient.getTransactionsByCustomerId(customerId, limit);
    } else {
      // Fetch all transactions
      data = await arangoClient.getAllTransactions(limit);
    }
    
    // Ensure we always return an array for consistent handling
    const responseData = Array.isArray(data) ? data : data ? [data] : [];
    
    return NextResponse.json({
      success: true,
      data: responseData,
    });
  } catch (error) {
    console.error('Error fetching transactions from ArangoDB:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}