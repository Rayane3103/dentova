import { loadEnvConfig } from "@next/env";
import { upsertAdminFromEnv } from "@/lib/auth/admin-user";
import { upsertMarketerFromEnv } from "@/lib/auth/marketer-user";
import { connectToDatabase } from "@/lib/db/connect";

loadEnvConfig(process.cwd());

async function main() {
  const missing = [
    !process.env.MONGODB_URI && "MONGODB_URI",
    !process.env.ADMIN_EMAIL && "ADMIN_EMAIL",
    !process.env.ADMIN_PASSWORD && "ADMIN_PASSWORD"
  ].filter(Boolean);

  if (missing.length > 0) {
    throw new Error(
      `Missing environment variables: ${missing.join(", ")}.\n` +
        "Create a .env.local file in the project root (copy .env.local.example) " +
        "and paste the same values you use on Vercel/Render."
    );
  }

  await connectToDatabase();

  const admin = await upsertAdminFromEnv();
  console.log(`✓ Seeded admin account for ${admin.email}.`);

  // Seed marketer account if env vars are provided
  if (process.env.MARKETER_EMAIL && process.env.MARKETER_PASSWORD) {
    const marketer = await upsertMarketerFromEnv();
    console.log(`✓ Seeded marketer account for ${marketer.email}.`);
  } else {
    console.log(
      "ℹ Marketer account not seeded — set MARKETER_EMAIL and MARKETER_PASSWORD to enable."
    );
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
