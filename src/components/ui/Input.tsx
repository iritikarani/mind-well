import { cn } from "@/lib/cn";
import type { InputHTMLAttributes, LabelHTMLAttributes } from "react";

export function Label(props: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      {...props}
      className={cn("block text-sm font-semibold text-heading mb-1.5", props.className)}
    />
  );
}

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "w-full rounded-2xl border border-black/5 bg-white/80 px-4 py-2.5 text-sm text-heading placeholder:text-muted",
        "focus:outline-none focus:ring-2 focus:ring-blush-strong/60 focus:border-transparent",
        className,
      )}
    />
  );
}

export function FieldError({ children }: { children?: string | null }) {
  if (!children) return null;
  return <p className="mt-1.5 text-xs font-medium text-rose-500">{children}</p>;
}
