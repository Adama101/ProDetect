import type { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface RiskScoreCardProps {
  title: string;
  score: string | number;
  trend?: 'up' | 'down' | 'neutral';
  trendText?: string;
  icon: LucideIcon;
  iconColor?: string;
}

export function RiskScoreCard({ title, score, trend, trendText, icon: Icon, iconColor }: RiskScoreCardProps) {
  const TrendIcon = trend === 'up' ? ArrowUpRight : trend === 'down' ? ArrowDownRight : null;
  const trendColorClass = trend === 'up' ? 'text-destructive' : trend === 'down' ? 'text-success' : 'text-muted-foreground';

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className={cn("h-5 w-5", iconColor || 'text-muted-foreground')} />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-foreground">{score}</div>
        {trendText && (
          <p className={cn("text-xs mt-1 flex items-center", trendColorClass)}>
            {TrendIcon && <TrendIcon className="h-4 w-4 mr-1" />}
            {trendText}
          </p>
        )}
      </CardContent>
    </Card>
  );
}