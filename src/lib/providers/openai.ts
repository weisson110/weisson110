/**
 * OpenAI Provider – Task 5
 * Pluggable real provider. Enable by setting PROVIDER=openai and OPENAI_API_KEY
 */

import { Provider, ChatParams, EmbeddingParams } from "./types";

export const openaiProvider: Provider = {
  name: "openai",

  async chatCompletions(params: ChatParams) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error("OPENAI_API_KEY not set – set it in .env.local or switch PROVIDER=mock");

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: params.model.includes("/") ? params.model.split("/")[1] : params.model,
        messages: params.messages,
        temperature: params.temperature,
        max_tokens: params.max_tokens,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`OpenAI error: ${err}`);
    }

    return await res.json();
  },

  async embeddings(params: EmbeddingParams) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error("OPENAI_API_KEY not set");

    const res = await fetch("https://api.openai.com/v1/embeddings", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: params.model,
        input: params.input,
      }),
    });

    return await res.json();
  },
};
