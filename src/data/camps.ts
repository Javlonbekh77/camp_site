import { BarChart3, Bot, Code2, Rocket } from "lucide-react";

export type CampSlug = "algocamp" | "datacamp" | "robocamp" | "startupcamp";

export type Camp = {
  slug: CampSlug;
  name: "AlgoCamp" | "DataCamp" | "RoboCamp" | "StartupCamp";
  shortName: string;
  tagline: string;
  color: string;
  iconName: "code" | "chart" | "bot" | "rocket";
  whoFor: string[];
  topics: string[];
  outcomes: string[];
  requirements: string[];
  weeklyPlan: string[];
  notFor: string[];
  ctaText: string;
};

export const campIcons = {
  code: Code2,
  chart: BarChart3,
  bot: Bot,
  rocket: Rocket
};

export const camps: Camp[] = [
  {
    slug: "algocamp",
    name: "AlgoCamp",
    shortName: "Algo",
    tagline: "Python, algoritmlar va informatika olimpiadasi uchun mustahkam start.",
    color: "#2563EB",
    iconName: "code",
    whoFor: [
      "Maktab o'quvchilari",
      "Informatika olimpiadasiga tayyorlanayotganlar",
      "Informatika o'qituvchilari",
      "Python va Competitive Programming boshlamoqchilar"
    ],
    topics: ["Python from zero to hero", "Algorithms", "Competitive Programming", "Olimpiada masalalari", "Problem-solving mindset"],
    outcomes: ["Python asoslari bilan masala yechasiz", "Algoritmik fikrlashni boshlaysiz", "Mini contest va amaliy topshiriqlar bilan tajriba olasiz"],
    requirements: ["Boshlang'ich darajadan qatnashish mumkin", "Mashq qilishga tayyorlik", "Laptop bo'lsa yaxshi, bo'lmasa maslahatlashamiz"],
    weeklyPlan: [
      "1-hafta: Python basics, input/output, conditions, loops",
      "2-hafta: functions, lists, strings, problem-solving patterns",
      "3-hafta: algorithms basics, sorting/searching, complexity intuition",
      "4-hafta: CP practice, olympiad-style tasks, mock contest"
    ],
    notFor: ["Faqat tayyor javob yodlashni xohlaydiganlar", "Mashq va mustaqil urinishga vaqt ajratmaydiganlar"],
    ctaText: "AlgoCamp'ga yozilish"
  },
  {
    slug: "datacamp",
    name: "DataCamp",
    shortName: "Data",
    tagline: "Python, SQL va Power BI orqali data analytics'ga real start.",
    color: "#06B6D4",
    iconName: "chart",
    whoFor: ["Zamonaviy kasbga qadam qo'ymoqchi bo'lgan yoshlar", "Python, SQL va Power BI o'rganmoqchilar", "Tahliliy fikrlashni yoqtiradiganlar"],
    topics: ["Python from zero to hero", "Data analysis", "SQL", "Power BI", "Dashboards and business insights"],
    outcomes: ["Ma'lumotlarni tozalash va tahlil qilishni boshlaysiz", "SQL so'rovlar yozasiz", "Power BI dashboard mini loyihasi qilasiz"],
    requirements: ["Noldan boshlash mumkin", "Jadval va sonlar bilan ishlashga qiziqish", "Laptop tavsiya qilinadi"],
    weeklyPlan: [
      "1-hafta: Python basics for data",
      "2-hafta: data cleaning and analysis",
      "3-hafta: SQL basics and practical queries",
      "4-hafta: Power BI dashboards and mini project"
    ],
    notFor: ["Faqat nazariya eshitib o'tirishni xohlaydiganlar", "Amaliy jadval, grafik va savollar bilan ishlashni yoqtirmaydiganlar"],
    ctaText: "DataCamp'ga yozilish"
  },
  {
    slug: "robocamp",
    name: "RoboCamp",
    shortName: "Robo",
    tagline: "Bolalar uchun Scratch, robocoding va robototexnika orqali mantiq va ijod.",
    color: "#22C55E",
    iconName: "bot",
    whoFor: ["Bolalar va yosh o'rganuvchilar", "Robototexnika va robocodingga qiziquvchilar", "Farzandi uchun foydali yozgi muhit izlayotgan ota-onalar"],
    topics: ["Scratch in robocoding", "Robotics basics", "Creative thinking", "Visual programming", "Robototexnika"],
    outcomes: ["Scratch mantiqi orqali coding tushunchalarini olasiz", "Robot va sensor konseptlarini tushunasiz", "Ijodiy mini loyiha qilasiz"],
    requirements: ["Qiziqish va savol berish istagi", "Boshlang'ich daraja yetarli", "Yosh guruhiga qarab format moslanadi"],
    weeklyPlan: [
      "1-hafta: Scratch logic, events, loops",
      "2-hafta: robocoding tasks, sensors/logic concepts",
      "3-hafta: robotics basics and simple project",
      "4-hafta: final robot/creative challenge"
    ],
    notFor: ["Faqat telefon o'yiniga o'xshash mashg'ulot kutayotganlar", "Mantiqiy topshiriqlarni sinab ko'rishni istamaydiganlar"],
    ctaText: "RoboCamp'ga yozilish"
  },
  {
    slug: "startupcamp",
    name: "StartupCamp",
    shortName: "Startup",
    tagline: "G'oyani prototipga aylantirish: vibe coding, MVP, networking va pitch.",
    color: "#F97316",
    iconName: "rocket",
    whoFor: ["G'oyasi bor yoshlar", "Startup va mahsulot yasashga qiziquvchilar", "Professional coder bo'lmasa ham prototip qurmoqchilar"],
    topics: ["Vibe Coding", "Idea validation", "Prototype building", "No-code / low-code / AI-assisted building", "Pitching basics"],
    outcomes: ["G'oyani muammo va auditoriya bilan tekshirasiz", "AI yordamida prototip yasashni boshlaysiz", "Pitch va feedback olish tajribasi bo'ladi"],
    requirements: ["G'oya yoki qiziqish", "Sinab ko'rishga tayyorlik", "Laptop bo'lsa qulay"],
    weeklyPlan: [
      "1-hafta: idea selection and problem validation",
      "2-hafta: vibe coding / AI-assisted prototype",
      "3-hafta: landing page or MVP building",
      "4-hafta: pitch, feedback, networking"
    ],
    notFor: ["Faqat nazariy biznes darsi kutayotganlar", "G'oyani sinash va feedback olishni xohlamaydiganlar"],
    ctaText: "StartupCamp'ga yozilish"
  }
];

export const getCampBySlug = (slug: string) => camps.find((camp) => camp.slug === slug);
