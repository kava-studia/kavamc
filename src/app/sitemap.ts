import type { MetadataRoute } from "next";
import { guides, services } from "@/data/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://kavamc.vercel.app";
  const updated = new Date("2026-08-12T00:00:00+03:00");

  const staticPages: MetadataRoute.Sitemap = [
    { url: base, lastModified: updated, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/eminem-tribute`, lastModified: updated, changeFrequency: "weekly", priority: 0.95 },
    { url: `${base}/poleznoe`, lastModified: updated, changeFrequency: "weekly", priority: 0.85 },
    { url: `${base}/poleznoe/chek-list-podgotovki-meropriyatiya`, lastModified: updated, changeFrequency: "monthly", priority: 0.82 },
    { url: `${base}/referral`, lastModified: updated, changeFrequency: "monthly", priority: 0.65 },
    { url: `${base}/legal`, lastModified: updated, changeFrequency: "yearly", priority: 0.35 },
    { url: `${base}/privacy`, lastModified: updated, changeFrequency: "yearly", priority: 0.2 },
    { url: `${base}/consent`, lastModified: updated, changeFrequency: "yearly", priority: 0.2 },
    { url: `${base}/cookies`, lastModified: updated, changeFrequency: "yearly", priority: 0.2 },
    { url: `${base}/terms`, lastModified: updated, changeFrequency: "yearly", priority: 0.2 },
    { url: `${base}/requisites`, lastModified: updated, changeFrequency: "yearly", priority: 0.25 },
  ];

  const guidePages: MetadataRoute.Sitemap = guides.map((guide) => ({
    url: `${base}/poleznoe/${guide.slug}`,
    lastModified: updated,
    changeFrequency: "monthly",
    priority: 0.75,
  }));

  const servicePages: MetadataRoute.Sitemap = services.map((service) => ({
    url: `${base}/uslugi/${service.slug}`,
    lastModified: updated,
    changeFrequency: "monthly",
    priority: 0.9,
  }));

  return [...staticPages, ...servicePages, ...guidePages];
}
