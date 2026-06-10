import React, { useState, useEffect } from 'react';
import { 
  X, 
  Compass, 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  CreditCard, 
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { Service, Lead } from '../types';
import { getLeads, saveLeads, logActivity } from '../utils';

interface BookingModalProps {
  services: Service[];
  timeSlots: string[];
  initialService?: string;
  onClose: () => void;
  onSubmitBooking: (booking: Partial<Lead>) => void;
}

export default function BookingModal({ services, timeSlots, initialService, onClose, onSubmitBooking }: BookingModalProps) {
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  
  // Details
  const [name, setName] = useState('');
  const [dob, setDOB] = useState('');
  const [tob, setTOB] = useState('');
  const [pob, setPOB] = useState('');
  const [phone, setPhone] = useState('');

  const [loading, setLoading] = useState(false);

  // Set default initial service if provided
  useEffect(() => {
    if (initialService) {
      const match = services.find(s => s.name === initialService || s.id === initialService);
      if (match) {
        setSelectedService(match);
      }
    } else if (services.length > 0) {
      setSelectedService(services[0]);
    }
    
    // Set min date of tomorrow
    const d = new Date(); d.setDate(d.getDate() + 1);
    setSelectedDate(d.toISOString().split('T')[0]);
  }, [initialService, services]);

  const unavailableSlots = [2, 5, 8, 12]; // Mocked occupied time slots

  const handleNext = () => {
    if (step === 1 && !selectedService) return;
    if (step === 2 && !selectedDate) return;
    if (step === 3 && !selectedTime) return;
    if (step === 4) {
      if (!name || !dob || !pob || !phone) return;
    }
    if (step === 5) {
      handleFinalize();
      return;
    }
    setStep(prev => prev + 1);
  };

  const handlePrev = () => {
    if (step <= 1) return;
    setStep(prev => prev - 1);
  };

  const handleFinalize = () => {
    if (!selectedService) return;
    setLoading(true);

    const bookingPayload: Partial<Lead> = {
      name,
      phone,
      email: "client@booking.com",
      service: selectedService.name,
      date: dob,
      time: tob,
      place: pob,
      message: `Automatic consultation booking for ${selectedService.name}`,
      bookingDate: selectedDate,
      bookingTime: selectedTime,
      amountPaid: selectedService.price,
      status: "New"
    };

    setTimeout(() => {
      onSubmitBooking(bookingPayload);
      setLoading(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 bg-[#080B12]/90 backdrop-blur-md z-[4000] flex items-center justify-center p-6 text-left origin-center">
      <div className="bg-[#0f1425] border border-white/10 rounded-[24px] w-full max-w-[680px] max-h-[90vh] overflow-y-auto block relative shadow-2xl">
        
        {/* Header */}
        <div className="p-6 sm:px-8 border-b border-white/5 flex items-center justify-between">
          <div className="font-serif text-xl font-bold text-[#f5d98a] flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#C9A227] animate-pulse" />
            📅 Book Astrological Consultation
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-[#8b96aa] hover:bg-white/10 hover:text-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Steps tracker line */}
        <div className="px-8 sm:px-10 py-4 border-b border-white/5 bg-[#0a0e18]/40">
          <div className="flex items-center justify-between gap-2 overflow-x-auto leading-none">
            {[
              { idx: 1, icon: <Compass className="w-4 h-4" />, label: 'Service' },
              { idx: 2, icon: <CalendarIcon className="w-4 h-4" />, label: 'Date' },
              { idx: 3, icon: <Clock className="w-4 h-4" />, label: 'Slot' },
              { idx: 4, icon: <User className="w-4 h-4" />, label: 'Birth Info' },
              { idx: 5, icon: <CreditCard className="w-4 h-4" />, label: 'Billing' }
            ].map(s => {
              const isActive = step === s.idx;
              const isCompleted = step > s.idx;
              return (
                <div key={s.idx} className="flex items-center gap-2 select-none">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all border ${
                    isActive 
                      ? 'bg-[#C9A227] border-[#C9A227] text-[#1a1000] scale-110 shadow-lg shadow-[#C9A227]/20' 
                      : isCompleted 
                        ? 'bg-[#C9A227] border-[#C9A227] text-[#1a1000]' 
                        : 'bg-white/5 border-white/5 text-[#596478]'
                  }`}>
                    {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : s.idx}
                  </div>
                  <span className={`text-[11px] font-bold ${isActive ? 'text-[#f5d98a]' : 'text-[#596478]'} hidden sm:block`}>
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Body Pages */}
        <div className="p-8 sm:px-10 space-y-6">
          
          {/* Step 1: Select Service Catalog */}
          {step === 1 && (
            <div className="space-y-4 animate-fadeInDown">
              <h4 className="font-serif text-base font-bold text-[#f5d98a]">Select Consult Service</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin">
                {services.filter(s => s.active).map(s => (
                  <div 
                    key={s.id} 
                    onClick={() => { setSelectedService(s); }}
                    className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex items-center gap-4 ${
                      selectedService?.id === s.id 
                        ? 'border-[#C9A227] bg-[#C9A227]/10' 
                        : 'border-white/5 bg-white/[0.01] hover:bg-white/[0.04]'
                    }`}
                  >
                    <span className="text-3xl shrink-0">{s.icon}</span>
                    <div className="text-left leading-tight">
                      <div className="text-sm font-bold text-white mb-0.5">{s.name}</div>
                      <div className="text-xs text-[#C9A227] font-semibold">{s.price} · {s.duration}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Choose Date */}
          {step === 2 && (
            <div className="space-y-4 animate-fadeInDown text-left">
              <h4 className="font-serif text-base font-bold text-[#f5d98a]">Select Date</h4>
              <div className="max-w-md space-y-2">
                <input 
                  type="date" 
                  value={selectedDate}
                  min={new Date(Date.now() + 24*60*60*1000).toISOString().split('T')[0]} // tomorrow
                  onChange={e => setSelectedDate(e.target.value)}
                  className="w-full padding-4 p-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-[#C9A227]"
                />
                <p className="text-[11px] text-[#596478]">Please choose any future date. Acharya only conducts readings between Mon - Sat, 9 AM - 8 PM IST.</p>
              </div>
            </div>
          )}

          {/* Step 3: Choose Time Slot */}
          {step === 3 && (
            <div className="space-y-4 animate-fadeInDown text-left">
              <h4 className="font-serif text-base font-bold text-[#f5d98a]">Choose Available Hour</h4>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 max-h-[260px] overflow-y-auto pr-2 scrollbar-thin">
                {timeSlots.map((t, idx) => {
                  const isTaken = unavailableSlots.includes(idx);
                  const isSel = selectedTime === t;
                  return (
                    <button
                      key={idx}
                      disabled={isTaken}
                      onClick={() => setSelectedTime(t)}
                      className={`p-2.5 rounded-xl text-xs font-semibold text-center border transition-all ${
                        isSel 
                          ? 'border-[#C9A227] bg-[#C9A227]/15 text-[#f5d98a]' 
                          : isTaken 
                            ? 'border-white/5 bg-white/[0.01] opacity-30 cursor-not-allowed' 
                            : 'border-white/5 bg-white/[0.01] hover:border-[#C9A227]/40 text-[#8b96aa]'
                      }`}
                    >
                      {t} {isTaken && '(Full)'}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 4: Kundli Intake form */}
          {step === 4 && (
            <div className="space-y-4 animate-fadeInDown text-left">
              <h4 className="font-serif text-base font-bold text-[#f5d98a]">Your Kundli Information</h4>
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#8b96aa]">Full Name *</label>
                    <input 
                      type="text" 
                      value={name} 
                      onChange={e => setName(e.target.value)}
                      placeholder="Consultant's Name" 
                      className="w-full p-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-[#C9A227]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#8b96aa]">WhatsApp / Mobile *</label>
                    <input 
                      type="tel" 
                      value={phone} 
                      onChange={e => setPhone(e.target.value)}
                      placeholder="+91 xxxxx xxxxx" 
                      className="w-full p-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-[#C9A227]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#8b96aa]">Date of Birth *</label>
                    <input 
                      type="date" 
                      value={dob} 
                      onChange={e => setDOB(e.target.value)}
                      className="w-full p-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-[#C9A227]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#8b96aa]">Time of Birth</label>
                    <input 
                      type="time" 
                      value={tob} 
                      onChange={e => setTOB(e.target.value)}
                      className="w-full p-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-[#C9A227]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#8b96aa]">Place of Birth *</label>
                  <input 
                    type="text" 
                    value={pob} 
                    onChange={e => setPOB(e.target.value)}
                    placeholder="City, State, Country" 
                    className="w-full p-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-[#C9A227]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Billing & Summary */}
          {step === 5 && (
            <div className="space-y-5 animate-fadeInDown text-left">
              <h4 className="font-serif text-base font-bold text-[#f5d98a]">Checkout Summary</h4>
              <div className="p-5 rounded-2xl bg-white/[0.01] border border-white/5 space-y-3.5">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[#8b96aa]">Consultation:</span>
                  <span className="font-serif font-black text-[#f5d98a] flex items-center gap-1.5">
                    {selectedService?.icon} {selectedService?.name}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[#8b96aa]">Date & Time:</span>
                  <span className="font-semibold text-white">{selectedDate} @ {selectedTime}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[#8b96aa]">Consultant:</span>
                  <span className="font-semibold text-white">{name} ({phone})</span>
                </div>
                <div className="border-t border-white/5 pt-3 flex justify-between items-center">
                  <span className="font-serif text-sm font-semibold text-[#8b96aa]">Total Payable:</span>
                  <span className="font-serif text-2xl font-black text-[#C9A227]">{selectedService?.price}</span>
                </div>
              </div>
              
              <button 
                onClick={handleFinalize}
                disabled={loading}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-sm shadow-[0_4px_20px_rgba(16,185,129,0.35)] hover:scale-[1.01] transform transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Verifying Payment...
                  </>
                ) : (
                  <>
                    💳 Complete simulated Razorpay checkout
                  </>
                )}
              </button>
            </div>
          )}

          {/* Back/Next buttons */}
          <div className="flex justify-between items-center pt-4 border-t border-white/5">
            <button 
              onClick={handlePrev}
              className="px-4 py-2 border border-[#C9A227]/30 text-xs font-bold text-[#C9A227] rounded-xl hover:bg-[#C9A227]/10 disabled:opacity-0 transition-all"
              style={{ display: step === 1 ? 'none' : 'block' }}
            >
              ← Back
            </button>
            <div className="flex-1" />
            <button 
              onClick={handleNext}
              className="px-6 py-2.5 bg-gradient-to-r from-[#C9A227] to-[#f0d070] text-[#1a1000] text-xs font-black rounded-xl hover:scale-105 transition-all flex items-center gap-1.5 active:scale-95"
            >
              {step === 5 ? '💳 Complete Booking' : 'Next Step'} <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
