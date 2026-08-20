"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type GlobalModalSize = "sm" | "md" | "lg" | "xl";

const sizeClasses: Record<GlobalModalSize, string> = {
  sm: "sm:max-w-sm",
  md: "sm:max-w-lg",
  lg: "sm:max-w-2xl",
  xl: "sm:max-w-4xl",
};

interface GlobalModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  onSave: () => void;
  children: React.ReactNode;
  saveText?: string;
  isLoading?: boolean;
  disabled?: boolean;
  /**
   * Controls the max-width of the dialog.
   * sm  → 384px  — simple forms (3–4 short fields)
   * md  → 512px  — standard forms with images/textareas (default)
   * lg  → 672px  — tables, lists, multi-column content
   * xl  → 896px  — complex layouts, side-by-side panels
   */
  size?: GlobalModalSize;
}

export function GlobalModal({
  isOpen,
  onOpenChange,
  title,
  description,
  onSave,
  children,
  saveText = "Save changes",
  isLoading = false,
  disabled = false,
  size = "md",
}: GlobalModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={isLoading ? () => {} : onOpenChange}>
      <DialogContent
        className={cn(
          "w-full rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900 shadow-2xl p-0 overflow-hidden flex flex-col",
          // Cap height at 90vh so it never overflows the screen
          "max-h-[90vh]",
          sizeClasses[size]
        )}
      >
        {/* ── Header ── */}
        <DialogHeader className="shrink-0 space-y-1 text-left px-5 pt-5 pb-4 border-b border-zinc-200/60 dark:border-zinc-800/60">
          <DialogTitle className="text-base font-bold tracking-tight text-zinc-900 dark:text-white">
            {title}
          </DialogTitle>
          {description && (
            <DialogDescription className="text-xs text-zinc-500 dark:text-zinc-400 leading-normal">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>

        {/* ── Scrollable Body ── */}
        <div className="flex-1 overflow-y-auto px-5 py-4 min-h-0">
          {children}
        </div>

        {/* ── Footer ── */}
        <div className="shrink-0 flex justify-end px-5 py-3 border-t border-zinc-200/60 dark:border-zinc-800/60 bg-white dark:bg-zinc-900">
          <Button
            onClick={onSave}
            size="sm"
            className="px-4 py-1 rounded-md font-semibold text-xs transition-all flex items-center gap-1.5"
            disabled={isLoading || disabled}
          >
            {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            {saveText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
