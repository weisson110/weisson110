"use client";
import { useState, useRef, useEffect } from "react";
import { models } from "@/lib/models";
import { Send, Settings2, Copy, Trash2, Bot, User } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useI18n } from "@/components/I18nProvider";

type Message = { role: "user" | "assistant"; content: string };

export default function ChatClient() {
  const searchParams = useSearchParams();
  const initialModel = searchParams.get("model") ? decodeURIComponent(searchParams.get("model")!) : models[1].id;
  const [selectedModel, setSelectedModel] = useState(initialModel);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { t } = useI18n();

  useEffect(() => {
    setMessages([{ role: "assistant", content: t.chat.welcome }]);
  }, [t.chat.welcome]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    if (!input.trim()) return;
    const userMsg: Message = { role: "user", content: input };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);

    setTimeout(() => {
      const model = models.find((x) => x.id === selectedModel);
      const reply = `This is a simulated response from **${model?.name || selectedModel}**.\n\nYou said: "${userMsg.content}"\n\nIn real OpenRouter, this would route to ${model?.provider}'s API with your API key, handle fallbacks, streaming, caching, etc.\n\nFeatures demonstrated:\n- OpenAI-compatible chat endpoint\n- Model routing (${model?.id})\n- Token counting\n- Streaming support\n\nTry selecting a different model above!`;
      setMessages((m) => [...m, { role: "assistant", content: reply }]);
      setLoading(false);
    }, 800 + Math.random() * 600);
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
              {m.provider} / {m.name}
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
                      <span className="text-[13px] font-semibold text-white">{m.role === "user" ? t.chat.you : models.find((x) => x.id === selectedModel)?.name || "Assistant"}</span>
                      {m.role === "assistant" && (
                        <span className="rounded bg-zinc-800 px-1.5 py-0.5 text-[10px] text-zinc-400">{selectedModel}</span>
                      )}
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

        <div className="hidden w-[300px] shrink-0 border-l border-zinc-800 bg-zinc-950/50 p-4 lg:block">
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
            <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-3">
              <div className="text-[11px] font-medium text-white">{t.chat.estimatedCost}</div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-[18px] font-semibold text-white">$0.0023</span>
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
