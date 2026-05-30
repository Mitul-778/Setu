export type ConversationSummary = {
  id: string;
  name: string;
  subtitle: string;
  lastMessage: string;
  timeLabel: string;
  unread: number;
};

async function loadConversations(url: string) {
  const response = await fetch(url, { method: "GET", cache: "no-store" });
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(data?.error ?? "Could not load messages.");
  }
  return data as { ok: true; conversations: ConversationSummary[] };
}

export function loadCustomerConversations() {
  return loadConversations("/api/customer/conversations");
}

export function loadProviderConversations() {
  return loadConversations("/api/provider/conversations");
}
