import { NextResponse } from "next/server";
import { chatCompletions, chatCompletionsStream } from "@/lib/openrouter-service";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  try {
    const apiKey = req.headers.get("authorization")?.replace("Bearer ", "") || "anonymous";
    
    // Task 6: Rate limiting
    const rateLimit = await checkRateLimit(apiKey, 600);
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: { message: "Rate limit exceeded. Try again later.", code: "rate_limit_exceeded" } },
        { status: 429, headers: { "X-RateLimit-Remaining": "0", "X-RateLimit-Reset": rateLimit.resetAt.toString() } }
      );
    }

    const body = await req.json();
    const { stream = false } = body;

    if (stream) {
      const streamBody = await chatCompletionsStream(body);
      return new Response(streamBody, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
          "X-RateLimit-Remaining": rateLimit.remaining.toString(),
        },
      });
    }

    const result = await chatCompletions(body);
    return NextResponse.json(result, {
      headers: { "X-RateLimit-Remaining": rateLimit.remaining.toString() },
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
    rateLimit: "600 req/min per API key (mock Upstash Redis) – see src/lib/rate-limit.ts",
    note: "This is a full mock backend. Replace src/lib/openrouter-service.ts with real provider calls for production.",
  });
}
