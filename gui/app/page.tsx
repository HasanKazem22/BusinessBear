"use client";

import { useState, useEffect } from "react";
import { Check, Loader2 } from "lucide-react";
import * as LucideIcons from "lucide-react";

import { homeService } from "@/services/homeService";
import { contactService } from "@/services/contactService";
import { resolveMediaUrl } from "@/lib/api";
import { HeroData, ServiceData, AboutUsData } from "@/types/home";
import { DEFAULT_HERO, DEFAULT_ABOUT, DEFAULT_SERVICES, parseSocialLinks } from "@/lib/constants/homeDefaults";
import { toast } from "react-hot-toast";

export default function Home() {
  const [hero, setHero] = useState<HeroData>(DEFAULT_HERO);
  const [about, setAbout] = useState<AboutUsData>(DEFAULT_ABOUT);
  const [servicesList, setServicesList] = useState<ServiceData[]>(DEFAULT_SERVICES);

  // Contact Form State (matches ContactMessageRequest schema)
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Helper to dynamically render Lucide icons by name string
  const renderServiceIcon = (iconName: string) => {
    const IconComponent = (LucideIcons as any)[iconName || "Code"];
    if (IconComponent) {
      return <IconComponent className="w-8 h-8 text-zinc-950 dark:text-white" />;
    }
    return <LucideIcons.Code className="w-8 h-8 text-zinc-950 dark:text-white" />;
  };

  // Fetch page configuration on mount
  useEffect(() => {
    const fetchPageData = async () => {
      try {
        const [heroRes, aboutRes, servicesRes] = await Promise.all([
          homeService.getHero(),
          homeService.getAboutUs(),
          homeService.getActiveServices()
        ]);

        if (heroRes.success && heroRes.data) {
          setHero(heroRes.data);
        }
        if (aboutRes.success && aboutRes.data) {
          setAbout(aboutRes.data);
        }
        if (servicesRes.success && Array.isArray(servicesRes.data) && servicesRes.data.length > 0) {
          setServicesList(servicesRes.data);
        } else {
          setServicesList(DEFAULT_SERVICES);
        }
      } catch (error) {
        console.error("Failed to load page content from server, using default assets:", error);
        setServicesList(DEFAULT_SERVICES);
      }
    };
    fetchPageData();
  }, []);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name.trim() || !formState.email.trim() || !formState.message.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await contactService.submitMessage({
        name: formState.name,
        email: formState.email,
        phone: formState.phone || undefined,
        message: formState.message,
      });

      if (res.success) {
        setIsSuccess(true);
        toast.success("Your message has been sent successfully!");
        setFormState({
          name: "",
          email: "",
          phone: "",
          message: ""
        });
      } else {
        toast.error(res.message || "Failed to send message.");
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-full overflow-y-auto overflow-x-hidden bg-background dark:bg-[#070709] scroll-smooth font-sans text-zinc-950 dark:text-zinc-100 selection:bg-zinc-950 dark:selection:bg-white selection:text-white dark:selection:text-black transition-colors duration-300 relative">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(0,0,0,0.01),transparent_50%)] dark:bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.03),transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(194,255,61,0.01),transparent_50%)] pointer-events-none" />

      <div className="container mx-auto px-4 pt-4 pb-12 lg:pt-8 lg:pb-16 max-w-5xl relative z-10 flex flex-col gap-12 animate-in fade-in duration-500">

        {/* ================= HERO SECTION ================= */}
        <section id="home" className="flex flex-col items-center text-center scroll-mt-24">
          <div className="relative h-14 md:h-18 w-72 mb-5">
            <img
              src={resolveMediaUrl(hero.logoUrl)}
              alt="Business Bear Logo"
              className="h-full w-full object-contain mx-auto dark:invert dark:hue-rotate-180 transition-all duration-300"
            />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-zinc-950 dark:text-white mb-3">
            {hero.title}
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-base md:text-lg max-w-2xl leading-relaxed font-light">
            {hero.description}
          </p>
        </section>

        {/* ================= SERVICES SECTION ================= */}
        <section id="services" className="scroll-mt-24">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-zinc-950 dark:text-white">
              Our Services
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 mt-2 text-base">What we can do for you</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
            {servicesList.map((service) => (
              <div
                key={service.id}
                className="group p-6 rounded-2xl bg-card border border-zinc-200 dark:border-zinc-800/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-start gap-3"
              >
                <div className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <div className="scale-75">{renderServiceIcon(service.iconName)}</div>
                </div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight">
                  {service.title}
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-snug">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ================= PROFILE / ABOUT SECTION ================= */}
        <section id="about" className="scroll-mt-24">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-zinc-950 dark:text-white">
              About Us
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 mt-2 text-base">Meet the minds behind the magic</p>
          </div>
          <div className="bg-card rounded-3xl p-6 md:p-8 shadow-xl border border-zinc-100 dark:border-zinc-800/80 flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
            <div className="shrink-0 relative w-40 h-40 md:w-48 md:h-48 rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 shadow-inner group border border-zinc-200 dark:border-zinc-800">
              <img
                src={resolveMediaUrl(about.avatarUrl)}
                alt="Profile Avatar"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out grayscale"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 pointer-events-none" />
            </div>
            <div className="flex-1 text-center md:text-left flex flex-col justify-center h-full pt-1">
              <h3 className="text-2xl md:text-3xl font-extrabold text-zinc-900 dark:text-white mb-1.5">
                {about.fullName}
              </h3>
              <p className="text-zinc-500 dark:text-white font-bold tracking-wider uppercase text-[10px] mb-4">
                {about.designation}
              </p>
              <p className="text-zinc-600 dark:text-zinc-300 text-sm leading-relaxed mb-6">
                {about.bio}
              </p>
              <div className="flex items-center justify-center md:justify-start gap-3 flex-wrap">
                {/* Dynamic Social Links */}
                {parseSocialLinks(about.socialLinksJson).map((social, index) => {
                  const IconComp = (LucideIcons as Record<string, any>)[social.iconName] || LucideIcons.Globe;
                  return (
                    <a
                      key={social.id || index}
                      href={social.url || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={social.label || social.iconName}
                      className="text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white transition-all p-2.5 bg-zinc-100 dark:bg-zinc-900 rounded-full hover:scale-110 active:scale-95 duration-200 border border-zinc-200/60 dark:border-zinc-800/60 flex items-center justify-center"
                    >
                      <IconComp className="w-4 h-4" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ================= CONTACT SECTION ================= */}
        <section id="contact" className="scroll-mt-24">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-zinc-950 dark:text-white">
              Let's Work Together
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 mt-2 text-base">Send us a message to get started</p>
          </div>

          <div className="bg-card rounded-3xl p-6 md:p-8 shadow-xl border border-zinc-100 dark:border-zinc-800/80 flex flex-col lg:flex-row gap-8 overflow-hidden transition-colors duration-300 relative">

            {/* Left Side: Contact Information */}
            <div className="lg:w-5/12 flex flex-col gap-8">
              <div>
                <h3 className="text-2xl font-extrabold text-zinc-900 dark:text-white tracking-tight mb-3">
                  Get in touch
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-sm">
                  Have a project in mind or just want to say hi? We'd love to hear from you. Reach out using the form or our direct contact info below.
                </p>
              </div>

              <div className="flex flex-col gap-5 mt-2">
                <div className="flex items-start gap-4 group">
                  <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-zinc-955 dark:group-hover:bg-white transition-all duration-300 text-zinc-900 dark:text-white group-hover:text-white dark:group-hover:text-black shadow-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                  <div className="flex flex-col justify-center h-10">
                    <h4 className="font-bold text-zinc-900 dark:text-white text-sm">Email</h4>
                    <p className="text-zinc-500 dark:text-zinc-400 text-xs mt-0.5">{about.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 group">
                  <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-zinc-955 dark:group-hover:bg-white transition-all duration-300 text-zinc-900 dark:text-white group-hover:text-white dark:group-hover:text-black shadow-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                    </svg>
                  </div>
                  <div className="flex flex-col justify-center h-10">
                    <h4 className="font-bold text-zinc-900 dark:text-white text-sm">Phone</h4>
                    <p className="text-zinc-500 dark:text-zinc-400 text-xs mt-0.5">{about.phone}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 group">
                  <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-zinc-955 dark:group-hover:bg-white transition-all duration-300 text-zinc-900 dark:text-white group-hover:text-white dark:group-hover:text-black shadow-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                  </div>
                  <div className="flex flex-col justify-center h-10">
                    <h4 className="font-bold text-zinc-900 dark:text-white text-sm">Location</h4>
                    <p className="text-zinc-500 dark:text-zinc-400 text-xs mt-0.5">{about.location}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Vertical Divider for desktop */}
            <div className="hidden lg:block w-px bg-zinc-200 dark:bg-zinc-800/60 my-2" />
            {/* Horizontal Divider for mobile */}
            <div className="block lg:hidden h-px w-full bg-zinc-200 dark:bg-zinc-800/60 my-2" />

            {/* Right Side: Form */}
            <div className="lg:w-7/12">
              {isSuccess ? (
                <div className="flex flex-col items-center justify-center h-full py-8 text-center animate-fade-in">
                  <div className="w-16 h-16 rounded-full bg-zinc-955/10 dark:bg-white/10 border border-zinc-955/30 dark:border-white/30 flex items-center justify-center text-zinc-955 dark:text-white mb-5 shadow-lg shadow-zinc-955/5 dark:shadow-white/5">
                    <Check className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">
                    Message Sent!
                  </h3>
                  <p className="text-zinc-600 dark:text-zinc-400 text-sm mt-3 max-w-sm leading-relaxed">
                    Thank you for reaching out. We've received your message and will be in touch shortly.
                  </p>
                  <button
                    onClick={() => setIsSuccess(false)}
                    className="mt-8 text-xs font-semibold text-zinc-800 dark:text-white hover:text-zinc-950 dark:hover:text-zinc-300 transition-colors border border-zinc-200 dark:border-white/30 hover:border-zinc-400 dark:hover:border-white/50 px-6 py-2.5 rounded-full"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-zinc-505 dark:text-zinc-400 uppercase tracking-widest pl-1">
                        Name
                      </label>
                      <input
                        type="text"
                        required
                        value={formState.name}
                        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                        placeholder="Your Name"
                        className="w-full bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/80 rounded-xl px-3.5 py-2.5 text-xs text-zinc-955 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-zinc-955 dark:focus:border-white focus:ring-1 focus:ring-zinc-955/20 dark:focus:ring-white/30 transition-all duration-200"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-zinc-555 dark:text-zinc-400 uppercase tracking-widest pl-1">
                        Email
                      </label>
                      <input
                        type="email"
                        required
                        value={formState.email}
                        onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                        placeholder="hello@example.com"
                        className="w-full bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/80 rounded-xl px-3.5 py-2.5 text-xs text-zinc-955 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-zinc-955 dark:focus:border-white focus:ring-1 focus:ring-zinc-955/20 dark:focus:ring-white/30 transition-all duration-200"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest pl-1">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      value={formState.phone}
                      onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                      placeholder="+1 (555) 000-0000"
                      className="w-full bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/80 rounded-xl px-3.5 py-2.5 text-xs text-zinc-950 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-zinc-950 dark:focus:border-white focus:ring-1 focus:ring-zinc-950/20 dark:focus:ring-white/30 transition-all duration-200"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-555 dark:text-zinc-400 uppercase tracking-widest pl-1">
                      Message
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formState.message}
                      onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                      placeholder="Tell us about your project..."
                      className="w-full bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/80 rounded-xl px-3.5 py-2.5 text-xs text-zinc-955 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-zinc-955 dark:focus:border-white focus:ring-1 focus:ring-zinc-955/20 dark:focus:ring-white/30 transition-all duration-200 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full mt-1 bg-zinc-955 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 disabled:bg-zinc-800/50 dark:disabled:bg-white/50 text-white dark:text-black font-bold py-3 rounded-xl transition-all duration-200 shadow-lg shadow-zinc-955/10 dark:shadow-white/10 active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-3 h-3 animate-spin" />
                        <span className="text-xs">Sending...</span>
                      </>
                    ) : (
                      <span className="text-xs">Send Message</span>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
