'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { MOCK_ORDERS } from '@/lib/mockData';
import { ArrowLeft, CheckCircle2, Star, ShieldCheck, MapPin, User, FileText } from 'lucide-react';
import { toast } from 'sonner';

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params?.id as string;

  const order = MOCK_ORDERS.find((o) => o.id === orderId) || MOCK_ORDERS[0];

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    setReviewSubmitted(true);
    toast.success('Thank you! Your verified student review was published.');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <Link href="/orders" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-indigo-600">
        <ArrowLeft className="w-4 h-4" /> Back to Orders
      </Link>

      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        
        {/* Receipt Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div>
            <span className="text-xs text-slate-400 block font-medium">CampusKart Receipt</span>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight font-mono">{order.order_number}</h1>
          </div>

          <div className="text-right">
            <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              {order.status}
            </span>
            <p className="text-[11px] text-slate-400 mt-1">{new Date(order.created_at).toLocaleString()}</p>
          </div>
        </div>

        {/* Itemized List */}
        <div className="space-y-4">
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400">Order Items</h3>
          {order.items?.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 text-xs">
              <div>
                <p className="font-bold text-slate-900">{item.product?.title}</p>
                <p className="text-[11px] text-slate-500">Condition: {item.product?.condition} • Qty: {item.quantity}</p>
              </div>
              <span className="font-black text-slate-900 text-sm">₹{item.unit_price * item.quantity}</span>
            </div>
          ))}
        </div>

        {/* Pickup & Seller Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 text-xs">
          <div className="p-4 bg-indigo-50/60 rounded-xl border border-indigo-100 space-y-1">
            <h4 className="font-bold text-indigo-950 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-indigo-600" /> On-Campus Pickup Meeting Point
            </h4>
            <p className="text-indigo-900">{order.pickup_notes || 'Central Library Entrance Gate'}</p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> Verified Seller
            </h4>
            <p className="text-slate-700">{order.seller?.full_name} ({order.seller?.college_name})</p>
          </div>
        </div>

        {/* Write Review Section (If Order Completed) */}
        {order.status === 'Completed' && (
          <div className="pt-6 border-t border-slate-100 space-y-4">
            <h3 className="font-bold text-sm text-slate-900">Leave a Verified Purchase Review</h3>
            
            {reviewSubmitted ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Thank you! Your review has been saved to the product catalog.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Rating</label>
                  <div className="flex gap-1 text-amber-400">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star className={`w-5 h-5 ${star <= rating ? 'fill-amber-400' : 'text-slate-300'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Feedback Comment</label>
                  <textarea
                    rows={3}
                    required
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Describe item condition, seller punctuality & campus meetup..."
                    className="w-full p-3 text-xs bg-white border border-slate-200 rounded-xl"
                  />
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-md"
                >
                  Submit Verified Review
                </button>
              </form>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
