// lib/razorpay.js
//
// Server-side Razorpay client. NEVER import this file from anything that
// ships to the browser (no React client components, no plain <script>
// includes of this file). It reads RAZORPAY_KEY_SECRET.

const Razorpay = require('razorpay');

const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } = process.env;

if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
  console.error('[razorpay] RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET are not set.');
}

const razorpay = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_KEY_SECRET,
});

module.exports = { razorpay };
