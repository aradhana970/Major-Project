'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { MOCK_PRODUCTS, MOCK_REVIEWS } from '@/lib/mockData';
import {
  ShieldCheck,
  MapPin,
  MessageSquare,
  Phone,
  Heart,
  AlertTriangle,
  Star,
  User,
  ArrowLeft,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { toast } from 'sonner';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params?.id as string;

  const product = MOCK_PRODUCTS.find((p) => p.id === productId) || MOCK_PRODUCTS[0];
  const reviews = MOCK_REVIEWS.filter((r) => r.product_id === product.id);

  const [selectedImage, setSelectedImage] = useState(
    product.images?.[0]?.image_url || 'https://images.unsplash.com/photo-1632571401005-458e9d244591?w=800'
  );

  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('Wrong Information');
  const [reportDetails, setReportDetails] = useState('');

  const handleContactOwner = () => {
    router.push(`/chat?sellerId=${product.seller_id || 'demo-seller'}&productId=${product.id}`);
  };

  const handleDirectCall = () => {
    toast.info(`Contact phone requested for seller ${product.seller?.full_name || 'Owner'}`);
  };

  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Report submitted to campus admins for moderation.');
    setShowReportModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Back Link */}
      <Link href="/marketplace" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-indigo-600">
        <ArrowLeft className="w-4 h-4" /> Back to Marketplace
      </Link>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Images & Thumbnails (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative w-full h-80 sm:h-96 rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm">
            <Image
              src={selectedImage}
              alt={product.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>

        {/* Center Column: Details & Description (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                {product.category?.name || 'Academic Material'}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                {product.condition} Condition
              </span>
            </div>

            <h1 className="text-2xl font-black text-slate-900 leading-tight">
              {product.title}
            </h1>

            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-black text-indigo-950">₹{product.price}</span>
              <span className="text-xs text-slate-500 font-medium">On-Campus Direct Price</span>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 space-y-2">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400">Product Description</h3>
            <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          </div>

          {/* Location & Tags */}
          <div className="space-y-3 text-xs">
            <div className="flex items-center gap-2 text-slate-700 bg-slate-100 p-3 rounded-xl">
              <MapPin className="w-4 h-4 text-indigo-600 flex-shrink-0" />
              <span><strong>Campus Meeting Point:</strong> {product.location_pickup}</span>
            </div>

            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {product.tags.map((tag, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-medium">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Seller Box & Contact Owner Actions (3 cols) */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Action Box: Direct Chat Contact */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-lg space-y-4">
            
            <div className="space-y-2">
              <button
                onClick={handleContactOwner}
                disabled={!product.is_available}
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <MessageSquare className="w-4 h-4" /> Contact Owner via Chat
              </button>

              <button
                onClick={handleDirectCall}
                disabled={!product.is_available}
                className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs rounded-xl border border-slate-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Phone className="w-4 h-4 text-indigo-600" /> Direct Call / WhatsApp
              </button>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Deal Settlement:</span>
              <span className="font-bold text-slate-800">Cash / UPI on Campus Pickup</span>
            </div>

          </div>

          {/* Verified Seller Profile Box */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 space-y-4">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400">Verified Seller Information</h3>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
                {product.seller?.full_name?.charAt(0) || 'S'}
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                  {product.seller?.full_name || 'Verified Student Seller'}
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                </h4>
                <p className="text-[11px] text-slate-500">{product.seller?.course || 'Diploma Engineering'}</p>
              </div>
            </div>

            <div className="text-xs text-slate-600 space-y-1.5 pt-2 border-t border-slate-100">
              <div><strong>Institute:</strong> {product.seller?.college_name || 'Main Campus'}</div>
              <div><strong>Year:</strong> {product.seller?.year_semester || '3rd Year'}</div>
              <div><strong>Contact Pref:</strong> {product.contact_preference || 'In-App Chat'}</div>
            </div>

            <button
              onClick={() => setShowReportModal(true)}
              className="w-full text-center text-[11px] font-semibold text-rose-600 hover:text-rose-700 pt-2 flex items-center justify-center gap-1"
            >
              <AlertTriangle className="w-3.5 h-3.5" /> Report Flagged Listing
            </button>
          </div>

        </div>

      </div>

      {/* Reviews Section */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200/80 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Verified Student Reviews</h2>
          <span className="text-xs font-semibold text-amber-600 flex items-center gap-1">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" /> 5.0 Rating (1 review)
          </span>
        </div>

        {reviews.length === 0 ? (
          <p className="text-xs text-slate-500 italic">No reviews written for this listing yet.</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((rev) => (
              <div key={rev.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-slate-400" />
                    <span className="font-bold text-slate-900">{rev.reviewer?.full_name || 'Buyer'}</span>
                  </div>
                  <div className="flex gap-0.5 text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                </div>
                <p className="text-slate-700">{rev.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full p-6 rounded-2xl space-y-4">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-600" /> Report Product Listing
            </h3>

            <form onSubmit={handleSubmitReport} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Reason for Report</label>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                >
                  <option value="Fake Product">Fake Product</option>
                  <option value="Wrong Information">Wrong Information</option>
                  <option value="Inappropriate Image">Inappropriate Image</option>
                  <option value="Unavailable Product">Unavailable Product</option>
                  <option value="Suspicious Seller">Suspicious Seller</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Additional Details</label>
                <textarea
                  required
                  rows={3}
                  value={reportDetails}
                  onChange={(e) => setReportDetails(e.target.value)}
                  placeholder="Explain why this listing violates campus guidelines..."
                  className="w-full p-3 text-xs border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-rose-600 rounded-xl"
                >
                  Submit Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
