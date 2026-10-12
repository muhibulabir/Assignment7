# বাজার দর | BazarDor

> **বাংলাদেশের নিত্যপ্রয়োজনীয় পণ্যের বাজারদর এক নজরে।**
>
> BazarDor is a Bangla-first market dashboard for checking daily prices,
> comparing markets, and following price changes.

| Project | Link |
| --- | --- |
| Live demo | [assignment7-buxecwaq2-scarlet13.vercel.app](https://assignment7-buxecwaq2-scarlet13.vercel.app/) |
| Repository | [muhibulabir/Assignment7](https://github.com/muhibulabir/Assignment7) |

## Technologies

- **Next.js** — App Router and server-rendered pages
- **TypeScript** — typed application code
- **Tailwind CSS** and **DaisyUI** — responsive styling and UI components
- **Better Auth** — email/password and optional Google/GitHub sign-in
- **MongoDB** — user accounts, sessions, and verification data
- **BazarDor API** — product, category, and market price data

## Key features

1. **Bangla-first market dashboard** with responsive navigation and a scrolling
   ticker of current prices.
2. **Daily price overview** highlighting the biggest price increases and
   decreases alongside the full product list.
3. **Product discovery and comparisons** with category browsing, price sorting,
   and market-by-market price details.
4. **Secure accounts and profiles** with email/password authentication,
   optional Google and GitHub OAuth, and profile-name updates.
5. **Helpful responsive experience** with Bengali price formatting, loading and
   error states, notifications, and direct links to product and category pages.

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
