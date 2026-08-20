import { Plus, Pencil, Trash2, Loader2, Layers, ToggleLeft, ToggleRight } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { GlobalModal } from "@/components/ui/global-modal";
import { ServiceData } from "@/types/home";
import { cn } from "@/lib/utils";

const MAX_SERVICES = 6;

/** Render any Lucide icon by PascalCase name, falling back to Layers */
function ServiceIcon({ name, className }: { name: string; className?: string }) {
  const Icon = (LucideIcons as Record<string, any>)[name] ?? LucideIcons.Layers;
  return <Icon className={className} />;
}

// ─────────────────────────────────────────────────────────────────────────────
// ServicesModal — 3×2 card grid
// ─────────────────────────────────────────────────────────────────────────────
interface ServicesModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  services: ServiceData[];
  deletingServiceId: number | null;
  onAdd: () => void;
  onEdit: (svc: ServiceData) => void;
  onDeleteRequest: (id: number) => void;
}

export function ServicesModal({
  isOpen,
  onOpenChange,
  services,
  deletingServiceId,
  onAdd,
  onEdit,
  onDeleteRequest,
}: ServicesModalProps) {
  const isFull = services.length >= MAX_SERVICES;
  const activeCount = services.filter((s) => s.isActive).length;

  return (
    <GlobalModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Our Services"
      description="Max 6 cards. Toggle visibility to show or hide a card on the public page."
      onSave={() => onOpenChange(false)}
      saveText="Done"
      disabled={deletingServiceId !== null}
      size="lg"
    >
      {/* ── Toolbar ── */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-zinc-900 dark:text-white">
            {services.length}
            <span className="text-zinc-400 font-normal">/{MAX_SERVICES} cards</span>
          </span>
          <span className="text-[10px] text-zinc-400">·</span>
          <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
            {activeCount} visible
          </span>
        </div>

        <Button
          size="sm"
          onClick={onAdd}
          disabled={isFull || deletingServiceId !== null}
          className="h-7 text-xs font-semibold gap-1 px-3"
          title={isFull ? "Maximum 6 cards reached" : "Add a new service card"}
        >
          <Plus className="w-3 h-3" />
          Add Card
        </Button>
      </div>

      {/* ── Capacity bar ── */}
      <div className="mb-4">
        <div className="h-1 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all duration-500"
            style={{ width: `${(services.length / MAX_SERVICES) * 100}%` }}
          />
        </div>
      </div>

      {/* ── Empty state ── */}
      {services.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl text-center">
          <Layers className="w-8 h-8 text-zinc-300 dark:text-zinc-700 mb-2" />
          <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">No service cards yet</p>
          <p className="text-xs text-zinc-400 mt-1">Click "Add Card" above to create your first one.</p>
        </div>
      ) : (
        /* ── 3×2 Card Grid ── */
        <div className="grid grid-cols-3 gap-3">
          {services.map((svc) => (
            <div
              key={svc.id}
              className={cn(
                "group relative flex flex-col gap-3 rounded-xl border p-3.5 transition-all duration-200",
                svc.isActive
                  ? "border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900"
                  : "border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 opacity-60"
              )}
            >
              {/* Icon + Title */}
              <div className="flex items-center gap-2.5">
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                  svc.isActive
                    ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400"
                )}>
                  <ServiceIcon name={svc.iconName} className="w-4 h-4" />
                </div>
                <p className="text-xs font-bold text-zinc-900 dark:text-white leading-tight line-clamp-2 flex-1 min-w-0">
                  {svc.title}
                </p>
              </div>

              {/* Status badge */}
              <span className={cn(
                "self-start text-[10px] font-bold px-2 py-0.5 rounded-full",
                svc.isActive
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                  : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-500"
              )}>
                {svc.isActive ? "Visible" : "Hidden"}
              </span>

              {/* Actions row */}
              <div className="flex items-center justify-between pt-1 border-t border-zinc-100 dark:border-zinc-800">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                  onClick={() => onEdit(svc)}
                  disabled={deletingServiceId !== null}
                  title="Edit card"
                >
                  <Pencil className="h-3 w-3" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-zinc-400 hover:text-red-500 dark:hover:text-red-400"
                  onClick={() => onDeleteRequest(svc.id)}
                  disabled={deletingServiceId !== null}
                  title="Delete card"
                >
                  {deletingServiceId === svc.id
                    ? <Loader2 className="h-3 w-3 animate-spin" />
                    : <Trash2 className="h-3 w-3" />}
                </Button>
              </div>
            </div>
          ))}

          {/* ── Empty slot placeholder(s) ── */}
          {Array.from({ length: MAX_SERVICES - services.length }).map((_, i) => (
            <button
              key={`empty-${i}`}
              onClick={onAdd}
              disabled={deletingServiceId !== null}
              className="flex flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-zinc-200 dark:border-zinc-800 p-3.5 text-zinc-400 hover:border-zinc-400 dark:hover:border-zinc-600 hover:text-zinc-600 dark:hover:text-zinc-300 transition-all duration-200 min-h-[120px]"
            >
              <Plus className="w-4 h-4" />
              <span className="text-[10px] font-semibold">Add card</span>
            </button>
          ))}
        </div>
      )}

      {isFull && (
        <p className="text-[10px] text-zinc-400 text-center mt-3">
          Maximum of {MAX_SERVICES} service cards reached. Delete a card to add a new one.
        </p>
      )}
    </GlobalModal>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ServiceFormModal — Add / Edit
// ─────────────────────────────────────────────────────────────────────────────
interface ServiceFormModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isEditing: boolean;
  form: Partial<ServiceData>;
  setForm: (form: Partial<ServiceData>) => void;
  isSaving: boolean;
  onSave: () => void;
}

export function ServiceFormModal({
  isOpen,
  onOpenChange,
  isEditing,
  form,
  setForm,
  isSaving,
  onSave,
}: ServiceFormModalProps) {
  return (
    <GlobalModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title={isEditing ? "Edit Service Card" : "Add Service Card"}
      description="Configure the title, description, icon name, and visibility."
      onSave={onSave}
      saveText={isEditing ? "Update" : "Create"}
      isLoading={isSaving}
      size="sm"
    >
      <div className="space-y-4">
        {/* Icon preview + name */}
        <div className="space-y-2">
          <Label htmlFor="svcIcon">Icon</Label>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0 text-zinc-600 dark:text-zinc-300">
              <ServiceIcon name={form.iconName || "Code"} className="w-4.5 h-4.5" />
            </div>
            <Input
              id="svcIcon"
              value={form.iconName}
              onChange={(e) => setForm({ ...form, iconName: e.target.value })}
              placeholder="Code, Palette, Smartphone…"
              disabled={isSaving}
              className="text-xs"
            />
          </div>
          <p className="text-[10px] text-zinc-400">
            Find names at{" "}
            <a href="https://lucide.dev/icons" target="_blank" rel="noopener noreferrer" className="underline hover:text-zinc-600 dark:hover:text-zinc-300">
              lucide.dev/icons
            </a>{" "}
            · PascalCase
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="svcTitle">Title</Label>
          <Input
            id="svcTitle"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="e.g. Web Development"
            disabled={isSaving}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="svcDesc">Description</Label>
          <Textarea
            id="svcDesc"
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Brief description of this service…"
            disabled={isSaving}
          />
        </div>

        {/* Visibility toggle */}
        <button
          type="button"
          onClick={() => setForm({ ...form, isActive: !form.isActive })}
          disabled={isSaving}
          className="w-full flex items-center justify-between px-3 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
        >
          <div className="text-left">
            <p className="text-xs font-semibold text-zinc-900 dark:text-white">
              {form.isActive ? "Visible on public page" : "Hidden from public page"}
            </p>
            <p className="text-[10px] text-zinc-500 mt-0.5">Toggle to show or hide this card</p>
          </div>
          {form.isActive
            ? <ToggleRight className="w-7 h-7 text-emerald-500 shrink-0" />
            : <ToggleLeft className="w-7 h-7 text-zinc-400 shrink-0" />}
        </button>
      </div>
    </GlobalModal>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DeleteConfirmModal
// ─────────────────────────────────────────────────────────────────────────────
interface DeleteConfirmModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  serviceTitle?: string;
  onConfirm: () => void;
}

export function DeleteConfirmModal({
  isOpen,
  onOpenChange,
  serviceTitle,
  onConfirm,
}: DeleteConfirmModalProps) {
  return (
    <GlobalModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Delete Service Card?"
      description="This cannot be undone. The slot will be freed up for a new card."
      onSave={onConfirm}
      saveText="Yes, Delete"
      isLoading={false}
      size="sm"
    >
      <div className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 rounded-xl">
        <Trash2 className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
        <p className="text-sm text-red-700 dark:text-red-400">
          You are about to delete{" "}
          <strong>"{serviceTitle || "this service"}"</strong>. This will free up one slot.
        </p>
      </div>
    </GlobalModal>
  );
}
