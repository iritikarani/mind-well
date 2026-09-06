import { cn } from "@/lib/cn";
import type { HTMLAttributes } from "react";

const tones = {
  blush: "bg-blush text-blush-text",
  butter: "bg-butter text-butter-text",
  sky: "bg-sky text-sky-text",
  mint: "bg-mint text-mint-text",
  peach: "bg-peach text-blush-text",
  muted: "bg-white/70 text-muted",
};

export function Pill({
  tone = "blush",
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement> & { tone?: keyof typeof tones }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
