
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, Eye } from 'lucide-react';
import Link from 'next/link';

interface Report {
  id: string;
  name: string;
  type: string;
  date: string;
  status: 'Generated' | 'Scheduled' | 'Generating' | 'Failed';
  downloadUrl?: string;
  viewUrl?: string;
}

const mockReports: Report[] = [
  { id: 'REP001', name: 'Monthly AML Summary - May 2023', type: 'AML', date: '2023-05-31', status: 'Generated', downloadUrl: '#', viewUrl: '#' },
  { id: 'REP002', name: 'Quarterly Fraud Analysis - Q2 2023', type: 'Fraud', date: '2023-06-30', status: 'Scheduled', viewUrl: '#' },
  { id: 'REP003', name: 'SAR Batch Submission - Week 25', type: 'Regulatory', date: '2023-06-23', status: 'Generated', downloadUrl: '#', viewUrl: '#' },
  { id: 'REP004', name: 'System Audit Log - June 2023', type: 'Audit', date: '2023-07-01', status: 'Generating' },
  { id: 'REP005', name: 'PEP Screening Results - July 2023', type: 'Screening', date: '2023-07-10', status: 'Failed' },
];

const statusBadgeVariant = {
  Generated: 'default', // Uses primary color
  Scheduled: 'secondary',
  Generating: 'outline', // Or warning if you prefer more emphasis
  Failed: 'destructive',
} as const;


export function RecentReportsTable() {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Recent Reports</CardTitle>
        <CardDescription>View and manage your generated and scheduled compliance reports.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Report Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockReports.map((report) => (
              <TableRow key={report.id}>
                <TableCell className="font-medium">{report.name}</TableCell>
                <TableCell>{report.type}</TableCell>
                <TableCell>{report.date}</TableCell>
                <TableCell>
                  <Badge variant={statusBadgeVariant[report.status] || 'default'}>
                    {report.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  {report.downloadUrl && (
                    <Button variant="outline" size="sm" asChild>
                      <Link href={report.downloadUrl}>
                        <Download className="mr-1 h-3.5 w-3.5" />
                        Download
                      </Link>
                    </Button>
                  )}
                  {report.viewUrl && (
                     <Button variant="outline" size="sm" asChild>
                      <Link href={report.viewUrl}>
                        <Eye className="mr-1 h-3.5 w-3.5" />
                        View
                      </Link>
                    </Button>
                  )}
                  {(report.status === 'Generating' || report.status === 'Failed') && !report.viewUrl && !report.downloadUrl && (
                     <span className="text-xs text-muted-foreground italic">No actions available</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
             {mockReports.length === 0 && (
                <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-10">
                        No recent reports found.
                    </TableCell>
                </TableRow>
              )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
