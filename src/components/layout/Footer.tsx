import React from 'react';
import Link from 'next/link';
import { GraduationCap, ShieldCheck, Heart, Sparkles, Lock } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      {/* Guidance Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-indigo-900 text-white py-3 px-4 text-center text-xs sm:text-sm font-medium border-b border-indigo-700/50 flex items-center justify-center gap-2">
        <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
        <span>This project is developed as part of the guidance shared by Prathamesh Sir</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">CampusKart</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              CampusKart is an ID-verified student-only marketplace enabling college students to buy and sell textbooks, lab instruments, calculators, and project materials safely.
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-medium border border-slate-700">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> ID-Verified Trust Graph
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-100 mb-4">Marketplace</h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link href="/marketplace?category=textbooks" className="hover:text-indigo-400 transition-colors">Textbooks & Books</Link></li>
              <li><Link href="/marketplace?category=calculators" className="hover:text-indigo-400 transition-colors">Scientific Calculators</Link></li>
              <li><Link href="/marketplace?category=lab-coats" className="hover:text-indigo-400 transition-colors">Lab Coats & Aprons</Link></li>
              <li><Link href="/marketplace?category=drawing-instruments" className="hover:text-indigo-400 transition-colors">Drawing Instruments</Link></li>
              <li><Link href="/marketplace?category=project-materials" className="hover:text-indigo-400 transition-colors">Major Project Hardware</Link></li>
            </ul>
          </div>

          {/* Student Services */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-100 mb-4">Student Hub</h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link href="/verification" className="hover:text-indigo-400 transition-colors">Seller ID Verification</Link></li>
              <li><Link href="/chat" className="hover:text-indigo-400 transition-colors">Student Direct Chat</Link></li>
              <li><Link href="/dashboard" className="hover:text-indigo-400 transition-colors">Student Dashboard</Link></li>
              <li><Link href="/about" className="hover:text-indigo-400 transition-colors">Project Architecture</Link></li>
            </ul>
          </div>

          {/* Security & Student ID Privacy Notice */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-100 mb-4">Privacy Safeguard</h4>
            <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/60 text-xs space-y-2">
              <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
                <Lock className="w-3.5 h-3.5" /> ID Privacy Policy
              </div>
              <p className="text-[11px] text-slate-400 leading-normal">
                Student ID numbers submitted during verification are analyzed via Groq AI OCR strictly for campus identity verification and are NEVER publicly displayed.
              </p>
            </div>
          </div>

        </div>

        {/* Bottom copyright line */}
        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} CampusKart – Diploma Major Project. Built with Next.js, Supabase, Groq AI OCR & Resend.</p>
          <div className="flex items-center gap-6">
            <Link href="/terms" className="hover:text-slate-400">Terms of Service</Link>
            <Link href="/privacy" className="hover:text-slate-400">Privacy Policy</Link>
            <Link href="/contact" className="hover:text-slate-400">Support</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
