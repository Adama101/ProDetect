import { useState, useEffect, useCallback } from 'react';
import { arangoClient, ArangoTransaction } from '@/lib/tazama/arango-client';
import { useToast } from '@/components/ui/use-toast';

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
      
      const data = await arangoClient.getTransactions({
        limit: options.limit,
        offset: options.offset,
        sortBy: options.sortBy,
        sortOrder: options.sortOrder,
        filters: options.filters,
      });
      
      setTransactions(data);
      options.onSuccess?.(data);
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
      
      const data = await arangoClient.getTransactionById(id);
      setTransaction(data);
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