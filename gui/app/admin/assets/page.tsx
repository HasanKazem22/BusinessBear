"use client";

import { AssetConfigTab } from "../_components/AssetConfigTab";

export default function AssetsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Real Assets</h1>
        <p className="text-muted-foreground mt-1">
          Manage your real estate listings.
        </p>
      </div>
      <AssetConfigTab />
    </div>
  );
}
