import * as React from "react";
import { cn } from "@/lib/utils";

type Tone = "neutral" | "accent" | "warning" | "danger" | "brand";

const toneClass: Record<Tone, string> = {
  neutral: "bg-[var(--muted)] text-[var(--foreground)]",
  accent: "bg-[var(--accent-soft)] text-[var(--foreground)]",
  warning: "bg-[var(--warning-soft)] text-[var(--foreground)]",
  danger: "bg-[var(--danger-soft)] text-[var(--on-error-container)]",
  brand: "bg-[var(--brand-soft)] text-[var(--foreground)]",
};

export function Badge({
  className,
  tone = "neutral",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold leading-4",
        toneClass[tone],
        className
      )}
      {...props}
    />
  );
}
