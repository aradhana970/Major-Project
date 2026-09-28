'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Product } from '@/types/database';
import { ShieldCheck, MapPin, MessageSquare, Heart } from 'lucide-react';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();

  const primaryImage = product.images?.find((img) => img.is_primary)?.image_url || 
    product.images?.[0]?.image_url || 
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600';

  const sellerName = product.seller?.full_name || 'Verified Student';
  const collegeName = product.seller?.college_name || 'Government Engineering College';

  const handleContactSeller = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/chat?sellerId=${product.seller_id || 'demo-seller'}&productId=${product.id}`);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toast.success(`Saved "${product.title}" to wishlist!`);
  };

  const conditionColors: Record<string, string> = {
    'New': 'bg-emerald-100 text-emerald-800 border-emerald-200',
    'Like New': 'bg-blue-100 text-blue-800 border-blue-200',
    'Good': 'bg-indigo-100 text-indigo-800 border-indigo-200',
    'Used': 'bg-amber-100 text-amber-800 border-amber-200',
  };

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden relative">
      
      {/* Wishlist Floating Button */}
      <button
        onClick={handleToggleWishlist}
        className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md text-slate-600 hover:text-rose-500 flex items-center justify-center shadow-md transition-colors"
      >
        <Heart className="w-4 h-4" />
      </button>

      {/* Image Thumbnail */}
      <Link href={`/products/${product.id}`} className="relative w-full h-48 bg-slate-100 overflow-hidden block">
        <Image
          src={primaryImage}
          alt={product.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {!product.is_available && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center">
            <span className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full uppercase tracking-wider">
              Item Sold
            </span>
          </div>
        )}
      </Link>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        
        <div>
          {/* Category & Condition Row */}
          <div className="flex items-center justify-between text-xs mb-1.5 gap-2">
            <span className="text-indigo-600 font-semibold truncate max-w-[140px]">
              {product.category?.name || 'Academic Material'}
            </span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${conditionColors[product.condition] || 'bg-slate-100 text-slate-700'}`}>
              {product.condition}
            </span>
          </div>

          {/* Product Title */}
          <Link href={`/products/${product.id}`} className="block">
            <h3 className="font-bold text-slate-900 text-sm line-clamp-2 hover:text-indigo-600 transition-colors">
              {product.title}
            </h3>
          </Link>

          {/* Short Description */}
          <p className="text-xs text-slate-500 mt-1 line-clamp-2">
            {product.description}
          </p>
        </div>

        {/* Seller Info & College */}
        <div className="pt-2.5 border-t border-slate-100 space-y-1 text-xs text-slate-600">
          <div className="flex items-center gap-1.5 font-medium text-slate-800">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
            <span className="truncate">{sellerName}</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-slate-500 truncate">
            <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
            <span className="truncate">{collegeName}</span>
          </div>
        </div>

        {/* Footer Price & Contact Owner Option */}
        <div className="pt-2 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block font-medium">Student Price</span>
            <span className="text-lg font-black text-indigo-950">₹{product.price}</span>
          </div>

          <button
            onClick={handleContactSeller}
            disabled={!product.is_available}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm hover:shadow transition-all disabled:opacity-50"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Contact Owner</span>
          </button>
        </div>

      </div>
    </div>
  );
}
