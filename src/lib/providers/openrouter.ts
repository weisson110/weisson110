/**
 * OpenRouter Provider – Task 5
 * This proxies to real openrouter.ai to get 200+ models instantly.
 * Enable by PROVIDER=openrouter and OPENROUTER_API_KEY
 */

import { Provider, ChatParams } from "./types";

export const openrouterProvider: Provider = {
  name: "openrouter",

  async chatCompletions(params: ChatParams) {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) throw new Error("OPENROUTER_API_KEY not set – get one at https://openrouter.ai/keys");

    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "https://openrouter.clone",
        "X-Title": "OpenRouter Clone",
      },
      body: JSON.stringify(params),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`OpenRouter error: ${err}`);
    }

    return await res.json();
  },

  async chatCompletionsStream(params: ChatParams) {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) throw new Error("OPENROUTER_API_KEY not set");

    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "https://openrouter.clone",
        "X-Title": "OpenRouter Clone",
      },
      body: JSON.stringify({ ...params, stream: true }),
    });

    if (!res.ok || !res.body) throw new Error(`OpenRouter stream error`);

    // Return the raw readable stream from OpenRouter (already SSE)
    return res.body as unknown as ReadableStream;
  },
};
