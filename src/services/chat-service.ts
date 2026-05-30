export type ChatRole = "customer" | "provider";

export type ChatMessage = {
  id: string;
  sender: ChatRole;
  body: string;
  timeLabel: string;
  mine: boolean;
};

export type ChatThread = {
  ok: true;
  conversationId: string;
  currentRole: ChatRole;
  otherParty: { name: string; subtitle: string };
  messages: ChatMessage[];
};

export type SendMessageResponse = {
  ok: true;
  message: ChatMessage;
};

export async function loadChatThread(params: { conversationId?: string; providerId?: string }) {
  const query = new URLSearchParams();
  if (params.conversationId) query.set("conversationId", params.conversationId);
  else if (params.providerId) query.set("providerId", params.providerId);

  const response = await fetch(`/api/chat/thread?${query.toString()}`, { method: "GET", cache: "no-store" });
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.error ?? "Could not load the conversation.");
  }

  return data as ChatThread;
}

export async function sendChatMessage(conversationId: string, body: string) {
  const response = await fetch("/api/chat/thread", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ conversationId, body }),
  });
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const detail = data?.detail ? ` ${data.detail}` : "";
    throw new Error(`${data?.error ?? "Could not send the message."}${detail}`);
  }

  return data as SendMessageResponse;
}
