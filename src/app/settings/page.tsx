'use client';

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Settings as SettingsIcon, Send, BookText, PlugZap, UserCircle, Bell, Shield, Cog, Link2 } from "lucide-react";
import { NoCodeRulesBuilderModal } from "@/components/settings/no-code-rules-builder-modal";
import { ApiManagementModal } from "@/components/settings/api-management-modal";
import { DataConnectorsModal } from "@/components/settings/data-connectors-modal";
import { DocumentationAccessModal } from "@/components/settings/documentation-access-modal";
import { RegulatorySubmissionModal } from "@/components/settings/regulatory-submission-modal";
import { RoleBasedAccessModal } from "@/components/settings/role-based-access-modal";
import { TazamaIntegrationModal } from "@/components/settings/tazama-integration-modal";

export default function SettingsPage() {
  const [showNoCodeRulesModal, setShowNoCodeRulesModal] = useState(false);
  const [showApiManagementModal, setShowApiManagementModal] = useState(false);
  const [showDataConnectorsModal, setShowDataConnectorsModal] = useState(false);
  const [showDocumentationModal, setShowDocumentationModal] = useState(false);
  const [showRegulatorySubmissionModal, setShowRegulatorySubmissionModal] = useState(false);
  const [showRoleBasedAccessModal, setShowRoleBasedAccessModal] = useState(false);
  const [showTazamaIntegrationModal, setShowTazamaIntegrationModal] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Settings</h1>
      </header>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5">
          <TabsTrigger value="general"><UserCircle className="mr-2 h-4 w-4 sm:hidden md:inline-block" />General</TabsTrigger>
          <TabsTrigger value="notifications"><Bell className="mr-2 h-4 w-4 sm:hidden md:inline-block" />Notifications</TabsTrigger>
          <TabsTrigger value="security"><Shield className="mr-2 h-4 w-4 sm:hidden md:inline-block" />Security</TabsTrigger>
          <TabsTrigger value="rules-management"><Cog className="mr-2 h-4 w-4 sm:hidden md:inline-block" />Rules Management</TabsTrigger>
          <TabsTrigger value="system-integration"><Link2 className="mr-2 h-4 w-4 sm:hidden md:inline-block" />System Integration</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card className="shadow-lg mt-6">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-foreground">General Settings</CardTitle>
              <CardDescription>Manage your account settings and preferences.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Name</Label>
                  <Input id="fullName" placeholder="Enter your name" defaultValue="ProDetect User" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="Enter your email" defaultValue="user@prodetect.com" />
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
              <CardTitle className="text-xl font-semibold text-foreground">Notification Preferences</CardTitle>
              <CardDescription>Control how you receive alerts and updates.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <Checkbox id="emailNotifications" defaultChecked />
                <Label htmlFor="emailNotifications" className="font-normal text-sm">
                  Receive email notifications for critical alerts
                </Label>
              </div>
              <div className="flex items-center space-x-3">
                <Checkbox id="inAppNotifications" defaultChecked />
                <Label htmlFor="inAppNotifications" className="font-normal text-sm">
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
              <CardTitle className="text-xl font-semibold text-foreground">Security Settings</CardTitle>
              <CardDescription>Manage your account security, password, and two-factor authentication.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input id="currentPassword" type="password" placeholder="Enter current password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" type="password" placeholder="Enter new password" />
                </div>
              </div>
              <div className="flex items-center space-x-3 pt-2">
                <Switch id="twoFactorAuth" />
                <Label htmlFor="twoFactorAuth" className="font-normal text-sm">
                  Enable Two-Factor Authentication (2FA)
                </Label>
              </div>
              <div className="flex items-center space-x-3 pt-2">
                <Button variant="outline" onClick={() => setShowRoleBasedAccessModal(true)}>
                  <Shield className="h-4 w-4 mr-2" />
                  Manage Role-Based Access
                </Button>
              </div>
              <Button>Update Security Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rules-management">
          <Card className="shadow-lg mt-6">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-foreground">Rules & Workflow Management</CardTitle>
              <CardDescription>
                Centrally manage compliance workflows, risk policies, AI agent parameters, and adapt rules and workflows quickly without coding.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-border rounded-lg p-8 text-center bg-muted/50">
                <SettingsIcon className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-foreground">No-Code Rule & Policy Engine</h3>
                <p className="text-sm text-muted-foreground mt-2 mb-4">
                  Create, customize, and deploy compliance rules without coding using our visual builder
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <Button variant="outline" onClick={() => setShowNoCodeRulesModal(true)}>
                  <Cog className="h-4 w-4 mr-2" />
                  Access Rules Engine
                </Button>
                <Button variant="outline" onClick={() => setShowTazamaIntegrationModal(true)}>
                  <PlugZap className="h-4 w-4 mr-2" />
                  Tazama Rules Engine
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system-integration">
          <Card className="shadow-lg mt-6">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-foreground">System Integrations & API</CardTitle>
              <CardDescription>Manage API keys, connect third-party services, and access system documentation.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-border rounded-lg p-8 text-center bg-muted/50">
                <div className="flex gap-4">
                  <PlugZap className="h-10 w-10 text-muted-foreground mb-4" />
                  <BookText className="h-10 w-10 text-muted-foreground mb-4" />
                  <Send className="h-10 w-10 text-muted-foreground mb-4" />
                </div>
                <h3 className="text-lg font-medium text-foreground">API, Connectors & Documentation</h3>
                <p className="text-sm text-muted-foreground mt-2 mb-4">
                  Configure integrations, manage API access, and access comprehensive documentation
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <Button variant="outline" onClick={() => setShowApiManagementModal(true)}>
                  <PlugZap className="h-4 w-4 mr-2" />
                  Manage API Keys
                </Button>
                <Button variant="outline" onClick={() => setShowDataConnectorsModal(true)}>
                  <Link2 className="h-4 w-4 mr-2" />
                  Configure Data Connectors
                </Button>
                <Button variant="outline" onClick={() => setShowDocumentationModal(true)}>
                  <BookText className="h-4 w-4 mr-2" />
                  Access Documentation
                </Button>
                <Button variant="outline" onClick={() => setShowRegulatorySubmissionModal(true)}>
                  <Send className="h-4 w-4 mr-2" />
                  Setup Regulatory Submissions
                </Button>
                <Button variant="outline" onClick={() => setShowTazamaIntegrationModal(true)}>
                  <PlugZap className="h-4 w-4 mr-2" />
                  Tazama Rules Engine
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <NoCodeRulesBuilderModal 
        open={showNoCodeRulesModal} 
        onOpenChange={setShowNoCodeRulesModal} 
      />
      
      <ApiManagementModal 
        open={showApiManagementModal} 
        onOpenChange={setShowApiManagementModal} 
      />
      
      <DataConnectorsModal 
        open={showDataConnectorsModal} 
        onOpenChange={setShowDataConnectorsModal} 
      />
      
      <DocumentationAccessModal 
        open={showDocumentationModal} 
        onOpenChange={setShowDocumentationModal} 
      />
      
      <RegulatorySubmissionModal 
        open={showRegulatorySubmissionModal} 
        onOpenChange={setShowRegulatorySubmissionModal} 
      />
      
      <RoleBasedAccessModal 
        open={showRoleBasedAccessModal} 
        onOpenChange={setShowRoleBasedAccessModal} 
      />

      <TazamaIntegrationModal
        open={showTazamaIntegrationModal}
        onOpenChange={setShowTazamaIntegrationModal}
      />
    </div>
  );
}