import { NextResponse } from "next/server";
import { listKeys, createKey } from "@/lib/openrouter-service";

export async function GET() {
  const keys = await listKeys();
  return NextResponse.json({ data: keys });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name } = body;
    if (!name) return NextResponse.json({ error: "name required" }, { status: 400 });
    const key = await createKey(name);
    return NextResponse.json({ data: key }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: { message: e.message } }, { status: 500 });
  }
}
