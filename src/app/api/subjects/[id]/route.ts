import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";
import { subjectSchema } from "@/lib/validation";
import { apiError, apiSuccess, unauthorized, notFound, serverError } from "@/lib/errors";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const subject = await prisma.subject.findFirst({
      where: { OR: [{ id }, { slug: id }] },
      include: {
        semester: { select: { id: true, title: true, slug: true, academicYear: true } },
        topics: {
          where: { published: true },
          orderBy: { order: "asc" },
          include: {
            _count: {
              select: { lectures: true, mcqs: true, notes: true, clinicalCases: true },
            },
          },
        },
      },
    });
    if (!subject) return notFound("Subject not found");
    return apiSuccess(subject);
  } catch (error) {
    console.error("Error fetching subject:", error);
    return serverError();
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getUser();
    if (!user || user.role !== "admin") return unauthorized();

    const { id } = await params;
    const body = await request.json();
    const parsed = subjectSchema.partial().safeParse(body);
    if (!parsed.success) return apiError(parsed.error.issues[0].message);

    const existing = await prisma.subject.findUnique({ where: { id } });
    if (!existing) return notFound("Subject not found");

    const subject = await prisma.subject.update({ where: { id }, data: parsed.data });
    return apiSuccess(subject);
  } catch (error) {
    console.error("Error updating subject:", error);
    return serverError();
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getUser();
    if (!user || user.role !== "admin") return unauthorized();

    const { id } = await params;
    const existing = await prisma.subject.findUnique({ where: { id } });
    if (!existing) return notFound("Subject not found");

    await prisma.subject.delete({ where: { id } });
    return apiSuccess({ message: "Subject deleted" });
  } catch (error) {
    console.error("Error deleting subject:", error);
    return serverError();
  }
}
