"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, BadgeCheck, CheckCheck, ImagePlus, MoreVertical, Paperclip, Send, Sparkles, User } from "lucide-react";
import { loadChatThread, sendChatMessage, type ChatMessage, type ChatThread as ChatThreadData } from "@/services/chat-service";
import { SetuLoader } from "@/components/setu-loader";

const quickReplies = [
  "Can you share more details?",
  "Can you do 5 PM?",
  "Yes, please send a quote",
];

export function ChatThread({
  conversationId,
  providerId,
}: {
  conversationId?: string;
  providerId?: string;
}) {
  const router = useRouter();

  const [thread, setThread] = useState<ChatThreadData | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!conversationId && !providerId) {
      /* eslint-disable react-hooks/set-state-in-effect */
      setError("No conversation selected.");
      setIsLoading(false);
      /* eslint-enable react-hooks/set-state-in-effect */
      return;
    }

    let cancelled = false;
    loadChatThread({ conversationId, providerId })
      .then((data) => {
        if (cancelled) return;
        setThread(data);
        setMessages(data.messages);
        setError("");
      })
      .catch((loadError) => {
        if (cancelled) return;
        setError(loadError instanceof Error ? loadError.message : "Could not load the conversation.");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [conversationId, providerId]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [messages]);

  async function handleSend(text?: string) {
    const value = (text ?? input).trim();
    if (!value || !thread || sending) return;

    setSending(true);
    setError("");
    try {
      const result = await sendChatMessage(thread.conversationId, value);
      setMessages((current) => [...current, result.message]);
      if (text === undefined) setInput("");
    } catch (sendError) {
      setError(sendError instanceof Error ? sendError.message : "Could not send the message.");
    } finally {
      setSending(false);
    }
  }

  const otherParty = thread?.otherParty;

  return (
    <main className="h-dvh overflow-hidden bg-black text-[var(--on-surface)]">
      <div className="mx-auto flex h-dvh w-full min-w-0 max-w-[480px] flex-col overflow-hidden bg-[var(--surface)]">
        <header className="shrink-0 border-b border-[var(--outline-variant)] bg-[var(--surface)]">
          <div className="flex h-16 items-center gap-2 px-3 min-[390px]:px-4">
            <button
              aria-label="Go back"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[var(--primary)]"
              onClick={() => router.back()}
              type="button"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>

            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[var(--outline-variant)] bg-[var(--surface-container-high)]">
              <div className="absolute inset-0 bg-[linear-gradient(135deg,#ffffff_0%,#dadada_100%)]" />
              <User className="absolute bottom-0 h-7 w-7 text-[var(--on-surface-variant)] opacity-45" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex min-w-0 items-center gap-1">
                <h1 className="truncate text-headline-sm">{otherParty?.name ?? "Conversation"}</h1>
                <BadgeCheck className="h-4 w-4 shrink-0 fill-current" />
              </div>
              <p className="truncate text-body-sm text-[var(--on-surface-variant)]">
                {otherParty?.subtitle ?? "Chat"} · <span className="text-[var(--primary)]">Online</span>
              </p>
            </div>

            <button
              aria-label="More options"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[var(--primary)]"
              type="button"
            >
              <MoreVertical className="h-5 w-5" />
            </button>
          </div>
        </header>

        <section className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto bg-[var(--surface-container-lowest)] px-4 py-4 min-[390px]:px-5">
          {isLoading ? (
            <SetuLoader label="Loading conversation..." />
          ) : error && !thread ? (
            <p className="rounded-md border border-[var(--error)] bg-[var(--error-container)] px-3 py-2 text-body-sm text-[var(--on-error-container)]">
              {error}
            </p>
          ) : messages.length === 0 ? (
            <p className="my-auto text-center text-body-sm text-[var(--on-surface-variant)]">
              Say hello to start the conversation.
            </p>
          ) : (
            messages.map((message) =>
              message.mine ? (
                <MineMessage key={message.id} message={message} />
              ) : (
                <OtherMessage key={message.id} message={message} />
              ),
            )
          )}
          <div ref={endRef} />
        </section>

        {thread ? (
          <footer className="shrink-0 border-t border-[var(--outline-variant)] bg-[var(--surface)]">
            <div className="no-scrollbar flex gap-2 overflow-x-auto overscroll-x-contain border-b border-[var(--surface-variant)] bg-[var(--surface-container-lowest)] px-4 py-2 min-[390px]:px-5">
              {quickReplies.map((reply) => (
                <button
                  className="min-h-9 shrink-0 rounded-full border border-[var(--outline-variant)] bg-[var(--surface-container-low)] px-4 text-label-md disabled:opacity-60"
                  disabled={sending}
                  key={reply}
                  onClick={() => handleSend(reply)}
                  type="button"
                >
                  {reply}
                </button>
              ))}
            </div>

            {error ? (
              <p className="px-4 pt-2 text-label-sm text-[var(--danger)] min-[390px]:px-5">{error}</p>
            ) : null}

            <div className="flex items-end gap-2 px-4 py-3 min-[390px]:px-5">
              <button
                aria-label="Add attachment"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[var(--on-surface-variant)]"
                type="button"
              >
                <Paperclip className="h-5 w-5" />
              </button>
              <button
                aria-label="Add image"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[var(--on-surface-variant)]"
                type="button"
              >
                <ImagePlus className="h-5 w-5" />
              </button>

              <div className="flex min-h-11 min-w-0 flex-1 items-center rounded-xl border border-[var(--outline)] bg-[var(--surface-container-lowest)] px-3 focus-within:border-[var(--primary)]">
                <input
                  className="min-w-0 flex-1 border-0 bg-transparent p-0 text-body-md outline-none placeholder:text-[var(--on-surface-variant)]"
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Type a message..."
                  type="text"
                  value={input}
                />
                <button
                  aria-label="AI assist"
                  className="ml-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[var(--on-surface-variant)]"
                  type="button"
                >
                  <Sparkles className="h-4 w-4" />
                </button>
              </div>

              <button
                aria-label="Send message"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--primary)] text-[var(--on-primary)] disabled:opacity-60"
                disabled={sending || !input.trim()}
                onClick={() => handleSend()}
                type="button"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
            <div className="h-[env(safe-area-inset-bottom)]" />
          </footer>
        ) : null}
      </div>
    </main>
  );
}

function MineMessage({ message }: { message: ChatMessage }) {
  return (
    <div className="flex max-w-[86%] flex-col items-end self-end">
      <div className="rounded-xl rounded-tr-sm bg-[var(--primary)] p-3 text-[var(--on-primary)]">
        <p className="text-body-md">{message.body}</p>
      </div>
      <div className="mt-1 flex items-center gap-1 px-1 text-label-sm text-[var(--on-surface-variant)]">
        {message.timeLabel}
        <CheckCheck className="h-3.5 w-3.5" />
      </div>
    </div>
  );
}

function OtherMessage({ message }: { message: ChatMessage }) {
  return (
    <div className="flex max-w-[86%] flex-col items-start self-start">
      <div className="rounded-xl rounded-tl-sm border border-[var(--outline-variant)] bg-[var(--surface-container-low)] p-3 shadow-[0_1px_2px_rgb(0_0_0_/_0.04)]">
        <p className="text-body-md">{message.body}</p>
      </div>
      <span className="mt-1 px-1 text-label-sm text-[var(--on-surface-variant)]">{message.timeLabel}</span>
    </div>
  );
}
