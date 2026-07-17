/**
 * Anthropic Provider – Task 5
 * Pluggable real provider. Enable by PROVIDER=anthropic and ANTHROPIC_API_KEY
 */

import { Provider, ChatParams } from "./types";

export const anthropicProvider: Provider = {
  name: "anthropic",

  async chatCompletions(params: ChatParams) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) throw new Error("ANTHROPIC_API_KEY not set");

    // Anthropic uses different format – convert
    const systemMsgs = params.messages.filter(m => m.role === "system");
    const userMsgs = params.messages.filter(m => m.role !== "system");

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "Content-Type": "application/json",
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: params.model.includes("/") ? params.model.split("/")[1] : "claude-3-5-sonnet-20241022",
        system: systemMsgs.map(s => s.content).join("\n"),
        messages: userMsgs,
        max_tokens: params.max_tokens || 1024,
      }),
    });

    const data = await res.json();
    
    // Convert Anthropic response to OpenAI format for frontend compatibility
    return {
      id: data.id,
      object: "chat.completion",
      created: Math.floor(Date.now() / 1000),
      model: params.model,
      choices: [
        {
          index: 0,
          message: { role: "assistant", content: data.content?.[0]?.text || "" },
          finish_reason: data.stop_reason,
        },
      ],
      usage: {
        prompt_tokens: data.usage?.input_tokens || 0,
        completion_tokens: data.usage?.output_tokens || 0,
        total_tokens: (data.usage?.input_tokens || 0) + (data.usage?.output_tokens || 0),
      },
    };
  },
};
