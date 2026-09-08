import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";
import { topicSchema } from "@/lib/validation";
import { rateLimit } from "@/lib/rate-limit";
import { apiError, apiSuccess, apiPaginated, unauthorized, serverError } from "@/lib/errors";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20")));
    const skip = (page - 1) * limit;
    const subjectId = searchParams.get("subjectId");

    const user = await getUser();
    const isAdmin = user?.role === "admin";

    const where: Record<string, unknown> = isAdmin ? {} : { published: true };
    if (subjectId) where.subjectId = subjectId;

    const [topics, total] = await Promise.all([
      prisma.topic.findMany({
        where,
        skip,
        take: limit,
        orderBy: { order: "asc" },
        include: {
          subject: { select: { id: true, name: true, slug: true } },
          _count: { select: { lectures: true, mcqs: true, notes: true, clinicalCases: true } },
        },
      }),
      prisma.topic.count({ where }),
    ]);

    return apiPaginated(topics, { page, limit, total, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    console.error("Error fetching topics:", error);
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
    const parsed = topicSchema.safeParse(body);
    if (!parsed.success) return apiError(parsed.error.issues[0].message);

    const { name, slug, description, subjectId, order, published } = parsed.data;

    const subject = await prisma.subject.findUnique({ where: { id: subjectId } });
    if (!subject) return apiError("Subject not found");

    const existing = await prisma.topic.findFirst({ where: { slug, subjectId } });
    if (existing) return apiError("A topic with this slug already exists in this subject", 409);

    const topic = await prisma.topic.create({
      data: { name, slug, description, subjectId, order: order ?? 0, published: published ?? true },
    });

    return apiSuccess(topic, 201);
  } catch (error) {
    console.error("Error creating topic:", error);
    return serverError();
  }
}
