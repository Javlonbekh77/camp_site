import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: "STC-2026 — Summer Tech Camp 2026 | Chiroqchi",
  description:
    "Chiroqchida yoshlar uchun Python, Data Analytics, Robototexnika va Startup yo'nalishlarida yozgi tech camp. Qabul 11-iyul 23:59 gacha.",
  openGraph: {
    title: "STC-2026 — Summer Tech Camp 2026",
    description:
      "Python, Data Analytics, Robototexnika va Startup yo'nalishlarida yozgi tech camp.",
    images: ["/og-stc-2026.png"]
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
