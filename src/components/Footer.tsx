"use client";
import { useI18n } from "./I18nProvider";

export default function Footer() {
  const { t } = useI18n();
  return (
    <footer className="border-t border-zinc-900 py-8">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2 text-[13px] text-zinc-500">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded bg-white text-[10px] font-bold text-black">◐</span>
            <span>{t.footer.builtFor}</span>
            <span className="hidden md:inline">•</span>
            <span className="hidden md:inline">{t.footer.gateway}</span>
          </div>
          <div className="flex items-center gap-4 text-[13px] text-zinc-500">
            <a href="#" className="hover:text-white">{t.footer.status}</a>
            <a href="#" className="hover:text-white">{t.footer.github}</a>
            <a href="#" className="hover:text-white">{t.footer.twitter}</a>
            <a href="#" className="hover:text-white">{t.footer.discord}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
