'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, Eye, Filter, Search, Calendar, Clock, FileText, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Report {
  id: string;
  name: string;
  type: string;
  date: string;
  status: 'Generated' | 'Scheduled' | 'Generating' | 'Failed' | 'Submitted' | 'Accepted' | 'Rejected';
  downloadUrl?: string;
  viewUrl?: string;
  submissionDate?: string;
  referenceNumber?: string;
  submittedBy?: string;
  regulatoryBody?: string;
  responseTime?: string;
}

const mockReports: Report[] = [
  { 
    id: 'REP001', 
    name: 'Suspicious Transaction Report - May 2023', 
    type: 'STR', 
    date: '2023-05-31', 
    status: 'Accepted', 
    downloadUrl: '#', 
    viewUrl: '#',
    submissionDate: '2023-06-01',
    referenceNumber: 'NFIU-STR-2023-001567',
    submittedBy: 'Sarah Chen',
    regulatoryBody: 'NFIU',
    responseTime: '2 hours'
  },
  { 
    id: 'REP002', 
    name: 'Suspicious Activity Report - Q2 2023', 
    type: 'SAR', 
    date: '2023-06-30', 
    status: 'Submitted',
    viewUrl: '#',
    submissionDate: '2023-07-01',
    referenceNumber: 'CBN-SAR-2023-002341',
    submittedBy: 'Michael Rodriguez',
    regulatoryBody: 'CBN',
    responseTime: 'Pending'
  },
  { 
    id: 'REP003', 
    name: 'Currency Transaction Report - Week 25', 
    type: 'CTR', 
    date: '2023-06-23', 
    status: 'Generated', 
    downloadUrl: '#', 
    viewUrl: '#' 
  },
  { 
    id: 'REP004', 
    name: 'System Audit Log - June 2023', 
    type: 'Audit', 
    date: '2023-07-01', 
    status: 'Generating' 
  },
  { 
    id: 'REP005', 
    name: 'PEP Screening Results - July 2023', 
    type: 'Screening', 
    date: '2023-07-10', 
    status: 'Failed' 
  },
  { 
    id: 'REP006', 
    name: 'Monthly AML Summary - June 2023', 
    type: 'AML', 
    date: '2023-07-05', 
    status: 'Generated', 
    downloadUrl: '#', 
    viewUrl: '#' 
  },
  { 
    id: 'REP007', 
    name: 'Suspicious Transaction Report - June 2023', 
    type: 'STR', 
    date: '2023-07-02', 
    status: 'Rejected', 
    downloadUrl: '#', 
    viewUrl: '#',
    submissionDate: '2023-07-03',
    referenceNumber: 'NFIU-STR-2023-003892',
    submittedBy: 'Emma Thompson',
    regulatoryBody: 'NFIU',
    responseTime: '4 hours'
  },
];

const statusBadgeVariant = {
  Generated: 'default', // Uses primary color
  Scheduled: 'secondary',
  Generating: 'outline', // Or warning if you prefer more emphasis
  Failed: 'destructive',
  Submitted: 'warning',
  Accepted: 'success',
  Rejected: 'destructive',
} as const;

const statusIcon = {
  Generated: FileText,
  Scheduled: Calendar,
  Generating: Clock,
  Failed: XCircle,
  Submitted: AlertTriangle,
  Accepted: CheckCircle,
  Rejected: XCircle,
};

export function RecentReportsTable() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [viewReportOpen, setViewReportOpen] = useState(false);

  const filteredReports = mockReports.filter(report => {
    const matchesSearch = report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          report.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          report.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    const matchesType = typeFilter === 'all' || report.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleViewReport = (report: Report) => {
    setSelectedReport(report);
    setViewReportOpen(true);
  };

  return (
    <>
      <Card className="shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div>
            <CardTitle className="text-xl font-semibold">Recent Reports</CardTitle>
            <CardDescription>View and manage all generated and scheduled compliance reports.</CardDescription>
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search reports..." 
                className="pl-10 w-[200px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Generated">Generated</SelectItem>
                <SelectItem value="Scheduled">Scheduled</SelectItem>
                <SelectItem value="Generating">Generating</SelectItem>
                <SelectItem value="Failed">Failed</SelectItem>
                <SelectItem value="Submitted">Submitted</SelectItem>
                <SelectItem value="Accepted">Accepted</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="STR">STR</SelectItem>
                <SelectItem value="SAR">SAR</SelectItem>
                <SelectItem value="CTR">CTR</SelectItem>
                <SelectItem value="AML">AML</SelectItem>
                <SelectItem value="Audit">Audit</SelectItem>
                <SelectItem value="Screening">Screening</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Report ID</TableHead>
                <TableHead>Report Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReports.map((report) => {
                const StatusIcon = statusIcon[report.status];
                return (
                  <TableRow key={report.id} className="hover:bg-muted/50 transition-colors">
                    <TableCell className="font-medium">{report.id}</TableCell>
                    <TableCell>{report.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{report.type}</Badge>
                    </TableCell>
                    <TableCell>{report.date}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={statusBadgeVariant[report.status] || 'default'}
                        className="flex items-center gap-1 w-fit"
                      >
                        {StatusIcon && <StatusIcon className="h-3.5 w-3.5 mr-1" />}
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
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleViewReport(report)}
                        disabled={report.status === 'Generating' || report.status === 'Failed'}
                      >
                        <Eye className="mr-1 h-3.5 w-3.5" />
                        View
                      </Button>
                      {(report.status === 'Generated') && (
                        <Button variant="default" size="sm">
                          Submit
                        </Button>
                      )}
                      {(report.status === 'Generating' || report.status === 'Failed') && !report.viewUrl && !report.downloadUrl && (
                        <span className="text-xs text-muted-foreground italic">No actions available</span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
              {filteredReports.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-10">
                    No reports found matching your filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Report Viewer Dialog */}
      <Dialog open={viewReportOpen} onOpenChange={setViewReportOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedReport && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  {selectedReport.name}
                </DialogTitle>
                <DialogDescription>
                  {selectedReport.id} • {selectedReport.type} • Generated on {selectedReport.date}
                </DialogDescription>
              </DialogHeader>

              <Tabs defaultValue="preview">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="preview">Report Preview</TabsTrigger>
                  <TabsTrigger value="submission">Submission Details</TabsTrigger>
                  <TabsTrigger value="history">Audit History</TabsTrigger>
                </TabsList>

                <TabsContent value="preview" className="space-y-4 mt-4">
                  {selectedReport.type === 'STR' && (
                    <div className="border rounded-md p-6 space-y-6">
                      <div className="text-center border-b pb-4">
                        <h3 className="text-xl font-bold">NIGERIA FINANCIAL INTELLIGENCE UNIT</h3>
                        <p className="text-lg font-semibold mt-2">SUSPICIOUS TRANSACTION REPORT (STR)</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Report Reference:</p>
                          <p className="font-medium">{selectedReport.referenceNumber || 'PD-STR-2023-001567'}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Date of Report:</p>
                          <p className="font-medium">{selectedReport.date}</p>
                        </div>
                      </div>

                      <div className="border-t pt-4">
                        <h4 className="font-semibold mb-2">PART A: REPORTING ENTITY INFORMATION</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Reporting Entity:</p>
                            <p className="font-medium">ProDetect Financial Services</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">License Number:</p>
                            <p className="font-medium">FIN/REG/2023/12345</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Contact Person:</p>
                            <p className="font-medium">Sarah Chen</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Contact Email:</p>
                            <p className="font-medium">compliance@prodetect.com</p>
                          </div>
                        </div>
                      </div>

                      <div className="border-t pt-4">
                        <h4 className="font-semibold mb-2">PART B: SUBJECT INFORMATION</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Subject Name:</p>
                            <p className="font-medium">Johnathan K. Doe</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Account Number:</p>
                            <p className="font-medium">ACCT0567</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Date of Birth:</p>
                            <p className="font-medium">1985-03-15</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Nationality:</p>
                            <p className="font-medium">Nigerian</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">ID Type/Number:</p>
                            <p className="font-medium">National ID / 12345678901</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Address:</p>
                            <p className="font-medium">789 Victoria Island, Lagos, Nigeria</p>
                          </div>
                        </div>
                      </div>

                      <div className="border-t pt-4">
                        <h4 className="font-semibold mb-2">PART C: SUSPICIOUS ACTIVITY INFORMATION</h4>
                        <div className="space-y-4">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Suspicious Activity Type:</p>
                            <p className="font-medium">Structuring / Multiple cash deposits below threshold</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Date Range of Suspicious Activity:</p>
                            <p className="font-medium">2023-05-01 to 2023-05-31</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Total Amount Involved:</p>
                            <p className="font-medium">NGN 9,500,000.00</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Description of Suspicious Activity:</p>
                            <p className="text-sm mt-1">
                              The subject made multiple cash deposits just below the reporting threshold of NGN 1,000,000 
                              over a period of 10 days. The deposits were made at different branches and through different 
                              channels (ATM, branch, mobile). The pattern suggests deliberate structuring to avoid 
                              transaction reporting requirements. The customer's stated occupation and income do not 
                              justify the volume and frequency of these transactions.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="border-t pt-4">
                        <h4 className="font-semibold mb-2">PART D: TRANSACTION DETAILS</h4>
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Amount (NGN)</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Channel</TableHead>
                                <TableHead>Location</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              <TableRow>
                                <TableCell>2023-05-02</TableCell>
                                <TableCell>950,000.00</TableCell>
                                <TableCell>Cash Deposit</TableCell>
                                <TableCell>Branch</TableCell>
                                <TableCell>Lagos - VI</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>2023-05-04</TableCell>
                                <TableCell>980,000.00</TableCell>
                                <TableCell>Cash Deposit</TableCell>
                                <TableCell>ATM</TableCell>
                                <TableCell>Lagos - Ikeja</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>2023-05-07</TableCell>
                                <TableCell>990,000.00</TableCell>
                                <TableCell>Cash Deposit</TableCell>
                                <TableCell>Branch</TableCell>
                                <TableCell>Lagos - Lekki</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>2023-05-09</TableCell>
                                <TableCell>975,000.00</TableCell>
                                <TableCell>Cash Deposit</TableCell>
                                <TableCell>Mobile</TableCell>
                                <TableCell>Lagos</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>2023-05-12</TableCell>
                                <TableCell>985,000.00</TableCell>
                                <TableCell>Cash Deposit</TableCell>
                                <TableCell>Branch</TableCell>
                                <TableCell>Lagos - VI</TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </div>
                      </div>

                      <div className="border-t pt-4">
                        <h4 className="font-semibold mb-2">PART E: REASON FOR SUSPICION</h4>
                        <div className="space-y-2">
                          <p className="text-sm">
                            1. Pattern of structuring: Multiple cash deposits just below the reporting threshold.
                          </p>
                          <p className="text-sm">
                            2. Use of multiple channels and locations: Appears designed to avoid detection.
                          </p>
                          <p className="text-sm">
                            3. Inconsistency with customer profile: Transaction volume inconsistent with stated income.
                          </p>
                          <p className="text-sm">
                            4. Unusual explanation: Customer provided vague explanations when questioned about source of funds.
                          </p>
                          <p className="text-sm">
                            5. Behavioral indicators: Customer appeared nervous during in-branch transactions and avoided questions.
                          </p>
                        </div>
                      </div>

                      <div className="border-t pt-4">
                        <h4 className="font-semibold mb-2">PART F: SUPPORTING DOCUMENTATION</h4>
                        <div className="space-y-2">
                          <p className="text-sm">The following supporting documents are attached to this report:</p>
                          <ul className="list-disc list-inside text-sm">
                            <li>Account statements for the period 2023-05-01 to 2023-05-31</li>
                            <li>Customer KYC documentation</li>
                            <li>Transaction receipts for the suspicious transactions</li>
                            <li>Notes from branch staff regarding customer behavior</li>
                            <li>Risk assessment report</li>
                          </ul>
                        </div>
                      </div>

                      <div className="border-t pt-4">
                        <h4 className="font-semibold mb-2">PART G: DECLARATION</h4>
                        <div className="space-y-2">
                          <p className="text-sm">
                            I, Sarah Chen, Compliance Officer at ProDetect Financial Services, declare that the information 
                            contained in this report is correct to the best of my knowledge and belief. I understand that 
                            it is an offense to knowingly provide false or misleading information in this report.
                          </p>
                          <div className="grid grid-cols-2 gap-4 mt-4">
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Name:</p>
                              <p className="font-medium">Sarah Chen</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Position:</p>
                              <p className="font-medium">Compliance Officer</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Date:</p>
                              <p className="font-medium">{selectedReport.date}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Signature:</p>
                              <p className="font-medium italic">Sarah Chen</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedReport.type !== 'STR' && (
                    <div className="border rounded-md p-6 space-y-6">
                      <div className="text-center border-b pb-4">
                        <h3 className="text-xl font-bold">
                          {selectedReport.type === 'SAR' && 'SUSPICIOUS ACTIVITY REPORT (SAR)'}
                          {selectedReport.type === 'CTR' && 'CURRENCY TRANSACTION REPORT (CTR)'}
                          {selectedReport.type === 'AML' && 'MONTHLY AML SUMMARY REPORT'}
                          {selectedReport.type === 'Audit' && 'SYSTEM AUDIT LOG REPORT'}
                          {selectedReport.type === 'Screening' && 'PEP SCREENING RESULTS REPORT'}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-2">
                          Report ID: {selectedReport.id} • Generated on {selectedReport.date}
                        </p>
                      </div>

                      <div className="flex items-center justify-center h-64 border-2 border-dashed border-border rounded-lg">
                        <div className="text-center">
                          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <p className="text-muted-foreground">Report preview available</p>
                          <p className="text-sm text-muted-foreground mt-2">Click the button below to view the full report</p>
                          <Button className="mt-4">
                            <Eye className="mr-2 h-4 w-4" />
                            View Full Report
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="submission" className="space-y-4 mt-4">
                  {(selectedReport.status === 'Submitted' || selectedReport.status === 'Accepted' || selectedReport.status === 'Rejected') ? (
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-6">
                        <Card>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-lg">Submission Details</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm text-muted-foreground">Submitted Date</p>
                                <p className="font-medium">{selectedReport.submissionDate}</p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Submitted By</p>
                                <p className="font-medium">{selectedReport.submittedBy}</p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Regulatory Body</p>
                                <p className="font-medium">{selectedReport.regulatoryBody}</p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Reference Number</p>
                                <p className="font-medium">{selectedReport.referenceNumber}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-lg">Response Details</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div>
                              <p className="text-sm text-muted-foreground">Status</p>
                              <Badge 
                                variant={
                                  selectedReport.status === 'Accepted' ? 'success' :
                                  selectedReport.status === 'Rejected' ? 'destructive' :
                                  'warning'
                                }
                                className="mt-1"
                              >
                                {selectedReport.status}
                              </Badge>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Response Time</p>
                              <p className="font-medium">{selectedReport.responseTime || 'Pending'}</p>
                            </div>
                            {selectedReport.status === 'Rejected' && (
                              <div>
                                <p className="text-sm text-muted-foreground">Rejection Reason</p>
                                <p className="text-sm mt-1 text-destructive">
                                  Incomplete information provided in Part C. Please provide additional details about the suspicious activity.
                                </p>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </div>

                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg">Submission Timeline</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="flex items-start gap-3">
                              <div className="flex flex-col items-center">
                                <div className="w-3 h-3 rounded-full bg-primary" />
                                <div className="w-px h-12 bg-border mt-1" />
                              </div>
                              <div>
                                <p className="font-medium">Report Generated</p>
                                <p className="text-sm text-muted-foreground">{selectedReport.date}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-start gap-3">
                              <div className="flex flex-col items-center">
                                <div className="w-3 h-3 rounded-full bg-primary" />
                                <div className="w-px h-12 bg-border mt-1" />
                              </div>
                              <div>
                                <p className="font-medium">Report Submitted</p>
                                <p className="text-sm text-muted-foreground">{selectedReport.submissionDate}</p>
                                <p className="text-sm">Submitted to {selectedReport.regulatoryBody} by {selectedReport.submittedBy}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-start gap-3">
                              <div className="flex flex-col items-center">
                                <div className={`w-3 h-3 rounded-full ${
                                  selectedReport.status === 'Accepted' ? 'bg-success' :
                                  selectedReport.status === 'Rejected' ? 'bg-destructive' :
                                  'bg-warning'
                                }`} />
                              </div>
                              <div>
                                <p className="font-medium">Response Received</p>
                                <p className="text-sm text-muted-foreground">
                                  {selectedReport.status === 'Submitted' ? 'Pending' : selectedReport.submissionDate}
                                </p>
                                <p className={`text-sm ${
                                  selectedReport.status === 'Accepted' ? 'text-success' :
                                  selectedReport.status === 'Rejected' ? 'text-destructive' :
                                  ''
                                }`}>
                                  {selectedReport.status === 'Accepted' && 'Report accepted by regulatory body'}
                                  {selectedReport.status === 'Rejected' && 'Report rejected - requires revision'}
                                  {selectedReport.status === 'Submitted' && 'Awaiting response from regulatory body'}
                                </p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-64 border-2 border-dashed border-border rounded-lg">
                      <div className="text-center">
                        <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">This report has not been submitted yet</p>
                        <p className="text-sm text-muted-foreground mt-2">Submit the report to view submission details</p>
                        {selectedReport.status === 'Generated' && (
                          <Button className="mt-4">
                            Submit Report
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="history" className="space-y-4 mt-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Report Audit History</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <div className="flex flex-col items-center">
                            <div className="w-3 h-3 rounded-full bg-primary" />
                            <div className="w-px h-12 bg-border mt-1" />
                          </div>
                          <div>
                            <p className="font-medium">Report Created</p>
                            <p className="text-sm text-muted-foreground">{selectedReport.date} 09:15:22</p>
                            <p className="text-sm">Created by Sarah Chen</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <div className="flex flex-col items-center">
                            <div className="w-3 h-3 rounded-full bg-primary" />
                            <div className="w-px h-12 bg-border mt-1" />
                          </div>
                          <div>
                            <p className="font-medium">Report Generated</p>
                            <p className="text-sm text-muted-foreground">{selectedReport.date} 10:30:45</p>
                            <p className="text-sm">System generated report based on selected parameters</p>
                          </div>
                        </div>
                        
                        {(selectedReport.status !== 'Generated' && selectedReport.status !== 'Generating' && selectedReport.status !== 'Failed') && (
                          <div className="flex items-start gap-3">
                            <div className="flex flex-col items-center">
                              <div className="w-3 h-3 rounded-full bg-primary" />
                              <div className="w-px h-12 bg-border mt-1" />
                            </div>
                            <div>
                              <p className="font-medium">Report Reviewed</p>
                              <p className="text-sm text-muted-foreground">{selectedReport.date} 14:22:10</p>
                              <p className="text-sm">Reviewed by Michael Rodriguez</p>
                            </div>
                          </div>
                        )}
                        
                        {(selectedReport.status === 'Submitted' || selectedReport.status === 'Accepted' || selectedReport.status === 'Rejected') && (
                          <div className="flex items-start gap-3">
                            <div className="flex flex-col items-center">
                              <div className="w-3 h-3 rounded-full bg-primary" />
                              <div className="w-px h-12 bg-border mt-1" />
                            </div>
                            <div>
                              <p className="font-medium">Report Submitted</p>
                              <p className="text-sm text-muted-foreground">{selectedReport.submissionDate} 09:45:33</p>
                              <p className="text-sm">Submitted to {selectedReport.regulatoryBody} by {selectedReport.submittedBy}</p>
                            </div>
                          </div>
                        )}
                        
                        {(selectedReport.status === 'Accepted' || selectedReport.status === 'Rejected') && (
                          <div className="flex items-start gap-3">
                            <div className="flex flex-col items-center">
                              <div className={`w-3 h-3 rounded-full ${
                                selectedReport.status === 'Accepted' ? 'bg-success' : 'bg-destructive'
                              }`} />
                            </div>
                            <div>
                              <p className="font-medium">Response Received</p>
                              <p className="text-sm text-muted-foreground">{selectedReport.submissionDate} 11:30:15</p>
                              <p className={`text-sm ${
                                selectedReport.status === 'Accepted' ? 'text-success' : 'text-destructive'
                              }`}>
                                {selectedReport.status === 'Accepted' ? 'Report accepted by regulatory body' : 'Report rejected - requires revision'}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              <div className="flex justify-end gap-2 mt-6">
                {selectedReport.downloadUrl && (
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Download Report
                  </Button>
                )}
                {selectedReport.status === 'Generated' && (
                  <Button>
                    Submit to Regulatory Body
                  </Button>
                )}
                {selectedReport.status === 'Rejected' && (
                  <Button>
                    Revise and Resubmit
                  </Button>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}