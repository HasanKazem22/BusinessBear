"use client";

import { useState } from "react";
import Image from "next/image";
import { LuSearch, LuFilter, LuPlay, LuExternalLink, LuInbox } from "react-icons/lu";
import { FaFacebook } from "react-icons/fa";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export interface FbContentItem {
  id: string;
  title: string;
  category: "BUSINESS_BREAKDOWN" | "ENTREPRENEUR_TALK" | "VENTURE_SERIES" | "CASE_STUDY";
  videoUrl: string;
  thumbnailUrl: string;
  description: string;
  viewCount: string;
  duration: string;
  publishedDate: string;
}

const DEFAULT_CONTENT_ITEMS: FbContentItem[] = [
  {
    id: "fb-1",
    title: "How Local E-Commerce Brands Scale to ৳1 Crore Revenue in 6 Months",
    category: "BUSINESS_BREAKDOWN",
    videoUrl: "https://www.facebook.com",
    thumbnailUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop",
    description: "A deep dive into inventory management, marketing funnels, customer acquisition cost (CAC), and logistics strategies used by top Bangladeshi e-commerce startups.",
    viewCount: "45.2K",
    duration: "18:42",
    publishedDate: "2 days ago"
  },
  {
    id: "fb-2",
    title: "Starting a Restaurant Business with 20% Co-Investment | 20/80 Series Ep. 1",
    category: "VENTURE_SERIES",
    videoUrl: "https://www.facebook.com",
    thumbnailUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=800&auto=format&fit=crop",
    description: "Episode 1 of our build-in-public series. We partner with a passionate chef holding 80% equity while BusinessBear backs 20%. Watch location scouting and setup cost breakdown.",
    viewCount: "82.9K",
    duration: "24:15",
    publishedDate: "1 week ago"
  },
  {
    id: "fb-3",
    title: "Interview with a Self-Made Tech Entrepreneur: Lessons in Resilience",
    category: "ENTREPRENEUR_TALK",
    videoUrl: "https://www.facebook.com",
    thumbnailUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=800&auto=format&fit=crop",
    description: "Exclusive conversation on building a bootstrapped SaaS product from Dhaka, securing global clients, and managing cash flow during critical growth phases.",
    viewCount: "31.8K",
    duration: "32:10",
    publishedDate: "2 weeks ago"
  },
  {
    id: "fb-4",
    title: "Why Most Small Businesses Fail in Year 1 & How to Fix Cash Flow",
    category: "BUSINESS_BREAKDOWN",
    videoUrl: "https://www.facebook.com",
    thumbnailUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=800&auto=format&fit=crop",
    description: "Analyzing real business balance sheets to highlight common financial pitfalls, pricing mistakes, and practical debt management solutions.",
    viewCount: "29.4K",
    duration: "15:05",
    publishedDate: "3 weeks ago"
  },
  {
    id: "fb-5",
    title: "Agro-Tech Venture Case Study: 80% Partner Ownership Success Story",
    category: "CASE_STUDY",
    videoUrl: "https://www.facebook.com",
    thumbnailUrl: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=800&auto=format&fit=crop",
    description: "How our co-venture partner turned an organic farm concept into a profitable distribution model supplying major supermarkets across the city.",
    viewCount: "54.1K",
    duration: "21:30",
    publishedDate: "1 month ago"
  },
  {
    id: "fb-6",
    title: "Understanding Profit Margins in Apparel Manufacturing",
    category: "BUSINESS_BREAKDOWN",
    videoUrl: "https://www.facebook.com",
    thumbnailUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800&auto=format&fit=crop",
    description: "Breakdown of fabric sourcing, labor cost calculations, export margins, and wholesale branding for aspiring fashion entrepreneurs.",
    viewCount: "38.6K",
    duration: "19:50",
    publishedDate: "1 month ago"
  }
];

const FILTERS = [
  { label: "All Content", value: "" },
  { label: "Business Breakdowns", value: "BUSINESS_BREAKDOWN" },
  { label: "Entrepreneur Talks", value: "ENTREPRENEUR_TALK" },
  { label: "20/80 Series", value: "VENTURE_SERIES" },
  { label: "Case Studies", value: "CASE_STUDY" },
];

export default function ContentPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("");
  const [items] = useState<FbContentItem[]>(DEFAULT_CONTENT_ITEMS);

  const filteredItems = items.filter((item) => {
    const matchesFilter = !activeFilter || item.category === activeFilter;
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getCategoryLabel = (cat: string) => {
    const found = FILTERS.find((f) => f.value === cat);
    return found ? found.label : cat;
  };

  return (
    <div className="h-full overflow-y-auto overflow-x-hidden bg-background dark:bg-[#070709] transition-colors duration-300">
      <div className="container mx-auto px-4 pt-4 pb-12 lg:pt-8 lg:pb-16 max-w-7xl">

        {/* ── Header Section ── */}
        <div className="mb-8 flex flex-col items-center text-center gap-5">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-zinc-950 dark:text-white">
              Business Breakdown & Content
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 mt-3 text-sm md:text-base max-w-xl mx-auto">
              Explore our curated Facebook video series, entrepreneur case studies, and business breakdowns.
            </p>
          </div>

          {/* Search Bar */}
          <div className="flex items-center gap-3 w-full max-w-md">
            <div className="relative group flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LuSearch className="h-4 w-4 text-zinc-400 group-focus-within:text-zinc-950 dark:group-focus-within:text-white transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Search breakdowns & videos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-zinc-950 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-zinc-950 dark:focus:border-white focus:ring-1 focus:ring-zinc-950/20 dark:focus:ring-white/30 transition-all"
              />
            </div>
            <Button variant="outline" className="rounded-xl h-[38px] px-3 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 text-zinc-950 dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800">
              <LuFilter className="h-4 w-4 mr-2" />
              <span className="text-xs font-semibold">Filter</span>
            </Button>
          </div>

          {/* Filter Chips */}
          <div className="flex items-center gap-2 flex-wrap justify-center">
            {FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setActiveFilter(f.value)}
                className={`px-3 py-1 rounded-full text-[11px] font-bold border transition-all ${activeFilter === f.value
                    ? "bg-zinc-950 dark:bg-white text-white dark:text-black border-zinc-950 dark:border-white"
                    : "bg-white dark:bg-zinc-900/40 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600"
                  }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Content Grid ── */}
        {filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl max-w-lg mx-auto">
            <LuInbox className="w-10 h-10 text-zinc-300 dark:text-zinc-700 mb-3" />
            <h3 className="text-sm font-bold text-zinc-700 dark:text-zinc-300">No content found</h3>
            <p className="text-xs text-zinc-400 mt-1 max-w-xs leading-relaxed">
              {searchTerm || activeFilter ? "Try adjusting your search query or filters." : "We're adding new episodes soon!"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 animate-in fade-in duration-300">
            {filteredItems.map((item) => (
              <Card
                key={item.id}
                className="group overflow-hidden rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 bg-card shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col p-0 gap-0 cursor-pointer"
              >
                {/* Video Thumbnail - Aspect 4/3 matching Real Asset */}
                <div className="relative w-full aspect-[4/3] overflow-hidden bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-100 dark:border-zinc-800/50">
                  <Image
                    src={item.thumbnailUrl}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10 opacity-70 group-hover:opacity-90 transition-opacity duration-500" />

                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-9 h-9 rounded-full bg-white/90 dark:bg-zinc-950/90 text-zinc-950 dark:text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <LuPlay className="w-3.5 h-3.5 fill-current ml-0.5" />
                    </div>
                  </div>

                  {/* Top Category Badge */}
                  <div className="absolute top-2.5 left-2.5">
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider backdrop-blur-md bg-zinc-950/80 text-white border border-white/10">
                      {getCategoryLabel(item.category)}
                    </span>
                  </div>

                  {/* Duration Tag */}
                  <div className="absolute bottom-2.5 right-2.5 bg-black/80 backdrop-blur-md px-1.5 py-0.5 rounded text-[9px] font-mono text-white font-semibold">
                    {item.duration}
                  </div>

                  {/* View Stats Overlay */}
                  <div className="absolute bottom-2.5 left-2.5 text-[9px] text-zinc-300 font-medium">
                    {item.viewCount} views
                  </div>
                </div>

                {/* Card Info Body */}
                <div className="p-4 flex flex-col flex-1 justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-zinc-950 dark:text-white text-xs md:text-sm line-clamp-2 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-2 mt-1 leading-relaxed font-normal">
                      {item.description}
                    </p>
                  </div>

                  {/* Facebook Button */}
                  <a
                    href={item.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full mt-auto"
                  >
                    <Button
                      variant="outline"
                      className="w-full rounded-xl border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-white hover:bg-zinc-950 hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors py-1 h-8 text-[11px] font-semibold bg-white dark:bg-zinc-900/50 flex items-center justify-center gap-1.5"
                    >
                      <FaFacebook className="w-3 h-3 text-blue-600 dark:text-blue-400 group-hover:text-white" />
                      <span>Watch on Facebook</span>
                      <LuExternalLink className="w-3 h-3 ml-0.5" />
                    </Button>
                  </a>
                </div>
              </Card>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
