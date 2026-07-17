import { NextResponse } from "next/server";
import { chatCompletions, chatCompletionsStream } from "@/lib/openrouter-service";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { stream = false } = body;

    if (stream) {
      const streamBody = await chatCompletionsStream(body);
      return new Response(streamBody, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      });
    }

    const result = await chatCompletions(body);
    return NextResponse.json(result);
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
    note: "This is a full mock backend. Replace src/lib/openrouter-service.ts with real provider calls for production.",
  });
}
