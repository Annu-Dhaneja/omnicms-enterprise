import React, { useState } from 'react';
import { Sparkles, Plus, Minus } from 'lucide-react';
import { FAQItem } from '../types';

interface FAQProps {
  faqs: FAQItem[];
}

export default function FAQ({ faqs }: FAQProps) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const toggleFold = (idx: number) => {
    setOpenIdx(prev => prev === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-24 relative z-10">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#C9A227]/30 bg-[#C9A227]/10 text-xs font-bold text-[#f5d98a] uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            ✦ Clearing Doubts
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold leading-tight">
            Frequently Asked <span className="text-[#C9A227]">Questions</span>
          </h2>
          <div className="flex items-center justify-center gap-3">
            <span className="h-[1px] w-12 bg-gradient-to-r from-[#C9A227] to-[#f0d070]" />
            <span className="text-[#C9A227] text-md">✦</span>
            <span className="h-[1px] w-12 bg-gradient-to-l from-[#C9A227] to-[#f0d070]" />
          </div>
          <p className="text-base text-[#8b96aa]">
            Find quick answers regarding chart times, gemstone purification, Vastu parameters, and consultation booking guidelines.
          </p>
        </div>

        {/* Collapsible List */}
        <div className="space-y-2 max-w-3xl mx-auto">
          {faqs.map((f, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div 
                key={f.id} 
                className="border-b border-white/5 last:border-0"
              >
                <div 
                  onClick={() => toggleFold(idx)}
                  className="flex items-center justify-between py-6 cursor-pointer gap-6 group"
                >
                  <div className={`text-base font-medium transition-colors text-left ${isOpen ? 'text-[#C9A227]' : 'text-slate-300 group-hover:text-white'}`}>
                    {f.q}
                  </div>
                  <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center border transition-all ${isOpen ? 'bg-[#C9A227]/10 border-[#C9A227]/30 text-[#C9A227] rotate-45' : 'bg-white/5 border-white/5 text-[#596478]'}`}>
                    <Plus className="w-4 h-4" />
                  </div>
                </div>

                {/* Collapsible fold */}
                <div 
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[300px] pb-6' : 'max-h-0'}`}
                >
                  <p className="text-sm sm:text-base text-[#8b96aa] text-left leading-relaxed">
                    {f.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
