// api/payments/verify.js
//
// POST /api/payments/verify
// Body: { razorpay_order_id, razorpay_payment_id, razorpay_signature }
//
// This is the ONLY place an order is allowed to become "paid". The
// Razorpay Checkout success callback on the frontend is treated as
// untrusted — it just tells us to come check with the server.

const crypto = require('crypto');
const { connectDb } = require('../../lib/db');
const { getAuthenticatedUser } = require('../../lib/auth');
const Order = require('../../models/Order');
const { rateLimit, clientKey } = require('../../lib/rateLimit');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const limit = rateLimit({ key: `verify:${clientKey(req)}`, max: 20, windowMs: 60_000 });
  if (!limit.allowed) {
    return res.status(429).json({ error: 'Too many requests. Please wait a moment.' });
  }

  let user;
  try {
    user = await getAuthenticatedUser(req);
  } catch (err) {
    console.error('[verify] auth error:', err.message);
    return res.status(500).json({ error: 'Server misconfiguration.' });
  }
  if (!user) {
    return res.status(401).json({ error: 'You must be signed in.' });
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body || {};

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ error: 'Missing payment verification fields.' });
  }

  try {
    await connectDb();

    const order = await Order.findOne({ razorpayOrderId: razorpay_order_id });
    if (!order) {
      return res.status(404).json({ error: 'Order not found.' });
    }

    // Ownership check — a signed-in user can only verify their own order.
    if (String(order.userId) !== String(user.id)) {
      return res.status(403).json({ error: 'Not authorized for this order.' });
    }

    // Idempotency — if it's already paid, don't re-process.
    if (order.status === 'paid') {
      return res.status(200).json({ status: 'paid', internalOrderId: order.internalOrderId });
    }

    // The official Razorpay signature check: HMAC-SHA256 of
    // "order_id|payment_id" using the secret key.
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    const isValid =
      expectedSignature.length === razorpay_signature.length &&
      crypto.timingSafeEqual(Buffer.from(expectedSignature), Buffer.from(razorpay_signature));

    if (!isValid) {
      order.status = 'failed';
      await order.save();
      console.warn(`[verify] signature mismatch for order ${order.internalOrderId}`);
      return res.status(400).json({ error: 'Payment verification failed.', status: 'failed' });
    }

    order.status = 'paid';
    order.razorpayPaymentId = razorpay_payment_id;
    order.razorpaySignature = razorpay_signature;
    await order.save();

    return res.status(200).json({ status: 'paid', internalOrderId: order.internalOrderId });
  } catch (err) {
    console.error('[verify] unexpected error:', err);
    return res.status(500).json({ error: 'Something went wrong verifying your payment.' });
  }
};
