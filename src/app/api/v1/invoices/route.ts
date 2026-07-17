import { NextResponse } from "next/server";
import { mockStore } from "@/lib/db/mockStore";

/**
 * Invoices API – LHDN MyInvois E-Invoice ready (Malaysia mandatory from 2024)
 * GET /api/v1/invoices – list invoices
 * POST /api/v1/invoices – create invoice (mock E-Invoice)
 * 
 * Real implementation: POST to https://api.myinvois.hasil.gov.my/api/v1.0/documents
 * Docs: https://sdk.myinvois.hasil.gov.my/
 */

export async function GET() {
  const credits = mockStore.getCredits();
  const invoices = credits.transactions
    .filter(t => t.type === "purchase")
    .map(t => ({
      id: `inv_${t.id}`,
      transactionId: t.id,
      amountUsd: t.amountUsd,
      amountMyr: t.amountUsd * 4.7,
      description: t.description,
      createdAt: t.createdAt,
      status: "paid",
      // LHDN MyInvois fields – ready for real integration
      lhdnUuid: `LHDN-${t.id}-${Date.now()}`,
      lhdnStatus: "valid",
      lhdnQrUrl: `https://myinvois.hasil.gov.my/${t.id}/share/${t.id}`,
      companyName: "OpenRouter Clone Sdn Bhd",
      companySsm: "2024010XXXXX",
      companyTin: "C1234567890",
      customerName: mockStore.getUser().name,
      customerEmail: mockStore.getUser().email,
      sstRate: "0% (Digital Service – 8% SST Exempt for demo)",
      currency: "MYR",
    }));

  return NextResponse.json({ data: invoices });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { transactionId } = body;

    // Mock creating LHDN e-invoice
    const invoice = {
      id: `inv_${Date.now()}`,
      transactionId,
      lhdnUuid: `LHDN-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,
      status: "submitted",
      submittedAt: new Date().toISOString(),
      qrUrl: `https://myinvois.hasil.gov.my/${transactionId}/share/${transactionId}`,
      message: "E-Invoice submitted to LHDN MyInvois (mock). In production, call https://api.myinvois.hasil.gov.my",
    };

    return NextResponse.json({ data: invoice }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
