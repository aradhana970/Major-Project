'use client';

import React from 'react';
import { MOCK_ORDERS } from '@/lib/mockData';

export default function AdminOrdersPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex items-center justify-between border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Platform Orders Tracking</h1>
          <p className="text-xs text-slate-500 mt-1">Monitor all student transactions across campuses</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
        {MOCK_ORDERS.map((ord) => (
          <div key={ord.id} className="p-5 flex items-center justify-between gap-4 text-xs">
            <div className="space-y-1">
              <span className="font-mono font-bold text-indigo-600">{ord.order_number}</span>
              <p className="text-slate-500">Total: ₹{ord.total_amount} • Status: {ord.status}</p>
            </div>
            <span className="px-3 py-1 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-full border border-emerald-200">
              {ord.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
