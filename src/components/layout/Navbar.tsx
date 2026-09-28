'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  GraduationCap,
  Search,
  MessageSquare,
  Heart,
  PlusCircle,
  ShieldCheck,
  User,
  LogOut,
  LayoutDashboard,
  Menu,
  X,
  ChevronDown,
  QrCode
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Profile } from '@/types/database';

export function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<Profile | null>(null);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [unreadChatCount, setUnreadChatCount] = useState(1);
  const [collegeName, setCollegeName] = useState('Government Engineering College');

  useEffect(() => {
    const supabase = createClient();
    
    // Get initial session
    const fetchUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (profile) {
            setUserProfile(profile as Profile);
            return;
          }
        }
      } catch (e) {
        console.log('[NAVBAR] Supabase fetch fallback active');
      }

      // Check localStorage for Demo session
      const demoUser = localStorage.getItem('campuskart_demo_user');
      if (demoUser) {
        try {
          setUserProfile(JSON.parse(demoUser));
        } catch (e) {}
      }
    };

    fetchUser();

    // Sync Customizer College
    const loadCustomizer = () => {
      const saved = localStorage.getItem('campuskart_customizer');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.collegeName) setCollegeName(parsed.collegeName);
        } catch (e) {}
      }
    };
    loadCustomizer();
    window.addEventListener('campuskart_customizer_change', loadCustomizer);

    return () => {
      window.removeEventListener('campuskart_customizer_change', loadCustomizer);
    };
  }, [pathname]);

  const handleLogout = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch (e) {}
    document.cookie = "campuskart_demo_user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    localStorage.removeItem('campuskart_demo_user');
    setUserProfile(null);
    window.location.href = '/';
  };

  const isVerified = userProfile?.verification_status === 'approved' || userProfile?.role === 'admin';

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-indigo-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Branding */}
          <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-800 flex items-center justify-center text-white shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-indigo-950 via-indigo-800 to-indigo-600 bg-clip-text text-transparent">
                CampusKart
              </span>
              <span className="block text-[10px] font-semibold tracking-wider text-indigo-500 uppercase -mt-1 truncate max-w-[130px] sm:max-w-none">
                Verified Student Market
              </span>
            </div>
          </Link>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-sm mx-4">
            <form action="/marketplace" className="relative w-full">
              <input
                type="text"
                name="search"
                placeholder="Search textbooks, calculators..."
                className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
            </form>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-5">
            <Link
              href="/marketplace"
              className={`text-xs font-bold transition-colors ${
                pathname === '/marketplace' ? 'text-indigo-600' : 'text-slate-600 hover:text-indigo-600'
              }`}
            >
              Marketplace
            </Link>

            <Link
              href="/chat"
              className={`text-xs font-bold transition-colors flex items-center gap-1 ${
                pathname === '/chat' ? 'text-indigo-600' : 'text-slate-600 hover:text-indigo-600'
              }`}
            >
              Messages
            </Link>
            
            <Link
              href="/about"
              className={`text-xs font-bold transition-colors ${
                pathname === '/about' ? 'text-indigo-600' : 'text-slate-600 hover:text-indigo-600'
              }`}
            >
              About
            </Link>

            <Link
              href="/qr"
              className={`text-xs font-bold transition-colors flex items-center gap-1 ${
                pathname === '/qr' ? 'text-indigo-600' : 'text-slate-600 hover:text-indigo-600'
              }`}
            >
              <QrCode className="w-4 h-4 text-emerald-600" /> Mobile QR
            </Link>

            {/* Sell Product Button */}
            <Link
              href={isVerified ? "/products/new" : "/verification"}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-extrabold rounded-full bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-sm hover:from-indigo-700 hover:to-indigo-800 transition-all hover:shadow-md"
            >
              <PlusCircle className="w-3.5 h-3.5 text-amber-300" />
              <span>Sell Item</span>
            </Link>
          </nav>

          {/* RIGHT ACTION ICONS: WISHLIST, CHAT MESSAGES & USER PROFILE */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Wishlist Button */}
            <Link
              href="/wishlist"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 text-xs font-bold transition-all shadow-sm"
              title="Saved Wishlist Items"
            >
              <Heart className="w-4 h-4 text-rose-600 fill-rose-500" />
              <span className="hidden sm:inline">Wishlist</span>
            </Link>

            {/* Direct Chat / Owner Contact Button with Unread Badge */}
            <Link
              href="/chat"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold shadow-md hover:shadow-lg transition-all"
              title="Student Messages / Chat with Owner"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Chat</span>
              {unreadChatCount > 0 ? (
                <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-amber-300 text-slate-950 text-[10px] font-black">
                  {unreadChatCount}
                </span>
              ) : (
                <span className="w-2 h-2 rounded-full bg-amber-300 animate-pulse" />
              )}
            </Link>

            {/* User Profile Avatar / Dropdown */}
            {userProfile ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center gap-1.5 p-1 rounded-full hover:bg-slate-100 border border-slate-200 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-black text-xs shadow-sm">
                    {userProfile.full_name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:inline text-xs font-bold text-slate-800 max-w-[90px] truncate">
                    {userProfile.full_name.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* User Dropdown Menu */}
                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 py-1.5 z-50">
                    <div className="px-4 py-2.5 border-b border-slate-100 bg-slate-50/70">
                      <p className="text-xs font-bold text-slate-900 truncate">{userProfile.full_name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{userProfile.email}</p>
                      <div className="mt-1.5">
                        {userProfile.verification_status === 'approved' ? (
                          <span className="verified-badge text-[10px]">
                            <ShieldCheck className="w-3 h-3 text-emerald-600" /> Verified Student
                          </span>
                        ) : (
                          <span className="pending-badge text-[10px]">Unverified</span>
                        )}
                      </div>
                    </div>

                    <Link
                      href="/dashboard"
                      onClick={() => setIsUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600"
                    >
                      <LayoutDashboard className="w-4 h-4 text-indigo-600" /> Student Dashboard
                    </Link>

                    <Link
                      href="/chat"
                      onClick={() => setIsUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600"
                    >
                      <MessageSquare className="w-4 h-4 text-indigo-600" /> Direct Messages & Chats
                    </Link>

                    <Link
                      href="/wishlist"
                      onClick={() => setIsUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600"
                    >
                      <Heart className="w-4 h-4 text-rose-500" /> Saved Wishlist Items
                    </Link>

                    <Link
                      href="/profile"
                      onClick={() => setIsUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600"
                    >
                      <User className="w-4 h-4 text-slate-500" /> Profile Settings
                    </Link>

                    <Link
                      href="/verification"
                      onClick={() => setIsUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600"
                    >
                      <ShieldCheck className="w-4 h-4 text-emerald-600" /> ID Verification
                    </Link>

                    <Link
                      href="/products/my-listings"
                      onClick={() => setIsUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600"
                    >
                      <PlusCircle className="w-4 h-4 text-amber-500" /> My Listed Products
                    </Link>

                    {userProfile.role === 'admin' && (
                      <Link
                        href="/admin"
                        onClick={() => setIsUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-indigo-700 bg-indigo-50/80 hover:bg-indigo-100"
                      >
                        <ShieldCheck className="w-4 h-4 text-indigo-600" /> Admin Control Center
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="w-full text-left flex items-center gap-2 px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 border-t border-slate-100 mt-1"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <Link
                  href="/login"
                  className="px-3 py-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  className="px-3.5 py-1.5 text-xs font-bold text-white bg-indigo-600 rounded-full hover:bg-indigo-700 shadow-sm transition-all"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1.5 text-slate-600 hover:text-slate-900 rounded-lg md:hidden"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 pt-2 pb-4 space-y-3 shadow-xl">
          <form action="/marketplace" className="relative w-full my-2">
            <input
              type="text"
              name="search"
              placeholder="Search products..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-100 rounded-full"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
          </form>

          <Link href="/marketplace" onClick={() => setIsMobileMenuOpen(false)} className="block text-xs font-bold text-slate-800 py-1.5">
            Marketplace Catalog
          </Link>
          <Link href="/chat" onClick={() => setIsMobileMenuOpen(false)} className="block text-xs font-bold text-indigo-600 py-1.5">
            💬 Direct Messages ({unreadChatCount})
          </Link>
          <Link href="/wishlist" onClick={() => setIsMobileMenuOpen(false)} className="block text-xs font-bold text-rose-600 py-1.5">
            ❤️ Saved Wishlist Items
          </Link>
          <Link href="/qr" onClick={() => setIsMobileMenuOpen(false)} className="block text-xs font-bold text-emerald-600 py-1.5">
            📱 Mobile QR Code Scanner
          </Link>
          <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="block text-xs font-bold text-slate-800 py-1.5">
            About Project
          </Link>
          
          {userProfile ? (
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="block text-xs font-bold text-indigo-600">
                Student Dashboard
              </Link>
              <Link href="/products/new" onClick={() => setIsMobileMenuOpen(false)} className="block text-xs font-bold text-amber-600">
                + Sell Item
              </Link>
              <button onClick={handleLogout} className="block text-xs font-bold text-red-600 py-1">
                Log Out
              </button>
            </div>
          ) : (
            <div className="pt-2 border-t border-slate-100 flex gap-2">
              <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="flex-1 text-center py-2 text-xs font-bold border border-indigo-600 text-indigo-600 rounded-xl">
                Log In
              </Link>
              <Link href="/register" onClick={() => setIsMobileMenuOpen(false)} className="flex-1 text-center py-2 text-xs font-bold bg-indigo-600 text-white rounded-xl">
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
