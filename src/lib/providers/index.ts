/**
 * Provider Factory – Task 5
 * Selects provider based on env PROVIDER
 * Default is mock (works without keys)
 * 
 * Usage:
 *   PROVIDER=mock (default)
 *   PROVIDER=openai + OPENAI_API_KEY
 *   PROVIDER=anthropic + ANTHROPIC_API_KEY
 *   PROVIDER=openrouter + OPENROUTER_API_KEY (gives 200+ models)
 */

import { mockProvider } from "./mock";
import { openaiProvider } from "./openai";
import { anthropicProvider } from "./anthropic";
import { openrouterProvider } from "./openrouter";
import { Provider } from "./types";

const providersMap: Record<string, Provider> = {
  mock: mockProvider,
  openai: openaiProvider,
  anthropic: anthropicProvider,
  openrouter: openrouterProvider,
};

export function getProvider(): Provider {
  const name = (process.env.PROVIDER || "mock").toLowerCase();
  return providersMap[name] || mockProvider;
}

export function getProviderName(): string {
  return (process.env.PROVIDER || "mock").toLowerCase();
}

// Re-export for convenience
export * from "./types";
