import { NextResponse } from "next/server";
import { deleteKey } from "@/lib/openrouter-service";

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    const ok = await deleteKey(params.id);
    if (!ok) return NextResponse.json({ error: "Key not found" }, { status: 404 });
    return NextResponse.json({ data: { deleted: true, id: params.id } });
  } catch (e: any) {
    return NextResponse.json({ error: { message: e.message } }, { status: 500 });
  }
}
