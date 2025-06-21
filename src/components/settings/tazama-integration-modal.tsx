"use client";

import { useState, useEffect } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PlugZap,
  Zap,
  Brain,
  Target,
  Activity,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Settings,
  Save,
  Download,
  Upload,
  Plus,
  Edit,
  Eye,
  Trash2,
  Filter,
  Search,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Sparkles,
  Lightbulb,
  Code,
  Database,
  Network,
  Cpu,
  Globe,
  Calendar,
  ArrowRight,
  Star,
  ThumbsUp,
  ThumbsDown,
  Flag,
  Bell,
  Mail,
  Phone,
  MessageSquare,
  FileText,
  Workflow,
  GitBranch,
  Timer,
  Hash,
  AtSign,
  Percent,
  Lock,
  Unlock,
  Key,
  Copy,
  ExternalLink,
  RefreshCw,
  Loader2,
  Shield,
} from "lucide-react";
import { useTazamaHealth, useProcessTransaction, useBatchProcessTransactions } from "@/hooks/use-tazama";

interface TazamaIntegrationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TazamaIntegrationModal({ open, onOpenChange }: TazamaIntegrationModalProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [testTransactionId, setTestTransactionId] = useState("");
  const [batchTransactionIds, setBatchTransactionIds] = useState("");

  const {
    data: healthData,
    isLoading: healthLoading,
    error: healthError,
    fetchHealth
  } = useTazamaHealth();

  const {
    isLoading: processingTransaction,
    processTransaction
  } = useProcessTransaction();

  const {
    isLoading: processingBatch,
    batchProcessTransactions
  } = useBatchProcessTransactions();

  // Fetch health status when modal opens
  useEffect(() => {
    if (open) {
      fetchHealth();
    }
  }, [open, fetchHealth]);

  const handleTestTransaction = async () => {
    if (!testTransactionId) return;
    await processTransaction(testTransactionId);
  };

  const handleBatchProcess = async () => {
    if (!batchTransactionIds) return;
    const ids = batchTransactionIds.split(',').map(id => id.trim());
    await batchProcessTransactions(ids);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <PlugZap className="h-6 w-6 text-primary" />
            Tazama Rules Engine Integration
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="configuration">Configuration</TabsTrigger>
            <TabsTrigger value="testing">Testing</TabsTrigger>
            <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Connection Status</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {healthLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    ) : healthData ? (
                      <CheckCircle className="h-5 w-5 text-success" />
                    ) : (
                      <XCircle className="h-5 w-5 text-destructive" />
                    )}
                    <span className="text-lg font-bold">
                      {healthLoading ? "Checking..." :
                        healthData ? "Connected" : "Disconnected"}
                    </span>
                  </div>
                  {healthData && (
                    <div className="text-xs text-muted-foreground mt-1">
                      Version: {healthData.version}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Processed Transactions</span>
                  </div>
                  <div className="text-2xl font-bold">0</div>
                  <div className="flex items-center gap-1 text-xs text-success">
                    <TrendingUp className="h-3 w-3" />
                    0% this week
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Detection Rate</span>
                  </div>
                  <div className="text-2xl font-bold">0%</div>
                  <div className="flex items-center gap-1 text-xs text-success">
                    <TrendingUp className="h-3 w-3" />
                    0.8s% this month
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Avg Response Time</span>
                  </div>
                  <div className="text-2xl font-bold">0ms</div>
                  <div className="flex items-center gap-1 text-xs text-success">
                    <TrendingDown className="h-3 w-3" />
                    0ms this month
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PlugZap className="h-5 w-5" />
                  About Tazama Rules Engine
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                Tazama is a dynamic, modular compliance framework designed to help financial institutions in Africa implement, 
                manage, and scale anti-money laundering (AML) rules and risk monitoring. It provides a customizable library of compliance rule templates, 
                detailed documentation, and seamless integration into transaction monitoring systems, making it easier for banks and FinTechs to adapt to 
                evolving regulatory landscapes across jurisdictions.
                </p>

                
                <div className="flex justify-center mt-4">
                  <Button variant="outline" className="mr-2">
                    <FileText className="h-4 w-4 mr-2" />
                    Documentation
                  </Button>
                  <Button>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Visit Tazama Website
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="configuration" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  API Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="api-url">API URL</Label>
                    <Input
                      id="api-url"
                      placeholder="https://api.tazama.io/v1"
                      defaultValue="https://api.tazama.io/v1"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="api-key">API Key</Label>
                    <div className="flex">
                      <Input
                        id="api-key"
                        type="password"
                        placeholder="Enter your API key"
                        defaultValue="••••••••••••••••••••••••••••••"
                        className="rounded-r-none"
                      />
                      <Button variant="outline" className="rounded-l-none">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="environment">Environment</Label>
                  <Select defaultValue="development">
                    <SelectTrigger id="environment">
                      <SelectValue placeholder="Select environment" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="development">Development</SelectItem>
                      <SelectItem value="production">Production</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="timeout">Request Timeout (ms)</Label>
                    <span className="text-sm">5000</span>
                  </div>
                  <Input
                    id="timeout"
                    type="range"
                    min="1000"
                    max="10000"
                    step="1000"
                    defaultValue="5000"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>1s</span>
                    <span>5s</span>
                    <span>10s</span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h3 className="font-medium">Integration Settings</h3>

                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-primary" />
                      <Label htmlFor="real-time-processing" className="font-normal">Real-time Transaction Processing</Label>
                    </div>
                    <Switch id="real-time-processing" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-2">
                      <Brain className="h-4 w-4 text-primary" />
                      <Label htmlFor="ai-enhancement" className="font-normal">AI-Enhanced Rule Evaluation</Label>
                    </div>
                    <Switch id="ai-enhancement" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4 text-primary" />
                      <Label htmlFor="alert-generation" className="font-normal">Automatic Alert Generation</Label>
                    </div>
                    <Switch id="alert-generation" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-2">
                      <Database className="h-4 w-4 text-primary" />
                      <Label htmlFor="customer-sync" className="font-normal">Customer Data Synchronization</Label>
                    </div>
                    <Switch id="customer-sync" defaultChecked />
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Test Connection
                  </Button>
                  <Button>
                    <Save className="h-4 w-4 mr-2" />
                    Save Configuration
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="testing" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Test Single Transaction
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="transaction-id">Transaction ID</Label>
                    <Input
                      id="transaction-id"
                      placeholder="Enter transaction ID"
                      value={testTransactionId}
                      onChange={(e) => setTestTransactionId(e.target.value)}
                    />
                  </div>

                  <Button
                    onClick={handleTestTransaction}
                    disabled={processingTransaction || !testTransactionId}
                    className="w-full"
                  >
                    {processingTransaction ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Zap className="h-4 w-4 mr-2" />
                        Process Transaction
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Batch Process Transactions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="batch-transaction-ids">Transaction IDs (comma-separated)</Label>
                    <Textarea
                      id="batch-transaction-ids"
                      placeholder="Enter transaction IDs separated by commas"
                      value={batchTransactionIds}
                      onChange={(e) => setBatchTransactionIds(e.target.value)}
                      rows={3}
                    />
                  </div>

                  <Button
                    onClick={handleBatchProcess}
                    disabled={processingBatch || !batchTransactionIds}
                    className="w-full"
                  >
                    {processingBatch ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Processing Batch...
                      </>
                    ) : (
                      <>
                        <Database className="h-4 w-4 mr-2" />
                        Process Batch
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Test Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 border-2 border-dashed border-border rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Process a transaction to see results here</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="monitoring" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Transaction Volume
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48 border-2 border-dashed border-border rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <BarChart3 className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground text-sm">Transaction volume chart</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Detection Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48 border-2 border-dashed border-border rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <BarChart3 className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground text-sm">Detection rate chart</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Response Time
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48 border-2 border-dashed border-border rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <BarChart3 className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground text-sm">Response time chart</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  System Health
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>API Uptime</span>
                      <span>0%</span>
                    </div>
                    <Progress value={0} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Rule Engine Performance</span>
                      <span>0%</span>
                    </div>
                    <Progress value={0} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Data Synchronization</span>
                      <span>0%</span>
                    </div>
                    <Progress value={0} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Error Rate</span>
                      <span>0%</span>
                    </div>
                    <Progress value={0} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="logs" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Integration Logs
                </CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search logs..." className="pl-10 w-64" />
                  </div>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-1" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    Export
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-medium">Timestamp</th>
                          <th className="text-left py-3 px-4 font-medium">Level</th>
                          <th className="text-left py-3 px-4 font-medium">Event</th>
                          <th className="text-left py-3 px-4 font-medium">Transaction ID</th>
                          <th className="text-left py-3 px-4 font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          {
                            timestamp: "2023-07-15 14:32:45",
                            level: "INFO",
                            event: "Transaction Processed",
                            transactionId: "TXN001",
                            status: "Success"
                          },
                          {
                            timestamp: "2023-07-15 14:30:12",
                            level: "WARNING",
                            event: "Rule Execution Delayed",
                            transactionId: "TXN002",
                            status: "Warning"
                          },
                          {
                            timestamp: "2023-07-15 14:28:56",
                            level: "ERROR",
                            event: "API Connection Failed",
                            transactionId: "N/A",
                            status: "Error"
                          },
                          {
                            timestamp: "2023-07-15 14:25:33",
                            level: "INFO",
                            event: "Customer Data Synced",
                            transactionId: "N/A",
                            status: "Success"
                          },
                          {
                            timestamp: "2023-07-15 14:20:18",
                            level: "INFO",
                            event: "Transaction Processed",
                            transactionId: "TXN003",
                            status: "Success"
                          },
                        ].map((log, index) => (
                          <tr key={index} className="border-b hover:bg-muted/50">
                            <td className="py-3 px-4 text-sm">{log.timestamp}</td>
                            <td className="py-3 px-4 text-sm">
                              <Badge variant={
                                log.level === "ERROR" ? "destructive" :
                                  log.level === "WARNING" ? "warning" :
                                    "outline"
                              }>
                                {log.level}
                              </Badge>
                            </td>
                            <td className="py-3 px-4 text-sm">{log.event}</td>
                            <td className="py-3 px-4 text-sm font-mono">{log.transactionId}</td>
                            <td className="py-3 px-4 text-sm">
                              <span className={`px-2 py-1 rounded-full text-xs ${log.status === "Error" ? "bg-destructive/10 text-destructive" :
                                log.status === "Warning" ? "bg-warning/10 text-warning" :
                                  "bg-success/10 text-success"
                                }`}>
                                {log.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button>
            <Save className="h-4 w-4 mr-1" />
            Save Configuration
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}