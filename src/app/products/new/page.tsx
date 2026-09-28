'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MOCK_CATEGORIES } from '@/lib/mockData';
import { Upload, Eye, CheckCircle2, ArrowRight, Image as ImageIcon, X, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function NewProductPage() {
  const router = useRouter();

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState(MOCK_CATEGORIES[0].id);
  const [price, setPrice] = useState<number | ''>(450);
  const [condition, setCondition] = useState('Like New');
  const [quantity, setQuantity] = useState(1);
  const [locationPickup, setLocationPickup] = useState('Central Library Main Gate / Canteen');
  const [contactPreference, setContactPreference] = useState('In-App Chat / Phone Call');
  const [tagsInput, setTagsInput] = useState('student-use, diploma, textbooks');
  
  // Drag & Drop Product Images State
  const [uploadedImages, setUploadedImages] = useState<Array<{ id: string; url: string; file?: File; isPrimary: boolean }>>([
    {
      id: 'img-default-1',
      url: 'https://images.unsplash.com/photo-1632571401005-458e9d244591?w=600',
      isPrimary: true,
    }
  ]);
  const [dragActive, setDragActive] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Handle Drag & Drop
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleImageFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleImageFiles(Array.from(e.target.files));
    }
  };

  const handleImageFiles = (files: File[]) => {
    const validImageFiles = files.filter(f => f.type.startsWith('image/'));
    
    if (validImageFiles.length === 0) {
      toast.error('Please upload valid image files (JPG, PNG, WEBP).');
      return;
    }

    validImageFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Url = event.target?.result as string;
        setUploadedImages((prev) => [
          ...prev,
          {
            id: `img-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            url: base64Url,
            file,
            isPrimary: prev.length === 0,
          },
        ]);
      };
      reader.readAsDataURL(file);
    });

    toast.success(`Added ${validImageFiles.length} photo(s) to listing preview!`);
  };

  const handleRemoveImage = (idToRemove: string) => {
    setUploadedImages((prev) => {
      const filtered = prev.filter((img) => img.id !== idToRemove);
      if (filtered.length > 0 && !filtered.some((img) => img.isPrimary)) {
        filtered[0].isPrimary = true;
      }
      return filtered;
    });
    toast.info('Image removed');
  };

  const handleSetPrimary = (idToMakePrimary: string) => {
    setUploadedImages((prev) =>
      prev.map((img) => ({
        ...img,
        isPrimary: img.id === idToMakePrimary,
      }))
    );
  };

  const handleSubmitListing = (e: React.FormEvent) => {
    e.preventDefault();
    if (uploadedImages.length === 0) {
      toast.error('Please upload at least one image of your product.');
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      toast.success('Product listing published successfully to Campus Marketplace!');
      setSubmitting(false);
      router.push('/marketplace');
    }, 600);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Page Header */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-3xl p-8 text-white shadow-xl space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-400/20 text-emerald-300 text-xs font-bold border border-emerald-400/30">
          <CheckCircle2 className="w-3.5 h-3.5" /> Direct Campus Seller Marketplace
        </div>
        <h1 className="text-3xl font-black tracking-tight">Create Product Listing</h1>
        <p className="text-xs text-slate-300">
          Verified sellers can list educational textbooks, calculators, aprons, and hardware for direct buyer contact.
        </p>
      </div>

      <form onSubmit={handleSubmitListing} className="space-y-8">
        
        {/* Step 1: Drag & Drop Product Image Uploader */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-indigo-600" /> 1. Upload Product Photos (Drag & Drop)
            </h2>
            <span className="text-xs text-slate-500 font-medium">
              {uploadedImages.length} Photo(s) Attached
            </span>
          </div>

          {/* Drag & Drop Upload Dropzone */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
              dragActive
                ? 'border-indigo-600 bg-indigo-50/80 scale-[1.01]'
                : 'border-slate-300 hover:border-indigo-400 bg-slate-50/50'
            }`}
          >
            <input
              type="file"
              id="product-image-upload-input"
              multiple
              accept="image/png, image/jpeg, image/jpg, image/webp"
              onChange={handleFileSelect}
              className="hidden"
            />

            <div className="space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                <Upload className="w-6 h-6" />
              </div>

              <div>
                <label
                  htmlFor="product-image-upload-input"
                  className="cursor-pointer font-bold text-xs text-indigo-600 hover:text-indigo-700 underline"
                >
                  Click to select product photos
                </label>
                <span className="text-xs text-slate-500 font-normal"> or drag and drop images directly into this area</span>
              </div>

              <p className="text-[11px] text-slate-400">
                Supports JPG, PNG, WEBP files up to 10MB per image
              </p>
            </div>
          </div>

          {/* Uploaded Images Grid & Thumbnails */}
          {uploadedImages.length > 0 && (
            <div className="space-y-2 pt-2">
              <label className="block text-xs font-bold text-slate-700">Uploaded Product Photos</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {uploadedImages.map((img) => (
                  <div
                    key={img.id}
                    className={`relative rounded-xl overflow-hidden border-2 bg-slate-900 group shadow-sm transition-all ${
                      img.isPrimary ? 'border-indigo-600 ring-2 ring-indigo-500/30' : 'border-slate-200'
                    }`}
                  >
                    <div className="w-full h-32 relative">
                      <img
                        src={img.url}
                        alt="Product upload"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Badge */}
                    {img.isPrimary ? (
                      <span className="absolute top-2 left-2 bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow">
                        Primary Photo
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleSetPrimary(img.id)}
                        className="absolute top-2 left-2 bg-slate-900/80 text-white hover:bg-indigo-600 text-[10px] font-bold px-2 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        Set Primary
                      </button>
                    )}

                    {/* Delete button */}
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(img.id)}
                      className="absolute top-2 right-2 w-7 h-7 bg-red-600/90 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow transition-all opacity-90 hover:scale-110"
                      title="Remove image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Step 2: Detailed Product Form */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="font-bold text-slate-900 text-base">2. Product Details & Price</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Product Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Higher Engineering Mathematics by B.S. Grewal (44th Ed)"
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Category *</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                >
                  {MOCK_CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Condition *</label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="New">New</option>
                  <option value="Like New">Like New</option>
                  <option value="Good">Good</option>
                  <option value="Used">Used</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Selling Price (₹) *</label>
                <input
                  type="number"
                  required
                  min={0}
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Detailed Item Description *</label>
              <textarea
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Mention condition details, semester relevance, marks/annotations if any, included accessories..."
                className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Campus Meeting / Pickup Spot *</label>
                <input
                  type="text"
                  required
                  value={locationPickup}
                  onChange={(e) => setLocationPickup(e.target.value)}
                  placeholder="e.g. Central Library Gate / Canteen"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Buyer Contact Preference</label>
                <input
                  type="text"
                  value={contactPreference}
                  onChange={(e) => setContactPreference(e.target.value)}
                  placeholder="In-App Chat / WhatsApp / Phone Call"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
          >
            <span>{submitting ? 'Publishing Listing...' : 'Publish Product to Campus Marketplace'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </form>
    </div>
  );
}
