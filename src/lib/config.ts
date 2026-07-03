export const siteConfig = {
  deadline: process.env.NEXT_PUBLIC_REGISTRATION_DEADLINE ?? "2026-07-11T23:59:00+05:00",
  firstLesson: process.env.NEXT_PUBLIC_FIRST_LESSON ?? "2026-07-13T09:00:00+05:00",
  referralDiscount: Number(process.env.NEXT_PUBLIC_REFERRAL_DISCOUNT ?? 50000),
  telegram: process.env.NEXT_PUBLIC_TELEGRAM ?? "@your_username",
  phone: process.env.NEXT_PUBLIC_PHONE ?? "+998 XX XXX XX XX",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  location: "Chiroqchi — aniq manzil keyinroq beriladi"
};

export const formatDateTimeUz = (date: string) =>
  new Intl.DateTimeFormat("uz-UZ", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Tashkent"
  }).format(new Date(date));
