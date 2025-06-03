"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Settings,
  Send,
  BookText,
  PlugZap,
  UserCircle,
  Bell,
  Shield,
  Cog,
  Link2,
  ArrowLeft,
  Plus,
  Edit3,
  Trash2,
  Play,
  Pause,
} from "lucide-react";

function RulesEnginePage({ onBack }: { onBack: () => void }) {
  const [rules, setRules] = useState([
    {
      id: 1,
      name: "High Risk Transaction Alert",
      description: "Trigger alert for transactions above $10,000",
      status: "active",
      lastModified: "2024-01-15",
    },
    {
      id: 2,
      name: "Compliance Document Review",
      description: "Auto-route compliance documents for review",
      status: "active",
      lastModified: "2024-01-12",
    },
    {
      id: 3,
      name: "Risk Assessment Workflow",
      description: "Automated risk scoring for new clients",
      status: "inactive",
      lastModified: "2024-01-08",
    },
  ]);

  const toggleRuleStatus = (id: number) => {
    setRules(
      rules.map((rule) =>
        rule.id === id
          ? {
              ...rule,
              status: rule.status === "active" ? "inactive" : "active",
            }
          : rule
      )
    );
  };

  return (
    <div className="flex flex-col gap-2">
      <header className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Settings
        </Button>
        <div></div>
      </header>

      <div className="grid gap-2">
        {/* Quick Actions */}
        <Card className="shadow-sm">
          <CardHeader></CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create New Rule
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Import Template
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <BookText className="h-4 w-4" />
                Rule Documentation
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Active Rules */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              Active Rules
            </CardTitle>
            <CardDescription>
              Currently deployed compliance and risk management rules
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {rules.map((rule) => (
                <div
                  key={rule.id}
                  className="flex items-center justify-between p-4 border rounded-lg bg-card"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-medium text-foreground">
                        {rule.name}
                      </h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          rule.status === "active"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                        }`}
                      >
                        {rule.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {rule.description}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Last modified: {rule.lastModified}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleRuleStatus(rule.id)}
                      className="flex items-center gap-1"
                    >
                      {rule.status === "active" ? (
                        <>
                          <Pause className="h-4 w-4" />
                          Pause
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4" />
                          Activate
                        </>
                      )}
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Rule Categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Compliance Rules
              </CardTitle>
              <CardDescription>Regulatory compliance workflows</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-2xl font-bold text-foreground">12</p>
                <p className="text-sm text-muted-foreground">Active Rules</p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Risk Management
              </CardTitle>
              <CardDescription>Risk assessment and monitoring</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-2xl font-bold text-foreground">8</p>
                <p className="text-sm text-muted-foreground">Active Rules</p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                AI Agent Parameters
              </CardTitle>
              <CardDescription>Machine learning model rules</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Cog className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-2xl font-bold text-foreground">5</p>
                <p className="text-sm text-muted-foreground">Active Rules</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Main Settings Component
export default function SettingsPage() {
  const [currentPage, setCurrentPage] = useState("settings");

  if (currentPage === "rules-engine") {
    return <RulesEnginePage onBack={() => setCurrentPage("settings")} />;
  }

  return (
    <div className="flex flex-col gap-4">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Settings
        </h1>
      </header>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5">
          <TabsTrigger value="general">
            <UserCircle className="mr-2 h-4 w-4 sm:hidden md:inline-block" />
            General
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="mr-2 h-4 w-4 sm:hidden md:inline-block" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="mr-2 h-4 w-4 sm:hidden md:inline-block" />
            Security
          </TabsTrigger>
          <TabsTrigger value="rules-management">
            <Cog className="mr-2 h-4 w-4 sm:hidden md:inline-block" />
            Rules Management
          </TabsTrigger>
          <TabsTrigger value="system-integration">
            <Link2 className="mr-2 h-4 w-4 sm:hidden md:inline-block" />
            System Integration
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card className="shadow-lg mt-6">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-foreground">
                General Settings
              </CardTitle>
              <CardDescription>
                Manage your account settings and preferences.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Name</Label>
                  <Input
                    id="fullName"
                    placeholder="Enter your name"
                    defaultValue="ProDetect User"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    defaultValue="user@prodetect.com"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select defaultValue="en">
                  <SelectTrigger id="language" className="w-full md:w-[280px]">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español (Spanish)</SelectItem>
                    <SelectItem value="fr">Français (French)</SelectItem>
                    <SelectItem value="de">Deutsch (German)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button>Save General Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card className="shadow-lg mt-6">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-foreground">
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Control how you receive alerts and updates.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <Checkbox id="emailNotifications" defaultChecked />
                <Label
                  htmlFor="emailNotifications"
                  className="font-normal text-sm"
                >
                  Receive email notifications for critical alerts
                </Label>
              </div>
              <div className="flex items-center space-x-3">
                <Checkbox id="inAppNotifications" defaultChecked />
                <Label
                  htmlFor="inAppNotifications"
                  className="font-normal text-sm"
                >
                  Show in-app notifications for new alerts
                </Label>
              </div>
              <div className="flex items-center space-x-3">
                <Checkbox id="weeklySummary" />
                <Label htmlFor="weeklySummary" className="font-normal text-sm">
                  Send weekly summary reports via email
                </Label>
              </div>
              <Button className="mt-4">Save Notification Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card className="shadow-lg mt-6">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-foreground">
                Security Settings
              </CardTitle>
              <CardDescription>
                Manage your account security, password, and two-factor
                authentication.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    placeholder="Enter current password"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="Enter new password"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-3 pt-2">
                <Switch id="twoFactorAuth" />
                <Label htmlFor="twoFactorAuth" className="font-normal text-sm">
                  Enable Two-Factor Authentication (2FA)
                </Label>
              </div>
              <Button>Update Security Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rules-management">
          <Card className="shadow-lg mt-6">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-foreground">
                Rules & Workflow Management
              </CardTitle>
              <CardDescription>
                Centrally manage compliance workflows, risk policies, AI agent
                parameters, and adapt rules and workflows quickly without
                coding.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-border rounded-lg p-8 text-center bg-muted/50">
                <Settings className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-foreground">
                  No-Code Rule & Policy Engine
                </h3>
              </div>
              <Button
                variant="outline"
                className="mt-6"
                onClick={() => setCurrentPage("rules-engine")}
              >
                Access Rules Engine
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system-integration">
          <Card className="shadow-lg mt-6">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-foreground">
                System Integrations & API
              </CardTitle>
              <CardDescription>
                Manage API keys, connect third-party services, and access system
                documentation.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-border rounded-lg p-8 text-center bg-muted/50">
                <div className="flex gap-4">
                  <PlugZap className="h-10 w-10 text-muted-foreground mb-4" />
                  <BookText className="h-10 w-10 text-muted-foreground mb-4" />
                  <Send className="h-10 w-10 text-muted-foreground mb-4" />
                </div>
                <h3 className="text-lg font-medium text-foreground">
                  API, Connectors & Documentation
                </h3>
              </div>
              <div className="flex flex-wrap gap-4">
                <Button variant="outline">Manage API Keys</Button>
                <Button variant="outline">Configure Data Connectors</Button>
                <Button variant="outline">Access Documentation</Button>
                <Button variant="outline">Setup Regulatory Submissions</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
