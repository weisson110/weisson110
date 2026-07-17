import { NextResponse } from "next/server";
import { models } from "@/lib/models";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { model: modelId, messages, stream = false } = body;

    const model = models.find((m) => m.id === modelId) || models[0];
    const lastMessage = messages?.[messages.length - 1]?.content || "Hello";

    // If stream requested, return SSE mock
    if (stream) {
      const encoder = new TextEncoder();
      const fakeResponse = `This is a mock streaming response from ${model.name} (${model.id}). You said: "${lastMessage}". In production this would proxy to ${model.provider}'s real API with proper auth, retries, fallbacks, and billing.`;

      const stream = new ReadableStream({
        async start(controller) {
          const words = fakeResponse.split(" ");
          for (const word of words) {
            const chunk = {
              id: `chatcmpl-${Date.now()}`,
              object: "chat.completion.chunk",
              created: Math.floor(Date.now() / 1000),
              model: model.id,
              choices: [{ delta: { content: word + " " }, index: 0, finish_reason: null }],
            };
            controller.enqueue(encoder.encode(`data: ${JSON.stringify(chunk)}\n\n`));
            await new Promise((r) => setTimeout(r, 30));
          }
          const done = {
            id: `chatcmpl-${Date.now()}`,
            object: "chat.completion.chunk",
            created: Math.floor(Date.now() / 1000),
            model: model.id,
            choices: [{ delta: {}, index: 0, finish_reason: "stop" }],
          };
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(done)}\n\n`));
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        },
      });

      return new Response(stream, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      });
    }

    // Non-streaming mock
    return NextResponse.json({
      id: `chatcmpl-${Date.now()}`,
      object: "chat.completion",
      created: Math.floor(Date.now() / 1000),
      model: model.id,
      choices: [
        {
          index: 0,
          message: {
            role: "assistant",
            content: `Mock response from ${model.name} (${model.provider}).\n\nYou said: "${lastMessage}"\n\nThis endpoint is compatible with OpenAI's SDK. To make it live, proxy to a real LLM provider here.\n\nSelected model: ${model.id}\nContext length: ${model.contextLength}\nPricing: $${model.pricing.input}/$${model.pricing.output} per 1M tokens`,
          },
          finish_reason: "stop",
        },
      ],
      usage: {
        prompt_tokens: Math.floor(lastMessage.length / 4),
        completion_tokens: 120,
        total_tokens: Math.floor(lastMessage.length / 4) + 120,
      },
    });
  } catch (e: any) {
    return NextResponse.json({ error: { message: e.message, code: "internal_error" } }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: "OpenRouter Clone API - POST to this endpoint",
    example: {
      model: "openai/gpt-4o",
      messages: [{ role: "user", content: "Hello" }],
    },
  });
}
