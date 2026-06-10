import React, { useState } from 'react';
import { Sparkles, Calendar, Clock, User, X, BookOpen } from 'lucide-react';
import { BlogPost } from '../types';

interface BlogProps {
  posts: BlogPost[];
}

export default function Blog({ posts }: BlogProps) {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  return (
    <section id="blog" className="py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#C9A227]/30 bg-[#C9A227]/10 text-xs font-bold text-[#f5d98a] uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            ✦ Vedic Archives
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold leading-tight">
            Latest <span className="text-[#C9A227]">Articles</span> & Cosmic Insights
          </h2>
          <div className="flex items-center justify-center gap-3">
            <span className="h-[1px] w-12 bg-gradient-to-r from-[#C9A227] to-[#f0d070]" />
            <span className="text-[#C9A227] text-md">✦</span>
            <span className="h-[1px] w-12 bg-gradient-to-l from-[#C9A227] to-[#f0d070]" />
          </div>
          <p className="text-base text-[#8b96aa]">
            Stay updated with Shani transits, Rahu-Ketu remedies, Ekadashi Vrat rituals, and spiritual techniques written directly by Acharya TN Khurana.
          </p>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.filter(b => b.status === 'published').map((b, i) => (
            <div 
              key={b.id} 
              onClick={() => setSelectedPost(b)}
              className="group rounded-2xl overflow-hidden bg-white/[0.01] border border-white/5 cursor-pointer transition-all duration-300 hover:translate-y-[-4px] hover:border-[#C9A227]/25"
            >
              <div className="aspect-[16/9] bg-gradient-to-br from-[#7C5CFC]/20 to-[#C9A227]/10 flex items-center justify-center text-4xl relative overflow-hidden">
                <span className="relative z-10 text-5xl filter drop-shadow-[0_0_12px_rgba(201,162,39,0.4)]">{b.icon}</span>
                {/* Image Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#080B12] via-transparent to-transparent opacity-80" />
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-bold bg-gradient-to-r from-[#C9A227] to-[#f0d070] text-[#1a1000] uppercase tracking-wider">
                  {b.category}
                </span>
              </div>
              <div className="p-6 text-left space-y-3">
                <div className="flex items-center gap-3 text-xs text-[#596478] font-medium">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {b.date}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {b.readTime} read</span>
                </div>
                <h3 className="font-serif text-base font-bold text-white group-hover:text-[#f0d070] transition-colors line-clamp-2 leading-snug">
                  {b.title}
                </h3>
                <p className="text-xs text-[#8b96aa] line-clamp-3 leading-relaxed">
                  {b.excerpt}
                </p>
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#C9A227] mt-4">
                  Read Full Article <span>→</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Detailed Blog Post Modal */}
        {selectedPost && (
          <div className="fixed inset-0 bg-[#080B12]/80 backdrop-blur-md z-[3000] flex items-center justify-center p-6 transition-opacity duration-300">
            <div className="bg-[#0f1425] border border-white/10 rounded-[24px] p-8 max-w-[680px] w-full max-h-[85vh] overflow-y-auto relative shadow-2xl transition-transform duration-300">
              
              <button 
                onClick={() => setSelectedPost(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-[#8b96aa] hover:bg-white/10 hover:text-white transition-all z-10"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="text-left space-y-6 pt-4">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#C9A227]/10 border border-[#C9A227]/20 text-[#f5d98a] uppercase tracking-wider">
                    {selectedPost.category}
                  </span>
                  <div className="flex items-center gap-3 text-xs text-[#596478] font-semibold">
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {selectedPost.date}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {selectedPost.readTime} read</span>
                  </div>
                </div>

                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#f5d98a] leading-tight">
                  {selectedPost.title}
                </h1>

                <div className="flex items-center gap-2 text-xs font-semibold text-[#8b96aa] pb-4 border-b border-white/5">
                  <User className="w-3.5 h-3.5 text-[#C9A227]" />
                  Written by: <span className="text-white">{selectedPost.author}</span>
                </div>

                <div className="markdown-body text-sm text-[#e8eaf0] space-y-4 whitespace-pro-wrap leading-relaxed font-sans">
                  {selectedPost.content}
                </div>

                <div className="flex justify-end pt-4">
                  <button 
                    onClick={() => setSelectedPost(null)} 
                    className="px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 text-sm font-bold text-[#e8eaf0] transition-all"
                  >
                    Close Article
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
