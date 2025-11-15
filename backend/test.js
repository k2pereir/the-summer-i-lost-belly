import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // Create a new user
  const user = await prisma.user.create({
    data: { name: "Test User", age: 25, gender: "female" }
  });
  console.log("Created user:", user);

  // Fetch all users
  const users = await prisma.user.findMany();
  console.log("All users:", users);
}

main();