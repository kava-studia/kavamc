import type { Metadata, Viewport } from "next";
import { Manrope, Unbounded } from "next/font/google";
import { CookieConsent } from "@/components/cookie-consent";
import { ScrollEffects } from "@/components/scroll-effects";
import { SiteControls } from "@/components/site-controls";
import "./globals.css";
import "./refinement.css";
import "./mobile-final.css";
import "./premium-v2.css";
import "./mobile-layout-hotfix.css";
import "./bento.css";

const manrope = Manrope({
  subsets: ["cyrillic", "latin"],
  variable: "--font-manrope",
  display: "swap",
});

const unbounded = Unbounded({
  subsets: ["cyrillic", "latin"],
  variable: "--font-unbounded",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://kavamc.vercel.app"),
  title: {
    default: "KAVA MC - ведущий, организатор мероприятий и live show",
    template: "%s | KAVA MC",
  },
  description:
    "MC KAVA - ведущий и организатор свадеб, корпоративов и частных мероприятий в Москве, Сергиевом Посаде и Московской области. Club Show и Eminem Live Tribute Show.",
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
    "клубный MC",
    "Eminem tribute show",
    "рэп шоу на мероприятие",
  ],
  authors: [{ name: "MC KAVA" }],
  creator: "MC KAVA",
  publisher: "KAVA MC",
  category: "events",
  alternates: { canonical: "/" },
  openGraph: {
    title: "KAVA MC - организация, ведение и live show",
    description:
      "Свадьбы, корпоративы, организация мероприятий, клубные форматы и Eminem Live Tribute Show.",
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
  themeColor: "#0d0f12",
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" className={`${manrope.variable} ${unbounded.variable}`}>
      <body>
        <ScrollEffects />
        <SiteControls />
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}
