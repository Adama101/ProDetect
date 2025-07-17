// app/api/transactions/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { arangoTransactionService } from '@/lib/database/arangoTransactionService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const status = searchParams.get('status') || 'all';
    const searchTerm = searchParams.get('search') || '';
    const dateFrom = searchParams.get('dateFrom') ? new Date(searchParams.get('dateFrom')!) : undefined;
    const dateTo = searchParams.get('dateTo') ? new Date(searchParams.get('dateTo')!) : undefined;
    
    // Fetch transactions from ArangoDB
    const [transactions, totalCount] = await Promise.all([
      arangoTransactionService.getTransactions({
        limit,
        offset,
        status: status !== 'all' ? status : undefined,
        searchTerm: searchTerm || undefined,
        dateFrom,
        dateTo
      }),
      arangoTransactionService.getTransactionCount({
        status: status !== 'all' ? status : undefined,
        searchTerm: searchTerm || undefined,
        dateFrom,
        dateTo
      })
    ]);
    
    // Transform to UI format
    const transformedTransactions = transactions.map(doc => 
      arangoTransactionService.transformToUITransaction(doc)
    );
    
    return NextResponse.json({
      transactions: transformedTransactions,
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + limit < totalCount
      }
    });
    
  } catch (error) {
    console.error('Error in transactions API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}

// POST endpoint for processing transactions through Tazama
export async function POST(request: NextRequest) {
  try {
    const { transactionIds, batchProcess } = await request.json();
    
    if (batchProcess && Array.isArray(transactionIds)) {
      // Use your existing Tazama service for batch processing
      const { tazamaService } = await import('@/lib/tazama/service');
      const results = await tazamaService.batchProcessTransactions(transactionIds);
      
      return NextResponse.json({ results });
    } else if (transactionIds) {
      // Process single transaction
      const { tazamaService } = await import('@/lib/tazama/service');
      const result = await tazamaService.processTransaction(transactionIds);
      
      return NextResponse.json({ result });
    }
    
    return NextResponse.json(
      { error: 'Invalid request parameters' },
      { status: 400 }
    );
    
  } catch (error) {
    console.error('Error processing transactions:', error);
    return NextResponse.json(
      { error: 'Failed to process transactions' },
      { status: 500 }
    );
  }
}