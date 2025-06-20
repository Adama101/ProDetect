"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CreditCard,
  DollarSign,
  Calendar,
  Clock,
  MapPin,
  User,
  Building,
  ArrowRight,
  ArrowLeft,
  AlertTriangle,
  CheckCircle,
  XCircle,
  FileText,
  Flag,
  Eye,
  Download,
  Printer,
  Share2,
  Copy,
  BarChart3,
  Activity,
  Smartphone,
  Laptop,
  Globe,
  Shield,
  Zap,
  Send,
  MessageSquare,
  Repeat,
  RotateCw,
  Search,
  Filter,
  Wallet,
  BanknoteIcon,
  Receipt,
  CreditCardIcon,
  Landmark,
  CircleDollarSign,
  ArrowUpRight,
  ArrowDownRight,
  ExternalLink,
  Info,
  HelpCircle,
  Lightbulb,
  Fingerprint,
  Network,
  Wifi,
  Layers,
  Cpu,
  Database,
} from "lucide-react";
import { format } from "date-fns";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  AreaChart,
  Area,
} from "recharts";

interface Transaction {
  id: string;
  transaction_id: string;
  customer_id: string;
  amount: number;
  currency: string;
  type: string;
  status: string;
  counterparty: string;
  risk: string;
  date: string;
  time?: string;
  description?: string;
  channel?: string;
  reference?: string;
  location?: {
    country: string;
    city: string;
    coordinates?: [number, number];
  };
  device?: {
    type: string;
    os: string;
    browser: string;
    ip: string;
    fingerprint: string;
  };
  fees?: number;
  exchangeRate?: number;
  riskScore?: number;
  riskFactors?: string[];
  relatedTransactions?: string[];
  timeline?: {
    initiated: string;
    processed: string;
    completed?: string;
    failed?: string;
  };
  metadata?: Record<string, any>;
}

interface TransactionDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: Transaction | null;
}

// Sample historical data for transaction patterns
const historicalData = [
  { date: "Jan", amount: 1200, average: 1500 },
  { date: "Feb", amount: 1800, average: 1500 },
  { date: "Mar", amount: 1400, average: 1500 },
  { date: "Apr", amount: 2200, average: 1500 },
  { date: "May", amount: 1100, average: 1500 },
  { date: "Jun", amount: 1600, average: 1500 },
  { date: "Jul", amount: 8000, average: 1500 },
];

// Sample velocity data
const velocityData = [
  { time: "12 AM", count: 1 },
  { time: "4 AM", count: 0 },
  { time: "8 AM", count: 2 },
  { time: "12 PM", count: 5 },
  { time: "4 PM", count: 8 },
  { time: "8 PM", count: 3 },
  { time: "11 PM", count: 1 },
];

// Sample related transactions
const relatedTransactions = [
  { id: "TXN003", date: "2024-01-13", amount: 500, type: "Card Payment", status: "Completed", counterparty: "Amazon", risk: "Low" },
  { id: "TXN005", date: "2024-01-11", amount: 1200, type: "ATM Withdrawal", status: "Completed", counterparty: "ATM Network", risk: "Low" },
  { id: "TXN007", date: "2024-01-09", amount: 750, type: "Wire Transfer", status: "Completed", counterparty: "John Smith", risk: "Low" },
];

export function TransactionDetailsModal({
  open,
  onOpenChange,
  transaction,
}: TransactionDetailsModalProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [isReportingTransaction, setIsReportingTransaction] = useState(false);
  const [showRiskDetails, setShowRiskDetails] = useState(false);

  if (!transaction) return null;

  const statusBadgeVariant = {
    Completed: "outline",
    Flagged: "destructive",
    Pending: "warning",
    Blocked: "destructive",
    Failed: "secondary",
  } as const;

  const riskBadgeVariant = {
    Critical: "destructive",
    High: "warning",
    Medium: "secondary",
    Low: "outline",
  } as const;

  const handleReportTransaction = () => {
    setIsReportingTransaction(true);
    // Simulate API call
    setTimeout(() => {
      setIsReportingTransaction(false);
      onOpenChange(false);
      // Here you would typically show a toast notification
      alert("Transaction reported successfully");
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="flex items-center gap-2 text-2xl">
                <Receipt className="h-6 w-6 text-primary" />
                Transaction Details: {transaction.transaction_id}
              </DialogTitle>
              <DialogDescription className="mt-2">
                Comprehensive transaction information and analysis
              </DialogDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={statusBadgeVariant[transaction.status as keyof typeof statusBadgeVariant] || "default"}>
                {transaction.status}
              </Badge>
              <Badge variant={riskBadgeVariant[transaction.risk as keyof typeof riskBadgeVariant] || "default"}>
                {transaction.risk} Risk
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Transaction Summary Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Transaction Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="text-xs text-muted-foreground">Amount</div>
                  <div className="text-2xl font-bold flex items-center">
                    <DollarSign className="h-5 w-5 text-primary mr-1" />
                    {transaction.amount.toLocaleString()} {transaction.currency}
                  </div>
                </div>
                <Separator />
                <div>
                  <div className="text-xs text-muted-foreground">Transaction ID</div>
                  <div className="font-medium flex items-center">
                    <div className="font-mono text-sm">{transaction.transaction_id}</div>
                    <Button variant="ghost" size="icon" className="h-6 w-6 ml-1" onClick={() => navigator.clipboard.writeText(transaction.transaction_id)}>
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Date & Time</div>
                  <div className="font-medium flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {transaction.date}
                    {transaction.time && (
                      <>
                        <Clock className="h-4 w-4 text-muted-foreground ml-2" />
                        {transaction.time}
                      </>
                    )}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Type</div>
                  <div className="font-medium">{transaction.type}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Channel</div>
                  <div className="font-medium">{transaction.channel || "Online"}</div>
                </div>
                {transaction.riskScore && (
                  <div>
                    <div className="text-xs text-muted-foreground">Risk Score</div>
                    <div className="flex items-center gap-2">
                      <Progress 
                        value={transaction.riskScore} 
                        className="flex-1 h-2" 
                        indicatorClassName={
                          transaction.riskScore > 80 ? "bg-destructive" : 
                          transaction.riskScore > 60 ? "bg-warning" : 
                          transaction.riskScore > 40 ? "bg-yellow-500" : "bg-success"
                        }
                      />
                      <span className="text-sm font-medium">{transaction.riskScore}/100</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Eye className="h-4 w-4 mr-2" />
                  View Customer Profile
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Search className="h-4 w-4 mr-2" />
                  Find Related Transactions
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Export Transaction Data
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Printer className="h-4 w-4 mr-2" />
                  Print Receipt
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start text-destructive hover:text-destructive"
                  onClick={handleReportTransaction}
                  disabled={isReportingTransaction}
                >
                  <Flag className="h-4 w-4 mr-2" />
                  {isReportingTransaction ? "Reporting..." : "Report Suspicious Activity"}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Transaction Details Area */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="customer">Customer</TabsTrigger>
                <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
                <TabsTrigger value="related">Related Txns</TabsTrigger>
                <TabsTrigger value="technical">Technical</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Info className="h-5 w-5" />
                      Transaction Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <div className="text-sm font-medium text-muted-foreground">From</div>
                          <div className="flex items-center gap-2 mt-1">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src="https://picsum.photos/seed/customer/40/40" alt="Customer" />
                              <AvatarFallback>CU</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">Customer Account</div>
                              <div className="text-xs text-muted-foreground">Account ID: {transaction.customer_id}</div>
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-center">
                          <div className="flex flex-col items-center">
                            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                              {transaction.type === "Credit" ? (
                                <ArrowDownRight className="h-5 w-5 text-success" />
                              ) : (
                                <ArrowUpRight className="h-5 w-5 text-destructive" />
                              )}
                            </div>
                            <div className="h-10 w-0.5 bg-border"></div>
                          </div>
                        </div>

                        <div>
                          <div className="text-sm font-medium text-muted-foreground">To</div>
                          <div className="flex items-center gap-2 mt-1">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src="https://picsum.photos/seed/counterparty/40/40" alt="Counterparty" />
                              <AvatarFallback>CP</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{transaction.counterparty}</div>
                              <div className="text-xs text-muted-foreground">
                                {transaction.type === "Wire Transfer" ? "Bank Account" : 
                                 transaction.type === "Card Payment" ? "Merchant" : 
                                 "Recipient"}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-sm font-medium text-muted-foreground">Reference</div>
                            <div className="font-medium">{transaction.reference || "REF" + transaction.transaction_id.substring(3)}</div>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-muted-foreground">Description</div>
                            <div className="font-medium">{transaction.description || "N/A"}</div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-sm font-medium text-muted-foreground">Fees</div>
                            <div className="font-medium">{transaction.fees ? `${transaction.fees} ${transaction.currency}` : "0.00 USD"}</div>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-muted-foreground">Exchange Rate</div>
                            <div className="font-medium">{transaction.exchangeRate || "N/A"}</div>
                          </div>
                        </div>

                        <div>
                          <div className="text-sm font-medium text-muted-foreground">Location</div>
                          <div className="flex items-center gap-1 font-medium">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            {transaction.location ? 
                              `${transaction.location.city}, ${transaction.location.country}` : 
                              "New York, US"}
                          </div>
                        </div>

                        <div>
                          <div className="text-sm font-medium text-muted-foreground">Timeline</div>
                          <div className="space-y-2 mt-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                Initiated
                              </span>
                              <span>{transaction.time || "14:30:00"}</span>
                            </div>
                            <Progress value={transaction.status === "Completed" ? 100 : transaction.status === "Pending" ? 50 : 25} className="h-1" />
                            <div className="flex items-center justify-between text-xs">
                              <span>Processing</span>
                              <span>{transaction.status === "Completed" ? "14:30:05" : "In progress..."}</span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                              <span>Completed</span>
                              <span>{transaction.status === "Completed" ? "14:30:10" : "Pending..."}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Transaction Pattern Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <div className="text-sm font-medium mb-2">Historical Amount Comparison</div>
                        <ChartContainer
                          config={{
                            amount: { label: "Transaction Amount", color: "hsl(var(--primary))" },
                            average: { label: "Average Amount", color: "hsl(var(--muted-foreground))" },
                          }}
                          className="h-[200px]"
                        >
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={historicalData}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} />
                              <XAxis dataKey="date" />
                              <YAxis />
                              <Tooltip content={<ChartTooltipContent />} />
                              <Line
                                type="monotone"
                                dataKey="amount"
                                stroke="hsl(var(--primary))"
                                strokeWidth={2}
                                dot={{ r: 4 }}
                                activeDot={{ r: 6 }}
                              />
                              <Line
                                type="monotone"
                                dataKey="average"
                                stroke="hsl(var(--muted-foreground))"
                                strokeWidth={1}
                                strokeDasharray="5 5"
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </ChartContainer>
                      </div>
                      <div>
                        <div className="text-sm font-medium mb-2">Transaction Velocity (24h)</div>
                        <ChartContainer
                          config={{
                            count: { label: "Transaction Count", color: "hsl(var(--chart-2))" },
                          }}
                          className="h-[200px]"
                        >
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={velocityData}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} />
                              <XAxis dataKey="time" />
                              <YAxis />
                              <Tooltip content={<ChartTooltipContent />} />
                              <Area
                                type="monotone"
                                dataKey="count"
                                stroke="hsl(var(--chart-2))"
                                fill="hsl(var(--chart-2))"
                                fillOpacity={0.3}
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        </ChartContainer>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="customer" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Customer Profile
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 mb-6">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src="https://picsum.photos/seed/customer/100/100" alt="Customer" />
                        <AvatarFallback>CU</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-xl font-bold">John Doe</h3>
                        <p className="text-sm text-muted-foreground">Customer since Jan 2020</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline">Verified</Badge>
                          <Badge variant="outline" className="bg-yellow-500/10 text-yellow-700 dark:text-yellow-400">Medium Risk</Badge>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <div className="text-sm font-medium text-muted-foreground">Contact Information</div>
                          <div className="space-y-2 mt-1">
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-muted-foreground" />
                              <span>john.doe@example.com</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Smartphone className="h-4 w-4 text-muted-foreground" />
                              <span>+1 (555) 123-4567</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <span>123 Main St, New York, NY 10001</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <div className="text-sm font-medium text-muted-foreground">Account Information</div>
                          <div className="space-y-2 mt-1">
                            <div className="flex items-center gap-2">
                              <CreditCardIcon className="h-4 w-4 text-muted-foreground" />
                              <span>Account #: XXXX-XXXX-1234</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Building className="h-4 w-4 text-muted-foreground" />
                              <span>Account Type: Personal Checking</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
                              <span>Balance: $12,345.67</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <div className="text-sm font-medium text-muted-foreground">Transaction History</div>
                          <div className="space-y-2 mt-1">
                            <div className="flex justify-between">
                              <span className="text-sm">Total Transactions</span>
                              <span className="font-medium">127</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm">Monthly Average</span>
                              <span className="font-medium">$3,450.00</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm">Largest Transaction</span>
                              <span className="font-medium">$15,000.00</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm">Flagged Transactions</span>
                              <span className="font-medium text-destructive">2</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <div className="text-sm font-medium text-muted-foreground">Compliance Status</div>
                          <div className="space-y-2 mt-1">
                            <div className="flex justify-between">
                              <span className="text-sm">KYC Status</span>
                              <Badge variant="outline" className="text-success">Verified</Badge>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm">Risk Rating</span>
                              <Badge variant="outline" className="bg-yellow-500/10 text-yellow-700 dark:text-yellow-400">Medium</Badge>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm">PEP Status</span>
                              <Badge variant="outline" className="text-success">Not PEP</Badge>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm">Sanctions</span>
                              <Badge variant="outline" className="text-success">Clear</Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary/10 rounded-full">
                            <Laptop className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">Last Login</p>
                            <p className="text-xs text-muted-foreground">Today, 09:45 AM</p>
                          </div>
                        </div>
                        <Badge variant="outline">Web Browser</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary/10 rounded-full">
                            <Smartphone className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">Mobile App Activity</p>
                            <p className="text-xs text-muted-foreground">Today, 08:30 AM</p>
                          </div>
                        </div>
                        <Badge variant="outline">iOS App</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary/10 rounded-full">
                            <MapPin className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">Location</p>
                            <p className="text-xs text-muted-foreground">New York, US</p>
                          </div>
                        </div>
                        <Badge variant="outline">Consistent</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="risk" className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        Risk Assessment
                      </CardTitle>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setShowRiskDetails(!showRiskDetails)}
                      >
                        {showRiskDetails ? "Hide Details" : "Show Details"}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="flex flex-col items-center">
                        <div className="relative w-40 h-40">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-4xl font-bold">
                              {transaction.riskScore || 82}
                            </div>
                          </div>
                          <svg className="w-full h-full" viewBox="0 0 100 100">
                            <circle
                              cx="50"
                              cy="50"
                              r="45"
                              fill="none"
                              stroke="hsl(var(--muted))"
                              strokeWidth="10"
                            />
                            <circle
                              cx="50"
                              cy="50"
                              r="45"
                              fill="none"
                              stroke={
                                (transaction.riskScore || 82) > 80
                                  ? "hsl(var(--destructive))"
                                  : (transaction.riskScore || 82) > 60
                                  ? "hsl(var(--warning))"
                                  : (transaction.riskScore || 82) > 40
                                  ? "hsl(var(--yellow-500))"
                                  : "hsl(var(--success))"
                              }
                              strokeWidth="10"
                              strokeDasharray="283"
                              strokeDashoffset={283 - (283 * (transaction.riskScore || 82)) / 100}
                              transform="rotate(-90 50 50)"
                            />
                          </svg>
                        </div>
                        <div className="text-center mt-2">
                          <div className="text-lg font-medium">
                            {(transaction.riskScore || 82) > 80
                              ? "Critical Risk"
                              : (transaction.riskScore || 82) > 60
                              ? "High Risk"
                              : (transaction.riskScore || 82) > 40
                              ? "Medium Risk"
                              : "Low Risk"}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Transaction Risk Score
                          </div>
                        </div>
                      </div>

                      {showRiskDetails && (
                        <div className="space-y-4">
                          <Separator />
                          <div>
                            <div className="text-sm font-medium mb-2">Risk Factors</div>
                            <div className="space-y-3">
                              <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                  <DollarSign className="h-4 w-4 text-warning" />
                                  <span>Amount Threshold</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Progress value={75} className="w-24 h-2" />
                                  <span className="text-sm">30/40</span>
                                </div>
                              </div>
                              <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                  <Repeat className="h-4 w-4 text-warning" />
                                  <span>Transaction Velocity</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Progress value={50} className="w-24 h-2" />
                                  <span className="text-sm">20/40</span>
                                </div>
                              </div>
                              <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                  <MapPin className="h-4 w-4 text-destructive" />
                                  <span>Geographic Risk</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Progress value={90} className="w-24 h-2" />
                                  <span className="text-sm">18/20</span>
                                </div>
                              </div>
                              <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                  <User className="h-4 w-4 text-success" />
                                  <span>Customer Risk Profile</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Progress value={35} className="w-24 h-2" />
                                  <span className="text-sm">7/20</span>
                                </div>
                              </div>
                              <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                  <Building className="h-4 w-4 text-warning" />
                                  <span>Counterparty Risk</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Progress value={60} className="w-24 h-2" />
                                  <span className="text-sm">12/20</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div>
                            <div className="text-sm font-medium mb-2">AI Analysis</div>
                            <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                              <div className="flex items-start gap-3">
                                <Lightbulb className="h-5 w-5 text-primary mt-0.5" />
                                <div>
                                  <h4 className="font-medium">Pattern Recognition</h4>
                                  <p className="text-sm text-muted-foreground mt-1">
                                    This transaction shows a 340% increase over the customer's average transaction amount. 
                                    The transaction also occurs outside the customer's normal activity hours and involves 
                                    a new counterparty with limited history.
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div>
                            <div className="text-sm font-medium mb-2">Triggered Rules</div>
                            <div className="space-y-2">
                              <div className="p-3 border rounded-lg flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Zap className="h-4 w-4 text-destructive" />
                                  <span className="font-medium">High Value Transaction</span>
                                </div>
                                <Badge variant="outline" className="text-destructive">Critical</Badge>
                              </div>
                              <div className="p-3 border rounded-lg flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Repeat className="h-4 w-4 text-warning" />
                                  <span className="font-medium">Unusual Activity Time</span>
                                </div>
                                <Badge variant="outline" className="text-warning">High</Badge>
                              </div>
                              <div className="p-3 border rounded-lg flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <User className="h-4 w-4 text-warning" />
                                  <span className="font-medium">New Beneficiary</span>
                                </div>
                                <Badge variant="outline" className="text-warning">High</Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      Behavioral Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 border rounded-lg text-center">
                          <div className="text-3xl font-bold text-primary">340%</div>
                          <div className="text-sm text-muted-foreground">Above Average</div>
                        </div>
                        <div className="p-4 border rounded-lg text-center">
                          <div className="text-3xl font-bold text-warning">12</div>
                          <div className="text-sm text-muted-foreground">Similar Patterns</div>
                        </div>
                        <div className="p-4 border rounded-lg text-center">
                          <div className="text-3xl font-bold text-destructive">3</div>
                          <div className="text-sm text-muted-foreground">Anomaly Score</div>
                        </div>
                      </div>

                      <div className="p-4 bg-warning/5 border border-warning/20 rounded-lg">
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="h-5 w-5 text-warning mt-0.5" />
                          <div>
                            <h4 className="font-medium">Behavioral Anomaly Detected</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              This transaction deviates significantly from the customer's established patterns in terms of amount, 
                              timing, and recipient. The transaction amount is 340% higher than the customer's 90-day average.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="related" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Repeat className="h-5 w-5" />
                      Related Transactions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Counterparty</TableHead>
                          <TableHead>Risk</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {relatedTransactions.map((tx) => (
                          <TableRow key={tx.id}>
                            <TableCell className="font-medium">{tx.id}</TableCell>
                            <TableCell>{tx.date}</TableCell>
                            <TableCell>${tx.amount.toLocaleString()}</TableCell>
                            <TableCell>{tx.type}</TableCell>
                            <TableCell>
                              <Badge variant={statusBadgeVariant[tx.status as keyof typeof statusBadgeVariant] || "default"}>
                                {tx.status}
                              </Badge>
                            </TableCell>
                            <TableCell>{tx.counterparty}</TableCell>
                            <TableCell>
                              <Badge variant={riskBadgeVariant[tx.risk as keyof typeof riskBadgeVariant] || "default"}>
                                {tx.risk}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-3 w-3" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Network className="h-5 w-5" />
                      Transaction Network Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center border-2 border-dashed border-border rounded-lg">
                      <div className="text-center">
                        <Network className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">Transaction network visualization</p>
                        <p className="text-sm text-muted-foreground mt-2">Shows connections between related transactions</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="technical" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Cpu className="h-5 w-5" />
                      Technical Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <div className="text-sm font-medium text-muted-foreground">Device Information</div>
                          <div className="space-y-2 mt-1">
                            <div className="flex items-center gap-2">
                              <Laptop className="h-4 w-4 text-muted-foreground" />
                              <span>Device Type: {transaction.device?.type || "Desktop"}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Layers className="h-4 w-4 text-muted-foreground" />
                              <span>OS: {transaction.device?.os || "Windows 10"}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Globe className="h-4 w-4 text-muted-foreground" />
                              <span>Browser: {transaction.device?.browser || "Chrome 98.0.4758.102"}</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <div className="text-sm font-medium text-muted-foreground">Network Information</div>
                          <div className="space-y-2 mt-1">
                            <div className="flex items-center gap-2">
                              <Wifi className="h-4 w-4 text-muted-foreground" />
                              <span>IP Address: {transaction.device?.ip || "192.168.1.100"}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <span>IP Location: {transaction.location?.city || "New York"}, {transaction.location?.country || "US"}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Shield className="h-4 w-4 text-muted-foreground" />
                              <span>VPN/Proxy: Not Detected</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <div className="text-sm font-medium text-muted-foreground">Security</div>
                          <div className="space-y-2 mt-1">
                            <div className="flex items-center gap-2">
                              <Fingerprint className="h-4 w-4 text-muted-foreground" />
                              <span>Device Fingerprint: {transaction.device?.fingerprint?.substring(0, 8) || "a7f3e9b2"}...</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-success" />
                              <span>2FA: Verified</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-success" />
                              <span>Known Device: Yes</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <div className="text-sm font-medium text-muted-foreground">Processing Details</div>
                          <div className="space-y-2 mt-1">
                            <div className="flex justify-between">
                              <span className="text-sm">Processing Time</span>
                              <span className="font-medium">235ms</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm">Routing</span>
                              <span className="font-medium">Direct</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm">Verification Method</span>
                              <span className="font-medium">3D Secure</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm">Settlement Status</span>
                              <span className="font-medium">Completed</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <div className="text-sm font-medium text-muted-foreground">Transaction Metadata</div>
                          <div className="mt-1 p-3 bg-muted/50 rounded-lg font-mono text-xs overflow-x-auto">
                            <pre>{JSON.stringify({
                              transaction_id: transaction.transaction_id,
                              customer_id: transaction.customer_id,
                              amount: transaction.amount,
                              currency: transaction.currency,
                              type: transaction.type,
                              status: transaction.status,
                              timestamp: new Date().toISOString(),
                              processing_id: "proc_" + Math.random().toString(36).substring(2, 10),
                              auth_code: Math.random().toString(36).substring(2, 10).toUpperCase(),
                              merchant_category_code: "5411",
                              pos_entry_mode: "01",
                              acquirer_id: "12345678",
                              terminal_id: "TERM12345",
                            }, null, 2)}</pre>
                          </div>
                        </div>

                        <div>
                          <div className="text-sm font-medium text-muted-foreground">System Logs</div>
                          <div className="mt-1 p-3 bg-muted/50 rounded-lg font-mono text-xs h-32 overflow-y-auto">
                            <div className="text-success">[INFO] 2024-01-15 14:30:00 - Transaction initiated</div>
                            <div className="text-muted-foreground">[DEBUG] 2024-01-15 14:30:01 - Validating transaction parameters</div>
                            <div className="text-muted-foreground">[DEBUG] 2024-01-15 14:30:02 - Checking available balance</div>
                            <div className="text-muted-foreground">[DEBUG] 2024-01-15 14:30:03 - Running fraud checks</div>
                            <div className="text-warning">[WARN] 2024-01-15 14:30:04 - High-value transaction detected</div>
                            <div className="text-muted-foreground">[DEBUG] 2024-01-15 14:30:05 - Additional verification required</div>
                            <div className="text-muted-foreground">[DEBUG] 2024-01-15 14:30:06 - Verification passed</div>
                            <div className="text-muted-foreground">[DEBUG] 2024-01-15 14:30:07 - Processing payment</div>
                            <div className="text-muted-foreground">[DEBUG] 2024-01-15 14:30:08 - Updating account balance</div>
                            <div className="text-success">[INFO] 2024-01-15 14:30:10 - Transaction completed successfully</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-1" />
            Export Details
          </Button>
          <Button>
            <Eye className="h-4 w-4 mr-1" />
            View Full History
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}