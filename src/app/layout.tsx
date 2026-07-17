import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://kavamc.vercel.app"),
  title: "KAVA MC - клубный MC, ведущий и продюсер событий",
  description: "Клубные MC-сеты, KAVA MC + Live Guitar, регулярные слоты и события под ключ. Москва и Московская область.",
  keywords: ["KAVA MC", "клубный MC", "ведущий Москва", "MC для клуба", "event producer", "live guitar show"],
  openGraph: {
    title: "KAVA MC - энергия вечера",
    description: "Клубный MC, ведущий и продюсер событий.",
    type: "website",
    locale: "ru_RU",
    images: [{ url: "/media/og.svg", width: 1200, height: 630, alt: "KAVA MC" }],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ru"><body>{children}</body></html>;
}
