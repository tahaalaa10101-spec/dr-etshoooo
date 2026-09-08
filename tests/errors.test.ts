import { apiError, apiSuccess, apiPaginated, unauthorized, forbidden, notFound, conflict, serverError } from "@/lib/errors";

describe("Error Helpers", () => {
  describe("apiError", () => {
    it("should return error response with default status 400", async () => {
      const response = apiError("Something went wrong");
      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body.success).toBe(false);
      expect(body.error).toBe("Something went wrong");
    });

    it("should return error response with custom status", async () => {
      const response = apiError("Not found", 404);
      expect(response.status).toBe(404);
    });
  });

  describe("apiSuccess", () => {
    it("should return success response", async () => {
      const response = apiSuccess({ id: 1, name: "Test" });
      expect(response.status).toBe(200);
      const body = await response.json();
      expect(body.success).toBe(true);
      expect(body.data).toEqual({ id: 1, name: "Test" });
    });

    it("should return success response with custom status", async () => {
      const response = apiSuccess({ id: 1 }, 201);
      expect(response.status).toBe(201);
    });
  });

  describe("apiPaginated", () => {
    it("should return paginated response", async () => {
      const response = apiPaginated(
        [{ id: 1 }, { id: 2 }],
        { page: 1, limit: 10, total: 2, totalPages: 1 }
      );
      expect(response.status).toBe(200);
      const body = await response.json();
      expect(body.success).toBe(true);
      expect(body.data).toHaveLength(2);
      expect(body.pagination).toEqual({ page: 1, limit: 10, total: 2, totalPages: 1 });
    });
  });

  describe("unauthorized", () => {
    it("should return 401", async () => {
      const response = unauthorized();
      expect(response.status).toBe(401);
    });
  });

  describe("forbidden", () => {
    it("should return 403", async () => {
      const response = forbidden();
      expect(response.status).toBe(403);
    });
  });

  describe("notFound", () => {
    it("should return 404", async () => {
      const response = notFound();
      expect(response.status).toBe(404);
    });
  });

  describe("conflict", () => {
    it("should return 409", async () => {
      const response = conflict();
      expect(response.status).toBe(409);
    });
  });

  describe("serverError", () => {
    it("should return 500", async () => {
      const response = serverError();
      expect(response.status).toBe(500);
    });
  });
});
