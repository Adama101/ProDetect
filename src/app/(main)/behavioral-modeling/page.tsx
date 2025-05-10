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
import {
  Users,
  Activity,
  SlidersHorizontal,
  Bot,
  UserCheck,
  UserX,
} from "lucide-react";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
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
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

const customerSegmentsData = [
  { segment: "Low Risk Retail", count: 12500, avgTxValue: 75 },
  { segment: "High Net Worth", count: 850, avgTxValue: 15000 },
  { segment: "MSBs", count: 300, avgTxValue: 5000 },
  { segment: "Online Gamers", count: 5600, avgTxValue: 30 },
  { segment: "International Students", count: 1200, avgTxValue: 250 },
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
} satisfies ChartConfig;

export default function BehavioralModelingPage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Behavioral Modeling & Segmentation
          </h1>
          <p className="text-muted-foreground">
            Understand customer behavior, define segments, and detect anomalies
            using advanced analytics.
          </p>
        </div>
        <Button variant="outline">
          <Bot className="mr-2 h-4 w-4" />
          AI-Powered Insights
        </Button>
      </header>

      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Customer Segments
            </CardTitle>
            <Users className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {customerSegmentsData.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Active segments defined
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Anomalies Detected (24h)
            </CardTitle>
            <Activity className="h-5 w-5 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">17</div>
            <p className="text-xs text-muted-foreground mt-1">
              +3 from yesterday
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Models in Production
            </CardTitle>
            <SlidersHorizontal className="h-5 w-5 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">5</div>
            <p className="text-xs text-muted-foreground mt-1">
              Actively monitoring behavior
            </p>
          </CardContent>
        </Card>
      </section>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-foreground">
            Customer Segments Overview
          </CardTitle>
          <CardDescription>
            Distribution of customers across defined risk and behavioral
            segments.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isClient ? (
            <ChartContainer config={chartConfig} className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height={400}>
                <BarChart
                  data={customerSegmentsData}
                  margin={{ top: 5, right: 20, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="segment"
                    angle={-30}
                    textAnchor="end"
                    interval={0}
                    height={80}
                    tick={{ fontSize: 10 }}
                  />
                  <YAxis
                    yAxisId="left"
                    orientation="left"
                    stroke="hsl(var(--chart-1))"
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    stroke="hsl(var(--chart-2))"
                  />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Legend content={<ChartLegendContent />} />
                  <Bar
                    yAxisId="left"
                    dataKey="count"
                    fill="hsl(var(--chart-1))"
                    radius={[4, 4, 0, 0]}
                    name="Customer Count"
                  />
                  <Bar
                    yAxisId="right"
                    dataKey="avgTxValue"
                    fill="hsl(var(--chart-2))"
                    radius={[4, 4, 0, 0]}
                    name="Avg. Tx Value (USD)"
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          ) : (
            <div className="h-[400px] w-full flex items-center justify-center text-muted-foreground">
              <Skeleton className="h-full w-full" />
            </div>
          )}
        </CardContent>
      </Card>

      <section className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-foreground">
              Anomaly Detection Rules
            </CardTitle>
            <CardDescription>
              Configure and manage rules for identifying unusual behavior
              patterns. (Feature coming soon)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-border rounded-lg p-8 text-center">
              <UserX className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground">
                Behavioral Rule Configuration
              </h3>
              <p className="text-sm text-muted-foreground">
                Define thresholds, deviations, and sequences that trigger
                behavioral alerts.
              </p>
              <Button variant="secondary" className="mt-4">
                Configure Rules
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-foreground">
              Segment-Specific Models
            </CardTitle>
            <CardDescription>
              Develop and deploy tailored behavioral models for each customer
              segment. (Feature coming soon)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-border rounded-lg p-8 text-center">
              <UserCheck className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground">
                Model Management
              </h3>
              <p className="text-sm text-muted-foreground">
                Train, test, and monitor the performance of your behavioral
                models.
              </p>
              <Button variant="secondary" className="mt-4">
                Manage Models
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
