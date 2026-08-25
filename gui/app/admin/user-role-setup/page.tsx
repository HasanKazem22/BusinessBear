"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { SystemUsersTab } from "./_components/SystemUsersTab";
import { CustomerUsersTab } from "./_components/CustomerUsersTab";
import { RolesTab } from "./_components/RolesTab";
import { RolePermissionSetupTab } from "./_components/RolePermissionSetupTab";
import {
  LuUsers, LuUserCheck, LuShield, LuSlidersHorizontal, LuLock
} from "react-icons/lu";

import { AccessDeniedCard } from "@/components/ui/AccessDeniedCard";

export default function UserRoleSetupPage() {
  const { can, hasRole } = useAuth();
  const [activeTab, setActiveTab] = useState<"system" | "customers" | "roles" | "permissionSetup">("system");

  if (!hasRole("ROLE_ADMIN") && !can("userRoleSetup.isUserRolePage")) {
    return <AccessDeniedCard title="User & Role Setup Restricted" description="You do not have permission to manage user accounts, roles, or permission trees." />;
  }

  const tabs = [
    { id: "system", label: "System Users", icon: LuUsers, permission: "userRoleSetup.systemUser.isSystemUser" },
    { id: "customers", label: "Customer Users", icon: LuUserCheck, permission: "userRoleSetup.customerUser.isCustomerUser" },
    { id: "roles", label: "Roles Management", icon: LuShield, permission: "userRoleSetup.roleManagement.isRoleManagement" },
    { id: "permissionSetup", label: "Role Permission Setup", icon: LuSlidersHorizontal, permission: "userRoleSetup.rolePermissionSetup.isRolePermissionSetup" },
  ].filter((t) => hasRole("ROLE_ADMIN") || can(t.permission));

  return (
    <div className="space-y-5">
      {/* Centered Header Matching Other Admin Pages */}
      <div className="text-center max-w-xl mx-auto space-y-1.5 pt-2">
        <h1 className="text-lg md:text-xl font-bold tracking-tight text-zinc-900 dark:text-white flex items-center justify-center gap-2">
          <LuShield className="w-5 h-5 text-zinc-500 dark:text-zinc-400" />
          User & Role Security Control Hub
        </h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
          Manage system administrators, customer accounts, role definitions, and dynamic permission trees.
        </p>
      </div>

      {/* Sleek Segmented Pill Tab Bar (Mobile Scrollable) */}
      <div className="flex items-center justify-start md:justify-center overflow-x-auto pb-1.5 w-full max-w-full no-scrollbar px-1">
        <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-zinc-100/80 dark:bg-zinc-900/80 border border-zinc-200/80 dark:border-zinc-800/80 backdrop-blur-md shadow-xs shrink-0 min-w-max">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer select-none whitespace-nowrap ${
                  isActive
                    ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 shadow-xs"
                    : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200/60 dark:hover:bg-zinc-800/60"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab View Content */}
      <div className="animate-in fade-in duration-150">
        {activeTab === "system" && <SystemUsersTab />}
        {activeTab === "customers" && <CustomerUsersTab />}
        {activeTab === "roles" && <RolesTab />}
        {activeTab === "permissionSetup" && <RolePermissionSetupTab />}
      </div>
    </div>
  );
}
