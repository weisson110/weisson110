import { NextResponse } from "next/server";
import { mockStore } from "@/lib/db/mockStore";

/**
 * ToyyibPay Webhook – POST /api/webhooks/toyyibpay
 * ToyyibPay will POST to callback URL when payment done
 */

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const billcode = formData.get("billcode") as string;
    const status = formData.get("status") as string; // 1 = success
    const amount = formData.get("amount") as string;
    const orderId = formData.get("order_id") as string;

    console.log("ToyyibPay callback:", { billcode, status, amount, orderId });

    const isPaid = status === "1";

    if (isPaid) {
      const amountMyr = parseInt(amount || "0") / 100;
      const amountUsd = amountMyr / 4.7;
      
      mockStore.addCredits(amountUsd);
      mockStore.credits.transactions.unshift({
        id: `txn_toyyib_${billcode}`,
        type: "purchase",
        amountUsd,
        description: `ToyyibPay FPX – ${billcode} – RM${amountMyr}`,
        createdAt: new Date().toISOString(),
      });
    }

    return NextResponse.json({ received: true, status: isPaid ? "paid" : "failed" });
  } catch (e: any) {
    console.error("ToyyibPay webhook error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
