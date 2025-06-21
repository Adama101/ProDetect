import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingUp, TrendingDown, CheckCircle, XCircle, Clock } from 'lucide-react'; 
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface ReportMetricCardProps {
  title: string;
  description?: string;
  icon?: React.ElementType;
  data?: {
    value: string | number;
    change?: {
      value: string | number;
      trend: 'up' | 'down' | 'neutral';
    };
    progress?: number;
    items?: Array<{
      label: string;
      value: string | number;
      status?: 'success' | 'warning' | 'error' | 'neutral';
    }>;
  };
}

export function ReportMetricCard({ title, description, icon: Icon, data }: ReportMetricCardProps) {
  // If no data is provided, show placeholder
  if (!data) {
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

  // Determine trend icon
  const TrendIcon = data.change?.trend === 'up' ? TrendingUp : 
                    data.change?.trend === 'down' ? TrendingDown : null;
  
  // Determine trend color
  const trendColorClass = data.change?.trend === 'up' ? 'text-success' : 
                          data.change?.trend === 'down' ? 'text-destructive' : 
                          'text-muted-foreground';

  return (
    <Card className="shadow-lg col-span-1">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">{title}</CardTitle>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {Icon && <Icon className="h-5 w-5 text-primary" />}
            <span className="text-2xl font-bold">{data.value}</span>
          </div>
          {data.change && (
            <div className={`flex items-center gap-1 ${trendColorClass}`}>
              {TrendIcon && <TrendIcon className="h-4 w-4" />}
              <span className="text-sm">{data.change.value}</span>
            </div>
          )}
        </div>

        {data.progress !== undefined && (
          <div className="space-y-1">
            <Progress value={data.progress} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>
        )}

        {data.items && (
          <div className="space-y-2 mt-2">
            {data.items.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm">{item.label}</span>
                <div className="flex items-center gap-2">
                  {item.status && (
                    <>
                      {item.status === 'success' && <CheckCircle className="h-3 w-3 text-success" />}
                      {item.status === 'warning' && <Clock className="h-3 w-3 text-warning" />}
                      {item.status === 'error' && <XCircle className="h-3 w-3 text-destructive" />}
                    </>
                  )}
                  <Badge variant={
                    item.status === 'success' ? 'outline' :
                    item.status === 'warning' ? 'secondary' :
                    item.status === 'error' ? 'destructive' :
                    'outline'
                  }>
                    {item.value}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}