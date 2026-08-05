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
    default: "KAVA STUDIA - организация и проведение мероприятий",
    template: "%s · KAVA STUDIA",
  },
  description:
    "MC KAVA организует и проводит свадьбы, корпоративы и частные события в Сергиевом Посаде, Москве и Московской области. Ведущий, DJ, программа, подрядчики и контроль подготовки.",
  keywords: [
    "KAVA STUDIA",
    "MC KAVA",
    "ведущий на свадьбу",
    "ведущий Сергиев Посад",
    "ведущий Москва",
    "организация свадьбы",
    "ведущий на корпоратив",
    "организация мероприятий Московская область",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title: "KAVA STUDIA - организация и проведение современных событий",
    description:
      "Свадьбы, корпоративы и частные мероприятия. Личное участие MC KAVA, программа, подрядчики и контроль подготовки.",
    type: "website",
    locale: "ru_RU",
    images: [{ url: "/media/og.webp", width: 1200, height: 630, alt: "KAVA STUDIA - MC KAVA" }],
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
