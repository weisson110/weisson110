"use client";
import { useI18n } from "@/components/I18nProvider";

export default function DocsPage() {
  const { t } = useI18n();
  return (
    <div className="mx-auto max-w-[1000px] px-4 py-8 sm:px-6">
      <h1 className="text-[28px] font-semibold text-white">{t.docsPage.title}</h1>
      <p className="mt-2 text-[14px] text-zinc-400">{t.docsPage.subtitle}</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[200px_1fr]">
        <div className="space-y-6 text-[13px]">
          <div>
            <div className="font-semibold text-white">{t.docsPage.gettingStarted}</div>
            <ul className="mt-2 space-y-1.5 text-zinc-400">
              <li className="text-white">{t.docsPage.quickstart}</li>
              <li>{t.docsPage.authentication}</li>
              <li>{t.docsPage.models}</li>
              <li>{t.docsPage.streaming}</li>
            </ul>
          </div>
          <div>
            <div className="font-semibold text-white">{t.docsPage.features}</div>
            <ul className="mt-2 space-y-1.5 text-zinc-400">
              <li>{t.docsPage.routing}</li>
              <li>{t.docsPage.sorting}</li>
              <li>{t.docsPage.functionCalling}</li>
              <li>{t.docsPage.vision}</li>
            </ul>
          </div>
        </div>

        <div className="prose prose-invert max-w-none">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-6">
            <h2 className="text-[18px] font-semibold text-white">{t.docsPage.baseUrl}</h2>
            <code className="mt-2 block rounded bg-zinc-950 p-3 text-sm">https://openrouter.ai/api/v1</code>
            <h3 className="mt-6 text-[15px] font-semibold text-white">{t.docsPage.exampleRequest}</h3>
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
});

console.log(completion.choices[0].message.content);`}</pre>

            <h3 className="mt-8 text-[15px] font-semibold text-white">{t.docsPage.cloneProject}</h3>
            <div className="mt-3 space-y-2 text-[13px] text-zinc-400">
              <p>{t.docsPage.cloneDesc}</p>
              <ul className="list-disc pl-5">
                {t.docsPage.cloneList.map((item: string) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p className="mt-4">{t.docsPage.toMakeLive}</p>
              <ol className="list-decimal pl-5">
                {t.docsPage.toMakeList.map((item: string) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
