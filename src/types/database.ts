export type UserRole = 'student_buyer' | 'student_seller' | 'admin';
export type VerificationStatus = 'unverified' | 'pending' | 'approved' | 'rejected';
export type ProductCondition = 'New' | 'Like New' | 'Good' | 'Used';
export type OrderStatus = 'Pending' | 'Accepted' | 'Ready for Pickup' | 'Completed' | 'Cancelled';
export type ReportReason = 'Fake Product' | 'Wrong Information' | 'Inappropriate Image' | 'Unavailable Product' | 'Suspicious Seller' | 'Duplicate Listing';
export type ReportStatus = 'pending' | 'reviewed' | 'resolved' | 'dismissed';

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  phone_number?: string;
  college_name: string;
  course: string;
  year_semester: string;
  student_id_number: string;
  avatar_url?: string;
  role: UserRole;
  verification_status: VerificationStatus;
  created_at: string;
  updated_at: string;
}

export interface VerificationRequest {
  id: string;
  user_id: string;
  student_id_card_url: string;
  status: VerificationStatus;
  rejection_reason?: string;
  reviewed_by?: string;
  created_at: string;
  updated_at: string;
  profile?: Profile;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  created_at: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  is_primary: boolean;
  created_at: string;
}

export interface Product {
  id: string;
  seller_id: string;
  category_id: string;
  title: string;
  description: string;
  price: number;
  condition: ProductCondition;
  quantity: number;
  location_pickup: string;
  contact_preference?: string;
  is_available: boolean;
  is_ai_assisted: boolean;
  tags?: string[];
  created_at: string;
  updated_at: string;
  seller?: Profile;
  category?: Category;
  images?: ProductImage[];
}

export interface CartItem {
  id: string;
  cart_id: string;
  product_id: string;
  quantity: number;
  created_at: string;
  product?: Product;
}

export interface Cart {
  id: string;
  user_id: string;
  created_at: string;
  items?: CartItem[];
}

export interface Wishlist {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
  product?: Product;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  unit_price: number;
  quantity: number;
  product?: Product;
}

export interface Order {
  id: string;
  buyer_id: string;
  seller_id: string;
  order_number: string;
  total_amount: number;
  status: OrderStatus;
  payment_method: string;
  pickup_notes?: string;
  created_at: string;
  updated_at: string;
  buyer?: Profile;
  seller?: Profile;
  items?: OrderItem[];
}

export interface Review {
  id: string;
  order_id: string;
  reviewer_id: string;
  product_id: string;
  rating: number;
  comment?: string;
  created_at: string;
  reviewer?: Profile;
}

export interface Report {
  id: string;
  reporter_id: string;
  product_id: string;
  reason: ReportReason;
  details?: string;
  status: ReportStatus;
  admin_notes?: string;
  created_at: string;
  reporter?: Profile;
  product?: Product;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  link?: string;
  is_read: boolean;
  created_at: string;
}
