import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

function createAuth() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error("MONGODB_URI must be set to connect Better Auth to MongoDB.");
  }

  const globalForMongo = globalThis as typeof globalThis & {
    mongoClient?: MongoClient;
  };
  const mongoClient =
    globalForMongo.mongoClient ?? new MongoClient(mongoUri);
  globalForMongo.mongoClient = mongoClient;

  const socialProviders = {
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? {
          google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          },
        }
      : {}),
    ...(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET
      ? {
          github: {
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
          },
        }
      : {}),
  };

  return betterAuth({
    baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
    secret: process.env.BETTER_AUTH_SECRET,
    database: mongodbAdapter(
      mongoClient.db(process.env.MONGODB_DATABASE ?? "bazardor"),
      { client: mongoClient, transaction: false },
    ),
    emailAndPassword: { enabled: true, autoSignIn: false },
    socialProviders,
  });
}

type Auth = ReturnType<typeof createAuth>;
const globalForAuth = globalThis as typeof globalThis & {
  auth?: Auth;
};

export function getAuth(): Auth {
  globalForAuth.auth ??= createAuth();
  return globalForAuth.auth;
}
