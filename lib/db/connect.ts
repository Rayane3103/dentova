import mongoose from "mongoose";

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  var mongooseCache: MongooseCache | undefined;
}

const cached = globalThis.mongooseCache ?? { conn: null, promise: null };

if (!globalThis.mongooseCache) {
  globalThis.mongooseCache = cached;
}

export async function connectToDatabase() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI is not configured.");
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(uri, {
      bufferCommands: false
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export function hasDatabaseConfig() {
  return Boolean(process.env.MONGODB_URI);
}
