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
import { Slider } from "@/components/ui/slider";
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
  Code,
  Workflow,
  Brain,
  Zap,
  Target,
  Activity,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Users,
  DollarSign,
  Shield,
  Settings,
  Play,
  Pause,
  RotateCcw,
  Save,
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
  Sparkles,
  Lightbulb,
  Database,
  Network,
  Cpu,
  Globe,
  Calendar,
  ArrowRight,
  Star,
  ThumbsUp,
  ThumbsDown,
  Flag,
  Bell,
  Mail,
  Phone,
  MessageSquare,
  FileText,
  GitBranch,
  Timer,
  Hash,
  AtSign,
  Percent,
  Lock,
  Unlock,
  Key,
  Copy,
  ExternalLink,
  MousePointer,
  Move,
  RotateCw,
  Square,
  Circle,
  Triangle,
  Hexagon,
} from "lucide-react";

interface NoCodeRulesBuilderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Mock data for rules builder
const ruleTemplates = [
  {
    id: "template_001",
    name: "High-Value Transaction Alert",
    description: "Trigger alerts for transactions above specified threshold",
    category: "Transaction Monitoring",
    complexity: "Simple",
    usageCount: 1247,
    components: [
      { type: "trigger", name: "Transaction Amount", operator: ">", value: "$10,000" },
      { type: "condition", name: "Customer Risk", operator: ">=", value: "Medium" },
      { type: "action", name: "Create Alert", severity: "High" },
      { type: "action", name: "Notify Team", method: "Email" },
    ],
  },
  {
    id: "template_002",
    name: "Velocity Monitoring Rule",
    description: "Detect unusual transaction frequency patterns",
    category: "Behavioral Analysis",
    complexity: "Advanced",
    usageCount: 892,
    components: [
      { type: "trigger", name: "Transaction Count", operator: ">", value: "10", timeframe: "1 hour" },
      { type: "condition", name: "Account Age", operator: "<", value: "30 days" },
      { type: "action", name: "Freeze Account", duration: "24 hours" },
      { type: "action", name: "Escalate Case", priority: "Critical" },
    ],
  },
  {
    id: "template_003",
    name: "Geographic Risk Assessment",
    description: "Monitor transactions from high-risk jurisdictions",
    category: "Geographic Monitoring",
    complexity: "Medium",
    usageCount: 567,
    components: [
      { type: "trigger", name: "Transaction Origin", operator: "in", value: "High-Risk Countries" },
      { type: "condition", name: "Amount", operator: ">", value: "$5,000" },
      { type: "action", name: "Enhanced Review", type: "Manual" },
      { type: "action", name: "Document Request", items: "Source of Funds" },
    ],
  },
];

const ruleComponents = {
  triggers: [
    { id: "transaction_amount", name: "Transaction Amount", type: "number", operators: [">", ">=", "<", "<=", "=", "!="] },
    { id: "transaction_count", name: "Transaction Count", type: "number", operators: [">", ">=", "<", "<=", "="] },
    { id: "customer_risk", name: "Customer Risk Score", type: "number", operators: [">", ">=", "<", "<=", "="] },
    { id: "geographic_location", name: "Geographic Location", type: "list", operators: ["in", "not in", "=", "!="] },
    { id: "time_of_day", name: "Time of Day", type: "time", operators: ["between", "before", "after"] },
    { id: "account_age", name: "Account Age", type: "duration", operators: [">", ">=", "<", "<="] },
    { id: "counterparty_type", name: "Counterparty Type", type: "category", operators: ["=", "!=", "in", "not in"] },
  ],
  conditions: [
    { id: "customer_status", name: "Customer Status", type: "category", operators: ["=", "!="] },
    { id: "kyc_status", name: "KYC Status", type: "category", operators: ["=", "!="] },
    { id: "pep_status", name: "PEP Status", type: "boolean", operators: ["=", "!="] },
    { id: "sanctions_match", name: "Sanctions Match", type: "boolean", operators: ["=", "!="] },
    { id: "previous_alerts", name: "Previous Alerts", type: "number", operators: [">", ">=", "<", "<=", "="] },
    { id: "business_relationship", name: "Business Relationship", type: "duration", operators: [">", ">=", "<", "<="] },
  ],
  actions: [
    { id: "create_alert", name: "Create Alert", params: ["severity", "description"] },
    { id: "freeze_account", name: "Freeze Account", params: ["duration", "reason"] },
    { id: "notify_team", name: "Notify Team", params: ["method", "recipients"] },
    { id: "escalate_case", name: "Escalate Case", params: ["priority", "assignee"] },
    { id: "request_documents", name: "Request Documents", params: ["document_types", "deadline"] },
    { id: "enhanced_monitoring", name: "Enhanced Monitoring", params: ["duration", "frequency"] },
    { id: "block_transaction", name: "Block Transaction", params: ["reason", "notify_customer"] },
  ],
};

const visualRuleBuilder = {
  canvas: {
    nodes: [],
    connections: [],
  },
  selectedNode: null,
  draggedNode: null,
};

export function NoCodeRulesBuilderModal({ open, onOpenChange }: NoCodeRulesBuilderModalProps) {
  const [selectedTemplate, setSelectedTemplate] = useState(ruleTemplates[0]);
  const [builderMode, setBuilderMode] = useState<"template" | "visual" | "code">("template");
  const [isDeploying, setIsDeploying] = useState(false);
  const [ruleCanvas, setRuleCanvas] = useState(visualRuleBuilder);

  const handleDeployRule = () => {
    setIsDeploying(true);
    setTimeout(() => setIsDeploying(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Code className="h-6 w-6 text-primary" />
            No-Code Rules Builder
          </DialogTitle>
          <DialogDescription>
            Create, customize, and deploy compliance rules without coding using our visual builder
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="templates" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="templates">Rule Templates</TabsTrigger>
            <TabsTrigger value="visual">Visual Builder</TabsTrigger>
            <TabsTrigger value="components">Components</TabsTrigger>
            <TabsTrigger value="testing">Testing</TabsTrigger>
            <TabsTrigger value="deployment">Deployment</TabsTrigger>
          </TabsList>

          <TabsContent value="templates" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Pre-built Rule Templates</h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-1" />
                  Filter
                </Button>
                <Button>
                  <Plus className="h-4 w-4 mr-1" />
                  Create Custom Rule
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                {ruleTemplates.map((template) => (
                  <Card 
                    key={template.id} 
                    className={`cursor-pointer transition-all ${
                      selectedTemplate.id === template.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setSelectedTemplate(template)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h4 className="font-semibold">{template.name}</h4>
                            <Badge variant="outline">{template.category}</Badge>
                            <Badge
                              variant={
                                template.complexity === "Simple"
                                  ? "outline"
                                  : template.complexity === "Medium"
                                  ? "secondary"
                                  : "warning"
                              }
                            >
                              {template.complexity}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{template.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Used by</p>
                          <p className="font-medium">{template.usageCount} orgs</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Rule Components</Label>
                        <div className="flex flex-wrap gap-2">
                          {template.components.map((component, index) => (
                            <Badge 
                              key={index} 
                              variant={
                                component.type === "trigger" ? "destructive" :
                                component.type === "condition" ? "warning" :
                                "outline"
                              }
                              className="text-xs"
                            >
                              {component.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Template Preview</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">Rule Logic</Label>
                      <div className="mt-2 p-3 bg-muted/50 rounded border text-sm">
                        <div className="space-y-2">
                          {selectedTemplate.components.map((component, index) => (
                            <div key={index} className="flex items-center gap-2">
                              {component.type === "trigger" && (
                                <Zap className="h-3 w-3 text-destructive" />
                              )}
                              {component.type === "condition" && (
                                <Target className="h-3 w-3 text-warning" />
                              )}
                              {component.type === "action" && (
                                <ArrowRight className="h-3 w-3 text-primary" />
                              )}
                              <span className="text-xs">
                                {component.name} {component.operator} {component.value}
                                {component.timeframe && ` (${component.timeframe})`}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium">Estimated Performance</Label>
                      <div className="space-y-2 mt-2">
                        <div className="flex justify-between text-sm">
                          <span>Accuracy</span>
                          <span>94.2%</span>
                        </div>
                        <Progress value={94.2} className="h-2" />
                        <div className="flex justify-between text-sm">
                          <span>False Positives</span>
                          <span>5.8%</span>
                        </div>
                        <Progress value={5.8} className="h-2" />
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="h-3 w-3 mr-1" />
                        Preview
                      </Button>
                      <Button size="sm" className="flex-1">
                        <Copy className="h-3 w-3 mr-1" />
                        Use Template
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Lightbulb className="h-4 w-4" />
                      AI Suggestions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="p-3 bg-primary/5 border border-primary/20 rounded">
                      <div className="flex items-start gap-2">
                        <Sparkles className="h-4 w-4 text-primary mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Optimization Available</p>
                          <p className="text-xs text-muted-foreground">
                            Add time-based conditions to reduce false positives by 12%
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 bg-accent/5 border border-accent/20 rounded">
                      <div className="flex items-start gap-2">
                        <Brain className="h-4 w-4 text-accent mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">ML Enhancement</p>
                          <p className="text-xs text-muted-foreground">
                            Enable machine learning for dynamic threshold adjustment
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="visual" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Visual Rule Builder</h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <RotateCcw className="h-4 w-4 mr-1" />
                  Reset Canvas
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-1" />
                  Export Rule
                </Button>
                <Button onClick={handleDeployRule} disabled={isDeploying}>
                  {isDeploying ? (
                    <>
                      <Activity className="h-4 w-4 mr-1 animate-pulse" />
                      Deploying...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-1" />
                      Deploy Rule
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Component Palette</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label className="text-xs font-medium text-muted-foreground">TRIGGERS</Label>
                      <div className="grid grid-cols-1 gap-2 mt-2">
                        {ruleComponents.triggers.slice(0, 3).map((trigger) => (
                          <div
                            key={trigger.id}
                            className="p-2 border rounded cursor-pointer hover:bg-muted/50 transition-colors"
                            draggable
                          >
                            <div className="flex items-center gap-2">
                              <Zap className="h-3 w-3 text-destructive" />
                              <span className="text-xs">{trigger.name}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs font-medium text-muted-foreground">CONDITIONS</Label>
                      <div className="grid grid-cols-1 gap-2 mt-2">
                        {ruleComponents.conditions.slice(0, 3).map((condition) => (
                          <div
                            key={condition.id}
                            className="p-2 border rounded cursor-pointer hover:bg-muted/50 transition-colors"
                            draggable
                          >
                            <div className="flex items-center gap-2">
                              <Target className="h-3 w-3 text-warning" />
                              <span className="text-xs">{condition.name}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs font-medium text-muted-foreground">ACTIONS</Label>
                      <div className="grid grid-cols-1 gap-2 mt-2">
                        {ruleComponents.actions.slice(0, 3).map((action) => (
                          <div
                            key={action.id}
                            className="p-2 border rounded cursor-pointer hover:bg-muted/50 transition-colors"
                            draggable
                          >
                            <div className="flex items-center gap-2">
                              <ArrowRight className="h-3 w-3 text-primary" />
                              <span className="text-xs">{action.name}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-2">
                <Card className="h-96">
                  <CardHeader>
                    <CardTitle className="text-sm">Rule Canvas</CardTitle>
                  </CardHeader>
                  <CardContent className="h-full">
                    <div className="h-full border-2 border-dashed border-border rounded-lg flex items-center justify-center bg-muted/20">
                      <div className="text-center">
                        <MousePointer className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">Drag components here to build your rule</p>
                        <p className="text-sm text-muted-foreground mt-2">Connect components to create rule logic</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Properties</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label className="text-xs">Rule Name</Label>
                      <Input placeholder="Enter rule name" className="mt-1" />
                    </div>
                    <div>
                      <Label className="text-xs">Description</Label>
                      <Textarea placeholder="Describe the rule purpose" rows={3} className="mt-1" />
                    </div>
                    <div>
                      <Label className="text-xs">Priority</Label>
                      <Select>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="critical">Critical</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="ai-enhanced" />
                      <Label htmlFor="ai-enhanced" className="text-xs">AI Enhanced</Label>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Rule Validation</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-success" />
                      <span>Syntax Valid</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-success" />
                      <span>Logic Complete</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <AlertTriangle className="h-4 w-4 text-warning" />
                      <span>Performance Warning</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="components" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-destructive" />
                    Triggers
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">Events that initiate rule evaluation</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {ruleComponents.triggers.map((trigger) => (
                      <div key={trigger.id} className="p-3 border rounded hover:bg-muted/50 transition-colors">
                        <h4 className="font-medium text-sm">{trigger.name}</h4>
                        <p className="text-xs text-muted-foreground">Type: {trigger.type}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {trigger.operators.map((op) => (
                            <Badge key={op} variant="outline" className="text-xs">{op}</Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-warning" />
                    Conditions
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">Additional criteria for rule execution</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {ruleComponents.conditions.map((condition) => (
                      <div key={condition.id} className="p-3 border rounded hover:bg-muted/50 transition-colors">
                        <h4 className="font-medium text-sm">{condition.name}</h4>
                        <p className="text-xs text-muted-foreground">Type: {condition.type}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {condition.operators.map((op) => (
                            <Badge key={op} variant="outline" className="text-xs">{op}</Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ArrowRight className="h-5 w-5 text-primary" />
                    Actions
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">Operations executed when rules match</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {ruleComponents.actions.map((action) => (
                      <div key={action.id} className="p-3 border rounded hover:bg-muted/50 transition-colors">
                        <h4 className="font-medium text-sm">{action.name}</h4>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {action.params.map((param) => (
                            <Badge key={param} variant="secondary" className="text-xs">{param}</Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="testing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Play className="h-5 w-5" />
                  Rule Testing Environment
                </CardTitle>
                <p className="text-sm text-muted-foreground">Test your rules with sample data before deployment</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label>Test Scenario</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select test scenario" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high-value">High Value Transaction</SelectItem>
                          <SelectItem value="velocity">High Velocity Pattern</SelectItem>
                          <SelectItem value="geographic">Geographic Anomaly</SelectItem>
                          <SelectItem value="custom">Custom Scenario</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Test Data</Label>
                      <Textarea 
                        placeholder="Enter test data in JSON format or select a pre-defined scenario"
                        rows={8}
                        className="font-mono text-xs"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label>Test Results</Label>
                      <div className="p-4 border rounded-lg bg-muted/20 h-64 overflow-y-auto">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-success" />
                            <span className="text-sm font-medium">Rule Triggered</span>
                          </div>
                          <div className="p-3 bg-muted rounded text-sm">
                            <p className="font-medium">Actions Executed:</p>
                            <ul className="list-disc list-inside text-xs space-y-1 mt-1">
                              <li>Alert created (ID: ALT-12345)</li>
                              <li>Notification sent to compliance team</li>
                              <li>Risk score updated to 85</li>
                            </ul>
                          </div>
                          <div className="p-3 bg-muted rounded text-sm">
                            <p className="font-medium">Performance Metrics:</p>
                            <div className="grid grid-cols-2 gap-2 text-xs mt-1">
                              <div>Execution Time: 0.23s</div>
                              <div>Memory Usage: 12MB</div>
                              <div>CPU Utilization: 5%</div>
                              <div>Cache Hits: 3</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1">
                        <RotateCcw className="h-4 w-4 mr-1" />
                        Reset
                      </Button>
                      <Button className="flex-1">
                        <Play className="h-4 w-4 mr-1" />
                        Run Test
                      </Button>
                    </div>
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
                  Deployment Configuration
                </CardTitle>
                <p className="text-sm text-muted-foreground">Configure how and where your rules are deployed</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label>Deployment Environment</Label>
                      <Select defaultValue="staging">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="development">Development</SelectItem>
                          <SelectItem value="staging">Staging</SelectItem>
                          <SelectItem value="production">Production</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Deployment Strategy</Label>
                      <Select defaultValue="blue-green">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="immediate">Immediate</SelectItem>
                          <SelectItem value="blue-green">Blue-Green</SelectItem>
                          <SelectItem value="canary">Canary (10%)</SelectItem>
                          <SelectItem value="scheduled">Scheduled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Rollback Strategy</Label>
                      <Select defaultValue="automatic">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="automatic">Automatic on Error</SelectItem>
                          <SelectItem value="manual">Manual Only</SelectItem>
                          <SelectItem value="threshold">Performance Threshold</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label>Monitoring Configuration</Label>
                      <div className="space-y-2 mt-2">
                        <div className="flex items-center space-x-2">
                          <Switch id="performance-monitoring" defaultChecked />
                          <Label htmlFor="performance-monitoring" className="text-sm">Performance monitoring</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch id="error-alerts" defaultChecked />
                          <Label htmlFor="error-alerts" className="text-sm">Error alerts</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch id="usage-analytics" defaultChecked />
                          <Label htmlFor="usage-analytics" className="text-sm">Usage analytics</Label>
                        </div>
                      </div>
                    </div>
                    <div>
                      <Label>Deployment Approval</Label>
                      <div className="space-y-2 mt-2">
                        <div className="flex items-center space-x-2">
                          <Switch id="require-approval" />
                          <Label htmlFor="require-approval" className="text-sm">Require approval before deployment</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch id="notify-stakeholders" defaultChecked />
                          <Label htmlFor="notify-stakeholders" className="text-sm">Notify stakeholders</Label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline">
                    <Eye className="h-4 w-4 mr-1" />
                    Preview Deployment
                  </Button>
                  <Button onClick={handleDeployRule} disabled={isDeploying}>
                    {isDeploying ? (
                      <>
                        <Activity className="h-4 w-4 mr-1 animate-pulse" />
                        Deploying...
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-1" />
                        Deploy Rule
                      </>
                    )}
                  </Button>
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
            Save Rule
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}