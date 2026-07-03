"use client";

import { Play, Volume2 } from "lucide-react";
import { useState } from "react";

export function VideoHero() {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="grid h-full place-items-center p-8 text-center">
        <div>
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-white text-navy shadow-glow">
            <Play fill="currentColor" />
          </div>
          <p className="mt-5 text-xl font-black">STC-2026 launch video</p>
          <p className="mt-2 text-sm text-white/70">Video joyi tayyor. `public/videos/stc-launch.mp4` qo'shilsa autoplay ishlaydi.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full bg-slate-950">
      <video
        className="h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        onError={() => setFailed(true)}
      >
        <source src="/videos/stc-launch.mp4" type="video/mp4" />
      </video>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/52 via-transparent to-slate-950/16" />
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between rounded-lg bg-black/42 px-3 py-2 text-xs font-bold text-white backdrop-blur">
        <span>Autoplay video</span>
        <span className="inline-flex items-center gap-1 text-white/70"><Volume2 size={14} /> sound optional</span>
      </div>
    </div>
  );
}
