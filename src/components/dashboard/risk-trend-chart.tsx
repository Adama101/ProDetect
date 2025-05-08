'use client';

import { TrendingUp } from 'lucide-react';
import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import type { ChartConfig } from '@/components/ui/chart';

const chartData = [
  { date: '2024-05-01', riskScore: 65 },
  { date: '2024-05-05', riskScore: 68 },
  { date: '2024-05-10', riskScore: 72 },
  { date: '2024-05-15', riskScore: 70 },
  { date: '2024-05-20', riskScore: 75 },
  { date: '2024-05-25', riskScore: 73 },
  { date: '2024-05-30', riskScore: 78 },
  { date: '2024-06-01', riskScore: 80 },
  { date: '2024-06-05', riskScore: 77 },
  { date: '2024-06-10', riskScore: 82 },
];

const chartConfig = {
  riskScore: {
    label: 'Risk Score',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

export function RiskTrendChart() {
  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-foreground">Risk Trend Analysis</CardTitle>
        <CardDescription>Monthly risk score trend</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
              top: 5,
              bottom: 5,
            }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} domain={[60, 90]} />
            <Tooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Legend content={<ChartLegendContent />} />
            <Line
              dataKey="riskScore"
              type="monotone"
              stroke="var(--color-riskScore)"
              strokeWidth={2}
              dot={{
                fill: 'var(--color-riskScore)',
              }}
              activeDot={{
                r: 6,
              }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5 points this month <TrendingUp className="h-4 w-4 text-success" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing data for the last 30-45 days
        </div>
      </CardFooter>
    </Card>
  );
}