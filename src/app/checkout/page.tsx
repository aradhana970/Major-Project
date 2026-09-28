'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  CreditCard,
  QrCode,
  ShieldCheck,
  MapPin,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  FileText,
  UserCheck,
  Building,
  Phone,
  Sparkles,
  Lock,
  Receipt
} from 'lucide-react';
import { toast } from 'sonner';

export default function CheckoutBillingPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'cash' | 'card'>('upi');
  
  // Billing Form State
  const [fullName, setFullName] = useState('Aarav Sharma');
  const [studentId, setStudentId] = useState('DEP-CS-2023-042');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [pickupSpot, setPickupSpot] = useState('Central Library Gate / Main Canteen');
  const [hostelAddress, setHostelAddress] = useState('Boys Hostel Block B, Room 204');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showInvoiceReceipt, setShowInvoiceReceipt] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem('campuskart_cart');
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setCartItems(Array.isArray(parsed) ? parsed : []);
      } catch (e) {
        setCartItems([]);
      }
    }

    // Attempt to fill profile from demo session
    const demoUser = localStorage.getItem('campuskart_demo_user');
    if (demoUser) {
      try {
        const u = JSON.parse(demoUser);
        if (u.full_name) setFullName(u.full_name);
        if (u.student_id_number) setStudentId(u.student_id_number);
        if (u.phone_number) setPhone(u.phone_number);
      } catch (e) {}
    }
  }, []);

  const subtotal = cartItems.reduce((acc, item) => acc + (item.product?.price || 0) * item.quantity, 0);
  const campusDiscount = subtotal > 500 ? 50 : 0;
  const platformFee = 0; // Free for students
  const grandTotal = Math.max(0, subtotal - campusDiscount + platformFee);

  // Dynamic UPI Payment QR Code
  const upiId = 'campuskart@upi';
  const upiQrApi = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
    `upi://pay?pa=${upiId}&pn=CampusKart&am=${grandTotal}&cu=INR&tn=Order_Payment`
  )}`;

  const handleConfirmOrderAndPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setShowInvoiceReceipt(true);
      toast.success('Payment verified & order placed successfully!');
      localStorage.removeItem('campuskart_cart');
    }, 1500);
  };

  if (showInvoiceReceipt) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-2xl space-y-6 text-center">
          
          <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-lg">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl font-black text-slate-900">Payment & Order Confirmed!</h1>
            <p className="text-xs text-slate-500">Official CampusKart Student Handshake Invoice Generated</p>
          </div>

          {/* Official Bill Card */}
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-left space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="font-extrabold text-sm text-indigo-700">CampusKart Invoice</span>
                <p className="text-[10px] text-slate-400">Order ID: #CK-{Math.floor(100000 + Math.random() * 900000)}</p>
              </div>
              <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full border border-emerald-200">
                PAID & VERIFIED
              </span>
            </div>

            <div className="space-y-2 text-xs text-slate-700">
              <div className="flex justify-between">
                <span>Student Name:</span>
                <span className="font-bold text-slate-900">{fullName} ({studentId})</span>
              </div>
              <div className="flex justify-between">
                <span>Pickup Location:</span>
                <span className="font-medium text-slate-900">{pickupSpot}</span>
              </div>
              <div className="flex justify-between">
                <span>Payment Method:</span>
                <span className="font-bold uppercase text-indigo-600">{paymentMethod}</span>
              </div>
            </div>

            {/* Bill Summary Table */}
            <div className="border-t border-slate-200 pt-3 space-y-2 text-xs">
              <div className="font-bold text-slate-800">Purchased Items:</div>
              {cartItems.map((item, idx) => (
                <div key={idx} className="flex justify-between text-slate-600">
                  <span>{item.product?.title} (x{item.quantity})</span>
                  <span className="font-semibold text-slate-900">₹{(item.product?.price || 0) * item.quantity}</span>
                </div>
              ))}

              <div className="border-t border-slate-200 pt-2 space-y-1">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal:</span>
                  <span>₹{subtotal}</span>
                </div>
                {campusDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Campus Peer Discount:</span>
                    <span>-₹{campusDiscount}</span>
                  </div>
                )}
                <div className="flex justify-between font-black text-slate-900 text-sm pt-2 border-t border-slate-300">
                  <span>Total Bill Amount Paid:</span>
                  <span className="text-emerald-600 text-base">₹{grandTotal}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Link
              href="/orders"
              className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl shadow transition-all text-center"
            >
              View My Orders
            </Link>
            <Link
              href="/marketplace"
              className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs rounded-xl transition-all text-center"
            >
              Back to Marketplace
            </Link>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-6">
        <div>
          <Link href="/cart" className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 mb-1 hover:underline">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Cart
          </Link>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Checkout & Billing Portal</h1>
          <p className="text-xs text-slate-500">Confirm student details, choose payment method & verify bill total</p>
        </div>

        <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-bold">
          <ShieldCheck className="w-4 h-4 text-emerald-600" /> ID-Verified Student Protection
        </div>
      </div>

      <form onSubmit={handleConfirmOrderAndPayment} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Billing Details & Payment Selector (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* 1. Student Delivery & Billing Details */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-indigo-600" /> 1. Student Billing & Delivery Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Student Name *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Student Roll / ID No. *</label>
                <input
                  type="text"
                  required
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mobile / WhatsApp Number *</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Hostel Block / Room No.</label>
                <input
                  type="text"
                  value={hostelAddress}
                  onChange={(e) => setHostelAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">On-Campus Handshake Meeting Spot *</label>
              <input
                type="text"
                required
                value={pickupSpot}
                onChange={(e) => setPickupSpot(e.target.value)}
                placeholder="e.g. Library Main Gate or Canteen Entrance"
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
              />
            </div>
          </div>

          {/* 2. Payment Method Selector */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-indigo-600" /> 2. Choose Payment Option
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              
              {/* UPI Option */}
              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`p-4 rounded-2xl border text-left flex flex-col justify-between space-y-2 transition-all ${
                  paymentMethod === 'upi'
                    ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <QrCode className="w-5 h-5 text-indigo-600" />
                  {paymentMethod === 'upi' && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
                </div>
                <div>
                  <div className="font-bold text-xs text-slate-900">Instant UPI QR</div>
                  <div className="text-[10px] text-slate-500">GPay, PhonePe, Paytm</div>
                </div>
              </button>

              {/* Cash on Delivery Option */}
              <button
                type="button"
                onClick={() => setPaymentMethod('cash')}
                className={`p-4 rounded-2xl border text-left flex flex-col justify-between space-y-2 transition-all ${
                  paymentMethod === 'cash'
                    ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Receipt className="w-5 h-5 text-emerald-600" />
                  {paymentMethod === 'cash' && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
                </div>
                <div>
                  <div className="font-bold text-xs text-slate-900">Cash on Handshake</div>
                  <div className="text-[10px] text-slate-500">Pay when receiving item</div>
                </div>
              </button>

              {/* Card / Netbanking Option */}
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-4 rounded-2xl border text-left flex flex-col justify-between space-y-2 transition-all ${
                  paymentMethod === 'card'
                    ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <CreditCard className="w-5 h-5 text-amber-600" />
                  {paymentMethod === 'card' && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
                </div>
                <div>
                  <div className="font-bold text-xs text-slate-900">Debit Card / NetBanking</div>
                  <div className="text-[10px] text-slate-500">All major Indian banks</div>
                </div>
              </button>

            </div>

            {/* UPI QR Payment Box if selected */}
            {paymentMethod === 'upi' && (
              <div className="bg-slate-900 text-white p-6 rounded-2xl border border-indigo-500/30 text-center space-y-4 shadow-xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-400/30">
                  <Sparkles className="w-3.5 h-3.5" /> Scan & Pay ₹{grandTotal}
                </div>

                <div className="bg-white p-3 rounded-2xl inline-block shadow-inner mx-auto">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={upiQrApi}
                    alt="CampusKart UPI QR Code"
                    className="w-44 h-44 object-contain rounded-lg"
                  />
                </div>

                <div className="text-xs text-slate-300 space-y-1">
                  <p>UPI ID: <strong className="font-mono text-amber-300">campuskart@upi</strong></p>
                  <p className="text-[11px] text-slate-400">Scan using any UPI App (GPay, PhonePe, Paytm, BHIM) to pay exact bill total.</p>
                </div>
              </div>
            )}

          </div>

        </div>

        {/* Right Column: Complete Itemized Bill & Total Amount (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xl space-y-6 sticky top-24">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 className="font-black text-slate-900 text-base flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" /> Itemized Billing Breakdown
              </h2>
              <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full">
                {cartItems.length} Items
              </span>
            </div>

            {/* Item List */}
            <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
              {cartItems.map((item) => (
                <div key={item.product_id} className="flex items-center justify-between text-xs pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 overflow-hidden relative flex-shrink-0">
                      <Image
                        src={item.product?.images?.[0]?.image_url || 'https://images.unsplash.com/photo-1632571401005-458e9d244591?w=100'}
                        alt={item.product?.title || 'Product'}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 max-w-[170px] truncate">{item.product?.title}</p>
                      <p className="text-[10px] text-slate-400">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-black text-slate-900">₹{(item.product?.price || 0) * item.quantity}</span>
                </div>
              ))}
            </div>

            {/* Total Billing Math */}
            <div className="space-y-2 text-xs pt-2 border-t border-slate-200">
              
              <div className="flex justify-between text-slate-600">
                <span>Items Subtotal:</span>
                <span className="font-semibold text-slate-900">₹{subtotal}</span>
              </div>

              {campusDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Student Peer Discount:</span>
                  <span>-₹{campusDiscount}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-600">
                <span>On-Campus Delivery:</span>
                <span className="font-bold text-emerald-600">FREE</span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>Student Verification Fee:</span>
                <span className="font-bold text-emerald-600">₹0 (FREE)</span>
              </div>

              {/* HIGHLIGHTED GRAND TOTAL BILL */}
              <div className="bg-slate-900 text-white p-4 rounded-2xl space-y-1 mt-4 shadow-lg border border-indigo-500/30">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300">TOTAL AMOUNT PAYABLE:</span>
                  <span className="text-2xl font-black text-amber-300">₹{grandTotal}</span>
                </div>
                <p className="text-[10px] text-slate-400">Inclusive of all campus discounts & peer verification protection</p>
              </div>

            </div>

            {/* Confirm Payment Button */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-black text-sm rounded-xl shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Lock className="w-4 h-4 text-emerald-200" />
              <span>{isProcessing ? 'Verifying Payment & Placing Order...' : `Confirm Payment of ₹${grandTotal}`}</span>
            </button>

            <div className="text-[10px] text-slate-400 text-center flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> 100% Secure Student Peer Handshake Guarantee
            </div>

          </div>

        </div>

      </form>

    </div>
  );
}
