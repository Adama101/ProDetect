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
import { Loader2, Search, Database, Shield } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const formSchema = z.object({
  nameToMatch: z.string().min(2, { message: 'Name to match must be at least 2 characters.' }),
  watchlistNames: z.string().min(10, { message: 'Watchlist names must be provided, separated by new lines.' }),
  searchType: z.enum(['manual', 'database']),
  databaseType: z.enum(['internal', 'ofac', 'un', 'eu', 'all']).optional(),
});

type FuzzyMatchFormValues = z.infer<typeof formSchema>;

interface FuzzyMatchFormProps {
  onResults: (results: EnhanceMatchingOutput | null) => void;
  onLoadingStateChange: (isLoading: boolean) => void;
}

// Sample watchlist data for different databases
const sampleWatchlists = {
  internal: [
    "John Trump", "Johnny Trump", "J. Trump", "Jon Trump",
    "Ahmed Hassan", "A. Hassan", "Hassan Ahmed",
    "Suspicious Entity Corp", "SE Corp", "Suspicious Corp"
  ],
  ofac: [
    "Abdul Qadir", "Abdul Qadeer", "A. Qadir",
    "Global Trading LLC", "Global Trade Co", "GlobalTrade",
    "Mohammed Al-Farsi", "M. Al Farsi", "Mohammad Alfarsi",
    "Eastern Shipping Company", "East Ship Co", "E. Shipping"
  ],
  un: [
    "Ibrahim Al-Asiri", "Ibrahim Asiri", "I. Al-Asiri",
    "Northern Resources Ltd", "North Resources", "NRL Holdings",
    "Tariq Ahmed", "T. Ahmed", "Tarik Ahmad",
    "Western Investment Group", "W. Investment", "WIG International"
  ],
  eu: [
    "Viktor Petrov", "V. Petrov", "Victor Petrov",
    "Caspian Energy Solutions", "Caspian Energy", "CES Group",
    "Dimitri Sokolov", "D. Sokolov", "Dmitri Sokolov",
    "Mediterranean Shipping SA", "Med Shipping", "MSA Group"
  ]
};

export function FuzzyMatchForm({ onResults, onLoadingStateChange }: FuzzyMatchFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchType, setSearchType] = useState<'manual' | 'database'>('manual');
  const { toast } = useToast();

  const form = useForm<FuzzyMatchFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nameToMatch: '',
      watchlistNames: '',
      searchType: 'manual',
      databaseType: 'all',
    },
  });

  const watchSearchType = form.watch('searchType');
  const watchDatabaseType = form.watch('databaseType');

  // Update form when search type changes
  const handleSearchTypeChange = (value: 'manual' | 'database') => {
    setSearchType(value);
    form.setValue('searchType', value);
    
    // Clear watchlist names if switching to database search
    if (value === 'database') {
      form.setValue('watchlistNames', '');
    }
  };

  // Update watchlist names when database type changes
  const handleDatabaseTypeChange = (value: string) => {
    form.setValue('databaseType', value as any);
    
    if (value === 'all') {
      const allNames = [
        ...sampleWatchlists.internal,
        ...sampleWatchlists.ofac,
        ...sampleWatchlists.un,
        ...sampleWatchlists.eu
      ].join('\n');
      form.setValue('watchlistNames', allNames);
    } else {
      const names = sampleWatchlists[value as keyof typeof sampleWatchlists].join('\n');
      form.setValue('watchlistNames', names);
    }
  };

  const onSubmit: SubmitHandler<FuzzyMatchFormValues> = async (data) => {
    setIsSubmitting(true);
    onLoadingStateChange(true);
    onResults(null); // Clear previous results

    try {
      // If database search, populate watchlist from selected database
      if (data.searchType === 'database' && data.databaseType) {
        if (data.databaseType === 'all') {
          data.watchlistNames = [
            ...sampleWatchlists.internal,
            ...sampleWatchlists.ofac,
            ...sampleWatchlists.un,
            ...sampleWatchlists.eu
          ].join('\n');
        } else {
          data.watchlistNames = sampleWatchlists[data.databaseType as keyof typeof sampleWatchlists].join('\n');
        }
      }

      const watchlistArray = data.watchlistNames.split('\n').map(name => name.trim()).filter(name => name.length > 0);
      const input: EnhanceMatchingInput = {
        nameToMatch: data.nameToMatch,
        watchlistNames: watchlistArray,
      };
      
      const result = await enhanceMatching(input);
      onResults(result);
      
      const matchCount = result.enhancedMatches.length;
      const highRiskMatches = result.enhancedMatches.filter(match => match.similarityScore > 0.8).length;
      
      toast({
        title: "Matching complete",
        description: `Found ${matchCount} potential match(es), including ${highRiskMatches} high-risk match(es).`,
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
                    <Input id="nameToMatch" placeholder="e.g., John Smith / Acorn Corp International" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="searchType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Search Type</FormLabel>
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      type="button"
                      variant={watchSearchType === 'manual' ? 'default' : 'outline'}
                      className="flex items-center justify-center gap-2"
                      onClick={() => handleSearchTypeChange('manual')}
                    >
                      <Search className="h-4 w-4" />
                      Manual Entry
                    </Button>
                    <Button
                      type="button"
                      variant={watchSearchType === 'database' ? 'default' : 'outline'}
                      className="flex items-center justify-center gap-2"
                      onClick={() => handleSearchTypeChange('database')}
                    >
                      <Database className="h-4 w-4" />
                      Database Search
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {watchSearchType === 'database' && (
              <FormField
                control={form.control}
                name="databaseType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Watchlist Database</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={handleDatabaseTypeChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select database" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Databases</SelectItem>
                        <SelectItem value="internal">Internal Watchlist</SelectItem>
                        <SelectItem value="ofac">OFAC Sanctions List</SelectItem>
                        <SelectItem value="un">UN Sanctions List</SelectItem>
                        <SelectItem value="eu">EU Sanctions List</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {watchSearchType === 'manual' && (
              <FormField
                control={form.control}
                name="watchlistNames"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="watchlistNames">Watchlist Names (one per line)</FormLabel>
                    <FormControl>
                      <Textarea
                        id="watchlistNames"
                        placeholder="e.g., John Smith\nJonathan Smythe\nJon Smithe\nAcor Corporation\nACOR Intl."
                        rows={8}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Screening...
                </>
              ) : (
                <>
                  <Shield className="mr-2 h-4 w-4" />
                  Screen Name
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}