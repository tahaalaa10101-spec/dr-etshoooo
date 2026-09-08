import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";
import { semesterSchema } from "@/lib/validation";
import { rateLimit } from "@/lib/rate-limit";
import { apiError, apiSuccess, apiPaginated, unauthorized, serverError } from "@/lib/errors";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20")));
    const skip = (page - 1) * limit;
    const academicYearId = searchParams.get("academicYearId");

    const user = await getUser();
    const isAdmin = user?.role === "admin";

    const where: Record<string, unknown> = isAdmin ? {} : { published: true };
    if (academicYearId) where.academicYearId = academicYearId;

    const [semesters, total] = await Promise.all([
      prisma.semester.findMany({
        where,
        skip,
        take: limit,
        orderBy: { order: "asc" },
        include: {
          academicYear: { select: { id: true, title: true, slug: true } },
          _count: { select: { subjects: true } },
        },
      }),
      prisma.semester.count({ where }),
    ]);

    return apiPaginated(semesters, { page, limit, total, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    console.error("Error fetching semesters:", error);
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
    const parsed = semesterSchema.safeParse(body);
    if (!parsed.success) return apiError(parsed.error.issues[0].message);

    const { title, slug, academicYearId, description, order, published } = parsed.data;

    const year = await prisma.academicYear.findUnique({ where: { id: academicYearId } });
    if (!year) return apiError("Academic year not found");

    const existing = await prisma.semester.findFirst({ where: { slug, academicYearId } });
    if (existing) return apiError("A semester with this slug already exists in this year", 409);

    const semester = await prisma.semester.create({
      data: { title, slug, academicYearId, description, order: order ?? 0, published: published ?? true },
    });

    return apiSuccess(semester, 201);
  } catch (error) {
    console.error("Error creating semester:", error);
    return serverError();
  }
}
