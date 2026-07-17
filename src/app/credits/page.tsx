"use client";
import { useEffect, useState } from "react";
import { useI18n, formatCurrency } from "@/components/I18nProvider";
import { CreditCard, Coins, TrendingUp, Plus, Building2, QrCode, Tag, Receipt, Info } from "lucide-react";
import { FPX_BANKS, EWALLETS } from "@/lib/payments/duitnow";

export default function CreditsPage() {
  const { t, currency, setCurrency } = useI18n();
  const [credits, setCredits] = useState<any>(null);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState(20);
  const [selectedProvider, setSelectedProvider] = useState<"billplz" | "toyyibpay" | "tng" | "grabpay" | "duitnow" | "stripe">("billplz");
  const [selectedBank, setSelectedBank] = useState("MAYBANK");
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState<number>(0);
  const [showQr, setShowQr] = useState<{ provider: string; amount: number; url: string } | null>(null);
  const [exchangeRate, setExchangeRate] = useState(4.7);

  useEffect(() => {
    fetch("/api/v1/credits").then(r=>r.json()).then(d=>{ setCredits(d.data); setLoading(false); });
    fetch("/api/v1/invoices").then(r=>r.json()).then(d=>setInvoices(d.data));
    fetch("/api/v1/exchange-rate").then(r=>r.json()).then(d=>setExchangeRate(d.data?.rate || 4.7)).catch(()=>{});
    
    // Check for mock payment success redirect
    const params = new URLSearchParams(window.location.search);
    if(params.get("mock_billplz")==="success" || params.get("mock_toyyibpay")==="success"){
      const amt = parseFloat(params.get("amount") || "20");
      addCredits(amt / 4.7, "Billplz FPX Mock Success");
    }
    if(params.get("payment")==="success"){
      // Show success toast could be added
    }
  }, []);

  const applyPromo = () => {
    const codes: Record<string, number> = { "RAYA50": 0.5, "CNY88": 0.12, "MERDEKA66": 0.34, "WELCOME10": 0.1 };
    const discount = codes[promoCode.toUpperCase()] || 0;
    setPromoApplied(discount);
  };

  const addCredits = async (amountUsd: number, description?: string) => {
    setAdding(true);
    // Apply promo
    const finalAmount = amountUsd * (1 + promoApplied);
    const res = await fetch("/api/v1/credits", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ amount: finalAmount }) });
    const data = await res.json();
    setCredits(data.data);
    // Also create invoice mock
    if(description){
      await fetch("/api/v1/invoices", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ transactionId: `txn_${Date.now()}`, description }) });
      const invRes = await fetch("/api/v1/invoices").then(r=>r.json());
      setInvoices(invRes.data);
    }
    setAdding(false);
    setShowQr(null);
  };

  const createBill = async () => {
    setAdding(true);
    const amountMyr = selectedAmount;
    const amountUsd = amountMyr / exchangeRate;

    if (["tng","grabpay","duitnow","shopeepay"].includes(selectedProvider)) {
      // Show QR mock
      setShowQr({ provider: selectedProvider, amount: amountMyr, url: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=DuitNowQR:${selectedProvider.toUpperCase()}:RM${amountMyr}:${Date.now()}` });
      setAdding(false);
      return;
    }

    // For Billplz/ToyyibPay/Stripe – call backend to create bill, then redirect
    try {
      const res = await fetch("/api/v1/credits/bill", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: amountMyr, provider: selectedProvider, bank: selectedBank, currency: "MYR" }),
      });
      const data = await res.json();
      if (data.data?.url) {
        // In mock mode, url is /credits?mock... -> simulate success
        if (data.data.url.includes("mock")) {
          await addCredits(amountUsd, `${selectedProvider} - RM${amountMyr} - ${selectedBank}`);
        } else {
          window.location.href = data.data.url;
        }
      } else {
        await addCredits(amountUsd, `${selectedProvider} - RM${amountMyr}`);
      }
    } catch {
      await addCredits(amountUsd, `${selectedProvider} - RM${amountMyr} (fallback)`);
    }
    setAdding(false);
  };

  if (loading) return <div className="p-8 text-sm text-zinc-500">Loading...</div>;

  const finalMyr = selectedAmount;
  const finalUsd = finalMyr / exchangeRate;
  const discountedMyr = finalMyr * (1 - promoApplied);

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-[24px] font-semibold text-white">{t.creditsPage.title}</h1>
        <p className="text-[13px] text-zinc-400">{t.creditsPage.desc}</p>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[380px_1fr]">
        {/* Left – Balance & Payments */}
        <div className="space-y-4">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-zinc-500"><Coins className="h-4 w-4" /><span className="text-[11px] uppercase tracking-wider">{t.creditsPage.balance}</span></div>
              <div className="flex gap-1 rounded-md border border-zinc-800 bg-zinc-900 p-1">
                {(["USD", "MYR"] as const).map((c) => (
                  <button key={c} onClick={() => setCurrency(c)} className={`rounded px-2 py-0.5 text-[11px] ${currency === c ? "bg-white text-black" : "text-zinc-400"}`}>{c}</button>
                ))}
              </div>
            </div>
            <div className="mt-3 text-[32px] font-semibold text-white">{formatCurrency(credits.balance, currency, "en" as any)}</div>
            <div className="mt-1 text-[12px] text-zinc-500">{formatCurrency(credits.totalUsed, currency, "en" as any)} used • {formatCurrency(credits.totalPurchased, currency, "en" as any)} purchased</div>
            <div className="mt-2 flex items-center gap-1 text-[11px] text-zinc-500"><Info className="h-3 w-3" /> {t.creditsPage.rateNote} – {exchangeRate.toFixed(2)}</div>
          </div>

          {/* Amount Selection */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-5">
            <h3 className="text-[13px] font-semibold text-white">Select Amount (MYR) – Malaysian Pricing</h3>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {[20, 50, 100, 200, 500, 1000].map((amt) => (
                <button key={amt} onClick={() => setSelectedAmount(amt)} className={`rounded-md border px-3 py-2.5 text-[13px] ${selectedAmount === amt ? "border-white bg-white text-black" : "border-zinc-800 bg-zinc-900 text-zinc-300 hover:bg-zinc-800"}`}>
                  RM{amt}
                  <div className="text-[11px] opacity-70">${(amt/exchangeRate).toFixed(0)}</div>
                </button>
              ))}
            </div>

            <div className="mt-4">
              <label className="text-[11px] text-zinc-500 flex items-center gap-1"><Tag className="h-3 w-3" /> Promo Code (Raya50, CNY88, MERDEKA66, WELCOME10)</label>
              <div className="mt-1 flex gap-2">
                <input value={promoCode} onChange={(e)=>setPromoCode(e.target.value)} placeholder="RAYA50" className="h-8 flex-1 rounded-md border border-zinc-800 bg-zinc-900 px-2 text-[12px] text-white placeholder:text-zinc-600" />
                <button onClick={applyPromo} className="h-8 rounded-md border border-zinc-800 bg-zinc-900 px-3 text-[12px] text-white">Apply</button>
              </div>
              {promoApplied > 0 && <div className="mt-2 text-[11px] text-emerald-400">✓ {promoApplied*100}% discount applied! Pay RM{discountedMyr.toFixed(2)} instead of RM{finalMyr}</div>}
            </div>
          </div>

          {/* Payment Providers */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-5">
            <h3 className="text-[13px] font-semibold text-white">{t.creditsPage.localPayments}</h3>
            
            <div className="mt-3 space-y-2">
              <div className="text-[11px] text-zinc-500">FPX Online Banking (90% MY market)</div>
              {[
                { id: "billplz", label: t.creditsPage.billplz, desc: "All FPX banks + DuitNow" },
                { id: "toyyibpay", label: t.creditsPage.toyyibpay, desc: "SME friendly FPX" },
              ].map((p) => (
                <button key={p.id} onClick={()=>setSelectedProvider(p.id as any)} className={`flex w-full items-center justify-between rounded-md border px-3 py-2.5 text-left ${selectedProvider===p.id ? "border-white bg-zinc-800 text-white" : "border-zinc-800 bg-zinc-900 text-zinc-400 hover:bg-zinc-800"}`}>
                  <div><div className="text-[13px]">{p.label}</div><div className="text-[11px] opacity-70">{p.desc}</div></div>
                  <Building2 className="h-4 w-4" />
                </button>
              ))}
            </div>

            {["billplz","toyyibpay"].includes(selectedProvider) && (
              <div className="mt-4">
                <div className="text-[11px] text-zinc-500 mb-2">Select Bank (FPX)</div>
                <div className="grid grid-cols-2 gap-1.5 max-h-[200px] overflow-y-auto">
                  {FPX_BANKS.map((bank) => (
                    <button key={bank.code} onClick={()=>setSelectedBank(bank.code)} className={`rounded-md border px-2 py-2 text-[11px] text-left ${selectedBank===bank.code ? "border-white bg-white text-black" : "border-zinc-800 bg-zinc-900 text-zinc-400"}`}>
                      <span className="font-medium">{bank.logo}</span> {bank.name} {bank.popular && <span className="ml-1 rounded bg-amber-500/20 px-1 text-[9px]">★</span>}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-4">
              <div className="text-[11px] text-zinc-500 mb-2">e-Wallet QR (Micro RM5-10) – DuitNow National QR</div>
              <div className="grid grid-cols-2 gap-1.5">
                {EWALLETS.map((w) => (
                  <button key={w.code} onClick={()=>setSelectedProvider(w.code as any)} className={`flex items-center gap-2 rounded-md border px-2.5 py-2 text-[11px] ${selectedProvider===w.code ? "border-white bg-white text-black" : "border-zinc-800 bg-zinc-900 text-zinc-400"}`}>
                    <div className={`h-2 w-2 rounded-full ${w.color}`} /> {w.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <div className="text-[11px] text-zinc-500 mb-2">International</div>
              <button onClick={()=>setSelectedProvider("stripe")} className={`flex w-full items-center justify-between rounded-md border px-3 py-2.5 text-left ${selectedProvider==="stripe" ? "border-white bg-zinc-800 text-white" : "border-zinc-800 bg-zinc-900 text-zinc-400"}`}>
                <span>{t.creditsPage.stripe}</span><CreditCard className="h-4 w-4" />
              </button>
            </div>

            <button onClick={createBill} disabled={adding} className="mt-5 flex w-full items-center justify-center gap-2 rounded-md bg-white py-2.5 text-[13px] font-semibold text-black hover:bg-zinc-200 disabled:opacity-50">
              <Plus className="h-4 w-4" /> Pay {currency==="MYR" ? `RM${(promoApplied>0?discountedMyr:finalMyr).toFixed(2)}` : `$${(finalUsd*(1-promoApplied)).toFixed(2)}`} via {selectedProvider}
            </button>

            {showQr && (
              <div className="mt-4 rounded-lg border border-zinc-800 bg-zinc-950 p-4 text-center">
                <div className="text-[12px] text-white flex items-center justify-center gap-1"><QrCode className="h-4 w-4" /> Scan {showQr.provider.toUpperCase()} – RM{showQr.amount}</div>
                <img src={showQr.url} alt="QR" className="mx-auto mt-3 h-[200px] w-[200px] rounded-lg bg-white p-2" />
                <div className="mt-2 text-[11px] text-zinc-500">Mock QR – In production, this is DuitNow QR from Billplz/Fiuu</div>
                <button onClick={()=>addCredits(showQr.amount/4.7, `QR ${showQr.provider} RM${showQr.amount}`)} className="mt-3 w-full rounded-md bg-emerald-600 py-2 text-[12px] text-white hover:bg-emerald-700">Simulate Paid – Add Credits</button>
              </div>
            )}

            <div className="mt-3 rounded-lg bg-amber-950/20 p-2 text-[11px] text-amber-200/70">{t.creditsPage.mockMode}</div>
          </div>
        </div>

        {/* Right – Usage & Invoices */}
        <div className="space-y-4">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-5">
            <h3 className="text-[13px] font-semibold text-white flex items-center gap-2"><TrendingUp className="h-4 w-4" /> {t.creditsPage.usageBreakdown}</h3>
            <div className="mt-4 grid grid-cols-3 gap-4 text-[12px]">
              <div><div className="text-zinc-500">{t.creditsPage.inputTokens}</div><div className="mt-1 text-[18px] font-semibold text-white">12,450</div></div>
              <div><div className="text-zinc-500">{t.creditsPage.outputTokens}</div><div className="mt-1 text-[18px] font-semibold text-white">8,320</div></div>
              <div><div className="text-zinc-500">{t.creditsPage.totalCost}</div><div className="mt-1 text-[18px] font-semibold text-white">{formatCurrency(credits.totalUsed, currency, "en" as any)}</div></div>
            </div>
            <div className="mt-6 h-2 w-full overflow-hidden rounded-full bg-zinc-800"><div className="h-full w-[68%] rounded-full bg-white" /></div>
            <div className="mt-2 flex justify-between text-[11px] text-zinc-500"><span>{t.creditsPage.thisMonth}</span><span>{t.creditsPage.lastMonth}</span></div>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-5">
            <h3 className="text-[13px] font-semibold text-white flex items-center gap-2"><Receipt className="h-4 w-4" /> E-Invoice (LHDN MyInvois) – Malaysia Compliance</h3>
            <p className="mt-1 text-[11px] text-zinc-500">Auto-generated LHDN e-invoice for every purchase. Mandatory for B2B &gt; RM150k/year from 2024.</p>
            <div className="mt-4 space-y-2 max-h-[400px] overflow-y-auto">
              {invoices.map((inv:any)=>(
                <div key={inv.id} className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-3">
                  <div className="flex justify-between"><span className="text-[12px] text-white">{inv.id}</span><span className="text-[10px] rounded bg-emerald-500/10 px-1.5 py-0.5 text-emerald-400">{inv.lhdnStatus}</span></div>
                  <div className="mt-1 text-[11px] text-zinc-400">{inv.description}</div>
                  <div className="mt-1 flex justify-between text-[11px]"><span className="text-zinc-500">{new Date(inv.createdAt).toLocaleDateString()} • {inv.companySsm}</span><span className="text-white">{formatCurrency(inv.amountUsd, currency, "en" as any)} – RM{inv.amountMyr.toFixed(2)}</span></div>
                  <div className="mt-2 text-[10px] text-zinc-500">LHDN UUID: {inv.lhdnUuid.slice(0,20)}... • QR: <a href={inv.lhdnQrUrl} target="_blank" className="underline">View</a> • SST: {inv.sstRate}</div>
                </div>
              ))}
              {invoices.length===0 && <div className="text-[12px] text-zinc-500">No invoices yet</div>}
            </div>
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
