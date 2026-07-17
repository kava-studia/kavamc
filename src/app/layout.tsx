import type { Metadata, Viewport } from "next";
import { CookieConsent } from "@/components/cookie-consent";
import { ScrollEffects } from "@/components/scroll-effects";
import { SiteControls } from "@/components/site-controls";
import "./globals.css";
import "./refinement.css";
import "./mobile-polish.css";
import "./mobile-final.css";
import "./stability.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://kavamc.vercel.app"),
  title: { default: "KAVA MC - клубный MC, ведущий и продюсер событий", template: "%s · KAVA MC" },
  description: "Клубные MC - сеты, KAVA MC + Live Guitar, регулярные слоты и события под ключ. Москва и Московская область.",
  keywords: ["KAVA MC", "клубный MC", "ведущий Москва", "MC для клуба", "event producer", "live guitar show"],
  alternates: { canonical: "/" },
  openGraph: { title: "KAVA MC - энергия вечера", description: "Клубный MC, ведущий и продюсер событий.", type: "website", locale: "ru_RU", images: [{ url: "/media/og.webp", width: 1200, height: 630, alt: "KAVA MC" }] },
  twitter: { card: "summary_large_image", images: ["/media/og.webp"] },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#090909", colorScheme: "dark" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ru"><body><ScrollEffects /><SiteControls />{children}<CookieConsent /></body></html>;
}