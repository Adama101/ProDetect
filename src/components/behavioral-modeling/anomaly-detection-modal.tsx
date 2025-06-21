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
import { Slider } from "@/components/ui/slider";
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
  AlertTriangle,
  Brain,
  Settings,
  Zap,
  Target,
  Clock,
  DollarSign,
  MapPin,
  Smartphone,
  CreditCard,
  TrendingUp,
  TrendingDown,
  Play,
  Pause,
  RotateCcw,
  Save,
  Copy,
  Download,
  Upload,
  Eye,
  EyeOff,
  Plus,
  Minus,
  Filter,
  BarChart3,
  Activity,
  Shield,
  CheckCircle,
  XCircle,
  Lightbulb,
  Code,
  Database,
  Network,
  Cpu,
  Globe,
  Users,
  Calendar,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface AnomalyDetectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Mock data for anomaly detection rules
const predefinedRules = [
  {
    id: "velocity_burst",
    name: "Transaction Velocity Burst",
    description: "Detects unusual spikes in transaction frequency",
    category: "Velocity",
    severity: "High",
    enabled: true,
    confidence: 94,
    triggers: 1247,
    falsePositives: 23,
    conditions: {
      timeWindow: "5 minutes",
      threshold: "10 transactions",
      baseline: "Historical average + 3σ",
    },
    aiEnhanced: true,
    lastUpdated: "2 hours ago",
  },
  {
    id: "geographic_anomaly",
    name: "Geographic Impossibility",
    description: "Flags transactions from impossible geographic locations",
    category: "Geographic",
    severity: "Critical",
    enabled: true,
    confidence: 98,
    triggers: 89,
    falsePositives: 2,
    conditions: {
      timeWindow: "1 hour",
      threshold: "500km distance",
      baseline: "Physical travel constraints",
    },
    aiEnhanced: true,
    lastUpdated: "30 minutes ago",
  },
  {
    id: "amount_outlier",
    name: "Amount Pattern Deviation",
    description: "Identifies transactions significantly outside normal patterns",
    category: "Amount",
    severity: "Medium",
    enabled: false,
    confidence: 87,
    triggers: 456,
    falsePositives: 67,
    conditions: {
      timeWindow: "24 hours",
      threshold: "5x average",
      baseline: "Customer historical behavior",
    },
    aiEnhanced: false,
    lastUpdated: "1 day ago",
  },
  {
    id: "behavioral_drift",
    name: "Behavioral Pattern Drift",
    description: "Detects gradual changes in customer behavior patterns",
    category: "Behavioral",
    severity: "Low",
    enabled: true,
    confidence: 76,
    triggers: 234,
    falsePositives: 45,
    conditions: {
      timeWindow: "30 days",
      threshold: "25% deviation",
      baseline: "Rolling 90-day average",
    },
    aiEnhanced: true,
    lastUpdated: "6 hours ago",
  },
];

const ruleCategories = [
  { id: "velocity", name: "Velocity", icon: Zap, color: "text-yellow-500" },
  { id: "geographic", name: "Geographic", icon: MapPin, color: "text-blue-500" },
  { id: "amount", name: "Amount", icon: DollarSign, color: "text-green-500" },
  { id: "temporal", name: "Temporal", icon: Clock, color: "text-purple-500" },
  { id: "behavioral", name: "Behavioral", icon: Brain, color: "text-pink-500" },
  { id: "device", name: "Device", icon: Smartphone, color: "text-orange-500" },
  { id: "channel", name: "Channel", icon: CreditCard, color: "text-indigo-500" },
];

const aiFeatures = [
  {
    name: "Dynamic Thresholds",
    description: "AI automatically adjusts thresholds based on real-time patterns",
    enabled: true,
    impact: "High",
  },
  {
    name: "Contextual Scoring",
    description: "Considers customer context and historical behavior",
    enabled: true,
    impact: "High",
  },
  {
    name: "Pattern Learning",
    description: "Continuously learns new fraud patterns from data",
    enabled: true,
    impact: "Medium",
  },
  {
    name: "False Positive Reduction",
    description: "ML-powered filtering to reduce investigation overhead",
    enabled: false,
    impact: "High",
  },
  {
    name: "Ensemble Scoring",
    description: "Combines multiple models for improved accuracy",
    enabled: true,
    impact: "Medium",
  },
];

export function AnomalyDetectionModal({ open, onOpenChange }: AnomalyDetectionModalProps) {
  const [selectedRule, setSelectedRule] = useState(predefinedRules[0]);
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
            <AlertTriangle className="h-6 w-6 text-warning" />
            AI-Native Anomaly Detection Rules Engine
          </DialogTitle>
          <DialogDescription>
            Configure, manage, and optimize behavioral anomaly detection rules with AI-powered insights
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="rules" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="rules">Active Rules</TabsTrigger>
            <TabsTrigger value="builder">Rule Builder</TabsTrigger>
            <TabsTrigger value="ai-features">AI Features</TabsTrigger>
            <TabsTrigger value="analytics">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="rules" className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <h3 className="text-lg font-semibold">Detection Rules</h3>
                <Badge variant="outline">{predefinedRules.length} Total</Badge>
                <Badge variant="outline" className="text-success">
                  {predefinedRules.filter(r => r.enabled).length} Active
                </Badge>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-1" />
                  Import
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-1" />
                  Export
                </Button>
                <Button onClick={() => setIsCreatingRule(true)}>
                  <Plus className="h-4 w-4 mr-1" />
                  New Rule
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                {predefinedRules.map((rule) => (
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
                                rule.severity === "Critical"
                                  ? "destructive"
                                  : rule.severity === "High"
                                  ? "warning"
                                  : rule.severity === "Medium"
                                  ? "secondary"
                                  : "outline"
                              }
                            >
                              {rule.severity}
                            </Badge>
                            {rule.aiEnhanced && (
                              <Badge variant="outline" className="text-primary">
                                <Sparkles className="h-3 w-3 mr-1" />
                                AI Enhanced
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            {rule.description}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>Triggers: {rule.triggers}</span>
                            <span>FP Rate: {((rule.falsePositives / rule.triggers) * 100).toFixed(1)}%</span>
                            <span>Confidence: {rule.confidence}%</span>
                            <span>Updated: {rule.lastUpdated}</span>
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
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div>Time Window: {selectedRule.conditions.timeWindow}</div>
                        <div>Threshold: {selectedRule.conditions.threshold}</div>
                        <div>Baseline: {selectedRule.conditions.baseline}</div>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Performance</Label>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Confidence</span>
                          <span>{selectedRule.confidence}%</span>
                        </div>
                        <Progress value={selectedRule.confidence} className="h-2" />
                        <div className="flex justify-between text-sm">
                          <span>False Positive Rate</span>
                          <span>{((selectedRule.falsePositives / selectedRule.triggers) * 100).toFixed(1)}%</span>
                        </div>
                        <Progress 
                          value={(selectedRule.falsePositives / selectedRule.triggers) * 100} 
                          className="h-2"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <BarChart3 className="h-4 w-4" />
                      Quick Stats
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Total Triggers (24h)</span>
                      <span className="font-medium">1,247</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Confirmed Fraud</span>
                      <span className="font-medium text-destructive">89</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Under Investigation</span>
                      <span className="font-medium text-warning">156</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">False Positives</span>
                      <span className="font-medium text-muted-foreground">23</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="builder" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  AI-Assisted Rule Builder
                </CardTitle>
                <DialogDescription>
                  Create sophisticated anomaly detection rules with AI guidance and real-time validation
                </DialogDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="rule-name">Rule Name</Label>
                      <Input id="rule-name" placeholder="e.g., Suspicious Login Pattern" />
                    </div>
                    <div>
                      <Label htmlFor="rule-category">Category</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {ruleCategories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              <div className="flex items-center gap-2">
                                <category.icon className={`h-4 w-4 ${category.color}`} />
                                {category.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="rule-description">Description</Label>
                      <Textarea 
                        id="rule-description" 
                        placeholder="Describe what this rule detects..."
                        rows={3}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label>Severity Level</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select severity" />
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
                      <Label>Time Window</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select time window" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1m">1 minute</SelectItem>
                          <SelectItem value="5m">5 minutes</SelectItem>
                          <SelectItem value="15m">15 minutes</SelectItem>
                          <SelectItem value="1h">1 hour</SelectItem>
                          <SelectItem value="24h">24 hours</SelectItem>
                          <SelectItem value="7d">7 days</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>AI Enhancement</Label>
                      <div className="flex items-center space-x-2 mt-2">
                        <Switch id="ai-enhanced" />
                        <Label htmlFor="ai-enhanced" className="text-sm">
                          Enable AI-powered dynamic thresholds
                        </Label>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Rule Conditions
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>Threshold Value</Label>
                      <div className="space-y-2">
                        <Input placeholder="e.g., 10" />
                        <Slider defaultValue={[50]} max={100} step={1} className="w-full" />
                      </div>
                    </div>
                    <div>
                      <Label>Comparison Operator</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select operator" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gt">Greater than</SelectItem>
                          <SelectItem value="gte">Greater than or equal</SelectItem>
                          <SelectItem value="lt">Less than</SelectItem>
                          <SelectItem value="lte">Less than or equal</SelectItem>
                          <SelectItem value="eq">Equal to</SelectItem>
                          <SelectItem value="ne">Not equal to</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Baseline Calculation</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select baseline" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="historical">Historical Average</SelectItem>
                          <SelectItem value="rolling">Rolling Average</SelectItem>
                          <SelectItem value="percentile">95th Percentile</SelectItem>
                          <SelectItem value="stddev">Standard Deviation</SelectItem>
                          <SelectItem value="ml">ML Predicted</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Brain className="h-4 w-4" />
                    AI Recommendations
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="p-4 bg-primary/5 border-primary/20">
                      <div className="flex items-start gap-3">
                        <Lightbulb className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <h5 className="font-medium text-sm">Suggested Optimization</h5>
                          <p className="text-xs text-muted-foreground mt-1">
                            Based on similar rules, consider using a 15-minute time window with rolling baseline for better accuracy.
                          </p>
                          <Button variant="outline" size="sm" className="mt-2">
                            Apply Suggestion
                          </Button>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-4 bg-accent/5 border-accent/20">
                      <div className="flex items-start gap-3">
                        <Target className="h-5 w-5 text-accent mt-0.5" />
                        <div>
                          <h5 className="font-medium text-sm">Performance Prediction</h5>
                          <p className="text-xs text-muted-foreground mt-1">
                            This configuration is estimated to achieve 89% accuracy with 12% false positive rate.
                          </p>
                          <Button variant="outline" size="sm" className="mt-2">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline">
                    <Eye className="h-4 w-4 mr-1" />
                    Preview
                  </Button>
                  <Button variant="outline">
                    <Play className="h-4 w-4 mr-1" />
                    Test Rule
                  </Button>
                  <Button>
                    <Save className="h-4 w-4 mr-1" />
                    Save Rule
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai-features" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  AI-Powered Detection Features
                </CardTitle>
                <DialogDescription>
                  Configure advanced AI capabilities to enhance anomaly detection accuracy and reduce false positives
                </DialogDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {aiFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium">{feature.name}</h4>
                        <Badge
                          variant={
                            feature.impact === "High"
                              ? "destructive"
                              : feature.impact === "Medium"
                              ? "warning"
                              : "secondary"
                          }
                        >
                          {feature.impact} Impact
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                    <Switch checked={feature.enabled} />
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Cpu className="h-5 w-5" />
                    Model Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Overall Accuracy</span>
                      <span className="font-medium">94.7%</span>
                    </div>
                    <Progress value={94.7} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Precision</span>
                      <span className="font-medium">91.2%</span>
                    </div>
                    <Progress value={91.2} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Recall</span>
                      <span className="font-medium">88.9%</span>
                    </div>
                    <Progress value={88.9} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>F1 Score</span>
                      <span className="font-medium">90.0%</span>
                    </div>
                    <Progress value={90.0} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Training Data Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Last Training</span>
                    <span className="text-sm text-muted-foreground">2 days ago</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Training Samples</span>
                    <span className="text-sm text-muted-foreground">2.3M transactions</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Model Version</span>
                    <span className="text-sm text-muted-foreground">v2.4.1</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Next Scheduled Training</span>
                    <span className="text-sm text-muted-foreground">In 5 days</span>
                  </div>
                  <Button variant="outline" className="w-full">
                    <RotateCcw className="h-4 w-4 mr-1" />
                    Retrain Model
                  </Button>
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
                    <span className="text-sm font-medium">Detection Rate</span>
                  </div>
                  <div className="text-2xl font-bold">94.7%</div>
                  <div className="flex items-center gap-1 text-xs text-success">
                    <TrendingUp className="h-3 w-3" />
                    +2.3% vs last month
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <XCircle className="h-4 w-4 text-destructive" />
                    <span className="text-sm font-medium">False Positives</span>
                  </div>
                  <div className="text-2xl font-bold">5.2%</div>
                  <div className="flex items-center gap-1 text-xs text-success">
                    <TrendingDown className="h-3 w-3" />
                    -1.8% vs last month
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-warning" />
                    <span className="text-sm font-medium">Avg Response Time</span>
                  </div>
                  <div className="text-2xl font-bold">127ms</div>
                  <div className="flex items-center gap-1 text-xs text-success">
                    <TrendingDown className="h-3 w-3" />
                    -23ms vs last month
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <span className="text-sm font-medium">Rules Active</span>
                  </div>
                  <div className="text-2xl font-bold">47</div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <span>of 52 total rules</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Rule Performance Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {predefinedRules.map((rule) => (
                    <div key={rule.id} className="flex items-center justify-between p-3 border rounded">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${rule.enabled ? 'bg-success' : 'bg-muted'}`} />
                        <span className="font-medium">{rule.name}</span>
                        <Badge variant="outline">{rule.category}</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Triggers: {rule.triggers}</span>
                        <span>Accuracy: {rule.confidence}%</span>
                        <span>FP Rate: {((rule.falsePositives / rule.triggers) * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                  ))}
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