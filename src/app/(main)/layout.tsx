import Link from 'next/link';
import type { ReactNode } from 'react';
import {
  Home,
  Users,
  BellRing,
  ShieldAlert,
  Settings,
  SearchCode,
} from 'lucide-react';
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
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ProDetectLogo } from '@/components/icons/logo';
import { Toaster } from "@/components/ui/toaster";

interface NavItem {
  href: string;
  icon: React.ElementType;
  label: string;
  tooltip: string;
}

const navItems: NavItem[] = [
  { href: '/', icon: Home, label: 'Dashboard', tooltip: 'Overview' },
  { href: '/fuzzy-matching', icon: SearchCode, label: 'Fuzzy Matching', tooltip: 'AI Matching' },
  { href: '/alerts-workflows', icon: BellRing, label: 'Alerts & Workflows', tooltip: 'Notifications' },
];

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider defaultOpen>
      <Sidebar>
        <SidebarHeader className="p-4">
          <div className="flex items-center gap-2">
            <ProDetectLogo className="text-sidebar-primary" />
            <h1 className="text-xl font-semibold text-sidebar-foreground group-data-[collapsible=icon]:hidden">
              ProDetect
            </h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.label}>
                <Link href={item.href} passHref legacyBehavior>
                  <SidebarMenuButton tooltip={item.tooltip} asChild>
                    <a>
                      <item.icon />
                      <span>{item.label}</span>
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
                <a>
                  <Settings />
                  <span>Settings</span>
                </a>
              </SidebarMenuButton>
          </Link>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background/80 px-6 backdrop-blur-md">
          <SidebarTrigger />
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <BellRing className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </Button>
            <Avatar className="h-9 w-9">
              <AvatarImage src="https://picsum.photos/seed/user/40/40" alt="User Avatar" data-ai-hint="user avatar" />
              <AvatarFallback>PD</AvatarFallback>
            </Avatar>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
        <Toaster />
      </SidebarInset>
    </SidebarProvider>
  );
}