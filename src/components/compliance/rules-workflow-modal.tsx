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
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  SlidersHorizontal,
  Workflow,
  Settings,
  Zap,
  Target,
  Clock,
  Users,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Play,
  Pause,
  RotateCcw,
  Save,
  Copy,
  Download,
  Upload,
  Plus,
  Minus,
  Filter,
  BarChart3,
  Activity,
  Shield,
  Brain,
  Code,
  Database,
  Network,
  Cpu,
  Globe,
  Calendar,
  ArrowRight,
  Sparkles,
  Lightbulb,
  GitBranch,
  Timer,
  Mail,
  MessageSquare,
  FileText,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface RulesWorkflowModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Mock data for rules and workflows
const complianceRules = [
  {
    id: "kyc_verification",
    name: "Enhanced KYC Verification",
    description: "Automated customer verification for high-risk jurisdictions",
    category: "KYC",
    priority: "High",
    enabled: true,
    triggers: 1247,
    successRate: 94.2,
    avgProcessingTime: "2.3 minutes",
    conditions: [
      "Customer from high-risk country",
      "Transaction amount > $10,000",
      "New customer (< 30 days)"
    ],
    actions: [
      "Request additional documentation",
      "Escalate to compliance officer",
      "Temporary account restriction"
    ],
    lastModified: "2 hours ago",
    createdBy: "Sarah Chen",
  },
  {
    id: "transaction_monitoring",
    name: "Real-time Transaction Monitoring",
    description: "Continuous monitoring for suspicious transaction patterns",
    category: "AML",
    priority: "Critical",
    enabled: true,
    triggers: 3456,
    successRate: 97.8,
    avgProcessingTime: "0.8 seconds",
    conditions: [
      "Transaction velocity > 10 per hour",
      "Amount deviation > 300% from baseline",
      "Geographic anomaly detected"
    ],
    actions: [
      "Generate alert",
      "Freeze transaction",
      "Notify investigation team"
    ],
    lastModified: "1 day ago",
    createdBy: "Michael Rodriguez",
  },
  {
    id: "sanctions_screening",
    name: "Automated Sanctions Screening",
    description: "Real-time screening against global sanctions lists",
    category: "Sanctions",
    priority: "Critical",
    enabled: true,
    triggers: 892,
    successRate: 99.1,
    avgProcessingTime: "0.3 seconds",
    conditions: [
      "Name match confidence > 85%",
      "DOB within 2 years variance",
      "Address in sanctioned region"
    ],
    actions: [
      "Block transaction immediately",
      "Create investigation case",
      "Notify legal team"
    ],
    lastModified: "3 hours ago",
    createdBy: "Emma Thompson",
  },
];

const workflowTemplates = [
  {
    id: "sar_filing",
    name: "SAR Filing Workflow",
    description: "Automated suspicious activity report preparation and filing",
    category: "Regulatory",
    steps: 8,
    avgDuration: "3.2 days",
    automationLevel: 75,
    enabled: true,
    usageCount: 156,
  },
  {
    id: "case_investigation",
    name: "Case Investigation Process",
    description: "Structured investigation workflow for compliance cases",
    category: "Investigation",
    steps: 12,
    avgDuration: "5.8 days",
    automationLevel: 60,
    enabled: true,
    usageCount: 234,
  },
  {
    id: "customer_onboarding",
    name: "Enhanced Customer Onboarding",
    description: "Risk-based customer onboarding with automated checks",
    category: "KYC",
    steps: 6,
    avgDuration: "1.5 days",
    automationLevel: 85,
    enabled: true,
    usageCount: 1247,
  },
];

const ruleCategories = [
  { id: "aml", name: "AML", icon: Shield, color: "text-blue-500" },
  { id: "kyc", name: "KYC", icon: Users, color: "text-green-500" },
  { id: "sanctions", name: "Sanctions", icon: AlertTriangle, color: "text-red-500" },
  { id: "fraud", name: "Fraud", icon: Target, color: "text-orange-500" },
  { id: "regulatory", name: "Regulatory", icon: FileText, color: "text-purple-500" },
];

export function RulesWorkflowModal({ open, onOpenChange }: RulesWorkflowModalProps) {
  const [selectedRule, setSelectedRule] = useState(complianceRules[0]);
  const [isCreatingRule, setIsCreatingRule] = useState(false);
  const [testingRule, setTestingRule] = useState<string | null>(null);

  const handleTestRule = (ruleId: string) => {
    setTestingRule(ruleId);
    setTimeout(() => setTestingRule(null), 3000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <SlidersHorizontal className="h-6 w-6 text-primary" />
            Advanced Rules & Workflow Management
          </DialogTitle>
          <DialogDescription>
            Configure, automate, and optimize compliance rules and workflows with AI-powered insights
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="rules" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="rules">Compliance Rules</TabsTrigger>
            <TabsTrigger value="workflows">Workflows</TabsTrigger>
            <TabsTrigger value="automation">Automation</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="rules" className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <h3 className="text-lg font-semibold">Active Compliance Rules</h3>
                <Badge variant="outline">{complianceRules.length} Total</Badge>
                <Badge variant="outline" className="text-success">
                  {complianceRules.filter(r => r.enabled).length} Active
                </Badge>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-1" />
                  Import Rules
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-1" />
                  Export Rules
                </Button>
                <Button onClick={() => setIsCreatingRule(true)}>
                  <Plus className="h-4 w-4 mr-1" />
                  New Rule
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                {complianceRules.map((rule) => (
                  <Card 
                    key={rule.id} 
                    className={`cursor-pointer transition-all ${
                      selectedRule.id === rule.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setSelectedRule(rule)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold">{rule.name}</h4>
                            <Badge
                              variant={
                                rule.priority === "Critical"
                                  ? "destructive"
                                  : rule.priority === "High"
                                  ? "warning"
                                  : "secondary"
                              }
                            >
                              {rule.priority}
                            </Badge>
                            <Badge variant="outline">{rule.category}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            {rule.description}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>Triggers: {rule.triggers}</span>
                            <span>Success: {rule.successRate}%</span>
                            <span>Avg Time: {rule.avgProcessingTime}</span>
                            <span>Modified: {rule.lastModified}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch checked={rule.enabled} />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTestRule(rule.id);
                            }}
                            disabled={testingRule === rule.id}
                          >
                            {testingRule === rule.id ? (
                              <>
                                <Activity className="h-3 w-3 mr-1 animate-pulse" />
                                Testing...
                              </>
                            ) : (
                              <>
                                <Play className="h-3 w-3 mr-1" />
                                Test
                              </>
                            )}
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-3 w-3" />
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
                    <CardTitle className="text-lg">Rule Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">Rule Name</Label>
                      <p className="text-sm text-muted-foreground">{selectedRule.name}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Category</Label>
                      <p className="text-sm text-muted-foreground">{selectedRule.category}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Conditions</Label>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        {selectedRule.conditions.map((condition, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <CheckCircle className="h-3 w-3 text-success" />
                            {condition}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Actions</Label>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        {selectedRule.actions.map((action, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <ArrowRight className="h-3 w-3 text-primary" />
                            {action}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Performance</Label>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Success Rate</span>
                          <span>{selectedRule.successRate}%</span>
                        </div>
                        <Progress value={selectedRule.successRate} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <BarChart3 className="h-4 w-4" />
                      Rule Analytics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Total Executions (24h)</span>
                      <span className="font-medium">{selectedRule.triggers}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Successful Actions</span>
                      <span className="font-medium text-success">
                        {Math.round(selectedRule.triggers * (selectedRule.successRate / 100))}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Failed Actions</span>
                      <span className="font-medium text-destructive">
                        {selectedRule.triggers - Math.round(selectedRule.triggers * (selectedRule.successRate / 100))}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Avg Processing Time</span>
                      <span className="font-medium">{selectedRule.avgProcessingTime}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="workflows" className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <h3 className="text-lg font-semibold">Workflow Templates</h3>
                <Badge variant="outline">{workflowTemplates.length} Templates</Badge>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <GitBranch className="h-4 w-4 mr-1" />
                  Workflow Builder
                </Button>
                <Button>
                  <Plus className="h-4 w-4 mr-1" />
                  New Workflow
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {workflowTemplates.map((workflow) => (
                <Card key={workflow.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{workflow.name}</CardTitle>
                        <Badge variant="outline" className="mt-1">{workflow.category}</Badge>
                      </div>
                      <Switch checked={workflow.enabled} />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      {workflow.description}
                    </p>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Steps</span>
                        <span className="font-medium">{workflow.steps}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Avg Duration</span>
                        <span className="font-medium">{workflow.avgDuration}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Automation Level</span>
                        <span className="font-medium">{workflow.automationLevel}%</span>
                      </div>
                      <Progress value={workflow.automationLevel} className="h-2" />
                      <div className="flex justify-between text-sm">
                        <span>Usage Count</span>
                        <span className="font-medium">{workflow.usageCount}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Workflow className="h-5 w-5" />
                  Workflow Performance Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-primary">12</div>
                    <div className="text-sm text-muted-foreground">Active Workflows</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-success">89%</div>
                    <div className="text-sm text-muted-foreground">Avg Automation</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-warning">2.4</div>
                    <div className="text-sm text-muted-foreground">Avg Days</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-accent">1,637</div>
                    <div className="text-sm text-muted-foreground">Total Executions</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="automation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  AI-Powered Automation Features
                </CardTitle>
                <DialogDescription>
                  Configure intelligent automation capabilities to enhance compliance operations
                </DialogDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Smart Case Assignment</h4>
                        <p className="text-sm text-muted-foreground">AI assigns cases based on expertise and workload</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Automated Evidence Collection</h4>
                        <p className="text-sm text-muted-foreground">Gather relevant data automatically for investigations</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Dynamic Risk Scoring</h4>
                        <p className="text-sm text-muted-foreground">Real-time risk assessment with ML models</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Intelligent Escalation</h4>
                        <p className="text-sm text-muted-foreground">Auto-escalate based on severity and patterns</p>
                      </div>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Narrative Generation</h4>
                        <p className="text-sm text-muted-foreground">AI-generated case summaries and reports</p>
                      </div>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Predictive Analytics</h4>
                        <p className="text-sm text-muted-foreground">Forecast compliance risks and trends</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Timer className="h-5 w-5" />
                    Automation Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Tasks Automated</span>
                      <span className="font-medium">78%</span>
                    </div>
                    <Progress value={78} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Time Saved</span>
                      <span className="font-medium">156 hours/week</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Error Reduction</span>
                      <span className="font-medium">67%</span>
                    </div>
                    <Progress value={67} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    AI Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 bg-primary/5 border border-primary/20 rounded">
                    <div className="flex items-start gap-2">
                      <Lightbulb className="h-4 w-4 text-primary mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Optimize KYC Workflow</p>
                        <p className="text-xs text-muted-foreground">
                          Adding parallel document verification could reduce processing time by 40%
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 bg-accent/5 border border-accent/20 rounded">
                    <div className="flex items-start gap-2">
                      <Target className="h-4 w-4 text-accent mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Enhanced Screening</p>
                        <p className="text-xs text-muted-foreground">
                          Implement fuzzy matching for 15% improvement in sanctions detection
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Rule Efficiency</span>
                  </div>
                  <div className="text-2xl font-bold">94.7%</div>
                  <div className="text-xs text-success">+2.3% vs last month</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-warning" />
                    <span className="text-sm font-medium">Avg Processing</span>
                  </div>
                  <div className="text-2xl font-bold">1.8min</div>
                  <div className="text-xs text-success">-23% vs last month</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <span className="text-sm font-medium">Success Rate</span>
                  </div>
                  <div className="text-2xl font-bold">96.2%</div>
                  <div className="text-xs text-success">+1.1% vs last month</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="h-4 w-4 text-accent" />
                    <span className="text-sm font-medium">Daily Executions</span>
                  </div>
                  <div className="text-2xl font-bold">5,247</div>
                  <div className="text-xs text-muted-foreground">+12% vs yesterday</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Rule Performance Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {complianceRules.map((rule) => (
                    <div key={rule.id} className="flex items-center justify-between p-3 border rounded">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${rule.enabled ? 'bg-success' : 'bg-muted'}`} />
                        <span className="font-medium">{rule.name}</span>
                        <Badge variant="outline">{rule.category}</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Executions: {rule.triggers}</span>
                        <span>Success: {rule.successRate}%</span>
                        <span>Time: {rule.avgProcessingTime}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Global Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label>Default Rule Priority</Label>
                      <Select defaultValue="medium">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="critical">Critical</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Notification Settings</Label>
                      <div className="space-y-2 mt-2">
                        <div className="flex items-center space-x-2">
                          <Switch id="email-notifications" defaultChecked />
                          <Label htmlFor="email-notifications" className="text-sm">Email notifications</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch id="slack-notifications" />
                          <Label htmlFor="slack-notifications" className="text-sm">Slack notifications</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch id="sms-notifications" />
                          <Label htmlFor="sms-notifications" className="text-sm">SMS notifications</Label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label>Audit Trail Retention</Label>
                      <Select defaultValue="7years">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1year">1 Year</SelectItem>
                          <SelectItem value="3years">3 Years</SelectItem>
                          <SelectItem value="5years">5 Years</SelectItem>
                          <SelectItem value="7years">7 Years</SelectItem>
                          <SelectItem value="indefinite">Indefinite</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Performance Monitoring</Label>
                      <div className="space-y-2 mt-2">
                        <div className="flex items-center space-x-2">
                          <Switch id="real-time-monitoring" defaultChecked />
                          <Label htmlFor="real-time-monitoring" className="text-sm">Real-time monitoring</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch id="performance-alerts" defaultChecked />
                          <Label htmlFor="performance-alerts" className="text-sm">Performance alerts</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch id="auto-optimization" />
                          <Label htmlFor="auto-optimization" className="text-sm">Auto-optimization</Label>
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