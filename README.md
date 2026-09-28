# CampusKart – ID-Based Verified Student E-Commerce Marketplace

> **Mandatory Project Notice:**  
> **This project is developed as part of the guidance shared by Prathamesh Sir.**

---

## 1. Project Overview & Problem Statement

### **Problem Statement**
In tertiary education environments (diploma and degree engineering institutes), students spend significant money every semester purchasing expensive academic materials such as reference textbooks, practical lab coats, scientific calculators, engineering drawing instruments, and microcontrollers. Most of these items are used for only 4 to 6 months.

Existing generic e-commerce platforms (Amazon, Flipkart) or open classifieds (OLX) fail students because:
1. **Lack of Campus Identity Verification:** Open to commercial spammers and unknown third parties.
2. **High Delivery Costs & Delays:** Shipping fees make cheap secondhand items (₹100–₹300) impractical.
3. **No Academic Context:** General platforms do not categorize items by semester, branch, or institute lab requirements.

### **Proposed Solution**
**CampusKart** establishes a peer-to-peer **Campus Trust Graph**, where trading is permitted exclusively among verified students of recognized institutes. Sellers list items with **Groq AI & Groq Vision co-pilots**, buyers filter by condition and college campus, and transactions occur via zero-fee **On-Campus Pickup / Cash on Delivery**.

---

## 2. Key Objectives & Unique Academic Features

1. **ID-Based Verified Student Marketplace:**
   - Supabase Authentication with role-based access control (`student_buyer`, `student_seller`, `admin`).
   - Admin verification workflow for reviewing college ID card documents.
   - **Student ID Privacy Safeguard:** ID numbers and card documents are strictly restricted to admin review and are **never publicly displayed**.

2. **Groq AI & Groq Vision Co-Pilot:**
   - **Groq AI (Llama 3.3 70B):** Auto-generates structured product titles, detailed descriptions, category matches, tags, and fair price range estimates.
   - **Groq Vision (Llama 3.2 11B Vision):** Inspects uploaded photos for clarity, lighting score, object identification, and campus appropriateness.

3. **Resend Transactional Email Engine:**
   - Automated emails for registration welcome, verification approval/rejection, order receipt, and status updates.
   - Graceful developer fallback mode logging email payloads if API keys are not provided.

4. **Interactive Admin Analytics Dashboard:**
   - Built using **Recharts** for real-time visualization of category distributions, order statuses, student user growth, and condition breakdowns.

---

## 3. Technology Stack

- **Framework:** Next.js 14+ (App Router, Server Actions, Route Handlers)
- **Language:** TypeScript (Strict typing for domain entities)
- **Styling:** Tailwind CSS + Custom Design System + Glassmorphism
- **Backend & Database:** Supabase PostgreSQL with Row Level Security (RLS) policies
- **Authentication:** Supabase Auth (Email & Password)
- **Storage:** Supabase Storage (Product photos & ID documents)
- **AI Services:** Groq SDK (`llama-3.3-70b-versatile` & `llama-3.2-11b-vision-preview`)
- **Email Engine:** Resend SDK (`resend`)
- **Analytics Charts:** Recharts (`recharts`)
- **UI Icons & Toasts:** Lucide React & Sonner

---

## 4. Database Schema & Security Architecture

### Domain Entities Summary
1. `profiles`: Extends `auth.users` with student identity, college name, course, year, and roll number.
2. `verification_requests`: Tracks college ID document submissions and rejection reasons.
3. `categories`: Academic category taxons (Textbooks, Calculators, Lab Coats, Drafters, Hardware).
4. `products`: Main marketplace listings with condition, price, location, and AI tags.
5. `product_images`: Multi-photo support per listing.
6. `carts` & `cart_items`: Shopping cart persistence.
7. `wishlists`: Bookmarked favorite items.
8. `orders` & `order_items`: On-campus order receipts & status tracking.
9. `reviews`: Verified buyer ratings (1–5 stars) & text feedback.
10. `reports`: Moderation system for flagging inappropriate or fake listings.
11. `notifications`: User notification logs.

---

## 5. Environment Variables & Configuration Guide

Create a `.env.local` file in the project root:

```env
# Supabase Settings (Public & Server Keys)
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key-here

# Groq AI Key (Server Side Only)
GROQ_API_KEY=gsk_your_groq_api_key_here

# Resend Email Engine (Server Side Only)
RESEND_API_KEY=re_your_resend_api_key_here
RESEND_FROM_EMAIL=CampusKart <onboarding@resend.dev>

# Application Base URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 6. Installation & Local Development Setup

### **Prerequisites**
- Node.js 18+ installed
- npm or yarn

### **Execution Commands**

1. **Clone & Install Dependencies:**
   ```bash
   git clone <repo-url>
   cd "itr major project"
   npm install
   ```

2. **Database Setup (Supabase):**
   - Create a new project on [Supabase Console](https://supabase.com).
   - Open the **SQL Editor** tab in Supabase.
   - Copy the contents of [`supabase/schema.sql`](file:///c:/Users/Milin/Desktop/itr%20major%20project/supabase/schema.sql) and execute the SQL query.
   - Copy your Project URL and Anon Key into `.env.local`.

3. **Run Local Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Production Build Verification:**
   ```bash
   npm run build
   npm run start
   ```

---

## 7. Testing Checklist

- [x] New user registration & profile creation
- [x] Student login & reviewer demo presets
- [x] Student ID verification upload workflow
- [x] Admin approval & rejection email notifications
- [x] Groq AI text description & price range generation
- [x] Groq Vision multimodal image clarity inspection
- [x] Marketplace catalog live search, condition & price filters
- [x] Shopping cart quantity controls
- [x] On-campus order placement & order status update lifecycle
- [x] Verified buyer review submission
- [x] Admin dashboard Recharts interactive analytics

---

## 8. Limitations & Future Scope

### **Current Academic Limitations**
- Order payments use On-Campus Pickup / Cash on Delivery demonstration workflow (no real credit card processing).
- Email dispatch defaults to stdout console fallback if Resend API key is unconfigured.

### **Future Enhancements**
- In-App Real-time WebSockets Chat between buyer and seller.
- Mobile Native App (React Native / Expo) integration.
- Automated OCR extraction of college ID card roll numbers.

---

*Developed with pride by a Third-Year Diploma Engineering Student under the guidance of **Prathamesh Sir**.*
