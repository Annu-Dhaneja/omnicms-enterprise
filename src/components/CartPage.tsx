import React, { useState } from 'react';
import { Trash2, ShoppingBag, Plus, Minus, Ticket, CreditCard, Sparkles } from 'lucide-react';
import { Book, Coupon } from '../types';

interface CartPageProps {
  cart: { bookId: string; quantity: number }[];
  books: Book[];
  coupons: Coupon[];
  onUpdateQty: (bookId: string, quantity: number) => void;
  onRemoveItem: (bookId: string) => void;
  onProceedToCheckout: () => void;
  onBackToStore: () => void;
}

export default function CartPage({ 
  cart = [], 
  books = [], 
  coupons = [], 
  onUpdateQty, 
  onRemoveItem, 
  onProceedToCheckout,
  onBackToStore 
}: CartPageProps) {
  const [couponText, setCouponText] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState('');

  // Map cart items
  const cartItems = cart.map(item => {
    const book = books.find(b => b.id === item.bookId);
    return {
      ...item,
      book
    };
  }).filter(item => item.book !== undefined) as { bookId: string; quantity: number; book: Book }[];

  // Math totals
  const subtotal = cartItems.reduce((acc, item) => {
    const price = item.book.salePrice || item.book.price;
    return acc + (price * item.quantity);
  }, 0);

  // Apply Coupon
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    if (!couponText) return;
    const match = coupons.find(c => c.code.toLowerCase() === couponText.trim().toLowerCase() && c.active);
    if (!match) {
      setCouponError("Invalid or expired coupon code.");
      setAppliedCoupon(null);
      return;
    }
    const minLimit = (match as any).minOrderValue || 0;
    if (subtotal < minLimit) {
      setCouponError(`Min order value to use is ₹${minLimit}`);
      setAppliedCoupon(null);
      return;
    }
    setAppliedCoupon(match);
  };

  const couponRebate = appliedCoupon 
    ? (appliedCoupon.discountType === 'percentage' ? (subtotal * appliedCoupon.value / 100) : appliedCoupon.value)
    : 0;

  const taxation = Math.round((subtotal - couponRebate) * 0.05); // 5% holy books GST
  const shipping = subtotal > 1000 || subtotal === 0 ? 0 : 60; // Free over 1000
  const grandTotal = Math.max(0, subtotal - couponRebate + taxation + shipping);

  // Save selected calculations in localStorage to share with checkout
  const handleProceed = () => {
    localStorage.setItem('acharya_active_summary', JSON.stringify({
      subtotal,
      couponRebate,
      couponCode: appliedCoupon?.code || '',
      taxation,
      shipping,
      grandTotal
    }));
    onProceedToCheckout();
  };

  if (cartItems.length === 0) {
    return (
      <div className="py-32 max-w-xl mx-auto px-6 text-center space-y-6">
        <div className="w-20 h-20 bg-white/[0.02] border border-white/5 rounded-full flex items-center justify-center mx-auto text-4xl">
          📚
        </div>
        <div className="space-y-2">
          <h2 className="font-serif text-2xl font-black text-white">Your Astro Cart is Currently Empty</h2>
          <p className="text-xs text-[#8b96aa]">
            Browse Acharya TN Khurana's sacred manuals, Kundli guides, and remedial charts to add them to your shopping trolley.
          </p>
        </div>
        <button 
          onClick={onBackToStore}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#C9A227] to-[#f0d070] text-[#1a1000] font-black text-xs hover:scale-105 transition-transform"
        >
          Explore Library Store
        </button>
      </div>
    );
  }

  return (
    <div className="py-24 max-w-7xl mx-auto px-6 space-y-12 text-left animate-fadeInDown">
      {/* Header */}
      <div className="space-y-2">
        <span className="cms-badge">Secured Sacred Cart</span>
        <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-white">Your Shopping Cart List</h1>
        <p className="text-[#8b96aa] text-xs">Verify your quantities before generating final tax invoices.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Cart Listing - Left (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {cartItems.map(item => {
            const finalPrice = item.book.salePrice || item.book.price;
            return (
              <div 
                key={item.bookId} 
                className="p-4 rounded-2xl bg-[#0a0e18] border border-white/5 flex gap-4 items-center justify-between hover:border-white/10 transition-all text-xs"
              >
                <div className="flex gap-4 items-center">
                  <img 
                    src={item.book.coverImage} 
                    alt={item.book.title} 
                    className="w-14 h-20 object-cover rounded-lg bg-[#080B12]" 
                    referrerPolicy="no-referrer"
                  />
                  <div className="space-y-1 text-left">
                    <span className="text-[9px] uppercase font-bold text-[#C9A227]">{item.book.category}</span>
                    <h3 className="font-serif font-black text-white text-sm line-clamp-1">{item.book.title}</h3>
                    <div className="font-mono text-[10px] text-[#8b96aa]">₹{finalPrice} each · Stock: {item.book.stock}</div>
                  </div>
                </div>

                <div className="flex gap-6 items-center">
                  {/* Qty incrementer */}
                  <div className="flex items-center gap-2 border border-white/10 rounded-lg p-1 bg-white/[0.01]">
                    <button 
                      onClick={() => onUpdateQty(item.bookId, item.quantity - 1)}
                      className="w-6 h-6 flex items-center justify-center text-[#8b96aa] hover:text-white rounded hover:bg-white/5 cursor-pointer"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-mono font-bold text-white text-xs w-4 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => onUpdateQty(item.bookId, item.quantity + 1)}
                      className="w-6 h-6 flex items-center justify-center text-[#8b96aa] hover:text-white rounded hover:bg-white/5 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Price multiplier */}
                  <div className="text-right font-mono font-bold text-white w-16">
                    ₹{finalPrice * item.quantity}
                  </div>

                  {/* Remove */}
                  <button 
                    onClick={() => onRemoveItem(item.bookId)}
                    className="text-red-500 hover:text-red-400 p-1 rounded hover:bg-red-500/5 transition-all cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}

          <button 
            onClick={onBackToStore}
            className="text-xs font-bold text-[#C9A227] hover:underline"
          >
            ← Keep Shopping Books
          </button>
        </div>

        {/* Order Summary & Coupons - Right (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Coupon Entry */}
          <div className="p-6 rounded-2xl bg-[#0a0e18] border border-white/5 space-y-4 text-xs">
            <h3 className="font-serif font-bold text-white flex gap-1.5 items-center">
              <Ticket className="w-4 h-4 text-[#C9A227]" />
              Redeem Divine Coupon Code
            </h3>
            <p className="text-[10px] text-[#596478]">Apply coupon codes like KUNDLI50 or SHASTRA20 to claim Gurukul savings.</p>
            
            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <input 
                type="text" 
                value={couponText} 
                onChange={e => setCouponText(e.target.value)} 
                placeholder="e.g. KUNDLI10" 
                className="form-input text-xs uppercase" 
              />
              <button 
                type="submit" 
                className="px-4 bg-white/5 border border-white/10 text-white rounded-lg hover:border-[#C9A227] hover:text-[#C9A227] transition-all cursor-pointer font-bold"
              >
                Apply
              </button>
            </form>

            {appliedCoupon && (
              <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-[10px] flex justify-between items-center">
                <span>Code <b>{appliedCoupon.code}</b> active ({appliedCoupon.type === 'percentage' ? `${appliedCoupon.value}%` : `₹${appliedCoupon.value}`} Off)</span>
                <span className="cursor-pointer text-xs" onClick={() => { setAppliedCoupon(null); setCouponText(''); }}>✕</span>
              </div>
            )}

            {couponError && (
              <div className="text-[10px] text-red-400 font-bold">
                ⚠️ {couponError}
              </div>
            )}
          </div>

          {/* Summation card */}
          <div className="p-6 rounded-2xl bg-[#0e1322] border border-white/5 space-y-4 text-xs">
            <h3 className="font-serif font-bold text-white">Tax Invoice Order Summary</h3>
            
            <div className="space-y-3 pt-2">
              <div className="flex justify-between text-[#8b96aa]">
                <span>Items Subtotal</span>
                <span className="font-mono">₹{subtotal}</span>
              </div>
              
              {couponRebate > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Coupon Rebate</span>
                  <span className="font-mono">-₹{couponRebate}</span>
                </div>
              )}
              
              <div className="flex justify-between text-[#8b96aa]">
                <span>Holy Literature GST (5%)</span>
                <span className="font-mono">₹{taxation}</span>
              </div>
              
              <div className="flex justify-between text-[#8b96aa]">
                <span>India Postal Delivery Charge</span>
                <span className="font-mono">{shipping === 0 ? 'FREE DELIVERY' : `₹${shipping}`}</span>
              </div>

              <div className="h-[1px] w-full bg-white/5" />

              <div className="flex justify-between text-base font-bold text-white pt-1">
                <span>Estimated Grand Total</span>
                <span className="font-mono text-[#C9A227]">₹{grandTotal}</span>
              </div>
            </div>

            <button 
              onClick={handleProceed}
              className="w-full h-12 bg-gradient-to-r from-[#C9A227] to-[#f0d070] text-[#1a1000] font-black rounded-xl text-xs hover:scale-[1.01] active:scale-[0.99] transition-transform flex items-center justify-center gap-1.5 cursor-pointer mt-6"
            >
              <CreditCard className="w-4 h-4" /> Proceed to Billing Coordinates
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
