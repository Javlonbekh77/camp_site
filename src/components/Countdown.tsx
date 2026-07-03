"use client";

import { useEffect, useMemo, useState } from "react";

export function Countdown({ target }: { target: string }) {
  const deadline = useMemo(() => new Date(target).getTime(), [target]);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const diff = Math.max(0, deadline - now);
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);
  const minutes = Math.floor((diff % 3_600_000) / 60_000);

  return (
    <div className="rounded-2xl border border-orange-500/20 bg-orange-500/10 p-4 text-center backdrop-blur-md">
      <p className="mb-4 text-xs font-black uppercase tracking-widest text-orange-300">Qabul tugashiga qolgan vaqt</p>
      <div className="grid grid-cols-3 gap-3">
        {[
          ["kun", days],
          ["soat", hours],
          ["daq", minutes]
        ].map(([label, value]) => (
          <div key={label} className="rounded-xl bg-navy/80 border border-orange-500/20 px-3 py-3 text-center shadow-[0_0_15px_rgba(249,115,22,0.15)]">
            <div className="text-3xl font-black text-white md:text-4xl">{value}</div>
            <div className="text-[10px] font-black uppercase tracking-widest text-orange-300/70 mt-1">{label}</div>
          </div>
        ))}
      </div>
      <p className="mt-4 text-xs font-semibold text-orange-200/60">11-iyul 2026, 23:59 dan keyin qabul yopiladi.</p>
    </div>
  );
}
