"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import {
  LuUser, LuShield, LuSlidersHorizontal, LuLogOut, LuChevronDown
} from "react-icons/lu";

export function UserNav() {
  const { user, logout, hasRole, canAccess } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  if (!user) return null;

  const displayName = user.fullName || user.username || "User";
  const initial = displayName.charAt(0).toUpperCase();
  const avatarUrl = user.avatarUrl || user.avatar;
  const isAdmin = hasRole("ROLE_ADMIN") || canAccess("userRoleSetup.isUserRolePage");

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      {/* Clean Minimalist Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="group flex items-center gap-2 p-1 pl-1.5 pr-3 rounded-full bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 transition-colors cursor-pointer select-none focus:outline-none"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {/* Avatar Badge */}
        <div className="relative flex items-center justify-center w-7 h-7 rounded-full overflow-hidden bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 font-bold text-xs shrink-0 shadow-2xs">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={displayName}
              fill
              className="object-cover rounded-full"
            />
          ) : (
            <span>{initial}</span>
          )}
        </div>

        {/* User Name */}
        <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 max-w-[120px] truncate hidden sm:inline-block">
          {displayName}
        </span>

        <LuChevronDown
          className={`w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-200 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Clean Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
          {/* User Info Header */}
          <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
            <div className="flex items-center gap-3">
              <div className="relative flex items-center justify-center w-9 h-9 rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 font-bold text-sm shrink-0">
                {avatarUrl ? (
                  <Image src={avatarUrl} alt={displayName} fill className="object-cover rounded-full" />
                ) : (
                  <span>{initial}</span>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-zinc-900 dark:text-white truncate">
                  {displayName}
                </div>
                <div className="text-[11px] font-mono text-zinc-400 truncate">
                  @{user.username}
                </div>
                {user.email && (
                  <div className="text-[10px] text-zinc-400 truncate mt-0.5">
                    {user.email}
                  </div>
                )}
              </div>
            </div>

            {/* Clean Role Badges */}
            <div className="mt-2.5 flex flex-wrap gap-1">
              {user.roles && user.roles.length > 0 ? (
                user.roles.map((r, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700"
                  >
                    {r.replace("ROLE_", "")}
                  </span>
                ))
              ) : (
                <span className="text-[10px] text-zinc-400 italic">User</span>
              )}
            </div>
          </div>

          {/* Navigation Links */}
          <div className="p-1.5 space-y-0.5 text-xs bg-white dark:bg-zinc-900">
            <Link
              href="/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
              <LuUser className="w-4 h-4 text-zinc-500" />
              <span>My Profile</span>
            </Link>

            {isAdmin && (
              <div className="hidden md:block space-y-0.5">
                <Link
                  href="/admin"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white transition-colors"
                >
                  <LuShield className="w-4 h-4 text-zinc-500" />
                  <span>Admin Control Hub</span>
                </Link>

                <Link
                  href="/admin/user-role-setup"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white transition-colors"
                >
                  <LuSlidersHorizontal className="w-4 h-4 text-zinc-500" />
                  <span>User & Role Setup</span>
                </Link>
              </div>
            )}
          </div>

          {/* Logout Action */}
          <div className="p-1.5 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                logout();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium text-xs text-red-600 dark:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer text-left"
            >
              <LuLogOut className="w-4 h-4 text-red-500" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
