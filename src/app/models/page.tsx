"use client";
import { useState, useMemo } from "react";
import { models as allModels, providers, Model } from "@/lib/models";
import ModelCard from "@/components/ModelCard";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ModelsPage() {
  const [query, setQuery] = useState("");
  const [provider, setProvider] = useState("All");
  const [sortBy, setSortBy] = useState<"popular" | "new" | "price" | "context">("popular");
  const [showVisionOnly, setShowVisionOnly] = useState(false);
  const [showFree, setShowFree] = useState(false);

  const filtered = useMemo(() => {
    let res: Model[] = [...allModels];

    if (query) {
      const q = query.toLowerCase();
      res = res.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.provider.toLowerCase().includes(q) ||
          m.id.toLowerCase().includes(q) ||
          m.description.toLowerCase().includes(q) ||
          m.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (provider !== "All") {
      res = res.filter((m) => m.provider === provider);
    }

    if (showVisionOnly) {
      res = res.filter((m) => m.modality.includes("image"));
    }

    if (showFree) {
      res = res.filter((m) => m.pricing.input === 0);
    }

    if (sortBy === "price") {
      res.sort((a, b) => a.pricing.input - b.pricing.input);
    } else if (sortBy === "context") {
      res.sort((a, b) => b.contextLength - a.contextLength);
    } else if (sortBy === "new") {
      res.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return res;
  }, [query, provider, sortBy, showVisionOnly, showFree]);

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col gap-4 py-6">
        <h1 className="text-[28px] font-semibold tracking-tight text-white">Models</h1>
        <p className="max-w-2xl text-[13.5px] text-zinc-400">
          Browse 200+ models across 50+ providers. One API key, OpenAI compatible, with fallbacks and load balancing.
          <span className="ml-2 inline-flex items-center rounded bg-zinc-800 px-1.5 py-0.5 text-[11px] text-zinc-400">
            {filtered.length} models
          </span>
        </p>
      </div>

      {/* Filters Bar */}
      <div className="sticky top-[56px] z-20 -mx-4 border-y border-zinc-800/80 bg-zinc-950/80 px-4 py-3 backdrop-blur-xl sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 items-center gap-2">
            <div className="relative flex-1 lg:max-w-[360px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name, provider, capability..."
                className="h-9 w-full rounded-md border border-zinc-800 bg-zinc-900 pl-9 pr-8 text-[13px] placeholder:text-zinc-600 focus:border-zinc-700 focus:outline-none"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-zinc-500 hover:text-white"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            <div className="hidden items-center gap-1.5 lg:flex">
              <div className="h-5 w-px bg-zinc-800" />
              <label className="flex items-center gap-1.5 text-[12px] text-zinc-400">
                <input
                  type="checkbox"
                  checked={showVisionOnly}
                  onChange={(e) => setShowVisionOnly(e.target.checked)}
                  className="rounded border-zinc-700 bg-zinc-900"
                />
                Vision
              </label>
              <label className="flex items-center gap-1.5 text-[12px] text-zinc-400">
                <input
                  type="checkbox"
                  checked={showFree}
                  onChange={(e) => setShowFree(e.target.checked)}
                  className="rounded border-zinc-700 bg-zinc-900"
                />
                Free
              </label>
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto">
            <div className="flex items-center gap-1 rounded-md border border-zinc-800 bg-zinc-900 p-1">
              {providers.slice(0, 6).map((p) => (
                <button
                  key={p}
                  onClick={() => setProvider(p)}
                  className={cn(
                    "rounded px-2.5 py-1 text-[12px] font-medium transition-colors",
                    provider === p
                      ? "bg-white text-black"
                      : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                  )}
                >
                  {p}
                </button>
              ))}
            </div>

            <div className="ml-2 flex items-center gap-1.5">
              <SlidersHorizontal className="h-3.5 w-3.5 text-zinc-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="h-8 rounded-md border border-zinc-800 bg-zinc-900 px-2 text-[12px] text-zinc-300 focus:border-zinc-700 focus:outline-none"
              >
                <option value="popular">Top monthly</option>
                <option value="new">Newest</option>
                <option value="price">Lowest price</option>
                <option value="context">Longest context</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((m) => (
          <ModelCard key={m.id} model={m} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-20 text-center">
          <p className="text-sm text-zinc-500">No models match your filters</p>
          <button
            onClick={() => {
              setQuery("");
              setProvider("All");
              setShowVisionOnly(false);
              setShowFree(false);
            }}
            className="mt-3 text-xs text-white underline"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* Info */}
      <div className="mt-12 grid gap-4 border-t border-zinc-900 pt-8 md:grid-cols-3">
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/30 p-4">
          <h4 className="text-[13px] font-medium text-white">What is context length?</h4>
          <p className="mt-1 text-[12px] text-zinc-400">Maximum tokens model can process in one request. 1K ~ 750 words.</p>
        </div>
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/30 p-4">
          <h4 className="text-[13px] font-medium text-white">Pricing per 1M tokens</h4>
          <p className="mt-1 text-[12px] text-zinc-400">Input = prompt tokens, Output = completion tokens. Pay only what you use.</p>
        </div>
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/30 p-4">
          <h4 className="text-[13px] font-medium text-white">OpenAI Compatible</h4>
          <p className="mt-1 text-[12px] text-zinc-400">Change baseURL to openrouter.ai/api/v1, reuse OpenAI SDK. Drop-in replacement.</p>
        </div>
      </div>
    </div>
  );
}
