import { NextResponse } from "next/server";
import { getCurrentUser, getCredits } from "@/lib/openrouter-service";

export async function GET() {
  const user = await getCurrentUser();
  const credits = await getCredits();
  return NextResponse.json({
    data: {
      ...user,
      credits: credits.balance,
    },
    note: "Mock auth – replace with NextAuth / Clerk in production. See src/lib/db/mockStore.ts",
  });
}
