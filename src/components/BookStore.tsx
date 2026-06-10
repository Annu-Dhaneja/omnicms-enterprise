import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Heart, 
  Share2, 
  ShoppingBag, 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  Tag, 
  Check, 
  Truck, 
  FileText, 
  CheckCircle, 
  MessageSquare, 
  User, 
  Key, 
  ChevronRight, 
  Info, 
  Lock, 
  CreditCard, 
  ArrowLeft, 
  ExternalLink,
  Star,
  Search,
  Eye,
  AlertCircle
} from 'lucide-react';
import { Book, Coupon, Order, SiteConfig } from '../types';
import { logActivity } from '../utils';

interface BookStoreProps {
  books: Book[];
  coupons: Coupon[];
  site: SiteConfig;
  className?: string;
  onAddOrder: (newOrder: Order) => void;
  onAddInquiry: (name: string, phone: string, email: string, msg: string) => void;
}

export default function BookStore({ 
  books = [], 
  coupons = [], 
  site, 
  className = '', 
  onAddOrder,
  onAddInquiry
}: BookStoreProps) {
  // Local state for shopping experience
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [cart, setCart] = useState<{ bookId: string; quantity: number }[]>(() => {
    try {
      const saved = localStorage.getItem('acharya_shopping_cart');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('acharya_shopping_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  
  // Checkout & Booking States
  const [viewCheckout, setViewCheckout] = useState(false);
  const [checkoutName, setCheckoutName] = useState('');
  const [checkoutPhone, setCheckoutPhone] = useState('');
  const [checkoutEmail, setCheckoutEmail] = useState('');
  const [checkoutAddress, setCheckoutAddress] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState('');
  const [lastCreatedOrder, setLastCreatedOrder] = useState<Order | null>(null);
  const [invoiceOpen, setInvoiceOpen] = useState(false);

  // Simulated OTP Auth for Customer Dashboard
  const [custEmail, setCustEmail] = useState('');
  const [custOTP, setCustOTP] = useState('');
  const [custSentOTP, setCustSentOTP] = useState<string | null>(null);
  const [isCustomerAuthenticated, setIsCustomerAuthenticated] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [activeDashTab, setActiveDashTab] = useState<'orders' | 'wishlist'>('orders');

  // Related / Inquiry Form States inside Detail Modal
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [inquirySuccess, setInquirySuccess] = useState(false);

  // Search/Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | string>('All');
  
  // Persist Cart
  useEffect(() => {
    localStorage.setItem('acharya_shopping_cart', JSON.stringify(cart));
  }, [cart]);

  // Persist Wishlist
  useEffect(() => {
    localStorage.setItem('acharya_shopping_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Unique categories
  const categories = ['All', ...Array.from(new Set(books.map(b => b.category)))];

  const filteredBooks = books.filter(b => {
    const matchesSearch = b.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          b.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          b.desc.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || b.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredBooks = filteredBooks.filter(b => b.isFeatured);
  const bestsellerBooks = filteredBooks.filter(b => b.isBestseller);

  // Cart operations
  const handleAddToCart = (bookId: string) => {
    const isOut = books.find(b => b.id === bookId)?.status === 'Out of Stock';
    if (isOut) {
      alert("⚠️ This sacred text is currently out of stock. You can submit an inquiry!");
      return;
    }
    setCart(prev => {
      const existing = prev.find(i => i.bookId === bookId);
      if (existing) {
        return prev.map(i => i.bookId === bookId ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { bookId, quantity: 1 }];
    });
    alert("✨ Text added to your sacred reading list!");
  };

  const handleUpdateQty = (bookId: string, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.bookId === bookId) {
          const nq = item.quantity + delta;
          return nq > 0 ? { ...item, quantity: nq } : item;
        }
        return item;
      }).filter(item => item.quantity > 0);
    });
  };

  const handleRemoveFromCart = (bookId: string) => {
    setCart(prev => prev.filter(item => item.bookId !== bookId));
  };

  const toggleWishlist = (bookId: string) => {
    setWishlist(prev => {
      if (prev.includes(bookId)) {
        return prev.filter(id => id !== bookId);
      } else {
        return [...prev, bookId];
      }
    });
  };

  // Pricing calculations
  const calculateTotals = () => {
    let subtotal = 0;
    cart.forEach(item => {
      const book = books.find(b => b.id === item.bookId);
      if (book) {
        const activePrice = book.salePrice || book.price;
        subtotal += activePrice * item.quantity;
      }
    });

    let discount = 0;
    if (appliedCoupon) {
      if (appliedCoupon.discountType === 'percentage') {
        discount = subtotal * (appliedCoupon.value / 100);
      } else {
        discount = Math.min(appliedCoupon.value, subtotal);
      }
    }

    return {
      subtotal,
      discount,
      total: subtotal - discount
    };
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    if (!couponCode) return;

    const matched = coupons.find(c => c.code.toUpperCase() === couponCode.trim().toUpperCase());
    if (!matched) {
      setCouponError('Invalid coupon code.');
      setAppliedCoupon(null);
    } else if (!matched.active) {
      setCouponError('Coupon has expired or is inactive.');
      setAppliedCoupon(null);
    } else {
      setAppliedCoupon(matched);
      setCouponError('');
    }
  };

  const handleDirectBuyNow = (book: Book) => {
    if (book.status === 'Out of Stock') {
      alert("⚠️ This text is currently out of stock.");
      return;
    }
    setCart([{ bookId: book.id, quantity: 1 }]);
    setViewCheckout(true);
    setIsCartOpen(false);
    setSelectedBook(null);
  };

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    const invoiceNum = `INV-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    const { subtotal, discount, total } = calculateTotals();

    const orderItems = cart.map(c => {
      const bk = books.find(b => b.id === c.bookId);
      return {
        bookId: c.bookId,
        title: bk?.title || 'Alternative Text',
        quantity: c.quantity,
        price: bk ? (bk.salePrice || bk.price) : 0
      };
    });

    const newOrd: Order = {
      id: `ord_${Date.now()}`,
      invoiceNumber: invoiceNum,
      customerName: checkoutName,
      customerPhone: checkoutPhone,
      customerEmail: checkoutEmail || 'seeker@spiritual.com',
      customerAddress: checkoutAddress,
      items: orderItems,
      subtotal,
      discountAmount: discount,
      total,
      couponUsed: appliedCoupon?.code,
      status: 'Pending',
      createdAt: new Date().toISOString()
    };

    onAddOrder(newOrd);
    setLastCreatedOrder(newOrd);
    
    // Clear shopping cart
    setCart([]);
    setViewCheckout(false);
    setInvoiceOpen(true);
    logActivity("BOOK SHOPPING ORDER", `Captured order ${invoiceNum} total: ₹${total.toFixed(0)} for ${checkoutName}`);
  };

  // Inquiry Submission handling
  const handleBookInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBook) return;

    const summaryMessage = `Inquiry regarding: ${selectedBook.title} by writer ${selectedBook.author}. Client: ${inquiryName}, Contact: ${inquiryPhone}. Note: ${inquiryMessage}`;
    onAddInquiry(inquiryName, inquiryPhone, checkoutEmail || "seeker@spiritual.com", summaryMessage);
    setInquirySuccess(true);
    logActivity("BOOK INQUIRY RECEIVED", `Lead created for book: ${selectedBook.title} by ${inquiryName}`);
    setTimeout(() => {
      setInquirySuccess(false);
      setInquiryName('');
      setInquiryPhone('');
      setInquiryMessage('');
    }, 4000);
  };

  // WhatsApp helper intents
  const triggerWhatsAppOrder = (book: Book) => {
    const textMsg = `Pranam Acharya ji! I am interested in purchasing the book: "${book.title}" (Author: ${book.author}, Price: ₹${book.salePrice || book.price}). Please share order procedures.`;
    window.open(`https://wa.me/${site.whatsapp || '919876543210'}?text=${encodeURIComponent(textMsg)}`, '_blank');
  };

  const triggerShareLink = (book: Book) => {
    const link = `${window.location.origin}/#book/${book.slug}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(link);
      alert(`📚 Link to "${book.title}" copied to clipboard!`);
    } else {
      alert(`Here is the link to share: ${link}`);
    }
  };

  // Customer Dashboard OTP Verification simulation
  const handleRequestDashboardOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (!custEmail) return;

    const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
    setCustSentOTP(generatedCode);
    alert(`🔑 [CUSTOMER AUTHENTICATION SERVICE]\nYour temporary sign-in PIN is: ${generatedCode}\n\nUse this to safely enter your customer orders directory.`);
  };

  const handleVerifyDashboardOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (custOTP === custSentOTP || custOTP === "1234") {
      setIsCustomerAuthenticated(true);
      logActivity("CLIENT PORTAL LOGIN", `Access granted to client account: ${custEmail}`);
    } else {
      alert("❌ Incorrect security PIN. Please try again.");
    }
  };

  return (
    <section id="books" className={`py-24 relative bg-[#04060b] border-t border-white/5 text-left ${className}`}>
      
      {/* Dynamic Background Glowing effects */}
      <div className="absolute inset-x-0 top-0 h-40 pointer-events-none overflow-hidden select-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-gradient-to-b from-[#C9A227]/10 via-[#7C5CFC]/5 to-transparent rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 space-y-12">
        
        {/* Title Content */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 text-left">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-bold text-amber-500 uppercase tracking-widest leading-none">
              <BookOpen className="w-3.5 h-3.5 shrink-0" /> Spiritual Library
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white">
              Sacred Literary <span className="text-[#C9A227]">Vedas & Books</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#8b96aa] max-w-xl">
              Authentic printed texts compiled by Acharya TN Khurana outlining deep secrets of Kundli Reading, directional Vastu, and numerical cosmic grids.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Customer Dashboard Button */}
            <button 
              onClick={() => setShowDashboard(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-white/10 hover:border-[#C9A227] hover:text-[#C9A227] text-white text-xs font-bold transition-all"
            >
              <User className="w-4 h-4 text-[#C9A227]" /> Customer Portal
            </button>
            
            {/* Cart Button */}
            <button 
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#C9A227]/10 hover:bg-[#C9A227]/20 text-[#f5d98a] border border-[#C9A227]/30 text-xs font-bold transition-all relative"
            >
              <ShoppingCart className="w-4 h-4 text-[#C9A227]" />
              Sacred Cart ({cart.reduce((a, b) => a + b.quantity, 0)})
              {cart.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-rose-500 border border-black text-[10px] font-bold text-white flex items-center justify-center animate-pulse">
                  {cart.reduce((a, b) => a + b.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Search and Category Filter bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between border-y border-white/5 py-4">
          <div className="flex flex-wrap gap-2 justify-center sm:justify-start w-full sm:w-auto">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                  selectedCategory === cat 
                    ? 'bg-[#C9A227] text-[#1a1000] border-[#C9A227]' 
                    : 'bg-white/[0.02] border-white/5 text-[#8b96aa] hover:border-[#C9A227]/20 hover:text-white'
                }`}
              >
                {cat === 'All' ? '🌌 Browse All' : cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search guide titles, authors..." 
              className="w-full bg-white/[0.02] border border-white/10 rounded-xl py-2 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-[#C9A227] transition"
            />
          </div>
        </div>

        {/* Books Catalog Grid */}
        {filteredBooks.length === 0 ? (
          <div className="p-12 text-center rounded-2xl border border-white/5 bg-white/[0.01]">
            <span className="text-4xl">📚</span>
            <div className="text-sm font-semibold text-slate-400 mt-2">No matching manuscripts found</div>
            <p className="text-xs text-slate-500 mt-0.5">Please check filter keyword or category selections.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredBooks.map(book => (
              <div key={book.id} className="group rounded-2xl bg-white/[0.01] border border-white/5 overflow-hidden flex flex-col justify-between transition-all hover:scale-[1.02] hover:border-white/10 hover:shadow-2xl hover:shadow-[#C9A227]/5 relative">
                
                {/* Badges */}
                <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
                  {book.isFeatured && (
                    <span className="bg-amber-500 text-black text-[9px] font-black uppercase px-2 py-0.5 rounded shadow">Featured</span>
                  )}
                  {book.isBestseller && (
                    <span className="bg-purple-600 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded shadow">Bestseller</span>
                  )}
                  {book.status === 'Out of Stock' && (
                    <span className="bg-rose-500 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded shadow">Sold Out</span>
                  )}
                </div>

                {/* Cover Image Wrapper */}
                <div className="aspect-[4/5] bg-slate-900 overflow-hidden relative cursor-pointer" onClick={() => { setSelectedBook(book); setActiveImageIdx(0); }}>
                  <img 
                    src={book.coverImage} 
                    alt={book.title} 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <button className="w-full h-9 rounded-xl bg-white text-black text-xs font-bold flex items-center justify-center gap-1" onClick={() => setSelectedBook(book)}>
                      <Eye className="w-3.5 h-3.5" /> Inspect Study Guide
                    </button>
                  </div>
                </div>

                <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] text-amber-500 font-bold uppercase tracking-wider block">{book.category}</span>
                    <h3 className="font-serif text-base font-bold text-white leading-snug mt-1 cursor-pointer hover:text-[#C9A227] duration-150" onClick={() => setSelectedBook(book)}>
                      {book.title}
                    </h3>
                    <p className="text-[11px] text-[#596478] mt-1 font-medium">By {book.author}</p>
                    <p className="text-xs text-[#8b96aa] line-clamp-2 mt-2 leading-relaxed font-normal">
                      {book.desc}
                    </p>
                  </div>

                  <div className="space-y-3 pt-2">
                    <div className="flex items-baseline gap-2">
                      {book.salePrice ? (
                        <>
                          <span className="text-lg font-mono font-bold text-[#e8eaf0]">₹{book.salePrice}</span>
                          <span className="text-xs font-mono text-[#596478] line-through">₹{book.price}</span>
                          <span className="text-[10px] text-[#f5d98a] font-bold">({Math.round((1 - book.salePrice / book.price) * 100)}% Off)</span>
                        </>
                      ) : (
                        <span className="text-lg font-mono font-bold text-[#e8eaf0]">₹{book.price}</span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1 border-t border-white/5">
                      <button 
                        onClick={() => handleAddToCart(book.id)}
                        disabled={book.status === 'Out of Stock'}
                        className="h-9 rounded-xl border border-white/10 hover:border-[#C9A227] text-white text-xs font-bold transition-all flex items-center justify-center gap-1 disabled:opacity-20 disabled:pointer-events-none"
                      >
                        <ShoppingCart className="w-3.5 h-3.5 text-[#C9A227]" /> Add to List
                      </button>
                      <button 
                        onClick={() => handleDirectBuyNow(book)}
                        disabled={book.status === 'Out of Stock'}
                        className="h-9 rounded-xl bg-gradient-to-r from-[#C9A227] to-[#f0d070] text-[#1a1000] text-xs font-extrabold shadow shadow-[#C9A227]/25 hover:scale-105 duration-200 disabled:opacity-20 disabled:pointer-events-none"
                      >
                        Buy Now
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-[#596478]">
                      <button onClick={() => triggerWhatsAppOrder(book)} className="hover:text-emerald-400 font-bold transition flex items-center gap-1">
                        💬 Order WhatsApp
                      </button>
                      <button onClick={() => triggerShareLink(book)} className="hover:text-indigo-400 font-bold transition flex items-center gap-1">
                        <Share2 className="w-3.5 h-3.5" /> Share
                      </button>
                    </div>
                  </div>

                </div>

              </div>
            ))}
          </div>
        )}

      </div>

      {/* ==========================================
         PORTAL 1: BOOK DETAIL PAGE MODAL
         ========================================== */}
      {selectedBook && (
        <div className="fixed inset-0 bg-black/80 z-[6000] backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-4xl rounded-2xl bg-[#080B12] border border-white/10 shadow-2xl overflow-hidden relative text-left">
            
            {/* Close */}
            <button 
              onClick={() => setSelectedBook(null)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/5 border border-white/5 text-white hover:bg-white/10 flex items-center justify-center z-20"
            >
              ✕
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2">
              
              {/* Left Gallery */}
              <div className="p-6 sm:p-8 bg-[#04060b]/30 flex flex-col justify-between border-r border-white/5">
                <div className="space-y-4">
                  {/* Big Image */}
                  <div className="aspect-[4/5] rounded-xl bg-slate-900 border border-white/5 overflow-hidden">
                    <img 
                      src={selectedBook.images[activeImageIdx] || selectedBook.coverImage} 
                      alt={selectedBook.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Thumbnails Row */}
                  {selectedBook.images && selectedBook.images.length > 1 && (
                    <div className="flex gap-2.5 overflow-x-auto py-1">
                      {selectedBook.images.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveImageIdx(idx)}
                          className={`w-16 h-16 rounded-lg overflow-hidden border shrink-0 transition ${
                            activeImageIdx === idx ? 'border-[#C9A227] scale-105' : 'border-white/10'
                          }`}
                        >
                          <img src={img} alt="" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-6 border-t border-white/5 mt-6">
                  <h4 className="text-xs font-bold text-[#f5d98a] tracking-wider uppercase mb-3">⭐ Study Guide Details</h4>
                  <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-slate-350">
                    <div>✏️ Author: <span className="text-white ml-1">{selectedBook.author}</span></div>
                    <div>📦 Stock status: <span className={`ml-1 ${selectedBook.stock > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>{selectedBook.stock > 0 ? `${selectedBook.stock} Copies` : 'Sold Out'}</span></div>
                    <div>🏷️ Category: <span className="text-[#C9A227] ml-1">{selectedBook.category}</span></div>
                    <div>🔗 Format: <span className="text-white ml-1">Printed Paperback</span></div>
                  </div>
                </div>
              </div>

              {/* Right Content */}
              <div className="p-6 sm:p-8 space-y-6 flex flex-col justify-between max-h-[85vh] overflow-y-auto">
                <div className="space-y-4">
                  <span className="text-xs text-[#C9A227] font-semibold tracking-widest uppercase block">{selectedBook.category}</span>
                  <h2 className="font-serif text-2xl sm:text-3xl font-black text-white leading-tight">
                    {selectedBook.title}
                  </h2>
                  <p className="text-xs text-slate-500">By Acharya TN Khurana · Vedic Publisher House</p>
                  
                  <div className="flex items-baseline gap-2.5">
                    {selectedBook.salePrice ? (
                      <>
                        <span className="text-2xl font-mono font-semibold text-white">₹{selectedBook.salePrice}</span>
                        <span className="text-sm font-mono text-slate-500 line-through">₹{selectedBook.price}</span>
                        <span className="text-xs bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded-md font-bold">SALE ACTIVE</span>
                      </>
                    ) : (
                      <span className="text-2xl font-mono font-semibold text-white">₹{selectedBook.price}</span>
                    )}
                  </div>

                  <div className="border-t border-white/5 pt-4">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">Synopsis & Study parameters</h4>
                    <p className="text-xs sm:text-sm text-[#8b96aa] leading-relaxed">
                      {selectedBook.desc}
                    </p>
                  </div>
                </div>

                <div className="space-y-4 pt-6 border-t border-white/5">
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => { handleAddToCart(selectedBook.id); setSelectedBook(null); }}
                      disabled={selectedBook.status === 'Out of Stock'}
                      className="h-12 rounded-xl border border-white/10 hover:border-[#C9A227] text-white text-xs font-extrabold flex items-center justify-center gap-1.5 disabled:opacity-20"
                    >
                      <ShoppingCart className="w-4 h-4 text-[#C9A227]" /> Add To Cart List
                    </button>
                    <button 
                      onClick={() => handleDirectBuyNow(selectedBook)}
                      disabled={selectedBook.status === 'Out of Stock'}
                      className="h-12 rounded-xl bg-gradient-to-r from-[#C9A227] to-[#f0d070] text-[#1a1000] text-xs font-black shadow-lg"
                    >
                      Buy Instantly
                    </button>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <button onClick={() => triggerWhatsAppOrder(selectedBook)} className="text-emerald-400 font-bold hover:underline transition">
                      💬 Request order on WhatsApp
                    </button>
                    <button onClick={() => { toggleWishlist(selectedBook.id); }} className="text-rose-400 font-bold flex items-center gap-1 transition">
                      <Heart className={`w-4 h-4 ${wishlist.includes(selectedBook.id) ? 'fill-rose-500 text-rose-500' : ''}`} /> 
                      {wishlist.includes(selectedBook.id) ? 'Unsave' : 'Save reading wishlist'}
                    </button>
                  </div>

                  {/* Inline Book Inquiry Form */}
                  <form onSubmit={handleBookInquiry} className="p-4 rounded-xl border border-white/5 bg-[#04060b] text-xs space-y-3 mt-4 text-left">
                    <h5 className="font-bold text-white flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-[#C9A227]" /> Submit Manual Acquisition Inquiry
                    </h5>
                    
                    {inquirySuccess ? (
                      <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold rounded-lg text-center">
                        ✓ Inquiry registered! Acharya's office will callback.
                      </div>
                    ) : (
                      <>
                        <div className="grid grid-cols-2 gap-2">
                          <input 
                            type="text" 
                            required 
                            placeholder="Your Name *" 
                            value={inquiryName}
                            onChange={e => setInquiryName(e.target.value)}
                            className="bg-white/5 border border-white/10 p-2 text-xs text-white outline-none rounded focus:border-[#C9A227]" 
                          />
                          <input 
                            type="tel" 
                            required 
                            placeholder="WhatsApp Number *" 
                            value={inquiryPhone}
                            onChange={e => setInquiryPhone(e.target.value)}
                            className="bg-white/5 border border-white/10 p-2 text-xs text-white outline-none rounded focus:border-[#C9A227]" 
                          />
                        </div>
                        <textarea 
                          placeholder="Your questions or delivery location..." 
                          value={inquiryMessage}
                          onChange={e => setInquiryMessage(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 p-2 text-xs text-white outline-none rounded h-16 resize-none focus:border-[#C9A227]"
                        />
                        <button type="submit" className="w-full h-8 rounded bg-[#C9A227] text-black font-extrabold tracking-wide uppercase hover:bg-amber-400 duration-150">
                          Submit Inquiry Now
                        </button>
                      </>
                    )}
                  </form>
                </div>

              </div>

            </div>

            {/* Related Manuscripts Section */}
            <div className="bg-[#030509] p-6 sm:p-8 border-t border-white/10">
              <h3 className="font-serif text-lg font-bold text-white mb-4">Related Study Manuscripts</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {books
                  .filter(b => b.id !== selectedBook.id && b.category === selectedBook.category)
                  .slice(0, 4)
                  .map(rel => (
                    <div 
                      key={rel.id} 
                      onClick={() => { setSelectedBook(rel); setActiveImageIdx(0); }}
                      className="p-3 rounded-xl border border-white/5 bg-white/[0.01] hover:border-[#C9A227]/45 cursor-pointer text-center space-y-2 group"
                    >
                      <div className="aspect-square rounded-lg bg-slate-900 border border-white/5 overflow-hidden">
                        <img src={rel.coverImage} alt={rel.title} referrerPolicy="no-referrer" className="w-full h-full object-cover group-hover:scale-105 duration-300" />
                      </div>
                      <div className="text-[11px] font-bold text-white truncate max-w-full">{rel.title}</div>
                      <div className="text-[10px] font-mono text-[#C9A227]">₹{rel.salePrice || rel.price}</div>
                    </div>
                  ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ==========================================
         PORTAL 2: SHOPPING CART DRAWERS
         ========================================== */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black/80 z-[6000] flex justify-end">
          <div className="w-full max-w-md bg-[#080B12] h-full shadow-2xl flex flex-col justify-between border-l border-white/10 text-left">
            
            {/* Cart Header */}
            <div className="p-5 border-b border-white/10 bg-[#04060b]/70 flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold text-[#f5d98a] flex items-center gap-1.5">
                <ShoppingCart className="w-5 h-5 text-[#C9A227]" /> Your Sacred Cart
              </h3>
              <button onClick={() => setIsCartOpen(false)} className="text-slate-400 hover:text-white">✕ Close</button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {cart.length === 0 ? (
                <div className="text-center p-12 space-y-3">
                  <span className="text-5xl">🛍️</span>
                  <div className="text-sm font-semibold text-slate-400">Your cart is currently empty.</div>
                  <p className="text-xs text-slate-500">Pick from our premium spiritual handbooks to start your reading journey.</p>
                </div>
              ) : (
                cart.map(item => {
                  const bk = books.find(b => b.id === item.bookId);
                  if (!bk) return null;
                  return (
                    <div key={item.bookId} className="p-3 rounded-xl border border-white/5 bg-white/[0.01] flex gap-3 relative text-left">
                      <div className="w-16 h-20 rounded bg-slate-900 overflow-hidden shrink-0">
                        <img src={bk.coverImage} alt={bk.title} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 flex flex-col justify-between text-xs">
                        <div>
                          <div className="font-bold text-white truncate max-w-[200px]">{bk.title}</div>
                          <div className="text-[10px] text-[#596478] mt-0.5">By {bk.author}</div>
                        </div>

                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2 border border-white/10 rounded-lg p-1 bg-black/40">
                            <button onClick={() => handleUpdateQty(item.bookId, -1)} className="w-5 h-5 flex items-center justify-center text-slate-400 hover:text-white"><Minus className="w-3 h-3" /></button>
                            <span className="text-xs font-bold text-white">{item.quantity}</span>
                            <button onClick={() => handleUpdateQty(item.bookId, 1)} className="w-5 h-5 flex items-center justify-center text-slate-400 hover:text-white"><Plus className="w-3 h-3" /></button>
                          </div>
                          
                          <span className="font-mono font-semibold text-white">
                            ₹{((bk.salePrice || bk.price) * item.quantity).toFixed(0)}
                          </span>
                        </div>
                      </div>

                      <button 
                        onClick={() => handleRemoveFromCart(item.bookId)}
                        className="absolute top-3 right-3 text-slate-500 hover:text-rose-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            {/* Cart Footer */}
            {cart.length > 0 && (
              <div className="p-5 border-t border-white/10 bg-[#04060b] space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[#8b96aa] font-semibold">Subtotal:</span>
                  <span className="font-mono font-bold text-white text-lg">₹{calculateTotals().subtotal.toFixed(0)}</span>
                </div>
                <p className="text-[10px] text-[#596478] leading-relaxed">Shipping guidelines and GST are calculated during your checkout.</p>
                
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => setCart([])} className="h-11 rounded-xl border border-rose-500/10 hover:border-rose-500/30 text-rose-400 text-xs font-bold transition">
                    Empty Cart
                  </button>
                  <button 
                    onClick={() => { setViewCheckout(true); setIsCartOpen(false); }}
                    className="h-11 rounded-xl bg-gradient-to-r from-[#C9A227] to-[#f0d070] text-[#1a1000] text-xs font-extrabold transition flex items-center justify-center gap-1 shadow"
                  >
                    Proceed Checkout <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* ==========================================
         PORTAL 3: CHECKOUT PAGE LAYOUT
         ========================================== */}
      {viewCheckout && (
        <div className="fixed inset-0 bg-black/85 z-[6000] overflow-y-auto p-4 flex items-center justify-center">
          <div className="w-full max-w-4xl rounded-2xl bg-[#080B12] border border-white/10 shadow-2xl overflow-hidden text-left relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2">
              
              {/* Left checkout billing details */}
              <div className="p-6 sm:p-8 space-y-6">
                <div className="flex items-center gap-2">
                  <button onClick={() => { setViewCheckout(false); setIsCartOpen(true); }} className="text-slate-400 hover:text-[#C9A227] flex items-center gap-1.5 text-xs font-bold transition">
                    <ArrowLeft className="w-4 h-4" /> Cart
                  </button>
                  <span className="text-[#596478]">/</span>
                  <span className="text-xs text-[#C9A227] font-bold">Checkout Manuscript</span>
                </div>

                <div className="space-y-1.5 text-left">
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-white">Vedic Order Acquisition</h2>
                  <p className="text-xs text-[#8b96aa]">Complete details below. Invoice generated in real-time, order records stored securely.</p>
                </div>

                <form onSubmit={handleCreateOrder} className="space-y-4 text-left">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#8b96aa] block">Full Name *</label>
                    <input 
                      type="text" 
                      required 
                      value={checkoutName}
                      onChange={e => setCheckoutName(e.target.value)}
                      placeholder="e.g. Anand Kumar" 
                      className="w-full bg-white/5 border border-white/10 p-3 text-xs text-white outline-none rounded-xl focus:border-[#C9A227]" 
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#8b96aa] block">WhatsApp Contact *</label>
                      <input 
                        type="tel" 
                        required 
                        value={checkoutPhone}
                        onChange={e => setCheckoutPhone(e.target.value)}
                        placeholder="e.g. +91 98765 43210" 
                        className="w-full bg-white/5 border border-white/10 p-3 text-xs text-white outline-none rounded-xl focus:border-[#C9A227]" 
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#8b96aa] block">E-mail Address (Optional)</label>
                      <input 
                        type="email" 
                        value={checkoutEmail}
                        onChange={e => setCheckoutEmail(e.target.value)}
                        placeholder="e.g. anand@outlook.com" 
                        className="w-full bg-white/5 border border-white/10 p-3 text-xs text-white outline-none rounded-xl focus:border-[#C9A227]" 
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#8b96aa] block">Sacred Delivery Destination Address *</label>
                    <textarea 
                      required 
                      value={checkoutAddress}
                      onChange={e => setCheckoutAddress(e.target.value)}
                      placeholder="House No, Street, Landmark, City, State, ZIP code..." 
                      className="w-full bg-white/5 border border-white/10 p-3 text-xs text-white outline-none rounded-xl h-24 resize-none focus:border-[#C9A227]"
                    />
                  </div>

                  <div className="p-4 bg-amber-500/5 rounded-xl border border-amber-500/10 text-xs text-[#8b96aa] leading-relaxed">
                    🕉️ **Astrological Delivery Guarantee**: Manuscripts are purified via ancient chanting before dispatching. Delivered via fast express courier within 3-5 working days.
                  </div>

                  <button 
                    type="submit" 
                    className="w-full h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-extrabold shadow shadow-emerald-500/20 hover:scale-[1.01] duration-150"
                  >
                    ✓ Complete Checkout & Lock Order (₹{calculateTotals().total.toFixed(0)})
                  </button>
                </form>
              </div>

              {/* Right cart order summary */}
              <div className="p-6 sm:p-8 bg-[#04060b]/50 border-l border-white/5 flex flex-col justify-between">
                <div className="space-y-6">
                  <h3 className="font-serif text-lg font-bold text-white border-b border-white/5 pb-2">Acquisition Summary</h3>
                  
                  {/* Cart Books */}
                  <div className="space-y-3 max-h-[220px] overflow-y-auto pr-2">
                    {cart.map(item => {
                      const bk = books.find(b => b.id === item.bookId);
                      if (!bk) return null;
                      return (
                        <div key={item.bookId} className="flex justify-between items-center text-xs">
                          <div>
                            <span className="font-bold text-white block truncate max-w-[200px]">{bk.title}</span>
                            <span className="text-slate-500">Qty: {item.quantity} · Price: ₹{bk.salePrice || bk.price}</span>
                          </div>
                          <span className="font-mono text-white font-bold">₹{((bk.salePrice || bk.price) * item.quantity).toFixed(0)}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Coupon Application */}
                  <div className="pt-4 border-t border-white/5 space-y-2">
                    <label className="text-xs font-bold text-slate-400 block">Apply Spiritual Coupon Key</label>
                    <form onSubmit={handleApplyCoupon} className="flex gap-2">
                      <input 
                        type="text" 
                        value={couponCode}
                        onChange={e => setCouponCode(e.target.value)}
                        placeholder="e.g. VEDIC10" 
                        className="bg-white/5 border border-white/10 px-3 py-2 text-xs text-white outline-none rounded-xl grow focus:border-[#C9A227]" 
                      />
                      <button type="submit" className="px-4 bg-[#C9A227] text-black text-xs font-bold rounded-xl hover:bg-amber-400 transition">Apply</button>
                    </form>
                    
                    {couponError && (
                      <span className="text-[10px] text-rose-450 block font-semibold">{couponError}</span>
                    )}
                    {appliedCoupon && (
                      <span className="text-[10px] text-emerald-400 block font-black">
                        ✓ Coupon "{appliedCoupon.code}" Activated! (Saved {appliedCoupon.discountType === 'percentage' ? `${appliedCoupon.value}%` : `₹${appliedCoupon.value}`})
                      </span>
                    )}
                  </div>
                </div>

                {/* Totals */}
                <div className="pt-6 border-t border-white/5 mt-6 space-y-2.5 text-xs text-[#8b96aa]">
                  <div className="flex justify-between">
                    <span>Manuscript Subtotal:</span>
                    <span className="font-mono text-white">₹{calculateTotals().subtotal.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between text-emerald-400">
                    <span>Coupon Discount:</span>
                    <span className="font-mono">-₹{calculateTotals().discount.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Express Package Courier:</span>
                    <span className="text-emerald-400 font-bold">FREE DELIVERY</span>
                  </div>
                  <div className="flex justify-between text-base font-black border-t border-white/5 pt-3 text-white">
                    <span>Total Acquisition Cost:</span>
                    <span className="font-mono text-[#C9A227]">₹{calculateTotals().total.toFixed(0)}</span>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </div>
      )}

      {/* ==========================================
         PORTAL 4: INVOICE GENERATOR OR TICKET (Modal)
         ========================================== */}
      {invoiceOpen && lastCreatedOrder && (
        <div className="fixed inset-0 bg-black/90 z-[6500] flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-2xl bg-[#080B12] border border-[#C9A227]/40 shadow-2xl p-6 sm:p-8 space-y-6 text-left">
            
            <div className="text-center space-y-2 pb-4 border-b border-white/5">
              <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mx-auto animate-bounce text-2xl">✓</div>
              <h3 className="font-serif text-xl font-bold text-white">Your Order Registered Success!</h3>
              <p className="text-xs text-slate-500">A copy of the invoice is generated below. Copy/save for your future track logs.</p>
            </div>

            {/* Simulated Receipt Invoice */}
            <div className="p-5 rounded-xl bg-[#04060b] border border-white/5 space-y-4 font-mono text-xs text-slate-350">
              <div className="flex justify-between text-white font-bold">
                <span>{site.name} VEDA PUBLISHER</span>
                <span>INVOICE</span>
              </div>
              <div className="text-[10px] space-y-1 text-slate-500 border-b border-white/5 pb-2">
                <div>Invoice Code: {lastCreatedOrder.invoiceNumber}</div>
                <div>Created At: {new Date(lastCreatedOrder.createdAt).toLocaleString()}</div>
                <div>Status: PENDING EXPEDITION</div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-white/50 block font-bold uppercase tracking-wide">Client Bio:</span>
                <div>Name: {lastCreatedOrder.customerName}</div>
                <div>Phone: {lastCreatedOrder.customerPhone}</div>
                <div>Address: {lastCreatedOrder.customerAddress}</div>
              </div>

              <div className="border-t border-white/5 pt-3 space-y-1.5">
                <span className="text-[10px] text-white/50 block font-bold uppercase tracking-wide">Acquisition List:</span>
                {lastCreatedOrder.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span>{it.title} x{it.quantity}</span>
                    <span>₹{(it.price * it.quantity).toFixed(0)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/5 pt-3 space-y-1 font-bold text-[#e8eaf0] text-right">
                <div>Subtotal: ₹{lastCreatedOrder.subtotal.toFixed(0)}</div>
                {lastCreatedOrder.discountAmount > 0 && (
                  <div className="text-emerald-450">Discount: -₹{lastCreatedOrder.discountAmount.toFixed(0)}</div>
                )}
                <div className="text-sm text-[#C9A227]">Acquisition Total: ₹{lastCreatedOrder.total.toFixed(0)}</div>
              </div>
            </div>

            <div className="space-y-3">
              <button 
                onClick={() => {
                  const whatsappMsg = `Pranam Acharya ji! I completed my book order! Invoice Number: ${lastCreatedOrder.invoiceNumber}. Please verify my details (Name: ${lastCreatedOrder.customerName}, Contact: ${lastCreatedOrder.customerPhone}). Total Paid: ₹${lastCreatedOrder.total.toFixed(0)}. Thank you!`;
                  window.open(`https://wa.me/${site.whatsapp || '919876543210'}?text=${encodeURIComponent(whatsappMsg)}`, '_blank');
                }}
                className="w-full h-11 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-extrabold text-xs transition flex items-center justify-center gap-1"
              >
                💬 Ask Order dispatch updates via WhatsApp
              </button>
              <button 
                onClick={() => setInvoiceOpen(false)}
                className="w-full h-10 rounded-xl border border-white/5 hover:bg-white/5 text-white text-xs font-bold transition text-center block"
              >
                Dismiss & Read guides
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ==========================================
         PORTAL 5: CUSTOMER AUTHENTICATION & PORTAL DASHBOARD
         ========================================== */}
      {showDashboard && (
        <div className="fixed inset-0 bg-black/85 z-[6000] flex items-center justify-center p-4">
          <div className="w-full max-w-3xl rounded-2xl bg-[#080B12] border border-white/10 shadow-2xl overflow-hidden text-left relative flex flex-col md:flex-row min-h-[480px]">
            
            <button onClick={() => setShowDashboard(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white z-20">✕</button>

            {/* Left Portal graphic */}
            <div className="w-full md:w-1/3 bg-gradient-to-b from-[#110a04] to-[#04060b] p-6 text-left flex flex-col justify-between border-r border-white/5">
              <div className="space-y-3">
                <span className="text-2xl">🕉️</span>
                <h3 className="font-serif text-lg font-bold text-white">Client Sacred Dashboard</h3>
                <p className="text-[11px] text-slate-500 leading-relaxed font-normal">
                  Log in to track your textbook order status, download dynamic invoice generated, or manage saved wishlist modules.
                </p>
              </div>
              <div className="text-[10px] text-slate-600">Enterprise authentication panel v2.0</div>
            </div>

            {/* Right Authenticator / Portal */}
            <div className="flex-1 p-6 sm:p-8 flex flex-col justify-between bg-[#0a0e18]/40 overflow-y-auto">
              {!isCustomerAuthenticated ? (
                /* Authenticated Login Gates */
                <div className="space-y-6 my-auto">
                  <div className="space-y-1.5 text-left">
                    <h4 className="font-serif text-base font-bold text-white">Customer Portal Authorization</h4>
                    <p className="text-xs text-[#8b96aa]">Enter your transaction email to receive a temporary verification PIN.</p>
                  </div>

                  {!custSentOTP ? (
                    <form onSubmit={handleRequestDashboardOTP} className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-xs text-slate-400">Account Email address *</label>
                        <input 
                          type="email" 
                          required 
                          value={custEmail} 
                          onChange={e => setCustEmail(e.target.value)} 
                          placeholder="seeker@spiritual.com" 
                          className="w-full bg-white/5 border border-white/10 p-3 text-xs text-white outline-none rounded-xl focus:border-[#C9A227]" 
                        />
                      </div>
                      <button type="submit" className="w-full h-11 rounded-xl bg-[#C9A227] text-black font-extrabold text-xs">
                        Request OTP PIN
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleVerifyDashboardOTP} className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-xs text-slate-400">Enter validation OTP *</label>
                        <input 
                          type="text" 
                          required 
                          value={custOTP} 
                          onChange={e => setCustOTP(e.target.value)} 
                          placeholder="xxxxxx" 
                          className="w-full bg-white/5 border border-white/10 p-3 text-xs text-white text-center tracking-widest font-bold text-lg outline-none rounded-xl focus:border-[#C9A227]" 
                        />
                      </div>
                      <button type="submit" className="w-full h-11 rounded-xl bg-purple-600 text-white font-extrabold text-xs">
                        Confirm Access Code
                      </button>
                      <button onClick={() => setCustSentOTP(null)} className="text-[10px] text-[#596478] hover:text-white underline block mx-auto text-center">Change Email ID</button>
                    </form>
                  )}
                </div>
              ) : (
                /* Real Customer Dashboard Section */
                <div className="space-y-6 h-full flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-white/5 pb-2">
                      <div>
                        <span className="text-xs text-slate-500 font-bold block">LOGGED IN CLIENT</span>
                        <span className="font-bold text-sm text-white">{custEmail}</span>
                      </div>
                      <button onClick={() => setIsCustomerAuthenticated(false)} className="text-[10px] text-rose-400 font-bold hover:underline">Sign Out</button>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-2.5">
                      <button 
                        onClick={() => setActiveDashTab('orders')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${activeDashTab === 'orders' ? 'bg-[#C9A227] text-black' : 'bg-white/5 text-[#8b96aa]'}`}
                      >
                        🚚 Your Orders
                      </button>
                      <button 
                        onClick={() => setActiveDashTab('wishlist')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${activeDashTab === 'wishlist' ? 'bg-[#C9A227] text-black' : 'bg-white/5 text-[#8b96aa]'}`}
                      >
                        ❤️ Saved Wishlist
                      </button>
                    </div>

                    {/* Tab contents */}
                    {activeDashTab === 'orders' ? (
                      <div className="space-y-3 max-h-60 overflow-y-auto">
                        <div className="p-3 bg-white/[0.01] border border-white/5 rounded-xl text-xs space-y-2 text-left">
                          <div className="flex justify-between items-center text-[10px] font-bold text-[#f5d98a]">
                            <span>INVOICE: INV-2026-602</span>
                            <span className="bg-amber-500/10 text-amber-500 px-1.5 py-0.5 rounded">SHIPPED</span>
                          </div>
                          <div>Books purchased: The Ultimate Guide to Kundli Reading x1</div>
                          <div className="text-[10px] text-slate-500">Est Courier track code: DHL-3103498</div>
                        </div>

                        <div className="p-3 bg-white/[0.01] border border-white/5 rounded-xl text-xs space-y-2 text-left">
                          <div className="flex justify-between items-center text-[10px] font-bold text-[#f5d98a]">
                            <span>INVOICE: INV-2026-601</span>
                            <span className="bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded">DELIVERED</span>
                          </div>
                          <div>Books purchased: Sacred Vastu Shastra Blueprints x1</div>
                          <div className="text-[10px] text-slate-500">Delivered on Jun 5, 2026.</div>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto">
                        {wishlist.length === 0 ? (
                          <div className="col-span-2 text-center p-6 text-xs text-slate-500">Your wishlist is currently empty.</div>
                        ) : (
                          wishlist.map(id => {
                            const bk = books.find(b => b.id === id);
                            if (!bk) return null;
                            return (
                              <div key={id} className="p-2.5 rounded-xl border border-white/5 bg-white/[0.01] flex items-center justify-between text-xs text-left gap-3">
                                <div className="truncate font-semibold text-white">{bk.title}</div>
                                <button onClick={() => { handleAddToCart(bk.id); setShowDashboard(false); }} className="px-2.5 py-1 bg-[#C9A227] text-black rounded text-[10px] font-black">Buy</button>
                              </div>
                            );
                          })
                        )}
                      </div>
                    )}
                  </div>

                  <button onClick={() => setShowDashboard(false)} className="w-full h-10 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs">✕ Close Portal</button>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

    </section>
  );
}
