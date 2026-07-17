import { NextResponse } from "next/server";
import { getCredits, addCredits } from "@/lib/openrouter-service";

export async function GET() {
  const credits = await getCredits();
  return NextResponse.json({ data: credits });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { amount } = body;
    if (!amount || amount <= 0) return NextResponse.json({ error: "amount must be positive" }, { status: 400 });
    const updated = await addCredits(amount);
    return NextResponse.json({ data: updated });
  } catch (e: any) {
    return NextResponse.json({ error: { message: e.message } }, { status: 500 });
  }
}
