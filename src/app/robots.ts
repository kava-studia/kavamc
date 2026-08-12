import type { MetadataRoute } from "next";

const disallow = ["/api/", "/leads"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow,
      },
      {
        userAgent: "Yandex",
        allow: "/",
        disallow,
      },
    ],
    sitemap: "https://kavamc.vercel.app/sitemap.xml",
    host: "https://kavamc.vercel.app",
  };
}
