import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { GlobalModal } from "@/components/ui/global-modal";
import { ImageUploader } from "@/components/ui/image-uploader";
import { HeroData } from "@/types/home";
import { homeService } from "@/services/homeService";

interface HeroModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  heroData: HeroData;
  setHeroData: (data: HeroData) => void;
  isSaving: boolean;
  onSave: () => void;
}

export function HeroModal({
  isOpen,
  onOpenChange,
  heroData,
  setHeroData,
  isSaving,
  onSave,
}: HeroModalProps) {
  return (
    <GlobalModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Hero Section"
      description="Update the banner logo, main headline, and introduction text."
      onSave={onSave}
      saveText="Save Hero Changes"
      isLoading={isSaving}
      size="md"
    >
      <div className="space-y-5">
        <ImageUploader
          variant="card"
          size="md"
          label="Logo Image"
          value={heroData.logoUrl}
          onUpload={async (file) => {
            const res = await homeService.uploadFile(file);
            return res.data;
          }}
          onChange={(url) => setHeroData({ ...heroData, logoUrl: url })}
          disabled={isSaving}
          urlPlaceholder="/BusinessBearLogo.png"
        />

        <div className="space-y-2">
          <Label htmlFor="heroTitle">Main Headline</Label>
          <Input
            id="heroTitle"
            value={heroData.title}
            onChange={(e) => setHeroData({ ...heroData, title: e.target.value })}
            placeholder="Welcome to Business Bear"
            disabled={isSaving}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="heroDescription">Introduction Text</Label>
          <Textarea
            id="heroDescription"
            rows={4}
            value={heroData.description}
            onChange={(e) => setHeroData({ ...heroData, description: e.target.value })}
            disabled={isSaving}
          />
        </div>
      </div>
    </GlobalModal>
  );
}
