'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { enhanceMatching, type EnhanceMatchingInput, type EnhanceMatchingOutput } from '@/ai/flows/enhance-matching';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast'; // Corrected import path

const formSchema = z.object({
  nameToMatch: z.string().min(2, { message: 'Name to match must be at least 2 characters.' }),
  watchlistNames: z.string().min(10, { message: 'Watchlist names must be provided, separated by new lines.' }),
});

type FuzzyMatchFormValues = z.infer<typeof formSchema>;

interface FuzzyMatchFormProps {
  onResults: (results: EnhanceMatchingOutput | null) => void;
  onLoadingStateChange: (isLoading: boolean) => void;
}

export function FuzzyMatchForm({ onResults, onLoadingStateChange }: FuzzyMatchFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<FuzzyMatchFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nameToMatch: '',
      watchlistNames: '',
    },
  });

  const onSubmit: SubmitHandler<FuzzyMatchFormValues> = async (data) => {
    setIsSubmitting(true);
    onLoadingStateChange(true);
    onResults(null); // Clear previous results

    try {
      const watchlistArray = data.watchlistNames.split('\n').map(name => name.trim()).filter(name => name.length > 0);
      const input: EnhanceMatchingInput = {
        nameToMatch: data.nameToMatch,
        watchlistNames: watchlistArray,
      };
      
      const result = await enhanceMatching(input);
      onResults(result);
      toast({
        title: "Matching complete",
        description: `Found ${result.enhancedMatches.length} potential match(es).`,
      });

    } catch (error) {
      console.error('Error during fuzzy matching:', error);
      onResults(null);
      toast({
        title: "Error",
        description: "Failed to perform fuzzy matching. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      onLoadingStateChange(false);
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-foreground">AI-Powered Fuzzy Matching</CardTitle>
        <CardDescription>Enter a name and a list of watchlist names (one per line) to find potential matches. Supports sanctions and watchlist screening (e.g., OFAC, UN, EU).</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="nameToMatch"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="nameToMatch">Name to Match</FormLabel>
                  <FormControl>
                    <Input id="nameToMatch" placeholder="e.g., Jonh Smit / Acme Corp International" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="watchlistNames"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="watchlistNames">Watchlist Names (one per line)</FormLabel>
                  <FormControl>
                    <Textarea
                      id="watchlistNames"
                      placeholder="e.g., John Smith\nJonathan Smythe\nJon Smithe\nAcme Corporation\nACME Intl."
                      rows={8}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Screening...
                </>
              ) : (
                'Screen Name'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
