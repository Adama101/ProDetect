'use client';

import { useState } from 'react';
import { GenerateReportCard } from '@/components/reports/generate-report-card';
import { ReportMetricCard } from '@/components/reports/report-metric-card';
import { RecentReportsTable } from '@/components/reports/recent-reports-table';
import { TrendingUp, ShieldCheck, FileText, BarChart3, Clock, CheckCircle, Calendar, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState('reports');

  // Sample data for metric cards
  const reportMetrics = {
    amlAlerts: {
      value: '87.5%',
      change: { value: '+2.3%', trend: 'up' },
      progress: 87.5,
      items: [
        { label: 'STRs Filed', value: '12', status: 'success' },
        { label: 'CTRs Filed', value: '45', status: 'success' },
        { label: 'Pending', value: '3', status: 'warning' },
      ]
    },
    fraudDetection: {
      value: '94.2%',
      change: { value: '+1.5%', trend: 'up' },
      progress: 94.2,
      items: [
        { label: 'True Positives', value: '28', status: 'success' },
        { label: 'False Positives', value: '5', status: 'error' },
        { label: 'Under Review', value: '7', status: 'warning' },
      ]
    },
    regulatoryCompliance: {
      value: '100%',
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
          <p className="text-muted-foreground mt-1">
            Generate, manage, and submit regulatory reports to comply with CBN and NFIU requirements
          </p>
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
              description="Monitor upcoming regulatory reporting deadlines"
              icon={Clock}
              data={{
                value: '3 Reports Due',
                items: [
                  { label: 'Monthly AML Summary', value: '2 days', status: 'warning' },
                  { label: 'Quarterly PEP Report', value: '5 days', status: 'warning' },
                  { label: 'Annual Compliance Report', value: '30 days', status: 'neutral' },
                ]
              }}
            />
            <ReportMetricCard 
              title="Submission Status" 
              description="Track the status of recent regulatory submissions"
              icon={CheckCircle}
              data={{
                value: '98.5%',
                change: { value: '+1.2%', trend: 'up' },
                progress: 98.5,
                items: [
                  { label: 'Accepted', value: '45', status: 'success' },
                  { label: 'Pending', value: '3', status: 'warning' },
                  { label: 'Rejected', value: '1', status: 'error' },
                ]
              }}
            />
          </div>

          <RecentReportsTable />

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Regulatory Submission Guidelines</CardTitle>
              <CardDescription>Key requirements for regulatory reporting in Nigeria</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <h3 className="font-medium">STR Requirements</h3>
                  </div>
                  <ul className="text-sm space-y-1">
                    <li>• Must be filed within 24 hours of detection</li>
                    <li>• Requires detailed transaction information</li>
                    <li>• Must include customer KYC documentation</li>
                    <li>• Requires explanation of suspicious nature</li>
                    <li>• Must be submitted to NFIU via secure portal</li>
                  </ul>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <h3 className="font-medium">CTR Requirements</h3>
                  </div>
                  <ul className="text-sm space-y-1">
                    <li>• Required for cash transactions above ₦5,000,000</li>
                    <li>• Must be filed by next business day</li>
                    <li>• Multiple related transactions must be aggregated</li>
                    <li>• Requires ID verification of transacting party</li>
                    <li>• Must be submitted to CBN and NFIU</li>
                  </ul>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-5 w-5 text-warning" />
                    <h3 className="font-medium">Common Filing Errors</h3>
                  </div>
                  <ul className="text-sm space-y-1">
                    <li>• Incomplete customer information</li>
                    <li>• Vague description of suspicious activity</li>
                    <li>• Missing transaction details</li>
                    <li>• Late submissions past deadlines</li>
                    <li>• Incorrect categorization of suspicious activity</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ReportMetricCard 
              title="AML Alerts Trend" 
              description="Monitor trends in AML alert generation"
              icon={TrendingUp}
              data={reportMetrics.amlAlerts}
            />
            <ReportMetricCard 
              title="Fraud Detection Rate" 
              description="Track the effectiveness of fraud detection mechanisms"
              icon={ShieldCheck}
              data={reportMetrics.fraudDetection}
            />
            <ReportMetricCard 
              title="Regulatory Compliance" 
              description="Overall compliance with regulatory requirements"
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
                        <span className="text-sm">STR (35%)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-success"></div>
                        <span className="text-sm">CTR (25%)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-warning"></div>
                        <span className="text-sm">SAR (15%)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-destructive"></div>
                        <span className="text-sm">AML Summary (10%)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-accent"></div>
                        <span className="text-sm">Audit (10%)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-muted-foreground"></div>
                        <span className="text-sm">Other (5%)</span>
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
                          <span>98.5%</span>
                        </div>
                        <Progress value={98.5} className="h-2" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Acceptance Rate</span>
                          <span>99.1%</span>
                        </div>
                        <Progress value={99.1} className="h-2" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>First-Time Acceptance</span>
                          <span>95.3%</span>
                        </div>
                        <Progress value={95.3} className="h-2" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Average Response Time</span>
                          <span>4.5 hours</span>
                        </div>
                        <Progress value={75} className="h-2" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Regulatory Reporting Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-5 w-5 text-success" />
                    <h3 className="font-medium">Key Trends</h3>
                  </div>
                  <ul className="text-sm space-y-1">
                    <li>• 15% increase in STR filings year-over-year</li>
                    <li>• Decrease in rejection rate from 3.2% to 0.9%</li>
                    <li>• 30% reduction in processing time</li>
                    <li>• Improved data quality with 99.5% accuracy</li>
                  </ul>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-5 w-5 text-warning" />
                    <h3 className="font-medium">Areas for Improvement</h3>
                  </div>
                  <ul className="text-sm space-y-1">
                    <li>• Enhance suspicious activity descriptions</li>
                    <li>• Improve timeliness of high-risk STRs</li>
                    <li>• Reduce manual data entry errors</li>
                    <li>• Increase automation of CTR filings</li>
                  </ul>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <h3 className="font-medium">Regulatory Feedback</h3>
                  </div>
                  <ul className="text-sm space-y-1">
                    <li>• Commended for detailed transaction analysis</li>
                    <li>• Recognized for timely submissions</li>
                    <li>• Suggested improvements for PEP reporting</li>
                    <li>• Positive feedback on data quality</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
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

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Regulatory Reporting Guidelines</CardTitle>
              <CardDescription>Key requirements and best practices for regulatory reporting in Nigeria</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-medium">NFIU Reporting Requirements</h3>
                  <div className="space-y-2 text-sm">
                    <p>• STRs must be filed within 24 hours of detection</p>
                    <p>• CTRs required for cash transactions above ₦5,000,000</p>
                    <p>• Electronic funds transfer reports for international transfers</p>
                    <p>• Quarterly PEP activity reports</p>
                    <p>• Annual compliance officer reports</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium">CBN Reporting Requirements</h3>
                  <div className="space-y-2 text-sm">
                    <p>• SARs must be filed within 3 business days</p>
                    <p>• Monthly AML compliance summaries</p>
                    <p>• Quarterly risk assessment reports</p>
                    <p>• Bi-annual training compliance reports</p>
                    <p>• Annual independent audit reports</p>
                  </div>
                </div>
              </div>

              <div className="p-4 border-2 border-dashed border-border rounded-lg mt-8 bg-card shadow-sm">
                <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2 text-center">Automated Regulatory Submissions</h3>
                <p className="text-sm text-muted-foreground text-center">
                  Configure automated submission of required reports (e.g., SARs, STRs) directly to regulatory bodies. 
                  Feature managed under <code className="bg-muted px-1 py-0.5 rounded text-xs">Settings > Reporting & Submissions</code>.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}