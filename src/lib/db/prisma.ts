/**
 * Prisma client singleton – Task 4
 * If DATABASE_URL is not set, we fallback to mockStore (so it works without DB)
 * To enable real DB: add DATABASE_URL to .env.local
 */

declare global {
  var prismaGlobal: any | undefined;
}

export function shouldUseRealDb() {
  return !!process.env.DATABASE_URL;
}

export async function getPrisma(): Promise<any> {
  if (!shouldUseRealDb()) return null;
  try {
    // @ts-ignore – optional dependency, only needed when DATABASE_URL set
    const mod = await import("@prisma/client");
    const { PrismaClient } = mod as any;
    if (!global.prismaGlobal) {
      global.prismaGlobal = new PrismaClient({
        log: ["error", "warn"],
      });
    }
    return global.prismaGlobal;
  } catch (e) {
    console.warn("Prisma not available, falling back to mockStore:", e);
    return null;
  }
}
