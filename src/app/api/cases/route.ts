import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";
import { caseSchema } from "@/lib/validation";
import { rateLimit } from "@/lib/rate-limit";
import { apiError, apiSuccess, apiPaginated, unauthorized, serverError } from "@/lib/errors";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20")));
    const skip = (page - 1) * limit;
    const topicId = searchParams.get("topicId");
    const subjectId = searchParams.get("subjectId");
    const search = searchParams.get("search");

    const where: Record<string, unknown> = { published: true };
    if (topicId) where.topicId = topicId;
    if (subjectId) where.topic = { subjectId };
    if (search) where.title = { contains: search, mode: "insensitive" };

    const [cases, total] = await Promise.all([
      prisma.clinicalCase.findMany({
        where, skip, take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true, title: true, patientInfo: true, symptoms: true, finalDiagnosis: true, topicId: true, published: true,
          createdAt: true, updatedAt: true,
          topic: { select: { id: true, name: true, slug: true, subject: { select: { id: true, name: true } } } },
        },
      }),
      prisma.clinicalCase.count({ where }),
    ]);

    return apiPaginated(cases, { page, limit, total, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    console.error("Error fetching cases:", error);
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
    const parsed = caseSchema.safeParse(body);
    if (!parsed.success) return apiError(parsed.error.issues[0].message);

    const { title, patientInfo, symptoms, signs, investigations, differentialDiag, finalDiagnosis, management, topicId, published } = parsed.data;

    const topic = await prisma.topic.findUnique({ where: { id: topicId } });
    if (!topic) return apiError("Topic not found");

    const clinicalCase = await prisma.clinicalCase.create({
      data: { title, patientInfo, symptoms, signs, investigations, differentialDiag, finalDiagnosis, management, topicId, published: published ?? true },
    });

    return apiSuccess(clinicalCase, 201);
  } catch (error) {
    console.error("Error creating case:", error);
    return serverError();
  }
}
