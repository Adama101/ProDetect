import { Activity, Users, DollarSign, AlertOctagon } from 'lucide-react';
import { RiskScoreCard } from '@/components/dashboard/risk-score-card';
import { RiskTrendChart } from '@/components/dashboard/risk-trend-chart';
import { AlertsSummary } from '@/components/dashboard/alerts-summary';

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Risk Dashboard</h1>
        <p className="text-muted-foreground">Real-time overview of potential compliance issues.</p>
      </header>

      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <RiskScoreCard
          title="Overall Risk Score"
          score="78"
          trend="up"
          trendText="+5.2% from last month"
          icon={Activity}
          iconColor="text-primary"
        />
        <RiskScoreCard
          title="High-Risk Entities"
          score="12"
          trend="neutral"
          trendText="No change"
          icon={Users}
          iconColor="text-warning"
        />
        <RiskScoreCard
          title="Potential Fraud Cases"
          score="3"
          trend="down"
          trendText="-1 from last week"
          icon={DollarSign}
          iconColor="text-destructive"
        />
        <RiskScoreCard
          title="Open Critical Alerts"
          score="5"
          trend="up"
          trendText="+2 new alerts"
          icon={AlertOctagon}
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