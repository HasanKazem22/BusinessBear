"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  LuBed, LuBath, LuSquare, LuHeart, LuMapPin,
  LuSearch, LuFilter, LuArrowUpRight, LuInbox,
} from "react-icons/lu";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { realAssetService } from "@/services/realAssetService";
import { RealAsset, AssetStatus, ASSET_STATUS_LABELS } from "@/types/real-asset";
import { Loader } from "@/components/ui/loader";
import { ServerErrorCard } from "@/components/ui/ServerErrorCard";
import { resolveMediaUrl } from "@/lib/api";

const STATUS_STYLES: Record<AssetStatus, string> = {
  FOR_SALE:    "bg-emerald-500/90 text-white",
  FOR_RENT:    "bg-sky-500/90 text-white",
  NEW_LISTING: "bg-violet-500/90 text-white",
  JUST_SOLD:   "bg-zinc-800/90 text-white",
  BOOKED:      "bg-amber-500/90 text-white",
};

export default function RealAssetPage() {
  const [assets, setAssets] = useState<RealAsset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<AssetStatus | "">("");

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchTerm), 450);
    return () => clearTimeout(t);
  }, [searchTerm]);

  const fetchAssets = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await realAssetService.getAssets(
        debouncedSearch || undefined,
        activeFilter || undefined,
      );
      setAssets(res.data || []);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchAssets(); }, [debouncedSearch, activeFilter]);

  const FILTERS: { label: string; value: AssetStatus | "" }[] = [
    { label: "All", value: "" },
    { label: "For Sale", value: "FOR_SALE" },
    { label: "For Rent", value: "FOR_RENT" },
    { label: "New Listing", value: "NEW_LISTING" },
    { label: "Just Sold", value: "JUST_SOLD" },
  ];

  return (
    <div className="h-full overflow-y-auto overflow-x-hidden bg-background dark:bg-[#070709] transition-colors duration-300">
      <div className="container mx-auto px-4 pt-4 pb-12 lg:pt-8 lg:pb-16 max-w-7xl">

        {/* ── Header ── */}
        <div className="mb-8 flex flex-col items-center text-center gap-5">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-zinc-950 dark:text-white">
              Exclusive Real Assets
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 mt-3 text-sm md:text-base max-w-xl mx-auto">
              Discover our curated portfolio of premium real estate, architectural masterpieces, and high-yield physical assets.
            </p>
          </div>

          {/* Search */}
          <div className="flex items-center gap-3 w-full max-w-md">
            <div className="relative group flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LuSearch className="h-4 w-4 text-zinc-400 group-focus-within:text-zinc-950 dark:group-focus-within:text-white transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Search properties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-zinc-950 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-zinc-950 dark:focus:border-white focus:ring-1 focus:ring-zinc-950/20 dark:focus:ring-white/30 transition-all"
              />
            </div>
            <Button variant="outline" className="rounded-xl h-[38px] px-3 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 hover:bg-zinc-100 dark:hover:bg-zinc-800">
              <LuFilter className="h-4 w-4 mr-2" />
              <span className="text-xs font-semibold">Filter</span>
            </Button>
          </div>

          {/* Status filter chips */}
          <div className="flex items-center gap-2 flex-wrap justify-center">
            {FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setActiveFilter(f.value)}
                className={`px-3 py-1 rounded-full text-[11px] font-bold border transition-all ${
                  activeFilter === f.value
                    ? "bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 border-zinc-950 dark:border-white"
                    : "bg-white dark:bg-zinc-900/40 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Content ── */}
        {error ? (
          <div className="max-w-md mx-auto py-12">
            <ServerErrorCard error={error} onRetry={fetchAssets} variant="inline" title="Failed to load listings" />
          </div>
        ) : isLoading ? (
          <div className="py-24">
            <Loader text="Loading properties..." variant="inline" />
          </div>
        ) : assets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl max-w-lg mx-auto">
            <LuInbox className="w-10 h-10 text-zinc-300 dark:text-zinc-700 mb-3" />
            <h3 className="text-sm font-bold text-zinc-700 dark:text-zinc-300">No listings found</h3>
            <p className="text-xs text-zinc-400 mt-1 max-w-xs leading-relaxed">
              {searchTerm || activeFilter ? "Try adjusting your search or filters." : "No properties are listed yet."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 animate-in fade-in duration-300">
            {assets.map((asset) => {
              const imgSrc = resolveMediaUrl(asset.imageUrl || "");
              const statusKey = (asset.status || "FOR_SALE") as AssetStatus;
              return (
                <Card
                  key={asset.id}
                  className="group overflow-hidden rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 bg-card shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col cursor-pointer p-0 gap-0"
                >
                  {/* Image */}
                  <div className="relative w-full aspect-[4/3] overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                    {imgSrc ? (
                      <Image
                        src={imgSrc}
                        alt={asset.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 text-zinc-400 text-xs font-semibold">No Image</div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/10 opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

                    {/* Badges */}
                    <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider backdrop-blur-md ${STATUS_STYLES[statusKey]}`}>
                        {ASSET_STATUS_LABELS[statusKey]}
                      </span>
                      <button className="h-7 w-7 rounded-full bg-white/20 hover:bg-white/90 dark:bg-black/20 dark:hover:bg-zinc-950/90 backdrop-blur-md flex items-center justify-center text-white hover:text-red-500 transition-colors">
                        <LuHeart className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    {/* Price overlay */}
                    <div className="absolute bottom-3 left-3 right-3">
                      <p className="text-white font-extrabold text-xl tracking-tight drop-shadow-md">
                        ৳ {Number(asset.price).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 flex flex-col flex-1">
                    <div className="mb-3">
                      <h3 className="font-bold text-zinc-950 dark:text-white text-base line-clamp-1 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
                        {asset.title}
                      </h3>
                      <div className="flex items-center text-zinc-500 dark:text-zinc-400 mt-0.5">
                        <LuMapPin className="h-3 w-3 mr-1 shrink-0" />
                        <span className="text-xs line-clamp-1">{asset.location}</span>
                      </div>
                    </div>

                    {/* Metrics */}
                    {(asset.beds || asset.baths || asset.sqft) && (
                      <div className="grid grid-cols-3 gap-2 py-3 border-t border-b border-zinc-100 dark:border-zinc-800/60 mb-3">
                        <div className="flex flex-col items-center gap-0.5">
                          <LuBed className="h-3.5 w-3.5 text-zinc-400" />
                          <span className="text-[11px] font-semibold text-zinc-950 dark:text-white">{asset.beds ?? "—"} Beds</span>
                        </div>
                        <div className="flex flex-col items-center gap-0.5 border-l border-zinc-100 dark:border-zinc-800/60">
                          <LuBath className="h-3.5 w-3.5 text-zinc-400" />
                          <span className="text-[11px] font-semibold text-zinc-950 dark:text-white">{asset.baths ?? "—"} Baths</span>
                        </div>
                        <div className="flex flex-col items-center gap-0.5 border-l border-zinc-100 dark:border-zinc-800/60">
                          <LuSquare className="h-3.5 w-3.5 text-zinc-400" />
                          <span className="text-[11px] font-semibold text-zinc-950 dark:text-white">{asset.sqft ? asset.sqft.toLocaleString() : "—"} sqft</span>
                        </div>
                      </div>
                    )}

                    <div className="mt-auto flex items-center justify-between">
                      <span className="text-[10px] text-zinc-400 font-medium uppercase tracking-widest">
                        {asset.isFeatured ? "⭐ Featured" : "Property"}
                      </span>
                      <div className="flex items-center text-xs font-bold text-zinc-950 dark:text-white group-hover:underline underline-offset-4 decoration-2">
                        View Details
                        <LuArrowUpRight className="h-3.5 w-3.5 ml-1 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
