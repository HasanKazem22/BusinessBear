"use client";

import { ProductConfigTab } from "../_components/ProductConfigTab";

export default function ProductsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Products</h1>
        <p className="text-muted-foreground mt-1">
          Manage your product inventory.
        </p>
      </div>
      <ProductConfigTab />
    </div>
  );
}
