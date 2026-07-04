import { getRecommendation } from "@/lib/recommendation/recommendationEngine";
import type { QuizAnswerMap, Recommendation } from "@/lib/types";

export type ChatMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

export type AiGuideResponse = {
  message: string;
  done: boolean;
  suggestions?: string[];       // quick-reply chips for the current question
  recommendation?: Recommendation;
  answers?: QuizAnswerMap;
};

// ─── Fallback questions + suggestions (no API key) ────────────────────────────
const fallbackSteps: { message: string; suggestions: string[] }[] = [
  {
    message: "Salom! 👋 Men STC Guide — keling sizga mos campni topamiz. Siz kimsiz?",
    suggestions: ["Maktab o'quvchisi", "Talaba", "O'qituvchi", "Boshqa"],
  },
  {
    message: "Zo'r! Bo'sh vaqtingizda ko'proq nima qilasiz?",
    suggestions: ["Muammolar yechaman", "Narsalar yasayman", "G'oyalar izlayman", "Raqamlar tahlil qilaman"],
  },
  {
    message: "Qiyin mantiqiy jumboqni soatlab yechib o'tirasizmi?",
    suggestions: ["Ha, qo'ymayman", "Ba'zan", "Yo'q, boshqa yo'l izlayman"],
  },
  {
    message: "Robot yoki qurilma yasash qiziqasizmi?",
    suggestions: ["Ha, juda!", "Biroz qiziq", "Yo'q"],
  },
  {
    message: "O'z startabingiz yoki ilovangiz bo'lsin deb xohlaysizmi?",
    suggestions: ["Ha, albatta!", "O'ylagan edim", "Yo'q"],
  },
  {
    message: "IT va dasturlash bo'yicha tajribangiz bormi?",
    suggestions: ["Python bilaman", "Scratch ishlatganman", "Hech narsa bilmayman", "Excel bilaman"],
  },
  {
    message: "Noutbukingiz bormi?",
    suggestions: ["Ha, bor", "Yo'q"],
  },
];

function extractUserAnswers(messages: ChatMessage[]): QuizAnswerMap {
  const userMsgs = messages.filter((m) => m.role === "user").map((m) => m.content);
  return { allAnswers: userMsgs.join(" | ") };
}

export function getFallbackGuideResponse(messages: ChatMessage[]): AiGuideResponse {
  const userCount = messages.filter((m) => m.role === "user").length;

  if (userCount < fallbackSteps.length) {
    const step = fallbackSteps[userCount];
    return { done: false, message: step.message, suggestions: step.suggestions };
  }

  const answers = extractUserAnswers(messages);
  const recommendation = getRecommendation(answers);

  return {
    done: true,
    answers,
    recommendation,
    message: `✨ Tahlil tayyor! ${recommendation.summary}`,
  };
}

// ─── Groq system prompt ───────────────────────────────────────────────────────
export function buildStcGuideSystemPrompt(): string {
  return `Sen STC Guide — STC-2026 Summer Tech Camp uchun uzbek tilida gaplashadigan do'stona yordamchisan.

MAQSAD: Foydalanuvchi bilan ERKIN suhbat qurish orqali uning qiziqishlarini aniqlab, qaysi camp unga mos ekanligini aniqlash.

CAMP'LAR:
- AlgoCamp ⭐: Python, algoritmlar, mantiqiy fikrlash, olimpiada. Mantiqiy fikrlovchilarga ideal.
- StartupCamp ⭐: Startup, vibe coding, AI vositalar, MVP. Ijodkor va tadbirkorlarga.
- RoboCamp ⭐: Robototexnika, qurilmalar, Scratch. Qo'llari bilan narsalar yasashni sevuvchilarga.
- DataCamp: SQL, Power BI, ma'lumotlar tahlili. FAQAT aniq data qiziquvchilar uchun.

JAVOB FORMATI (natija berishdan oldin):
Har bir javobingiz biroz batafsilroq, 3-4 ta gapdan tashkil topsin. Avvalgi javobni tahlil qiling va keyingi savolni bering.
Suhbat davomli bo'lishi kerak. Jami 10-15 ta savol berganingizdan keyingina natijani e'lon qiling!

Har bir javobda MAJBURIY ravishda bergan savolingizga mos 3-4 ta "suggestions" (variantlar) bering:

\`\`\`json
{
  "done": false,
  "message": "Ajoyib tanlov! Mantiqiy masalalar insonning analitik fikrlash qobiliyatini juda kuchli o'stiradi. Shaxsan men uchun ham qiyin muammolarni yechish juda qiziqarli jarayon. Aytingchi, shunday qiyin mantiqiy jumboqqa duch kelsangiz, soatlab o'tirib yechimini topmaguncha qo'ymaysizmi yoki yordam so'raysizmi?",
  "suggestions": ["Ha, o'zim yechmaguncha qo'ymayman", "Do'stlarim bilan muhokama qilaman", "Internetdan yechim izlayman", "Tez zerikib qolaman"]
}
\`\`\`

NATIJA BERISH (10-15 savoldan keyin):
Natijani berayotganda, JSON blokidan tashqarida (oddiy matn ko'rinishida) xulosa so'zlarini yozishingiz shart. So'ngra JSON qismini bering.

Ajoyib, tahlil tayyor! Sizning javoblaringizni o'rganib chiqib...
\`\`\`json
{
  "done": true,
  "primaryCamp": "AlgoCamp",
  "secondaryCamps": ["StartupCamp"],
  "percentages": { "AlgoCamp": 60, "StartupCamp": 25, "RoboCamp": 10, "DataCamp": 5 },
  "summary": "Siz mantiqiy fikrlovchisiz — AlgoCamp ideal!",
  "confidenceMessage": "Bu tavsiya javoblaringizga asoslangan.",
  "nextStep": "Ro'yxatdan o'tish formasida AlgoCamp'ni tanlang."
}
\`\`\`

QOIDALAR:
- Har javob: 3-4 ta gapdan iborat bo'lsin. Do'stona va qiziqarli yozing!
- suggestions: savolingizga javob bo'ladigan 3-4 ta mantiqiy variant.
- MAVZUDAN CHIQMANG: Barcha savollar faqat texnologiya, dasturlash, mantiq, startaplar, robototexnika yoki jamoada ishlashga oid bo'lishi SHART. Hayotiy yoki umumiy falsafiy savollar (masalan, "zaharli", "qiziqarli" kabi ma'nosiz gaplar) bermang!
- DataCamp foizi: user aniq "SQL/dashboard/jadval" demasa 5-15% atrofida ushlab turing.
- 10-15 savoldan keyingina natija (done: true) bering.
- Foizlar yig'indisi aniq 100 bo'lishi shart.`;
}

// ─── JSON parser ──────────────────────────────────────────────────────────────
export function parseGroqRecommendation(
  text: string,
  fallbackAnswers: QuizAnswerMap
): AiGuideResponse {
  let jsonStr: string | null = null;

  const mdMatch = text.match(/```json\s*([\s\S]*?)```/);
  if (mdMatch) {
    jsonStr = mdMatch[1].trim();
  } else {
    const rawMatch = text.match(/\{[\s\S]*?"done"[\s\S]*?\}/);
    if (rawMatch) jsonStr = rawMatch[0];
  }

  if (!jsonStr) {
    return { done: false, message: text };
  }

  try {
    const parsed = JSON.parse(jsonStr) as {
      done?: boolean;
      message?: string;
      suggestions?: string[];
      primaryCamp?: Recommendation["primaryCamp"];
      secondaryCamps?: Recommendation["secondaryCamps"];
      percentages?: Recommendation["percentages"];
      summary?: string;
      confidenceMessage?: string;
      nextStep?: string;
    };

    // Mid-conversation message with suggestions (not done yet)
    if (!parsed.done && parsed.message) {
      return {
        done: false,
        message: parsed.message,
        suggestions: parsed.suggestions ?? [],
      };
    }

    if (!parsed.done || !parsed.primaryCamp) {
      // No JSON structure we recognize — return plain text
      const cleanText = text.replace(/```json[\s\S]*?```/g, "").replace(jsonStr, "").trim();
      return { done: false, message: cleanText || text };
    }

    // Final result
    const base = getRecommendation({ ...fallbackAnswers, preferred: parsed.primaryCamp });
    const recommendation: Recommendation = {
      ...base,
      primaryCamp: parsed.primaryCamp,
      secondaryCamps: parsed.secondaryCamps?.length ? parsed.secondaryCamps : base.secondaryCamps,
      percentages: parsed.percentages ?? base.percentages,
      summary: parsed.summary ?? base.summary,
      confidenceMessage: parsed.confidenceMessage ?? base.confidenceMessage,
      nextStep: parsed.nextStep ?? base.nextStep,
      copyText: `STC Guide tavsiyasi:\n${parsed.summary ?? base.summary}\n\nMos camp: ${parsed.primaryCamp}\n${parsed.nextStep ?? base.nextStep}`,
    };

    const cleanMessage = text
      .replace(/```json[\s\S]*?```/g, "")
      .replace(jsonStr, "")
      .trim();

    return {
      done: true,
      answers: fallbackAnswers,
      recommendation,
      message: cleanMessage || recommendation.summary,
    };
  } catch {
    return { done: false, message: text };
  }
}
