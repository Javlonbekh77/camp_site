"use client";

import { ChevronDown, Clock, CalendarDays } from "lucide-react";
import { useState } from "react";
import type { ModulePlan } from "@/data/modulePlans";
import { LinkButton } from "@/components/ui/Button";

export function ModulePlanAccordion({ plan, campName, color }: { plan: ModulePlan; campName: string; color: string }) {
  const [active, setActive] = useState(1);

  return (
    <section className="section bg-navy">
      <div className="container">
        <div className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr]">
          <div>
            <div className="sticky top-24 rounded-2xl bg-navyLight/80 p-7 text-white shadow-[0_0_30px_rgba(0,0,0,0.5)] border border-white/10 backdrop-blur-md">
              <p className="text-sm font-black tracking-widest uppercase" style={{ color }}>{campName}</p>
              <h2 className="mt-3 text-3xl font-black text-white">45 kunlik modul rejasi</h2>
              <p className="mt-4 leading-7 text-slate-400">
                Har bir yo'nalish 1.5 oylik modul asosida tuzilgan. Darslar dushanbadan shanbagacha 09:00 da boshlanadi. Birinchi hafta sinov hafta.
              </p>
              <div className="mt-5 grid grid-cols-2 gap-2 text-sm font-bold">
                {["45 kun", plan.scheduleType, plan.startTime, "1-hafta sinov", "Mini-project", "Final demo"].map((badge) => (
                  <span key={badge} className="rounded-xl bg-white/5 px-3 py-2 border border-white/10 text-slate-300">{badge}</span>
                ))}
              </div>
              <div className="mt-6 grid gap-2 text-sm text-slate-400">
                {plan.dailyStructure.map((item) => (
                  <div key={item} className="flex gap-2">
                    <Clock size={16} className="mt-0.5 shrink-0 text-orange-400" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <p className="mt-5 rounded-xl bg-white/5 border border-white/10 p-3 text-sm leading-6 text-slate-300">{plan.note}</p>
              {plan.technicalNote && <p className="mt-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3 text-sm leading-6 text-emerald-300">{plan.technicalNote}</p>}
            </div>
          </div>

          <div className="grid gap-4">
            {plan.weeks.map((week) => (
              <div key={week.week} className="overflow-hidden rounded-2xl bg-navyLight/70 border border-white/10 backdrop-blur-md">
                <button
                  className="focus-ring flex w-full items-start justify-between gap-4 rounded-2xl p-5 text-left transition hover:bg-white/5"
                  onClick={() => setActive(active === week.week ? 0 : week.week)}
                >
                  <div className="flex gap-4">
                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl text-lg font-black text-white shadow-lg" style={{ backgroundColor: color, boxShadow: `0 0 15px ${color}60` }}>
                      {week.week}
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-white">{week.title}</h3>
                      <p className="mt-1 inline-flex items-center gap-2 text-sm font-bold text-slate-400"><CalendarDays size={16} /> {week.dates}</p>
                      <p className="mt-2 text-sm text-slate-400">{week.goal}</p>
                    </div>
                  </div>
                  <ChevronDown className={`text-slate-400 shrink-0 transition-transform duration-300 ${active === week.week ? "rotate-180" : ""}`} />
                </button>
                {active === week.week && (
                  <div className="border-t border-white/5 bg-black/20 p-5">
                    <p className="rounded-xl bg-navyLight/80 border border-white/5 p-3 text-sm font-semibold text-slate-300"><b className="text-white">Output:</b> {week.output}</p>
                    <div className="mt-5 grid gap-3">
                      {week.days.map((day) => (
                        <div key={`${week.week}-${day.day}`} className="rounded-xl bg-navyLight/60 border border-white/5 p-4 transition hover:-translate-y-0.5 hover:border-white/10 hover:shadow-lg">
                          <p className="text-sm font-black" style={{ color }}>{day.day}</p>
                          <p className="mt-1 font-bold text-white">{day.topic}</p>
                          {day.practice && <p className="mt-2 text-sm text-slate-400"><b className="text-slate-300">Practice:</b> {day.practice}</p>}
                          {day.result && <p className="mt-1 text-sm text-slate-400"><b className="text-slate-300">Result:</b> {day.result}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            <div className="rounded-2xl bg-navyLight/80 border border-white/10 p-6">
              <div className="flex gap-4">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-stcOrange text-lg font-black text-white shadow-[0_0_15px_rgba(249,115,22,0.5)]">3</div>
                <div>
                  <h3 className="text-xl font-black text-white">{plan.finalThreeDays.title}</h3>
                  <p className="mt-1 text-sm font-bold text-slate-400">{plan.finalThreeDays.dates}</p>
                  <p className="mt-2 text-sm text-slate-400">{plan.finalThreeDays.goal}</p>
                </div>
              </div>
              <div className="mt-5 grid gap-3">
                {plan.finalThreeDays.days.map((day) => (
                  <div key={day.day} className="rounded-xl bg-navy/60 border border-white/5 p-4">
                    <p className="text-sm font-black text-orange-400">{day.day}</p>
                    <p className="mt-1 font-bold text-white">{day.topic}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-navyLight to-navy border border-blue-500/20 shadow-[0_0_30px_rgba(37,99,235,0.1)] p-7 text-white">
              <h3 className="text-2xl font-black">Shu reja bo'yicha qatnashmoqchimisiz?</h3>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <LinkButton href={`/register?camp=${campName}`} className="bg-orange-500 hover:bg-orange-400 text-white border-0 shadow-[0_0_15px_rgba(249,115,22,0.5)]">Ro'yxatdan o'tish</LinkButton>
                <LinkButton href="/quiz" variant="secondary" className="bg-navyLight/80 text-white hover:bg-navyLight border-white/10">Moslik testini topshirish</LinkButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
