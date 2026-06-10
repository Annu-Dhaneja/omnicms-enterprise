import React, { useState } from 'react';
import { Search, Filter, BookOpen, Star, Sparkles, ShoppingCart, Eye } from 'lucide-react';
import { Book } from '../types';

interface BooksPageProps {
  books: Book[];
  onSelectBook: (id: string) => void;
  onAddToCart: (id: string) => void;
}

export default function BooksPage({ books = [], onSelectBook, onAddToCart }: BooksPageProps) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Extract unique categories
  const categories = ['All', ...Array.from(new Set(books.map(b => b.category)))];

  // Filter books
  const filtered = books.filter(b => {
    const matchesSearch = b.title.toLowerCase().includes(search.toLowerCase()) || 
                          b.author.toLowerCase().includes(search.toLowerCase()) ||
                          b.desc.toLowerCase().includes(search.toLowerCase());
    const matchesCat = activeCategory === 'All' || b.category === activeCategory;
    return matchesSearch && matchesCat;
  });

  // Pagination bounds
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedBooks = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const bestsellers = filtered.filter(b => b.isBestseller);
  const featured = filtered.filter(b => b.isFeatured);

  return (
    <div className="py-24 max-w-7xl mx-auto px-6 space-y-16 text-left animate-fadeInDown">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="cms-badge">Sacred Astro Literature</span>
        <h1 className="font-serif text-4xl sm:text-5xl font-extrabold text-[#C9A227]">
          Acharya's Manuscript & Astro Library
        </h1>
        <p className="text-[#8b96aa] text-sm">
          Shop authentic, detailed study books, home remedies manuals, and planetary correcting blueprints authored personally by Acharya TN Khurana.
        </p>
        <div className="h-[2px] w-24 bg-[#C9A227] mx-auto mt-4" />
      </div>

      {/* Categories & Search Panel */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-[#0a0e18] p-6 rounded-2xl border border-white/5">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <input 
            type="text" 
            value={search} 
            onChange={e => { setSearch(e.target.value); setCurrentPage(1); }} 
            placeholder="Search sacred books..." 
            className="form-input pl-10 pr-4 text-xs h-11" 
          />
          <Search className="absolute left-3 top-3 w-4 h-4 text-[#596478]" />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto justify-start md:justify-end">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => { setActiveCategory(cat); setCurrentPage(1); }}
              className={`px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
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

      {/* Featured & Bestsellers highlight section */}
      {featured.length > 0 && search === '' && activeCategory === 'All' && (
        <div className="space-y-4">
          <h2 className="text-lg font-serif font-bold text-[#C9A227] flex gap-2 items-center">
            <Sparkles className="w-4 h-4" />
            Featured & Bestselling Astro Guides
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featured.slice(0, 2).map(b => (
              <div 
                key={b.id} 
                onClick={() => onSelectBook(b.id)}
                className="p-5 rounded-2xl border border-[#C9A227]/20 bg-gradient-to-br from-[#0a0e18] to-[#12182b] flex gap-4 hover:border-[#C9A227] hover:scale-[1.01] transition-all cursor-pointer text-left"
              >
                <img src={b.coverImage} alt={b.title} className="w-24 h-32 rounded-xl object-cover shrink-0 bg-[#080B12]" referrerPolicy="no-referrer" />
                <div className="flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <span className="text-[9px] uppercase font-black text-[#C9A227] bg-[#C9A227]/10 px-2 py-0.5 rounded-md">Bestseller Blueprint</span>
                    <h3 className="font-serif font-black text-white text-md line-clamp-1">{b.title}</h3>
                    <p className="text-[11px] text-[#8b96aa] line-clamp-2 leading-relaxed">{b.desc}</p>
                  </div>
                  <div className="flex justify-between items-center mt-2.5">
                    <span className="text-xs font-mono font-bold text-white">₹{b.salePrice || b.price}</span>
                    <span className="text-[10px] text-[#C9A227] font-semibold flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" /> View Cover Pages
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Primary books grid */}
      <div className="space-y-6">
        <h2 className="text-xl font-serif font-bold text-white">All Publications Listing</h2>
        
        {paginatedBooks.length === 0 ? (
          <div className="text-center py-16 text-[#596478] bg-[#0a0e18] rounded-2xl border border-white/5">
            No publications found matching your search term.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {paginatedBooks.map(b => (
              <div 
                key={b.id} 
                className="p-5 rounded-2xl bg-[#0a0e18] border border-white/5 flex flex-col justify-between hover:border-[#C9A227]/30 hover:scale-[1.01] transition-all"
              >
                <div className="space-y-4">
                  <div className="relative group cursor-pointer overflow-hidden rounded-xl aspect-[3/4] bg-[#080B12]" onClick={() => onSelectBook(b.id)}>
                    <img 
                      src={b.coverImage} 
                      alt={b.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                      referrerPolicy="no-referrer" 
                    />
                    <div className="absolute inset-0 bg-[#04060b]/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-xs font-bold text-white bg-black/40">
                      View Manuscript Details
                    </div>
                    {b.isBestseller && (
                      <span className="absolute top-3 left-3 bg-[#C9A227] text-[#1a1000] text-[9px] font-black uppercase px-2 py-0.5 rounded-md shadow-md">
                        🔥 Bestseller
                      </span>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[9px] uppercase font-bold text-[#8b96aa] block tracking-wide">{b.category}</span>
                    <h3 onClick={() => onSelectBook(b.id)} className="font-serif font-bold text-white text-md cursor-pointer hover:text-[#C9A227] transition-all line-clamp-1">{b.title}</h3>
                    <p className="text-[11px] text-[#596478] line-clamp-2 leading-relaxed">{b.desc}</p>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-white/5 space-y-3">
                  <div className="flex justify-between items-baseline">
                    <span className="text-[#596478] text-[10px]">Investment Price</span>
                    <div className="flex gap-1.5 items-baseline">
                      {b.salePrice && <span className="text-[#596478] line-through text-[10px]/none">₹{b.price}</span>}
                      <span className="text-md font-mono font-bold text-white">₹{b.salePrice || b.price}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => onSelectBook(b.id)}
                      className="px-3 py-2 rounded-xl text-[10px] font-bold bg-white/5 border border-white/10 text-[#8b96aa] hover:text-white hover:bg-white/10 text-center cursor-pointer"
                    >
                      Read Reviews
                    </button>
                    <button 
                      onClick={() => onAddToCart(b.id)}
                      className="px-3 py-2 rounded-xl text-[10px] font-bold bg-gradient-to-r from-[#C9A227] to-[#f0d070] text-[#1a1000] hover:scale-105 transition-all text-center flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <ShoppingCart className="w-3 h-3" /> Add To Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination component */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 py-4">
          {[...Array(totalPages)].map((_, idx) => (
            <button
              key={idx + 1}
              onClick={() => { setCurrentPage(idx + 1); window.scrollTo({ top: 300, behavior: 'smooth' }); }}
              className={`w-9 h-9 rounded-xl text-xs font-black transition-all cursor-pointer ${
                currentPage === idx + 1 
                  ? 'bg-[#C9A227] text-[#1a1000]' 
                  : 'bg-white/5 border border-white/5 text-[#8b96aa] hover:bg-white/10 hover:text-white'
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      )}

    </div>
  );
}
