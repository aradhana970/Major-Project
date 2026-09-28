'use client';

import React from 'react';
import { MOCK_PROFILES } from '@/lib/mockData';
import { ShieldCheck } from 'lucide-react';

export default function AdminUsersPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex items-center justify-between border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Student User Directory</h1>
          <p className="text-xs text-slate-500 mt-1">Platform registered users & role assignments</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
        {MOCK_PROFILES.map((user) => (
          <div key={user.id} className="p-5 flex items-center justify-between gap-4 text-xs">
            <div className="space-y-1">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                {user.full_name}
                {user.verification_status === 'approved' && (
                  <span className="verified-badge text-[10px]">
                    <ShieldCheck className="w-3 h-3" /> Verified
                  </span>
                )}
              </h3>
              <p className="text-slate-500">{user.email} • {user.college_name}</p>
              <p className="text-indigo-600 font-medium">{user.course} ({user.year_semester})</p>
            </div>

            <span className={`px-3 py-1 rounded-full text-xs font-bold ${user.role === 'admin' ? 'bg-indigo-100 text-indigo-800' : 'bg-slate-100 text-slate-700'}`}>
              Role: {user.role}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
