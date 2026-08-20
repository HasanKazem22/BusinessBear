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

type Asset = {
  id: number;
  title: string;
  location: string;
  price: string;
  status: string;
};

const initialAssets: Asset[] = [
  { id: 1, title: "The Glass House", location: "Beverly Hills, CA", price: "1,25,00,000", status: "For Sale" },
  { id: 2, title: "Urban Skyline Penthouse", location: "Manhattan, NY", price: "4,10,00,000", status: "For Rent" },
  { id: 3, title: "Architectural Masterpiece", location: "Austin, TX", price: "95,00,000", status: "For Sale" },
];

export function AssetConfigTab() {
  const [assets, setAssets] = useState<Asset[]>(initialAssets);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Asset>>({ title: "", location: "", price: "", status: "" });
  const [editingId, setEditingId] = useState<number | null>(null);

  const handleOpenNew = () => {
    setEditingId(null);
    setFormData({ title: "", location: "", price: "", status: "For Sale" });
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (asset: Asset) => {
    setEditingId(asset.id);
    setFormData(asset);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this real asset?")) {
      setAssets(assets.filter(a => a.id !== id));
    }
  };

  const handleSave = () => {
    if (editingId) {
      setAssets(assets.map(a => a.id === editingId ? { ...a, ...formData } as Asset : a));
    } else {
      setAssets([...assets, { ...formData, id: Date.now() } as Asset]);
    }
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-4 mt-4">
      <div className="flex justify-end items-center mb-2">
        <Button onClick={handleOpenNew} size="sm" className="h-8 text-xs font-semibold">
          <Plus className="h-3.5 w-3.5 mr-1" /> Add Asset
        </Button>
        <GlobalModal
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          title={editingId ? "Edit Asset" : "Add New Asset"}
          description="Make changes to your real estate asset here. Click save when you're done."
          onSave={handleSave}
        >
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="title" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Property Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. The Glass House"
                className="rounded-md"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="location" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Beverly Hills, CA"
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
                  placeholder="e.g. 1,25,00,000"
                  className="rounded-md"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="status" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Listing Status</Label>
                <Input
                  id="status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  placeholder="FOR SALE / FOR RENT"
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
            <TableHead>Property Title</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {assets.map((asset, index) => (
            <TableRow key={asset.id} className="group">
              <TableCell className="font-mono text-xs font-semibold text-zinc-400 text-center">
                {String(index + 1).padStart(2, '0')}
              </TableCell>
              <TableCell className="font-bold text-zinc-900 dark:text-white">
                {asset.title}
              </TableCell>
              <TableCell className="text-zinc-600 dark:text-zinc-400">
                {asset.location}
              </TableCell>
              <TableCell className="font-semibold text-zinc-900 dark:text-white">
                ৳ {asset.price}
              </TableCell>
              <TableCell>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${asset.status === 'FOR SALE'
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                    : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                  }`}>
                  {asset.status}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <button
                    onClick={() => handleOpenEdit(asset)}
                    className="w-7 h-7 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 flex items-center justify-center transition-colors"
                    title="Edit Asset"
                  >
                    <Pencil className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => handleDelete(asset.id)}
                    className="w-7 h-7 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 flex items-center justify-center transition-colors"
                    title="Delete Asset"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {assets.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-zinc-500 py-10">
                No assets found. Click "+ Add Asset" to get started.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
