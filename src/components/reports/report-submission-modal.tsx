'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FileText,
  Send,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Download,
  Save,
  Eye,
  Upload,
  Building,
  Globe,
  Lock,
  Shield,
  Key,
  Loader2,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface ReportSubmissionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  report: {
    id: string;
    name: string;
    type: string;
    date: string;
  } | null;
}

export function ReportSubmissionModal({
  open,
  onOpenChange,
  report,
}: ReportSubmissionModalProps) {
  const [submissionMethod, setSubmissionMethod] = useState<string>("api");
  const [regulatoryBody, setRegulatoryBody] = useState<string>("nfiu");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [confirmChecked, setConfirmChecked] = useState<boolean>(false);
  const [additionalNotes, setAdditionalNotes] = useState<string>("");
  const { toast } = useToast();

  if (!report) return null;

  const handleSubmit = async () => {
    if (!confirmChecked) {
      toast({
        title: "Confirmation Required",
        description: "Please confirm that the report information is accurate and complete.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    onOpenChange(false);
    
    toast({
      title: "Report Submitted Successfully",
      description: `${report.name} has been submitted to ${regulatoryBody.toUpperCase()}.`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Send className="h-5 w-5 text-primary" />
            Submit Regulatory Report
          </DialogTitle>
          <DialogDescription>
            Submit {report.name} to the appropriate regulatory body
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Report Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Report ID</p>
                  <p className="font-medium">{report.id}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Report Type</p>
                  <Badge variant="outline">{report.type}</Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Generated Date</p>
                  <p className="font-medium">{report.date}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Submission Deadline</p>
                  <Badge variant="warning" className="mt-0.5">
                    <Clock className="mr-1 h-3 w-3" />
                    {report.type === 'STR' ? '24 hours after detection' : 
                     report.type === 'SAR' ? '3 business days after detection' : 
                     report.type === 'CTR' ? 'Next business day' : 
                     'As required'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Submission Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="regulatory-body">Regulatory Body</Label>
                <Select value={regulatoryBody} onValueChange={setRegulatoryBody}>
                  <SelectTrigger id="regulatory-body">
                    <SelectValue placeholder="Select regulatory body" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nfiu">Nigeria Financial Intelligence Unit (NFIU)</SelectItem>
                    <SelectItem value="cbn">Central Bank of Nigeria (CBN)</SelectItem>
                    <SelectItem value="sec">Securities and Exchange Commission (SEC)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="submission-method">Submission Method</Label>
                <Select value={submissionMethod} onValueChange={setSubmissionMethod}>
                  <SelectTrigger id="submission-method">
                    <SelectValue placeholder="Select submission method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="api">API (Automated)</SelectItem>
                    <SelectItem value="portal">Web Portal</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="manual">Manual</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {submissionMethod === 'api' && (
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Shield className="h-4 w-4 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Secure API Submission</p>
                      <p className="text-xs text-muted-foreground">
                        Report will be securely submitted via encrypted API connection to {regulatoryBody.toUpperCase()}.
                        Digital signature and encryption will be automatically applied.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {submissionMethod === 'portal' && (
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Globe className="h-4 w-4 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Web Portal Submission</p>
                      <p className="text-xs text-muted-foreground">
                        You will be redirected to the {regulatoryBody.toUpperCase()} web portal to complete the submission.
                        The report will be pre-filled with the information from this system.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {submissionMethod === 'email' && (
                <div className="space-y-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-start gap-2">
                      <Lock className="h-4 w-4 text-primary mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Encrypted Email Submission</p>
                        <p className="text-xs text-muted-foreground">
                          Report will be encrypted and sent via email to the designated {regulatoryBody.toUpperCase()} address.
                          Encryption key will be sent separately for security.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="recipient-email">Recipient Email</Label>
                    <Input 
                      id="recipient-email" 
                      value={
                        regulatoryBody === 'nfiu' ? 'reports@nfiu.gov.ng' :
                        regulatoryBody === 'cbn' ? 'compliance@cbn.gov.ng' :
                        'reports@sec.gov.ng'
                      } 
                      readOnly
                    />
                  </div>
                </div>
              )}

              {submissionMethod === 'manual' && (
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Building className="h-4 w-4 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Manual Submission</p>
                      <p className="text-xs text-muted-foreground">
                        Report will be prepared for manual submission to {regulatoryBody.toUpperCase()}.
                        You will need to download the report and submit it according to the regulatory body's requirements.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="additional-notes">Additional Notes (Optional)</Label>
                <Textarea 
                  id="additional-notes" 
                  placeholder="Add any additional information relevant to this submission"
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Security & Compliance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-2">
                <Checkbox 
                  id="confirm-accuracy" 
                  checked={confirmChecked}
                  onCheckedChange={(checked) => setConfirmChecked(checked as boolean)}
                />
                <div className="grid gap-1.5 leading-none">
                  <Label
                    htmlFor="confirm-accuracy"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I confirm that the information in this report is accurate and complete
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    By checking this box, you confirm that all information provided is accurate to the best of your knowledge,
                    and you understand that submitting false information may have legal consequences.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-start gap-2">
                  <Key className="h-4 w-4 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Security Measures</p>
                    <ul className="text-xs text-muted-foreground list-disc list-inside space-y-1 mt-1">
                      <li>AES-256 encryption for data in transit</li>
                      <li>Digital signature for data integrity</li>
                      <li>Secure audit trail of submission</li>
                      <li>Compliance with CBN data protection guidelines</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button variant="outline">
              <Save className="mr-2 h-4 w-4" />
              Save Draft
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting || !confirmChecked}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Submit Report
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}