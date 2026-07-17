import "./globals.css";
import type { Metadata } from "next";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "OpenRouter Clone - Unified LLM API",
  description: "The unified interface for LLMs. One API for all AI models.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen bg-[#09090b] font-sans antialiased">
        <Header />
        <main>{children}</main>
        <footer className="border-t border-zinc-900 py-8">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-2 text-[13px] text-zinc-500">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded bg-white text-[10px] font-bold text-black">◐</span>
                <span>OpenRouter Clone - Built for demonstration</span>
                <span className="hidden md:inline">•</span>
                <span className="hidden md:inline">Unified LLM Gateway</span>
              </div>
              <div className="flex items-center gap-4 text-[13px] text-zinc-500">
                <a href="#" className="hover:text-white">Status</a>
                <a href="#" className="hover:text-white">GitHub</a>
                <a href="#" className="hover:text-white">Twitter</a>
                <a href="#" className="hover:text-white">Discord</a>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
