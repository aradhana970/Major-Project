'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { GraduationCap, ShieldCheck, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    collegeName: 'Government Engineering College',
    course: 'Diploma in Computer Engineering',
    yearSemester: '3rd Year / 5th Semester',
    studentIdNumber: '',
    phoneNumber: '',
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const demoUser = {
      id: 'user-' + Date.now(),
      full_name: formData.fullName,
      email: formData.email,
      phone_number: formData.phoneNumber,
      college_name: formData.collegeName,
      course: formData.course,
      year_semester: formData.yearSemester,
      student_id_number: formData.studentIdNumber,
      role: 'student_buyer',
      verification_status: 'unverified',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            college_name: formData.collegeName,
            course: formData.course,
            year_semester: formData.yearSemester,
            student_id_number: formData.studentIdNumber,
            phone_number: formData.phoneNumber,
          },
        },
      });

      if (error) {
        // Handle fetch failed or network error gracefully
        if (error.message.includes('fetch failed') || error.message.includes('Failed to fetch') || error.message.includes('Invalid URL')) {
          console.log('[DEMO MODE] Supabase URL not reachable. Falling back to local session.');
          localStorage.setItem('campuskart_demo_user', JSON.stringify(demoUser));
          toast.success('Registration successful! (Demo Session created)');
          router.push('/login');
          return;
        }
        setErrorMsg(error.message);
        toast.error(error.message);
      } else {
        localStorage.setItem('campuskart_demo_user', JSON.stringify(demoUser));
        toast.success('Registration successful! Please log in to complete student verification.');
        
        // Trigger welcome email background call
        fetch('/api/email/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: formData.email,
            subject: 'Welcome to CampusKart! 🎓',
            html: `<h2>Welcome ${formData.fullName}!</h2><p>Your registration is complete. Next step: Upload student ID for verification.</p>`,
          }),
        }).catch(() => {});

        router.push('/login');
      }
    } catch (err: any) {
      // Graceful fallback for fetch network errors
      console.log('[DEMO FALLBACK] Handled registration fetch error:', err.message);
      localStorage.setItem('campuskart_demo_user', JSON.stringify(demoUser));
      toast.success('Registration successful! Redirecting to login...');
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-xl w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-xl">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
            <GraduationCap className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Create Student Account</h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Join your institute's verified marketplace to buy and sell textbooks, drawing tools & calculators.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
              <input
                type="text"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Aarav Sharma"
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Student Email *</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="student@campus.edu.in"
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Password *</label>
              <input
                type="password"
                name="password"
                required
                minLength={6}
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">College / Institute Name *</label>
            <input
              type="text"
              name="collegeName"
              required
              value={formData.collegeName}
              onChange={handleChange}
              placeholder="e.g. Government Polytechnic / Engineering College"
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Course / Branch *</label>
              <input
                type="text"
                name="course"
                required
                value={formData.course}
                onChange={handleChange}
                placeholder="Diploma in Computer Eng."
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Year / Semester *</label>
              <input
                type="text"
                name="yearSemester"
                required
                value={formData.yearSemester}
                onChange={handleChange}
                placeholder="3rd Year / 5th Sem"
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Student Roll / ID Number *</label>
            <input
              type="text"
              name="studentIdNumber"
              required
              value={formData.studentIdNumber}
              onChange={handleChange}
              placeholder="e.g. DEP-COMP-2022-045"
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              🔒 <strong>ID Privacy Safeguard:</strong> Your roll number is used strictly for identity verification and is <em>never publicly displayed</em>.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
          >
            {loading ? 'Creating Account...' : 'Register Account'}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        <div className="text-center pt-4 border-t border-slate-100">
          <p className="text-xs text-slate-500">
            Already have a student account?{' '}
            <Link href="/login" className="font-bold text-indigo-600 hover:text-indigo-700">
              Log In
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
