import React, { useState } from 'react';
import { 
  Phone, 
  Mail, 
  Sparkles, 
  Calendar, 
  User, 
  ShoppingCart, 
  Menu, 
  X, 
  Globe 
} from 'lucide-react';
import { SiteConfig, ThemeConfig, PageId } from '../types';

interface HeaderProps {
  site: SiteConfig;
  theme: ThemeConfig;
  activePage: PageId;
  onNavigate: (id: PageId) => void;
  onOpenBooking: () => void;
  onOpenDashboard: () => void;
  cartCount: number;
}

export default function Header({ 
  site, 
  theme, 
  activePage, 
  onNavigate, 
  onOpenBooking, 
  onOpenDashboard,
  cartCount 
}: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems: { id: PageId; name: string }[] = [
    { id: 'home', name: 'Home' },
    { id: 'about', name: 'About Biography' },
    { id: 'services', name: 'Services & Remedials' },
    { id: 'toolkit', name: 'Vedic Toolkit' },
    { id: 'books', name: 'Book Store' },
    { id: 'blog', name: 'Transit Blog' },
    { id: 'inquiry', name: 'Inquiry Intake' },
    { id: 'contact', name: 'Delhi Office' }
  ];

  const handleNavClick = (id: PageId) => {
    setMenuOpen(false);
    onNavigate(id);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-[#080B12]/95 backdrop-blur-md border-b border-white/10 shadow-lg">
      {/* Top Contact Bar */}
      <div className="bg-gradient-to-r from-[#C9A227]/10 to-[#7C5CFC]/10 border-b border-white/5 py-1.5 hidden md:block">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between text-xs text-[#8b96aa]">
          <span className="flex items-center gap-1.5 font-medium text-left">
            <Sparkles className="w-3.5 h-3.5 text-[#C9A227] animate-pulse" />
            India's Most Trusted Vedic Astrologer — 30+ Years of Spiritual Guidance
          </span>
          <div className="flex items-center gap-6">
            <a href={`tel:${site.phone}`} className="flex items-center gap-1.5 hover:text-[#C9A227] transition-colors">
              <Phone className="w-3.5 h-3.5" /> {site.phone}
            </a>
            <a href={`mailto:${site.email}`} className="flex items-center gap-1.5 hover:text-[#C9A227] transition-colors">
              <Mail className="w-3.5 h-3.5" /> {site.email}
            </a>
            <span className="flex items-center gap-1 hover:text-[#C9A227] cursor-pointer transition-colors">
              <Globe className="w-3.5 h-3.5" /> English | हिन्दी
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between gap-4">
        {/* Logo */}
        <button className="flex items-center gap-3 shrink-0 text-left bg-transparent border-0 cursor-pointer p-0" onClick={() => handleNavClick('home')}>
          <div className="w-12 h-12 rounded-full border border-[#C9A227]/40 bg-black/40 overflow-hidden flex items-center justify-center shadow-[0_0_15px_rgba(201,162,39,0.25)] relative">
            <img src="/favicon.svg" alt="Acharya TN Khurana Logo" className="w-11 h-11 object-contain" referrerPolicy="no-referrer" />
            <div className="absolute -inset-1 rounded-full border border-[#C9A227]/20 animate-pulse opacity-30" />
          </div>
          <div className="leading-tight">
            <span className="font-serif text-lg font-bold text-[#C9A227] tracking-wide block">{site.name}</span>
            <span className="text-[10px] text-[#596478] tracking-widest uppercase font-semibold">Vedic Astrology & Vastu</span>
          </div>
        </button>

        {/* Desk Nav Links */}
        <nav className="hidden xl:flex items-center gap-1">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`px-3 py-2 text-xs font-bold uppercase tracking-wider transition-all rounded-lg relative cursor-pointer ${
                activePage === item.id 
                  ? 'text-[#C9A227] bg-white/5 shadow-inner' 
                  : 'text-[#8b96aa] hover:text-[#e8eaf0] hover:bg-white/5'
              }`}
            >
              {item.name}
              {activePage === item.id && (
                <span className="absolute bottom-1 left-3 right-3 h-[2px] bg-gradient-to-r from-[#C9A227] to-[#f0d070] rounded-full" />
              )}
            </button>
          ))}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Cart Icon trigger */}
          <button 
            onClick={() => handleNavClick('cart')} 
            className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-[#8b96aa] hover:border-[#C9A227] hover:text-[#C9A227] transition-all relative cursor-pointer"
            title="Open Spiritual Shopping Cart"
          >
            <ShoppingCart className="w-4 h-4" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#C9A227] text-[#1a1000] text-[10px] font-black rounded-full flex items-center justify-center shadow-lg border border-[#080B12]">
                {cartCount}
              </span>
            )}
          </button>
          
          <button 
            onClick={onOpenDashboard} 
            className={`hidden sm:inline-flex items-center gap-1.5 px-4 h-10 rounded-xl text-xs uppercase tracking-widest font-bold border transition-all cursor-pointer ${
              activePage === 'dashboard'
                ? 'border-[#C9A227] bg-[#C9A227]/10 text-[#C9A227]'
                : 'border-[#C9A227]/30 text-[#C9A227] hover:bg-[#C9A227]/10'
            }`}
          >
            <User className="w-4 h-4" /> Seeker Hub
          </button>
          
          <button 
            onClick={onOpenBooking} 
            className="inline-flex items-center gap-1.5 px-4 h-10 rounded-xl text-xs uppercase tracking-widest font-black bg-gradient-to-r from-[#C9A227] to-[#f0d070] text-[#1a1000] shadow-[0_4px_16px_rgba(201,162,39,0.35)] hover:scale-[1.02] transform transition-all active:scale-[0.98] cursor-pointer"
          >
            <Calendar className="w-4 h-4" /> Consult Acharya
          </button>

          {/* Hamburger Drawer trigger */}
          <button 
            onClick={() => setMenuOpen(!menuOpen)} 
            className="xl:hidden w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-[#8b96aa] cursor-pointer"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {menuOpen && (
        <div className="xl:hidden absolute top-full left-0 right-0 bg-[#0a0e18] border-b border-white/10 shadow-2xl py-4 space-y-1 animate-fadeInDown">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full block text-left px-6 py-2.5 text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                activePage === item.id 
                  ? 'text-[#C9A227] bg-[#C9A227]/10 border-l-4 border-[#C9A227]' 
                  : 'text-[#8b96aa] hover:text-[#e8eaf0] hover:bg-white/5'
              }`}
            >
              {item.name}
            </button>
          ))}
          <div className="pt-4 px-6 flex flex-col gap-2">
            <button 
              onClick={() => { setMenuOpen(false); handleNavClick('dashboard'); }}
              className="w-full h-11 justify-center rounded-xl text-xs font-bold border border-[#C9A227]/30 text-[#C9A227] flex items-center gap-1.5 cursor-pointer"
            >
              <User className="w-4 h-4" /> Seeker Hub Account
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
