import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "flex min-h-12 w-full rounded-md border border-[var(--outline)] bg-[var(--card)] px-3 py-2 text-sm leading-5 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--primary)] disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    {...props}
  />
));
Input.displayName = "Input";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "flex min-h-24 w-full rounded-md border border-[var(--outline)] bg-[var(--card)] px-3 py-2 text-sm leading-5 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--primary)] disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";

export function Label({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn("text-sm font-medium text-[var(--foreground)]", className)}
      {...props}
    />
  );
}
