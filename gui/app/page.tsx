"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  Flame,
  Layers,
  Layout,
  ArrowUpRight,
  Check,
  Loader2,
  Sparkles,
  Cpu,
  Monitor,
  Laptop
} from "lucide-react";

// Define the section types for scroll tracking
type SectionId = "home" | "projects" | "experience" | "contact";

interface Project {
  id: string;
  title: string;
  category: string;
  colorClass: string;
  previewBg: string;
  icon: React.ReactNode;
}

interface Experience {
  id: string;
  role: string;
  company: string;
  duration: string;
  description: string;
}

export default function Home() {
  const [activeSection, setActiveSection] = useState<SectionId>("home");
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    budget: "Select Budget...",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // References for scroll tracking
  const homeRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  const experienceRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  // Dynamic card status based on active section
  const getCardStatus = () => {
    switch (activeSection) {
      case "home":
        return "A Software Engineer who has developed countless innovative solutions.";
      case "projects":
        return "Designing and developing robust, award-winning web applications.";
      case "experience":
        return "Delivering high-quality code and leading development for 12+ years.";
      case "contact":
        return "Let's build something amazing together! Get in touch below.";
      default:
        return "A Software Engineer who has developed countless innovative solutions.";
    }
  };

  useEffect(() => {
    const sections = [
      { id: "home", ref: homeRef },
      { id: "projects", ref: projectsRef },
      { id: "experience", ref: experienceRef },
      { id: "contact", ref: contactRef }
    ];

    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -60% 0px", // Trigger when section occupies the middle of the viewport
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id as SectionId);
        }
      });
    }, observerOptions);

    sections.forEach((section) => {
      if (section.ref.current) {
        observer.observe(section.ref.current);
      }
    });

    return () => {
      sections.forEach((section) => {
        if (section.ref.current) {
          observer.unobserve(section.ref.current);
        }
      });
    };
  }, []);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.email || !formState.message) {
      alert("Please fill in all fields.");
      return;
    }
    setIsSubmitting(true);
    // Simulate API request
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setFormState({
        name: "",
        email: "",
        budget: "Select Budget...",
        message: ""
      });
    }, 1500);
  };

  const projects: Project[] = [
    {
      id: "majd",
      title: "Majd",
      category: "Free Portfolio Template",
      colorClass: "border-red-500/20 dark:border-red-500/20 bg-red-500/5 dark:bg-red-950/10 hover:border-red-500/40",
      previewBg: "bg-gradient-to-tr from-red-600 to-amber-500",
      icon: <Laptop className="w-8 h-8 text-white" />
    },
    {
      id: "najmai",
      title: "NajmAI",
      category: "SaaS Framer Template",
      colorClass: "border-purple-500/20 dark:border-purple-500/20 bg-purple-500/5 dark:bg-purple-950/10 hover:border-purple-500/40",
      previewBg: "bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500",
      icon: <Sparkles className="w-8 h-8 text-white" />
    },
    {
      id: "damas",
      title: "Damas",
      category: "Free Framer Template",
      colorClass: "border-emerald-500/20 dark:border-emerald-500/20 bg-emerald-500/5 dark:bg-emerald-950/10 hover:border-emerald-500/40",
      previewBg: "bg-gradient-to-tr from-emerald-500 to-cyan-500",
      icon: <Cpu className="w-8 h-8 text-white" />
    }
  ];

  const experiences: Experience[] = [
    {
      id: "exp1",
      role: "Lead Software Architect",
      company: "PixelForge Studios",
      duration: "Jan 2020 - Present",
      description: "Led the design team in creating user-centric mobile and web applications, improving the user experience and increasing user engagement by 40% across key products."
    },
    {
      id: "exp2",
      role: "Senior Full Stack Engineer",
      company: "BlueWave Innovators",
      duration: "Jun 2017 - Dec 2019",
      description: "Developed and implemented design strategies for new product lines, collaborated closely with engineers and product managers to launch 10+ high-traffic web applications."
    },
    {
      id: "exp3",
      role: "UI Engineer & Consultant",
      company: "TrendCraft Solutions",
      duration: "Jun 2014 - May 2017",
      description: "Designed user interfaces for e-commerce platforms, focusing on enhancing usability and visual appeal. Optimized React bundles resulting in a 30% reduction in page load times."
    }
  ];

  return (
    <div className="h-full overflow-y-auto bg-background dark:bg-[#070709] scroll-smooth font-sans text-zinc-950 dark:text-zinc-100 selection:bg-zinc-950 dark:selection:bg-[#25D379] selection:text-white dark:selection:text-black transition-colors duration-300">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(0,0,0,0.01),transparent_50%)] dark:bg-[radial-gradient(ellipse_at_top_right,rgba(37,211,121,0.03),transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(194,255,61,0.01),transparent_50%)] pointer-events-none" />

      <div className="container mx-auto px-4 py-8 lg:py-12 max-w-7xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-12 lg:gap-16 xl:gap-24 items-start">

          {/* ================= LEFT COLUMN: STICKY CARD ================= */}
          <div className="lg:sticky lg:top-8 w-full flex justify-center">
            <div className="relative w-full max-w-[380px] bg-card rounded-[32px] p-6 shadow-2xl border border-zinc-100 dark:border-zinc-800/80 flex flex-col items-center text-zinc-950 dark:text-zinc-50 overflow-hidden min-h-[600px] justify-between transition-colors duration-300">

              {/* SVG Dashed Decorative Line */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 380 620" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Top-left dashed circle */}
                <circle cx="20" cy="20" r="70" strokeWidth="1.5" strokeDasharray="5 5" className="opacity-20 stroke-zinc-400 dark:stroke-[#25D379]" />
                <circle cx="20" cy="20" r="90" strokeWidth="1.5" strokeDasharray="5 5" className="opacity-10 stroke-zinc-400 dark:stroke-[#25D379]" />

                {/* Winding dashed curve passing through the center flame circle */}
                <path
                  d="M 20 90 C 80 140, 160 120, 190 280 C 210 390, 140 400, 190 470 C 220 510, 180 570, 40 540"
                  strokeWidth="1.5"
                  strokeDasharray="6 6"
                  className="opacity-25 stroke-zinc-400 dark:stroke-[#25D379]"
                />
              </svg>

              {/* Card Header: Avatar */}
              <div className="relative w-full aspect-square rounded-[24px] overflow-hidden bg-zinc-900 dark:bg-[#25D379] group shadow-inner">
                {/* The avatar image file */}
                <Image
                  src="/avatar.png"
                  alt="Hasibul Hasan Avatar"
                  width={380}
                  height={380}
                  className="w-full h-full object-cover grayscale contrast-125 brightness-95 group-hover:scale-105 transition-transform duration-700 ease-out mix-blend-luminosity"
                  priority
                />
                {/* Colored overlay shadow */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 pointer-events-none" />
              </div>

              {/* Developer Info */}
              <div className="w-full flex flex-col items-center mt-6 text-center z-10">
                <h1 className="text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50">
                  Hasibul Hasan
                </h1>

                {/* Animated Flame Button Area */}
                <div className="my-6 relative flex items-center justify-center">
                  <div className="absolute w-12 h-12 rounded-full bg-zinc-950/20 dark:bg-[#25D379]/20 animate-ping duration-1000" />
                  <div className="relative z-10 w-10 h-10 rounded-full bg-zinc-950 dark:bg-[#25D379] flex items-center justify-center text-white dark:text-black shadow-lg shadow-zinc-950/20 dark:shadow-[#25D379]/40 hover:scale-110 active:scale-95 transition-transform cursor-pointer">
                    <Flame className="w-5 h-5 fill-current" />
                  </div>
                </div>

                {/* Description - DYNAMIC! */}
                <div className="min-h-[64px] flex items-center justify-center px-2">
                  <p className="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400 font-medium transition-all duration-300">
                    {getCardStatus()}
                  </p>
                </div>
              </div>

              {/* Card Footer: Social Icons */}
              <div className="w-full flex justify-center gap-6 mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800 z-10">
                {[
                  {
                    icon: (
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="2" y1="12" x2="22" y2="12" />
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                      </svg>
                    ),
                    href: "#"
                  },
                  {
                    icon: (
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    ),
                    href: "#"
                  },
                  {
                    icon: (
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                      </svg>
                    ),
                    href: "#"
                  },
                  {
                    icon: (
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
                        <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
                      </svg>
                    ),
                    href: "#"
                  }
                ].map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className="text-zinc-600 hover:text-zinc-950 dark:text-[#25D379] dark:hover:text-[#1db868] transition-colors p-2 hover:bg-zinc-100 dark:hover:bg-[#25D379]/10 rounded-full hover:scale-110 active:scale-95 duration-200"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>

            </div>
          </div>

          {/* ================= RIGHT COLUMN: SCROLLING SECTIONS ================= */}
          <div className="space-y-24 lg:space-y-36 pb-24">

            {/* ------------ SECTION 1: HERO & STATS ------------ */}
            <div id="home" ref={homeRef} className="scroll-mt-20 flex flex-col justify-center min-h-[80vh]">
              <div className="relative">
                {/* Double Text Title */}
                <h2 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-zinc-950 dark:text-white uppercase select-none">
                  SOFTWARE
                </h2>
                <h2 className="text-7xl md:text-[6.5rem] font-extrabold text-transparent text-outline uppercase tracking-wide leading-none select-none mt-[-10px] md:mt-[-25px] font-sans">
                  ENGINEER
                </h2>
              </div>

              <p className="text-zinc-600 dark:text-zinc-400 text-lg md:text-xl max-w-2xl mt-8 leading-relaxed font-light">
                Passionate about creating intuitive and engaging user experiences. Specialize in transforming ideas into beautifully crafted products that blend robust technology with breathtaking interactive aesthetics.
              </p>

              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-4 md:gap-8 mt-12 md:mt-16 py-8 border-y border-zinc-200 dark:border-zinc-900/60">
                {[
                  { value: "+12", label: "YEARS OF EXPERIENCE" },
                  { value: "+46", label: "PROJECTS COMPLETED" },
                  { value: "+20", label: "WORLDWIDE CLIENTS" }
                ].map((stat, i) => (
                  <div key={i} className="flex flex-col">
                    <span className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-zinc-950 dark:text-white">
                      {stat.value}
                    </span>
                    <span className="text-[10px] md:text-xs font-bold tracking-wider text-zinc-500 dark:text-zinc-400 mt-2 uppercase">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Lower Specialty Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                {/* Orange Card */}
                <div className="group relative bg-[#ef562f] rounded-[24px] p-8 flex flex-col justify-between min-h-[200px] text-white hover:scale-[1.02] active:scale-[0.99] transition-all duration-300 cursor-pointer shadow-lg shadow-orange-950/20 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-black/10 to-transparent pointer-events-none" />
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center self-start group-hover:scale-110 transition-transform duration-300">
                    <Layers className="w-6 h-6 text-white" />
                  </div>
                  <div className="z-10">
                    <h3 className="font-extrabold text-xl lg:text-2xl tracking-tight uppercase leading-snug">
                      DYNAMIC ANIMATION,<br />MOTION DESIGN
                    </h3>
                  </div>
                </div>

                {/* Lime Card */}
                <div className="group relative bg-[#c2ff3d] rounded-[24px] p-8 flex flex-col justify-between min-h-[200px] text-black hover:scale-[1.02] active:scale-[0.99] transition-all duration-300 cursor-pointer shadow-lg shadow-lime-950/10 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent pointer-events-none" />
                  <div className="w-12 h-12 rounded-full bg-black/5 flex items-center justify-center self-start group-hover:scale-110 transition-transform duration-300">
                    <Layout className="w-6 h-6 text-black" />
                  </div>
                  <div className="z-10">
                    <h3 className="font-extrabold text-xl lg:text-2xl tracking-tight uppercase leading-snug">
                      FRAMER, FIGMA,<br />WORDPRESS, REACTJS
                    </h3>
                  </div>
                </div>
              </div>
            </div>

            {/* ------------ SECTION 2: RECENT PROJECTS ------------ */}
            <div id="projects" ref={projectsRef} className="scroll-mt-20 flex flex-col justify-center min-h-[85vh]">
              <div className="relative mb-12">
                {/* Double Text Title */}
                <h2 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-zinc-950 dark:text-white uppercase select-none">
                  RECENT
                </h2>
                <h2 className="text-7xl md:text-[6.5rem] font-extrabold text-transparent text-outline uppercase tracking-wide leading-none select-none mt-[-10px] md:mt-[-25px] font-sans">
                  PROJECTS
                </h2>
              </div>

              {/* Projects List */}
              <div className="space-y-6">
                {projects.map((proj) => (
                  <div
                    key={proj.id}
                    className={`group flex items-center justify-between p-6 rounded-[24px] border ${proj.colorClass} transition-all duration-300 hover:bg-zinc-100/50 dark:hover:bg-zinc-900/30 cursor-pointer`}
                  >
                    <div className="flex items-center gap-6">
                      {/* Project Preview Box */}
                      <div className={`w-16 h-16 rounded-[16px] ${proj.previewBg} flex items-center justify-center shadow-inner shrink-0 group-hover:scale-105 transition-transform duration-350`}>
                        {proj.icon}
                      </div>

                      {/* Project Text Info */}
                      <div>
                        <h3 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight group-hover:text-zinc-950 dark:group-hover:text-[#25D379] transition-colors">
                          {proj.title}
                        </h3>
                        <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium mt-1">
                          {proj.category}
                        </p>
                      </div>
                    </div>

                    {/* Action Arrow */}
                    <div className="w-12 h-12 rounded-full border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 flex items-center justify-center group-hover:border-zinc-950 dark:group-hover:border-[#25D379]/40 group-hover:bg-zinc-950 dark:group-hover:bg-[#25D379] group-hover:text-white dark:group-hover:text-black text-zinc-950 dark:text-[#25D379] transition-all duration-300">
                      <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ------------ SECTION 3: 12 YEARS OF EXPERIENCE ------------ */}
            <div id="experience" ref={experienceRef} className="scroll-mt-20 flex flex-col justify-center min-h-[85vh]">
              <div className="relative mb-12">
                {/* Double Text Title */}
                <h2 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-zinc-950 dark:text-white uppercase select-none">
                  12 YEARS OF
                </h2>
                <h2 className="text-7xl md:text-[6.5rem] font-extrabold text-transparent text-outline uppercase tracking-wide leading-none select-none mt-[-10px] md:mt-[-25px] font-sans">
                  EXPERIENCE
                </h2>
              </div>

              {/* Experience list */}
              <div className="space-y-4">
                {experiences.map((exp) => (
                  <div
                    key={exp.id}
                    className="group relative p-6 rounded-[24px] border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800/60 hover:bg-zinc-100 dark:hover:bg-zinc-900/30 transition-all duration-300 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-6"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight">
                          {exp.role}
                        </h3>
                        <span className="text-xs font-bold text-zinc-800 dark:text-[#25D379] bg-zinc-100 dark:bg-[#25D379]/10 px-2.5 py-1 rounded-full uppercase tracking-wider">
                          {exp.company}
                        </span>
                      </div>
                      <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed mt-3 max-w-xl font-light">
                        {exp.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-6 shrink-0 border-t border-zinc-100 dark:border-zinc-900 md:border-none pt-4 md:pt-0">
                      <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-800 dark:group-hover:text-zinc-300 transition-colors">
                        {exp.duration}
                      </span>
                      <div className="w-10 h-10 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex items-center justify-center text-zinc-950 dark:text-[#25D379] group-hover:border-zinc-950 dark:group-hover:border-[#25D379]/40 group-hover:bg-zinc-950 dark:group-hover:bg-[#25D379] group-hover:text-white dark:group-hover:text-black transition-all duration-300">
                        <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ------------ SECTION 4: LET'S WORK TOGETHER ------------ */}
            <div id="contact" ref={contactRef} className="scroll-mt-20 flex flex-col justify-center min-h-[80vh]">
              <div className="relative mb-12">
                {/* Double Text Title */}
                <h2 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-zinc-950 dark:text-white uppercase select-none">
                  LET'S WORK
                </h2>
                <h2 className="text-7xl md:text-[6.5rem] font-extrabold text-transparent text-outline uppercase tracking-wide leading-none select-none mt-[-10px] md:mt-[-25px] font-sans">
                  TOGETHER
                </h2>
              </div>

              {/* Form Container */}
              <div className="bg-card border border-zinc-200 dark:border-zinc-800/80 rounded-[32px] p-6 md:p-8 backdrop-blur-sm relative overflow-hidden transition-colors duration-300">

                {isSuccess ? (
                  /* Success State */
                  <div className="flex flex-col items-center justify-center py-12 text-center animate-fade-in">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-6 shadow-lg shadow-emerald-500/5">
                      <Check className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">
                      Message Sent Successfully!
                    </h3>
                    <p className="text-zinc-600 dark:text-zinc-400 text-sm mt-3 max-w-sm leading-relaxed">
                      Thank you for reaching out. Hasibul Hasan will get in touch with you shortly to discuss your project.
                    </p>
                    <button
                      onClick={() => setIsSuccess(false)}
                      className="mt-8 text-sm font-semibold text-zinc-800 dark:text-[#25D379] hover:text-zinc-950 dark:hover:text-[#1db868] transition-colors border border-zinc-200 dark:border-[#25D379]/20 hover:border-zinc-400 dark:hover:border-[#25D379]/40 px-6 py-2.5 rounded-full"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  /* Interactive Form */
                  <form onSubmit={handleFormSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Name input */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider pl-1">
                          Name
                        </label>
                        <input
                          type="text"
                          required
                          value={formState.name}
                          onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                          placeholder="Your Name"
                          className="w-full bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/80 rounded-2xl px-4 py-3.5 text-zinc-950 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-zinc-950 dark:focus:border-[#25D379] focus:ring-1 focus:ring-zinc-950/20 dark:focus:ring-[#25D379]/30 transition-all duration-200 font-light"
                        />
                      </div>

                      {/* Email input */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider pl-1">
                          Email
                        </label>
                        <input
                          type="email"
                          required
                          value={formState.email}
                          onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                          placeholder="Your@email.com"
                          className="w-full bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/80 rounded-2xl px-4 py-3.5 text-zinc-950 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-zinc-950 dark:focus:border-[#25D379] focus:ring-1 focus:ring-zinc-950/20 dark:focus:ring-[#25D379]/30 transition-all duration-200 font-light"
                        />
                      </div>
                    </div>

                    {/* Budget selection */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider pl-1">
                        Budget
                      </label>
                      <div className="relative">
                        <select
                          value={formState.budget}
                          onChange={(e) => setFormState({ ...formState, budget: e.target.value })}
                          className="w-full bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/80 rounded-2xl px-4 py-3.5 text-zinc-950 dark:text-white focus:outline-none focus:border-zinc-950 dark:focus:border-[#25D379] focus:ring-1 focus:ring-zinc-950/20 dark:focus:ring-[#25D379]/30 transition-all duration-200 font-light appearance-none cursor-pointer"
                        >
                          <option disabled className="bg-white dark:bg-zinc-950 text-zinc-400 dark:text-zinc-500">Select Budget...</option>
                          <option className="bg-white dark:bg-zinc-950 text-zinc-950 dark:text-white" value="less_5k">Less than $5,000</option>
                          <option className="bg-white dark:bg-zinc-950 text-zinc-950 dark:text-white" value="5k_15k">$5,000 - $15,000</option>
                          <option className="bg-white dark:bg-zinc-950 text-zinc-950 dark:text-white" value="15k_50k">$15,000 - $50,000</option>
                          <option className="bg-white dark:bg-zinc-950 text-zinc-950 dark:text-white" value="more_50k">$50,000+</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Message input */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider pl-1">
                        Message
                      </label>
                      <textarea
                        required
                        rows={5}
                        value={formState.message}
                        onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                        placeholder="Explain your project goals..."
                        className="w-full bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/80 rounded-2xl px-4 py-3.5 text-zinc-950 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-zinc-950 dark:focus:border-[#25D379] focus:ring-1 focus:ring-zinc-950/20 dark:focus:ring-[#25D379]/30 transition-all duration-200 font-light resize-none"
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-zinc-950 hover:bg-zinc-800 dark:bg-[#25D379] dark:hover:bg-[#1db868] disabled:bg-zinc-800/50 dark:disabled:bg-[#25D379]/50 text-white dark:text-black font-bold py-4 rounded-2xl transition-all duration-200 shadow-lg shadow-zinc-950/10 dark:shadow-[#25D379]/10 active:scale-[0.99] flex items-center justify-center gap-3 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Sending Message...</span>
                        </>
                      ) : (
                        <span>Submit</span>
                      )}
                    </button>
                  </form>
                )}

              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
