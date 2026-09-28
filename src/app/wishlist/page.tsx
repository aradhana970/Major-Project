'use client';

import React from 'react';
import Link from 'next/link';
import { MOCK_PRODUCTS } from '@/lib/mockData';
import { ProductCard } from '@/components/ui/ProductCard';
import { Heart, ArrowRight } from 'lucide-react';

export default function WishlistPage() {
  const wishlistItems = MOCK_PRODUCTS.slice(0, 2);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex items-center justify-between border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Saved Wishlist</h1>
          <p className="text-xs text-slate-500 mt-1">Bookmarked student supplies and reference books</p>
        </div>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-4">
          <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
            <Heart className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">Your Wishlist is Empty</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Click the heart icon on any product card in the marketplace to bookmark items.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlistItems.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      )}
    </div>
  );
}
