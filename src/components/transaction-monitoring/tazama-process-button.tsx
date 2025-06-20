'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Zap, Loader2 } from 'lucide-react';
import { useProcessTransaction } from '@/hooks/use-tazama';
import { useToast } from '@/components/ui/use-toast';

interface TazamaProcessButtonProps {
  transactionId: string;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  onSuccess?: (result: any) => void;
}

export function TazamaProcessButton({ 
  transactionId, 
  variant = 'outline',
  size = 'sm',
  onSuccess 
}: TazamaProcessButtonProps) {
  const { processTransaction, isLoading } = useProcessTransaction({
    onSuccess: (data) => {
      if (onSuccess) {
        onSuccess(data);
      }
    }
  });
  
  const handleClick = async () => {
    await processTransaction(transactionId);
  };
  
  return (
    <Button 
      variant={variant} 
      size={size} 
      onClick={handleClick}
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 mr-1 animate-spin" />
          Processing...
        </>
      ) : (
        <>
          <Zap className="h-4 w-4 mr-1" />
          Process with Tazama
        </>
      )}
    </Button>
  );
}