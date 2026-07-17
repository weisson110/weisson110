import { NextResponse } from "next/server";
import { listGenerations, getStats } from "@/lib/openrouter-service";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get("limit") || "50");
  const generations = await listGenerations(limit);
  const stats = await getStats();
  return NextResponse.json({ data: generations, stats });
}
