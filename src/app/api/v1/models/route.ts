import { NextResponse } from "next/server";
import { models } from "@/lib/models";

export async function GET() {
  // Transform to OpenRouter compatible format
  const data = models.map((m) => ({
    id: m.id,
    name: m.name,
    created: new Date(m.createdAt).getTime() / 1000,
    description: m.description,
    context_length: m.contextLength,
    pricing: {
      prompt: (m.pricing.input / 1_000_000).toString(),
      completion: (m.pricing.output / 1_000_000).toString(),
    },
    architecture: {
      modality: m.modality.join("+"),
      tokenizer: "openai",
      instruct_type: "chat",
    },
    top_provider: {
      context_length: m.contextLength,
      max_completion_tokens: 4096,
      is_moderated: false,
    },
    permaslug: m.id,
  }));

  return NextResponse.json({ data });
}
