import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, serverError } from "@/lib/errors";
import { rateLimit } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const rate = rateLimit(`search:${ip}`, 20, 60000);
    if (!rate.success) return serverError();

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q")?.trim();

    if (!query || query.length < 2) {
      return apiSuccess({ results: [] });
    }

    const [lectures, mcqs, notes, terms] = await Promise.all([
      prisma.lecture.findMany({
        where: { published: true, OR: [{ title: { contains: query, mode: "insensitive" } }, { description: { contains: query, mode: "insensitive" } }] },
        take: 5,
        select: { id: true, title: true, slug: true, description: true },
      }),
      prisma.mcq.findMany({
        where: { published: true, question: { contains: query, mode: "insensitive" } },
        take: 5,
        select: { id: true, question: true },
      }),
      prisma.note.findMany({
        where: { published: true, title: { contains: query, mode: "insensitive" } },
        take: 5,
        select: { id: true, title: true, category: true },
      }),
      prisma.medicalTerm.findMany({
        where: {
          published: true,
          OR: [
            { term: { contains: query, mode: "insensitive" } },
            { arabicTerm: { contains: query, mode: "insensitive" } },
            { latinTerm: { contains: query, mode: "insensitive" } },
          ],
        },
        take: 5,
        select: { id: true, term: true, arabicTerm: true, latinTerm: true, definition: true },
      }),
    ]);

    const [cases, essays, apps, howToStudy] = await Promise.all([
      prisma.clinicalCase.findMany({
        where: { published: true, title: { contains: query, mode: "insensitive" } },
        take: 5,
        select: { id: true, title: true },
      }),
      prisma.essay.findMany({
        where: { published: true, question: { contains: query, mode: "insensitive" } },
        take: 5,
        select: { id: true, question: true },
      }),
      prisma.medicalApp.findMany({
        where: { published: true, name: { contains: query, mode: "insensitive" } },
        take: 5,
        select: { id: true, name: true, description: true },
      }),
      prisma.howToStudy.findMany({
        where: { published: true, title: { contains: query, mode: "insensitive" } },
        take: 5,
        select: { id: true, title: true, description: true },
      }),
    ]);

    return apiSuccess({ lectures, mcqs, notes, terms, cases, essays, apps, howToStudy });
  } catch (error) {
    console.error("Error searching:", error);
    return serverError();
  }
}
