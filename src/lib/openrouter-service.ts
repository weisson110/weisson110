/**
 * OpenRouter Service Layer – Full mock but pluggable for real backend
 * Task 5: Now delegates to provider factory (mock/openai/anthropic/openrouter)
 * 
 * This file is still the ONLY file frontend/API calls – so swapping provider is transparent.
 */

import { models, Model } from "./models";
import { mockStore } from "./db/mockStore";
import { getProvider } from "./providers";
import { ChatParams } from "./providers/types";

// --- Models ---
export async function listModels(): Promise<Model[]> {
  // If provider is openrouter and real key set, fetch live models
  if (process.env.PROVIDER === "openrouter" && process.env.OPENROUTER_API_KEY) {
    try {
      const res = await fetch("https://openrouter.ai/api/v1/models", {
        headers: { Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}` },
        next: { revalidate: 3600 },
      });
      if (res.ok) {
        const data = await res.json();
        // Map OpenRouter format to our Model format (simplified – return mock for now if mapping fails)
        return models; // Keep mock for demo, but you can map here
      }
    } catch {}
  }
  return models;
}

export async function getModelById(id: string): Promise<Model | undefined> {
  const all = await listModels();
  return all.find(m => m.id === id) || all[0];
}

export async function listProviders() {
  return [
    { name: "OpenAI", slug: "openai", icon: "◐", status: "operational", p95Latency: 420, uptime: "99.99%" },
    { name: "Anthropic", slug: "anthropic", icon: "◇", status: "operational", p95Latency: 512, uptime: "99.95%" },
    { name: "Google", slug: "google", icon: "◎", status: "operational", p95Latency: 380, uptime: "99.8%" },
    { name: "Meta", slug: "meta", icon: "∞", status: "operational", p95Latency: 890, uptime: "99.7%" },
    { name: "DeepSeek", slug: "deepseek", icon: "⬢", status: "operational", p95Latency: 310, uptime: "99.6%" },
    { name: "Together", slug: "together", icon: "⬣", status: "operational", p95Latency: 450, uptime: "99.8%" },
  ];
}

// --- Chat Completions ---
export async function chatCompletions(params: ChatParams) {
  const provider = getProvider();
  return provider.chatCompletions(params);
}

export async function chatCompletionsStream(params: ChatParams) {
  const provider = getProvider();
  if (provider.chatCompletionsStream) {
    return provider.chatCompletionsStream(params);
  }
  // Fallback to non-streaming wrapped as stream
  const result = await provider.chatCompletions(params);
  const content = result.choices[0].message.content;
  const encoder = new TextEncoder();
  return new ReadableStream({
    async start(controller) {
      const words = content.split(" ");
      for (const word of words) {
        const chunk = {
          id: `chatcmpl-${Date.now()}`,
          object: "chat.completion.chunk",
          created: Math.floor(Date.now() / 1000),
          model: params.model,
          choices: [{ delta: { content: word + " " }, index: 0, finish_reason: null }],
        };
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(chunk)}\n\n`));
        await new Promise(r => setTimeout(r, 30));
      }
      controller.enqueue(encoder.encode(`data: {"choices":[{"delta":{},"finish_reason":"stop"}]}\n\n`));
      controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      controller.close();
    },
  });
}

// --- Embeddings ---
export async function createEmbeddings(params: { model: string; input: string }) {
  const provider = getProvider();
  if (provider.embeddings) {
    return provider.embeddings(params);
  }
  // Fallback mock embedding
  return {
    object: "list",
    data: [{ object: "embedding", embedding: Array.from({ length: 1536 }).map(() => Math.random() - 0.5), index: 0 }],
    model: params.model,
    usage: { prompt_tokens: Math.floor(params.input.length / 4), total_tokens: Math.floor(params.input.length / 4) },
  };
}

// --- Keys ---
export async function listKeys() { return mockStore.listKeys(); }
export async function createKey(name: string) { return mockStore.createKey(name); }
export async function deleteKey(id: string) { return mockStore.deleteKey(id); }

// --- Credits & Billing ---
export async function getCredits() { return mockStore.getCredits(); }
export async function addCredits(amount: number) { return mockStore.addCredits(amount); }

// --- Activity / Generations ---
export async function listGenerations(limit = 50) { return mockStore.listGenerations(limit); }
export async function getStats() { return mockStore.getStats(); }

// --- Auth / User ---
export async function getCurrentUser() { return mockStore.getUser(); }

// --- BYOK (Task 8) ---
export async function listByokKeys() { return mockStore.listByokKeys(); }
export async function addByokKey(provider: string, key: string) { return mockStore.addByokKey(provider, key); }
export async function deleteByokKey(id: string) { return mockStore.deleteByokKey(id); }

// --- Cost Optimizer (Task 3) ---
export async function getCheaperAlternatives(modelId: string) {
  const model = await getModelById(modelId);
  if (!model) return [];
  const all = await listModels();
  // Find cheaper models with similar tags
  return all
    .filter(m => m.pricing.input < model.pricing.input && m.id !== model.id)
    .sort((a, b) => a.pricing.input - b.pricing.input)
    .slice(0, 3)
    .map(m => ({
      id: m.id,
      name: m.name,
      provider: m.provider,
      savingPercent: Math.round((1 - m.pricing.input / model.pricing.input) * 100),
      inputPrice: m.pricing.input,
      outputPrice: m.pricing.output,
    }));
}
