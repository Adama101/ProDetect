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
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  SlidersHorizontal,
  Zap,
  Brain,
  Target,
  Activity,
  CheckCircle,
  DollarSign,
  Settings,
  Play,
  Save,
  Plus,
  Edit,
  Eye,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Sparkles,
  Lightbulb,
  Cpu,
  ArrowRight,
  GitBranch,
} from "lucide-react";

interface AutomatedComplianceEngineModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Mock data for compliance engine
const automationRules = [
  {
    id: "auto_001",
    name: "High-Value Transaction Auto-Review",
    description: "Automatically review and score transactions above $50,000",
    category: "Transaction Monitoring",
    enabled: true,
    priority: "High",
    triggers: 1247,
    successRate: 94.2,
    automationLevel: 85,
    conditions: {
      amount: "> $50,000",
      frequency: "Real-time",
      riskFactors: ["Amount", "Velocity", "Geographic"],
    },
    actions: [
      "Generate risk score",
      "Create alert if score > 70",
      "Auto-assign to analyst",
      "Notify compliance team",
    ],
    lastExecuted: "2 minutes ago",
    performance: {
      accuracy: 94.2,
      falsePositives: 5.8,
      processingTime: "1.2 seconds",
    },
  },
  {
    id: "auto_002",
    name: "Sanctions Screening Automation",
    description: "Real-time sanctions list screening for all transactions",
    category: "Sanctions",
    enabled: true,
    priority: "Critical",
    triggers: 3456,
    successRate: 99.1,
    automationLevel: 98,
    conditions: {
      scope: "All transactions",
      frequency: "Real-time",
      lists: ["OFAC", "UN", "EU", "Local"],
    },
    actions: [
      "Screen against watchlists",
      "Block if positive match",
      "Generate immediate alert",
      "Freeze account if critical",
    ],
    lastExecuted: "30 seconds ago",
    performance: {
      accuracy: 99.1,
      falsePositives: 0.9,
      processingTime: "0.3 seconds",
    },
  },
  {
    id: "auto_003",
    name: "Customer Risk Profiling",
    description: "Automated customer risk assessment and categorization",
    category: "Risk Management",
    enabled: true,
    priority: "Medium",
    triggers: 892,
    successRate: 87.5,
    automationLevel: 75,
    conditions: {
      trigger: "New customer onboarding",
      frequency: "On-demand",
      factors: ["KYC", "Geographic", "Business Type"],
    },
    actions: [
      "Analyze customer data",
      "Calculate risk score",
      "Assign risk category",
      "Set monitoring level",
    ],
    lastExecuted: "15 minutes ago",
    performance: {
      accuracy: 87.5,
      falsePositives: 12.5,
      processingTime: "5.8 seconds",
    },
  },
];

const workflowTemplates = [
  {
    id: "wf_001",
    name: "AML Investigation Workflow",
    description: "Automated workflow for AML case investigations",
    steps: 8,
    automationLevel: 70,
    avgDuration: "2.5 days",
    usageCount: 156,
    enabled: true,
    stages: [
      { name: "Initial Triage", automated: true, duration: "5 minutes" },
      { name: "Data Collection", automated: true, duration: "30 minutes" },
      { name: "Risk Assessment", automated: true, duration: "15 minutes" },
      { name: "Expert Review", automated: false, duration: "4 hours" },
      { name: "Decision Making", automated: false, duration: "2 hours" },
      { name: "Documentation", automated: true, duration: "20 minutes" },
      { name: "Reporting", automated: true, duration: "10 minutes" },
      { name: "Case Closure", automated: false, duration: "30 minutes" },
    ],
  },
  {
    id: "wf_002",
    name: "Customer Onboarding Compliance",
    description: "Automated compliance checks for new customers",
    steps: 6,
    automationLevel: 90,
    avgDuration: "45 minutes",
    usageCount: 1247,
    enabled: true,
    stages: [
      { name: "Document Verification", automated: true, duration: "10 minutes" },
      { name: "Identity Validation", automated: true, duration: "5 minutes" },
      { name: "Sanctions Screening", automated: true, duration: "2 minutes" },
      { name: "Risk Assessment", automated: true, duration: "8 minutes" },
      { name: "Approval Decision", automated: true, duration: "15 minutes" },
      { name: "Account Setup", automated: false, duration: "5 minutes" },
    ],
  },
];

const performanceMetrics = [
  { name: "Overall Automation", value: 87.5, trend: "up", change: "+5.3%" },
  { name: "Processing Speed", value: 94.2, trend: "up", change: "+12.1%" },
  { name: "Accuracy Rate", value: 96.8, trend: "stable", change: "0%" },
  { name: "Cost Reduction", value: 78.3, trend: "up", change: "+8.7%" },
];

const aiAgents = [
  {
    id: "agent_001",
    name: "Transaction Analyzer",
    type: "ML Model",
    status: "Active",
    accuracy: 94.2,
    tasksCompleted: 15678,
    avgProcessingTime: "1.2s",
    specialization: "Transaction pattern analysis and risk scoring",
    lastUpdate: "2 hours ago",
  },
  {
    id: "agent_002",
    name: "Sanctions Screener",
    type: "Rule Engine",
    status: "Active",
    accuracy: 99.1,
    tasksCompleted: 45231,
    avgProcessingTime: "0.3s",
    specialization: "Real-time sanctions and watchlist screening",
    lastUpdate: "30 minutes ago",
  },
  {
    id: "agent_003",
    name: "Risk Profiler",
    type: "Ensemble Model",
    status: "Training",
    accuracy: 87.5,
    tasksCompleted: 8934,
    avgProcessingTime: "5.8s",
    specialization: "Customer risk assessment and profiling",
    lastUpdate: "1 hour ago",
  },
];

export function AutomatedComplianceEngineModal({ open, onOpenChange }: AutomatedComplianceEngineModalProps) {
  const [selectedRule, setSelectedRule] = useState(automationRules[0]);
  const [isDeploying, setIsDeploying] = useState(false);

  const handleDeployRule = (ruleId: string) => {
    setIsDeploying(true);
    setTimeout(() => setIsDeploying(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <SlidersHorizontal className="h-6 w-6 text-primary" />
            Automated Compliance Engine
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="automation" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="automation">Automation Rules</TabsTrigger>
            <TabsTrigger value="workflows">Workflows</TabsTrigger>
            <TabsTrigger value="agents">AI Agents</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="deployment">Deployment</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="automation" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {performanceMetrics.map((metric, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="h-4 w-4 text-primary" />
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
                {automationRules.map((rule) => (
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
                            {rule.enabled && (
                              <Badge variant="outline" className="text-success">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Active
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            {rule.description}
                          </p>
                          <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                            <div>
                              <span>Triggers:</span>
                              <span className="ml-2 font-medium">{rule.triggers}</span>
                            </div>
                            <div>
                              <span>Success Rate:</span>
                              <span className="ml-2 font-medium">{rule.successRate}%</span>
                            </div>
                            <div>
                              <span>Automation:</span>
                              <span className="ml-2 font-medium">{rule.automationLevel}%</span>
                            </div>
                            <div>
                              <span>Last Run:</span>
                              <span className="ml-2 font-medium">{rule.lastExecuted}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch checked={rule.enabled} />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeployRule(rule.id);
                            }}
                            disabled={isDeploying}
                          >
                            {isDeploying ? (
                              <>
                                <Activity className="h-3 w-3 mr-1 animate-pulse" />
                                Deploying...
                              </>
                            ) : (
                              <>
                                <Play className="h-3 w-3 mr-1" />
                                Deploy
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
                    <CardTitle className="text-lg">Rule Configuration</CardTitle>
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
                        {Object.entries(selectedRule.conditions).map(([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span className="capitalize">{key}:</span>
                            <span className="font-medium">{Array.isArray(value) ? value.join(", ") : value}</span>
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
                          <span>Accuracy</span>
                          <span>{selectedRule.performance.accuracy}%</span>
                        </div>
                        <Progress value={selectedRule.performance.accuracy} className="h-2" />
                        <div className="flex justify-between text-sm">
                          <span>False Positives</span>
                          <span>{selectedRule.performance.falsePositives}%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Processing Time</span>
                          <span>{selectedRule.performance.processingTime}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Lightbulb className="h-4 w-4" />
                      Optimization Tips
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="p-3 bg-primary/5 border border-primary/20 rounded">
                      <div className="flex items-start gap-2">
                        <Sparkles className="h-4 w-4 text-primary mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Performance Boost</p>
                          <p className="text-xs text-muted-foreground">
                            Increase automation level by 12% with enhanced ML models
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 bg-accent/5 border border-accent/20 rounded">
                      <div className="flex items-start gap-2">
                        <Target className="h-4 w-4 text-accent mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Reduce False Positives</p>
                          <p className="text-xs text-muted-foreground">
                            Fine-tune thresholds to reduce false positives by 3%
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="workflows" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Automated Workflows</h3>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {workflowTemplates.map((workflow) => (
                <Card key={workflow.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{workflow.name}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">{workflow.description}</p>
                      </div>
                      <Switch checked={workflow.enabled} />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Steps:</span>
                        <span className="ml-2 font-medium">{workflow.steps}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Automation:</span>
                        <span className="ml-2 font-medium">{workflow.automationLevel}%</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Avg Duration:</span>
                        <span className="ml-2 font-medium">{workflow.avgDuration}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Usage:</span>
                        <span className="ml-2 font-medium">{workflow.usageCount}</span>
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium mb-2 block">Workflow Stages</Label>
                      <div className="space-y-2">
                        {workflow.stages.map((stage, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded text-sm">
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${stage.automated ? 'bg-success' : 'bg-warning'}`} />
                              <span>{stage.name}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span>{stage.duration}</span>
                              {stage.automated ? (
                                <Badge variant="outline" className="text-success">Auto</Badge>
                              ) : (
                                <Badge variant="outline" className="text-warning">Manual</Badge>
                              )}
                            </div>
                          </div>
                        ))}
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
          </TabsContent>

          <TabsContent value="agents" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">AI Agents</h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Brain className="h-4 w-4 mr-1" />
                  Train New Agent
                </Button>
                <Button>
                  <Plus className="h-4 w-4 mr-1" />
                  Deploy Agent
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {aiAgents.map((agent) => (
                <Card key={agent.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold">{agent.name}</h4>
                          <Badge variant="outline">{agent.type}</Badge>
                          <Badge
                            variant={
                              agent.status === "Active"
                                ? "outline"
                                : agent.status === "Training"
                                ? "warning"
                                : "secondary"
                            }
                            className={
                              agent.status === "Active" ? "text-success" : ""
                            }
                          >
                            {agent.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          {agent.specialization}
                        </p>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Accuracy:</span>
                            <span className="ml-2 font-medium">{agent.accuracy}%</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Tasks:</span>
                            <span className="ml-2 font-medium">{agent.tasksCompleted.toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Avg Time:</span>
                            <span className="ml-2 font-medium">{agent.avgProcessingTime}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Settings className="h-3 w-3 mr-1" />
                          Configure
                        </Button>
                        <Button variant="outline" size="sm">
                          <BarChart3 className="h-3 w-3 mr-1" />
                          Metrics
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Rules Active</span>
                  </div>
                  <div className="text-2xl font-bold">47</div>
                  <div className="text-xs text-success">+3 this week</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="h-4 w-4 text-warning" />
                    <span className="text-sm font-medium">Avg Processing</span>
                  </div>
                  <div className="text-2xl font-bold">1.8s</div>
                  <div className="text-xs text-success">-0.3s this week</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <span className="text-sm font-medium">Success Rate</span>
                  </div>
                  <div className="text-2xl font-bold">96.8%</div>
                  <div className="text-xs text-success">+1.2% this week</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-4 w-4 text-accent" />
                    <span className="text-sm font-medium">Cost Savings</span>
                  </div>
                  <div className="text-2xl font-bold">$127K</div>
                  <div className="text-xs text-success">+$23K this month</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Automation Performance Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center border-2 border-dashed border-border rounded-lg">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Performance analytics visualization</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="deployment" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cpu className="h-5 w-5" />
                  Deployment Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Production Environment</h4>
                    {automationRules.map((rule) => (
                      <div key={rule.id} className="flex items-center justify-between p-3 border rounded">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${rule.enabled ? 'bg-success' : 'bg-muted'}`} />
                          <span className="font-medium">{rule.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{rule.category}</Badge>
                          <Switch checked={rule.enabled} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-medium">System Resources</h4>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>CPU Usage</span>
                          <span>23%</span>
                        </div>
                        <Progress value={23} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Memory Usage</span>
                          <span>67%</span>
                        </div>
                        <Progress value={67} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Processing Queue</span>
                          <span>12 items</span>
                        </div>
                        <Progress value={30} className="h-2" />
                      </div>
                    </div>
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
                  Engine Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label>Default Automation Level</Label>
                      <div className="space-y-2 mt-2">
                        <Slider defaultValue={[75]} max={100} step={1} className="w-full" />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Manual</span>
                          <span>75%</span>
                          <span>Fully Automated</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <Label>Processing Priority</Label>
                      <Select defaultValue="balanced">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="speed">Speed Optimized</SelectItem>
                          <SelectItem value="balanced">Balanced</SelectItem>
                          <SelectItem value="accuracy">Accuracy Optimized</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label>Notification Settings</Label>
                      <div className="space-y-2 mt-2">
                        <div className="flex items-center space-x-2">
                          <Switch id="rule-notifications" defaultChecked />
                          <Label htmlFor="rule-notifications" className="text-sm">Rule execution notifications</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch id="error-notifications" defaultChecked />
                          <Label htmlFor="error-notifications" className="text-sm">Error notifications</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch id="performance-alerts" />
                          <Label htmlFor="performance-alerts" className="text-sm">Performance alerts</Label>
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