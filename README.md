# reMarketplace — remarketplace.store

Pre-built fintech & Web3 infrastructure catalog. Node.js/Express, deployable to Vercel.

**Features:** full-width responsive layout · light/dark toggle (remembers choice, follows OS) · catalog with search, category filter and sort · product drawer with sandbox credentials · 5-step demo booking · FAQ · **Sign in with reID** (`fpreid-connect-sdk`, OAuth2 + PKCE) with AES-256-GCM encrypted-cookie sessions.

## Structure
```
public/        static site (index.html, css/, js/, img/)  — catalog content lives in public/js/data.js
lib/app.js     Express app: reID auth, /api/me, /api/bookings
lib/session.js encrypted-cookie sessions (stateless, serverless-safe)
api/index.js   Vercel function entry (all /api/* rewritten here)
server.js      local entry
```

## Run locally
```sh
cp .env.example .env   # fill REID_CLIENT_ID + SESSION_SECRET
npm install && npm run dev   # http://localhost:3000
```
For local sign-in, register `http://localhost:3000/api/auth/reid/callback` with reID and set `REID_REDIRECT_URI` to it.

## Routes
| Route | Purpose |
|---|---|
| `GET /api/auth/reid/start` | PKCE + state cookies, redirect to reID consent |
| `GET /api/auth/reid/callback` | Verify state, exchange code, set session → `/?signedIn=1` |
| `POST /api/auth/logout` | Clear session |
| `GET /api/me` | `{ user, reidEnabled }` |
| `POST /api/bookings` | Validate + log booking; forwards to `BOOKING_WEBHOOK_URL` if set |

## Deploy to Vercel
1. Import this repo as a new Vercel project (Framework: **Other**; no build command).
2. Set env vars from `.env.example` — `REID_CLIENT_ID`, `SESSION_SECRET` (`openssl rand -base64 48`), `APP_PUBLIC_URL`, `REID_REDIRECT_URI`, optionally `REID_CLIENT_SECRET`, `BOOKING_WEBHOOK_URL`.
3. Add domain `remarketplace.store`.
4. Register redirect URI **`https://remarketplace.store/api/auth/reid/callback`** with reID.

Without `REID_CLIENT_ID`/`SESSION_SECRET`, the site works and the sign-in button shows "not configured yet".
