"use client";

import { useState, useEffect } from "react";
import {
  LuPlus, LuPencil, LuTrash2,
  LuBuilding2, LuMapPin, LuDollarSign,
  LuBed, LuBath, LuSquare, LuImage, LuFileText, LuStar,
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
import { Dropdown } from "@/components/ui/dropdown";
import { realAssetService } from "@/services/realAssetService";
import { homeService } from "@/services/homeService";
import { RealAsset, AssetStatus, ASSET_STATUS_LABELS } from "@/types/real-asset";
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
      type="button" role="switch" aria-checked={checked} disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed ${
        checked ? "bg-emerald-500" : "bg-zinc-200 dark:bg-zinc-700"
      }`}
    >
      <span className={`pointer-events-none inline-block h-3.5 w-3.5 rounded-full bg-white shadow-lg transition-transform duration-200 ${checked ? "translate-x-4" : "translate-x-0"}`} />
    </button>
  );
}

const STATUS_COLORS: Record<AssetStatus, string> = {
  FOR_SALE:    "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  FOR_RENT:    "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20",
  NEW_LISTING: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20",
  JUST_SOLD:   "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20",
  BOOKED:      "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
};

const ALL_STATUSES: AssetStatus[] = ["FOR_SALE", "FOR_RENT", "NEW_LISTING", "JUST_SOLD", "BOOKED"];

export function AssetConfigTab() {
  const [assets, setAssets] = useState<RealAsset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(100);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const defaultForm = (): Partial<RealAsset> => ({
    title: "", location: "", price: 0, imageUrl: "",
    beds: null, baths: null, sqft: null, status: "FOR_SALE",
    description: "", isFeatured: false,
  });

  const [formData, setFormData] = useState<Partial<RealAsset>>(defaultForm());

  const fetchAssets = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await realAssetService.getAssets();
      setAssets(res.data || []);
    } catch (err) { setError(err); }
    finally { setIsLoading(false); }
  };

  useEffect(() => { fetchAssets(); }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const handleOpenNew = () => { setEditingId(null); setFormData(defaultForm()); setIsDialogOpen(true); };
  const handleOpenEdit = (a: RealAsset) => {
    setEditingId(a.id || null);
    setFormData({
      title: a.title, location: a.location, price: a.price,
      imageUrl: a.imageUrl || "", beds: a.beds ?? null, baths: a.baths ?? null,
      sqft: a.sqft ?? null, status: a.status || "FOR_SALE",
      description: a.description || "", isFeatured: a.isFeatured ?? false,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this property listing?")) return;
    try {
      await toast.promise(realAssetService.deleteAsset(id), {
        loading: "Deleting…", success: "Listing deleted!", error: (e) => e?.message || "Failed",
      });
      setAssets((prev) => prev.filter((a) => a.id !== id));
    } catch {}
  };

  const handleSave = async () => {
    if (!formData.title?.trim()) return toast.error("Property title is required.");
    if (!formData.location?.trim()) return toast.error("Location is required.");
    if (!formData.price || formData.price <= 0) return toast.error("Price must be greater than 0.");

    setIsSaving(true);
    try {
      if (editingId) {
        const res = await realAssetService.updateAsset(editingId, formData);
        setAssets((prev) => prev.map((a) => a.id === editingId ? res.data : a));
        toast.success("Listing updated!");
      } else {
        const res = await realAssetService.createAsset(formData);
        setAssets((prev) => [...prev, res.data]);
        toast.success("Listing created!");
      }
      setIsDialogOpen(false);
    } catch (err: any) { toast.error(err?.message || "Failed to save."); }
    finally { setIsSaving(false); }
  };

  const handleToggleFeatured = async (asset: RealAsset) => {
    if (!asset.id) return;
    const nextState = !asset.isFeatured;
    try {
      await realAssetService.updateAsset(asset.id, { ...asset, isFeatured: nextState });
      setAssets((prev) => prev.map((a) => a.id === asset.id ? { ...a, isFeatured: nextState } : a));
      toast.success(nextState ? "Marked as featured!" : "Removed from featured.");
    } catch (e: any) { toast.error(e?.message || "Failed."); }
  };

  const set = (patch: Partial<RealAsset>) => setFormData((prev) => ({ ...prev, ...patch }));

  const filteredAssets = assets.filter((a) =>
    a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedAssets = filteredAssets.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  if (error) return <div className="py-8"><ServerErrorCard error={error} onRetry={fetchAssets} variant="inline" title="Failed to Load Listings" /></div>;

  return (
    <TableLayout
      searchPlaceholder="Search property listings by title or location..."
      searchValue={searchQuery}
      onSearchChange={setSearchQuery}
      createButtonText="Add Listing"
      onCreateClick={handleOpenNew}
      isEmpty={!isLoading && filteredAssets.length === 0}
      emptyTitle="No listings found"
      emptyDescription={searchQuery ? `No property listings match "${searchQuery}".` : "No property listings have been added yet."}
      emptyIcon={LuBuilding2}
      totalItems={filteredAssets.length}
      currentPage={currentPage}
      pageSize={pageSize}
      onPageChange={setCurrentPage}
      onPageSizeChange={setPageSize}
    >
      {/* Modal */}
      <Modal
        isOpen={isDialogOpen}
        onOpenChange={isSaving ? () => {} : setIsDialogOpen}
        title={editingId ? "Edit Property Listing" : "New Property Listing"}
        onSave={handleSave}
        saveText={isSaving ? "Saving…" : editingId ? "Save Changes" : "Create Listing"}
        isLoading={isSaving}
        size="xl"
      >
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 min-w-0 space-y-5">
            <div className="space-y-3">
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-600">Property Details</p>

              <div className="space-y-1.5">
                <FieldLabel icon={LuBuilding2} text="Property Title" required />
                <Input
                  value={formData.title}
                  onChange={(e) => set({ title: e.target.value })}
                  placeholder="e.g. The Glass House"
                  disabled={isSaving}
                  className="h-9 text-sm font-semibold"
                />
              </div>

              <div className="space-y-1.5">
                <FieldLabel icon={LuMapPin} text="Location" required />
                <Input
                  value={formData.location}
                  onChange={(e) => set({ location: e.target.value })}
                  placeholder="e.g. Beverly Hills, CA"
                  disabled={isSaving}
                  className="h-9 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <FieldLabel icon={LuDollarSign} text="Price" required />
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-400">৳</span>
                    <Input
                      type="number"
                      value={formData.price || ""}
                      onChange={(e) => set({ price: Number(e.target.value) })}
                      placeholder="0"
                      disabled={isSaving}
                      className="h-9 pl-7 text-sm font-semibold"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <FieldLabel icon={LuBuilding2} text="Listing Status" />
                  <Dropdown
                    options={ALL_STATUSES.map((s) => ({
                      value: s,
                      label: ASSET_STATUS_LABELS[s],
                    }))}
                    value={formData.status || "FOR_SALE"}
                    onChange={(val) => set({ status: val as AssetStatus })}
                    disabled={isSaving}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-600">Property Specs</p>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <FieldLabel icon={LuBed} text="Bedrooms" />
                  <Input
                    type="number"
                    value={formData.beds ?? ""}
                    onChange={(e) => set({ beds: e.target.value ? Number(e.target.value) : null })}
                    placeholder="e.g. 4"
                    disabled={isSaving}
                    className="h-9 text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <FieldLabel icon={LuBath} text="Bathrooms" />
                  <Input
                    type="number"
                    value={formData.baths ?? ""}
                    onChange={(e) => set({ baths: e.target.value ? Number(e.target.value) : null })}
                    placeholder="e.g. 3"
                    disabled={isSaving}
                    className="h-9 text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <FieldLabel icon={LuSquare} text="Area (Sq Ft)" />
                  <Input
                    type="number"
                    value={formData.sqft ?? ""}
                    onChange={(e) => set({ sqft: e.target.value ? Number(e.target.value) : null })}
                    placeholder="e.g. 3500"
                    disabled={isSaving}
                    className="h-9 text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="w-full md:w-56 shrink-0 space-y-5">
            <div className="space-y-2">
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-600">Property Image</p>
              <FieldLabel icon={LuImage} text="Upload / URL" />
              <ImageInput
                value={formData.imageUrl}
                onUpload={async (file) => { const res = await homeService.uploadFile(file); return res.data; }}
                onChange={(url) => set({ imageUrl: url })}
                size="md"
                variant="card"
                disabled={isSaving}
              />
            </div>

            <div className="space-y-[18px]">
              <FieldLabel icon={LuStar} text="Featured Listing" />
              <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-700/60">
                <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Highlight on home</span>
                <Toggle checked={formData.isFeatured ?? false} onChange={(val) => set({ isFeatured: val })} disabled={isSaving} />
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-zinc-100 dark:border-zinc-800">
              <FieldLabel icon={LuFileText} text="Description" />
              <Textarea
                rows={6}
                value={formData.description || ""}
                onChange={(e) => set({ description: e.target.value })}
                placeholder="Describe this property…"
                disabled={isSaving}
                className="resize-none text-xs leading-relaxed"
              />
            </div>
          </div>
        </div>
      </Modal>

      {/* Table */}
      {isLoading ? (
        <div className="py-16"><Loader text="Loading portfolio…" variant="inline" /></div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-800 text-[11px] uppercase tracking-wider font-bold text-zinc-500">
              <TableHead className="w-12 text-center">#</TableHead>
              <TableHead className="w-2/5">Property</TableHead>
              <TableHead className="w-1/4">Location</TableHead>
              <TableHead className="w-1/5">Specs</TableHead>
              <TableHead className="w-32">Price</TableHead>
              <TableHead className="w-28">Status</TableHead>
              <TableHead className="text-right pr-5 w-20">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-xs">
            {paginatedAssets.map((asset, index) => {
              const globalIndex = (currentPage - 1) * pageSize + index + 1;
              const statusKey = asset.status || "FOR_SALE";
              const statusLabel = ASSET_STATUS_LABELS[statusKey] || statusKey;
              const statusStyle = STATUS_COLORS[statusKey] || STATUS_COLORS.FOR_SALE;

              return (
                <TableRow key={asset.id || index} className="group hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                  <TableCell className="font-mono text-xs font-semibold text-zinc-400 text-center">
                    {String(globalIndex).padStart(2, "0")}
                  </TableCell>
                  <TableCell>
                    <div className="font-bold text-zinc-900 dark:text-white text-sm">{asset.title}</div>
                    {asset.code && <div className="text-[10px] font-mono text-zinc-400 mt-0.5">REF: {asset.code}</div>}
                  </TableCell>
                  <TableCell className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">
                    <div className="flex items-center gap-1">
                      <LuMapPin className="w-3 h-3 text-zinc-400 shrink-0" />
                      <span className="truncate max-w-[160px]">{asset.location}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-zinc-500">
                    <div className="flex items-center gap-2">
                      {asset.beds !== null && asset.beds !== undefined && <span>{asset.beds} bds</span>}
                      {asset.baths !== null && asset.baths !== undefined && <span>• {asset.baths} ba</span>}
                      {asset.sqft !== null && asset.sqft !== undefined && <span>• {asset.sqft.toLocaleString()} sqft</span>}
                      {asset.beds === null && asset.baths === null && asset.sqft === null && <span className="text-zinc-400 italic">No specs</span>}
                    </div>
                  </TableCell>
                  <TableCell className="font-bold text-zinc-900 dark:text-white text-xs">
                    ৳ {Number(asset.price || 0).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${statusStyle}`}>
                      {statusLabel}
                    </span>
                  </TableCell>
                  <TableCell className="text-right pr-5">
                    <div className="flex items-center justify-end gap-1">
                      <PermissionGuard require="realAsset.actions.isUpdate">
                        <button onClick={() => handleOpenEdit(asset)} className="w-7 h-7 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 flex items-center justify-center transition-colors" title="Edit">
                          <LuPencil className="h-3.5 w-3.5" />
                        </button>
                      </PermissionGuard>
                      <PermissionGuard require="realAsset.actions.isDelete">
                        <button onClick={() => asset.id && handleDelete(asset.id)} className="w-7 h-7 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 flex items-center justify-center transition-colors" title="Delete">
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
