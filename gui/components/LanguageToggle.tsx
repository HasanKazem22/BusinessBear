"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";

export function LanguageToggle() {
  const [lang, setLang] = React.useState("EN");

  React.useEffect(() => {
    // Check if the googtrans cookie is set to bangla
    const match = document.cookie.match(new RegExp('(^| )googtrans=([^;]+)'));
    if (match && match[2] === '/en/bn') {
      setLang("BN");
    } else {
      setLang("EN");
    }
  }, []);

  const toggleLanguage = () => {
    if (lang === "EN") {
      // Set to Bangla
      document.cookie = "googtrans=/en/bn; path=/";
      window.location.reload();
    } else {
      // Set to English
      document.cookie = "googtrans=/en/en; path=/";
      window.location.reload();
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleLanguage}
      translate="no"
      className="rounded-full font-bold text-xs hover:bg-zinc-100 dark:hover:bg-zinc-800 notranslate"
    >
      {lang}
      <span className="sr-only">Toggle language</span>
    </Button>
  );
}
