/**
 * Mock Provider – Task 5
 * This is the current default that works without any real API keys.
 * It uses mockStore for persistence.
 */

import { Provider, ChatParams, EmbeddingParams } from "./types";
import { mockStore } from "../db/mockStore";
import { models } from "../models";

function hashPrompt(prompt: string): string {
  // Simple hash for PDPA compliance demo (Task 6)
  let hash = 0;
  for (let i = 0; i < prompt.length; i++) {
    hash = (hash << 5) - hash + prompt.charCodeAt(i);
    hash |= 0;
  }
  return `sha256_mock_${Math.abs(hash).toString(16)}_${prompt.length}`;
}

export const mockProvider: Provider = {
  name: "mock",

  async chatCompletions(params: ChatParams) {
    const model = models.find((m) => m.id === params.model) || models[0];
    const lastUserMsg = params.messages.filter(m => m.role === "user").pop()?.content || "Hello";
    const promptTokens = Math.floor(JSON.stringify(params.messages).length / 4);
    const completionTokens = Math.floor(120 + Math.random() * 300);

    const generation = mockStore.addGeneration({
      model: params.model,
      provider: model.provider,
      prompt: lastUserMsg.slice(0, 500),
      promptHash: hashPrompt(lastUserMsg),
      completion: `Mock response for: ${lastUserMsg.slice(0, 100)}`,
      promptTokens,
      completionTokens,
      totalTokens: promptTokens + completionTokens,
      latencyMs: Math.floor(200 + Math.random() * 800),
      costUsd: parseFloat(((promptTokens * model.pricing.input + completionTokens * model.pricing.output) / 1_000_000).toFixed(6)),
      status: "completed",
      isStreaming: !!params.stream,
    });

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
            content: `Mock response from ${model.name} (${model.provider}).\n\nYou said: "${lastUserMsg}"\n\n✅ Full mock backend – logged to Activity: ${generation.id} | Cost $${generation.costUsd} | ${generation.totalTokens} tokens\n\n💡 Cost Optimizer: You could use ${models.find(m => m.pricing.input < model.pricing.input)?.name || "Claude 3 Haiku"} to save ~70% for similar tasks.`,
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
  },

  async chatCompletionsStream(params: ChatParams) {
    const model = models.find((m) => m.id === params.model) || models[0];
    const lastUserMsg = params.messages.filter(m => m.role === "user").pop()?.content || "Hello";
    const fakeResponse = `This is a mock streaming response from ${model.name} (${model.id}). You said: "${lastUserMsg}". In production this would proxy to ${model.provider}'s real API with proper auth, retries, fallbacks, and billing. Logged to Activity.`;

    const promptTokens = Math.floor(JSON.stringify(params.messages).length / 4);
    const completionTokens = fakeResponse.split(" ").length;
    mockStore.addGeneration({
      model: params.model,
      provider: model.provider,
      prompt: lastUserMsg.slice(0, 500),
      promptHash: hashPrompt(lastUserMsg),
      completion: fakeResponse.slice(0, 200),
      promptTokens,
      completionTokens,
      totalTokens: promptTokens + completionTokens,
      latencyMs: Math.floor(200 + Math.random() * 800),
      costUsd: parseFloat(((promptTokens * 5 + completionTokens * 15) / 1_000_000).toFixed(6)),
      status: "completed",
      isStreaming: true,
    });

    const encoder = new TextEncoder();
    return new ReadableStream({
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
          await new Promise((r) => setTimeout(r, 30));
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
  },

  async embeddings(params: EmbeddingParams) {
    return {
      object: "list",
      data: [{ object: "embedding", embedding: Array.from({ length: 1536 }).map(() => Math.random() - 0.5), index: 0 }],
      model: params.model,
      usage: { prompt_tokens: Math.floor(params.input.length / 4), total_tokens: Math.floor(params.input.length / 4) },
    };
  },
};
