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
  Key,
  Book,
  UserCog2,
  FileCog2,
} from "lucide-react";
import RulesEnginePage from "@/components/rules/rules-engine";

export default function SettingsPage() {
  const [currentPage, setCurrentPage] = useState("settings");

  if (currentPage === "rules-engine") {
    return <RulesEnginePage onBack={() => setCurrentPage("settings")} />;
  }

  return (
    <div className="flex flex-col gap-4">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Settings</h1>
      </header>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5">
          <TabsTrigger value="general"><UserCircle className="mr-2 h-4 w-4 sm:hidden md:inline-block" /> General</TabsTrigger>
          <TabsTrigger value="notifications"><Bell className="mr-2 h-4 w-4 sm:hidden md:inline-block" /> Notifications</TabsTrigger>
          <TabsTrigger value="security"><Shield className="mr-2 h-4 w-4 sm:hidden md:inline-block" /> Security</TabsTrigger>
          <TabsTrigger value="rules-management"><Cog className="mr-2 h-4 w-4 sm:hidden md:inline-block" /> Rules Management</TabsTrigger>
          <TabsTrigger value="system-integration"><Link2 className="mr-2 h-4 w-4 sm:hidden md:inline-block" /> System Integration</TabsTrigger>
        </TabsList>
        <TabsContent value="general">
          <Card className="shadow-lg mt-6">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-foreground">General Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Name input */}
                <div className="space-y-2">
                  <Label htmlFor="fullName">Name</Label>
                  <Input id="fullName" placeholder="Enter your name" defaultValue="ProDetect User" />
                </div>

                {/* Original Email input */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="Enter your email" defaultValue="user@prodetect.com" />
                </div>

                {/* Change Email input */}
                <div className="space-y-2">
                  <Label htmlFor="changeEmail">Change Email</Label>
                  <Input id="changeEmail" type="email" placeholder="Enter new email" />
                </div>

                {/* Confirm Email input */}
                <div className="space-y-2">
                  <Label htmlFor="confirmEmail">Confirm Email</Label>
                  <Input id="confirmEmail" type="email" placeholder="Confirm new email" />
                </div>

                {/* Language select */}
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

                {/* Company Name input */}
                <div className="space-y-2">
                  <Label htmlFor="company-name">Company Name</Label>
                  <Input type="text" id="company-name" placeholder="Enter company name" />
                </div>

                {/* Timezone select */}
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="utc">UTC</SelectItem>
                      <SelectItem value="est">Eastern Time</SelectItem>
                      <SelectItem value="pst">Pacific Time</SelectItem>
                      <SelectItem value="mst">Mountain Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="notifications">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-foreground">
                Notification Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-alerts">Email Alerts</Label>
                  <p className="text-sm text-muted-foreground">Receive alerts via email</p>
                </div>
                <Switch id="email-alerts" />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="high-risk-alerts">High Risk Transaction Alerts</Label>
                  <p className="text-sm text-muted-foreground">Immediate alerts for high-risk transactions</p>
                </div>
                <Switch id="high-risk-alerts" />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="compliance-reminders">Compliance Reminders</Label>
                  <p className="text-sm text-muted-foreground">Regular compliance check reminders</p>
                </div>
                <Switch id="compliance-reminders" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-foreground">
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                </div>
                <Switch id="two-factor" />
              </div>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                <Input type="number" id="session-timeout" placeholder="30" />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="audit-logs">Enable Audit Logs</Label>
                  <p className="text-sm text-muted-foreground">Track all user activities</p>
                </div>
                <Switch id="audit-logs" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rules-management">
          <Card className="shadow-lg mt-6">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-foreground">
                Rules & Workflow Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-border rounded-lg p-8 text-center bg-muted/50">
                <Settings className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-foreground">
                  No-Code Rule & Policy Engine
                </h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Create, manage, and deploy business rules without technical expertise
                </p>
              </div>
              <Button
                variant="outline"
                className="mt-6"
                onClick={() => setCurrentPage("rules-engine")}
              ><FileCog2 className="h-4 w-4" />
                Access Rules Engine
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system-integration">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-foreground">
                System Integration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="api-endpoint">API Endpoint</Label>
                <Input type="url" id="api-endpoint" placeholder="https://api.example.com" />
              </div>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="api-key">API Key</Label>
                <Input type="password" id="api-key" placeholder="Enter API key" />
              </div>
              <div className="flex flex-wrap gap-4">
                <Button variant="outline" className="flex items-center gap-4">
                  <PlugZap className="h-4 w-4" />
                  Test Connection
                </Button>
                <Button variant="outline">
                  <Key className="h-4 w-4" />
                  Manage API Keys
                </Button>
                <Button variant="outline">
                  <Book className="h-4 w-4" />
                  Access Documentation</Button>
                <Button variant="outline">
                  <UserCog2 className="h-4 w-4" />
                  Setup Regulatory Submissions</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}