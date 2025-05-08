import { AlertsList } from '@/components/alerts/alerts-list';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SlidersHorizontal } from 'lucide-react';

export default function AlertsWorkflowsPage() {
  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Alerts & Workflows</h1>
          <p className="text-muted-foreground">
            Monitor alerts and manage automated compliance workflows.
          </p>
        </div>
        <Button variant="outline">
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          Configure Workflows
        </Button>
      </header>

      <section>
        <AlertsList />
      </section>

      <section>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-foreground">Workflow Management</CardTitle>
            <CardDescription>
              Automate task assignments and processes based on risk criteria. (Feature coming soon)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-border rounded-lg p-8 text-center">
              <SlidersHorizontal className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground">Workflow configuration will be available here.</h3>
              <p className="text-sm text-muted-foreground">
                Define standard operating procedures and automated actions for different alert types and risk levels.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}