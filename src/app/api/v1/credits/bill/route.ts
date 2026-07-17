import { NextResponse } from "next/server";
import { createBillplzBill } from "@/lib/payments/billplz";
import { createToyyibPayBill } from "@/lib/payments/toyyibpay";
import { createDuitNowQR } from "@/lib/payments/duitnow";

/**
 * Create Bill API – POST /api/v1/credits/bill
 * Body: { amount: number (MYR), provider: billplz|toyyibpay|tng|grabpay|duitnow|stripe, bank?: string }
 * 
 * Real: creates bill via Billplz/ToyyibPay and returns redirect URL
 * Mock: returns mock URL that simulates success via query param
 */

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { amount, provider = "billplz", bank, currency = "MYR" } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "amount must be positive" }, { status: 400 });
    }

    const email = "demo@openrouter.clone";
    const name = "Demo User";
    const description = `OpenRouter Credits – RM${amount} – ${provider.toUpperCase()} ${bank || ""}`;

    let bill;

    switch (provider) {
      case "billplz":
        bill = await createBillplzBill({
          amount,
          currency: currency as any,
          email,
          name,
          description,
          redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/credits?payment=success`,
          callbackUrl: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/webhooks/billplz`,
        });
        break;
      case "toyyibpay":
        bill = await createToyyibPayBill({
          amount,
          currency: currency as any,
          email,
          name,
          description,
        });
        break;
      case "tng":
      case "grabpay":
      case "duitnow":
      case "shopeepay":
        bill = await createDuitNowQR({
          amount,
          currency: currency as any,
          email,
          name,
          description,
          provider: provider as any,
        });
        break;
      case "stripe":
      default:
        // Stripe mock – in production, create Stripe Checkout Session
        bill = {
          id: `stripe_${Date.now()}`,
          url: `/credits?mock_billplz=success&amount=${amount}`, // Mock success
          provider: "stripe" as any,
          amount,
          currency,
          status: "pending" as const,
          createdAt: new Date().toISOString(),
        };
        break;
    }

    return NextResponse.json({ data: bill });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
