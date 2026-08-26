/**
 * checkout-widget.js
 *
 * Drop this into your existing site (no framework required — plain
 * script include, or copy the logic into a React/Vue component).
 * It does NOT touch your page's styling; wire it to your existing
 * "Pay Now" button and order-summary markup.
 *
 * It never sees RAZORPAY_KEY_SECRET. The only key it uses is the
 * public keyId returned by /api/payments/create-order.
 *
 * Usage:
 *   <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
 *   <script src="/checkout-widget.js"></script>
 *   <button id="pay-now-btn">Pay Now</button>
 *
 *   <script>
 *     initAcharyaKhuranaCheckout({
 *       buttonEl: document.getElementById('pay-now-btn'),
 *       productOrServiceId: 'consult_30min',
 *       quantity: 1,
 *       getCouponCode: () => document.getElementById('coupon-input')?.value || null,
 *       onSuccess: (result) => { window.location.href = `/orders/${result.internalOrderId}`; },
 *       onFailure: (message) => { alert(message); },
 *     });
 *   </script>
 */
function initAcharyaKhuranaCheckout({
  buttonEl,
  productOrServiceId,
  quantity = 1,
  getCouponCode = () => null,
  onSuccess = () => {},
  onFailure = (msg) => alert(msg),
  authHeaders = () => ({}), // e.g. () => ({ Authorization: `Bearer ${token}` }) if you use bearer tokens instead of cookies
}) {
  if (!buttonEl) {
    console.error('[checkout-widget] buttonEl is required.');
    return;
  }

  let inFlight = false;

  buttonEl.addEventListener('click', async () => {
    // Duplicate-click protection: ignore clicks while a payment is already
    // being initialized or is open.
    if (inFlight) return;
    inFlight = true;

    const originalText = buttonEl.textContent;
    buttonEl.disabled = true;
    buttonEl.textContent = 'Processing…';

    try {
      const createRes = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        credentials: 'include',
        body: JSON.stringify({
          productOrServiceId,
          quantity,
          couponCode: getCouponCode(),
        }),
      });

      const createData = await createRes.json();

      if (!createRes.ok) {
        onFailure(createData.error || 'Could not start payment. Please try again.');
        return;
      }

      const options = {
        key: createData.keyId, // public key only
        amount: createData.amount, // paise, from the server — never client-set
        currency: createData.currency,
        name: 'Acharya Khurana',
        description: createData.productName,
        order_id: createData.razorpayOrderId,
        handler: async function (response) {
          // Razorpay's client-side "success" callback is NOT trusted on
          // its own — we hand it straight to the server for real
          // signature verification.
          try {
            const verifyRes = await fetch('/api/payments/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', ...authHeaders() },
              credentials: 'include',
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });
            const verifyData = await verifyRes.json();

            if (verifyRes.ok && verifyData.status === 'paid') {
              onSuccess({ internalOrderId: verifyData.internalOrderId });
            } else {
              onFailure('Payment could not be verified. If money was deducted, it will be refunded automatically — contact support with your order ID if this persists.');
            }
          } catch (err) {
            console.error('[checkout-widget] verify error:', err);
            onFailure('Payment verification failed due to a network error. Please check your order status before retrying.');
          }
        },
        modal: {
          ondismiss: function () {
            // User closed the Razorpay modal without paying.
            // Order stays 'processing' in DB; the webhook will reconcile
            // it to 'failed'/'paid' independently of what happens here.
          },
        },
        theme: {
          // Leave empty to inherit Razorpay's default, or set a single
          // brand color to match your existing theme — this does not
          // touch your site's own CSS.
          // color: '#YOUR_BRAND_HEX',
        },
      };

      const rzp = new Razorpay(options);

      rzp.on('payment.failed', function (response) {
        onFailure(response.error?.description || 'Payment failed. Please try again.');
      });

      rzp.open();
    } catch (err) {
      console.error('[checkout-widget] create-order error:', err);
      onFailure('Something went wrong starting your payment. Please try again.');
    } finally {
      buttonEl.disabled = false;
      buttonEl.textContent = originalText;
      inFlight = false;
    }
  });
}
