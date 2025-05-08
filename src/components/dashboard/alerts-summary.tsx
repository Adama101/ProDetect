import { ShieldAlert, ShieldCheck, ShieldQuestion, AlertTriangle } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

type AlertSeverity = 'Critical' | 'High' | 'Medium' | 'Low';

interface AlertItem {
  id: string;
  description: string;
  date: string;
  severity: AlertSeverity;
  entity: string;
}

const mockAlerts: AlertItem[] = [
  { id: 'ALT001', description: 'Potential watchlist match: John Doe', date: '2024-07-15', severity: 'Critical', entity: 'Client XYZ' },
  { id: 'ALT002', description: 'Unusual transaction activity', date: '2024-07-14', severity: 'High', entity: 'Account #12345' },
  { id: 'ALT003', description: 'Name variation detected: Jane Smith vs. Jayne Smythe', date: '2024-07-13', severity: 'Medium', entity: 'Vendor ABC' },
  { id: 'ALT004', description: 'Address flag', date: '2024-07-12', severity: 'Low', entity: 'Transaction #T67890' },
];

const severityConfig: Record<AlertSeverity, { icon: React.ElementType, colorClass: string, badgeVariant: "destructive" | "default" | "secondary" | "outline" }> = {
  Critical: { icon: ShieldAlert, colorClass: 'text-destructive', badgeVariant: 'destructive' },
  High: { icon: AlertTriangle, colorClass: 'text-warning', badgeVariant: 'default' },
  Medium: { icon: ShieldQuestion, colorClass: 'text-yellow-500', badgeVariant: 'secondary' },
  Low: { icon: ShieldCheck, colorClass: 'text-success', badgeVariant: 'outline' },
};

export function AlertsSummary() {
  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-semibold text-foreground">Recent Critical Alerts</CardTitle>
        <Link href="/alerts-workflows">
          <Button variant="outline" size="sm">View All</Button>
        </Link>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Severity</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Entity</TableHead>
              <TableHead className="text-right">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockAlerts.slice(0, 3).map((alert) => {
              const config = severityConfig[alert.severity];
              const Icon = config.icon;
              return (
                <TableRow key={alert.id} className="hover:bg-muted/50 transition-colors">
                  <TableCell>
                    <Badge variant={config.badgeVariant} className="flex items-center gap-1 w-fit">
                      <Icon className={`h-3.5 w-3.5 ${config.badgeVariant === 'destructive' || config.badgeVariant === 'default' ? '' : config.colorClass }`} />
                      {alert.severity}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{alert.description}</TableCell>
                  <TableCell className="text-muted-foreground">{alert.entity}</TableCell>
                  <TableCell className="text-right text-muted-foreground">{alert.date}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}