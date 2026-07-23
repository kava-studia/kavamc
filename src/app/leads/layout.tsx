import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "KAVA MC - база заведений Подмосковья",
  description: "Рабочая CRM KAVA MC для продаж выступлений барам, ресторанам и event-площадкам Московской области.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function LeadsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
