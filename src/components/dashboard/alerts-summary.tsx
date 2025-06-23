import { ShieldAlert, ShieldCheck, Landmark, DollarSign, AlertTriangle } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

type AlertSeverity = 'Critical' | 'High' | 'Medium' | 'Low';
type AlertSource = 'AML' | 'Fraud' | 'Sanctions' | 'Behavioral';

interface AlertItem {
  id: string;
  description: string;
  date: string;
  severity: AlertSeverity;
  entity: string;
  source: AlertSource;
  riskScore?: number;
}

const mockAlerts: AlertItem[] = [
  { id: 'ALT001', description: 'High-risk transaction flagged: Structuring attempt', date: '2024-07-15', severity: 'Critical', entity: 'Account #A5502', source: 'AML', riskScore: 92 },
  { id: 'ALT002', description: 'Potential OFAC Sanctions Match: New Vendor', date: '2024-07-14', severity: 'Critical', entity: 'Vendor Corp Ltd.', source: 'Sanctions', riskScore: 98 },
  { id: 'ALT003', description: 'Anomalous login pattern detected', date: '2024-07-13', severity: 'High', entity: 'User ID: cust123', source: 'Fraud', riskScore: 78 },
  { id: 'ALT004', description: 'Unusual wire transfer activity to high-risk jurisdiction', date: '2024-07-12', severity: 'High', entity: 'Transaction #T67890', source: 'AML', riskScore: 85 },
];

const severityConfig: Record<AlertSeverity, { icon: React.ElementType, colorClass: string, badgeVariant: "destructive" | "warning" | "secondary" | "outline" }> = {
  Critical: { icon: ShieldAlert, colorClass: 'text-destructive', badgeVariant: 'destructive' },
  High: { icon: AlertTriangle, colorClass: 'text-warning', badgeVariant: 'warning' },
  Medium: { icon: Landmark, colorClass: 'text-yellow-500', badgeVariant: 'secondary' }, // Example, adjust as needed
  Low: { icon: ShieldCheck, colorClass: 'text-success', badgeVariant: 'outline' },
};

const sourceIcons: Record<AlertSource, React.ElementType> = {
  AML: ShieldCheck,
  Fraud: DollarSign,
  Sanctions: Landmark,
  Behavioral: AlertTriangle,
};


export function AlertsSummary() {
  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div>
          <CardTitle className="text-xl font-semibold text-foreground">Key Compliance Activity</CardTitle>
        </div>
        <Link href="/alerts-workflows">
          <Button variant="outline" size="sm"
            className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20 hover:from-primary/20 hover:to-accent/20 transition-all duration-300"
          >
            View All Cases</Button>
        </Link>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Severity</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Entity</TableHead>
              <TableHead className="text-right">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockAlerts.map((alert) => {
              const config = severityConfig[alert.severity];
              const SeverityIcon = config.icon;
              const SourceIcon = sourceIcons[alert.source];
              return (
                <TableRow key={alert.id} className="hover:bg-muted/50 transition-colors">
                  <TableCell>
                    <Badge variant={config.badgeVariant} className="flex items-center gap-1 w-fit">
                      <SeverityIcon className={`h-3.5 w-3.5 ${config.badgeVariant === 'destructive' || config.badgeVariant === 'warning' ? '' : config.colorClass}`} />
                      {alert.severity}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{alert.description}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="flex items-center gap-1 w-fit font-normal">
                      <SourceIcon className="h-3.5 w-3.5 text-muted-foreground" />
                      {alert.source}
                    </Badge>
                  </TableCell>
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
