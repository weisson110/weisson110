"use client";
import { useState, useEffect } from "react";
import { useI18n, Lang, Currency } from "@/components/I18nProvider";
import { User, Globe, Cpu, Save, Key, Download } from "lucide-react";

export default function SettingsPage() {
  const { t, lang, setLang, currency, setCurrency } = useI18n();
  const [email, setEmail] = useState("demo@openrouter.clone");
  const [name, setName] = useState("Demo User");
  const [defaultModel, setDefaultModel] = useState("anthropic/claude-3.5-sonnet");
  const [theme, setTheme] = useState("dark");
  const [saved, setSaved] = useState(false);
  const [byokProvider, setByokProvider] = useState("openai");
  const [byokKey, setByokKey] = useState("");
  const [byokKeys, setByokKeys] = useState<any[]>([]);

  const languages: { code: Lang; label: string }[] = [
    { code: "en", label: "English (Default)" },
    { code: "zh", label: "中文" },
    { code: "ms", label: "Bahasa Melayu" },
  ];

  useEffect(() => {
    fetch("/api/v1/auth/me").then(r=>r.json()).then(d=>{
      if(d.data?.email) setEmail(d.data.email);
      if(d.data?.name) setName(d.data.name);
    });
    // Load BYOK keys
    fetch("/api/v1/keys").then(()=>{}); // placeholder
    setByokKeys([
      { id: "byok_1", provider: "openai", keyPrefix: "sk-proj-a1b2", createdAt: new Date().toISOString() },
    ]);
  }, []);

  const save = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const addByok = async () => {
    if(!byokKey.trim()) return;
    // Mock add
    setByokKeys([...byokKeys, { id: `byok_${Date.now()}`, provider: byokProvider, keyPrefix: byokKey.slice(0,8), createdAt: new Date().toISOString() }]);
    setByokKey("");
  };

  const exportCsv = async () => {
    const res = await fetch("/api/v1/activity?limit=100");
    const data = await res.json();
    const rows = [["id","model","promptHash","tokens","cost","latency","createdAt"]];
    data.data.forEach((g:any)=> rows.push([g.id,g.model,g.promptHash||"",g.totalTokens,g.costUsd,g.latencyMs,g.createdAt]));
    const csv = rows.map(r=>r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `generations_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
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
            <div className="mt-4 space-y-5">
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
                <label className="text-[12px] text-zinc-400">{t.settingsPage.currency}</label>
                <p className="mt-1 text-[11px] text-zinc-500">{t.settingsPage.currencyDesc}</p>
                <div className="mt-2 flex gap-2">
                  {(["USD","MYR"] as Currency[]).map((c) => (
                    <button key={c} onClick={() => setCurrency(c)} className={`rounded-md border px-3 py-2 text-[13px] ${currency === c ? "border-white bg-white text-black" : "border-zinc-800 bg-zinc-900 text-zinc-400"}`}>
                      {c} {c==="MYR"?"(RM)":"($)"} 
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

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-6">
            <h3 className="text-[14px] font-semibold text-white flex items-center gap-2"><Key className="h-4 w-4" /> {t.settingsPage.byok}</h3>
            <p className="mt-1 text-[12px] text-zinc-500">{t.settingsPage.byokDesc}</p>
            <div className="mt-4 flex gap-2">
              <select value={byokProvider} onChange={(e)=>setByokProvider(e.target.value)} className="h-9 rounded-md border border-zinc-800 bg-zinc-900 px-2 text-[12px] text-white">
                <option value="openai">OpenAI</option>
                <option value="anthropic">Anthropic</option>
                <option value="google">Google</option>
                <option value="deepseek">DeepSeek</option>
              </select>
              <input value={byokKey} onChange={(e)=>setByokKey(e.target.value)} placeholder={t.settingsPage.keyPlaceholder} className="h-9 flex-1 rounded-md border border-zinc-800 bg-zinc-900 px-3 text-[12px] text-white placeholder:text-zinc-600 focus:border-zinc-700 focus:outline-none" />
              <button onClick={addByok} className="h-9 rounded-md bg-white px-3 text-[12px] font-semibold text-black hover:bg-zinc-200">{t.settingsPage.addKey}</button>
            </div>
            <div className="mt-3 space-y-1">
              {byokKeys.map((k:any)=>(
                <div key={k.id} className="flex items-center justify-between rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-[12px]">
                  <span className="text-zinc-300">{k.provider} • {k.keyPrefix}••••</span>
                  <span className="text-[11px] text-zinc-500">{new Date(k.createdAt).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
            <p className="mt-3 text-[11px] text-zinc-500">{t.settingsPage.byokNote}</p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-6">
            <h3 className="text-[14px] font-semibold text-white flex items-center gap-2"><Download className="h-4 w-4" /> {t.settingsPage.exportData}</h3>
            <p className="mt-1 text-[12px] text-zinc-500">{t.settingsPage.exportDesc}</p>
            <button onClick={exportCsv} className="mt-3 rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-[12px] text-white hover:bg-zinc-800">
              {t.activityPage.exportCsv}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
