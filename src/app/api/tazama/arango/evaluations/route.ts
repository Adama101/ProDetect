import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

// ArangoDB connection configuration
const ARANGO_URL = process.env.ARANGO_URL || 'http://ec2-13-50-232-194.eu-north-1.compute.amazonaws.com:18529';
const ARANGO_DB = process.env.ARANGO_DB || 'evaluationResults';
const ARANGO_USERNAME = process.env.ARANGO_USERNAME || 'root';
const ARANGO_PASSWORD = process.env.ARANGO_PASSWORD || '';

/**
 * GET /api/tazama/arango/evaluations
 * Fetch evaluation results from ArangoDB
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '100');
    const transactionId = searchParams.get('transaction_id');
    
    // Build AQL query based on parameters
    let aqlQuery = 'FOR doc IN evaluationResults';
    const bindVars: Record<string, any> = {};
    
    if (transactionId) {
      aqlQuery += ' FILTER doc.transaction_id == @transactionId';
      bindVars.transactionId = transactionId;
    }
    
    aqlQuery += ' SORT doc.timestamp DESC LIMIT @limit RETURN doc';
    bindVars.limit = limit;
    
    console.log('Executing AQL query for evaluations:', aqlQuery, bindVars);
    
    // Make request to ArangoDB
    const response = await axios.post(
      `${ARANGO_URL}/_api/cursor`,
      {
        query: aqlQuery,
        bindVars,
        batchSize: limit
      },
      {
        auth: {
          username: ARANGO_USERNAME,
          password: ARANGO_PASSWORD
        },
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );
    
    console.log('ArangoDB evaluations response:', response.status, response.statusText);
    
    // Return the results
    return NextResponse.json({
      success: true,
      data: response.data.result || [],
    });
  } catch (error) {
    console.error('Error fetching evaluation results from ArangoDB:', error);
    
    // Provide more detailed error information
    let errorMessage = 'Failed to fetch evaluation results';
    if (axios.isAxiosError(error)) {
      errorMessage = error.response?.data?.errorMessage || error.message;
      console.error('Axios error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      });
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}