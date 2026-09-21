"use client";

import { PermissionGuard } from "@/components/PermissionGuard";
import { AccessDeniedCard } from "@/components/ui/AccessDeniedCard";
import { UddoktaConfigTab } from "../_components/UddoktaConfigTab";

export default function AdminUddoktaPage() {
  return (
    <PermissionGuard
      require="uddokta.isAdminConfig"
      fallback={<AccessDeniedCard title="Uddokta Access Denied" description="You do not have permission to view or manage Uddokta applications." />}
    >
      <div className="space-y-4">
        <div className="text-center max-w-xl mx-auto space-y-1.5 pt-2">
          <h1 className="text-lg md:text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
            20/80 Uddokta Hub & Partner Applications
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
            Manage joint Uddokta businesses, 80/20 equity splits, founder profiles, and review incoming partner applications.
          </p>
        </div>
        <UddoktaConfigTab />
      </div>
    </PermissionGuard>
  );
}
