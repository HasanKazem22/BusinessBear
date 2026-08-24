"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useAuth } from "@/context/AuthContext";

const NAV_ITEMS = [
  { label: "Home", href: "/#home", isScroll: true, requirePermission: "home.isHomePage" },
  { label: "Service", href: "/#services", isScroll: true, requirePermission: "home.sections.services.isServiceSection" },
  { label: "About", href: "/#about", isScroll: true, requirePermission: "home.sections.aboutUs.isAboutUsSection" },
  { label: "Contact", href: "/#contact", isScroll: true, requirePermission: null },
  { label: "Product", href: "/product", isScroll: false, requirePermission: "product.isProductPage" },
  { label: "Real Asset", href: "/real-asset", isScroll: false, requirePermission: "realAsset.isRealAssetPage" },
  { label: "Admin", href: "/admin", isScroll: false, requirePermission: "userRoleSetup.isUserRolePage" },
];

export function Navbar() {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState("home");
  const { isAuthenticated, user, logout, canAccess, hasRole } = useAuth();

  useEffect(() => {
    if (pathname !== "/") return;

    const handleScroll = () => {
      const sections = NAV_ITEMS.filter((item) => item.isScroll).map((item) =>
        item.href.replace("/#", "")
      );

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
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

  // Filter top navbar links based on server role permissions
  const filteredNavItems = NAV_ITEMS.filter((item) => {
    if (hasRole("ROLE_ADMIN")) return true;
    if (!item.requirePermission) return true;
    return canAccess(item.requirePermission);
  });

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
          {filteredNavItems.map((item) => {
            const isActive = item.isScroll && pathname === "/" && activeSection === item.href.replace("/#", "");
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={(e) => item.isScroll && handleScrollClick(e, item.href)}
                className={`text-sm font-medium transition-colors hover:text-foreground ${
                  isActive ? "text-foreground font-bold" : "text-muted-foreground"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Right Side: Actions */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 hidden sm:inline">
                {user?.username}
              </span>
              <Button onClick={logout} variant="outline" size="sm" className="h-8 text-xs font-semibold">
                Log Out
              </Button>
            </div>
          ) : (
            <Link href="/login" className="hidden sm:block">
              <Button variant="outline" size="sm" className="h-8 text-xs font-semibold">
                Log In
              </Button>
            </Link>
          )}
          <div className="h-8 w-px bg-border hidden sm:block" />
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
