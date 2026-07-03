"use client";

import { Copy, Loader2, Send, Sparkles, ArrowRight, Bot, User } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Header } from "@/components/Header";
import { LinkButton } from "@/components/ui/Button";
import { saveQuizResult } from "@/lib/storage/registrationStore";
import type { Recommendation } from "@/lib/types";

type ChatMessage = { role: "user" | "assistant"; content: string };
type GuidePayload = { ok: boolean; source: "groq" | "fallback"; message: string; done: boolean; recommendation?: Recommendation; answers?: Record<string, string> };

const firstMessage = "Assalomu alaykum! Men STC Guide — sizga mos camp'ni topish uchun yordamchi. Bir nechta savol beraman. Avval siz kimsiz: maktab o'quvchisi, talaba, o'qituvchi yoki boshqa?";

const quickReplies = ["Maktab o'quvchisi", "Talaba", "O'qituvchi", "Boshqa"];

export default function QuizPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([{ role: "assistant", content: firstMessage }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [source, setSource] = useState<"groq" | "fallback" | null>(null);
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [showQuick, setShowQuick] = useState(true);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, recommendation]);

  async function sendMessage(content = input) {
    const trimmed = content.trim();
    if (!trimmed || loading || recommendation) return;
    setShowQuick(false);

    const nextMessages = [...messages, { role: "user" as const, content: trimmed }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai/stc-guide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages })
      });
      const payload = (await res.json()) as GuidePayload;
      setSource(payload.source);
      setMessages((cur) => [...cur, { role: "assistant", content: payload.message }]);

      if (payload.done && payload.recommendation) {
        setRecommendation(payload.recommendation);
        saveQuizResult({ answers: payload.answers ?? {}, recommendation: payload.recommendation, source: payload.source });
      }
    } catch {
      setMessages((cur) => [...cur, { role: "assistant", content: "Hozir AI bilan ulanishda muammo bo'ldi. Qayta urinib ko'ring yoki registration formasida yo'nalishni qo'lda tanlang." }]);
    } finally {
      setLoading(false);
    }
  }

  const campColors: Record<string, string> = {
    AlgoCamp: "#F97316", DataCamp: "#3B82F6", RoboCamp: "#22C55E", StartupCamp: "#A855F7"
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-navy pt-20 pb-12 px-4">
        <div className="container max-w-5xl">
          {/* Page header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold px-4 py-2 rounded-full mb-4">
              <Sparkles size={14} /> AI Moslik Testi
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white">Qaysi camp sizga mos?</h1>
            <p className="mt-3 text-slate-400">AI siz bilan suhbat qilib, eng mos yo'nalishni aniqlaydi.</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            {/* Chat window */}
            <div className="rounded-3xl bg-navyLight/70 border border-white/10 overflow-hidden backdrop-blur-md shadow-2xl flex flex-col">
              {/* Chat header */}
              <div className="bg-gradient-to-r from-blue-600/80 to-cyan-600/80 p-5 flex items-center gap-4 border-b border-white/10">
                <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center">
                  <Sparkles className="text-white" size={22} />
                </div>
                <div>
                  <h2 className="font-black text-white">STC Guide AI</h2>
                  <div className="flex items-center gap-2 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                    <p className="text-xs text-white/70">
                      {source === "groq" ? "Groq AI ulangan ✓" : source === "fallback" ? "Demo mode ishlayapti" : "Groq API key bo'lsa haqiqiy AI ishlaydi"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 max-h-[55vh] min-h-[400px] overflow-y-auto p-5 space-y-4" style={{ background: "radial-gradient(circle at top right, rgba(6,182,212,0.05), transparent 50%), rgba(7,15,43,0.4)" }}>
                {messages.map((msg, i) => (
                  <div key={i} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    {msg.role === "assistant" && (
                      <div className="w-8 h-8 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0 mt-1">
                        <Bot size={16} className="text-blue-400" />
                      </div>
                    )}
                    <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
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
                {loading && (
                  <div className="flex gap-3 justify-start">
                    <div className="w-8 h-8 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
                      <Bot size={16} className="text-blue-400" />
                    </div>
                    <div className="bg-navyLight/80 border border-white/10 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-2">
                      <Loader2 className="animate-spin text-blue-400" size={16} />
                      <span className="text-sm text-slate-400">STC Guide o'ylayapti...</span>
                    </div>
                  </div>
                )}
                {/* Quick replies for first message */}
                {showQuick && messages.length === 1 && !loading && (
                  <div className="flex flex-wrap gap-2 ml-11">
                    {quickReplies.map((r) => (
                      <button key={r} onClick={() => sendMessage(r)} className="text-sm font-semibold px-4 py-2 rounded-full bg-navyLight/80 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white transition-all">
                        {r}
                      </button>
                    ))}
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              {!recommendation ? (
                <form className="flex gap-3 border-t border-white/5 bg-navyLight/50 p-4" onSubmit={(e) => { e.preventDefault(); sendMessage(); }}>
                  <input
                    className="min-w-0 flex-1 rounded-xl bg-navy/60 border border-white/10 text-white px-4 py-3 text-sm outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 placeholder:text-slate-500 transition-all"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Javobingizni yozing..."
                    disabled={loading}
                  />
                  <button type="submit" disabled={loading || !input.trim()} className="bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white px-5 rounded-xl transition-all shadow-[0_0_15px_rgba(59,130,246,0.4)]">
                    {loading ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                  </button>
                </form>
              ) : (
                <div className="border-t border-white/5 bg-navyLight/50 p-4">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <LinkButton href="/register" className="flex-1 bg-orange-500 hover:bg-orange-400 border-none text-white shadow-[0_0_15px_rgba(249,115,22,0.4)]">
                      Ro'yxatdan o'tish <ArrowRight size={18} />
                    </LinkButton>
                    <button onClick={async () => { await navigator.clipboard.writeText(recommendation.copyText); setCopied(true); }}
                      className="flex items-center justify-center gap-2 text-sm font-bold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-5 py-2.5 rounded-xl transition-all">
                      <Copy size={16} /> {copied ? "Nusxalandi ✓" : "Natijani copy"}
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
                    ["1", "Savollariga javob bering", "Oddiy suhbat tartibida"],
                    ["2", "AI tahlil qiladi", "Qiziqishlaringizga mos camp aniqlaydi"],
                    ["3", "Ro'yxatdan o'ting", "Natija avtomatik formaga qo'shiladi"]
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

              <div className="rounded-2xl bg-navyLight/60 border border-white/10 p-5 backdrop-blur-md text-sm text-slate-400 space-y-2">
                <p className="font-bold text-white text-xs uppercase tracking-widest mb-3">Camp'lar</p>
                {[["AlgoCamp", "#F97316"], ["DataCamp", "#3B82F6"], ["RoboCamp", "#22C55E"], ["StartupCamp", "#A855F7"]].map(([name, color]) => (
                  <div key={name} className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }}></div>
                    <span className="font-semibold" style={{ color }}>{name}</span>
                  </div>
                ))}
              </div>

              {recommendation && (
                <div className="rounded-2xl bg-gradient-to-br from-navy to-navyLight border p-5 shadow-2xl" style={{ borderColor: `${campColors[recommendation.primaryCamp] ?? "#666"}40` }}>
                  <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">✨ Eng mos yo'nalish</p>
                  <h2 className="text-2xl font-black" style={{ color: campColors[recommendation.primaryCamp] ?? "#fff" }}>{recommendation.primaryCamp}</h2>
                  <p className="mt-3 text-sm leading-relaxed text-slate-300">{recommendation.summary}</p>
                  <div className="mt-5 space-y-2.5">
                    {Object.entries(recommendation.percentages).map(([camp, pct]) => (
                      <div key={camp}>
                        <div className="mb-1 flex justify-between text-xs font-bold text-slate-400">
                          <span>{camp}</span><span>{pct}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-white/5">
                          <div className="h-2 rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: campColors[camp] ?? "#666" }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Link href="/" className="rounded-2xl bg-navyLight/60 border border-white/10 p-4 text-center text-sm font-bold text-slate-400 hover:text-white hover:border-white/20 transition-all">
                ← Bosh sahifaga
              </Link>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}
