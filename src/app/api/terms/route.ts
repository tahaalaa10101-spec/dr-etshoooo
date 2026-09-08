import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";
import { termSchema } from "@/lib/validation";
import { rateLimit } from "@/lib/rate-limit";
import { apiError, apiSuccess, apiPaginated, unauthorized, serverError } from "@/lib/errors";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20")));
    const skip = (page - 1) * limit;
    const subjectId = searchParams.get("subjectId");
    const search = searchParams.get("search");

    const where: Record<string, unknown> = { published: true };
    if (subjectId) where.subjectId = subjectId;
    if (search) {
      where.OR = [
        { term: { contains: search, mode: "insensitive" } },
        { arabicTerm: { contains: search, mode: "insensitive" } },
        { latinTerm: { contains: search, mode: "insensitive" } },
        { definition: { contains: search, mode: "insensitive" } },
      ];
    }

    const [terms, total] = await Promise.all([
      prisma.medicalTerm.findMany({
        where, skip, take: limit,
        orderBy: { term: "asc" },
        include: { subject: { select: { id: true, name: true, slug: true } } },
      }),
      prisma.medicalTerm.count({ where }),
    ]);

    return apiPaginated(terms, { page, limit, total, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    console.error("Error fetching terms:", error);
    return serverError();
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUser();
    if (!user || user.role !== "admin") return unauthorized();

    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const rate = rateLimit(`api:${ip}`, 30, 60000);
    if (!rate.success) return apiError("Rate limit exceeded", 429);

    const body = await request.json();
    const parsed = termSchema.safeParse(body);
    if (!parsed.success) return apiError(parsed.error.issues[0].message);

    const term = await prisma.medicalTerm.create({ data: parsed.data });
    return apiSuccess(term, 201);
  } catch (error) {
    console.error("Error creating term:", error);
    return serverError();
  }
}
