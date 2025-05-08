import { AlertsList } from '@/components/alerts/alerts-list';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SlidersHorizontal, BotMessageSquare, FileText } from 'lucide-react';

export default function ComplianceOperationsCenterPage() {
  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Compliance Operations Center</h1>
          <p className="text-muted-foreground">
            Monitor alerts, manage cases, automate compliance workflows with dynamic rules, and streamline regulatory reporting.
          </p>
        </div>
        <Button variant="outline">
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          Manage Rules & Workflows
        </Button>
      </header>

      <section>
        <AlertsList />
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-foreground">Automated Compliance Engine</CardTitle>
            <CardDescription>
              Configure no-code, dynamic risk-based rules, automate task assignments, and manage policy enforcement. Leverage AI and unified AML screening capabilities for initial assessments and continuous monitoring.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-border rounded-lg p-8 text-center">
              <SlidersHorizontal className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground">Rule & Workflow Configuration</h3>
              <p className="text-sm text-muted-foreground">
                Define custom detection rules, risk scoring typologies, and automated workflows for different alert types and jurisdictions.
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-foreground">AI-Assisted Investigations</CardTitle>
            <CardDescription>
              Enhance case management with AI-driven insights and automation. (Features rolling out)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-border rounded-lg p-8 text-center">
              <BotMessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground">AI Agents & Narrative Generation</h3>
              <p className="text-sm text-muted-foreground">
                Utilize AI agents for case summarization, evidence gathering, and SAR narrative generation.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
       <section>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-foreground">Regulatory Reporting</CardTitle>
            <CardDescription>
              Utilize integrated reporting tools to streamline SAR/STR filings and maintain comprehensive, audit-ready compliance records. (Automation features rolling out)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-border rounded-lg p-8 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground">Automated Filings & Audit Trails</h3>
              <p className="text-sm text-muted-foreground">
                Support for automated SAR/STR preparation and multi-jurisdictional reporting (e.g., FATCA, AUSTRAC).
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

