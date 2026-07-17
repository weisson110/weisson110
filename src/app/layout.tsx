import "./globals.css";
import type { Metadata } from "next";
import Header from "@/components/Header";
import { I18nProvider } from "@/components/I18nProvider";
import Footer from "@/components/Footer";

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
        <I18nProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </I18nProvider>
      </body>
    </html>
  );
}
