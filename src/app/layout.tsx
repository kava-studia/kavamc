import type { Metadata, Viewport } from "next";
import { CookieConsent } from "@/components/cookie-consent";
import { ScrollEffects } from "@/components/scroll-effects";
import { SiteControls } from "@/components/site-controls";
import "./globals.css";
import "./refinement.css";
import "./mobile-final.css";
import "./premium-v2.css";
import "./mobile-layout-hotfix.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://kavamc.vercel.app"),
  title: {
    default: "KAVA MC - ведущий, организатор и live show",
    template: "%s · KAVA MC",
  },
  description:
    "MC KAVA проводит и организует свадьбы, корпоративы и частные события, выступает в клубах и развивает Eminem Live Tribute Show. Москва, Сергиев Посад и Московская область.",
  keywords: [
    "KAVA MC",
    "MC KAVA",
    "Eminem tribute show",
    "Eminem tribute Russia",
    "рэп шоу на корпоратив",
    "артист на мероприятие",
    "ведущий на свадьбу",
    "ведущий Сергиев Посад",
    "ведущий Москва",
    "ведущий на корпоратив",
    "организация свадьбы",
    "организация мероприятий Московская область",
    "клубный MC",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title: "KAVA MC - организация, ведение и live show",
    description:
      "Собираю событие. Веду зал. Делаю шоу. Свадьбы, корпоративы, клубные форматы и Eminem Live Tribute Show.",
    type: "website",
    locale: "ru_RU",
    images: [{ url: "/media/og.webp", width: 1200, height: 630, alt: "KAVA MC - организация, ведение и шоу" }],
  },
  twitter: { card: "summary_large_image", images: ["/media/og.webp"] },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0b0d12",
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body>
        <ScrollEffects />
        <SiteControls />
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}
