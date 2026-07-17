/**
 * OpenRouter Service Layer – Full mock but pluggable for real backend
 * 
 * This file is the ONLY place you edit when you want real data.
 * All API routes and frontend pages call these functions.
 * 
 * Current: returns mock data from mockStore.ts
 * Production: replace internals with real provider calls.
 * 
 * Example real implementation (pseudo):
 * 
 * export async function chatCompletions(params) {
 *   // if you want to proxy to real OpenRouter:
 *   const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
 *     method: "POST",
 *     headers: { Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}` },
 *     body: JSON.stringify(params)
 *   });
 *   return res.json();
 * 
 *   // or proxy to OpenAI/Anthropic directly
 * }
 */

import { models, Model } from "./models";
import { mockStore } from "./db/mockStore";

// --- Models ---
export async function listModels(): Promise<Model[]> {
  // TODO: Replace with real fetch:
  // const res = await fetch("https://openrouter.ai/api/v1/models", { headers: { Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}` } });
  // return (await res.json()).data;
  return models;
}

export async function getModelById(id: string): Promise<Model | undefined> {
  const all = await listModels();
  return all.find(m => m.id === id) || all[0];
}

export async function listProviders() {
  // Mock providers list – real OpenRouter returns routing data
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
export type ChatParams = {
  model: string;
  messages: { role: "user" | "assistant" | "system"; content: string }[];
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
};

export async function chatCompletions(params: ChatParams) {
  // Simulate processing + add generation log
  const model = await getModelById(params.model);
  const lastUserMsg = params.messages.filter(m => m.role === "user").pop()?.content || "Hello";
  const promptTokens = Math.floor(JSON.stringify(params.messages).length / 4);
  const completionTokens = Math.floor(120 + Math.random() * 300);
  
  const generation = mockStore.addGeneration({
    model: params.model,
    provider: model?.provider || "OpenAI",
    prompt: lastUserMsg.slice(0, 200),
    completion: `Mock response for: ${lastUserMsg.slice(0, 100)}`,
    promptTokens,
    completionTokens,
    totalTokens: promptTokens + completionTokens,
    latencyMs: Math.floor(200 + Math.random() * 800),
    costUsd: parseFloat(((promptTokens * (model?.pricing.input || 5)/1_000_000 + completionTokens * (model?.pricing.output || 15)/1_000_000)).toFixed(6)),
    status: "completed",
    isStreaming: !!params.stream,
  });

  // Mock OpenAI-compatible response
  return {
    id: generation.id,
    object: "chat.completion",
    created: Math.floor(Date.now() / 1000),
    model: params.model,
    choices: [
      {
        index: 0,
        message: {
          role: "assistant",
          content: `Mock response from ${model?.name || params.model} (${model?.provider}).\n\nYou said: "${lastUserMsg}"\n\nThis endpoint is fully functional mock. To make it live, replace the logic in src/lib/openrouter-service.ts with real provider calls.\n\nLogged to Activity: ${generation.id} | Cost $${generation.costUsd} | ${generation.totalTokens} tokens`,
        },
        finish_reason: "stop",
      },
    ],
    usage: {
      prompt_tokens: promptTokens,
      completion_tokens: completionTokens,
      total_tokens: promptTokens + completionTokens,
    },
  };
}

export async function chatCompletionsStream(params: ChatParams) {
  const model = await getModelById(params.model);
  const lastUserMsg = params.messages.filter(m => m.role === "user").pop()?.content || "Hello";
  const fakeResponse = `This is a mock streaming response from ${model?.name} (${model?.id}). You said: "${lastUserMsg}". In production this would proxy to ${model?.provider}'s real API with proper auth, retries, fallbacks, and billing. This generation is logged to Activity.`;

  // Also log generation (will be updated after stream, simplified now)
  const promptTokens = Math.floor(JSON.stringify(params.messages).length / 4);
  const completionTokens = fakeResponse.split(" ").length;
  mockStore.addGeneration({
    model: params.model,
    provider: model?.provider || "OpenAI",
    prompt: lastUserMsg.slice(0, 200),
    completion: fakeResponse.slice(0, 200),
    promptTokens,
    completionTokens,
    totalTokens: promptTokens + completionTokens,
    latencyMs: Math.floor(200 + Math.random() * 800),
    costUsd: parseFloat(((promptTokens * 5 + completionTokens * 15)/1_000_000).toFixed(6)),
    status: "completed",
    isStreaming: true,
  });

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const words = fakeResponse.split(" ");
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
      const done = {
        id: `chatcmpl-${Date.now()}`,
        object: "chat.completion.chunk",
        created: Math.floor(Date.now() / 1000),
        model: params.model,
        choices: [{ delta: {}, index: 0, finish_reason: "stop" }],
      };
      controller.enqueue(encoder.encode(`data: ${JSON.stringify(done)}\n\n`));
      controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      controller.close();
    },
  });

  return stream;
}

// --- Embeddings ---
export async function createEmbeddings(params: { model: string; input: string }) {
  // Mock embeddings – 1536 dim vector of random floats
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
