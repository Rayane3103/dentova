import { loadEnvConfig } from "@next/env";
import { hashPassword } from "@/lib/auth/password";
import { connectToDatabase } from "@/lib/db/connect";
import { AdminUser } from "@/models/AdminUser";

loadEnvConfig(process.cwd());

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME || "Dentova Admin";

  if (!email || !password) {
    throw new Error("Set ADMIN_EMAIL and ADMIN_PASSWORD before running seed:admin.");
  }

  await connectToDatabase();
  const passwordHash = await hashPassword(password);

  await AdminUser.findOneAndUpdate(
    { email: email.toLowerCase() },
    {
      email: email.toLowerCase(),
      name,
      passwordHash,
      role: "admin"
    },
    { new: true, upsert: true }
  );

  console.log(`Seeded admin account for ${email}.`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
