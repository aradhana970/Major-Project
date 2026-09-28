import React from 'react';
import { ShieldCheck, Sparkles, Layers, Cpu } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-3xl p-8 sm:p-10 text-white shadow-xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-400/30">
          <Sparkles className="w-3.5 h-3.5" /> Project Development & Faculty Guidance
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          About CampusKart Platform
        </h1>
        <p className="text-slate-300 text-sm leading-relaxed max-w-3xl">
          This project is developed as part of the guidance shared by <strong>Prathamesh Sir</strong> for the Major Project / Product Development curriculum.
        </p>
      </div>

      {/* Problem & Solution Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
            ⚠️
          </div>
          <h2 className="font-bold text-slate-900 text-base">The Student Problem</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            College students spend thousands of rupees each semester buying expensive textbooks, practical drawing tools, scientific calculators, and lab coats that are used for only 4 to 6 months. Meanwhile, senior students have these exact materials lying idle with no secure, campus-focused platform to pass them on.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h2 className="font-bold text-slate-900 text-base">The CampusKart Solution</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            CampusKart establishes an ID-verified student marketplace. By verifying college identity cards before granting selling privileges, the platform eliminates spam, fraud, and commercial vendors, allowing students to exchange academic items at fair peer prices right on campus.
          </p>
        </div>

      </div>

      {/* Technology Stack Architecture */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
        <h2 className="text-xl font-black text-slate-900">Technical Architecture Overview</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <div className="font-bold text-indigo-600 flex items-center gap-1.5">
              <Layers className="w-4 h-4" /> Next.js 14 + TS
            </div>
            <p className="text-slate-500">App Router, React Server Components, Tailwind CSS, & Lucide Icons.</p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <div className="font-bold text-emerald-600 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> Supabase Backend
            </div>
            <p className="text-slate-500">PostgreSQL database, Row Level Security (RLS) policies, & Auth storage.</p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <div className="font-bold text-amber-600 flex items-center gap-1.5">
              <Cpu className="w-4 h-4" /> Groq AI Vision OCR
            </div>
            <p className="text-slate-500">Automated student identity card OCR scanning and verification engine.</p>
          </div>
        </div>
      </div>

      {/* ID Privacy Safeguard Notice */}
      <div className="bg-amber-50 border border-amber-200 p-6 rounded-2xl space-y-2">
        <h3 className="font-bold text-amber-900 text-sm flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-amber-700" /> Mandatory Student ID Privacy Protocol
        </h3>
        <p className="text-xs text-amber-800 leading-relaxed">
          Student ID card numbers and document uploads are strictly stored for administration verification purposes. Student IDs are <strong>never rendered in public marketplace views or API responses</strong>.
        </p>
      </div>

    </div>
  );
}
