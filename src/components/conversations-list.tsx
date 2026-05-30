"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, MessageSquare, User } from "lucide-react";
import type { ConversationSummary } from "@/services/chat-conversations-service";

export function ConversationsList({
  title,
  backHref,
  chatHref,
  load,
}: {
  title: string;
  backHref: string;
  chatHref: (conversationId: string) => string;
  load: () => Promise<{ ok: true; conversations: ConversationSummary[] }>;
}) {
  const router = useRouter();
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    load()
      .then((data) => {
        if (cancelled) return;
        setConversations(data.conversations);
        setError("");
      })
      .catch((loadError) => {
        if (cancelled) return;
        setError(loadError instanceof Error ? loadError.message : "Could not load messages.");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // load is a stable module function passed by the page.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="min-h-dvh overflow-x-hidden bg-black text-[var(--on-surface)]">
      <div className="mx-auto min-h-dvh w-full min-w-0 max-w-[480px] overflow-x-hidden bg-[var(--surface)] pb-[calc(24px+env(safe-area-inset-bottom))]">
        <header className="sticky top-0 z-40 border-b border-[var(--outline-variant)] bg-[var(--surface)]">
          <div className="grid h-14 grid-cols-[2.75rem_1fr_2.75rem] items-center px-3 min-[390px]:px-4">
            <button
              aria-label="Go back"
              className="flex h-11 w-11 items-center justify-center rounded-full text-[var(--primary)]"
              onClick={() => router.push(backHref)}
              type="button"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="truncate text-center text-headline-sm text-[var(--primary)]">{title}</h1>
            <div className="h-11 w-11" />
          </div>
        </header>

        <section className="flex min-w-0 flex-col gap-2 px-4 py-4 min-[390px]:px-5">
          {isLoading ? (
            <p className="text-body-sm text-[var(--on-surface-variant)]">Loading messages...</p>
          ) : error ? (
            <p className="rounded-md border border-[var(--error)] bg-[var(--error-container)] px-3 py-2 text-body-sm text-[var(--on-error-container)]">
              {error}
            </p>
          ) : conversations.length === 0 ? (
            <div className="rounded-lg border border-dashed border-[var(--outline-variant)] bg-[var(--surface-container-low)] p-6 text-center">
              <MessageSquare className="mx-auto h-6 w-6 text-[var(--on-surface-variant)]" />
              <p className="mt-2 text-body-md text-[var(--on-surface)]">No conversations yet.</p>
              <p className="mt-1 text-body-sm text-[var(--on-surface-variant)]">
                Messages will appear here once a chat begins.
              </p>
            </div>
          ) : (
            conversations.map((conversation) => (
              <Link
                className="flex items-center gap-3 rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-3"
                href={chatHref(conversation.id)}
                key={conversation.id}
              >
                <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[var(--outline-variant)] bg-[var(--surface-container-high)]">
                  <div className="absolute inset-0 bg-[linear-gradient(135deg,#ffffff_0%,#dadada_100%)]" />
                  <User className="absolute bottom-0 h-7 w-7 text-[var(--on-surface-variant)] opacity-45" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="truncate text-label-lg text-[var(--on-surface)]">{conversation.name}</h2>
                    <span className="shrink-0 text-label-sm text-[var(--on-surface-variant)]">
                      {conversation.timeLabel}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-body-sm text-[var(--on-surface-variant)]">
                      {conversation.lastMessage}
                    </p>
                    {conversation.unread > 0 ? (
                      <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-[var(--primary)] px-1.5 text-label-sm text-[var(--on-primary)]">
                        {conversation.unread}
                      </span>
                    ) : null}
                  </div>
                </div>
              </Link>
            ))
          )}
        </section>
      </div>
    </main>
  );
}
