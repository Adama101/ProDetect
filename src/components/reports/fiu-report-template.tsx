'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { FileText, Save, Download, Send, Calendar, Clock, User, Building, MapPin, DollarSign, AlertTriangle, CheckCircle, Plus, Minus, Upload } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { useToast } from '@/components/ui/use-toast';

interface FIUReportTemplateProps {
  reportType: 'STR' | 'SAR' | 'CTR';
  initialData?: any;
  onSave?: (data: any) => void;
  onSubmit?: (data: any) => void;
}

export function FIUReportTemplate({ 
  reportType = 'STR', 
  initialData, 
  onSave, 
  onSubmit 
}: FIUReportTemplateProps) {
  const [activeTab, setActiveTab] = useState('entity');
  const [reportData, setReportData] = useState(initialData || {
    // Reporting Entity Information
    entity: {
      name: 'ProDetect Financial Services',
      licenseNumber: 'FIN/REG/2023/12345',
      contactPerson: '',
      contactEmail: '',
      contactPhone: '',
      address: '',
    },
    // Subject Information
    subject: {
      name: '',
      accountNumber: '',
      dateOfBirth: '',
      nationality: 'Nigerian',
      idType: '',
      idNumber: '',
      address: '',
      occupation: '',
      businessType: '',
      relationshipStartDate: '',
    },
    // Suspicious Activity Information
    activity: {
      type: '',
      startDate: '',
      endDate: '',
      totalAmount: '',
      currency: 'NGN',
      description: '',
      suspicionReason: '',
    },
    // Transaction Details
    transactions: [
      { date: '', amount: '', type: '', channel: '', location: '', description: '' }
    ],
    // Supporting Documentation
    documents: [],
    // Declaration
    declaration: {
      name: '',
      position: '',
      date: new Date().toISOString().split('T')[0],
    }
  });
  const { toast } = useToast();

  const updateReportData = (section: string, field: string, value: any) => {
    setReportData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const updateTransaction = (index: number, field: string, value: any) => {
    const updatedTransactions = [...reportData.transactions];
    updatedTransactions[index] = {
      ...updatedTransactions[index],
      [field]: value
    };
    setReportData(prev => ({
      ...prev,
      transactions: updatedTransactions
    }));
  };

  const addTransaction = () => {
    setReportData(prev => ({
      ...prev,
      transactions: [
        ...prev.transactions,
        { date: '', amount: '', type: '', channel: '', location: '', description: '' }
      ]
    }));
  };

  const removeTransaction = (index: number) => {
    if (reportData.transactions.length <= 1) return;
    const updatedTransactions = [...reportData.transactions];
    updatedTransactions.splice(index, 1);
    setReportData(prev => ({
      ...prev,
      transactions: updatedTransactions
    }));
  };

  const addDocument = (document: any) => {
    setReportData(prev => ({
      ...prev,
      documents: [...prev.documents, document]
    }));
  };

  const handleSave = () => {
    if (onSave) {
      onSave(reportData);
    }
    toast({
      title: "Report Saved",
      description: "Your report has been saved as a draft.",
    });
  };

  const handleSubmit = () => {
    // Validate required fields
    const requiredFields = {
      entity: ['name', 'licenseNumber', 'contactPerson', 'contactEmail'],
      subject: ['name', 'accountNumber'],
      activity: ['type', 'description', 'suspicionReason'],
      declaration: ['name', 'position']
    };

    let missingFields: string[] = [];
    
    Object.entries(requiredFields).forEach(([section, fields]) => {
      fields.forEach(field => {
        if (!reportData[section][field]) {
          missingFields.push(`${section}.${field}`);
        }
      });
    });

    if (missingFields.length > 0) {
      toast({
        title: "Validation Error",
        description: `Please complete all required fields before submitting. Missing: ${missingFields.length} fields.`,
        variant: "destructive"
      });
      return;
    }

    if (onSubmit) {
      onSubmit(reportData);
    }
    toast({
      title: "Report Submitted",
      description: "Your report has been submitted to the regulatory body.",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <FileText className="h-5 w-5" />
            {reportType === 'STR' && 'Suspicious Transaction Report (STR)'}
            {reportType === 'SAR' && 'Suspicious Activity Report (SAR)'}
            {reportType === 'CTR' && 'Currency Transaction Report (CTR)'}
          </CardTitle>
          <CardDescription>
            {reportType === 'STR' && 'Complete this form to report suspicious transactions to the Nigeria Financial Intelligence Unit (NFIU)'}
            {reportType === 'SAR' && 'Complete this form to report suspicious activities to the Central Bank of Nigeria (CBN)'}
            {reportType === 'CTR' && 'Complete this form to report large currency transactions above the threshold amount'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="entity">Reporting Entity</TabsTrigger>
              <TabsTrigger value="subject">Subject Information</TabsTrigger>
              <TabsTrigger value="activity">Suspicious Activity</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="documents">Documentation</TabsTrigger>
            </TabsList>

            <TabsContent value="entity" className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="entity-name">Reporting Entity Name <span className="text-destructive">*</span></Label>
                  <Input 
                    id="entity-name" 
                    value={reportData.entity.name} 
                    onChange={(e) => updateReportData('entity', 'name', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="entity-license">License Number <span className="text-destructive">*</span></Label>
                  <Input 
                    id="entity-license" 
                    value={reportData.entity.licenseNumber} 
                    onChange={(e) => updateReportData('entity', 'licenseNumber', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="entity-contact-person">Contact Person <span className="text-destructive">*</span></Label>
                  <Input 
                    id="entity-contact-person" 
                    value={reportData.entity.contactPerson} 
                    onChange={(e) => updateReportData('entity', 'contactPerson', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="entity-contact-email">Contact Email <span className="text-destructive">*</span></Label>
                  <Input 
                    id="entity-contact-email" 
                    type="email"
                    value={reportData.entity.contactEmail} 
                    onChange={(e) => updateReportData('entity', 'contactEmail', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="entity-contact-phone">Contact Phone</Label>
                  <Input 
                    id="entity-contact-phone" 
                    value={reportData.entity.contactPhone} 
                    onChange={(e) => updateReportData('entity', 'contactPhone', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="entity-address">Address</Label>
                  <Input 
                    id="entity-address" 
                    value={reportData.entity.address} 
                    onChange={(e) => updateReportData('entity', 'address', e.target.value)}
                  />
                </div>
              </div>

              <div className="flex justify-end mt-4">
                <Button onClick={() => setActiveTab('subject')}>
                  Next: Subject Information
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="subject" className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="subject-name">Subject Name <span className="text-destructive">*</span></Label>
                  <Input 
                    id="subject-name" 
                    value={reportData.subject.name} 
                    onChange={(e) => updateReportData('subject', 'name', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject-account">Account Number <span className="text-destructive">*</span></Label>
                  <Input 
                    id="subject-account" 
                    value={reportData.subject.accountNumber} 
                    onChange={(e) => updateReportData('subject', 'accountNumber', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="subject-dob">Date of Birth</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="subject-dob"
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {reportData.subject.dateOfBirth ? format(new Date(reportData.subject.dateOfBirth), 'PPP') : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={reportData.subject.dateOfBirth ? new Date(reportData.subject.dateOfBirth) : undefined}
                        onSelect={(date) => updateReportData('subject', 'dateOfBirth', date?.toISOString().split('T')[0])}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject-nationality">Nationality</Label>
                  <Select 
                    value={reportData.subject.nationality} 
                    onValueChange={(value) => updateReportData('subject', 'nationality', value)}
                  >
                    <SelectTrigger id="subject-nationality">
                      <SelectValue placeholder="Select nationality" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Nigerian">Nigerian</SelectItem>
                      <SelectItem value="Ghanaian">Ghanaian</SelectItem>
                      <SelectItem value="South African">South African</SelectItem>
                      <SelectItem value="Kenyan">Kenyan</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="subject-id-type">ID Type</Label>
                  <Select 
                    value={reportData.subject.idType} 
                    onValueChange={(value) => updateReportData('subject', 'idType', value)}
                  >
                    <SelectTrigger id="subject-id-type">
                      <SelectValue placeholder="Select ID type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="National ID">National ID</SelectItem>
                      <SelectItem value="International Passport">International Passport</SelectItem>
                      <SelectItem value="Driver's License">Driver's License</SelectItem>
                      <SelectItem value="Voter's Card">Voter's Card</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject-id-number">ID Number</Label>
                  <Input 
                    id="subject-id-number" 
                    value={reportData.subject.idNumber} 
                    onChange={(e) => updateReportData('subject', 'idNumber', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject-address">Address</Label>
                <Input 
                  id="subject-address" 
                  value={reportData.subject.address} 
                  onChange={(e) => updateReportData('subject', 'address', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="subject-occupation">Occupation</Label>
                  <Input 
                    id="subject-occupation" 
                    value={reportData.subject.occupation} 
                    onChange={(e) => updateReportData('subject', 'occupation', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject-business-type">Business Type</Label>
                  <Input 
                    id="subject-business-type" 
                    value={reportData.subject.businessType} 
                    onChange={(e) => updateReportData('subject', 'businessType', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject-relationship-date">Relationship Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="subject-relationship-date"
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {reportData.subject.relationshipStartDate ? format(new Date(reportData.subject.relationshipStartDate), 'PPP') : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={reportData.subject.relationshipStartDate ? new Date(reportData.subject.relationshipStartDate) : undefined}
                      onSelect={(date) => updateReportData('subject', 'relationshipStartDate', date?.toISOString().split('T')[0])}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex justify-between mt-4">
                <Button variant="outline" onClick={() => setActiveTab('entity')}>
                  Previous: Reporting Entity
                </Button>
                <Button onClick={() => setActiveTab('activity')}>
                  Next: Suspicious Activity
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="activity" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="activity-type">Type of Suspicious Activity <span className="text-destructive">*</span></Label>
                <Select 
                  value={reportData.activity.type} 
                  onValueChange={(value) => updateReportData('activity', 'type', value)}
                >
                  <SelectTrigger id="activity-type">
                    <SelectValue placeholder="Select activity type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Structuring">Structuring</SelectItem>
                    <SelectItem value="Money Laundering">Money Laundering</SelectItem>
                    <SelectItem value="Terrorist Financing">Terrorist Financing</SelectItem>
                    <SelectItem value="Fraud">Fraud</SelectItem>
                    <SelectItem value="Identity Theft">Identity Theft</SelectItem>
                    <SelectItem value="Unusual Transaction">Unusual Transaction</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="activity-start-date">Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="activity-start-date"
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {reportData.activity.startDate ? format(new Date(reportData.activity.startDate), 'PPP') : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={reportData.activity.startDate ? new Date(reportData.activity.startDate) : undefined}
                        onSelect={(date) => updateReportData('activity', 'startDate', date?.toISOString().split('T')[0])}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="activity-end-date">End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="activity-end-date"
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {reportData.activity.endDate ? format(new Date(reportData.activity.endDate), 'PPP') : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={reportData.activity.endDate ? new Date(reportData.activity.endDate) : undefined}
                        onSelect={(date) => updateReportData('activity', 'endDate', date?.toISOString().split('T')[0])}
                        initialFocus
                        disabled={(date) => date < (reportData.activity.startDate ? new Date(reportData.activity.startDate) : new Date(0))}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="activity-amount">Total Amount Involved</Label>
                  <Input 
                    id="activity-amount" 
                    type="number"
                    value={reportData.activity.totalAmount} 
                    onChange={(e) => updateReportData('activity', 'totalAmount', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="activity-currency">Currency</Label>
                  <Select 
                    value={reportData.activity.currency} 
                    onValueChange={(value) => updateReportData('activity', 'currency', value)}
                  >
                    <SelectTrigger id="activity-currency">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NGN">Nigerian Naira (NGN)</SelectItem>
                      <SelectItem value="USD">US Dollar (USD)</SelectItem>
                      <SelectItem value="EUR">Euro (EUR)</SelectItem>
                      <SelectItem value="GBP">British Pound (GBP)</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="activity-description">Description of Suspicious Activity <span className="text-destructive">*</span></Label>
                <Textarea 
                  id="activity-description" 
                  rows={4}
                  value={reportData.activity.description} 
                  onChange={(e) => updateReportData('activity', 'description', e.target.value)}
                  placeholder="Provide a clear, concise description of the suspicious activity, including what happened, when it happened, and who was involved."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="activity-reason">Reason for Suspicion <span className="text-destructive">*</span></Label>
                <Textarea 
                  id="activity-reason" 
                  rows={4}
                  value={reportData.activity.suspicionReason} 
                  onChange={(e) => updateReportData('activity', 'suspicionReason', e.target.value)}
                  placeholder="Explain why you consider this activity suspicious. Include any red flags, unusual patterns, or inconsistencies with the customer's profile."
                />
              </div>

              <div className="flex justify-between mt-4">
                <Button variant="outline" onClick={() => setActiveTab('subject')}>
                  Previous: Subject Information
                </Button>
                <Button onClick={() => setActiveTab('transactions')}>
                  Next: Transaction Details
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="transactions" className="space-y-4 mt-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Transaction Details</h3>
                <Button variant="outline" size="sm" onClick={addTransaction}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Transaction
                </Button>
              </div>

              <div className="space-y-6">
                {reportData.transactions.map((transaction: any, index: number) => (
                  <Card key={index}>
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-base">Transaction #{index + 1}</CardTitle>
                        {reportData.transactions.length > 1 && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => removeTransaction(index)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Date</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-full justify-start text-left font-normal"
                              >
                                <Calendar className="mr-2 h-4 w-4" />
                                {transaction.date ? format(new Date(transaction.date), 'PPP') : <span>Pick a date</span>}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <CalendarComponent
                                mode="single"
                                selected={transaction.date ? new Date(transaction.date) : undefined}
                                onSelect={(date) => updateTransaction(index, 'date', date?.toISOString().split('T')[0])}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        <div className="space-y-2">
                          <Label>Amount</Label>
                          <Input 
                            type="number"
                            value={transaction.amount} 
                            onChange={(e) => updateTransaction(index, 'amount', e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Transaction Type</Label>
                          <Select 
                            value={transaction.type} 
                            onValueChange={(value) => updateTransaction(index, 'type', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Cash Deposit">Cash Deposit</SelectItem>
                              <SelectItem value="Cash Withdrawal">Cash Withdrawal</SelectItem>
                              <SelectItem value="Wire Transfer">Wire Transfer</SelectItem>
                              <SelectItem value="Electronic Payment">Electronic Payment</SelectItem>
                              <SelectItem value="Check Deposit">Check Deposit</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Channel</Label>
                          <Select 
                            value={transaction.channel} 
                            onValueChange={(value) => updateTransaction(index, 'channel', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select channel" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Branch">Branch</SelectItem>
                              <SelectItem value="ATM">ATM</SelectItem>
                              <SelectItem value="Mobile">Mobile</SelectItem>
                              <SelectItem value="Online">Online</SelectItem>
                              <SelectItem value="Agent">Agent</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Location</Label>
                          <Input 
                            value={transaction.location} 
                            onChange={(e) => updateTransaction(index, 'location', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Description</Label>
                          <Input 
                            value={transaction.description} 
                            onChange={(e) => updateTransaction(index, 'description', e.target.value)}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex justify-between mt-4">
                <Button variant="outline" onClick={() => setActiveTab('activity')}>
                  Previous: Suspicious Activity
                </Button>
                <Button onClick={() => setActiveTab('documents')}>
                  Next: Supporting Documentation
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="documents" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Supporting Documentation</Label>
                <p className="text-sm text-muted-foreground">
                  Attach any relevant documents that support this report, such as account statements, 
                  transaction receipts, KYC documentation, or correspondence.
                </p>
              </div>

              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-4" />
                <p className="text-sm text-muted-foreground mb-2">
                  Drag and drop files here, or click to browse
                </p>
                <Button variant="outline">
                  Choose Files
                </Button>
              </div>

              {reportData.documents.length > 0 && (
                <div className="space-y-2 mt-4">
                  <h3 className="font-medium">Attached Documents</h3>
                  <div className="space-y-2">
                    {reportData.documents.map((doc: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-primary" />
                          <span>{doc.name}</span>
                        </div>
                        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                          <Minus className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Separator className="my-6" />

              <div className="space-y-4">
                <h3 className="font-medium">Declaration</h3>
                <p className="text-sm text-muted-foreground">
                  I declare that the information contained in this report is correct to the best of my knowledge and belief.
                  I understand that it is an offense to knowingly provide false or misleading information in this report.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="declaration-name">Name <span className="text-destructive">*</span></Label>
                    <Input 
                      id="declaration-name" 
                      value={reportData.declaration.name} 
                      onChange={(e) => updateReportData('declaration', 'name', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="declaration-position">Position <span className="text-destructive">*</span></Label>
                    <Input 
                      id="declaration-position" 
                      value={reportData.declaration.position} 
                      onChange={(e) => updateReportData('declaration', 'position', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="declaration-date">Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="declaration-date"
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {reportData.declaration.date ? format(new Date(reportData.declaration.date), 'PPP') : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={reportData.declaration.date ? new Date(reportData.declaration.date) : undefined}
                        onSelect={(date) => updateReportData('declaration', 'date', date?.toISOString().split('T')[0])}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={() => setActiveTab('transactions')}>
                  Previous: Transaction Details
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleSave}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Draft
                  </Button>
                  <Button onClick={handleSubmit}>
                    <Send className="mr-2 h-4 w-4" />
                    Submit Report
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}