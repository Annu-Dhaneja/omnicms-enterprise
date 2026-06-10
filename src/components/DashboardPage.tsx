import React, { useState, useEffect } from 'react';
import { User, ShieldCheck, ShoppingBag, Heart, ClipboardCheck, Lock, Landmark, PhoneIncoming, Compass, LogOut, CheckCircle2 } from 'lucide-react';
import { Book, Order, Lead } from '../types';
import Auth from './Auth';

interface DashboardPageProps {
  orders: Order[];
  books: Book[];
  wishlist: string[];
  inquiries: Lead[];
  onRemoveWish: (id: string) => void;
  onAddToCart: (id: string) => void;
}

export default function DashboardPage({ 
  orders = [], 
  books = [], 
  wishlist = [], 
  inquiries = [],
  onRemoveWish,
  onAddToCart
}: DashboardPageProps) {
  // Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Active dashboard tab state
  const [currTab, setCurrTab] = useState<'orders' | 'wishlist' | 'profile' | 'inquiries'>('orders');

  // Profile data
  const [profName, setProfName] = useState('Siddharth Roy');
  const [profEmail, setProfEmail] = useState('sid.roy@gmail.com');
  const [profPhone, setProfPhone] = useState('+91 99887 76655');
  const [profCity, setProfCity] = useState('New Delhi');
  const [profAddress, setProfAddress] = useState('Flat 401, Outer Circle, Connaught Place, New Delhi 110001');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Load from session or local state if present
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('acharya_seeker_user') || localStorage.getItem('acharya_seeker_user');
      if (stored) {
        const u = JSON.parse(stored);
        bindAuthenticatedSeeker(u);
      }
    } catch { }
  }, []);

  const bindAuthenticatedSeeker = (user: any) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    setProfName(user.name || '');
    setProfEmail(user.email || '');
    setProfPhone(user.phone || '');
    setProfCity(user.city || '');
    setProfAddress(user.address || '');
  };

  const handleAuthSuccess = (user: any) => {
    localStorage.setItem('acharya_seeker_user', JSON.stringify(user));
    bindAuthenticatedSeeker(user);
  };

  const handleLogOut = () => {
    localStorage.removeItem('acharya_seeker_user');
    sessionStorage.removeItem('acharya_seeker_user');
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);

    // If authenticated, we sync profile updates to the database!
    if (currentUser) {
      try {
        const res = await fetch('/api/crm/profile', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: currentUser.email,
            name: profName,
            phone: profPhone,
            city: profCity,
            address: profAddress
          })
        });
        if (res.ok) {
          const updated = await res.json();
          localStorage.setItem('acharya_seeker_user', JSON.stringify(updated.user));
          setCurrentUser(updated.user);
        }
      } catch (err) {
        console.warn('Network offline, profiling saved locally', err);
      }
    }

    setTimeout(() => setSaveSuccess(false), 4000);
  };

  // Filter dynamic elements by user context
  const targetEmailOrPhone = profPhone.trim().toLowerCase();
  const seekerOrders = orders.filter(o => 
    o.customerPhone.toLowerCase().includes(targetEmailOrPhone) || 
    o.customerEmail.toLowerCase().includes(targetEmailOrPhone)
  );

  const seekerInquiries = inquiries.filter(i => 
    i.phone.toLowerCase().includes(targetEmailOrPhone) || 
    i.email.toLowerCase().includes(targetEmailOrPhone)
  );

  const wishedBooks = books.filter(b => wishlist.includes(b.id));

  // Authentication Lock Layout
  if (!isAuthenticated) {
    return (
      <div className="py-24 max-w-md mx-auto px-6 text-left animate-fadeInDown">
        <Auth onAuthSuccess={handleAuthSuccess} />
      </div>
    );
  }

  return (
    <div className="py-24 max-w-7xl mx-auto px-6 space-y-12 text-left animate-fadeInDown">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#0a0e18] p-6 rounded-2xl border border-white/5">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#C9A227] to-[#7C5CFC] flex items-center justify-center text-4xl text-white">
            🧘
          </div>
          <div>
            <h1 className="font-serif text-2xl font-black text-white">{profName}</h1>
            <p className="text-[11px] text-[#596478]">Seeker Status: <b>Certified Devotee</b> (Phone: {profPhone})</p>
          </div>
        </div>

        <button 
          onClick={handleLogOut}
          className="text-xs font-bold text-red-500 hover:underline cursor-pointer bg-transparent border-none flex items-center gap-1"
        >
          <LogOut className="w-3.5 h-3.5" /> Logout Securely
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/5 pb-2">
        <button 
          onClick={() => setCurrTab('orders')}
          className={`px-4 py-2 text-xs font-bold transition-all relative cursor-pointer ${
            currTab === 'orders' ? 'text-[#C9A227]' : 'text-[#8b96aa]'
          }`}
        >
          My Sacred Orders ({seekerOrders.length})
          {currTab === 'orders' && <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-[#C9A227]" />}
        </button>

        <button 
          onClick={() => setCurrTab('wishlist')}
          className={`px-4 py-2 text-xs font-bold transition-all relative cursor-pointer ${
            currTab === 'wishlist' ? 'text-[#C9A227]' : 'text-[#8b96aa]'
          }`}
        >
          Account Wishlist ({wishedBooks.length})
          {currTab === 'wishlist' && <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-[#C9A227]" />}
        </button>

        <button 
          onClick={() => setCurrTab('inquiries')}
          className={`px-4 py-2 text-xs font-bold transition-all relative cursor-pointer ${
            currTab === 'inquiries' ? 'text-[#C9A227]' : 'text-[#8b96aa]'
          }`}
        >
          Chart Inquiries ({seekerInquiries.length})
          {currTab === 'inquiries' && <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-[#C9A227]" />}
        </button>

        <button 
          onClick={() => setCurrTab('profile')}
          className={`px-4 py-2 text-xs font-bold transition-all relative cursor-pointer ${
            currTab === 'profile' ? 'text-[#C9A227]' : 'text-[#8b96aa]'
          }`}
        >
          Delivery Addresses
          {currTab === 'profile' && <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-[#C9A227]" />}
        </button>
      </div>

      {/* Tab Panels */}
      <div className="space-y-4 pt-2">
        
        {/* ORDERS TAB */}
        {currTab === 'orders' && (
          <div className="space-y-4">
            {seekerOrders.length === 0 ? (
              <div className="text-center py-16 text-[#596478] bg-[#0a0e18] rounded-2xl border border-white/5">
                No orders registered under this seeker category.
              </div>
            ) : (
              seekerOrders.map(o => (
                <div key={o.id} className="p-6 rounded-2xl bg-[#0a0e18] border border-white/5 space-y-4 text-xs">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-white/5 pb-3">
                    <div className="space-y-1">
                      <div className="font-mono text-[10px] text-[#C9A227]">ORDER ID: {o.id}</div>
                      <span className="text-[10px] text-[#596478] block">Date: {new Date(o.createdAt).toLocaleDateString()}</span>
                    </div>

                    <div className="flex gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-[#C9A227]/10 text-[#C9A227] border border-[#C9A227]/20">
                        Invoice No: {o.invoiceNumber || 'N/A'}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold ${
                        o.status === 'Delivered' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-[#7C5CFC]/10 text-[#7C5CFC]'
                      }`}>
                        Courier: {o.status}
                      </span>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="divide-y divide-white/5">
                    {o.items.map((it, idx) => (
                      <div key={idx} className="py-2.5 flex justify-between">
                        <span>{it.title} <b className="text-[#596478]">x{it.quantity}</b></span>
                        <span className="font-mono text-white font-bold">₹{it.price * it.quantity}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-baseline pt-2 border-t border-white/5 text-base font-bold text-[#C9A227]">
                    <span>Invoiced Amount</span>
                    <span className="font-mono">₹{o.total}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* WISHLIST TAB */}
        {currTab === 'wishlist' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {wishedBooks.length === 0 ? (
              <div className="col-span-2 text-center py-16 text-[#596478] bg-[#0a0e18] rounded-2xl border border-white/5">
                Your wishlist ledger holds no manuscripts yet.
              </div>
            ) : (
              wishedBooks.map(b => (
                <div key={b.id} className="p-4 rounded-xl bg-[#0a0e18] border border-white/5 flex justify-between gap-4 items-center">
                  <div className="flex gap-4 items-center">
                    <img src={b.coverImage} alt={b.title} className="w-12 h-16 object-cover rounded bg-[#080B12]" referrerPolicy="no-referrer"/>
                    <div className="text-left space-y-1">
                      <h4 className="font-serif font-bold text-white text-sm line-clamp-1">{b.title}</h4>
                      <div className="font-mono text-[10px] text-[#C9A227]">₹{b.salePrice || b.price}</div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button 
                      onClick={() => onRemoveWish(b.id)}
                      className="text-red-500 hover:underline text-[10px] font-bold cursor-pointer"
                    >
                      Remove
                    </button>
                    <button 
                      onClick={() => onAddToCart(b.id)}
                      className="px-2.5 py-1.5 rounded-lg bg-[#C9A227] text-[#1a1000] text-[9.5px] font-black cursor-pointer"
                    >
                      Add Cart
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* INQUIRIES TAB */}
        {currTab === 'inquiries' && (
          <div className="space-y-4">
            {seekerInquiries.length === 0 ? (
              <div className="text-center py-16 text-[#596478] bg-[#0a0e18] rounded-2xl border border-white/5">
                No Horoscope or Vastu chart registrations submitted by this profile.
              </div>
            ) : (
              seekerInquiries.map((inq, idx) => (
                <div key={inq.id || idx} className="p-5 rounded-2xl bg-[#0a0e18] border border-[#C9A227]/10 space-y-4 text-xs">
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <span className="font-bold text-white text-sm">{inq.service} Inquiry Request</span>
                    <span className="font-mono text-[10px] text-[#C9A227]">{new Date(inq.createdAt).toLocaleDateString()}</span>
                  </div>

                  {inq.date && (
                    <div className="grid grid-cols-2 gap-4 bg-white/[0.01] p-3 rounded-xl border border-white/5 text-[10.5px]">
                      <div>Birth Date: <b className="text-white">{inq.date}</b></div>
                      <div>Birth Time: <b className="text-white">{inq.time || 'Birth Hour'}</b></div>
                      <div className="col-span-2">Place of Birth: <b className="text-white">{inq.place || 'Unknown'}</b></div>
                    </div>
                  )}

                  <div className="p-3 bg-[#080B12] rounded-xl text-[11px] text-[#8b96aa] leading-relaxed italic border border-white/5">
                    "Your query: {inq.message}"
                  </div>

                  <div className="flex justify-between items-center bg-[#C9A227]/5 p-3 rounded-xl border border-[#C9A227]/10">
                    <span className="font-semibold text-[#8b96aa]">Coordinator Status Assessment:</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold uppercase text-[9px]">
                      {inq.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* PROFILE TAB */}
        {currTab === 'profile' && (
          <div className="max-w-2xl bg-[#0a0e18] border border-white/5 p-6 rounded-2xl">
            {saveSuccess && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-center text-[10px] font-bold mb-4">
                🕉️ Contact profile information updated successfully in local session.
              </div>
            )}

            <form onSubmit={handleProfileSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#8b96aa] mb-1.5">Registered Full Name</label>
                  <input type="text" value={profName} onChange={e => setProfName(e.target.value)} className="form-input" required />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#8b96aa] mb-1.5">Traced Mobile Phone</label>
                  <input type="text" value={profPhone} onChange={e => setProfPhone(e.target.value)} className="form-input" disabled />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-[#8b96aa] mb-1.5">Security Email ID</label>
                <input type="email" value={profEmail} onChange={e => setProfEmail(e.target.value)} className="form-input" required />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="col-span-2">
                  <label className="block text-[10px] uppercase font-bold text-[#8b96aa] mb-1.5">Default Shipping Address</label>
                  <input type="text" value={profAddress} onChange={e => setProfAddress(e.target.value)} className="form-input" required />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#8b96aa] mb-1.5">Recipient City</label>
                  <input type="text" value={profCity} onChange={e => setProfCity(e.target.value)} className="form-input" required />
                </div>
              </div>

              <button type="submit" className="px-4 py-2.5 rounded-xl bg-[#C9A227] text-[#1a1000] font-black text-xs cursor-pointer">
                Save Profile Coordinates
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
