import { NextRequest, NextResponse } from 'next/server';
import { tazamaService } from '@/lib/tazama/service';

/**
 * GET /api/tazama/health
 * Check the health status of the Tazama integration
 */
export async function GET(request: NextRequest) {
  try {
    const health = await tazamaService.getHealth();
    
    if (!health) {
      return NextResponse.json(
        { success: false, error: 'Tazama service is unavailable' },
        { status: 503 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: health,
    });
  } catch (error) {
    console.error('Error checking Tazama health:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to check Tazama health status' },
      { status: 500 }
    );
  }
}