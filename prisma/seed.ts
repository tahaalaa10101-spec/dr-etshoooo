import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash("admin123", 12);
  await prisma.user.upsert({
    where: { email: "admin@dr-etshoooo.com" },
    update: {},
    create: {
      email: "admin@dr-etshoooo.com",
      name: "Admin",
      password: adminPassword,
      role: "admin",
    },
  });

  const studentPassword = await bcrypt.hash("student123", 12);
  await prisma.user.upsert({
    where: { email: "student@dr-etshoooo.com" },
    update: {},
    create: {
      email: "student@dr-etshoooo.com",
      name: "Medical Student",
      password: studentPassword,
      role: "student",
    },
  });

  console.log("Users seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
