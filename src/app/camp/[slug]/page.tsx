import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LinkButton } from "@/components/ui/Button";
import { ModulePlanAccordion } from "@/components/ModulePlanAccordion";
import { campIcons, camps, getCampBySlug } from "@/data/camps";
import { modulePlans } from "@/data/modulePlans";

export function generateStaticParams() {
  return camps.map((camp) => ({ slug: camp.slug }));
}

export default function CampDetailPage({ params }: { params: { slug: string } }) {
  const camp = getCampBySlug(params.slug);
  if (!camp) notFound();
  const Icon = campIcons[camp.iconName];
  const modulePlan = modulePlans[camp.slug];

  return (
    <>
      <Header />
      <main className="bg-navy min-h-screen text-white">
        {/* Hero */}
        <section className="relative overflow-hidden pt-28 pb-16">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_0%,rgba(249,115,22,.18),transparent_35%),radial-gradient(circle_at_15%_30%,rgba(6,182,212,.18),transparent_40%)]" />
          <div className="absolute inset-0 bg-gradient-to-b from-navy/30 to-navy pointer-events-none" />
          <div className="container relative z-10 grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-bold border mb-4" style={{ borderColor: `${camp.color}40`, color: camp.color, backgroundColor: `${camp.color}15` }}>{camp.shortName} yo'nalishi</span>
              <h1 className="mt-5 text-5xl font-black md:text-7xl text-white">{camp.name === "DataCamp" ? "STC DataCamp" : camp.name}</h1>
              <p className="mt-4 max-w-2xl text-xl font-semibold text-slate-300">{modulePlan.tagline}</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <LinkButton href={`/register?camp=${camp.name}`} className="bg-orange-500 hover:bg-orange-400 border-0 shadow-[0_0_15px_rgba(249,115,22,0.5)] text-white">{camp.ctaText}</LinkButton>
                <LinkButton href="/quiz" variant="secondary" className="bg-navyLight/80 border-white/10 text-white hover:bg-navyLight">Avval moslik testini topshirish</LinkButton>
              </div>
            </div>
            <div className="grid h-32 w-32 place-items-center rounded-2xl transition hover:scale-105 shadow-2xl" style={{ backgroundColor: camp.color, boxShadow: `0 0 40px ${camp.color}60` }}>
              <Icon size={56} className="text-white" />
            </div>
          </div>
        </section>

        {/* Info blocks */}
        <section className="py-12">
          <div className="container grid gap-6 lg:grid-cols-3">
            <InfoBlock title="Kimlar uchun?" items={camp.whoFor} color={camp.color} />
            <InfoBlock title="Nima o'rganiladi?" items={camp.topics} color={camp.color} />
            <InfoBlock title="Natijada nima qila olasiz?" items={camp.outcomes} color={camp.color} />
          </div>
        </section>

        {/* Learning path preview */}
        <section className="py-12">
          <div className="container grid gap-8 lg:grid-cols-[1.2fr_.8fr]">
            <div className="rounded-2xl bg-navyLight/70 p-6 border border-white/10 backdrop-blur-md">
              <h2 className="text-2xl font-black text-white">Taxminiy learning path</h2>
              <p className="mt-2 text-sm text-slate-400">{modulePlan.note}</p>
              <div className="mt-6 grid gap-3">
                {modulePlan.weeks.map((week) => (
                  <div key={week.week} className="rounded-xl bg-navyLight/80 p-4 font-semibold text-white border border-white/5 transition hover:-translate-y-0.5 hover:border-white/10 hover:shadow-lg">
                    {week.week}-hafta: {week.title}
                    <span className="mt-1 block text-xs text-slate-400">{week.dates}</span>
                  </div>
                ))}
                <div className="rounded-xl bg-orange-500/10 border border-orange-500/20 p-4 font-semibold text-orange-300">
                  Yakuniy 3 kun: {modulePlan.finalThreeDays.title}
                  <span className="mt-1 block text-xs text-orange-400/70">{modulePlan.finalThreeDays.dates}</span>
                </div>
              </div>
            </div>
            <div className="grid gap-6">
              <InfoBlock title="Talablar" items={camp.requirements} color={camp.color} />
              <InfoBlock title="Kimlar tanlamagani ma'qul?" items={camp.notFor} color="#ef4444" />
            </div>
          </div>
        </section>

        <div id="module-plan">
          <ModulePlanAccordion plan={modulePlan} campName={camp.name} color={camp.color} />
        </div>
      </main>
      <Footer />
    </>
  );
}

function InfoBlock({ title, items, color }: { title: string; items: string[]; color: string }) {
  return (
    <div className="rounded-2xl bg-navyLight/70 p-6 border border-white/10 backdrop-blur-md h-full">
      <h2 className="text-xl font-black text-white">{title}</h2>
      <ul className="mt-4 grid gap-3 text-sm leading-6 text-slate-300">
        {items.map((item) => (
          <li key={item} className="flex gap-3 items-start">
            <span className="mt-2 h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: color }} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
