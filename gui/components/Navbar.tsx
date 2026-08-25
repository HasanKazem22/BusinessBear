"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageToggle } from "@/components/LanguageToggle";
import { UserNav } from "@/components/UserNav";
import { useAuth } from "@/context/AuthContext";
import { LuMenu, LuX } from "react-icons/lu";

const NAV_ITEMS = [
  { label: "Home", href: "/#home", isScroll: true },
  { label: "Service", href: "/#services", isScroll: true },
  { label: "About", href: "/#about", isScroll: true },
  { label: "Contact", href: "/#contact", isScroll: true },
  { label: "Product", href: "/product", isScroll: false, requirePermission: "product.isProductPage" },
  { label: "Real Asset", href: "/real-asset", isScroll: false, requirePermission: "realAsset.isRealAssetPage" },
  { label: "Admin", href: "/admin", isScroll: false, requireAdmin: true },
];

export function Navbar() {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState("home");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, canAccess, hasRole } = useAuth();

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
    setIsMobileMenuOpen(false);
  };

  if (pathname === "/login" || pathname === "/signup") {
    return null;
  }

  // Filter top navbar links
  const filteredNavItems = NAV_ITEMS.filter((item) => {
    if (item.requireAdmin) {
      return isAuthenticated && (hasRole("ROLE_ADMIN") || canAccess("userRoleSetup.isUserRolePage"));
    }
    if (item.requirePermission) {
      return canAccess(item.requirePermission);
    }
    return true;
  });

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md transition-colors">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
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

        {/* Middle Side: Desktop Module Links */}
        <div className="hidden md:flex items-center gap-7">
          {filteredNavItems.map((item) => {
            const isActive = item.isScroll && pathname === "/" && activeSection === item.href.replace("/#", "");
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={(e) => item.isScroll && handleScrollClick(e, item.href)}
                className={`text-xs uppercase tracking-wider font-bold transition-all hover:text-zinc-900 dark:hover:text-white ${isActive
                    ? "text-zinc-950 dark:text-white font-extrabold"
                    : "text-zinc-500 dark:text-zinc-400"
                  }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Right Side: Actions */}
        <div className="flex items-center gap-2.5">
          {isAuthenticated ? (
            <UserNav />
          ) : (
            <Link href="/login">
              <Button variant="outline" size="sm" className="h-8 text-xs font-semibold rounded-full px-4">
                Log In
              </Button>
            </Link>
          )}

          <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800 hidden sm:block mx-0.5" />

          <div className="hidden sm:flex items-center gap-1.5">
            <LanguageToggle />
            <ThemeToggle />
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="md:hidden flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <LuX className="w-4 h-4" /> : <LuMenu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 pt-3 pb-4 space-y-3 animate-in slide-in-from-top-2 duration-150 shadow-xl">
          <div className="flex flex-col space-y-1">
            {filteredNavItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={(e) => {
                  if (item.isScroll) handleScrollClick(e, item.href);
                  setIsMobileMenuOpen(false);
                }}
                className="px-3 py-2 rounded-lg text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="pt-2 border-t border-zinc-100 dark:border-zinc-900 flex items-center justify-end gap-2">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>
      )}
    </nav>
  );
}
