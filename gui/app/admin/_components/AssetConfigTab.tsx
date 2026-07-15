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
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Manage Real Assets</h2>
        <Button onClick={handleOpenNew}>
          <Plus className="h-4 w-4 mr-2" /> Add Asset
        </Button>
        <GlobalModal
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          title={editingId ? "Edit Asset" : "Add New Asset"}
          description="Make changes to your real estate asset here. Click save when you're done."
          onSave={handleSave}
        >
          <div className="grid gap-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">Title</Label>
              <Input id="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="location" className="text-right">Location</Label>
              <Input id="location" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">Price</Label>
              <Input id="price" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">Status</Label>
              <Input id="status" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="col-span-3" placeholder="e.g. For Sale, Rent" />
            </div>
          </div>
        </GlobalModal>
      </div>

      <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Price (Tk.)</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assets.map((asset) => (
              <TableRow key={asset.id}>
                <TableCell className="font-medium">{asset.title}</TableCell>
                <TableCell>{asset.location}</TableCell>
                <TableCell>{asset.price}</TableCell>
                <TableCell>
                  <span className="bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded text-[10px] font-bold uppercase">{asset.status}</span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(asset)}>
                      <Pencil className="h-4 w-4 text-blue-500" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(asset.id)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {assets.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                  No assets found. Add some!
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
