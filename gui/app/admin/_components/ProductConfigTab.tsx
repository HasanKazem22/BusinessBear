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
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Manage Products</h2>
        <Button onClick={handleOpenNew}>
          <Plus className="h-4 w-4 mr-2" /> Add Product
        </Button>
        <GlobalModal
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          title={editingId ? "Edit Product" : "Add New Product"}
          description="Make changes to your product here. Click save when you're done."
          onSave={handleSave}
        >
          <div className="grid gap-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Name</Label>
              <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">Price</Label>
              <Input id="price" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="originalPrice" className="text-right">Old Price</Label>
              <Input id="originalPrice" value={formData.originalPrice} onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="brand" className="text-right">Brand</Label>
              <Input id="brand" value={formData.brandLogo} onChange={(e) => setFormData({ ...formData, brandLogo: e.target.value })} className="col-span-3" />
            </div>
          </div>
        </GlobalModal>
      </div>

      <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Brand</TableHead>
              <TableHead>Price (Tk.)</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((prod) => (
              <TableRow key={prod.id}>
                <TableCell className="font-medium">{prod.name}</TableCell>
                <TableCell>{prod.brandLogo}</TableCell>
                <TableCell>{prod.price}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(prod)}>
                      <Pencil className="h-4 w-4 text-blue-500" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(prod.id)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {products.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                  No products found. Add some!
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
