"use client";

import { HomeConfigTab } from "../_components/HomeConfigTab";

export default function HomeSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Home</h1>
        <p className="text-muted-foreground mt-1">
          Configure the main landing page content.
        </p>
      </div>
      <HomeConfigTab />
    </div>
  );
}
