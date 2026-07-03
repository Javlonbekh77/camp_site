import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Badge({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center rounded-full bg-white/5 px-3 py-1 text-xs font-bold text-white border border-white/10", className)}>
      {children}
    </span>
  );
}
