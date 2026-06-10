import React, { useState } from 'react';
import { Sparkles, ArrowRight, MessageCircle, HelpCircle, CheckCircle, Calendar, PhoneCall, Star, Filter } from 'lucide-react';
import { Service, Testimonial, FAQItem } from '../types';

interface ServicesPageProps {
  services: Service[];
  testimonials: Testimonial[];
  faqs: FAQItem[];
  whatsappNumber: string;
  onOpenBooking: (serviceName?: string) => void;
  onSubmitInquiry: (name: string, phone: string, email: string, service: string, msg: string) => void;
}

export default function ServicesPage({ 
  services = [], 
  testimonials = [], 
  faqs = [], 
  whatsappNumber,
  onOpenBooking,
  onSubmitInquiry
}: ServicesPageProps) {
  const [selectedCat, setSelectedCat] = useState('All');
  const [detailedService, setDetailedService] = useState<Service | null>(null);

  // Inquiry form states
  const [inqName, setInqName] = useState('');
  const [inqPhone, setInqPhone] = useState('');
  const [inqEmail, setInqEmail] = useState('');
  const [inqService, setInqService] = useState('');
  const [inqMsg, setInqMsg] = useState('');
  const [inqSuccess, setInqSuccess] = useState(false);

  // Extract unique categories
  const categories = ['All', ...Array.from(new Set(services.map(s => s.category || 'Astrology')))];

  const filteredServices = services.filter(s => {
    if (selectedCat === 'All') return s.active;
    return s.active && (s.category || 'Astrology') === selectedCat;
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inqName || !inqPhone) {
      alert("Please provide at least your name and phone number for Acharya's session.");
      return;
    }
    onSubmitInquiry(inqName, inqPhone, inqEmail, inqService, inqMsg);
    setInqSuccess(true);
    // Reset
    setInqName('');
    setInqPhone('');
    setInqEmail('');
    setInqMsg('');
    setTimeout(() => setInqSuccess(false), 6000);
  };

  const handleWhatsAppInquiry = (serviceName: string) => {
    const text = encodeURIComponent(`Pranam Acharya Ji, I am looking to inquire regarding the ${serviceName} service. Please guide me on booking slot availability.`);
    window.open(`https://wa.me/${whatsappNumber}?text=${text}`, '_blank');
  };

  return (
    <div className="py-24 max-w-7xl mx-auto px-6 space-y-20 text-left animate-fadeInDown">
      
      {/* Header section */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="cms-badge">Sacred Astral Solutions</span>
        <h1 className="font-serif text-4xl sm:text-5xl font-extrabold text-[#C9A227]">
          Astrological Services & Diagnostic Consultations
        </h1>
        <p className="text-[#8b96aa] text-sm sm:text-base">
          All guidance is parsed according to Vedic calculations of dasha cycles, yoga, and house combinations. Clean, practical, lifestyle-ready remedies.
        </p>
        <div className="h-[2px] w-24 bg-[#C9A227] mx-auto mt-4" />
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2 justify-center py-4">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCat(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              selectedCat === cat 
                ? 'bg-gradient-to-r from-[#C9A227] to-[#f0d070] text-[#1a1000] shadow-md' 
                : 'bg-white/5 border border-white/5 text-[#8b96aa] hover:bg-white/10 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Services Listing Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredServices.map(s => (
          <div 
            key={s.id} 
            className="p-6 rounded-2xl bg-[#0a0e18] border border-white/5 hover:border-[#C9A227]/30 transition-all flex flex-col justify-between group h-full relative"
          >
            <div className="space-y-4">
              <div className="text-4xl">{s.icon || "🔮"}</div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#C9A227] bg-[#C9A227]/10 px-2 py-0.5 rounded-full">
                  {s.category || 'Astrology'}
                </span>
                <h3 className="text-lg font-serif font-bold text-white mt-2 group-hover:text-[#C9A227] transition-colors">{s.name}</h3>
              </div>
              <p className="text-xs text-[#596478] leading-relaxed line-clamp-3">
                {s.desc}
              </p>
            </div>

            <div className="mt-6 pt-6 border-t border-white/5 space-y-4">
              <div className="flex justify-between items-center text-xs">
                <div>
                  <span className="text-[#596478] block">Investment Energy</span>
                  <span className="text-[#e8eaf0] font-mono font-bold text-base">{s.price}</span>
                </div>
                <div className="text-right">
                  <span className="text-[#596478] block">Duration</span>
                  <span className="text-[#e8eaf0] font-bold">{s.duration}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => setDetailedService(s)}
                  className="px-3 py-2 rounded-xl text-[10px] font-bold bg-white/5 border border-white/10 hover:bg-white/10 text-white transition-all text-center cursor-pointer"
                >
                  View Details
                </button>
                <button 
                  onClick={() => onOpenBooking(s.name)}
                  className="px-3 py-2 rounded-xl text-[10px] font-bold bg-[#C9A227] text-[#1a1000] hover:scale-105 transition-all text-center cursor-pointer"
                >
                  Book Session
                </button>
              </div>

              <button
                onClick={() => handleWhatsAppInquiry(s.name)}
                className="w-full flex items-center justify-center gap-1 px-3 py-2 rounded-xl text-[10px] font-bold bg-[#25D366]/10 border border-[#25D366]/20 text-[#25D366] hover:bg-[#25D366]/20 transition-all cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5" /> WhatsApp Inquiry
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Service Details Modal Popup */}
      {detailedService && (
        <div className="fixed inset-0 bg-[#04060b]/85 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-[#0a0e18] border border-white/10 rounded-3xl p-8 max-w-xl w-full text-left relative animate-fadeInDown space-y-6">
            <button 
              onClick={() => setDetailedService(null)}
              className="absolute top-4 right-4 text-[#8b96aa] hover:text-white text-xl"
            >
              ✕
            </button>
            
            <div className="flex gap-4 items-center">
              <div className="text-5xl">{detailedService.icon}</div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#C9A227] px-2.5 py-0.5 rounded-full bg-[#C9A227]/10">
                  {detailedService.category || 'Astrology'}
                </span>
                <h2 className="text-2xl font-serif font-black text-white mt-1">{detailedService.name}</h2>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold text-[#C9A227] uppercase tracking-wider">Detailed Description</h3>
              <p className="text-xs text-[#8b96aa] leading-relaxed">
                {detailedService.desc} This session includes checking complete birth charts (D1, D9 Navamsha and D10 Dashamsha maps), diagnosing lagna lord status, placement cycles, planetary friendship strengths, and designing custom remedies.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
              <div>
                <span className="text-[10px] text-[#596478] block uppercase font-bold">Standard Price</span>
                <span className="text-md font-mono font-bold text-[#C9A227]">{detailedService.price}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#596478] block uppercase font-bold">Time Frame</span>
                <span className="text-md font-bold text-white">{detailedService.duration}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => { setDetailedService(null); onOpenBooking(detailedService.name); }}
                className="px-4 py-3 rounded-xl bg-[#C9A227] text-[#1a1000] font-black text-xs hover:scale-[1.02] transition-transform text-center cursor-pointer"
              >
                Schedule & Pay Now
              </button>
              <button
                onClick={() => { setDetailedService(null); handleWhatsAppInquiry(detailedService.name); }}
                className="px-4 py-3 rounded-xl border border-[#25D366]/30 bg-[#25D366]/5 text-[#25D366] hover:bg-[#25D366]/10 font-bold text-xs text-center flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" /> Ask on WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Service Inquiry Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start py-10">
        <div className="space-y-6">
          <span className="cms-badge">Contact the Council</span>
          <h2 className="text-3xl font-serif font-bold text-white">Service Inquiry Form</h2>
          <p className="text-xs text-[#596478] leading-relaxed">
            Need customized consulting parameters, home Vastu map visits, corporate Muhurat contracts, or customized gemstones? Submit your inquiry coordinates and Acharya's personal desk will contact you regarding availability.
          </p>
          <div className="space-y-2">
            <div className="flex gap-2.5 items-center text-xs text-[#8b96aa]">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <span>Full confidentiality guaranteed over family & corporate secrets.</span>
            </div>
            <div className="flex gap-2.5 items-center text-xs text-[#8b96aa]">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <span>Calls placed within 2 business hours maximum.</span>
            </div>
          </div>
        </div>

        <div className="p-8 rounded-2xl bg-[#0a0e18] border border-white/5 space-y-4">
          <h3 className="text-lg font-serif font-bold text-white">General Inquiry Intake</h3>
          {inqSuccess ? (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-center text-xs font-bold leading-normal">
              🕉️ Pranam! Your dynamic service enquiry has been recorded in our CRM console. Our coordinator will give a diagnostic call back shortly.
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#8b96aa] mb-1.5">Your Name</label>
                  <input 
                    type="text" 
                    value={inqName} 
                    onChange={e => setInqName(e.target.value)} 
                    placeholder="Siddharth Malhotra" 
                    className="form-input" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#8b96aa] mb-1.5">Phone Number</label>
                  <input 
                    type="tel" 
                    value={inqPhone} 
                    onChange={e => setInqPhone(e.target.value)} 
                    placeholder="+91 99887 76655" 
                    className="form-input" 
                    required 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#8b96aa] mb-1.5">Email Address</label>
                  <input 
                    type="email" 
                    value={inqEmail} 
                    onChange={e => setInqEmail(e.target.value)} 
                    placeholder="sid@gmail.com" 
                    className="form-input" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#8b96aa] mb-1.5">Target Consult Service</label>
                  <select 
                    value={inqService} 
                    onChange={e => setInqService(e.target.value)} 
                    className="form-select"
                  >
                    <option value="">-- Choose Solution --</option>
                    {services.map(s => (
                      <option key={s.id} value={s.name}>{s.name} ({s.price})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-[#8b96aa] mb-1.5">Inquiry Details</label>
                <textarea 
                  value={inqMsg} 
                  onChange={e => setInqMsg(e.target.value)} 
                  placeholder="Tell Acharya regarding your career hurdles, marital delay, or physical space layout..." 
                  className="form-textarea"
                />
              </div>

              <button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-[#C9A227] to-[#f0d070] text-[#1a1000] font-bold rounded-xl text-xs hover:scale-[1.02] active:scale-[0.98] transition-transform cursor-pointer"
              >
                📨 Submit Inquiry Form
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Service Testimonials */}
      <div className="space-y-6 pt-10">
        <div className="text-center">
          <span className="cms-[#C9A227] text-xs font-bold uppercase tracking-widest text-[#C9A227]">Genuine Seeker Stories</span>
          <h2 className="text-3xl font-serif text-white font-bold mt-2">Testimonials & Success Feedbacks</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.slice(0, 4).map(t => (
            <div key={t.id} className="p-6 rounded-2xl bg-[#090d16] border border-white/5 space-y-4">
              <div className="flex gap-1 text-[#C9A227]">
                {[...Array(t.stars)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current text-yellow-400" />
                ))}
              </div>
              <p className="text-xs text-[#8b96aa] italic leading-normal">
                "{t.text}"
              </p>
              <div className="flex justify-between items-center text-[10px]">
                <div className="font-bold text-white">{t.name} ({t.location})</div>
                <div className="text-[#C9A227] font-medium bg-[#C9A227]/5 px-2 py-0.5 rounded-md">Topic: {t.service}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Service FAQs */}
      <div className="space-y-6 pt-10">
        <h2 className="text-3xl font-serif font-bold text-white text-center">Consulting & Service FAQs</h2>
        <div className="space-y-4 max-w-4xl mx-auto">
          {faqs.map(faq => (
            <div key={faq.id} className="p-6 rounded-2xl bg-[#0a0e18] border border-white/5 space-y-2">
              <h4 className="font-serif text-sm font-bold text-white flex gap-2 items-center">
                <HelpCircle className="w-4 h-4 text-[#C9A227] shrink-0" />
                {faq.q}
              </h4>
              <p className="text-xs text-[#8b96aa] leading-relaxed pl-6">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
