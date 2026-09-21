"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageToggle } from "@/components/LanguageToggle";
import { UserNav } from "@/components/UserNav";
import { useAuth } from "@/context/AuthContext";
import {
  LuHouse,
  LuTv,
  LuRocket,
  LuPackage,
  LuBuilding2,
  LuShield,
  LuMenu,
  LuX
} from "react-icons/lu";

const NAV_ITEMS = [
  { label: "Home", href: "/", icon: LuHouse },
  { label: "Content", href: "/content", icon: LuTv, requirePermission: "content.isPublicPage" },
  { label: "Uddokta", href: "/uddokta", icon: LuRocket, requirePermission: "uddokta.isPublicPage" },
  { label: "Product", href: "/product", icon: LuPackage, requirePermission: "product.isPublicPage" },
  { label: "Real Asset", href: "/real-asset", icon: LuBuilding2, requirePermission: "realAsset.isPublicPage" },
  { label: "Admin", href: "/admin", icon: LuShield, requireAdmin: true },
];

export function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, canAccess, hasRole } = useAuth();

  if (pathname === "/login" || pathname === "/signup") {
    return null;
  }

  // Filter top navbar links
  const filteredNavItems = NAV_ITEMS.filter((item) => {
    if (item.requireAdmin) {
      return isAuthenticated && (hasRole("ADMIN") || canAccess("userRoleSetup.isAdminConfig"));
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

        {/* Middle Side: Desktop Module Links with Icons */}
        <div className="hidden md:flex items-center gap-6">
          {filteredNavItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                  isActive
                    ? "text-zinc-950 dark:text-white font-extrabold"
                    : "text-zinc-500 dark:text-zinc-400 font-bold hover:text-zinc-950 dark:hover:text-white"
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Right Side: User Actions */}
        <div className="flex items-center gap-2.5">
          {isAuthenticated ? (
            <UserNav />
          ) : (
            <Link href="/login">
              <Button size="sm" className="h-8 text-xs font-semibold rounded-full px-4 bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 transition-colors">
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
            {filteredNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors flex items-center gap-2"
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
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
