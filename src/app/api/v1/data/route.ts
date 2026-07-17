import { NextResponse } from "next/server";
import { mockStore } from "@/lib/db/mockStore";

/**
 * Data Deletion API – PDPA Compliance
 * DELETE /api/v1/data – delete all user generations
 * GET /api/v1/data – export data summary
 */

export async function GET() {
  const stats = mockStore.getStats();
  const user = mockStore.getUser();
  return NextResponse.json({
    data: {
      user: { id: user.id, email: user.email, name: user.name },
      totalGenerations: stats.totalGens,
      totalTokens: stats.totalTokens,
      note: "PDPA: You can export via /api/v1/activity?format=csv and delete via DELETE /api/v1/data",
    },
  });
}

export async function DELETE() {
  // Mock delete – in production, delete from Prisma: await prisma.generation.deleteMany({ where: { userId } })
  const beforeCount = mockStore.generations.length;
  (mockStore as any).generations = [];
  
  return NextResponse.json({
    data: {
      deleted: beforeCount,
      message: `Deleted ${beforeCount} generations. PDPA compliant deletion completed.`,
      deletedAt: new Date().toISOString(),
    },
  });
}
