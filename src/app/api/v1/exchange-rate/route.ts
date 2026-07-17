import { NextResponse } from "next/server";

/**
 * Exchange Rate API – MYR local currency
 * GET /api/v1/exchange-rate?from=USD&to=MYR
 * 
 * Real: fetch from exchangerate.host or Bank Negara Malaysia API
 * Mock: returns 4.7
 */

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from") || "USD";
  const to = searchParams.get("to") || "MYR";

  // Try real API if available, fallback to mock
  let rate = 4.7;
  let source = "mock";

  try {
    // Attempt real rate from exchangerate.host (free, no key)
    const res = await fetch(`https://api.exchangerate.host/convert?from=${from}&to=${to}`, { next: { revalidate: 3600 } });
    if (res.ok) {
      const data = await res.json();
      if (data.info?.rate) {
        rate = data.info.rate;
        source = "exchangerate.host";
      }
    }
  } catch {
    // Keep mock rate
  }

  return NextResponse.json({
    data: {
      from,
      to,
      rate,
      source,
      lastUpdated: new Date().toISOString(),
      note: "Malaysia MYR rate – update via Bank Negara API for production: https://api.bnm.gov.my",
    },
  });
}
