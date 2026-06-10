import React from 'react';
import { Sparkles, Medal, Tv, BookOpen, Award, CheckCircle } from 'lucide-react';
import { AboutContent, SiteConfig } from '../types';

interface AboutProps {
  content: AboutContent;
  site: SiteConfig;
  onOpenBooking: () => void;
  onOpenWhatsApp: () => void;
}

export default function About({ content, site, onOpenBooking, onOpenWhatsApp }: AboutProps) {
  const highlights = [
    { icon: <Medal className="w-5 h-5 text-[#C9A227]" />, title: 'Gold Medalist', subtitle: 'Bhartiya Vidya Bhavan, Delhi' },
    { icon: <Tv className="w-5 h-5 text-[#C9A227]" />, title: 'TV Panelist', subtitle: 'Aaj Tak, Zee News, ABP News' },
    { icon: <BookOpen className="w-5 h-5 text-[#C9A227]" />, title: 'Author & Expert', subtitle: '12+ books on Vedic Science' },
    { icon: <Award className="w-5 h-5 text-[#C9A227]" />, title: 'Industry Winner', subtitle: 'Best Vedic Astrologer 2025' }
  ];

  return (
    <section id="about" className="py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left Side Graphics */}
        <div className="flex items-center justify-center relative">
          <div className="w-[300px] h-[400px] sm:w-[350px] sm:h-[460px] rounded-[30px] border border-white/10 bg-gradient-to-br from-[#7C5CFC]/15 to-[#080B12]/80 flex items-center justify-center shadow-xl overflow-hidden relative">
            {content.image ? (
              <img 
                src={content.image} 
                alt="Acharya TN Khurana Portrait" 
                referrerPolicy="no-referrer" 
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-9xl filter drop-shadow-[0_0_24px_rgba(201,162,39,0.3)]">🧘</span>
            )}
          </div>

          <div className="absolute top-10 -left-6 bg-gradient-to-br from-[#7C5CFC]/90 to-[#7C5CFC]/70 border border-white/20 rounded-2xl p-4 backdrop-blur-md shadow-2xl flex flex-col gap-1 items-start text-left select-none animate-bounce" style={{ animationDuration: '5.5s' }}>
            <span className="font-serif text-3xl font-black text-white">30+</span>
            <span className="text-[10px] text-white/80 font-bold uppercase tracking-wider">Years of Spiritual<br />Knowledge</span>
          </div>

          <div className="absolute -bottom-6 -right-6 bg-[#0a0e18] border border-white/10 rounded-2xl p-5 shadow-2xl flex flex-col gap-1 items-start text-left select-none">
            <span className="font-serif text-3xl font-black bg-gradient-to-r from-[#C9A227] to-[#f5d98a] text-transparent bg-clip-text">1,50,000+</span>
            <span className="text-xs text-[#8b96aa] font-medium">Lives Transformed</span>
          </div>
        </div>

        {/* Right Side Content */}
        <div className="text-left space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#C9A227]/30 bg-[#C9A227]/10 text-xs font-bold text-[#f5d98a] uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            {content.eyebrow}
          </div>
          
          <h2 className="font-serif text-4xl sm:text-5xl font-bold leading-tight">
            Meet <span className="text-[#C9A227]">Acharya TN Khurana</span>
          </h2>

          <div className="flex items-center gap-3">
            <span className="h-[1px] w-16 bg-[#C9A227]" />
            <span className="text-[#C9A227] text-md">✦</span>
          </div>

          <p className="font-serif italic text-lg text-[#C9A227] leading-relaxed">
            {content.intro}
          </p>

          <p className="text-[#8b96aa] leading-relaxed text-sm sm:text-base">
            {content.text1}
          </p>

          <p className="text-[#8b96aa] leading-relaxed text-sm sm:text-base">
            {content.text2}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
            {highlights.map((h, i) => (
              <div key={i} className="flex gap-3.5 p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all">
                <div className="w-10 h-10 rounded-lg bg-[#C9A227]/10 border border-[#C9A227]/20 flex items-center justify-center shrink-0">
                  {h.icon}
                </div>
                <div>
                  <div className="text-sm font-bold text-[#e8eaf0]">{h.title}</div>
                  <div className="text-[11px] text-[#596478] font-medium mt-0.5">{h.subtitle}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-4 pt-2">
            <button onClick={onOpenBooking} className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#C9A227] to-[#f0d070] text-[#1a1000] text-sm font-bold shadow-lg hover:scale-105 transition-all">
              📅 Book Personal Session
            </button>
            <button onClick={onOpenWhatsApp} className="px-6 py-3.5 rounded-xl bg-white/5 border border-white/10 hover:border-[#C9A227] hover:text-[#C9A227] text-sm font-bold text-white transition-all">
              💬 Direct WhatsApp Chat
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
