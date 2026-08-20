import Link from "next/link";
import { Mail, ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { GlobalModal } from "@/components/ui/global-modal";

interface ContactData {
  email: string;
  phone: string;
  location: string;
}

interface ContactModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  contactData: ContactData;
  setContactData: (data: ContactData) => void;
  isSaving: boolean;
  onSave: () => void;
}

export function ContactModal({
  isOpen,
  onOpenChange,
  contactData,
  setContactData,
  isSaving,
  onSave,
}: ContactModalProps) {
  return (
    <GlobalModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Contact Us"
      description="Update official contact email, phone, and office address."
      onSave={onSave}
      saveText="Save Contact Info"
      isLoading={isSaving}
      size="sm"
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="contactEmail">Email Address</Label>
          <Input
            id="contactEmail"
            type="email"
            value={contactData.email}
            onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
            disabled={isSaving}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contactPhone">Phone Number</Label>
          <Input
            id="contactPhone"
            value={contactData.phone}
            onChange={(e) => setContactData({ ...contactData, phone: e.target.value })}
            disabled={isSaving}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contactLocation">Office Address</Label>
          <Input
            id="contactLocation"
            value={contactData.location}
            onChange={(e) => setContactData({ ...contactData, location: e.target.value })}
            disabled={isSaving}
          />
        </div>

        {/* Quick Inbox Link */}
        <div className="pt-3 border-t border-zinc-200/80 dark:border-zinc-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-emerald-500 shrink-0" />
            <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Form Submissions
            </span>
          </div>
          <Link href="/admin/messages" onClick={() => onOpenChange(false)}>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-7 text-[11px] font-semibold gap-1"
            >
              Open Inbox <ExternalLink className="w-3 h-3" />
            </Button>
          </Link>
        </div>
      </div>
    </GlobalModal>
  );
}
