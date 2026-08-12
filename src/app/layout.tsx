import type { Metadata, Viewport } from "next";
import { Onest } from "next/font/google";
import { CookieConsent } from "@/components/cookie-consent";
import { ScrollEffects } from "@/components/scroll-effects";
import { BentoMobileMenu } from "@/components/bento-mobile-menu";
import { YandexMetrika } from "@/components/yandex-metrika";
import "./globals.css";
import "./refinement.css";
import "./mobile-final.css";
import "./premium-v2.css";
import "./mobile-layout-hotfix.css";
import "./bento.css";
import "./bento-polish.css";
import "./legal-hub.css";
import "./bento-final.css";
import "./service-hero.css";
import "./site-v5.css";
import "./site-v5-hotfix.css";
import "./site-v6.css";

const onest = Onest({
  subsets: ["cyrillic", "latin"],
  variable: "--font-onest",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://kavamc.vercel.app"),
  title: {
    default: "KAVA MC - ведущий, организатор мероприятий и live show",
    template: "%s | KAVA MC",
  },
  description:
    "MC KAVA - ведущий и организатор свадеб, корпоративов и частных мероприятий в Москве, Сергиевом Посаде и Московской области. Eminem Live Tribute Show, Club Show MC и event production.",
  keywords: [
    "MC KAVA",
    "KAVA MC",
    "ведущий на свадьбу",
    "ведущий на корпоратив",
    "ведущий Москва",
    "ведущий Сергиев Посад",
    "организация мероприятий",
    "организатор мероприятий Москва",
    "организация свадьбы",
    "Club Show MC",
    "Eminem tribute show",
    "рэп шоу на мероприятие",
    "event production Москва",
    "шоу на корпоратив",
  ],
  authors: [{ name: "MC KAVA" }],
  creator: "MC KAVA",
  publisher: "KAVA MC",
  category: "events",
  alternates: { canonical: "/" },
  openGraph: {
    title: "KAVA MC - организация, ведение и live show",
    description:
      "Свадьбы, корпоративы, организация мероприятий, сценические форматы и Eminem Live Tribute Show.",
    type: "website",
    locale: "ru_RU",
    siteName: "KAVA MC",
    images: [{ url: "/media/og.webp", width: 1200, height: 630, alt: "KAVA MC - организация, ведение и шоу" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "KAVA MC - ведущий, организатор и live show",
    description: "Организация · Ведение · Шоу",
    images: ["/media/og.webp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0b0d10",
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" className={onest.variable}>
      <body>
        <ScrollEffects />
        <BentoMobileMenu />
        {children}
        <YandexMetrika />
        <CookieConsent />
      </body>
    </html>
  );
}
