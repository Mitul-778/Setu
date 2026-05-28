import {
  ArrowLeft,
  BadgeCheck,
  Bot,
  CheckCheck,
  FileText,
  ImagePlus,
  MoreVertical,
  Paperclip,
  Send,
  Sparkles,
  Star,
  User,
} from "lucide-react";

const quickReplies = [
  "Can you share more examples?",
  "Can you arrive by 5 PM?",
  "Yes, please send quote",
];

const suggestedPrompts = [
  "Can you share more examples?",
  "Can you arrive by 5 PM?",
  "Is organic henna included?",
];

export default function CustomerChatThreadPage() {
  return (
    <main className="h-dvh overflow-hidden bg-black text-[var(--on-surface)]">
      <div className="mx-auto flex h-dvh w-full min-w-0 max-w-[480px] flex-col overflow-hidden bg-[var(--surface)]">
        <ChatHeader />

        <section className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto bg-[var(--surface-container-lowest)] px-4 py-4 min-[390px]:px-5">
          <Timestamp />
          <ProviderMessage
            translated
            text="Namaste! I can help with the bridal mehendi. Which package are you interested in?"
            time="2:14 PM"
          />
          <UserMessage
            text="I'm looking at the Basic Bridal package."
            time="2:16 PM"
          />
          <ProviderMessage
            text="Great. That includes both hands and feet. Should I send a custom quote for 3 people?"
            time="2:18 PM"
          />
          <PackageCard />
          <UserMessage
            text="Can you arrive by 5 PM? We need to finish before guests come in."
            time="2:20 PM"
          />
          <ProviderMessage
            translated
            text="Yes, 5 PM works. I can reach 10 minutes early and bring two design books."
            time="2:21 PM"
          />
          <PromptPanel />
        </section>

        <ChatComposer />
      </div>
    </main>
  );
}

function ChatHeader() {
  return (
    <header className="shrink-0 border-b border-[var(--outline-variant)] bg-[var(--surface)]">
      <div className="flex h-16 items-center gap-2 px-3 min-[390px]:px-4">
        <button
          aria-label="Go back"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[var(--primary)]"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[var(--outline-variant)] bg-[var(--surface-container-high)]">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,#ffffff_0%,#dadada_100%)]" />
          <User className="absolute bottom-0 h-7 w-7 text-[var(--on-surface-variant)] opacity-45" />
          <span className="relative z-10 text-label-sm">AS</span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 items-center gap-1">
            <h1 className="truncate text-headline-sm">Arjun Singh</h1>
            <BadgeCheck className="h-4 w-4 shrink-0 fill-current" />
          </div>
          <p className="truncate text-body-sm text-[var(--on-surface-variant)]">
            Mehendi Artist · <span className="text-[var(--primary)]">Online</span>
          </p>
        </div>

        <button
          aria-label="More options"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[var(--primary)]"
        >
          <MoreVertical className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}

function Timestamp() {
  return (
    <div className="flex justify-center">
      <span className="rounded-full border border-[var(--outline-variant)] bg-[var(--surface-container-low)] px-3 py-1 text-label-sm text-[var(--on-surface-variant)]">
        Today, 2:14 PM
      </span>
    </div>
  );
}

function ProviderMessage({
  text,
  time,
  translated,
}: {
  text: string;
  time: string;
  translated?: boolean;
}) {
  return (
    <div className="flex max-w-[86%] flex-col items-start self-start">
      <div className="rounded-xl rounded-tl-sm border border-[var(--outline-variant)] bg-[var(--surface-container-low)] p-3 shadow-[0_1px_2px_rgb(0_0_0_/_0.04)]">
        <p className="text-body-md">{text}</p>
        {translated ? (
          <div className="mt-2 flex items-center gap-1 text-label-sm text-[var(--on-surface-variant)]">
            <Bot className="h-3.5 w-3.5" />
            Translated from Hindi
          </div>
        ) : null}
      </div>
      <span className="mt-1 px-1 text-label-sm text-[var(--on-surface-variant)]">
        {time}
      </span>
    </div>
  );
}

function UserMessage({ text, time }: { text: string; time: string }) {
  return (
    <div className="flex max-w-[86%] flex-col items-end self-end">
      <div className="rounded-xl rounded-tr-sm bg-[var(--primary)] p-3 text-[var(--on-primary)]">
        <p className="text-body-md">{text}</p>
      </div>
      <div className="mt-1 flex items-center gap-1 px-1 text-label-sm text-[var(--on-surface-variant)]">
        {time}
        <CheckCheck className="h-3.5 w-3.5" />
      </div>
    </div>
  );
}

function PackageCard() {
  return (
    <article className="ml-3 max-w-[92%] rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] p-3 shadow-[0_1px_2px_rgb(0_0_0_/_0.04)]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 shrink-0" />
            <h2 className="truncate text-label-lg">Basic Bridal package</h2>
          </div>
          <p className="mt-1 text-body-sm text-[var(--on-surface-variant)]">
            Both hands till wrist, simple feet design, organic henna included.
          </p>
        </div>
        <span className="shrink-0 text-headline-sm">{"\u20B9"}1,500</span>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <span className="flex items-center gap-1 rounded bg-[var(--surface-container-low)] px-2 py-1 text-label-sm">
          <Star className="h-3 w-3 fill-current" />
          4.8 rated
        </span>
        <span className="rounded bg-[var(--surface-container-low)] px-2 py-1 text-label-sm">
          2 hours
        </span>
        <span className="rounded bg-[var(--surface-container-low)] px-2 py-1 text-label-sm">
          Custom quote available
        </span>
      </div>
    </article>
  );
}

function PromptPanel() {
  return (
    <section className="rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-low)] p-3">
      <div className="mb-2 flex items-center gap-2 text-label-md text-[var(--on-surface-variant)]">
        <Sparkles className="h-4 w-4" />
        Suggested prompts
      </div>
      <div className="flex flex-wrap gap-2">
        {suggestedPrompts.map((prompt) => (
          <button
            className="min-h-9 rounded-full border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] px-3 text-label-md"
            key={prompt}
          >
            {prompt}
          </button>
        ))}
      </div>
    </section>
  );
}

function ChatComposer() {
  return (
    <footer className="shrink-0 border-t border-[var(--outline-variant)] bg-[var(--surface)]">
      <div className="no-scrollbar flex gap-2 overflow-x-auto overscroll-x-contain border-b border-[var(--surface-variant)] bg-[var(--surface-container-lowest)] px-4 py-2 min-[390px]:px-5">
        {quickReplies.map((reply, index) => (
          <button
            className={
              index === 2
                ? "min-h-9 shrink-0 rounded-full border border-[var(--primary)] bg-[var(--primary)] px-4 text-label-md text-[var(--on-primary)]"
                : "min-h-9 shrink-0 rounded-full border border-[var(--outline-variant)] bg-[var(--surface-container-low)] px-4 text-label-md"
            }
            key={reply}
          >
            {reply}
          </button>
        ))}
      </div>

      <div className="flex items-end gap-2 px-4 py-3 min-[390px]:px-5">
        <button
          aria-label="Add attachment"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[var(--on-surface-variant)]"
        >
          <Paperclip className="h-5 w-5" />
        </button>
        <button
          aria-label="Add image"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[var(--on-surface-variant)]"
        >
          <ImagePlus className="h-5 w-5" />
        </button>

        <div className="flex min-h-11 min-w-0 flex-1 items-center rounded-xl border border-[var(--outline)] bg-[var(--surface-container-lowest)] px-3 focus-within:border-[var(--primary)]">
          <input
            className="min-w-0 flex-1 border-0 bg-transparent p-0 text-body-md outline-none placeholder:text-[var(--on-surface-variant)]"
            placeholder="Type a message..."
            type="text"
          />
          <button
            aria-label="AI assist"
            className="ml-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[var(--on-surface-variant)]"
          >
            <Sparkles className="h-4 w-4" />
          </button>
        </div>

        <button
          aria-label="Send message"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--primary)] text-[var(--on-primary)]"
        >
          <Send className="h-5 w-5" />
        </button>
      </div>
      <div className="h-[env(safe-area-inset-bottom)]" />
    </footer>
  );
}
