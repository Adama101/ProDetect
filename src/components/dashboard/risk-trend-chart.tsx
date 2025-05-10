"use client";

import React from "react";
import Chart, { Props } from "react-apexcharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const seriesData: Props["series"] = [
  {
    name: "Suspicious Transactions",
    data: [25, 35, 28, 45, 60, 80, 75],
  },
  {
    name: "High-Risk Transactions",
    data: [15, 20, 30, 25, 35, 45, 50],
  },
  {
    name: "Alerts Generated",
    data: [18, 40, 35, 55, 70, 90, 85],
  },
];

const chartOptions: Props["options"] = {
  chart: {
    type: "area",
    animations: {
      enabled: true,
      speed: 500,
      animateGradually: {
        enabled: true,
        delay: 150
      }
    },
    id: "risk-trend-chart", 
    foreColor: "hsl(var(--foreground))",
    toolbar: {
      show: true,
    },
    background: "transparent",
  },
  xaxis: {
    categories: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
    labels: {
      style: {
        colors: "hsl(var(--muted-foreground))",
      },
    },
    axisBorder: {
      color: "hsl(var(--border))",
    },
    axisTicks: {
      color: "hsl(var(--border))",
    },
  },
  yaxis: {
    labels: {
      style: {
        colors: "hsl(var(--muted-foreground))",
      },
    },
    title: {
      text: "Count of Transactions / Alerts",
      style: {
        color: "hsl(var(--muted-foreground))",
      },
    },
  },
  tooltip: {
    enabled: true,
    theme: "dark",
    x: {
      show: true,
    },
    y: {
      formatter: (val) => `${val} events`,
    },
  },
  grid: {
    borderColor: "hsl(var(--border))",
    strokeDashArray: 5,
  },
  stroke: {
    curve: "smooth",
    width: 2,
  },
  fill: {
    type: "gradient",
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.2,
      opacityTo: 0.2,
      stops: [0, 90, 100],
    },
  },
  markers: {
    size: 5,
    colors: [
      "hsl(var(--chart-4))",
      "hsl(var(--destructive))",
      "hsl(var(--chart-1))",
    ],
  },
  colors: [
    "hsl(var(--chart-4))",
    "hsl(var(--destructive))",
    "hsl(var(--chart-1))",
  ],
};

export function RiskTrendChart() {
  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-foreground">
          Risk Trend Analysis
        </CardTitle>
        <CardDescription>
          Weekly count of transactions and alerts.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full">
          <Chart
            options={chartOptions}
            series={seriesData}
            type="area"
            height={425}
          />
        </div>
      </CardContent>
    </Card>
  );
}
