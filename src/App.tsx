import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Settings, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  AlertCircle,
  MessageCircle,
  ChevronUp,
  X,
  Send,
  Instagram, 
  Twitter, 
  Facebook, 
  Youtube, 
  Linkedin, 
  AtSign,
  Star
} from 'lucide-react';
import { BackupData, Lead, Service, Order, PageId, Book } from './types';
import { getCMSData, saveCMSData, getLeads, saveLeads, logActivity } from './utils';

// Import Layout / Navigation
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import WhyChooseUs from './components/WhyChooseUs';
import Horoscope from './components/Horoscope';
import Panchang from './components/Panchang';
import AIKundli from './components/AIKundli';
import Reports from './components/Reports';
import Testimonials from './components/Testimonials';
import Blog from './components/Blog';
import FAQ from './components/FAQ';
import Contact from './components/Contact';
import BookingModal from './components/BookingModal';
import AdminPanel from './components/AdminPanel';

// Import New Dedicated Subpages
import AboutPage from './components/AboutPage';
import ServicesPage from './components/ServicesPage';
import InquiryPage from './components/InquiryPage';
import BooksPage from './components/BooksPage';
import BookDetailPage from './components/BookDetailPage';
import CartPage from './components/CartPage';
import CheckoutPage from './components/CheckoutPage';
import DashboardPage from './components/DashboardPage';
import BlogPage from './components/BlogPage';
import ToolkitPage from './components/ToolkitPage';

export default function App() {
  // Routing State
  const [currentPage, setCurrentPage] = useState<PageId>(() => {
    const path = window.location.pathname.toLowerCase();
    const validPages: PageId[] = ['home', 'about', 'services', 'books', 'blog', 'inquiry', 'cart', 'checkout', 'dashboard', 'contact', 'toolkit'];
    const pathName = path.replace('/', '');
    if (validPages.includes(pathName as PageId)) {
      return pathName as PageId;
    }
    return 'home';
  });
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.toLowerCase();
      
      // Handle admin panel popstate
      if (path.startsWith('/admin')) {
        setIsAdminOpen(true);
      } else {
        setIsAdminOpen(false);
        const validPages: PageId[] = ['home', 'about', 'services', 'books', 'blog', 'inquiry', 'cart', 'checkout', 'dashboard', 'contact', 'toolkit'];
        const pathName = path.replace('/', '');
        if (validPages.includes(pathName as PageId)) {
          setCurrentPage(pathName as PageId);
        } else {
          setCurrentPage('home');
        }
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Administrative State
  const [cmsData, setCmsData] = useState<BackupData>(() => getCMSData());
  const [isAdminOpen, setIsAdminOpen] = useState(() => {
    return window.location.pathname.toLowerCase().startsWith('/admin');
  });
  const [selectedBookingService, setSelectedBookingService] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [socialLinks, setSocialLinks] = useState({
    instagram: '', x: '', facebook: '', youtube: '', linkedin: '', threads: ''
  });

  // WhatsApp Widget UI Toggles
  const [isWaWidgetOpen, setIsWaWidgetOpen] = useState(false);

  // Local storage cart & wish lists
  const [cart, setCart] = useState<{ bookId: string; quantity: number }[]>(() => {
    try {
      const saved = localStorage.getItem('acharya_shopping_cart');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('acharya_shopping_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const [leads, setLeads] = useState<Lead[]>(() => {
    try {
      const saved = localStorage.getItem('acharya_leads_data');
      return saved ? JSON.parse(saved) : getLeads();
    } catch { return []; }
  });

  // Synchronize CSS Theme Variables with document root
  useEffect(() => {
    const r = document.documentElement;
    const { theme } = cmsData;
    
    r.style.setProperty('--color-primary', theme.primaryColor);
    r.style.setProperty('--color-secondary', theme.secondaryColor);
    
    if (theme.mode === 'light') {
      r.style.backgroundColor = '#f8fafc';
      r.style.color = '#0f172a';
      document.body.style.backgroundColor = '#f8fafc';
      document.body.style.color = '#0f172a';
    } else {
      r.style.backgroundColor = '#080B12';
      r.style.color = '#e8eaf0';
      document.body.style.backgroundColor = '#080B12';
      document.body.style.color = '#e8eaf0';
    }
  }, [cmsData.theme]);

  // Dynamic SEO Injection on Page Route Swaps
  useEffect(() => {
    if (!cmsData.pageSeo) return;
    const activeSeo = cmsData.pageSeo.find(s => s.pageId === currentPage);
    if (activeSeo) {
      document.title = activeSeo.title;
      
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', activeSeo.description);

      let metaKey = document.querySelector('meta[name="keywords"]');
      if (!metaKey) {
        metaKey = document.createElement('meta');
        metaKey.setAttribute('name', 'keywords');
        document.head.appendChild(metaKey);
      }
      metaKey.setAttribute('content', activeSeo.keywords);

      // Clean/inject schema script
      const oldScript = document.getElementById('acharya-dynamic-schema');
      if (oldScript) oldScript.remove();

      if (activeSeo.schemaMarkup) {
        const script = document.createElement('script');
        script.id = 'acharya-dynamic-schema';
        script.type = 'application/ld+json';
        script.innerHTML = activeSeo.schemaMarkup;
        document.head.appendChild(script);
      }
    }
  }, [currentPage, cmsData.pageSeo]);

  // Synchronize dynamic store states on refresh
  const syncStoreData = async () => {
    try {
      const [resBooks, resCoupons, resOrders] = await Promise.all([
        fetch('/api/books').then(r => r.json()),
        fetch('/api/coupons').then(r => r.json()),
        fetch('/api/orders').then(r => r.json())
      ]);

      setCmsData(prev => ({
        ...prev,
        books: resBooks,
        coupons: resCoupons,
        orders: resOrders
      }));
    } catch {
      console.warn("Unable to dynamically synchronize API backend catalogues, using fallback caches.");
    }
  };

  useEffect(() => {
    syncStoreData();
    // Fetch Social Media
    fetch('/api/settings/social')
      .then(res => res.json())
      .then(data => {
        if (!data.error) setSocialLinks(data);
      })
      .catch(() => {});
  }, []);

  // Save modified CMS layouts
  const handleSaveCMS = async (newData: BackupData) => {
    setCmsData(newData);
    saveCMSData(newData);

    try {
      await fetch('/api/sync-books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          books: newData.books || [],
          coupons: newData.coupons || [],
          orders: newData.orders || []
        })
      });
    } catch {
      console.warn("API sync fallback offline.");
    }

    setSuccessToast("🕉️ Enterprise content state updated successfully!");
    setTimeout(() => setSuccessToast(null), 3000);
  };

  // Capture astrological intake inquiries
  const handleInquirySubmit = async (
    name: string, 
    phone: string, 
    email: string, 
    service: string, 
    date: string, 
    place: string, 
    msg: string
  ) => {
    const freshLead: Lead = {
      id: `lead_${Date.now()}`,
      name,
      phone,
      email: email || "seeker@spiritual.com",
      service: service || "General Counsel",
      date: date || "",
      place: place || "",
      message: msg,
      status: "New",
      notes: "Direct contact form lead submission.",
      createdAt: new Date().toISOString()
    };

    // Attempt real backend capture (leads database update & Nodemailer alert triggers)
    try {
      await fetch('/api/crm/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          phone,
          email: email || "seeker@spiritual.com",
          service: service || "General Counsel",
          date: date || "",
          place: place || "",
          message: msg,
          notes: "Direct contact form lead submission.",
          source: 'Inquiry'
        })
      });
    } catch (e) {
      console.warn('Backend offline, registered locally.', e);
    }

    const nextLeads = [freshLead, ...leads];
    setLeads(nextLeads);
    saveLeads(nextLeads);
    logActivity("LEAD INFLOW DETECTED", `New client intake: ${name} (${phone})`);

    setSuccessToast(`🕉️ Pranam ${name}! Inquiry registered. Acharya's council will contact you shortly.`);
    setTimeout(() => setSuccessToast(null), 5000);
  };

  // Store Cart Actions
  const handleAddToCart = (id: string) => {
    setCart(prev => {
      const match = prev.find(i => i.bookId === id);
      let updated;
      if (match) {
        updated = prev.map(i => i.bookId === id ? { ...i, quantity: i.quantity + 1 } : i);
      } else {
        updated = [...prev, { bookId: id, quantity: 1 }];
      }
      localStorage.setItem('acharya_shopping_cart', JSON.stringify(updated));
      return updated;
    });

    setSuccessToast("🕉️ Manuscript added to cart ledger!");
    setTimeout(() => setSuccessToast(null), 3000);
  };

  const handleUpdateQty = (id: string, qty: number) => {
    if (qty <= 0) {
      handleRemoveItem(id);
      return;
    }
    setCart(prev => {
      const updated = prev.map(i => i.bookId === id ? { ...i, quantity: qty } : i);
      localStorage.setItem('acharya_shopping_cart', JSON.stringify(updated));
      return updated;
    });
  };

  const handleRemoveItem = (id: string) => {
    setCart(prev => {
      const updated = prev.filter(i => i.bookId !== id);
      localStorage.setItem('acharya_shopping_cart', JSON.stringify(updated));
      return updated;
    });
  };

  const handlePostComment = (blogId: string, author: string, comment: string) => {
    const updatedBlogs = cmsData.blog.blogs.map(b => {
      if (b.id === blogId) {
        const comments = b.comments || [];
        return {
          ...b,
          comments: [...comments, { author, comment, text: comment }]
        };
      }
      return b;
    });

    handleSaveCMS({
      ...cmsData,
      blog: {
        ...cmsData.blog,
        blogs: updatedBlogs
      }
    });
  };

  const handleOrderCompleted = async (newOrder: Order) => {
    // Attempt real database order log
    try {
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder)
      });
    } catch {}

    const updatedOrders = [newOrder, ...(cmsData.orders || [])];
    handleSaveCMS({ ...cmsData, orders: updatedOrders });
    setCart([]);
    localStorage.removeItem('acharya_shopping_cart');

    setSuccessToast(`🕉️ Sacred Order ${newOrder.invoiceNumber} recorded! Check your portal.`);
    setTimeout(() => setSuccessToast(null), 6000);
    setCurrentPage('dashboard');
  };

  const handleRemoveWish = (id: string) => {
    const updated = wishlist.filter(wi => wi !== id);
    setWishlist(updated);
    localStorage.setItem('acharya_shopping_wishlist', JSON.stringify(updated));
  };

  const handleBookingConfirm = async (booking: Partial<Lead>) => {
    const fullBooking: Lead = {
      id: `lead_${Date.now()}`,
      name: booking.name || "Anonymous Seeker",
      phone: booking.phone || "",
      email: booking.email || "seeker@spiritual.com",
      service: booking.service || "Astro Forecast",
      date: booking.date || "",
      place: booking.place || "",
      message: booking.message || "",
      bookingDate: booking.bookingDate,
      bookingTime: booking.bookingTime,
      amountPaid: booking.amountPaid || "Free",
      status: "New",
      notes: `Confirmed scheduled appointment for ${booking.bookingDate} at ${booking.bookingTime}`,
      createdAt: new Date().toISOString()
    };

    // Attempt real database booking record addition (including nodemailer confirmation alerts!)
    try {
      await fetch('/api/crm/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: booking.name || "Anonymous Seeker",
          phone: booking.phone || "",
          email: booking.email || "seeker@spiritual.com",
          service: booking.service || "Astro Forecast",
          date: booking.date || "",
          place: booking.place || "",
          message: booking.message || "",
          bookingDate: booking.bookingDate,
          bookingTime: booking.bookingTime,
          amountPaid: booking.amountPaid || "Free",
          notes: `Confirmed scheduled appointment for ${booking.bookingDate} at ${booking.bookingTime}`,
          source: 'Service'
        })
      });
    } catch (e) {
      console.warn('Fallback local state updated.', e);
    }

    const nextLeads = [fullBooking, ...leads];
    setLeads(nextLeads);
    saveLeads(nextLeads);

    setSuccessToast(`✨ Consult scheduled on ${booking.bookingDate} at ${booking.bookingTime}!`);
    setTimeout(() => { setSuccessToast(null); }, 6000);
    setSelectedBookingService(null);
  };

  // Nav routing callback
  const handlePageNavigate = (page: PageId) => {
    if (page === 'books') {
      setSelectedBookId(null);
    }
    setCurrentPage(page);
    window.history.pushState({}, '', page === 'home' ? '/' : `/${page}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Render Conditional Page Layouts
  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'about':
        return (
          <AboutPage 
            about={cmsData.about} 
            site={cmsData.site} 
          />
        );

      case 'services':
        return (
          <ServicesPage 
            services={cmsData.services} 
            testimonials={cmsData.testimonials}
            faqs={cmsData.faqs}
            whatsappNumber={cmsData.whatsapp?.number || cmsData.site.whatsapp}
            onOpenBooking={(name) => setSelectedBookingService(name || '')}
            onSubmitInquiry={(n, ph, em, s, m) => handleInquirySubmit(n, ph, em, s, '', '', m)}
          />
        );

      case 'books':
        if (selectedBookId) {
          const matchedBook = (cmsData.books || []).find(b => b.id === selectedBookId || b.slug === selectedBookId);
          if (matchedBook) {
            return (
              <BookDetailPage 
                book={matchedBook} 
                allBooks={cmsData.books || []} 
                onAddToCart={handleAddToCart} 
                onBuyNow={(id) => { handleAddToCart(id); setCurrentPage('cart'); }} 
                onBack={() => setSelectedBookId(null)} 
                whatsappNumber={cmsData.whatsapp?.number || cmsData.site.whatsapp}
              />
            );
          }
        }
        return (
          <BooksPage 
            books={cmsData.books || []} 
            onSelectBook={setSelectedBookId} 
            onAddToCart={handleAddToCart} 
          />
        );

      case 'blog':
        return (
          <BlogPage 
            blogData={cmsData.blog} 
            onPostComment={handlePostComment} 
          />
        );

      case 'inquiry':
        return (
          <InquiryPage 
            services={cmsData.services} 
            onSubmitInquiry={handleInquirySubmit} 
          />
        );

      case 'cart':
        return (
          <CartPage 
            cart={cart} 
            books={cmsData.books || []} 
            coupons={cmsData.coupons || []} 
            onUpdateQty={handleUpdateQty} 
            onRemoveItem={handleRemoveItem} 
            onProceedToCheckout={() => setCurrentPage('checkout')} 
            onBackToStore={() => { setCurrentPage('books'); setSelectedBookId(null); }} 
          />
        );

      case 'checkout':
        return (
          <CheckoutPage 
            cart={cart} 
            books={cmsData.books || []} 
            onOrderCompleted={handleOrderCompleted} 
            onBackToCart={() => setCurrentPage('cart')} 
          />
        );

      case 'dashboard':
        return (
          <DashboardPage 
            orders={cmsData.orders || []} 
            books={cmsData.books || []} 
            wishlist={wishlist} 
            inquiries={leads} 
            onRemoveWish={handleRemoveWish} 
            onAddToCart={handleAddToCart} 
          />
        );

      case 'contact':
        return (
          <Contact 
            site={cmsData.site} 
            info={cmsData.contactInfo} 
            mapConfig={cmsData.googleMaps} 
            onSubmitInquiry={handleInquirySubmit} 
          />
        );

      case 'toolkit':
        return (
          <ToolkitPage 
            onOpenBooking={(name) => setSelectedBookingService(name || '')}
          />
        );

      case 'home':
      default:
        // Render precise homepage list segments
        return (
          <div className="space-y-0">
            {cmsData.sectionOrders
              .filter(sec => sec.visible)
              .map(sec => {
                switch (sec.id) {
                  case 'hero':
                    return <div key={sec.id}><Hero content={cmsData.hero} site={cmsData.site} onOpenBooking={() => setSelectedBookingService('')} onNavigate={(target) => handlePageNavigate(target as PageId)} /></div>;
                  case 'about':
                    return <div key={sec.id}><About content={cmsData.about} site={cmsData.site} onOpenBooking={() => setSelectedBookingService('')} onOpenWhatsApp={() => window.open(`https://wa.me/${cmsData.site.whatsapp}`, '_blank')} /></div>;
                  case 'services':
                    return <div key={sec.id}><Services services={cmsData.services} onOpenBooking={(s) => setSelectedBookingService(s || '')} /></div>;
                  case 'why':
                    return <div key={sec.id}><WhyChooseUs cards={cmsData.whyCards} /></div>;
                  case 'horoscope':
                    return <div key={sec.id}><Horoscope zodiac={cmsData.zodiac} onOpenBooking={(s) => setSelectedBookingService(s || '')} /></div>;
                  case 'panchang':
                    return <div key={sec.id}><Panchang panchang={cmsData.panchang} /></div>;
                  case 'ai-kundli':
                    return <div key={sec.id}><AIKundli /></div>;
                  case 'reports':
                    return <div key={sec.id}><Reports reports={cmsData.reports} onOpenBooking={(s) => setSelectedBookingService(s || '')} /></div>;
                  case 'testimonials':
                    return <div key={sec.id}><Testimonials testimonials={cmsData.testimonials} /></div>;
                  case 'blog':
                    return <div key={sec.id}><Blog posts={cmsData.blog} /></div>;
                  case 'faq':
                    return <div key={sec.id}><FAQ faqs={cmsData.faqs} /></div>;
                  case 'contact':
                    return <div key={sec.id}><Contact site={cmsData.site} info={cmsData.contactInfo} mapConfig={cmsData.googleMaps} onSubmitInquiry={handleInquirySubmit} /></div>;
                  default:
                    return null;
                }
              })
            }
          </div>
        );
    }
  };

  // WhatsApp Multi-Department Link Composer
  const handleWaDeptClick = (num: string, customMsg: string) => {
    const url = `https://wa.me/${num.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(customMsg)}`;
    window.open(url, '_blank');
    setIsWaWidgetOpen(false);
  };

  const totalCartCount = cart.reduce((acc, current) => acc + current.quantity, 0);

  return (
    <div className="min-h-screen relative flex flex-col transition-colors duration-300">
      
      {/* Dynamic Success Toast */}
      {successToast && (
        <div className="fixed bottom-6 left-6 max-w-sm bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl p-4 shadow-2xl z-[5001] flex items-start gap-3 border border-emerald-400 animate-fadeInDown text-left">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="text-xs font-semibold">{successToast}</div>
        </div>
      )}

      {/* Floating CMS launcher gear */}
      <button 
        onClick={() => setIsAdminOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-[#C9A227] to-[#f0d070] text-[#1a1000] shadow-[0_4px_20px_rgba(201,162,39,0.4)] z-[4900] flex items-center justify-center hover:scale-105 transform active:scale-95 cursor-pointer hover:animate-spin"
        title="Open CMS Administrator Panel"
      >
        <Settings className="w-6 h-6 shrink-0" />
      </button>

      {/* Primary Routing Navigation Header */}
      <Header 
        site={cmsData.site} 
        theme={cmsData.theme}
        activePage={currentPage}
        onNavigate={handlePageNavigate}
        onOpenBooking={() => setSelectedBookingService('')} 
        onOpenDashboard={() => handlePageNavigate('dashboard')} 
        cartCount={totalCartCount}
      />

      {/* Content Rendering Stage */}
      <main className="flex-1 pt-12 md:pt-16">
        {renderCurrentPage()}
      </main>

      {/* Dynamic Styled Footer */}
      <footer className="bg-[#04060b] border-t border-white/5 py-16 relative z-10 text-left">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="logo-emblem" style={{ width: '32px', height: '32px', fontSize: '14px' }}>K</div>
              <div className="font-serif text-lg font-bold text-white">{cmsData.site.name}</div>
            </div>
            <p className="text-xs text-[#596478] leading-relaxed">
              Merging cosmic predictive formulas with modern-day psychological advice to steer souls safely through transitions.
            </p>
            {/* SOCIAL MEDIA LINKS */}
            <div className="flex items-center gap-4 pt-2">
              {socialLinks.instagram && <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-[#596478] hover:text-[#C9A227] transition-colors"><Instagram className="w-4 h-4" /></a>}
              {socialLinks.x && <a href={socialLinks.x} target="_blank" rel="noopener noreferrer" className="text-[#596478] hover:text-[#C9A227] transition-colors"><svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/></svg></a>}
              {socialLinks.facebook && <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-[#596478] hover:text-[#C9A227] transition-colors"><Facebook className="w-4 h-4" /></a>}
              {socialLinks.youtube && <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="text-[#596478] hover:text-[#C9A227] transition-colors"><Youtube className="w-4 h-4" /></a>}
              {socialLinks.linkedin && <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-[#596478] hover:text-[#C9A227] transition-colors"><Linkedin className="w-4 h-4" /></a>}
              {socialLinks.threads && <a href={socialLinks.threads} target="_blank" rel="noopener noreferrer" className="text-[#596478] hover:text-[#C9A227] transition-colors"><svg className="w-4 h-4 fill-current" viewBox="0 0 192 192"><path d="M141.537 88.9883C140.71 88.5919 139.87 88.2104 139.019 87.8451C137.537 60.5382 122.616 44.905 97.5619 44.745C97.4484 44.7443 97.3355 44.7443 97.222 44.7443C82.2364 44.7443 69.7731 51.1409 62.102 62.7807L75.881 72.2328C81.6116 63.5383 90.6052 61.6848 97.2286 61.6848C97.3051 61.6848 97.3819 61.6848 97.4576 61.6855C105.707 61.7381 111.932 64.1366 115.961 68.814C118.893 72.2193 120.854 76.925 121.825 82.8638C114.511 81.6207 106.601 81.2385 98.145 81.7233C74.3247 83.0954 59.0111 96.9879 60.0396 116.292C60.5615 126.084 65.4397 134.508 73.775 140.011C80.8224 144.663 89.899 146.938 99.3323 146.423C111.79 145.74 121.563 140.987 128.381 132.296C133.559 125.696 136.834 117.143 138.28 106.366C144.217 109.949 148.617 114.664 151.047 120.332C155.179 129.967 155.42 145.8 142.501 158.708C131.182 170.016 117.576 174.908 97.0135 175.059C74.2042 174.89 56.9538 167.575 45.7381 153.317C35.2355 139.966 29.8077 120.682 29.6052 96C29.8077 71.3178 35.2355 52.0336 45.7381 38.6827C56.9538 24.4249 74.2039 17.11 97.0132 16.9405C119.988 17.1113 137.539 24.4614 149.184 38.788C154.894 45.8136 159.199 54.6488 162.037 64.9503L178.184 60.6422C174.744 47.9622 169.331 37.0357 161.965 27.974C147.036 9.60668 125.202 0.195148 97.0695 0H96.9569C68.8816 0.19447 47.2921 9.6418 32.7883 28.0793C19.8819 44.4864 13.2244 67.3157 13.0007 95.9325L13 96L13.0007 96.0675C13.2244 124.684 19.8819 147.514 32.7883 163.921C47.2921 182.358 68.8816 191.806 96.9569 192H97.0695C122.03 191.827 139.624 185.292 154.118 170.811C173.081 151.866 172.51 128.119 166.26 113.541C161.776 103.087 153.227 94.5962 141.537 88.9883ZM98.4405 129.507C88.0005 130.095 77.1544 125.409 76.6196 115.372C76.2232 107.93 81.9158 99.626 99.0812 98.6368C101.047 98.5234 102.976 98.468 104.871 98.468C111.106 98.468 116.939 99.0737 122.242 100.233C120.264 124.935 108.662 128.946 98.4405 129.507Z"/></svg></a>}
            </div>
          </div>

          <div className="space-y-3">
            <div className="text-xs text-white font-bold uppercase tracking-wider">Useful Chapters</div>
            <div className="flex flex-col gap-2 text-xs text-[#8b96aa]">
              <button onClick={() => handlePageNavigate('about')} className="hover:text-[#C9A227] transition-all text-left bg-transparent border-0 cursor-pointer p-0">About Acharya</button>
              <button onClick={() => handlePageNavigate('services')} className="hover:text-[#C9A227] transition-all text-left bg-transparent border-0 cursor-pointer p-0">Astro Solutions & Pujas</button>
              <button onClick={() => handlePageNavigate('books')} className="hover:text-[#C9A227] transition-all text-left bg-transparent border-0 cursor-pointer p-0">Transit Book Manuscripts</button>
              <button onClick={() => handlePageNavigate('blog')} className="hover:text-[#C9A227] transition-all text-left bg-transparent border-0 cursor-pointer p-0">Wisdom Blog Transits</button>
            </div>
          </div>

          <div className="space-y-3">
            <div className="text-xs text-white font-bold uppercase tracking-wider">Consulting Office</div>
            <div className="space-y-2 text-xs text-[#8b96aa]">
              <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-[#C9A227]" /> {cmsData.site.phone}</div>
              <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-[#C9A227]" /> {cmsData.site.email}</div>
              <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-[#C9A227]" /> {cmsData.contactInfo.address}</div>
            </div>
          </div>

          <div className="space-y-3 font-serif italic text-[#596478]">
            <div className="text-xs text-white font-bold uppercase tracking-wider not-italic">Sacred Disclaimer</div>
            <p className="text-[10px] leading-relaxed">
              Astrological calculations are interpretations based on the ancient lunar calendars. Individual outcomes can transit. Remedial therapies can't substitute certified counseling.
            </p>
          </div>

        </div>

        <div className="border-t border-white/5 mt-10 pt-6 text-center text-[10px] text-[#596478] max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>© {new Date().getFullYear()} {cmsData.site.name}. All Rights Reserved. Acharya TN Khurana Astrological Council.</div>
          <div className="flex gap-4">
            <button onClick={() => handlePageNavigate('home')} className="hover:text-white transition bg-transparent border-0 cursor-pointer">Terms of Worship</button>
            <button onClick={() => handlePageNavigate('dashboard')} className="hover:text-white transition bg-transparent border-0 cursor-pointer">Seers Portal</button>
            <button onClick={() => handlePageNavigate('inquiry')} className="hover:text-white transition bg-transparent border-0 cursor-pointer">Birth Intake Sheet</button>
          </div>
        </div>
      </footer>

      {/* WHATSAPP MULTI-DEPARTMENT FLOATING CONTROLLER WIDGET */}
      {cmsData.whatsapp?.enabled && (
        <div className="fixed bottom-24 right-6 z-[4900] text-xs">
          
          {/* Expanded Departments Dialog */}
          {isWaWidgetOpen && (
            <div className="mb-3 w-72 rounded-2xl bg-[#0a0e18] border border-[#C9A227]/20 p-4 shadow-2xl animate-fadeInDown space-y-3 text-left">
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <div>
                  <h4 className="font-serif font-black text-white text-sm">Vedic Support Council</h4>
                  <span className="text-[9.5px] text-emerald-400 font-semibold block">● Online Now to Resolve Queries</span>
                </div>
                <button 
                  onClick={() => setIsWaWidgetOpen(false)}
                  className="p-1 rounded-full hover:bg-white/5 text-[#596478] hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-[10.5px] text-[#8b96aa]">
                Pranam! Click a specific department node below to launch a secured direct message on WhatsApp:
              </p>

              <div className="space-y-2">
                {(cmsData.whatsapp.departments || [
                  { id: "dept1", name: "Astro Consultation Desk", label: "Consultation Slot Support", number: "919876543210", customMessage: "Hari Om Acharya ji, I want to book an astrological consultation call with you." },
                  { id: "dept2", name: "Vastu Site Correction Desk", label: "Industrial & Domestic Vastu", number: "919876543210", customMessage: "Pranam, I would like to schedule a Vastu audit visit for my property." },
                  { id: "dept3", name: "Manuscript Dispatch Center", label: "Book Delivery Status Help", number: "919876543210", customMessage: "Greetings, I wanted to inquire about the tracking ID of my purchased astrological books." }
                ]).map(dep => (
                  <button
                    key={dep.id}
                    onClick={() => handleWaDeptClick(dep.number || cmsData.whatsapp.number || cmsData.site.whatsapp, dep.customMessage)}
                    className="w-full p-2.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-[#C9A227] text-left flex justify-between items-center hover:bg-[#C9A227]/5 group transition-all cursor-pointer"
                  >
                    <div>
                      <span className="text-[9px] uppercase font-bold text-[#C9A227] block tracking-wide">{dep.label}</span>
                      <span className="text-xs text-white font-bold block">{dep.name}</span>
                    </div>
                    <span className="text-xs group-hover:translate-x-1 transition-transform">💬</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Toggle trigger circle */}
          <button
            onClick={() => setIsWaWidgetOpen(!isWaWidgetOpen)}
            className="w-14 h-14 rounded-full bg-emerald-500 text-white shadow-[0_4px_24px_rgba(16,185,129,0.35)] flex items-center justify-center hover:scale-105 transform transition-all active:scale-95 cursor-pointer hover:rotate-12"
            title="Launch live WhatsApp support departments"
          >
            <MessageCircle className="w-7 h-7" />
          </button>
        </div>
      )}

      {/* CMS Administrative Dashboard Modal panel */}
      {isAdminOpen && (
        <AdminPanel 
          initialData={cmsData} 
          onSave={handleSaveCMS} 
          onClose={() => {
            setIsAdminOpen(false);
            window.history.pushState({}, '', '/');
          }} 
        />
      )}

      {/* Multi-Step Booking Intakes Modal popup */}
      {selectedBookingService !== null && (
        <BookingModal 
          services={cmsData.services} 
          timeSlots={[
            "09:30 AM IST", "10:30 AM IST", "11:30 AM IST", 
            "01:00 PM IST", "02:30 PM IST", "04:00 PM IST", 
            "05:30 PM IST", "07:00 PM IST"
          ]}
          initialService={selectedBookingService}
          onClose={() => setSelectedBookingService(null)}
          onSubmitBooking={handleBookingConfirm}
        />
      )}

    </div>
  );
}
