import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const mcq = await prisma.mcq.findUnique({
      where: { id },
      include: {
        topic: { select: { id: true, name: true } },
      },
    });

    if (!mcq) {
      return NextResponse.json(
        { success: false, error: "MCQ not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: mcq });
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
    const { mcqSchema } = await import("@/lib/validation");
    const body = await request.json();
    const parsed = mcqSchema.partial().safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const existing = await prisma.mcq.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: "MCQ not found" },
        { status: 404 }
      );
    }

    const mcq = await prisma.mcq.update({
      where: { id },
      data: parsed.data,
    });

    return NextResponse.json({ success: true, data: mcq });
  } catch (error) {
    console.error("Error updating MCQ:", error);
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
    await prisma.mcq.delete({ where: { id } });

    return NextResponse.json({ success: true, data: { message: "MCQ deleted" } });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
