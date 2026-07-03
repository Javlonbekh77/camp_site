import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

const variants = {
  primary: "bg-stcOrange text-white shadow-[0_0_15px_rgba(249,115,22,0.5)] hover:bg-orange-600 hover:shadow-[0_0_20px_rgba(249,115,22,0.7)]",
  secondary: "bg-white/5 text-white border border-white/10 hover:bg-white/10",
  dark: "bg-navy text-white border border-white/10 hover:bg-navyLight",
  ghost: "bg-transparent text-white hover:bg-white/5"
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants;
};

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={cn("focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-bold transition-all", variants[variant], className)}
      {...props}
    />
  );
}

type LinkButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  children: ReactNode;
  variant?: keyof typeof variants;
};

export function LinkButton({ className, variant = "primary", href, children, ...props }: LinkButtonProps) {
  return (
    <Link
      href={href}
      className={cn("focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-bold transition-all", variants[variant], className)}
      {...props}
    >
      {children}
    </Link>
  );
}
