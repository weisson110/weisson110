import { NextResponse } from "next/server";
import { getStats, listProviders, listModels } from "@/lib/openrouter-service";

export async function GET() {
  const [stats, providers, models] = await Promise.all([getStats(), listProviders(), listModels()]);
  return NextResponse.json({
    data: {
      ...stats,
      totalModels: models.length,
      totalProviders: providers.length,
      uptime: "99.99%",
      p95Latency: 420,
    },
  });
}
