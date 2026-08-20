"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, Layers, UserCheck, Mail, AlertCircle, RefreshCw, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";

import { HeroData, ServiceData, AboutUsData } from "@/types/home";
import { homeService } from "@/services/homeService";
import { DEFAULT_HERO, DEFAULT_ABOUT, withDefaults } from "@/lib/constants/homeDefaults";

// Section Modals
import { HeroModal } from "./home/HeroModal";
import { ServicesModal, ServiceFormModal, DeleteConfirmModal } from "./home/ServicesModal";
import { AboutModal } from "./home/AboutModal";
import { ContactModal } from "./home/ContactModal";

// ─────────────────────────────────────────────────────────────────────────────
export function HomeConfigTab() {
  // ── Loading & Error ──
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // ── Save ──
  const [isSavingHero, setIsSavingHero] = useState(false);
  const [isSavingAbout, setIsSavingAbout] = useState(false);
  const [isSavingContact, setIsSavingContact] = useState(false);
  const [isSavingService, setIsSavingService] = useState(false);
  const [deletingServiceId, setDeletingServiceId] = useState<number | null>(null);

  // ── Modal State ──
  const [activeModal, setActiveModal] = useState<"hero" | "services" | "about" | "contact" | null>(null);
  const [isServiceFormOpen, setIsServiceFormOpen] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [editingServiceId, setEditingServiceId] = useState<number | null>(null);

  // ── Data (initial values come from shared defaults) ──
  const [heroData, setHeroData] = useState<HeroData>(DEFAULT_HERO);

  const [services, setServices] = useState<ServiceData[]>([]);
  const [serviceForm, setServiceForm] = useState<Partial<ServiceData>>({
    title: "", description: "", iconName: "Code", isActive: true,
  });

  const [aboutData, setAboutData] = useState<AboutUsData>(DEFAULT_ABOUT);

  const [contactData, setContactData] = useState({
    email: DEFAULT_ABOUT.email,
    phone: DEFAULT_ABOUT.phone,
    location: DEFAULT_ABOUT.location,
  });

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchAllData = async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const [heroRes, servicesRes, aboutRes] = await Promise.all([
        homeService.getHero(),
        homeService.getAllServicesAdmin(),
        homeService.getAboutUs(),
      ]);

      if (heroRes.success) {
        const hero = withDefaults(DEFAULT_HERO, heroRes.data);
        setHeroData(hero);
      }

      if (servicesRes.success && Array.isArray(servicesRes.data)) {
        setServices(servicesRes.data);
      }

      if (aboutRes.success) {
        const about = withDefaults(DEFAULT_ABOUT, aboutRes.data);
        setAboutData(about);
        setContactData({ email: about.email, phone: about.phone, location: about.location });
      }
    } catch (err: any) {
      const msg = err?.message || "Failed to load configuration. Check your backend connection.";
      setFetchError(msg);
      toast.error("Failed to load home configuration.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchAllData(); }, []);

  // ── Save Handlers ──────────────────────────────────────────────────────────
  const handleSaveHero = async () => {
    setIsSavingHero(true);
    try {
      const res = await toast.promise(homeService.updateHero(heroData), {
        loading: "Saving…", success: "Hero section saved!", error: (e) => e?.message || "Failed",
      });
      if (res.success) {
        setHeroData(withDefaults(DEFAULT_HERO, res.data));
      }
      setActiveModal(null);
    } catch { /* toast */ } finally { setIsSavingHero(false); }
  };

  const handleSaveAbout = async () => {
    setIsSavingAbout(true);
    const payload: AboutUsData = { ...aboutData, ...contactData };
    try {
      const res = await toast.promise(homeService.updateAboutUs(payload), {
        loading: "Saving…", success: "Profile saved!", error: (e) => e?.message || "Failed",
      });
      if (res.success) {
        const about = withDefaults(DEFAULT_ABOUT, res.data);
        setAboutData(about);
        setContactData({ email: about.email, phone: about.phone, location: about.location });
      }
      setActiveModal(null);
    } catch { /* toast */ } finally { setIsSavingAbout(false); }
  };

  const handleSaveContact = async () => {
    setIsSavingContact(true);
    const payload: AboutUsData = { ...aboutData, ...contactData };
    try {
      const res = await toast.promise(homeService.updateAboutUs(payload), {
        loading: "Saving…", success: "Contact info saved!", error: (e) => e?.message || "Failed",
      });
      if (res.success && res.data) {
        const a = res.data;
        const m = { fullName: a.fullName || "", designation: a.designation || "", bio: a.bio || "", avatarUrl: a.avatarUrl || "", email: a.email || "", phone: a.phone || "", location: a.location || "" };
        setAboutData(m);
        setContactData({ email: m.email, phone: m.phone, location: m.location });
      }
      setActiveModal(null);
    } catch { /* toast */ } finally { setIsSavingContact(false); }
  };

  // ── Service CRUD ───────────────────────────────────────────────────────────
  const handleOpenAddService = () => {
    setEditingServiceId(null);
    setServiceForm({ title: "", description: "", iconName: "Code", isActive: true });
    setIsServiceFormOpen(true);
  };

  const handleOpenEditService = (svc: ServiceData) => {
    setEditingServiceId(svc.id);
    setServiceForm(svc);
    setIsServiceFormOpen(true);
  };

  const handleSaveService = async () => {
    if (!serviceForm.title?.trim()) { toast.error("Title is required."); return; }
    if (!serviceForm.description?.trim()) { toast.error("Description is required."); return; }
    setIsSavingService(true);
    const isEditing = !!editingServiceId;
    const payload = {
      title: serviceForm.title!,
      description: serviceForm.description!,
      iconName: serviceForm.iconName || "Code",
      displayOrder: serviceForm.displayOrder ?? (isEditing ? serviceForm.displayOrder : services.length + 1),
      isActive: serviceForm.isActive ?? true,
    };
    try {
      const res = await toast.promise(
        isEditing ? homeService.updateService(editingServiceId!, payload) : homeService.createService(payload),
        { loading: isEditing ? "Updating…" : "Creating…", success: isEditing ? "Service updated!" : "Service created!", error: (e) => e?.message || "Failed" }
      );
      if (res.success && res.data) {
        setServices((p) => isEditing ? p.map((s) => (s.id === editingServiceId ? res.data : s)) : [...p, res.data]);
      }
      setIsServiceFormOpen(false);
    } catch { /* toast */ } finally { setIsSavingService(false); }
  };

  const handleConfirmDelete = async () => {
    if (confirmDeleteId === null) return;
    const id = confirmDeleteId;
    setConfirmDeleteId(null);
    setDeletingServiceId(id);
    try {
      await toast.promise(homeService.deleteService(id), {
        loading: "Deleting…", success: "Service deleted!", error: (e) => e?.message || "Delete failed",
      });
      setServices((p) => p.filter((s) => s.id !== id));
    } catch { /* toast */ } finally { setDeletingServiceId(null); }
  };

  // ── Render: Loading ────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="pt-2 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-4 sm:p-5 flex items-center gap-4 animate-pulse">
              <div className="w-11 h-11 rounded-xl bg-zinc-100 dark:bg-zinc-800 shrink-0" />
              <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-24" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── Render: Error ──────────────────────────────────────────────────────────
  if (fetchError) {
    return (
      <div className="pt-2 pb-8 flex flex-col items-center justify-center border border-dashed border-red-200 dark:border-red-900/50 rounded-2xl p-8 bg-red-50/10 text-center max-w-xl mx-auto my-10 animate-in fade-in duration-300">
        <AlertCircle className="w-10 h-10 text-red-500 mb-3" />
        <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-1">Failed to Load Configuration</h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4 max-w-sm leading-relaxed">{fetchError}</p>
        <Button onClick={fetchAllData} size="sm" className="h-8 text-xs font-semibold gap-1.5">
          <RefreshCw className="w-3.5 h-3.5" /> Retry Connection
        </Button>
      </div>
    );
  }

  // ── Render: Main ──────────────────────────────────────────────────────────
  const sectionCards = [
    { id: "hero" as const, icon: <Sparkles className="w-5 h-5" />, label: "Hero Section" },
    { id: "services" as const, icon: <Layers className="w-5 h-5" />, label: "Our Services" },
    { id: "about" as const, icon: <UserCheck className="w-5 h-5" />, label: "About Us" },
    { id: "contact" as const, icon: <Mail className="w-5 h-5" />, label: "Contact Us", hasInbox: true },
  ];

  return (
    <div className="pt-2 pb-8">

      {/* Section Picker Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {sectionCards.map(({ id, icon, label, hasInbox }) => (
          <div
            key={id}
            onClick={() => setActiveModal(id)}
            className="group relative bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-lg hover:border-zinc-400 dark:hover:border-zinc-600 transition-all duration-300 cursor-pointer flex items-center justify-between gap-3 animate-in fade-in duration-300"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-11 h-11 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                {icon}
              </div>
              <h3 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-white group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors truncate">
                {label}
              </h3>
            </div>

            {hasInbox && (
              <Link
                href="/admin/messages"
                onClick={(e) => e.stopPropagation()}
                className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all shrink-0"
                title="View Messages Inbox"
              >
                <ExternalLink className="w-4 h-4" />
              </Link>
            )}
          </div>
        ))}
      </div>

      {/* Modals */}
      <HeroModal
        isOpen={activeModal === "hero"}
        onOpenChange={(open) => !open && setActiveModal(null)}
        heroData={heroData}
        setHeroData={setHeroData}
        isSaving={isSavingHero}
        onSave={handleSaveHero}
      />

      <ServicesModal
        isOpen={activeModal === "services"}
        onOpenChange={(open) => !open && setActiveModal(null)}
        services={services}
        deletingServiceId={deletingServiceId}
        onAdd={handleOpenAddService}
        onEdit={handleOpenEditService}
        onDeleteRequest={setConfirmDeleteId}
      />

      <ServiceFormModal
        isOpen={isServiceFormOpen}
        onOpenChange={setIsServiceFormOpen}
        isEditing={!!editingServiceId}
        form={serviceForm}
        setForm={setServiceForm}
        isSaving={isSavingService}
        onSave={handleSaveService}
      />

      <DeleteConfirmModal
        isOpen={confirmDeleteId !== null}
        onOpenChange={(open) => !open && setConfirmDeleteId(null)}
        serviceTitle={services.find((s) => s.id === confirmDeleteId)?.title}
        onConfirm={handleConfirmDelete}
      />

      <AboutModal
        isOpen={activeModal === "about"}
        onOpenChange={(open) => !open && setActiveModal(null)}
        aboutData={aboutData}
        setAboutData={setAboutData}
        isSaving={isSavingAbout}
        onSave={handleSaveAbout}
      />

      <ContactModal
        isOpen={activeModal === "contact"}
        onOpenChange={(open) => !open && setActiveModal(null)}
        contactData={contactData}
        setContactData={setContactData}
        isSaving={isSavingContact}
        onSave={handleSaveContact}
      />

    </div>
  );
}
