"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageToggle } from "@/components/LanguageToggle";

const NAV_ITEMS = [
  { label: "Home", href: "/#home", isScroll: true },
  { label: "Service", href: "/#services", isScroll: true },
  { label: "About", href: "/#about", isScroll: true },
  { label: "Contact", href: "/#contact", isScroll: true },
  { label: "Product", href: "/product", isScroll: false },
  { label: "Real Asset", href: "/real-asset", isScroll: false },
  { label: "Admin", href: "/admin", isScroll: false },
];

export function Navbar() {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    if (pathname !== "/") return; // Only track scroll on home page

    const handleScroll = () => {
      const sections = NAV_ITEMS.filter((item) => item.isScroll).map((item) =>
        item.href.replace("/#", "")
      );

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          // If the top of the section is near the top of the viewport
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check on mount
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  const handleScrollClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (pathname === "/" && href.startsWith("/#")) {
      e.preventDefault();
      const targetId = href.replace("/#", "");
      const elem = document.getElementById(targetId);
      if (elem) {
        elem.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  if (pathname === "/login" || pathname === "/signup") {
    return null;
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Left Side: Logo */}
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
            <Image
              src="/BusinessBearLogo.png"
              alt="Business Bear Logo"
              width={150}
              height={40}
              className="h-6 w-auto object-contain dark:invert dark:hue-rotate-180"
              priority
            />
          </Link>
        </div>

        {/* Middle Side: Module Names */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_ITEMS.map((item) => {
            const isActive = item.isScroll && pathname === "/" && activeSection === item.href.replace("/#", "");
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={(e) => item.isScroll && handleScrollClick(e, item.href)}
                className={`text-sm font-medium transition-colors hover:text-foreground ${isActive ? "text-foreground font-bold" : "text-muted-foreground"
                  }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Right Side: Actions */}
        <div className="flex items-center gap-3">
          <Link href="/login" className="hidden sm:block">
            <Button variant="outline">
              Log In
            </Button>
          </Link>
          <div className="h-8 w-px bg-border hidden sm:block" />
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
