import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://dr-etshoooo.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/subjects`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/how-to-study`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/terminology`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/apps`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/dictionary`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/login`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    { url: `${BASE_URL}/register`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
  ];

  try {
    const [subjects, howToStudy, lectures] = await Promise.all([
      prisma.subject.findMany({
        where: { published: true },
        select: { slug: true, updatedAt: true },
      }),
      prisma.howToStudy.findMany({
        where: { published: true },
        select: { slug: true, updatedAt: true },
      }),
      prisma.lecture.findMany({
        where: { published: true },
        select: { slug: true, updatedAt: true },
      }),
    ]);

    const dynamicPages: MetadataRoute.Sitemap = [
      ...subjects.map((s) => ({
        url: `${BASE_URL}/subjects/${s.slug}`,
        lastModified: s.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })),
      ...howToStudy.map((h) => ({
        url: `${BASE_URL}/how-to-study/${h.slug}`,
        lastModified: h.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      })),
      ...lectures.map((l) => ({
        url: `${BASE_URL}/lectures/${l.slug}`,
        lastModified: l.updatedAt,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      })),
    ];

    return [...staticPages, ...dynamicPages];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return staticPages;
  }
}
