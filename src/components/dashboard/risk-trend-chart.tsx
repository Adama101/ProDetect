"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ApexOptions } from "apexcharts";

// Dynamically import ApexCharts with SSR disabled
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export function RiskTrendChart() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const options: ApexOptions = {
    chart: {
      id: "risk-trends",
      type: "area",
      fontFamily: "Inter, sans-serif",
      background: "transparent",
      toolbar: {
        show: false,
      },
      animations: {
        enabled: true,
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150,
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: 3,
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "light",
        type: "vertical",
        shadeIntensity: 0.4,
        opacityFrom: 0.5,
        opacityTo: 0.05,
        stops: [0, 90, 100],
      },
    },
    colors: ["#3b82f6", "#ec4899", "#f59e0b"],
    grid: {
      borderColor: "#e5e7eb",
      strokeDashArray: 4,
      padding: {
        left: 10,
        right: 10,
        top: 0,
        bottom: 0,
      },
    },
    tooltip: {
      theme: "dark",
      x: {
        format: "MMM",
      },
    },
    xaxis: {
      categories: [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
      ],
      labels: {
        style: {
          fontSize: "12px",
          colors: "#6b7280",
        },
      },
      axisBorder: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: "12px",
          colors: "#6b7280",
        },
      },
    },
    legend: {
      position: "top",
      horizontalAlign: "center",
      fontSize: "13px",
      labels: {
        colors: "#374151",
      },
      markers: {
        size: 12,
      },
    },
  };

  const series = [
    {
      name: "Overall Risk",
      data: [2, 0, 3, 5, 1, 4, 2, 0, 0, 0, 0, 0],
    },
    {
      name: "Fraud Attempts",
      data: [5, 2, 0, 4, 6, 2, 8, 0, 0, 0, 0, 0],
    },
    {
      name: "Compliance Alerts",
      data: [8, 0, 2, 5, 3, 6, 8, 4, 0, 0, 0, 0],
    },
  ];

  return (
    <Card className="border shadow-md rounded-2xl bg-white dark:bg-zinc-900 transition-all duration-300">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg text-gray-800 dark:text-white">
          Risk Trends
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isMounted ? (
          <Chart options={options} series={series} type="area" height={350} />
        ) : (
          <div className="flex items-center justify-center h-[350px] bg-muted/20 rounded-lg">
            <p className="text-muted-foreground">Loading chart...</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
