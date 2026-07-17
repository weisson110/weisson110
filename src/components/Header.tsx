"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
<<<<<<< HEAD
import { Search, Menu, X, Globe } from "lucide-react";
import { useState } from "react";
import { useI18n } from "./I18nProvider";
=======
import { Search, Menu, X, Globe, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useI18n, Lang } from "./I18nProvider";
>>>>>>> f2715a2 (feat: full backend mock + EN/ZH/MS i18n default EN)

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
<<<<<<< HEAD
=======
  const [langMenuOpen, setLangMenuOpen] = useState(false);
>>>>>>> f2715a2 (feat: full backend mock + EN/ZH/MS i18n default EN)
  const { t, lang, setLang } = useI18n();

  const navItems = [
    { label: t.nav.models, href: "/models" },
    { label: t.nav.chat, href: "/chat" },
    { label: t.nav.rankings, href: "/rankings" },
<<<<<<< HEAD
    { label: t.nav.docs, href: "/docs" },
  ];

  const toggleLang = () => {
    setLang(lang === "en" ? "zh" : "en");
  };
=======
    { label: t.nav.activity, href: "/activity" },
    { label: t.nav.docs, href: "/docs" },
  ];

  const languages: { code: Lang; label: string; native: string }[] = [
    { code: "en", label: "English", native: "EN" },
    { code: "zh", label: "中文", native: "中" },
    { code: "ms", label: "Bahasa Melayu", native: "BM" },
  ];

  const currentLang = languages.find((l) => l.code === lang) || languages[0];
>>>>>>> f2715a2 (feat: full backend mock + EN/ZH/MS i18n default EN)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-xl supports-[backdrop-filter]:bg-zinc-950/60">
      <div className="mx-auto flex h-[56px] max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-white text-[14px] font-bold text-black">
              ◐
            </div>
            <span className="text-[15px] font-semibold tracking-tight">openrouter</span>
            <span className="hidden rounded bg-zinc-800 px-1.5 py-0.5 text-[10px] font-medium text-zinc-400 sm:inline-block">
              CLONE
            </span>
          </Link>

<<<<<<< HEAD
          <nav className="hidden items-center gap-1 md:flex">
=======
          <nav className="hidden items-center gap-1 lg:flex">
>>>>>>> f2715a2 (feat: full backend mock + EN/ZH/MS i18n default EN)
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-md px-3 py-1.5 text-[13.5px] font-medium transition-colors",
                  pathname?.startsWith(item.href)
                    ? "bg-zinc-800 text-white"
                    : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 lg:flex">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
              <input
                placeholder={t.nav.searchPlaceholder}
                className="h-8 w-[200px] rounded-md border border-zinc-800 bg-zinc-900/80 py-1 pl-8 pr-3 text-[13px] placeholder:text-zinc-500 focus:border-zinc-700 focus:outline-none focus:ring-1 focus:ring-zinc-700"
              />
              <kbd className="pointer-events-none absolute right-2 top-1/2 hidden -translate-y-1/2 rounded border border-zinc-800 bg-zinc-900 px-1 py-0.5 text-[10px] text-zinc-500 sm:inline-flex">
                ⌘K
              </kbd>
            </div>
          </div>

<<<<<<< HEAD
          <button
            onClick={toggleLang}
            className="inline-flex h-8 items-center gap-1.5 rounded-md border border-zinc-800 bg-zinc-900 px-2.5 text-[12px] font-medium text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
            title="Switch language"
          >
            <Globe className="h-3.5 w-3.5" />
            <span>{lang === "en" ? "EN" : "中"}</span>
            <span className="hidden sm:inline text-[11px] text-zinc-500">/ {lang === "en" ? "中" : "EN"}</span>
          </button>
=======
          <div className="relative">
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="inline-flex h-8 items-center gap-1.5 rounded-md border border-zinc-800 bg-zinc-900 px-2.5 text-[12px] font-medium text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
            >
              <Globe className="h-3.5 w-3.5" />
              <span>{currentLang.native}</span>
              <ChevronDown className="h-3 w-3 opacity-60" />
            </button>
            {langMenuOpen && (
              <div className="absolute right-0 top-10 z-50 w-48 overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900 shadow-xl">
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLang(l.code);
                      setLangMenuOpen(false);
                    }}
                    className={cn(
                      "flex w-full items-center justify-between px-3 py-2.5 text-left text-[13px] hover:bg-zinc-800",
                      lang === l.code ? "bg-zinc-800 text-white" : "text-zinc-400"
                    )}
                  >
                    <span>{l.label}</span>
                    <span className="text-[11px] opacity-60">{l.native}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
>>>>>>> f2715a2 (feat: full backend mock + EN/ZH/MS i18n default EN)

          <div className="hidden h-5 w-px bg-zinc-800 md:block" />

          <Link
            href="/keys"
            className="hidden h-8 items-center rounded-md border border-zinc-800 bg-zinc-900 px-3 text-[13px] font-medium text-zinc-300 transition hover:bg-zinc-800 hover:text-white md:inline-flex"
          >
            {t.nav.signIn}
          </Link>
          <Link
            href="/keys"
            className="inline-flex h-8 items-center rounded-md bg-white px-3.5 text-[13px] font-semibold text-black transition hover:bg-zinc-200"
          >
            {t.nav.getApiKey}
          </Link>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
<<<<<<< HEAD
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-zinc-800 bg-zinc-900 text-zinc-400 md:hidden"
=======
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-zinc-800 bg-zinc-900 text-zinc-400 lg:hidden"
>>>>>>> f2715a2 (feat: full backend mock + EN/ZH/MS i18n default EN)
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
<<<<<<< HEAD
        <div className="border-t border-zinc-800 bg-zinc-950 px-4 py-4 md:hidden">
=======
        <div className="border-t border-zinc-800 bg-zinc-950 px-4 py-4 lg:hidden">
>>>>>>> f2715a2 (feat: full backend mock + EN/ZH/MS i18n default EN)
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "rounded-md px-3 py-2.5 text-[14px] font-medium",
                  pathname?.startsWith(item.href)
                    ? "bg-zinc-800 text-white"
                    : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                )}
              >
                {item.label}
              </Link>
            ))}
<<<<<<< HEAD
            <button
              onClick={() => { toggleLang(); setMobileOpen(false); }}
              className="mt-2 flex items-center gap-2 rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2.5 text-[14px] text-zinc-300"
            >
              <Globe className="h-4 w-4" /> {lang === "en" ? "切换到中文" : "Switch to English"}
            </button>
=======
            <div className="mt-3 grid grid-cols-3 gap-2">
              {languages.map((l) => (
                <button
                  key={l.code}
                  onClick={() => {
                    setLang(l.code);
                    setMobileOpen(false);
                  }}
                  className={cn(
                    "rounded-md border px-3 py-2 text-[13px]",
                    lang === l.code
                      ? "border-white bg-white text-black"
                      : "border-zinc-800 bg-zinc-900 text-zinc-400"
                  )}
                >
                  {l.label}
                </button>
              ))}
            </div>
>>>>>>> f2715a2 (feat: full backend mock + EN/ZH/MS i18n default EN)
          </nav>
        </div>
      )}
    </header>
  );
}
