"use client";

import { Menu, X, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { LinkButton } from "@/components/ui/Button";

const links = [
  ["Home", "/"],
  ["Camp'lar", "/#camps"],
  ["Moslik testi", "/quiz"],
  ["Reja", "/#dates"],
  ["FAQ", "/#faq"],
  ["Bog'lanish", "#"]
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const [lastY, setLastY] = useState(0);
  const [atTop, setAtTop] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setAtTop(currentY < 20);
      if (currentY < 20) {
        setVisible(true);
      } else if (currentY > lastY && currentY > 80) {
        // Scrolling down — hide
        setVisible(false);
        setOpen(false);
      } else {
        // Scrolling up — show
        setVisible(true);
      }
      setLastY(currentY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastY]);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-transform duration-300 ${
        visible ? "translate-y-0" : "-translate-y-full"
      } ${atTop ? "border-b border-transparent bg-transparent" : "border-b border-white/5 bg-navy/90 backdrop-blur-xl"}`}
    >
      <div className="container flex h-[72px] items-center justify-between">
        <Link href="/" className="focus-ring flex items-center gap-3 rounded-lg">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-navyLight border border-white/10 text-sm font-black text-white shadow-lg">STC</span>
          <span>
            <span className="block text-sm font-black text-white tracking-wide">STC-2026</span>
            <span className="block text-[11px] text-cyan-400 font-bold uppercase tracking-widest">Summer Tech Camp</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {links.map(([label, href]) => (
            <Link key={href} href={href} className="focus-ring rounded-md text-sm font-bold text-slate-300 hover:text-white transition-colors">
              {label}
            </Link>
          ))}
          <LinkButton href="/register" className="bg-orange-500 hover:bg-orange-400 border-none shadow-[0_0_15px_rgba(249,115,22,0.4)] text-white ml-2 rounded-xl py-2.5 px-6 flex items-center gap-1">
            Ro'yxatdan o'tish <ArrowRight size={16} />
          </LinkButton>
        </nav>

        <button className="focus-ring rounded-lg p-2 lg:hidden text-white hover:bg-white/10" onClick={() => setOpen((v) => !v)} aria-label="Menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="border-t border-white/10 bg-navyLight/95 backdrop-blur-md lg:hidden">
          <div className="container grid gap-2 py-4">
            {links.map(([label, href]) => (
              <Link key={href} href={href} className="rounded-lg px-4 py-3 font-bold text-slate-300 hover:bg-white/5 hover:text-white" onClick={() => setOpen(false)}>
                {label}
              </Link>
            ))}
            <LinkButton href="/register" className="w-full mt-2 bg-orange-500 border-none" onClick={() => setOpen(false)}>
              Ro'yxatdan o'tish
            </LinkButton>
          </div>
        </div>
      )}
    </header>
  );
}
