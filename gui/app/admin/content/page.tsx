"use client";

import { PermissionGuard } from "@/components/PermissionGuard";
import { AccessDeniedCard } from "@/components/ui/AccessDeniedCard";
import { ContentConfigTab } from "../_components/ContentConfigTab";

export default function AdminContentPage() {
  return (
    <PermissionGuard
      require="content.isAdminConfig"
      fallback={<AccessDeniedCard title="Content Access Denied" description="You do not have permission to view or manage content." />}
    >
      <div className="space-y-4">
        <div className="text-center max-w-xl mx-auto space-y-1.5 pt-2">
          <h1 className="text-lg md:text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Facebook Content & Video Management
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
            Manage your Facebook video breakdowns, entrepreneur interviews, 20/80 series, and published case studies.
          </p>
        </div>
        <ContentConfigTab />
      </div>
    </PermissionGuard>
  );
}
