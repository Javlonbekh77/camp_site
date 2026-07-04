import { ArrowRight, CalendarClock, CheckCircle2, MapPin, Sparkles, HelpCircle, Gift, ChevronRight, CheckCircle, RotateCcw } from "lucide-react";
import { CampCard } from "@/components/CampCard";
import { FAQAccordion } from "@/components/FAQAccordion";
import { FloatingCTA } from "@/components/FloatingCTA";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { LinkButton } from "@/components/ui/Button";
import CelestialMatrixShader from "@/components/ui/martrix-shader";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { camps } from "@/data/camps";
import { siteConfig } from "@/lib/config";
import { formatCurrencyUZS } from "@/lib/utils";

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="bg-navy min-h-screen selection:bg-cyan-500/30">
        
        {/* HERO SECTION */}
        <section className="relative overflow-hidden pt-20 pb-16 md:pt-32 md:pb-24">
          <CelestialMatrixShader className="absolute inset-0 z-0 opacity-80" />
          
          <div className="absolute inset-0 bg-gradient-to-b from-navy/50 via-navy/80 to-navy z-0 pointer-events-none" />
          
          <div className="container relative z-10">
            <ScrollReveal>
              <div className="flex flex-col items-center text-center">
                <h1 className="mt-7 max-w-5xl text-4xl font-black leading-tight tracking-tight text-white md:text-6xl lg:text-[72px]">
                  Yozni bekor o'tkazma – <br className="hidden md:block" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-300 drop-shadow-[0_0_25px_rgba(249,115,22,0.6)]">
                    kelajakka qadam
                  </span> bilan boshla.
                </h1>
                
                <p className="mt-6 max-w-3xl text-lg leading-relaxed text-slate-300 md:text-xl font-medium">
                  Chiroqchi tumanida Python, algoritmlar, data analytics, robototexnika <br className="hidden lg:block"/>
                  va startup bo'yicha 45 kunlik intensiv yozgi camp.
                </p>

                <div className="mt-12 flex flex-wrap justify-center gap-4">
                  <div className="flex items-center gap-3 bg-navyLight/60 border border-white/10 rounded-xl px-5 py-3 backdrop-blur-md">
                    <CalendarClock className="text-orange-400" size={24} />
                    <div className="text-left">
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Qabul</p>
                      <p className="text-sm font-bold text-white">11-iyul 23:59 gacha</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 bg-navyLight/60 border border-white/10 rounded-xl px-5 py-3 backdrop-blur-md">
                    <MapPin className="text-cyan-400" size={24} />
                    <div className="text-left">
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">13-iyul 09:00</p>
                      <p className="text-sm font-bold text-white">boshlanish</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-navyLight/60 border border-white/10 rounded-xl px-5 py-3 backdrop-blur-md">
                    <CheckCircle className="text-green-400" size={24} />
                    <div className="text-left">
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">1-hafta</p>
                      <p className="text-sm font-bold text-white">sinov</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-navyLight/60 border border-white/10 rounded-xl px-5 py-3 backdrop-blur-md">
                    <RotateCcw className="text-purple-400" size={24} />
                    <div className="text-left">
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">45</p>
                      <p className="text-sm font-bold text-white">kun</p>
                    </div>
                  </div>
                </div>

                <div className="mt-12 flex flex-col gap-4 sm:flex-row items-center justify-center">
                  <LinkButton href="/quiz" className="bg-blue-600 hover:bg-blue-500 text-white border-0 shadow-[0_0_20px_rgba(37,99,235,0.6)] py-7 px-8 text-lg w-full sm:w-auto rounded-xl font-bold transition-all hover:scale-105">
                    Mos yo'nalishni aniqlash <Sparkles size={20} className="ml-2 animate-pulse" />
                  </LinkButton>
                  <LinkButton href="/register" className="bg-orange-500 hover:bg-orange-400 text-white border-0 shadow-[0_0_20px_rgba(249,115,22,0.6)] py-7 px-8 text-lg w-full sm:w-auto rounded-xl font-bold transition-all hover:scale-105">
                    Ro'yxatdan o'tish <ArrowRight size={20} className="ml-2" />
                  </LinkButton>
                </div>

                <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm font-medium text-slate-400">
                  <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-cyan-500"/> Amaliyotga yo'naltirilgan</span>
                  <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-cyan-500"/> Loyihalar bilan yakunlanadi</span>
                  <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-cyan-500"/> Sertifikat va portfolio</span>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* FEATURES (3 Dark Cards) */}
        <section className="py-12 relative z-10">
          <div className="container grid gap-6 lg:grid-cols-3">
            {[
              [HelpCircle, "Yoz bekor o'tib ketyapti?", "Ko'pchilik yozni telefon va ijtimoiy tarmoqlarda o'tkazmoqda. Natijada yangi bilim ham, amaliy ko'nikma ham yo'q.", "text-orange-400"],
              [HelpCircle, "Nimadan boshlashni bilmayapsiz?", "Qaysi soha sizga mos? Qayerdan boshlash kerak? Internetda ma'lumot ko'p, lekin yo'l xaritasi yo'q.", "text-blue-400"],
              [CheckCircle2, "STC-2026 — yechim!", "Biz sizga yo'l xaritasini, mentorlarni va amaliy muhitni taqdim etamiz. Yozingizni kelajagingizga investitsiya qiling.", "text-green-400"]
            ].map(([Icon, title, text, iconColor], idx) => (
              <ScrollReveal key={String(title)} delay={idx * 0.1}>
                <div className="h-full rounded-2xl bg-navyLight/60 p-8 border border-white/5 shadow-2xl backdrop-blur-md transition-all duration-300 hover:border-white/10 hover:bg-navyLight/80">
                  <div className="flex items-start gap-4">
                     <div className={`mt-1 bg-white/5 p-2 rounded-full border border-white/10 ${iconColor}`}>
                       <Icon size={28} />
                     </div>
                     <div>
                       <h2 className="text-xl font-bold text-white mb-2">{String(title)}</h2>
                       <p className="text-sm leading-relaxed text-slate-400">{String(text)}</p>
                     </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* CAMPS */}
        <section id="camps" className="py-12 relative z-10">
          <div className="container">
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {camps.map((camp, idx) => (
                <ScrollReveal key={camp.slug} delay={idx * 0.1}>
                  <CampCard camp={camp} />
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* QUIZ BANNER */}
        <section className="py-10 relative z-10">
          <div className="container">
            <ScrollReveal>
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-navyLight/90 to-[#0A1A3F] border border-white/10 p-8 md:p-12 shadow-[0_0_40px_rgba(6,182,212,0.15)] flex flex-col lg:flex-row items-center gap-10">
                <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none"></div>
                
                <div className="flex-1">
                  <h2 className="text-3xl font-black text-white md:text-4xl">Qaysi camp sizga mos?</h2>
                  <p className="mt-4 text-lg text-slate-300 leading-relaxed">
                    AI asosidagi moslik testi sizning qiziqish va maqsadlaringizni tahlil qilib, eng mos yo'nalishni tavsiya qiladi.
                  </p>
                  <div className="mt-8 flex items-center gap-6">
                    <LinkButton href="/quiz" className="bg-blue-600 hover:bg-blue-500 text-white border-0 shadow-[0_0_20px_rgba(37,99,235,0.6)] py-6 px-8 text-lg rounded-xl transition-transform hover:scale-105">
                      Moslik testini boshlash <Sparkles size={20} className="ml-2" />
                    </LinkButton>
                  </div>
                  <div className="mt-5 flex items-center gap-4 text-sm text-slate-400 font-medium">
                    <span>3 daqiqa</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-600"></span>
                    <span>10 ta savol</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-600"></span>
                    <span>Aniqlik bilan tavsiya</span>
                  </div>
                </div>

                <div className="flex-1 w-full bg-[#050B14]/80 p-6 rounded-2xl border border-white/10 shadow-inner">
                   <div className="flex items-start gap-4">
                     <div className="bg-blue-500/20 p-3 rounded-full border border-blue-500/30">
                       <Sparkles className="text-blue-400" size={24}/>
                     </div>
                     <div className="flex-1 bg-navyLight/50 p-4 rounded-xl rounded-tl-none border border-white/5">
                        <p className="text-sm text-white/90 font-medium">Salom! Men sizga mos yo'nalishni topishga yordam beraman. Boshlash uchun, sizni nima ko'proq qiziqtiradi?</p>
                     </div>
                   </div>
                   <div className="mt-4 flex flex-wrap gap-2 ml-16">
                     <span className="px-4 py-2 rounded-full border border-white/10 text-xs text-slate-300 bg-white/5">Mantiq va kod yozish</span>
                     <span className="px-4 py-2 rounded-full border border-white/10 text-xs text-slate-300 bg-white/5">Ma'lumotlar bilan ishlash</span>
                     <span className="px-4 py-2 rounded-full border border-white/10 text-xs text-slate-300 bg-white/5">Qurilmalar va robotlar</span>
                   </div>
                   <div className="mt-6 flex items-center bg-navyLight/60 rounded-xl border border-white/10 p-2 ml-16">
                     <input type="text" placeholder="Javobingizni yozing..." className="bg-transparent border-none outline-none text-white text-sm w-full px-3" disabled />
                     <div className="p-2 bg-blue-600 rounded-lg text-white">
                        <ChevronRight size={16}/>
                     </div>
                   </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* DATES TIMELINE */}
        <section id="dates" className="py-10 relative z-10">
          <div className="container">
            <ScrollReveal>
              <div className="rounded-3xl bg-navyLight/50 border border-white/5 p-8 shadow-xl">
                 <h2 className="text-center text-2xl font-bold text-white mb-8">Reja va muhim sanalar</h2>
                 <div className="grid gap-6 md:grid-cols-4 relative">
                   <div className="hidden md:block absolute top-1/2 left-10 right-10 h-0.5 bg-slate-800 -z-10 -translate-y-1/2"></div>
                   
                   {[
                     ["Qabul yakuni", "11-iyul 23:59", "Ro'yxatdan o'tish yakunlanadi", "bg-orange-500", 1],
                     ["Birinchi dars", "13-iyul 09:00", "Rasmiy ochilish va darslar", "bg-blue-500", 2],
                     ["Sinov hafta", "13-19 iyul", "1 hafta bepul sinov va tanishuv", "bg-green-500", 3],
                     ["Manzil tez orada", "Chiroqchi tumani", "Aniq manzil e'lon qilinadi", "bg-purple-500", 4]
                   ].map(([title, date, desc, colorClass, num], idx) => (
                      <div key={title} className="flex flex-col items-center md:items-start bg-navyLight/80 p-5 rounded-xl border border-white/5 text-center md:text-left relative mt-4 md:mt-0">
                         <div className={`absolute -top-4 -left-4 md:-left-2 md:-top-5 w-8 h-8 rounded-full ${colorClass} text-white font-bold flex items-center justify-center shadow-lg ring-4 ring-navy`}>
                           {num}
                         </div>
                         <h3 className="text-[13px] font-bold text-slate-400 uppercase">{String(title)}</h3>
                         <p className={`mt-1 font-black text-lg text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400`}>{String(date)}</p>
                         <p className="mt-2 text-xs text-slate-500">{String(desc)}</p>
                      </div>
                   ))}
                 </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* REFERRAL BANNER */}
        <section className="py-6 relative z-10">
          <ScrollReveal>
            <div className="container">
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-500 p-8 text-white shadow-[0_0_30px_rgba(249,115,22,0.3)] flex flex-col md:flex-row items-center justify-between gap-6 border border-orange-400/50">
                <div className="flex items-center gap-6">
                  <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm">
                     <Gift size={40} className="text-white drop-shadow-md" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black md:text-3xl drop-shadow-md">Hech nima yo'qotmaysiz, ko'p narsa yutasiz!</h2>
                    <p className="mt-2 text-sm md:text-base font-medium text-white/90">Har bir taklif qilingan foydalanuvchi uchun {formatCurrencyUZS(siteConfig.referralDiscount)} bonus oling. Yoki uzrli sabab bilan mutlaqo bepul o'qing! O'rganmasangiz, pulingiz qaytariladi.</p>
                  </div>
                </div>
                <LinkButton href="/register" className="bg-white text-orange-600 hover:bg-orange-50 border-0 shadow-lg py-5 px-6 rounded-xl font-bold whitespace-nowrap">
                  Batafsil shartlar <ArrowRight size={18} className="ml-2" />
                </LinkButton>
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* FAQ & CTA ROW */}
        <section id="faq" className="py-12 relative z-10 mb-10">
          <div className="container grid gap-8 lg:grid-cols-2">
            <ScrollReveal>
              <div className="bg-navyLight/50 rounded-3xl p-8 border border-white/5 shadow-xl h-full">
                <h2 className="text-2xl font-bold text-white mb-6">Ko'p so'raladigan savollar</h2>
                <FAQAccordion />
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
               <div className="bg-gradient-to-br from-[#0A1A3F] to-navy rounded-3xl p-10 border border-blue-500/20 shadow-[0_0_40px_rgba(37,99,235,0.1)] h-full flex flex-col justify-center relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
                 <h2 className="text-3xl font-black text-white leading-tight">Kelajagingizni bugun boshlang!</h2>
                 <p className="mt-4 text-slate-300 leading-relaxed max-w-sm">O'rinlar soni cheklangan. Joyingizni hozirdan band qiling va yozni natijaga aylantiring.</p>
                 <div className="mt-8 flex flex-wrap gap-4">
                    <LinkButton href="/register" className="bg-orange-500 hover:bg-orange-400 text-white border-0 shadow-[0_0_15px_rgba(249,115,22,0.5)] px-8 py-6 rounded-xl text-lg font-bold">
                      Ro'yxatdan o'tish
                    </LinkButton>
                    <LinkButton href="#faq" variant="secondary" className="bg-navyLight/80 text-white hover:bg-navyLight border-white/10 px-8 py-6 rounded-xl text-lg">
                      Savol berish
                    </LinkButton>
                 </div>
               </div>
            </ScrollReveal>
          </div>
        </section>
      </main>
      
      <div className="border-t border-white/10 bg-navy relative z-10">
        <Footer />
      </div>
      <FloatingCTA />
    </>
  );
}
