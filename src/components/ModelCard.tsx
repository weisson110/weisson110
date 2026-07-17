"use client";
import { Model } from "@/lib/models";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function ModelCard({ model }: { model: Model }) {
  return (
    <Link
      href={`/models/${encodeURIComponent(model.id)}`}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 backdrop-blur transition-all hover:border-zinc-700 hover:bg-zinc-900/80"
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-md border border-zinc-800 bg-zinc-900 text-[13px] font-bold text-zinc-300">
            {model.providerIcon}
          </div>
          <div>
            <h3 className="text-[13.5px] font-semibold leading-tight text-white group-hover:text-white">
              {model.name}
            </h3>
            <p className="text-[11px] text-zinc-500">{model.provider} • {model.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
          <span className="text-[11px] text-zinc-500">{model.stats.uptime}</span>
        </div>
      </div>

      {/* Description */}
      <p className="mt-3 line-clamp-2 text-[12.5px] leading-[1.5] text-zinc-400">
        {model.description}
      </p>

      {/* Tags */}
      <div className="mt-3 flex flex-wrap gap-1">
        {model.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-zinc-800 bg-zinc-900 px-2 py-0.5 text-[10px] font-medium text-zinc-400"
          >
            {tag}
          </span>
        ))}
        {model.modality.includes("image") && (
          <span className="rounded-full bg-violet-500/10 px-2 py-0.5 text-[10px] font-medium text-violet-300">
            vision
          </span>
        )}
      </div>

      {/* Stats footer */}
      <div className="mt-4 grid grid-cols-3 gap-2 border-t border-zinc-800/80 pt-3">
        <div>
          <div className="text-[10px] uppercase tracking-wider text-zinc-500">Context</div>
          <div className="mt-0.5 text-[12px] font-medium text-zinc-200">
            {model.contextLength >= 1000000
              ? `${model.contextLength / 1000000}M`
              : `${model.contextLength / 1000}K`}
          </div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-wider text-zinc-500">Input</div>
          <div className="mt-0.5 text-[12px] font-medium text-zinc-200">${model.pricing.input}/M</div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-wider text-zinc-500">Output</div>
          <div className="mt-0.5 text-[12px] font-medium text-zinc-200">${model.pricing.output}/M</div>
        </div>
      </div>

      {/* Throughput */}
      <div className="mt-3 flex items-center gap-3 text-[11px] text-zinc-500">
        <span>{model.stats.throughput} tok/s</span>
        <span className="h-3 w-px bg-zinc-800" />
        <span>{model.stats.latency}ms</span>
        <span className="ml-auto hidden items-center gap-1 text-zinc-400 group-hover:flex">
          View details →
        </span>
      </div>
    </Link>
  );
}
