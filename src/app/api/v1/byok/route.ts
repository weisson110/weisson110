import { NextResponse } from "next/server";
import { mockStore } from "@/lib/db/mockStore";

export async function GET() {
  const keys = mockStore.listByokKeys();
  return NextResponse.json({ data: keys });
}

export async function POST(req: Request) {
  try {
    const { provider, key } = await req.json();
    if (!provider || !key) return NextResponse.json({ error: "provider and key required" }, { status: 400 });
    const newKey = mockStore.addByokKey(provider, key);
    return NextResponse.json({ data: newKey }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const ok = mockStore.deleteByokKey(id);
  return NextResponse.json({ data: { deleted: ok } });
}
