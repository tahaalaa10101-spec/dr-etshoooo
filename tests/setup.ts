// Set test environment variables
process.env.JWT_SECRET = "test-secret-key-for-testing-only-32chars!!";
Object.defineProperty(process.env, "NODE_ENV", { value: "test", writable: true });
process.env.DATABASE_URL = "file:./test.db";
