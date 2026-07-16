"use client";

import { useState } from "react";
import Image from "next/image";
import { Check, Loader2, Code, Layout, Palette, Megaphone, Smartphone, Server } from "lucide-react";

const SERVICES = [
  {
    title: "Web Development",
    description: "Building robust, scalable, and responsive web applications using cutting-edge technologies.",
    icon: <Code className="w-8 h-8 text-zinc-950 dark:text-white" />,
  },
  {
    title: "UI/UX Design",
    description: "Crafting intuitive and engaging user experiences with modern aesthetics and user-centered design.",
    icon: <Palette className="w-8 h-8 text-blue-500" />,
  },
  {
    title: "Mobile App Development",
    description: "Developing cross-platform mobile applications that provide seamless experiences on all devices.",
    icon: <Smartphone className="w-8 h-8 text-purple-500" />,
  },
  {
    title: "Frontend Engineering",
    description: "Creating highly interactive and performant front-end interfaces using React and Next.js.",
    icon: <Layout className="w-8 h-8 text-amber-500" />,
  },
  {
    title: "Backend Solutions",
    description: "Designing secure and scalable server-side architectures, APIs, and database structures.",
    icon: <Server className="w-8 h-8 text-red-500" />,
  },
  {
    title: "Digital Marketing",
    description: "Enhancing brand presence and driving growth through data-driven digital marketing strategies.",
    icon: <Megaphone className="w-8 h-8 text-emerald-500" />,
  },
];

export default function Home() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    budget: "Select Budget...",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.email || !formState.message) {
      alert("Please fill in all fields.");
      return;
    }
    setIsSubmitting(true);
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

  return (
    <div className="h-full overflow-y-auto overflow-x-hidden bg-background dark:bg-[#070709] scroll-smooth font-sans text-zinc-950 dark:text-zinc-100 selection:bg-zinc-950 dark:selection:bg-white selection:text-white dark:selection:text-black transition-colors duration-300 relative">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(0,0,0,0.01),transparent_50%)] dark:bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.03),transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(194,255,61,0.01),transparent_50%)] pointer-events-none" />

      <div className="container mx-auto px-4 pt-4 pb-12 lg:pt-8 lg:pb-16 max-w-5xl relative z-10 flex flex-col gap-12">

        {/* ================= HERO SECTION ================= */}
        <section id="home" className="flex flex-col items-center text-center scroll-mt-24">
          <Image
            src="/BusinessBearLogo.png"
            alt="Business Bear Logo"
            width={400}
            height={100}
            className="h-12 md:h-16 w-auto object-contain dark:invert dark:hue-rotate-180 mb-4"
            priority
          />
          <p className="text-zinc-600 dark:text-zinc-400 text-base md:text-lg max-w-2xl leading-relaxed font-light">
            Welcome to our digital agency where innovation meets aesthetics.
            We specialize in transforming complex challenges into elegant, robust, and intuitive software solutions.
            Partner with us to elevate your brand's digital presence and build scalable products that your users will love.
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
            {SERVICES.map((service, idx) => (
              <div
                key={idx}
                className="group p-6 rounded-2xl bg-card border border-zinc-200 dark:border-zinc-800/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-start gap-3"
              >
                <div className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <div className="scale-75">{service.icon}</div>
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
              <Image
                src="/ProfilePicture.png"
                alt="Profile Avatar"
                fill
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out grayscale"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 pointer-events-none" />
            </div>
            <div className="flex-1 text-center md:text-left flex flex-col justify-center h-full pt-1">
              <h3 className="text-2xl md:text-3xl font-extrabold text-zinc-900 dark:text-white mb-1.5">
                Hasibul Hasan
              </h3>
              <p className="text-zinc-500 dark:text-white font-bold tracking-wider uppercase text-[10px] mb-4">
                Lead Software Engineer & Designer
              </p>
              <p className="text-zinc-600 dark:text-zinc-300 text-sm leading-relaxed mb-6">
                With over a decade of experience in software architecture and interactive design,
                I focus on bridging the gap between engineering and art. My mission is to build digital products
                that are not only extremely performant and scalable but also deeply engaging and visually breathtaking.
              </p>
              <div className="flex items-center justify-center md:justify-start gap-3">
                {/* Socials */}
                {[
                  {
                    icon: (
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    ),
                    href: "#"
                  },
                  {
                    icon: (
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                      </svg>
                    ),
                    href: "#"
                  }
                ].map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className="text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white transition-colors p-2.5 bg-zinc-100 dark:bg-zinc-900 rounded-full hover:scale-110 active:scale-95 duration-200"
                  >
                    {social.icon}
                  </a>
                ))}
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
                  <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-zinc-950 dark:group-hover:bg-white transition-all duration-300 text-zinc-900 dark:text-white group-hover:text-white dark:group-hover:text-black shadow-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                  <div className="flex flex-col justify-center h-10">
                    <h4 className="font-bold text-zinc-900 dark:text-white text-sm">Email</h4>
                    <p className="text-zinc-500 dark:text-zinc-400 text-xs mt-0.5">hello@businessbear.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 group">
                  <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-zinc-950 dark:group-hover:bg-white transition-all duration-300 text-zinc-900 dark:text-white group-hover:text-white dark:group-hover:text-black shadow-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                    </svg>
                  </div>
                  <div className="flex flex-col justify-center h-10">
                    <h4 className="font-bold text-zinc-900 dark:text-white text-sm">Phone</h4>
                    <p className="text-zinc-500 dark:text-zinc-400 text-xs mt-0.5">+1 (555) 123-4567</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 group">
                  <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-zinc-950 dark:group-hover:bg-white transition-all duration-300 text-zinc-900 dark:text-white group-hover:text-white dark:group-hover:text-black shadow-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                  </div>
                  <div className="flex flex-col justify-center h-10">
                    <h4 className="font-bold text-zinc-900 dark:text-white text-sm">Location</h4>
                    <p className="text-zinc-500 dark:text-zinc-400 text-xs mt-0.5">123 Innovation Drive, NY</p>
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
                  <div className="w-16 h-16 rounded-full bg-zinc-950/10 dark:bg-white/10 border border-zinc-950/30 dark:border-white/30 flex items-center justify-center text-zinc-950 dark:text-white mb-5 shadow-lg shadow-zinc-950/5 dark:shadow-white/5">
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
                      <label className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest pl-1">
                        Name
                      </label>
                      <input
                        type="text"
                        required
                        value={formState.name}
                        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                        placeholder="Your Name"
                        className="w-full bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/80 rounded-xl px-3.5 py-2.5 text-xs text-zinc-950 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-zinc-950 dark:focus:border-white focus:ring-1 focus:ring-zinc-950/20 dark:focus:ring-white/30 transition-all duration-200"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest pl-1">
                        Email
                      </label>
                      <input
                        type="email"
                        required
                        value={formState.email}
                        onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                        placeholder="hello@example.com"
                        className="w-full bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/80 rounded-xl px-3.5 py-2.5 text-xs text-zinc-950 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-zinc-950 dark:focus:border-white focus:ring-1 focus:ring-zinc-950/20 dark:focus:ring-white/30 transition-all duration-200"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest pl-1">
                      Budget
                    </label>
                    <div className="relative">
                      <select
                        value={formState.budget}
                        onChange={(e) => setFormState({ ...formState, budget: e.target.value })}
                        className="w-full bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/80 rounded-xl px-3.5 py-2.5 text-xs text-zinc-950 dark:text-white focus:outline-none focus:border-zinc-950 dark:focus:border-white focus:ring-1 focus:ring-zinc-950/20 dark:focus:ring-white/30 transition-all duration-200 appearance-none cursor-pointer"
                      >
                        <option disabled className="bg-white dark:bg-zinc-950 text-zinc-400 dark:text-zinc-500">Select Budget...</option>
                        <option className="bg-white dark:bg-zinc-950 text-zinc-950 dark:text-white" value="less_5k">Less than $5,000</option>
                        <option className="bg-white dark:bg-zinc-950 text-zinc-950 dark:text-white" value="5k_15k">$5,000 - $15,000</option>
                        <option className="bg-white dark:bg-zinc-950 text-zinc-950 dark:text-white" value="15k_50k">$15,000 - $50,000</option>
                        <option className="bg-white dark:bg-zinc-950 text-zinc-950 dark:text-white" value="more_50k">$50,000+</option>
                      </select>
                      <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest pl-1">
                      Message
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formState.message}
                      onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                      placeholder="Tell us about your project..."
                      className="w-full bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/80 rounded-xl px-3.5 py-2.5 text-xs text-zinc-950 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-zinc-950 dark:focus:border-white focus:ring-1 focus:ring-zinc-950/20 dark:focus:ring-white/30 transition-all duration-200 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full mt-1 bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 disabled:bg-zinc-800/50 dark:disabled:bg-white/50 text-white dark:text-black font-bold py-3 rounded-xl transition-all duration-200 shadow-lg shadow-zinc-950/10 dark:shadow-white/10 active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
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
