"use client";

import { Download, LogOut, Search, X, User, Phone, MessageCircle, Calendar, MapPin, Laptop, BookOpen, Star, ChevronDown } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Button } from "@/components/ui/Button";
import { camps } from "@/data/camps";
import { siteConfig } from "@/lib/config";
import { clearLocalRegistrations, createRegistration, getLocalRegistrations, isDatabaseConfigured, listRegistrations, updateRegistrationAdmin } from "@/lib/storage/registrationStore";
import type { Registration } from "@/lib/types";
import { formatCurrencyUZS, toCsv } from "@/lib/utils";

const csvColumns = ["created_at","full_name","phone","telegram","age","status","school_or_work","selected_camps","primary_recommended_camp","current_level","has_laptop","preferred_format","preferred_time","referral_name","referred_by","motivation","payment_agreement","payment_reason","status_admin","admin_note"];

const STATUS_COLORS: Record<string, string> = {
  new: "#3B82F6", contacted: "#06B6D4", confirmed: "#22C55E",
  trial_week: "#F97316", rejected: "#EF4444", waiting: "#A855F7"
};
const STATUS_LABELS: Record<string, string> = {
  new: "Yangi", contacted: "Bog'lanildi", confirmed: "Tasdiqlandi",
  trial_week: "Sinov haftasida", rejected: "Rad etildi", waiting: "Kutmoqda"
};

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [rows, setRows] = useState<Registration[]>([]);
  const [query, setQuery] = useState("");
  const [campFilter, setCampFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selected, setSelected] = useState<Registration | null>(null);
  const [message, setMessage] = useState("");
  const [localCount, setLocalCount] = useState(0);
  const [migrating, setMigrating] = useState(false);

  async function load() {
    setRows(await listRegistrations());
    setLocalCount(getLocalRegistrations().length);
  }

  useEffect(() => {
    fetch("/api/admin/session").then((r) => r.json()).then((d) => {
      setAuthed(Boolean(d.ok));
      if (d.ok) load();
    });
  }, []);

  async function login(e: React.FormEvent) {
    e.preventDefault(); setMessage("");
    const res = await fetch("/api/admin/login", { method: "POST", body: JSON.stringify({ passcode }) });
    if (res.ok) { setAuthed(true); await load(); } else setMessage("Passcode noto'g'ri.");
  }

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return rows.filter((r) => {
      const mQ = !q || [r.full_name, r.phone, r.telegram].filter(Boolean).join(" ").toLowerCase().includes(q);
      const mC = !campFilter || r.selected_camps.includes(campFilter as never);
      const mS = !statusFilter || (r.status_admin ?? "new") === statusFilter;
      return mQ && mC && mS;
    });
  }, [rows, query, campFilter, statusFilter]);

  const analytics = useMemo(() => {
    const byCamp = camps.map((c) => ({ name: c.name, value: rows.filter((r) => r.selected_camps.includes(c.name)).length, color: c.color }));
    const byAdminStatus = Object.entries(rows.reduce<Record<string, number>>((acc, r) => {
      const k = r.status_admin ?? "new"; acc[k] = (acc[k] ?? 0) + 1; return acc;
    }, {})).map(([name, value]) => ({ name, value, fill: STATUS_COLORS[name] ?? "#666" }));
    const today = new Date().toISOString().slice(0, 10);
    const referralCount = rows.filter((r) => r.referral_name || r.referred_by).length;
    return { byCamp, byAdminStatus, total: rows.length, today: rows.filter((r) => r.created_at?.startsWith(today)).length, multiple: rows.filter((r) => r.selected_camps.length > 1).length, referralCount, discountTotal: referralCount * siteConfig.referralDiscount };
  }, [rows]);

  function exportCsv(data: Registration[]) {
    const blob = new Blob([toCsv(data as unknown as Record<string, unknown>[], csvColumns)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "stc-2026.csv"; a.click(); URL.revokeObjectURL(url);
  }

  async function migrateLocal() {
    const localRows = getLocalRegistrations(); if (!localRows.length) return;
    setMigrating(true); setMessage("");
    try {
      for (const r of localRows) { const { id, created_at, ...input } = r; await createRegistration(input); }
      clearLocalRegistrations(); await load(); setMessage("Ko'chirildi!");
    } catch (e) { setMessage(e instanceof Error ? e.message : "Xatolik"); } finally { setMigrating(false); }
  }

  if (!authed) {
    return (
      <main className="grid min-h-screen place-items-center bg-navy p-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold px-4 py-2 rounded-full mb-4">STC-2026 Admin</div>
            <h1 className="text-3xl font-black text-white">Admin Panel</h1>
            <p className="mt-2 text-sm text-slate-400">Maxfiy panel — faqat adminlar uchun</p>
          </div>
          <form onSubmit={login} className="rounded-2xl bg-navyLight/80 border border-white/10 p-8 backdrop-blur-md shadow-2xl">
            <input className="w-full rounded-xl bg-navy/60 border border-white/10 text-white p-3.5 outline-none focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20 placeholder:text-slate-500" type="password" value={passcode} onChange={(e) => setPasscode(e.target.value)} placeholder="Passcode kiriting..." />
            {message && <p className="mt-3 text-sm font-bold text-red-400">{message}</p>}
            <button className="mt-5 w-full bg-orange-500 hover:bg-orange-400 text-white font-bold py-3.5 rounded-xl transition-all shadow-[0_0_15px_rgba(249,115,22,0.4)] hover:shadow-[0_0_25px_rgba(249,115,22,0.6)]">Kirish</button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-navy">
      {/* Top bar */}
      <div className="sticky top-0 z-40 bg-navy/90 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-white">STC-2026 Admin</h1>
          <p className="text-xs text-slate-400">{rows.length} ta ariza · Firestore {isDatabaseConfigured ? "✓ ulangan" : "✗ demo mode"}</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => exportCsv(filtered)} className="flex items-center gap-2 text-sm font-bold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-xl transition-all">
            <Download size={16} /> CSV
          </button>
          <button onClick={async () => { await fetch("/api/admin/logout", { method: "POST" }); setAuthed(false); }} className="flex items-center gap-2 text-sm font-bold text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 px-4 py-2 rounded-xl transition-all">
            <LogOut size={16} /> Chiqish
          </button>
        </div>
      </div>

      <div className="p-6 max-w-[1400px] mx-auto">
        {/* Alerts */}
        {!isDatabaseConfigured && (
          <div className="mb-6 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 text-amber-300 text-sm">
            <p className="font-black">Firestore ulanmagan.</p>
            <p className="mt-1 text-amber-400/70">Arizalar faqat shu brauzerda ko'rinadi. `.env.local`ga Firebase env o'rnatish kerak.</p>
          </div>
        )}
        {isDatabaseConfigured && localCount > 0 && (
          <div className="mb-6 flex items-center justify-between gap-4 rounded-2xl border border-blue-500/20 bg-blue-500/10 p-4 text-blue-300">
            <div><p className="font-black">{localCount} ta eski demo ariza topildi.</p><p className="text-sm text-blue-400/70">Firestore'ga ko'chirish kerakmi?</p></div>
            <button onClick={migrateLocal} disabled={migrating} className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all">{migrating ? "Ko'chirilmoqda..." : "Ko'chirish"}</button>
          </div>
        )}
        {message && <div className="mb-6 rounded-xl bg-white/5 border border-white/10 p-3 text-sm font-bold text-slate-300">{message}</div>}

        {/* Metrics */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5 mb-8">
          {[
            { label: "Jami arizalar", value: analytics.total, color: "text-blue-400", bg: "from-blue-500/20 to-blue-500/5", border: "border-blue-500/20" },
            { label: "Bugungi", value: analytics.today, color: "text-green-400", bg: "from-green-500/20 to-green-500/5", border: "border-green-500/20" },
            { label: "Multi-camp", value: analytics.multiple, color: "text-purple-400", bg: "from-purple-500/20 to-purple-500/5", border: "border-purple-500/20" },
            { label: "Referral", value: analytics.referralCount, color: "text-orange-400", bg: "from-orange-500/20 to-orange-500/5", border: "border-orange-500/20" },
            { label: "Chegirma jami", value: formatCurrencyUZS(analytics.discountTotal), color: "text-cyan-400", bg: "from-cyan-500/20 to-cyan-500/5", border: "border-cyan-500/20" }
          ].map(({ label, value, color, bg, border }) => (
            <div key={label} className={`rounded-2xl bg-gradient-to-br ${bg} border ${border} p-5`}>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</p>
              <p className={`mt-2 text-3xl font-black ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid gap-6 lg:grid-cols-2 mb-8">
          <div className="rounded-2xl bg-navyLight/60 border border-white/5 p-6 backdrop-blur-md">
            <h2 className="font-black text-white mb-5">Camp bo'yicha arizalar</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.byCamp}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 12 }} />
                  <YAxis allowDecimals={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
                  <Tooltip contentStyle={{ background: "#1B2A4A", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "white" }} />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>{analytics.byCamp.map((e) => <Cell key={e.name} fill={e.color} />)}</Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="rounded-2xl bg-navyLight/60 border border-white/5 p-6 backdrop-blur-md">
            <h2 className="font-black text-white mb-5">Admin status taqsimoti</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={analytics.byAdminStatus} dataKey="value" nameKey="name" outerRadius={90} label={({ name, percent }) => `${STATUS_LABELS[name] ?? name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                    {analytics.byAdminStatus.map((e, i) => <Cell key={i} fill={e.fill} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: "#1B2A4A", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "white" }} formatter={(v, n) => [v, STATUS_LABELS[n as string] ?? n]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-2xl bg-navyLight/60 border border-white/5 backdrop-blur-md overflow-hidden">
          <div className="p-5 border-b border-white/5 flex flex-wrap gap-3 items-center">
            <label className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input className="w-full rounded-xl bg-navy/60 border border-white/10 text-white py-2.5 pl-10 pr-3 text-sm outline-none focus:border-blue-500/50 placeholder:text-slate-500" placeholder="Ism, telefon, telegram..." value={query} onChange={(e) => setQuery(e.target.value)} />
            </label>
            <select className="rounded-xl bg-navy/60 border border-white/10 text-white px-3 py-2.5 text-sm outline-none" value={campFilter} onChange={(e) => setCampFilter(e.target.value)}>
              <option value="">Barcha camp</option>
              {camps.map((c) => <option key={c.name}>{c.name}</option>)}
            </select>
            <select className="rounded-xl bg-navy/60 border border-white/10 text-white px-3 py-2.5 text-sm outline-none" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="">Barcha status</option>
              {Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
            <span className="text-sm text-slate-400 font-medium">{filtered.length} ta natija</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  {["Sana", "Ism familiya", "Telefon", "Telegram", "Camp(lar)", "Tavsiya", "Status", "Admin", ""].map((h) => (
                    <th key={h} className="px-4 py-3 text-[11px] font-black uppercase tracking-widest text-slate-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((row) => (
                  <tr key={row.id} className="border-t border-white/5 hover:bg-white/3 transition-colors group cursor-pointer" onClick={() => setSelected(row)}>
                    <td className="px-4 py-3 text-slate-400 text-xs font-mono">{row.created_at?.slice(0, 10)}</td>
                    <td className="px-4 py-3 font-bold text-white">
                      {row.full_name}
                      {(row.referral_name || row.referred_by) && (
                        <span className="ml-2 px-1.5 py-0.5 rounded-full bg-orange-500/20 text-orange-400 text-[9px] uppercase tracking-wider">Referral</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-300 font-mono text-xs">{row.phone}</td>
                    <td className="px-4 py-3 text-cyan-400 text-xs">{row.telegram}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {row.selected_camps.map((c) => (
                          <span key={c} className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: `${camps.find((x) => x.name === c)?.color ?? "#666"}25`, color: camps.find((x) => x.name === c)?.color ?? "#fff" }}>{c.replace("Camp", "")}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-400 text-xs">{row.primary_recommended_camp}</td>
                    <td className="px-4 py-3 text-slate-400 text-xs">{row.status}</td>
                    <td className="px-4 py-3">
                      <span className="text-[10px] font-black px-2.5 py-1 rounded-full" style={{ backgroundColor: `${STATUS_COLORS[row.status_admin ?? "new"]}25`, color: STATUS_COLORS[row.status_admin ?? "new"] }}>
                        {STATUS_LABELS[row.status_admin ?? "new"]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button className="text-xs font-bold text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg transition-all">Batafsil</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!filtered.length && (
              <div className="p-12 text-center text-sm font-semibold text-slate-500">
                Hozircha ko'rinadigan ariza yo'q.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Detail panel */}
      {selected && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-end p-4" onClick={(e) => { if (e.target === e.currentTarget) setSelected(null); }}>
          <div className="h-full max-w-lg w-full overflow-auto rounded-2xl bg-navyLight border border-white/10 shadow-2xl">
            <div className="sticky top-0 bg-navyLight border-b border-white/10 p-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-white">{selected.full_name}</h2>
                <p className="text-xs text-slate-400 mt-0.5">{selected.created_at?.slice(0, 16)}</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-xl transition-all"><X size={20} /></button>
            </div>

            <div className="p-5 space-y-5">
              {/* Contact info */}
              <div className="rounded-xl bg-navy/60 border border-white/5 p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-500">Kontakt</h3>
                <InfoRow icon={<Phone size={14} />} label="Telefon" value={selected.phone} accent="text-green-400" />
                <InfoRow icon={<MessageCircle size={14} />} label="Telegram" value={selected.telegram} accent="text-cyan-400" />
                <InfoRow icon={<Calendar size={14} />} label="Yosh" value={selected.age?.toString()} />
                <InfoRow icon={<User size={14} />} label="Status" value={selected.status} />
                <InfoRow icon={<BookOpen size={14} />} label="Maktab/ish" value={selected.school_or_work} />
                <InfoRow icon={<MapPin size={14} />} label="Hudud" value={selected.location} />
              </div>

              {/* Camp info */}
              <div className="rounded-xl bg-navy/60 border border-white/5 p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-500">Camp ma'lumotlari</h3>
                <div className="flex flex-wrap gap-2">
                  {selected.selected_camps.map((c) => (
                    <span key={c} className="text-sm font-bold px-3 py-1 rounded-full" style={{ backgroundColor: `${camps.find((x) => x.name === c)?.color ?? "#666"}25`, color: camps.find((x) => x.name === c)?.color ?? "#fff" }}>{c}</span>
                  ))}
                </div>
                <InfoRow icon={<Star size={14} />} label="Tavsiya qilingan" value={selected.primary_recommended_camp} accent="text-orange-400" />
                <InfoRow icon={<Laptop size={14} />} label="Laptop" value={selected.has_laptop === true ? "Bor ✓" : selected.has_laptop === false ? "Yo'q ✗" : "—"} />
                <InfoRow icon={<BookOpen size={14} />} label="Daraja" value={selected.current_level} />
                <InfoRow icon={<BookOpen size={14} />} label="Format" value={selected.preferred_format} />
              </div>

              {/* Motivation */}
              {selected.motivation && (
                <div className="rounded-xl bg-navy/60 border border-white/5 p-4">
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Motivatsiya</h3>
                  <p className="text-sm text-slate-300 leading-relaxed">{selected.motivation}</p>
                </div>
              )}

              {/* Referral */}
              {(selected.referral_name || selected.referred_by) && (
                <div className="rounded-xl bg-orange-500/10 border border-orange-500/20 p-4">
                  <h3 className="text-xs font-black uppercase tracking-widest text-orange-400 mb-2">Referral</h3>
                  <InfoRow icon={<User size={14} />} label="Kim taklif qildi" value={selected.referred_by} />
                  <InfoRow icon={<User size={14} />} label="Bilan keladi" value={selected.referral_name} />
                </div>
              )}

              {/* Payment Info */}
              {(selected.payment_agreement || selected.payment_reason) && (
                <div className="rounded-xl bg-yellow-500/10 border border-yellow-500/20 p-4">
                  <h3 className="text-xs font-black uppercase tracking-widest text-yellow-400 mb-2">To'lov sharti</h3>
                  <InfoRow icon={<BookOpen size={14} />} label="Kelishuv" value={selected.payment_agreement === 'trial' ? "Sinov haftasidan so'ng (100k)" : selected.payment_agreement === 'reason' ? "Sabab ko'rsatgan" : selected.payment_agreement} />
                  {selected.payment_reason && <InfoRow icon={<MessageCircle size={14} />} label="Sabab" value={selected.payment_reason} />}
                </div>
              )}

              {/* AI result */}
              {selected.user_pasted_ai_result && (
                <div className="rounded-xl bg-blue-500/10 border border-blue-500/20 p-4">
                  <h3 className="text-xs font-black uppercase tracking-widest text-blue-400 mb-2">AI Moslik natijasi</h3>
                  <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">{selected.user_pasted_ai_result}</p>
                </div>
              )}

              {/* Admin controls */}
              <div className="rounded-xl bg-navy/60 border border-white/5 p-4 space-y-4">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-500">Admin boshqaruvi</h3>
                <div>
                  <label className="text-sm font-bold text-slate-300 block mb-2">Admin status</label>
                  <select className="w-full rounded-xl bg-navy border border-white/10 text-white p-3 text-sm outline-none" value={selected.status_admin ?? "new"} onChange={(e) => setSelected({ ...selected, status_admin: e.target.value })}>
                    {Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-bold text-slate-300 block mb-2">Admin izohi</label>
                  <textarea className="w-full min-h-[100px] rounded-xl bg-navy border border-white/10 text-white p-3 text-sm outline-none resize-none" value={selected.admin_note ?? ""} onChange={(e) => setSelected({ ...selected, admin_note: e.target.value })} placeholder="Izoh yozing..." />
                </div>
                <div className="flex gap-3">
                  <button onClick={async () => { if (selected.id) await updateRegistrationAdmin(selected.id, { status_admin: selected.status_admin, admin_note: selected.admin_note }); setSelected(null); await load(); }} className="flex-1 bg-orange-500 hover:bg-orange-400 text-white font-bold py-3 rounded-xl transition-all">Saqlash</button>
                  <button onClick={() => setSelected(null)} className="bg-white/5 hover:bg-white/10 text-white font-bold py-3 px-6 rounded-xl border border-white/10 transition-all">Yopish</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function InfoRow({ icon, label, value, accent = "text-slate-300" }: { icon: React.ReactNode; label: string; value?: string | null; accent?: string }) {
  if (!value) return null;
  return (
    <div className="flex items-center gap-3">
      <span className="text-slate-500 flex-shrink-0">{icon}</span>
      <span className="text-xs text-slate-500 w-28 flex-shrink-0">{label}</span>
      <span className={`text-sm font-semibold ${accent}`}>{value}</span>
    </div>
  );
}
