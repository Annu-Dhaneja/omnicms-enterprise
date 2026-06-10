import React, { useState } from 'react';
import { Search, Calendar, User, Heart, Share2, ArrowLeft, MessageSquare, Tag, Award, Sparkles } from 'lucide-react';
import { BlogPost } from '../types';

interface BlogPageProps {
  blogData: BlogPost[];
  onPostComment: (blogId: string, author: string, text: string) => void;
}

export default function BlogPage({ blogData, onPostComment }: BlogPageProps) {
  const [activeTab, setActiveTab] = useState<'list' | 'detail'>('list');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [copied, setCopied] = useState(false);

  // Comment input states
  const [commName, setCommName] = useState('');
  const [commMsg, setCommMsg] = useState('');
  const [commSuccess, setCommSuccess] = useState(false);

  // Extract blogs
  const allBlogs = blogData || [];
  const categories = ['All', ...Array.from(new Set(allBlogs.map(b => b.category)))];

  // Filter
  const filtered = allBlogs.filter(b => {
    const matchesSearch = b.title.toLowerCase().includes(search.toLowerCase()) ||
                          (b.excerpt || b.content || '').toLowerCase().includes(search.toLowerCase());
    const matchesCat = activeCategory === 'All' || b.category === activeCategory;
    return matchesSearch && matchesCat;
  });

  const popular = allBlogs.slice(0, 3);

  const selectedBlog = allBlogs.find(b => b.id === selectedId);

  // Related Blogs for detail page
  const relatedBlogs = selectedBlog
    ? allBlogs.filter(b => b.category === selectedBlog.category && b.id !== selectedBlog.id).slice(0, 3)
    : [];

  const handleShare = (id: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/blog/${id}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedId || !commName || !commMsg) return;
    onPostComment(selectedId, commName, commMsg);
    setCommSuccess(true);
    setCommName('');
    setCommMsg('');
    setTimeout(() => setCommSuccess(false), 5500);
  };

  return (
    <div className="py-24 max-w-7xl mx-auto px-6 space-y-16 text-left animate-fadeInDown">
      
      {/* HEADER SECTION */}
      {activeTab === 'list' ? (
        <div className="space-y-12">
          {/* Header */}
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <span className="cms-badge">Vedic Wisdom Posts</span>
            <h1 className="font-serif text-4xl sm:text-5xl font-extrabold text-[#C9A227]">
              Planetary Transits & Spiritual Research Blog
            </h1>
            <p className="text-[#8b96aa] text-sm sm:text-base">
              Weekly publications authored by Acharya TN Khurana discussing Kundli transits, Saturn Sade Sati rules, Vastu blueprints & mantras.
            </p>
            <div className="h-[2px] w-24 bg-[#C9A227] mx-auto mt-4" />
          </div>

          {/* Search, Filter & Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Main Listing Left Column (8 cols) */}
            <div className="lg:col-span-8 space-y-8">
              {/* Search & filters bar */}
              <div className="flex flex-col sm:flex-row justify-between items-center bg-[#0a0e18] p-5 rounded-2xl border border-white/5 gap-4">
                <div className="relative w-full sm:w-72 text-xs">
                  <input 
                    type="text" 
                    value={search} 
                    onChange={e => setSearch(e.target.value)} 
                    placeholder="Search transit insights..." 
                    className="form-input pl-10 pr-4 h-10 text-xs" 
                  />
                  <Search className="absolute left-3.5 top-3 w-4 h-4 text-[#596478]" />
                </div>

                <div className="flex flex-wrap gap-1.5 justify-start sm:justify-end">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-3 py-1.5 rounded-xl text-[9.5px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                        activeCategory === cat 
                          ? 'bg-gradient-to-r from-[#C9A227] to-[#f0d070] text-[#1a1000]' 
                          : 'bg-white/5 border border-white/5 text-[#8b96aa] hover:bg-white/10 text-white'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Main List Grid */}
              {filtered.length === 0 ? (
                <div className="text-center py-16 text-[#596478] bg-[#0a0e18] rounded-2xl border border-white/5 text-xs">
                  No research articles found matching your criteria.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {filtered.map(b => (
                    <div 
                      key={b.id} 
                      className="p-5 rounded-2xl bg-[#0a0e18] border border-white/5 flex flex-col justify-between hover:border-white/10 hover:scale-[1.01] transition-all"
                    >
                      <div className="space-y-4">
                        <div 
                          className="relative aspect-video rounded-xl overflow-hidden bg-[#080B12] cursor-pointer"
                          onClick={() => { setSelectedId(b.id); setActiveTab('detail'); }}
                        >
                          <img src={b.image} alt={b.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          <span className="absolute top-3 left-3 bg-[#C9A227]/90 text-[#1a1000] text-[9px] font-black uppercase px-2.5 py-0.5 rounded-md">
                            {b.category}
                          </span>
                        </div>

                        <div className="space-y-2 text-left">
                          <div className="flex items-center gap-4 text-[10px] text-[#596478]">
                            <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {b.date}</span>
                            <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> Admin</span>
                          </div>
                          
                          <h3 
                            onClick={() => { setSelectedId(b.id); setActiveTab('detail'); }}
                            className="font-serif font-bold text-white hover:text-[#C9A227] transition-all text-md line-clamp-1 cursor-pointer"
                          >
                            {b.title}
                          </h3>
                          
                          <p className="text-xs text-[#8b96aa] line-clamp-2 leading-relaxed">
                            {b.desc}
                          </p>
                        </div>
                      </div>

                      <div className="pt-4 mt-4 border-t border-white/5 flex justify-between items-center text-[10.5px]">
                        <button 
                          onClick={() => { setSelectedId(b.id); setActiveTab('detail'); }}
                          className="font-bold text-[#C9A227] hover:underline"
                        >
                          Read Entire Scroll & Comments →
                        </button>
                        <span className="text-[#596478] font-mono">{b.comments?.length || 0} comments</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Sidebar Columns (4 cols) */}
            <div className="lg:col-span-4 space-y-6 text-xs text-left">
              {/* Popular Blogs */}
              <div className="p-6 rounded-2xl bg-[#0a0e18] border border-white/5 space-y-4">
                <h3 className="font-serif text-sm font-bold text-[#C9A227] flex gap-1.5 items-center">
                  <Sparkles className="w-4 h-4" /> Popular Planetary Insights
                </h3>
                
                <div className="divide-y divide-white/5">
                  {popular.map(p => (
                    <div 
                      key={p.id} 
                      onClick={() => { setSelectedId(p.id); setActiveTab('detail'); }}
                      className="py-3 flex gap-3 hover:opacity-85 transition-opacity cursor-pointer text-left"
                    >
                      <img src={p.image} alt={p.title} className="w-12 h-12 object-cover rounded bg-[#080B12]" referrerPolicy="no-referrer" />
                      <div className="space-y-0.5">
                        <h4 className="font-serif font-bold text-white text-xs line-clamp-1">{p.title}</h4>
                        <span className="text-[9.5px] text-[#596478] block">{p.date} · {p.category}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Transit Advisory Board */}
              <div className="p-6 rounded-2xl bg-[#0a0e18] border border-white/5 space-y-3 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#7C5CFC]/5 rounded-full filter blur-xl" />
                <h3 className="font-serif text-sm font-bold text-white">Daily Transit Alert</h3>
                <p className="text-[10px] text-[#8b96aa] leading-relaxed">
                  Jupiter is transiting home Taurus houses, supporting strong wealth-recovery loops for Capricorn, Virgo & Scorpio natives. Keep daily mantra practices active.
                </p>
                <div className="flex gap-2.5 items-center text-[10px] text-[#C9A227] bg-[#C9A227]/5 p-2 rounded-lg leading-snug">
                  <Award className="w-4 h-4 shrink-0" />
                  <span>Verified under Bhartiya Vidya Bhavan mathematical rules.</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      ) : (
        /* SINGLE BLOG DETAIL VIEW */
        selectedBlog && (
          <div className="space-y-10">
            {/* Back to Blog List */}
            <button 
              onClick={() => setActiveTab('list')} 
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8b96aa] hover:text-[#C9A227] cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Returns to Research Scrolls
            </button>

            {/* Article Canvas */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              {/* Blog Long Contents - Left (8 cols) */}
              <div className="lg:col-span-8 bg-[#0a0e18] p-8 rounded-3xl border border-white/5 space-y-6">
                
                {/* Meta details */}
                <div className="space-y-3">
                  <span className="text-xs uppercase font-extrabold text-[#C9A227] tracking-wider">{selectedBlog.category}</span>
                  <h1 className="font-serif text-2xl sm:text-3.5xl font-extrabold text-white leading-tight">
                    {selectedBlog.title}
                  </h1>
                  
                  <div className="flex items-center gap-3 text-xs text-[#596478] border-b border-white/5 pb-4">
                    <span>Published: <b>{selectedBlog.date}</b></span>
                    <span className="h-3 w-[1px] bg-white/10" />
                    <span>Author: <b>Acharya TN Khurana</b></span>
                    <span className="h-3 w-[1px] bg-white/10" />
                    <button 
                      onClick={() => handleShare(selectedBlog.id)}
                      className="text-white hover:text-[#C9A227] flex items-center gap-1 transition-colors hover:underline"
                    >
                      <Share2 className="w-3.5 h-3.5" /> {copied ? 'Link Copied!' : 'Share Article'}
                    </button>
                  </div>
                </div>

                {/* Banner */}
                <div className="aspect-video w-full rounded-2xl overflow-hidden bg-[#0a0e18]">
                  <img src={selectedBlog.image} alt={selectedBlog.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>

                {/* Description */}
                <div className="space-y-4 text-xs sm:text-sm text-[#8b96aa] leading-relaxed whitespace-pre-line text-left">
                  <p className="font-medium text-white">{selectedBlog.desc}</p>
                  
                  <p>
                    Vedic astrological transits indicate that modern living patterns must stay aligned with Nakshatra thresholds. Every transit involves a complete house rotation that affects mental peace, physical health, and commercial opportunities differently. When executing major professional shifts, ensure that your moon house configurations do not fall into bad aspect grids.
                  </p>
                  
                  <div className="p-5 rounded-2xl bg-gradient-to-tr from-[#C9A227]/5 to-[#7C5CFC]/5 border border-[#C9A227]/10 my-4 text-xs text-[#C9A227] leading-relaxed">
                    <span className="font-serif font-black block mb-1">Acharya's Recommended Remedy:</span>
                    "Chant the specialized planetary beej mantra 108 times daily during sandhya hour. Keep copper plates on the north Vastu coordinates of your workspace to stabilize mercury and sun positions."
                  </div>
                  
                  <p>
                    For detailed natal charts, readers can book 1-on-1 private calculations. Our council coordinates birth times up to the seconds level to resolve specific D9 and D60 divisional constraints cleanly.
                  </p>
                </div>
              </div>

              {/* Sidebar and comments - Right (4 cols) */}
              <div className="lg:col-span-4 space-y-6 text-xs text-left">
                {/* Related Blogs in Detail */}
                {relatedBlogs.length > 0 && (
                  <div className="p-6 rounded-2xl bg-[#0a0e18] border border-white/5 space-y-3">
                    <h3 className="font-serif font-bold text-white text-sm">Related Shastra Reads</h3>
                    <div className="space-y-2">
                      {relatedBlogs.map(r => (
                        <div 
                          key={r.id} 
                          onClick={() => setSelectedId(r.id)}
                          className="flex gap-2 items-center hover:opacity-80 transition-opacity cursor-pointer border-b border-white/5 pb-2 last:border-0"
                        >
                          <img src={r.image} alt={r.title} className="w-10 h-10 object-cover rounded bg-[#080B12]" referrerPolicy="no-referrer" />
                          <h4 className="font-serif font-bold text-white text-[11px] line-clamp-1">{r.title}</h4>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Comment Section List */}
                <div className="p-6 rounded-2xl bg-[#0a0e18] border border-white/5 space-y-4">
                  <h3 className="font-serif text-sm font-bold text-white border-b border-white/5 pb-2 flex gap-1.5 items-center">
                    <MessageSquare className="w-4 h-4 text-[#C9A227]" /> Comments ({selectedBlog.comments?.length || 0})
                  </h3>
                  
                  <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                    {(selectedBlog.comments || []).map((c, n) => (
                      <div key={n} className="p-3 bg-white/[0.01] rounded-xl border border-white/5 text-[10.5px]">
                        <div className="flex justify-between items-center text-[#596478] mb-1 font-semibold">
                          <span>{c.author}</span>
                          <span>9:00 AM</span>
                        </div>
                        <p className="text-[#8b96aa] leading-snug">"{c.text || c.comment}"</p>
                      </div>
                    ))}
                  </div>

                  {/* Add dynamic comment box */}
                  <div className="pt-2 border-t border-white/5 space-y-3">
                    <span className="text-[10px] uppercase font-bold text-[#8b96aa] block">Write a Comment</span>
                    
                    {commSuccess ? (
                      <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-center text-[10px] font-semibold">
                        🕉️ Comment submitted!
                      </div>
                    ) : (
                      <form onSubmit={handleCommentSubmit} className="space-y-2">
                        <input 
                          type="text" 
                          value={commName} 
                          onChange={e => setCommName(e.target.value)} 
                          placeholder="Your Name (e.g., Rohit)" 
                          className="form-input text-xs" 
                          required 
                        />
                        <textarea 
                          value={commMsg} 
                          onChange={e => setCommMsg(e.target.value)} 
                          placeholder="Share your views..." 
                          className="form-textarea h-16 text-xs" 
                          required 
                        />
                        <button type="submit" className="w-full h-9 bg-[#C9A227] text-[#1a1000] font-black rounded-lg text-[10px] cursor-pointer">
                          Post Comment Scroll
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      )}

    </div>
  );
}
