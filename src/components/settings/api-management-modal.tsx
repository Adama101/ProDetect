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
  Key,
  PlugZap,
  Shield,
  Clock,
  Activity,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Eye,
  EyeOff,
  Copy,
  RefreshCw,
  Plus,
  Trash2,
  Settings,
  Save,
  Download,
  Upload,
  Filter,
  Search,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Zap,
  Lock,
  Unlock,
  Code,
  FileText,
  Globe,
  Network,
  Database,
  Server,
  Cpu,
  Layers,
  GitBranch,
  GitMerge,
  GitPullRequest,
  Terminal,
  Webhook,
  Wrench,
  Sliders,
  Calendar,
  ExternalLink,
} from "lucide-react";

interface ApiManagementModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Mock data for API management
const apiKeys = [
  {
    id: "key_001",
    name: "Production API Key",
    key: "pd_live_xxxxxxxxxxxxxxxxxxxxxxxxxxx",
    type: "Live",
    created: "2024-01-01",
    expires: "2025-01-01",
    lastUsed: "2 minutes ago",
    status: "active",
    permissions: ["read", "write", "admin"],
    restrictions: {
      ipAddresses: ["192.168.1.1", "10.0.0.1"],
      rateLimit: "1000 requests/min",
    },
    usageStats: {
      totalRequests: 1245789,
      lastMonth: 45678,
      avgResponseTime: "120ms",
    },
  },
  {
    id: "key_002",
    name: "Staging API Key",
    key: "pd_test_xxxxxxxxxxxxxxxxxxxxxxxxxxx",
    type: "Test",
    created: "2024-01-15",
    expires: "2025-01-15",
    lastUsed: "1 hour ago",
    status: "active",
    permissions: ["read", "write"],
    restrictions: {
      ipAddresses: ["192.168.1.2"],
      rateLimit: "5000 requests/min",
    },
    usageStats: {
      totalRequests: 567890,
      lastMonth: 23456,
      avgResponseTime: "85ms",
    },
  },
  {
    id: "key_003",
    name: "Development API Key",
    key: "pd_dev_xxxxxxxxxxxxxxxxxxxxxxxxxxx",
    type: "Development",
    created: "2024-01-20",
    expires: "2025-01-20",
    lastUsed: "3 days ago",
    status: "active",
    permissions: ["read"],
    restrictions: {
      ipAddresses: [],
      rateLimit: "10000 requests/min",
    },
    usageStats: {
      totalRequests: 123456,
      lastMonth: 12345,
      avgResponseTime: "65ms",
    },
  },
];

const apiEndpoints = [
  {
    id: "endpoint_001",
    path: "/api/customers",
    method: "GET",
    description: "Retrieve customer information",
    authentication: "Required",
    rateLimit: "1000/min",
    caching: "60 seconds",
    status: "active",
    version: "v1",
    deprecationDate: null,
    usageStats: {
      totalRequests: 567890,
      successRate: 99.8,
      avgResponseTime: "85ms",
    },
  },
  {
    id: "endpoint_002",
    path: "/api/transactions",
    method: "POST",
    description: "Create new transaction",
    authentication: "Required",
    rateLimit: "500/min",
    caching: "None",
    status: "active",
    version: "v1",
    deprecationDate: null,
    usageStats: {
      totalRequests: 345678,
      successRate: 99.5,
      avgResponseTime: "120ms",
    },
  },
  {
    id: "endpoint_003",
    path: "/api/alerts",
    method: "GET",
    description: "Retrieve alerts",
    authentication: "Required",
    rateLimit: "1000/min",
    caching: "30 seconds",
    status: "active",
    version: "v1",
    deprecationDate: null,
    usageStats: {
      totalRequests: 234567,
      successRate: 99.9,
      avgResponseTime: "95ms",
    },
  },
  {
    id: "endpoint_004",
    path: "/api/reports",
    method: "POST",
    description: "Generate compliance reports",
    authentication: "Required",
    rateLimit: "100/min",
    caching: "None",
    status: "active",
    version: "v1",
    deprecationDate: null,
    usageStats: {
      totalRequests: 123456,
      successRate: 99.7,
      avgResponseTime: "250ms",
    },
  },
];

const webhooks = [
  {
    id: "webhook_001",
    name: "Transaction Alert Webhook",
    url: "https://example.com/webhooks/transaction-alerts",
    events: ["transaction.flagged", "transaction.blocked"],
    status: "active",
    created: "2024-01-01",
    lastTriggered: "5 minutes ago",
    secretKey: "whsec_xxxxxxxxxxxxxxxxxxxxxxxx",
    retryPolicy: "3 attempts, exponential backoff",
    usageStats: {
      totalDeliveries: 12345,
      successRate: 99.8,
      avgResponseTime: "110ms",
    },
  },
  {
    id: "webhook_002",
    name: "Customer Update Webhook",
    url: "https://example.com/webhooks/customer-updates",
    events: ["customer.created", "customer.updated", "customer.risk_changed"],
    status: "active",
    created: "2024-01-15",
    lastTriggered: "1 hour ago",
    secretKey: "whsec_xxxxxxxxxxxxxxxxxxxxxxxx",
    retryPolicy: "3 attempts, exponential backoff",
    usageStats: {
      totalDeliveries: 8765,
      successRate: 99.5,
      avgResponseTime: "95ms",
    },
  },
];

const apiUsageMetrics = [
  { name: "Total Requests", value: "2.3M", trend: "up", change: "+12%" },
  { name: "Success Rate", value: "99.8%", trend: "stable", change: "0%" },
  { name: "Avg Response", value: "95ms", trend: "down", change: "-15ms" },
  { name: "Error Rate", value: "0.2%", trend: "down", change: "-0.1%" },
];

export function ApiManagementModal({ open, onOpenChange }: ApiManagementModalProps) {
  const [selectedApiKey, setSelectedApiKey] = useState(apiKeys[0]);
  const [showApiKey, setShowApiKey] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateKey = () => {
    setIsGenerating(true);
    setTimeout(() => setIsGenerating(false), 2000);
  };

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    // Add toast notification here
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Key className="h-6 w-6 text-primary" />
            API Management
          </DialogTitle>
          <DialogDescription>
            Manage API keys, endpoints, webhooks, and monitor API usage
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="keys" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="keys">API Keys</TabsTrigger>
            <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
            <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
            <TabsTrigger value="usage">Usage & Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="keys" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {apiUsageMetrics.map((metric, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Activity className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">{metric.name}</span>
                    </div>
                    <div className="text-2xl font-bold">{metric.value}</div>
                    <div className="flex items-center gap-1 text-xs">
                      {metric.trend === "up" ? (
                        <TrendingUp className="h-3 w-3 text-success" />
                      ) : metric.trend === "down" ? (
                        <TrendingDown className="h-3 w-3 text-success" />
                      ) : (
                        <div className="h-3 w-3" />
                      )}
                      <span className={metric.trend === "up" ? "text-success" : metric.trend === "down" ? "text-success" : "text-muted-foreground"}>
                        {metric.change}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">API Keys</h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-1" />
                  Filter
                </Button>
                <Button onClick={handleGenerateKey} disabled={isGenerating}>
                  {isGenerating ? (
                    <>
                      <Activity className="h-4 w-4 mr-1 animate-pulse" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-1" />
                      Generate New Key
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                {apiKeys.map((apiKey) => (
                  <Card 
                    key={apiKey.id} 
                    className={`cursor-pointer transition-all ${
                      selectedApiKey.id === apiKey.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setSelectedApiKey(apiKey)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold">{apiKey.name}</h4>
                            <Badge
                              variant={
                                apiKey.type === "Live"
                                  ? "destructive"
                                  : apiKey.type === "Test"
                                  ? "warning"
                                  : "secondary"
                              }
                            >
                              {apiKey.type}
                            </Badge>
                            {apiKey.status === "active" && (
                              <Badge variant="outline" className="text-success">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Active
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mb-3">
                            <code className="bg-muted px-2 py-1 rounded text-xs font-mono">
                              {showApiKey && selectedApiKey.id === apiKey.id
                                ? apiKey.key
                                : apiKey.key.substring(0, 12) + "..."}
                            </code>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (selectedApiKey.id === apiKey.id) {
                                  setShowApiKey(!showApiKey);
                                } else {
                                  setSelectedApiKey(apiKey);
                                  setShowApiKey(true);
                                }
                              }}
                            >
                              {showApiKey && selectedApiKey.id === apiKey.id ? (
                                <EyeOff className="h-3 w-3" />
                              ) : (
                                <Eye className="h-3 w-3" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopyKey(apiKey.key);
                              }}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                            <div>
                              <span>Created:</span>
                              <span className="ml-2 font-medium">{apiKey.created}</span>
                            </div>
                            <div>
                              <span>Expires:</span>
                              <span className="ml-2 font-medium">{apiKey.expires}</span>
                            </div>
                            <div>
                              <span>Last Used:</span>
                              <span className="ml-2 font-medium">{apiKey.lastUsed}</span>
                            </div>
                            <div>
                              <span>Permissions:</span>
                              <span className="ml-2 font-medium">{apiKey.permissions.join(", ")}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch checked={apiKey.status === "active"} />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                          >
                            <RefreshCw className="h-3 w-3 mr-1" />
                            Rotate
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
                    <CardTitle className="text-lg">Key Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">Key Name</Label>
                      <p className="text-sm text-muted-foreground">{selectedApiKey.name}</p>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium">Type</Label>
                      <p className="text-sm text-muted-foreground">{selectedApiKey.type}</p>
                    </div>

                    <div>
                      <Label className="text-sm font-medium">Permissions</Label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedApiKey.permissions.map((permission, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {permission}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium">IP Restrictions</Label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedApiKey.restrictions.ipAddresses.length > 0 ? (
                          selectedApiKey.restrictions.ipAddresses.map((ip, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {ip}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-xs text-muted-foreground">No IP restrictions</span>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium">Rate Limit</Label>
                      <p className="text-sm text-muted-foreground">{selectedApiKey.restrictions.rateLimit}</p>
                    </div>

                    <div>
                      <Label className="text-sm font-medium">Usage Statistics</Label>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Total Requests</span>
                          <span>{selectedApiKey.usageStats.totalRequests.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Last Month</span>
                          <span>{selectedApiKey.usageStats.lastMonth.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Avg Response Time</span>
                          <span>{selectedApiKey.usageStats.avgResponseTime}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Security Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="p-3 bg-warning/5 border border-warning/20 rounded">
                      <div className="flex items-start gap-2">
                        <Clock className="h-4 w-4 text-warning mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Key Rotation</p>
                          <p className="text-xs text-muted-foreground">
                            This key is 6 months old. Consider rotating for security.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 bg-primary/5 border border-primary/20 rounded">
                      <div className="flex items-start gap-2">
                        <Lock className="h-4 w-4 text-primary mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">IP Restrictions</p>
                          <p className="text-xs text-muted-foreground">
                            Add IP restrictions to enhance security.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="endpoints" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">API Endpoints</h3>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search endpoints..." className="pl-10 w-64" />
                </div>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-1" />
                  Export
                </Button>
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Endpoint</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Version</TableHead>
                  <TableHead>Authentication</TableHead>
                  <TableHead>Rate Limit</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {apiEndpoints.map((endpoint) => (
                  <TableRow key={endpoint.id}>
                    <TableCell className="font-mono text-xs">{endpoint.path}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          endpoint.method === "GET"
                            ? "outline"
                            : endpoint.method === "POST"
                            ? "default"
                            : endpoint.method === "PUT"
                            ? "secondary"
                            : "destructive"
                        }
                      >
                        {endpoint.method}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{endpoint.description}</TableCell>
                    <TableCell>{endpoint.version}</TableCell>
                    <TableCell>{endpoint.authentication}</TableCell>
                    <TableCell>{endpoint.rateLimit}</TableCell>
                    <TableCell>
                      <Badge
                        variant={endpoint.status === "active" ? "outline" : "secondary"}
                        className={endpoint.status === "active" ? "text-success" : ""}
                      >
                        {endpoint.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Code className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <BarChart3 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  API Documentation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Interactive API Reference</h4>
                    <p className="text-sm text-muted-foreground">
                      Comprehensive documentation for all API endpoints with interactive examples
                    </p>
                  </div>
                  <Button>
                    <ExternalLink className="h-4 w-4 mr-1" />
                    View Documentation
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="webhooks" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Webhooks</h3>
              <Button>
                <Plus className="h-4 w-4 mr-1" />
                Create Webhook
              </Button>
            </div>

            <div className="space-y-4">
              {webhooks.map((webhook) => (
                <Card key={webhook.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className="font-semibold">{webhook.name}</h4>
                          <Badge variant="outline" className="text-success">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Active
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <code className="bg-muted px-2 py-1 rounded text-xs font-mono truncate max-w-md">
                            {webhook.url}
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => handleCopyKey(webhook.url)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch checked={webhook.status === "active"} />
                        <Button variant="outline" size="sm">
                          <Settings className="h-3 w-3 mr-1" />
                          Configure
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div>
                        <Label className="text-xs font-medium">Events</Label>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {webhook.events.map((event, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {event}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Created:</span>
                          <span>{webhook.created}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Last Triggered:</span>
                          <span>{webhook.lastTriggered}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Success Rate:</span>
                          <span>{webhook.usageStats.successRate}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-3 w-3 mr-1" />
                          View Logs
                        </Button>
                        <Button variant="outline" size="sm">
                          <Terminal className="h-3 w-3 mr-1" />
                          Test Webhook
                        </Button>
                      </div>
                      <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                        <Trash2 className="h-3 w-3 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="usage" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Total Requests</span>
                  </div>
                  <div className="text-2xl font-bold">2.3M</div>
                  <div className="text-xs text-success">+12% this month</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <span className="text-sm font-medium">Success Rate</span>
                  </div>
                  <div className="text-2xl font-bold">99.8%</div>
                  <div className="text-xs text-success">+0.1% this month</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-warning" />
                    <span className="text-sm font-medium">Avg Response</span>
                  </div>
                  <div className="text-2xl font-bold">95ms</div>
                  <div className="text-xs text-success">-15ms this month</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <XCircle className="h-4 w-4 text-destructive" />
                    <span className="text-sm font-medium">Error Rate</span>
                  </div>
                  <div className="text-2xl font-bold">0.2%</div>
                  <div className="text-xs text-success">-0.1% this month</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  API Usage Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center border-2 border-dashed border-border rounded-lg">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">API usage analytics visualization</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Top Endpoints by Usage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {apiEndpoints.slice(0, 3).map((endpoint, index) => (
                      <div key={endpoint.id} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={
                                endpoint.method === "GET"
                                  ? "outline"
                                  : endpoint.method === "POST"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {endpoint.method}
                            </Badge>
                            <span className="font-mono text-xs">{endpoint.path}</span>
                          </div>
                          <span className="text-sm font-medium">
                            {endpoint.usageStats.totalRequests.toLocaleString()}
                          </span>
                        </div>
                        <Progress value={(endpoint.usageStats.totalRequests / 600000) * 100} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Response Time Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48 flex items-center justify-center border-2 border-dashed border-border rounded-lg">
                    <div className="text-center">
                      <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Response time distribution chart</p>
                    </div>
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
                  API Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label>Default Rate Limiting</Label>
                      <Select defaultValue="medium">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low (100 req/min)</SelectItem>
                          <SelectItem value="medium">Medium (1000 req/min)</SelectItem>
                          <SelectItem value="high">High (5000 req/min)</SelectItem>
                          <SelectItem value="unlimited">Unlimited</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>API Version Management</Label>
                      <Select defaultValue="all">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="latest">Latest Version Only</SelectItem>
                          <SelectItem value="all">Support All Versions</SelectItem>
                          <SelectItem value="latest-previous">Latest + Previous Version</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Default Authentication</Label>
                      <Select defaultValue="api-key">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="api-key">API Key</SelectItem>
                          <SelectItem value="oauth">OAuth 2.0</SelectItem>
                          <SelectItem value="jwt">JWT</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label>Security Settings</Label>
                      <div className="space-y-2 mt-2">
                        <div className="flex items-center space-x-2">
                          <Switch id="tls-enforcement" defaultChecked />
                          <Label htmlFor="tls-enforcement" className="text-sm">Enforce TLS 1.2+</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch id="cors-restrictions" defaultChecked />
                          <Label htmlFor="cors-restrictions" className="text-sm">CORS restrictions</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch id="ip-filtering" />
                          <Label htmlFor="ip-filtering" className="text-sm">IP filtering</Label>
                        </div>
                      </div>
                    </div>
                    <div>
                      <Label>Monitoring & Alerts</Label>
                      <div className="space-y-2 mt-2">
                        <div className="flex items-center space-x-2">
                          <Switch id="error-alerts" defaultChecked />
                          <Label htmlFor="error-alerts" className="text-sm">Error rate alerts</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch id="latency-alerts" defaultChecked />
                          <Label htmlFor="latency-alerts" className="text-sm">Latency alerts</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch id="usage-alerts" />
                          <Label htmlFor="usage-alerts" className="text-sm">Usage threshold alerts</Label>
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