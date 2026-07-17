import { Suspense } from "react";
import ChatClient from "./ChatClient";

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="p-8 text-sm text-zinc-500">Loading playground...</div>}>
      <ChatClient />
    </Suspense>
  );
}
