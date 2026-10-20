import type { HTMLAttributes } from "react";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "primary" | "secondary" | "accent" | "outline" | "success";
}

export function Badge({
  children,
  className = "",
  variant = "secondary",
  ...props
}: BadgeProps) {
  const variantClasses = {
    primary: "bg-primary text-primary-foreground",
    secondary: "bg-secondary text-secondary-foreground border border-secondary-foreground/15",
    accent: "bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-200 border border-amber-300 dark:border-amber-800",
    outline: "border border-border text-muted-foreground",
    success: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800",
  }[variant];

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium tracking-wide ${variantClasses} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
