// lib/pricing.js
//
// >>> REQUIRED WIRING <<<
// The actual product/service catalog and coupon system were not available
// to inspect. This stub shows the shape create-order.js needs — replace
// the bodies with real lookups against your existing catalog/coupon
// collections. This is the function that stops a manipulated frontend
// amount from ever being trusted.

// const Product = require('../models/Product'); // your real model
// const Coupon = require('../models/Coupon');   // your real model

async function getProductOrService(productOrServiceId) {
  // Replace with a real DB lookup, e.g.:
  // const product = await Product.findById(productOrServiceId).lean();
  // if (!product || !product.isActive) return null;
  // return { id: product._id.toString(), name: product.name, unitPrice: product.price };

  throw new Error('lib/pricing.js:getProductOrService is a stub. Wire it to your real product/service catalog.');
}

async function validateCoupon(couponCode, { productOrServiceId, subtotal }) {
  if (!couponCode) return { valid: true, discount: 0 };

  // Replace with a real lookup, expiry check, usage-limit check, and
  // min-order-value check against your existing coupon collection, e.g.:
  // const coupon = await Coupon.findOne({ code: couponCode, active: true });
  // if (!coupon || coupon.expiresAt < new Date()) return { valid: false, discount: 0 };
  // const discount = coupon.type === 'percent'
  //   ? Math.round(subtotal * (coupon.value / 100))
  //   : coupon.value;
  // return { valid: true, discount: Math.min(discount, subtotal) };

  throw new Error('lib/pricing.js:validateCoupon is a stub. Wire it to your real coupon system.');
}

// Flat tax/fee example — replace with real GST/fee logic if applicable.
function calculateTaxAndFees({ subtotal, discount }) {
  return 0; // e.g. astrology consultations may be tax-exempt — confirm with your accountant
}

module.exports = { getProductOrService, validateCoupon, calculateTaxAndFees };
