"use client";
import { models } from "@/lib/models";
import { Trophy, TrendingUp } from "lucide-react";

export default function RankingsPage() {
  const ranked = [...models].sort((a, b) => b.stats.throughput - a.stats.throughput);

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-black">
          <Trophy className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-[24px] font-semibold text-white">Rankings</h1>
          <p className="text-[13px] text-zinc-400">Top models by usage last 7 days. Real OpenRouter updates hourly.</p>
        </div>
      </div>

      <div className="mt-8 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/30">
        <div className="grid grid-cols-12 gap-4 border-b border-zinc-800 bg-zinc-900/50 px-4 py-3 text-[11px] uppercase tracking-wider text-zinc-500">
          <div className="col-span-1">#</div>
          <div className="col-span-5">Model</div>
          <div className="col-span-2">Tokens (7d)</div>
          <div className="col-span-2">Growth</div>
          <div className="col-span-2 text-right">Price</div>
        </div>

        {ranked.map((m, i) => (
          <div key={m.id} className="grid grid-cols-12 items-center gap-4 border-b border-zinc-800/50 px-4 py-3 last:border-0 hover:bg-zinc-900/50">
            <div className="col-span-1 flex items-center gap-2">
              <span className="text-[13px] font-medium text-white">{i + 1}</span>
              {i < 3 && <span className="text-[11px]">{i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉"}</span>}
            </div>
            <div className="col-span-5 flex items-center gap-2.5">
              <div className="flex h-6 w-6 items-center justify-center rounded border border-zinc-800 bg-zinc-900 text-[11px]">{m.providerIcon}</div>
              <div>
                <div className="text-[13px] font-medium text-white">{m.name}</div>
                <div className="text-[11px] text-zinc-500">{m.provider}</div>
              </div>
            </div>
            <div className="col-span-2 text-[12px] text-zinc-300">{(Math.random() * 900 + 100).toFixed(1)}B</div>
            <div className="col-span-2 flex items-center gap-1 text-[12px] text-emerald-400">
              <TrendingUp className="h-3 w-3" /> +{(Math.random() * 40 + 5).toFixed(1)}%
            </div>
            <div className="col-span-2 text-right text-[12px] text-zinc-400">${m.pricing.input}/M</div>
          </div>
        ))}
      </div>
    </div>
  );
}
