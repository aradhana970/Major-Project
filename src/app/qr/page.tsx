'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Smartphone, QrCode, Wifi, ArrowLeft, ShieldCheck, Copy, Check, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export default function MobileQRPage() {
  const [localIp, setLocalIp] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [port, setPort] = useState('3000');

  useEffect(() => {
    // Attempt to infer window location host
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      const currentPort = window.location.port || '3000';
      setPort(currentPort);

      if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
        setLocalIp(hostname);
      }
    }
  }, []);

  const mobileUrl = localIp 
    ? `http://${localIp}:${port}` 
    : `http://192.168.1.5:${port}`; // fallback standard home wifi IP

  // Generate QR code using quick Google Charts API or QR Server API
  const qrImageApi = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(mobileUrl)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(mobileUrl);
    setCopied(true);
    toast.success('Mobile URL copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      {/* Back button */}
      <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-indigo-600 hover:text-indigo-700">
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </Link>

      {/* Main Container */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-xl text-center space-y-8">
        
        <div className="max-w-md mx-auto space-y-3">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-md">
            <Smartphone className="w-7 h-7" />
          </div>
          
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200">
            <Wifi className="w-3.5 h-3.5" /> Mobile & Expo Go Connection Ready
          </div>

          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Scan QR Code to Open on Mobile Phone
          </h1>

          <p className="text-xs text-slate-500 leading-relaxed">
            Scan this QR code using your phone&apos;s <strong>Camera app</strong>, <strong>Expo Go</strong>, or any <strong>QR Scanner app</strong> to view CampusKart directly on your mobile device.
          </p>
        </div>

        {/* QR Code Graphic Box */}
        <div className="max-w-xs mx-auto p-6 bg-slate-900 rounded-3xl border-4 border-indigo-500/30 shadow-2xl space-y-4">
          <div className="bg-white p-4 rounded-2xl inline-block shadow-inner">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={qrImageApi}
              alt="CampusKart Mobile QR Code"
              className="w-56 h-56 mx-auto object-contain rounded-lg"
            />
          </div>

          <div className="text-white text-xs font-mono bg-slate-800/90 py-2 px-3 rounded-xl border border-slate-700 flex items-center justify-between">
            <span className="truncate max-w-[200px]">{mobileUrl}</span>
            <button
              onClick={handleCopy}
              className="p-1 hover:bg-slate-700 rounded transition-colors text-amber-300"
              title="Copy link"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Step-by-Step Mobile Instructions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left pt-4">
          
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 font-black text-xs flex items-center justify-center">
              1
            </div>
            <h3 className="font-bold text-xs text-slate-900">Same Wi-Fi Connection</h3>
            <p className="text-[11px] text-slate-500">
              Ensure your mobile phone is connected to the same Wi-Fi network as this laptop.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 font-black text-xs flex items-center justify-center">
              2
            </div>
            <h3 className="font-bold text-xs text-slate-900">Scan QR Code</h3>
            <p className="text-[11px] text-slate-500">
              Open Phone Camera, Expo Go scanner, or Google Lens, and scan the QR code above.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 font-black text-xs flex items-center justify-center">
              3
            </div>
            <h3 className="font-bold text-xs text-slate-900">Instant Mobile Web</h3>
            <p className="text-[11px] text-slate-500">
              Tap the pop-up notification link to launch the responsive mobile web app on your phone!
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
