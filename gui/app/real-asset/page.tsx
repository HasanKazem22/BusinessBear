import Image from "next/image";
import { Bed, Bath, Square, Heart, MapPin, Search, Filter, ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const assets = [
  {
    id: 1,
    title: "The Glass House",
    location: "Beverly Hills, CA",
    price: "Tk. 1,25,00,000",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
    beds: 4,
    baths: 3.5,
    sqft: "4,500",
    status: "For Sale",
  },
  {
    id: 2,
    title: "Modern Minimalist Villa",
    location: "Malibu, CA",
    price: "Tk. 2,85,50,000",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
    beds: 6,
    baths: 5,
    sqft: "6,200",
    status: "New Listing",
  },
  {
    id: 3,
    title: "Urban Skyline Penthouse",
    location: "Manhattan, NY",
    price: "Tk. 4,10,00,000",
    image: "https://images.unsplash.com/photo-1600607686527-6fb886090705?w=800&q=80",
    beds: 3,
    baths: 3,
    sqft: "3,100",
    status: "For Rent",
  },
  {
    id: 4,
    title: "Serene Lakefront Estate",
    location: "Lake Tahoe, NV",
    price: "Tk. 1,75,00,000",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
    beds: 5,
    baths: 4,
    sqft: "5,400",
    status: "For Sale",
  },
  {
    id: 5,
    title: "Architectural Masterpiece",
    location: "Austin, TX",
    price: "Tk. 95,00,000",
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80",
    beds: 4,
    baths: 3,
    sqft: "3,800",
    status: "For Sale",
  },
  {
    id: 6,
    title: "Contemporary Desert Home",
    location: "Scottsdale, AZ",
    price: "Tk. 1,45,00,000",
    image: "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=800&q=80",
    beds: 4,
    baths: 4.5,
    sqft: "4,100",
    status: "Just Sold",
  },
];

export default function RealAssetPage() {
  return (
    <div className="h-full overflow-y-auto overflow-x-hidden bg-background dark:bg-[#070709] transition-colors duration-300 relative">
      <div className="container mx-auto px-4 pt-4 pb-12 lg:pt-8 lg:pb-16 max-w-7xl">
        
        {/* Header Section */}
        <div className="mb-8 flex flex-col items-center text-center gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-zinc-950 dark:text-white">
              Exclusive Real Assets
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 mt-3 text-sm md:text-base max-w-xl mx-auto">
              Discover our curated portfolio of premium real estate, architectural masterpieces, and high-yield physical assets.
            </p>
          </div>
          
          {/* Search & Filter Bar */}
          <div className="flex items-center gap-3 w-full max-w-md justify-center">
            <div className="relative group flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-zinc-400 group-focus-within:text-zinc-950 dark:group-focus-within:text-white transition-colors" />
              </div>
              <input 
                type="text" 
                placeholder="Search properties..." 
                className="w-full bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-zinc-950 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-zinc-950 dark:focus:border-white focus:ring-1 focus:ring-zinc-950/20 dark:focus:ring-white/30 transition-all duration-200"
              />
            </div>
            <Button variant="outline" className="rounded-xl h-[38px] px-3 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 text-zinc-950 dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800">
              <Filter className="h-4 w-4 mr-2" />
              <span className="text-xs font-semibold">Filters</span>
            </Button>
          </div>
        </div>

        {/* Asset Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {assets.map((asset) => (
            <Card key={asset.id} className="group overflow-hidden rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 bg-card shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col cursor-pointer p-0 gap-0">
              {/* Image Container */}
              <div className="relative w-full aspect-[4/3] overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                <Image
                  src={asset.image}
                  alt={asset.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/10 opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                
                {/* Top Badges */}
                <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                  <span className="bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md text-zinc-950 dark:text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
                    {asset.status}
                  </span>
                  <button className="h-8 w-8 rounded-full bg-white/20 hover:bg-white/90 dark:bg-black/20 dark:hover:bg-zinc-950/90 backdrop-blur-md flex items-center justify-center text-white hover:text-red-500 transition-colors duration-300">
                    <Heart className="h-4 w-4" />
                  </button>
                </div>

                {/* Price (Overlayed on bottom of image) */}
                <div className="absolute bottom-4 left-4 right-4">
                  <h4 className="text-white font-extrabold text-2xl tracking-tight drop-shadow-md">
                    {asset.price}
                  </h4>
                </div>
              </div>

              {/* Content Container */}
              <div className="p-5 flex flex-col flex-1">
                {/* Title & Location */}
                <div className="mb-4">
                  <h3 className="font-bold text-zinc-950 dark:text-white text-lg line-clamp-1 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
                    {asset.title}
                  </h3>
                  <div className="flex items-center text-zinc-500 dark:text-zinc-400 mt-1">
                    <MapPin className="h-3 w-3 mr-1" />
                    <span className="text-xs">{asset.location}</span>
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-2 py-4 border-t border-b border-zinc-100 dark:border-zinc-800/60 mb-4">
                  <div className="flex flex-col items-center justify-center gap-1">
                    <Bed className="h-4 w-4 text-zinc-400 dark:text-zinc-500" />
                    <span className="text-xs font-semibold text-zinc-950 dark:text-white">{asset.beds} Beds</span>
                  </div>
                  <div className="flex flex-col items-center justify-center gap-1 border-l border-zinc-100 dark:border-zinc-800/60">
                    <Bath className="h-4 w-4 text-zinc-400 dark:text-zinc-500" />
                    <span className="text-xs font-semibold text-zinc-950 dark:text-white">{asset.baths} Baths</span>
                  </div>
                  <div className="flex flex-col items-center justify-center gap-1 border-l border-zinc-100 dark:border-zinc-800/60">
                    <Square className="h-4 w-4 text-zinc-400 dark:text-zinc-500" />
                    <span className="text-xs font-semibold text-zinc-950 dark:text-white">{asset.sqft} sqft</span>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="mt-auto flex items-center justify-between">
                  <span className="text-[10px] text-zinc-400 font-medium uppercase tracking-widest">
                    Listed Today
                  </span>
                  <div className="flex items-center text-xs font-bold text-zinc-950 dark:text-white group-hover:underline underline-offset-4 decoration-2">
                    View Details
                    <ArrowUpRight className="h-3.5 w-3.5 ml-1 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
