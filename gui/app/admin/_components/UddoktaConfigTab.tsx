"use client";

import { useState } from "react";
import {
  LuPlus, LuPencil, LuTrash2,
  LuHandshake, LuTag, LuBriefcase, LuDollarSign,
  LuImage, LuFileText, LuUser, LuMail, LuPhone, LuCheck, LuInbox
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
import { TableLayout } from "@/components/ui/table-layout";
import { homeService } from "@/services/homeService";
import { toast } from "react-hot-toast";

export interface UddoktaRecord {
  id: string;
  title: string;
  category: string;
  shortDescription: string;
  bannerUrl: string;
  myEquityPercent: number;
  partnerEquityPercent: number;
  partnerName: string;
  partnerTitle: string;
  partnerAvatarUrl: string;
  status: "ACTIVE" | "PROFITABLE" | "LAUNCHING" | "PLANNING";
  totalInvestment: string;
  monthlyRevenue: string;
}

export interface UddoktaApplicationRecord {
  id: string;
  applicantName: string;
  email: string;
  phone: string;
  businessNiche: string;
  estimatedBudget: string;
  pitchMessage: string;
  submittedAt: string;
  status: "PENDING" | "REVIEWED" | "CONTACTED";
}

const INITIAL_UDDOKTAS: UddoktaRecord[] = [
  {
    id: "u-1",
    title: "UrbanBites Cloud Kitchen",
    category: "Food & Beverage",
    shortDescription: "A tech-enabled cloud kitchen network servicing high-density office zones.",
    bannerUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=800&auto=format&fit=crop",
    myEquityPercent: 20,
    partnerEquityPercent: 80,
    partnerName: "Chef Tanvir Ahmed",
    partnerTitle: "Uddokta Lead & Culinary Head",
    partnerAvatarUrl: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?q=80&w=300&auto=format&fit=crop",
    status: "PROFITABLE",
    totalInvestment: "৳1.5 Crore",
    monthlyRevenue: "৳42 Lakh"
  },
  {
    id: "u-2",
    title: "GreenHarbor Organic Agro",
    category: "Agro & Supply Chain",
    shortDescription: "Direct-from-farm organic produce distribution connecting rural farmers.",
    bannerUrl: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=800&auto=format&fit=crop",
    myEquityPercent: 20,
    partnerEquityPercent: 80,
    partnerName: "Rahim Chowdhury",
    partnerTitle: "Uddokta Founder & Ops Lead",
    partnerAvatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop",
    status: "ACTIVE",
    totalInvestment: "৳2.2 Crore",
    monthlyRevenue: "৳68 Lakh"
  }
];

const INITIAL_APPLICATIONS: UddoktaApplicationRecord[] = [
  {
    id: "app-1",
    applicantName: "Habib Rahman",
    email: "habib@example.com",
    phone: "+880 1711-223344",
    businessNiche: "Smart Logistics Hub",
    estimatedBudget: "৳1.2 Crore",
    pitchMessage: "I have 5 years experience in warehousing and want to launch an electric vehicle last-mile hub in Chittagong. Seeking 20% co-funding and strategy from BusinessBear.",
    submittedAt: "2 hours ago",
    status: "PENDING"
  },
  {
    id: "app-2",
    applicantName: "Sabrina Islam",
    email: "sabrina@example.com",
    phone: "+880 1819-998877",
    businessNiche: "B2B SaaS Platform",
    estimatedBudget: "৳80 Lakh",
    pitchMessage: "Building inventory automation software for local retail stores. We have 15 beta clients signed up.",
    submittedAt: "1 day ago",
    status: "REVIEWED"
  }
];

function FieldLabel({ icon: Icon, text, required }: { icon: any; text: string; required?: boolean }) {
  return (
    <label className="flex items-center gap-1.5 text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest mb-1.5">
      <Icon className="w-3 h-3" />
      {text}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  );
}

export function UddoktaConfigTab() {
  const [activeTab, setActiveTab] = useState<"UDDOKTAS" | "APPLICATIONS">("UDDOKTAS");
  const [uddoktas, setUddoktas] = useState<UddoktaRecord[]>(INITIAL_UDDOKTAS);
  const [applications, setApplications] = useState<UddoktaApplicationRecord[]>(INITIAL_APPLICATIONS);

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modal State for Uddokta Edit/Create
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Application View Pitch Modal
  const [selectedApp, setSelectedApp] = useState<UddoktaApplicationRecord | null>(null);

  const defaultForm = (): Partial<UddoktaRecord> => ({
    title: "",
    category: "General",
    shortDescription: "",
    bannerUrl: "",
    myEquityPercent: 20,
    partnerEquityPercent: 80,
    partnerName: "",
    partnerTitle: "Uddokta Founder",
    partnerAvatarUrl: "",
    status: "ACTIVE",
    totalInvestment: "৳1 Crore",
    monthlyRevenue: "Pre-Revenue"
  });

  const [formData, setFormData] = useState<Partial<UddoktaRecord>>(defaultForm());

  const handleOpenNew = () => {
    setEditingId(null);
    setFormData(defaultForm());
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (rec: UddoktaRecord) => {
    setEditingId(rec.id);
    setFormData({ ...rec });
    setIsDialogOpen(true);
  };

  const handleDeleteUddokta = (id: string) => {
    if (!confirm("Are you sure you want to delete this Uddokta record?")) return;
    setUddoktas((prev) => prev.filter((v) => v.id !== id));
    toast.success("Uddokta record deleted!");
  };

  const handleSaveUddokta = () => {
    if (!formData.title?.trim()) return toast.error("Business title is required.");
    if (!formData.partnerName?.trim()) return toast.error("Uddokta partner name is required.");

    setIsSaving(true);
    setTimeout(() => {
      if (editingId) {
        setUddoktas((prev) =>
          prev.map((v) => (v.id === editingId ? ({ ...v, ...formData } as UddoktaRecord) : v))
        );
        toast.success("Uddokta updated!");
      } else {
        const newRecord: UddoktaRecord = {
          id: `u-${Date.now()}`,
          title: formData.title || "Untitled Business",
          category: formData.category || "General",
          shortDescription: formData.shortDescription || "",
          bannerUrl: formData.bannerUrl || "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=800&auto=format&fit=crop",
          myEquityPercent: Number(formData.myEquityPercent || 20),
          partnerEquityPercent: Number(formData.partnerEquityPercent || 80),
          partnerName: formData.partnerName || "Uddokta",
          partnerTitle: formData.partnerTitle || "Uddokta Founder",
          partnerAvatarUrl: formData.partnerAvatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop",
          status: formData.status || "ACTIVE",
          totalInvestment: formData.totalInvestment || "৳1 Crore",
          monthlyRevenue: formData.monthlyRevenue || "Pre-Revenue"
        };
        setUddoktas((prev) => [newRecord, ...prev]);
        toast.success("New Uddokta business added!");
      }
      setIsSaving(false);
      setIsDialogOpen(false);
    }, 400);
  };

  const handleAppStatusChange = (appId: string, nextStatus: "PENDING" | "REVIEWED" | "CONTACTED") => {
    setApplications((prev) =>
      prev.map((a) => (a.id === appId ? { ...a, status: nextStatus } : a))
    );
    toast.success(`Application status marked as ${nextStatus}!`);
  };

  const filteredUddoktas = uddoktas.filter(
    (v) =>
      v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.partnerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredApplications = applications.filter(
    (a) =>
      a.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.businessNiche.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">

      {/* Admin Module Sub-Tabs */}
      <div className="flex items-center gap-3 border-b border-zinc-200 dark:border-zinc-800 pb-3">
        <button
          onClick={() => setActiveTab("UDDOKTAS")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "UDDOKTAS"
              ? "bg-zinc-950 dark:bg-white text-white dark:text-black shadow-md"
              : "bg-card text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 border border-zinc-200 dark:border-zinc-800"
          }`}
        >
          <LuBriefcase className="w-4 h-4" />
          <span>Active Uddoktas ({uddoktas.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("APPLICATIONS")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all relative ${
            activeTab === "APPLICATIONS"
              ? "bg-zinc-950 dark:bg-white text-white dark:text-black shadow-md"
              : "bg-card text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 border border-zinc-200 dark:border-zinc-800"
          }`}
        >
          <LuMail className="w-4 h-4" />
          <span>Uddokta Applications Inbox ({applications.length})</span>
        </button>
      </div>

      {activeTab === "UDDOKTAS" ? (
        <TableLayout
          searchPlaceholder="Search Uddoktas or business names..."
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          createButtonText="Add Uddokta"
          onCreateClick={handleOpenNew}
          isEmpty={filteredUddoktas.length === 0}
          emptyTitle="No Uddokta businesses found"
          emptyDescription={searchQuery ? `No Uddoktas match "${searchQuery}".` : "No Uddokta businesses added yet."}
          emptyIcon={LuBriefcase}
          totalItems={filteredUddoktas.length}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
        >
          {/* Create/Edit Uddokta Modal */}
          <Modal
            isOpen={isDialogOpen}
            onOpenChange={isSaving ? () => {} : setIsDialogOpen}
            title={editingId ? "Edit Uddokta Business" : "New Uddokta Business"}
            onSave={handleSaveUddokta}
            saveText={isSaving ? "Saving…" : editingId ? "Save Changes" : "Create Uddokta Business"}
            isLoading={isSaving}
            size="xl"
          >
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1 min-w-0 space-y-4">
                <div className="space-y-1.5">
                  <FieldLabel icon={LuBriefcase} text="Business Title" required />
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. UrbanBites Cloud Kitchen"
                    disabled={isSaving}
                    className="h-9 text-sm font-semibold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <FieldLabel icon={LuTag} text="Industry Category" />
                    <Input
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      placeholder="e.g. Food & Beverage"
                      disabled={isSaving}
                      className="h-9 text-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <FieldLabel icon={LuHandshake} text="Status" />
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                      className="w-full bg-background border border-input rounded-md px-3 h-9 text-xs focus:outline-none focus:ring-1 focus:ring-ring font-semibold"
                      disabled={isSaving}
                    >
                      <option value="PROFITABLE">Profitable</option>
                      <option value="ACTIVE">Active Venture</option>
                      <option value="LAUNCHING">Launching Soon</option>
                      <option value="PLANNING">Planning Stage</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                  <div className="space-y-1.5">
                    <FieldLabel icon={LuUser} text="Uddokta Partner Name" required />
                    <Input
                      value={formData.partnerName}
                      onChange={(e) => setFormData({ ...formData, partnerName: e.target.value })}
                      placeholder="e.g. Tanvir Ahmed"
                      disabled={isSaving}
                      className="h-9 text-sm font-semibold"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <FieldLabel icon={LuTag} text="Partner Role" />
                    <Input
                      value={formData.partnerTitle}
                      onChange={(e) => setFormData({ ...formData, partnerTitle: e.target.value })}
                      placeholder="e.g. Uddokta Founder"
                      disabled={isSaving}
                      className="h-9 text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <FieldLabel icon={LuDollarSign} text="Initial Capital" />
                    <Input
                      value={formData.totalInvestment}
                      onChange={(e) => setFormData({ ...formData, totalInvestment: e.target.value })}
                      placeholder="e.g. ৳1.5 Crore"
                      disabled={isSaving}
                      className="h-9 text-xs font-semibold"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <FieldLabel icon={LuDollarSign} text="Monthly Revenue" />
                    <Input
                      value={formData.monthlyRevenue}
                      onChange={(e) => setFormData({ ...formData, monthlyRevenue: e.target.value })}
                      placeholder="e.g. ৳42 Lakh"
                      disabled={isSaving}
                      className="h-9 text-xs font-semibold"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <FieldLabel icon={LuFileText} text="Short Description" />
                  <Textarea
                    rows={3}
                    value={formData.shortDescription}
                    onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                    placeholder="Brief description of what this Uddokta business does..."
                    disabled={isSaving}
                    className="resize-none text-xs leading-relaxed"
                  />
                </div>
              </div>

              <div className="w-full md:w-56 shrink-0 space-y-4">
                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Cover Image</p>
                  <ImageInput
                    value={formData.bannerUrl}
                    onUpload={async (file) => { const res = await homeService.uploadFile(file); return res.data; }}
                    onChange={(url) => setFormData({ ...formData, bannerUrl: url })}
                    size="md"
                    variant="card"
                    disabled={isSaving}
                  />
                </div>

                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Uddokta Avatar</p>
                  <ImageInput
                    value={formData.partnerAvatarUrl}
                    onUpload={async (file) => { const res = await homeService.uploadFile(file); return res.data; }}
                    onChange={(url) => setFormData({ ...formData, partnerAvatarUrl: url })}
                    size="md"
                    variant="card"
                    disabled={isSaving}
                  />
                </div>
              </div>
            </div>
          </Modal>

          {/* Table */}
          <Table>
            <TableHeader>
              <TableRow className="bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-800 text-[11px] uppercase tracking-wider font-bold text-zinc-500">
                <TableHead className="w-12 text-center">#</TableHead>
                <TableHead className="w-16">Banner</TableHead>
                <TableHead className="w-2/5">Business & Uddokta</TableHead>
                <TableHead className="w-28">Split Share</TableHead>
                <TableHead className="w-28">Capital / Revenue</TableHead>
                <TableHead className="w-24">Status</TableHead>
                <TableHead className="text-right pr-5 w-20">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-xs">
              {filteredUddoktas.map((v, index) => (
                <TableRow key={v.id} className="group hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                  <TableCell className="font-mono text-xs font-semibold text-zinc-400 text-center">
                    {String(index + 1).padStart(2, "0")}
                  </TableCell>
                  <TableCell>
                    <div className="w-12 h-8 rounded bg-zinc-100 dark:bg-zinc-800 overflow-hidden relative border border-zinc-200 dark:border-zinc-700">
                      <img src={v.bannerUrl} alt={v.title} className="w-full h-full object-cover" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-bold text-zinc-900 dark:text-white text-xs">{v.title}</div>
                    <div className="text-[10px] text-zinc-400 mt-0.5">Uddokta: <span className="font-semibold text-zinc-700 dark:text-zinc-300">{v.partnerName}</span> ({v.partnerTitle})</div>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200/50 dark:border-zinc-700/50">
                      80% / 20%
                    </span>
                  </TableCell>
                  <TableCell className="text-xs">
                    <div className="font-bold text-zinc-900 dark:text-white">{v.totalInvestment}</div>
                    <div className="text-emerald-600 dark:text-emerald-400 text-[10px] font-semibold">{v.monthlyRevenue}</div>
                  </TableCell>
                  <TableCell>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                      {v.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right pr-5">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleOpenEdit(v)}
                        className="w-7 h-7 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 flex items-center justify-center transition-colors"
                        title="Edit"
                      >
                        <LuPencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteUddokta(v.id)}
                        className="w-7 h-7 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 flex items-center justify-center transition-colors"
                        title="Delete"
                      >
                        <LuTrash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableLayout>
      ) : (
        /* Applications Inbox Table */
        <TableLayout
          searchPlaceholder="Search applicants by name, email, or niche..."
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          isEmpty={filteredApplications.length === 0}
          emptyTitle="No applications in inbox"
          emptyDescription={searchQuery ? `No proposals match "${searchQuery}".` : "No Uddokta applications received yet."}
          emptyIcon={LuInbox}
          totalItems={filteredApplications.length}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
        >
          <Table>
            <TableHeader>
              <TableRow className="bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-800 text-[11px] uppercase tracking-wider font-bold text-zinc-500">
                <TableHead className="w-12 text-center">#</TableHead>
                <TableHead className="w-1/4">Applicant Name</TableHead>
                <TableHead className="w-1/4">Contact Details</TableHead>
                <TableHead className="w-1/5">Industry / Budget</TableHead>
                <TableHead className="w-24">Status</TableHead>
                <TableHead className="text-right pr-5 w-28">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-xs">
              {filteredApplications.map((app, index) => (
                <TableRow key={app.id} className="group hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                  <TableCell className="font-mono text-xs font-semibold text-zinc-400 text-center">
                    {String(index + 1).padStart(2, "0")}
                  </TableCell>
                  <TableCell>
                    <div className="font-bold text-zinc-900 dark:text-white text-xs">{app.applicantName}</div>
                    <div className="text-[10px] text-zinc-400 mt-0.5">{app.submittedAt}</div>
                  </TableCell>
                  <TableCell className="text-xs">
                    <div className="flex items-center gap-1 text-zinc-700 dark:text-zinc-300">
                      <LuMail className="w-3 h-3 text-zinc-400" />
                      <span>{app.email}</span>
                    </div>
                    {app.phone && (
                      <div className="flex items-center gap-1 text-zinc-500 text-[10px] mt-0.5">
                        <LuPhone className="w-2.5 h-2.5" />
                        <span>{app.phone}</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="font-semibold text-zinc-900 dark:text-white">{app.businessNiche}</div>
                    <div className="text-[10px] text-zinc-400">{app.estimatedBudget}</div>
                  </TableCell>
                  <TableCell>
                    <select
                      value={app.status}
                      onChange={(e) => handleAppStatusChange(app.id, e.target.value as any)}
                      className="bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded px-2 py-0.5 text-[10px] font-bold text-zinc-800 dark:text-zinc-200"
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="REVIEWED">REVIEWED</option>
                      <option value="CONTACTED">CONTACTED</option>
                    </select>
                  </TableCell>
                  <TableCell className="text-right pr-5">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedApp(app)}
                      className="h-7 text-[10px] font-bold rounded-lg px-2.5"
                    >
                      Read Pitch
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* View Pitch Detail Modal */}
          {selectedApp && (
            <Modal
              isOpen={!!selectedApp}
              onOpenChange={() => setSelectedApp(null)}
              title={`Pitch Proposal: ${selectedApp.applicantName}`}
              onSave={() => setSelectedApp(null)}
              saveText="Close Pitch"
              size="md"
            >
              <div className="space-y-4">
                <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/60 dark:border-zinc-700/60 space-y-1">
                  <p className="text-xs font-bold text-zinc-900 dark:text-white">{selectedApp.businessNiche}</p>
                  <p className="text-[11px] text-zinc-500">Estimated Budget: <span className="font-bold text-zinc-800 dark:text-zinc-200">{selectedApp.estimatedBudget}</span></p>
                  <p className="text-[10px] text-zinc-400">Applicant Contact: {selectedApp.email} | {selectedApp.phone}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Pitch Message</p>
                  <div className="p-3 rounded-xl bg-card border border-zinc-200 dark:border-zinc-800 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
                    {selectedApp.pitchMessage}
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <Button
                    onClick={() => {
                      handleAppStatusChange(selectedApp.id, "CONTACTED");
                      setSelectedApp(null);
                    }}
                    className="h-8 text-xs font-bold rounded-xl"
                  >
                    <LuCheck className="w-3.5 h-3.5 mr-1" />
                    <span>Mark as Contacted</span>
                  </Button>
                </div>
              </div>
            </Modal>
          )}
        </TableLayout>
      )}

    </div>
  );
}
