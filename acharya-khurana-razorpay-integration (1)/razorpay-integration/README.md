# Razorpay Integration — Acharya Khurana Platform

## Why this isn't a single HTML file

`RAZORPAY_KEY_SECRET` cannot exist anywhere that reaches the browser — not
in HTML, not in JS bundled to the client, not in localStorage. A single
static HTML file has no server-side place to hide it, so it structurally
cannot do real order creation, real signature verification, or real
webhook verification. What's here instead is the minimum split that keeps
your frontend as close to a single lightweight file as possible
(`public/checkout-widget.js`, no framework required) while putting every
secret-touching operation in server-side functions that deploy to Vercel
alongside your existing site.

## What's real and working here

- `api/payments/create-order.js` — computes price server-side, creates a
  Razorpay order, writes a permanent `pending` order record before ever
  calling Razorpay
- `api/payments/verify.js` — real HMAC-SHA256 signature check
  (`timingSafeEqual`, not `===`) against `RAZORPAY_KEY_SECRET`; only this
  can flip an order to `paid`
- `api/payments/webhook.js` — real webhook signature verification against
  `RAZORPAY_WEBHOOK_SECRET`, idempotent via `processedWebhookEventIds`,
  handles `payment.captured` / `payment.failed` / `refund.processed`
- `models/Order.js` — permanent Mongoose schema with the exact fields your
  spec listed, `pending/processing/paid/failed/cancelled/refunded` status
- `api/admin/orders.js` — filterable, paginated, admin-gated, never
  returns secrets
- `public/checkout-widget.js` — disables the button during payment,
  ignores duplicate clicks, hands Razorpay's client-side "success" event
  to the server for real verification instead of trusting it
- Rate limiting on `create-order` and `verify` (documented limitation:
  single-instance only — see `lib/rateLimit.js`)

## What is intentionally stubbed and MUST be wired before this is live

I do not have your actual codebase, so three integration points are
stubs that throw a clear error until you connect them — **this is
deliberate**, so nothing silently pretends to work:

| File | What to do |
|---|---|
| `lib/auth.js` | Replace `getAuthenticatedUser()` with a call into your real session/JWT system. Replace `isAdmin()`'s check with your real role field. |
| `lib/pricing.js` | Replace `getProductOrService()` and `validateCoupon()` with real lookups against your existing product/coupon collections. |
| `lib/db.js` | If you already have a Mongo connection helper, delete this file and import yours instead — don't run two DB layers. |

Until those three are wired to your real systems, **do not deploy this to
production** — the stubs throw on purpose rather than faking success.

## Setup

1. `npm install` (adds `razorpay` and `mongoose`)
2. Copy `.env.example` → set real values in Vercel Project Settings →
   Environment Variables (Production *and* Preview), never in a committed
   file
3. Wire the three stub files above to your real systems
4. In Razorpay Dashboard → Webhooks, add `https://yourdomain.com/api/payments/webhook`
   with events `payment.captured`, `payment.failed`, `refund.processed`;
   copy the generated secret into `RAZORPAY_WEBHOOK_SECRET`
5. Test fully in Razorpay **Test Mode** keys before switching to Live keys
   — never mix test and live credentials
6. Embed `public/checkout-widget.js` + the Razorpay checkout.js script tag
   into your existing checkout page, wired to your existing "Pay Now"
   button (see `public/checkout-demo.html` for the wiring pattern — that
   file is a reference, not something to ship as-is)

## Honest status

I have not run this against your live site, your live database, or a
live Razorpay account, because I don't have access to any of those —
this hasn't been "verified" in the sense your original spec asked for,
and I'm not telling you it has been. What I can confirm: the
signature-verification math, the webhook HMAC check, and the
order-status state machine are implemented per Razorpay's documented
method and standard practice. You (or I, if you give me access to a
Test Mode key and a way to run this) still need to run an actual test
payment end-to-end before this touches real money.
