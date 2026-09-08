import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";
import { appSchema } from "@/lib/validation";
import { apiError, apiSuccess, unauthorized, notFound, serverError } from "@/lib/errors";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const user = await getUser();
    const isAdmin = user?.role === "admin";

    const where: Record<string, unknown> = isAdmin ? { id } : { id, published: true };
    const app = await prisma.medicalApp.findFirst({ where });
    if (!app) return notFound("App not found");
    return apiSuccess(app);
  } catch (error) {
    console.error("Error fetching app:", error);
    return serverError();
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getUser();
    if (!user || user.role !== "admin") return unauthorized();

    const { id } = await params;
    const body = await request.json();
    const parsed = appSchema.partial().safeParse(body);
    if (!parsed.success) return apiError(parsed.error.issues[0].message);

    const existing = await prisma.medicalApp.findUnique({ where: { id } });
    if (!existing) return notFound("App not found");

    const app = await prisma.medicalApp.update({ where: { id }, data: parsed.data });
    return apiSuccess(app);
  } catch (error) {
    console.error("Error updating app:", error);
    return serverError();
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getUser();
    if (!user || user.role !== "admin") return unauthorized();

    const { id } = await params;
    const existing = await prisma.medicalApp.findUnique({ where: { id } });
    if (!existing) return notFound("App not found");

    await prisma.medicalApp.delete({ where: { id } });
    return apiSuccess({ message: "App deleted" });
  } catch (error) {
    console.error("Error deleting app:", error);
    return serverError();
  }
}
