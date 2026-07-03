import type { CampName, QuizAnswerMap, Recommendation } from "@/lib/types";

const camps: CampName[] = ["AlgoCamp", "DataCamp", "RoboCamp", "StartupCamp"];

const labels: Record<CampName, string> = {
  AlgoCamp: "algoritmlar, Python va olimpiada masalalari",
  DataCamp: "ma'lumotlar tahlili, SQL va dashboardlar",
  RoboCamp: "robototexnika, Scratch va vizual mantiq",
  StartupCamp: "g'oya, prototip va AI yordamida mahsulot qurish"
};

export function calculateCampScores(answers: QuizAnswerMap): Record<CampName, number> {
  const scores: Record<CampName, number> = {
    AlgoCamp: 1,
    DataCamp: 1,
    RoboCamp: 1,
    StartupCamp: 1
  };

  const values = Object.values(answers).join(" ").toLowerCase();
  const add = (camp: CampName, amount: number) => {
    scores[camp] += amount;
  };

  if (values.includes("informatika o'qituvchisi")) add("AlgoCamp", 3);
  if (values.includes("maktab o'quvchisi")) add("AlgoCamp", 2);
  if (values.includes("farzandim")) add("RoboCamp", 4);
  if (values.includes("g'oyasi") || values.includes("startup")) add("StartupCamp", 5);
  if (values.includes("masala") || values.includes("algoritm") || values.includes("olimpiada")) add("AlgoCamp", 8);
  if (values.includes("ma'lumot") || values.includes("jadval") || values.includes("grafik") || values.includes("biznes tahlil")) add("DataCamp", 8);
  if (values.includes("robot") || values.includes("qurilma") || values.includes("coding")) add("RoboCamp", 7);
  if (values.includes("mahsulot") || values.includes("prototip") || values.includes("g'oya")) add("StartupCamp", 8);
  if (values.includes("zamonaviy kasb")) add("DataCamp", 4);
  if (values.includes("mantiq va texnologiya")) add("RoboCamp", 4);
  if (values.includes("excel")) add("DataCamp", 3);
  if (values.includes("aniq emas") || values.includes("bilmayman") || values.includes("hamma")) {
    camps.forEach((camp) => add(camp, 2));
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
    : `Sizga eng mos yo'nalish: ${primary}. Sabab: javoblaringiz ${labels[primary]} tomon kuchliroq qiziqish borligini ko'rsatdi. Ikkinchi mos yo'nalish: ${secondary[0]}.`;

  return {
    summary,
    confidenceMessage:
      "Bu natija yakuniy hukm emas. STC Guide javoblaringiz asosida moslikni hisoblaydi, sinov haftada esa yo'nalishni his qilib ko'rishingiz mumkin.",
    nextStep: "Endi ro'yxatdan o'tish formasini to'ldiring. Moslik natijangiz avtomatik qo'shiladi."
  };
}

export function getRecommendation(answers: QuizAnswerMap): Recommendation {
  // TODO: Later replace deterministic engine with OpenAI/Gemini API while keeping same return shape.
  const scores = calculateCampScores(answers);
  const total = Math.max(1, Object.values(scores).reduce((sum, score) => sum + score, 0));
  const percentages = Object.fromEntries(camps.map((camp) => [camp, Math.round((scores[camp] / total) * 100)])) as Record<CampName, number>;
  const sorted = camps.toSorted((a, b) => scores[b] - scores[a]);
  const text = generateRecommendationText(scores, answers);

  return {
    primaryCamp: sorted[0],
    secondaryCamps: sorted.slice(1, 3),
    scores,
    percentages,
    ...text,
    copyText: `AI moslik natijasi: ${text.summary} Tavsiya: ${text.nextStep}`
  };
}
