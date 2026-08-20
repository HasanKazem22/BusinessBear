"use client";

import { HomeConfigTab } from "../_components/HomeConfigTab";

export default function HomeSettingsPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-6">
      {/* Centered Title & Short Description with Decreased Font Size */}
      <div className="max-w-xl mx-auto mb-6 space-y-1.5">
        <h1 className="text-lg md:text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Home Page Management
        </h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
          Select a section below to configure your landing page banner, services, profile bio, and contact info.
        </p>
      </div>

      {/* 4 Cards Grid */}
      <div className="w-full max-w-5xl mx-auto">
        <HomeConfigTab />
      </div>
    </div>
  );
}
