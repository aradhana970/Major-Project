import React from 'react';
import { ShieldCheck, BookOpen } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-black text-slate-900">Campus Marketplace Guidelines & Terms</h1>
        <p className="text-xs text-slate-500 mt-1">CampusKart Academic Platform</p>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 text-xs space-y-4 text-slate-600">
        <h2 className="text-sm font-bold text-slate-900">1. Student Selling Privileges</h2>
        <p>Only verified students with an approved student ID status are permitted to list products on CampusKart.</p>

        <h2 className="text-sm font-bold text-slate-900">2. Allowed Products</h2>
        <p>Allowed items include textbooks, practical files, calculators, lab coats, drawing instruments, electronics, project components, notes, and stationery.</p>

        <h2 className="text-sm font-bold text-slate-900">3. On-Campus Pickup & COD</h2>
        <p>All trades operate via Cash on Delivery or On-Campus Pickup. Buyers and sellers should meet in well-lit public campus locations (Library entrance, Main Canteen).</p>
      </div>
    </div>
  );
}
