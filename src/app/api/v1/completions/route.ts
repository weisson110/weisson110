import { NextResponse } from "next/server";
import { chatCompletions } from "@/lib/openrouter-service";

/**
 * Legacy completions endpoint - converts to chat completions internally
 * POST /api/v1/completions
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { model, prompt, ...rest } = body;
    
    const chatBody = {
      model,
      messages: [{ role: "user", content: prompt } as const],
      ...rest,
    };
    
    const result = await chatCompletions(chatBody as any);
    // Convert chat completion to legacy completion format
    return NextResponse.json({
      id: result.id,
      object: "text_completion",
      created: result.created,
      model: result.model,
      choices: result.choices.map(c => ({
        text: c.message.content,
        index: c.index,
        finish_reason: c.finish_reason,
      })),
      usage: result.usage,
    });
  } catch (e: any) {
    return NextResponse.json({ error: { message: e.message } }, { status: 500 });
  }
}
