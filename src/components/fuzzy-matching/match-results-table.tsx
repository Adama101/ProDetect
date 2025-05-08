import type { EnhanceMatchingOutput } from '@/ai/flows/enhance-matching';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface MatchResultsTableProps {
  results: EnhanceMatchingOutput | null;
  isLoading: boolean;
}

export function MatchResultsTable({ results, isLoading }: MatchResultsTableProps) {
  if (isLoading) {
    return (
      <Card className="mt-8 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-foreground">Matching Results</CardTitle>
          <CardDescription>Analyzing data to find potential matches...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-40">
            <p className="text-muted-foreground">Loading results...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!results || results.enhancedMatches.length === 0) {
    return (
       <Card className="mt-8 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-foreground">Matching Results</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No potential matches found or no search performed yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-8 shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-foreground">Matching Results</CardTitle>
        <CardDescription>
          Found {results.enhancedMatches.length} potential match(es). Review each item carefully.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Watchlist Name</TableHead>
              <TableHead className="w-[150px]">Similarity Score</TableHead>
              <TableHead>Justification</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {results.enhancedMatches.map((match, index) => (
              <TableRow key={index} className="hover:bg-muted/50 transition-colors">
                <TableCell className="font-medium">{match.name}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress value={match.similarityScore * 100} className="w-24 h-2.5" />
                    <Badge variant={match.similarityScore > 0.8 ? "destructive" : match.similarityScore > 0.6 ? "default" : "secondary"}>
                      {(match.similarityScore * 100).toFixed(0)}%
                    </Badge>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{match.justification}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}