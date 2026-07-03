"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { faqs } from "@/data/faqs";
import { cn } from "@/lib/utils";

export function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="grid gap-3">
      {faqs.map(({ question, answer }, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={question} className="rounded-2xl bg-navyLight/80 ring-1 ring-white/10 transition-all hover:bg-navyLight overflow-hidden">
            <button
              className="flex w-full items-center justify-between p-5 text-left focus:outline-none"
              onClick={() => setOpenIndex(isOpen ? null : index)}
            >
              <span className="font-bold text-white pr-4">{question}</span>
              <div className={cn("grid h-8 w-8 place-items-center rounded-full bg-white/5 text-slate-400 transition-transform duration-300", isOpen && "rotate-45 bg-cyan-500/20 text-cyan-400")}>
                <Plus size={18} />
              </div>
            </button>
            <div className={cn("grid transition-all duration-300", isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}>
              <div className="overflow-hidden">
                <p className="px-5 pb-5 text-sm leading-relaxed text-slate-400">{answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
