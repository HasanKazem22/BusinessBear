"use client";

import { DashboardTab } from "./_components/DashboardTab";

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="text-center max-w-xl mx-auto space-y-1.5 pt-2">
        <h1 className="text-lg md:text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Admin Dashboard Overview
        </h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
          Welcome back, Admin. Here's a high-level summary of your business analytics, sales, and activity today.
        </p>
      </div>
      <DashboardTab />
    </div>
  );
}
