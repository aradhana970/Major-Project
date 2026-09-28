import React from 'react';
import Link from 'next/link';
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from '@/lib/mockData';
import { ProductCard } from '@/components/ui/ProductCard';
import { UserHomeBanner } from '@/components/home/UserHomeBanner';
import {
  ShieldCheck,
  Search,
  BookOpen,
  Calculator,
  Shirt,
  Compass,
  Cpu,
  ArrowRight,
  UserCheck,
  ShoppingBag,
  TrendingUp,
  CheckCircle2,
  Lock,
  MessageSquare,
  PlusCircle,
  ScanText
} from 'lucide-react';

export default function HomePage() {
  const featuredProducts = MOCK_PRODUCTS.slice(0, 4);

  return (
    <div className="space-y-12 pb-16">
      
      {/* 0. QUICK USER PROFILE & LOGIN BAR */}
      <UserHomeBanner />

      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-950 via-indigo-900 to-slate-900 text-white pt-12 pb-24 px-4 sm:px-6 lg:px-8 rounded-3xl mx-4 sm:mx-6 lg:mx-8 shadow-2xl border border-indigo-900">
        
        {/* Subtle Background Glow Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-indigo-600/20 blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto relative z-10 text-center space-y-8">

          {/* Trust Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 backdrop-blur-md text-indigo-200 text-xs sm:text-sm font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>ID-Based Verified Student Marketplace</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight">
            Buy & Sell Student Supplies Within Your <span className="bg-gradient-to-r from-amber-300 via-indigo-200 to-emerald-300 bg-clip-text text-transparent">Campus Trust Graph</span>
          </h1>

          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto font-normal leading-relaxed">
            Trade secondhand engineering textbooks, scientific calculators, practical lab coats, drawing instruments, and project hardware safely with direct buyer-seller chat & verified institute peers.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <form action="/marketplace" className="flex flex-col sm:flex-row gap-2 bg-white/10 p-2 rounded-2xl border border-white/20 backdrop-blur-md shadow-2xl">
              <div className="relative flex-1">
                <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
                <input
                  type="text"
                  name="search"
                  placeholder="Search Casio fx-991ex, Grewal Maths, Lab Coat..."
                  className="w-full pl-11 pr-4 py-3 bg-white text-slate-900 placeholder-slate-400 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-bold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <span>Browse Items</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/products/new"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-extrabold text-sm rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              <PlusCircle className="w-4 h-4 text-indigo-950" />
              <span>List Product for Sale</span>
            </Link>

            <Link
              href="/verification"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 text-sm font-bold rounded-xl transition-all"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Get Student ID Verified</span>
            </Link>
          </div>

          {/* Quick Metrics */}
          <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto border-t border-indigo-800/60 text-slate-300 text-xs sm:text-sm">
            <div>
              <div className="text-2xl font-black text-white">100%</div>
              <div>ID Verified Students</div>
            </div>
            <div>
              <div className="text-2xl font-black text-amber-300">Groq AI OCR</div>
              <div>ID Card Validation</div>
            </div>
            <div>
              <div className="text-2xl font-black text-emerald-400">Direct Chat</div>
              <div>Buyer & Seller Messaging</div>
            </div>
            <div>
              <div className="text-2xl font-black text-white">On-Campus</div>
              <div>Zero Delivery Fee</div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. CATEGORY QUICK NAV */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black text-slate-900">Explore Student Categories</h2>
            <p className="text-xs text-slate-500">Essential academic materials tailored for diploma and degree students</p>
          </div>
          <Link href="/marketplace" className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
            View All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { title: 'Textbooks', slug: 'textbooks', icon: BookOpen, count: '120+ Items' },
            { title: 'Calculators', slug: 'calculators', icon: Calculator, count: '45+ Items' },
            { title: 'Lab Coats', slug: 'lab-coats', icon: Shirt, count: '30+ Items' },
            { title: 'Drafters', slug: 'drawing-instruments', icon: Compass, count: '25+ Items' },
            { title: 'Electronics', slug: 'electronics', icon: Cpu, count: '60+ Hardware' },
            { title: 'Practical Files', slug: 'practical-files', icon: TrendingUp, count: '80+ Notes' },
          ].map((cat, idx) => (
            <Link
              key={idx}
              href={`/marketplace?category=${cat.slug}`}
              className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all group text-center space-y-2"
            >
              <div className="w-12 h-12 mx-auto rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <cat.icon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-xs text-slate-900">{cat.title}</h3>
              <p className="text-[10px] text-slate-400">{cat.count}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. FEATURED RECENT PRODUCTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black text-slate-900">Featured Student Listings</h2>
            <p className="text-xs text-slate-500">Verified products listed by students nearby</p>
          </div>
          <Link href="/marketplace" className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
            Explore Marketplace <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 4. SELLER ID VERIFICATION & DIRECT CHAT SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-xl border border-indigo-700/50">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative z-10">
            
            <div className="space-y-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-400/20 text-emerald-300 text-xs font-bold border border-emerald-400/30">
                <ScanText className="w-3.5 h-3.5" /> Groq AI Identity Verification & Direct Chat
              </div>

              <h2 className="text-3xl font-black tracking-tight leading-tight">
                Verified Seller Security & <span className="text-amber-300">Direct Student Chat</span>
              </h2>

              <p className="text-slate-300 text-sm leading-relaxed">
                CampusKart ensures 100% student authenticity. Sellers upload their identity cards which are validated using **Groq AI Vision OCR**. Buyers and sellers connect directly through in-app chat to arrange fast, safe on-campus pickups.
              </p>

              <ul className="space-y-3 text-xs text-slate-200">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Upload College ID card with Groq AI OCR automated verification
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Direct interactive buyer-seller chat for instant deal settlement
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Drag and drop image upload for easy product listing
                </li>
              </ul>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/verification"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-amber-400 hover:bg-amber-500 text-slate-950 font-extrabold text-sm rounded-xl transition-all shadow-md"
                >
                  <ShieldCheck className="w-4 h-4 text-slate-950" />
                  <span>Verify Student ID</span>
                </Link>

                <Link
                  href="/chat"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white text-sm font-bold rounded-xl transition-all border border-white/20"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-400" />
                  <span>Open Student Chat</span>
                </Link>
              </div>
            </div>

            {/* Visual Mock Box */}
            <div className="bg-slate-950/80 p-6 rounded-2xl border border-indigo-500/30 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs text-slate-400">
                <span className="font-mono text-amber-300 flex items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5 text-indigo-400" /> In-App Direct Buyer-Seller Chat
                </span>
                <span className="text-[10px] bg-emerald-900/60 text-emerald-300 px-2 py-0.5 rounded font-bold">Verified Deal</span>
              </div>
              <div className="space-y-3 text-xs">
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-slate-300">
                  <div className="font-bold text-indigo-400 text-[11px]">Aarav Sharma (Verified 3rd Year)</div>
                  <p className="mt-1">"Hi! Yes, the Casio FX-991EX calculator is available. Meet near library canteen?"</p>
                </div>
                <div className="bg-indigo-900/90 p-3 rounded-xl border border-indigo-700 text-white text-right ml-auto max-w-[85%]">
                  <div className="font-bold text-amber-300 text-[11px]">You</div>
                  <p className="mt-1">"Great! I will meet you at 4 PM near the canteen."</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. HOW IT WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <h2 className="text-2xl font-black text-slate-900">How CampusKart Works</h2>
          <p className="text-xs text-slate-500">A straightforward, 4-step workflow built around student security</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { step: '01', title: 'Register & Verify ID', desc: 'Sign up and upload your college ID card for Groq AI OCR identity validation.', icon: UserCheck },
            { step: '02', title: 'List or Browse', desc: 'Sellers upload product photos via drag & drop; buyers explore campus items.', icon: ShoppingBag },
            { step: '03', title: 'Chat With Owner', desc: 'Contact seller directly via in-app chat to confirm price and meeting spot.', icon: MessageSquare },
            { step: '04', title: 'Campus Handshake', desc: 'Meet safely at college library or canteen gate to exchange item and payment.', icon: CheckCircle2 },
          ].map((item, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm text-center space-y-3 relative">
              <div className="text-3xl font-black text-indigo-100 absolute top-4 right-4">{item.step}</div>
              <div className="w-12 h-12 mx-auto rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                <item.icon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-sm text-slate-900">{item.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. STUDENT ID PRIVACY & SECURITY COMMITMENT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-100 rounded-2xl p-6 sm:p-8 border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center flex-shrink-0">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">Student ID Privacy Notice</h3>
              <p className="text-xs text-slate-600 max-w-2xl mt-0.5">
                Your student ID number and uploaded verification documents are analyzed via Groq AI OCR and accessed strictly by platform administrators for account verification, and will <strong>never be publicly visible</strong> on listings.
              </p>
            </div>
          </div>
          <Link
            href="/privacy"
            className="px-5 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-colors flex-shrink-0"
          >
            Read Privacy Policy
          </Link>
        </div>
      </section>

    </div>
  );
}
