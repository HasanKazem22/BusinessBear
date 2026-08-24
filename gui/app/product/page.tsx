"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { LuSearch, LuFilter, LuInbox } from "react-icons/lu";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { productService } from "@/services/productService";
import { Product } from "@/types/product";
import { Loader } from "@/components/ui/loader";
import { ServerErrorCard } from "@/components/ui/ServerErrorCard";
import { resolveMediaUrl } from "@/lib/api";

export default function ProductPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Simple debounce for search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 450);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Pass activeOnly = true to show only active products in the public catalog
      const res = await productService.getProducts(debouncedSearch, undefined, true);
      setProducts(res.data || []);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [debouncedSearch]);

  return (
    <div className="h-full overflow-y-auto py-8 px-4 bg-background dark:bg-[#070709] transition-colors duration-300">
      <div className="container mx-auto max-w-7xl">

        {/* Header Section */}
        <div className="mb-8 flex flex-col items-center text-center gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-zinc-955 dark:text-white">
              Premium Products
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 mt-3 text-sm md:text-base max-w-xl mx-auto">
              Explore our collection of top-tier electronics and smart devices at unbeatable prices.
            </p>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex items-center gap-3 w-full max-w-md justify-center">
            <div className="relative group flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LuSearch className="h-4 w-4 text-zinc-400 group-focus-within:text-zinc-950 dark:group-focus-within:text-white transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-zinc-955 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-zinc-955 dark:focus:border-white focus:ring-1 focus:ring-zinc-955/20 dark:focus:ring-white/30 transition-all duration-200"
              />
            </div>
            <Button variant="outline" className="rounded-xl h-[38px] px-3 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 text-zinc-955 dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800">
              <LuFilter className="h-4 w-4 mr-2" />
              <span className="text-xs font-semibold">Filters</span>
            </Button>
          </div>
        </div>

        {/* Content Section */}
        {error ? (
          <div className="max-w-md mx-auto py-12">
            <ServerErrorCard
              error={error}
              onRetry={fetchProducts}
              variant="inline"
              title="Failed to load products"
            />
          </div>
        ) : isLoading ? (
          <div className="py-24">
            <Loader text="Loading catalog..." variant="inline" />
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl max-w-lg mx-auto">
            <LuInbox className="w-10 h-10 text-zinc-300 dark:text-zinc-700 mb-3" />
            <h3 className="text-sm font-bold text-zinc-700 dark:text-zinc-300">No products available</h3>
            <p className="text-xs text-zinc-400 mt-1 max-w-xs leading-relaxed">
              {searchTerm ? "No products match your search query." : "We're currently updating our catalog. Please check back later!"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 animate-in fade-in duration-300">
            {products.map((product) => {
              const imageSrc = resolveMediaUrl(product.imageUrl || "");
              const displayPrice = `Tk. ${Number(product.price).toLocaleString()}`;
              const displayOriginal = product.originalPrice 
                ? `Tk. ${Number(product.originalPrice).toLocaleString()}`
                : null;
              const ratingVal = product.rating || 5.0;

              return (
                <Card key={product.id} className="shadow-none border border-zinc-200/60 dark:border-zinc-800/60 bg-card transition-all duration-300 p-0 gap-0 overflow-hidden group flex flex-col hover:shadow-lg rounded-2xl">
                  {/* Product Image - Full Width & Top */}
                  <div className="relative w-full aspect-[4/3] bg-zinc-100 dark:bg-zinc-900/60 overflow-hidden border-b border-zinc-100 dark:border-zinc-800/50">
                    {imageSrc ? (
                      <Image
                        src={imageSrc}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 font-semibold text-xs">
                        No Image
                      </div>
                    )}
                  </div>

                  <div className="p-4 flex flex-col items-center flex-1 justify-between gap-3">
                    <div className="flex flex-col items-center gap-1 w-full text-center">
                      {/* Brand Logo Placeholder */}
                      <div className="h-4 flex items-center justify-center">
                        <span className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                          {product.brandLogo || "Generic"}
                        </span>
                      </div>

                      {/* Product Name */}
                      <h3 className="font-bold text-zinc-800 dark:text-zinc-100 text-xs mb-1 line-clamp-2 px-1">
                        {product.name}
                      </h3>

                      {/* Price */}
                      <div className="flex items-baseline gap-1.5 justify-center">
                        <span className="text-zinc-950 dark:text-white font-extrabold text-sm">
                          {displayPrice}
                        </span>
                        {displayOriginal && (
                          <span className="text-zinc-405 text-[10px] line-through font-medium">
                            {displayOriginal}
                          </span>
                        )}
                      </div>

                      {/* Stock Level Warning */}
                      <div className="mt-1 flex items-center justify-center">
                        {product.stockQuantity === 0 ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold bg-red-500/10 text-red-500 border border-red-500/20">
                            Out of Stock
                          </span>
                        ) : product.stockQuantity <= 5 ? (
                          <span className="text-[10px] font-bold text-amber-500 animate-pulse">
                            Only {product.stockQuantity} left!
                          </span>
                        ) : (
                          <span className="text-[10px] font-semibold text-emerald-500 dark:text-emerald-400">
                            {product.stockQuantity} units available
                          </span>
                        )}
                      </div>

                      {/* Rating */}
                      <div className="flex items-center gap-1 mt-1 justify-center">
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-2.5 h-2.5 ${
                                i < Math.floor(ratingVal) 
                                  ? "text-[#facc15] fill-current" 
                                  : "text-zinc-200 dark:text-zinc-700"
                              }`}
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-[9px] text-zinc-400 font-bold">
                          ({ratingVal.toFixed(1)})
                        </span>
                      </div>
                    </div>

                    {/* Buy Now Button */}
                    <Button
                      variant="outline"
                      disabled={product.stockQuantity === 0}
                      className={`w-full mt-auto rounded-xl border-zinc-200 dark:border-zinc-800 text-zinc-955 dark:text-white hover:bg-zinc-955 hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors py-1 h-8 text-xs font-semibold bg-white dark:bg-zinc-900/50 ${
                        product.stockQuantity === 0 
                          ? "opacity-50 cursor-not-allowed hover:bg-white hover:text-zinc-955 dark:hover:bg-zinc-900/50 dark:hover:text-white" 
                          : ""
                      }`}
                    >
                      {product.stockQuantity === 0 ? "Out of Stock" : "Buy Now"}
                    </Button>
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
