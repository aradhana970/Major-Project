'use client';

import React from 'react';
import Link from 'next/link';
import { MessageSquare, ArrowRight, ShieldCheck, ShoppingBag } from 'lucide-react';

export default function CartPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 text-center">
      
      <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-xl space-y-6">
        
        <div className="w-16 h-16 mx-auto rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
          <MessageSquare className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-extrabold border border-indigo-200">
            Direct Student Peer-to-Peer Trading
          </span>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Contact Owners Directly via Chat
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
            CampusKart uses direct buyer-to-seller chat messaging instead of a standard e-commerce cart. Discuss price, check item condition, and agree on on-campus pickup spots directly with verified student owners!
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/chat"
            className="w-full sm:w-auto px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Open Direct Student Messages</span>
          </Link>

          <Link
            href="/marketplace"
            className="w-full sm:w-auto px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-4 h-4 text-slate-500" />
            <span>Explore Marketplace Listings</span>
          </Link>
        </div>

      </div>

    </div>
  );
}
