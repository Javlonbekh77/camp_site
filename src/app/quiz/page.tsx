"use client";

import { Copy, Loader2, Send, Sparkles, ArrowRight, Bot, User, Trophy, Star, Zap, CheckCircle2, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Header } from "@/components/Header";
import { LinkButton } from "@/components/ui/Button";
import { saveQuizResult } from "@/lib/storage/registrationStore";
import type { Recommendation } from "@/lib/types";

type ChatMessage = { role: "user" | "assistant"; content: string; suggestions?: string[] };
type GuidePayload = {
  ok: boolean;
  source: "groq" | "fallback";
  message: string;
  done: boolean;
  suggestions?: string[];
  recommendation?: Recommendation;
  answers?: Record<string, string>;
};

const firstMessage = "Assalomu alaykum! 👋 Men STC Guide — sizga eng mos campni topib beraman. Avval aytingchi, siz kimga o'xshaysiz?";
const firstSuggestions = ["Maktab o'quvchisi", "Talaba", "O'qituvchi", "Boshqa"];

const campColors: Record<string, string> = {
  AlgoCamp: "#F97316",
  DataCamp: "#3B82F6",
  RoboCamp: "#22C55E",
  StartupCamp: "#A855F7",
};
const campEmojis: Record<string, string> = {
  AlgoCamp: "🧠", DataCamp: "📊", RoboCamp: "🤖", StartupCamp: "🚀",
};
const campDescriptions: Record<string, string> = {
  AlgoCamp: "Python, algoritmlar va olimpiada masalalari",
  DataCamp: "Ma'lumotlar tahlili, SQL va dashboardlar",
  RoboCamp: "Robototexnika, qurilmalar va kodlash asoslari",
  StartupCamp: "Startup, AI vositalar va mahsulot qurishni o'rganing",
};

export default function QuizPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: firstMessage, suggestions: firstSuggestions },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [source, setSource] = useState<"groq" | "fallback" | null>(null);
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [showResult, setShowResult] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, showResult]);

  useEffect(() => {
    if (recommendation) {
      const t = setTimeout(() => setShowResult(true), 300);
      return () => clearTimeout(t);
    }
  }, [recommendation]);

  async function sendMessage(content = input) {
    const trimmed = content.trim();
    if (!trimmed || loading || recommendation) return;

    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: trimmed }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai/stc-guide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });
      const payload = (await res.json()) as GuidePayload;
      setSource(payload.source);

      if (payload.done && payload.recommendation) {
        setMessages((cur) => [...cur, {
          role: "assistant",
          content: payload.message || "✨ Tahlil tayyor!",
        }]);
        setRecommendation(payload.recommendation);
        saveQuizResult({ answers: payload.answers ?? {}, recommendation: payload.recommendation, source: payload.source });
      } else {
        setMessages((cur) => [...cur, {
          role: "assistant",
          content: payload.message,
          suggestions: payload.suggestions,
        }]);
      }
    } catch {
      setMessages((cur) => [...cur, { role: "assistant", content: "Ulanishda muammo bo'ldi. Qayta urinib ko'ring." }]);
    } finally {
      setLoading(false);
    }
  }

  // Suggestions: show only for the very last assistant message (when not loading)
  const lastMsg = messages[messages.length - 1];
  const activeSuggestions =
    !loading && !recommendation && lastMsg?.role === "assistant" && lastMsg.suggestions?.length
      ? lastMsg.suggestions
      : [];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-navy pt-20 pb-12 px-4">
        <div className="container max-w-5xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold px-4 py-2 rounded-full mb-4">
              <Sparkles size={14} /> AI Moslik Testi
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white">Qaysi camp sizga mos?</h1>
            <p className="mt-3 text-slate-400">AI siz bilan suhbat qilib, eng mos yo'nalishni aniqlaydi.</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            {/* Chat */}
            <div className="rounded-3xl bg-navyLight/70 border border-white/10 overflow-hidden backdrop-blur-md shadow-2xl flex flex-col">
              {/* Chat header */}
              <div className="bg-gradient-to-r from-blue-600/80 to-cyan-600/80 p-5 flex items-center gap-4 border-b border-white/10">
                <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center">
                  <Sparkles className="text-white" size={22} />
                </div>
                <div>
                  <h2 className="font-black text-white">STC Guide AI</h2>
                  <div className="flex items-center gap-2 mt-0.5">
                    <div className={`w-2 h-2 rounded-full animate-pulse ${source === "fallback" ? "bg-red-400" : "bg-green-400"}`} />
                    <p className="text-xs text-white/70">
                      {source === "groq" ? "🟢 Online" : source === "fallback" ? "🔴 Offline" : "⏳ Ulanmoqda..."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div
                className="flex-1 max-h-[55vh] min-h-[400px] overflow-y-auto p-5 space-y-3"
                style={{ background: "radial-gradient(circle at top right, rgba(6,182,212,0.05), transparent 50%), rgba(6,10,18,0.5)" }}
              >
                {messages.map((msg, i) => (
                  <div key={i} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    {msg.role === "assistant" && (
                      <div className="w-8 h-8 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0 mt-1">
                        <Bot size={16} className="text-blue-400" />
                      </div>
                    )}
                    <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-blue-600 text-white rounded-tr-sm"
                        : "bg-navyLight/80 border border-white/10 text-slate-200 rounded-tl-sm"
                    }`}>
                      {msg.content}
                    </div>
                    {msg.role === "user" && (
                      <div className="w-8 h-8 rounded-xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center flex-shrink-0 mt-1">
                        <User size={16} className="text-orange-400" />
                      </div>
                    )}
                  </div>
                ))}

                {/* Loading indicator */}
                {loading && (
                  <div className="flex gap-3 justify-start">
                    <div className="w-8 h-8 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
                      <Bot size={16} className="text-blue-400" />
                    </div>
                    <div className="bg-navyLight/80 border border-white/10 rounded-2xl rounded-tl-sm px-4 py-2.5 flex items-center gap-2">
                      <Loader2 className="animate-spin text-blue-400" size={16} />
                      <span className="text-sm text-slate-400">O'ylayapti...</span>
                    </div>
                  </div>
                )}

                {/* Active suggestion chips — always shown below last bot message */}
                {activeSuggestions.length > 0 && (
                  <div className="flex flex-wrap gap-2 ml-11 pt-1">
                    {activeSuggestions.map((s) => (
                      <button
                        key={s}
                        onClick={() => sendMessage(s)}
                        className="text-sm font-semibold px-3.5 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 hover:bg-blue-500/25 hover:border-blue-500/60 hover:text-white transition-all"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}

                {/* Result card */}
                {showResult && recommendation && (
                  <div className="ml-11 animate-[fadeSlideUp_0.5s_ease-out_forwards]">
                    <ResultCard recommendation={recommendation} />
                  </div>
                )}

                <div ref={bottomRef} />
              </div>

              {/* Input / CTA bar */}
              {!recommendation ? (
                <form
                  className="flex gap-3 border-t border-white/5 bg-navyLight/50 p-4"
                  onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
                >
                  <input
                    className="min-w-0 flex-1 rounded-xl bg-navy/60 border border-white/10 text-white px-4 py-3 text-sm outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 placeholder:text-slate-500 transition-all"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Yozing yoki yuqoridagi variantni tanlang..."
                    disabled={loading}
                  />
                  <button
                    type="submit"
                    disabled={loading || !input.trim()}
                    className="bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white px-5 rounded-xl transition-all shadow-[0_0_15px_rgba(59,130,246,0.4)]"
                  >
                    {loading ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                  </button>
                </form>
              ) : (
                <div className="border-t border-white/5 bg-navyLight/50 p-4">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <LinkButton
                      href={`/register?camp=${recommendation.primaryCamp}`}
                      className="flex-1 bg-orange-500 hover:bg-orange-400 border-none text-white shadow-[0_0_20px_rgba(249,115,22,0.5)] hover:shadow-[0_0_30px_rgba(249,115,22,0.7)] transition-all text-base py-3"
                    >
                      Ro'yxatdan o'tish <ArrowRight size={18} />
                    </LinkButton>
                    <button
                      onClick={async () => { await navigator.clipboard.writeText(recommendation.copyText); setCopied(true); }}
                      className="flex items-center justify-center gap-2 text-sm font-bold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-5 py-2.5 rounded-xl transition-all"
                    >
                      <Copy size={16} /> {copied ? "Nusxalandi ✓" : "Nusxalash"}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside className="flex flex-col gap-5">
              <div className="rounded-2xl bg-navyLight/60 border border-white/10 p-5 backdrop-blur-md">
                <h2 className="font-black text-white mb-4">Qanday ishlaydi?</h2>
                <div className="space-y-3">
                  {[
                    ["1", "Variantni tanlang yoki yozing", "Har savol uchun tugmalar bor"],
                    ["2", "AI tahlil qiladi", "Qiziqishlaringizga mos camp aniqlaydi"],
                    ["3", "Ro'yxatdan o'ting", "Natija avtomatik formaga qo'shiladi"],
                  ].map(([n, t, d]) => (
                    <div key={n} className="flex gap-3">
                      <div className="w-7 h-7 rounded-lg bg-blue-500/20 border border-blue-500/30 text-blue-400 font-black text-xs flex items-center justify-center flex-shrink-0">{n}</div>
                      <div>
                        <p className="text-sm font-bold text-white">{t}</p>
                        <p className="text-xs text-slate-400">{d}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl bg-navyLight/60 border border-white/10 p-5 backdrop-blur-md">
                <p className="font-bold text-white text-xs uppercase tracking-widest mb-3">Camp'lar</p>
                {(["AlgoCamp", "DataCamp", "RoboCamp", "StartupCamp"] as const).map((name) => (
                  <div key={name} className="flex items-center gap-2 mb-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: campColors[name] }} />
                    <span className="text-xs">{campEmojis[name]}</span>
                    <span className="text-xs font-semibold" style={{ color: campColors[name] }}>{name}</span>
                  </div>
                ))}
              </div>

              {/* Sidebar result */}
              {recommendation && (
                <div className="rounded-2xl border p-5 shadow-2xl overflow-hidden relative"
                  style={{ borderColor: `${campColors[recommendation.primaryCamp] ?? "#666"}40`, background: `linear-gradient(135deg, rgba(6,10,18,0.95), ${campColors[recommendation.primaryCamp] ?? "#333"}15)` }}>
                  <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20"
                    style={{ background: campColors[recommendation.primaryCamp] }} />
                  <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">✨ Eng mos yo'nalish</p>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">{campEmojis[recommendation.primaryCamp]}</span>
                    <h2 className="text-2xl font-black" style={{ color: campColors[recommendation.primaryCamp] }}>
                      {recommendation.primaryCamp}
                    </h2>
                  </div>
                  <div className="space-y-2.5 mb-4">
                    {Object.entries(recommendation.percentages)
                      .sort(([, a], [, b]) => b - a)
                      .map(([camp, pct]) => (
                        <div key={camp}>
                          <div className="mb-1 flex justify-between text-xs font-bold">
                            <span className="text-slate-300">{campEmojis[camp]} {camp.replace("Camp", "")}</span>
                            <span style={{ color: campColors[camp] }}>{pct}%</span>
                          </div>
                          <div className="h-1.5 rounded-full bg-white/5">
                            <div className="h-1.5 rounded-full transition-all duration-1000"
                              style={{ width: `${pct}%`, backgroundColor: campColors[camp] }} />
                          </div>
                        </div>
                      ))}
                  </div>
                  <LinkButton
                    href={`/register?camp=${recommendation.primaryCamp}`}
                    className="w-full border-none text-white text-sm py-2.5 font-black"
                    style={{ backgroundColor: campColors[recommendation.primaryCamp] }}
                  >
                    Ro'yxatdan o'tish <ChevronRight size={16} />
                  </LinkButton>
                </div>
              )}

              <Link href="/" className="rounded-2xl bg-navyLight/60 border border-white/10 p-4 text-center text-sm font-bold text-slate-400 hover:text-white hover:border-white/20 transition-all">
                ← Bosh sahifaga
              </Link>
            </aside>
          </div>
        </div>
      </main>

      <style jsx global>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes barGrow {
          from { width: 0; }
        }
      `}</style>
    </>
  );
}

/* ─── Result Card ─────────────────────────────────────────────────────────── */
function ResultCard({ recommendation }: { recommendation: Recommendation }) {
  const primary = recommendation.primaryCamp;
  const color = campColors[primary] ?? "#F97316";

  return (
    <div className="w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border"
      style={{ borderColor: `${color}40`, background: `linear-gradient(135deg, rgba(6,10,18,0.97) 0%, ${color}12 100%)` }}>

      {/* Header */}
      <div className="p-6 pb-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ background: `radial-gradient(circle at 50% 0%, ${color}, transparent 70%)` }} />
        <div className="flex justify-center gap-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={14} fill={color} stroke="none"
              className="animate-bounce" style={{ animationDelay: `${i * 0.1}s`, color }} />
          ))}
        </div>
        <div className="w-20 h-20 rounded-2xl mx-auto mb-3 flex items-center justify-center text-4xl border"
          style={{ backgroundColor: `${color}20`, borderColor: `${color}40`, boxShadow: `0 0 30px ${color}40` }}>
          {campEmojis[primary]}
        </div>
        <p className="text-xs font-black uppercase tracking-widest mb-1" style={{ color }}>
          ✨ Sizga eng mos yo'nalish
        </p>
        <h3 className="text-3xl font-black text-white" style={{ textShadow: `0 0 20px ${color}60` }}>
          {primary}
        </h3>
        <p className="text-sm text-slate-400 mt-1">{campDescriptions[primary]}</p>
      </div>

      {/* Summary */}
      <div className="px-6 py-3 border-t border-white/5">
        <p className="text-sm text-slate-300 leading-relaxed">{recommendation.summary}</p>
      </div>

      {/* Progress bars */}
      <div className="px-6 pb-4 space-y-2.5">
        <p className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Moslik foizlari</p>
        {Object.entries(recommendation.percentages)
          .sort(([, a], [, b]) => b - a)
          .map(([camp, pct]) => (
            <div key={camp}>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-slate-300">{campEmojis[camp]} {camp}</span>
                <span style={{ color: campColors[camp] }}>{pct}%</span>
              </div>
              <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                <div className="h-2 rounded-full"
                  style={{ width: `${pct}%`, backgroundColor: campColors[camp], boxShadow: camp === primary ? `0 0 8px ${campColors[camp]}` : undefined, animation: "barGrow 1s ease-out forwards" }} />
              </div>
            </div>
          ))}
      </div>

      {/* Secondary camps */}
      {recommendation.secondaryCamps.length > 0 && (
        <div className="px-6 pb-4">
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-2">Qo'shimcha mos</p>
          <div className="flex flex-wrap gap-2">
            {recommendation.secondaryCamps.map((c) => (
              <span key={c} className="text-xs font-bold px-3 py-1 rounded-full border"
                style={{ color: campColors[c], borderColor: `${campColors[c]}40`, backgroundColor: `${campColors[c]}10` }}>
                {campEmojis[c]} {c}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="p-5 pt-2 flex flex-col gap-3">
        <a href={`/register?camp=${primary}`}
          className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl font-black text-white text-base transition-all hover:scale-[1.02] active:scale-[0.98]"
          style={{ background: `linear-gradient(135deg, ${color}, ${color}cc)`, boxShadow: `0 0 25px ${color}50` }}>
          <Zap size={18} fill="white" />
          {primary}ga Ro'yxatdan o'tish
          <ArrowRight size={18} />
        </a>
        <div className="flex items-center gap-2 text-xs text-slate-500 justify-center">
          <CheckCircle2 size={12} className="text-green-400" />
          <span>1 hafta bepul sinov · Pul yo'qotmaysiz</span>
        </div>
      </div>
    </div>
  );
}
