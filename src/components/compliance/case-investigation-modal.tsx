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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  FileText,
  Clock,
  User,
  MapPin,
  CreditCard,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Download,
  Upload,
  Plus,
  Save,
  Send,
  MessageSquare,
  Paperclip,
  Flag,
  Shield,
  Target,
  Activity,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Globe,
  Smartphone,
  Lock,
  Database,
  Brain,
  Zap,
  Star,
  ExternalLink,
  Filter,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
} from "recharts";

interface AlertItem {
  id: string;
  description: string;
  date: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'Open' | 'In Review' | 'Resolved' | 'Closed';
  entity: string;
  assignedTo?: string;
  riskScore?: number;
  caseStatus?: string;
  tags?: string[];
  source: string;
}

interface CaseInvestigationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  alert: AlertItem | null;
}

// Mock data for case investigation
const customerProfile = {
  id: "CUST001",
  name: "Johnathan K. Doe",
  email: "j.doe@email.com",
  phone: "+1 (555) 123-4567",
  address: "123 Main St, New York, NY 10001",
  dateOfBirth: "1985-03-15",
  nationality: "US",
  occupation: "Software Engineer",
  employer: "Tech Corp Inc.",
  accountOpenDate: "2020-01-15",
  kycStatus: "Verified",
  riskRating: "Medium",
  totalBalance: 125000,
  monthlyIncome: 8500,
  creditScore: 742,
  pepStatus: false,
  sanctionsMatch: false,
  lastLogin: "2024-01-15 14:30:00",
  deviceFingerprint: "Chrome/Windows/Desktop",
  ipAddress: "192.168.1.100",
  location: "New York, NY",
};

const transactionHistory = [
  { id: "TXN001", date: "2024-01-15", amount: 2500, type: "Wire Transfer", status: "Completed", counterparty: "ABC Corp", risk: "Low" },
  { id: "TXN002", date: "2024-01-14", amount: 15000, type: "ACH Credit", status: "Flagged", counterparty: "Unknown Entity", risk: "High" },
  { id: "TXN003", date: "2024-01-13", amount: 500, type: "Card Payment", status: "Completed", counterparty: "Amazon", risk: "Low" },
  { id: "TXN004", date: "2024-01-12", amount: 8000, type: "Wire Transfer", status: "Pending", counterparty: "Offshore Bank", risk: "Critical" },
  { id: "TXN005", date: "2024-01-11", amount: 1200, type: "ATM Withdrawal", status: "Completed", counterparty: "ATM Network", risk: "Low" },
];

const relatedAlerts = [
  { id: "ALT002", date: "2024-01-10", type: "Velocity Alert", severity: "Medium", description: "Multiple large transactions in short timeframe" },
  { id: "ALT003", date: "2024-01-08", type: "Geographic Alert", severity: "Low", description: "Transaction from new geographic location" },
  { id: "ALT004", date: "2024-01-05", type: "Amount Alert", severity: "High", description: "Transaction amount exceeds normal pattern" },
];

const investigationNotes = [
  {
    id: "NOTE001",
    timestamp: "2024-01-15 16:45:00",
    author: "Sarah Chen",
    type: "Investigation",
    content: "Initial review completed. Customer profile shows recent increase in transaction velocity. Requesting additional documentation for verification.",
    attachments: ["customer_docs.pdf", "transaction_analysis.xlsx"],
  },
  {
    id: "NOTE002",
    timestamp: "2024-01-15 14:20:00",
    author: "Michael Rodriguez",
    type: "System",
    content: "Automated risk assessment completed. Risk score elevated due to geographic and velocity factors.",
    attachments: [],
  },
  {
    id: "NOTE003",
    timestamp: "2024-01-15 10:15:00",
    author: "Emma Thompson",
    type: "External",
    content: "Contacted customer via phone. Customer confirmed recent business expansion requiring increased transaction volume. Awaiting supporting documentation.",
    attachments: ["call_transcript.txt"],
  },
];

const riskFactors = [
  { factor: "Transaction Velocity", score: 85, trend: "up", description: "300% increase in transaction frequency" },
  { factor: "Geographic Spread", score: 72, trend: "up", description: "Transactions from 5 new countries" },
  { factor: "Amount Variance", score: 68, trend: "stable", description: "Transaction amounts 2x above baseline" },
  { factor: "Counterparty Risk", score: 91, trend: "up", description: "Multiple high-risk counterparties" },
  { factor: "Behavioral Pattern", score: 45, trend: "down", description: "Consistent with customer profile" },
];

const evidenceItems = [
  { id: "EVD001", type: "Document", name: "Customer ID Verification", status: "Verified", date: "2024-01-15", source: "KYC System" },
  { id: "EVD002", type: "Transaction", name: "Wire Transfer $15,000", status: "Under Review", date: "2024-01-14", source: "Core Banking" },
  { id: "EVD003", type: "Communication", name: "Customer Phone Call", status: "Documented", date: "2024-01-15", source: "Call Center" },
  { id: "EVD004", type: "External", name: "Sanctions List Check", status: "Clear", date: "2024-01-15", source: "OFAC Database" },
  { id: "EVD005", type: "Behavioral", name: "Pattern Analysis", status: "Anomalous", date: "2024-01-15", source: "AI Engine" },
];

const timelineEvents = [
  { time: "16:45", date: "Jan 15", event: "Investigation note added", user: "Sarah Chen", type: "action" },
  { time: "15:30", date: "Jan 15", event: "Case assigned to investigator", user: "System", type: "system" },
  { time: "15:15", date: "Jan 15", event: "Alert generated", user: "AML Engine", type: "alert" },
  { time: "14:45", date: "Jan 15", event: "Transaction flagged", user: "Transaction Monitor", type: "transaction" },
  { time: "14:30", date: "Jan 15", event: "Customer login detected", user: "Security System", type: "activity" },
];

export function CaseInvestigationModal({ open, onOpenChange, alert }: CaseInvestigationModalProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [newNote, setNewNote] = useState("");
  const [caseStatus, setCaseStatus] = useState("Investigation");
  const [priority, setPriority] = useState("High");

  if (!alert) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="flex items-center gap-2 text-2xl">
                <Shield className="h-6 w-6 text-primary" />
                Case Investigation: {alert.id}
              </DialogTitle>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={alert.severity === "Critical" ? "destructive" : alert.severity === "High" ? "warning" : "secondary"}>
                {alert.severity} Priority
              </Badge>
              <Badge variant="outline">{caseStatus}</Badge>
            </div>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Case Summary Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Case Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-xs text-muted-foreground">Alert ID</Label>
                  <p className="font-medium">{alert.id}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Entity</Label>
                  <p className="font-medium">{alert.entity}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Risk Score</Label>
                  <div className="flex items-center gap-2">
                    <Progress value={alert.riskScore || 0} className="flex-1 h-2" />
                    <span className="text-sm font-medium">{alert.riskScore}/100</span>
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Assigned To</Label>
                  <p className="font-medium">{alert.assignedTo || "Unassigned"}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Created</Label>
                  <p className="font-medium">{alert.date}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Source</Label>
                  <p className="font-medium">{alert.source}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Flag className="h-4 w-4 mr-2" />
                  Escalate Case
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Send className="h-4 w-4 mr-2" />
                  Request Info
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Lock className="h-4 w-4 mr-2" />
                  Freeze Account
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Close Case
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Case Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label>Status</Label>
                  <Select value={caseStatus} onValueChange={setCaseStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="New">New</SelectItem>
                      <SelectItem value="Investigation">Investigation</SelectItem>
                      <SelectItem value="Pending Review">Pending Review</SelectItem>
                      <SelectItem value="Escalated">Escalated</SelectItem>
                      <SelectItem value="Resolved">Resolved</SelectItem>
                      <SelectItem value="Closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Priority</Label>
                  <Select value={priority} onValueChange={setPriority}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full">
                  <Save className="h-4 w-4 mr-2" />
                  Update Case
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Investigation Area */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="customer">Customer</TabsTrigger>
                <TabsTrigger value="transactions">Transactions</TabsTrigger>
                <TabsTrigger value="evidence">Evidence</TabsTrigger>
                <TabsTrigger value="analysis">Analysis</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">Risk Assessment</span>
                      </div>
                      <div className="text-2xl font-bold text-destructive">{alert.riskScore}/100</div>
                      <div className="text-xs text-muted-foreground">High Risk</div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-4 w-4 text-warning" />
                        <span className="text-sm font-medium">Time Open</span>
                      </div>
                      <div className="text-2xl font-bold">2.5 hrs</div>
                      <div className="text-xs text-muted-foreground">Since creation</div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Activity className="h-4 w-4 text-success" />
                        <span className="text-sm font-medium">Evidence Items</span>
                      </div>
                      <div className="text-2xl font-bold">{evidenceItems.length}</div>
                      <div className="text-xs text-muted-foreground">Collected</div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      Risk Factor Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {riskFactors.map((factor, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-sm">{factor.factor}</span>
                            <div className="flex items-center gap-2">
                              <Badge variant={factor.score > 80 ? "destructive" : factor.score > 60 ? "warning" : "outline"}>
                                {factor.score}
                              </Badge>
                              {factor.trend === "up" ? (
                                <TrendingUp className="h-4 w-4 text-destructive" />
                              ) : factor.trend === "down" ? (
                                <TrendingDown className="h-4 w-4 text-success" />
                              ) : (
                                <div className="h-4 w-4" />
                              )}
                            </div>
                          </div>
                          <Progress value={factor.score} className="h-2" />
                          <p className="text-xs text-muted-foreground">{factor.description}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Investigation Timeline
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {timelineEvents.map((event, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="flex flex-col items-center">
                            <div className={`w-3 h-3 rounded-full ${
                              event.type === "alert" ? "bg-destructive" :
                              event.type === "action" ? "bg-primary" :
                              event.type === "system" ? "bg-warning" :
                              "bg-muted"
                            }`} />
                            {index < timelineEvents.length - 1 && <div className="w-px h-8 bg-border mt-2" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm">{event.event}</span>
                              <span className="text-xs text-muted-foreground">{event.time} • {event.date}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">by {event.user}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="customer" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Customer Profile
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src="/placeholder-avatar.jpg" />
                          <AvatarFallback>{customerProfile.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{customerProfile.name}</h3>
                          <p className="text-sm text-muted-foreground">Customer ID: {customerProfile.id}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <Label className="text-xs text-muted-foreground">Email</Label>
                          <p>{customerProfile.email}</p>
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">Phone</Label>
                          <p>{customerProfile.phone}</p>
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">Date of Birth</Label>
                          <p>{customerProfile.dateOfBirth}</p>
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">Nationality</Label>
                          <p>{customerProfile.nationality}</p>
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">Occupation</Label>
                          <p>{customerProfile.occupation}</p>
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">Employer</Label>
                          <p>{customerProfile.employer}</p>
                        </div>
                      </div>

                      <div>
                        <Label className="text-xs text-muted-foreground">Address</Label>
                        <p className="text-sm">{customerProfile.address}</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        Compliance Status
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-xs text-muted-foreground">KYC Status</Label>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-success" />
                            <span className="text-sm">{customerProfile.kycStatus}</span>
                          </div>
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">Risk Rating</Label>
                          <Badge variant="warning">{customerProfile.riskRating}</Badge>
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">PEP Status</Label>
                          <div className="flex items-center gap-2">
                            {customerProfile.pepStatus ? (
                              <XCircle className="h-4 w-4 text-destructive" />
                            ) : (
                              <CheckCircle className="h-4 w-4 text-success" />
                            )}
                            <span className="text-sm">{customerProfile.pepStatus ? "PEP" : "Not PEP"}</span>
                          </div>
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">Sanctions</Label>
                          <div className="flex items-center gap-2">
                            {customerProfile.sanctionsMatch ? (
                              <XCircle className="h-4 w-4 text-destructive" />
                            ) : (
                              <CheckCircle className="h-4 w-4 text-success" />
                            )}
                            <span className="text-sm">{customerProfile.sanctionsMatch ? "Match" : "Clear"}</span>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm">Account Balance</span>
                          <span className="font-medium">${customerProfile.totalBalance.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Monthly Income</span>
                          <span className="font-medium">${customerProfile.monthlyIncome.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Credit Score</span>
                          <span className="font-medium">{customerProfile.creditScore}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Account Age</span>
                          <span className="font-medium">4 years</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded">
                        <div className="flex items-center gap-3">
                          <Smartphone className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium text-sm">Last Login</p>
                            <p className="text-xs text-muted-foreground">{customerProfile.lastLogin}</p>
                          </div>
                        </div>
                        <Badge variant="outline">{customerProfile.deviceFingerprint}</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded">
                        <div className="flex items-center gap-3">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium text-sm">Location</p>
                            <p className="text-xs text-muted-foreground">{customerProfile.location}</p>
                          </div>
                        </div>
                        <Badge variant="outline">{customerProfile.ipAddress}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="transactions" className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5" />
                        Transaction History
                      </CardTitle>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Filter className="h-4 w-4 mr-1" />
                          Filter
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-1" />
                          Export
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Transaction ID</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Counterparty</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Risk</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {transactionHistory.map((txn) => (
                          <TableRow key={txn.id}>
                            <TableCell className="font-medium">{txn.id}</TableCell>
                            <TableCell>{txn.date}</TableCell>
                            <TableCell>${txn.amount.toLocaleString()}</TableCell>
                            <TableCell>{txn.type}</TableCell>
                            <TableCell>{txn.counterparty}</TableCell>
                            <TableCell>
                              <Badge variant={
                                txn.status === "Completed" ? "outline" :
                                txn.status === "Flagged" ? "destructive" :
                                "warning"
                              }>
                                {txn.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant={
                                txn.risk === "Critical" ? "destructive" :
                                txn.risk === "High" ? "warning" :
                                "outline"
                              }>
                                {txn.risk}
                              </Badge>
                            </TableCell>
                            <TableCell>
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
                      <AlertTriangle className="h-5 w-5" />
                      Related Alerts
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {relatedAlerts.map((alert) => (
                        <div key={alert.id} className="flex items-center justify-between p-3 border rounded">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm">{alert.type}</span>
                              <Badge variant={
                                alert.severity === "High" ? "destructive" :
                                alert.severity === "Medium" ? "warning" :
                                "outline"
                              }>
                                {alert.severity}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">{alert.description}</p>
                            <p className="text-xs text-muted-foreground">{alert.date}</p>
                          </div>
                          <Button variant="ghost" size="sm">
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="evidence" className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="flex items-center gap-2">
                        <Database className="h-5 w-5" />
                        Evidence Collection
                      </CardTitle>
                      <Button>
                        <Plus className="h-4 w-4 mr-1" />
                        Add Evidence
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {evidenceItems.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-4 border rounded">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-muted rounded">
                              {item.type === "Document" && <FileText className="h-4 w-4" />}
                              {item.type === "Transaction" && <CreditCard className="h-4 w-4" />}
                              {item.type === "Communication" && <MessageSquare className="h-4 w-4" />}
                              {item.type === "External" && <Globe className="h-4 w-4" />}
                              {item.type === "Behavioral" && <Brain className="h-4 w-4" />}
                            </div>
                            <div>
                              <h4 className="font-medium">{item.name}</h4>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span>{item.type}</span>
                                <span>•</span>
                                <span>{item.date}</span>
                                <span>•</span>
                                <span>{item.source}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={
                              item.status === "Verified" ? "outline" :
                              item.status === "Under Review" ? "warning" :
                              item.status === "Anomalous" ? "destructive" :
                              "secondary"
                            }>
                              {item.status}
                            </Badge>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Download className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Paperclip className="h-5 w-5" />
                      Document Upload
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                      <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-4" />
                      <p className="text-sm text-muted-foreground mb-2">
                        Drag and drop files here, or click to browse
                      </p>
                      <Button variant="outline">
                        Choose Files
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analysis" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        Risk Score Breakdown
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ChartContainer
                        config={{
                          score: { label: "Risk Score", color: "hsl(var(--primary))" },
                        }}
                        className="h-[200px]"
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={riskFactors}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="factor" angle={-45} textAnchor="end" height={80} />
                            <YAxis />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Bar dataKey="score" fill="hsl(var(--primary))" />
                          </BarChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <PieChart className="h-5 w-5" />
                        Evidence Distribution
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ChartContainer
                        config={{
                          value: { label: "Count", color: "hsl(var(--primary))" },
                        }}
                        className="h-[200px]"
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <RechartsPieChart>
                            <Pie
                              data={[
                                { name: "Documents", value: 2, color: "#3b82f6" },
                                { name: "Transactions", value: 1, color: "#10b981" },
                                { name: "Communications", value: 1, color: "#f59e0b" },
                                { name: "External", value: 1, color: "#ef4444" },
                              ]}
                              cx="50%"
                              cy="50%"
                              outerRadius={60}
                              dataKey="value"
                              label={({ name, value }) => `${name}: ${value}`}
                            >
                              {[
                                { name: "Documents", value: 2, color: "#3b82f6" },
                                { name: "Transactions", value: 1, color: "#10b981" },
                                { name: "Communications", value: 1, color: "#f59e0b" },
                                { name: "External", value: 1, color: "#ef4444" },
                              ].map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <ChartTooltip content={<ChartTooltipContent />} />
                          </RechartsPieChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="h-5 w-5" />
                      AI Analysis Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-primary/5 border border-primary/20 rounded">
                      <div className="flex items-start gap-3">
                        <Zap className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <h4 className="font-medium">Pattern Recognition</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            AI has identified unusual transaction velocity patterns consistent with potential structuring behavior. 
                            The customer's transaction frequency has increased by 340% over the past 30 days.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-warning/5 border border-warning/20 rounded">
                      <div className="flex items-start gap-3">
                        <Target className="h-5 w-5 text-warning mt-0.5" />
                        <div>
                          <h4 className="font-medium">Risk Assessment</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            Multiple risk factors detected including geographic anomalies, counterparty risk, and behavioral deviations. 
                            Recommend immediate investigation and potential account restrictions.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-accent/5 border border-accent/20 rounded">
                      <div className="flex items-start gap-3">
                        <Star className="h-5 w-5 text-accent mt-0.5" />
                        <div>
                          <h4 className="font-medium">Recommendation</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            Based on the analysis, recommend escalating to senior compliance officer and requesting additional 
                            customer documentation to verify the legitimacy of recent transaction patterns.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notes" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" />
                      Investigation Notes
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <Textarea
                        placeholder="Add investigation note..."
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        rows={3}
                      />
                      <div className="flex justify-between items-center">
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Paperclip className="h-3 w-3 mr-1" />
                            Attach File
                          </Button>
                          <Select defaultValue="Investigation">
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Investigation">Investigation</SelectItem>
                              <SelectItem value="System">System</SelectItem>
                              <SelectItem value="External">External</SelectItem>
                              <SelectItem value="Internal">Internal</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button disabled={!newNote.trim()}>
                          <Send className="h-4 w-4 mr-1" />
                          Add Note
                        </Button>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      {investigationNotes.map((note) => (
                        <div key={note.id} className="p-4 border rounded">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className="text-xs">
                                  {note.author.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <span className="font-medium text-sm">{note.author}</span>
                              <Badge variant="outline" className="text-xs">{note.type}</Badge>
                            </div>
                            <span className="text-xs text-muted-foreground">{note.timestamp}</span>
                          </div>
                          <p className="text-sm mb-3">{note.content}</p>
                          {note.attachments.length > 0 && (
                            <div className="flex gap-2">
                              {note.attachments.map((attachment, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  <Paperclip className="h-3 w-3 mr-1" />
                                  {attachment}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close Investigation
          </Button>
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-1" />
            Generate Report
          </Button>
          <Button>
            <Save className="h-4 w-4 mr-1" />
            Save & Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}