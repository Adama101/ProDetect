
'use client';

import { AreaChart, Area, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
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

const rawChartData = [
  { day: 'Monday', alertsGenerated: 20, suspiciousTransactions: 18, highRiskTransactions: 15 },
  { day: 'Tuesday', alertsGenerated: 40, suspiciousTransactions: 35, highRiskTransactions: 20 },
  { day: 'Wednesday', alertsGenerated: 35, suspiciousTransactions: 30, highRiskTransactions: 22 },
  { day: 'Thursday', alertsGenerated: 55, suspiciousTransactions: 45, highRiskTransactions: 25 },
  { day: 'Friday', alertsGenerated: 70, suspiciousTransactions: 60, highRiskTransactions: 35 },
  { day: 'Saturday', alertsGenerated: 90, suspiciousTransactions: 80, highRiskTransactions: 45 },
  { day: 'Sunday', alertsGenerated: 85, suspiciousTransactions: 75, highRiskTransactions: 50 },
];

const chartConfig = {
  alertsGenerated: {
    label: 'Alerts Generated',
    color: 'hsl(var(--chart-1))', // Blue
  },
  suspiciousTransactions: {
    label: 'Suspicious Transactions',
    color: 'hsl(var(--chart-4))', // Orange/Yellow
  },
  highRiskTransactions: {
    label: 'High-Risk Transactions',
    color: 'hsl(var(--destructive))', // Red
  },
  // For area fills, if they need to appear in legend (they don't based on image)
  areaHighRisk: { color: 'hsl(var(--muted))' },
  areaSuspiciousBand: { color: 'hsl(var(--destructive))' },
  areaAlertsBand: { color: 'hsl(var(--chart-4))' },
} satisfies ChartConfig;

// Data transformation for stacked areas and lines
const transformedChartData = rawChartData.map(d => {
  const hrt = d.highRiskTransactions;
  const st = d.suspiciousTransactions;
  const ag = d.alertsGenerated;
  return {
    day: d.day,
    // Original values for lines and labels
    highRiskTransactions: hrt,
    suspiciousTransactions: st,
    alertsGenerated: ag,

    // Values for stacked areas
    area_hrt_val: hrt,
    area_st_band_val: Math.max(0, st - hrt),
    area_ag_band_val: Math.max(0, ag - st),
  };
});

const CustomizedLabel = (props: any) => {
  const { x, y, value, color } = props;
  const labelHeight = 18; // Increased height for better padding
  const labelWidth = value >= 100 ? 30 : 26; // Wider for 3-digit numbers
  const yPos = y - labelHeight - 6; // 6px spacing from point
  const xPos = x - labelWidth / 2;

  if (value === undefined || value === null || value < 0) return null; // Don't render label for 0, negative or undefined

  return (
    <g>
      <rect x={xPos} y={yPos} width={labelWidth} height={labelHeight} rx="3" ry="3" fill={color} />
      <text x={x} y={yPos + labelHeight / 2} dy={1} fill="#fff" fontSize={10} fontWeight="600" textAnchor="middle" dominantBaseline="middle">
        {value}
      </text>
    </g>
  );
};


export function RiskTrendChart() {
  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-foreground">Risk Trend Analysis</CardTitle>
        <CardDescription>Weekly count of transactions and alerts.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              accessibilityLayer
              data={transformedChartData}
              margin={{
                left: 12,
                right: 20, // Increased right margin for labels on the edge
                top: 30,   // Increased top margin for labels
                bottom: 5,
              }}
            >
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                domain={[0, 100]}
                ticks={[0, 20, 40, 60, 80, 100]}
                label={{ value: 'Count of Transactions / Alerts', angle: -90, position: 'insideLeft', offset: -5, style: { textAnchor: 'middle', fill: 'hsl(var(--muted-foreground))' } }}
              />
              <Tooltip
                cursor={{ strokeDasharray: '3 3' }}
                content={<ChartTooltipContent 
                  formatter={(value, name) => {
                    // Ensure tooltip shows original values for lines
                    if (name === 'alertsGenerated' || name === 'suspiciousTransactions' || name === 'highRiskTransactions') {
                       return [value, chartConfig[name as keyof typeof chartConfig]?.label || name];
                    }
                    return null; // Hide area values from tooltip by default
                  }}
                  payloadTransformer={(payload) => payload.filter(p => p.dataKey?.endsWith('Transactions') || p.dataKey?.endsWith('Generated'))}
                />}
              />
              <Legend content={<ChartLegendContent />} />

              {/* Stacked Areas for Fills */}
              <Area type="monotone" dataKey="area_hrt_val" stackId="1" stroke="none" fill={chartConfig.areaHighRisk.color} fillOpacity={0.6} name="" />
              <Area type="monotone" dataKey="area_st_band_val" stackId="1" stroke="none" fill={chartConfig.areaSuspiciousBand.color} fillOpacity={0.2} name="" />
              <Area type="monotone" dataKey="area_ag_band_val" stackId="1" stroke="none" fill={chartConfig.areaAlertsBand.color} fillOpacity={0.25} name="" />
              
              {/* Lines with Labels - render last to be on top */}
              <Line
                type="monotone"
                dataKey="highRiskTransactions"
                stroke={chartConfig.highRiskTransactions.color}
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5, fill: chartConfig.highRiskTransactions.color, strokeWidth: 0 }}
                label={(props) => <CustomizedLabel {...props} color={chartConfig.highRiskTransactions.color} />}
                name={chartConfig.highRiskTransactions.label as string}
              />
              <Line
                type="monotone"
                dataKey="suspiciousTransactions"
                stroke={chartConfig.suspiciousTransactions.color}
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5, fill: chartConfig.suspiciousTransactions.color, strokeWidth: 0 }}
                label={(props) => <CustomizedLabel {...props} color={chartConfig.suspiciousTransactions.color} />}
                name={chartConfig.suspiciousTransactions.label as string}
              />
              <Line
                type="monotone"
                dataKey="alertsGenerated"
                stroke={chartConfig.alertsGenerated.color}
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5, fill: chartConfig.alertsGenerated.color, strokeWidth: 0 }}
                label={(props) => <CustomizedLabel {...props} color={chartConfig.alertsGenerated.color} />}
                name={chartConfig.alertsGenerated.label as string}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
