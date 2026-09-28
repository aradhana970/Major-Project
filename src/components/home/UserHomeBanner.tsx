'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Profile } from '@/types/database';
import {
  ShieldCheck,
  UserCheck,
  LayoutDashboard,
  PlusCircle,
  LogOut,
  ArrowRight,
  GraduationCap,
  Key,
  ShieldAlert,
  MessageSquare,
  Heart
} from 'lucide-react';
import { toast } from 'sonner';

export function UserHomeBanner() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.user) {
          const { data: userProfile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle();

          if (userProfile) {
            setProfile(userProfile as Profile);
            setLoading(false);
            return;
          }
        }
      } catch (e) {
        console.log('[USER HOME BANNER] Supabase query fallback active');
      }

      // Check localStorage for Demo session
      const demoUser = localStorage.getItem('campuskart_demo_user');
      if (demoUser) {
        try {
          setProfile(JSON.parse(demoUser));
        } catch (e) {}
      }
      setLoading(false);
    }

    loadUser();
  }, []);

  const handleQuickDemoLogin = (email: string, role: string = 'student_buyer') => {
    const isApproved = email.includes('aarav');
    const demoObj: Profile = {
      id: email.includes('admin') ? 'admin-1' : 'user-demo-1',
      full_name: email.includes('admin') ? 'Campus Administrator' : 'Aarav Sharma',
      email: email,
      phone_number: '+91 98765 43210',
      college_name: 'Government Engineering College',
      course: 'Diploma in Computer Engineering',
      year_semester: '3rd Year / 5th Sem',
      student_id_number: 'DEP-CS-2023-042',
      role: email.includes('admin') ? ('admin' as any) : ('student_buyer' as any),
      verification_status: isApproved ? 'approved' : 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    document.cookie = "campuskart_demo_user=true; path=/; max-age=86400";
    localStorage.setItem('campuskart_demo_user', JSON.stringify(demoObj));
    setProfile(demoObj);
    toast.success(`Logged in as ${demoObj.full_name}!`);

    const targetUrl = email.includes('admin') ? '/admin' : '/dashboard';
    window.location.href = targetUrl;
  };

  const handleLogout = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch (e) {}
    document.cookie = "campuskart_demo_user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    localStorage.removeItem('campuskart_demo_user');
    setProfile(null);
    toast.info('Signed out');
    window.location.href = '/';
  };

  if (loading) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
      {profile ? (
        /* LOGGED IN USER PROFILE WIDGET */
        <div className="bg-white/95 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-indigo-100 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-800 text-white flex items-center justify-center font-black text-lg shadow-md">
              {profile.full_name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                  {profile.full_name}
                </h3>
                {profile.role === 'admin' ? (
                  <span className="px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800 text-[10px] font-extrabold uppercase">
                    Admin
                  </span>
                ) : profile.verification_status === 'approved' ? (
                  <span className="verified-badge text-[10px]">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" /> Verified Seller
                  </span>
                ) : (
                  <span className="pending-badge text-[10px]">Unverified</span>
                )}
              </div>
              <p className="text-xs text-slate-500">
                {profile.email} • {profile.college_name}
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 flex-wrap">
            <Link
              href="/chat"
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5"
            >
              <MessageSquare className="w-3.5 h-3.5" /> My Messages
            </Link>

            <Link
              href="/wishlist"
              className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5"
            >
              <Heart className="w-3.5 h-3.5 text-rose-600 fill-rose-500" /> Saved Wishlist
            </Link>

            <Link
              href="/dashboard"
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-indigo-600" /> Dashboard
            </Link>

            <Link
              href="/products/new"
              className="px-3.5 py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-extrabold rounded-xl shadow-sm transition-all flex items-center gap-1.5"
            >
              <PlusCircle className="w-3.5 h-3.5" /> + Sell Item
            </Link>

            {profile.role === 'admin' && (
              <Link
                href="/admin"
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-amber-300 text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-emerald-400" /> Admin Panel
              </Link>
            )}

            <button
              onClick={handleLogout}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold rounded-xl transition-all flex items-center gap-1"
            >
              <LogOut className="w-3.5 h-3.5 text-red-500" /> Logout
            </button>
          </div>
        </div>
      ) : (
        /* NOT LOGGED IN - QUICK LOGIN & PRESETS BAR */
        <div className="bg-slate-900/90 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-indigo-500/30 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/30 text-indigo-300 border border-indigo-400/30 flex items-center justify-center font-bold">
              <Key className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white">Student Account & Quick Profile Access</h3>
              <p className="text-xs text-slate-300">Sign in to manage your marketplace listings, direct chats, & verification status</p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-end">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('aarav.sharma@campus.edu.in')}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow transition-all flex items-center gap-1.5"
            >
              <UserCheck className="w-3.5 h-3.5 text-emerald-300" /> Demo Student Login
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemoLogin('admin@campuskart.edu')}
              className="px-3.5 py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-extrabold rounded-xl shadow transition-all flex items-center gap-1.5"
            >
              <ShieldAlert className="w-3.5 h-3.5" /> Demo Admin Login
            </button>

            <Link
              href="/login"
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl border border-white/20 transition-all"
            >
              Sign In
            </Link>

            <Link
              href="/register"
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-extrabold rounded-xl shadow transition-all"
            >
              Register
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
