import Link from "next/link";
import type { ReactNode } from "react";
import {
  Home,
  BellRing,
  ShieldCheck,
  Settings,
  SearchCode,
  Activity,
  ClipboardList,
  Wallet2,
} from "lucide-react";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ProDetectLogo } from "@/components/icons/logo";
import { Toaster } from "@/components/ui/toaster";

interface NavItem {
  href: string;
  icon: React.ElementType;
  label: string;
  tooltip: string;
}

const navItems: NavItem[] = [
  { href: "/", 
    icon: Home, label: "Dashboard", 
    tooltip: "Overview" 
  },
  {
    href: "/transaction-monitoring",
    icon: Wallet2,
    label: "Transactions",
    tooltip: "Real-time Monitoring",
  },
  {
    href: "/fuzzy-matching",
    icon: SearchCode,
    label: "Fuzzy Matching",
    tooltip: "AI Name Screening",
  },
  {
    href: "/behavioral-modeling",
    icon: Activity,
    label: "Behavioral Analytics",
    tooltip: "Customer Segmentation & Anomalies",
  },
  {
    href: "/alerts-workflows",
    icon: ShieldCheck,
    label: "Compliance Ops",
    tooltip: "Alerts, Cases & Workflows",
  },
  {
    href: "/reports",
    icon: ClipboardList,
    label: "Reports",
    tooltip: "Compliance Reporting",
  },
];

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider defaultOpen>
      <Sidebar>
        <SidebarHeader className="p-4">
          <div className="flex items-center gap-2">
            <ProDetectLogo className="text-sidebar-primary" />
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu className="space-y-1">
            {navItems.map((item) => (
              <SidebarMenuItem key={item.label} className="py-1">
                <Link href={item.href} passHref legacyBehavior>
                  <SidebarMenuButton
                    tooltip={item.tooltip}
                    asChild
                    className="h-10"
                  >
                    <a className="flex items-center gap-3 px-4">
                      <item.icon className="h-5 w-5" />
                      <span className="text-base">{item.label}</span>
                    </a>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-4">
          <Link href="/settings" passHref legacyBehavior>
            <SidebarMenuButton tooltip="Settings" asChild>
              <a className="flex items-center gap-3 px-4">
                <Settings className="h-5 w-5" />
                <span className="text-base">Settings</span>
              </a>
            </SidebarMenuButton>
          </Link>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className=" top-0 z-10 flex h-16 items-center justify-between border-b bg-background/80 px-6 backdrop-blur-md">
          <SidebarTrigger />
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <BellRing className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </Button>
            <Avatar className="h-9 w-9">
              <AvatarImage
                src="https://picsum.photos/seed/user/40/40"
                alt="User Avatar"
                data-ai-hint="user avatar"
              />
              <AvatarFallback>PD</AvatarFallback>
            </Avatar>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
        <Toaster />
      </SidebarInset>
    </SidebarProvider>
  );
}
