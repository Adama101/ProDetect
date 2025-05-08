'use client';

import { useState } from 'react';
import { ShieldAlert, ShieldCheck, ShieldQuestion, AlertTriangle, Filter, ChevronDown, Search } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type AlertSeverity = 'Critical' | 'High' | 'Medium' | 'Low';
type AlertStatus = 'Open' | 'In Review' | 'Resolved' | 'Closed';

interface AlertItem {
  id: string;
  description: string;
  date: string;
  severity: AlertSeverity;
  status: AlertStatus;
  entity: string;
  assignedTo?: string;
}

const mockAlerts: AlertItem[] = [
  { id: 'ALT001', description: 'Potential watchlist match: Johnathan Doe', date: '2024-07-15', severity: 'Critical', status: 'Open', entity: 'Client Account XA1001', assignedTo: 'Analyst A' },
  { id: 'ALT002', description: 'Unusual transaction volume detected', date: '2024-07-14', severity: 'High', status: 'In Review', entity: 'Merchant ID M5050', assignedTo: 'Analyst B' },
  { id: 'ALT003', description: 'Name variation: Jane Smith vs. Janne Smyth', date: '2024-07-13', severity: 'Medium', status: 'Open', entity: 'Beneficiary B007', assignedTo: 'Analyst A' },
  { id: 'ALT004', description: 'Address anomaly flagged', date: '2024-07-12', severity: 'Low', status: 'Resolved', entity: 'Customer CUST9923', assignedTo: 'System' },
  { id: 'ALT005', description: 'High-risk country transaction', date: '2024-07-11', severity: 'High', status: 'Open', entity: 'Payment P00123', assignedTo: 'Analyst C' },
  { id: 'ALT006', description: 'Login from unrecognized device', date: '2024-07-10', severity: 'Medium', status: 'Closed', entity: 'User U7362', assignedTo: 'System' },
  { id: 'ALT007', description: 'Sanctions list screening hit', date: '2024-07-09', severity: 'Critical', status: 'In Review', entity: 'Company Corp Inc.', assignedTo: 'Analyst B' },
  { id: 'ALT008', description: 'Minor data inconsistency', date: '2024-07-08', severity: 'Low', status: 'Resolved', entity: 'Profile P1029', assignedTo: 'System' },
];

const severityConfig: Record<AlertSeverity, { icon: React.ElementType, colorClass: string, badgeVariant: "destructive" | "default" | "secondary" | "outline" }> = {
  Critical: { icon: ShieldAlert, colorClass: 'text-destructive', badgeVariant: 'destructive' },
  High: { icon: AlertTriangle, colorClass: 'text-warning', badgeVariant: 'default' },
  Medium: { icon: ShieldQuestion, colorClass: 'text-yellow-500', badgeVariant: 'secondary' },
  Low: { icon: ShieldCheck, colorClass: 'text-success', badgeVariant: 'outline' },
};

const statusColors: Record<AlertStatus, string> = {
  Open: 'bg-red-500',
  'In Review': 'bg-yellow-500',
  Resolved: 'bg-green-500',
  Closed: 'bg-gray-500',
};

export function AlertsList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState<AlertSeverity[]>([]);

  const toggleSeverityFilter = (severity: AlertSeverity) => {
    setSeverityFilter(prev => 
      prev.includes(severity) ? prev.filter(s => s !== severity) : [...prev, severity]
    );
  };

  const filteredAlerts = mockAlerts.filter(alert => {
    const matchesSearch = alert.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          alert.entity.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          alert.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = severityFilter.length === 0 || severityFilter.includes(alert.severity);
    return matchesSearch && matchesSeverity;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search alerts..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filter Severity
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Filter by Severity</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {(['Critical', 'High', 'Medium', 'Low'] as AlertSeverity[]).map(s => (
              <DropdownMenuCheckboxItem
                key={s}
                checked={severityFilter.includes(s)}
                onCheckedChange={() => toggleSeverityFilter(s)}
              >
                {s}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredAlerts.map((alert) => {
          const config = severityConfig[alert.severity];
          const Icon = config.icon;
          return (
            <Card key={alert.id} className="shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <Badge variant={config.badgeVariant} className="flex items-center gap-1.5 text-sm py-1 px-2.5">
                    <Icon className={`h-4 w-4 ${config.badgeVariant === 'destructive' || config.badgeVariant === 'default' ? '' : config.colorClass }`} />
                    {alert.severity}
                  </Badge>
                  <div className="flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${statusColors[alert.status]}`} title={alert.status}></span>
                    <span className="text-xs text-muted-foreground">{alert.status}</span>
                  </div>
                </div>
                <CardTitle className="text-lg font-semibold pt-2 text-foreground">{alert.description}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2 flex-grow">
                <p><strong className="text-muted-foreground">Entity:</strong> {alert.entity}</p>
                <p><strong className="text-muted-foreground">Alert ID:</strong> {alert.id}</p>
                {alert.assignedTo && <p><strong className="text-muted-foreground">Assigned to:</strong> {alert.assignedTo}</p>}
                <p className="text-xs text-muted-foreground pt-1">Date: {alert.date}</p>
              </CardContent>
              <div className="p-4 pt-0 border-t mt-4">
                 <Button variant="outline" size="sm" className="w-full mt-4">View Details</Button>
              </div>
            </Card>
          );
        })}
      </div>
      {filteredAlerts.length === 0 && (
        <div className="text-center py-10 text-muted-foreground">
          No alerts match your current filters.
        </div>
      )}
    </div>
  );
}