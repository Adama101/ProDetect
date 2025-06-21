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

interface Transaction {
  id: string;
  timestamp: Date;
  amount: number;
  currency: string;
  sourceAccount: string;
  destinationAccount: string;
  type: "Credit" | "Debit" | "Transfer";
  status: "Pending" | "Completed" | "Flagged" | "Blocked";
  riskScore?: number;
  alerts: string[];
}

//Dummy data placeholder
const mockTransactions: Transaction[] = [
  {
    id: "TXN001",
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    amount: 1500.0,
    currency: "USD",
    sourceAccount: "ACC12345",
    destinationAccount: "ACC67890",
    type: "Transfer",
    status: "Flagged",
    riskScore: 85,
    alerts: ["High value transfer to new beneficiary", "Potential structuring"],
  },
  {
    id: "TXN002",
    timestamp: new Date(Date.now() - 1000 * 60 * 12),
    amount: 25.5,
    currency: "EUR",
    sourceAccount: "ACC54321",
    destinationAccount: "MERCHANT001",
    type: "Debit",
    status: "Completed",
    riskScore: 10,
    alerts: [],
  },
  {
    id: "TXN003",
    timestamp: new Date(Date.now() - 1000 * 60 * 25),
    amount: 10000.0,
    currency: "USD",
    sourceAccount: "UNKNOWN",
    destinationAccount: "ACC99999",
    type: "Credit",
    status: "Blocked",
    riskScore: 99,
    alerts: ["Transaction from sanctioned entity", "High risk source"],
  },
  {
    id: "TXN004",
    timestamp: new Date(Date.now() - 1000 * 60 * 45),
    amount: 300.0,
    currency: "GBP",
    sourceAccount: "ACC11223",
    destinationAccount: "ACC44556",
    type: "Transfer",
    status: "Pending",
    riskScore: 45,
    alerts: ["Awaiting KYC confirmation"],
  },
  {
    id: "TXN005",
    timestamp: new Date(Date.now() - 1000 * 60 * 62),
    amount: 50.0,
    currency: "USD",
    sourceAccount: "ACC77665",
    destinationAccount: "GAMINGCO",
    type: "Debit",
    status: "Completed",
    riskScore: 25,
    alerts: [],
  },
];

const statusBadgeVariant = {
  Pending: "secondary",
  Completed: "outline",
  Flagged: "warning",
  Blocked: "destructive",
} as const;

export default function TransactionMonitoringPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<
    Transaction[]
  >([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Simulate API call
    setTransactions(mockTransactions);
    setFilteredTransactions(mockTransactions);
  }, []);

  useEffect(() => {
    let currentTransactions = transactions;
    if (searchTerm) {
      currentTransactions = currentTransactions.filter(
        (t) =>
          t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.sourceAccount.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.destinationAccount.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (dateRange.from) {
      currentTransactions = currentTransactions.filter(
        (t) => t.timestamp >= dateRange.from!
      );
    }
    if (dateRange.to) {
      const toDate = new Date(dateRange.to);
      toDate.setHours(23, 59, 59, 999); // Include the whole 'to' day
      currentTransactions = currentTransactions.filter(
        (t) => t.timestamp <= toDate
      );
    }
    if (statusFilter !== "all") {
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
    (sum, t) => sum + (t.currency === "USD" ? t.amount : t.amount * 1.1),
    0
  ); // Simplified conversion

  const handleViewTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
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
            <p className="text-2xl font-bold">{totalTransactions}</p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="text-sm font-medium text-muted-foreground flex items-center">
              <DollarSign className="mr-2 h-4 w-4" /> Total Volume (USD Equiv.)
            </h3>
            <p className="text-2xl font-bold">
              $
              {totalVolume.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="text-sm font-medium text-muted-foreground flex items-center">
              <TrendingUp className="mr-2 h-4 w-4 text-destructive" />{" "}
              Flagged/Blocked
            </h3>
            <p className="text-2xl font-bold">{flaggedTransactions}</p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="text-sm font-medium text-muted-foreground flex items-center">
              <TrendingDown className="mr-2 h-4 w-4 text-success" /> Average
              Risk Score
            </h3>
            <p className="text-2xl font-bold">
              {transactions.length > 0
                ? (
                    transactions.reduce(
                      (sum, t) => sum + (t.riskScore || 0),
                      0
                    ) /
                    transactions.filter((t) => t.riskScore !== undefined).length
                  ).toFixed(0)
                : "N/A"}
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
              {filteredTransactions.map((tx) => (
                <TableRow
                  key={tx.id}
                  className={
                    tx.status === "Blocked"
                      ? "bg-destructive/10 hover:bg-destructive/20"
                      : tx.status === "Flagged"
                      ? "bg-warning/10 hover:bg-warning/20"
                      : "hover:bg-muted/50"
                  }
                >
                  <TableCell className="font-medium">{tx.id}</TableCell>
                  <TableCell>{format(tx.timestamp, "PPpp")}</TableCell>
                  <TableCell>
                    {tx.amount.toFixed(2)} {tx.currency}
                  </TableCell>
                  <TableCell>{tx.type}</TableCell>
                  <TableCell>
                    <Badge variant={statusBadgeVariant[tx.status] || "default"}>
                      {tx.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {tx.riskScore !== undefined ? (
                      <Badge
                        variant={
                          tx.riskScore > 75
                            ? "destructive"
                            : tx.riskScore > 50
                            ? "warning"
                            : "outline"
                        }
                      >
                        {tx.riskScore}
                      </Badge>
                    ) : (
                      <Badge variant="secondary">N/A</Badge>
                    )}
                  </TableCell>
                  <TableCell className="max-w-xs truncate text-xs">
                    {tx.alerts.join(", ") || "None"}
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
              ))}
              {filteredTransactions.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center text-muted-foreground py-10"
                  >
                    No transactions match your current filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <TransactionDetailsModal 
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        transaction={selectedTransaction ? {
          id: selectedTransaction.id,
          transaction_id: selectedTransaction.id,
          customer_id: selectedTransaction.sourceAccount,
          amount: selectedTransaction.amount,
          currency: selectedTransaction.currency,
          type: selectedTransaction.type,
          status: selectedTransaction.status,
          counterparty: selectedTransaction.destinationAccount,
          risk: selectedTransaction.riskScore ? 
            (selectedTransaction.riskScore > 80 ? "Critical" : 
             selectedTransaction.riskScore > 60 ? "High" : 
             selectedTransaction.riskScore > 40 ? "Medium" : "Low") : "Medium",
          date: format(selectedTransaction.timestamp, "yyyy-MM-dd"),
          time: format(selectedTransaction.timestamp, "HH:mm:ss"),
          description: selectedTransaction.alerts.length > 0 ? selectedTransaction.alerts[0] : "Transaction",
          riskScore: selectedTransaction.riskScore,
          riskFactors: selectedTransaction.alerts,
        } : null}
      />
    </div>
  );
}