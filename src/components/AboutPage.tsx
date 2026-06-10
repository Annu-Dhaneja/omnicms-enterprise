import React, { useState } from 'react';
import { Award, Shield, CheckCircle, Navigation, Award as Trophy, Users, GraduationCap, Clock, Play, Sparkles } from 'lucide-react';
import { AboutContent, SiteConfig } from '../types';

interface AboutPageProps {
  about: AboutContent;
  site: SiteConfig;
}

export default function AboutPage({ about, site }: AboutPageProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="py-24 max-w-7xl mx-auto px-6 space-y-20 text-left animate-fadeInDown">
      {/* Page Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="cms-badge">Vedic Scholar History</span>
        <h1 className="font-serif text-4xl sm:text-5xl font-extrabold text-[#C9A227] tracking-tight">
          {about.title || "The Biography of Acharya TN Khurana"}
        </h1>
        <p className="font-serif italic text-lg text-white/70">
          {about.intro}
        </p>
        <div className="h-[2px] w-24 bg-[#C9A227] mx-auto mt-4" />
      </div>

      {/* Biography & Achievements Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <div className="space-y-6">
          <h2 className="text-2xl font-serif font-black text-white border-b border-white/5 pb-2">
            Detailed Biography
          </h2>
          {about.image && (
            <div className="w-full max-w-md h-80 sm:h-96 rounded-2xl overflow-hidden border border-white/10 shadow-lg relative group bg-gradient-to-br from-[#7C5CFC]/5 to-[#C9A227]/5">
              <img 
                src={about.image} 
                alt="Acharya TN Khurana Portrait" 
                referrerPolicy="no-referrer" 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080B12]/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4">
                <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-[#C9A227] text-[#1a1000] uppercase tracking-wider">
                  Vedic Scholar Active Archive
                </span>
              </div>
            </div>
          )}
          <p className="text-[#8b96aa] leading-relaxed text-sm sm:text-base whitespace-pre-line">
            {about.biography || about.text1}
          </p>
          <div className="p-6 rounded-2xl bg-gradient-to-br from-[#C9A227]/5 to-[#7C5CFC]/5 border border-[#C9A227]/20">
            <h3 className="text-sm font-bold text-[#C9A227] uppercase tracking-wider mb-3">Academic Base & Credentials</h3>
            <p className="text-xs text-[#8b96aa] leading-relaxed">
              {about.text2}
            </p>
          </div>
        </div>

        {/* Core Achievements block */}
        <div className="space-y-6">
          <h2 className="text-2xl font-serif font-black text-white border-b border-white/5 pb-2">
            Prestigious Milestones & Achievements
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {(about.achievements || [about.goldMedalist, about.tvPanelist, about.author, about.awardWinner]).map((item, idx) => (
              <div key={idx} className="flex gap-4 p-4 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all">
                <div className="w-10 h-10 rounded-lg bg-[#C9A227]/10 border border-[#C9A227]/20 flex items-center justify-center shrink-0">
                  <Trophy className="w-4 h-4 text-[#C9A227]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Honor & Acknowledgement</h3>
                  <p className="text-xs text-[#8b96aa] mt-1">{item}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mission & Vision & Experience */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-8 rounded-2xl bg-[#0a0e18] border border-white/5 relative overflow-hidden group hover:border-[#C9A227]/30 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full filter blur-xl" />
          <h3 className="text-lg font-serif font-bold text-white mb-3">Our Cosmic Mission</h3>
          <p className="text-xs text-[#8b96aa] leading-relaxed">
            {about.mission || "To eliminate superstitious misconceptions of astrology and deliver diagnostic, mathematical forecasts based only on authentic Shastra principles."}
          </p>
        </div>

        <div className="p-8 rounded-2xl bg-[#0a0e18] border border-white/5 relative overflow-hidden group hover:border-[#C9A227]/30 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/5 rounded-full filter blur-xl" />
          <h3 className="text-lg font-serif font-bold text-white mb-3">Our Predictive Vision</h3>
          <p className="text-xs text-[#8b96aa] leading-relaxed">
            {about.vision || "To make precise chart readings and remedial directions approachable for corporate consultants, domestic partners, and spiritual seekers around the globe."}
          </p>
        </div>

        <div className="p-8 rounded-2xl bg-[#0a0e18] border border-white/5 relative overflow-hidden group hover:border-[#C9A227]/30 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full filter blur-xl" />
          <h3 className="text-lg font-serif font-bold text-white mb-3">Years of Deep Experience</h3>
          <p className="text-xs text-[#8b96aa] leading-relaxed">
            {about.experience || "30+ years of active practicing, providing certified remedies to over 1.5 lakh individuals with an outstanding verified accuracy rate."}
          </p>
        </div>
      </div>

      {/* Videos & Gallery Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Videos Block */}
        <div className="space-y-6">
          <h2 className="text-2xl font-serif font-black text-white">About Images & Videos</h2>
          <p className="text-xs text-[#8b96aa] leading-relaxed">
            Witness the television highlights, Gurukul certifications, and seminar lectures of Acharya TN Khurana. We promote non-superstitious astrological methods daily on premium national TV networks.
          </p>
          <div className="aspect-video w-full rounded-2xl border border-white/10 bg-[#0a0e18] overflow-hidden relative group">
            {isPlaying ? (
              <iframe 
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                title="Acharya Life Video"
                className="w-full h-full"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-tr from-[#080B12] to-[#1a1c26] text-center p-6">
                <button 
                  onClick={() => setIsPlaying(true)}
                  className="w-16 h-16 rounded-full bg-gradient-to-r from-[#C9A227] to-[#f0d070] text-[#1a1000] flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-transform"
                >
                  <Play className="w-6 h-6 fill-current ml-1" />
                </button>
                <span className="text-xs font-bold text-white mt-4 uppercase tracking-widest text-[#C9A227]">Launch Biography Presentation</span>
                <span className="text-[10px] text-[#596478] mt-1">Video documentary on Vedic remediation parameters · 3 mins</span>
              </div>
            )}
          </div>
        </div>

        {/* Certifications Block */}
        <div className="space-y-6">
          <h2 className="text-2xl font-serif font-black text-white">Elite Certifications</h2>
          <div className="space-y-3">
            {(about.certifications || [
              "Vedic Jyotish Acharya (Bhartiya Vidya Bhavan)",
              "Siddha Vastu Shastra Mahamahopadhyay",
              "Advanced Kundli Diagnostician Board Certification",
              "TV Panel Expert Spiritual Counsel Accreditation"
            ]).map((cert, i) => (
              <div key={i} className="flex gap-3 items-center p-3 rounded-xl bg-white/[0.01] border border-white/5">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="text-xs text-[#8b96aa]">{cert}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Members Section */}
      <div className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-serif font-black text-white">Vedic Council Team Members</h2>
          <p className="text-xs text-[#8b96aa] max-w-xl mx-auto">
            Our specialized team of Sanskrit researchers, Vastu designers, and mathematical calculators make sure every single chart is thoroughly verified.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(about.team || []).map((t) => (
            <div key={t.id} className="p-6 rounded-2xl bg-[#0e1320] border border-white/5 hover:border-[#C9A227]/20 transition-all text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#C9A227]/20 to-[#7C5CFC]/20 border border-white/10 flex items-center justify-center text-4xl mx-auto">
                {t.image || "🧘"}
              </div>
              <div>
                <h4 className="font-serif font-bold text-white text-md">{t.name}</h4>
                <div className="text-xs text-[#C9A227] font-medium mt-0.5">{t.role}</div>
              </div>
              <p className="text-[11px] text-[#596478] leading-relaxed">
                {t.bio || "Senior expert dedicated to preserving pure astro diagnostics for seekers."}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Journey Timeline */}
      <div className="space-y-8">
        <h2 className="text-3xl font-serif font-black text-white text-center">Spiritual Journey Timeline</h2>
        <div className="relative border-l border-white/10 ml-4 md:ml-32 space-y-8 py-4">
          {(about.timeline || []).map((t, idx) => (
            <div key={t.id || idx} className="relative pl-10">
              {/* Year Bubble */}
              <div className="absolute -left-[14px] top-1.5 w-7 h-7 rounded-full bg-[#0a0e18] border-2 border-[#C9A227] flex items-center justify-center text-[10px] font-black text-[#C9A227]">
                ✨
              </div>
              <div className="space-y-1">
                <span className="text-xs font-black text-[#C9A227] bg-[#C9A227]/10 px-2 py-0.5 rounded-full mr-2">
                  {t.year}
                </span>
                <span className="font-serif font-bold text-white text-base block sm:inline">{t.title}</span>
                <p className="text-xs text-[#8b96aa] max-w-2xl pt-1">
                  {t.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
