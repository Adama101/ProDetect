'use client';

import { useState, useEffect } from 'react';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

interface UseApiOptions {
  immediate?: boolean;
  dependencies?: any[];
}

export function useApi<T>(
  url: string,
  options: UseApiOptions = {}
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<ApiResponse<T>['pagination'] | null>(null);

  const { immediate = true, dependencies = [] } = options;

  const fetchData = async (customUrl?: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(customUrl || url);
      const result: ApiResponse<T> = await response.json();

      if (result.success) {
        setData(result.data || null);
        setPagination(result.pagination || null);
      } else {
        setError(result.error || 'An error occurred');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error');
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => fetchData();

  useEffect(() => {
    if (immediate) {
      fetchData();
    }
  }, [url, immediate, ...dependencies]);

  return {
    data,
    loading,
    error,
    pagination,
    refetch,
    fetchData,
  };
}

export function useApiMutation<T, P = any>() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = async (
    url: string,
    options: {
      method?: 'POST' | 'PUT' | 'DELETE' | 'PATCH';
      body?: P;
      headers?: Record<string, string>;
    } = {}
  ): Promise<T | null> => {
    setLoading(true);
    setError(null);

    try {
      const { method = 'POST', body, headers = {} } = options;

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      const result: ApiResponse<T> = await response.json();

      if (result.success) {
        return result.data || null;
      } else {
        setError(result.error || 'An error occurred');
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Network error';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    mutate,
    loading,
    error,
  };
}

// Specific hooks for common API operations
export function useCustomers(options: {
  page?: number;
  limit?: number;
  search?: string;
  risk_rating?: string;
  kyc_status?: string;
} = {}) {
  const queryParams = new URLSearchParams();
  Object.entries(options).forEach(([key, value]) => {
    if (value !== undefined) {
      queryParams.append(key, value.toString());
    }
  });

  const url = `/api/customers?${queryParams.toString()}`;
  
  return useApi(url, {
    dependencies: [JSON.stringify(options)],
  });
}

export function useTransactions(options: {
  page?: number;
  limit?: number;
  customer_id?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
} = {}) {
  const queryParams = new URLSearchParams();
  Object.entries(options).forEach(([key, value]) => {
    if (value !== undefined) {
      queryParams.append(key, value.toString());
    }
  });

  const url = `/api/transactions?${queryParams.toString()}`;
  
  return useApi(url, {
    dependencies: [JSON.stringify(options)],
  });
}

export function useAlerts(options: {
  page?: number;
  limit?: number;
  customer_id?: string;
  status?: string;
  severity?: string;
} = {}) {
  const queryParams = new URLSearchParams();
  Object.entries(options).forEach(([key, value]) => {
    if (value !== undefined) {
      queryParams.append(key, value.toString());
    }
  });

  const url = `/api/alerts?${queryParams.toString()}`;
  
  return useApi(url, {
    dependencies: [JSON.stringify(options)],
  });
}

export function useDashboardAnalytics(dateRange?: {
  start_date?: string;
  end_date?: string;
}) {
  const queryParams = new URLSearchParams();
  if (dateRange?.start_date) queryParams.append('start_date', dateRange.start_date);
  if (dateRange?.end_date) queryParams.append('end_date', dateRange.end_date);

  const url = `/api/analytics/dashboard?${queryParams.toString()}`;
  
  return useApi(url, {
    dependencies: [JSON.stringify(dateRange)],
  });
}