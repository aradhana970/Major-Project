'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MOCK_PRODUCTS } from '@/lib/mockData';
import { PlusCircle, Sparkles, Trash2, Edit, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function MyListingsPage() {
  const [products, setProducts] = useState(MOCK_PRODUCTS);

  const toggleAvailability = (id: string) => {
    const updated = products.map((p) => {
      if (p.id === id) return { ...p, is_available: !p.is_available };
      return p;
    });
    setProducts(updated);
    toast.success('Listing availability updated!');
  };

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      const updated = products.filter((p) => p.id !== id);
      setProducts(updated);
      toast.info(`Deleted listing: ${title}`);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">My Listed Products</h1>
          <p className="text-xs text-slate-500 mt-1">Manage active listings, mark items as sold, or add AI-assisted products</p>
        </div>

        <Link
          href="/products/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-extrabold text-xs rounded-xl shadow-md transition-all"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>+ Create AI Product</span>
        </Link>
      </div>

      {/* Listings Table / Cards */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="divide-y divide-slate-100">
          {products.map((product) => (
            <div key={product.id} className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 bg-slate-100 rounded-xl overflow-hidden flex-shrink-0">
                  <Image
                    src={product.images?.[0]?.image_url || 'https://images.unsplash.com/photo-1632571401005-458e9d244591?w=200'}
                    alt={product.title}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 text-sm">{product.title}</h3>
                    {product.is_ai_assisted && (
                      <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-slate-900 text-amber-300 text-[10px] font-bold">
                        <Sparkles className="w-3 h-3" /> AI
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-500">
                    Category: <strong className="text-slate-700">{product.category?.name}</strong> • Condition: <strong className="text-slate-700">{product.condition}</strong>
                  </div>
                  <div className="text-xs font-black text-indigo-950">₹{product.price}</div>
                </div>
              </div>

              {/* Status & Actions */}
              <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                <button
                  onClick={() => toggleAvailability(product.id)}
                  className={`px-3 py-1 rounded-full text-xs font-bold border transition-colors ${
                    product.is_available
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-rose-50 text-rose-800 border-rose-200'
                  }`}
                >
                  {product.is_available ? 'Available' : 'Marked Sold'}
                </button>

                <button
                  onClick={() => handleDelete(product.id, product.title)}
                  className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
                  title="Delete listing"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
