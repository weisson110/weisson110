"use client";
import { useEffect, useState } from "react";
import { useI18n, formatCurrency } from "@/components/I18nProvider";
import { CreditCard, Coins, TrendingUp, Plus } from "lucide-react";

export default function CreditsPage() {
  const { t, currency, setCurrency } = useI18n();
  const [credits, setCredits] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetch("/api/v1/credits")
      .then((r) => r.json())
      .then((d) => {
        setCredits(d.data);
        setLoading(false);
      });
  }, []);

  const addCredits = async (amount: number) => {
    setAdding(true);
    const res = await fetch("/api/v1/credits", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ amount }) });
    const data = await res.json();
    setCredits(data.data);
    setAdding(false);
  };

  if (loading) return <div className="p-8 text-sm text-zinc-500">Loading...</div>;

  return (
    <div className="mx-auto max-w-[1100px] px-4 py-8 sm:px-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-[24px] font-semibold text-white">{t.creditsPage.title}</h1>
        <p className="text-[13px] text-zinc-400">{t.creditsPage.desc}</p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 md:col-span-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-zinc-500"><Coins className="h-4 w-4" /><span className="text-[11px] uppercase tracking-wider">{t.creditsPage.balance}</span></div>
            <div className="flex gap-1 rounded-md border border-zinc-800 bg-zinc-900 p-1">
              {(["USD", "MYR"] as const).map((c) => (
                <button key={c} onClick={() => setCurrency(c)} className={`rounded px-2 py-0.5 text-[11px] ${currency === c ? "bg-white text-black" : "text-zinc-400"}`}>{c}</button>
              ))}
            </div>
          </div>
          <div className="mt-3 text-[32px] font-semibold text-white">{formatCurrency(credits.balance, currency, "en" as any)}</div>
          <div className="mt-1 text-[12px] text-zinc-500">{formatCurrency(credits.totalUsed, currency, "en" as any)} {t.keysPage.used} • {formatCurrency(credits.totalPurchased, currency, "en" as any)} purchased</div>
          <div className="mt-2 text-[11px] text-zinc-500">{t.creditsPage.rateNote}</div>
          
          <div className="mt-4 flex gap-2">
            {[5, 20, 50].map((amt) => (
              <button key={amt} disabled={adding} onClick={() => addCredits(amt)} className="rounded-md bg-white px-3 py-1.5 text-[12px] font-semibold text-black hover:bg-zinc-200 disabled:opacity-50">
                +{formatCurrency(amt, currency, "en" as any)}
              </button>
            ))}
          </div>
          <button onClick={() => addCredits(10)} disabled={adding} className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-md border border-zinc-800 bg-zinc-900 py-2 text-[13px] text-white hover:bg-zinc-800">
            <Plus className="h-4 w-4" /> {t.creditsPage.addCredits}
          </button>

          <div className="mt-6 space-y-2">
            <div className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">{t.creditsPage.localPayments}</div>
            <button onClick={() => addCredits(20)} className="flex w-full items-center justify-between rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-[12px] text-white hover:bg-zinc-800">
              <span>{t.creditsPage.billplz}</span><span className="text-[10px] text-zinc-500">FPX</span>
            </button>
            <button onClick={() => addCredits(20)} className="flex w-full items-center justify-between rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-[12px] text-white hover:bg-zinc-800">
              <span>{t.creditsPage.toyyibpay}</span><span className="text-[10px] text-zinc-500">FPX</span>
            </button>
            <button onClick={() => addCredits(20)} className="flex w-full items-center justify-between rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-[12px] text-white hover:bg-zinc-800">
              <span>{t.creditsPage.stripe}</span><span className="text-[10px] text-zinc-500">Card</span>
            </button>
          </div>

          <div className="mt-4 rounded-lg bg-amber-950/20 p-3 text-[11px] text-amber-200/70">{t.creditsPage.mockMode}</div>
          <div className="mt-2 text-[11px] text-zinc-500">{t.creditsPage.buyCreditsNote}</div>
        </div>

        <div className="md:col-span-2 space-y-4">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-5">
            <h3 className="text-[13px] font-semibold text-white flex items-center gap-2"><TrendingUp className="h-4 w-4" /> {t.creditsPage.usageBreakdown}</h3>
            <div className="mt-4 grid grid-cols-3 gap-4 text-[12px]">
              <div><div className="text-zinc-500">{t.creditsPage.inputTokens}</div><div className="mt-1 text-[18px] font-semibold text-white">12,450</div></div>
              <div><div className="text-zinc-500">{t.creditsPage.outputTokens}</div><div className="mt-1 text-[18px] font-semibold text-white">8,320</div></div>
              <div><div className="text-zinc-500">{t.creditsPage.totalCost}</div><div className="mt-1 text-[18px] font-semibold text-white">{formatCurrency(credits.totalUsed, currency, "en" as any)}</div></div>
            </div>
            <div className="mt-6 h-2 w-full overflow-hidden rounded-full bg-zinc-800">
              <div className="h-full w-[68%] rounded-full bg-white" />
            </div>
            <div className="mt-2 flex justify-between text-[11px] text-zinc-500"><span>{t.creditsPage.thisMonth}</span><span>{t.creditsPage.lastMonth}</span></div>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-5">
            <h3 className="text-[13px] font-semibold text-white flex items-center gap-2"><CreditCard className="h-4 w-4" /> {t.creditsPage.invoices}</h3>
            <div className="mt-4 space-y-2">
              {credits.transactions.map((tx: any) => (
                <div key={tx.id} className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-3">
                  <div>
                    <div className="text-[13px] text-white">{tx.description}</div>
                    <div className="text-[11px] text-zinc-500">{new Date(tx.createdAt).toLocaleDateString()}</div>
                  </div>
                  <div className={`text-[13px] font-medium ${tx.amountUsd > 0 ? "text-emerald-400" : "text-zinc-300"}`}>{tx.amountUsd > 0 ? "+" : ""}{formatCurrency(tx.amountUsd, currency, "en" as any)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
