// api/payments/webhook.js
//
// POST /api/payments/webhook
// Configure this exact URL in Razorpay Dashboard → Settings → Webhooks,
// with events: payment.captured, payment.failed, refund.processed.
// Set RAZORPAY_WEBHOOK_SECRET to the "Webhook Secret" shown there
// (this is DIFFERENT from RAZORPAY_KEY_SECRET).
//
// Webhooks are the reliable source of truth for status sync — a user
// closing their browser tab mid-payment should not leave an order stuck
// forever; the webhook fixes that even if /api/payments/verify never runs.

const crypto = require('crypto');
const { connectDb } = require('../../lib/db');
const Order = require('../../models/Order');

// Vercel-specific: we need the raw, unparsed body to compute the HMAC
// correctly, so disable the default JSON body parser for this route.
module.exports.config = {
  api: {
    bodyParser: false,
  },
};

function readRawBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => (data += chunk));
    req.on('end', () => resolve(data));
    req.on('error', reject);
  });
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end();
  }

  const signatureHeader = req.headers['x-razorpay-signature'];
  if (!signatureHeader) {
    return res.status(400).json({ error: 'Missing signature.' });
  }

  const rawBody = await readRawBody(req);

  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
    .update(rawBody)
    .digest('hex');

  const isValid =
    expectedSignature.length === signatureHeader.length &&
    crypto.timingSafeEqual(Buffer.from(expectedSignature), Buffer.from(signatureHeader));

  if (!isValid) {
    console.warn('[webhook] signature verification failed — request rejected.');
    return res.status(400).json({ error: 'Invalid signature.' });
  }

  let payload;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return res.status(400).json({ error: 'Invalid JSON.' });
  }

  const eventId = req.headers['x-razorpay-event-id'] || payload.id || `${payload.event}-${Date.now()}`;
  const event = payload.event;

  try {
    await connectDb();

    const entity =
      payload.payload?.payment?.entity || payload.payload?.refund?.entity || null;
    const razorpayOrderId = entity?.order_id;
    if (!razorpayOrderId) {
      // Nothing actionable — acknowledge so Razorpay doesn't retry forever.
      return res.status(200).json({ received: true });
    }

    const order = await Order.findOne({ razorpayOrderId });
    if (!order) {
      console.warn(`[webhook] no matching order for razorpay order ${razorpayOrderId}`);
      return res.status(200).json({ received: true });
    }

    // Idempotency: skip if we've already processed this exact event.
    if (order.processedWebhookEventIds.includes(String(eventId))) {
      return res.status(200).json({ received: true, alreadyProcessed: true });
    }

    switch (event) {
      case 'payment.captured':
        if (order.status !== 'paid') {
          order.status = 'paid';
          order.razorpayPaymentId = entity.id;
          order.paymentMethod = entity.method || order.paymentMethod;
        }
        break;

      case 'payment.failed':
        if (order.status !== 'paid') {
          order.status = 'failed';
        }
        break;

      case 'refund.processed':
        order.refundStatus = 'processed';
        order.status = 'refunded';
        break;

      default:
        // Unhandled event type — acknowledge without changing state.
        break;
    }

    order.processedWebhookEventIds.push(String(eventId));
    await order.save();

    return res.status(200).json({ received: true });
  } catch (err) {
    console.error('[webhook] processing error:', err);
    // 500 so Razorpay retries later — but signature is already verified,
    // so this is safe to retry.
    return res.status(500).json({ error: 'Webhook processing failed.' });
  }
};
