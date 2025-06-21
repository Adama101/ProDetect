'use client';

import { useState } from 'react';
import { GenerateReportCard } from '@/components/reports/generate-report-card';
import { ReportMetricCard } from '@/components/reports/report-metric-card';
import { RecentReportsTable } from '@/components/reports/recent-reports-table';
import { TrendingUp, ShieldCheck, FileText, BarChart3, Clock, CheckCircle, Calendar, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState('reports');

  // Sample data for metric cards
  const reportMetrics = {
    amlAlerts: {
      value: '0%',
      change: { value: '+0%', trend: 'up' },
      progress: 87.5,
      items: [
        { label: 'STRs Filed', value: '0', status: 'success' },
        { label: 'CTRs Filed', value: '0', status: 'success' },
        { label: 'Pending', value: '0', status: 'success' },
      ]
    },
    fraudDetection: {
      value: '0%',
      change: { value: '0%', trend: 'up' },
      progress: 94.2,
      items: [
        { label: 'True Positives', value: '0', status: 'success' },
        { label: 'False Positives', value: '0', status: 'error' },
        { label: 'Under Review', value: '0', status: 'warning' },
      ]
    },
    regulatoryCompliance: {
      value: '0%',
      change: { value: 'No change', trend: 'neutral' },
      progress: 100,
      items: [
        { label: 'CBN', value: 'Compliant', status: 'success' },
        { label: 'NFIU', value: 'Compliant', status: 'success' },
        { label: 'SEC', value: 'Compliant', status: 'success' },
      ]
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Regulatory Reporting</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Reporting Calendar
          </Button>
          <Button>
            <FileText className="mr-2 h-4 w-4" />
            New Report
          </Button>
        </div>
      </header>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="reports">Reports Management</TabsTrigger>
          <TabsTrigger value="analytics">Reporting Analytics</TabsTrigger>
          <TabsTrigger value="templates">Report Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="reports" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <GenerateReportCard />
            <ReportMetricCard 
              title="Upcoming Deadlines" 
              icon={Clock}
              data={{
                value: 'Reports Due',
                items: [
                  { label: 'Monthly AML Summary', value: '', status: 'warning' },
                  { label: 'Quarterly PEP Report', value: '', status: 'warning' },
                  { label: 'Annual Compliance Report', value: '', status: 'neutral' },
                ]
              }}
            />
            <ReportMetricCard 
              title="Submission Status" 
              icon={CheckCircle}
              data={{
                value: '0%',
                change: { value: '', trend: 'neutral' },
                progress: 0.0,
                items: [
                  { label: 'Accepted', value: '', status: 'success' },
                  { label: 'Pending', value: '', status: 'warning' },
                  { label: 'Rejected', value: '', status: 'error' },
                ]
              }}
            />
          </div>

          <RecentReportsTable />

        </TabsContent>

        <TabsContent value="analytics" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ReportMetricCard 
              title="AML Alerts Trend" 
              icon={TrendingUp}
              data={{
                ...reportMetrics.amlAlerts,
                change: {
                  ...reportMetrics.amlAlerts.change,
                  trend: reportMetrics.amlAlerts.change.trend as "up" | "neutral" | "down"
                }
              }}
            />
            <ReportMetricCard 
              title="Fraud Detection Rate" 
              icon={ShieldCheck}
              data={reportMetrics.fraudDetection}
            />
            <ReportMetricCard 
              title="Regulatory Compliance" 
              icon={CheckCircle}
              data={reportMetrics.regulatoryCompliance}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">Reports by Type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Reports distribution by type</p>
                    <div className="grid grid-cols-2 gap-4 mt-6 max-w-md mx-auto">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-primary"></div>
                        <span className="text-sm">STR (0%)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-success"></div>
                        <span className="text-sm">CTR (0%)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-warning"></div>
                        <span className="text-sm">SAR (0%)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-destructive"></div>
                        <span className="text-sm">AML Summary (0%)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-accent"></div>
                        <span className="text-sm">Audit (0%)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-muted-foreground"></div>
                        <span className="text-sm">Other (0%)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">Submission Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Submission performance metrics</p>
                    <div className="space-y-4 mt-6 max-w-md mx-auto">
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>On-Time Submissions</span>
                          <span>0%</span>
                        </div>
                        <Progress value={0} className="h-2" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Acceptance Rate</span>
                          <span>0%</span>
                        </div>
                        <Progress value={0} className="h-2" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>First-Time Acceptance</span>
                          <span>0%</span>
                        </div>
                        <Progress value={0} className="h-2" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Average Response Time</span>
                          <span>0 hours</span>
                        </div>
                        <Progress value={0} className="h-2" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          
        </TabsContent>

        <TabsContent value="templates" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-lg">Suspicious Transaction Report (STR)</CardTitle>
                <CardDescription>NFIU Format</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm">Standard template for reporting suspicious transactions to the Nigeria Financial Intelligence Unit (NFIU).</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Sections</span>
                    <span>7</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Required Fields</span>
                    <span>32</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Submission Deadline</span>
                    <span>24 hours</span>
                  </div>
                </div>
                <Button className="w-full">
                  <FileText className="mr-2 h-4 w-4" />
                  Use Template
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-lg">Suspicious Activity Report (SAR)</CardTitle>
                <CardDescription>CBN Format</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm">Comprehensive template for reporting suspicious activities to the Central Bank of Nigeria (CBN).</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Sections</span>
                    <span>9</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Required Fields</span>
                    <span>45</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Submission Deadline</span>
                    <span>3 business days</span>
                  </div>
                </div>
                <Button className="w-full">
                  <FileText className="mr-2 h-4 w-4" />
                  Use Template
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-lg">Currency Transaction Report (CTR)</CardTitle>
                <CardDescription>CBN/NFIU Format</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm">Standard template for reporting large currency transactions above the threshold amount.</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Sections</span>
                    <span>5</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Required Fields</span>
                    <span>28</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Submission Deadline</span>
                    <span>Next business day</span>
                  </div>
                </div>
                <Button className="w-full">
                  <FileText className="mr-2 h-4 w-4" />
                  Use Template
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-lg">Monthly AML Summary Report</CardTitle>
                <CardDescription>Internal/Regulatory Format</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm">Comprehensive monthly summary of AML activities, alerts, and case resolutions.</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Sections</span>
                    <span>8</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Required Fields</span>
                    <span>Variable</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Submission Deadline</span>
                    <span>15th of following month</span>
                  </div>
                </div>
                <Button className="w-full">
                  <FileText className="mr-2 h-4 w-4" />
                  Use Template
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-lg">PEP Screening Report</CardTitle>
                <CardDescription>Internal/Regulatory Format</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm">Template for reporting on Politically Exposed Persons (PEPs) screening results.</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Sections</span>
                    <span>6</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Required Fields</span>
                    <span>Variable</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Submission Deadline</span>
                    <span>Quarterly</span>
                  </div>
                </div>
                <Button className="w-full">
                  <FileText className="mr-2 h-4 w-4" />
                  Use Template
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-lg">Custom Report Template</CardTitle>
                <CardDescription>Create Your Own Format</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm">Create a custom report template for specialized reporting needs.</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Sections</span>
                    <span>Custom</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Required Fields</span>
                    <span>Custom</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Submission Deadline</span>
                    <span>Custom</span>
                  </div>
                </div>
                <Button className="w-full">
                  <FileText className="mr-2 h-4 w-4" />
                  Create Template
                </Button>
              </CardContent>
            </Card>
          </div>

        </TabsContent>
      </Tabs>
    </div>
  );
}