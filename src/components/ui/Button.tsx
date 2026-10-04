import Link from "next/link";
import { cn } from "@/lib/cn";
import type { ButtonHTMLAttributes } from "react";

const base =
  "pixel-panel pixel-pressable inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl px-6 py-3 font-heading font-semibold text-sm sm:text-base active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none";

const variants = {
  primary: "bg-purple text-white hover:brightness-105",
  soft: "bg-blush text-blush-text hover:brightness-105",
  lavender: "bg-lavender-strong text-lavender-text hover:brightness-105",
  sky: "bg-sky text-sky-text hover:brightness-105",
  mint: "bg-mint text-mint-text hover:brightness-105",
  peach: "bg-peach text-peach-text hover:brightness-105",
  ghost: "bg-transparent text-heading shadow-none hover:bg-white/50",
  outline: "bg-surface text-heading border-2 border-purple hover:bg-lavender/40",
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
