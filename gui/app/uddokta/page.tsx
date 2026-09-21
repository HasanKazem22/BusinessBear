"use client";

import { useState } from "react";
import Image from "next/image";
import {
  LuSearch,
  LuFilter,
  LuCheck,
  LuArrowUpRight,
  LuLoaderCircle,
  LuX,
  LuInbox,
  LuPlus
} from "react-icons/lu";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";

export interface UddoktaRecord {
  id: string;
  title: string;
  category: string;
  shortDescription: string;
  bannerUrl: string;
  myEquityPercent: number; // 20%
  partnerEquityPercent: number; // 80%
  partnerName: string;
  partnerTitle: string;
  partnerAvatarUrl: string;
  status: "ACTIVE" | "PROFITABLE" | "LAUNCHING" | "PLANNING";
  totalInvestment: string;
  monthlyRevenue: string;
  websiteUrl?: string;
}

const DEFAULT_UDDOKTAS: UddoktaRecord[] = [
  {
    id: "u-1",
    title: "UrbanBites Cloud Kitchen",
    category: "Food & Beverage",
    shortDescription: "A tech-enabled cloud kitchen network servicing high-density office zones with fast, affordable meals.",
    bannerUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=800&auto=format&fit=crop",
    myEquityPercent: 20,
    partnerEquityPercent: 80,
    partnerName: "Chef Tanvir Ahmed",
    partnerTitle: "Uddokta Lead & Culinary Head",
    partnerAvatarUrl: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?q=80&w=300&auto=format&fit=crop",
    status: "PROFITABLE",
    totalInvestment: "৳1.5 Crore",
    monthlyRevenue: "৳42 Lakh",
    websiteUrl: "https://example.com"
  },
  {
    id: "u-2",
    title: "GreenHarbor Organic Agro",
    category: "Agro & Supply Chain",
    shortDescription: "Direct-from-farm organic produce distribution connecting rural farmers directly to city retail chains.",
    bannerUrl: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=800&auto=format&fit=crop",
    myEquityPercent: 20,
    partnerEquityPercent: 80,
    partnerName: "Rahim Chowdhury",
    partnerTitle: "Uddokta Founder & Ops Lead",
    partnerAvatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop",
    status: "ACTIVE",
    totalInvestment: "৳2.2 Crore",
    monthlyRevenue: "৳68 Lakh",
    websiteUrl: "https://example.com"
  },
  {
    id: "u-3",
    title: "ThreadCraft Apparel",
    category: "Fashion & E-Commerce",
    shortDescription: "Eco-friendly knitwear brand exporting custom apparel line with zero-waste manufacturing processes.",
    bannerUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800&auto=format&fit=crop",
    myEquityPercent: 20,
    partnerEquityPercent: 80,
    partnerName: "Nusrat Jahan",
    partnerTitle: "Uddokta Founder & Designer",
    partnerAvatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop",
    status: "LAUNCHING",
    totalInvestment: "৳1.0 Crore",
    monthlyRevenue: "Pre-Revenue",
    websiteUrl: "https://example.com"
  },
  {
    id: "u-4",
    title: "SwiftLogistics Hub",
    category: "Logistics & Delivery",
    shortDescription: "Hyper-local last-mile logistics franchise operating across major suburban hubs with electric vans.",
    bannerUrl: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=800&auto=format&fit=crop",
    myEquityPercent: 20,
    partnerEquityPercent: 80,
    partnerName: "Kamrul Hasan",
    partnerTitle: "Uddokta Managing Director",
    partnerAvatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format&fit=crop",
    status: "ACTIVE",
    totalInvestment: "৳3.0 Crore",
    monthlyRevenue: "৳85 Lakh"
  }
];

const STATUS_FILTERS = [
  { label: "All Uddokta Businesses", value: "" },
  { label: "Profitable", value: "PROFITABLE" },
  { label: "Active", value: "ACTIVE" },
  { label: "Launching Soon", value: "LAUNCHING" }
];

export default function UddoktaPage() {
  const [uddoktas] = useState<UddoktaRecord[]>(DEFAULT_UDDOKTAS);
  const [activeFilter, setActiveFilter] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Application Modal Form State
  const [formState, setFormState] = useState({
    applicantName: "",
    email: "",
    phone: "",
    businessNiche: "",
    proposedEquity: "80% Uddokta / 20% BusinessBear",
    estimatedBudget: "",
    pitchMessage: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);

  const filteredUddoktas = uddoktas.filter((item) => {
    const matchesFilter = !activeFilter || item.status === activeFilter;
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.shortDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.partnerName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleApplicationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.applicantName || !formState.email || !formState.pitchMessage) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmittedSuccess(true);
      toast.success("Application submitted successfully!");
    }, 1000);
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "PROFITABLE":
        return "bg-emerald-500/90 text-white";
      case "ACTIVE":
        return "bg-sky-500/90 text-white";
      case "LAUNCHING":
        return "bg-amber-500/90 text-white";
      default:
        return "bg-zinc-800/90 text-white";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "PROFITABLE":
        return "Profitable";
      case "ACTIVE":
        return "Active";
      case "LAUNCHING":
        return "Launching";
      default:
        return "Planning";
    }
  };

  return (
    <div className="h-full overflow-y-auto overflow-x-hidden bg-background dark:bg-[#070709] transition-colors duration-300">
      <div className="container mx-auto px-4 pt-4 pb-12 lg:pt-8 lg:pb-16 max-w-7xl">

        {/* ── Header Section ── */}
        <div className="mb-8 flex flex-col items-center text-center gap-5">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-zinc-950 dark:text-white">
              20/80 Uddokta Hub
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 mt-3 text-sm md:text-base max-w-xl mx-auto">
              Partnering with ambitious Uddoktas (Entrepreneurs) to build real businesses. We invest 20%, you hold 80% equity.
            </p>
          </div>

          {/* Search Bar & Apply Action */}
          <div className="flex items-center gap-3 w-full max-w-md">
            <div className="relative group flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LuSearch className="h-4 w-4 text-zinc-400 group-focus-within:text-zinc-950 dark:group-focus-within:text-white transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Search Uddoktas or businesses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-zinc-950 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-zinc-950 dark:focus:border-white focus:ring-1 focus:ring-zinc-950/20 dark:focus:ring-white/30 transition-all"
              />
            </div>
            <Button
              onClick={() => {
                setIsSubmittedSuccess(false);
                setIsModalOpen(true);
              }}
              className="rounded-xl h-[38px] px-3.5 bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-black font-semibold text-xs transition-colors shrink-0 flex items-center gap-1.5"
            >
              <LuPlus className="w-4 h-4" />
              <span>Apply as Uddokta</span>
            </Button>
          </div>

          {/* Status Filter Chips */}
          <div className="flex items-center gap-2 flex-wrap justify-center">
            {STATUS_FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setActiveFilter(f.value)}
                className={`px-3 py-1 rounded-full text-[11px] font-bold border transition-all ${
                  activeFilter === f.value
                    ? "bg-zinc-950 dark:bg-white text-white dark:text-black border-zinc-950 dark:border-white"
                    : "bg-white dark:bg-zinc-900/40 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Uddokta Cards Grid (Matching Real-Asset Layout) ── */}
        {filteredUddoktas.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl max-w-lg mx-auto">
            <LuInbox className="w-10 h-10 text-zinc-300 dark:text-zinc-700 mb-3" />
            <h3 className="text-sm font-bold text-zinc-700 dark:text-zinc-300">No Uddoktas found</h3>
            <p className="text-xs text-zinc-400 mt-1 max-w-xs leading-relaxed">
              {searchTerm || activeFilter ? "Try adjusting your search or filters." : "No Uddokta businesses listed yet."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 animate-in fade-in duration-300">
            {filteredUddoktas.map((item) => (
              <Card
                key={item.id}
                className="group overflow-hidden rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 bg-card shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col p-0 gap-0 cursor-pointer"
              >
                {/* Banner Image */}
                <div className="relative w-full aspect-[4/3] overflow-hidden bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-100 dark:border-zinc-800/50">
                  <Image
                    src={item.bannerUrl}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10 opacity-70 group-hover:opacity-90 transition-opacity duration-500" />

                  {/* Status & Equity Badges */}
                  <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider backdrop-blur-md ${getStatusStyle(item.status)}`}>
                      {getStatusLabel(item.status)}
                    </span>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider backdrop-blur-md bg-zinc-950/80 text-white border border-white/10">
                      {item.partnerEquityPercent}% Uddokta / {item.myEquityPercent}% Us
                    </span>
                  </div>

                  {/* Title Overlay */}
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                    <span className="text-[9px] font-bold text-zinc-300 uppercase tracking-widest">
                      {item.category}
                    </span>
                    <h3 className="text-sm font-extrabold tracking-tight line-clamp-1">
                      {item.title}
                    </h3>
                  </div>
                </div>

                {/* Content Body */}
                <div className="p-4 flex flex-col flex-1 justify-between gap-3">
                  <div className="space-y-3">
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed font-normal">
                      {item.shortDescription}
                    </p>

                    {/* Partner Profile Strip */}
                    <div className="flex items-center gap-2.5 p-2 rounded-xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/60 dark:border-zinc-800/60">
                      <img
                        src={item.partnerAvatarUrl}
                        alt={item.partnerName}
                        className="w-8 h-8 rounded-full object-cover border border-zinc-300 dark:border-zinc-700 shrink-0"
                      />
                      <div className="min-w-0">
                        <h4 className="text-[11px] font-bold text-zinc-955 dark:text-white truncate">
                          {item.partnerName}
                        </h4>
                        <p className="text-[9px] text-zinc-500 dark:text-zinc-400 truncate">
                          {item.partnerTitle} (80% Equity)
                        </p>
                      </div>
                    </div>

                    {/* Financial Metrics */}
                    <div className="grid grid-cols-2 gap-1 py-2 border-t border-b border-zinc-100 dark:border-zinc-800/60">
                      <div>
                        <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Capital</span>
                        <p className="text-[11px] font-extrabold text-zinc-955 dark:text-white mt-0.5">
                          {item.totalInvestment}
                        </p>
                      </div>
                      <div className="border-l border-zinc-100 dark:border-zinc-800/60 pl-2">
                        <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Revenue</span>
                        <p className="text-[11px] font-extrabold text-zinc-955 dark:text-white mt-0.5 truncate">
                          {item.monthlyRevenue}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Card Action */}
                  <Button
                    onClick={() => {
                      setIsSubmittedSuccess(false);
                      setIsModalOpen(true);
                    }}
                    variant="outline"
                    className="w-full rounded-xl border-zinc-200 dark:border-zinc-800 text-zinc-955 dark:text-white hover:bg-zinc-955 hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors py-1 h-8 text-[11px] font-semibold bg-white dark:bg-zinc-900/50 flex items-center justify-center gap-1 mt-auto"
                  >
                    <span>Pitch Idea</span>
                    <LuArrowUpRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Modal: Application Form */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-lg bg-card border border-zinc-200 dark:border-zinc-800/80 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
              
              {/* Modal Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-extrabold text-zinc-955 dark:text-white">
                    Apply as an Uddokta Partner
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                    80% Uddokta Equity / 20% BusinessBear Co-Investment
                  </p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-955 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  <LuX className="w-5 h-5" />
                </button>
              </div>

              {isSubmittedSuccess ? (
                <div className="py-8 text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-zinc-100 dark:bg-zinc-900 text-zinc-955 dark:text-white flex items-center justify-center mx-auto border border-zinc-200 dark:border-zinc-800">
                    <LuCheck className="w-7 h-7" />
                  </div>
                  <h4 className="text-lg font-bold text-zinc-955 dark:text-white">Proposal Received!</h4>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-xs mx-auto leading-relaxed">
                    Thank you for reaching out. We will review your proposal and get in touch if your business idea aligns with our 20/80 Uddokta model.
                  </p>
                  <Button
                    onClick={() => setIsModalOpen(false)}
                    className="mt-2 rounded-xl px-6 text-xs font-semibold"
                  >
                    Close Window
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleApplicationSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest pl-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formState.applicantName}
                        onChange={(e) => setFormState({ ...formState, applicantName: e.target.value })}
                        placeholder="Your Name"
                        className="w-full bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/80 rounded-xl px-3.5 py-2.5 text-xs text-zinc-955 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-zinc-955 dark:focus:border-white focus:ring-1 focus:ring-zinc-955/20 dark:focus:ring-white/30 transition-all duration-200"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest pl-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={formState.email}
                        onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                        placeholder="hello@example.com"
                        className="w-full bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/80 rounded-xl px-3.5 py-2.5 text-xs text-zinc-955 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-zinc-955 dark:focus:border-white focus:ring-1 focus:ring-zinc-955/20 dark:focus:ring-white/30 transition-all duration-200"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest pl-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={formState.phone}
                        onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                        placeholder="+880 1700-000000"
                        className="w-full bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/80 rounded-xl px-3.5 py-2.5 text-xs text-zinc-955 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-zinc-955 dark:focus:border-white focus:ring-1 focus:ring-zinc-955/20 dark:focus:ring-white/30 transition-all duration-200"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest pl-1">
                        Business Industry / Niche
                      </label>
                      <input
                        type="text"
                        value={formState.businessNiche}
                        onChange={(e) => setFormState({ ...formState, businessNiche: e.target.value })}
                        placeholder="e.g. Cloud Kitchen, Retail, Tech"
                        className="w-full bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/80 rounded-xl px-3.5 py-2.5 text-xs text-zinc-955 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-zinc-955 dark:focus:border-white focus:ring-1 focus:ring-zinc-955/20 dark:focus:ring-white/30 transition-all duration-200"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest pl-1">
                      Business Idea Pitch & Experience *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formState.pitchMessage}
                      onChange={(e) => setFormState({ ...formState, pitchMessage: e.target.value })}
                      placeholder="Explain your business idea, why you want to partner with BusinessBear, and your background experience..."
                      className="w-full bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/80 rounded-xl px-3.5 py-2.5 text-xs text-zinc-955 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-zinc-955 dark:focus:border-white focus:ring-1 focus:ring-zinc-955/20 dark:focus:ring-white/30 transition-all duration-200 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-zinc-955 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-black font-bold py-3 rounded-xl transition-all duration-200 shadow-lg text-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <LuLoaderCircle className="w-3.5 h-3.5 animate-spin" />
                        <span>Submitting Application...</span>
                      </>
                    ) : (
                      <span>Submit Uddokta Application</span>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
