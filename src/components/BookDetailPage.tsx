import React, { useState } from 'react';
import { ShoppingCart, MessageCircle, Heart, Share2, ArrowLeft, Send, CheckCircle2, Star, Check } from 'lucide-react';
import { Book } from '../types';

interface BookDetailPageProps {
  book: Book;
  allBooks: Book[];
  onBack: () => void;
  onAddToCart: (id: string) => void;
  onBuyNow: (id: string) => void;
  whatsappNumber: string;
}

export default function BookDetailPage({ 
  book, 
  allBooks = [], 
  onBack, 
  onAddToCart, 
  onBuyNow,
  whatsappNumber 
}: BookDetailPageProps) {
  const [activeImgIdx, setActiveImgIdx] = useState(0);
  const [copied, setCopied] = useState(false);
  
  // Local review simulation state
  const [reviewName, setReviewName] = useState('');
  const [reviewVal, setReviewVal] = useState(5);
  const [reviewMsg, setReviewMsg] = useState('');
  const [reviews, setReviews] = useState([
    { name: "Vikram Malhotra", rating: 5, date: "June 2, 2026", msg: "This book completely simplified Kundli analysis. The chapters on retrograding saturn and gemstone choices are incredibly accurate." },
    { name: "Pooja Hegde", rating: 5, date: "May 25, 2026", msg: "Fabulous reading style! Not overly heavy on technical mathematics but provides precise, actionable spiritual guidelines." }
  ]);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // Inquiry internal state
  const [inqName, setInqName] = useState('');
  const [inqPhone, setInqPhone] = useState('');
  const [inqMsg, setInqMsg] = useState('');
  const [inqDone, setInqDone] = useState(false);

  const imagesList = book.images && book.images.length > 0 ? book.images : [book.coverImage];

  const relatives = allBooks
    .filter(b => b.category === book.category && b.id !== book.id)
    .slice(0, 3);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleWhatsAppOrder = () => {
    const text = encodeURIComponent(`Pranam Acharya Ji, I want to order the manuscript: "${book.title}" (Price: ₹${book.salePrice || book.price}). Please share the UPI/Bank coordinates.`);
    window.open(`https://wa.me/${whatsappNumber}?text=${text}`, '_blank');
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName || !reviewMsg) return;
    const newRev = {
      name: reviewName,
      rating: reviewVal,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      msg: reviewMsg
    };
    setReviews([newRev, ...reviews]);
    setReviewSuccess(true);
    setReviewName('');
    setReviewMsg('');
    setTimeout(() => setReviewSuccess(false), 5000);
  };

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInqDone(true);
    setInqName('');
    setInqPhone('');
    setInqMsg('');
    setTimeout(() => setInqDone(false), 6000);
  };

  return (
    <div className="py-24 max-w-7xl mx-auto px-6 space-y-16 text-left animate-fadeInDown">
      {/* Navigation breadcrumb */}
      <button 
        onClick={onBack} 
        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8b96aa] hover:text-[#C9A227] transition-all cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" /> Return to Astro Book Store
      </button>

      {/* Main product columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Gallerized images block - Left (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="aspect-[3/4] w-full rounded-3xl bg-[#0a0e18] border border-white/5 overflow-hidden flex items-center justify-center relative">
            <img 
              src={imagesList[activeImgIdx]} 
              alt={book.title} 
              className="w-full h-full object-cover" 
              referrerPolicy="no-referrer"
            />
            {book.stock <= 5 && book.stock > 0 && (
              <span className="absolute top-4 left-4 bg-orange-500 text-white font-black text-[9px] uppercase px-2.5 py-0.5 rounded-full">
                Only {book.stock} Left in Gurukul!
              </span>
            )}
          </div>

          {/* Thumbnails list */}
          {imagesList.length > 1 && (
            <div className="flex gap-2">
              {imagesList.map((im, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImgIdx(idx)}
                  className={`w-20 h-20 rounded-xl overflow-hidden bg-[#0c0f1b] border-2 cursor-pointer transition-all ${
                    activeImgIdx === idx ? 'border-[#C9A227]' : 'border-white/5'
                  }`}
                >
                  <img src={im} alt={`${book.title} thumb ${idx}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Dynamic details - Right (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-2">
            <span className="text-xs uppercase font-extrabold text-[#C9A227] tracking-wider">{book.category}</span>
            <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-white leading-tight">{book.title}</h1>
            <div className="flex items-center gap-3 text-xs text-[#596478]">
              <span>By <b className="text-[#8b96aa]">{book.author}</b></span>
              <span className="h-3 w-[1px] bg-white/10" />
              <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-yellow-500 fill-current" /> 4.9 (45 Reviews)</span>
              <span className="h-3 w-[1px] bg-white/10" />
              <span className="text-emerald-500 font-bold">{book.status}</span>
            </div>
          </div>

          <div className="h-[1px] w-full bg-white/5" />

          {/* Pricing */}
          <div className="flex items-center gap-4">
            <div>
              <span className="text-[10px] text-[#596478] block">Gurukul Member Contribution</span>
              <div className="flex gap-2 items-baseline">
                {book.salePrice && <span className="text-base font-medium line-through text-[#596478]">₹{book.price}</span>}
                <span className="text-3xl font-mono font-black text-[#C9A227]">₹{book.salePrice || book.price}</span>
              </div>
            </div>
            {book.salePrice && (
              <span className="bg-emerald-500/10 text-emerald-400 font-black text-[10px] uppercase border border-emerald-500/25 px-2.5 py-1 rounded-lg">
                Save ₹{book.price - book.salePrice}!
              </span>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Book Abstract & Vedic Scope</h3>
            <p className="text-xs sm:text-sm text-[#8b96aa] leading-relaxed whitespace-pre-line">
              {book.desc} This masterpiece resolves modern hurdles using simplified chart interpretation formulas. Explores detailed horoscope transits, Sade Sati corrective prayers, and native directions.
            </p>
          </div>

          {/* Author Details block */}
          <div className="p-4 rounded-xl bg-white/[0.01] border border-white/5 flex gap-4 items-center">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#C9A227] to-[#f0d070] text-[#1a1000] font-serif font-black flex items-center justify-center text-lg shrink-0">
              K
            </div>
            <div className="text-left text-xs">
              <span className="text-[#C9A227] font-semibold block">About Author · Acharya TN Khurana</span>
              <p className="text-[#8b96aa] mt-0.5 leading-normal">
                Bhartiya Vidya Bhavan Gold Medalist. Published author of 12+ textbooks, regularly participating in Aaj Tak/Zee predictions.
              </p>
            </div>
          </div>

          {/* Buy actions & share */}
          <div className="space-y-3 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button 
                onClick={() => onAddToCart(book.id)}
                className="px-6 py-3.5 rounded-xl text-xs font-bold bg-[#0c101c] border border-[#C9A227]/30 text-[#C9A227] hover:bg-[#C9A227]/10 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4" /> Add To Shopping List
              </button>
              <button 
                onClick={() => onBuyNow(book.id)}
                className="px-6 py-3.5 rounded-xl text-xs font-black bg-gradient-to-r from-[#C9A227] to-[#f0d070] text-[#1a1000] hover:scale-[1.01] active:scale-[0.99] transition-transform text-center cursor-pointer"
              >
                Buy Now (Instant Invoice)
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:pt-1">
              <button
                onClick={handleWhatsAppOrder}
                className="px-4 py-3 rounded-xl text-xs font-bold bg-[#25D366]/10 border border-[#25D366]/25 text-[#25D366] hover:bg-[#25D366]/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" /> Order Quick on WhatsApp
              </button>
              
              <button
                onClick={handleShare}
                className="px-4 py-3 rounded-xl text-xs font-bold bg-white/5 border border-white/10 text-white hover:text-[#C9A227] hover:border-[#C9A227] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Share2 className="w-4 h-4" /> {copied ? 'Copied Url!' : 'Share Manuscript'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Seeker Reviews & Submit Review Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-10">
        
        {/* Customer Reviews block (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <h2 className="text-2xl font-serif font-black text-white">Seeker Experiences & Reviews</h2>
          <div className="space-y-4">
            {reviews.map((r, i) => (
              <div key={i} className="p-5 p-r rounded-xl bg-white/[0.01] border border-white/5 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-xs text-white">{r.name}</span>
                  <span className="text-[10px] text-[#596478]">{r.date}</span>
                </div>
                <div className="flex gap-1 text-yellow-400">
                  {[...Array(r.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <p className="text-xs text-[#8b96aa] leading-relaxed italic">
                  "{r.msg}"
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Add review form - Right (5 cols) OR Inquiry Form */}
        <div className="lg:col-span-5 space-y-6">
          {/* Add a Review */}
          <div className="p-6 rounded-2xl bg-[#0a0e18] border border-white/5 space-y-4">
            <h3 className="text-md font-serif font-bold text-white border-b border-white/5 pb-2">Publish Seeker Review</h3>
            {reviewSuccess ? (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-center text-[10px] font-bold">
                🕉️ Thank you! Your review has been logged.
              </div>
            ) : (
              <form onSubmit={handleAddReview} className="space-y-3 text-xs">
                <div>
                  <label className="block text-[10px] text-[#8b96aa] uppercase font-bold mb-1">Your Name</label>
                  <input 
                    type="text" 
                    value={reviewName} 
                    onChange={e => setReviewName(e.target.value)} 
                    placeholder="Siddharth Roy" 
                    className="form-input text-xs" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-[#8b96aa] uppercase font-bold mb-1">Star Assessment</label>
                  <select 
                    value={reviewVal} 
                    onChange={e => setReviewVal(Number(e.target.value))} 
                    className="form-select text-xs"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5 Stars)</option>
                    <option value={4}>⭐⭐⭐⭐ (4 Stars)</option>
                    <option value={3}>⭐⭐⭐ (3 Stars)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] text-[#8b96aa] uppercase font-bold mb-1">Feedback Context</label>
                  <textarea 
                    value={reviewMsg} 
                    onChange={e => setReviewMsg(e.target.value)} 
                    placeholder="Describe how reading this book affected you..." 
                    className="form-textarea h-24 text-xs" 
                    required 
                  />
                </div>
                <button type="submit" className="w-full h-10 rounded-xl bg-white/5 border border-white/10 hover:border-[#C9A227] hover:text-[#C9A227] text-white text-[10px] font-bold transition-all cursor-pointer">
                  Submit Experience
                </button>
              </form>
            )}
          </div>

          {/* Quick Inquiry Form */}
          <div className="p-6 rounded-2xl bg-[#0e1322] border border-white/5 space-y-4">
            <h3 className="text-md font-serif font-bold text-white border-b border-white/5 pb-2">Sacred Inquiry Now</h3>
            <p className="text-[10px] text-[#596478] leading-tight">
              Request author-signed copies or direct wholesale distribution catalogs regarding this manuscript.
            </p>
            {inqDone ? (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-center text-[10px] font-bold">
                🕉️ Inquiry listed beautifully in current CRM.
              </div>
            ) : (
              <form onSubmit={handleInquirySubmit} className="space-y-3 text-xs">
                <input 
                  type="text" 
                  value={inqName} 
                  onChange={e => setInqName(e.target.value)} 
                  placeholder="Your Name" 
                  className="form-input text-xs" 
                  required 
                />
                <input 
                  type="tel" 
                  value={inqPhone} 
                  onChange={e => setInqPhone(e.target.value)} 
                  placeholder="Phone Number" 
                  className="form-input text-xs" 
                  required 
                />
                <textarea 
                  value={inqMsg} 
                  onChange={e => setInqMsg(e.target.value)} 
                  placeholder="Ask regarding wholesale copies or custom signatures..." 
                  className="form-textarea h-20 text-xs" 
                />
                <button type="submit" className="w-full h-10 rounded-xl bg-gradient-to-r from-[#C9A227] to-[#f0d070] text-[#1a1000] text-[10px] font-black cursor-pointer">
                  Submit Book Inquiry
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Related Books Grid */}
      {relatives.length > 0 && (
        <div className="space-y-6 pt-10 border-t border-white/5">
          <h2 className="text-xl font-serif font-bold text-white">Related Spiritual Manuscripts</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatives.map(r => (
              <div 
                key={r.id} 
                className="p-4 rounded-xl bg-white/[0.01] border border-white/5 flex gap-4 hover:border-[#C9A227]/30 transition-all cursor-pointer"
                onClick={() => { onAddToCart(r.id); }}
              >
                <img src={r.coverImage} alt={r.title} className="w-16 h-22 object-cover rounded bg-[#080B12]" referrerPolicy="no-referrer" />
                <div className="flex flex-col justify-between">
                  <div>
                    <h4 className="font-serif font-medium text-white text-xs line-clamp-1">{r.title}</h4>
                    <span className="text-[9px] text-[#596478]">{r.category}</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#C9A227]">₹{r.price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
