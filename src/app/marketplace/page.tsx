'use client';

import React, { useState, useMemo } from 'react';
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from '@/lib/mockData';
import { ProductCard } from '@/components/ui/ProductCard';
import { Search, Filter, SlidersHorizontal, ArrowUpDown, X, Sparkles } from 'lucide-react';

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCondition, setSelectedCondition] = useState<string>('all');
  const [priceSort, setPriceSort] = useState<'newest' | 'price-low' | 'price-high'>('newest');
  const [maxPrice, setMaxPrice] = useState<number>(2500);

  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter((product) => {
      // Search query
      const matchesSearch = searchQuery === '' || 
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.tags && product.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));

      // Category filter
      const matchesCategory = selectedCategory === 'all' || 
        product.category?.slug === selectedCategory || 
        product.category_id === selectedCategory;

      // Condition filter
      const matchesCondition = selectedCondition === 'all' || product.condition === selectedCondition;

      // Max price filter
      const matchesPrice = product.price <= maxPrice;

      return matchesSearch && matchesCategory && matchesCondition && matchesPrice;
    }).sort((a, b) => {
      if (priceSort === 'price-low') return a.price - b.price;
      if (priceSort === 'price-high') return b.price - a.price;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }, [searchQuery, selectedCategory, selectedCondition, priceSort, maxPrice]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Campus Marketplace Catalog</h1>
          <p className="text-xs text-slate-500 mt-1">Verified student-to-student educational items & study supplies</p>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-600 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">
            Showing <strong className="text-indigo-600">{filteredProducts.length}</strong> items
          </span>
        </div>
      </div>

      {/* Main Filter & Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar Filters */}
        <aside className="lg:col-span-1 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-6 h-fit">
          
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-indigo-600" /> Filter Marketplace
            </h3>
            {(selectedCategory !== 'all' || selectedCondition !== 'all' || searchQuery !== '') && (
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedCondition('all');
                  setSearchQuery('');
                  setMaxPrice(2500);
                }}
                className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700"
              >
                Reset
              </button>
            )}
          </div>

          {/* Search Filter */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Search Keywords</label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Casio, Grewal, Lab coat..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">Category</label>
            <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  selectedCategory === 'all' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                All Categories
              </button>
              {MOCK_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors truncate ${
                    selectedCategory === cat.slug ? 'bg-indigo-600 text-white font-bold' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Product Condition Filter */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">Condition</label>
            <div className="grid grid-cols-2 gap-1.5">
              {['all', 'New', 'Like New', 'Good', 'Used'].map((cond) => (
                <button
                  key={cond}
                  onClick={() => setSelectedCondition(cond)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border text-center transition-colors ${
                    selectedCondition === cond
                      ? 'bg-slate-900 text-white border-slate-900 font-bold'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {cond === 'all' ? 'Any Condition' : cond}
                </button>
              ))}
            </div>
          </div>

          {/* Max Price Slider */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1.5">
              <span>Max Price:</span>
              <span className="text-indigo-600">₹{maxPrice}</span>
            </div>
            <input
              type="range"
              min={100}
              max={3000}
              step={50}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>₹100</span>
              <span>₹3,000</span>
            </div>
          </div>

          {/* Sort By Dropdown */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" /> Sort Order
            </label>
            <select
              value={priceSort}
              onChange={(e: any) => setPriceSort(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
            >
              <option value="newest">Newest Listings First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>

        </aside>

        {/* Product Grid */}
        <main className="lg:col-span-3 space-y-6">
          
          {filteredProducts.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-4">
              <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">No Matching Products Found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try adjusting your search keywords or resetting category filters to see more student items.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedCondition('all');
                  setSearchQuery('');
                  setMaxPrice(2500);
                }}
                className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

        </main>

      </div>
    </div>
  );
}
