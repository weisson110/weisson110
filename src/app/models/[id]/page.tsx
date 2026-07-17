"use client";
import { useParams } from "next/navigation";
import { models } from "@/lib/models";
import Link from "next/link";
import { ArrowLeft, Copy, Check, Globe, Clock, Cpu, DollarSign, BarChart3 } from "lucide-react";
import { useState } from "react";

export default function ModelDetailPage() {
  const params = useParams();
  const id = decodeURIComponent(params.id as string);
  const [copied, setCopied] = useState(false);

  const model = models.find((m) => m.id === id) || models[0];

  const exampleCode = `import OpenAI from "openai"

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
})

const res = await client.chat.completions.create({
  model: "${model.id}",
  messages: [{ role: "user", content: "Explain quantum computing" }],
  temperature: 0.7,
})`;

  const copyCode = () => {
    navigator.clipboard.writeText(exampleCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8">
      <Link href="/models" className="inline-flex items-center gap-1.5 text-[13px] text-zinc-400 hover:text-white">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to models
      </Link>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* Main */}
        <div>
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 text-xl font-bold">
              {model.providerIcon}
            </div>
            <div>
              <h1 className="text-[24px] font-semibold text-white">{model.name}</h1>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-[12px] text-zinc-400">
                <span className="rounded bg-zinc-800 px-1.5 py-0.5">{model.provider}</span>
                <span>{model.id}</span>
                <span className="h-3 w-px bg-zinc-800" />
                <span className="flex items-center gap-1"><Globe className="h-3 w-3" /> {model.stats.uptime} uptime</span>
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {model.stats.latency}ms</span>
              </div>
              <p className="mt-3 max-w-2xl text-[13.5px] leading-relaxed text-zinc-300">{model.description}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {model.tags.map((t) => (
                  <span key={t} className="rounded-full border border-zinc-800 bg-zinc-900 px-2.5 py-1 text-[11px] text-zinc-400">
                    {t}
                  </span>
                ))}
                {model.modality.map((m) => (
                  <span key={m} className="rounded-full bg-white px-2.5 py-1 text-[11px] font-medium text-black">
                    {m}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Code */}
          <div className="mt-8 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50">
            <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900 px-4 py-2.5">
              <span className="text-[12px] font-medium text-zinc-300">Integration</span>
              <button
                onClick={copyCode}
                className="inline-flex items-center gap-1.5 rounded-md border border-zinc-700 bg-zinc-800 px-2.5 py-1 text-[11px] text-zinc-300 hover:bg-zinc-700"
              >
                {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
            <pre className="overflow-x-auto p-4 text-[12px] leading-relaxed text-zinc-300">
              <code>{exampleCode}</code>
            </pre>
          </div>

          {/* Capabilities */}
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              { icon: Cpu, label: "Context", value: `${model.contextLength.toLocaleString()} tokens` },
              { icon: DollarSign, label: "Input / Output", value: `$${model.pricing.input} / $${model.pricing.output} per 1M` },
              { icon: BarChart3, label: "Throughput", value: `${model.stats.throughput} tok/s • ${model.stats.latency}ms` },
            ].map((item) => (
              <div key={item.label} className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-4">
                <div className="flex items-center gap-2 text-zinc-500">
                  <item.icon className="h-3.5 w-3.5" />
                  <span className="text-[11px] uppercase tracking-wider">{item.label}</span>
                </div>
                <div className="mt-2 text-[13px] font-medium text-white">{item.value}</div>
              </div>
            ))}
          </div>

          {/* Providers */}
          <div className="mt-8">
            <h3 className="text-[14px] font-semibold text-white">Providers</h3>
            <div className="mt-3 space-y-2">
              {[model.provider, "Together", "Fireworks", "Groq"].slice(0, 3).map((p, i) => (
                <div key={p} className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900/40 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span className="text-[13px] text-white">{p}</span>
                    {i === 0 && <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] text-emerald-400">Primary</span>}
                  </div>
                  <div className="flex items-center gap-4 text-[11px] text-zinc-500">
                    <span>120 tok/s</span>
                    <span>98.2% uptime</span>
                    <span className="text-white">$ {model.pricing.input}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
            <h3 className="text-[13px] font-semibold text-white">Try this model</h3>
            <Link
              href={`/chat?model=${encodeURIComponent(model.id)}`}
              className="mt-3 inline-flex w-full items-center justify-center rounded-md bg-white py-2.5 text-[13px] font-semibold text-black hover:bg-zinc-200"
            >
              Open in Playground
            </Link>
            <div className="mt-4 space-y-3 text-[12px]">
              <div className="flex justify-between">
                <span className="text-zinc-500">Context length</span>
                <span className="text-white">{model.contextLength.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Training cutoff</span>
                <span className="text-white">2024-06</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Function calling</span>
                <span className="text-emerald-400">Supported</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Structured output</span>
                <span className="text-emerald-400">Supported</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-5">
            <h3 className="text-[13px] font-semibold text-white">API Endpoint</h3>
            <code className="mt-2 block rounded bg-zinc-950 p-2 text-[11px] text-zinc-400">POST https://openrouter.ai/api/v1/chat/completions</code>
            <h4 className="mt-4 text-[12px] font-medium text-white">Headers</h4>
            <div className="mt-2 space-y-1 text-[11px] font-mono text-zinc-500">
              <div>Authorization: Bearer &lt;key&gt;</div>
              <div>HTTP-Referer: &lt;your site&gt;</div>
              <div>X-Title: &lt;your app&gt;</div>
            </div>
          </div>

          <div className="rounded-xl border border-amber-900/30 bg-amber-950/20 p-4">
            <p className="text-[12px] leading-relaxed text-amber-200/80">
              This is a clone demo. Real openrouter.ai provides billing, key management, analytics, and routing to actual providers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
