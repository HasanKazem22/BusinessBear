"use client";

import { AssetConfigTab } from "../_components/AssetConfigTab";

export default function AssetsPage() {
  return (
    <div className="space-y-4">
      <div className="text-center max-w-xl mx-auto space-y-1.5 pt-2">
        <h1 className="text-lg md:text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Real Assets & Property Portfolio
        </h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
          Manage exclusive property listings, update listing statuses, prices, and review client booking leads.
        </p>
      </div>
      <AssetConfigTab />
    </div>
  );
}
