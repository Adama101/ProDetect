"use client";

import { useState, useEffect } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
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
  Send,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Download,
  Upload,
  Plus,
  Edit,
  Eye,
  Trash2,
  Filter,
  Search,
  BarChart3,
  PieChart,
  TrendingUp,
  TrendingDown,
  Activity,
  Shield,
  Globe,
  Building,
  Users,
  DollarSign,
  Target,
  Zap,
  Brain,
  Sparkles,
  Settings,
  Save,
  RotateCcw,
  Play,
  Pause,
  Mail,
  Phone,
  MapPin,
  Database,
  Network,
  Cpu,
  Code,
  Workflow,
  Star,
  ThumbsUp,
  ThumbsDown,
  ArrowRight,
  ExternalLink,
  Copy,
  Lightbulb,
  Flag,
  Bell,
  Lock,
  Unlock,
  Key,
  Hash,
  AtSign,
  Percent,
  RefreshCw,
} from "lucide-react";
import { format } from "date-fns";

interface RegulatorySubmissionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Mock data for regulatory submissions
const regulatoryBodies = [
  {
    id: "reg_001",
    name: "Central Bank of Nigeria (CBN)",
    code: "CBN",
    country: "Nigeria",
    website: "https://www.cbn.gov.ng",
    reportTypes: ["STR", "CTR", "AML Summary", "Compliance Report"],
    apiAvailable: true,
    status: "connected",
    lastSubmission: "2024-01-15",
    configuration: {
      apiEndpoint: "https://api.cbn.gov.ng/reporting/v1",
      authType: "API Key",
      encryptionRequired: true,
      digitalSignatureRequired: true,
    },
  },
  {
    id: "reg_002",
    name: "Nigeria Financial Intelligence Unit (NFIU)",
    code: "NFIU",
    country: "Nigeria",
    website: "https://www.nfiu.gov.ng",
    reportTypes: ["SAR", "CTR", "AML Report"],
    apiAvailable: true,
    status: "connected",
    lastSubmission: "2024-01-10",
    configuration: {
      apiEndpoint: "https://api.nfiu.gov.ng/reports/v1",
      authType: "OAuth 2.0",
      encryptionRequired: true,
      digitalSignatureRequired: true,
    },
  },
  {
    id: "reg_003",
    name: "Securities and Exchange Commission (SEC)",
    code: "SEC",
    country: "Nigeria",
    website: "https://sec.gov.ng",
    reportTypes: ["Suspicious Activity Report", "Compliance Report"],
    apiAvailable: false,
    status: "manual",
    lastSubmission: "2024-01-05",
    configuration: {
      submissionEmail: "reports@sec.gov.ng",
      encryptionRequired: true,
      digitalSignatureRequired: true,
    },
  },
];

const submissionHistory = [
  {
    id: "sub_001",
    reportType: "STR",
    regulatoryBody: "CBN",
    submissionDate: "2024-01-15",
    status: "Accepted",
    referenceNumber: "CBN-STR-2024-001567",
    submittedBy: "Sarah Chen",
    responseTime: "2 hours",
    notes: "Automated submission via API",
  },
  {
    id: "sub_002",
    reportType: "SAR",
    regulatoryBody: "NFIU",
    submissionDate: "2024-01-10",
    status: "Under Review",
    referenceNumber: "NFIU-SAR-2024-002341",
    submittedBy: "Michael Rodriguez",
    responseTime: "Pending",
    notes: "Additional information requested",
  },
  {
    id: "sub_003",
    reportType: "CTR",
    regulatoryBody: "CBN",
    submissionDate: "2024-01-08",
    status: "Accepted",
    referenceNumber: "CBN-CTR-2024-003892",
    submittedBy: "System",
    responseTime: "45 minutes",
    notes: "Automated batch submission",
  },
  {
    id: "sub_004",
    reportType: "Compliance Report",
    regulatoryBody: "SEC",
    submissionDate: "2024-01-05",
    status: "Accepted",
    referenceNumber: "SEC-CR-2024-000123",
    submittedBy: "Emma Thompson",
    responseTime: "2 days",
    notes: "Manual submission via email",
  },
];

const pendingSubmissions = [
  {
    id: "pending_001",
    reportType: "STR",
    regulatoryBody: "CBN",
    dueDate: "2024-01-20",
    status: "Ready for Submission",
    priority: "High",
    assignedTo: "Sarah Chen",
    progress: 100,
  },
  {
    id: "pending_002",
    reportType: "SAR",
    regulatoryBody: "NFIU",
    dueDate: "2024-01-22",
    status: "In Preparation",
    priority: "Medium",
    assignedTo: "Michael Rodriguez",
    progress: 75,
  },
  {
    id: "pending_003",
    reportType: "CTR",
    regulatoryBody: "CBN",
    dueDate: "2024-01-18",
    status: "Awaiting Approval",
    priority: "Critical",
    assignedTo: "Emma Thompson",
    progress: 90,
  },
];

const submissionMetrics = [
  { name: "On-Time Rate", value: "98.5%", trend: "up", change: "+1.2%" },
  { name: "Acceptance Rate", value: "99.1%", trend: "stable", change: "0%" },
  { name: "Avg Response Time", value: "4.5h", trend: "down", change: "-2.3h" },
  { name: "Automation Level", value: "87%", trend: "up", change: "+5%" },
];

export function RegulatorySubmissionModal({ open, onOpenChange }: RegulatorySubmissionModalProps) {
  const [selectedRegulator, setSelectedRegulator] = useState(regulatoryBodies[0]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConnect = (regulatorId: string) => {
    setIsConnecting(true);
    setTimeout(() => setIsConnecting(false), 2000);
  };

  const handleSubmit = (submissionId: string) => {
    setIsSubmitting(true);
    setTimeout(() => setIsSubmitting(false), 3000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Send className="h-6 w-6 text-primary" />
            Regulatory Submission Setup
          </DialogTitle>
          <DialogDescription>
            Configure connections to regulatory bodies and manage automated report submissions
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="regulators" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="regulators">Regulatory Bodies</TabsTrigger>
            <TabsTrigger value="pending">Pending Submissions</TabsTrigger>
            <TabsTrigger value="history">Submission History</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="regulators" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {submissionMetrics.map((metric, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Activity className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">{metric.name}</span>
                    </div>
                    <div className="text-2xl font-bold">{metric.value}</div>
                    <div className="flex items-center gap-1 text-xs">
                      {metric.trend === "up" ? (
                        <TrendingUp className="h-3 w-3 text-success" />
                      ) : metric.trend === "down" ? (
                        <TrendingDown className="h-3 w-3 text-success" />
                      ) : (
                        <div className="h-3 w-3" />
                      )}
                      <span className={metric.trend === "up" ? "text-success" : metric.trend === "down" ? "text-success" : "text-muted-foreground"}>
                        {metric.change}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                {regulatoryBodies.map((regulator) => (
                  <Card 
                    key={regulator.id} 
                    className={`cursor-pointer transition-all ${
                      selectedRegulator.id === regulator.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setSelectedRegulator(regulator)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold">{regulator.name}</h4>
                            <Badge variant="outline">{regulator.code}</Badge>
                            <Badge
                              variant={
                                regulator.status === "connected"
                                  ? "outline"
                                  : "secondary"
                              }
                              className={
                                regulator.status === "connected" ? "text-success" : ""
                              }
                            >
                              {regulator.status === "connected" ? (
                                <CheckCircle className="h-3 w-3 mr-1" />
                              ) : (
                                <AlertTriangle className="h-3 w-3 mr-1" />
                              )}
                              {regulator.status === "connected" ? "Connected" : "Manual Submission"}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            {regulator.country} • {regulator.apiAvailable ? "API Available" : "Manual Submission"}
                          </p>
                          <div className="flex flex-wrap gap-1 mb-3">
                            {regulator.reportTypes.map((type, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {type}
                              </Badge>
                            ))}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            <span>Last Submission: {regulator.lastSubmission}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {regulator.apiAvailable ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleConnect(regulator.id);
                              }}
                              disabled={isConnecting}
                            >
                              {isConnecting ? (
                                <>
                                  <Activity className="h-3 w-3 mr-1 animate-pulse" />
                                  Connecting...
                                </>
                              ) : (
                                <>
                                  {regulator.status === "connected" ? (
                                    <>
                                      <RefreshCw className="h-3 w-3 mr-1" />
                                      Reconnect
                                    </>
                                  ) : (
                                    <>
                                      <Link2 className="h-3 w-3 mr-1" />
                                      Connect
                                    </>
                                  )}
                                </>
                              )}
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Settings className="h-3 w-3 mr-1" />
                              Configure
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Regulator Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">Name</Label>
                      <p className="text-sm text-muted-foreground">{selectedRegulator.name}</p>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium">Country</Label>
                      <p className="text-sm text-muted-foreground">{selectedRegulator.country}</p>
                    </div>

                    <div>
                      <Label className="text-sm font-medium">Website</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <a 
                          href={selectedRegulator.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline flex items-center gap-1"
                        >
                          {selectedRegulator.website}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium">Report Types</Label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedRegulator.reportTypes.map((type, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {type}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium">Connection Details</Label>
                      <div className="space-y-1 text-sm text-muted-foreground mt-1">
                        {selectedRegulator.apiAvailable ? (
                          <>
                            <div className="flex justify-between">
                              <span>API Endpoint:</span>
                              <span className="font-mono text-xs">{selectedRegulator.configuration.apiEndpoint}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Auth Type:</span>
                              <span>{selectedRegulator.configuration.authType}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Encryption:</span>
                              <span>{selectedRegulator.configuration.encryptionRequired ? "Required" : "Optional"}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Digital Signature:</span>
                              <span>{selectedRegulator.configuration.digitalSignatureRequired ? "Required" : "Optional"}</span>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="flex justify-between">
                              <span>Submission Email:</span>
                              <span className="font-mono text-xs">{selectedRegulator.configuration.submissionEmail}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Encryption:</span>
                              <span>{selectedRegulator.configuration.encryptionRequired ? "Required" : "Optional"}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Digital Signature:</span>
                              <span>{selectedRegulator.configuration.digitalSignatureRequired ? "Required" : "Optional"}</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Lightbulb className="h-4 w-4" />
                      Submission Tips
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="p-3 bg-primary/5 border border-primary/20 rounded">
                      <div className="flex items-start gap-2">
                        <Clock className="h-4 w-4 text-primary mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Submission Timing</p>
                          <p className="text-xs text-muted-foreground">
                            Submit reports during off-peak hours for faster processing
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 bg-warning/5 border border-warning/20 rounded">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-warning mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Common Rejection Reasons</p>
                          <p className="text-xs text-muted-foreground">
                            Ensure all mandatory fields are completed to avoid rejections
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="pending" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Pending Submissions</h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-1" />
                  Filter
                </Button>
                <Button>
                  <Plus className="h-4 w-4 mr-1" />
                  New Submission
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {pendingSubmissions.map((submission) => (
                <Card key={submission.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className="font-semibold">{submission.reportType} - {submission.regulatoryBody}</h4>
                          <Badge
                            variant={
                              submission.priority === "Critical"
                                ? "destructive"
                                : submission.priority === "High"
                                ? "warning"
                                : "secondary"
                            }
                          >
                            {submission.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">Due: {submission.dueDate}</p>
                      </div>
                      <Badge
                        variant={
                          submission.status === "Ready for Submission"
                            ? "outline"
                            : submission.status === "In Preparation"
                            ? "secondary"
                            : "warning"
                        }
                        className={
                          submission.status === "Ready for Submission" ? "text-success" : ""
                        }
                      >
                        {submission.status}
                      </Badge>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span>Progress</span>
                        <span>{submission.progress}%</span>
                      </div>
                      <Progress value={submission.progress} className="h-2" />

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Assigned To:</span>
                        <span>{submission.assignedTo}</span>
                      </div>

                      <div className="flex justify-between">
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                        </div>
                        {submission.status === "Ready for Submission" && (
                          <Button 
                            size="sm"
                            onClick={() => handleSubmit(submission.id)}
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? (
                              <>
                                <Activity className="h-3 w-3 mr-1 animate-pulse" />
                                Submitting...
                              </>
                            ) : (
                              <>
                                <Send className="h-3 w-3 mr-1" />
                                Submit
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Submission History</h3>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search submissions..." className="pl-10 w-64" />
                </div>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-1" />
                  Export
                </Button>
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Report Type</TableHead>
                  <TableHead>Regulatory Body</TableHead>
                  <TableHead>Submission Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Reference #</TableHead>
                  <TableHead>Submitted By</TableHead>
                  <TableHead>Response Time</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissionHistory.map((submission) => (
                  <TableRow key={submission.id}>
                    <TableCell>
                      <Badge variant="outline">{submission.reportType}</Badge>
                    </TableCell>
                    <TableCell>{submission.regulatoryBody}</TableCell>
                    <TableCell>{submission.submissionDate}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          submission.status === "Accepted"
                            ? "outline"
                            : submission.status === "Under Review"
                            ? "warning"
                            : "destructive"
                        }
                        className={
                          submission.status === "Accepted" ? "text-success" : ""
                        }
                      >
                        {submission.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {submission.referenceNumber}
                    </TableCell>
                    <TableCell>{submission.submittedBy}</TableCell>
                    <TableCell>{submission.responseTime}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Total Submissions</span>
                  </div>
                  <div className="text-2xl font-bold">247</div>
                  <div className="text-xs text-success">+12% this year</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <span className="text-sm font-medium">Acceptance Rate</span>
                  </div>
                  <div className="text-2xl font-bold">99.1%</div>
                  <div className="text-xs text-success">+0.3% this year</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-warning" />
                    <span className="text-sm font-medium">Avg Response Time</span>
                  </div>
                  <div className="text-2xl font-bold">4.5h</div>
                  <div className="text-xs text-success">-2.3h this year</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="h-4 w-4 text-accent" />
                    <span className="text-sm font-medium">Automation Level</span>
                  </div>
                  <div className="text-2xl font-bold">87%</div>
                  <div className="text-xs text-success">+5% this year</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Submission Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center border-2 border-dashed border-border rounded-lg">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Submission trends visualization</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    Submissions by Type
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48 flex items-center justify-center border-2 border-dashed border-border rounded-lg">
                    <div className="text-center">
                      <PieChart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Report type distribution</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Response Time Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48 flex items-center justify-center border-2 border-dashed border-border rounded-lg">
                    <div className="text-center">
                      <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Response time analysis</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Submission Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label>Default Submission Method</Label>
                      <Select defaultValue="api">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="api">API (Automated)</SelectItem>
                          <SelectItem value="portal">Web Portal</SelectItem>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="manual">Manual</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Digital Signature</Label>
                      <Select defaultValue="enabled">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="enabled">Enabled</SelectItem>
                          <SelectItem value="disabled">Disabled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Encryption</Label>
                      <Select defaultValue="aes256">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="aes256">AES-256</SelectItem>
                          <SelectItem value="aes128">AES-128</SelectItem>
                          <SelectItem value="none">None</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label>Notification Settings</Label>
                      <div className="space-y-2 mt-2">
                        <div className="flex items-center space-x-2">
                          <Switch id="submission-notifications" defaultChecked />
                          <Label htmlFor="submission-notifications" className="text-sm">Submission notifications</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch id="response-notifications" defaultChecked />
                          <Label htmlFor="response-notifications" className="text-sm">Response notifications</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch id="deadline-reminders" defaultChecked />
                          <Label htmlFor="deadline-reminders" className="text-sm">Deadline reminders</Label>
                        </div>
                      </div>
                    </div>
                    <div>
                      <Label>Approval Workflow</Label>
                      <div className="space-y-2 mt-2">
                        <div className="flex items-center space-x-2">
                          <Switch id="require-approval" defaultChecked />
                          <Label htmlFor="require-approval" className="text-sm">Require approval before submission</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch id="auto-approval" />
                          <Label htmlFor="auto-approval" className="text-sm">Auto-approve low-risk submissions</Label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button>
            <Save className="h-4 w-4 mr-1" />
            Save Configuration
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}