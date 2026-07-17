"use client";
import { useState, useEffect } from "react";
import { Key, Copy, Eye, EyeOff, Trash2, Plus, AlertTriangle } from "lucide-react";
import { useI18n } from "@/components/I18nProvider";

type ApiKey = {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  lastUsedAt: string | null;
  usageUsd: number;
};

export default function KeysPage() {
  const [showKey, setShowKey] = useState<string | null>(null);
  const [newlyCreated, setNewlyCreated] = useState<ApiKey | null>(null);
  const { t } = useI18n();
  const [keys, setKeys] = useState<ApiKey[]>([]);

  useEffect(() => {
    fetch("/api/v1/keys").then(r=>r.json()).then(d=>{
      // Map to display format
      setKeys(d.data.map((k:any)=>({
        id: k.id,
        name: k.name,
        key: k.key || `${k.keyPrefix}••••••••••••••${(k.key||'').slice(-4)}`,
        createdAt: k.createdAt,
        lastUsedAt: k.lastUsedAt,
        usageUsd: k.usageUsd,
      })));
    });
  }, []);

  const createKey = async () => {
    const res = await fetch("/api/v1/keys", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: `Key ${keys.length+1}` }) });
    const data = await res.json();
    const fullKey = data.data.key || data.data.fullKey;
    // Show once modal
    setNewlyCreated({ id: data.data.id, name: data.data.name, key: fullKey, createdAt: data.data.createdAt, lastUsedAt: null, usageUsd: 0 });
    // Add masked to list
    setKeys([{ id: data.data.id, name: data.data.name, key: `${fullKey.slice(0,12)}••••••••••••••${fullKey.slice(-4)}`, createdAt: data.data.createdAt, lastUsedAt: null, usageUsd: 0 }, ...keys]);
  };

  return (
    <div className="mx-auto max-w-[1000px] px-4 py-8 sm:px-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[24px] font-semibold text-white">{t.keysPage.title}</h1>
          <p className="mt-1 text-[13px] text-zinc-400">{t.keysPage.desc}</p>
        </div>
        <button onClick={createKey} className="inline-flex items-center gap-1.5 rounded-md bg-white px-3 py-2 text-[13px] font-semibold text-black hover:bg-zinc-200">
          <Plus className="h-4 w-4" /> {t.keysPage.createKey}
        </button>
      </div>

      {newlyCreated && (
        <div className="mt-6 rounded-xl border border-amber-800/50 bg-amber-950/20 p-4">
          <div className="flex items-center gap-2 text-amber-200"><AlertTriangle className="h-4 w-4" /><span className="text-[13px] font-medium">{t.keysPage.showOnceWarning}</span></div>
          <code className="mt-2 block rounded bg-zinc-950 p-3 font-mono text-[13px] text-white break-all">{newlyCreated.key}</code>
          <div className="mt-2 flex gap-2">
            <button onClick={()=>{ navigator.clipboard.writeText(newlyCreated.key); }} className="rounded-md bg-white px-3 py-1.5 text-[12px] font-medium text-black">{t.keysPage.copied}</button>
            <button onClick={()=>setNewlyCreated(null)} className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-[12px] text-zinc-300">Close, I copied</button>
          </div>
        </div>
      )}

      <div className="mt-8 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/30">
        <div className="divide-y divide-zinc-800">
          {keys.map((k) => (
            <div key={k.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900">
                  <Key className="h-4 w-4 text-zinc-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-medium text-white">{k.name}</span>
                    <span className="rounded bg-zinc-800 px-1.5 py-0.5 text-[10px] text-zinc-400">{k.id}</span>
                  </div>
                  <div className="mt-1 flex items-center gap-2 font-mono text-[12px] text-zinc-400">
                    <span>{showKey === k.id ? k.key : `${k.key.slice(0, 18)}••••••••••••••••••••••••••••••${k.key.slice(-6)}`}</span>
                    <button onClick={() => setShowKey(showKey === k.id ? null : k.id)} className="rounded p-1 hover:bg-zinc-800">
                      {showKey === k.id ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </button>
                    <button onClick={() => navigator.clipboard.writeText(k.key)} className="rounded p-1 hover:bg-zinc-800">
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="mt-1.5 flex gap-3 text-[11px] text-zinc-500">
                    <span>{t.keysPage.created} {new Date(k.createdAt).toLocaleDateString()}</span>
                    <span>• {t.keysPage.lastUsed} {k.lastUsedAt ? new Date(k.lastUsedAt).toLocaleString() : "Never"}</span>
                    <span>• ${k.usageUsd.toFixed(2)} {t.keysPage.used}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="rounded-md border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-[12px] text-zinc-400 hover:bg-zinc-800 hover:text-white">
                  {t.keysPage.edit}
                </button>
                <button onClick={async()=>{
                  await fetch(`/api/v1/keys/${k.id}`, { method: "DELETE" });
                  setKeys(keys.filter((x) => x.id !== k.id));
                }} className="rounded-md border border-red-900/50 bg-red-950/30 px-3 py-1.5 text-[12px] text-red-400 hover:bg-red-950/50">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-5">
          <h3 className="text-[13px] font-semibold text-white">{t.keysPage.quickstart}</h3>
          <pre className="mt-3 overflow-x-auto rounded-lg bg-zinc-950 p-3 text-[11px] text-zinc-300">
            <code>{`curl https://openrouter.ai/api/v1/chat/completions \\
  -H "Authorization: Bearer $OPENROUTER_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "openai/gpt-4o",
    "messages": [{"role": "user", "content": "Hello"}]
  }'`}</code>
          </pre>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-5">
          <h3 className="text-[13px] font-semibold text-white">{t.keysPage.billing}</h3>
          <div className="mt-3">
            <div className="text-[24px] font-semibold text-white">$12.34</div>
            <div className="text-[12px] text-zinc-500">{t.keysPage.currentUsage}</div>
            <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-zinc-800">
              <div className="h-full w-[34%] rounded-full bg-white" />
            </div>
            <div className="mt-2 flex justify-between text-[11px] text-zinc-500">
              <span>$0</span>
              <span>$50 {t.keysPage.creditsIncluded}</span>
            </div>
          </div>
          <div className="mt-4 rounded-lg bg-amber-950/20 p-3 text-[11px] text-amber-200/70">
            {t.keysPage.demoNote}
          </div>
        </div>
      </div>
    </div>
  );
}
