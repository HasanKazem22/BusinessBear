"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface GlobalModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  onSave: () => void;
  children: React.ReactNode;
  saveText?: string;
}

export function GlobalModal({
  isOpen,
  onOpenChange,
  title,
  description,
  onSave,
  children,
  saveText = "Save changes",
}: GlobalModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div className="py-4">
          {children}
        </div>
        <div className="flex justify-end">
          <Button onClick={onSave}>{saveText}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
