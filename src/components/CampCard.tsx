import { ArrowRight, Calendar, Clock, RotateCcw } from "lucide-react";
import Link from "next/link";
import { campIcons, type Camp } from "@/data/camps";
import { modulePlans } from "@/data/modulePlans";
import { LinkButton } from "@/components/ui/Button";

const getGlowColorClass = (slug: string) => {
  switch (slug) {
    case 'algo': return 'neon-border-orange text-stcOrange group-hover:shadow-[0_0_30px_rgba(249,115,22,0.4)] border-stcOrange/40';
    case 'data': return 'neon-border-blue text-stcBlue group-hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] border-stcBlue/40';
    case 'robo': return 'neon-border-green text-stcGreen group-hover:shadow-[0_0_30px_rgba(34,197,94,0.4)] border-stcGreen/40';
    case 'startup': return 'neon-border-purple text-stcPurple group-hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] border-stcPurple/40';
    default: return 'neon-border-cyan text-stcCyan group-hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] border-stcCyan/40';
  }
};

const getButtonColorClass = (slug: string) => {
  switch (slug) {
    case 'algo': return 'bg-stcOrange hover:bg-orange-600 text-white shadow-[0_0_15px_rgba(249,115,22,0.5)]';
    case 'data': return 'bg-stcBlue hover:bg-blue-600 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]';
    case 'robo': return 'bg-stcGreen hover:bg-green-600 text-white shadow-[0_0_15px_rgba(34,197,94,0.5)]';
    case 'startup': return 'bg-stcPurple hover:bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.5)]';
    default: return 'bg-stcCyan hover:bg-cyan-600 text-white shadow-[0_0_15px_rgba(6,182,212,0.5)]';
  }
}

export function CampCard({ camp }: { camp: Camp }) {
  const Icon = campIcons[camp.iconName];
  const plan = modulePlans[camp.slug];
  const glowClass = getGlowColorClass(camp.slug);
  const btnClass = getButtonColorClass(camp.slug);

  return (
    <article className={`group flex h-full flex-col rounded-[20px] bg-navyLight/80 p-6 transition-all duration-300 backdrop-blur-md ${glowClass}`}>
      <div className="flex items-center gap-4">
        <div className="grid h-14 w-14 place-items-center rounded-2xl text-white transition duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-lg" style={{ backgroundColor: camp.color, boxShadow: `0 0 20px ${camp.color}60` }}>
          <Icon size={28} />
        </div>
        <div>
          <h3 className="text-2xl font-black text-white" style={{ color: camp.color }}>{camp.name === "DataCamp" ? "STC DataCamp" : camp.name}</h3>
        </div>
      </div>
      
      <p className="mt-4 text-[13px] leading-relaxed text-slate-300 border-b border-white/10 pb-4">{camp.tagline}</p>
      
      <div className="mt-4">
        <p className="text-[13px] font-black uppercase tracking-widest text-white/50 mb-3">Kimlar uchun?</p>
        <p className="text-[14px] text-slate-300 leading-relaxed mb-4">{camp.whoFor.slice(0, 2).join(", ")}</p>
      </div>

      <div className="mt-2 flex flex-col gap-2 border-l-2 border-white/10 pl-3">
        {camp.topics.slice(0, 3).map((topic) => (
          <div key={topic} className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: camp.color }}></div>
            <span className="text-[13px] font-medium text-slate-300">
              {topic}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <div className="flex items-center gap-1.5 rounded-md bg-black/30 border border-white/10 px-2.5 py-1.5 text-[11px] font-bold text-slate-300">
           <RotateCcw size={12} className="text-white/60"/> 45 kun
        </div>
        <div className="flex items-center gap-1.5 rounded-md bg-black/30 border border-white/10 px-2.5 py-1.5 text-[11px] font-bold text-slate-300">
           <Calendar size={12} className="text-white/60"/> {plan.scheduleType}
        </div>
        <div className="flex items-center gap-1.5 rounded-md bg-black/30 border border-white/10 px-2.5 py-1.5 text-[11px] font-bold text-slate-300">
           <Clock size={12} className="text-white/60"/> {plan.startTime}
        </div>
      </div>

      <div className="mt-auto grid gap-3 pt-6 grid-cols-2">
        <LinkButton href={`/camp/${camp.slug}`} variant="secondary" className="px-3 bg-white/5 text-white border-white/20 hover:bg-white/10 transition-colors w-full text-sm">
          Batafsil
        </LinkButton>
        <LinkButton href={`/register?camp=${camp.name}`} className={`px-3 w-full text-sm ${btnClass} border-0`}>
          Yozilish
        </LinkButton>
      </div>
    </article>
  );
}
