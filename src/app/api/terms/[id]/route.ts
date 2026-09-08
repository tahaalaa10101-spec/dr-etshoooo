import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";
import { apiSuccess, unauthorized, notFound, serverError } from "@/lib/errors";

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getUser();
    if (!user || user.role !== "admin") return unauthorized();

    const { id } = await params;
    const existing = await prisma.medicalTerm.findUnique({ where: { id } });
    if (!existing) return notFound("Term not found");

    await prisma.medicalTerm.delete({ where: { id } });
    return apiSuccess({ message: "Term deleted" });
  } catch (error) {
    console.error("Error deleting term:", error);
    return serverError();
  }
}
