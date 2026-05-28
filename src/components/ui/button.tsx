import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const variantClass: Record<Variant, string> = {
  primary:
    "bg-[var(--primary)] text-[var(--on-primary)] hover:bg-[var(--primary-container)] active:bg-[var(--primary-container)] disabled:opacity-50",
  secondary:
    "bg-[var(--secondary)] text-[var(--on-secondary)] hover:bg-[var(--primary-container)] disabled:opacity-50",
  outline:
    "bg-transparent border border-[var(--primary)] text-[var(--foreground)] hover:bg-[var(--muted)]",
  ghost: "bg-transparent hover:bg-[var(--muted)] text-[var(--foreground)]",
  danger:
    "bg-[var(--danger)] text-[var(--on-error)] hover:bg-[var(--on-error-container)] disabled:opacity-50",
};

const sizeClass: Record<Size, string> = {
  sm: "min-h-12 px-3 text-sm",
  md: "min-h-12 px-4 text-sm",
  lg: "min-h-12 px-6 text-base",
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-colors disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]",
        variantClass[variant],
        sizeClass[size],
        className
      )}
      {...props}
    />
  )
);
Button.displayName = "Button";
