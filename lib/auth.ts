import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

function createAuth() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error("MONGODB_URI must be set to connect Better Auth to MongoDB.");
  }
  const secret = process.env.BETTER_AUTH_SECRET;
  if (!secret) {
    throw new Error("BETTER_AUTH_SECRET must be set to initialize Better Auth.");
  }

  const globalForMongo = globalThis as typeof globalThis & {
    mongoClient?: MongoClient;
  };
  const mongoClient =
    globalForMongo.mongoClient ?? new MongoClient(mongoUri);
  globalForMongo.mongoClient = mongoClient;

  const googleClientId = process.env.GOOGLE_CLIENT_ID;
  const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (Boolean(googleClientId) !== Boolean(googleClientSecret)) {
    throw new Error(
      "Set both GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to enable Google sign-in.",
    );
  }

  const githubClientId = process.env.GITHUB_CLIENT_ID;
  const githubClientSecret = process.env.GITHUB_CLIENT_SECRET;
  if (Boolean(githubClientId) !== Boolean(githubClientSecret)) {
    throw new Error(
      "Set both GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET to enable GitHub sign-in.",
    );
  }

  const socialProviders = {
    ...(googleClientId && googleClientSecret
      ? {
          google: {
            clientId: googleClientId,
            clientSecret: googleClientSecret,
          },
        }
      : {}),
    ...(githubClientId && githubClientSecret
      ? {
          github: {
            clientId: githubClientId,
            clientSecret: githubClientSecret,
          },
        }
      : {}),
  };

  const baseURL =
    process.env.BETTER_AUTH_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000");
  const trustedOrigins = [
    baseURL,
    process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`,
    process.env.VERCEL_PROJECT_PRODUCTION_URL &&
      `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`,
    process.env.VERCEL_BRANCH_URL &&
      `https://${process.env.VERCEL_BRANCH_URL}`,
  ]
    .filter((origin): origin is string => Boolean(origin))
    .map((origin) => new URL(origin).origin);

  return betterAuth({
    baseURL,
    secret,
    trustedOrigins: [...new Set(trustedOrigins)],
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
