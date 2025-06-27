'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useArangoTransactions, useArangoEvaluations, useArangoStats } from '@/hooks/use-arango-transactions';
import { Database, Search, Filter, RefreshCw, Download, Eye, Activity, BarChart3, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function TazamaDataPage() {
  const [transactionId, setTransactionId] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [limit, setLimit] = useState(20);
  const [activeTab, setActiveTab] = useState('transactions');
  
  const { 
    data: transactions, 
    isLoading: transactionsLoading, 
    error: transactionsError,
    refetch: refetchTransactions
  } = useArangoTransactions({ limit });
  
  const {
    data: evaluations,
    isLoading: evaluationsLoading,
    error: evaluationsError,
    refetch: refetchEvaluations
  } = useArangoEvaluations({ limit });
  
  const {
    data: stats,
    isLoading: statsLoading,
    error: statsError,
    refetch: refetchStats
  } = useArangoStats();

  const handleSearch = () => {
    if (transactionId) {
      // Fetch specific transaction
      refetchTransactions();
    } else if (customerId) {
      // Fetch transactions for customer
      refetchTransactions();
    } else {
      // Fetch all transactions
      refetchTransactions();
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Tazama ArangoDB Data</h1>
          <p className="text-muted-foreground mt-1">
            Direct access to Tazama's ArangoDB transaction and evaluation data
          </p>
        </div>
        <Button 
          variant="outline"
          onClick={() => {
            refetchTransactions();
            refetchEvaluations();
            refetchStats();
          }}
          className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20 hover:from-primary/20 hover:to-accent/20 transition-all duration-300"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh Data
        </Button>
      </header>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-foreground">Database Statistics</CardTitle>
          <CardDescription>Overview of ArangoDB collections and document counts</CardDescription>
        </CardHeader>
        <CardContent>
          {statsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : statsError ? (
            <div className="p-4 text-center text-destructive">
              <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
              <p>Error loading database statistics</p>
            </div>
          ) : stats ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <h3 className="text-sm font-medium text-muted-foreground flex items-center">
                  <Database className="mr-2 h-4 w-4" /> Collections
                </h3>
                <p className="text-2xl font-bold">{stats.collections || 0}</p>
              </div>
              
              {stats.stats && Object.entries(stats.stats).map(([collection, count]) => (
                <div key={collection} className="p-4 border rounded-lg">
                  <h3 className="text-sm font-medium text-muted-foreground">{collection}</h3>
                  <p className="text-2xl font-bold">{count}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              <Database className="h-8 w-8 mx-auto mb-2" />
              <p>No statistics available</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-xl font-semibold text-foreground">Search Transactions</CardTitle>
              <CardDescription>Search for specific transactions or view all transactions</CardDescription>
            </div>
            <div className="flex gap-2 flex-wrap">
              <div className="relative sm:w-auto w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Transaction ID..."
                  className="pl-10 w-full sm:w-48"
                  value={transactionId}
                  onChange={(e) => {
                    setTransactionId(e.target.value);
                    setCustomerId(''); // Clear customer ID when transaction ID is entered
                  }}
                />
              </div>
              <div className="relative sm:w-auto w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Customer ID..."
                  className="pl-10 w-full sm:w-48"
                  value={customerId}
                  onChange={(e) => {
                    setCustomerId(e.target.value);
                    setTransactionId(''); // Clear transaction ID when customer ID is entered
                  }}
                />
              </div>
              <div className="relative sm:w-auto w-full">
                <Label htmlFor="limit" className="sr-only">Limit</Label>
                <Input
                  id="limit"
                  type="number"
                  placeholder="Limit..."
                  className="w-full sm:w-24"
                  value={limit}
                  onChange={(e) => setLimit(parseInt(e.target.value) || 20)}
                  min={1}
                  max={1000}
                />
              </div>
              <Button onClick={handleSearch}>
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="evaluations">Evaluations</TabsTrigger>
            </TabsList>
            
            <TabsContent value="transactions" className="space-y-4 mt-4">
              {transactionsLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                </div>
              ) : transactionsError ? (
                <div className="p-4 text-center text-destructive">
                  <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
                  <p>Error loading transactions</p>
                </div>
              ) : transactions && transactions.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Transaction ID</TableHead>
                        <TableHead>Customer ID</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Risk Score</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactions.map((transaction, index) => (
                        <TableRow key={transaction._key || index}>
                          <TableCell className="font-medium">{transaction._key || transaction.transaction_id}</TableCell>
                          <TableCell>{transaction.customer_id}</TableCell>
                          <TableCell>
                            {transaction.amount} {transaction.currency || 'USD'}
                          </TableCell>
                          <TableCell>{transaction.transaction_type}</TableCell>
                          <TableCell>
                            <Badge variant={
                              transaction.status === 'completed' ? 'outline' :
                              transaction.status === 'pending' ? 'secondary' :
                              transaction.status === 'flagged' ? 'warning' :
                              transaction.status === 'blocked' ? 'destructive' :
                              'default'
                            }>
                              {transaction.status || 'Unknown'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={
                              (transaction.risk_score || 0) > 80 ? 'destructive' :
                              (transaction.risk_score || 0) > 60 ? 'warning' :
                              'outline'
                            }>
                              {transaction.risk_score || 'N/A'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(transaction.timestamp || transaction.created_at).toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" onClick={() => {
                              setTransactionId(transaction._key || transaction.transaction_id);
                              handleSearch();
                            }}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="p-4 text-center text-muted-foreground">
                  <Activity className="h-8 w-8 mx-auto mb-2" />
                  <p>No transactions found</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="evaluations" className="space-y-4 mt-4">
              {evaluationsLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                </div>
              ) : evaluationsError ? (
                <div className="p-4 text-center text-destructive">
                  <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
                  <p>Error loading evaluations</p>
                </div>
              ) : evaluations && evaluations.length > 0 ? (
                <div className="space-y-4">
                  {evaluations.map((evaluation, index) => (
                    <Card key={evaluation._key || index} className="overflow-hidden">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-center">
                          <div>
                            <CardTitle className="text-base">
                              Evaluation {evaluation._key || index + 1}
                            </CardTitle>
                            <CardDescription>
                              Transaction: {evaluation.transaction_id}
                            </CardDescription>
                          </div>
                          <Badge variant={
                            (evaluation.risk_score || 0) > 80 ? 'destructive' :
                            (evaluation.risk_score || 0) > 60 ? 'warning' :
                            'outline'
                          }>
                            Risk: {evaluation.risk_score || 'N/A'}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-3">
                        <div className="space-y-3">
                          {evaluation.triggered_rules && evaluation.triggered_rules.length > 0 && (
                            <div>
                              <Label className="text-sm font-medium">Triggered Rules</Label>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {evaluation.triggered_rules.map((rule: string, i: number) => (
                                  <Badge key={i} variant="secondary">{rule}</Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {evaluation.alerts && evaluation.alerts.length > 0 && (
                            <div>
                              <Label className="text-sm font-medium">Alerts</Label>
                              <div className="space-y-2 mt-1">
                                {evaluation.alerts.map((alert: any, i: number) => (
                                  <div key={i} className="p-2 bg-muted/50 rounded-md">
                                    <div className="flex justify-between items-center">
                                      <span className="font-medium">{alert.alert_type || 'Alert'}</span>
                                      <Badge variant={
                                        (alert.severity === 'critical') ? 'destructive' :
                                        (alert.severity === 'high') ? 'warning' :
                                        (alert.severity === 'medium') ? 'secondary' :
                                        'outline'
                                      }>
                                        {alert.severity || 'Unknown'}
                                      </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-1">{alert.description}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {evaluation.actions && evaluation.actions.length > 0 && (
                            <div>
                              <Label className="text-sm font-medium">Actions</Label>
                              <div className="space-y-2 mt-1">
                                {evaluation.actions.map((action: any, i: number) => (
                                  <div key={i} className="flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4 text-success" />
                                    <span>{action.type}</span>
                                    {action.params && (
                                      <span className="text-sm text-muted-foreground">
                                        {JSON.stringify(action.params)}
                                      </span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          <div>
                            <Label className="text-sm font-medium">Timestamp</Label>
                            <p className="text-sm">
                              {new Date(evaluation.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-muted-foreground">
                  <BarChart3 className="h-8 w-8 mx-auto mb-2" />
                  <p>No evaluation results found</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}