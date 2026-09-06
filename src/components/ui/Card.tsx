import { cn } from "@/lib/cn";
import type { HTMLAttributes } from "react";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "bg-surface rounded-[22px] shadow-[0_4px_20px_rgba(122,59,87,0.08)] p-6",
        className,
      )}
      {...props}
    />
  );
}
