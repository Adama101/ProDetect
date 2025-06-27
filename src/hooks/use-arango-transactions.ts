import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';

interface UseArangoTransactionsOptions {
  limit?: number;
  customerId?: string;
  id?: string;
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}

export function useArangoTransactions(options: UseArangoTransactionsOptions = {}) {
  const [data, setData] = useState<any[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const fetchTransactions = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Build URL with query parameters
      let url = '/api/tazama/arango/transactions';
      const params = new URLSearchParams();
      
      if (options.limit) {
        params.append('limit', options.limit.toString());
      }
      
      if (options.customerId) {
        params.append('customer_id', options.customerId);
      }
      
      if (options.id) {
        params.append('id', options.id);
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch transactions: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch transactions');
      }
      
      setData(Array.isArray(result.data) ? result.data : result.data ? [result.data] : []);
      options.onSuccess?.(result.data);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      options.onError?.(error);
      
      toast({
        title: 'Error',
        description: error.message,
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
    data,
    isLoading,
    error,
    refetch: fetchTransactions,
  };
}

export function useArangoEvaluations(options: {
  limit?: number;
  transactionId?: string;
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
} = {}) {
  const [data, setData] = useState<any[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const fetchEvaluations = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Build URL with query parameters
      let url = '/api/tazama/arango/evaluations';
      const params = new URLSearchParams();
      
      if (options.limit) {
        params.append('limit', options.limit.toString());
      }
      
      if (options.transactionId) {
        params.append('transaction_id', options.transactionId);
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch evaluations: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch evaluations');
      }
      
      setData(Array.isArray(result.data) ? result.data : result.data ? [result.data] : []);
      options.onSuccess?.(result.data);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      options.onError?.(error);
      
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [options, toast]);

  useEffect(() => {
    fetchEvaluations();
  }, [fetchEvaluations]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchEvaluations,
  };
}

export function useArangoStats(options: {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
} = {}) {
  const [data, setData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const fetchStats = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/tazama/arango/stats');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch database stats: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch database stats');
      }
      
      setData(result.data);
      options.onSuccess?.(result.data);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      options.onError?.(error);
      
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [options, toast]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchStats,
  };
}