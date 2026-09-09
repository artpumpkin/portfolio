import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://lachkar.me/", changeFrequency: "monthly", priority: 1 },
  ];
}
