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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Database,
  Link2,
  Activity,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Settings,
  Play,
  Pause,
  RotateCcw,
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
  PieChart,
  TrendingUp,
  TrendingDown,
  Sparkles,
  Lightbulb,
  Code,
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
  Server,
  HardDrive,
  Layers,
  Repeat,
  RefreshCw,
  Zap,
  Shield,
} from "lucide-react";

interface DataConnectorsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Mock data for data connectors
const connectors = [
  {
    id: "conn_001",
    name: "Core Banking System",
    type: "Database",
    provider: "Oracle",
    status: "connected",
    lastSync: "5 minutes ago",
    syncFrequency: "Real-time",
    dataTypes: ["Customers", "Accounts", "Transactions"],
    configuration: {
      host: "banking-db.example.com",
      port: "1521",
      database: "core_banking",
      username: "prodetect_service",
      encryptionEnabled: true,
      sslVerification: true,
    },
    metrics: {
      uptime: "99.98%",
      latency: "45ms",
      dataVolume: "2.3 GB/day",
      errorRate: "0.01%",
    },
  },
  {
    id: "conn_002",
    name: "Payment Gateway",
    type: "API",
    provider: "Paystack",
    status: "connected",
    lastSync: "2 minutes ago",
    syncFrequency: "Real-time",
    dataTypes: ["Transactions", "Payments", "Refunds"],
    configuration: {
      apiUrl: "https://api.paystack.com/v1",
      authType: "API Key",
      webhooksEnabled: true,
      retryPolicy: "Exponential backoff",
    },
    metrics: {
      uptime: "99.95%",
      latency: "120ms",
      dataVolume: "500 MB/day",
      errorRate: "0.05%",
    },
  },
  {
    id: "conn_003",
    name: "Sanctions Database",
    type: "API",
    provider: "Refinitiv",
    status: "connected",
    lastSync: "1 hour ago",
    syncFrequency: "Daily",
    dataTypes: ["Sanctions Lists", "PEP Data", "Adverse Media"],
    configuration: {
      apiUrl: "https://api.refinitiv.com/screening/v1",
      authType: "OAuth 2.0",
      caching: "24 hours",
      compressionEnabled: true,
    },
    metrics: {
      uptime: "99.99%",
      latency: "85ms",
      dataVolume: "1.2 GB/day",
      errorRate: "0.02%",
    },
  },
  {
    id: "conn_004",
    name: "Document Storage",
    type: "Object Storage",
    provider: "AWS S3",
    status: "warning",
    lastSync: "30 minutes ago",
    syncFrequency: "Continuous",
    dataTypes: ["KYC Documents", "Verification Records", "Audit Logs"],
    configuration: {
      region: "eu-west-1",
      bucket: "prodetect-documents",
      encryptionEnabled: true,
      versioning: true,
    },
    metrics: {
      uptime: "99.9%",
      latency: "65ms",
      dataVolume: "3.5 GB/day",
      errorRate: "0.1%",
    },
  },
];

const dataIntegrations = [
  {
    id: "int_001",
    name: "Customer Data Sync",
    source: "Core Banking System",
    destination: "ProDetect",
    status: "active",
    frequency: "Real-time",
    lastRun: "2 minutes ago",
    nextRun: "Real-time",
    recordsProcessed: 1245789,
    mappings: [
      { source: "customer_id", destination: "customer_id", transformation: "None" },
      { source: "first_name", destination: "first_name", transformation: "None" },
      { source: "last_name", destination: "last_name", transformation: "None" },
      { source: "dob", destination: "date_of_birth", transformation: "Date format" },
      { source: "risk_score", destination: "risk_score", transformation: "None" },
    ],
  },
  {
    id: "int_002",
    name: "Transaction Monitoring",
    source: "Payment Gateway",
    destination: "ProDetect",
    status: "active",
    frequency: "Real-time",
    lastRun: "1 minute ago",
    nextRun: "Real-time",
    recordsProcessed: 3456789,
    mappings: [
      { source: "transaction_id", destination: "transaction_id", transformation: "None" },
      { source: "amount", destination: "amount", transformation: "None" },
      { source: "currency", destination: "currency", transformation: "None" },
      { source: "customer_id", destination: "customer_id", transformation: "None" },
      { source: "timestamp", destination: "created_at", transformation: "Date format" },
    ],
  },
  {
    id: "int_003",
    name: "Sanctions Screening",
    source: "Sanctions Database",
    destination: "ProDetect",
    status: "active",
    frequency: "Daily",
    lastRun: "1 hour ago",
    nextRun: "Tomorrow, 00:00",
    recordsProcessed: 567890,
    mappings: [
      { source: "entity_id", destination: "watchlist_id", transformation: "None" },
      { source: "entity_name", destination: "entity_name", transformation: "None" },
      { source: "entity_type", destination: "entity_type", transformation: "None" },
      { source: "list_type", destination: "list_type", transformation: "None" },
      { source: "country", destination: "country", transformation: "None" },
    ],
  },
];

const dataTransformations = [
  {
    id: "transform_001",
    name: "Customer Risk Enrichment",
    description: "Enrich customer data with risk scores from multiple sources",
    type: "Enrichment",
    status: "active",
    inputs: ["Core Banking System", "Sanctions Database"],
    output: "ProDetect",
    logic: "Custom JavaScript",
    performance: {
      avgProcessingTime: "120ms",
      recordsProcessed: 45678,
      errorRate: "0.02%",
    },
  },
  {
    id: "transform_002",
    name: "Transaction Categorization",
    description: "Categorize transactions using ML-based pattern recognition",
    type: "ML Processing",
    status: "active",
    inputs: ["Payment Gateway"],
    output: "ProDetect",
    logic: "ML Model",
    performance: {
      avgProcessingTime: "85ms",
      recordsProcessed: 123456,
      errorRate: "0.05%",
    },
  },
  {
    id: "transform_003",
    name: "Address Standardization",
    description: "Standardize and validate customer addresses",
    type: "Data Cleansing",
    status: "active",
    inputs: ["Core Banking System"],
    output: "ProDetect",
    logic: "Custom Python",
    performance: {
      avgProcessingTime: "65ms",
      recordsProcessed: 34567,
      errorRate: "0.01%",
    },
  },
];

export function DataConnectorsModal({ open, onOpenChange }: DataConnectorsModalProps) {
  const [selectedConnector, setSelectedConnector] = useState(connectors[0]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleConnect = () => {
    setIsConnecting(true);
    setTimeout(() => setIsConnecting(false), 2000);
  };

  const handleSync = (connectorId: string) => {
    setIsSyncing(true);
    setTimeout(() => setIsSyncing(false), 3000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Link2 className="h-6 w-6 text-primary" />
            Data Connectors & Integrations
          </DialogTitle>
          <DialogDescription>
            Configure and manage connections to external systems, data sources, and third-party services
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="connectors" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="connectors">Data Sources</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="transformations">Transformations</TabsTrigger>
            <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="connectors" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Connected Data Sources</h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-1" />
                  Filter
                </Button>
                <Button onClick={handleConnect} disabled={isConnecting}>
                  {isConnecting ? (
                    <>
                      <Activity className="h-4 w-4 mr-1 animate-pulse" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-1" />
                      Add Connection
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                {connectors.map((connector) => (
                  <Card 
                    key={connector.id} 
                    className={`cursor-pointer transition-all ${
                      selectedConnector.id === connector.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setSelectedConnector(connector)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold">{connector.name}</h4>
                            <Badge variant="outline">{connector.type}</Badge>
                            <Badge
                              variant={
                                connector.status === "connected"
                                  ? "outline"
                                  : connector.status === "warning"
                                  ? "warning"
                                  : "destructive"
                              }
                              className={
                                connector.status === "connected" ? "text-success" : ""
                              }
                            >
                              {connector.status === "connected" ? (
                                <CheckCircle className="h-3 w-3 mr-1" />
                              ) : connector.status === "warning" ? (
                                <AlertTriangle className="h-3 w-3 mr-1" />
                              ) : (
                                <XCircle className="h-3 w-3 mr-1" />
                              )}
                              {connector.status.charAt(0).toUpperCase() + connector.status.slice(1)}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            {connector.provider} • {connector.syncFrequency} sync
                          </p>
                          <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                            <div>
                              <span>Last Sync:</span>
                              <span className="ml-2 font-medium">{connector.lastSync}</span>
                            </div>
                            <div>
                              <span>Uptime:</span>
                              <span className="ml-2 font-medium">{connector.metrics.uptime}</span>
                            </div>
                            <div>
                              <span>Latency:</span>
                              <span className="ml-2 font-medium">{connector.metrics.latency}</span>
                            </div>
                            <div>
                              <span>Error Rate:</span>
                              <span className="ml-2 font-medium">{connector.metrics.errorRate}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch checked={connector.status === "connected"} />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSync(connector.id);
                            }}
                            disabled={isSyncing}
                          >
                            {isSyncing ? (
                              <>
                                <Activity className="h-3 w-3 mr-1 animate-pulse" />
                                Syncing...
                              </>
                            ) : (
                              <>
                                <RefreshCw className="h-3 w-3 mr-1" />
                                Sync Now
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Connection Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">Connection Type</Label>
                      <p className="text-sm text-muted-foreground">{selectedConnector.type} ({selectedConnector.provider})</p>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium">Sync Frequency</Label>
                      <p className="text-sm text-muted-foreground">{selectedConnector.syncFrequency}</p>
                    </div>

                    <div>
                      <Label className="text-sm font-medium">Data Types</Label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedConnector.dataTypes.map((dataType, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {dataType}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium">Configuration</Label>
                      <div className="space-y-1 text-sm text-muted-foreground mt-1">
                        {Object.entries(selectedConnector.configuration).map(([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                            <span className="font-medium">
                              {typeof value === 'boolean' 
                                ? value ? 'Yes' : 'No'
                                : key.includes('password') || key.includes('key') || key.includes('secret')
                                  ? '••••••••'
                                  : value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium">Performance Metrics</Label>
                      <div className="space-y-2 mt-2">
                        <div className="flex justify-between text-sm">
                          <span>Uptime</span>
                          <span>{selectedConnector.metrics.uptime}</span>
                        </div>
                        <Progress value={parseFloat(selectedConnector.metrics.uptime)} className="h-2" />
                        <div className="flex justify-between text-sm">
                          <span>Error Rate</span>
                          <span>{selectedConnector.metrics.errorRate}</span>
                        </div>
                        <Progress value={parseFloat(selectedConnector.metrics.errorRate) * 100} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Lightbulb className="h-4 w-4" />
                      Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="p-3 bg-primary/5 border border-primary/20 rounded">
                      <div className="flex items-start gap-2">
                        <Zap className="h-4 w-4 text-primary mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Performance Optimization</p>
                          <p className="text-xs text-muted-foreground">
                            Enable connection pooling to improve latency by up to 25%
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 bg-warning/5 border border-warning/20 rounded">
                      <div className="flex items-start gap-2">
                        <Shield className="h-4 w-4 text-warning mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Security Enhancement</p>
                          <p className="text-xs text-muted-foreground">
                            Rotate connection credentials for improved security
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="integrations" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Data Integrations</h3>
              <Button>
                <Plus className="h-4 w-4 mr-1" />
                New Integration
              </Button>
            </div>

            <div className="space-y-4">
              {dataIntegrations.map((integration) => (
                <Card key={integration.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className="font-semibold">{integration.name}</h4>
                          <Badge
                            variant="outline"
                            className="text-success"
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Active
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{integration.source}</span>
                          <ArrowRight className="h-3 w-3" />
                          <span>{integration.destination}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch checked={integration.status === "active"} />
                        <Button variant="outline" size="sm">
                          <Settings className="h-3 w-3 mr-1" />
                          Configure
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                      <div>
                        <Label className="text-xs font-medium">Frequency</Label>
                        <p className="text-sm">{integration.frequency}</p>
                      </div>
                      <div>
                        <Label className="text-xs font-medium">Last Run</Label>
                        <p className="text-sm">{integration.lastRun}</p>
                      </div>
                      <div>
                        <Label className="text-xs font-medium">Records Processed</Label>
                        <p className="text-sm">{integration.recordsProcessed.toLocaleString()}</p>
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs font-medium mb-2 block">Field Mappings</Label>
                      <div className="overflow-x-auto">
                        <Table className="w-full">
                          <TableHeader>
                            <TableRow>
                              <TableHead>Source Field</TableHead>
                              <TableHead>Destination Field</TableHead>
                              <TableHead>Transformation</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {integration.mappings.map((mapping, index) => (
                              <TableRow key={index}>
                                <TableCell className="font-mono text-xs">{mapping.source}</TableCell>
                                <TableCell className="font-mono text-xs">{mapping.destination}</TableCell>
                                <TableCell>{mapping.transformation}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="transformations" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Data Transformations</h3>
              <Button>
                <Plus className="h-4 w-4 mr-1" />
                New Transformation
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dataTransformations.map((transformation) => (
                <Card key={transformation.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{transformation.name}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">{transformation.description}</p>
                      </div>
                      <Badge variant="outline">{transformation.type}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Status:</span>
                        <Badge
                          variant="outline"
                          className="ml-2 text-success"
                        >
                          Active
                        </Badge>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Logic:</span>
                        <span className="ml-2 font-medium">{transformation.logic}</span>
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs font-medium">Data Flow</Label>
                      <div className="flex items-center gap-2 mt-1 text-sm">
                        <div className="flex flex-wrap gap-1">
                          {transformation.inputs.map((input, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {input}
                            </Badge>
                          ))}
                        </div>
                        <ArrowRight className="h-3 w-3 mx-1" />
                        <Badge variant="outline" className="text-xs">
                          {transformation.output}
                        </Badge>
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs font-medium">Performance</Label>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Avg Processing:</span>
                          <span>{transformation.performance.avgProcessingTime}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Records:</span>
                          <span>{transformation.performance.recordsProcessed.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Error Rate:</span>
                          <span>{transformation.performance.errorRate}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="monitoring" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Data Processed</span>
                  </div>
                  <div className="text-2xl font-bold">7.5 TB</div>
                  <div className="text-xs text-success">+12% this month</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <span className="text-sm font-medium">Sync Success</span>
                  </div>
                  <div className="text-2xl font-bold">99.8%</div>
                  <div className="text-xs text-success">+0.1% this month</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-warning" />
                    <span className="text-sm font-medium">Avg Latency</span>
                  </div>
                  <div className="text-2xl font-bold">78ms</div>
                  <div className="text-xs text-success">-15ms this month</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <XCircle className="h-4 w-4 text-destructive" />
                    <span className="text-sm font-medium">Error Rate</span>
                  </div>
                  <div className="text-2xl font-bold">0.05%</div>
                  <div className="text-xs text-success">-0.02% this month</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Data Flow Monitoring
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center border-2 border-dashed border-border rounded-lg">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Data flow visualization</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Recent Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 border rounded flex items-start gap-3">
                      <AlertTriangle className="h-4 w-4 text-warning mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">High Latency Detected</p>
                        <p className="text-xs text-muted-foreground">Document Storage connector experiencing increased latency</p>
                        <p className="text-xs text-muted-foreground mt-1">30 minutes ago</p>
                      </div>
                    </div>
                    <div className="p-3 border rounded flex items-start gap-3">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Issue Resolved</p>
                        <p className="text-xs text-muted-foreground">Payment Gateway connection restored</p>
                        <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                      </div>
                    </div>
                    <div className="p-3 border rounded flex items-start gap-3">
                      <XCircle className="h-4 w-4 text-destructive mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Sync Failure</p>
                        <p className="text-xs text-muted-foreground">Sanctions Database sync failed due to API timeout</p>
                        <p className="text-xs text-muted-foreground mt-1">1 day ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    System Health
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {connectors.map((connector) => (
                      <div key={connector.id} className="flex items-center justify-between p-3 border rounded">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${
                            connector.status === "connected" ? 'bg-success' : 
                            connector.status === "warning" ? 'bg-warning' : 'bg-destructive'
                          }`} />
                          <span className="font-medium text-sm">{connector.name}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Uptime: {connector.metrics.uptime}</span>
                          <span>Latency: {connector.metrics.latency}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Global Connection Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label>Default Sync Frequency</Label>
                      <Select defaultValue="realtime">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="realtime">Real-time</SelectItem>
                          <SelectItem value="hourly">Hourly</SelectItem>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Connection Timeout</Label>
                      <Select defaultValue="30">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="10">10 seconds</SelectItem>
                          <SelectItem value="30">30 seconds</SelectItem>
                          <SelectItem value="60">60 seconds</SelectItem>
                          <SelectItem value="120">120 seconds</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Retry Policy</Label>
                      <Select defaultValue="exponential">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">No Retry</SelectItem>
                          <SelectItem value="fixed">Fixed Interval</SelectItem>
                          <SelectItem value="exponential">Exponential Backoff</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label>Security Settings</Label>
                      <div className="space-y-2 mt-2">
                        <div className="flex items-center space-x-2">
                          <Switch id="encryption" defaultChecked />
                          <Label htmlFor="encryption" className="text-sm">Enforce encryption for all connections</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch id="certificate-validation" defaultChecked />
                          <Label htmlFor="certificate-validation" className="text-sm">Validate SSL certificates</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch id="credential-rotation" />
                          <Label htmlFor="credential-rotation" className="text-sm">Automatic credential rotation</Label>
                        </div>
                      </div>
                    </div>
                    <div>
                      <Label>Monitoring & Alerts</Label>
                      <div className="space-y-2 mt-2">
                        <div className="flex items-center space-x-2">
                          <Switch id="latency-alerts" defaultChecked />
                          <Label htmlFor="latency-alerts" className="text-sm">Latency threshold alerts</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch id="error-rate-alerts" defaultChecked />
                          <Label htmlFor="error-rate-alerts" className="text-sm">Error rate alerts</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch id="sync-failure-alerts" defaultChecked />
                          <Label htmlFor="sync-failure-alerts" className="text-sm">Sync failure alerts</Label>
                        </div>
                      </div>
                    </div>
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