import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://kavamc.vercel.app";
  return ["", "/privacy", "/consent", "/cookies", "/terms", "/requisites"].map((path) => ({ url: `${base}${path}`, lastModified: new Date(), changeFrequency: path ? "yearly" : "monthly", priority: path ? 0.4 : 1 }));
}
