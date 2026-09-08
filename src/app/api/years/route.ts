import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";
import { yearSchema } from "@/lib/validation";
import { rateLimit } from "@/lib/rate-limit";
import { apiError, apiSuccess, apiPaginated, unauthorized, forbidden, serverError } from "@/lib/errors";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20")));
    const skip = (page - 1) * limit;

    const user = await getUser();
    const isAdmin = user?.role === "admin";

    const where: Record<string, unknown> = isAdmin ? {} : { published: true };

    const [years, total] = await Promise.all([
      prisma.academicYear.findMany({
        where,
        skip,
        take: limit,
        orderBy: { order: "asc" },
        include: {
          semesters: {
            where: isAdmin ? {} : { published: true },
            orderBy: { order: "asc" },
            include: {
              subjects: {
                orderBy: { order: "asc" },
                where: { published: true },
                select: { id: true, name: true, slug: true, icon: true, image: true, description: true },
              },
            },
          },
        },
      }),
      prisma.academicYear.count({ where }),
    ]);

    return apiPaginated(years, { page, limit, total, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    console.error("Error fetching years:", error);
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
    const parsed = yearSchema.safeParse(body);
    if (!parsed.success) return apiError(parsed.error.issues[0].message);

    const { title, slug, description, order, published } = parsed.data;

    const existing = await prisma.academicYear.findUnique({ where: { slug } });
    if (existing) return apiError("A year with this slug already exists", 409);

    const year = await prisma.academicYear.create({
      data: { title, slug, description, order: order ?? 0, published: published ?? true },
    });

    return apiSuccess(year, 201);
  } catch (error) {
    console.error("Error creating year:", error);
    return serverError();
  }
}
