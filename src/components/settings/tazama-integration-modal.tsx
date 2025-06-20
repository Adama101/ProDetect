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
  Zap,
  Brain,
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
  Server,
  HardDrive,
  Layers,
  Repeat,
  Shield,
  Loader2,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface TazamaIntegrationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TazamaIntegrationModal({
  open,
  onOpenChange,
}: TazamaIntegrationModalProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<"connected" | "disconnected" | "error">("disconnected");
  const [tazamaVersion, setTazamaVersion] = useState<string>("");
  const [apiKey, setApiKey] = useState<string>("");
  const [apiUrl, setApiUrl] = useState<string>("https://api.tazama.io/v1");
  const [syncSettings, setSyncSettings] = useState({
    autoSyncCustomers: true,
    autoProcessTransactions: true,
    syncInterval: "realtime",
    retryFailedSync: true,
    maxRetries: 3,
  });
  const { toast } = useToast();

  // Simulated data for the UI
  const syncStats = {
    customersTotal: 1245,
    customersSynced: 1245,
    transactionsProcessed: 45678,
    alertsGenerated: 156,
    lastSyncTime: "2 minutes ago",
    syncSuccess: 99.8,
  };

  const recentSyncActivity = [
    { id: "sync001", type: "Customer Sync", status: "success", items: 50, timestamp: "2 minutes ago" },
    { id: "sync002", type: "Transaction Processing", status: "success", items: 120, timestamp: "5 minutes ago" },
    { id: "sync003", type: "Rule Sync", status: "success", items: 15, timestamp: "1 hour ago" },
    { id: "sync004", type: "Customer Sync", status: "error", items: 2, timestamp: "2 hours ago" },
  ];

  const ruleStats = {
    totalRules: 25,
    activeRules: 22,
    lastRuleSync: "1 hour ago",
    ruleExecutions: 12567,
    alertsGenerated: 342,
    falsePositiveRate: 3.2,
  };

  // Check connection status on open
  useEffect(() => {
    if (open) {
      checkConnectionStatus();
    }
  }, [open]);

  const checkConnectionStatus = async () => {
    try {
      setIsConnecting(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real implementation, this would be an actual API call
      // const response = await fetch('/api/tazama/health');
      // const data = await response.json();
      
      // Simulate successful connection
      setConnectionStatus("connected");
      setIsConnected(true);
      setTazamaVersion("2.5.1");
      setIsConnecting(false);
    } catch (error) {
      console.error("Error checking Tazama connection:", error);
      setConnectionStatus("error");
      setIsConnected(false);
      setIsConnecting(false);
    }
  };

  const handleConnect = async () => {
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please enter your Tazama API key to connect.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsConnecting(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real implementation, this would be an actual API call to validate and save the credentials
      // const response = await fetch('/api/tazama/connect', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ apiKey, apiUrl }),
      // });
      // const data = await response.json();
      
      setConnectionStatus("connected");
      setIsConnected(true);
      setTazamaVersion("2.5.1");
      
      toast({
        title: "Connection Successful",
        description: "Successfully connected to Tazama Rules Engine.",
      });
    } catch (error) {
      console.error("Error connecting to Tazama:", error);
      setConnectionStatus("error");
      setIsConnected(false);
      
      toast({
        title: "Connection Failed",
        description: "Failed to connect to Tazama Rules Engine. Please check your credentials.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      setIsConnecting(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real implementation, this would be an actual API call
      // const response = await fetch('/api/tazama/disconnect', { method: 'POST' });
      
      setConnectionStatus("disconnected");
      setIsConnected(false);
      setTazamaVersion("");
      
      toast({
        title: "Disconnected",
        description: "Successfully disconnected from Tazama Rules Engine.",
      });
    } catch (error) {
      console.error("Error disconnecting from Tazama:", error);
      
      toast({
        title: "Disconnect Failed",
        description: "Failed to disconnect from Tazama Rules Engine.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleSyncNow = async () => {
    try {
      setIsSyncing(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // In a real implementation, this would be an actual API call
      // const response = await fetch('/api/tazama/sync', { method: 'POST' });
      
      toast({
        title: "Sync Completed",
        description: "Successfully synced data with Tazama Rules Engine.",
      });
    } catch (error) {
      console.error("Error syncing with Tazama:", error);
      
      toast({
        title: "Sync Failed",
        description: "Failed to sync data with Tazama Rules Engine.",
        variant: "destructive",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSaveSettings = () => {
    // In a real implementation, this would save the settings to the backend
    toast({
      title: "Settings Saved",
      description: "Tazama integration settings have been updated.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Zap className="h-6 w-6 text-primary" />
            Tazama Rules Engine Integration
          </DialogTitle>
          <DialogDescription>
            Configure and manage the integration with Tazama Rules Engine for advanced data processing and rule evaluation
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="connection">Connection</TabsTrigger>
            <TabsTrigger value="data-sync">Data Sync</TabsTrigger>
            <TabsTrigger value="rules">Rules</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Connection Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {connectionStatus === "connected" ? (
                        <CheckCircle className="h-5 w-5 text-success" />
                      ) : connectionStatus === "error" ? (
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                      ) : (
                        <XCircle className="h-5 w-5 text-muted-foreground" />
                      )}
                      <div>
                        <p className="font-medium">
                          {connectionStatus === "connected"
                            ? "Connected"
                            : connectionStatus === "error"
                            ? "Connection Error"
                            : "Disconnected"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {connectionStatus === "connected"
                            ? `Tazama Rules Engine v${tazamaVersion}`
                            : "Not connected to Tazama"}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={isConnected ? handleDisconnect : () => setActiveTab("connection")}
                      disabled={isConnecting}
                    >
                      {isConnecting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                          Connecting...
                        </>
                      ) : isConnected ? (
                        "Disconnect"
                      ) : (
                        "Connect"
                      )}
                    </Button>
                  </div>

                  {isConnected && (
                    <>
                      <Separator />
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>API Health</span>
                          <span className="text-success">Operational</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Last Heartbeat</span>
                          <span>2 minutes ago</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Response Time</span>
                          <span>124ms</span>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Sync Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isConnected ? (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Customers Synced</p>
                          <p className="font-medium">{syncStats.customersSynced} / {syncStats.customersTotal}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Transactions Processed</p>
                          <p className="font-medium">{syncStats.transactionsProcessed.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Alerts Generated</p>
                          <p className="font-medium">{syncStats.alertsGenerated}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Last Sync</p>
                          <p className="font-medium">{syncStats.lastSyncTime}</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Sync Success Rate</span>
                          <span>{syncStats.syncSuccess}%</span>
                        </div>
                        <Progress value={syncStats.syncSuccess} className="h-2" />
                      </div>

                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={handleSyncNow}
                        disabled={isSyncing}
                      >
                        {isSyncing ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                            Syncing...
                          </>
                        ) : (
                          <>
                            <RefreshCw className="h-4 w-4 mr-1" />
                            Sync Now
                          </>
                        )}
                      </Button>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-32 text-center">
                      <AlertTriangle className="h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">Not connected to Tazama</p>
                      <p className="text-sm text-muted-foreground mt-1">Connect to view sync status</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {isConnected && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Recent Sync Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Items</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Timestamp</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {recentSyncActivity.map((activity) => (
                          <TableRow key={activity.id}>
                            <TableCell className="font-medium">{activity.id}</TableCell>
                            <TableCell>{activity.type}</TableCell>
                            <TableCell>{activity.items}</TableCell>
                            <TableCell>
                              <Badge
                                variant={activity.status === "success" ? "outline" : "destructive"}
                                className={activity.status === "success" ? "text-success" : ""}
                              >
                                {activity.status === "success" ? (
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                ) : (
                                  <XCircle className="h-3 w-3 mr-1" />
                                )}
                                {activity.status === "success" ? "Success" : "Failed"}
                              </Badge>
                            </TableCell>
                            <TableCell>{activity.timestamp}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Rule Execution Statistics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Total Rules</p>
                        <div className="flex items-center gap-2">
                          <p className="text-2xl font-bold">{ruleStats.totalRules}</p>
                          <Badge variant="outline" className="text-success">
                            {ruleStats.activeRules} Active
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">Last synced {ruleStats.lastRuleSync}</p>
                      </div>

                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Rule Executions</p>
                        <p className="text-2xl font-bold">{ruleStats.ruleExecutions.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Resulting in {ruleStats.alertsGenerated} alerts</p>
                      </div>

                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">False Positive Rate</p>
                        <div className="flex items-center gap-2">
                          <p className="text-2xl font-bold">{ruleStats.falsePositiveRate}%</p>
                          <Badge variant="outline" className="text-success">
                            <TrendingDown className="h-3 w-3 mr-1" />
                            -0.8%
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">Compared to last month</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          <TabsContent value="connection" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tazama Connection Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="api-key">API Key</Label>
                    <div className="flex gap-2">
                      <Input
                        id="api-key"
                        type="password"
                        placeholder="Enter your Tazama API key"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                      />
                      <Button variant="outline" size="icon" onClick={() => setApiKey("")}>
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Your Tazama API key can be found in your Tazama dashboard under API settings.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="api-url">API URL</Label>
                    <Input
                      id="api-url"
                      placeholder="https://api.tazama.io/v1"
                      value={apiUrl}
                      onChange={(e) => setApiUrl(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      The base URL for the Tazama API. Leave as default unless instructed otherwise.
                    </p>
                  </div>

                  <div className="flex justify-end">
                    <Button onClick={handleConnect} disabled={isConnecting || !apiKey}>
                      {isConnecting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                          Connecting...
                        </>
                      ) : (
                        <>
                          <Zap className="h-4 w-4 mr-1" />
                          Connect to Tazama
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-medium">Connection Security</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Switch id="tls-enforcement" defaultChecked />
                      <Label htmlFor="tls-enforcement">Enforce TLS 1.2+</Label>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Ensures all communication with Tazama is encrypted using TLS 1.2 or higher.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Switch id="ip-restriction" defaultChecked />
                      <Label htmlFor="ip-restriction">IP Restriction</Label>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Restrict API access to specific IP addresses for enhanced security.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="webhook-secret">Webhook Secret</Label>
                    <div className="flex gap-2">
                      <Input
                        id="webhook-secret"
                        type="password"
                        placeholder="••••••••••••••••"
                        value="whsec_1234567890abcdef"
                        readOnly
                      />
                      <Button variant="outline" size="icon">
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Used to verify webhook requests from Tazama.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">API Documentation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Tazama API Reference</h3>
                    <p className="text-sm text-muted-foreground">
                      Comprehensive documentation for the Tazama Rules Engine API
                    </p>
                  </div>
                  <Button variant="outline">
                    <ExternalLink className="h-4 w-4 mr-1" />
                    View Documentation
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="data-sync" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Data Synchronization Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Customer Data Sync</Label>
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="auto-sync-customers" 
                        checked={syncSettings.autoSyncCustomers}
                        onCheckedChange={(checked) => 
                          setSyncSettings({...syncSettings, autoSyncCustomers: checked})
                        }
                      />
                      <Label htmlFor="auto-sync-customers">Automatically sync customer data</Label>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      When enabled, customer data will be automatically synced with Tazama when created or updated.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Transaction Processing</Label>
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="auto-process-transactions" 
                        checked={syncSettings.autoProcessTransactions}
                        onCheckedChange={(checked) => 
                          setSyncSettings({...syncSettings, autoProcessTransactions: checked})
                        }
                      />
                      <Label htmlFor="auto-process-transactions">Automatically process transactions</Label>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      When enabled, transactions will be automatically processed through Tazama rules engine.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sync-interval">Sync Interval</Label>
                    <Select 
                      value={syncSettings.syncInterval}
                      onValueChange={(value) => 
                        setSyncSettings({...syncSettings, syncInterval: value})
                      }
                    >
                      <SelectTrigger id="sync-interval">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="realtime">Real-time</SelectItem>
                        <SelectItem value="1min">Every minute</SelectItem>
                        <SelectItem value="5min">Every 5 minutes</SelectItem>
                        <SelectItem value="15min">Every 15 minutes</SelectItem>
                        <SelectItem value="1hour">Hourly</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      How frequently data should be synced with Tazama.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Retry Settings</Label>
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="retry-failed-sync" 
                        checked={syncSettings.retryFailedSync}
                        onCheckedChange={(checked) => 
                          setSyncSettings({...syncSettings, retryFailedSync: checked})
                        }
                      />
                      <Label htmlFor="retry-failed-sync">Retry failed sync operations</Label>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Label htmlFor="max-retries" className="min-w-24">Max retries:</Label>
                      <Select 
                        value={syncSettings.maxRetries.toString()}
                        onValueChange={(value) => 
                          setSyncSettings({...syncSettings, maxRetries: parseInt(value)})
                        }
                      >
                        <SelectTrigger id="max-retries" className="w-20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1</SelectItem>
                          <SelectItem value="3">3</SelectItem>
                          <SelectItem value="5">5</SelectItem>
                          <SelectItem value="10">10</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-medium">Data Mapping</h3>
                  <p className="text-sm text-muted-foreground">
                    Configure how ProDetect data is mapped to Tazama data models.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="bg-muted/50">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Customer Data Mapping</CardTitle>
                      </CardHeader>
                      <CardContent className="text-xs">
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <span>customer_id</span>
                            <span className="font-mono">→</span>
                            <span>customer_id</span>
                          </div>
                          <div className="flex justify-between">
                            <span>first_name + last_name</span>
                            <span className="font-mono">→</span>
                            <span>full_name</span>
                          </div>
                          <div className="flex justify-between">
                            <span>risk_rating</span>
                            <span className="font-mono">→</span>
                            <span>risk_level</span>
                          </div>
                          <div className="flex justify-between">
                            <span>kyc_status</span>
                            <span className="font-mono">→</span>
                            <span>verification_status</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-muted/50">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Transaction Data Mapping</CardTitle>
                      </CardHeader>
                      <CardContent className="text-xs">
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <span>transaction_id</span>
                            <span className="font-mono">→</span>
                            <span>transaction_id</span>
                          </div>
                          <div className="flex justify-between">
                            <span>amount</span>
                            <span className="font-mono">→</span>
                            <span>amount</span>
                          </div>
                          <div className="flex justify-between">
                            <span>transaction_type</span>
                            <span className="font-mono">→</span>
                            <span>type</span>
                          </div>
                          <div className="flex justify-between">
                            <span>counterparty_name</span>
                            <span className="font-mono">→</span>
                            <span>counterparty.name</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-1" />
                    Customize Mapping
                  </Button>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSaveSettings}>
                    <Save className="h-4 w-4 mr-1" />
                    Save Settings
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Manual Data Sync</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-muted/50">
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                      <Users className="h-8 w-8 text-primary mb-2" />
                      <h3 className="font-medium">Sync Customers</h3>
                      <p className="text-xs text-muted-foreground mb-4">
                        Sync customer data to Tazama
                      </p>
                      <Button variant="outline" size="sm">
                        Sync Customers
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="bg-muted/50">
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                      <Activity className="h-8 w-8 text-primary mb-2" />
                      <h3 className="font-medium">Process Transactions</h3>
                      <p className="text-xs text-muted-foreground mb-4">
                        Process transactions through rules
                      </p>
                      <Button variant="outline" size="sm">
                        Process Transactions
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="bg-muted/50">
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                      <Workflow className="h-8 w-8 text-primary mb-2" />
                      <h3 className="font-medium">Sync Rules</h3>
                      <p className="text-xs text-muted-foreground mb-4">
                        Sync rules with Tazama
                      </p>
                      <Button variant="outline" size="sm">
                        Sync Rules
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rules" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">Tazama Rules</CardTitle>
                  <Button>
                    <Plus className="h-4 w-4 mr-1" />
                    Create Rule
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rule Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Executions</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">High-Value Transaction Alert</TableCell>
                      <TableCell>Transaction Monitoring</TableCell>
                      <TableCell>
                        <Badge variant="warning">High</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-success">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Active
                        </Badge>
                      </TableCell>
                      <TableCell>4,567</TableCell>
                      <TableCell>2 hours ago</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Transaction Velocity Monitor</TableCell>
                      <TableCell>Behavioral Analysis</TableCell>
                      <TableCell>
                        <Badge variant="destructive">Critical</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-success">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Active
                        </Badge>
                      </TableCell>
                      <TableCell>3,245</TableCell>
                      <TableCell>1 day ago</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Geographic Risk Assessment</TableCell>
                      <TableCell>Geographic Monitoring</TableCell>
                      <TableCell>
                        <Badge variant="secondary">Medium</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-success">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Active
                        </Badge>
                      </TableCell>
                      <TableCell>1,892</TableCell>
                      <TableCell>3 days ago</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Rule Sync Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Switch id="bidirectional-sync" defaultChecked />
                      <Label htmlFor="bidirectional-sync">Bidirectional rule sync</Label>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      When enabled, rules created in either system will be synced to the other.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Switch id="auto-deploy" defaultChecked />
                      <Label htmlFor="auto-deploy">Auto-deploy rule changes</Label>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      When enabled, rule changes will be automatically deployed without requiring manual approval.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="conflict-resolution">Conflict Resolution</Label>
                    <Select defaultValue="latest">
                      <SelectTrigger id="conflict-resolution">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="latest">Latest Wins</SelectItem>
                        <SelectItem value="prodetect">ProDetect Wins</SelectItem>
                        <SelectItem value="tazama">Tazama Wins</SelectItem>
                        <SelectItem value="manual">Manual Resolution</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      How to resolve conflicts when rules are modified in both systems.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Rule Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded">
                      <div className="flex items-center gap-2">
                        <Activity className="h-4 w-4 text-primary" />
                        <span className="font-medium">Rule Execution Rate</span>
                      </div>
                      <Badge variant="outline">1,245/hour</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-success" />
                        <span className="font-medium">True Positive Rate</span>
                      </div>
                      <Badge variant="outline" className="text-success">96.8%</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded">
                      <div className="flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-destructive" />
                        <span className="font-medium">False Positive Rate</span>
                      </div>
                      <Badge variant="outline" className="text-destructive">3.2%</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-warning" />
                        <span className="font-medium">Avg. Execution Time</span>
                      </div>
                      <Badge variant="outline">124ms</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="logs" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Integration Logs</h3>
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
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Level</TableHead>
                      <TableHead>Event</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-mono text-xs">2024-07-16 14:32:45</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-success">INFO</Badge>
                      </TableCell>
                      <TableCell>Transaction Processing</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-success">Success</Badge>
                      </TableCell>
                      <TableCell className="max-w-md truncate">
                        Successfully processed transaction TXN001 through Tazama rules engine
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono text-xs">2024-07-16 14:30:12</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-success">INFO</Badge>
                      </TableCell>
                      <TableCell>Customer Sync</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-success">Success</Badge>
                      </TableCell>
                      <TableCell className="max-w-md truncate">
                        Successfully synced customer CUST001 to Tazama
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono text-xs">2024-07-16 14:28:33</TableCell>
                      <TableCell>
                        <Badge variant="destructive">ERROR</Badge>
                      </TableCell>
                      <TableCell>Rule Sync</TableCell>
                      <TableCell>
                        <Badge variant="destructive">Failed</Badge>
                      </TableCell>
                      <TableCell className="max-w-md truncate">
                        Failed to sync rule RULE003: API request timeout
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono text-xs">2024-07-16 14:25:01</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-warning">WARN</Badge>
                      </TableCell>
                      <TableCell>Transaction Processing</TableCell>
                      <TableCell>
                        <Badge variant="warning">Partial</Badge>
                      </TableCell>
                      <TableCell className="max-w-md truncate">
                        Processed transaction TXN002 with warnings: Missing customer data
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono text-xs">2024-07-16 14:20:45</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-success">INFO</Badge>
                      </TableCell>
                      <TableCell>Connection</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-success">Success</Badge>
                      </TableCell>
                      <TableCell className="max-w-md truncate">
                        Successfully connected to Tazama API v2.5.1
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Log Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="log-level">Log Level</Label>
                      <Select defaultValue="info">
                        <SelectTrigger id="log-level">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="debug">Debug</SelectItem>
                          <SelectItem value="info">Info</SelectItem>
                          <SelectItem value="warn">Warning</SelectItem>
                          <SelectItem value="error">Error</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="log-retention">Log Retention</Label>
                      <Select defaultValue="30days">
                        <SelectTrigger id="log-retention">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="7days">7 days</SelectItem>
                          <SelectItem value="30days">30 days</SelectItem>
                          <SelectItem value="90days">90 days</SelectItem>
                          <SelectItem value="1year">1 year</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Log Categories</Label>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Switch id="log-transactions" defaultChecked />
                          <Label htmlFor="log-transactions">Transaction Processing</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch id="log-customers" defaultChecked />
                          <Label htmlFor="log-customers">Customer Sync</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch id="log-rules" defaultChecked />
                          <Label htmlFor="log-rules">Rule Management</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch id="log-connection" defaultChecked />
                          <Label htmlFor="log-connection">Connection Events</Label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSaveSettings}>
                    <Save className="h-4 w-4 mr-1" />
                    Save Settings
                  </Button>
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

function Users(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
}