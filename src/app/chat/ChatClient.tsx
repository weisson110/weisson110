"use client";
import { useState, useRef, useEffect } from "react";
import { models } from "@/lib/models";
import { Send, Settings2, Copy, Trash2, Bot, User, Sparkles, Coins } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useI18n, formatCurrency } from "@/components/I18nProvider";

type Message = { role: "user" | "assistant"; content: string; cost?: number; model?: string };

export default function ChatClient() {
  const searchParams = useSearchParams();
  const initialModel = searchParams.get("model") ? decodeURIComponent(searchParams.get("model")!) : models[1].id;
  const [selectedModel, setSelectedModel] = useState(initialModel);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [cheaperAlts, setCheaperAlts] = useState<any[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { t, currency } = useI18n();

  useEffect(() => {
    setMessages([{ role: "assistant", content: t.chat.welcome }]);
  }, [t.chat.welcome]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Fetch cheaper alternatives when model changes
  useEffect(() => {
    fetch(`/api/v1/models`).then(()=>{});
    // Mock cheaper alts logic
    const current = models.find(m=>m.id===selectedModel);
    if(current){
      const alts = models.filter(m=>m.pricing.input < current.pricing.input).sort((a,b)=>a.pricing.input-b.pricing.input).slice(0,2).map(m=>({
        id: m.id,
        name: m.name,
        saving: Math.round((1 - m.pricing.input/current.pricing.input)*100),
        price: m.pricing.input,
      }));
      setCheaperAlts(alts);
    }
  }, [selectedModel]);

  const send = async () => {
    if (!input.trim()) return;
    const userMsg: Message = { role: "user", content: input };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: selectedModel, messages: [...messages, userMsg].map(m=>({ role: m.role, content: m.content })) }),
      });
      const data = await res.json();
      const assistantMsg: Message = {
        role: "assistant",
        content: data.choices?.[0]?.message?.content || "No response",
        cost: (data.usage?.total_tokens || 200) * 0.00001,
        model: selectedModel,
      };
      setMessages((m) => [...m, assistantMsg]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", content: "Error generating response" }]);
    }
    setLoading(false);
  };

  return (
    <div className="flex h-[calc(100vh-56px)] flex-col">
      <div className="flex items-center gap-3 border-b border-zinc-800 bg-zinc-950 px-4 py-3">
        <div className="flex items-center gap-2 text-[12px] text-zinc-400">
          <Settings2 className="h-4 w-4" /> {t.chat.modelLabel}
        </div>
        <select
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
          className="h-8 min-w-[240px] rounded-md border border-zinc-800 bg-zinc-900 px-3 text-[13px] text-white focus:border-zinc-700 focus:outline-none"
        >
          {models.map((m) => (
            <option key={m.id} value={m.id}>
              {m.provider} / {m.name} (${m.pricing.input}/M)
            </option>
          ))}
        </select>

        <div className="ml-auto hidden items-center gap-2 md:flex">
          <span className="text-[11px] text-zinc-500">
            {t.chat.context}: {models.find((m) => m.id === selectedModel)?.contextLength.toLocaleString()} {t.chat.tokens}
          </span>
          <div className="h-4 w-px bg-zinc-800" />
          <button
            onClick={() => setMessages([{ role: "assistant", content: t.chat.welcome }])}
            className="inline-flex items-center gap-1 rounded-md border border-zinc-800 bg-zinc-900 px-2.5 py-1 text-[12px] text-zinc-400 hover:bg-zinc-800 hover:text-white"
          >
            <Trash2 className="h-3.5 w-3.5" /> {t.chat.clear}
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex flex-1 flex-col">
          <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
            <div className="mx-auto max-w-3xl space-y-6">
              {messages.map((m, i) => (
                <div key={i} className="flex gap-3">
                  <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md border ${m.role === "user" ? "border-zinc-700 bg-zinc-800" : "border-violet-900/50 bg-violet-950/50"}`}>
                    {m.role === "user" ? <User className="h-4 w-4 text-zinc-400" /> : <Bot className="h-4 w-4 text-violet-400" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-semibold text-white">{m.role === "user" ? t.chat.you : models.find((x) => x.id === (m.model || selectedModel))?.name || "Assistant"}</span>
                      {m.role === "assistant" && (
                        <span className="rounded bg-zinc-800 px-1.5 py-0.5 text-[10px] text-zinc-400">{m.model || selectedModel}</span>
                      )}
                      {m.cost && <span className="text-[10px] text-zinc-500">{formatCurrency(m.cost, currency as any, "en" as any)}</span>}
                    </div>
                    <div className="prose prose-invert mt-2 max-w-none">
                      <p className="whitespace-pre-wrap text-[13.5px] leading-relaxed text-zinc-300">{m.content}</p>
                    </div>
                    {m.role === "assistant" && (
                      <div className="mt-2 flex gap-1">
                        <button className="rounded p-1 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300">
                          <Copy className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex gap-3">
                  <div className="flex h-7 w-7 items-center justify-center rounded-md border border-violet-900/50 bg-violet-950/50">
                    <Bot className="h-4 w-4 animate-pulse text-violet-400" />
                  </div>
                  <div className="flex items-center gap-1 pt-1">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-600" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-600 [animation-delay:0.2s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-600 [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          </div>

          <div className="border-t border-zinc-800 bg-zinc-950 p-4">
            <div className="mx-auto max-w-3xl">
              {(t.chat.templates as any[])?.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-1.5">
                  <span className="flex items-center gap-1 text-[11px] text-zinc-500"><Sparkles className="h-3 w-3" /> {t.chat.promptTemplates}:</span>
                  {(t.chat.templates as any[]).map((tpl: any) => (
                    <button key={tpl.label} onClick={() => setInput(tpl.prompt)} className="rounded-full border border-zinc-800 bg-zinc-900 px-2.5 py-1 text-[11px] text-zinc-400 hover:bg-zinc-800 hover:text-white">
                      {tpl.label}
                    </button>
                  ))}
                </div>
              )}
              <div className="flex items-end gap-2 rounded-xl border border-zinc-800 bg-zinc-900 p-2 focus-within:border-zinc-700">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      send();
                    }
                  }}
                  placeholder={t.chat.placeholder}
                  rows={1}
                  className="max-h-32 min-h-[36px] flex-1 resize-none bg-transparent px-2 py-2 text-[14px] text-white placeholder:text-zinc-600 focus:outline-none"
                />
                <button
                  onClick={send}
                  disabled={!input.trim() || loading}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white text-black hover:bg-zinc-200 disabled:opacity-30"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-2 text-center text-[11px] text-zinc-600">
                {t.chat.demoNote}
              </p>
            </div>
          </div>
        </div>

        <div className="hidden w-[320px] shrink-0 border-l border-zinc-800 bg-zinc-950/50 p-4 lg:block overflow-y-auto">
          <h3 className="text-[12px] font-semibold uppercase tracking-wider text-zinc-500">{t.chat.parameters}</h3>
          <div className="mt-4 space-y-5">
            {[
              { label: t.chat.temperature, value: "0.7", desc: t.chat.descTemp },
              { label: t.chat.topP, value: "1.0", desc: t.chat.descTopP },
              { label: t.chat.maxTokens, value: "1024", desc: t.chat.descMax },
            ].map((p) => (
              <div key={p.label}>
                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-white">{p.label}</span>
                  <span className="rounded bg-zinc-800 px-1.5 py-0.5 text-[11px] text-zinc-400">{p.value}</span>
                </div>
                <input type="range" className="mt-2 w-full accent-white" defaultValue={p.value} />
                <p className="mt-1 text-[11px] text-zinc-600">{p.desc}</p>
              </div>
            ))}

            <div className="rounded-lg border border-amber-900/30 bg-amber-950/20 p-3">
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-amber-200"><Coins className="h-3.5 w-3.5" /> {t.chat.costOptimizer}</div>
              <p className="mt-1 text-[11px] text-amber-200/60">{t.chat.costOptimizerDesc}</p>
              <div className="mt-3 space-y-2">
                {cheaperAlts.map((alt) => (
                  <button key={alt.id} onClick={() => setSelectedModel(alt.id)} className="flex w-full items-center justify-between rounded-md border border-amber-800/30 bg-zinc-900 px-2.5 py-2 text-left hover:bg-zinc-800">
                    <div>
                      <div className="text-[11px] text-white">{alt.name}</div>
                      <div className="text-[10px] text-zinc-500">{formatCurrency(alt.price, currency as any, "en" as any)}/M</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[11px] font-medium text-emerald-400">{alt.saving}% {t.chat.saving}</div>
                      <div className="text-[10px] text-zinc-500">{t.chat.tryCheaper}</div>
                    </div>
                  </button>
                ))}
                {cheaperAlts.length === 0 && <div className="text-[11px] text-zinc-500">Already cheapest model</div>}
              </div>
            </div>

            <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-3">
              <div className="text-[11px] font-medium text-white">{t.chat.estimatedCost}</div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-[18px] font-semibold text-white">{formatCurrency(0.0023, currency as any, "en" as any)}</span>
                <span className="text-[11px] text-zinc-500">{t.chat.thisChat}</span>
              </div>
              <div className="mt-2 h-1 w-full rounded-full bg-zinc-800">
                <div className="h-full w-[45%] rounded-full bg-white" />
              </div>
              <div className="mt-1.5 flex justify-between text-[10px] text-zinc-500">
                <span>342 {t.chat.inputTokens}</span>
                <span>128 {t.chat.output}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
