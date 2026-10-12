# বাজার দর (BazarDor)

**বাংলাদেশের নিত্যপ্রয়োজনীয় পণ্যের বাজারদর এক নজরে।** BazarDor brings daily product prices, market-to-market comparisons, and price movements together in a responsive Bangla-first experience.

- **Live demo:** `https://your-live-domain.example`
- **Repository:** `https://github.com/your-username/bazardor`

## Tech stack

- Next.js App Router and TypeScript
- Tailwind CSS and DaisyUI
- Better Auth with email/password, Google, and GitHub providers
- MongoDB storage for Better Auth accounts and sessions
- react-hot-toast notifications
- BazarDor products and categories API

## Key features

1. Bangla-first responsive navigation, live date, and a pause-on-hover scrolling price ticker.
2. Market overview with the six largest price risers, six largest fallers, and all listed products.
3. Numeric price sorting, Bengali digit formatting, category browsing, and product price comparisons by market.
4. Authenticated product details and profile pages, including profile-name updates.
5. Email/password registration and sign-in, plus optional Google and GitHub OAuth.
6. Loading skeletons, empty category states, toast feedback, and a custom not-found page.
7. Primary API requests and dynamic App Router routes that work on direct navigation and refresh.

## Local setup

**Requirements:** Node.js 20.9 or newer and npm.

1. Install dependencies:

   ```powershell
   npm install
   ```

2. Create a local environment file:

   ```powershell
   Copy-Item .env.example .env.local
   ```

3. Set a unique `BETTER_AUTH_SECRET` (at least 32 characters) and confirm `BETTER_AUTH_URL=http://localhost:3000`. You can generate a secret with:

   ```powershell
   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
   ```

   Set `MONGODB_URI` to your MongoDB connection string and `MONGODB_DATABASE` to the database name. The example URI connects to a local MongoDB server; for MongoDB Atlas, use the connection string from your Atlas cluster and allow your app's IP in the Atlas network access settings. Better Auth creates the required collections and indexes automatically; no database migration command is needed. Transactions are disabled so the adapter also works with a standalone local MongoDB server.

4. For Google and GitHub sign-in, create OAuth apps with the callback URLs below, then add their client IDs and secrets to `.env.local`. These providers remain optional; email/password auth works without them.

   - Google: `http://localhost:3000/api/auth/callback/google`
   - GitHub: `http://localhost:3000/api/auth/callback/github`

   For another host, replace `http://localhost:3000` with the exact value of `BETTER_AUTH_URL` and register the resulting callback URLs with each OAuth provider.

5. Start the development server:

   ```powershell
   npm run dev
   ```

   Visit [http://localhost:3000](http://localhost:3000).

## Build and run

```powershell
npm run build
npm run start
```

Run `npm run lint` and `npm run typecheck` to check the source before building.

Set `BETTER_AUTH_URL`, a strong `BETTER_AUTH_SECRET`, `MONGODB_URI`, and `MONGODB_DATABASE` for the host running the production server. Configure `BAZARDOR_API_URL` to override the default API endpoint.

## Deploying to Vercel

In **Project → Settings → Environment Variables**, set these values for the
Production environment (and Preview too if you use preview deployments):

| Variable | Value |
| --- | --- |
| `MONGODB_URI` | MongoDB Atlas connection string using a database user |
| `MONGODB_DATABASE` | `bazardor` |
| `BETTER_AUTH_SECRET` | A unique random secret of at least 32 characters |
| `BETTER_AUTH_URL` | The exact public production origin, for example `https://your-project.vercel.app` |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google OAuth credentials, if Google sign-in is enabled |
| `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` | GitHub OAuth credentials, if GitHub sign-in is enabled |

Do not commit these values or expose them in browser-side variables. In MongoDB
Atlas, allow the Vercel deployment to reach the cluster under **Network Access**.
After changing environment variables, redeploy so the new deployment receives
them.

Register these exact callback URLs with the OAuth providers, replacing the
example host with the same origin configured as `BETTER_AUTH_URL`:

- Google: `https://your-project.vercel.app/api/auth/callback/google`
- GitHub: `https://your-project.vercel.app/api/auth/callback/github`

For local development, register the corresponding `http://localhost:3000`
callback URLs as well if the provider allows multiple redirect URIs.

## API response shape

Product and category list endpoints return JSON arrays. Product entries include IDs, slugs, Bangla names, category details, unit, current and historical prices, change direction/percentage, and per-market minimum/maximum prices. Individual product and category endpoints return one object. The API types are in `types/bazardor.ts`; requests use the configured primary URL.

Successful API responses are cached for five minutes to reduce upstream traffic. If the endpoint is unavailable, the shared layout shows a market-data warning and data-dependent pages offer a retry instead of taking down unrelated routes.
