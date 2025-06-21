'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Calendar, FileText, Download, AlertTriangle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const reportTypes = [
  { 
    value: 'str', 
    label: 'Suspicious Transaction Report (STR)', 
    description: 'For reporting suspicious transactions to the NFIU',
    deadline: '24 hours after detection'
  },
  { 
    value: 'sar', 
    label: 'Suspicious Activity Report (SAR)', 
    description: 'For reporting suspicious activities to the CBN',
    deadline: '3 business days after detection'
  },
  { 
    value: 'ctr', 
    label: 'Currency Transaction Report (CTR)', 
    description: 'For reporting cash transactions above threshold',
    deadline: 'Next business day'
  },
  { 
    value: 'aml_summary', 
    label: 'Monthly AML Summary', 
    description: 'Monthly summary of AML activities',
    deadline: '15th of following month'
  },
  { 
    value: 'audit_log', 
    label: 'System Audit Log Report', 
    description: 'Detailed audit trail for compliance review',
    deadline: 'As needed'
  },
  { 
    value: 'pep_screening', 
    label: 'PEP Screening Results Report', 
    description: 'Results of Politically Exposed Persons screening',
    deadline: 'Quarterly'
  },
];

export function GenerateReportCard() {
  const [selectedReportType, setSelectedReportType] = useState<string | undefined>(undefined);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [referenceNumber, setReferenceNumber] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const { toast } = useToast();

  const selectedReport = reportTypes.find(rt => rt.value === selectedReportType);

  const handleGenerateReport = async () => {
    if (!selectedReportType) {
      toast({
        title: 'Select Report Type',
        description: 'Please choose a report type to generate.',
        variant: 'destructive',
      });
      return;
    }

    if ((selectedReportType === 'str' || selectedReportType === 'sar' || selectedReportType === 'aml_summary') && (!startDate || !endDate)) {
      toast({
        title: 'Date Range Required',
        description: 'Please select both start and end dates for this report type.',
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
      description: `The "${selectedReport?.label}" report is being generated. You will be notified upon completion.`,
    });

    // Add the report to the recent reports list
    const newReportId = `REP${Date.now().toString().slice(-6)}`;
    
    // Here you would typically trigger an API call to generate the report
    // and update the recent reports list or show progress.
  };

  return (
    <Card className="shadow-lg col-span-1 md:col-span-1">
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

        {selectedReport && (
          <div className="text-sm space-y-2 p-3 bg-muted/50 rounded-md">
            <p>{selectedReport.description}</p>
            <div className="flex items-center text-xs text-muted-foreground">
              <AlertTriangle className="h-3 w-3 mr-1" />
              <span>Deadline: {selectedReport.deadline}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Start Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, 'PPP') : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <CalendarComponent
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-2">
            <Label>End Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, 'PPP') : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <CalendarComponent
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  initialFocus
                  disabled={(date) => date < (startDate || new Date(0))}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <Button 
          variant="outline" 
          size="sm" 
          className="w-full"
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          {showAdvanced ? "Hide" : "Show"} Advanced Options
        </Button>

        {showAdvanced && (
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label>Reference Number (Optional)</Label>
              <Input 
                placeholder="Enter reference number" 
                value={referenceNumber}
                onChange={(e) => setReferenceNumber(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Additional Notes</Label>
              <Textarea 
                placeholder="Enter any additional information for this report"
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                rows={3}
              />
            </div>
          </div>
        )}

        <Button onClick={handleGenerateReport} disabled={isGenerating || !selectedReportType} className="w-full">
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <FileText className="mr-2 h-4 w-4" />
              Generate Report
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}