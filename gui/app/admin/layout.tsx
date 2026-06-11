"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  PlusCircle,
  Users,
  Settings,
  ChevronRight,
  ChevronLeft,
  Menu
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const sidebarItems = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Product Add",
    href: "/admin/products/add",
    icon: PlusCircle,
  },
  {
    name: "User Management",
    href: "/admin/users",
    icon: Users,
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden relative">
      {/* Sidebar */}
      <aside
        className={cn(
          "border-r border-border bg-muted/30 hidden md:flex flex-col transition-all duration-300 ease-in-out",
          isCollapsed ? "w-16" : "w-48"
        )}
      >
        <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200",
                  isActive
                    ? "bg-zinc-100 text-zinc-950 dark:bg-[#25D379]/10 dark:text-[#25D379]"
                    : "text-muted-foreground hover:bg-zinc-100/50 hover:text-zinc-950 dark:hover:bg-zinc-800/50 dark:hover:text-zinc-100",
                  isCollapsed ? "justify-center px-0" : "justify-between"
                )}
                title={isCollapsed ? item.name : ""}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="h-4 w-4 shrink-0" />
                  {!isCollapsed && <span>{item.name}</span>}
                </div>
                {!isCollapsed && isActive && <ChevronRight className="h-4 w-4" />}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Floating Toggle Button (Moved outside sidebar to prevent blinking) */}
      <Button
        variant="secondary"
        size="icon"
        onClick={() => setIsCollapsed(!isCollapsed)}
        className={cn(
          "absolute top-1/2 -translate-y-1/2 h-6 w-6 rounded-full border border-border shadow-md z-50 transition-all duration-300 ease-in-out bg-background hover:scale-110 active:scale-95",
          isCollapsed ? "left-[52px]" : "left-[180px]"
        )}
      >
        {isCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </Button>

      {/* Main Content Area (Fixed scrollable area) */}
      <div className="flex-1 overflow-y-auto bg-background p-8">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
