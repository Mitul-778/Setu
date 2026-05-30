"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ChatThread } from "@/components/chat-thread";

function CustomerChatThread() {
  const params = useSearchParams();
  return (
    <ChatThread
      conversationId={params.get("conversationId") ?? undefined}
      providerId={params.get("providerId") ?? undefined}
    />
  );
}

export default function CustomerChatThreadPage() {
  return (
    <Suspense fallback={null}>
      <CustomerChatThread />
    </Suspense>
  );
}
