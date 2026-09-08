import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const user = await getUser();
    if (user) {
      await prisma.user.update({
        where: { id: user.userId },
        data: { tokenVersion: { increment: 1 } },
      }).catch(() => {});
    }

    const response = NextResponse.json({ success: true, data: { message: "Logged out" } });

    response.cookies.set("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}