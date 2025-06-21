"use client";

import { useState } from "react";
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
import { Separator } from "@/components/ui/separator";
import {
  CreditCard,
  Calendar,
  Clock,
  User,
  DollarSign,
  MapPin,
  ArrowRight,
  AlertCircle,
  CheckCircle,
  XCircle,
  ExternalLink,
  FileText,
  Download,
  Printer,
  Share2,
  Flag,
  BarChart3,
  Activity,
  Smartphone,
  Globe,
  Building,
  Briefcase,
  ShieldCheck,
  ShieldAlert,
  Info,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface TransactionDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: TransactionDetails | null;
}

interface TransactionDetails {
  id: string;
  transaction_id: string;
  customer_id: string;
  amount: number;
  currency: string;
  type: string;
  status: string;
  counterparty: string;
  risk: string;
  date: string;
  time: string;
  description: string;
  riskScore?: number;
  riskFactors?: string[];
}

export function TransactionDetailsModal({
  open,
  onOpenChange,
  transaction,
}: TransactionDetailsModalProps) {
  const [activeTab, setActiveTab] = useState<"details" | "risk" | "timeline">("details");

  if (!transaction) return null;

  const statusColor = {
    Completed: "text-success",
    Pending: "text-warning",
    Flagged: "text-destructive",
    Blocked: "text-destructive",
  }[transaction.status] || "text-muted-foreground";

  const StatusIcon = {
    Completed: CheckCircle,
    Pending: Clock,
    Flagged: AlertCircle,
    Blocked: XCircle,
  }[transaction.status] || Info;

  const riskColor = {
    Low: "text-success",
    Medium: "text-warning",
    High: "text-destructive",
    Critical: "text-destructive",
  }[transaction.risk] || "text-muted-foreground";

  const riskBadgeVariant = {
    Low: "outline",
    Medium: "secondary",
    High: "warning",
    Critical: "destructive",
  }[transaction.risk] || "outline";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="flex items-center gap-2 text-2xl">
                <CreditCard className="h-6 w-6 text-primary" />
                Transaction Details
              </DialogTitle>
              <DialogDescription className="mt-2">
                Transaction ID: {transaction.transaction_id}
              </DialogDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={riskBadgeVariant}>{transaction.risk} Risk</Badge>
              <Badge
                variant={
                  transaction.status === "Completed"
                    ? "outline"
                    : transaction.status === "Pending"
                    ? "secondary"
                    : "destructive"
                }
                className={transaction.status === "Completed" ? "text-success" : ""}
              >
                {transaction.status}
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <div className="flex border-b mb-4">
          <Button
            variant="ghost"
            className={`rounded-none border-b-2 ${
              activeTab === "details"
                ? "border-primary"
                : "border-transparent"
            }`}
            onClick={() => setActiveTab("details")}
          >
            Transaction Details
          </Button>
          <Button
            variant="ghost"
            className={`rounded-none border-b-2 ${
              activeTab === "risk"
                ? "border-primary"
                : "border-transparent"
            }`}
            onClick={() => setActiveTab("risk")}
          >
            Risk Assessment
          </Button>
          <Button
            variant="ghost"
            className={`rounded-none border-b-2 ${
              activeTab === "timeline"
                ? "border-primary"
                : "border-transparent"
            }`}
            onClick={() => setActiveTab("timeline")}
          >
            Timeline
          </Button>
        </div>

        {activeTab === "details" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Transaction Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Amount</p>
                      <p className="font-medium flex items-center">
                        <DollarSign className="h-4 w-4 mr-1 text-primary" />
                        {transaction.amount.toLocaleString()} {transaction.currency}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Type</p>
                      <p className="font-medium">{transaction.type}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Date</p>
                      <p className="font-medium flex items-center">
                        <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                        {transaction.date}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Time</p>
                      <p className="font-medium flex items-center">
                        <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                        {transaction.time}
                      </p>
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <div className="flex items-center mt-1">
                      <StatusIcon className={`h-5 w-5 mr-2 ${statusColor}`} />
                      <p className={`font-medium ${statusColor}`}>{transaction.status}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Description</p>
                    <p className="font-medium">{transaction.description}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Parties</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Customer</p>
                    <div className="flex items-center mt-1">
                      <User className="h-5 w-5 mr-2 text-primary" />
                      <p className="font-medium">ID: {transaction.customer_id}</p>
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-sm text-muted-foreground">Counterparty</p>
                    <div className="flex items-center mt-1">
                      <Building className="h-5 w-5 mr-2 text-muted-foreground" />
                      <p className="font-medium">{transaction.counterparty}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-center mt-4">
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <p className="text-xs mt-1">Sender</p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground" />
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                          <Building className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <p className="text-xs mt-1">Recipient</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Additional Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">IP Address</p>
                    <p className="font-medium flex items-center">
                      <Globe className="h-4 w-4 mr-1 text-muted-foreground" />
                      192.168.1.100
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Device</p>
                    <p className="font-medium flex items-center">
                      <Smartphone className="h-4 w-4 mr-1 text-muted-foreground" />
                      Chrome/Windows
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-medium flex items-center">
                      <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                      Lagos, Nigeria
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-1" />
                Download
              </Button>
              <Button variant="outline" size="sm">
                <Printer className="h-4 w-4 mr-1" />
                Print
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-1" />
                Share
              </Button>
              <Button variant="outline" size="sm" className="text-destructive">
                <Flag className="h-4 w-4 mr-1" />
                Flag Transaction
              </Button>
            </div>
          </div>
        )}

        {activeTab === "risk" && (
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Risk Assessment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      transaction.risk === "Low" ? "bg-success/10" :
                      transaction.risk === "Medium" ? "bg-warning/10" :
                      "bg-destructive/10"
                    }`}>
                      {transaction.risk === "Low" ? (
                        <ShieldCheck className={`h-5 w-5 text-success`} />
                      ) : transaction.risk === "Medium" ? (
                        <ShieldCheck className={`h-5 w-5 text-warning`} />
                      ) : (
                        <ShieldAlert className={`h-5 w-5 text-destructive`} />
                      )}
                    </div>
                    <div className="ml-3">
                      <p className="font-medium">Risk Level</p>
                      <p className={`text-sm ${riskColor}`}>{transaction.risk}</p>
                    </div>
                  </div>
                  <div>
                    <p className="font-medium text-right">Risk Score</p>
                    <p className={`text-2xl font-bold ${riskColor}`}>{transaction.riskScore || 50}/100</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Risk Score</span>
                    <span>{transaction.riskScore || 50}/100</span>
                  </div>
                  <Progress 
                    value={transaction.riskScore || 50} 
                    className="h-2"
                    indicatorClassName={
                      (transaction.riskScore || 50) > 80 ? "bg-destructive" : 
                      (transaction.riskScore || 50) > 60 ? "bg-warning" : 
                      "bg-success"
                    }
                  />
                </div>

                <Separator />

                <div>
                  <p className="font-medium mb-2">Risk Factors</p>
                  {transaction.riskFactors && transaction.riskFactors.length > 0 ? (
                    <div className="space-y-2">
                      {transaction.riskFactors.map((factor, index) => (
                        <div key={index} className="flex items-start gap-2 p-2 bg-muted/50 rounded-md">
                          <AlertCircle className="h-4 w-4 text-warning mt-0.5" />
                          <p className="text-sm">{factor}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No specific risk factors identified.</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Behavioral Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-primary" />
                      <p className="font-medium">Transaction Velocity</p>
                    </div>
                    <Badge variant="outline">Normal</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      <p className="font-medium">Geographic Pattern</p>
                    </div>
                    <Badge variant="outline">Expected</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-primary" />
                      <p className="font-medium">Amount Pattern</p>
                    </div>
                    <Badge variant={transaction.amount > 10000 ? "warning" : "outline"}>
                      {transaction.amount > 10000 ? "Unusual" : "Normal"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-2">
              <Button variant="outline">
                <BarChart3 className="h-4 w-4 mr-1" />
                View Full Analysis
              </Button>
              <Button>
                <Flag className="h-4 w-4 mr-1" />
                Create Alert
              </Button>
            </div>
          </div>
        )}

        {activeTab === "timeline" && (
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Transaction Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-primary" />
                      <div className="w-px h-12 bg-border mt-1" />
                    </div>
                    <div>
                      <p className="font-medium">Transaction Initiated</p>
                      <p className="text-sm text-muted-foreground">{transaction.date} {transaction.time}</p>
                      <p className="text-sm mt-1">Customer initiated {transaction.type.toLowerCase()} transaction</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-primary" />
                      <div className="w-px h-12 bg-border mt-1" />
                    </div>
                    <div>
                      <p className="font-medium">Risk Assessment</p>
                      <p className="text-sm text-muted-foreground">{transaction.date} {transaction.time}</p>
                      <p className="text-sm mt-1">Transaction risk assessed as {transaction.risk.toLowerCase()}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-primary" />
                      <div className="w-px h-12 bg-border mt-1" />
                    </div>
                    <div>
                      <p className="font-medium">Processing</p>
                      <p className="text-sm text-muted-foreground">{transaction.date} {transaction.time}</p>
                      <p className="text-sm mt-1">Transaction processed through payment network</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`w-3 h-3 rounded-full ${
                        transaction.status === "Completed" ? "bg-success" :
                        transaction.status === "Pending" ? "bg-warning" :
                        "bg-destructive"
                      }`} />
                    </div>
                    <div>
                      <p className="font-medium">Final Status</p>
                      <p className="text-sm text-muted-foreground">{transaction.date} {transaction.time}</p>
                      <p className={`text-sm mt-1 ${statusColor}`}>
                        Transaction {transaction.status.toLowerCase()}
                        {transaction.status === "Flagged" && " for review"}
                        {transaction.status === "Blocked" && " due to high risk"}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Related Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 border rounded-md">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-primary" />
                      <p className="font-medium">Transaction Receipt</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {transaction.status === "Flagged" && (
                    <div className="flex items-center justify-between p-3 border rounded-md">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-warning" />
                        <p className="font-medium">Risk Assessment Report</p>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}