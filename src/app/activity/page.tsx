"use client";
import { useEffect, useState } from "react";
import { useI18n } from "@/components/I18nProvider";
import { Clock, Coins, Zap, Search } from "lucide-react";

type Generation = {
  id: string;
  model: string;
  provider: string;
  prompt: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  latencyMs: number;
  costUsd: number;
  createdAt: string;
  status: string;
};

export default function ActivityPage() {
  const { t } = useI18n();
  const [gens, setGens] = useState<Generation[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/activity?limit=50")
      .then((r) => r.json())
      .then((data) => {
        setGens(data.data);
        setStats(data.stats);
        setLoading(false);
      });
  }, []);

  const filtered = gens.filter((g) => !query || g.model.toLowerCase().includes(query.toLowerCase()) || g.prompt.toLowerCase().includes(query.toLowerCase()));

  if (loading) return <div className="p-8 text-sm text-zinc-500">Loading...</div>;

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-[24px] font-semibold text-white">{t.activityPage.title}</h1>
        <p className="text-[13px] text-zinc-400">{t.activityPage.desc}</p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
          <div className="flex items-center gap-2 text-zinc-500"><Zap className="h-4 w-4" /><span className="text-[11px] uppercase tracking-wider">{t.activityPage.totalGenerations}</span></div>
          <div className="mt-2 text-[22px] font-semibold text-white">{stats?.totalGens || gens.length}</div>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
          <div className="flex items-center gap-2 text-zinc-500"><Coins className="h-4 w-4" /><span className="text-[11px] uppercase tracking-wider">{t.activityPage.totalTokens}</span></div>
          <div className="mt-2 text-[22px] font-semibold text-white">{stats?.totalTokens?.toLocaleString() || "—"}</div>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
          <div className="flex items-center gap-2 text-zinc-500"><Clock className="h-4 w-4" /><span className="text-[11px] uppercase tracking-wider">{t.activityPage.avgLatency}</span></div>
          <div className="mt-2 text-[22px] font-semibold text-white">{stats?.avgLatency || 0}ms</div>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search prompts, models..." className="h-9 w-full rounded-md border border-zinc-800 bg-zinc-900 pl-9 pr-3 text-[13px] placeholder:text-zinc-600 focus:border-zinc-700 focus:outline-none" />
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/30">
        <div className="grid grid-cols-12 gap-2 border-b border-zinc-800 bg-zinc-900/50 px-4 py-3 text-[11px] uppercase tracking-wider text-zinc-500">
          <div className="col-span-3">{t.activityPage.model}</div>
          <div className="col-span-4">{t.activityPage.prompt}</div>
          <div className="col-span-1">{t.activityPage.tokensField}</div>
          <div className="col-span-1">{t.activityPage.latency}</div>
          <div className="col-span-1">{t.activityPage.cost}</div>
          <div className="col-span-1">{t.activityPage.status}</div>
          <div className="col-span-1">{t.activityPage.time}</div>
        </div>
        {filtered.map((g) => (
          <div key={g.id} className="grid grid-cols-12 gap-2 border-b border-zinc-800/50 px-4 py-3 text-[12px] last:border-0 hover:bg-zinc-900/50">
            <div className="col-span-3 truncate text-white">{g.model}</div>
            <div className="col-span-4 truncate text-zinc-400">{g.prompt}</div>
            <div className="col-span-1 text-zinc-300">{g.totalTokens}</div>
            <div className="col-span-1 text-zinc-400">{g.latencyMs}ms</div>
            <div className="col-span-1 text-zinc-300">${g.costUsd.toFixed(4)}</div>
            <div className="col-span-1"><span className={`rounded px-1.5 py-0.5 text-[10px] ${g.status === "completed" ? "bg-emerald-500/10 text-emerald-400" : "bg-zinc-800 text-zinc-400"}`}>{g.status}</span></div>
            <div className="col-span-1 text-[11px] text-zinc-500">{new Date(g.createdAt).toLocaleTimeString()}</div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="p-8 text-center text-sm text-zinc-500">{t.activityPage.noActivity}</div>
        )}
      </div>
    </div>
  );
}
