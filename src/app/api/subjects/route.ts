import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";
import { subjectSchema } from "@/lib/validation";
import { rateLimit } from "@/lib/rate-limit";
import { apiError, apiSuccess, apiPaginated, unauthorized, serverError } from "@/lib/errors";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20")));
    const skip = (page - 1) * limit;
    const semesterId = searchParams.get("semesterId");

    const user = await getUser();
    const isAdmin = user?.role === "admin";

    const where: Record<string, unknown> = isAdmin ? {} : { published: true };
    if (semesterId) where.semesterId = semesterId;

    const [subjects, total] = await Promise.all([
      prisma.subject.findMany({
        where,
        skip,
        take: limit,
        orderBy: { order: "asc" },
        include: {
          semester: { select: { id: true, title: true, slug: true } },
          _count: { select: { topics: true } },
        },
      }),
      prisma.subject.count({ where }),
    ]);

    return apiPaginated(subjects, { page, limit, total, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    console.error("Error fetching subjects:", error);
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
    const parsed = subjectSchema.safeParse(body);
    if (!parsed.success) return apiError(parsed.error.issues[0].message);

    const { name, slug, description, icon, image, semesterId, order, published } = parsed.data;

    const semester = await prisma.semester.findUnique({ where: { id: semesterId } });
    if (!semester) return apiError("Semester not found");

    const existing = await prisma.subject.findFirst({ where: { slug, semesterId } });
    if (existing) return apiError("A subject with this slug already exists in this semester", 409);

    const subject = await prisma.subject.create({
      data: { name, slug, description, icon, image, semesterId, order: order ?? 0, published: published ?? true },
    });

    return apiSuccess(subject, 201);
  } catch (error) {
    console.error("Error creating subject:", error);
    return serverError();
  }
}
