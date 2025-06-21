"use client";

import Link from "next/link";
import { useState, useRef, useEffect, ReactNode } from "react";
import {
  Home,
  BellRing,
  ShieldCheck,
  Settings,
  SearchCode,
  Activity,
  ClipboardList,
  Wallet2,
  Moon,
  Sun,
  LogOut,
  User,
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
import { ProDetectLogo } from '@/components/icons/logo';
import { Toaster } from "@/components/ui/toaster";
import { useAuth } from "@/lib/auth/auth-provider";
import { useRouter } from "next/navigation";

interface NavItem {
  href: string;
  icon: React.ElementType;
  label: string;
  tooltip: string;
}

const navItems: NavItem[] = [
  {
    href: "/",
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
    label: "Sanction Screening",
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
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(
    typeof window !== "undefined"
      ? document.documentElement.classList.contains("dark")
      : false
  );
  const [notificationsCount, setNotificationsCount] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, profile, signOut } = useAuth();
  const router = useRouter();

  // Ref for dropdown menu
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Outside click handler for avatar dropdown
  useEffect(() => {
    if (!userMenuOpen) return;
    function handleClick(event: MouseEvent) {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [userMenuOpen]);

  // Light/Dark mode toggle (adds/removes 'dark' class on <html>)
  const toggleDarkMode = () => {
    const html = document.documentElement;
    if (html.classList.contains("dark")) {
      html.classList.remove("dark");
      setDarkMode(false);
      localStorage.setItem("theme", "light");
    } else {
      html.classList.add("dark");
      setDarkMode(true);
      localStorage.setItem("theme", "dark");
    }
  };

  // Set initial theme on mount (respects localStorage)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const theme = localStorage.getItem("theme");
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      setDarkMode(true);
    } else if (theme === "light") {
      document.documentElement.classList.remove("dark");
      setDarkMode(false);
    }
  }, []);

  const filteredNavItems = navItems.filter((item) =>
    item.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLogout = async () => {
    try {
      await signOut();
      // Redirect is handled in the auth provider
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (profile) {
      return `${profile.first_name?.[0] || ''}${profile.last_name?.[0] || ''}`.toUpperCase();
    } else if (user) {
      const nameParts = user.email?.split('@')[0].split(/[._-]/) || [];
      return nameParts.map(part => part[0]?.toUpperCase() || '').join('').substring(0, 2);
    }
    return 'PD';
  };

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
            {filteredNavItems.map((item) => (
              <SidebarMenuItem key={item.label} className="py-1">
                <SidebarMenuButton
                  tooltip={item.tooltip}
                  asChild
                  className="h-10"
                >
                  <Link href={item.href} className="flex items-center gap-3 px-4">
                    <item.icon className="h-5 w-5" />
                    <span className="text-base">{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-4">
          <SidebarMenuButton tooltip="Settings" asChild>
            <Link href="/settings" className="flex items-center gap-3 px-4">
              <Settings className="h-5 w-5" />
              <span className="text-base">Settings</span>
            </Link>
          </SidebarMenuButton>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="top-0 z-10 flex h-16 items-center justify-between border-b bg-background/80 px-6 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <SidebarTrigger
              onClick={() => setSidebarOpen((open) => !open)}
              aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            />
            <input
              type="search"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="hidden sm:block rounded-md border border-gray-300 px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="Search site"
            />
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Toggle dark mode"
              onClick={toggleDarkMode}
              title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            {/* Notification Bell with Badge */}
            <Button
              variant="ghost"
              size="icon"
              aria-label="Notifications"
              className="relative"
              onClick={() => alert("Open notifications panel")}
            >
              <BellRing className="h-5 w-5" />
              {notificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-xs font-semibold text-white">
                  {notificationsCount}
                </span>
              )}
            </Button>

            {/* Avatar with Dropdown */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen((open) => !open)}
                aria-haspopup="true"
                aria-expanded={userMenuOpen}
                className="flex items-center rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
                title="User menu"
              >
                <Avatar className="h-9 w-9">
                  <AvatarImage
                    src={profile?.avatar_url || undefined}
                    alt={profile?.first_name ? `${profile.first_name} ${profile.last_name}` : "User Avatar"}
                    data-ai-hint="user avatar"
                  />
                  <AvatarFallback>{getUserInitials()}</AvatarFallback>
                </Avatar>
              </button>
              {userMenuOpen && (
                <ul
                  className="absolute right-0 mt-2 w-48 rounded-md border border-gray-200 bg-white shadow-lg dark:bg-gray-800 dark:border-gray-700 z-50"
                  role="menu"
                  aria-label="User menu"
                >
                  <li className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                    <div className="text-sm font-medium">{profile?.first_name} {profile?.last_name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</div>
                  </li>
                  <li>
                    <Link href="/profile">
                      <div
                        className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                        role="menuitem"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <User className="h-4 w-4" />
                        Profile
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link href="/settings">
                      <div
                        className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                        role="menuitem"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Settings className="h-4 w-4" />
                        Settings
                      </div>
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center gap-2 text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-red-600 dark:text-red-400"
                      role="menuitem"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </li>
                </ul>
              )}
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
        <Toaster />
      </SidebarInset>
    </SidebarProvider>
  );
}