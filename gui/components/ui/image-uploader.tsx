"use client";

import { useState, useRef } from "react";
import { CloudUpload, Loader2, ImageIcon, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-hot-toast";
import { resolveMediaUrl } from "@/lib/api";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────
export type ImageUploaderSize    = "sm" | "md" | "lg";
export type ImageUploaderVariant = "button" | "card" | "avatar";

export interface ImageUploaderProps {
  /** Current image URL (controlled) */
  value?: string;
  /**
   * Called with the selected File. Must return the stored image URL.
   * Upload logic lives in the caller so this component stays generic.
   */
  onUpload: (file: File) => Promise<string>;
  /** Fires with the new URL after upload or when the user pastes a URL */
  onChange?: (url: string) => void;
  /** Thumbnail / avatar size — only used in button & avatar variants */
  size?: ImageUploaderSize;
  /** Display layout */
  variant?: ImageUploaderVariant;
  /** Disables all interaction */
  disabled?: boolean;
  /** Optional field label rendered above the control */
  label?: string;
  /** Show a text input so users can also paste a URL directly (card variant) */
  showUrlInput?: boolean;
  /** Placeholder for the URL input */
  urlPlaceholder?: string;
  /** Maximum allowed file size in MB (default: 5) */
  maxSizeMb?: number;
  className?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Size maps (button + avatar only)
// ─────────────────────────────────────────────────────────────────────────────
const thumbSize: Record<ImageUploaderSize, string> = {
  sm: "w-9 h-9",
  md: "w-12 h-12",
  lg: "w-16 h-16",
};

const avatarSize: Record<ImageUploaderSize, string> = {
  sm: "w-16 h-16",
  md: "w-24 h-24",
  lg: "w-32 h-32",
};

/** Square size for the card variant's left-side thumbnail zone */
const cardSquareSize: Record<ImageUploaderSize, string> = {
  sm: "w-[72px] h-[72px]",
  md: "w-[88px] h-[88px]",
  lg: "w-[108px] h-[108px]",
};

// ─────────────────────────────────────────────────────────────────────────────
// ImageUploader
// ─────────────────────────────────────────────────────────────────────────────
export function ImageUploader({
  value = "",
  onUpload,
  onChange,
  size = "md",
  variant = "card",
  disabled = false,
  label,
  showUrlInput = true,
  urlPlaceholder = "https://example.com/image.png",
  maxSizeMb = 5,
  className,
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const resolvedUrl = resolveMediaUrl(value);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are allowed.");
      return;
    }
    if (file.size > maxSizeMb * 1024 * 1024) {
      toast.error(`Image must be under ${maxSizeMb} MB.`);
      return;
    }

    setIsUploading(true);
    try {
      const url = await toast.promise(onUpload(file), {
        loading: "Uploading image…",
        success: "Image uploaded!",
        error: (err) => err?.message || "Upload failed",
      });
      onChange?.(url);
    } catch {
      // toast.promise already surfaces the error
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const openPicker = () => {
    if (!disabled && !isUploading) inputRef.current?.click();
  };

  const hiddenInput = (
    <input
      type="file"
      ref={inputRef}
      onChange={handleFileChange}
      accept="image/*"
      className="hidden"
    />
  );

  // ── Variant: button ───────────────────────────────────────────────────────
  if (variant === "button") {
    return (
      <div className={cn("inline-flex items-center gap-2", className)}>
        {label && <Label className="shrink-0">{label}</Label>}

        {value && (
          <div className={cn("rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden shrink-0 bg-zinc-100 dark:bg-zinc-900", thumbSize[size])}>
            <img src={resolvedUrl} alt="" className="w-full h-full object-cover" onError={(e) => ((e.target as HTMLImageElement).style.display = "none")} />
          </div>
        )}

        <button
          type="button"
          onClick={openPicker}
          disabled={disabled || isUploading}
          className="inline-flex items-center gap-1.5 px-3 h-8 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-xs font-semibold text-zinc-700 dark:text-zinc-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUploading
            ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
            : <CloudUpload className="w-3.5 h-3.5" />}
          {isUploading ? "Uploading…" : value ? "Change" : "Upload"}
        </button>

        {hiddenInput}
      </div>
    );
  }

  // ── Variant: avatar ───────────────────────────────────────────────────────
  if (variant === "avatar") {
    return (
      <div className={cn("flex flex-col items-center gap-2", className)}>
        {label && <Label className="text-center text-xs">{label}</Label>}

        <button
          type="button"
          onClick={openPicker}
          disabled={disabled || isUploading}
          className={cn(
            "relative rounded-full overflow-hidden border-2 border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-900 shrink-0 group cursor-pointer transition-all hover:border-zinc-400 dark:hover:border-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400",
            avatarSize[size]
          )}
        >
          {value
            ? <img src={resolvedUrl} alt="" className="w-full h-full object-cover" onError={(e) => ((e.target as HTMLImageElement).style.display = "none")} />
            : <ImageIcon className="w-1/3 h-1/3 text-zinc-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />}

          <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            {isUploading
              ? <Loader2 className="w-5 h-5 text-white animate-spin" />
              : <RefreshCw className="w-4 h-4 text-white" />}
          </div>
        </button>

        {hiddenInput}
      </div>
    );
  }

  // ── Variant: card — square thumbnail + side info ─────────────────────────
  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label className="text-xs font-semibold">{label}</Label>}

      {/* Row: square zone + info/button */}
      <div className="flex items-center gap-3">

        {/* Square clickable zone */}
        <button
          type="button"
          onClick={openPicker}
          disabled={disabled || isUploading}
          className={cn(
            "relative shrink-0 overflow-hidden rounded-xl border-2 transition-all duration-200 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400",
            cardSquareSize[size],
            value
              ? "border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900"
              : "border-dashed border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 hover:border-zinc-400 dark:hover:border-zinc-600",
            (disabled || isUploading) && "cursor-not-allowed opacity-50"
          )}
        >
          {value ? (
            <>
              <img
                src={resolvedUrl}
                alt="Preview"
                className="w-full h-full object-contain"
                onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
              />
              {/* Change overlay */}
              <div className="absolute inset-0 bg-black/55 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1">
                <RefreshCw className="w-3.5 h-3.5 text-white" />
                <span className="text-[9px] font-semibold text-white leading-none">Change</span>
              </div>
            </>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
              {isUploading
                ? <Loader2 className="w-5 h-5 text-zinc-400 animate-spin" />
                : <CloudUpload className="w-5 h-5 text-zinc-400" />}
            </div>
          )}
        </button>

        {/* Right: hint text + upload button */}
        <div className="flex flex-col gap-1.5 min-w-0">
          <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 leading-tight">
            {value ? "Image selected" : isUploading ? "Uploading…" : "Upload an image"}
          </p>
          <p className="text-[10px] text-zinc-400 leading-tight">
            PNG · JPG · WebP · max {maxSizeMb} MB
          </p>
          <button
            type="button"
            onClick={openPicker}
            disabled={disabled || isUploading}
            className="mt-0.5 inline-flex items-center gap-1 self-start px-2.5 h-7 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading
              ? <Loader2 className="w-3 h-3 animate-spin" />
              : <CloudUpload className="w-3 h-3" />}
            {isUploading ? "Uploading…" : value ? "Change" : "Browse"}
          </button>
        </div>
      </div>

      {/* URL fallback */}
      {showUrlInput && (
        <div>
          <p className="text-[10px] text-zinc-400 font-medium mb-1">Or paste an image URL</p>
          <Input
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            placeholder={urlPlaceholder}
            disabled={disabled || isUploading}
            className="h-8 text-xs font-mono"
          />
        </div>
      )}

      {hiddenInput}
    </div>
  );
}
