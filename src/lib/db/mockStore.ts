/**
 * Mock DB Store - In-memory singleton
 * Task 4 & 6 & 8: Added PDPA compliance, BYOK, promptHash
 */

export type ApiKey = {
  id: string;
  name: string;
  key: string;
  keyPrefix: string;
  createdAt: string;
  lastUsedAt: string | null;
  usageUsd: number;
  rateLimit: { requestsPerMinute: number; tokensPerMinute: number };
  isActive: boolean;
  // Task 6: Only show full key once
  showOnce: boolean;
};

export type Generation = {
  id: string;
  model: string;
  provider: string;
  prompt: string;
  promptHash: string; // Task 6: PDPA - store hash, not full prompt for analytics
  completion: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  latencyMs: number;
  costUsd: number;
  createdAt: string;
  status: "completed" | "failed" | "cached";
  isStreaming: boolean;
};

export type CreditTransaction = {
  id: string;
  type: "purchase" | "usage" | "refund";
  amountUsd: number;
  description: string;
  createdAt: string;
};

export type User = {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  creditsUsd: number;
  totalUsageUsd: number;
  createdAt: string;
};

export type ByokKey = {
  id: string;
  provider: string;
  keyPrefix: string;
  keyHash: string;
  isActive: boolean;
  createdAt: string;
  userId: string;
};

function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return `sha256_${Math.abs(hash).toString(16)}_${str.length}`;
}

class MockStore {
  keys: ApiKey[] = [
    {
      id: "or-123",
      name: "Production",
      key: "sk-or-v1-abc123def456ghi789jkl012mno345pqr678stu901vwx234",
      keyPrefix: "sk-or-v1-abc123",
      createdAt: "2024-09-12T10:00:00Z",
      lastUsedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
      usageUsd: 12.34,
      rateLimit: { requestsPerMinute: 600, tokensPerMinute: 100000 },
      isActive: true,
      showOnce: false,
    },
    {
      id: "or-124",
      name: "Development",
      key: "sk-or-v1-xyz987wvu654tsr321qpo098nml765kji432hgf109edc876",
      keyPrefix: "sk-or-v1-xyz987",
      createdAt: "2024-10-01T08:00:00Z",
      lastUsedAt: null,
      usageUsd: 0,
      rateLimit: { requestsPerMinute: 100, tokensPerMinute: 20000 },
      isActive: true,
      showOnce: false,
    },
  ];

  generations: Generation[] = Array.from({ length: 25 }).map((_, i) => {
    const models = ["openai/gpt-4o", "anthropic/claude-3.5-sonnet", "google/gemini-1.5-pro", "meta-llama/llama-3.1-405b-instruct"];
    const model = models[i % models.length];
    const prompt = `Example prompt ${i + 1}: Explain quantum computing in simple terms.`;
    const promptTokens = Math.floor(50 + Math.random() * 400);
    const completionTokens = Math.floor(100 + Math.random() * 600);
    return {
      id: `gen_${Date.now() - i * 100000}_${Math.random().toString(36).slice(2, 8)}`,
      model,
      provider: model.split("/")[0],
      prompt,
      promptHash: hashString(prompt),
      completion: `This is a mock completion for generation ${i + 1}...`,
      promptTokens,
      completionTokens,
      totalTokens: promptTokens + completionTokens,
      latencyMs: Math.floor(180 + Math.random() * 1200),
      costUsd: parseFloat(((promptTokens * 0.000005 + completionTokens * 0.000015)).toFixed(6)),
      createdAt: new Date(Date.now() - i * 3600 * 1000 * 2).toISOString(),
      status: (["completed", "completed", "completed", "cached"] as const)[i % 4],
      isStreaming: i % 2 === 0,
    };
  });

  credits: { balance: number; totalPurchased: number; totalUsed: number; transactions: CreditTransaction[] } = {
    balance: 37.66,
    totalPurchased: 50,
    totalUsed: 12.34,
    transactions: [
      { id: "txn_1", type: "purchase", amountUsd: 50, description: "Credit purchase via Stripe", createdAt: "2024-09-01T10:00:00Z" },
      { id: "txn_2", type: "usage", amountUsd: -5.12, description: "Usage: openai/gpt-4o", createdAt: "2024-09-10T12:00:00Z" },
      { id: "txn_3", type: "usage", amountUsd: -7.22, description: "Usage: anthropic/claude-3.5-sonnet", createdAt: "2024-09-12T14:30:00Z" },
    ],
  };

  user: User = {
    id: "user_1",
    email: "demo@openrouter.clone",
    name: "Demo User",
    avatarUrl: null,
    creditsUsd: 37.66,
    totalUsageUsd: 12.34,
    createdAt: "2024-08-01T00:00:00Z",
  };

  byokKeys: ByokKey[] = [];

  // API Key operations – Task 6: show once
  listKeys() { return this.keys.filter(k => k.isActive).map(k => ({ ...k, key: k.showOnce ? k.key : `${k.keyPrefix}••••••••••••••${k.key.slice(-4)}` })); }
  listKeysRaw() { return this.keys.filter(k => k.isActive); }
  
  createKey(name: string): ApiKey & { fullKey: string } {
    const fullKey = `sk-or-v1-${Math.random().toString(36).slice(2)}${Math.random().toString(36).slice(2)}${Math.random().toString(36).slice(2)}`;
    const key: ApiKey = {
      id: `or-${Date.now()}`,
      name,
      key: fullKey,
      keyPrefix: fullKey.slice(0, 12),
      createdAt: new Date().toISOString(),
      lastUsedAt: null,
      usageUsd: 0,
      rateLimit: { requestsPerMinute: 200, tokensPerMinute: 50000 },
      isActive: true,
      showOnce: true, // Task 6: allow one-time view
    };
    this.keys.unshift(key);
    // After 10 seconds, mark as not showOnce (simulate one-time view)
    setTimeout(() => { key.showOnce = false; }, 10000);
    return { ...key, fullKey };
  }

  markKeyViewed(id: string) {
    const k = this.keys.find(x => x.id === id);
    if (k) k.showOnce = false;
  }

  deleteKey(id: string) {
    const idx = this.keys.findIndex(k => k.id === id);
    if (idx !== -1) this.keys[idx].isActive = false;
    return idx !== -1;
  }

  // Generations
  listGenerations(limit = 50) { return this.generations.slice(0, limit); }
  addGeneration(gen: Omit<Generation, "id" | "createdAt">): Generation {
    const newGen: Generation = {
      ...gen,
      id: `gen_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      createdAt: new Date().toISOString(),
    };
    this.generations.unshift(newGen);
    this.credits.balance = Math.max(0, this.credits.balance - newGen.costUsd);
    this.credits.totalUsed += newGen.costUsd;
    this.user.creditsUsd = this.credits.balance;
    this.user.totalUsageUsd = this.credits.totalUsed;
    return newGen;
  }

  // Credits
  getCredits() { return this.credits; }
  addCredits(amount: number) {
    this.credits.balance += amount;
    this.credits.totalPurchased += amount;
    this.credits.transactions.unshift({
      id: `txn_${Date.now()}`,
      type: "purchase",
      amountUsd: amount,
      description: `Credit purchase - $${amount}`,
      createdAt: new Date().toISOString(),
    });
    this.user.creditsUsd = this.credits.balance;
    return this.credits;
  }

  getUser() { return this.user; }

  getStats() {
    const totalGens = this.generations.length;
    const totalTokens = this.generations.reduce((s, g) => s + g.totalTokens, 0);
    const avgLatency = totalGens ? Math.round(this.generations.reduce((s, g) => s + g.latencyMs, 0) / totalGens) : 0;
    return { totalGens, totalTokens, avgLatency, balance: this.credits.balance };
  }

  // BYOK – Task 8
  listByokKeys() { return this.byokKeys.filter(k => k.isActive); }
  addByokKey(provider: string, key: string) {
    const byok: ByokKey = {
      id: `byok_${Date.now()}`,
      provider,
      keyPrefix: key.slice(0, 8),
      keyHash: hashString(key),
      isActive: true,
      createdAt: new Date().toISOString(),
      userId: this.user.id,
    };
    this.byokKeys.push(byok);
    return byok;
  }
  deleteByokKey(id: string) {
    const idx = this.byokKeys.findIndex(k => k.id === id);
    if (idx !== -1) this.byokKeys[idx].isActive = false;
    return idx !== -1;
  }
}

declare global {
  var __mockStore: MockStore | undefined;
}

export const mockStore = global.__mockStore || (global.__mockStore = new MockStore());
if (process.env.NODE_ENV !== "production") global.__mockStore = mockStore;
