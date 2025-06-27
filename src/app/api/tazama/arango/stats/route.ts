import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

// ArangoDB connection configuration
const ARANGO_URL = process.env.ARANGO_URL || 'http://ec2-13-50-232-194.eu-north-1.compute.amazonaws.com:18529';
const ARANGO_DB = process.env.ARANGO_DB || 'evaluationResults';
const ARANGO_USERNAME = process.env.ARANGO_USERNAME || 'root';
const ARANGO_PASSWORD = process.env.ARANGO_PASSWORD || '';

/**
 * GET /api/tazama/arango/stats
 * Fetch database statistics from ArangoDB
 */
export async function GET(request: NextRequest) {
  try {
    // Get collections
    const collectionsResponse = await axios.get(
      `${ARANGO_URL}/_db/${ARANGO_DB}/_api/collection`,
      {
        auth: {
          username: ARANGO_USERNAME,
          password: ARANGO_PASSWORD
        }
      }
    );
    
    const collections = collectionsResponse.data.result || [];
    const userCollections = collections.filter((c: any) => !c.name.startsWith('_'));
    
    // Get count for each collection
    const stats: Record<string, number> = {};
    
    for (const collection of userCollections) {
      try {
        const countResponse = await axios.get(
          `${ARANGO_URL}/_db/${ARANGO_DB}/_api/collection/${collection.name}/count`,
          {
            auth: {
              username: ARANGO_USERNAME,
              password: ARANGO_PASSWORD
            }
          }
        );
        
        stats[collection.name] = countResponse.data.count || 0;
      } catch (countError) {
        console.warn(`Error getting count for collection ${collection.name}:`, countError);
        stats[collection.name] = 0;
      }
    }
    
    return NextResponse.json({
      success: true,
      data: {
        collections: userCollections.length,
        stats,
        version: '3.11.1' // Hardcoded version from the screenshot
      },
    });
  } catch (error) {
    console.error('Error fetching database statistics from ArangoDB:', error);
    
    // Provide more detailed error information
    let errorMessage = 'Failed to fetch database statistics';
    if (axios.isAxiosError(error)) {
      errorMessage = error.response?.data?.errorMessage || error.message;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}