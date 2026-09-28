import { Product, Category, Profile, Order, Review, Report, VerificationRequest } from '@/types/database';

export const MOCK_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Textbooks & Reference Books', slug: 'textbooks', icon: 'BookOpen', created_at: new Date().toISOString() },
  { id: 'cat-2', name: 'Practical Files & Lab Manuals', slug: 'practical-files', icon: 'FileText', created_at: new Date().toISOString() },
  { id: 'cat-3', name: 'Scientific Calculators', slug: 'calculators', icon: 'Calculator', created_at: new Date().toISOString() },
  { id: 'cat-4', name: 'Lab Coats & Aprons', slug: 'lab-coats', icon: 'Shirt', created_at: new Date().toISOString() },
  { id: 'cat-5', name: 'Engineering Drawing Instruments', slug: 'drawing-instruments', icon: 'Compass', created_at: new Date().toISOString() },
  { id: 'cat-6', name: 'Electronics & Microcontrollers', slug: 'electronics', icon: 'Cpu', created_at: new Date().toISOString() },
  { id: 'cat-7', name: 'Lecture Notes & Question Banks', slug: 'notes', icon: 'FileCheck', created_at: new Date().toISOString() },
  { id: 'cat-8', name: 'Stationery & Art Supplies', slug: 'stationery', icon: 'PenTool', created_at: new Date().toISOString() },
  { id: 'cat-9', name: 'Used Project Materials & Hardware', slug: 'project-materials', icon: 'Wrench', created_at: new Date().toISOString() },
];

export const MOCK_PROFILES: Profile[] = [
  {
    id: 'user-seller-1',
    full_name: 'Aarav Sharma',
    email: 'aarav.sharma@campus.edu.in',
    phone_number: '+91 98765 43210',
    college_name: 'Government Engineering College, Sector 28',
    course: 'Diploma in Computer Engineering',
    year_semester: '3rd Year / 5th Sem',
    student_id_number: 'DEP-COMP-2022-045',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    role: 'student_seller',
    verification_status: 'approved',
    created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'user-seller-2',
    full_name: 'Priya Patel',
    email: 'priya.patel@campus.edu.in',
    phone_number: '+91 98234 56789',
    college_name: 'Institute of Technology & Science',
    course: 'Diploma in Mechanical Engineering',
    year_semester: '3rd Year / 6th Sem',
    student_id_number: 'DEP-MECH-2022-112',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    role: 'student_seller',
    verification_status: 'approved',
    created_at: new Date(Date.now() - 45 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'user-admin-1',
    full_name: 'Prathamesh Admin',
    email: 'admin@campuskart.edu',
    phone_number: '+91 90000 00001',
    college_name: 'Central University Campus',
    course: 'Faculty / Admin Lead',
    year_semester: 'Staff',
    student_id_number: 'ADMIN-FACULTY-01',
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    role: 'admin',
    verification_status: 'approved',
    created_at: new Date(Date.now() - 90 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    seller_id: 'user-seller-1',
    category_id: 'cat-3',
    title: 'Casio FX-991EX ClassWiz Non-Programmable Calculator',
    description: 'Perfect condition Casio FX-991EX scientific calculator used during 2nd year semester exams. High-resolution display, 552 functions, solar powered. Comes with protective original hard slide cover. Ideal for diploma and degree engineering students.',
    price: 950,
    condition: 'Like New',
    quantity: 1,
    location_pickup: 'Library Building Main Gate or Canteen Area',
    contact_preference: 'WhatsApp / Call after 4 PM',
    is_available: true,
    is_ai_assisted: true,
    tags: ['calculator', 'casio', 'fx-991ex', 'engineering', 'math'],
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
    seller: MOCK_PROFILES[0],
    category: MOCK_CATEGORIES[2],
    images: [
      { id: 'img-1', product_id: 'prod-1', image_url: 'https://images.unsplash.com/photo-1632571401005-458e9d244591?w=600', is_primary: true, created_at: new Date().toISOString() }
    ]
  },
  {
    id: 'prod-2',
    seller_id: 'user-seller-2',
    category_id: 'cat-1',
    title: 'Higher Engineering Mathematics - B.S. Grewal (44th Edition)',
    description: 'Clean textbook with no highlighted pages or pencil marks. Essential reference book for 3rd and 4th semester mathematics. Includes all solved examples for diploma university examination.',
    price: 420,
    condition: 'Good',
    quantity: 1,
    location_pickup: 'Mechanical Workshop Block',
    contact_preference: 'In-App Chat',
    is_available: true,
    is_ai_assisted: true,
    tags: ['textbook', 'grewal', 'maths', 'mechanical', 'diploma'],
    created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
    seller: MOCK_PROFILES[1],
    category: MOCK_CATEGORIES[0],
    images: [
      { id: 'img-2', product_id: 'prod-2', image_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600', is_primary: true, created_at: new Date().toISOString() }
    ]
  },
  {
    id: 'prod-3',
    seller_id: 'user-seller-1',
    category_id: 'cat-6',
    title: 'Arduino UNO R3 Starter Kit + Sensor Modules & Jumper Wires',
    description: 'Complete Major Project hardware kit. Includes Arduino UNO R3, 16x2 LCD module, HC-SR04 Ultrasonic sensor, Servo motor, breadboard, and 50+ jumper wires. Tested and working 100%.',
    price: 750,
    condition: 'Like New',
    quantity: 2,
    location_pickup: 'Computer Department Lab 3',
    contact_preference: 'WhatsApp',
    is_available: true,
    is_ai_assisted: true,
    tags: ['arduino', 'sensors', 'major-project', 'iot', 'robotics'],
    created_at: new Date(Date.now() - 1 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
    seller: MOCK_PROFILES[0],
    category: MOCK_CATEGORIES[5],
    images: [
      { id: 'img-3', product_id: 'prod-3', image_url: 'https://images.unsplash.com/photo-1553406830-ef2513450d76?w=600', is_primary: true, created_at: new Date().toISOString() }
    ]
  },
  {
    id: 'prod-4',
    seller_id: 'user-seller-2',
    category_id: 'cat-4',
    title: 'White Cotton Lab Coat (Size L) - Chemistry & Workshop Safe',
    description: 'Freshly washed 100% thick cotton white lab apron with college emblem space. Full sleeve, button closure with 3 front pockets. Used only during 1st year chemistry lab sessions.',
    price: 250,
    condition: 'Good',
    quantity: 1,
    location_pickup: 'Hostel Block B Entrance',
    contact_preference: 'Call',
    is_available: true,
    is_ai_assisted: false,
    tags: ['labcoat', 'apron', 'chemistry', 'workshop'],
    created_at: new Date(Date.now() - 7 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
    seller: MOCK_PROFILES[1],
    category: MOCK_CATEGORIES[3],
    images: [
      { id: 'img-4', product_id: 'prod-4', image_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600', is_primary: true, created_at: new Date().toISOString() }
    ]
  },
  {
    id: 'prod-5',
    seller_id: 'user-seller-1',
    category_id: 'cat-5',
    title: 'Mini Drafter Set with Sheet Holder Container & Compass Box',
    description: 'High-precision stainless steel mini drafter with clamp, scale, and heavy plastic waterproof sheet holder tube. Mandatory tool for 1st & 2nd sem Engineering Graphics & Drawing practicals.',
    price: 380,
    condition: 'Good',
    quantity: 1,
    location_pickup: 'Drawing Hall / Auditorium Gate',
    contact_preference: 'WhatsApp',
    is_available: true,
    is_ai_assisted: true,
    tags: ['drafter', 'drawing', 'graphics', 'sheetholder'],
    created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
    seller: MOCK_PROFILES[0],
    category: MOCK_CATEGORIES[4],
    images: [
      { id: 'img-5', product_id: 'prod-5', image_url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600', is_primary: true, created_at: new Date().toISOString() }
    ]
  }
];

export const MOCK_ORDERS: Order[] = [
  {
    id: 'ord-101',
    buyer_id: 'user-seller-2',
    seller_id: 'user-seller-1',
    order_number: 'CK-20260925-8812',
    total_amount: 950,
    status: 'Completed',
    payment_method: 'Campus Pickup / Cash on Delivery',
    pickup_notes: 'Met near Central Library gate at 4:30 PM. Product inspected & verified.',
    created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    buyer: MOCK_PROFILES[1],
    seller: MOCK_PROFILES[0],
    items: [
      { id: 'oi-1', order_id: 'ord-101', product_id: 'prod-1', unit_price: 950, quantity: 1, product: MOCK_PRODUCTS[0] }
    ]
  }
];

export const MOCK_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    order_id: 'ord-101',
    reviewer_id: 'user-seller-2',
    product_id: 'prod-1',
    rating: 5,
    comment: 'Super smooth transaction! Aarav met me right on time near the library. The Casio calculator is clean and works perfectly. Thanks CampusKart!',
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    reviewer: MOCK_PROFILES[1]
  }
];
