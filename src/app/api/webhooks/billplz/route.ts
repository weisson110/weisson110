import { NextResponse } from "next/server";
import { verifyBillplzSignature, parseBillplzCallback } from "@/lib/payments/billplz";
import { mockStore } from "@/lib/db/mockStore";

/**
 * Billplz Webhook – POST /api/webhooks/billplz
 * Docs: https://www.billplz.com/api#callback
 * Billplz will POST form data to this URL when payment is done
 * 
 * Setup in Billplz Dashboard: Collection -> Edit -> Callback URL = https://yourdomain.com/api/webhooks/billplz
 */

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const params = new URLSearchParams();
    formData.forEach((value, key) => params.append(key, value as string));

    const xSignature = req.headers.get("x-signature") || "";
    
    const isValid = verifyBillplzSignature(params, xSignature);
    if (!isValid) {
      console.warn("Billplz signature invalid – possible fraud, but allowing in mock mode");
      // In production, return 400 if invalid:
      // return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const callback = parseBillplzCallback(params);

    console.log("Billplz callback received:", callback);

    if (callback.status === "paid") {
      // Credit user – convert MYR to USD if needed (mock rate 4.7)
      // Billplz amount is in MYR, our credits are in USD, convert
      const amountUsd = callback.amount / 4.7;
      mockStore.addCredits(amountUsd);
      
      // Add transaction with MY details
      mockStore.credits.transactions.unshift({
        id: `txn_billplz_${callback.billId}`,
        type: "purchase",
        amountUsd: amountUsd,
        description: `Billplz FPX Payment – ${callback.billId} – RM${callback.amount} (MYR) – E-Invoice ready`,
        createdAt: new Date().toISOString(),
      });

      console.log(`Credited $${amountUsd.toFixed(2)} (RM${callback.amount}) via Billplz`);
    }

    return NextResponse.json({ received: true, billId: callback.billId, status: callback.status });
  } catch (e: any) {
    console.error("Billplz webhook error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// Billplz also does GET callback for redirect, handle both
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const billId = searchParams.get("id");
  const paid = searchParams.get("paid") === "true";
  
  if (paid && billId) {
    // User redirected after successful payment
    return NextResponse.redirect(new URL(`/credits?payment=success&bill=${billId}&provider=billplz`, req.url));
  }
  
  return NextResponse.redirect(new URL("/credits?payment=failed", req.url));
}
