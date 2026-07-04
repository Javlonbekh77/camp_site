import type { CampName, QuizAnswerMap, Recommendation } from "@/lib/types";

const camps: CampName[] = ["AlgoCamp", "DataCamp", "RoboCamp", "StartupCamp"];

const labels: Record<CampName, string> = {
  AlgoCamp: "algoritmlar, Python va olimpiada masalalari",
  DataCamp: "ma'lumotlar tahlili, SQL va dashboardlar",
  RoboCamp: "robototexnika, qurilmalar yasash va vizual mantiq",
  StartupCamp: "g'oya, startup va AI yordamida mahsulot qurish",
};

export function calculateCampScores(answers: QuizAnswerMap): Record<CampName, number> {
  // Baseline: AlgoCamp, StartupCamp, RoboCamp slightly favored — richer curricula
  const scores: Record<CampName, number> = {
    AlgoCamp:    3,
    RoboCamp:    3,
    StartupCamp: 3,
    DataCamp:    1,   // lower base — needs specific data interest to shine
  };

  const values = Object.values(answers).join(" ").toLowerCase();
  const add = (camp: CampName, amount: number) => { scores[camp] += amount; };

  // ── AlgoCamp signals ───────────────────────────────────────────────────────
  if (values.includes("informatika o'qituvchisi")) add("AlgoCamp", 4);
  if (values.includes("maktab o'quvchisi"))        add("AlgoCamp", 2);
  if (
    values.includes("masala") ||
    values.includes("algoritm") ||
    values.includes("olimpiada") ||
    values.includes("jumboq") ||
    values.includes("bosh qotirish") ||
    values.includes("yechimini topmaguncha") ||
    values.includes("murakkab algoritmik") ||
    values.includes("codeforces") ||
    values.includes("leetcode")
  ) add("AlgoCamp", 9);
  if (values.includes("python"))  add("AlgoCamp", 3);

  // ── StartupCamp signals ────────────────────────────────────────────────────
  if (
    values.includes("g'oyasi") ||
    values.includes("startup") ||
    values.includes("startap") ||
    values.includes("mobil ilova") ||
    values.includes("pul topish") ||
    values.includes("daromad keltiruvchi") ||
    values.includes("mahsulot") ||
    values.includes("prototip") ||
    values.includes("biznesim") ||
    values.includes("tadbirkor")
  ) add("StartupCamp", 9);
  if (values.includes("g'oya"))      add("StartupCamp", 4);
  if (values.includes("ijodkor"))    add("StartupCamp", 3);

  // ── RoboCamp signals ───────────────────────────────────────────────────────
  if (values.includes("farzandim"))         add("RoboCamp", 5);
  if (
    values.includes("robot") ||
    values.includes("qurilma") ||
    values.includes("motor") ||
    values.includes("yasash") ||
    values.includes("harakatlantirish") ||
    values.includes("buzib-yig'ish") ||
    values.includes("elektronika")
  ) add("RoboCamp", 8);
  if (values.includes("scratch")) add("RoboCamp", 4);

  // ── DataCamp signals (needs explicit data interest) ────────────────────────
  if (
    values.includes("ma'lumot tahlil") ||
    values.includes("jadval") ||
    values.includes("grafik") ||
    values.includes("biznes tahlil") ||
    values.includes("dashboard") ||
    values.includes("statistik") ||
    values.includes("sql")
  ) add("DataCamp", 9);
  if (values.includes("excel"))          add("DataCamp", 4);
  if (values.includes("raqamlar bilan")) add("DataCamp", 3);
  // "zamonaviy kasb" could be any — give DataCamp a small bump only
  if (values.includes("zamonaviy kasb")) add("DataCamp", 2);

  // ── General ────────────────────────────────────────────────────────────────
  if (values.includes("aniq emas") || values.includes("bilmayman") || values.includes("farqi yo'q")) {
    // When uncertain, favor the three richer camps more
    add("AlgoCamp", 3);
    add("StartupCamp", 3);
    add("RoboCamp", 3);
    add("DataCamp", 1);
  }

  return scores;
}

export function generateRecommendationText(scores: Record<CampName, number>, answers: QuizAnswerMap) {
  const sorted = camps.toSorted((a, b) => scores[b] - scores[a]);
  const primary = sorted[0];
  const secondary = sorted.slice(1, 3);
  const uncertain = Object.values(answers).join(" ").toLowerCase().includes("bilmayman");
  const summary = uncertain
    ? `Sizda bir nechta yo'nalishga qiziqish bor. Boshlash uchun ${primary} eng yaqin ko'rinyapti, lekin ${secondary.join(" va ")} ham yaxshi variant bo'lishi mumkin.`
    : `Sizga eng mos yo'nalish: ${primary}. Javoblaringiz ${labels[primary]} tomon kuchliroq qiziqish borligini ko'rsatdi. Ikkinchi mos: ${secondary[0]}.`;

  return {
    summary,
    confidenceMessage:
      "Bu natija yakuniy hukm emas. STC Guide javoblaringiz asosida moslikni hisoblaydi, sinov haftada esa yo'nalishni o'zingiz his qilib ko'rasiz.",
    nextStep: "Endi ro'yxatdan o'tish formasini to'ldiring. Moslik natijangiz avtomatik qo'shiladi.",
  };
}

export function getRecommendation(answers: QuizAnswerMap): Recommendation {
  const scores = calculateCampScores(answers);
  const total = Math.max(1, Object.values(scores).reduce((sum, s) => sum + s, 0));
  const percentages = Object.fromEntries(
    camps.map((camp) => [camp, Math.round((scores[camp] / total) * 100)])
  ) as Record<CampName, number>;
  const sorted = camps.toSorted((a, b) => scores[b] - scores[a]);
  const text = generateRecommendationText(scores, answers);

  return {
    primaryCamp: sorted[0],
    secondaryCamps: sorted.slice(1, 3),
    scores,
    percentages,
    ...text,
    copyText: `AI moslik natijasi: ${text.summary} Tavsiya: ${text.nextStep}`,
  };
}
