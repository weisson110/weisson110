import { NextResponse } from "next/server";
import { listModels } from "@/lib/openrouter-service";

export async function GET() {
  const models = await listModels();
  const data = models.map((m) => ({
    id: m.id,
    name: m.name,
    created: new Date(m.createdAt).getTime() / 1000,
    description: m.description,
    context_length: m.contextLength,
    pricing: {
      prompt: (m.pricing.input / 1_000_000).toString(),
      completion: (m.pricing.output / 1_000_000).toString(),
      input: m.pricing.input,
      output: m.pricing.output,
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
    provider: m.provider,
    tags: m.tags,
  }));

  return NextResponse.json({ data });
}
