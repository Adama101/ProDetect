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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
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
  Calendar as CalendarIcon,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Download,
  Upload,
  Send,
  Eye,
  Edit,
  Plus,
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
} from "lucide-react";
import { format } from "date-fns";

interface RegulatoryReportingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Mock data for regulatory reporting
const reportTemplates = [
  {
    id: "sar_template",
    name: "Suspicious Activity Report (SAR)",
    description: "Automated SAR generation for NFIU submission",
    frequency: "As needed",
    lastGenerated: "2024-01-15",
    status: "active",
    automationLevel: 85,
    avgGenerationTime: "45 minutes",
    submissions: 156,
    accuracy: 98.2,
    regulatoryBody: "NFIU",
    deadline: "Within 7 days",
    fields: ["Customer Information", "Transaction Details", "Suspicious Indicators", "Investigation Summary"],
  },
  {
    id: "str_template",
    name: "Suspicious Transaction Report (STR)",
    description: "Real-time STR filing for high-risk transactions",
    frequency: "Real-time",
    lastGenerated: "2024-01-16",
    status: "active",
    automationLevel: 92,
    avgGenerationTime: "12 minutes",
    submissions: 89,
    accuracy: 99.1,
    regulatoryBody: "CBN",
    deadline: "Immediate",
    fields: ["Transaction Data", "Risk Assessment", "Customer Profile", "Compliance Notes"],
  },
  {
    id: "ctr_template",
    name: "Currency Transaction Report (CTR)",
    description: "Large cash transaction reporting",
    frequency: "Daily",
    lastGenerated: "2024-01-16",
    status: "active",
    automationLevel: 95,
    avgGenerationTime: "8 minutes",
    submissions: 234,
    accuracy: 99.8,
    regulatoryBody: "CBN",
    deadline: "Next business day",
    fields: ["Transaction Amount", "Customer Identity", "Business Purpose", "Source of Funds"],
  },
  {
    id: "aml_summary",
    name: "Monthly AML Summary",
    description: "Comprehensive monthly compliance report",
    frequency: "Monthly",
    lastGenerated: "2024-01-01",
    status: "active",
    automationLevel: 78,
    avgGenerationTime: "2.5 hours",
    submissions: 12,
    accuracy: 97.5,
    regulatoryBody: "CBN",
    deadline: "15th of following month",
    fields: ["Alert Statistics", "Case Summaries", "Risk Metrics", "Compliance Actions"],
  },
];

const pendingReports = [
  {
    id: "RPT001",
    type: "SAR",
    title: "High-Value Transaction Investigation",
    priority: "Critical",
    dueDate: "2024-01-18",
    progress: 85,
    status: "In Review",
    assignedTo: "Sarah Chen",
    estimatedCompletion: "2 hours",
  },
  {
    id: "RPT002",
    type: "STR",
    title: "Sanctions Screening Alert",
    priority: "High",
    dueDate: "2024-01-17",
    progress: 100,
    status: "Ready for Submission",
    assignedTo: "Michael Rodriguez",
    estimatedCompletion: "Ready",
  },
  {
    id: "RPT003",
    type: "CTR",
    title: "Large Cash Transaction Batch",
    priority: "Medium",
    dueDate: "2024-01-19",
    progress: 45,
    status: "Data Collection",
    assignedTo: "AI Agent",
    estimatedCompletion: "4 hours",
  },
];

const submissionHistory = [
  {
    id: "SUB001",
    reportType: "SAR",
    submittedDate: "2024-01-15",
    status: "Accepted",
    regulatoryBody: "NFIU",
    confirmationNumber: "SAR-2024-001567",
    responseTime: "2 hours",
  },
  {
    id: "SUB002",
    reportType: "STR",
    submittedDate: "2024-01-14",
    status: "Accepted",
    regulatoryBody: "CBN",
    confirmationNumber: "STR-2024-002341",
    responseTime: "45 minutes",
  },
  {
    id: "SUB003",
    reportType: "CTR",
    submittedDate: "2024-01-13",
    status: "Under Review",
    regulatoryBody: "CBN",
    confirmationNumber: "CTR-2024-003892",
    responseTime: "Pending",
  },
];

const complianceMetrics = [
  { name: "On-Time Submissions", value: 98.5, trend: "up", change: "+1.2%" },
  { name: "Accuracy Rate", value: 99.1, trend: "stable", change: "0%" },
  { name: "Automation Level", value: 87.5, trend: "up", change: "+5.3%" },
  { name: "Response Time", value: 94.2, trend: "up", change: "+2.1%" },
];

export function RegulatoryReportingModal({ open, onOpenChange }: RegulatoryReportingModalProps) {
  const [selectedTemplate, setSelectedTemplate] = useState(reportTemplates[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();

  const handleGenerateReport = (templateId: string) => {
    setIsGenerating(true);
    setTimeout(() => setIsGenerating(false), 3000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <FileText className="h-6 w-6 text-primary" />
            Regulatory Reporting & Compliance
          </DialogTitle>
          <DialogDescription>
            Automated regulatory report generation, submission tracking, and compliance management
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="templates" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="templates">Report Templates</TabsTrigger>
            <TabsTrigger value="pending">Pending Reports</TabsTrigger>
            <TabsTrigger value="submissions">Submission History</TabsTrigger>
            <TabsTrigger value="automation">Automation</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="templates" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {complianceMetrics.map((metric, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Activity className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">{metric.name}</span>
                    </div>
                    <div className="text-2xl font-bold">{metric.value}%</div>
                    <div className="flex items-center gap-1 text-xs">
                      {metric.trend === "up" ? (
                        <TrendingUp className="h-3 w-3 text-success" />
                      ) : metric.trend === "down" ? (
                        <TrendingDown className="h-3 w-3 text-destructive" />
                      ) : (
                        <div className="h-3 w-3" />
                      )}
                      <span className={metric.trend === "up" ? "text-success" : metric.trend === "down" ? "text-destructive" : "text-muted-foreground"}>
                        {metric.change}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                {reportTemplates.map((template) => (
                  <Card 
                    key={template.id} 
                    className={`cursor-pointer transition-all ${
                      selectedTemplate.id === template.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setSelectedTemplate(template)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold">{template.name}</h4>
                            <Badge variant="outline">{template.regulatoryBody}</Badge>
                            {template.status === "active" && (
                              <Badge variant="outline" className="text-success">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Active
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            {template.description}
                          </p>
                          <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                            <div>
                              <span>Frequency:</span>
                              <span className="ml-2 font-medium">{template.frequency}</span>
                            </div>
                            <div>
                              <span>Automation:</span>
                              <span className="ml-2 font-medium">{template.automationLevel}%</span>
                            </div>
                            <div>
                              <span>Avg Time:</span>
                              <span className="ml-2 font-medium">{template.avgGenerationTime}</span>
                            </div>
                            <div>
                              <span>Submissions:</span>
                              <span className="ml-2 font-medium">{template.submissions}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleGenerateReport(template.id);
                            }}
                            disabled={isGenerating}
                          >
                            {isGenerating ? (
                              <>
                                <Activity className="h-3 w-3 mr-1 animate-pulse" />
                                Generating...
                              </>
                            ) : (
                              <>
                                <Plus className="h-3 w-3 mr-1" />
                                Generate
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Template Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">Regulatory Body</Label>
                      <p className="text-sm text-muted-foreground">{selectedTemplate.regulatoryBody}</p>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium">Submission Deadline</Label>
                      <p className="text-sm text-muted-foreground">{selectedTemplate.deadline}</p>
                    </div>

                    <div>
                      <Label className="text-sm font-medium">Automation Level</Label>
                      <div className="space-y-2 mt-2">
                        <div className="flex justify-between text-sm">
                          <span>Current</span>
                          <span>{selectedTemplate.automationLevel}%</span>
                        </div>
                        <Progress value={selectedTemplate.automationLevel} className="h-2" />
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium">Required Fields</Label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedTemplate.fields.map((field, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {field}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium">Performance</Label>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Accuracy Rate</span>
                          <span>{selectedTemplate.accuracy}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Avg Generation Time</span>
                          <span>{selectedTemplate.avgGenerationTime}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total Submissions</span>
                          <span>{selectedTemplate.submissions}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Lightbulb className="h-4 w-4" />
                      AI Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="p-3 bg-primary/5 border border-primary/20 rounded">
                      <div className="flex items-start gap-2">
                        <Sparkles className="h-4 w-4 text-primary mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Optimization Available</p>
                          <p className="text-xs text-muted-foreground">
                            Increase automation by 8% with enhanced data validation
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 bg-accent/5 border border-accent/20 rounded">
                      <div className="flex items-start gap-2">
                        <Target className="h-4 w-4 text-accent mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Template Enhancement</p>
                          <p className="text-xs text-muted-foreground">
                            Add predictive risk scoring for better accuracy
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
              <h3 className="text-lg font-semibold">Pending Reports</h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-1" />
                  Filter
                </Button>
                <Button>
                  <Plus className="h-4 w-4 mr-1" />
                  New Report
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {pendingReports.map((report) => (
                <Card key={report.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className="font-semibold">{report.title}</h4>
                          <Badge variant="outline">{report.type}</Badge>
                          <Badge
                            variant={
                              report.priority === "Critical"
                                ? "destructive"
                                : report.priority === "High"
                                ? "warning"
                                : "secondary"
                            }
                          >
                            {report.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">Report ID: {report.id}</p>
                      </div>
                      <Badge
                        variant={
                          report.status === "Ready for Submission"
                            ? "outline"
                            : report.status === "In Review"
                            ? "warning"
                            : "secondary"
                        }
                        className={
                          report.status === "Ready for Submission" ? "text-success" : ""
                        }
                      >
                        {report.status}
                      </Badge>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span>Progress</span>
                        <span>{report.progress}%</span>
                      </div>
                      <Progress value={report.progress} className="h-2" />

                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Due Date:</span>
                          <p className="font-medium">{report.dueDate}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Assigned To:</span>
                          <p className="font-medium">{report.assignedTo}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">ETA:</span>
                          <p className="font-medium">{report.estimatedCompletion}</p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        {report.status === "Ready for Submission" && (
                          <Button size="sm">
                            <Send className="h-3 w-3 mr-1" />
                            Submit
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="submissions" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Submission History</h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-1" />
                  Export
                </Button>
                <Button variant="outline" size="sm">
                  <Search className="h-4 w-4 mr-1" />
                  Search
                </Button>
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Report Type</TableHead>
                  <TableHead>Submitted Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Regulatory Body</TableHead>
                  <TableHead>Confirmation #</TableHead>
                  <TableHead>Response Time</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissionHistory.map((submission) => (
                  <TableRow key={submission.id}>
                    <TableCell>
                      <Badge variant="outline">{submission.reportType}</Badge>
                    </TableCell>
                    <TableCell>{submission.submittedDate}</TableCell>
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
                    <TableCell>{submission.regulatoryBody}</TableCell>
                    <TableCell className="font-mono text-sm">
                      {submission.confirmationNumber}
                    </TableCell>
                    <TableCell>{submission.responseTime}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
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

          <TabsContent value="automation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Automation Configuration
                </CardTitle>
                <DialogDescription>
                  Configure automated report generation, validation, and submission workflows
                </DialogDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Auto-Generate SARs</h4>
                        <p className="text-sm text-muted-foreground">Automatically create SARs when alerts reach threshold</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Real-time STR Filing</h4>
                        <p className="text-sm text-muted-foreground">Submit STRs immediately upon detection</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Batch CTR Processing</h4>
                        <p className="text-sm text-muted-foreground">Process CTRs in scheduled batches</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">AI Data Validation</h4>
                        <p className="text-sm text-muted-foreground">Use AI to validate report data before submission</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Smart Scheduling</h4>
                        <p className="text-sm text-muted-foreground">Optimize submission timing based on regulatory patterns</p>
                      </div>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Auto-Follow-up</h4>
                        <p className="text-sm text-muted-foreground">Automatically follow up on pending submissions</p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Total Reports</span>
                  </div>
                  <div className="text-2xl font-bold">1,247</div>
                  <div className="text-xs text-success">+12% this month</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <span className="text-sm font-medium">Success Rate</span>
                  </div>
                  <div className="text-2xl font-bold">98.7%</div>
                  <div className="text-xs text-success">+0.3% this month</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-warning" />
                    <span className="text-sm font-medium">Avg Processing</span>
                  </div>
                  <div className="text-2xl font-bold">23min</div>
                  <div className="text-xs text-success">-15% this month</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="h-4 w-4 text-accent" />
                    <span className="text-sm font-medium">Automation</span>
                  </div>
                  <div className="text-2xl font-bold">87.5%</div>
                  <div className="text-xs text-success">+5.3% this month</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Regulatory Compliance Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center border-2 border-dashed border-border rounded-lg">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Compliance trends visualization</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Regulatory Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label>Default Regulatory Body</Label>
                      <Select defaultValue="cbn">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cbn">Central Bank of Nigeria (CBN)</SelectItem>
                          <SelectItem value="nfiu">Nigeria Financial Intelligence Unit (NFIU)</SelectItem>
                          <SelectItem value="sec">Securities and Exchange Commission (SEC)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Report Retention Period</Label>
                      <Select defaultValue="7years">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5years">5 Years</SelectItem>
                          <SelectItem value="7years">7 Years</SelectItem>
                          <SelectItem value="10years">10 Years</SelectItem>
                          <SelectItem value="indefinite">Indefinite</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label>Notification Settings</Label>
                      <div className="space-y-2 mt-2">
                        <div className="flex items-center space-x-2">
                          <Switch id="email-notifications" defaultChecked />
                          <Label htmlFor="email-notifications" className="text-sm">Email notifications</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch id="sms-notifications" />
                          <Label htmlFor="sms-notifications" className="text-sm">SMS notifications</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch id="slack-notifications" defaultChecked />
                          <Label htmlFor="slack-notifications" className="text-sm">Slack notifications</Label>
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