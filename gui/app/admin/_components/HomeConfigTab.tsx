"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Save, Plus, Pencil, Trash2 } from "lucide-react";
import { GlobalModal } from "@/components/ui/global-modal";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type ServiceData = {
  id: number;
  title: string;
  description: string;
  iconName: string;
};

const initialServices: ServiceData[] = [
  { id: 1, title: "Web Development", description: "Building robust, scalable, and responsive web applications.", iconName: "Code" },
  { id: 2, title: "UI/UX Design", description: "Crafting intuitive and engaging user experiences.", iconName: "Palette" },
  { id: 3, title: "Mobile App Development", description: "Developing cross-platform mobile applications.", iconName: "Smartphone" },
];

export function HomeConfigTab() {
  const [formData, setFormData] = useState({
    // Hero
    heroDescription: "Welcome to our digital agency where innovation meets aesthetics. We specialize in transforming complex challenges into elegant, robust, and intuitive software solutions. Partner with us to elevate your brand's digital presence and build scalable products that your users will love.",
    heroImageUrl: "/BusinessBearLogo.png",
    
    // Services Section
    servicesTitle: "Our Services",
    servicesSubtitle: "What we can do for you",

    // About Section
    aboutTitle: "About Us",
    aboutSubtitle: "Meet the minds behind the magic",
    aboutName: "Hasibul Hasan",
    aboutRole: "Lead Software Engineer & Designer",
    aboutBio: "With over a decade of experience in software architecture and interactive design, I focus on bridging the gap between engineering and art. My mission is to build digital products that are not only extremely performant and scalable but also deeply engaging and visually breathtaking.",
    aboutImageUrl: "/ProfilePicture.png",

    // Contact Section
    contactTitle: "Let's Work Together",
    contactSubtitle: "Send us a message to get started",
    contactEmail: "hello@businessbear.com",
    contactPhone: "+1 (555) 123-4567",
    contactLocation: "123 Innovation Drive, NY"
  });

  // Services State
  const [services, setServices] = useState<ServiceData[]>(initialServices);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [serviceFormData, setServiceFormData] = useState<Partial<ServiceData>>({ title: "", description: "", iconName: "" });
  const [editingServiceId, setEditingServiceId] = useState<number | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveSection = (section: string) => {
    alert(`Saved ${section} successfully! (Mock)`);
  };

  // Service Modal Handlers
  const handleOpenNewService = () => {
    setEditingServiceId(null);
    setServiceFormData({ title: "", description: "", iconName: "" });
    setIsServiceModalOpen(true);
  };

  const handleOpenEditService = (service: ServiceData) => {
    setEditingServiceId(service.id);
    setServiceFormData(service);
    setIsServiceModalOpen(true);
  };

  const handleDeleteService = (id: number) => {
    if (confirm("Are you sure you want to delete this service?")) {
      setServices(services.filter(s => s.id !== id));
    }
  };

  const handleSaveService = () => {
    if (editingServiceId) {
      setServices(services.map(s => s.id === editingServiceId ? { ...s, ...serviceFormData } as ServiceData : s));
    } else {
      setServices([...services, { ...serviceFormData, id: Date.now() } as ServiceData]);
    }
    setIsServiceModalOpen(false);
  };

  return (
    <div className="space-y-6 mt-4 pb-8">
      
      {/* 1. Hero Section */}
      <Card className="shadow-none border border-zinc-200/60 dark:border-zinc-800/60">
        <CardHeader>
          <CardTitle>Hero Section</CardTitle>
          <CardDescription>Update the main introduction text and logo image.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="heroImageUrl">Hero Image / Logo URL</Label>
            <div className="flex gap-2">
              <Input id="heroImageUrl" name="heroImageUrl" value={formData.heroImageUrl} onChange={handleChange} placeholder="https://..." />
              <Button variant="outline">Upload</Button>
            </div>
            <p className="text-xs text-muted-foreground">Upload a new image or paste a URL.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="heroDescription">Main Description</Label>
            <Textarea id="heroDescription" name="heroDescription" rows={4} value={formData.heroDescription} onChange={handleChange} />
          </div>
          <Button onClick={() => handleSaveSection("Hero Section")} className="w-full sm:w-auto">
            <Save className="h-4 w-4 mr-2" /> Save Hero Section
          </Button>
        </CardContent>
      </Card>

      {/* 2. Services Section */}
      <Card className="shadow-none border border-zinc-200/60 dark:border-zinc-800/60">
        <CardHeader>
          <CardTitle>Services Section</CardTitle>
          <CardDescription>Manage the services header and individual service cards.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="servicesTitle">Section Title</Label>
              <Input id="servicesTitle" name="servicesTitle" value={formData.servicesTitle} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="servicesSubtitle">Section Subtitle</Label>
              <Input id="servicesSubtitle" name="servicesSubtitle" value={formData.servicesSubtitle} onChange={handleChange} />
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-4 mt-6 border-t border-border pt-6">
              <h3 className="text-sm font-semibold">Service Cards</h3>
              <Button size="sm" onClick={handleOpenNewService}>
                <Plus className="h-4 w-4 mr-2" /> Add Service
              </Button>
            </div>
            <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden bg-card">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Icon</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {services.map((service) => (
                    <TableRow key={service.id}>
                      <TableCell className="font-mono text-xs">{service.iconName}</TableCell>
                      <TableCell className="font-medium">{service.title}</TableCell>
                      <TableCell className="truncate max-w-[200px] text-xs text-muted-foreground">{service.description}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" onClick={() => handleOpenEditService(service)}>
                            <Pencil className="h-4 w-4 text-blue-500" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteService(service.id)}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {services.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground py-6">
                        No services found. Add one!
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
          <Button onClick={() => handleSaveSection("Services Section")} className="w-full sm:w-auto">
            <Save className="h-4 w-4 mr-2" /> Save Service Settings
          </Button>
        </CardContent>
      </Card>

      {/* Global Modal for Service Cards */}
      <GlobalModal
        isOpen={isServiceModalOpen}
        onOpenChange={setIsServiceModalOpen}
        title={editingServiceId ? "Edit Service" : "Add New Service"}
        description="Configure your service card details."
        onSave={handleSaveService}
      >
        <div className="grid gap-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">Title</Label>
            <Input id="title" value={serviceFormData.title} onChange={(e) => setServiceFormData({ ...serviceFormData, title: e.target.value })} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="description" className="text-right mt-3">Description</Label>
            <Textarea id="description" rows={3} value={serviceFormData.description} onChange={(e) => setServiceFormData({ ...serviceFormData, description: e.target.value })} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="iconName" className="text-right">Icon Name</Label>
            <Input id="iconName" value={serviceFormData.iconName} onChange={(e) => setServiceFormData({ ...serviceFormData, iconName: e.target.value })} className="col-span-3" placeholder="e.g. Palette, Code" />
          </div>
        </div>
      </GlobalModal>

      {/* 3. About Us Section */}
      <Card className="shadow-none border border-zinc-200/60 dark:border-zinc-800/60">
        <CardHeader>
          <CardTitle>About Section</CardTitle>
          <CardDescription>Manage the profile bio, headers, and image.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="aboutImageUrl">Profile Picture URL</Label>
            <div className="flex gap-2">
              <Input id="aboutImageUrl" name="aboutImageUrl" value={formData.aboutImageUrl} onChange={handleChange} placeholder="https://..." />
              <Button variant="outline">Upload</Button>
            </div>
            <p className="text-xs text-muted-foreground">Upload a new profile photo or paste a URL.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-border pt-4 mt-2">
            <div className="space-y-2">
              <Label htmlFor="aboutTitle">Section Title</Label>
              <Input id="aboutTitle" name="aboutTitle" value={formData.aboutTitle} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="aboutSubtitle">Section Subtitle</Label>
              <Input id="aboutSubtitle" name="aboutSubtitle" value={formData.aboutSubtitle} onChange={handleChange} />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-border pt-4 mt-2">
            <div className="space-y-2">
              <Label htmlFor="aboutName">Profile Name</Label>
              <Input id="aboutName" name="aboutName" value={formData.aboutName} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="aboutRole">Role / Title</Label>
              <Input id="aboutRole" name="aboutRole" value={formData.aboutRole} onChange={handleChange} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="aboutBio">Biography</Label>
            <Textarea id="aboutBio" name="aboutBio" rows={4} value={formData.aboutBio} onChange={handleChange} />
          </div>
          <Button onClick={() => handleSaveSection("About Info")} className="w-full sm:w-auto">
            <Save className="h-4 w-4 mr-2" /> Save About Info
          </Button>
        </CardContent>
      </Card>

      {/* 4. Contact Section */}
      <Card className="shadow-none border border-zinc-200/60 dark:border-zinc-800/60">
        <CardHeader>
          <CardTitle>Contact Section</CardTitle>
          <CardDescription>Update headers and official contact details.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contactTitle">Section Title</Label>
              <Input id="contactTitle" name="contactTitle" value={formData.contactTitle} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactSubtitle">Section Subtitle</Label>
              <Input id="contactSubtitle" name="contactSubtitle" value={formData.contactSubtitle} onChange={handleChange} />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-border pt-4 mt-2">
            <div className="space-y-2">
              <Label htmlFor="contactEmail">Email Address</Label>
              <Input id="contactEmail" name="contactEmail" type="email" value={formData.contactEmail} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactPhone">Phone Number</Label>
              <Input id="contactPhone" name="contactPhone" value={formData.contactPhone} onChange={handleChange} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="contactLocation">Location</Label>
            <Input id="contactLocation" name="contactLocation" value={formData.contactLocation} onChange={handleChange} />
          </div>
          <Button onClick={() => handleSaveSection("Contact Info")} className="w-full sm:w-auto">
            <Save className="h-4 w-4 mr-2" /> Save Contact Info
          </Button>
        </CardContent>
      </Card>

    </div>
  );
}
