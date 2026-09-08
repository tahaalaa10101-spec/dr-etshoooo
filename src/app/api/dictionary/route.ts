import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";
import { apiError, apiSuccess, serverError } from "@/lib/errors";

export async function GET(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const rate = rateLimit(`search:${ip}`, 30, 60000);
    if (!rate.success) return apiError("Rate limit exceeded", 429);

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q")?.trim() || searchParams.get("search")?.trim();

    if (!query || query.length < 1) {
      const terms = await prisma.medicalTerm.findMany({
        where: { published: true },
        take: 50,
        orderBy: { term: "asc" },
        include: { subject: { select: { id: true, name: true, slug: true } } },
      });
      return apiSuccess(terms);
    }

    const terms = await prisma.medicalTerm.findMany({
      where: {
        published: true,
        OR: [
          { term: { contains: query, mode: "insensitive" } },
          { arabicTerm: { contains: query, mode: "insensitive" } },
          { latinTerm: { contains: query, mode: "insensitive" } },
          { definition: { contains: query, mode: "insensitive" } },
          { arabicMeaning: { contains: query, mode: "insensitive" } },
        ],
      },
      take: 50,
      orderBy: { term: "asc" },
      include: { subject: { select: { id: true, name: true, slug: true } } },
    });

    return apiSuccess(terms);
  } catch (error) {
    console.error("Error searching dictionary:", error);
    return serverError();
  }
}
