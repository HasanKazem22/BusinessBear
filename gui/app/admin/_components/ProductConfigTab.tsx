"use client";

import { useState, useEffect } from "react";
import {
  LuPlus, LuPencil, LuTrash2,
  LuTag, LuLayoutGrid, LuPackage,
  LuDollarSign, LuImage, LuFileText,
} from "react-icons/lu";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Modal } from "@/components/ui/modal";
import { ImageInput } from "@/components/ui/image-input";
import { Loader } from "@/components/ui/loader";
import { ServerErrorCard } from "@/components/ui/ServerErrorCard";
import { PermissionGuard } from "@/components/PermissionGuard";
import { TableLayout } from "@/components/ui/table-layout";
import { productService } from "@/services/productService";
import { homeService } from "@/services/homeService";
import { Product } from "@/types/product";
import { toast } from "react-hot-toast";

function FieldLabel({ icon: Icon, text, required }: { icon: any; text: string; required?: boolean }) {
  return (
    <label className="flex items-center gap-1.5 text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest mb-1.5">
      <Icon className="w-3 h-3" />
      {text}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  );
}

function Toggle({ checked, onChange, disabled }: { checked: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed ${
        checked ? "bg-emerald-500" : "bg-zinc-200 dark:bg-zinc-700"
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-3.5 w-3.5 rounded-full bg-white shadow-lg ring-0 transition-transform duration-200 ${
          checked ? "translate-x-4" : "translate-x-0"
        }`}
      />
    </button>
  );
}

export function ProductConfigTab() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(100);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const defaultForm = (): Partial<Product> => ({
    name: "", sku: "", brandLogo: "", category: "",
    price: 0, buyingPrice: 0, stockQuantity: 0,
    imageUrl: "", description: "", isActive: true,
  });

  const [formData, setFormData] = useState<Partial<Product>>(defaultForm());

  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await productService.getProducts();
      setProducts(res.data || []);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const handleOpenNew = () => { setEditingId(null); setFormData(defaultForm()); setIsDialogOpen(true); };

  const handleOpenEdit = (prod: Product) => {
    setEditingId(prod.id || null);
    setFormData({
      name: prod.name, sku: prod.sku || "", brandLogo: prod.brandLogo || "",
      category: prod.category || "", price: prod.price, buyingPrice: prod.buyingPrice || 0,
      stockQuantity: prod.stockQuantity || 0, imageUrl: prod.imageUrl || "",
      description: prod.description || "", isActive: prod.isActive ?? true,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await toast.promise(productService.deleteProduct(id), {
        loading: "Deleting product…",
        success: "Product deleted!",
        error: (e) => e?.message || "Failed to delete product.",
      });
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch {}
  };

  const handleToggleActive = async (prod: Product) => {
    if (!prod.id) return;
    const nextState = !prod.isActive;
    try {
      await productService.updateProduct(prod.id, { ...prod, isActive: nextState });
      setProducts((prev) => prev.map((p) => p.id === prod.id ? { ...p, isActive: nextState } : p));
      toast.success(`Product ${nextState ? "activated" : "deactivated"}.`);
    } catch (e: any) {
      toast.error(e?.message || "Failed to update status.");
    }
  };

  const handleSave = async () => {
    if (!formData.name?.trim()) return toast.error("Product name is required.");
    if (!formData.price || formData.price <= 0) return toast.error("Price must be > 0.");
    if ((formData.buyingPrice ?? 0) < 0) return toast.error("Buying price must be ≥ 0.");
    if ((formData.stockQuantity ?? 0) < 0) return toast.error("Stock cannot be negative.");

    setIsSaving(true);
    try {
      if (editingId) {
        const res = await productService.updateProduct(editingId, formData);
        setProducts((prev) => prev.map((p) => p.id === editingId ? res.data : p));
        toast.success("Product updated!");
      } else {
        const res = await productService.createProduct(formData);
        setProducts((prev) => [...prev, res.data]);
        toast.success("Product created!");
      }
      setIsDialogOpen(false);
    } catch (err: any) { toast.error(err?.message || "Failed to save."); }
    finally { setIsSaving(false); }
  };

  const sell = Number(formData.price || 0);
  const buy = Number(formData.buyingPrice || 0);
  const profit = sell - buy;
  const margin = sell > 0 ? ((profit / sell) * 100).toFixed(1) : "0.0";
  const isProfit = profit >= 0;

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.category || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.brandLogo || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  if (error) return <div className="py-8"><ServerErrorCard error={error} onRetry={fetchProducts} variant="inline" title="Failed to Load Inventory" /></div>;

  return (
    <TableLayout
      searchPlaceholder="Search products by name, category, brand..."
      searchValue={searchQuery}
      onSearchChange={setSearchQuery}
      createButtonText="Add Product"
      onCreateClick={handleOpenNew}
      isEmpty={!isLoading && filteredProducts.length === 0}
      emptyTitle="No products found"
      emptyDescription={searchQuery ? `No products match "${searchQuery}".` : "No products have been added to inventory yet."}
      emptyIcon={LuPackage}
      totalItems={filteredProducts.length}
      currentPage={currentPage}
      pageSize={pageSize}
      onPageChange={setCurrentPage}
      onPageSizeChange={setPageSize}
    >
      {/* Modal */}
      <Modal
        isOpen={isDialogOpen}
        onOpenChange={isSaving ? () => {} : setIsDialogOpen}
        title={editingId ? "Edit Product" : "New Product"}
        onSave={handleSave}
        saveText={isSaving ? "Saving…" : editingId ? "Save Changes" : "Create Product"}
        isLoading={isSaving}
        size="xl"
      >
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 min-w-0 space-y-5">
            <div className="space-y-3">
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-600">Product Identity</p>

              <div className="space-y-1.5">
                <FieldLabel icon={LuPackage} text="Product Name" required />
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. iPhone 15 Pro Max"
                  disabled={isSaving}
                  className="h-9 text-sm font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <FieldLabel icon={LuTag} text="Brand / Manufacturer" />
                  <Input
                    value={formData.brandLogo}
                    onChange={(e) => setFormData({ ...formData, brandLogo: e.target.value })}
                    placeholder="e.g. Apple"
                    disabled={isSaving}
                    className="h-9 text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <FieldLabel icon={LuLayoutGrid} text="Category" />
                  <Input
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g. Smartphones"
                    disabled={isSaving}
                    className="h-9 text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-600">Pricing & Stock</p>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <FieldLabel icon={LuDollarSign} text="Selling Price" required />
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-400">৳</span>
                    <Input
                      type="number"
                      value={formData.price || ""}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                      placeholder="0"
                      disabled={isSaving}
                      className="h-9 pl-7 text-sm font-semibold"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <FieldLabel icon={LuDollarSign} text="Buying Price" required />
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-400">৳</span>
                    <Input
                      type="number"
                      value={formData.buyingPrice || ""}
                      onChange={(e) => setFormData({ ...formData, buyingPrice: Number(e.target.value) })}
                      placeholder="0"
                      disabled={isSaving}
                      className="h-9 pl-7 text-sm font-semibold"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <FieldLabel icon={LuPackage} text="Stock Quantity" />
                  <Input
                    type="number"
                    value={formData.stockQuantity || ""}
                    onChange={(e) => setFormData({ ...formData, stockQuantity: Number(e.target.value) })}
                    placeholder="0"
                    disabled={isSaving}
                    className="h-9 text-sm font-semibold"
                  />
                </div>
              </div>

              {sell > 0 && (
                <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-700/60 text-xs">
                  <span className="font-semibold text-zinc-500">Margin Calculation</span>
                  <div className="flex items-center gap-3">
                    <span className={`font-bold ${isProfit ? "text-emerald-600 dark:text-emerald-400" : "text-red-500"}`}>
                      {isProfit ? "+" : ""}৳ {profit.toLocaleString()} ({margin}%)
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="w-full md:w-56 shrink-0 space-y-5">
            <div className="space-y-2">
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-600">Product Image</p>
              <FieldLabel icon={LuImage} text="Upload / URL" />
              <ImageInput
                value={formData.imageUrl}
                onUpload={async (file) => { const res = await homeService.uploadFile(file); return res.data; }}
                onChange={(url) => setFormData({ ...formData, imageUrl: url })}
                size="md"
                variant="card"
                disabled={isSaving}
              />
            </div>

            <div className="space-y-2 pt-4 border-t border-zinc-100 dark:border-zinc-800">
              <FieldLabel icon={LuFileText} text="Description" />
              <Textarea
                rows={5}
                value={formData.description || ""}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe this product…"
                disabled={isSaving}
                className="resize-none text-xs leading-relaxed"
              />
            </div>
          </div>
        </div>
      </Modal>

      {/* Table */}
      {isLoading ? (
        <div className="py-16"><Loader text="Loading inventory…" variant="inline" /></div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-800 text-[11px] uppercase tracking-wider font-bold text-zinc-500">
              <TableHead className="w-12 text-center">#</TableHead>
              <TableHead className="w-2/5">Product Name</TableHead>
              <TableHead className="w-1/6">Brand</TableHead>
              <TableHead className="w-1/6">Stock</TableHead>
              <TableHead className="w-32">Buy / Sell</TableHead>
              <TableHead className="w-28">Margin</TableHead>
              <TableHead className="text-center w-24">Status</TableHead>
              <TableHead className="text-right pr-5 w-20">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-xs">
            {paginatedProducts.map((prod, index) => {
              const globalIndex = (currentPage - 1) * pageSize + index + 1;
              const s = Number(prod.price);
              const b = Number(prod.buyingPrice || 0);
              const p = s - b;
              const m = s > 0 ? ((p / s) * 100).toFixed(1) : "0.0";
              const ip = p >= 0;

              return (
                <TableRow key={prod.id || index} className="group hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                  <TableCell className="font-mono text-xs font-semibold text-zinc-400 text-center">
                    {String(globalIndex).padStart(2, "0")}
                  </TableCell>
                  <TableCell className="font-bold text-zinc-900 dark:text-white text-sm">{prod.name}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200/50 dark:border-zinc-700/50 uppercase tracking-wider">
                      {prod.brandLogo || "Generic"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                        (prod.stockQuantity ?? 0) <= 0 ? "bg-red-500 animate-pulse"
                        : (prod.stockQuantity ?? 0) <= 5 ? "bg-amber-500" : "bg-emerald-500"
                      }`} />
                      <span className="text-xs font-semibold">{prod.stockQuantity ?? 0} units</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs">
                    <div className="font-bold text-zinc-900 dark:text-white">৳ {s.toLocaleString()}</div>
                    <div className="text-zinc-400 font-medium">৳ {b.toLocaleString()} <span className="text-[9px]">cost</span></div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <span className={`text-xs font-black ${ip ? "text-emerald-500" : "text-red-500"}`}>
                        {ip ? "+" : ""}{m}%
                      </span>
                      <div className="text-[10px] text-zinc-400">৳ {Math.abs(p).toLocaleString()} {ip ? "profit" : "loss"}</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center">
                      <Toggle checked={prod.isActive !== false} onChange={() => handleToggleActive(prod)} />
                    </div>
                  </TableCell>
                  <TableCell className="text-right pr-5">
                    <div className="flex items-center justify-end gap-1">
                      <PermissionGuard require="product.actions.isUpdate">
                        <button onClick={() => handleOpenEdit(prod)} className="w-7 h-7 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 flex items-center justify-center transition-colors" title="Edit">
                          <LuPencil className="h-3.5 w-3.5" />
                        </button>
                      </PermissionGuard>

                      <PermissionGuard require="product.actions.isDelete">
                        <button onClick={() => prod.id && handleDelete(prod.id)} className="w-7 h-7 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 flex items-center justify-center transition-colors" title="Delete">
                          <LuTrash2 className="h-3.5 w-3.5" />
                        </button>
                      </PermissionGuard>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </TableLayout>
  );
}
