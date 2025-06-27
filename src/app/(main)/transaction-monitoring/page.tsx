"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Eye,
  Filter,
  Search,
  CalendarDays,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Loader2,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { TransactionDetailsModal } from "@/components/transaction-monitoring/transaction-details-modal";
import { useArangoTransactions } from "@/hooks/use-arango-transactions";
import { ArangoTransaction } from "@/lib/tazama/arango-client";

export default function TransactionMonitoringPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedTransaction, setSelectedTransaction] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filteredTransactions, setFilteredTransactions] = useState<ArangoTransaction[]>([]);

  // Fetch transactions from ArangoDB
  const { transactions, isLoading, error, refetch } = useArangoTransactions({
    limit: 50,
    sortBy: 'timestamp',
    sortOrder: 'DESC',
  });

  useEffect(() => {
    let currentTransactions = [...transactions];
    
    if (searchTerm) {
      currentTransactions = currentTransactions.filter(
        (t) =>
          t._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.customer_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.transaction_id?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (dateRange.from) {
      currentTransactions = currentTransactions.filter(
        (t) => t.timestamp && new Date(t.timestamp) >= dateRange.from!
      );
    }
    
    if (dateRange.to) {
      const toDate = new Date(dateRange.to);
      toDate.setHours(23, 59, 59, 999); // Include the whole 'to' day
      currentTransactions = currentTransactions.filter(
        (t) => t.timestamp && new Date(t.timestamp) <= toDate
      );
    }
    
    if (statusFilter !== "all" && statusFilter) {
      currentTransactions = currentTransactions.filter(
        (t) => t.status === statusFilter
      );
    }
    
    setFilteredTransactions(currentTransactions);
  }, [searchTerm, dateRange, statusFilter, transactions]);

  const totalTransactions = transactions.length;
  const flaggedTransactions = transactions.filter(
    (t) => t.status === "Flagged" || t.status === "Blocked"
  ).length;
  const totalVolume = transactions.reduce(
    (sum, t) => sum + (t.amount || 0),
    0
  );

  const handleViewTransaction = (transaction: ArangoTransaction) => {
    // Map ArangoDB transaction to the format expected by the modal
    const mappedTransaction = {
      id: transaction._id,
      transaction_id: transaction.transaction_id || transaction._key,
      customer_id: transaction.customer_id || 'Unknown',
      amount: transaction.amount || 0,
      currency: transaction.currency || 'USD',
      type: transaction.transaction_type || 'Unknown',
      status: transaction.status || 'Completed',
      counterparty: transaction.counterparty?.name || 'Unknown',
      risk: getRiskLevel(transaction.risk_score),
      date: transaction.timestamp ? format(new Date(transaction.timestamp), 'yyyy-MM-dd') : 'Unknown',
      time: transaction.timestamp ? format(new Date(transaction.timestamp), 'HH:mm:ss') : 'Unknown',
      description: transaction.metadata?.description || 'Transaction',
      riskScore: transaction.risk_score,
      riskFactors: transaction.risk_factors || [],
    };
    
    setSelectedTransaction(mappedTransaction);
    setIsModalOpen(true);
  };

  // Function to determine risk level based on risk score
  const getRiskLevel = (score?: number): "Low" | "Medium" | "High" | "Critical" => {
    if (!score) return "Low";
    if (score > 80) return "Critical";
    if (score > 60) return "High";
    if (score > 40) return "Medium";
    return "Low";
  };

  // Function to determine badge variant based on status
  const getStatusBadgeVariant = (status?: string) => {
    if (!status) return "outline";
    
    switch (status) {
      case "Completed":
        return "outline";
      case "Pending":
        return "secondary";
      case "Flagged":
        return "warning";
      case "Blocked":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Transaction Monitoring
        </h1>
      </header>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Transaction Statistics</CardTitle>
          <CardDescription>
            Overview of recent transaction activity.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="p-4 border rounded-lg">
            <h3 className="text-sm font-medium text-muted-foreground flex items-center">
              <Users className="mr-2 h-4 w-4" /> Total Transactions
            </h3>
            <p className="text-2xl font-bold">{isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : totalTransactions}</p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="text-sm font-medium text-muted-foreground flex items-center">
              <DollarSign className="mr-2 h-4 w-4" /> Total Volume
            </h3>
            <p className="text-2xl font-bold">
              {isLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                `$${totalVolume.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`
              )}
            </p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="text-sm font-medium text-muted-foreground flex items-center">
              <TrendingUp className="mr-2 h-4 w-4 text-destructive" />{" "}
              Flagged/Blocked
            </h3>
            <p className="text-2xl font-bold">{isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : flaggedTransactions}</p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="text-sm font-medium text-muted-foreground flex items-center">
              <TrendingDown className="mr-2 h-4 w-4 text-success" /> Average
              Risk Score
            </h3>
            <p className="text-2xl font-bold">
              {isLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                transactions.length > 0
                  ? (
                      transactions.reduce(
                        (sum, t) => sum + (t.risk_score || 0),
                        0
                      ) /
                      transactions.filter((t) => t.risk_score !== undefined).length
                    ).toFixed(0)
                  : "N/A"
              )}
              <span className="text-sm">/100</span>
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-xl font-semibold text-foreground">
                Live Transaction Feed
              </CardTitle>
            </div>
            <div className="flex gap-2 flex-wrap">
              <div className="relative sm:w-auto w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search ID, Accounts..."
                  className="pl-10 w-full sm:w-48"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full sm:w-auto">
                    <CalendarDays className="mr-2 h-4 w-4" />
                    {dateRange.from ? (
                      dateRange.to ? (
                        `${format(dateRange.from, "LLL dd, y")} - ${format(
                          dateRange.to,
                          "LLL dd, y"
                        )}`
                      ) : (
                        format(dateRange.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Pick a date range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="range"
                    selected={{
                      from: dateRange.from || undefined,
                      to: dateRange.to || undefined,
                    }}
                    onSelect={(range) => {
                      if (range) {
                        setDateRange({
                          from: range.from,
                          to: range.to,
                        });
                      } else {
                        setDateRange({});
                      }
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Flagged">Flagged</SelectItem>
                  <SelectItem value="Blocked">Blocked</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-lg">Loading transactions...</span>
            </div>
          ) : error ? (
            <div className="text-center py-12 text-destructive">
              <p>Error loading transactions: {error.message}</p>
              <Button onClick={refetch} className="mt-4">
                Retry
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Risk</TableHead>
                  <TableHead>Alerts</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((tx) => {
                    const riskLevel = getRiskLevel(tx.risk_score);
                    return (
                      <TableRow
                        key={tx._id}
                        className={
                          tx.status === "Blocked"
                            ? "bg-destructive/10 hover:bg-destructive/20"
                            : tx.status === "Flagged"
                            ? "bg-warning/10 hover:bg-warning/20"
                            : "hover:bg-muted/50"
                        }
                      >
                        <TableCell className="font-medium">{tx.transaction_id || tx._key}</TableCell>
                        <TableCell>
                          {tx.timestamp 
                            ? format(new Date(tx.timestamp), "PPpp") 
                            : "Unknown"}
                        </TableCell>
                        <TableCell>
                          {tx.amount?.toFixed(2) || "0.00"} {tx.currency || "USD"}
                        </TableCell>
                        <TableCell>{tx.transaction_type || "Unknown"}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(tx.status)}>
                            {tx.status || "Unknown"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              riskLevel === "Critical"
                                ? "destructive"
                                : riskLevel === "High"
                                ? "warning"
                                : riskLevel === "Medium"
                                ? "secondary"
                                : "outline"
                            }
                          >
                            {riskLevel}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-xs truncate text-xs">
                          {tx.risk_factors?.join(", ") || "None"}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleViewTransaction(tx)}
                          >
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View Details</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center text-muted-foreground py-10"
                    >
                      {transactions.length === 0 
                        ? "No transactions found in the database." 
                        : "No transactions match your current filters."}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <TransactionDetailsModal 
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        transaction={selectedTransaction}
      />
    </div>
  );
}