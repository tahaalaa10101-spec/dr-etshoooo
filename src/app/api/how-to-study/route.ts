import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";
import { howToStudySchema } from "@/lib/validation";
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
    if (search) where.title = { contains: search, mode: "insensitive" };

    const [items, total] = await Promise.all([
      prisma.howToStudy.findMany({
        where, skip, take: limit,
        orderBy: { order: "asc" },
        include: { subject: { select: { id: true, name: true, slug: true } } },
      }),
      prisma.howToStudy.count({ where }),
    ]);

    return apiPaginated(items, { page, limit, total, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    console.error("Error fetching how-to-study:", error);
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
    const parsed = howToStudySchema.safeParse(body);
    if (!parsed.success) return apiError(parsed.error.issues[0].message);

    const item = await prisma.howToStudy.create({ data: parsed.data });
    return apiSuccess(item, 201);
  } catch (error) {
    console.error("Error creating how-to-study:", error);
    return serverError();
  }
}
