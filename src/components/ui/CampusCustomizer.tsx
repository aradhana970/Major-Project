'use client';

import React, { useState, useEffect } from 'react';
import { Palette, Sparkles, Building, Layers, Check, X, SlidersHorizontal, Eye } from 'lucide-react';
import { toast } from 'sonner';

export interface CampusCustomizerState {
  theme: 'indigo' | 'emerald' | 'violet' | 'amber' | 'dark';
  stream: string;
  collegeName: string;
  cardLayout: 'grid' | 'compact' | 'list';
}

const DEFAULT_CUSTOMIZER: CampusCustomizerState = {
  theme: 'indigo',
  stream: 'All Engineering & Diploma Streams',
  collegeName: 'Government Engineering College',
  cardLayout: 'grid',
};

export function CampusCustomizer() {
  const [isOpen, setIsOpen] = useState(false);
  const [customizer, setCustomizer] = useState<CampusCustomizerState>(DEFAULT_CUSTOMIZER);
  const [customCollege, setCustomCollege] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('campuskart_customizer');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setCustomizer(parsed);
        setCustomCollege(parsed.collegeName || '');
        applyTheme(parsed.theme);
      } catch (e) {}
    }
  }, []);

  const applyTheme = (themeName: CampusCustomizerState['theme']) => {
    const root = document.documentElement;
    if (themeName === 'dark') {
      root.classList.add('dark-theme');
    } else {
      root.classList.remove('dark-theme');
    }
  };

  const updateSetting = <K extends keyof CampusCustomizerState>(key: K, value: CampusCustomizerState[K]) => {
    const updated = { ...customizer, [key]: value };
    setCustomizer(updated);
    localStorage.setItem('campuskart_customizer', JSON.stringify(updated));
    if (key === 'theme') {
      applyTheme(value as CampusCustomizerState['theme']);
    }
    window.dispatchEvent(new Event('campuskart_customizer_change'));
  };

  const handleSaveCollegeName = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customCollege.trim()) return;
    updateSetting('collegeName', customCollege.trim());
    toast.success(`Campus updated to "${customCollege.trim()}"`);
  };

  const themes = [
    { id: 'indigo', label: 'Tech Indigo', primary: '#4f46e5', badge: 'bg-indigo-600 text-white' },
    { id: 'emerald', label: 'Emerald Campus', primary: '#10b981', badge: 'bg-emerald-600 text-white' },
    { id: 'violet', label: 'Innovation Violet', primary: '#8b5cf6', badge: 'bg-violet-600 text-white' },
    { id: 'amber', label: 'Energy Gold', primary: '#f59e0b', badge: 'bg-amber-500 text-slate-950' },
    { id: 'dark', label: 'Cyber Dark Mode', primary: '#0f172a', badge: 'bg-slate-900 text-amber-300' },
  ];

  const streams = [
    'All Engineering & Diploma Streams',
    'Computer Science & IT',
    'Mechanical & Automation',
    'Electrical & Electronics',
    'Civil & Architecture',
    'Diploma Polytechnic Special',
  ];

  return (
    <>
      {/* Floating Trigger Pill */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 px-4 py-2.5 bg-slate-900 text-white hover:bg-slate-800 rounded-full shadow-2xl border border-indigo-400/40 flex items-center gap-2 text-xs font-bold transition-all hover:scale-105 group"
        title="Customize Website Theme & Campus Preferences"
      >
        <SlidersHorizontal className="w-4 h-4 text-amber-400 group-hover:rotate-45 transition-transform" />
        <span className="hidden sm:inline">Customize Experience</span>
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
      </button>

      {/* Modal Drawer Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-indigo-100 space-y-6 relative max-h-[90vh] overflow-y-auto">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                  <Palette className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h2 className="font-extrabold text-slate-900 text-base">Campus & UI Customizer</h2>
                  <p className="text-xs text-slate-500">Personalize Institute name, color theme & stream focus</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 1. Theme Color Selector */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" /> Color Accent & Styling
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {themes.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => updateSetting('theme', t.id as any)}
                    className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                      customizer.theme === t.id
                        ? 'border-indigo-600 bg-indigo-50/50 shadow-sm ring-2 ring-indigo-500/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: t.primary }} />
                      <span className="text-xs font-bold text-slate-800">{t.label}</span>
                    </div>
                    {customizer.theme === t.id && <Check className="w-4 h-4 text-indigo-600" />}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Institute Name Customizer */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Building className="w-4 h-4 text-indigo-600" /> College / Institute Name
              </label>
              <form onSubmit={handleSaveCollegeName} className="flex gap-2">
                <input
                  type="text"
                  value={customCollege}
                  onChange={(e) => setCustomCollege(e.target.value)}
                  placeholder="e.g. Government Engineering College, Pune"
                  className="flex-1 px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 font-medium"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow transition-colors"
                >
                  Save
                </button>
              </form>
            </div>

            {/* 3. Stream Focus */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-emerald-600" /> Department / Academic Stream Focus
              </label>
              <div className="flex flex-wrap gap-2">
                {streams.map((st) => (
                  <button
                    key={st}
                    onClick={() => updateSetting('stream', st)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                      customizer.stream === st
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Status Bar */}
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
              <span className="font-semibold">Active Campus:</span>
              <span className="font-extrabold text-indigo-700 truncate max-w-[200px]">{customizer.collegeName}</span>
            </div>

            {/* Footer Done */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-md hover:from-indigo-700 hover:to-indigo-800 transition-all text-center"
              >
                Apply & Close Customizer
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
