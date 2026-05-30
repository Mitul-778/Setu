"use client";

import { ConversationsList } from "@/components/conversations-list";
import { loadCustomerConversations } from "@/services/chat-conversations-service";

export default function CustomerMessagesPage() {
  return (
    <ConversationsList
      backHref="/customer"
      chatHref={(conversationId) => `/customer/chat-thread?conversationId=${conversationId}`}
      load={loadCustomerConversations}
      title="Messages"
    />
  );
}
