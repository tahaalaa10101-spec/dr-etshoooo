import { signToken, verifyToken, JWTPayload } from "@/lib/auth";

describe("Authentication", () => {
  const testPayload: JWTPayload = {
    userId: "test-user-id",
    email: "test@example.com",
    name: "Test User",
    role: "student",
    tokenVersion: 0,
  };

  describe("signToken", () => {
    it("should return a string token", async () => {
      const token = await signToken(testPayload);
      expect(typeof token).toBe("string");
      expect(token.length).toBeGreaterThan(0);
    });

    it("should create a valid JWT format", async () => {
      const token = await signToken(testPayload);
      const parts = token.split(".");
      expect(parts).toHaveLength(3);
    });
  });

  describe("verifyToken", () => {
    it("should verify a valid token", async () => {
      const token = await signToken(testPayload);
      const payload = await verifyToken(token);
      expect(payload).not.toBeNull();
      expect(payload?.userId).toBe(testPayload.userId);
      expect(payload?.email).toBe(testPayload.email);
      expect(payload?.role).toBe(testPayload.role);
      expect(payload?.tokenVersion).toBe(testPayload.tokenVersion);
    });

    it("should reject an invalid token", async () => {
      const payload = await verifyToken("invalid.token.here");
      expect(payload).toBeNull();
    });

    it("should reject a token with wrong issuer", async () => {
      const { SignJWT } = await import("jose");
      const token = await new SignJWT(testPayload as unknown as Record<string, unknown>)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuer("wrong-issuer")
        .sign(new TextEncoder().encode("test-secret-key-for-testing-only-32chars!!"));
      const payload = await verifyToken(token);
      expect(payload).toBeNull();
    });
  });

  describe("JWTPayload", () => {
    it("should include required fields", async () => {
      const token = await signToken(testPayload);
      const payload = await verifyToken(token);
      expect(payload).toHaveProperty("userId");
      expect(payload).toHaveProperty("email");
      expect(payload).toHaveProperty("name");
      expect(payload).toHaveProperty("role");
      expect(payload).toHaveProperty("tokenVersion");
    });
  });
});
