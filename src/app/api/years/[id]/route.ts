import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";
import { yearSchema } from "@/lib/validation";
import { apiError, apiSuccess, unauthorized, notFound, serverError } from "@/lib/errors";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const year = await prisma.academicYear.findUnique({
      where: { id },
      include: {
        semesters: {
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
    });
    if (!year) return notFound("Year not found");
    return apiSuccess(year);
  } catch (error) {
    console.error("Error fetching year:", error);
    return serverError();
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getUser();
    if (!user || user.role !== "admin") return unauthorized();

    const { id } = await params;
    const body = await request.json();
    const parsed = yearSchema.partial().safeParse(body);
    if (!parsed.success) return apiError(parsed.error.issues[0].message);

    const existing = await prisma.academicYear.findUnique({ where: { id } });
    if (!existing) return notFound("Year not found");

    const year = await prisma.academicYear.update({ where: { id }, data: parsed.data });
    return apiSuccess(year);
  } catch (error) {
    console.error("Error updating year:", error);
    return serverError();
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getUser();
    if (!user || user.role !== "admin") return unauthorized();

    const { id } = await params;
    const existing = await prisma.academicYear.findUnique({ where: { id } });
    if (!existing) return notFound("Year not found");

    await prisma.academicYear.delete({ where: { id } });
    return apiSuccess({ message: "Year deleted" });
  } catch (error) {
    console.error("Error deleting year:", error);
    return serverError();
  }
}
