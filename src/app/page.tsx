"use client";
import { useState } from "react";
import { models } from "@/lib/models";
import ModelCard from "@/components/ModelCard";
import Link from "next/link";
import { ArrowRight, Zap, Shield, Code2, Globe, Layers, Cpu, DollarSign, Key, BarChart3, Coins } from "lucide-react";
import { useI18n } from "@/components/I18nProvider";

export default function HomePage() {
  const [search, setSearch] = useState("");
  const { t } = useI18n();

  const filtered = models.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.provider.toLowerCase().includes(search.toLowerCase()) ||
      m.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-40" />
        <div className="glow absolute -top-[300px] left-1/2 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500" />
        <div className="glow absolute -top-[200px] right-[10%] h-[400px] w-[400px] rounded-full bg-gradient-to-br from-blue-500 to-cyan-500" />

        <div className="relative mx-auto max-w-[1440px] px-4 pb-12 pt-16 sm:px-6 lg:px-8 lg:pt-24">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/50 px-3 py-1 text-[12px] text-zinc-400 backdrop-blur">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
              {t.home.badge}
            </div>

            <h1 className="bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-4xl font-semibold tracking-tight text-transparent sm:text-5xl lg:text-[56px] lg:leading-[1.05]">
              {t.home.title1}
              <br />
              {t.home.title2}
            </h1>

            <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-zinc-400 sm:text-[16px]">
              {t.home.subtitle}
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/models"
                className="inline-flex h-[40px] items-center gap-2 rounded-md bg-white px-5 text-[14px] font-semibold text-black transition hover:bg-zinc-200"
              >
                {t.home.exploreModels} <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/chat"
                className="inline-flex h-[40px] items-center gap-2 rounded-md border border-zinc-800 bg-zinc-900/80 px-5 text-[14px] font-medium text-white backdrop-blur transition hover:bg-zinc-800"
              >
                <Code2 className="h-4 w-4" />
                {t.home.tryPlayground}
              </Link>
              <Link
                href="/compare"
                className="inline-flex h-[40px] items-center gap-2 rounded-md border border-zinc-800 bg-zinc-900/80 px-5 text-[14px] font-medium text-white backdrop-blur transition hover:bg-zinc-800"
              >
                <BarChart3 className="h-4 w-4" />
                {t.home.tryCompare || "Compare"}
              </Link>
            </div>

            <div className="mt-12 grid grid-cols-3 gap-6 border-y border-zinc-800/80 py-8 text-left sm:gap-8">
              <div>
                <div className="text-[22px] font-semibold text-white">200+</div>
                <div className="mt-1 text-[12px] text-zinc-500">{t.home.statModels}</div>
              </div>
              <div>
                <div className="text-[22px] font-semibold text-white">50+</div>
                <div className="mt-1 text-[12px] text-zinc-500">{t.home.statProviders}</div>
              </div>
              <div>
                <div className="text-[22px] font-semibold text-white">$0</div>
                <div className="mt-1 text-[12px] text-zinc-500">{t.home.statStart}</div>
              </div>
            </div>
          </div>

          <div className="mx-auto mt-14 max-w-4xl">
            <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50 backdrop-blur">
              <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/80 px-4 py-2.5">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
                </div>
                <span className="text-[11px] font-medium text-zinc-500">{t.home.codeHeader}</span>
                <div className="h-2 w-8" />
              </div>
              <div className="grid lg:grid-cols-[1.2fr_0.8fr]">
                <pre className="overflow-x-auto p-5 text-[12.5px] leading-relaxed text-zinc-300">
                  <code>{`import OpenAI from "openai"

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: "<OPENROUTER_API_KEY>",
  defaultHeaders: {
    "HTTP-Referer": "<YOUR_SITE_URL>",
    "X-Title": "<YOUR_SITE_NAME>",
  },
})

const completion = await openai.chat.completions.create({
  model: "anthropic/claude-3.5-sonnet",
  messages: [{ role: "user", content: "Hello!" }],
})

console.log(completion.choices[0].message)`}</code>
                </pre>
                <div className="border-t border-zinc-800 bg-zinc-950/50 p-5 lg:border-l lg:border-t-0">
                  <h4 className="text-[13px] font-semibold text-white">{t.home.codeTitle}</h4>
                  <ul className="mt-4 space-y-3 text-[12.5px] text-zinc-400">
                    <li className="flex gap-2"><Zap className="h-4 w-4 text-violet-400" /> {t.home.codeFeatures[0]}</li>
                    <li className="flex gap-2"><Shield className="h-4 w-4 text-emerald-400" /> {t.home.codeFeatures[1]}</li>
                    <li className="flex gap-2"><Globe className="h-4 w-4 text-blue-400" /> {t.home.codeFeatures[2]}</li>
                    <li className="flex gap-2"><Layers className="h-4 w-4 text-amber-400" /> {t.home.codeFeatures[3]}</li>
                  </ul>
                  <div className="mt-6 rounded-lg border border-zinc-800 bg-zinc-900 p-3">
                    <div className="text-[11px] font-medium text-zinc-500">{t.home.tokensProcessed}</div>
                    <div className="mt-1 text-[20px] font-semibold text-white">12.4T</div>
                    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
                      <div className="h-full w-[78%] rounded-full bg-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-6 border-b border-zinc-900 py-8 opacity-60">
          {["Linear", "Vercel", "Perplexity", "Superhuman", "Notion", "Retool"].map((brand) => (
            <span key={brand} className="text-[13px] font-semibold tracking-widest text-zinc-500">{brand.toUpperCase()}</span>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-white">{t.home.popularModels}</h2>
            <p className="mt-2 max-w-lg text-[13.5px] text-zinc-400">
              {t.home.popularDesc}
            </p>
          </div>
          <div className="flex gap-2">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t.home.filterPlaceholder}
              className="h-9 w-[260px] rounded-md border border-zinc-800 bg-zinc-900 px-3 text-[13px] placeholder:text-zinc-600 focus:border-zinc-700 focus:outline-none"
            />
            <Link href="/models" className="inline-flex h-9 items-center rounded-md border border-zinc-800 bg-zinc-900 px-3 text-[13px] font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white">
              {t.home.viewAll}
            </Link>
          </div>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.slice(0, 9).map((model) => (
            <ModelCard key={model.id} model={model} />
          ))}
        </div>
      </div>

      <div className="border-t border-zinc-900 bg-zinc-950/50">
        <div className="mx-auto max-w-[1440px] px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-3">
            {t.home.features.map((f: any, idx: number) => {
              const icons = [Cpu, Shield, DollarSign, Coins, BarChart3, Key];
              const Icon = icons[idx] || Cpu;
              const colors = ["text-violet-400", "text-emerald-400", "text-blue-400", "text-amber-400", "text-pink-400", "text-cyan-400"];
              return (
                <div key={f.title} className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-6">
                  <Icon className={`h-5 w-5 ${colors[idx]}`} />
                  <h3 className="mt-4 text-[15px] font-semibold text-white">{f.title}</h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-zinc-400">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
