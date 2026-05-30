"use client";

import { ConversationsList } from "@/components/conversations-list";
import { loadProviderConversations } from "@/services/chat-conversations-service";

export default function ProviderMessagesPage() {
  return (
    <ConversationsList
      backHref="/provider/dashboard"
      chatHref={(conversationId) => `/provider/chat-thread?conversationId=${conversationId}`}
      load={loadProviderConversations}
      title="Messages"
    />
  );
}
