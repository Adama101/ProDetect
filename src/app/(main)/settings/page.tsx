import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Settings as SettingsIcon } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage your ProDetect application settings.</p>
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
        </CardHeader>
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
          <CardTitle className="text-xl font-semibold text-foreground">System Settings</CardTitle>
          <CardDescription>Configure system-wide parameters. (Placeholder)</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-border rounded-lg p-8 text-center">
              <SettingsIcon className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground">Advanced system configuration will be available here.</h3>
              <p className="text-sm text-muted-foreground">
                Manage API keys, integrations, and other advanced settings.
              </p>
            </div>
        </CardContent>
      </Card>

    </div>
  );
}