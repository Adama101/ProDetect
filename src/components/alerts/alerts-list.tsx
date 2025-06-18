'use client';

import { useState } from 'react';
import { ShieldAlert, ShieldCheck, ShieldQuestion, AlertTriangle, Filter, ChevronDown, Search, Tag, TrendingUp, Circle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from '../ui/separator';
import { CaseInvestigationModal } from '@/components/compliance/case-investigation-modal';

type AlertSeverity = 'Critical' | 'High' | 'Medium' | 'Low';
type AlertStatus = 'Open' | 'In Review' | 'Resolved' | 'Closed'; // Overall status of the alert notification
type CaseStatus = 'New' | 'Pending Review' | 'Investigation' | 'Escalated' | 'SAR Filed' | 'Closed - Valid' | 'Closed - False Positive';
type AlertTag = 'AML' | 'Fraud' | 'Sanctions' | 'Transaction Monitoring' | 'Behavioral Anomaly' | 'KYC';

interface AlertItem {
  id: string;
  description: string;
  date: string;
  severity: AlertSeverity;
  status: AlertStatus;
  entity: string; // e.g. Customer ID, Transaction ID
  assignedTo?: string;
  riskScore?: number; // 0-100
  caseStatus?: CaseStatus;
  tags?: AlertTag[];
  source: string; // e.g., "Real-time Monitoring", "Batch Screening"
}

const mockAlerts: AlertItem[] = [
  { id: 'ALT001', description: 'Potential watchlist match: Johnathan K. Doe', date: '2024-07-15', severity: 'Critical', status: 'Open', entity: 'Client Acc XA1001', assignedTo: 'AML Team Lead', riskScore: 95, caseStatus: 'Pending Review', tags: ['Sanctions', 'KYC'], source: 'Watchlist Screening'},
  { id: 'ALT002', description: 'Unusual transaction pattern: High volume, low value to new beneficiary', date: '2024-07-14', severity: 'High', status: 'In Review', entity: 'Merchant M5050 / TXN77882', assignedTo: 'Fraud Analyst B', riskScore: 82, caseStatus: 'Investigation', tags: ['AML', 'Transaction Monitoring', 'Behavioral Anomaly'], source: 'Real-time Monitoring'},
  { id: 'ALT003', description: 'Name variation: Jane Smith vs. Janne Smyth (DOB Match)', date: '2024-07-13', severity: 'Medium', status: 'Open', entity: 'Beneficiary B007', assignedTo: 'Analyst A', riskScore: 65, caseStatus: 'New', tags: ['KYC'], source: 'Fuzzy Matching Engine'},
  { id: 'ALT004', description: 'Address anomaly flagged during onboarding', date: '2024-07-12', severity: 'Low', status: 'Resolved', entity: 'Customer CUST9923', assignedTo: 'System (Auto-Resolved)', riskScore: 30, caseStatus: 'Closed - False Positive', tags: ['KYC'], source: 'Onboarding Check'},
  { id: 'ALT005', description: 'High-risk country transaction to PEP', date: '2024-07-11', severity: 'High', status: 'Open', entity: 'Payment P00123 ($50,000)', assignedTo: 'Compliance Officer', riskScore: 88, caseStatus: 'Escalated', tags: ['AML', 'Sanctions'], source: 'Transaction Monitoring'},
  { id: 'ALT006', description: 'Login from unrecognized device & location', date: '2024-07-10', severity: 'Medium', status: 'Closed', entity: 'User U7362', assignedTo: 'System (User Verified)', riskScore: 55, caseStatus: 'Closed - Valid', tags: ['Fraud', 'Behavioral Anomaly'], source: 'Security Module'},
  { id: 'ALT007', description: 'Sanctions list screening positive hit: OFAC SDN', date: '2024-07-09', severity: 'Critical', status: 'In Review', entity: 'Company Corp International Ltd.', assignedTo: 'Sanctions Team', riskScore: 100, caseStatus: 'SAR Filed', tags: ['Sanctions'], source: 'Batch Screening'},
  { id: 'ALT008', description: 'Structuring attempt: Multiple cash deposits below threshold', date: '2024-07-08', severity: 'High', status: 'Open', entity: 'Account ACCT0567', assignedTo: 'AML Analyst C', riskScore: 78, caseStatus: 'Investigation', tags: ['AML', 'Transaction Monitoring'], source: 'Rule Engine'},
];

const severityConfig: Record<AlertSeverity, { icon: React.ElementType, colorClass: string, badgeVariant: "destructive" | "warning" | "secondary" | "outline" }> = {
  Critical: { icon: ShieldAlert, colorClass: 'text-destructive', badgeVariant: 'destructive' },
  High: { icon: AlertTriangle, colorClass: 'text-warning', badgeVariant: 'warning' },
  Medium: { icon: ShieldQuestion, colorClass: 'text-yellow-500', badgeVariant: 'secondary' },
  Low: { icon: ShieldCheck, colorClass: 'text-success', badgeVariant: 'outline' },
};

const statusColors: Record<AlertStatus, string> = {
  Open: 'bg-red-500',
  'In Review': 'bg-yellow-500',
  Resolved: 'bg-green-500',
  Closed: 'bg-gray-500',
};

const caseStatusConfig: Record<CaseStatus, { colorClass: string, icon?: React.ElementType }> = {
  New: { colorClass: 'text-blue-500' },
  'Pending Review': { colorClass: 'text-sky-500' },
  Investigation: { colorClass: 'text-indigo-500' },
  Escalated: { colorClass: 'text-purple-500' },
  'SAR Filed': { colorClass: 'text-pink-500' },
  'Closed - Valid': { colorClass: 'text-green-600' },
  'Closed - False Positive': { colorClass: 'text-teal-500' },
};


export function AlertsList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState<AlertSeverity[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<AlertItem | null>(null);
  const [showInvestigationModal, setShowInvestigationModal] = useState(false);

  const toggleSeverityFilter = (severity: AlertSeverity) => {
    setSeverityFilter(prev => 
      prev.includes(severity) ? prev.filter(s => s !== severity) : [...prev, severity]
    );
  };

  const handleInvestigateCase = (alert: AlertItem) => {
    setSelectedAlert(alert);
    setShowInvestigationModal(true);
  };

  const filteredAlerts = mockAlerts.filter(alert => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = alert.description.toLowerCase().includes(searchLower) ||
                          alert.entity.toLowerCase().includes(searchLower) ||
                          alert.id.toLowerCase().includes(searchLower) ||
                          (alert.tags && alert.tags.some(tag => tag.toLowerCase().includes(searchLower))) ||
                          (alert.caseStatus && alert.caseStatus.toLowerCase().includes(searchLower)) ||
                          alert.source.toLowerCase().includes(searchLower);
    const matchesSeverity = severityFilter.length === 0 || severityFilter.includes(alert.severity);
    return matchesSearch && matchesSeverity;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search alerts (ID, entity, tag...)" 
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

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2"> {/* Adjusted grid for potentially wider cards */}
        {filteredAlerts.map((alert) => {
          const severityConf = severityConfig[alert.severity];
          const SeverityIcon = severityConf.icon;
          const caseConf = alert.caseStatus ? caseStatusConfig[alert.caseStatus] : null;

          return (
            <Card key={alert.id} className="shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start gap-2">
                  <Badge variant={severityConf.badgeVariant} className="flex items-center gap-1.5 text-sm py-1 px-2.5 whitespace-nowrap">
                    <SeverityIcon className={`h-4 w-4 ${severityConf.badgeVariant === 'destructive' || severityConf.badgeVariant === 'warning' ? '' : severityConf.colorClass }`} />
                    {alert.severity}
                  </Badge>
                  <div className="flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${statusColors[alert.status]}`} title={`Alert Status: ${alert.status}`}></span>
                    <span className="text-xs text-muted-foreground">{alert.status}</span>
                  </div>
                </div>
                <CardTitle className="text-base font-semibold pt-2 text-foreground">{alert.description}</CardTitle>
                 <CardDescription className="text-xs">Source: {alert.source} &bull; Date: {alert.date}</CardDescription>
              </CardHeader>
              <CardContent className="text-sm space-y-3 flex-grow">
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  <p><strong className="text-muted-foreground block text-xs">Entity:</strong> {alert.entity}</p>
                  <p><strong className="text-muted-foreground block text-xs">Alert ID:</strong> {alert.id}</p>
                  {alert.assignedTo && <p><strong className="text-muted-foreground block text-xs">Assigned to:</strong> {alert.assignedTo}</p>}
                  {alert.caseStatus && caseConf && (
                    <p className="flex items-center">
                      <strong className="text-muted-foreground block text-xs mr-1">Case:</strong> 
                      <Badge variant="outline" className={`px-1.5 py-0.5 text-xs border-none ${caseConf.colorClass}`}>
                        <Circle className={`mr-1 h-2 w-2 fill-current`} />
                        {alert.caseStatus}
                      </Badge>
                    </p>
                  )}
                </div>
                
                {alert.riskScore !== undefined && (
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-xs">
                       <span className="text-muted-foreground">Risk Score:</span>
                       <span className={`font-medium ${alert.riskScore > 80 ? 'text-destructive' : alert.riskScore > 60 ? 'text-warning' : 'text-success'}`}>{alert.riskScore}/100</span>
                    </div>
                    <Progress value={alert.riskScore} className="h-1.5" 
                      indicatorClassName={alert.riskScore > 80 ? 'bg-destructive' : alert.riskScore > 60 ? 'bg-warning' : 'bg-success'} 
                    />
                  </div>
                )}

                {alert.tags && alert.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 items-center pt-1">
                    <Tag className="h-3.5 w-3.5 text-muted-foreground" />
                    {alert.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="font-normal px-1.5 py-0.5 text-xs">{tag}</Badge>
                    ))}
                  </div>
                )}
              </CardContent>
              <Separator className="my-3" />
              <div className="p-4 pt-0">
                 <Button 
                   variant="outline" 
                   size="sm" 
                   className="w-full bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20 hover:from-primary/20 hover:to-accent/20 transition-all duration-300"
                   onClick={() => handleInvestigateCase(alert)}
                 >
                   Investigate Case
                 </Button>
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

      <CaseInvestigationModal 
        open={showInvestigationModal} 
        onOpenChange={setShowInvestigationModal}
        alert={selectedAlert}
      />
    </div>
  );
}

// Helper for Progress indicator color
declare module "react" {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    indicatorClassName?: string;
  }
}