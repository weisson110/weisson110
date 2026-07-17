"use client";
import { useState, useEffect } from "react";
import { useI18n, Lang } from "@/components/I18nProvider";
import { User, Globe, Cpu, Save } from "lucide-react";

export default function SettingsPage() {
  const { t, lang, setLang } = useI18n();
  const [email, setEmail] = useState("demo@openrouter.clone");
  const [name, setName] = useState("Demo User");
  const [defaultModel, setDefaultModel] = useState("anthropic/claude-3.5-sonnet");
  const [theme, setTheme] = useState("dark");
  const [saved, setSaved] = useState(false);

  const languages: { code: Lang; label: string }[] = [
    { code: "en", label: "English (Default)" },
    { code: "zh", label: "中文" },
    { code: "ms", label: "Bahasa Melayu" },
  ];

  const save = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="mx-auto max-w-[900px] px-4 py-8 sm:px-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-[24px] font-semibold text-white">{t.settingsPage.title}</h1>
        <p className="text-[13px] text-zinc-400">{t.settingsPage.desc}</p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[200px_1fr]">
        <div className="space-y-1 text-[13px]">
          <button className="flex w-full items-center gap-2 rounded-md bg-zinc-800 px-3 py-2 text-white"><User className="h-4 w-4" /> {t.settingsPage.profile}</button>
          <button className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-zinc-500 hover:bg-zinc-900 hover:text-white"><Globe className="h-4 w-4" /> {t.settingsPage.preferences}</button>
          <button className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-zinc-500 hover:bg-zinc-900 hover:text-white"><Cpu className="h-4 w-4" /> {t.settingsPage.team}</button>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-6">
            <h3 className="text-[14px] font-semibold text-white">{t.settingsPage.profile}</h3>
            <div className="mt-4 grid gap-4">
              <div>
                <label className="text-[12px] text-zinc-400">{t.settingsPage.email}</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 h-9 w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 text-[13px] text-white focus:border-zinc-700 focus:outline-none" />
              </div>
              <div>
                <label className="text-[12px] text-zinc-400">Name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 h-9 w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 text-[13px] text-white focus:border-zinc-700 focus:outline-none" />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-6">
            <h3 className="text-[14px] font-semibold text-white">{t.settingsPage.preferences}</h3>
            <div className="mt-4 space-y-4">
              <div>
                <label className="text-[12px] text-zinc-400">{t.settingsPage.language}</label>
                <p className="mt-1 text-[11px] text-zinc-500">{t.settingsPage.languageDesc}</p>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {languages.map((l) => (
                    <button key={l.code} onClick={() => setLang(l.code)} className={`rounded-md border px-3 py-2 text-[13px] ${lang === l.code ? "border-white bg-white text-black" : "border-zinc-800 bg-zinc-900 text-zinc-400 hover:bg-zinc-800"}`}>
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[12px] text-zinc-400">{t.settingsPage.theme}</label>
                <div className="mt-2 flex gap-2">
                  {["dark", "light", "system"].map((th) => (
                    <button key={th} onClick={() => setTheme(th)} className={`rounded-md border px-3 py-1.5 text-[12px] capitalize ${theme === th ? "border-white bg-white text-black" : "border-zinc-800 bg-zinc-900 text-zinc-400"}`}>
                      {th}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[12px] text-zinc-400">{t.settingsPage.defaultModel}</label>
                <select value={defaultModel} onChange={(e) => setDefaultModel(e.target.value)} className="mt-1 h-9 w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 text-[13px] text-white focus:border-zinc-700 focus:outline-none">
                  <option value="openai/gpt-4o">OpenAI / GPT-4o</option>
                  <option value="anthropic/claude-3.5-sonnet">Anthropic / Claude 3.5 Sonnet</option>
                  <option value="google/gemini-1.5-pro">Google / Gemini 1.5 Pro</option>
                  <option value="meta-llama/llama-3.1-405b-instruct">Meta / Llama 3.1 405B</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <button onClick={save} className="inline-flex items-center gap-1.5 rounded-md bg-white px-4 py-2 text-[13px] font-semibold text-black hover:bg-zinc-200">
                <Save className="h-4 w-4" /> {t.settingsPage.save}
              </button>
              {saved && <span className="text-[13px] text-emerald-400">{t.settingsPage.saved}</span>}
            </div>
          </div>

          <div className="rounded-xl border border-amber-900/30 bg-amber-950/20 p-4 text-[12px] text-amber-200/70">
            Mock Settings Page – In production, wire to NextAuth/Clerk, store prefs in DB. Language default is English as requested, with ZH and MS toggle via header.
          </div>
        </div>
      </div>
    </div>
  );
}
