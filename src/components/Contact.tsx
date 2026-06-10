import React, { useState } from 'react';
import { Sparkles, Phone, Mail, MapPin, Clock, Facebook, Instagram, Youtube, Twitter, Send, Compass, Map } from 'lucide-react';
import { SiteConfig, ContactInfo, MapConfig, MapBranch } from '../types';

interface ContactProps {
  site: SiteConfig;
  info: ContactInfo;
  mapConfig?: MapConfig;
  onSubmitInquiry: (name: string, phone: string, email: string, service: string, date: string, place: string, msg: string) => void;
}

export default function Contact({ site, info, mapConfig, onSubmitInquiry }: ContactProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [service, setService] = useState('');
  const [dob, setDOB] = useState('');
  const [pob, setPOB] = useState('');
  const [msg, setMsg] = useState('');
  
  // Selected branch state for Google Maps Sim
  const branchesList = mapConfig?.branches || [
    { id: "br_01", name: "Main CP Astrological Bureau", address: "Flat 40B, Inner Circle, Connaught Place, New Delhi - 110001", lat: 28.6304, lng: 77.2177, phone: "+91 98765 43210" }
  ];
  const [activeBranch, setActiveBranch] = useState<MapBranch>(branchesList[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;
    onSubmitInquiry(name, phone, email, service, dob, pob, msg);
    
    // reset fields
    setName('');
    setPhone('');
    setEmail('');
    setService('');
    setDOB('');
    setPOB('');
    setMsg('');
  };

  const handleDirections = (br: MapBranch) => {
    const q = encodeURIComponent(`${br.name}, ${br.address}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${q}`, '_blank');
  };

  return (
    <section id="contact" className="py-24 relative z-10 animate-fadeInDown">
      <div className="max-w-7xl mx-auto px-6 space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#C9A227]/30 bg-[#C9A227]/10 text-xs font-bold text-[#f5d98a] uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            ✦ Direct Connect
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold leading-tight">
            Connect with <span className="text-[#C9A227]">Acharya TN Khurana</span>
          </h2>
          <div className="flex items-center justify-center gap-3">
            <span className="h-[1px] w-12 bg-gradient-to-r from-[#C9A227] to-[#f0d070]" />
            <span className="text-[#C9A227] text-md">✦</span>
            <span className="h-[1px] w-12 bg-gradient-to-l from-[#C9A227] to-[#f0d070]" />
          </div>
          <p className="text-base text-[#8b96aa]">
            Have a question or looking to schedule a private video consultation? Send an enquiry below for quick, confidential responses or visit our physical Delhi ashrams.
          </p>
        </div>

        {/* Outer Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start text-left">
          
          {/* Info Card Column */}
          <div className="lg:col-span-5 p-8 rounded-2xl bg-white/[0.01] border border-white/5 space-y-6">
            <h3 className="font-serif text-xl font-bold text-[#f5d98a]">{info.title}</h3>
            <p className="text-sm text-[#8b96aa] leading-relaxed">{info.description}</p>
            
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.01] border border-white/5">
                <div className="w-10 h-10 rounded-lg bg-[#C9A227]/10 border border-[#C9A227]/20 flex items-center justify-center text-[#C9A227] shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] text-[#596478] font-bold uppercase tracking-wider">Phone / WhatsApp</div>
                  <div className="text-sm font-semibold text-white mt-1">{site.phone}</div>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.01] border border-white/5">
                <div className="w-10 h-10 rounded-lg bg-[#C9A227]/10 border border-[#C9A227]/20 flex items-center justify-center text-[#C9A227] shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] text-[#596478] font-bold uppercase tracking-wider">Email Address</div>
                  <div className="text-sm font-semibold text-white mt-1">{site.email}</div>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.01] border border-white/5">
                <div className="w-10 h-10 rounded-lg bg-[#C9A227]/10 border border-[#C9A227]/20 flex items-center justify-center text-[#C9A227] shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] text-[#596478] font-bold uppercase tracking-wider">Spiritual Center</div>
                  <div className="text-sm font-semibold text-white mt-1">{info.address}</div>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.01] border border-white/5">
                <div className="w-10 h-10 rounded-lg bg-[#C9A227]/10 border border-[#C9A227]/20 flex items-center justify-center text-[#C9A227] shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] text-[#596478] font-bold uppercase tracking-wider">Available Consultations</div>
                  <div className="text-sm font-semibold text-white mt-1">{info.hours}</div>
                </div>
              </div>
            </div>

            {/* Social channels */}
            <div className="space-y-3">
              <div className="text-[10px] text-[#596478] font-black uppercase tracking-widest">Connect Digitally</div>
              <div className="flex gap-2">
                <a href="#" className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-slate-300 hover:border-[#C9A227] hover:text-[#C9A227] transition-all"><Facebook className="w-4 h-4" /></a>
                <a href="#" className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-slate-300 hover:border-[#C9A227] hover:text-[#C9A227] transition-all"><Instagram className="w-4 h-4" /></a>
                <a href="#" className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-slate-300 hover:border-[#C9A227] hover:text-[#C9A227] transition-all"><Youtube className="w-4 h-4" /></a>
                <a href="#" className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-slate-300 hover:border-[#C9A227] hover:text-[#C9A227] transition-all"><Twitter className="w-4 h-4" /></a>
              </div>
            </div>
          </div>

          {/* Form Column Card */}
          <div className="lg:col-span-7 p-8 rounded-2xl bg-white/[0.01] border border-white/5 space-y-6">
            <h3 className="font-serif text-xl font-bold text-[#f5d98a]">Submit Cosmic Inquiry</h3>
            <p className="text-xs text-[#8b96aa]">Enter your particulars below to receive expert astro guidance.</p>
            
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#8b96aa]">Full Name *</label>
                  <input 
                    type="text" 
                    value={name} 
                    onChange={e => setName(e.target.value)}
                    placeholder="Your Name" 
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#C9A227]/60"
                    required 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#8b96aa]">WhatsApp Number *</label>
                  <input 
                    type="tel" 
                    value={phone} 
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+91 xxxxx xxxxx" 
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#C9A227]/60"
                    required 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#8b96aa]">Email Address</label>
                  <input 
                    type="email" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@email.com" 
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#C9A227]/60"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#8b96aa]">Required Service</label>
                  <select 
                    value={service} 
                    onChange={e => setService(e.target.value)}
                    className="w-full bg-[#0a0e18] border border-white/10 rounded-xl p-3 text-xs text-[#8b96aa] focus:outline-none focus:border-[#C9A227]/60 cursor-pointer"
                  >
                    <option value="">Select Service Needed</option>
                    <option value="kundli-reading">Kundli Reading</option>
                    <option value="marriage-matching">Marriage Matching</option>
                    <option value="career-astrology">Career Astrology</option>
                    <option value="love-remedies">Love Problems</option>
                    <option value="numerology-report">Numerology</option>
                    <option value="vastu">Vastu Shastra</option>
                    <option value="gems">Gemstone Guidance</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#8b96aa]">Date of Birth</label>
                  <input 
                    type="date" 
                    value={dob} 
                    onChange={e => setDOB(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#C9A227]/60"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#8b96aa]">Birth Place</label>
                  <input 
                    type="text" 
                    value={pob} 
                    onChange={e => setPOB(e.target.value)}
                    placeholder="City, State, Country" 
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#C9A227]/60"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#8b96aa]">Your Situation / Ask a Question</label>
                <textarea 
                  value={msg} 
                  onChange={e => setMsg(e.target.value)}
                  placeholder="Detail your question, life area or business launch concerns..." 
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#C9A227]/60 h-28 resize-none"
                />
              </div>

              <button 
                type="submit" 
                className="w-full h-12 rounded-xl bg-gradient-to-r from-[#C9A227] to-[#f0d070] text-[#1a1000] font-bold text-xs shadow-[0_4px_20px_rgba(201,162,39,0.35)] hover:scale-[1.01] transform transition-all active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
              >
                Submit Consultation Request <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>

        {/* Dynamic Map Branch Locator Section */}
        {mapConfig?.enabled && (
          <div className="p-8 rounded-3xl bg-[#0a0e18] border border-white/5 space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="space-y-1 text-left">
                <span className="text-[10px] font-bold text-[#C9A227] uppercase tracking-wider block">Physical Ashram Coordinates</span>
                <h3 className="font-serif text-2xl font-black text-white">Our Physical Council Branches</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {branchesList.map(br => (
                  <button
                    key={br.id}
                    onClick={() => setActiveBranch(br)}
                    className={`px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase transition-all cursor-pointer ${
                      activeBranch.id === br.id
                        ? 'bg-gradient-to-r from-[#C9A227] to-[#f0d070] text-[#1a1000]'
                        : 'bg-white/5 border border-white/5 text-[#8b96aa] hover:bg-white/10'
                    }`}
                  >
                    {br.name.split(' ')[0]} Office
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-xs">
              {/* Selected Branch Details */}
              <div className="lg:col-span-4 space-y-4 text-left">
                <div className="p-5 rounded-2xl bg-[#0e1322] border border-[#C9A227]/20 space-y-3">
                  <div className="font-serif font-black text-white text-md flex items-center gap-2">
                    <Map className="w-5 h-5 text-[#C9A227]" />
                    {activeBranch.name}
                  </div>
                  <p className="text-[#8b96aa] leading-relaxed text-xs">
                    {activeBranch.address}
                  </p>
                  <div className="text-[11px] text-[#596478]">
                    Phone Contact: <b className="text-white">{activeBranch.phone}</b>
                  </div>
                  
                  <button
                    onClick={() => handleDirections(activeBranch)}
                    className="w-full mt-2 h-10 rounded-xl bg-white/5 border border-white/10 hover:border-[#C9A227] hover:text-[#C9A227] text-white font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer text-[10px]"
                  >
                    <Compass className="w-4 h-4" /> Get Directions Route Map
                  </button>
                </div>
              </div>

              {/* Graphic simulated maps canvas overlay */}
              <div className="lg:col-span-8 h-64 rounded-2xl border border-white/10 overflow-hidden relative bg-[#04060a] bg-cover bg-center flex items-center justify-center" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1200')` }}>
                <div className="absolute inset-0 bg-black/80 backdrop-blur-[1px]" />
                
                {/* Simulated markers element */}
                <div className="relative text-center p-6 space-y-4 max-w-md bg-[#0a0e18]/90 border border-white/10 rounded-2xl shadow-2xl">
                  <div className="w-10 h-10 rounded-full bg-red-500/10 border-2 border-red-500 flex items-center justify-center mx-auto text-red-500 animate-bounce">
                    📍
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-serif font-bold text-white text-xs">{activeBranch.name}</h4>
                    <p className="text-[10px] text-[#8b96aa]">Latitude: {activeBranch.lat} · Longitude: {activeBranch.lng}</p>
                    <p className="text-[10px] text-[#C9A227]">Delhi Astral Center GPS Marker Is Active</p>
                  </div>
                  
                  <button 
                    onClick={() => handleDirections(activeBranch)}
                    className="px-4 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg text-[9px] font-bold shadow-lg hover:scale-105 transition-all uppercase cursor-pointer inline-block"
                  >
                    Navigate on Google maps
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
