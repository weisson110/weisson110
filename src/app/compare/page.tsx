"use client";
import { useState } from "react";
import { useI18n } from "@/components/I18nProvider";
import { models } from "@/lib/models";
import { Zap, Clock, Coins } from "lucide-react";

type CompareResult = {
  model: string;
  provider: string;
  content: string;
  latency: number;
  cost: number;
  tokens: number;
};

export default function ComparePage() {
  const { t } = useI18n();
  const [selectedModels, setSelectedModels] = useState<string[]>([models[0].id, models[1].id]);
  const [prompt, setPrompt] = useState("");
  const [results, setResults] = useState<CompareResult[]>([]);
  const [loading, setLoading] = useState(false);

  const toggleModel = (id: string) => {
    if (selectedModels.includes(id)) {
      if (selectedModels.length > 1) setSelectedModels(selectedModels.filter(m => m !== id));
    } else {
      if (selectedModels.length < 3) setSelectedModels([...selectedModels, id]);
    }
  };

  const doCompare = async () => {
    if (!prompt.trim() || selectedModels.length === 0) return;
    setLoading(true);
    setResults([]);

    // Call mock API for each model in parallel
    const promises = selectedModels.map(async (modelId) => {
      const start = Date.now();
      try {
        const res = await fetch("/api/v1/chat/completions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ model: modelId, messages: [{ role: "user", content: prompt }] }),
        });
        const data = await res.json();
        const latency = Date.now() - start;
        const model = models.find(m => m.id === modelId);
        return {
          model: modelId,
          provider: model?.provider || "Mock",
          content: data.choices?.[0]?.message?.content || "No response",
          latency,
          cost: (data.usage?.total_tokens || 200) * 0.00001,
          tokens: data.usage?.total_tokens || 200,
        } as CompareResult;
      } catch {
        return {
          model: modelId,
          provider: "Error",
          content: "Failed to get response",
          latency: Date.now() - start,
          cost: 0,
          tokens: 0,
        } as CompareResult;
      }
    });

    const res = await Promise.all(promises);
    setResults(res);
    setLoading(false);
  };

  const myTemplates = [
    { label: "BM: Ringkasan", prompt: "Buat ringkasan dalam Bahasa Melayu: " },
    { label: "BM: Karangan SPM", prompt: "Tulis karangan SPM 300 patah tentang kepentingan teknologi: " },
    { label: "EN: Explain", prompt: "Explain in simple terms: " },
    { label: "ZH: 总结", prompt: "用中文总结以下内容：" },
  ];

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-[24px] font-semibold text-white">{t.comparePage.title}</h1>
        <p className="text-[13px] text-zinc-400">{t.comparePage.desc}</p>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[320px_1fr]">
        <div className="space-y-4">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-4">
            <h3 className="text-[13px] font-semibold text-white">{t.comparePage.selectModels} ({selectedModels.length}/3)</h3>
            <div className="mt-3 space-y-1 max-h-[400px] overflow-y-auto">
              {models.slice(0, 12).map((m) => (
                <label key={m.id} className={`flex cursor-pointer items-center gap-2 rounded-md border px-2.5 py-2 text-[12px] ${selectedModels.includes(m.id) ? "border-white bg-white text-black" : "border-zinc-800 bg-zinc-900 text-zinc-400 hover:bg-zinc-800"}`}>
                  <input type="checkbox" checked={selectedModels.includes(m.id)} onChange={() => toggleModel(m.id)} className="hidden" />
                  <span className="flex h-5 w-5 items-center justify-center rounded bg-zinc-800 text-[10px]">{m.providerIcon}</span>
                  <span className="flex-1 truncate">{m.name}</span>
                  <span className="text-[10px] opacity-70">${m.pricing.input}/M</span>
                </label>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-4">
            <h3 className="text-[12px] font-semibold text-white">{t.comparePage.myTemplates}</h3>
            <div className="mt-2 grid gap-1.5">
              {myTemplates.map((tpl) => (
                <button key={tpl.label} onClick={() => setPrompt(tpl.prompt)} className="rounded-md border border-zinc-800 bg-zinc-900 px-2.5 py-1.5 text-left text-[11px] text-zinc-400 hover:bg-zinc-800 hover:text-white">
                  {tpl.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
            <label className="text-[12px] font-medium text-white">{t.comparePage.prompt}</label>
            <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder={t.comparePage.promptPlaceholder} rows={4} className="mt-2 w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-[13px] text-white placeholder:text-zinc-600 focus:border-zinc-700 focus:outline-none" />
            <button onClick={doCompare} disabled={loading || !prompt.trim()} className="mt-3 inline-flex h-9 items-center justify-center rounded-md bg-white px-4 text-[13px] font-semibold text-black hover:bg-zinc-200 disabled:opacity-40">
              {loading ? t.comparePage.comparing : t.comparePage.compare}
            </button>
          </div>

          {results.length === 0 && !loading && (
            <div className="rounded-xl border border-dashed border-zinc-800 bg-zinc-900/20 p-12 text-center text-[13px] text-zinc-500">
              {t.comparePage.noResults}
            </div>
          )}

          {results.length > 0 && (
            <div>
              <h3 className="mb-3 text-[13px] font-semibold text-white">{t.comparePage.results}</h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {results.map((r) => (
                  <div key={r.model} className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[12px] font-medium text-white truncate">{r.model}</span>
                      <span className="rounded bg-zinc-800 px-1.5 py-0.5 text-[10px] text-zinc-400">{r.provider}</span>
                    </div>
                    <div className="mt-3 whitespace-pre-wrap text-[12.5px] leading-relaxed text-zinc-300">{r.content.slice(0, 600)}</div>
                    <div className="mt-4 grid grid-cols-3 gap-2 border-t border-zinc-800 pt-3 text-[11px]">
                      <div><div className="flex items-center gap-1 text-zinc-500"><Clock className="h-3 w-3" /> {t.comparePage.latency}</div><div className="mt-1 text-white">{r.latency}ms</div></div>
                      <div><div className="flex items-center gap-1 text-zinc-500"><Coins className="h-3 w-3" /> {t.comparePage.cost}</div><div className="mt-1 text-white">${r.cost.toFixed(4)}</div></div>
                      <div><div className="flex items-center gap-1 text-zinc-500"><Zap className="h-3 w-3" /> {t.comparePage.tokens}</div><div className="mt-1 text-white">{r.tokens}</div></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
