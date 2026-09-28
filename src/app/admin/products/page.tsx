'use client';

import React from 'react';
import { MOCK_PRODUCTS } from '@/lib/mockData';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminProductsPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex items-center justify-between border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Marketplace Content Moderation</h1>
          <p className="text-xs text-slate-500 mt-1">Review active products listed across all campuses</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
        {MOCK_PRODUCTS.map((prod) => (
          <div key={prod.id} className="p-5 flex items-center justify-between gap-4 text-xs">
            <div className="space-y-1">
              <h3 className="font-bold text-slate-900 text-sm">{prod.title}</h3>
              <p className="text-slate-500">Category: {prod.category?.name} • Price: ₹{prod.price} • Seller: {prod.seller?.full_name}</p>
            </div>
            <button
              onClick={() => toast.info(`Moderated product: ${prod.title}`)}
              className="p-2 text-slate-400 hover:text-rose-600"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
