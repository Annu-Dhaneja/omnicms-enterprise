import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, ShieldCheck, Mail, Pin, Phone, MapPin, Truck, Landmark } from 'lucide-react';
import { Book, Order } from '../types';
import { logActivity } from '../utils';

interface CheckoutPageProps {
  cart: { bookId: string; quantity: number }[];
  books: Book[];
  onOrderCompleted: (newOrder: Order) => void;
  onBackToCart: () => void;
}

export default function CheckoutPage({ 
  cart = [], 
  books = [], 
  onOrderCompleted, 
  onBackToCart 
}: CheckoutPageProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [paymentMode, setPaymentMode] = useState('cod'); // cod or upi or bank
  const [success, setSuccess] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);

  // Load calculations
  const [activeSummary, setActiveSummary] = useState({
    subtotal: 0,
    couponRebate: 0,
    couponCode: '',
    taxation: 0,
    shipping: 0,
    grandTotal: 0
  });

  useEffect(() => {
    try {
      const summaryString = localStorage.getItem('acharya_active_summary');
      if (summaryString) {
        setActiveSummary(JSON.parse(summaryString));
      } else {
        // Redraw basic calculations if missing
        const computedSubtotal = cart.reduce((acc, c) => {
          const match = books.find(b => b.id === c.bookId);
          const pr = match ? (match.salePrice || match.price) : 0;
          return acc + (pr * c.quantity);
        }, 0);
        const computedTax = Math.round(computedSubtotal * 0.05);
        const computedShip = computedSubtotal > 1000 || computedSubtotal === 0 ? 0 : 60;
        setActiveSummary({
          subtotal: computedSubtotal,
          couponRebate: 0,
          couponCode: '',
          taxation: computedTax,
          shipping: computedShip,
          grandTotal: computedSubtotal + computedTax + computedShip
        });
      }
    } catch {
      // safe fallback
    }
  }, [cart, books]);

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !address || !pincode) {
      alert("Please provide all required shipping parameters.");
      return;
    }

    // Capture items
    const invoiceItems = cart.map(item => {
      const book = books.find(b => b.id === item.bookId);
      return {
        bookId: item.bookId,
        title: book?.title || "Unified Astro Manuscript",
        price: book ? (book.salePrice || book.price) : 0,
        quantity: item.quantity
      };
    });

    const newOrder: Order = {
      id: `order_${Date.now()}`,
      invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
      customerName: name,
      customerEmail: email || 'tracker@spiritual.com',
      customerPhone: phone,
      customerAddress: `${address}, Landmark: ${landmark || 'None'}, ${city}, PIN: ${pincode}`,
      items: invoiceItems,
      subtotal: activeSummary.subtotal,
      discountAmount: activeSummary.couponRebate,
      couponUsed: activeSummary.couponCode,
      total: activeSummary.grandTotal,
      status: 'Pending',
      createdAt: new Date().toISOString()
    };

    setPlacedOrder(newOrder);
    setSuccess(true);
    logActivity("SECURED ORDER RECORDED", `Recorded Order ID: ${newOrder.id} for seeker: ${name} (Amount: ₹${newOrder.total})`);
    
    // Clear the active sum
    localStorage.removeItem('acharya_active_summary');
    
    // Complete callback which will clear the parent cart and push this order to state or persistent db
    onOrderCompleted(newOrder);
  };

  if (success && placedOrder) {
    return (
      <div className="py-24 max-w-xl mx-auto px-6 text-center space-y-8 animate-fadeInDown">
        <div className="w-20 h-20 bg-emerald-500/10 border-2 border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-4xl shadow-xl animate-pulse">
          ☯️
        </div>
        
        <div className="space-y-3">
          <h1 className="font-serif text-3xl font-black text-white">Order Placed Successfully!</h1>
          <p className="text-xs text-[#8b96aa] leading-relaxed">
            Gurukul invoice generated beautifully. Your order ID is <span className="font-mono text-[#C9A227] font-bold">{placedOrder.id}</span>.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[#0a0e18] border border-white/5 text-xs text-left space-y-4">
          <h2 className="font-serif font-black text-[#C9A227] border-b border-white/5 pb-2">Delivery & Payment Next Steps</h2>
          
          <div className="space-y-3">
            <div className="flex gap-2.5">
              <Truck className="w-4 h-4 text-[#C9A227] shrink-0 mt-0.5" />
              <p className="text-white/80">DTDC tracking parcel will be prepared. Standard dispatch holds a 24-business-hour SLA maximum.</p>
            </div>
            
            {((placedOrder as any).paymentMethod === 'UPI' || (placedOrder as any).paymentMethod === 'upi') && (
              <div className="flex gap-2.5 p-3 rounded-lg bg-[#C9A227]/5 border border-[#C9A227]/10">
                <Landmark className="w-4 h-4 text-[#C9A227] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-bold text-[#C9A227] block">Scan to Pay via UPI</span>
                  <span className="text-[10px] text-[#8b96aa] block leading-normal">
                    Please use your UPI app to transfer exactly <b>₹{placedOrder.total}</b> to UPI ID <b>acharya.khurana@okhdfcbank</b>. Please mention your name and phone as description.
                  </span>
                </div>
              </div>
            )}

            {((placedOrder as any).paymentMethod === 'Bank Transfer' || (placedOrder as any).paymentMethod === 'bank') && (
              <div className="flex gap-2.5 p-3 rounded-lg bg-indigo-500/5 border border-indigo-500/10 text-xs">
                <Landmark className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <div className="space-y-1 text-[#8b96aa]">
                  <span className="font-bold text-white block">Gurukul Account Coordinates</span>
                  <span>Bank: HDFC Bank CP Circle Branch</span><br/>
                  <span>A/C No: 50201089312019</span><br/>
                  <span>IFSC Code: HDFC0000003</span><br/>
                  <span>Type: Current Account</span>
                </div>
              </div>
            )}

            {((placedOrder as any).paymentMethod === 'COD' || (placedOrder as any).paymentMethod === 'cod') && (
              <div className="p-3 rounded-lg bg-white/[0.01] border border-white/5 text-[11px] text-[#8b96aa] italic">
                Cash on Delivery: Payment will be collected in Cash by DTDC delivery representative upon receipt of the sacred books.
              </div>
            )}
          </div>
        </div>

        <button 
          onClick={onBackToCart} // This will route back, but since cart is cleared, it will redirect logically
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#C9A227] to-[#f0d070] text-[#1a1000] font-black text-xs hover:scale-105 transition-all cursor-pointer"
        >
          Return to Library Store
        </button>
      </div>
    );
  }

  return (
    <div className="py-24 max-w-7xl mx-auto px-6 space-y-12 text-left animate-fadeInDown">
      <button 
        onClick={onBackToCart} 
        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8b96aa] hover:text-[#C9A227] cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" /> Returns to Secure Basket
      </button>

      <div className="space-y-2">
        <span className="cms-badge">Secured Checkout</span>
        <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-white">Billing & Delivery Coordinates</h1>
        <p className="text-[#8b96aa] text-xs">Inputs will be locked onto the parcel courier printed label.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Shipping Form - Left (7 cols) */}
        <div className="lg:col-span-7 bg-[#0a0e18] p-8 rounded-3xl border border-white/5 space-y-6">
          <h2 className="text-xl font-serif text-white font-bold border-b border-white/5 pb-2">Shipping Information</h2>

          <form onSubmit={handleSubmitOrder} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-[#8b96aa] mb-1.5">Recipient Full Name *</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  placeholder="Siddharth Roy" 
                  className="form-input" 
                  required 
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-[#8b96aa] mb-1.5">WhatsApp Mobile No *</label>
                <div className="relative">
                  <input 
                    type="tel" 
                    value={phone} 
                    onChange={e => setPhone(e.target.value)} 
                    placeholder="+91 99887 76655" 
                    className="form-input pl-10" 
                    required 
                  />
                  <Phone className="absolute left-3.5 top-3 w-4 h-4 text-[#596478]" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-[#8b96aa] mb-1.5">Email Address (To trace delivery updates)</label>
              <div className="relative">
                <input 
                  type="email" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  placeholder="sid.roy@gmail.com" 
                  className="form-input pl-10" 
                />
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-[#596478]" />
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-[#8b96aa] mb-1.5">Street Address *</label>
              <div className="relative">
                <input 
                  type="text" 
                  value={address} 
                  onChange={e => setAddress(e.target.value)} 
                  placeholder="Apt 20B, Block G, Sushant Lok Phase II" 
                  className="form-input pl-10" 
                  required 
                />
                <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-[#596478]" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-[#8b96aa] mb-1.5">Landmark Highlights</label>
                <input 
                  type="text" 
                  value={landmark} 
                  onChange={e => setLandmark(e.target.value)} 
                  placeholder="Near Gold Gym, MG Rd" 
                  className="form-input" 
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-[#8b96aa] mb-1.5">City / State *</label>
                <input 
                  type="text" 
                  value={city} 
                  onChange={e => setCity(e.target.value)} 
                  placeholder="Gurugram, HR" 
                  className="form-input" 
                  required 
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-[#8b96aa] mb-1.5">Pincode *</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={pincode} 
                    onChange={e => setPincode(e.target.value)} 
                    placeholder="122003" 
                    className="form-input pl-10" 
                    required 
                  />
                  <Pin className="absolute left-3.5 top-3 w-4 h-4 text-[#596478]" />
                </div>
              </div>
            </div>

            {/* Payment options */}
            <div className="space-y-4 pt-4">
              <h3 className="font-serif font-black text-white border-b border-white/5 pb-2">Sacred Settlement Instruments</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div 
                  onClick={() => setPaymentMode('cod')}
                  className={`p-4 rounded-xl border cursor-pointer text-left transition-all relative ${
                    paymentMode === 'cod' ? 'border-[#C9A227] bg-[#C9A227]/5' : 'border-white/5 bg-white/[0.01]'
                  }`}
                >
                  <input type="radio" checked={paymentMode === 'cod'} readOnly className="absolute top-3 right-3 text-[#C9A227]" />
                  <span className="font-bold text-white block mb-1">COD</span>
                  <span className="text-[10px] text-[#8b96aa] leading-normal block">Cash on delivery at courier.</span>
                </div>

                <div 
                  onClick={() => setPaymentMode('upi')}
                  className={`p-4 rounded-xl border cursor-pointer text-left transition-all relative ${
                    paymentMode === 'upi' ? 'border-[#C9A227] bg-[#C9A227]/5' : 'border-white/5 bg-white/[0.01]'
                  }`}
                >
                  <input type="radio" checked={paymentMode === 'upi'} readOnly className="absolute top-3 right-3 text-[#C9A227]" />
                  <span className="font-bold text-white block mb-1">Direct UPI ID</span>
                  <span className="text-[10px] text-[#8b96aa] leading-normal block">Scan QR code or transfer to UPI ID.</span>
                </div>

                <div 
                  onClick={() => setPaymentMode('bank')}
                  className={`p-4 rounded-xl border cursor-pointer text-left transition-all relative ${
                    paymentMode === 'bank' ? 'border-[#C9A227] bg-[#C9A227]/5' : 'border-white/5 bg-white/[0.01]'
                  }`}
                >
                  <input type="radio" checked={paymentMode === 'bank'} readOnly className="absolute top-3 right-3 text-[#C9A227]" />
                  <span className="font-bold text-white block mb-1">Bank Deposit</span>
                  <span className="text-[10px] text-[#8b96aa] leading-normal block">Bank wire direct deposit.</span>
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full h-12 bg-gradient-to-r from-[#C9A227] to-[#f0d070] text-[#1a1000] font-black rounded-xl text-xs hover:scale-[1.01] transition-transform flex items-center justify-center gap-2 cursor-pointer mt-6"
            >
              <ShieldCheck className="w-4 h-4" /> Submit Secured Order (₹{activeSummary.grandTotal})
            </button>
          </form>
        </div>

        {/* Invoice Itemized Summary - Right (5 cols) */}
        <div className="lg:col-span-5 bg-[#0e1322] p-6 rounded-3xl border border-white/5 text-xs text-left space-y-4">
          <h3 className="font-serif font-black text-[#C9A227] border-b border-white/5 pb-2">Itemized Invoice Details</h3>
          
          <div className="divide-y divide-white/5 max-h-60 overflow-y-auto pr-1">
            {cart.map(item => {
              const b = books.find(book => book.id === item.bookId);
              if (!b) return null;
              return (
                <div key={item.bookId} className="py-2.5 flex justify-between items-center text-xs">
                  <div className="space-y-0.5 max-w-[70%]">
                    <span className="text-white font-medium block truncate">{b.title}</span>
                    <span className="text-[10px] text-[#596478]">Qty: {item.quantity} · ₹{b.salePrice || b.price} each</span>
                  </div>
                  <span className="font-mono text-white font-bold">₹{(b.salePrice || b.price) * item.quantity}</span>
                </div>
              );
            })}
          </div>

          <div className="h-[1px] w-full bg-white/5" />

          {/* Math details */}
          <div className="space-y-2.5 pt-2 text-[#8b96aa]">
            <div className="flex justify-between">
              <span>Items Subtotal</span>
              <span className="font-mono text-white">₹{activeSummary.subtotal}</span>
            </div>
            {activeSummary.couponRebate > 0 && (
              <div className="flex justify-between text-emerald-400">
                <span>Coupon Rebate</span>
                <span className="font-mono">-₹{activeSummary.couponRebate}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Astro Literature GST (5%)</span>
              <span className="font-mono text-white">₹{activeSummary.taxation}</span>
            </div>
            <div className="flex justify-between">
              <span>Postal Delivery Charges</span>
              <span className="font-mono text-white">{activeSummary.shipping === 0 ? 'FREE' : `₹${activeSummary.shipping}`}</span>
            </div>

            <div className="h-[1px] w-full bg-white/5 my-2" />

            <div className="flex justify-between text-base font-black text-[#C9A227]">
              <span>Final Grand Total</span>
              <span className="font-mono">₹{activeSummary.grandTotal}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
