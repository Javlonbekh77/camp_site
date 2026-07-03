import { getRecommendation } from "@/lib/recommendation/recommendationEngine";
import type { QuizAnswerMap, Recommendation } from "@/lib/types";

export type ChatMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

export type AiGuideResponse = {
  message: string;
  done: boolean;
  recommendation?: Recommendation;
  answers?: QuizAnswerMap;
};

// ─── Fallback question plan (used when no API key or API fails) ───────────────
const fallbackQuestions = [
  "Salom! Men STC Guide — sizning do'stingiz 😊 Avval tanishamiz: siz maktab o'quvchisi, talaba, o'qituvchi yoki boshqa kimsiz? Va taxminan necha yoshdasiz?",
  "Zo'r! Endi qizig'i — kundalik hayotda nima qilishdan zavq olasiz? Masalan: muammolarni yechish, narsalarni tahlil qilish, qurilmalar bilan o'ynash, yoki yangi g'oyalar ishlab chiqish?",
  "Tushundim! Endi maqsad haqida — STC campdan keyin qanday o'zgarishni ko'rishni istaysiz o'zingizda? (masalan: olympiadga start, kasbiy yo'nalish, farzandim uchun, startup qurishni bilmoqchi)",
  "IT bilim darajangiz qanday? Hech narsani bilmayman, ozgina asoslarni bilaman, yoki o'rtacha — qaysi birida? Oldin Python, Scratch, Excel yoki boshqa narsa sinab ko'rganmisiz?",
  "Deyarli bittaga kelayapmiz! Oxirgi savol: noutbukingiz bormi va offline/online format qaysi biriga qulay? (Chiroqchi shahriga kela olasizmi?)"
];

function extractUserAnswers(messages: ChatMessage[]): QuizAnswerMap {
  const userMsgs = messages.filter((m) => m.role === "user").map((m) => m.content);
  const keys = ["status", "interest", "goal", "level", "constraints"];
  return Object.fromEntries(keys.map((k, i) => [k, userMsgs[i] ?? ""]));
}

export function getFallbackGuideResponse(messages: ChatMessage[]): AiGuideResponse {
  const userCount = messages.filter((m) => m.role === "user").length;

  if (userCount < fallbackQuestions.length) {
    return { done: false, message: fallbackQuestions[userCount] };
  }

  const answers = extractUserAnswers(messages);
  const recommendation = getRecommendation(answers);

  return {
    done: true,
    answers,
    recommendation,
    message: `✨ Tahlil tayyor!\n\n${recommendation.summary}\n\n${recommendation.confidenceMessage}\n\n${recommendation.nextStep}`
  };
}

// ─── Groq system prompt ────────────────────────────────────────────────────────
export function buildStcGuideSystemPrompt() {
  return `Sen STC Guide — STC-2026 Summer Tech Camp uchun do'stona uzbek yordamchisi (Uzbek Latin tilida gaplashasan).

MAQSAD:
Foydalanuvchi bilan oddiy do'st sifatida suhbat qurib, uning qiziqishlari va maqsadlarini aniqlab, qaysi camp unga mos kelishini 4 ta foizda ko'rsatish.

CAMP'LAR haqida bilim bazang:
- AlgoCamp: Python dasturlash + algoritmlar + competitive programming + olympiad tayyorgarlik. Mantiqiy fikrlash, masala yechish, Codeforces, LeetCode yo'nalishi. Haftada Dushanba.
- DataCamp: SQL + Power BI + ma'lumotlar tahlili + dashboard. Python bilish kerak (talab). Seshanba kunlari. Biznes, raqamlar, Excel+, statistika qiziquvchilar uchun.
- RoboCamp: Scratch + robototexnika + kodlash asoslari. Yosh bolalar yoki qurilmalarni sevuvchilar uchun. Dushanba, Chorshanba, Juma (har ikki kunda).
- StartupCamp: G'oya validatsiya + vibe coding + no-code/AI + MVP + pitch. Ijodkor, tadbirkor ruhli yoshlar uchun. Chorshanba kunlari.

SUHBAT QOIDALARI:
1. Har doim faqat BITTA savol ber — ko'p savol bermа.
2. Kamida 4 ta savol ber (status, qiziqish, maqsad, daraja). Kerak bo'lsa 5-6 ta.
3. Javob noaniq bo'lsa "nega aynan shu?" deb qo'shimcha so'ra.
4. Do'stona, iliq, kulgili yoz — jargon ishlatma.
5. Foydalanuvchi o'z tilida javob bersa (o'zbek, ingliz) — shu tilga moslab javob ber.
6. Yetarli ma'lumot to'planganida (kamida 4 javob) — natija ber.

NATIJA BERISH:
Natija berishdan OLDIN, avval insonga tushunarli tahlil yoz (2-3 gap). Keyin QUYIDAGI ANIQ JSON bloкni oxirida qo'sh:

\`\`\`json
{
  "done": true,
  "primaryCamp": "AlgoCamp",
  "secondaryCamps": ["DataCamp"],
  "percentages": {
    "AlgoCamp": 60,
    "DataCamp": 25,
    "RoboCamp": 10,
    "StartupCamp": 5
  },
  "summary": "Siz mantiqiy fikrlashni sevgan va masalalar yechishdan zavq oladigan odam...",
  "confidenceMessage": "Bu tavsiya sizning javoblaringizga asoslanib berildi.",
  "nextStep": "Endi ro'yxatdan o'tish formasini to'ldirib, AlgoCamp'ni tanlab qo'ying."
}
\`\`\`

MUHIM QOIDALAR:
- Foizlar jumlasi 100 ga teng bo'lishi SHART.
- Barcha 4 camp uchun foiz ber.
- JSON blokni \`\`\`json va \`\`\` orasida ber — boshqacha format QABUL QILINMAYDI.
- JSON bermasdan turib "done":true YOZMA.
- Natija berishdan oldin kamida 4 marta savol ber.
`;
}

// ─── JSON parser ───────────────────────────────────────────────────────────────
export function parseGroqRecommendation(text: string, fallbackAnswers: QuizAnswerMap): AiGuideResponse {
  // Try markdown code block first: ```json ... ```
  let jsonStr: string | null = null;

  const mdMatch = text.match(/```json\s*([\s\S]*?)```/);
  if (mdMatch) {
    jsonStr = mdMatch[1].trim();
  } else {
    // Fallback: find raw JSON object with "done" key
    const rawMatch = text.match(/\{[\s\S]*?"done"[\s\S]*?\}/);
    if (rawMatch) jsonStr = rawMatch[0];
  }

  if (!jsonStr) {
    return { done: false, message: text };
  }

  try {
    const parsed = JSON.parse(jsonStr) as {
      done?: boolean;
      primaryCamp?: Recommendation["primaryCamp"];
      secondaryCamps?: Recommendation["secondaryCamps"];
      percentages?: Recommendation["percentages"];
      summary?: string;
      confidenceMessage?: string;
      nextStep?: string;
    };

    if (!parsed.done || !parsed.primaryCamp) {
      return { done: false, message: text.replace(jsonStr, "").trim() };
    }

    const base = getRecommendation({ ...fallbackAnswers, preferred: parsed.primaryCamp });
    const recommendation: Recommendation = {
      ...base,
      primaryCamp: parsed.primaryCamp,
      secondaryCamps: parsed.secondaryCamps?.length ? parsed.secondaryCamps : base.secondaryCamps,
      percentages: parsed.percentages ?? base.percentages,
      summary: parsed.summary ?? base.summary,
      confidenceMessage: parsed.confidenceMessage ?? base.confidenceMessage,
      nextStep: parsed.nextStep ?? base.nextStep,
      copyText: `STC Guide tavsiyasi:\n${parsed.summary ?? base.summary}\n\nMos camp: ${parsed.primaryCamp}\n${parsed.nextStep ?? base.nextStep}`
    };

    // Clean message: remove the json block from visible text
    const cleanMessage = text
      .replace(/```json[\s\S]*?```/g, "")
      .replace(jsonStr, "")
      .trim();

    return {
      done: true,
      answers: fallbackAnswers,
      recommendation,
      message: cleanMessage || recommendation.summary
    };
  } catch {
    return { done: false, message: text };
  }
}
