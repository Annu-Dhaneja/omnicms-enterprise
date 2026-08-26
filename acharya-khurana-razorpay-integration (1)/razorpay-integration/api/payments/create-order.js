// api/payments/create-order.js
//
// POST /api/payments/create-order
// Body: { productOrServiceId, quantity, couponCode? }
//
// The frontend NEVER sends an amount. Every rupee figure here is
// computed from the trusted catalog + coupon lookups, not from the client.

const crypto = require('crypto');
const { connectDb } = require('../../lib/db');
const { razorpay } = require('../../lib/razorpay');
const { getAuthenticatedUser } = require('../../lib/auth');
const { getProductOrService, validateCoupon, calculateTaxAndFees } = require('../../lib/pricing');
const Order = require('../../models/Order');
const { rateLimit, clientKey } = require('../../lib/rateLimit');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const limit = rateLimit({ key: `create-order:${clientKey(req)}`, max: 10, windowMs: 60_000 });
  if (!limit.allowed) {
    return res.status(429).json({ error: 'Too many requests. Please wait a moment and try again.' });
  }

  let user;
  try {
    user = await getAuthenticatedUser(req);
  } catch (err) {
    console.error('[create-order] auth error:', err.message);
    return res.status(500).json({ error: 'Server misconfiguration.' });
  }
  if (!user) {
    return res.status(401).json({ error: 'You must be signed in to make a payment.' });
  }

  const { productOrServiceId, quantity, couponCode } = req.body || {};

  if (!productOrServiceId || typeof productOrServiceId !== 'string') {
    return res.status(400).json({ error: 'productOrServiceId is required.' });
  }
  const qty = Number(quantity);
  if (!Number.isInteger(qty) || qty < 1 || qty > 50) {
    return res.status(400).json({ error: 'Invalid quantity.' });
  }
  if (couponCode !== undefined && couponCode !== null && typeof couponCode !== 'string') {
    return res.status(400).json({ error: 'Invalid coupon code.' });
  }

  try {
    await connectDb();

    // 1. Validate product/service against the real catalog.
    const product = await getProductOrService(productOrServiceId);
    if (!product) {
      return res.status(404).json({ error: 'Product or service not found.' });
    }

    // 2. Compute subtotal server-side. Never trust a client-supplied price.
    const subtotal = Math.round(product.unitPrice * qty);
    if (subtotal <= 0) {
      return res.status(400).json({ error: 'Invalid order amount.' });
    }

    // 3. Validate and apply coupon server-side.
    const couponResult = await validateCoupon(couponCode, { productOrServiceId, subtotal });
    if (!couponResult.valid) {
      return res.status(400).json({ error: 'Invalid or expired coupon.' });
    }
    const discount = Math.max(0, Math.min(couponResult.discount || 0, subtotal));

    // 4. Tax/fees.
    const taxAndFees = calculateTaxAndFees({ subtotal, discount });

    // 5. Final amount — clamp to prevent any negative/zero manipulation.
    const finalAmount = Math.max(0, subtotal - discount + taxAndFees);
    if (finalAmount <= 0) {
      return res.status(400).json({ error: 'Invalid final amount.' });
    }

    // 6. Create our own permanent, pending order record first, with a
    //    unique internal ID, so we have an audit trail even if Razorpay's
    //    API call fails.
    const internalOrderId = `AK-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;

    const orderDoc = await Order.create({
      internalOrderId,
      userId: user.id,
      productOrServiceId: product.id,
      productOrServiceName: product.name,
      quantity: qty,
      subtotal,
      discount,
      taxAndFees,
      finalAmount,
      currency: 'INR',
      couponCode: couponCode || null,
      status: 'pending',
    });

    // 7. Create the Razorpay order. Amount must be in paise (smallest unit).
    let rpOrder;
    try {
      rpOrder = await razorpay.orders.create({
        amount: Math.round(finalAmount * 100),
        currency: 'INR',
        receipt: internalOrderId,
        notes: {
          internalOrderId,
          userId: String(user.id),
          productOrServiceId: product.id,
        },
      });
    } catch (rpErr) {
      console.error('[create-order] Razorpay order creation failed:', rpErr.message);
      orderDoc.status = 'failed';
      await orderDoc.save();
      return res.status(502).json({ error: 'Payment gateway error. Please try again.' });
    }

    orderDoc.razorpayOrderId = rpOrder.id;
    orderDoc.status = 'processing';
    await orderDoc.save();

    // 8. Return only what the frontend needs to open Checkout.
    //    Never return razorpay key_secret — it isn't in this payload at all.
    return res.status(200).json({
      internalOrderId,
      razorpayOrderId: rpOrder.id,
      amount: rpOrder.amount, // paise, echoed from Razorpay
      currency: rpOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      productName: product.name,
      summary: { subtotal, discount, taxAndFees, finalAmount },
    });
  } catch (err) {
    console.error('[create-order] unexpected error:', err);
    return res.status(500).json({ error: 'Something went wrong creating your order.' });
  }
};
