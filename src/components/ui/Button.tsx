import Link from "next/link";
import { cn } from "@/lib/cn";
import type { ButtonHTMLAttributes } from "react";

const base =
  "inline-flex items-center justify-center gap-2 rounded-[24px] px-6 py-3 font-heading font-semibold text-sm sm:text-base transition-transform duration-150 active:scale-95 disabled:opacity-50 disabled:pointer-events-none";

const variants = {
  primary: "bg-blush-strong text-blush-text hover:brightness-105 shadow-sm",
  soft: "bg-blush text-blush-text hover:brightness-105",
  sky: "bg-sky text-sky-text hover:brightness-105",
  mint: "bg-mint text-mint-text hover:brightness-105",
  ghost: "bg-transparent text-heading hover:bg-white/50",
  outline: "bg-surface text-heading border border-blush-strong hover:bg-blush/40",
};

type Variant = keyof typeof variants;

export function Button({
  variant = "primary",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button className={cn(base, variants[variant], className)} {...props} />
  );
}

export function LinkButton({
  href,
  variant = "primary",
  className,
  children,
}: {
  href: string;
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className={cn(base, variants[variant], className)}>
      {children}
    </Link>
  );
}
