# Acharya Khurana — Production Bug Fix + Admin JWT Authentication
Final Report

---

## 1. ROOT CAUSE

Two compounding issues, both confirmed directly in the source (not guessed):

1. **Firestore transport**: `src/firebase.ts` initialized Firestore with plain
   `getFirestore(app)` — the default bidirectional streaming (WebChannel)
   transport, with no offline/IndexedDB persistence configured. Many mobile
   carrier networks and some Android Chrome network stacks silently break
   that streaming handshake even while normal HTTPS traffic works fine. When
   that handshake fails, the Firestore Web SDK marks its internal
   connectivity state "offline" and throws exactly
   `Failed to get document because the client is offline` — this is a known
   Firestore Web SDK behavior, **not** an indication the device itself is
   offline.
2. **No resilience around that single request**: `loadAuthoritativeCMSData()`
   in `src/utils.ts` made exactly one `getDoc()` call with no retry, no
   timeout handling, and no error classification. Any thrown error —
   transient or permanent — was passed to `App.tsx` and rendered as the
   generic "Unable to load site content" message. The existing Retry button
   called `window.location.reload()`, a full page reload, not a genuine new
   request.

Net effect: a single transient Firestore streaming hiccup (common on mobile
data) became a permanent, unrecoverable-looking error for the visitor.

## 2. EXACT FILE RESPONSIBLE

```
src/firebase.ts        → Firestore initialization (no long-polling fallback, no persistence)
src/utils.ts            loadAuthoritativeCMSData()  (no retry, no error classification)
src/App.tsx              CMS-load effect + error UI  (no classification, fake "Retry")
```

## 3. EXACT PROBLEM

- `getFirestore(app)` never falls back to long-polling when streaming fails,
  and has no local cache to smooth over a reconnect.
- `loadAuthoritativeCMSData()` treated every failure identically and let it
  propagate raw to the UI on the first attempt.
- The Retry button reloaded the whole page instead of re-running the load,
  which also meant `navigator.onLine`/actual connectivity was never
  re-checked mid-session.

## 4. FILES MODIFIED

```
src/firebase.ts                 — Firestore init: long-polling auto-detect + persistent cache
src/utils.ts                    — CMSLoadError classification + bounded exponential-backoff retry
src/App.tsx                     — classified error UI, real retry (no reload), 'online' recovery listener
server.ts                       — JWT issuance, requireAdminAuth middleware, logout route, rate limiting
src/components/AdminPanel.tsx   — logout now clears the real server-side session, not just UI state
.env.example                    — documents JWT_SECRET (server-only) requirement
package.json / package-lock.json — added jsonwebtoken, cookie-parser, express-rate-limit (+ @types)
```

No UI, colors, fonts, layout, navigation, branding, or page content were
changed. No Firestore security rules were touched or weakened.

## 5. FIREBASE FIX

- **Configuration**: `src/firebase.ts` now calls `initializeFirestore(app, {
  localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }),
  experimentalAutoDetectLongPolling: true })`. This lets the SDK detect when
  a network path can't sustain streaming and fall back to long-polling
  automatically — the documented fix for this exact "client is offline on
  mobile networks" class of issue. Falls back to `getFirestore(app)` if
  Firestore was already initialized for the app instance (e.g. Vite HMR),
  so it can't crash the app.
- **Connectivity vs. real failure**: `loadAuthoritativeCMSData()` no longer
  equates a failed request with "offline." It reads the Firestore error's
  `.code` and classifies it into: `unavailable`, `deadline-exceeded`,
  `internal`, `unknown` (all **retryable**), vs. `permission-denied`,
  `unauthenticated`, `not-found`, `failed-precondition`, `invalid-argument`,
  `resource-exhausted` (all **non-retryable**, surfaced immediately as a
  real, specific error).
- **Retry logic**: retryable failures get up to 3 automatic retries with
  exponential backoff (0.8s / 1.6s / 3.2s) before surfacing an error at all.
  This is bounded — never infinite — and does not reload the page.
- **navigator.onLine**: only used as a recovery *signal* (an `online` event
  listener in `App.tsx` triggers a fresh, real `loadAuthoritativeCMSData()`
  call when the browser regains connectivity) — never as the definitive
  check for whether the backend is reachable, per the task's rule 7.
- **Persistence/IndexedDB**: `persistentLocalCache` with
  `persistentMultipleTabManager` was added (none existed before). This was
  additive, not a removal — no existing persistence config was disabled.

## 6. SERVICE WORKER

No service worker, `sw.js`, Workbox, or PWA plugin exists anywhere in the
repository (`src/`, `public/`, `vite.config.ts`, `index.html` were all
searched). **A service worker is not responsible for this issue.** No
cache-invalidation work was needed or performed here.

## 7. API / HTTPS / CORS

- Checked `vercel.json`: routes `/api/*` to `server.ts`, everything else to
  the SPA — correctly configured, not the cause.
- Checked for `localhost`/`http://` endpoints hard-coded in production
  frontend code: none found in the CMS-loading path.
- CORS: the app is same-origin (frontend and `/api/*` are served from the
  same Vercel deployment), so no cross-origin Firebase/API calls are in play
  for the CMS load path — this was not the cause.
- HTTPS/DNS: not implicated by the code; `acharyakhurana.com` serves over
  HTTPS via Vercel by default. No DNS changes were made (per the
  "do not change DNS blindly" rule).

## 8. JWT IMPLEMENTATION

JWT **was required** — the existing `/api/auth/admin-login-request` +
`/api/auth/admin-login-verify` OTP flow validated an email+OTP pair against
a server-side allowlist but issued **no credential at all**, and all 22
`/api/admin/*` Express routes had **zero server-side authorization check**.
Any client that knew a URL could call them directly regardless of frontend
login state. This is a real backend gap, not JWT added for its own sake —
and it is layered only on top of these admin/CMS API routes; Firebase
Auth/Firestore (used by the public site) were not touched or duplicated.

- **Login flow**: unchanged OTP verification; on success, the server now
  signs a JWT (`{ sub: email, role: 'admin' }`) and sets it as the session.
- **Signing**: `jsonwebtoken`, `HS256` (default), secret from
  `process.env.JWT_SECRET` only.
- **Expiration**: 2 hours (`expiresIn: '2h'`), matched by the cookie's
  `maxAge`. No refresh-token complexity was added since none was required.
- **Cookie configuration**: `HttpOnly; Secure; SameSite=Lax`, `path: '/'`.
  Never `SameSite=None` (not needed — no cross-site embedding). Token is
  never exposed to frontend JavaScript.
- **Server-side verification**: `requireAdminAuth` middleware, mounted as
  `app.use('/api/admin', requireAdminAuth)` before all 22 admin routes, runs
  on *every* request — verifies signature, expiration, and `role` claim
  independently each time. Nothing from `localStorage`, React state, or the
  URL is ever trusted for authorization.
- **Role authorization**: only `role === 'admin'` passes; anything else →
  `403`.
- **Error handling**: missing/invalid/expired/tampered token → `401`; valid
  token with insufficient role → `403`. Verified live (see §10).
- **CSRF**: cookie is `SameSite=Lax`, which is Express/browser-native
  protection against cross-site state-changing requests (POST/PUT/DELETE)
  without inventing a custom token scheme — appropriate here since there's
  no legitimate cross-site use case for these admin endpoints.
- **Rate limiting**: `express-rate-limit` (10 requests / 15 min per IP)
  applied to all six auth-adjacent endpoints (`/api/auth/register`,
  `/admin-login-request`, `/admin-login-verify`, `/login-request`,
  `/login-verify`, `/reset-password`). Verified live — 11th attempt within
  the window returns `429`.
- **Logout**: `POST /api/auth/admin-logout` clears the cookie server-side.
  `AdminPanel.tsx`'s sign-out button now calls this endpoint before clearing
  its own local `isAuthenticated` state — previously it only did the latter,
  leaving the (nonexistent, pre-fix) session untouched.
- **Missing-secret fail-safe**: if `JWT_SECRET` isn't set, both token
  issuance and `requireAdminAuth` fail closed with `500`s — never fail open
  and never issue/accept an unverifiable token. Verified live.

## 9. SECRETS

- `JWT_SECRET` exists **only** as a server-side environment variable (never
  `VITE_JWT_SECRET`/`NEXT_PUBLIC_...`, never hard-coded, never sent to the
  client). Documented in `.env.example` as a placeholder only.
- No new private keys, API keys, or credentials were introduced or
  committed by this work.
- **Pre-existing issue found and flagged (not introduced by this task)**:
  `.env` is currently tracked in git (`git ls-files` includes it) despite
  `.gitignore` excluding `.env*` — it contains the `VITE_FIREBASE_*` client
  config values. These are Firebase's public web config (protected by
  Firestore security rules + Firebase Console's authorized-domains list,
  not meant to be secret), but committing it is still bad practice and
  should be cleaned up: run `git rm --cached .env`, keep it gitignored, and
  as a precaution rotate/regenerate the Firebase web API key from the
  Firebase Console and restrict it to the production domain. I did not
  rewrite git history or change what's committed — that's a decision for
  you to make deliberately given it affects your commit history.

## 10. TEST RESULTS

**Performed, in this environment, against a real running instance of the
modified server (`tsx server.ts`) and a real `vite build` — not simulated:**

| # | Test | Result |
|---|------|--------|
| 1 | `npx tsc --noEmit` | Passes (only a pre-existing, unrelated `ImportMeta.env` typing warning that exists identically on the unmodified `main` branch — confirmed via `git stash` diff) |
| 2 | `npx vite build` (production frontend build) | ✅ Succeeds, no new errors |
| 3 | `esbuild server.ts --bundle` (production server build) | ✅ Succeeds |
| 4 | `GET /api/admin/crm-summary`, no cookie | ✅ `401` |
| 5 | `GET /api/admin/crm-summary`, malformed/garbage token | ✅ `401` |
| 6 | `GET /api/admin/crm-summary`, token signed with wrong secret (tampered) | ✅ `401` |
| 7 | `GET /api/admin/crm-summary`, expired token | ✅ `401` |
| 8 | `GET /api/admin/crm-summary`, valid admin token | ✅ `200` |
| 9 | `GET /api/admin/crm-summary`, valid token but `role: 'user'` | ✅ `403` |
| 10 | `POST /api/auth/admin-logout` | ✅ Clears cookie (`Set-Cookie` with epoch expiry) + `{success:true}` |
| 11 | Missing `JWT_SECRET`, no cookie | ✅ `500` (fails safe/closed, never open) |
| 12 | Missing `JWT_SECRET`, even with a previously-valid token | ✅ `500` (never `200`) |
| 13 | `POST /api/auth/admin-login-request` × 12 in a row | ✅ Attempts 1–10 → `400` (expected OTP-flow response for this test setup), attempts 11–12 → `429` (rate limit engaged exactly as configured) |

**Not performed / explicitly not claimed:**
- Physical Android 5G/LTE device testing was **not available in this
  environment**. The Firestore long-polling fallback + retry/backoff logic
  is a directly-applicable, documented fix for this class of issue, but I
  cannot claim to have reproduced the original mobile-network failure or
  confirmed the fix against a real carrier network.
- I did not deploy to Vercel or test against the live
  `acharyakhurana.com` production environment — only local build/typecheck
  and a local `server.ts` instance.
- I did not test the Firestore read path end-to-end against your real
  `cms/main` document (this sandbox has no network access to
  `firestore.googleapis.com`), only the code paths, error classification,
  and build.
- Desktop/Android Chrome browser matrix, Wi-Fi↔mobile-data handoff, and
  cleared-site-data/incognito scenarios were not run — they require a real
  browser + real network, neither of which this environment provides.

---

### What you need to do to finish deployment

1. Set `JWT_SECRET` in **Vercel's server environment variables** (not
   `.env`, not a `VITE_`/`NEXT_PUBLIC_` var) — generate one with
   `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`.
2. Apply the attached patch (or copy the modified files) to your repo,
   `npm install` (adds `jsonwebtoken`, `cookie-parser`, `express-rate-limit`),
   and deploy.
3. Decide on the `.env` git-history cleanup noted in §9 — I flagged it but
   deliberately didn't rewrite your history without you asking for that.
4. Do the physical Android 5G/LTE retest once deployed, since that's the
   one thing I structurally cannot verify from here.
