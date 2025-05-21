"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ApexOptions } from "apexcharts";

// Dynamically import ApexCharts with SSR disabled
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export function RiskTrendChart() {
  // Use state to track if component is mounted (client-side)
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Chart options
  const options: ApexOptions = {
    chart: {
      id: "risk-trends",
      type: "area",
      toolbar: {
        show: false,
      },
      fontFamily: "inherit",
      background: "transparent",
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.1,
        stops: [0, 90, 100]
      }
    },
    colors: ["#3b82f6", "#ef4444", "#f59e0b"],
    grid: {
      borderColor: "#f1f1f1",
      strokeDashArray: 4,
      xaxis: {
        lines: {
          show: true
        }
      },
      yaxis: {
        lines: {
          show: true
        }
      }
    },
    tooltip: {
      theme: "dark",
      x: {
        format: "MM yyyy"
      }
    },
    xaxis: {
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"],
      labels: {
        style: {
          fontFamily: "inherit"
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          fontFamily: "inherit"
        }
      }
    },
    legend: {
      position: "top",
      horizontalAlign: "right",
      fontFamily: "inherit",
      fontSize: "14px"
    },
  };

  // Chart series data
  const series = [
    {
      name: "Overall Risk",
      data: [62, 60, 63, 65, 61, 64, 62, 65, 65],
    },
    {
      name: "Fraud Attempts",
      data: [15, 12, 10, 14, 16, 12, 8, 10, 7],
    },
    {
      name: "Compliance Alerts",
      data: [8, 10, 12, 15, 13, 16, 18, 14, 15],
    },
  ];

  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle>Risk Trends (6-Month)</CardTitle>
      </CardHeader>
      <CardContent>
        {isMounted && (
          <Chart
            options={options}
            series={series}
            type="area"
            height={350}
          />
        )}
        {!isMounted && (
          <div className="flex items-center justify-center h-[350px] bg-muted/20 rounded-md">
            <p className="text-muted-foreground">Loading chart...</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}