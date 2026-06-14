import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { MarketerUser } from "@/models/MarketerUser";

function getEnvCredentials() {
  const email = process.env.MARKETER_EMAIL?.toLowerCase().trim();
  const password = process.env.MARKETER_PASSWORD;
  const name = process.env.MARKETER_NAME || "Dentova Marketing";

  if (!email || !password) {
    return null;
  }

  return { email, password, name };
}

export async function upsertMarketerFromEnv() {
  const credentials = getEnvCredentials();

  if (!credentials) {
    throw new Error(
      "Set MARKETER_EMAIL and MARKETER_PASSWORD before seeding the marketer account."
    );
  }

  const passwordHash = await hashPassword(credentials.password);

  return MarketerUser.findOneAndUpdate(
    { email: credentials.email },
    {
      email: credentials.email,
      name: credentials.name,
      passwordHash,
      role: "marketer"
    },
    { new: true, upsert: true }
  );
}

export async function authenticateMarketer(email: string, password: string) {
  const normalizedEmail = email.toLowerCase().trim();
  const marketer = await MarketerUser.findOne({ email: normalizedEmail });

  if (marketer && (await verifyPassword(password, marketer.passwordHash))) {
    return marketer;
  }

  // Fallback to env vars (first-time bootstrap)
  const credentials = getEnvCredentials();

  if (
    !credentials ||
    normalizedEmail !== credentials.email ||
    password !== credentials.password
  ) {
    return null;
  }

  return upsertMarketerFromEnv();
}
