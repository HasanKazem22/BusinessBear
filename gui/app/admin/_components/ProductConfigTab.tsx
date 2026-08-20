"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GlobalModal } from "@/components/ui/global-modal";

type Product = {
  id: number;
  name: string;
  price: string;
  originalPrice: string;
  brandLogo: string;
  rating: number;
};

const initialProducts: Product[] = [
  { id: 1, name: "realme Note 60x", price: "12,999", originalPrice: "", brandLogo: "realme", rating: 5.0 },
  { id: 2, name: "iPhone 17", price: "1,47,499", originalPrice: "1,79,999", brandLogo: "Apple", rating: 5.0 },
  { id: 3, name: "Samsung Galaxy S26", price: "1,29,999", originalPrice: "1,49,999", brandLogo: "Samsung", rating: 5.0 },
];

export function ProductConfigTab() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Product>>({ name: "", price: "", originalPrice: "", brandLogo: "", rating: 5.0 });
  const [editingId, setEditingId] = useState<number | null>(null);

  const handleOpenNew = () => {
    setEditingId(null);
    setFormData({ name: "", price: "", originalPrice: "", brandLogo: "", rating: 5.0 });
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (prod: Product) => {
    setEditingId(prod.id);
    setFormData(prod);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this product?")) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const handleSave = () => {
    if (editingId) {
      setProducts(products.map(p => p.id === editingId ? { ...p, ...formData } as Product : p));
    } else {
      setProducts([...products, { ...formData, id: Date.now() } as Product]);
    }
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-4 mt-4">
      <div className="flex justify-end items-center mb-2">
        <Button onClick={handleOpenNew} size="sm" className="h-8 text-xs font-semibold">
          <Plus className="h-3.5 w-3.5 mr-1" /> Add Product
        </Button>
        <GlobalModal
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          title={editingId ? "Edit Product" : "Add New Product"}
          description="Make changes to your product here. Click save when you're done."
          onSave={handleSave}
        >
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Product Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. iPhone 17"
                className="rounded-md"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="brand" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Brand Name</Label>
              <Input
                id="brand"
                value={formData.brandLogo}
                onChange={(e) => setFormData({ ...formData, brandLogo: e.target.value })}
                placeholder="e.g. Apple, Samsung, realme"
                className="rounded-md"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="price" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Price (Tk.)</Label>
                <Input
                  id="price"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="e.g. 1,47,499"
                  className="rounded-md"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="originalPrice" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Old Price (Optional)</Label>
                <Input
                  id="originalPrice"
                  value={formData.originalPrice}
                  onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                  placeholder="e.g. 1,79,999"
                  className="rounded-md"
                />
              </div>
            </div>
          </div>
        </GlobalModal>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12 text-center">SL</TableHead>
            <TableHead>Product Name</TableHead>
            <TableHead>Brand</TableHead>
            <TableHead>Price</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((prod, index) => (
            <TableRow key={prod.id} className="group">
              <TableCell className="font-mono text-xs font-semibold text-zinc-400 text-center">
                {String(index + 1).padStart(2, '0')}
              </TableCell>
              <TableCell className="font-bold text-zinc-900 dark:text-white">
                {prod.name}
              </TableCell>
              <TableCell>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200/50 dark:border-zinc-700/50">
                  {prod.brandLogo || "Generic"}
                </span>
              </TableCell>
              <TableCell className="font-semibold text-zinc-900 dark:text-white">
                ৳ {prod.price}
                {prod.originalPrice && (
                  <span className="ml-2 text-xs text-zinc-400 line-through">৳ {prod.originalPrice}</span>
                )}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <button
                    onClick={() => handleOpenEdit(prod)}
                    className="w-7 h-7 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 flex items-center justify-center transition-colors"
                    title="Edit Product"
                  >
                    <Pencil className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => handleDelete(prod.id)}
                    className="w-7 h-7 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 flex items-center justify-center transition-colors"
                    title="Delete Product"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {products.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-zinc-500 py-10">
                No products found. Click "+ Add Product" to get started.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
