"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, ArrowRight, Sparkles, Shield } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Header } from "@/components/Header";
import { Button, LinkButton } from "@/components/ui/Button";
import { camps } from "@/data/camps";
import { modulePlans } from "@/data/modulePlans";
import { formatDateTimeUz, siteConfig } from "@/lib/config";
import { createRegistration, getSavedQuizResult, isDatabaseConfigured } from "@/lib/storage/registrationStore";
import type { CampName, Recommendation } from "@/lib/types";

const schema = z.object({
  full_name: z.string().min(3, "Ism familiya kamida 3 ta belgi bo'lishi kerak"),
  phone: z.string().min(7, "Telefon raqam kiriting").regex(/^\+?[0-9\s()-]{7,20}$/, "Telefon formati noto'g'ri"),
  telegram: z.string().optional().refine((v) => !v || v.startsWith("@") || v.startsWith("http"), "@username yoki link kiriting"),
  age: z.preprocess((v) => (v === "" ? undefined : v), z.coerce.number().min(5).max(80).optional()),
  status: z.string().min(1, "Status tanlang"),
  school_or_work: z.string().optional(),
  location: z.string().optional(),
  selected_camps: z.array(z.enum(["AlgoCamp", "DataCamp", "RoboCamp", "StartupCamp"])).min(1, "Kamida bitta camp tanlang"),
  primary_recommended_camp: z.string().optional(),
  user_pasted_ai_result: z.string().optional(),
  motivation: z.string().optional(),
  current_level: z.string().optional(),
  has_laptop: z.enum(["true", "false", ""]).optional().transform((v) => (v === "" || v === undefined ? undefined : v === "true")),
  preferred_format: z.string().optional(),
  preferred_time: z.string().optional(),
  referral_name: z.string().optional(),
  referral_phone: z.string().optional(),
  referred_by: z.string().optional(),
  consent: z.boolean().refine((v) => v, "Rozilik kerak")
});

type FormValues = z.infer<typeof schema>;

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-navy" />}>
      <RegisterContent />
    </Suspense>
  );
}

function RegisterContent() {
  const searchParams = useSearchParams();
  const [success, setSuccess] = useState<FormValues | null>(null);
  const [error, setError] = useState("");
  const campFromQuery = searchParams.get("camp") as CampName | null;
  const [saved, setSaved] = useState<{ recommendation: Recommendation } | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      full_name: "", phone: "", telegram: "", status: "",
      selected_camps: campFromQuery ? [campFromQuery] : [],
      primary_recommended_camp: "",
      user_pasted_ai_result: "",
      consent: false
    }
  });
  const selectedCamps = form.watch("selected_camps");

  useEffect(() => {
    const s = getSavedQuizResult<{ recommendation: Recommendation }>();
    setSaved(s);

    const raw = localStorage.getItem("stc_2026_registration_draft");
    if (raw) {
      form.reset({ ...form.getValues(), ...JSON.parse(raw) });
    } else if (s?.recommendation) {
      form.reset({
        ...form.getValues(),
        selected_camps: [s.recommendation.primaryCamp],
        primary_recommended_camp: s.recommendation.primaryCamp,
        user_pasted_ai_result: s.recommendation.copyText
      });
    }
  }, [form]);

  useEffect(() => {
    const sub = form.watch((v) => localStorage.setItem("stc_2026_registration_draft", JSON.stringify(v)));
    return () => sub.unsubscribe();
  }, [form]);

  async function onSubmit(values: FormValues) {
    setError("");
    try {
      await createRegistration({
        ...values, age: values.age,
        quiz_score: saved?.recommendation?.scores,
        quiz_summary: saved?.recommendation?.summary,
        discount_note: values.referral_name || values.referred_by ? `${siteConfig.referralDiscount} UZS referral discount may apply` : undefined,
        consent: true
      });
      localStorage.removeItem("stc_2026_registration_draft");
      setSuccess(values);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Arizani saqlashda xatolik yuz berdi.");
    }
  }

  const campColors: Record<string, string> = {
    AlgoCamp: "#F97316", DataCamp: "#3B82F6", RoboCamp: "#22C55E", StartupCamp: "#A855F7"
  };

  if (success) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-navy flex items-center justify-center py-20 px-4">
          <div className="w-full max-w-lg rounded-3xl bg-navyLight/80 border border-white/10 p-10 text-center backdrop-blur-md shadow-2xl">
            <div className="w-20 h-20 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mx-auto">
              <CheckCircle2 className="text-green-400 w-10 h-10" />
            </div>
            <h1 className="mt-6 text-3xl font-black text-white">Arizangiz qabul qilindi!</h1>
            <p className="mt-3 text-slate-400">STC-2026 jamoasi tez orada siz bilan bog'lanadi.</p>
            <div className="mx-auto mt-8 rounded-2xl bg-navy/60 border border-white/5 p-5 text-left text-sm leading-7 text-slate-300 space-y-2">
              <p><span className="text-slate-500">Camp:</span> <span className="font-bold text-white">{success.selected_camps.join(", ")}</span></p>
              {success.primary_recommended_camp && <p><span className="text-slate-500">Tavsiya:</span> <span className="font-bold text-white">{success.primary_recommended_camp}</span></p>}
              <p><span className="text-slate-500">Qabul muddati:</span> <span className="font-bold text-white">{formatDateTimeUz(siteConfig.deadline)}</span></p>
              <p><span className="text-slate-500">Birinchi dars:</span> <span className="font-bold text-white">{formatDateTimeUz(siteConfig.firstLesson)}</span></p>
              <p className="text-xs text-slate-500">Birinchi hafta sinov hafta — mos bo'lmasa to'lov qaytariladi.</p>
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row justify-center">
              <LinkButton href={`https://t.me/${siteConfig.telegram.replace("@", "")}`} className="bg-blue-600 border-none text-white hover:bg-blue-500">Telegram orqali bog'lanish</LinkButton>
              <LinkButton href="/" variant="secondary" className="bg-white/5 border-white/10 text-white hover:bg-white/10">Bosh sahifaga qaytish</LinkButton>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-navy py-24 px-4">
        <div className="container max-w-5xl">
          {/* Page header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold px-4 py-2 rounded-full mb-4">
              <Sparkles size={14} /> Ro'yxatdan o'tish
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white">STC-2026 ga qo'shiling</h1>
            <p className="mt-4 text-lg text-slate-400 max-w-xl mx-auto">Bir yoki bir nechta camp tanlang. Ro'yxatdan keyin jamoa siz bilan bog'lanadi.</p>
            {!isDatabaseConfigured && (
              <p className="mt-4 inline-block rounded-xl bg-amber-500/10 border border-amber-500/20 px-4 py-2 text-sm font-semibold text-amber-400">Demo mode: arizalar localStorage'ida saqlanadi.</p>
            )}
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-8">
            {/* Step 1 — Personal info */}
            <FormSection step={1} title="Asosiy ma'lumotlar" color="from-orange-500 to-amber-400">
              <div className="grid gap-5 md:grid-cols-2">
                <DarkField label="To'liq ism familiya *" error={form.formState.errors.full_name?.message}>
                  <input {...form.register("full_name")} className="dark-input" placeholder="Ismoilov Behzod" />
                </DarkField>
                <DarkField label="Telefon raqam *" error={form.formState.errors.phone?.message}>
                  <input {...form.register("phone")} className="dark-input" placeholder="+998 90 123 45 67" />
                </DarkField>
                <DarkField label="Telegram username">
                  <input {...form.register("telegram")} className="dark-input" placeholder="@username" />
                </DarkField>
                <DarkField label="Yosh">
                  <input type="number" {...form.register("age")} className="dark-input" placeholder="16" />
                </DarkField>
                <DarkField label="Status *" error={form.formState.errors.status?.message}>
                  <select {...form.register("status")} className="dark-input">
                    <option value="">Tanlang</option>
                    <option value="school_student">Maktab o'quvchisi</option>
                    <option value="teacher">O'qituvchi</option>
                    <option value="university_student">Talaba</option>
                    <option value="graduate">Bitiruvchi</option>
                    <option value="parent_for_child">Farzandim uchun</option>
                    <option value="other">Boshqa</option>
                  </select>
                </DarkField>
                <DarkField label="Maktab / ish joyi">
                  <input {...form.register("school_or_work")} className="dark-input" placeholder="Maktab 12 yoki..." />
                </DarkField>
                <DarkField label="Qayerdasiz? (shahar)">
                  <input {...form.register("location")} className="dark-input" placeholder="Chiroqchi" />
                </DarkField>
                <DarkField label="Hozirgi bilim darajasi">
                  <select {...form.register("current_level")} className="dark-input">
                    <option value="">Tanlang</option>
                    <option value="beginner">Beginner — hech narsa bilmayman</option>
                    <option value="some_basics">Bir oz asoslarni bilaman</option>
                    <option value="intermediate">Intermediate</option>
                  </select>
                </DarkField>
              </div>
            </FormSection>

            {/* Step 2 — Camp selection */}
            <FormSection step={2} title="Camp tanlovi va tavsiya" color="from-blue-500 to-cyan-400">
              <p className="text-sm text-slate-400 mb-5">Qiziqarli camp(lar)ni belgilang va asosiy tavsiya qilinganini ko'ring.</p>
              <div className="grid gap-4 sm:grid-cols-2">
                {camps.map((camp) => {
                  const isChecked = selectedCamps?.includes(camp.name);
                  return (
                    <label key={camp.name} className={`flex items-center gap-4 rounded-2xl p-5 border cursor-pointer transition-all duration-200 ${isChecked ? "border-white/20 bg-navyLight" : "border-white/5 bg-navyLight/40 hover:border-white/10"}`}
                      style={isChecked ? { borderColor: `${campColors[camp.name]}60`, boxShadow: `0 0 20px ${campColors[camp.name]}20` } : {}}>
                      <input type="checkbox" value={camp.name} {...form.register("selected_camps")} className="hidden" />
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: isChecked ? campColors[camp.name] : `${campColors[camp.name]}30` }}>
                        <span className="text-white font-black text-xs">{camp.shortName}</span>
                      </div>
                      <div>
                        <p className="font-black text-white">{camp.name === "DataCamp" ? "STC DataCamp" : camp.name}</p>
                        <p className="text-xs text-slate-400 mt-1">{camp.tagline.slice(0, 50)}...</p>
                      </div>
                      {isChecked && <div className="ml-auto w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0"><CheckCircle2 size={12} className="text-white" /></div>}
                    </label>
                  );
                })}
              </div>
              {form.formState.errors.selected_camps && <p className="mt-3 text-sm font-semibold text-red-400">{form.formState.errors.selected_camps.message}</p>}

              {selectedCamps?.length > 0 && (
                <div className="mt-5 grid gap-3">
                  {camps.filter((c) => selectedCamps.includes(c.name)).map((camp) => {
                    const plan = modulePlans[camp.slug];
                    return (
                      <div key={camp.slug} className="rounded-xl p-4 border" style={{ borderColor: `${campColors[camp.name]}30`, backgroundColor: `${campColors[camp.name]}08` }}>
                        <p className="text-sm font-black" style={{ color: campColors[camp.name] }}>{camp.name === "DataCamp" ? "STC DataCamp" : camp.name}</p>
                        <p className="mt-1 text-sm font-bold text-white">45 kun · 13-iyul 09:00 · 1-hafta sinov</p>
                        <p className="mt-1 text-xs text-slate-400">{plan.weeks[0].title}</p>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="mt-5 grid gap-5 md:grid-cols-2">
                <DarkField label="Tavsiya qilingan camp (AI natijasi)">
                  <input {...form.register("primary_recommended_camp")} className="dark-input" placeholder="AlgoCamp" />
                </DarkField>
                <DarkField label="Moslik testi natijasi" help="Moslik testini topshirgan bo'lsangiz natija avtomatik tushadi.">
                  <textarea {...form.register("user_pasted_ai_result")} className="dark-input min-h-[80px]" placeholder="Natijangizni shu yerga joylashtiring..." />
                </DarkField>
              </div>
            </FormSection>

            {/* Step 3 — Motivation */}
            <FormSection step={3} title="Motivatsiya va ma'lumotlar" color="from-purple-500 to-pink-400">
              <div className="grid gap-5 md:grid-cols-2">
                <DarkField label="Nega bu camp(lar)ni tanladingiz?">
                  <textarea {...form.register("motivation")} className="dark-input min-h-[100px]" placeholder="Motivatsiyangizni yozing..." />
                </DarkField>
                <div className="grid gap-5">
                  <DarkField label="Noutbukingiz bormi?">
                    <select {...form.register("has_laptop")} className="dark-input">
                      <option value="">Tanlang</option>
                      <option value="true">Ha, bor</option>
                      <option value="false">Yo'q</option>
                    </select>
                  </DarkField>
                  <DarkField label="Qaysi format sizga qulay?">
                    <select {...form.register("preferred_format")} className="dark-input">
                      <option value="">Tanlang</option>
                      <option value="offline">Offline</option>
                      <option value="online">Online</option>
                      <option value="hybrid">Hybrid ham</option>
                      <option value="not_sure">Hozircha bilmayman</option>
                    </select>
                  </DarkField>
                  <DarkField label="Qulay vaqt">
                    <select {...form.register("preferred_time")} className="dark-input">
                      <option value="">Tanlang</option>
                      <option value="ertalab">Ertalab</option>
                      <option value="tushdan_keyin">Tushdan keyin</option>
                      <option value="kechqurun">Kechqurun</option>
                      <option value="kunduz">Kunduz</option>
                    </select>
                  </DarkField>
                </div>
              </div>
              <div className="mt-5 grid gap-5 md:grid-cols-2">
                <DarkField label="Qayerdan eshitdingiz?">
                  <input {...form.register("referred_by")} className="dark-input" placeholder="Telegram, do'st, Instagram..." />
                </DarkField>
                <DarkField label="Agar do'stingiz tavsiyasi bo'lsa, ismi yoki @username">
                  <input {...form.register("referral_name")} className="dark-input" placeholder="Ism yoki @username" />
                </DarkField>
              </div>
            </FormSection>

            {/* Step 4 — Consent */}
            <FormSection step={4} title="Rozilik va yakun" color="from-green-500 to-emerald-400">
              <label className="flex items-start gap-4 rounded-2xl bg-navy/60 border border-white/5 p-5 cursor-pointer hover:border-white/10 transition-colors">
                <input type="checkbox" {...form.register("consent")} className="mt-1 w-5 h-5 accent-orange-500 flex-shrink-0" />
                <span className="text-sm text-slate-300 leading-relaxed">Ma'lumotlarim STC-2026 ro'yxatdan o'tish jarayoni uchun saqlanishiga roziman. Ma'lumotlaringiz xavfsiz uchinchi shaxslarga berilmaydi.</span>
              </label>
              {form.formState.errors.consent && <p className="mt-2 text-sm font-semibold text-red-400">{form.formState.errors.consent.message}</p>}

              {error && <div className="mt-4 rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-sm font-bold text-red-400">{error}</div>}

              <div className="mt-6 flex items-center gap-4">
                <Button
                  className={`border-none px-10 py-4 text-lg rounded-xl font-bold transition-all ${form.formState.isValid ? "bg-orange-500 hover:bg-orange-400 text-white shadow-[0_0_20px_rgba(249,115,22,0.4)] hover:scale-105" : "bg-orange-500/30 text-white/50 cursor-not-allowed"}`}
                  type="submit"
                  disabled={form.formState.isSubmitting || !form.formState.isValid}
                >
                  {form.formState.isSubmitting ? "Saqlanmoqda..." : "Ro'yxatdan o'tish"}
                  {!form.formState.isSubmitting && <ArrowRight size={20} className="ml-2" />}
                </Button>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Shield size={14} /> SSL himoyalangan
                </div>
              </div>
            </FormSection>
          </form>
        </div>
      </main>
      <style jsx global>{`
        .dark-input {
          width: 100%;
          background: rgba(7,15,43,0.6);
          border: 1px solid rgba(255,255,255,0.08);
          color: white;
          border-radius: 0.75rem;
          padding: 0.75rem 1rem;
          outline: none;
          font-size: 0.875rem;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .dark-input::placeholder { color: rgba(148,163,184,0.6); }
        .dark-input:focus { border-color: rgba(59,130,246,0.6); box-shadow: 0 0 0 3px rgba(59,130,246,0.12); }
        .dark-input option { background: #1B2A4A; color: white; }
      `}</style>
    </>
  );
}

function FormSection({ step, title, color, children }: { step: number; title: string; color: string; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl bg-navyLight/50 border border-white/5 p-6 md:p-8 backdrop-blur-md shadow-xl">
      <div className="flex items-center gap-4 mb-6">
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white font-black text-lg shadow-lg flex-shrink-0`}>{step}</div>
        <h2 className="text-xl font-black text-white">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function DarkField({ label, children, error, help }: { label: string; children: React.ReactNode; error?: string; help?: string }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-bold text-slate-300">{label}</span>
      {children}
      {help && <span className="text-xs leading-5 text-slate-500">{help}</span>}
      {error && <span className="text-sm font-semibold text-red-400">{error}</span>}
    </div>
  );
}
