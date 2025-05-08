
import { GenerateReportCard } from '@/components/reports/generate-report-card';
import { ReportMetricCard } from '@/components/reports/report-metric-card';
import { RecentReportsTable } from '@/components/reports/recent-reports-table';
import { TrendingUp, ShieldCheck, FileText } from 'lucide-react';

export default function ReportsPage() {
  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Reports</h1>
        <p className="text-muted-foreground">
          Generate, manage, and review detailed compliance reports to improve decision-making and enhance audit readiness.
        </p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GenerateReportCard />
        <ReportMetricCard 
          title="AML Alerts Trend" 
          description="Monitor trends in AML alert generation."
          icon={TrendingUp}
        />
        <ReportMetricCard 
          title="Fraud Detection Rate" 
          description="Track the effectiveness of fraud detection mechanisms."
          icon={ShieldCheck}
        />
      </section>

      <section>
        <RecentReportsTable />
      </section>

      <section>
        <div className="p-6 border-2 border-dashed border-border rounded-lg text-center mt-8 bg-card shadow-sm">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Automated Regulatory Submissions</h3>
            <p className="text-sm text-muted-foreground">
                Configure automated submission of required reports (e.g., SARs, STRs) directly to regulatory bodies. 
                Feature managed under <code className="bg-muted px-1 py-0.5 rounded text-xs">Settings &gt; Reporting & Submissions</code>.
            </p>
        </div>
      </section>
    </div>
  );
}
