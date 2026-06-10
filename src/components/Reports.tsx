import React from 'react';
import { Sparkles, FileText, Download } from 'lucide-react';
import { PremiumReport } from '../types';

interface ReportsProps {
  reports: PremiumReport[];
  onOpenBooking: (serviceName?: string) => void;
}

export default function Reports({ reports, onOpenBooking }: ReportsProps) {
  return (
    <section id="reports" className="py-24 relative z-10 bg-gradient-to-b from-transparent via-[#0FB8A0]/[0.02] to-transparent">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#0FB8A0]/30 bg-[#0FB8A0]/10 text-xs font-bold text-[#71ebd8] uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#0FB8A0]" />
            ✦ Personalized PDFs
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold leading-tight">
            Detailed <span className="text-[#0FB8A0]">Astrology Reports</span>
          </h2>
          <div className="flex items-center justify-center gap-3">
            <span className="h-[1px] w-12 bg-gradient-to-r from-[#0FB8A0] to-[#13d4ba]" />
            <span className="text-[#0FB8A0] text-md">✦</span>
            <span className="h-[1px] w-12 bg-gradient-to-l from-[#0FB8A0] to-[#13d4ba]" />
          </div>
          <p className="text-base text-[#8b96aa]">
            Order comprehensive, deeply analyzed PDF reports prepared by our advanced Vedic calculations engines and customized by the Acharya.
          </p>
        </div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {reports.map((r, i) => (
            <div 
              key={r.id} 
              className="group rounded-2xl overflow-hidden bg-white/[0.01] border border-white/5 transition-all duration-300 hover:translate-y-[-4px] hover:border-[#0FB8A0]/30 hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)]"
            >
              <div className="p-6 bg-gradient-to-br from-[#0FB8A0]/12 to-[#7C5CFC]/5 border-b border-white/5 text-center relative">
                <span className="text-4xl mb-3 block filter drop-shadow-[0_0_8px_rgba(15,184,160,0.3)]">{r.icon}</span>
                <div className="font-serif text-sm font-bold text-white tracking-wide">{r.name}</div>
              </div>
              <div className="p-6 space-y-4 text-left">
                <div className="flex items-baseline gap-2">
                  <span className="font-serif text-2xl font-black text-[#f5d98a]">{r.price}</span>
                  <span className="text-xs text-[#596478] line-through">{r.orig}</span>
                </div>
                <p className="text-xs text-[#8b96aa] leading-relaxed min-h-[48px]">{r.desc}</p>
                <button 
                  onClick={() => onOpenBooking(r.name)}
                  className="w-full h-10 rounded-xl bg-[#0FB8A0]/20 hover:bg-[#13d4ba]/30 border border-[#0FB8A0]/30 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5 text-[#0FB8A0]" /> Get PDF Report
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
