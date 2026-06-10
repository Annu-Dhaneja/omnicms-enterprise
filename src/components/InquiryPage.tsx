import React, { useState, useEffect } from 'react';
import { Search, MapPin, Calendar, Clock, ClipboardList, CheckCircle2, ChevronRight, MessageSquare, AlertCircle } from 'lucide-react';
import { getLeads, saveLeads, logActivity } from '../utils';
import { Lead } from '../types';

interface InquiryPageProps {
  services: { id: string; name: string }[];
  onSubmitInquiry: (name: string, phone: string, email: string, service: string, date: string, place: string, msg: string) => void;
}

export default function InquiryPage({ services = [], onSubmitInquiry }: InquiryPageProps) {
  // Local ledger states
  const [leads, setLeads] = useState<Lead[]>(() => getLeads());
  const [showStatusNum, setShowStatusNum] = useState('');
  const [queriedLeads, setQueriedLeads] = useState<Lead[] | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [service, setService] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [birthPlace, setBirthPlace] = useState('');
  const [msg, setMsg] = useState('');
  const [success, setSuccess] = useState(false);

  // Sync leads from disk
  const refreshLeads = () => {
    setLeads(getLeads());
  };

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) {
      alert("Please specify name and phone number.");
      return;
    }

    // Capture to central storage
    const newLead: Lead = {
      id: `lead_${Date.now()}`,
      name,
      phone,
      email: email || "seeker@spiritual.com",
      service: service || "General Guidance",
      date: birthDate,
      time: birthTime,
      place: birthPlace,
      message: msg,
      status: "New",
      notes: "Direct lead enrollment via inquiry page.",
      createdAt: new Date().toISOString()
    };

    const updated = [newLead, ...leads];
    setLeads(updated);
    saveLeads(updated);
    logActivity("LEAD REGISTERED VIA INQUIRY PAGE", `Registered customer: ${name} (${phone}) for ${service}`);

    // Fire callback
    onSubmitInquiry(name, phone, email, service, birthDate, birthPlace, msg);

    setSuccess(true);
    // Reset
    setName('');
    setPhone('');
    setEmail('');
    setBirthDate('');
    setBirthTime('');
    setBirthPlace('');
    setMsg('');

    setTimeout(() => {
      setSuccess(false);
      refreshLeads();
    }, 6000);
  };

  const handleStatusQuery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showStatusNum) {
      setQueriedLeads([]);
      return;
    }
    const cleanNum = showStatusNum.trim().toLowerCase();
    const matches = leads.filter(l => 
      l.phone.toLowerCase().includes(cleanNum) || 
      l.email.toLowerCase().includes(cleanNum) ||
      l.name.toLowerCase().includes(cleanNum)
    );
    setQueriedLeads(matches);
  };

  return (
    <div className="py-24 max-w-7xl mx-auto px-6 space-y-20 text-left animate-fadeInDown">
      {/* Page Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="cms-badge">Client Intake Council</span>
        <h1 className="font-serif text-4xl sm:text-5xl font-extrabold text-[#C9A227]">
          Corporate & Personal Astrological Inquiry Portal
        </h1>
        <p className="text-[#8b96aa] text-sm sm:text-base">
          Initiate professional Vastu audits, match detailed matrimonial horoscopes, or request custom-tailored planetary gems through our secure lead processing console.
        </p>
        <div className="h-[2px] w-24 bg-[#C9A227] mx-auto mt-4" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Core Lead collection form */}
        <div className="p-8 rounded-3xl bg-[#0a0e18] border border-white/5 space-y-6">
          <div>
            <h2 className="text-2xl font-serif font-bold text-white">Spiritual Consultation Intake</h2>
            <p className="text-[11px] text-[#596478] mt-1">Please provide accurate birth coordinates to allow correct Nakshatra math.</p>
          </div>

          {success ? (
            <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <h4 className="text-emerald-400 font-bold text-base">Intake Registered!</h4>
              <p className="text-xs text-[#8b96aa] font-medium leading-relaxed">
                Pranam! Your birth chart parameters have been locked. Acharya Khurana's secretariat will reach out to organize your 1-on-1 Zoom or physical appointment.
              </p>
            </div>
          ) : (
            <form onSubmit={handleLeadSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#8b96aa] mb-1.5">Full Name</label>
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
                  <label className="block text-[10px] uppercase font-bold text-[#8b96aa] mb-1.5">Phone Number</label>
                  <input 
                    type="tel" 
                    value={phone} 
                    onChange={e => setPhone(e.target.value)} 
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
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    placeholder="sid.roy@gmail.com" 
                    className="form-input" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#8b96aa] mb-1.5">Desired Solution</label>
                  <select 
                    value={service} 
                    onChange={e => setService(e.target.value)} 
                    className="form-select"
                  >
                    <option value="">Choose Astrological Service</option>
                    <option value="Kundli Reading">Kundli Reading & Dasha analysis</option>
                    <option value="Marriage Matching">Marriage Compatibility Matching</option>
                    <option value="Career & Wealth Astrology">Career & Business transit remedies</option>
                    <option value="Residential Vastu Consultation">Personal & Retail Vastu correction</option>
                    <option value="Gemstone Recommendation">Empowering Gemstone Analysis</option>
                  </select>
                </div>
              </div>

              {/* Birth coordinates */}
              <div className="p-4 rounded-xl bg-white/[0.01] border border-white/5 space-y-4">
                <span className="text-[10px] uppercase font-black text-[#C9A227] tracking-wider block">Chart Diagnostics (Birth Coordinates)</span>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[9px] uppercase font-bold text-[#596478] mb-1">Date of Birth</label>
                    <input 
                      type="date" 
                      value={birthDate} 
                      onChange={e => setBirthDate(e.target.value)} 
                      className="form-input text-xs" 
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] uppercase font-bold text-[#596478] mb-1">Time of Birth</label>
                    <input 
                      type="time" 
                      value={birthTime} 
                      onChange={e => setBirthTime(e.target.value)} 
                      className="form-input text-xs" 
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] uppercase font-bold text-[#596478] mb-1">Place of Birth (City)</label>
                    <input 
                      type="text" 
                      value={birthPlace} 
                      onChange={e => setBirthPlace(e.target.value)} 
                      placeholder="New Delhi, India" 
                      className="form-input text-xs" 
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-[#8b96aa] mb-1.5">Seeker Message (Confidential)</label>
                <textarea 
                  value={msg} 
                  onChange={e => setMsg(e.target.value)} 
                  placeholder="State your main concerns regarding planetary periods or obstacles..." 
                  className="form-textarea"
                />
              </div>

              <button 
                type="submit" 
                className="w-full h-12 rounded-xl bg-gradient-to-r from-[#C9A227] to-[#f0d070] text-[#1a1000] font-black hover:scale-[1.01] transition-transform cursor-pointer"
              >
                🕉️ Enroll Cosmic Inquiry Form
              </button>
            </form>
          )}
        </div>

        {/* Status follow-up check & history */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-[#0e1322] border border-white/5 space-y-4">
            <h3 className="text-lg font-serif font-bold text-white flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-[#C9A227]" />
              Follow-Up Status Tracker
            </h3>
            <p className="text-xs text-[#8b96aa] leading-relaxed">
              Query our active council records offline. Enter your registered Name, Phone Number, or Email below to view the coordinator's notes and dasha scheduling status.
            </p>

            <form onSubmit={handleStatusQuery} className="flex gap-2">
              <input 
                type="text" 
                value={showStatusNum} 
                onChange={e => setShowStatusNum(e.target.value)} 
                placeholder="Name or phone or email..." 
                className="form-input text-xs flex-1"
                required
              />
              <button 
                type="submit" 
                className="bg-white/5 border border-white/10 text-white rounded-xl px-4 hover:border-[#C9A227] transition-all cursor-pointer"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>

            <div className="space-y-3 pt-2">
              {queriedLeads !== null ? (
                queriedLeads.length === 0 ? (
                  <div className="flex gap-2 p-3 bg-red-500/5 border border-red-500/10 text-red-400 rounded-xl text-xs">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    No registered consulting request discovered matching that query.
                  </div>
                ) : (
                  queriedLeads.map(l => (
                    <div key={l.id} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-3 text-xs text-left">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-white text-sm">{l.name}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                          l.status === 'New' ? 'bg-blue-500/10 text-[#60a5fa] border border-blue-500/20' :
                          l.status === 'Contacted' ? 'bg-amber-500/10 text-[#fbbf24] border border-amber-500/20' :
                          l.status === 'In-Progress' ? 'bg-purple-500/10 text-[#c084fc] border border-purple-500/20' :
                          l.status === 'Consulted' ? 'bg-emerald-500/10 text-[#34d399] border border-emerald-500/20' :
                          'bg-gray-500/10 text-[#9ca3af] border border-gray-500/20'
                        }`}>
                          {l.status}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-[10px] text-[#8b96aa]">
                        <div>Service: <span className="text-white font-medium">{l.service}</span></div>
                        <div className="text-right">Registered: <span className="text-white font-medium">{new Date(l.createdAt).toLocaleDateString()}</span></div>
                        {l.bookingDate && (
                          <div className="col-span-2 text-[#C9A227] font-medium bg-[#C9A227]/5 px-2 py-1 rounded-lg mt-1">
                            📅 Appointment Scheduled: {l.bookingDate} at {l.bookingTime}
                          </div>
                        )}
                      </div>

                      {/* Doctor Notes */}
                      <div className="p-2.5 rounded-lg bg-[#080B12] text-[11px] text-[#596478] border border-white/5 leading-snug">
                        <span className="font-semibold text-[#8b96aa] block mb-0.5">Council Secretariat Notes:</span>
                        {l.notes || "Awaiting birth hour confirmation to calculate lagna planet coordinates."}
                      </div>
                    </div>
                  ))
                )
              ) : (
                <div className="text-center p-6 text-[11px] text-[#596478] bg-[#0c0f1b] rounded-xl border border-white/5">
                  Input coordinates above to fetch status.
                </div>
              )}
            </div>
          </div>

          {/* Historical Intake List metrics */}
          <div className="p-6 rounded-3xl bg-white/[0.01] border border-white/5 space-y-4 text-xs">
            <div className="flex justify-between items-center">
              <h4 className="font-serif font-black text-white">Anonymized Recent Intake Logs</h4>
              <span className="text-[10px] text-[#596478]">Public audit trail</span>
            </div>
            
            <div className="space-y-2.5">
              {leads.slice(0, 5).map((l, index) => {
                const hiddenName = l.name.charAt(0) + "•".repeat(l.name.split(' ')[0].length - 1) + " " + (l.name.split(' ')[1] ? l.name.split(' ')[1].charAt(0) + "•" : "");
                return (
                  <div key={l.id || index} className="flex justify-between items-center p-3 rounded-xl bg-white/[0.01] border border-white/5">
                    <div className="space-y-0.5">
                      <span className="font-mono text-[10px] text-[#C9A227]">{hiddenName}</span>
                      <span className="text-[9px] text-[#596478] block">Inquired for {l.service}</span>
                    </div>
                    <div className="text-right text-[9px] text-[#596478]">
                      <div>{l.place || "India"}</div>
                      <div className="text-emerald-500 font-semibold mt-0.5">Status: {l.status}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
