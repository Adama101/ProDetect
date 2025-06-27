import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useToast } from '@/components/ui/use-toast';

export interface ArangoTransaction {
  _id?: string;
  _key?: string;
  transaction_id?: string;
  customer_id?: string;
  amount?: number;
  currency?: string;
  transaction_type?: string;
  channel?: string;
  counterparty?: {
    name?: string;
    account?: string;
    bank?: string;
  };
  status?: string;
  risk_score?: number;
  risk_factors?: string[];
  timestamp?: string;
  metadata?: Record<string, any>;
}

interface UseArangoTransactionsOptions {
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  filters?: Record<string, any>;
  onSuccess?: (data: ArangoTransaction[]) => void;
  onError?: (error: Error) => void;
}

export function useArangoTransactions(options: UseArangoTransactionsOptions = {}) {
  const [transactions, setTransactions] = useState<ArangoTransaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const fetchTransactions = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Build query parameters
      const params = new URLSearchParams();
      if (options.limit) params.append('limit', options.limit.toString());
      if (options.filters?.customer_id) params.append('customer_id', options.filters.customer_id);
      if (options.filters?.id) params.append('id', options.filters.id);
      
      // Fetch transactions from our API endpoint
      const response = await axios.get(`/api/tazama/arango/transactions?${params.toString()}`);
      
      if (response.data.success) {
        setTransactions(response.data.data || []);
        options.onSuccess?.(response.data.data || []);
      } else {
        throw new Error(response.data.error || 'Failed to fetch transactions');
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      options.onError?.(error);
      
      toast({
        title: 'Error',
        description: `Failed to fetch transactions: ${error.message}`,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [options, toast]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return {
    transactions,
    isLoading,
    error,
    refetch: fetchTransactions,
  };
}

export function useArangoTransaction(id: string) {
  const [transaction, setTransaction] = useState<ArangoTransaction | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const fetchTransaction = useCallback(async () => {
    if (!id) {
      setTransaction(null);
      setIsLoading(false);
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await axios.get(`/api/tazama/arango/transactions?id=${id}`);
      
      if (response.data.success && response.data.data && response.data.data.length > 0) {
        setTransaction(response.data.data[0]);
      } else {
        throw new Error(response.data.error || 'Transaction not found');
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      
      toast({
        title: 'Error',
        description: `Failed to fetch transaction: ${error.message}`,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [id, toast]);

  useEffect(() => {
    fetchTransaction();
  }, [fetchTransaction]);

  return {
    transaction,
    isLoading,
    error,
    refetch: fetchTransaction,
  };
}