// models/Order.js
//
// Permanent order/payment record. This is the single source of truth for
// payment status — the frontend is never trusted to report success.
//
// >>> If your existing site already has an Order/Booking collection,
// >>> ADD these fields to it instead of creating a parallel collection.
// >>> Duplicate order systems are explicitly what the spec asked to avoid.

const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema(
  {
    internalOrderId: { type: String, required: true, unique: true, index: true },

    userId: { type: String, required: true, index: true },

    productOrServiceId: { type: String, required: true },
    productOrServiceName: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },

    subtotal: { type: Number, required: true, min: 0 },
    discount: { type: Number, required: true, default: 0, min: 0 },
    taxAndFees: { type: Number, required: true, default: 0, min: 0 },
    finalAmount: { type: Number, required: true, min: 0 }, // in the currency's smallest unit is handled at Razorpay level; this is the rupee amount
    currency: { type: String, required: true, default: 'INR' },

    couponCode: { type: String, default: null },

    razorpayOrderId: { type: String, index: true, default: null },
    razorpayPaymentId: { type: String, default: null },
    razorpaySignature: { type: String, default: null },

    status: {
      type: String,
      enum: ['pending', 'processing', 'paid', 'failed', 'cancelled', 'refunded'],
      default: 'pending',
      index: true,
    },
    paymentMethod: { type: String, default: null },

    refundStatus: {
      type: String,
      enum: ['none', 'requested', 'processed', 'failed'],
      default: 'none',
    },

    // Prevents duplicate processing of the same webhook event.
    processedWebhookEventIds: { type: [String], default: [] },
  },
  { timestamps: true } // gives createdAt / updatedAt automatically
);

module.exports = mongoose.models.Order || mongoose.model('Order', OrderSchema);
