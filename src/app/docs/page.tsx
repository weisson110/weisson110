export default function DocsPage() {
  return (
    <div className="mx-auto max-w-[1000px] px-4 py-8 sm:px-6">
      <h1 className="text-[28px] font-semibold text-white">OpenRouter Clone Docs</h1>
      <p className="mt-2 text-[14px] text-zinc-400">Drop-in OpenAI-compatible API for all models.</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[200px_1fr]">
        <div className="space-y-6 text-[13px]">
          <div>
            <div className="font-semibold text-white">Getting Started</div>
            <ul className="mt-2 space-y-1.5 text-zinc-400">
              <li className="text-white">Quickstart</li>
              <li>Authentication</li>
              <li>Models</li>
              <li>Streaming</li>
            </ul>
          </div>
          <div>
            <div className="font-semibold text-white">Features</div>
            <ul className="mt-2 space-y-1.5 text-zinc-400">
              <li>Routing & Fallbacks</li>
              <li>Provider Sorting</li>
              <li>Function Calling</li>
              <li>Vision</li>
            </ul>
          </div>
        </div>

        <div className="prose prose-invert max-w-none">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-6">
            <h2 className="text-[18px] font-semibold text-white">Base URL</h2>
            <code className="mt-2 block rounded bg-zinc-950 p-3 text-sm">https://openrouter.ai/api/v1</code>
            <h3 className="mt-6 text-[15px] font-semibold text-white">Example Request</h3>
            <pre className="mt-3 overflow-x-auto rounded-lg bg-zinc-950 p-4 text-[12px] text-zinc-300">{`// npm i openai
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": "https://your-app.com",
    "X-Title": "Your App Name",
  },
});

const completion = await openai.chat.completions.create({
  model: "anthropic/claude-3.5-sonnet",
  messages: [{ role: "user", content: "Hi" }],
  // Optional OpenRouter params
  // models: ["anthropic/claude-3.5-sonnet", "openai/gpt-4o"],
  // route: "fallback",
});

console.log(completion.choices[0].message.content);`}</pre>

            <h3 className="mt-8 text-[15px] font-semibold text-white">This Clone Project</h3>
            <div className="mt-3 space-y-2 text-[13px] text-zinc-400">
              <p>This is a high-fidelity clone built with Next.js 14 + Tailwind. It includes:</p>
              <ul className="list-disc pl-5">
                <li>Landing page with hero, code demo, stats</li>
                <li>Models listing with search, filters, sorting</li>
                <li>Model detail with providers & code snippet</li>
                <li>Chat playground (mocked streaming)</li>
                <li>API Keys management UI</li>
                <li>Rankings page</li>
                <li>Dark theme matching openrouter.ai</li>
              </ul>
              <p className="mt-4">To make it fully functional:</p>
              <ol className="list-decimal pl-5">
                <li>Add backend route <code>/api/chat/completions</code> that proxies to OpenRouter or directly to providers</li>
                <li>Store API keys in database (Prisma + Postgres)</li>
                <li>Add auth via NextAuth / Clerk</li>
                <li>Implement real billing via Stripe</li>
                <li>Connect to OpenRouter API to fetch live models list: <code>GET https://openrouter.ai/api/v1/models</code></li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
