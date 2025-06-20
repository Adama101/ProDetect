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
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle, CheckCircle, Flag, Eye, User, FileText } from 'lucide-react';
import { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';

interface MatchResultsTableProps {
  results: EnhanceMatchingOutput | null;
  isLoading: boolean;
}

export function MatchResultsTable({ results, isLoading }: MatchResultsTableProps) {
  const [selectedMatch, setSelectedMatch] = useState<any | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  // Function to determine badge variant based on similarity score
  const getBadgeVariant = (score: number) => {
    if (score > 0.9) return "destructive";
    if (score > 0.8) return "warning";
    if (score > 0.6) return "default";
    return "secondary";
  };

  // Function to determine risk level based on similarity score
  const getRiskLevel = (score: number) => {
    if (score > 0.9) return "Critical";
    if (score > 0.8) return "High";
    if (score > 0.6) return "Medium";
    return "Low";
  };

  // Function to handle viewing match details
  const handleViewDetails = (match: any) => {
    setSelectedMatch(match);
    setDetailsOpen(true);
  };

  // Function to handle flagging a match
  const handleFlagMatch = (match: any) => {
    // In a real implementation, this would call an API to flag the match
    console.log('Flagged match:', match);
  };

  if (isLoading) {
    return (
      <Card className="mt-8 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-foreground">Matching Results</CardTitle>
          <CardDescription>Analyzing data to find potential matches...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Processing watchlist data</span>
                <span>75%</span>
              </div>
              <Progress value={75} className="h-2" />
            </div>
            
            <div className="space-y-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
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
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <User className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-lg">No potential matches found or no search performed yet.</p>
            <p className="text-muted-foreground mt-2">Try searching with different criteria or check a different watchlist.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Sort matches by similarity score (highest first)
  const sortedMatches = [...results.enhancedMatches].sort((a, b) => b.similarityScore - a.similarityScore);

  return (
    <>
      <Card className="mt-8 shadow-lg">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <CardTitle className="text-xl font-semibold text-foreground">Matching Results</CardTitle>
              <CardDescription>
                Found {results.enhancedMatches.length} potential match(es). Review each item carefully.
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline" className="text-sm">
                {results.enhancedMatches.filter(m => m.similarityScore > 0.8).length} High-Risk Matches
              </Badge>
              <Badge variant="outline" className="text-sm">
                {results.enhancedMatches.filter(m => m.similarityScore <= 0.8).length} Low-Risk Matches
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Watchlist Name</TableHead>
                <TableHead className="w-[150px]">Similarity Score</TableHead>
                <TableHead>Risk Level</TableHead>
                <TableHead>Justification</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedMatches.map((match, index) => {
                const riskLevel = getRiskLevel(match.similarityScore);
                return (
                  <TableRow key={index} className="hover:bg-muted/50 transition-colors">
                    <TableCell className="font-medium">{match.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress 
                          value={match.similarityScore * 100} 
                          className="w-24 h-2.5"
                          indicatorClassName={
                            match.similarityScore > 0.9 ? "bg-destructive" : 
                            match.similarityScore > 0.8 ? "bg-warning" : 
                            match.similarityScore > 0.6 ? "bg-primary" : 
                            "bg-muted-foreground"
                          }
                        />
                        <Badge variant={getBadgeVariant(match.similarityScore)}>
                          {(match.similarityScore * 100).toFixed(0)}%
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getBadgeVariant(match.similarityScore)}>
                        {riskLevel === "Critical" && <AlertTriangle className="h-3 w-3 mr-1" />}
                        {riskLevel === "High" && <AlertTriangle className="h-3 w-3 mr-1" />}
                        {riskLevel === "Medium" && <AlertTriangle className="h-3 w-3 mr-1" />}
                        {riskLevel === "Low" && <CheckCircle className="h-3 w-3 mr-1" />}
                        {riskLevel}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-xs truncate">
                      {match.justification}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewDetails(match)}
                        >
                          <Eye className="h-3.5 w-3.5 mr-1" />
                          Details
                        </Button>
                        <Button 
                          variant={match.similarityScore > 0.8 ? "destructive" : "outline"} 
                          size="sm"
                          onClick={() => handleFlagMatch(match)}
                        >
                          <Flag className="h-3.5 w-3.5 mr-1" />
                          Flag
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Match Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-3xl">
          {selectedMatch && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl">Match Details</DialogTitle>
                <DialogDescription>
                  Detailed information about the potential match
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Watchlist Entity</h3>
                    <p className="text-lg font-semibold">{selectedMatch.name}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Similarity Score</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Progress 
                        value={selectedMatch.similarityScore * 100} 
                        className="w-full h-2.5"
                        indicatorClassName={
                          selectedMatch.similarityScore > 0.9 ? "bg-destructive" : 
                          selectedMatch.similarityScore > 0.8 ? "bg-warning" : 
                          selectedMatch.similarityScore > 0.6 ? "bg-primary" : 
                          "bg-muted-foreground"
                        }
                      />
                      <Badge variant={getBadgeVariant(selectedMatch.similarityScore)}>
                        {(selectedMatch.similarityScore * 100).toFixed(0)}%
                      </Badge>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Risk Level</h3>
                    <Badge variant={getBadgeVariant(selectedMatch.similarityScore)} className="mt-1">
                      {getRiskLevel(selectedMatch.similarityScore)}
                    </Badge>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Match Justification</h3>
                    <p className="text-sm mt-1">{selectedMatch.justification}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Watchlist Information</h3>
                    <div className="mt-2 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>List Type:</span>
                        <span className="font-medium">
                          {selectedMatch.name.includes("OFAC") ? "OFAC Sanctions" : 
                           selectedMatch.name.includes("UN") ? "UN Sanctions" : 
                           selectedMatch.name.includes("EU") ? "EU Sanctions" : 
                           "Internal Watchlist"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Date Added:</span>
                        <span className="font-medium">2023-05-15</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Last Updated:</span>
                        <span className="font-medium">2023-12-01</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Category:</span>
                        <span className="font-medium">
                          {selectedMatch.name.includes("Corp") || selectedMatch.name.includes("LLC") ? "Entity" : "Individual"}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Known Aliases</h3>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {selectedMatch.name.split(' ').map((part: string, i: number) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {part}
                        </Badge>
                      ))}
                      {selectedMatch.name.includes("John") && (
                        <>
                          <Badge variant="outline" className="text-xs">Johnny</Badge>
                          <Badge variant="outline" className="text-xs">J.</Badge>
                        </>
                      )}
                      {selectedMatch.name.includes("Corp") && (
                        <>
                          <Badge variant="outline" className="text-xs">Corporation</Badge>
                          <Badge variant="outline" className="text-xs">Inc</Badge>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Recommended Actions</h3>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-start gap-2 p-2 bg-muted/50 rounded-md">
                        <FileText className="h-4 w-4 text-primary mt-0.5" />
                        <p className="text-xs">Conduct enhanced due diligence</p>
                      </div>
                      <div className="flex items-start gap-2 p-2 bg-muted/50 rounded-md">
                        <User className="h-4 w-4 text-primary mt-0.5" />
                        <p className="text-xs">Verify identity with additional documentation</p>
                      </div>
                      <div className="flex items-start gap-2 p-2 bg-muted/50 rounded-md">
                        <AlertTriangle className="h-4 w-4 text-warning mt-0.5" />
                        <p className="text-xs">Escalate to compliance officer for review</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setDetailsOpen(false)}>
                  Close
                </Button>
                <Button variant="destructive">
                  <Flag className="h-4 w-4 mr-1" />
                  Flag as Match
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}