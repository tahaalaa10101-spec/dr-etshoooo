import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";
import { lectureSchema } from "@/lib/validation";
import { apiError, apiSuccess, unauthorized, notFound, serverError } from "@/lib/errors";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const lecture = await prisma.lecture.findFirst({
      where: { OR: [{ id }, { slug: id }] },
      include: {
        topic: {
          select: {
            id: true, name: true, slug: true,
            subject: { select: { id: true, name: true, slug: true } },
          },
        },
      },
    });
    if (!lecture) return notFound("Lecture not found");
    return apiSuccess(lecture);
  } catch (error) {
    console.error("Error fetching lecture:", error);
    return serverError();
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getUser();
    if (!user || user.role !== "admin") return unauthorized();

    const { id } = await params;
    const body = await request.json();
    const parsed = lectureSchema.partial().safeParse(body);
    if (!parsed.success) return apiError(parsed.error.issues[0].message);

    const existing = await prisma.lecture.findUnique({ where: { id } });
    if (!existing) return notFound("Lecture not found");

    const lecture = await prisma.lecture.update({ where: { id }, data: parsed.data });
    return apiSuccess(lecture);
  } catch (error) {
    console.error("Error updating lecture:", error);
    return serverError();
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getUser();
    if (!user || user.role !== "admin") return unauthorized();

    const { id } = await params;
    const existing = await prisma.lecture.findUnique({ where: { id } });
    if (!existing) return notFound("Lecture not found");

    await prisma.lecture.delete({ where: { id } });
    return apiSuccess({ message: "Lecture deleted" });
  } catch (error) {
    console.error("Error deleting lecture:", error);
    return serverError();
  }
}
