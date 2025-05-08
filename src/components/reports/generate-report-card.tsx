
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const reportTypes = [
  { value: 'aml_summary', label: 'Monthly AML Summary' },
  { value: 'fraud_analysis', label: 'Quarterly Fraud Analysis' },
  { value: 'sar_batch', label: 'Suspicious Activity Report (SAR) Batch' },
  { value: 'str_batch', label: 'Suspicious Transaction Report (STR) Batch' },
  { value: 'audit_log', label: 'System Audit Log Report' },
  { value: 'pep_screening', label: 'PEP Screening Results Report' },
];

export function GenerateReportCard() {
  const [selectedReportType, setSelectedReportType] = useState<string | undefined>(undefined);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleGenerateReport = async () => {
    if (!selectedReportType) {
      toast({
        title: 'Select Report Type',
        description: 'Please choose a report type to generate.',
        variant: 'destructive',
      });
      return;
    }
    setIsGenerating(true);
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsGenerating(false);
    toast({
      title: 'Report Generation Started',
      description: `The "${reportTypes.find(rt => rt.value === selectedReportType)?.label}" report is being generated. You will be notified upon completion.`,
    });
    // Here you would typically trigger an API call to generate the report
    // and update the recent reports list or show progress.
  };

  return (
    <Card className="shadow-lg col-span-1 md:col-span-1"> {/* Adjusted for a 3-col layout */}
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Generate New Report</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Select value={selectedReportType} onValueChange={setSelectedReportType}>
          <SelectTrigger>
            <SelectValue placeholder="Select report type" />
          </SelectTrigger>
          <SelectContent>
            {reportTypes.map((report) => (
              <SelectItem key={report.value} value={report.value}>
                {report.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={handleGenerateReport} disabled={isGenerating || !selectedReportType} className="w-full">
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            'Generate Report'
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
