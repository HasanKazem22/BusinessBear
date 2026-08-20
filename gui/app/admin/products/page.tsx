"use client";

import { ProductConfigTab } from "../_components/ProductConfigTab";

export default function ProductsPage() {
  return (
    <div className="space-y-4">
      <div className="text-center max-w-xl mx-auto space-y-1.5 pt-2">
        <h1 className="text-lg md:text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Product Inventory & POS Management
        </h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
          Manage your product catalog, update stock quantities, price lists, and record POS sales transactions.
        </p>
      </div>
      <ProductConfigTab />
    </div>
  );
}
