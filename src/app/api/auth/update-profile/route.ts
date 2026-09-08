import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";
import { apiError, apiSuccess, unauthorized, serverError } from "@/lib/errors";
import bcrypt from "bcryptjs";
import { z } from "zod";

const updateProfileSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  currentPassword: z.string().min(8).optional(),
  newPassword: z.string().min(8).max(128)
    .regex(/[A-Z]/, "Must contain uppercase")
    .regex(/[a-z]/, "Must contain lowercase")
    .regex(/[0-9]/, "Must contain number")
    .optional(),
});

export async function PUT(request: NextRequest) {
  try {
    const user = await getUser();
    if (!user) return unauthorized();

    const body = await request.json();
    const parsed = updateProfileSchema.safeParse(body);
    if (!parsed.success) return apiError(parsed.error.issues[0].message);

    const { name, currentPassword, newPassword } = parsed.data;

    const dbUser = await prisma.user.findUnique({
      where: { id: user.userId },
      select: { id: true, name: true, password: true },
    });
    if (!dbUser) return apiError("User not found", 404);

    const updateData: Record<string, unknown> = {};

    if (name && name !== dbUser.name) {
      updateData.name = name;
    }

    if (newPassword) {
      if (!currentPassword) return apiError("Current password is required to set a new password");
      const valid = await bcrypt.compare(currentPassword, dbUser.password);
      if (!valid) return apiError("Current password is incorrect");
      updateData.password = await bcrypt.hash(newPassword, 12);
    }

    if (Object.keys(updateData).length === 0) {
      return apiError("No changes to update");
    }

    const updated = await prisma.user.update({
      where: { id: user.userId },
      data: updateData,
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });

    return apiSuccess(updated);
  } catch (error) {
    console.error("Error updating profile:", error);
    return serverError();
  }
}
