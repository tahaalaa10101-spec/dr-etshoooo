import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

function getSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("JWT_SECRET environment variable is required in production");
    }
    console.warn("WARNING: Using dev fallback JWT_SECRET. Set JWT_SECRET in production!");
    return new TextEncoder().encode("dr-etshoooo-dev-secret-do-not-use-in-production");
  }
  return new TextEncoder().encode(secret);
}

export interface JWTPayload {
  userId: string;
  email: string;
  name: string;
  role: string;
  tokenVersion: number;
}

export async function signToken(payload: JWTPayload): Promise<string> {
  return new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setIssuer("dr-etshoooo")
    .setExpirationTime("7d")
    .sign(getSecret());
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret(), { issuer: "dr-etshoooo" });
    return payload as unknown as JWTPayload;
  } catch {
    return null;
  }
}

export async function getUser(): Promise<JWTPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;
  const payload = await verifyToken(token);
  if (!payload) return null;
  
  // Verify tokenVersion matches database (token revocation check)
  const { prisma } = await import("@/lib/prisma");
  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: { tokenVersion: true, role: true },
  });
  
  if (!user) return null;
  if (user.tokenVersion !== payload.tokenVersion) return null;
  
  return payload;
}

export function getCookieName(): string {
  return "token";
}