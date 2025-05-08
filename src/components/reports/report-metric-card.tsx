
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react'; // Example icon

interface ReportMetricCardProps {
  title: string;
  description?: string;
  icon?: React.ElementType;
}

export function ReportMetricCard({ title, description, icon: Icon }: ReportMetricCardProps) {
  return (
    <Card className="shadow-lg col-span-1">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">{title}</CardTitle>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-border rounded-lg p-4 text-center">
          {Icon ? <Icon className="h-10 w-10 text-muted-foreground mb-2" /> : <BarChart3 className="h-10 w-10 text-muted-foreground mb-2" />}
          <p className="text-sm text-muted-foreground">Data visualization coming soon.</p>
        </div>
      </CardContent>
    </Card>
  );
}
