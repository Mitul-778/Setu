import { cn } from "@/lib/utils";

export function Stepper({
  current,
  steps,
}: {
  current: number;
  steps: { num: number; label: string }[];
}) {
  return (
    <ol className="flex items-center gap-2 sm:gap-3">
      {steps.map((s, i) => {
        const isDone = s.num < current;
        const isCurrent = s.num === current;
        return (
          <li key={s.num} className="flex items-center gap-2">
            <div
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-full border text-xs font-semibold",
                isCurrent &&
                  "border-[var(--primary)] bg-[var(--primary)] text-[var(--on-primary)]",
                isDone &&
                  "border-[var(--primary)] bg-[var(--accent-soft)] text-[var(--foreground)]",
                !isCurrent &&
                  !isDone &&
                  "border-[var(--border)] bg-[var(--muted)] text-[var(--muted-foreground)]"
              )}
            >
              {isDone ? "✓" : s.num}
            </div>
            <span
              className={cn(
                "text-xs sm:text-sm",
                isCurrent
                  ? "font-medium text-[var(--foreground)]"
                  : "text-[var(--muted-foreground)]"
              )}
            >
              {s.label}
            </span>
            {i < steps.length - 1 && (
              <div className="hidden h-px w-6 bg-[var(--border)] sm:block" />
            )}
          </li>
        );
      })}
    </ol>
  );
}
