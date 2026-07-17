import { NextResponse } from "next/server";
import { createEmbeddings } from "@/lib/openrouter-service";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await createEmbeddings(body);
    return NextResponse.json(result);
  } catch (e: any) {
    return NextResponse.json({ error: { message: e.message } }, { status: 500 });
  }
}
