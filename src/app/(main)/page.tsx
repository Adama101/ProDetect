import { Activity, ShieldCheck, DollarSign, Landmark, Users, AlertTriangle } from 'lucide-react';
import { RiskScoreCard } from '@/components/dashboard/risk-score-card';
import { RiskTrendChart } from '@/components/dashboard/risk-trend-chart';
import { AlertsSummary } from '@/components/dashboard/alerts-summary';

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Risk & Compliance Dashboard</h1>
        <p className="text-muted-foreground">Real-time overview of fraud, AML, and compliance status.</p>
      </header>

      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
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

      <section className="grid gap-6 md:grid-cols-2">
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

      <section>
        <RiskTrendChart />
      </section>

      <section>
        <AlertsSummary />
      </section>
    </div>
  );
}
