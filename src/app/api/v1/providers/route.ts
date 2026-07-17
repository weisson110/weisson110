import { NextResponse } from "next/server";
import { listProviders } from "@/lib/openrouter-service";

export async function GET() {
  const providers = await listProviders();
  return NextResponse.json({ data: providers });
}
