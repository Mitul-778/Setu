"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ChatThread } from "@/components/chat-thread";

function ProviderChatThread() {
  const params = useSearchParams();
  return <ChatThread conversationId={params.get("conversationId") ?? undefined} />;
}

export default function ProviderChatThreadPage() {
  return (
    <Suspense fallback={null}>
      <ProviderChatThread />
    </Suspense>
  );
}
