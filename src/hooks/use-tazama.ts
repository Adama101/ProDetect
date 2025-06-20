import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';

interface UseTazamaOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}

export function useTazamaHealth(options?: UseTazamaOptions) {
  const [data, setData] = useState<{ status: string; version: string } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const fetchHealth = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/tazama/health');
      
      if (!response.ok) {
        throw new Error(`Failed to check Tazama health: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to check Tazama health');
      }
      
      setData(result.data);
      options?.onSuccess?.(result.data);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      options?.onError?.(error);
      
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [options, toast]);

  return {
    data,
    isLoading,
    error,
    fetchHealth,
  };
}

export function useProcessTransaction(options?: UseTazamaOptions) {
  const [data, setData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const processTransaction = useCallback(async (transactionId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/tazama/process-transaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ transaction_id: transactionId }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to process transaction: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to process transaction');
      }
      
      setData(result.data);
      options?.onSuccess?.(result.data);
      
      toast({
        title: 'Transaction Processed',
        description: 'Transaction has been successfully processed through Tazama.',
      });
      
      return result.data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      options?.onError?.(error);
      
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
      
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [options, toast]);

  return {
    data,
    isLoading,
    error,
    processTransaction,
  };
}

export function useBatchProcessTransactions(options?: UseTazamaOptions) {
  const [data, setData] = useState<Record<string, any> | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const batchProcessTransactions = useCallback(async (transactionIds: string[]) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/tazama/batch-process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ transaction_ids: transactionIds }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to batch process transactions: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to batch process transactions');
      }
      
      setData(result.data);
      options?.onSuccess?.(result.data);
      
      toast({
        title: 'Transactions Processed',
        description: `Successfully processed ${Object.keys(result.data).length} transactions through Tazama.`,
      });
      
      return result.data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      options?.onError?.(error);
      
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
      
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [options, toast]);

  return {
    data,
    isLoading,
    error,
    batchProcessTransactions,
  };
}

export function useSyncCustomer(options?: UseTazamaOptions) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const syncCustomer = useCallback(async (customerId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/tazama/sync-customer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ customer_id: customerId }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to sync customer: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to sync customer');
      }
      
      options?.onSuccess?.(result);
      
      toast({
        title: 'Customer Synced',
        description: 'Customer has been successfully synced to Tazama.',
      });
      
      return true;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      options?.onError?.(error);
      
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
      
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [options, toast]);

  return {
    isLoading,
    error,
    syncCustomer,
  };
}

export function useBatchSyncCustomers(options?: UseTazamaOptions) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const batchSyncCustomers = useCallback(async (customerIds: string[]) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/tazama/batch-sync-customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ customer_ids: customerIds }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to batch sync customers: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to batch sync customers');
      }
      
      options?.onSuccess?.(result);
      
      toast({
        title: 'Customers Synced',
        description: `Successfully synced ${customerIds.length} customers to Tazama.`,
      });
      
      return true;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      options?.onError?.(error);
      
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
      
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [options, toast]);

  return {
    isLoading,
    error,
    batchSyncCustomers,
  };
}