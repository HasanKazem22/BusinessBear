"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Globe } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { GlobalModal } from "@/components/ui/global-modal";
import { ImageUploader } from "@/components/ui/image-uploader";
import { AboutUsData, SocialLinkItem } from "@/types/home";
import { homeService } from "@/services/homeService";
import {
  AVAILABLE_SOCIAL_ICONS,
  parseSocialLinks,
  stringifySocialLinks,
} from "@/lib/constants/homeDefaults";

function DynamicSocialIcon({ name, className }: { name: string; className?: string }) {
  const IconComponent = (LucideIcons as Record<string, any>)[name] || Globe;
  return <IconComponent className={className} />;
}

interface AboutModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  aboutData: AboutUsData;
  setAboutData: (data: AboutUsData) => void;
  isSaving: boolean;
  onSave: () => void;
}

export function AboutModal({
  isOpen,
  onOpenChange,
  aboutData,
  setAboutData,
  isSaving,
  onSave,
}: AboutModalProps) {
  // Parse social links from aboutData.socialLinksJson
  const socialLinks: SocialLinkItem[] = parseSocialLinks(aboutData.socialLinksJson);

  const updateSocialLinks = (newLinks: SocialLinkItem[]) => {
    setAboutData({
      ...aboutData,
      socialLinksJson: stringifySocialLinks(newLinks),
    });
  };

  const handleAddSocialLink = () => {
    const newLink: SocialLinkItem = {
      id: Date.now().toString(),
      iconName: "Twitter",
      url: "",
      label: "Twitter / X",
    };
    updateSocialLinks([...socialLinks, newLink]);
  };

  const handleUpdateItem = (id: string, field: "iconName" | "url", value: string) => {
    const updated = socialLinks.map((item) => {
      if (item.id === id) {
        if (field === "iconName") {
          const opt = AVAILABLE_SOCIAL_ICONS.find((o) => o.name === value);
          return {
            ...item,
            iconName: value,
            label: opt?.label || value,
          };
        }
        return { ...item, [field]: value };
      }
      return item;
    });
    updateSocialLinks(updated);
  };

  const handleDeleteItem = (id: string) => {
    updateSocialLinks(socialLinks.filter((item) => item.id !== id));
  };

  return (
    <GlobalModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="About Us & Social Profiles"
      description="Update profile avatar, name, designation, biography, and social links."
      onSave={onSave}
      saveText="Save Profile"
      isLoading={isSaving}
      size="md"
    >
      <div className="space-y-5">
        <ImageUploader
          variant="card"
          size="md"
          label="Profile Avatar"
          value={aboutData.avatarUrl}
          onUpload={async (file) => {
            const res = await homeService.uploadFile(file);
            return res.data;
          }}
          onChange={(url) => setAboutData({ ...aboutData, avatarUrl: url })}
          disabled={isSaving}
          urlPlaceholder="/ProfilePicture.png"
        />

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              value={aboutData.fullName}
              onChange={(e) => setAboutData({ ...aboutData, fullName: e.target.value })}
              disabled={isSaving}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="designation">Role / Designation</Label>
            <Input
              id="designation"
              value={aboutData.designation}
              onChange={(e) => setAboutData({ ...aboutData, designation: e.target.value })}
              disabled={isSaving}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">Biography</Label>
          <Textarea
            id="bio"
            rows={3}
            value={aboutData.bio}
            onChange={(e) => setAboutData({ ...aboutData, bio: e.target.value })}
            disabled={isSaving}
          />
        </div>

        {/* ── Social Links Management ── */}
        <div className="space-y-3 pt-3 border-t border-zinc-200/80 dark:border-zinc-800/80">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-xs font-bold">Social Links & Contact Profiles</Label>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                Select an icon and add profile URL / contact link (Email, Phone, Twitter, LinkedIn, etc.)
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddSocialLink}
              disabled={isSaving}
              className="h-7 text-xs font-semibold gap-1 shrink-0"
            >
              <Plus className="w-3.5 h-3.5" /> Add Link
            </Button>
          </div>

          {socialLinks.length === 0 ? (
            <p className="text-xs text-zinc-400 text-center py-4 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl">
              No social links added yet. Click "Add Link" to add social/contact profiles.
            </p>
          ) : (
            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              {socialLinks.map((item) => {
                const currentOpt = AVAILABLE_SOCIAL_ICONS.find((o) => o.name === item.iconName);
                return (
                  <div
                    key={item.id}
                    className="flex items-center gap-2 p-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl"
                  >
                    {/* Icon Preview */}
                    <div className="w-8 h-8 rounded-lg bg-zinc-200/80 dark:bg-zinc-800 flex items-center justify-center shrink-0 text-zinc-700 dark:text-zinc-300">
                      <DynamicSocialIcon name={item.iconName} className="w-4 h-4" />
                    </div>

                    {/* Icon Selection Dropdown */}
                    <select
                      value={item.iconName}
                      onChange={(e) => handleUpdateItem(item.id, "iconName", e.target.value)}
                      disabled={isSaving}
                      className="h-8 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-2 text-xs font-medium text-zinc-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-zinc-400 shrink-0 cursor-pointer"
                    >
                      {AVAILABLE_SOCIAL_ICONS.map((opt) => (
                        <option key={opt.name} value={opt.name}>
                          {opt.label}
                        </option>
                      ))}
                    </select>

                    {/* Link URL / Input */}
                    <Input
                      value={item.url}
                      onChange={(e) => handleUpdateItem(item.id, "url", e.target.value)}
                      placeholder={currentOpt?.placeholder || "https://..."}
                      disabled={isSaving}
                      className="h-8 text-xs font-mono flex-1 min-w-0"
                    />

                    {/* Delete Button */}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteItem(item.id)}
                      disabled={isSaving}
                      className="h-7 w-7 text-zinc-400 hover:text-red-500 dark:hover:text-red-400 shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </GlobalModal>
  );
}
