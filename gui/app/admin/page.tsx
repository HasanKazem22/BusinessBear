"use client";

import { DashboardTab } from "./_components/DashboardTab";

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back, Admin. Here's what's happening today.
        </p>
      </div>
      <DashboardTab />
    </div>
  );
}
