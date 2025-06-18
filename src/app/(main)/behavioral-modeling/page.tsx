"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  Activity,
  SlidersHorizontal,
  Bot,
  UserCheck,
  UserX,
  Brain,
  TrendingUp,
  AlertTriangle,
  Eye,
  Zap,
  Target,
  Network,
  BarChart3,
  PieChart,
  LineChart,
  Sparkles,
  Clock,
  Shield,
  DollarSign,
  Globe,
  Calendar,
  Filter,
} from "lucide-react";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltipContent,
  ChartLegendContent,
} from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
  PieChart as RechartsPieChart,
  Cell,
  LineChart as RechartsLineChart,
  Line,
  Area,
  AreaChart,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ScatterChart,
  Scatter,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

// Enhanced data structures for AI insights
const customerSegmentsData = [
  { 
    segment: "Low Risk Retail", 
    count: 12500, 
    avgTxValue: 75, 
    riskScore: 15,
    behaviorPattern: "Consistent small transactions",
    aiInsight: "Stable spending patterns with predictable monthly cycles",
    anomalyRate: 0.2,
    engagementScore: 85
  },
  { 
    segment: "High Net Worth", 
    count: 850, 
    avgTxValue: 15000, 
    riskScore: 45,
    behaviorPattern: "Large irregular transactions",
    aiInsight: "Investment-focused with seasonal spending spikes",
    anomalyRate: 2.1,
    engagementScore: 92
  },
  { 
    segment: "MSBs", 
    count: 300, 
    avgTxValue: 5000, 
    riskScore: 75,
    behaviorPattern: "High frequency business transactions",
    aiInsight: "Complex transaction networks requiring enhanced monitoring",
    anomalyRate: 8.5,
    engagementScore: 78
  },
  { 
    segment: "Online Gamers", 
    count: 5600, 
    avgTxValue: 30, 
    riskScore: 35,
    behaviorPattern: "Micro-transactions with burst activity",
    aiInsight: "Gaming-related spending with weekend peaks",
    anomalyRate: 1.8,
    engagementScore: 88
  },
  { 
    segment: "International Students", 
    count: 1200, 
    avgTxValue: 250, 
    riskScore: 55,
    behaviorPattern: "Cross-border educational payments",
    aiInsight: "Tuition and living expense patterns with geographic clustering",
    anomalyRate: 3.2,
    engagementScore: 76
  },
];

const behaviorTrendsData = [
  { month: "Jan", normalBehavior: 85, anomalies: 15, riskScore: 25 },
  { month: "Feb", normalBehavior: 82, anomalies: 18, riskScore: 28 },
  { month: "Mar", normalBehavior: 88, anomalies: 12, riskScore: 22 },
  { month: "Apr", normalBehavior: 79, anomalies: 21, riskScore: 32 },
  { month: "May", normalBehavior: 91, anomalies: 9, riskScore: 18 },
  { month: "Jun", normalBehavior: 86, anomalies: 14, riskScore: 24 },
];

const aiInsightsData = [
  {
    id: 1,
    type: "Pattern Recognition",
    title: "Emerging Fraud Vector Detected",
    description: "AI identified a new pattern of coordinated micro-transactions across 47 accounts, suggesting potential money laundering through gaming platforms.",
    confidence: 94,
    impact: "High",
    actionRequired: true,
    timestamp: "2 hours ago",
    category: "Fraud Detection"
  },
  {
    id: 2,
    type: "Behavioral Shift",
    title: "Customer Segment Migration",
    description: "15% of Low Risk Retail customers showing spending patterns similar to High Net Worth segment, indicating potential income changes.",
    confidence: 87,
    impact: "Medium",
    actionRequired: false,
    timestamp: "6 hours ago",
    category: "Segmentation"
  },
  {
    id: 3,
    type: "Anomaly Cluster",
    title: "Geographic Transaction Anomaly",
    description: "Unusual concentration of international transfers from specific postal codes, potentially indicating organized financial activity.",
    confidence: 91,
    impact: "High",
    actionRequired: true,
    timestamp: "1 day ago",
    category: "Geographic Analysis"
  },
  {
    id: 4,
    type: "Predictive Alert",
    title: "Seasonal Behavior Prediction",
    description: "AI predicts 23% increase in cross-border transactions next month based on historical patterns and external economic indicators.",
    confidence: 78,
    impact: "Low",
    actionRequired: false,
    timestamp: "2 days ago",
    category: "Forecasting"
  }
];

const riskDistributionData = [
  { name: "Low Risk", value: 65, color: "#10B981" },
  { name: "Medium Risk", value: 25, color: "#F59E0B" },
  { name: "High Risk", value: 8, color: "#EF4444" },
  { name: "Critical Risk", value: 2, color: "#7C2D12" },
];

const behaviorNetworkData = [
  { segment: "Retail", connections: 45, riskLevel: 2, influence: 15 },
  { segment: "Business", connections: 78, riskLevel: 6, influence: 35 },
  { segment: "International", connections: 23, riskLevel: 8, influence: 28 },
  { segment: "Gaming", connections: 67, riskLevel: 4, influence: 22 },
  { segment: "Students", connections: 34, riskLevel: 5, influence: 18 },
];

const chartConfig = {
  count: {
    label: "Customer Count",
    color: "hsl(var(--chart-1))",
  },
  avgTxValue: {
    label: "Avg. Tx Value (USD)",
    color: "hsl(var(--chart-2))",
  },
  riskScore: {
    label: "Risk Score",
    color: "hsl(var(--chart-3))",
  },
  normalBehavior: {
    label: "Normal Behavior %",
    color: "hsl(var(--chart-4))",
  },
  anomalies: {
    label: "Anomalies %",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

export default function BehavioralModelingPage() {
  const [isClient, setIsClient] = useState(false);
  const [selectedInsight, setSelectedInsight] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    setIsClient(true);
  }, []);

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "High": return "destructive";
      case "Medium": return "warning";
      case "Low": return "secondary";
      default: return "outline";
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return "text-green-600";
    if (confidence >= 75) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="flex flex-col gap-4">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Brain className="h-8 w-8 text-primary" />
            AI-Powered Behavioral Analytics
          </h1>
          <p className="text-muted-foreground mt-1">
            Deep learning insights into customer behavior patterns and risk assessment
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
          <Button variant="outline" size="sm">
            <Bot className="mr-2 h-4 w-4" />
            AI Insights
          </Button>
        </div>
      </header>

      {/* Key Metrics Dashboard */}
      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-lg border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Segments
            </CardTitle>
            <Users className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {customerSegmentsData.length}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <p className="text-xs text-muted-foreground">
                +2 new segments this month
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              AI Confidence Score
            </CardTitle>
            <Sparkles className="h-5 w-5 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">94%</div>
            <Progress value={94} className="mt-2 h-2" />
            <p className="text-xs text-muted-foreground mt-1">
              Model accuracy improving
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-l-4 border-l-red-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Anomalies
            </CardTitle>
            <AlertTriangle className="h-5 w-5 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">23</div>
            <div className="flex items-center gap-2 mt-1">
              <Clock className="h-3 w-3 text-orange-500" />
              <p className="text-xs text-muted-foreground">
                5 require immediate attention
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Prediction Accuracy
            </CardTitle>
            <Target className="h-5 w-5 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">91.2%</div>
            <div className="flex items-center gap-2 mt-1">
              <Zap className="h-3 w-3 text-blue-500" />
              <p className="text-xs text-muted-foreground">
                Real-time learning active
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Main Analytics Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="segments">Segments</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
          <TabsTrigger value="patterns">Patterns</TabsTrigger>
          <TabsTrigger value="predictions">Predictions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Behavior Trends Chart */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
                  <LineChart className="h-5 w-5" />
                  Behavioral Trends Analysis
                </CardTitle>
                <CardDescription>
                  Monthly analysis of normal vs anomalous behavior patterns
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isClient ? (
                  <ChartContainer config={chartConfig} className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={behaviorTrendsData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip content={<ChartTooltipContent />} />
                        <Legend content={<ChartLegendContent />} />
                        <Area
                          type="monotone"
                          dataKey="normalBehavior"
                          stackId="1"
                          stroke="hsl(var(--chart-4))"
                          fill="hsl(var(--chart-4))"
                          fillOpacity={0.6}
                        />
                        <Area
                          type="monotone"
                          dataKey="anomalies"
                          stackId="1"
                          stroke="hsl(var(--chart-5))"
                          fill="hsl(var(--chart-5))"
                          fillOpacity={0.6}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                ) : (
                  <Skeleton className="h-[300px] w-full" />
                )}
              </CardContent>
            </Card>

            {/* Risk Distribution */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Risk Distribution
                </CardTitle>
                <CardDescription>
                  Current distribution of customers across risk categories
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isClient ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsPieChart>
                      <Tooltip />
                      <Legend />
                      <Pie
                        data={riskDistributionData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                      >
                        {riskDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </RechartsPieChart>
                  </ResponsiveContainer>
                ) : (
                  <Skeleton className="h-[300px] w-full" />
                )}
              </CardContent>
            </Card>
          </div>

          {/* Behavioral Network Analysis */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
                <Network className="h-5 w-5" />
                Behavioral Network Analysis
              </CardTitle>
              <CardDescription>
                Interconnections and influence patterns between customer segments
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isClient ? (
                <ResponsiveContainer width="100%" height={400}>
                  <RadarChart data={behaviorNetworkData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="segment" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    <Radar
                      name="Connections"
                      dataKey="connections"
                      stroke="hsl(var(--chart-1))"
                      fill="hsl(var(--chart-1))"
                      fillOpacity={0.3}
                    />
                    <Radar
                      name="Risk Level"
                      dataKey="riskLevel"
                      stroke="hsl(var(--chart-3))"
                      fill="hsl(var(--chart-3))"
                      fillOpacity={0.3}
                    />
                    <Radar
                      name="Influence"
                      dataKey="influence"
                      stroke="hsl(var(--chart-2))"
                      fill="hsl(var(--chart-2))"
                      fillOpacity={0.3}
                    />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              ) : (
                <Skeleton className="h-[400px] w-full" />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="segments" className="space-y-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-foreground">
                Enhanced Customer Segments Analysis
              </CardTitle>
              <CardDescription>
                AI-powered deep dive into customer behavioral patterns and risk profiles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {customerSegmentsData.map((segment, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold">{segment.segment}</h3>
                        <p className="text-sm text-muted-foreground">{segment.behaviorPattern}</p>
                      </div>
                      <Badge variant={segment.riskScore > 60 ? "destructive" : segment.riskScore > 30 ? "warning" : "secondary"}>
                        Risk: {segment.riskScore}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Customers</p>
                        <p className="font-semibold">{segment.count.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Avg Transaction</p>
                        <p className="font-semibold">${segment.avgTxValue}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Anomaly Rate</p>
                        <p className="font-semibold">{segment.anomalyRate}%</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Engagement</p>
                        <p className="font-semibold">{segment.engagementScore}%</p>
                      </div>
                    </div>

                    <div className="bg-muted/50 rounded-lg p-3">
                      <div className="flex items-start gap-2">
                        <Brain className="h-4 w-4 text-primary mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">AI Insight</p>
                          <p className="text-sm text-muted-foreground">{segment.aiInsight}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="mr-2 h-3 w-3" />
                        View Details
                      </Button>
                      <Button variant="outline" size="sm">
                        <Target className="mr-2 h-3 w-3" />
                        Create Rules
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Real-Time AI Insights
              </CardTitle>
              <CardDescription>
                Machine learning-powered behavioral analysis and recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {aiInsightsData.map((insight) => (
                  <div key={insight.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <Brain className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold">{insight.title}</h4>
                            <Badge variant="outline" className="text-xs">
                              {insight.type}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {insight.description}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {insight.timestamp}
                            </span>
                            <span className="flex items-center gap-1">
                              <Target className="h-3 w-3" />
                              {insight.category}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right space-y-2">
                        <Badge variant={getImpactColor(insight.impact)}>
                          {insight.impact} Impact
                        </Badge>
                        <div className="text-sm">
                          <span className="text-muted-foreground">Confidence: </span>
                          <span className={`font-semibold ${getConfidenceColor(insight.confidence)}`}>
                            {insight.confidence}%
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {insight.actionRequired && (
                      <div className="flex gap-2 pt-2 border-t">
                        <Button size="sm" variant="default">
                          <Shield className="mr-2 h-3 w-3" />
                          Investigate
                        </Button>
                        <Button size="sm" variant="outline">
                          <Eye className="mr-2 h-3 w-3" />
                          View Details
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patterns" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-foreground">
                  Transaction Pattern Analysis
                </CardTitle>
                <CardDescription>
                  AI-detected patterns in transaction behaviors
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Micro-Transaction Clustering</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Detected coordinated small transactions across multiple accounts
                    </p>
                    <div className="flex justify-between items-center">
                      <Badge variant="destructive">High Risk</Badge>
                      <span className="text-sm text-muted-foreground">47 accounts involved</span>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Weekend Spending Spikes</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Gaming segment shows 340% increase in weekend activity
                    </p>
                    <div className="flex justify-between items-center">
                      <Badge variant="secondary">Normal</Badge>
                      <span className="text-sm text-muted-foreground">5,600 customers</span>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Cross-Border Correlation</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      International students show synchronized payment patterns
                    </p>
                    <div className="flex justify-between items-center">
                      <Badge variant="warning">Medium Risk</Badge>
                      <span className="text-sm text-muted-foreground">1,200 customers</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-foreground">
                  Behavioral Anomaly Detection
                </CardTitle>
                <CardDescription>
                  Real-time anomaly detection and classification
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-950/20 rounded-lg">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                      <span className="font-medium">Critical Anomalies</span>
                    </div>
                    <span className="text-2xl font-bold text-red-500">3</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-orange-500" />
                      <span className="font-medium">High Priority</span>
                    </div>
                    <span className="text-2xl font-bold text-orange-500">12</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                      <span className="font-medium">Medium Priority</span>
                    </div>
                    <span className="text-2xl font-bold text-yellow-500">8</span>
                  </div>

                  <div className="pt-4 border-t">
                    <h5 className="font-medium mb-2">Detection Accuracy</h5>
                    <Progress value={94} className="mb-2" />
                    <p className="text-sm text-muted-foreground">
                      94% accuracy with 2.1% false positive rate
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Predictive Analytics Dashboard
              </CardTitle>
              <CardDescription>
                AI-powered predictions for future behavioral patterns and risks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <div className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-blue-500" />
                    <h4 className="font-semibold">Next 30 Days</h4>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Expected Anomalies</span>
                      <span className="font-semibold">+23%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">New Risk Patterns</span>
                      <span className="font-semibold">2-3</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Segment Migrations</span>
                      <span className="font-semibold">156 customers</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-green-500" />
                    <h4 className="font-semibold">Geographic Trends</h4>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Cross-border Activity</span>
                      <span className="font-semibold">+15%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">New Jurisdictions</span>
                      <span className="font-semibold">3 countries</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Compliance Risk</span>
                      <span className="font-semibold text-orange-500">Medium</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-purple-500" />
                    <h4 className="font-semibold">Volume Predictions</h4>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Transaction Volume</span>
                      <span className="font-semibold">+8.5%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Average Value</span>
                      <span className="font-semibold">+12%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Peak Days</span>
                      <span className="font-semibold">Fri-Sun</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  AI Recommendation Engine
                </h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2"></span>
                    <span>Increase monitoring frequency for MSB segment due to predicted anomaly spike</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2"></span>
                    <span>Deploy additional fraud detection rules for gaming micro-transactions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-orange-500 rounded-full mt-2"></span>
                    <span>Review international student segment for potential policy updates</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Center */}
      <section className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-foreground">
              AI Model Management
            </CardTitle>
            <CardDescription>
              Configure and optimize behavioral analysis models
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-border rounded-lg p-8 text-center">
              <SlidersHorizontal className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground">Advanced Model Configuration</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Fine-tune AI parameters and training datasets
              </p>
              <Button variant="outline">Configure Models</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-foreground">
              Automated Response System
            </CardTitle>
            <CardDescription>
              Set up automated actions based on AI insights
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-border rounded-lg p-8 text-center">
              <Zap className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground">Smart Automation Rules</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Create intelligent workflows and alert systems
              </p>
              <Button variant="outline">Setup Automation</Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}