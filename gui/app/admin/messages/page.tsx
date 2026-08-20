"use client";

import { useState, useEffect } from "react";
import {
  Mail,
  Search,
  Filter,
  RefreshCw,
  Clock,
  User,
  CheckCircle2,
  AlertCircle,
  Archive,
  Eye,
  Loader2,
  ChevronLeft,
  ChevronRight,
  MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GlobalModal } from "@/components/ui/global-modal";
import { toast } from "react-hot-toast";
import { contactService, ContactMessageResponse, InquiryStatus } from "@/services/contactService";
import { cn } from "@/lib/utils";

const STATUS_CONFIG: Record<InquiryStatus, { label: string; color: string }> = {
  NEW: { label: "New", color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20" },
  READ: { label: "Read", color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20" },
  IN_PROGRESS: { label: "In Progress", color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20" },
  COMPLETED: { label: "Completed", color: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20" },
  ARCHIVED: { label: "Archived", color: "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20" },
};

export default function MessagesAdminPage() {
  const [messages, setMessages] = useState<ContactMessageResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeStatus, setActiveStatus] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessageResponse | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<number | null>(null);

  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      const res = await contactService.getAllMessages(activeStatus, page, 10);
      if (res.success && res.data) {
        setMessages(res.data.content || []);
        setTotalPages(res.data.totalPages || 1);
        setTotalElements(res.data.totalElements || 0);
      }
    } catch (err: any) {
      toast.error("Failed to load contact messages");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [activeStatus, page]);

  const handleUpdateStatus = async (id: number, newStatus: InquiryStatus) => {
    setIsUpdatingStatus(id);
    try {
      const res = await contactService.updateStatus(id, newStatus);
      if (res.success) {
        toast.success(`Message marked as ${STATUS_CONFIG[newStatus].label}`);
        setMessages((prev) =>
          prev.map((msg) => (msg.id === id ? { ...msg, status: newStatus } : msg))
        );
        if (selectedMessage && selectedMessage.id === id) {
          setSelectedMessage((prev) => (prev ? { ...prev, status: newStatus } : null));
        }
      }
    } catch (err: any) {
      toast.error("Failed to update status");
    } finally {
      setIsUpdatingStatus(null);
    }
  };

  const handleOpenMessage = (msg: ContactMessageResponse) => {
    setSelectedMessage(msg);
    // Automatically mark NEW messages as READ when opened
    if (msg.status === "NEW") {
      handleUpdateStatus(msg.id, "READ");
    }
  };

  // Client side search filter
  const filteredMessages = messages.filter((msg) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      msg.name.toLowerCase().includes(term) ||
      msg.email.toLowerCase().includes(term) ||
      msg.message.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white flex items-center gap-2">
            <Mail className="w-6 h-6 text-zinc-700 dark:text-zinc-300" />
            Contact Messages & Inquiries
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Manage and respond to messages submitted from your public website contact form.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchMessages}
          disabled={isLoading}
          className="self-start sm:self-auto gap-1.5 text-xs font-semibold"
        >
          <RefreshCw className={cn("w-3.5 h-3.5", isLoading && "animate-spin")} />
          Refresh
        </Button>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-zinc-50/50 dark:bg-zinc-900/50 p-3 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80">
        {/* Status Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {["ALL", "NEW", "READ", "IN_PROGRESS", "COMPLETED", "ARCHIVED"].map((st) => {
            const isActive = activeStatus === st;
            return (
              <button
                key={st}
                onClick={() => {
                  setActiveStatus(st);
                  setPage(0);
                }}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap",
                  isActive
                    ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-sm"
                    : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200/60 dark:hover:bg-zinc-800/60"
                )}
              >
                {st === "ALL" ? "All Messages" : STATUS_CONFIG[st as InquiryStatus]?.label || st}
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-64 shrink-0">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <Input
            placeholder="Search sender or message..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 h-8 text-xs bg-white dark:bg-zinc-900"
          />
        </div>
      </div>

      {/* Messages List / Table */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl">
          <Loader2 className="w-8 h-8 text-zinc-400 animate-spin mb-2" />
          <p className="text-xs text-zinc-500 font-medium">Loading messages...</p>
        </div>
      ) : filteredMessages.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl">
          <MessageSquare className="w-10 h-10 text-zinc-300 dark:text-zinc-700 mb-2" />
          <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">No messages found</p>
          <p className="text-xs text-zinc-400 mt-1">
            {searchTerm ? "Try broadening your search term." : "No inquiry messages have been received yet."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl overflow-hidden bg-white dark:bg-zinc-900 shadow-sm">
            <div className="divide-y divide-zinc-200/60 dark:divide-zinc-800/60">
              {filteredMessages.map((msg) => {
                const statusCfg = STATUS_CONFIG[msg.status] || STATUS_CONFIG.NEW;
                const formattedDate = new Date(msg.createdAt).toLocaleString(undefined, {
                  dateStyle: "medium",
                  timeStyle: "short",
                });

                return (
                  <div
                    key={msg.id}
                    onClick={() => handleOpenMessage(msg)}
                    className={cn(
                      "p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-all cursor-pointer group",
                      msg.status === "NEW" && "bg-emerald-500/[0.02] dark:bg-emerald-500/[0.03]"
                    )}
                  >
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      <div className="w-9 h-9 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-700 dark:text-zinc-300 shrink-0 font-bold text-xs uppercase">
                        {msg.name.substring(0, 2)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold text-zinc-900 dark:text-white">
                            {msg.name}
                          </span>
                          <span className="text-[11px] text-zinc-400 font-mono">
                            &lt;{msg.email}&gt;
                          </span>
                          <span
                            className={cn(
                              "text-[10px] font-bold px-2 py-0.5 rounded-full border",
                              statusCfg.color
                            )}
                          >
                            {statusCfg.label}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-600 dark:text-zinc-400 truncate mt-1">
                          {msg.message}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                      <span className="text-[10px] text-zinc-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formattedDate}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenMessage(msg);
                        }}
                        className="h-7 text-xs px-2.5 font-medium gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" /> View
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-zinc-500">
                Showing page {page + 1} of {totalPages} ({totalElements} total)
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 0 || isLoading}
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  className="h-7 text-xs gap-1"
                >
                  <ChevronLeft className="w-3.5 h-3.5" /> Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page + 1 >= totalPages || isLoading}
                  onClick={() => setPage((p) => p + 1)}
                  className="h-7 text-xs gap-1"
                >
                  Next <ChevronRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Detail Modal */}
      {selectedMessage && (
        <GlobalModal
          isOpen={!!selectedMessage}
          onOpenChange={(open) => !open && setSelectedMessage(null)}
          title="Inquiry Details"
          description={`Received on ${new Date(selectedMessage.createdAt).toLocaleString()}`}
          onSave={() => setSelectedMessage(null)}
          saveText="Close"
          size="lg"
        >
          <div className="space-y-5">
            {/* Sender Meta Card */}
            <div className="p-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2.5">
                  <User className="w-4 h-4 text-zinc-400" />
                  <span className="text-xs font-bold text-zinc-900 dark:text-white">
                    {selectedMessage.name}
                  </span>
                </div>
                <span
                  className={cn(
                    "text-[10px] font-bold px-2 py-0.5 rounded-full border",
                    STATUS_CONFIG[selectedMessage.status]?.color
                  )}
                >
                  {STATUS_CONFIG[selectedMessage.status]?.label}
                </span>
              </div>

              <div className="text-xs text-zinc-600 dark:text-zinc-400 space-y-1">
                <p>
                  <strong className="text-zinc-700 dark:text-zinc-300">Email:</strong>{" "}
                  <a
                    href={`mailto:${selectedMessage.email}`}
                    className="underline text-blue-600 dark:text-blue-400"
                  >
                    {selectedMessage.email}
                  </a>
                </p>
                {selectedMessage.phone && (
                  <p>
                    <strong className="text-zinc-700 dark:text-zinc-300">Phone:</strong>{" "}
                    {selectedMessage.phone}
                  </p>
                )}
              </div>
            </div>

            {/* Message Content */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                Message Content
              </label>
              <div className="p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap leading-relaxed min-h-[120px]">
                {selectedMessage.message}
              </div>
            </div>

            {/* Quick Status Action Controls */}
            <div className="space-y-2 pt-2 border-t border-zinc-200/60 dark:border-zinc-800/60">
              <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                Update Status
              </label>
              <div className="flex flex-wrap gap-2">
                {(["NEW", "READ", "IN_PROGRESS", "COMPLETED", "ARCHIVED"] as InquiryStatus[]).map((st) => (
                  <Button
                    key={st}
                    variant={selectedMessage.status === st ? "default" : "outline"}
                    size="sm"
                    disabled={isUpdatingStatus === selectedMessage.id}
                    onClick={() => handleUpdateStatus(selectedMessage.id, st)}
                    className="h-7 text-xs font-semibold"
                  >
                    {isUpdatingStatus === selectedMessage.id && selectedMessage.status === st ? (
                      <Loader2 className="w-3 h-3 animate-spin mr-1" />
                    ) : null}
                    {STATUS_CONFIG[st].label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </GlobalModal>
      )}
    </div>
  );
}
