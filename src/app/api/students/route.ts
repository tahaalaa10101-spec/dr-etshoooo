import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";
import { apiError, apiSuccess, apiPaginated, unauthorized, forbidden, serverError } from "@/lib/errors";
import { rateLimit } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  try {
    const user = await getUser();
    if (!user || user.role !== "admin") return unauthorized();

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20")));
    const skip = (page - 1) * limit;
    const search = searchParams.get("search");

    const where: Record<string, unknown> = { role: "student" };
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    const [students, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: { id: true, name: true, email: true, createdAt: true, updatedAt: true },
      }),
      prisma.user.count({ where }),
    ]);

    return apiPaginated(students, { page, limit, total, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    console.error("Error fetching students:", error);
    return serverError();
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getUser();
    if (!user || user.role !== "admin") return unauthorized();

    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const rate = rateLimit(`delete-student:${ip}`, 10, 60000);
    if (!rate.success) return apiError("Rate limit exceeded", 429);

    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get("id");
    if (!studentId) return apiError("Student ID is required");

    const student = await prisma.user.findUnique({ where: { id: studentId } });
    if (!student) return apiError("Student not found", 404);
    if (student.role === "admin") return forbidden("Cannot delete admin users");

    await prisma.user.delete({ where: { id: studentId } });
    return apiSuccess({ message: "Student deleted" });
  } catch (error) {
    console.error("Error deleting student:", error);
    return serverError();
  }
}
