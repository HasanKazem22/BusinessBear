"use client";

import { useState } from "react";
import {
  LuPlus, LuPencil, LuTrash2,
  LuTv, LuTag, LuClock, LuEye, LuLink, LuFileText, LuCalendar
} from "react-icons/lu";
import { FaFacebook } from "react-icons/fa";
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

export interface FbVideoRecord {
  id: string;
  title: string;
  category: string;
  videoUrl: string;
  thumbnailUrl: string;
  description: string;
  viewCount: string;
  duration: string;
  publishedDate: string;
}

const INITIAL_RECORDS: FbVideoRecord[] = [
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

export function ContentConfigTab() {
  const [records, setRecords] = useState<FbVideoRecord[]>(INITIAL_RECORDS);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const defaultForm = (): Partial<FbVideoRecord> => ({
    title: "",
    category: "BUSINESS_BREAKDOWN",
    videoUrl: "https://www.facebook.com",
    thumbnailUrl: "",
    description: "",
    viewCount: "0",
    duration: "00:00",
    publishedDate: "Just now"
  });

  const [formData, setFormData] = useState<Partial<FbVideoRecord>>(defaultForm());

  const handleOpenNew = () => {
    setEditingId(null);
    setFormData(defaultForm());
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (rec: FbVideoRecord) => {
    setEditingId(rec.id);
    setFormData({ ...rec });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this video record?")) return;
    setRecords((prev) => prev.filter((r) => r.id !== id));
    toast.success("Video record deleted!");
  };

  const handleSave = () => {
    if (!formData.title?.trim()) return toast.error("Video title is required.");
    if (!formData.videoUrl?.trim()) return toast.error("Facebook video URL is required.");

    setIsSaving(true);
    setTimeout(() => {
      if (editingId) {
        setRecords((prev) =>
          prev.map((r) => (r.id === editingId ? ({ ...r, ...formData } as FbVideoRecord) : r))
        );
        toast.success("Video updated successfully!");
      } else {
        const newRecord: FbVideoRecord = {
          id: `fb-${Date.now()}`,
          title: formData.title || "Untitled Video",
          category: formData.category || "BUSINESS_BREAKDOWN",
          videoUrl: formData.videoUrl || "https://www.facebook.com",
          thumbnailUrl: formData.thumbnailUrl || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop",
          description: formData.description || "",
          viewCount: formData.viewCount || "1K",
          duration: formData.duration || "10:00",
          publishedDate: formData.publishedDate || "Just now"
        };
        setRecords((prev) => [newRecord, ...prev]);
        toast.success("New video added!");
      }
      setIsSaving(false);
      setIsDialogOpen(false);
    }, 400);
  };

  const filteredRecords = records.filter(
    (r) =>
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedRecords = filteredRecords.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <TableLayout
      searchPlaceholder="Search videos by title or category..."
      searchValue={searchQuery}
      onSearchChange={setSearchQuery}
      createButtonText="Add FB Video"
      onCreateClick={handleOpenNew}
      isEmpty={filteredRecords.length === 0}
      emptyTitle="No videos found"
      emptyDescription={searchQuery ? `No videos match "${searchQuery}".` : "No Facebook videos added yet."}
      emptyIcon={LuTv}
      totalItems={filteredRecords.length}
      currentPage={currentPage}
      pageSize={pageSize}
      onPageChange={setCurrentPage}
      onPageSizeChange={setPageSize}
    >
      {/* Modal */}
      <Modal
        isOpen={isDialogOpen}
        onOpenChange={isSaving ? () => {} : setIsDialogOpen}
        title={editingId ? "Edit Facebook Video" : "New Facebook Video"}
        onSave={handleSave}
        saveText={isSaving ? "Saving…" : editingId ? "Save Changes" : "Publish Video"}
        isLoading={isSaving}
        size="xl"
      >
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 min-w-0 space-y-4">
            <div className="space-y-1.5">
              <FieldLabel icon={LuTv} text="Video Title" required />
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. How Local E-Commerce Brands Scale to ৳1 Crore"
                disabled={isSaving}
                className="h-9 text-sm font-semibold"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <FieldLabel icon={LuLink} text="Facebook Video URL" required />
                <Input
                  value={formData.videoUrl}
                  onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                  placeholder="https://www.facebook.com/watch/..."
                  disabled={isSaving}
                  className="h-9 text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <FieldLabel icon={LuTag} text="Category" />
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-background border border-input rounded-md px-3 h-9 text-xs focus:outline-none focus:ring-1 focus:ring-ring font-semibold"
                  disabled={isSaving}
                >
                  <option value="BUSINESS_BREAKDOWN">Business Breakdown</option>
                  <option value="ENTREPRENEUR_TALK">Entrepreneur Talk</option>
                  <option value="VENTURE_SERIES">20/80 Venture Series</option>
                  <option value="CASE_STUDY">Case Study</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <FieldLabel icon={LuEye} text="Views Count" />
                <Input
                  value={formData.viewCount}
                  onChange={(e) => setFormData({ ...formData, viewCount: e.target.value })}
                  placeholder="e.g. 45.2K"
                  disabled={isSaving}
                  className="h-9 text-xs font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <FieldLabel icon={LuClock} text="Duration" />
                <Input
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="e.g. 18:42"
                  disabled={isSaving}
                  className="h-9 text-xs font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <FieldLabel icon={LuCalendar} text="Publish Date" />
                <Input
                  value={formData.publishedDate}
                  onChange={(e) => setFormData({ ...formData, publishedDate: e.target.value })}
                  placeholder="e.g. 2 days ago"
                  disabled={isSaving}
                  className="h-9 text-xs font-medium"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <FieldLabel icon={LuFileText} text="Video Description" />
              <Textarea
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief summary of what this breakdown covers..."
                disabled={isSaving}
                className="resize-none text-xs leading-relaxed"
              />
            </div>
          </div>

          <div className="w-full md:w-56 shrink-0 space-y-2">
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Thumbnail Image</p>
            <ImageInput
              value={formData.thumbnailUrl}
              onUpload={async (file) => { const res = await homeService.uploadFile(file); return res.data; }}
              onChange={(url) => setFormData({ ...formData, thumbnailUrl: url })}
              size="md"
              variant="card"
              disabled={isSaving}
            />
          </div>
        </div>
      </Modal>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow className="bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-800 text-[11px] uppercase tracking-wider font-bold text-zinc-500">
            <TableHead className="w-12 text-center">#</TableHead>
            <TableHead className="w-16">Preview</TableHead>
            <TableHead className="w-2/5">Video Title</TableHead>
            <TableHead className="w-1/5">Category</TableHead>
            <TableHead className="w-24">Views / Time</TableHead>
            <TableHead className="text-right pr-5 w-20">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-xs">
          {paginatedRecords.map((rec, index) => {
            const globalIndex = (currentPage - 1) * pageSize + index + 1;

            return (
              <TableRow key={rec.id} className="group hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                <TableCell className="font-mono text-xs font-semibold text-zinc-400 text-center">
                  {String(globalIndex).padStart(2, "0")}
                </TableCell>
                <TableCell>
                  <div className="w-12 h-8 rounded bg-zinc-100 dark:bg-zinc-800 overflow-hidden relative border border-zinc-200 dark:border-zinc-700">
                    <img src={rec.thumbnailUrl} alt={rec.title} className="w-full h-full object-cover" />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-bold text-zinc-900 dark:text-white text-xs line-clamp-1">{rec.title}</div>
                  <a href={rec.videoUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] text-blue-500 hover:underline flex items-center gap-1 mt-0.5">
                    <FaFacebook className="w-2.5 h-2.5" />
                    <span>Watch Link</span>
                  </a>
                </TableCell>
                <TableCell>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200/50 dark:border-zinc-700/50 uppercase tracking-wider">
                    {rec.category.replace("_", " ")}
                  </span>
                </TableCell>
                <TableCell className="text-xs">
                  <div className="font-semibold text-zinc-900 dark:text-white">{rec.viewCount}</div>
                  <div className="text-zinc-400 text-[10px]">{rec.duration}</div>
                </TableCell>
                <TableCell className="text-right pr-5">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => handleOpenEdit(rec)}
                      className="w-7 h-7 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 flex items-center justify-center transition-colors"
                      title="Edit"
                    >
                      <LuPencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(rec.id)}
                      className="w-7 h-7 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 flex items-center justify-center transition-colors"
                      title="Delete"
                    >
                      <LuTrash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableLayout>
  );
}
