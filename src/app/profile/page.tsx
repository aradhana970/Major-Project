'use client';

import React, { useState } from 'react';
import { MOCK_PROFILES } from '@/lib/mockData';
import { ShieldCheck, User, Mail, Phone, BookOpen, GraduationCap, Lock, Save } from 'lucide-react';
import { toast } from 'sonner';

export default function ProfilePage() {
  const [profile, setProfile] = useState(MOCK_PROFILES[0]);
  const [saving, setSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success('Profile details updated successfully!');
    }, 500);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-2xl shadow-md">
          {profile.full_name.charAt(0)}
        </div>
        <div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            {profile.full_name}
            {profile.verification_status === 'approved' && (
              <span className="verified-badge text-xs">
                <ShieldCheck className="w-3.5 h-3.5" /> Verified Student
              </span>
            )}
          </h1>
          <p className="text-xs text-slate-500">{profile.email} • {profile.college_name}</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSave} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="font-bold text-slate-900 text-base">Student Details</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
            <input
              type="text"
              value={profile.full_name}
              onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
            <input
              type="email"
              disabled
              value={profile.email}
              className="w-full px-3.5 py-2.5 text-xs bg-slate-100 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Institute / College Name</label>
            <input
              type="text"
              value={profile.college_name}
              onChange={(e) => setProfile({ ...profile, college_name: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Course / Branch</label>
            <input
              type="text"
              value={profile.course}
              onChange={(e) => setProfile({ ...profile, course: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Year / Semester</label>
            <input
              type="text"
              value={profile.year_semester}
              onChange={(e) => setProfile({ ...profile, year_semester: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
            <input
              type="text"
              value={profile.phone_number || ''}
              onChange={(e) => setProfile({ ...profile, phone_number: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>
        </div>

        {/* Private Student ID Row */}
        <div className="p-4 bg-slate-100 rounded-xl border border-slate-200 space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-amber-600" /> Student Roll / ID Number
            </span>
            <span className="font-mono text-slate-900 font-bold">{profile.student_id_number}</span>
          </div>
          <p className="text-[11px] text-slate-500">
            🔒 Used strictly for campus verification. Private field (masked from marketplace viewers).
          </p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
        >
          <Save className="w-4 h-4" /> Save Profile Details
        </button>
      </form>

    </div>
  );
}
