import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { AdminUser } from "@/models/AdminUser";

function getEnvCredentials() {
  const email = process.env.ADMIN_EMAIL?.toLowerCase().trim();
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME || "Dentova Admin";

  if (!email || !password) {
    return null;
  }

  return { email, password, name };
}

export async function upsertAdminFromEnv() {
  const credentials = getEnvCredentials();

  if (!credentials) {
    throw new Error("Set ADMIN_EMAIL and ADMIN_PASSWORD before running seed:admin.");
  }

  const passwordHash = await hashPassword(credentials.password);

  return AdminUser.findOneAndUpdate(
    { email: credentials.email },
    {
      email: credentials.email,
      name: credentials.name,
      passwordHash,
      role: "admin"
    },
    { new: true, upsert: true }
  );
}

export async function authenticateAdmin(email: string, password: string) {
  const normalizedEmail = email.toLowerCase().trim();
  const admin = await AdminUser.findOne({ email: normalizedEmail });

  if (admin && (await verifyPassword(password, admin.passwordHash))) {
    return admin;
  }

  const credentials = getEnvCredentials();

  if (
    !credentials ||
    normalizedEmail !== credentials.email ||
    password !== credentials.password
  ) {
    return null;
  }

  return upsertAdminFromEnv();
}
