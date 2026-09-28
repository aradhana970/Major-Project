import React from 'react';
import { ShieldCheck, Lock, CheckCircle2 } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="border-b border-slate-200 pb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 mb-3">
          <ShieldCheck className="w-3.5 h-3.5" /> ID Privacy Safeguard Policy
        </div>
        <h1 className="text-3xl font-black text-slate-900">Privacy & Data Security Policy</h1>
        <p className="text-xs text-slate-500 mt-1">CampusKart Student Marketplace – Developed under guidance of Prathamesh Sir</p>
      </div>

      <div className="prose prose-slate max-w-none text-xs leading-relaxed space-y-6">
        
        <section className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Lock className="w-4 h-4 text-indigo-600" /> 1. Student ID Verification Data Handling
          </h2>
          <p className="text-slate-600">
            During registration and verification, students provide details including Full Name, Email, College Name, Course, Year/Semester, and Student ID Roll Number.
          </p>
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 font-semibold text-amber-900">
            Important Notice: Student ID numbers and ID card document photos are strictly restricted to admin review and are NEVER displayed on public product cards, seller profiles, or public API endpoints.
          </div>
        </section>

        <section className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
          <h2 className="text-base font-bold text-slate-900">2. Information We Collect</h2>
          <ul className="list-disc pl-5 space-y-1 text-slate-600">
            <li>Profile details (Name, College, Course, Contact preference)</li>
            <li>Product listing metadata (Images, description, price, campus pickup location)</li>
            <li>Order history and review ratings</li>
          </ul>
        </section>

        <section className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
          <h2 className="text-base font-bold text-slate-900">3. AI Processing & Third-Party Services</h2>
          <p className="text-slate-600">
            Product text descriptions and product images submitted for AI assistance are processed via Groq AI (Llama 3) and Groq Vision APIs on secure server routes without storing personal identity markers.
          </p>
        </section>

      </div>
    </div>
  );
}
