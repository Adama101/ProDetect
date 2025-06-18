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
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Brain,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Users,
  Target,
  Zap,
  Shield,
  DollarSign,
  Clock,
  MapPin,
  CreditCard,
  Smartphone,
  Globe,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Eye,
  CheckCircle,
  XCircle,
  ArrowRight,
  Lightbulb,
  Star,
  Filter,
} from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ScatterChart,
  Scatter,
  Cell,
  PieChart as RechartsPieChart,
  Pie,
} from "recharts";

interface AIInsightsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Mock data for AI insights
const behavioralTrends = [
  { month: "Jan", anomalies: 12, normalBehavior: 88, riskScore: 15 },
  { month: "Feb", anomalies: 18, normalBehavior: 82, riskScore: 22 },
  { month: "Mar", anomalies: 8, normalBehavior: 92, riskScore: 12 },
  { month: "Apr", anomalies: 25, normalBehavior: 75, riskScore: 35 },
  { month: "May", anomalies: 15, normalBehavior: 85, riskScore: 18 },
  { month: "Jun", anomalies: 32, normalBehavior: 68, riskScore: 42 },
];

const segmentRiskProfile = [
  { segment: "Digital Natives", risk: 85, volume: 45, growth: 12 },
  { segment: "Traditional Users", risk: 25, volume: 30, growth: -5 },
  { segment: "High-Value Clients", risk: 60, volume: 15, growth: 8 },
  { segment: "Emerging Markets", risk: 75, volume: 35, growth: 25 },
  { segment: "Corporate Accounts", risk: 40, volume: 20, growth: 3 },
];

const anomalyPatterns = [
  { pattern: "Velocity", frequency: 45, severity: "High", trend: "up" },
  { pattern: "Geographic", frequency: 32, severity: "Medium", trend: "down" },
  { pattern: "Temporal", frequency: 28, severity: "High", trend: "up" },
  { pattern: "Amount", frequency: 38, severity: "Critical", trend: "up" },
  { pattern: "Channel", frequency: 22, severity: "Low", trend: "stable" },
];

const predictiveInsights = [
  {
    title: "Emerging Fraud Vector",
    description: "AI detected a 340% increase in cross-border micro-transactions from new user segments",
    confidence: 94,
    impact: "High",
    timeframe: "Next 7 days",
    recommendation: "Implement enhanced KYC for transactions >$500 from new geographic regions",
    icon: AlertTriangle,
    color: "text-destructive",
  },
  {
    title: "Behavioral Drift Alert",
    description: "High-value customer segment showing 25% deviation from established patterns",
    confidence: 87,
    impact: "Medium",
    timeframe: "Next 14 days",
    recommendation: "Deploy targeted behavioral questionnaire to validate legitimate pattern changes",
    icon: TrendingDown,
    color: "text-warning",
  },
  {
    title: "Seasonal Pattern Anomaly",
    description: "Holiday spending patterns emerging 3 weeks earlier than historical data suggests",
    confidence: 78,
    impact: "Low",
    timeframe: "Next 30 days",
    recommendation: "Adjust seasonal risk models and alert thresholds accordingly",
    icon: Calendar,
    color: "text-success",
  },
];

const riskFactorRadar = [
  { factor: "Transaction Velocity", current: 65, baseline: 45 },
  { factor: "Geographic Spread", current: 78, baseline: 60 },
  { factor: "Device Diversity", current: 45, baseline: 55 },
  { factor: "Time Patterns", current: 82, baseline: 70 },
  { factor: "Amount Variance", current: 58, baseline: 40 },
  { factor: "Channel Usage", current: 72, baseline: 65 },
];

const segmentDistribution = [
  { name: "Low Risk Retail", value: 45, color: "#10b981" },
  { name: "Medium Risk Business", value: 25, color: "#f59e0b" },
  { name: "High Risk International", value: 15, color: "#ef4444" },
  { name: "VIP Clients", value: 10, color: "#8b5cf6" },
  { name: "Suspicious Activity", value: 5, color: "#dc2626" },
];

export function AIInsightsModal({ open, onOpenChange }: AIInsightsModalProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);

  useEffect(() => {
    if (open) {
      setIsAnalyzing(true);
      setAnalysisProgress(0);
      
      const interval = setInterval(() => {
        setAnalysisProgress((prev) => {
          if (prev >= 100) {
            setIsAnalyzing(false);
            clearInterval(interval);
            return 100;
          }
          return prev + Math.random() * 15;
        });
      }, 200);

      return () => clearInterval(interval);
    }
  }, [open]);

  if (isAnalyzing) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary animate-pulse" />
              AI Analysis in Progress
            </DialogTitle>
            <DialogDescription>
              Analyzing behavioral patterns and generating insights...
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Processing customer segments</span>
                <span>{Math.round(analysisProgress)}%</span>
              </div>
              <Progress value={analysisProgress} className="h-2" />
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                <span>Analyzing 2.3M transactions</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>Processing 45K customers</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                <span>Detecting anomalies</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                <span>Generating predictions</span>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Brain className="h-6 w-6 text-primary" />
            AI-Powered Behavioral Analytics Deep Dive
          </DialogTitle>
          <DialogDescription>
            Comprehensive analysis of customer behavioral patterns, risk factors, and predictive insights
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="segments">Segments</TabsTrigger>
            <TabsTrigger value="anomalies">Anomalies</TabsTrigger>
            <TabsTrigger value="predictions">Predictions</TabsTrigger>
            <TabsTrigger value="recommendations">Actions</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Activity className="h-4 w-4 text-primary" />
                    Behavioral Health Score
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-success">87.3</div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <TrendingUp className="h-3 w-3 text-success" />
                    +2.1% from last month
                  </div>
                  <Progress value={87.3} className="mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-warning" />
                    Active Anomalies
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-warning">23</div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <TrendingDown className="h-3 w-3 text-success" />
                    -15% from last week
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    5 Critical • 12 High • 6 Medium
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Target className="h-4 w-4 text-accent" />
                    Prediction Accuracy
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-accent">94.7%</div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <TrendingUp className="h-3 w-3 text-success" />
                    +1.2% this quarter
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    Based on 30-day validation
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Behavioral Trends (6 Months)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      anomalies: { label: "Anomalies", color: "hsl(var(--destructive))" },
                      normalBehavior: { label: "Normal", color: "hsl(var(--success))" },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={behavioralTrends}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Area
                          type="monotone"
                          dataKey="normalBehavior"
                          stackId="1"
                          stroke="hsl(var(--success))"
                          fill="hsl(var(--success))"
                          fillOpacity={0.6}
                        />
                        <Area
                          type="monotone"
                          dataKey="anomalies"
                          stackId="1"
                          stroke="hsl(var(--destructive))"
                          fill="hsl(var(--destructive))"
                          fillOpacity={0.6}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Risk Factor Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      current: { label: "Current", color: "hsl(var(--primary))" },
                      baseline: { label: "Baseline", color: "hsl(var(--muted))" },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={riskFactorRadar}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="factor" tick={{ fontSize: 10 }} />
                        <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} />
                        <Radar
                          name="Current"
                          dataKey="current"
                          stroke="hsl(var(--primary))"
                          fill="hsl(var(--primary))"
                          fillOpacity={0.3}
                          strokeWidth={2}
                        />
                        <Radar
                          name="Baseline"
                          dataKey="baseline"
                          stroke="hsl(var(--muted-foreground))"
                          fill="hsl(var(--muted))"
                          fillOpacity={0.1}
                          strokeWidth={1}
                          strokeDasharray="5 5"
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="segments" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    Customer Segment Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      value: { label: "Customers", color: "hsl(var(--primary))" },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={segmentDistribution}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value}%`}
                          labelLine={false}
                        >
                          {segmentDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Segment Risk Profiles
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {segmentRiskProfile.map((segment, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-sm">{segment.segment}</span>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={
                                segment.risk > 70
                                  ? "destructive"
                                  : segment.risk > 40
                                  ? "warning"
                                  : "outline"
                              }
                            >
                              {segment.risk}% Risk
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {segment.volume}% Volume
                            </span>
                          </div>
                        </div>
                        <Progress value={segment.risk} className="h-2" />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Growth: {segment.growth > 0 ? "+" : ""}{segment.growth}%</span>
                          <span>{segment.volume}% of total customers</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Segment Behavioral Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Smartphone className="h-4 w-4 text-primary" />
                      <span className="font-medium">Digital Natives</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      High mobile usage, frequent micro-transactions, social payment patterns
                    </p>
                    <div className="flex gap-2">
                      <Badge variant="outline">Mobile-First</Badge>
                      <Badge variant="outline">Social</Badge>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CreditCard className="h-4 w-4 text-primary" />
                      <span className="font-medium">Traditional Users</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Consistent patterns, branch preferences, scheduled transactions
                    </p>
                    <div className="flex gap-2">
                      <Badge variant="outline">Predictable</Badge>
                      <Badge variant="outline">Branch</Badge>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Globe className="h-4 w-4 text-primary" />
                      <span className="font-medium">International</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Cross-border activity, currency exchanges, travel patterns
                    </p>
                    <div className="flex gap-2">
                      <Badge variant="outline">Global</Badge>
                      <Badge variant="outline">Complex</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="anomalies" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Anomaly Pattern Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {anomalyPatterns.map((pattern, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Filter className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{pattern.pattern} Anomalies</span>
                        </div>
                        <Badge
                          variant={
                            pattern.severity === "Critical"
                              ? "destructive"
                              : pattern.severity === "High"
                              ? "warning"
                              : pattern.severity === "Medium"
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {pattern.severity}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground">
                          {pattern.frequency} occurrences
                        </span>
                        <div className="flex items-center gap-1">
                          {pattern.trend === "up" ? (
                            <TrendingUp className="h-4 w-4 text-destructive" />
                          ) : pattern.trend === "down" ? (
                            <TrendingDown className="h-4 w-4 text-success" />
                          ) : (
                            <div className="h-4 w-4 rounded-full bg-muted" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Temporal Anomaly Patterns
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
                      <span className="text-sm">Weekend Activity Spike</span>
                      <Badge variant="warning">+340%</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
                      <span className="text-sm">After-Hours Transactions</span>
                      <Badge variant="destructive">+180%</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
                      <span className="text-sm">Holiday Pattern Deviation</span>
                      <Badge variant="secondary">+45%</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Geographic Anomalies
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
                      <span className="text-sm">New Geographic Clusters</span>
                      <Badge variant="warning">12 Regions</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
                      <span className="text-sm">Velocity Across Borders</span>
                      <Badge variant="destructive">High Risk</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
                      <span className="text-sm">Unusual Travel Patterns</span>
                      <Badge variant="secondary">Monitoring</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="predictions" className="space-y-6">
            <div className="space-y-4">
              {predictiveInsights.map((insight, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`p-2 rounded-lg bg-muted ${insight.color}`}>
                        <insight.icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold">{insight.title}</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              {insight.description}
                            </p>
                          </div>
                          <div className="text-right">
                            <Badge
                              variant={
                                insight.impact === "High"
                                  ? "destructive"
                                  : insight.impact === "Medium"
                                  ? "warning"
                                  : "secondary"
                              }
                            >
                              {insight.impact} Impact
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Target className="h-4 w-4 text-muted-foreground" />
                            <span>Confidence: {insight.confidence}%</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>{insight.timeframe}</span>
                          </div>
                        </div>

                        <Separator />

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Lightbulb className="h-4 w-4 text-primary" />
                            <span className="text-sm font-medium">Recommended Action:</span>
                          </div>
                          <Button variant="outline" size="sm">
                            Implement
                            <ArrowRight className="h-3 w-3 ml-1" />
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground pl-6">
                          {insight.recommendation}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-success" />
                    Immediate Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded">
                    <span className="text-sm">Update velocity thresholds</span>
                    <Button size="sm" variant="outline">Deploy</Button>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded">
                    <span className="text-sm">Enhanced KYC for new regions</span>
                    <Button size="sm" variant="outline">Configure</Button>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded">
                    <span className="text-sm">Alert rule optimization</span>
                    <Button size="sm" variant="outline">Review</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-warning" />
                    Strategic Initiatives
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded">
                    <span className="text-sm">ML model retraining</span>
                    <Button size="sm" variant="outline">Schedule</Button>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded">
                    <span className="text-sm">Segment-specific rules</span>
                    <Button size="sm" variant="outline">Plan</Button>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded">
                    <span className="text-sm">Cross-channel analytics</span>
                    <Button size="sm" variant="outline">Evaluate</Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Performance Impact Forecast
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-success">-23%</div>
                    <div className="text-sm text-muted-foreground">False Positives</div>
                    <div className="text-xs text-muted-foreground mt-1">Expected reduction</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-primary">+15%</div>
                    <div className="text-sm text-muted-foreground">Detection Rate</div>
                    <div className="text-xs text-muted-foreground mt-1">Projected improvement</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-accent">-40%</div>
                    <div className="text-sm text-muted-foreground">Investigation Time</div>
                    <div className="text-xs text-muted-foreground mt-1">Efficiency gain</div>
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
            Export Report
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}