// api/admin/orders.js
//
// GET /api/admin/orders?status=paid&page=1&limit=25
// Admin-only. Never returns RAZORPAY_KEY_SECRET or webhook secret —
// only order/payment metadata that's safe to show in the admin UI.

const { connectDb } = require('../../lib/db');
const { getAuthenticatedUser, isAdmin } = require('../../lib/auth');
const Order = require('../../models/Order');

const ALLOWED_STATUSES = ['all', 'pending', 'processing', 'paid', 'failed', 'cancelled', 'refunded'];

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let user;
  try {
    user = await getAuthenticatedUser(req);
  } catch (err) {
    console.error('[admin/orders] auth error:', err.message);
    return res.status(500).json({ error: 'Server misconfiguration.' });
  }
  if (!isAdmin(user)) {
    return res.status(403).json({ error: 'Admin access required.' });
  }

  const status = (req.query.status || 'all').toString();
  if (!ALLOWED_STATUSES.includes(status)) {
    return res.status(400).json({ error: 'Invalid status filter.' });
  }

  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 25));

  try {
    await connectDb();

    const filter = status === 'all' ? {} : { status };

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .select('-processedWebhookEventIds -__v') // trim internal bookkeeping from the response
        .lean(),
      Order.countDocuments(filter),
    ]);

    return res.status(200).json({
      orders,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (err) {
    console.error('[admin/orders] unexpected error:', err);
    return res.status(500).json({ error: 'Failed to load orders.' });
  }
};
