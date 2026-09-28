'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { MOCK_PROFILES } from '@/lib/mockData';
import {
  ShieldCheck,
  Sparkles,
  ShoppingBag,
  Heart,
  PlusCircle,
  Clock,
  User,
  ArrowRight,
  GraduationCap,
  Database,
  CheckCircle2
} from 'lucide-react';

export default function StudentDashboardPage() {
  const [profile, setProfile] = useState(MOCK_PROFILES[0]);
  const [metrics, setMetrics] = useState({
    activeListings: 3,
    ordersCount: 1,
    wishlistCount: 2,
  });
  const [isSupabaseConnected, setIsSupabaseConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.user) {
          setIsSupabaseConnected(true);

          // 1. Fetch user profile
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle();

          if (profileData) {
            setProfile(profileData as any);
          }

          // 2. Fetch active products count for this seller
          const { count: listingsCount } = await supabase
            .from('products')
            .select('*', { count: 'exact', head: true })
            .eq('seller_id', session.user.id);

          // 3. Fetch orders count (where user is buyer or seller)
          const { count: ordersCount } = await supabase
            .from('orders')
            .select('*', { count: 'exact', head: true })
            .or(`buyer_id.eq.${session.user.id},seller_id.eq.${session.user.id}`);

          // 4. Fetch wishlist items count
          const { count: wishlistCount } = await supabase
            .from('wishlists')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', session.user.id);

          setMetrics({
            activeListings: listingsCount !== null ? listingsCount : 3,
            ordersCount: ordersCount !== null ? ordersCount : 1,
            wishlistCount: wishlistCount !== null ? wishlistCount : 2,
          });
        } else {
          // Check local demo user session
          const localUser = localStorage.getItem('campuskart_demo_user');
          if (localUser) {
            try {
              const parsed = JSON.parse(localUser);
              setProfile(parsed);
            } catch (e) {}
          }
        }
      } catch (err) {
        console.error('Error fetching Supabase dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Supabase Connection Status Bar */}
      <div className="flex items-center justify-between bg-slate-100 px-4 py-2 rounded-xl text-xs font-medium text-slate-600 border border-slate-200">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-indigo-600" />
          <span>Backend Database:</span>
          {isSupabaseConnected ? (
            <span className="text-emerald-700 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Supabase Live Session
            </span>
          ) : (
            <span className="text-amber-700 font-bold">Demo / Preview Mode</span>
          )}
        </div>
        <span className="text-[11px] text-slate-400">UUID auth & RLS enabled</span>
      </div>

      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-3xl p-8 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/30 text-indigo-200 text-xs font-bold border border-indigo-400/30">
            <GraduationCap className="w-3.5 h-3.5 text-amber-300" /> Student Dashboard
          </div>
          <h1 className="text-3xl font-black tracking-tight">
            Welcome back, {profile.full_name ? profile.full_name.split(' ')[0] : 'Student'}! 👋
          </h1>
          <p className="text-xs text-slate-300">
            {profile.college_name} • {profile.course} ({profile.year_semester})
          </p>
        </div>

        {profile.verification_status === 'approved' ? (
          <Link
            href="/products/new"
            className="px-6 py-3 bg-amber-400 hover:bg-amber-500 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 flex-shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            <span>+ Sell Item with AI</span>
          </Link>
        ) : (
          <Link
            href="/verification"
            className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 flex-shrink-0"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Verify Student ID</span>
          </Link>
        )}
      </div>

      {/* Verification Status Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Verification Status</h3>
            <p className="text-xs text-slate-500">
              {profile.verification_status === 'approved'
                ? 'Your student ID is verified. You can list products & use AI tools.'
                : 'Upload your college ID card to unlock selling privileges.'}
            </p>
          </div>
        </div>

        <div>
          {profile.verification_status === 'approved' ? (
            <span className="verified-badge">
              <ShieldCheck className="w-3.5 h-3.5" /> Approved Seller
            </span>
          ) : (
            <Link href="/verification" className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl">
              Complete ID Verification
            </Link>
          )}
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Link href="/products/my-listings" className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-2">
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">My Active Listings</span>
          <div className="text-3xl font-black text-indigo-950">{metrics.activeListings}</div>
          <span className="text-xs font-semibold text-indigo-600 flex items-center gap-1">
            Manage Listings <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </Link>

        <Link href="/orders" className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-2">
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Orders & Sales</span>
          <div className="text-3xl font-black text-emerald-600">{metrics.ordersCount}</div>
          <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
            View Order Receipts <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </Link>

        <Link href="/wishlist" className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-2">
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Bookmarked Wishlist</span>
          <div className="text-3xl font-black text-amber-500">{metrics.wishlistCount}</div>
          <span className="text-xs font-semibold text-amber-600 flex items-center gap-1">
            Saved Items <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </Link>
      </div>

    </div>
  );
}

