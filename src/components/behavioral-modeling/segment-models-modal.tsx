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
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  UserCheck,
  Brain,
  Target,
  TrendingUp,
  TrendingDown,
  Smartphone,
  Building,
  GraduationCap,
  Briefcase,
  Car,
  ShoppingCart,
  Zap,
  Activity,
  BarChart3,
  PieChart,
  LineChart as LineChartIcon,
  Play,
  RotateCcw,
  Save,
  Download,
  Upload,
  Plus,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Cpu,
  Database,
  Network,
  Sparkles,
  Lightbulb,
} from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Cell,
  PieChart as RechartsPieChart,
  Pie,
} from "recharts";

interface SegmentModelsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Mock data for customer segments and their models
const customerSegments = [
  {
    id: "digital_natives",
    name: "Digital Natives",
    description: "Tech-savvy users aged 18-35 with high mobile usage",
    icon: Smartphone,
    color: "text-blue-500",
    customerCount: 45000,
    riskLevel: "Medium",
    modelAccuracy: 94.2,
    falsePositiveRate: 3.8,
    lastTrained: "2 days ago",
    features: ["Mobile-first behavior", "Social payments", "Micro-transactions", "Real-time activity"],
    riskFactors: {
      velocity: 75,
      geographic: 45,
      amount: 60,
      temporal: 80,
      device: 90,
      channel: 85,
    },
    performance: {
      precision: 92.1,
      recall: 89.3,
      f1Score: 90.7,
      auc: 0.94,
    },
    enabled: true,
  },
  {
    id: "traditional_banking",
    name: "Traditional Banking",
    description: "Conservative users preferring branch and phone banking",
    icon: Building,
    color: "text-green-500",
    customerCount: 320,
    riskLevel: "Low",
    modelAccuracy: 97.8,
    falsePositiveRate: 1.2,
    lastTrained: "1 day ago",
    features: ["Branch visits", "Phone banking", "Scheduled transfers", "Conservative amounts"],
    riskFactors: {
      velocity: 25,
      geographic: 20,
      amount: 30,
      temporal: 15,
      device: 35,
      channel: 40,
    },
    performance: {
      precision: 96.2,
      recall: 94.8,
      f1Score: 95.5,
      auc: 0.98,
    },
    enabled: true,
  },
  {
    id: "high_net_worth",
    name: "High Net Worth",
    description: "Premium clients with complex financial needs",
    icon: Briefcase,
    color: "text-purple-500",
    customerCount: 80,
    riskLevel: "High",
    modelAccuracy: 91.5,
    falsePositiveRate: 6.2,
    lastTrained: "3 days ago",
    features: ["Large transactions", "Investment activity", "International transfers", "Multiple accounts"],
    riskFactors: {
      velocity: 60,
      geographic: 85,
      amount: 95,
      temporal: 70,
      device: 55,
      channel: 75,
    },
    performance: {
      precision: 88.9,
      recall: 92.1,
      f1Score: 90.5,
      auc: 0.92,
    },
    enabled: true,
  },
  {
    id: "small_business",
    name: "Small Business",
    description: "SME accounts with regular business transactions",
    icon: ShoppingCart,
    color: "text-orange-500",
    customerCount: 150,
    riskLevel: "Medium",
    modelAccuracy: 89.7,
    falsePositiveRate: 8.1,
    lastTrained: "5 days ago",
    features: ["B2B payments", "Payroll processing", "Supplier payments", "Cash flow patterns"],
    riskFactors: {
      velocity: 70,
      geographic: 50,
      amount: 80,
      temporal: 65,
      device: 60,
      channel: 70,
    },
    performance: {
      precision: 87.3,
      recall: 85.9,
      f1Score: 86.6,
      auc: 0.90,
    },
    enabled: false,
  },
  {
    id: "international_students",
    name: "International Students",
    description: "Students with cross-border financial activity",
    icon: GraduationCap,
    color: "text-indigo-500",
    customerCount: 100,
    riskLevel: "High",
    modelAccuracy: 86.4,
    falsePositiveRate: 12.3,
    lastTrained: "1 week ago",
    features: ["Tuition payments", "Family remittances", "Part-time income", "Seasonal patterns"],
    riskFactors: {
      velocity: 55,
      geographic: 90,
      amount: 65,
      temporal: 75,
      device: 70,
      channel: 60,
    },
    performance: {
      precision: 83.2,
      recall: 88.1,
      f1Score: 85.6,
      auc: 0.87,
    },
    enabled: true,
  },
  {
    id: "gig_economy",
    name: "Gig Economy Workers",
    description: "Freelancers and gig workers with irregular income",
    icon: Car,
    color: "text-yellow-500",
    customerCount: 200,
    riskLevel: "Medium",
    modelAccuracy: 88.9,
    falsePositiveRate: 9.7,
    lastTrained: "4 days ago",
    features: ["Irregular income", "Multiple income sources", "Cash-out patterns", "Platform payments"],
    riskFactors: {
      velocity: 80,
      geographic: 60,
      amount: 70,
      temporal: 85,
      device: 75,
      channel: 80,
    },
    performance: {
      precision: 86.1,
      recall: 87.3,
      f1Score: 86.7,
      auc: 0.89,
    },
    enabled: true,
  },
];

const modelTypes = [
  {
    id: "ensemble",
    name: "Ensemble Model",
    description: "Combines multiple algorithms for optimal performance",
    accuracy: 94.2,
    complexity: "High",
    trainingTime: "4-6 hours",
    recommended: true,
  },
  {
    id: "neural_network",
    name: "Deep Neural Network",
    description: "Advanced pattern recognition with deep learning",
    accuracy: 92.8,
    complexity: "Very High",
    trainingTime: "8-12 hours",
    recommended: false,
  },
  {
    id: "random_forest",
    name: "Random Forest",
    description: "Robust tree-based model with good interpretability",
    accuracy: 89.5,
    complexity: "Medium",
    trainingTime: "1-2 hours",
    recommended: false,
  },
  {
    id: "gradient_boosting",
    name: "Gradient Boosting",
    description: "Sequential learning with strong predictive power",
    accuracy: 91.3,
    complexity: "High",
    trainingTime: "2-4 hours",
    recommended: false,
  },
];

const performanceMetrics = [
  { month: "Jan", accuracy: 89.2, falsePositives: 8.1, detectionRate: 91.5 },
  { month: "Feb", accuracy: 90.1, falsePositives: 7.3, detectionRate: 92.8 },
  { month: "Mar", accuracy: 91.5, falsePositives: 6.8, detectionRate: 93.2 },
  { month: "Apr", accuracy: 92.3, falsePositives: 6.2, detectionRate: 94.1 },
  { month: "May", accuracy: 93.1, falsePositives: 5.9, detectionRate: 94.7 },
  { month: "Jun", accuracy: 94.2, falsePositives: 5.1, detectionRate: 95.3 },
];

export function SegmentModelsModal({ open, onOpenChange }: SegmentModelsModalProps) {
  const [selectedSegment, setSelectedSegment] = useState(customerSegments[0]);
  const [isTraining, setIsTraining] = useState<string | null>(null);

  const handleTrainModel = (segmentId: string) => {
    setIsTraining(segmentId);
    setTimeout(() => setIsTraining(null), 5000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <UserCheck className="h-6 w-6 text-primary" />
            Segment-Specific AI Models Management
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="segments" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="segments">Segments</TabsTrigger>
            <TabsTrigger value="model-config">Model Config</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="deployment">Deployment</TabsTrigger>
          </TabsList>

          <TabsContent value="segments" className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <h3 className="text-lg font-semibold">Customer Segments</h3>
                <Badge variant="outline">{customerSegments.length} Total</Badge>
                <Badge variant="outline" className="text-success">
                  {customerSegments.filter(s => s.enabled).length} Active Models
                </Badge>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-1" />
                  Import Segment
                </Button>
                <Button>
                  <Plus className="h-4 w-4 mr-1" />
                  New Segment
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                {customerSegments.map((segment) => (
                  <Card
                    key={segment.id}
                    className={`cursor-pointer transition-all ${selectedSegment.id === segment.id ? 'ring-2 ring-primary' : ''
                      }`}
                    onClick={() => setSelectedSegment(segment)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <div className={`p-2 rounded-lg bg-muted ${segment.color}`}>
                            <segment.icon className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-semibold">{segment.name}</h4>
                              <Badge
                                variant={
                                  segment.riskLevel === "High"
                                    ? "destructive"
                                    : segment.riskLevel === "Medium"
                                      ? "warning"
                                      : "outline"
                                }
                              >
                                {segment.riskLevel} Risk
                              </Badge>
                              {segment.enabled && (
                                <Badge variant="outline" className="text-success">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Active
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">
                              {segment.description}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span>Customers: {segment.customerCount.toLocaleString()}</span>
                              <span>Accuracy: {segment.modelAccuracy}%</span>
                              <span>FP Rate: {segment.falsePositiveRate}%</span>
                              <span>Updated: {segment.lastTrained}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch checked={segment.enabled} />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTrainModel(segment.id);
                            }}
                            disabled={isTraining === segment.id}
                          >
                            {isTraining === segment.id ? (
                              <>
                                <Activity className="h-3 w-3 mr-1 animate-pulse" />
                                Training...
                              </>
                            ) : (
                              <>
                                <RotateCcw className="h-3 w-3 mr-1" />
                                Retrain
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
                    <CardTitle className="text-lg flex items-center gap-2">
                      <selectedSegment.icon className={`h-5 w-5 ${selectedSegment.color}`} />
                      {selectedSegment.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">Customer Count</Label>
                      <p className="text-lg font-semibold">{selectedSegment.customerCount.toLocaleString()}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Key Features</Label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedSegment.features.map((feature, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Model Performance</Label>
                      <div className="space-y-2 mt-2">
                        <div className="flex justify-between text-sm">
                          <span>Accuracy</span>
                          <span>{selectedSegment.modelAccuracy}%</span>
                        </div>
                        <Progress value={selectedSegment.modelAccuracy} className="h-2" />
                        <div className="flex justify-between text-sm">
                          <span>Precision</span>
                          <span>{selectedSegment.performance.precision}%</span>
                        </div>
                        <Progress value={selectedSegment.performance.precision} className="h-2" />
                        <div className="flex justify-between text-sm">
                          <span>Recall</span>
                          <span>{selectedSegment.performance.recall}%</span>
                        </div>
                        <Progress value={selectedSegment.performance.recall} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      Risk Factor Profile
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      config={{
                        value: { label: "Risk Level", color: "hsl(var(--primary))" },
                      }}
                      className="h-[200px]"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart data={Object.entries(selectedSegment.riskFactors).map(([key, value]) => ({
                          factor: key.charAt(0).toUpperCase() + key.slice(1),
                          value,
                        }))}>
                          <PolarGrid />
                          <PolarAngleAxis dataKey="factor" tick={{ fontSize: 10 }} />
                          <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} />
                          <Radar
                            name="Risk Level"
                            dataKey="value"
                            stroke="hsl(var(--primary))"
                            fill="hsl(var(--primary))"
                            fillOpacity={0.3}
                            strokeWidth={2}
                          />
                          <ChartTooltip content={<ChartTooltipContent />} />
                        </RadarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="model-config" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Model Configuration for {selectedSegment.name}
                </CardTitle>
                <DialogDescription>
                  Configure and optimize the machine learning model for this customer segment
                </DialogDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label>Model Type</Label>
                      <Select defaultValue="ensemble">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {modelTypes.map((model) => (
                            <SelectItem key={model.id} value={model.id}>
                              <div className="flex items-center justify-between w-full">
                                <span>{model.name}</span>
                                {model.recommended && (
                                  <Badge variant="outline" className="ml-2">Recommended</Badge>
                                )}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Training Data Window</Label>
                      <Select defaultValue="90d">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30d">30 days</SelectItem>
                          <SelectItem value="60d">60 days</SelectItem>
                          <SelectItem value="90d">90 days</SelectItem>
                          <SelectItem value="180d">180 days</SelectItem>
                          <SelectItem value="365d">1 year</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Feature Selection</Label>
                      <div className="space-y-2 mt-2">
                        {["Transaction Amount", "Frequency", "Geographic", "Temporal", "Device", "Channel"].map((feature) => (
                          <div key={feature} className="flex items-center space-x-2">
                            <Switch id={feature} defaultChecked />
                            <Label htmlFor={feature} className="text-sm">{feature}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label>Sensitivity Threshold</Label>
                      <div className="space-y-2 mt-2">
                        <Slider defaultValue={[75]} max={100} step={1} className="w-full" />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Conservative</span>
                          <span>75%</span>
                          <span>Aggressive</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <Label>Retraining Frequency</Label>
                      <Select defaultValue="weekly">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="manual">Manual Only</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Performance Monitoring</Label>
                      <div className="space-y-2 mt-2">
                        <div className="flex items-center space-x-2">
                          <Switch id="drift-detection" defaultChecked />
                          <Label htmlFor="drift-detection" className="text-sm">Model Drift Detection</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch id="auto-retrain" defaultChecked />
                          <Label htmlFor="auto-retrain" className="text-sm">Automatic Retraining</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch id="performance-alerts" defaultChecked />
                          <Label htmlFor="performance-alerts" className="text-sm">Performance Alerts</Label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Lightbulb className="h-4 w-4" />
                    AI Optimization Recommendations
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="p-4 bg-primary/5 border-primary/20">
                      <div className="flex items-start gap-3">
                        <Target className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <h5 className="font-medium text-sm">Feature Engineering</h5>
                          <p className="text-xs text-muted-foreground mt-1">
                            Adding time-of-day features could improve accuracy by 2-3% for this segment.
                          </p>
                          <Button variant="outline" size="sm" className="mt-2">
                            Apply Suggestion
                          </Button>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-4 bg-accent/5 border-accent/20">
                      <div className="flex items-start gap-3">
                        <Zap className="h-5 w-5 text-accent mt-0.5" />
                        <div>
                          <h5 className="font-medium text-sm">Hyperparameter Tuning</h5>
                          <p className="text-xs text-muted-foreground mt-1">
                            Automated hyperparameter optimization is available for this model type.
                          </p>
                          <Button variant="outline" size="sm" className="mt-2">
                            Start Optimization
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline">
                    <Eye className="h-4 w-4 mr-1" />
                    Preview Changes
                  </Button>
                  <Button variant="outline">
                    <Play className="h-4 w-4 mr-1" />
                    Test Configuration
                  </Button>
                  <Button>
                    <Save className="h-4 w-4 mr-1" />
                    Save & Deploy
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Avg Accuracy</span>
                  </div>
                  <div className="text-2xl font-bold">92.1%</div>
                  <div className="flex items-center gap-1 text-xs text-success">
                    <TrendingUp className="h-3 w-3" />
                    +1.8% vs last month
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <XCircle className="h-4 w-4 text-destructive" />
                    <span className="text-sm font-medium">False Positives</span>
                  </div>
                  <div className="text-2xl font-bold">6.3%</div>
                  <div className="flex items-center gap-1 text-xs text-success">
                    <TrendingDown className="h-3 w-3" />
                    -0.9% vs last month
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <span className="text-sm font-medium">Detection Rate</span>
                  </div>
                  <div className="text-2xl font-bold">94.7%</div>
                  <div className="flex items-center gap-1 text-xs text-success">
                    <TrendingUp className="h-3 w-3" />
                    +2.1% vs last month
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-warning" />
                    <span className="text-sm font-medium">Inference Time</span>
                  </div>
                  <div className="text-2xl font-bold">89ms</div>
                  <div className="flex items-center gap-1 text-xs text-success">
                    <TrendingDown className="h-3 w-3" />
                    -12ms vs last month
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChartIcon className="h-5 w-5" />
                  Performance Trends (6 Months)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    accuracy: { label: "Accuracy", color: "hsl(var(--primary))" },
                    falsePositives: { label: "False Positives", color: "hsl(var(--destructive))" },
                    detectionRate: { label: "Detection Rate", color: "hsl(var(--success))" },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart data={performanceMetrics}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line
                        type="monotone"
                        dataKey="accuracy"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="detectionRate"
                        stroke="hsl(var(--success))"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="falsePositives"
                        stroke="hsl(var(--destructive))"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                      />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Segment Performance Comparison
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {customerSegments.map((segment) => (
                      <div key={segment.id} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <segment.icon className={`h-4 w-4 ${segment.color}`} />
                            <span className="text-sm font-medium">{segment.name}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {segment.modelAccuracy}%
                          </span>
                        </div>
                        <Progress value={segment.modelAccuracy} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    Model Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      value: { label: "Models", color: "hsl(var(--primary))" },
                    }}
                    className="h-[200px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={[
                            { name: "Ensemble", value: 3, color: "#3b82f6" },
                            { name: "Neural Network", value: 2, color: "#10b981" },
                            { name: "Random Forest", value: 1, color: "#f59e0b" },
                          ]}
                          cx="50%"
                          cy="50%"
                          outerRadius={60}
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value}`}
                        >
                          {[
                            { name: "Ensemble", value: 3, color: "#3b82f6" },
                            { name: "Neural Network", value: 2, color: "#10b981" },
                            { name: "Random Forest", value: 1, color: "#f59e0b" },
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
          </TabsContent>

          <TabsContent value="deployment" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Cpu className="h-5 w-5" />
                    Deployment Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {customerSegments.map((segment) => (
                    <div key={segment.id} className="flex items-center justify-between p-3 border rounded">
                      <div className="flex items-center gap-3">
                        <segment.icon className={`h-4 w-4 ${segment.color}`} />
                        <span className="font-medium">{segment.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={segment.enabled ? "outline" : "secondary"}
                          className={segment.enabled ? "text-success" : ""}
                        >
                          {segment.enabled ? "Deployed" : "Inactive"}
                        </Badge>
                        <Switch checked={segment.enabled} />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Network className="h-5 w-5" />
                    Infrastructure Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">CPU Usage</span>
                    <span className="text-sm text-muted-foreground">23%</span>
                  </div>
                  <Progress value={23} className="h-2" />

                  <div className="flex justify-between items-center">
                    <span className="text-sm">Memory Usage</span>
                    <span className="text-sm text-muted-foreground">67%</span>
                  </div>
                  <Progress value={67} className="h-2" />

                  <div className="flex justify-between items-center">
                    <span className="text-sm">GPU Utilization</span>
                    <span className="text-sm text-muted-foreground">45%</span>
                  </div>
                  <Progress value={45} className="h-2" />

                  <div className="flex justify-between items-center">
                    <span className="text-sm">Requests/sec</span>
                    <span className="text-sm text-muted-foreground">1,247</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Model Versioning & Rollback
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded">
                    <div>
                      <div className="font-medium">Model v2.4.1 (Current)</div>
                      <div className="text-sm text-muted-foreground">Deployed 2 days ago • Accuracy: 94.2%</div>
                    </div>
                    <Badge variant="outline" className="text-success">Active</Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded">
                    <div>
                      <div className="font-medium">Model v2.3.8</div>
                      <div className="text-sm text-muted-foreground">Deployed 1 week ago • Accuracy: 92.8%</div>
                    </div>
                    <Button variant="outline" size="sm">
                      <RotateCcw className="h-3 w-3 mr-1" />
                      Rollback
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded">
                    <div>
                      <div className="font-medium">Model v2.3.5</div>
                      <div className="text-sm text-muted-foreground">Deployed 2 weeks ago • Accuracy: 91.5%</div>
                    </div>
                    <Button variant="outline" size="sm">
                      <RotateCcw className="h-3 w-3 mr-1" />
                      Rollback
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  A/B Testing & Canary Deployment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded">
                    <h4 className="font-medium mb-2">Current A/B Test</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Testing new ensemble model vs current neural network
                    </p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Model A (Current)</span>
                        <span>70% traffic</span>
                      </div>
                      <Progress value={70} className="h-2" />
                      <div className="flex justify-between text-sm">
                        <span>Model B (New)</span>
                        <span>30% traffic</span>
                      </div>
                      <Progress value={30} className="h-2" />
                    </div>
                  </div>

                  <div className="p-4 border rounded">
                    <h4 className="font-medium mb-2">Test Results</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Model A Accuracy</span>
                        <span>92.1%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Model B Accuracy</span>
                        <span className="text-success">94.7%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Statistical Significance</span>
                        <span className="text-success">95%</span>
                      </div>
                    </div>
                    <Button size="sm" className="w-full mt-3">
                      Promote Model B
                    </Button>
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
            <Download className="h-4 w-4 mr-1" />
            Export Configuration
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}