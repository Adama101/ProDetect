import { NextRequest, NextResponse } from 'next/server';
import { arangoClient } from '@/lib/tazama/arangodb';

/**
 * GET /api/tazama/arango/stats
 * Fetch database statistics from ArangoDB
 */
export async function GET(request: NextRequest) {
  try {
    const stats = await arangoClient.getDatabaseStats();
    
    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Error fetching database statistics from ArangoDB:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch database statistics' },
      { status: 500 }
    );
  }
}