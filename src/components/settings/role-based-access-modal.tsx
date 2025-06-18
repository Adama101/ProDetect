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
  Shield,
  Users,
  UserPlus,
  UserCheck,
  UserX,
  Lock,
  Unlock,
  Key,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Activity,
  Settings,
  Save,
  Download,
  Upload,
  Plus,
  Edit,
  Trash2,
  Filter,
  Search,
  BarChart3,
  PieChart,
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
  Copy,
  ExternalLink,
  RefreshCw,
  User,
  UserCog,
  ShieldCheck,
  ShieldAlert,
  ShieldOff,
  LockKeyhole,
  KeyRound,
  FileKey,
  ScrollText,
  ClipboardList,
  ClipboardCheck,
  ClipboardX,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface RoleBasedAccessModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Mock data for roles and permissions
const roles = [
  {
    id: "role_001",
    name: "Administrator",
    description: "Full system access with all permissions",
    userCount: 3,
    isSystem: true,
    permissions: {
      dashboard: ["view", "edit"],
      customers: ["view", "create", "edit", "delete"],
      transactions: ["view", "create", "edit", "delete"],
      alerts: ["view", "create", "edit", "delete", "resolve"],
      cases: ["view", "create", "edit", "delete", "assign", "escalate"],
      reports: ["view", "create", "edit", "delete", "submit"],
      rules: ["view", "create", "edit", "delete", "deploy"],
      settings: ["view", "edit"],
      users: ["view", "create", "edit", "delete"],
      audit: ["view"],
    },
  },
  {
    id: "role_002",
    name: "Compliance Officer",
    description: "Manages compliance operations and case investigations",
    userCount: 8,
    isSystem: true,
    permissions: {
      dashboard: ["view"],
      customers: ["view", "edit"],
      transactions: ["view"],
      alerts: ["view", "edit", "resolve"],
      cases: ["view", "create", "edit", "assign", "escalate"],
      reports: ["view", "create", "edit", "submit"],
      rules: ["view", "edit"],
      settings: ["view"],
      users: ["view"],
      audit: ["view"],
    },
  },
  {
    id: "role_003",
    name: "Analyst",
    description: "Reviews alerts and conducts initial investigations",
    userCount: 12,
    isSystem: true,
    permissions: {
      dashboard: ["view"],
      customers: ["view"],
      transactions: ["view"],
      alerts: ["view", "edit"],
      cases: ["view", "edit"],
      reports: ["view"],
      rules: ["view"],
      settings: [],
      users: [],
      audit: [],
    },
  },
  {
    id: "role_004",
    name: "Auditor",
    description: "Read-only access for audit and compliance review",
    userCount: 5,
    isSystem: true,
    permissions: {
      dashboard: ["view"],
      customers: ["view"],
      transactions: ["view"],
      alerts: ["view"],
      cases: ["view"],
      reports: ["view"],
      rules: ["view"],
      settings: [],
      users: [],
      audit: ["view"],
    },
  },
  {
    id: "role_005",
    name: "Custom Role",
    description: "Custom permissions for specialized team members",
    userCount: 2,
    isSystem: false,
    permissions: {
      dashboard: ["view"],
      customers: ["view"],
      transactions: ["view"],
      alerts: ["view", "edit"],
      cases: ["view", "edit"],
      reports: ["view", "create"],
      rules: [],
      settings: [],
      users: [],
      audit: [],
    },
  },
];

const users = [
  {
    id: "user_001",
    name: "Sarah Chen",
    email: "sarah.chen@prodetect.com",
    role: "Compliance Officer",
    status: "active",
    lastLogin: "5 minutes ago",
    twoFactorEnabled: true,
    department: "Compliance",
    avatar: "https://picsum.photos/seed/user1/40/40",
  },
  {
    id: "user_002",
    name: "Michael Rodriguez",
    email: "michael.rodriguez@prodetect.com",
    role: "Analyst",
    status: "active",
    lastLogin: "1 hour ago",
    twoFactorEnabled: true,
    department: "Risk",
    avatar: "https://picsum.photos/seed/user2/40/40",
  },
  {
    id: "user_003",
    name: "Emma Thompson",
    email: "emma.thompson@prodetect.com",
    role: "Administrator",
    status: "active",
    lastLogin: "2 hours ago",
    twoFactorEnabled: true,
    department: "IT",
    avatar: "https://picsum.photos/seed/user3/40/40",
  },
  {
    id: "user_004",
    name: "John Smith",
    email: "john.smith@prodetect.com",
    role: "Auditor",
    status: "inactive",
    lastLogin: "5 days ago",
    twoFactorEnabled: false,
    department: "Audit",
    avatar: "https://picsum.photos/seed/user4/40/40",
  },
  {
    id: "user_005",
    name: "Lisa Johnson",
    email: "lisa.johnson@prodetect.com",
    role: "Custom Role",
    status: "active",
    lastLogin: "3 hours ago",
    twoFactorEnabled: true,
    department: "Operations",
    avatar: "https://picsum.photos/seed/user5/40/40",
  },
];

const permissionModules = [
  { id: "dashboard", name: "Dashboard", icon: BarChart3 },
  { id: "customers", name: "Customers", icon: Users },
  { id: "transactions", name: "Transactions", icon: Activity },
  { id: "alerts", name: "Alerts", icon: Bell },
  { id: "cases", name: "Cases", icon: FileText },
  { id: "reports", name: "Reports", icon: ClipboardList },
  { id: "rules", name: "Rules", icon: Workflow },
  { id: "settings", name: "Settings", icon: Settings },
  { id: "users", name: "Users", icon: User },
  { id: "audit", name: "Audit Logs", icon: ScrollText },
];

const permissionActions = [
  { id: "view", name: "View", description: "Can view records" },
  { id: "create", name: "Create", description: "Can create new records" },
  { id: "edit", name: "Edit", description: "Can modify existing records" },
  { id: "delete", name: "Delete", description: "Can delete records" },
  { id: "assign", name: "Assign", description: "Can assign to users" },
  { id: "escalate", name: "Escalate", description: "Can escalate cases" },
  { id: "resolve", name: "Resolve", description: "Can resolve alerts/cases" },
  { id: "submit", name: "Submit", description: "Can submit to regulators" },
  { id: "deploy", name: "Deploy", description: "Can deploy rules/changes" },
];

const auditLogs = [
  {
    id: "log_001",
    action: "Role Modified",
    details: "Updated permissions for 'Analyst' role",
    user: "Emma Thompson",
    timestamp: "2024-01-16 14:30:45",
    ipAddress: "192.168.1.100",
  },
  {
    id: "log_002",
    action: "User Created",
    details: "Created new user 'Lisa Johnson'",
    user: "Emma Thompson",
    timestamp: "2024-01-15 10:15:22",
    ipAddress: "192.168.1.100",
  },
  {
    id: "log_003",
    action: "Permission Changed",
    details: "Added 'submit' permission to 'Compliance Officer' role",
    user: "Emma Thompson",
    timestamp: "2024-01-14 16:45:12",
    ipAddress: "192.168.1.100",
  },
  {
    id: "log_004",
    action: "User Role Changed",
    details: "Changed 'John Smith' from 'Analyst' to 'Auditor'",
    user: "Emma Thompson",
    timestamp: "2024-01-13 09:22:37",
    ipAddress: "192.168.1.100",
  },
];

export function RoleBasedAccessModal({ open, onOpenChange }: RoleBasedAccessModalProps) {
  const [selectedRole, setSelectedRole] = useState(roles[0]);
  const [editMode, setEditMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState(users);

  useEffect(() => {
    if (searchTerm) {
      setFilteredUsers(
        users.filter(
          (user) =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.role.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredUsers(users);
    }
  }, [searchTerm]);

  const hasPermission = (module: string, action: string) => {
    return selectedRole.permissions[module as keyof typeof selectedRole.permissions]?.includes(action) || false;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Shield className="h-6 w-6 text-primary" />
            Role-Based Access Control
          </DialogTitle>
          <DialogDescription>
            Manage user roles, permissions, and access controls for your organization
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="roles" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="audit">Audit Log</TabsTrigger>
            <TabsTrigger value="settings">Security Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="roles" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Roles</h3>
                  <Button>
                    <Plus className="h-4 w-4 mr-1" />
                    Create Role
                  </Button>
                </div>

                {roles.map((role) => (
                  <Card 
                    key={role.id} 
                    className={`cursor-pointer transition-all ${
                      selectedRole.id === role.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setSelectedRole(role)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h4 className="font-semibold">{role.name}</h4>
                            {role.isSystem && (
                              <Badge variant="outline">System</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{role.description}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Users className="h-3 w-3" />
                            <span>{role.userCount} users</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (selectedRole.id === role.id) {
                                setEditMode(!editMode);
                              } else {
                                setSelectedRole(role);
                                setEditMode(true);
                              }
                            }}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="lg:col-span-2 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">
                    {editMode ? `Edit ${selectedRole.name} Role` : `${selectedRole.name} Permissions`}
                  </h3>
                  {editMode ? (
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => setEditMode(false)}>
                        Cancel
                      </Button>
                      <Button>
                        <Save className="h-4 w-4 mr-1" />
                        Save Changes
                      </Button>
                    </div>
                  ) : (
                    <Button onClick={() => setEditMode(true)}>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit Role
                    </Button>
                  )}
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Permission Matrix</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Configure access permissions for each module
                    </p>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Module</TableHead>
                          {permissionActions.map((action) => (
                            <TableHead key={action.id} className="text-center">
                              {action.name}
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {permissionModules.map((module) => {
                          const ModuleIcon = module.icon;
                          return (
                            <TableRow key={module.id}>
                              <TableCell className="font-medium">
                                <div className="flex items-center gap-2">
                                  <ModuleIcon className="h-4 w-4 text-primary" />
                                  {module.name}
                                </div>
                              </TableCell>
                              {permissionActions.map((action) => (
                                <TableCell key={action.id} className="text-center">
                                  {editMode ? (
                                    <Switch
                                      checked={hasPermission(module.id, action.id)}
                                      onCheckedChange={() => {
                                        // In a real implementation, this would update the role's permissions
                                      }}
                                    />
                                  ) : hasPermission(module.id, action.id) ? (
                                    <CheckCircle className="h-4 w-4 text-success mx-auto" />
                                  ) : (
                                    <XCircle className="h-4 w-4 text-muted-foreground mx-auto" />
                                  )}
                                </TableCell>
                              ))}
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Users with this Role
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {users
                        .filter((user) => user.role === selectedRole.name)
                        .map((user) => (
                          <div key={user.id} className="flex items-center justify-between p-3 border rounded">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={user.avatar} alt={user.name} />
                                <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{user.name}</p>
                                <p className="text-xs text-muted-foreground">{user.email}</p>
                              </div>
                            </div>
                            <Badge
                              variant={user.status === "active" ? "outline" : "secondary"}
                              className={user.status === "active" ? "text-success" : ""}
                            >
                              {user.status === "active" ? (
                                <CheckCircle className="h-3 w-3 mr-1" />
                              ) : (
                                <XCircle className="h-3 w-3 mr-1" />
                              )}
                              {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                            </Badge>
                          </div>
                        ))}
                      {users.filter((user) => user.role === selectedRole.name).length === 0 && (
                        <div className="text-center py-6 text-muted-foreground">
                          No users with this role
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">User Management</h3>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search users..." 
                    className="pl-10 w-64"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-1" />
                  Filter
                </Button>
                <Button>
                  <UserPlus className="h-4 w-4 mr-1" />
                  Add User
                </Button>
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>2FA</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{user.role}</Badge>
                    </TableCell>
                    <TableCell>{user.department}</TableCell>
                    <TableCell>
                      <Badge
                        variant={user.status === "active" ? "outline" : "secondary"}
                        className={user.status === "active" ? "text-success" : ""}
                      >
                        {user.status === "active" ? (
                          <CheckCircle className="h-3 w-3 mr-1" />
                        ) : (
                          <XCircle className="h-3 w-3 mr-1" />
                        )}
                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {user.twoFactorEnabled ? (
                        <Badge variant="outline" className="text-success">
                          <Lock className="h-3 w-3 mr-1" />
                          Enabled
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-destructive">
                          <Unlock className="h-3 w-3 mr-1" />
                          Disabled
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>{user.lastLogin}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Key className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-destructive">
                          <UserX className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="audit" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Access Control Audit Log</h3>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search audit logs..." className="pl-10 w-64" />
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

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Action</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {auditLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      <Badge
                        variant={
                          log.action.includes("Created")
                            ? "outline"
                            : log.action.includes("Modified") || log.action.includes("Changed")
                            ? "warning"
                            : "secondary"
                        }
                        className={log.action.includes("Created") ? "text-success" : ""}
                      >
                        {log.action}
                      </Badge>
                    </TableCell>
                    <TableCell>{log.details}</TableCell>
                    <TableCell>{log.user}</TableCell>
                    <TableCell>{log.timestamp}</TableCell>
                    <TableCell className="font-mono text-xs">{log.ipAddress}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-3 w-3" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label>Password Policy</Label>
                      <Select defaultValue="strong">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="basic">Basic (8+ characters)</SelectItem>
                          <SelectItem value="standard">Standard (8+ chars, mixed case, numbers)</SelectItem>
                          <SelectItem value="strong">Strong (12+ chars, mixed case, numbers, symbols)</SelectItem>
                          <SelectItem value="custom">Custom Policy</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Password Expiry</Label>
                      <Select defaultValue="90days">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30days">30 Days</SelectItem>
                          <SelectItem value="60days">60 Days</SelectItem>
                          <SelectItem value="90days">90 Days</SelectItem>
                          <SelectItem value="never">Never</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Account Lockout</Label>
                      <Select defaultValue="5attempts">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="3attempts">After 3 failed attempts</SelectItem>
                          <SelectItem value="5attempts">After 5 failed attempts</SelectItem>
                          <SelectItem value="10attempts">After 10 failed attempts</SelectItem>
                          <SelectItem value="never">Never</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label>Two-Factor Authentication</Label>
                      <div className="space-y-2 mt-2">
                        <div className="flex items-center space-x-2">
                          <Switch id="require-2fa" defaultChecked />
                          <Label htmlFor="require-2fa" className="text-sm">Require 2FA for all users</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch id="2fa-admin" defaultChecked />
                          <Label htmlFor="2fa-admin" className="text-sm">Require 2FA for administrative actions</Label>
                        </div>
                      </div>
                    </div>
                    <div>
                      <Label>Session Management</Label>
                      <div className="space-y-2 mt-2">
                        <div className="flex items-center space-x-2">
                          <Switch id="session-timeout" defaultChecked />
                          <Label htmlFor="session-timeout" className="text-sm">Enable session timeout</Label>
                        </div>
                        <Select defaultValue="30min">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="15min">15 Minutes</SelectItem>
                            <SelectItem value="30min">30 Minutes</SelectItem>
                            <SelectItem value="60min">60 Minutes</SelectItem>
                            <SelectItem value="120min">120 Minutes</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-4">Role-Based Access Control Settings</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded">
                      <div className="flex items-center gap-2">
                        <Lock className="h-4 w-4 text-primary" />
                        <span className="font-medium">Strict Role Enforcement</span>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-primary" />
                        <span className="font-medium">Role Inheritance</span>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded">
                      <div className="flex items-center gap-2">
                        <ClipboardCheck className="h-4 w-4 text-primary" />
                        <span className="font-medium">Comprehensive Audit Logging</span>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded">
                      <div className="flex items-center gap-2">
                        <UserCog className="h-4 w-4 text-primary" />
                        <span className="font-medium">Self-Service Role Requests</span>
                      </div>
                      <Switch />
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