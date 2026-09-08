import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const semester = await prisma.semester.findUnique({
      where: { id },
      include: {
        academicYear: { select: { id: true, title: true } },
        subjects: { orderBy: { order: "asc" } },
      },
    });

    if (!semester) {
      return NextResponse.json(
        { success: false, error: "Semester not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: semester });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Admin access required" },
        { status: 403 }
      );
    }

    const { id } = await params;
    const { semesterSchema } = await import("@/lib/validation");
    const body = await request.json();
    const parsed = semesterSchema.partial().safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const existing = await prisma.semester.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Semester not found" },
        { status: 404 }
      );
    }

    const semester = await prisma.semester.update({
      where: { id },
      data: parsed.data,
      include: {
        academicYear: { select: { id: true, title: true } },
      },
    });

    return NextResponse.json({ success: true, data: semester });
  } catch (error) {
    console.error("Error updating semester:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Admin access required" },
        { status: 403 }
      );
    }

    const { id } = await params;
    await prisma.semester.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
