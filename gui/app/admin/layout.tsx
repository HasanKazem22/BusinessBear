"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LuLayoutDashboard,
  LuPackage,
  LuUsers,
  LuSettings,
  LuHouse,
  LuBuilding2,
  LuChevronRight,
  LuChevronLeft,
  LuMail,
  LuShield,
  LuTv,
  LuRocket
} from "react-icons/lu";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DesktopOnlyCard } from "@/components/ui/DesktopOnlyCard";
import { useAuth } from "@/context/AuthContext";

const sidebarItems = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LuLayoutDashboard,
    requirePermission: null,
  },
  {
    name: "Home",
    href: "/admin/home",
    icon: LuHouse,
    requirePermission: "home.isAdminConfig",
  },
  {
    name: "Messages",
    href: "/admin/messages",
    icon: LuMail,
    requirePermission: "contactMessage.isAdminConfig",
  },
  {
    name: "Content",
    href: "/admin/content",
    icon: LuTv,
    requirePermission: "content.isAdminConfig",
  },
  {
    name: "Uddokta",
    href: "/admin/uddokta",
    icon: LuRocket,
    requirePermission: "uddokta.isAdminConfig",
  },
  {
    name: "Products",
    href: "/admin/products",
    icon: LuPackage,
    requirePermission: "product.isAdminConfig",
  },
  {
    name: "Real Assets",
    href: "/admin/assets",
    icon: LuBuilding2,
    requirePermission: "realAsset.isAdminConfig",
  },
  {
    name: "User & Role Setup",
    href: "/admin/user-role-setup",
    icon: LuShield,
    requirePermission: "userRoleSetup.isAdminConfig",
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { canAccess, hasRole } = useAuth();

  // Dynamic Sidebar Filtering based on Server RolePermission Tree
  const filteredSidebarItems = sidebarItems.filter((item) => {
    if (!item.requirePermission) return true;
    return canAccess(item.requirePermission);
  });

  return (
    <>
      {/* Mobile / Small Screen Notice */}
      <div className="block md:hidden">
        <DesktopOnlyCard />
      </div>

      {/* Desktop / Laptop / Tablet Admin Panel */}
      <div className="hidden md:flex h-full overflow-hidden relative">
        {/* Sidebar */}
        <aside
          className={cn(
            "border-r border-border bg-muted/30 flex flex-col transition-all duration-300 ease-in-out",
            isCollapsed ? "w-16" : "w-52"
          )}
        >
          <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
            {filteredSidebarItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200",
                    isActive
                      ? "bg-zinc-100 text-zinc-950 dark:bg-white/10 dark:text-white"
                      : "text-muted-foreground hover:bg-zinc-100/50 hover:text-zinc-950 dark:hover:bg-zinc-800/50 dark:hover:text-zinc-100",
                    isCollapsed ? "justify-center px-0" : "justify-between"
                  )}
                  title={isCollapsed ? item.name : ""}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="h-4 w-4 shrink-0" />
                    {!isCollapsed && <span className="truncate">{item.name}</span>}
                  </div>
                  {!isCollapsed && isActive && <LuChevronRight className="h-4 w-4" />}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Floating Toggle Button */}
        <Button
          variant="secondary"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn(
            "absolute top-1/2 -translate-y-1/2 h-6 w-6 rounded-full border border-border shadow-md z-50 transition-all duration-300 ease-in-out bg-background hover:scale-110 active:scale-95",
            isCollapsed ? "left-[52px]" : "left-[196px]"
          )}
        >
          {isCollapsed ? <LuChevronRight className="h-3 w-3" /> : <LuChevronLeft className="h-3 w-3" />}
        </Button>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto bg-background p-8">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
