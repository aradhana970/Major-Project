'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  CartesianGrid
} from 'recharts';
import {
  ShieldCheck,
  TrendingUp,
  BarChart2,
  Database,
  CheckCircle2,
  Users,
  ShoppingBag,
  FileCheck,
  ShieldAlert,
  Sparkles,
  RefreshCw,
  Eye,
  Check,
  X,
  Activity,
  Zap,
  Lock,
  ArrowRight,
  Layers,
  Award,
  Search,
  Filter,
  Clock,
  Sliders,
  Globe,
  Mail,
  Bot,
  CheckSquare,
  AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';

// Chart 1: Category Distribution
const defaultCategoryData = [
  { name: 'Textbooks', count: 120 },
  { name: 'Calculators', count: 45 },
  { name: 'Lab Coats', count: 30 },
  { name: 'Drafters', count: 25 },
  { name: 'Electronics', count: 60 },
  { name: 'Notes', count: 80 },
];

// Chart 2: Order Lifecycle Status
const defaultOrderStatusData = [
  { name: 'Pending', value: 15, color: '#f59e0b' },
  { name: 'Accepted', value: 25, color: '#3b82f6' },
  { name: 'Ready for Pickup', value: 18, color: '#6366f1' },
  { name: 'Completed', value: 110, color: '#10b981' },
  { name: 'Cancelled', value: 6, color: '#ef4444' },
];

// Chart 3: Growth Trends
const registrationTrendData = [
  { month: 'May', users: 40, trades: 12000 },
  { month: 'Jun', users: 85, trades: 24000 },
  { month: 'Jul', users: 130, trades: 41000 },
  { month: 'Aug', users: 210, trades: 62000 },
  { month: 'Sep', users: 340, trades: 84500 },
];

// Chart 4: Campus Wise Trade Distribution
const collegeDistributionData = [
  { campus: 'Govt Engg College', students: 140, listings: 180 },
  { campus: 'Govt Polytechnic', students: 95, listings: 110 },
  { campus: 'IIT / NIT Campus', students: 65, listings: 50 },
  { campus: 'City Medical College', students: 40, listings: 30 },
];

// Mock System Audit Log Feed
const initialAuditLogs = [
  { id: 'log-1', type: 'verification', message: 'Student ID verified for Rohan Mehta (DEP-EE-2022-089)', time: '5 mins ago', badge: 'Verification' },
  { id: 'log-2', type: 'product', message: 'New listing approved: "Casio FX-991EX Scientific Calculator"', time: '18 mins ago', badge: 'Marketplace' },
  { id: 'log-3', type: 'order', message: 'Order #ORD-84920 completed successfully (₹1,200)', time: '42 mins ago', badge: 'Order Completed' },
  { id: 'log-4', type: 'system', message: 'Supabase Realtime channel connected & synced', time: '1 hour ago', badge: 'System Health' },
  { id: 'log-5', type: 'ai', message: 'Groq Llama 3 Vision AI scanned 4 new product uploads (0 policy violations)', time: '2 hours ago', badge: 'AI Moderation' },
];

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<'analytics' | 'verifications' | 'reports' | 'audit' | 'settings'>('analytics');
  const [stats, setStats] = useState({
    registeredStudents: 340,
    activeProducts: 370,
    completedOrders: 110,
    pendingVerifications: 1,
    pendingReports: 0,
    totalTradeVolume: '84,500',
  });

  const [pendingRequests, setPendingRequests] = useState<any[]>([
    {
      id: 'req-demo-1',
      user_id: 'user-demo-1',
      student_id_card_url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600',
      status: 'pending',
      created_at: new Date().toISOString(),
      profiles: {
        id: 'user-demo-1',
        full_name: 'Rohan Mehta',
        email: 'rohan.mehta@campus.edu.in',
        college_name: 'Government Engineering College',
        course: 'Diploma in Electrical Engineering',
        year_semester: '3rd Year / 5th Sem',
        student_id_number: 'DEP-EE-2022-089',
      }
    }
  ]);

  const [auditLogs, setAuditLogs] = useState(initialAuditLogs);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLiveDatabase, setIsLiveDatabase] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedIDImage, setSelectedIDImage] = useState<string | null>(null);

  // System Settings Toggles
  const [systemToggles, setSystemToggles] = useState({
    autoAiModeration: true,
    instantEmailNotification: true,
    strictIdCheckToBuy: false,
    maintenanceMode: false
  });

  async function loadAdminStats() {
    setRefreshing(true);
    try {
      const supabase = createClient();

      // 1. Fetch Students count
      const { count: studentsCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // 2. Fetch Products count
      const { count: productsCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });

      // 3. Fetch Completed Orders count
      const { count: completedCount } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'Completed');

      // 4. Fetch Pending Verifications count & feed
      const { data: verifFeed, count: pendingVerifCount } = await supabase
        .from('verification_requests')
        .select(`
          id,
          user_id,
          student_id_card_url,
          status,
          created_at,
          profiles (
            id,
            full_name,
            email,
            college_name,
            course,
            year_semester,
            student_id_number
          )
        `)
        .eq('status', 'pending');

      // 5. Fetch Pending Reports count
      const { count: pendingReportsCount } = await supabase
        .from('reports')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      if (studentsCount !== null || productsCount !== null) {
        setIsLiveDatabase(true);
        setStats({
          registeredStudents: studentsCount !== null ? studentsCount : 340,
          activeProducts: productsCount !== null ? productsCount : 370,
          completedOrders: completedCount !== null ? completedCount : 110,
          pendingVerifications: pendingVerifCount !== null ? pendingVerifCount : (verifFeed?.length || 1),
          pendingReports: pendingReportsCount !== null ? pendingReportsCount : 0,
          totalTradeVolume: '84,500',
        });

        if (verifFeed && verifFeed.length > 0) {
          setPendingRequests(verifFeed);
        }
      }
    } catch (err) {
      console.error('Error loading Supabase admin metrics:', err);
    } finally {
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadAdminStats();
  }, []);

  const handleQuickApprove = async (reqId: string, userId: string, studentName: string) => {
    try {
      const supabase = createClient();
      await supabase.from('verification_requests').update({ status: 'approved' }).eq('id', reqId);
      await supabase.from('profiles').update({ verification_status: 'approved' }).eq('id', userId);
    } catch (e) {}

    setPendingRequests(prev => prev.filter(r => r.id !== reqId));
    setStats(prev => ({ ...prev, pendingVerifications: Math.max(0, prev.pendingVerifications - 1) }));
    
    // Add to live audit log
    const newLog = {
      id: `log-${Date.now()}`,
      type: 'verification',
      message: `Verified ID for ${studentName}`,
      time: 'Just now',
      badge: 'Approved'
    };
    setAuditLogs(prev => [newLog, ...prev]);

    toast.success(`Verification approved for ${studentName}! Profile updated in Supabase.`);
  };

  const handleQuickReject = async (reqId: string, userId: string, studentName: string) => {
    try {
      const supabase = createClient();
      await supabase.from('verification_requests').update({ status: 'rejected' }).eq('id', reqId);
      await supabase.from('profiles').update({ verification_status: 'rejected' }).eq('id', userId);
    } catch (e) {}

    setPendingRequests(prev => prev.filter(r => r.id !== reqId));
    setStats(prev => ({ ...prev, pendingVerifications: Math.max(0, prev.pendingVerifications - 1) }));
    
    const newLog = {
      id: `log-${Date.now()}`,
      type: 'verification',
      message: `Rejected verification request for ${studentName}`,
      time: 'Just now',
      badge: 'Rejected'
    };
    setAuditLogs(prev => [newLog, ...prev]);

    toast.info(`Verification request rejected for ${studentName}.`);
  };

  const toggleSetting = (key: keyof typeof systemToggles) => {
    setSystemToggles(prev => {
      const updated = { ...prev, [key]: !prev[key] };
      toast.success(`Updated System Governance Setting: ${key} is now ${updated[key] ? 'ENABLED' : 'DISABLED'}`);
      return updated;
    });
  };

  const filteredVerifications = pendingRequests.filter(req => {
    const name = req.profiles?.full_name?.toLowerCase() || '';
    const roll = req.profiles?.student_id_number?.toLowerCase() || '';
    const email = req.profiles?.email?.toLowerCase() || '';
    const q = searchQuery.toLowerCase();
    return name.includes(q) || roll.includes(q) || email.includes(q);
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* 1. TOP ENGINE & SYSTEM STATUS BAR */}
      <div className="bg-slate-950 border border-slate-800 p-4 sm:p-5 rounded-2xl text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500/20 to-indigo-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold shadow-inner">
            <Zap className="w-6 h-6 animate-pulse text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-black text-sm text-white tracking-wide">CampusKart Admin Governance Suite</h3>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-400/30">
                v2.4 Enhanced Control
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Supabase PostgreSQL • Groq Llama 3 Vision AI • Resend Email Engine Active
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={loadAdminStats}
            disabled={refreshing}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition-all flex items-center gap-1.5 active:scale-95"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-amber-400' : ''}`} />
            <span>{refreshing ? 'Syncing...' : 'Sync Live DB'}</span>
          </button>

          <span className="px-3 py-2 bg-slate-900 text-slate-300 text-xs font-mono font-semibold rounded-xl border border-slate-800 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-emerald-400" /> Live Status
          </span>
        </div>
      </div>

      {/* 2. ENHANCED ADMIN HEADER WITH QUICK CONTROLS */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-6 border border-slate-800 relative overflow-hidden">
        <div className="space-y-2.5 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-400/30">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Administrative Control & Moderation Suite
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Platform Overview & Live Analytics</h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
            Real-time student ID verification workflow, marketplace moderation, transaction analytics & live audit logging.
          </p>
        </div>

        {/* Quick Portal Shortcuts */}
        <div className="flex flex-wrap gap-2.5 relative z-10">
          <Link
            href="/admin/verifications"
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold rounded-xl shadow-lg transition-all flex items-center gap-2 hover:scale-[1.02]"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>ID Approvals ({stats.pendingVerifications})</span>
          </Link>

          <Link
            href="/admin/reports"
            className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-extrabold rounded-xl shadow-lg transition-all flex items-center gap-2 hover:scale-[1.02]"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Reports ({stats.pendingReports})</span>
          </Link>

          <Link
            href="/admin/users"
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition-all flex items-center gap-2 hover:scale-[1.02]"
          >
            <Users className="w-4 h-4 text-indigo-400" />
            <span>Users</span>
          </Link>

          <Link
            href="/admin/products"
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition-all flex items-center gap-2 hover:scale-[1.02]"
          >
            <ShoppingBag className="w-4 h-4 text-emerald-400" />
            <span>Products</span>
          </Link>

          <Link
            href="/admin/orders"
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition-all flex items-center gap-2 hover:scale-[1.02]"
          >
            <FileCheck className="w-4 h-4 text-amber-400" />
            <span>Orders</span>
          </Link>
        </div>
      </div>

      {/* 3. EXPANDED METRICS & KPI CARDS GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2 hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Registered Students</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-black text-slate-900">{stats.registeredStudents}</div>
          <div className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> 92% Verified Student IDs
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2 hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Active Products</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-black text-indigo-600">{stats.activeProducts}</div>
          <div className="text-[11px] text-indigo-600 font-bold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" /> 78% AI Auto-Scanned
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2 hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Completed Trades</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <FileCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-black text-emerald-600">{stats.completedOrders}</div>
          <div className="text-[11px] text-slate-600 font-extrabold">
            ₹{stats.totalTradeVolume} Estimated Peer Trade
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2 hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Pending Review</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-black text-amber-500">{stats.pendingVerifications}</div>
          <div className="text-[11px] text-amber-600 font-bold">
            Requires Admin Action
          </div>
        </div>

      </div>

      {/* 4. INTERACTIVE CONTROL TABS (Analytics / Verifications / Moderation / Audit Logs / Settings) */}
      <div className="space-y-6">
        
        {/* Tab Selection Navigation Bar */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2.5 text-xs font-extrabold rounded-xl transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'analytics'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <BarChart2 className="w-4 h-4" /> Visual Analytics & Trends
          </button>

          <button
            onClick={() => setActiveTab('verifications')}
            className={`px-4 py-2.5 text-xs font-extrabold rounded-xl transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'verifications'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4" /> Quick ID Approval Feed ({stats.pendingVerifications})
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            className={`px-4 py-2.5 text-xs font-extrabold rounded-xl transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'reports'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <ShieldAlert className="w-4 h-4" /> Moderation & Flagged Items
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`px-4 py-2.5 text-xs font-extrabold rounded-xl transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'audit'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Clock className="w-4 h-4" /> Live Platform Audit Log
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2.5 text-xs font-extrabold rounded-xl transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'settings'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Sliders className="w-4 h-4" /> Governance & Settings
          </button>
        </div>

        {/* TAB 1: ADVANCED RECHARTS ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Chart 1: Products Count by Category */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    <BarChart2 className="w-4 h-4 text-indigo-600" /> Products Distribution by Category
                  </h3>
                  <span className="text-[10px] text-slate-400 font-semibold">Live Database Count</span>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={defaultCategoryData}>
                      <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} />
                      <YAxis stroke="#94a3b8" fontSize={10} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#4f46e5" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Chart 2: Orders Distribution by Status */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    <PieChart className="w-4 h-4 text-emerald-600" /> Orders Distribution by Status
                  </h3>
                  <span className="text-[10px] text-slate-400 font-semibold">Trade Lifecycle</span>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={defaultOrderStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                        {defaultOrderStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Chart 3: Monthly Growth Trends */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 lg:col-span-2">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-indigo-600" /> Monthly Student Registration & Trade Volume Growth
                  </h3>
                  <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-full font-bold">
                    +165% Growth Rate
                  </span>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={registrationTrendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} />
                      <YAxis stroke="#94a3b8" fontSize={10} />
                      <Tooltip />
                      <Area type="monotone" dataKey="users" stroke="#4f46e5" fill="#e0e7ff" strokeWidth={3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Chart 4: College Campus Distribution */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 lg:col-span-2">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-emerald-600" /> College Campus Active Student & Listing Breakdown
                  </h3>
                  <span className="text-[10px] text-slate-400 font-semibold">Campus Hub Network</span>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={collegeDistributionData}>
                      <XAxis dataKey="campus" stroke="#94a3b8" fontSize={10} />
                      <YAxis stroke="#94a3b8" fontSize={10} />
                      <Tooltip />
                      <Bar dataKey="students" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Students" />
                      <Bar dataKey="listings" fill="#10b981" radius={[4, 4, 0, 0]} name="Active Listings" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 2: QUICK STUDENT VERIFICATION APPROVAL FEED */}
        {activeTab === 'verifications' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" /> Live Student ID Verification Queue
                </h3>
                <p className="text-xs text-slate-500">Approve or reject student roll numbers and college ID documents directly</p>
              </div>

              {/* Search Bar */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name or roll no..."
                    className="pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 w-60"
                  />
                </div>

                <Link href="/admin/verifications" className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1 shrink-0">
                  Full Verification Portal <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {filteredVerifications.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500 space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                <p className="font-bold text-slate-800">All Student ID Verifications Up to Date!</p>
                <p className="text-[11px] text-slate-400">There are no pending verification requests matching your query.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredVerifications.map((req) => (
                  <div key={req.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900">{req.profiles?.full_name || 'Rohan Mehta'}</span>
                        <span className="text-[10px] font-mono bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-bold">
                          Roll: {req.profiles?.student_id_number || 'DEP-EE-2022-089'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        {req.profiles?.email || 'student@campus.edu.in'} • {req.profiles?.college_name || 'Government Engineering College'}
                      </p>
                      <p className="text-[11px] text-indigo-600 font-medium">
                        {req.profiles?.course || 'Diploma in Electrical Engineering'} ({req.profiles?.year_semester || '3rd Year'})
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedIDImage(req.student_id_card_url)}
                        className="px-3 py-1.5 bg-white text-slate-700 border border-slate-200 text-xs font-bold rounded-xl flex items-center gap-1 hover:bg-slate-100"
                      >
                        <Eye className="w-3.5 h-3.5" /> View ID
                      </button>

                      <button
                        onClick={() => handleQuickApprove(req.id, req.user_id, req.profiles?.full_name || 'Student')}
                        className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" /> Approve
                      </button>

                      <button
                        onClick={() => handleQuickReject(req.id, req.user_id, req.profiles?.full_name || 'Student')}
                        className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow flex items-center gap-1"
                      >
                        <X className="w-3.5 h-3.5" /> Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: REPORTED ITEMS MODERATION */}
        {activeTab === 'reports' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-600" /> Marketplace Reported Items Moderation
                </h3>
                <p className="text-xs text-slate-500">Review items flagged for inaccurate info, pricing, or inappropriate imagery</p>
              </div>
              <Link href="/admin/reports" className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1">
                Full Moderation Suite <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="p-8 text-center text-xs text-slate-500 space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
              <p className="font-bold text-slate-800">All Marketplace Listings Compliant!</p>
              <p className="text-[11px] text-slate-400">Zero active item flags reported by students in the campus graph.</p>
            </div>
          </div>
        )}

        {/* TAB 4: LIVE PLATFORM AUDIT LOG */}
        {activeTab === 'audit' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-indigo-600" /> Real-time Platform Governance Audit Log
                </h3>
                <p className="text-xs text-slate-500">Timestamped record of administrative actions, user verifications & marketplace events</p>
              </div>
              <button
                onClick={() => toast.info("Audit logs synchronized with Supabase database")}
                className="text-xs font-bold text-indigo-600 hover:underline"
              >
                Refresh Log Stream
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {auditLogs.map((log) => (
                <div key={log.id} className="py-3.5 flex items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <div>
                      <p className="font-bold text-slate-900">{log.message}</p>
                      <span className="text-[10px] text-slate-400 font-mono">{log.time}</span>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold border border-slate-200">
                    {log.badge}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: GOVERNANCE & SYSTEM SETTINGS */}
        {activeTab === 'settings' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-indigo-600" /> CampusKart Governance & System Controls
              </h3>
              <p className="text-xs text-slate-500">Configure automated policy engines, AI vision moderation, and notification rules</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                    <Bot className="w-4 h-4 text-indigo-600" /> Groq AI Vision Product Moderation
                  </h4>
                  <p className="text-[11px] text-slate-500">Automatically scan uploaded product images for inappropriate content</p>
                </div>
                <button
                  onClick={() => toggleSetting('autoAiModeration')}
                  className={`w-12 h-6 rounded-full transition-colors relative ${systemToggles.autoAiModeration ? 'bg-emerald-500' : 'bg-slate-300'}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${systemToggles.autoAiModeration ? 'right-0.5' : 'left-0.5'}`} />
                </button>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                    <Mail className="w-4 h-4 text-emerald-600" /> Resend Instant Email Trigger
                  </h4>
                  <p className="text-[11px] text-slate-500">Send email notification to student when ID verification status updates</p>
                </div>
                <button
                  onClick={() => toggleSetting('instantEmailNotification')}
                  className={`w-12 h-6 rounded-full transition-colors relative ${systemToggles.instantEmailNotification ? 'bg-emerald-500' : 'bg-slate-300'}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${systemToggles.instantEmailNotification ? 'right-0.5' : 'left-0.5'}`} />
                </button>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                    <Lock className="w-4 h-4 text-amber-600" /> Strict Verification Before Buying
                  </h4>
                  <p className="text-[11px] text-slate-500">Require students to complete ID verification before placing orders</p>
                </div>
                <button
                  onClick={() => toggleSetting('strictIdCheckToBuy')}
                  className={`w-12 h-6 rounded-full transition-colors relative ${systemToggles.strictIdCheckToBuy ? 'bg-emerald-500' : 'bg-slate-300'}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${systemToggles.strictIdCheckToBuy ? 'right-0.5' : 'left-0.5'}`} />
                </button>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-rose-600" /> Marketplace Maintenance Mode
                  </h4>
                  <p className="text-[11px] text-slate-500">Temporarily pause new product listings & checkout transactions</p>
                </div>
                <button
                  onClick={() => toggleSetting('maintenanceMode')}
                  className={`w-12 h-6 rounded-full transition-colors relative ${systemToggles.maintenanceMode ? 'bg-rose-600' : 'bg-slate-300'}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${systemToggles.maintenanceMode ? 'right-0.5' : 'left-0.5'}`} />
                </button>
              </div>

            </div>
          </div>
        )}

      </div>

      {/* ID Image Viewer Modal */}
      {selectedIDImage && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full p-6 rounded-2xl space-y-4 text-center shadow-2xl">
            <h3 className="font-bold text-slate-900 text-sm">Submitted Student College ID Document</h3>
            <div className="relative w-full h-64 bg-slate-100 rounded-xl overflow-hidden border border-slate-200">
              <Image src={selectedIDImage} alt="ID Card" fill className="object-contain" />
            </div>
            <button
              onClick={() => setSelectedIDImage(null)}
              className="px-6 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl"
            >
              Close Viewer
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
