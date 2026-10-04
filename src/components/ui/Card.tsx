import { cn } from "@/lib/cn";
import type { HTMLAttributes } from "react";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "pixel-panel bg-surface rounded-[22px] shadow-[0_4px_20px_rgba(91,71,137,0.1)] p-6",
        className,
      )}
      {...props}
    />
  );
}
