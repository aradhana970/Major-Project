-- ========================================================
-- CampusKart Database Schema & Row Level Security (RLS)
-- Developed as part of guidance shared by Prathamesh Sir
-- ========================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Define ENUM Types
CREATE TYPE user_role AS ENUM ('student_buyer', 'student_seller', 'admin');
CREATE TYPE verification_status AS ENUM ('unverified', 'pending', 'approved', 'rejected');
CREATE TYPE product_condition AS ENUM ('New', 'Like New', 'Good', 'Used');
CREATE TYPE order_status AS ENUM ('Pending', 'Accepted', 'Ready for Pickup', 'Completed', 'Cancelled');
CREATE TYPE report_reason AS ENUM ('Fake Product', 'Wrong Information', 'Inappropriate Image', 'Unavailable Product', 'Suspicious Seller', 'Duplicate Listing');
CREATE TYPE report_status AS ENUM ('pending', 'reviewed', 'resolved', 'dismissed');

-- 3. Profiles Table (Extends auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone_number TEXT,
  college_name TEXT NOT NULL DEFAULT 'Main Campus Institute',
  course TEXT NOT NULL DEFAULT 'Diploma / Engineering',
  year_semester TEXT NOT NULL DEFAULT '3rd Year',
  student_id_number TEXT NOT NULL DEFAULT 'ID-PENDING', -- Private: Not exposed in public views
  avatar_url TEXT,
  role user_role NOT NULL DEFAULT 'student_buyer',
  verification_status verification_status NOT NULL DEFAULT 'unverified',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Verification Requests Table
CREATE TABLE public.verification_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  student_id_card_url TEXT NOT NULL,
  status verification_status NOT NULL DEFAULT 'pending',
  rejection_reason TEXT,
  reviewed_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Categories Table
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  icon TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Products Table
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  condition product_condition NOT NULL DEFAULT 'Good',
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity >= 0),
  location_pickup TEXT NOT NULL DEFAULT 'Campus Main Gate / Library',
  contact_preference TEXT DEFAULT 'In-App / Phone',
  is_available BOOLEAN DEFAULT TRUE,
  is_ai_assisted BOOLEAN DEFAULT FALSE,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Product Images Table
CREATE TABLE public.product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Carts & Cart Items Tables
CREATE TABLE public.carts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cart_id UUID NOT NULL REFERENCES public.carts(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(cart_id, product_id)
);

-- 9. Wishlists Table
CREATE TABLE public.wishlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- 10. Orders & Order Items Tables
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  seller_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  order_number TEXT UNIQUE NOT NULL,
  total_amount NUMERIC(10, 2) NOT NULL CHECK (total_amount >= 0),
  status order_status NOT NULL DEFAULT 'Pending',
  payment_method TEXT DEFAULT 'Campus Pickup / Cash on Delivery',
  pickup_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
  unit_price NUMERIC(10, 2) NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1
);

-- 11. Reviews Table
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE UNIQUE,
  reviewer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Reports Table
CREATE TABLE public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  reason report_reason NOT NULL,
  details TEXT,
  status report_status NOT NULL DEFAULT 'pending',
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. Notifications Table
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================================
-- INDEXES FOR OPTIMAL QUERY PERFORMANCE
-- ========================================================
CREATE INDEX idx_products_seller ON public.products(seller_id);
CREATE INDEX idx_products_category ON public.products(category_id);
CREATE INDEX idx_products_condition ON public.products(condition);
CREATE INDEX idx_orders_buyer ON public.orders(buyer_id);
CREATE INDEX idx_orders_seller ON public.orders(seller_id);
CREATE INDEX idx_reviews_product ON public.reviews(product_id);
CREATE INDEX idx_verification_user ON public.verification_requests(user_id);

-- ========================================================
-- AUTOMATIC PROFILE CREATION TRIGGER ON AUTH SIGNUP
-- ========================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    full_name,
    email,
    college_name,
    course,
    year_semester,
    student_id_number,
    role,
    verification_status
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Student User'),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'college_name', 'Engineering/Diploma Institute'),
    COALESCE(NEW.raw_user_meta_data->>'course', 'Diploma Studies'),
    COALESCE(NEW.raw_user_meta_data->>'year_semester', '3rd Year'),
    COALESCE(NEW.raw_user_meta_data->>'student_id_number', 'PENDING-ID'),
    'student_buyer',
    'unverified'
  );

  -- Create Cart for New User
  INSERT INTO public.carts (user_id) VALUES (NEW.id);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ========================================================
-- UPDATED_AT TRIGGER FUNCTION
-- ========================================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_modtime BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_products_modtime BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_orders_modtime BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ========================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Public profiles are viewable by authenticated users" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Categories Policies
CREATE POLICY "Categories viewable by all" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Only admins manage categories" ON public.categories FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Products Policies
CREATE POLICY "Products viewable by all" ON public.products FOR SELECT USING (true);
CREATE POLICY "Only verified sellers or admins can create products" ON public.products FOR INSERT WITH CHECK (
  auth.uid() = seller_id AND EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND (verification_status = 'approved' OR role = 'admin')
  )
);
CREATE POLICY "Sellers can update own products" ON public.products FOR UPDATE USING (
  auth.uid() = seller_id OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Sellers can delete own products" ON public.products FOR DELETE USING (
  auth.uid() = seller_id OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Product Images Policies
CREATE POLICY "Product images viewable by all" ON public.product_images FOR SELECT USING (true);
CREATE POLICY "Sellers manage own product images" ON public.product_images FOR ALL USING (
  EXISTS (SELECT 1 FROM public.products WHERE id = product_images.product_id AND (seller_id = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')))
);

-- Carts Policies
CREATE POLICY "Users manage own cart" ON public.carts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own cart items" ON public.cart_items FOR ALL USING (
  EXISTS (SELECT 1 FROM public.carts WHERE id = cart_items.cart_id AND user_id = auth.uid())
);

-- Wishlists Policies
CREATE POLICY "Users view own wishlist" ON public.wishlists FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users manage own wishlist" ON public.wishlists FOR ALL USING (auth.uid() = user_id);

-- Orders & Order Items Policies
CREATE POLICY "Buyers and Sellers view own orders" ON public.orders FOR SELECT USING (
  auth.uid() = buyer_id OR auth.uid() = seller_id OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Buyers create orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = buyer_id);
CREATE POLICY "Buyers and Sellers update relevant orders" ON public.orders FOR UPDATE USING (
  auth.uid() = buyer_id OR auth.uid() = seller_id OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Users view relevant order items" ON public.order_items FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.orders 
    WHERE id = order_items.order_id AND (buyer_id = auth.uid() OR seller_id = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'))
  )
);
CREATE POLICY "Buyers insert order items" ON public.order_items FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.orders WHERE id = order_items.order_id AND buyer_id = auth.uid())
);

-- Verification Requests Policies
CREATE POLICY "Users view own verification requests" ON public.verification_requests FOR SELECT USING (
  auth.uid() = user_id OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Users create verification requests" ON public.verification_requests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins update verification requests" ON public.verification_requests FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Reviews Policies
CREATE POLICY "Reviews viewable by all" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Buyers write reviews for orders" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = reviewer_id);
CREATE POLICY "Users manage own reviews" ON public.reviews FOR UPDATE USING (auth.uid() = reviewer_id);
CREATE POLICY "Users delete own reviews" ON public.reviews FOR DELETE USING (auth.uid() = reviewer_id);

-- Reports Policies
CREATE POLICY "Users create reports" ON public.reports FOR INSERT WITH CHECK (auth.uid() = reporter_id);
CREATE POLICY "Admins view and update reports" ON public.reports FOR ALL USING (
  auth.uid() = reporter_id OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Notifications Policies
CREATE POLICY "Users view own notifications" ON public.notifications FOR ALL USING (auth.uid() = user_id);

-- ========================================================
-- INITIAL SEED DATA FOR CATEGORIES
-- ========================================================
INSERT INTO public.categories (name, slug, icon) VALUES
  ('Textbooks & Reference Books', 'textbooks', 'BookOpen'),
  ('Practical Files & Journals', 'practical-files', 'FileText'),
  ('Scientific Calculators', 'calculators', 'Calculator'),
  ('Lab Coats & Aprons', 'lab-coats', 'Shirt'),
  ('Engineering Drawing Instruments', 'drawing-instruments', 'Compass'),
  ('Electronics & Microcontrollers', 'electronics', 'Cpu'),
  ('Lecture Notes & Question Banks', 'notes', 'FileCheck'),
  ('Stationery & Art Supplies', 'stationery', 'PenTool'),
  ('Used Project Materials & Hardware', 'project-materials', 'Wrench')
ON CONFLICT (name) DO NOTHING;
