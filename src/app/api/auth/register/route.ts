import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signToken } from "@/lib/auth";
import { registerSchema } from "@/lib/validation";
import { rateLimit } from "@/lib/rate-limit";
import { apiError, apiSuccess, conflict, serverError } from "@/lib/errors";

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
    const rateLimitResult = rateLimit(`register:${ip}`, 3, 300000);
    if (!rateLimitResult.success) {
      return apiError("Too many registration attempts. Please try again later.", 429);
    }

    const body = await request.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return apiError(parsed.error.issues[0].message);
    }

    const { name, email, password } = parsed.data;

    const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (existing) {
      return conflict("An account with this email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role: "student",
      },
    });

    const token = await signToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      tokenVersion: 0,
    });

    const response = apiSuccess({
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Register error:", error);
    return serverError();
  }
}
