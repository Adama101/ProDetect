import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Settings as SettingsIcon, Send, BookText, PlugZap } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage your ProDetect application settings and integrations.</p>
      </header>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-foreground">User Profile</CardTitle>
          <CardDescription>Update your personal information and preferences.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" defaultValue="ProDetect User" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" defaultValue="user@prodetect.com" />
            </div>
          </div>
          <Button>Save Profile Changes</Button>
        </CardContent>
      </Card>
      
      <Separator />

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-foreground">Notification Preferences</CardTitle>
          <CardDescription>Control how you receive alerts and updates.</CardDescription>
        </Header>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox id="emailNotifications" defaultChecked />
            <Label htmlFor="emailNotifications" className="font-normal">
              Receive email notifications for critical alerts
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="inAppNotifications" defaultChecked />
            <Label htmlFor="inAppNotifications" className="font-normal">
              Show in-app notifications for new alerts
            </Label>
          </div>
           <div className="flex items-center space-x-2">
            <Checkbox id="weeklySummary" />
            <Label htmlFor="weeklySummary" className="font-normal">
              Send weekly summary reports
            </Label>
          </div>
          <Button>Save Notification Settings</Button>
        </CardContent>
      </Card>

      <Separator />

       <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-foreground">System & Workflow Configuration</CardTitle>
          <CardDescription>
            Centrally manage compliance workflows, risk policies, AI agent parameters, and adapt rules and workflows quickly without coding.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-border rounded-lg p-8 text-center">
              <SettingsIcon className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground">No-Code Rule & Policy Engine</h3>
              <p className="text-sm text-muted-foreground">
                Configure detection rules, risk scoring typologies, automated workflows, and policy enforcement. Manage multi-jurisdictional regulation settings (e.g., FATCA, AUSTRAC) and AI model parameters.
              </p>
            </div>
        </CardContent>
      </Card>
      
      <Separator />

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-foreground">Reporting & Submissions</CardTitle>
          <CardDescription>
            Configure automated report generation, direct submissions to regulators, and manage audit-ready documentation.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-border rounded-lg p-8 text-center">
              <Send className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground">Integrated Reporting Tools</h3>
              <p className="text-sm text-muted-foreground">
                Set up schedules for compliance reports (SAR/STR), customize templates, and configure secure channels for direct regulatory submissions (e.g., goAML, FinCEN).
              </p>
            </div>
        </CardContent>
      </Card>

      <Separator />

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-foreground">Integrations & Documentation</CardTitle>
          <CardDescription>Manage API keys, connect third-party services, and access system documentation.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-border rounded-lg p-8 text-center">
              <div className="flex gap-4">
                <PlugZap className="h-12 w-12 text-muted-foreground mb-4" />
                <BookText className="h-12 w-12 text-muted-foreground mb-4" />
              </div>
              <h3 className="text-lg font-medium text-muted-foreground">API & Developer Resources</h3>
              <p className="text-sm text-muted-foreground">
                Set up data connectors, manage API keys for system integrations, and access comprehensive developer guides and documentation.
              </p>
            </div>
        </CardContent>
      </Card>

    </div>
  );
}
