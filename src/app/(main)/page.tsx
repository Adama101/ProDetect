"use client";

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import {
  Activity,
  ShieldCheck,
  DollarSign,
  Landmark,
  Users,
  AlertTriangle,
} from "lucide-react";
import { RiskScoreCard } from "@/components/dashboard/risk-score-card";
// Dynamically import components that might use window
const RiskTrendChart = dynamic(
  () => import("@/components/dashboard/risk-trend-chart").then(mod => ({ default: mod.RiskTrendChart })),
  { ssr: false }
);
const AlertsSummary = dynamic(
  () => import("@/components/dashboard/alerts-summary").then(mod => ({ default: mod.AlertsSummary })),
  { ssr: false }
);

export default function DashboardPage() {
  // Use a simple state without TypeScript interface
  const [windowWidth, setWindowWidth] = useState(0);
  const [windowHeight, setWindowHeight] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    // Mark component as mounted first
    setIsMounted(true);
    
    // Only access window after component is mounted (client-side)
    setWindowWidth(window.innerWidth);
    setWindowHeight(window.innerHeight);
    
    // Add resize listener
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setWindowHeight(window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Render base content regardless of window measurements
  return (
    <div className="flex flex-col gap-3">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Dashboard
        </h1>
      </header>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <RiskScoreCard
          title="Overall Compliance Risk"
          score="65"
          trend="up"
          trendText="+3.5% this month"
          icon={Activity}
          iconColor="text-primary"
        />
        <RiskScoreCard
          title="AML Detection Rate"
          score="99.2%"
          trend="neutral"
          trendText="Stable performance"
          icon={ShieldCheck}
          iconColor="text-success"
        />
        <RiskScoreCard
          title="Open Fraud Cases"
          score="7"
          trend="down"
          trendText="-2 from last week"
          icon={DollarSign}
          iconColor="text-destructive"
        />
        <RiskScoreCard
          title="Sanctions Screening Alerts"
          score="15"
          trend="up"
          trendText="+4 new alerts"
          icon={Landmark}
          iconColor="text-warning"
        />
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <RiskScoreCard
          title="High-Risk Customer Segments"
          score="4"
          trend="up"
          trendText="+1 segment elevated"
          icon={Users}
          iconColor="text-warning"
        />
        <RiskScoreCard
          title="Anomalous Behavior Alerts"
          score="23"
          trend="neutral"
          trendText="Monitoring active"
          icon={AlertTriangle}
          iconColor="text-accent"
        />
      </section>

      {isMounted && (
        <>
          <section>
            <RiskTrendChart />
          </section>

          <section>
            <AlertsSummary />
          </section>
        </>
      )}
    </div>
  );
}