import fs from 'fs';
import path from 'path';

export interface Book {
  id: string;
  title: string;
  author: string;
  desc: string;
  price: number;
  salePrice?: number;
  category: string;
  coverImage: string;
  images: string[];
  stock: number;
  isFeatured: boolean;
  isBestseller: boolean;
  status: 'Available' | 'Out of Stock';
  slug: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
}

export interface BookCategory {
  id: string;
  name: string;
  slug: string;
}

export interface BookImage {
  id: string;
  bookId: string;
  url: string;
  altText?: string;
}

export interface OrderItem {
  bookId: string;
  title: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  invoiceNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerAddress: string;
  items: OrderItem[];
  subtotal: number;
  discountAmount: number;
  total: number;
  couponUsed?: string;
  status: 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';
  trackingNumber?: string;
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  address?: string;
  createdAt: string;
}

export interface Inquiry {
  id: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  bookId?: string;
  createdAt: string;
}

export interface WishlistItem {
  id: string;
  customerEmail: string;
  bookId: string;
  createdAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  value: number;
  active: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  address?: string;
  password?: string;
  registeredDate: string;
  lastLoginDate?: string;
  loginCount: number;
  otp?: string;
  otpExpires?: string;
  verified?: boolean;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  city?: string;
  message: string;
  source: 'Contact' | 'Inquiry' | 'Book Store' | 'Service' | 'Panchang' | 'WhatsApp';
  service?: string;
  bookId?: string;
  createdAt: string;
  followUpStatus: 'New' | 'Contacted' | 'In Progress' | 'Converted' | 'Lost';
  notes?: string;
}

export interface SMTPConfig {
  host: string;
  port: number;
  secure: boolean;
  username: string;
  password?: string;
  senderEmail: string;
  senderName: string;
  serviceType: 'Gmail' | 'Brevo' | 'SendGrid' | 'Mailgun' | 'Custom';
}

export interface EmailLog {
  id: string;
  recipient: string;
  subject: string;
  status: 'DELIVERED' | 'FAILED' | 'PENDING';
  error?: string;
  timestamp: string;
  type: 'OTP' | 'Notification' | 'Campaign';
}

export interface BulkCampaign {
  id: string;
  title: string;
  subject: string;
  content: string;
  sentAt: string;
  recipientsCount: number;
  successCount: number;
  failedCount: number;
}

export interface Subscriber {
  id: string;
  email: string;
  subscribedAt: string;
  active: boolean;
}

export interface UserActivityLog {
  id: string;
  email?: string;
  action: string;
  details: string;
  timestamp: string;
}

export interface ViewLog {
  id: string;
  type: 'book' | 'product' | 'page';
  targetId: string;
  email?: string;
  timestamp: string;
}

export interface Booking {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceId: string;
  serviceName: string;
  date: string;
  time: string;
  type: 'Online' | 'Offline' | 'Video' | 'WhatsApp';
  price: number;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
  birthDate?: string;
  birthTime?: string;
  birthPlace?: string;
  createdAt: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'Booking' | 'Inquiry' | 'New User' | 'Order' | 'Payment';
  status: 'unread' | 'read';
  soundAlertPlayed: boolean;
  createdAt: string;
}

export interface NotificationSettings {
  soundEnabled: boolean;
  volume: number;
  customSoundUrl?: string;
}

export interface AIGuruConversation {
  id: string;
  userEmail: string;
  title: string;
  messages: {
    role: 'user' | 'model';
    content: string;
    timestamp: string;
  }[];
  createdAt: string;
}

export interface AstrologyToolkitSettings {
  activeTools: string[];
}

export interface SocialMediaLinks {
  instagram?: string;
  x?: string;
  facebook?: string;
  youtube?: string;
  linkedin?: string;
  threads?: string;
}

export interface Database {
  books: Book[];
  book_categories: BookCategory[];
  book_images: BookImage[];
  orders: Order[];
  customers: Customer[];
  inquiries: Inquiry[];
  wishlist: WishlistItem[];
  coupons: Coupon[];
  users: User[];
  leads: Lead[];
  smtp: SMTPConfig;
  email_logs: EmailLog[];
  campaigns: BulkCampaign[];
  subscribers: Subscriber[];
  activity_logs: UserActivityLog[];
  views_logs: ViewLog[];
  bookings?: Booking[];
  notifications?: AppNotification[];
  notification_settings?: NotificationSettings;
  ai_guru_chats?: AIGuruConversation[];
  astrology_toolkit_settings?: AstrologyToolkitSettings;
  social_media?: SocialMediaLinks;
  admin_otp?: {
    otp: string;
    email: string;
    otpExpires: string;
  };
}

const DB_FILE = path.join(process.cwd(), 'db.json');

// Default seeds matching our high-fidelity frontend content
const defaultBooks: Book[] = [
  {
    id: "bo_01",
    title: "The Ultimate Guide to Kundli Reading",
    author: "Acharya TN Khurana",
    desc: "A masterclass on chart interpretation, Dasha analysis, and everyday planetary guidelines.",
    price: 499,
    salePrice: 399,
    category: "Vedic Astrology",
    coverImage: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600",
    images: [
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=600"
    ],
    stock: 45,
    isFeatured: true,
    isBestseller: true,
    status: "Available",
    slug: "ultimate-kundli-reading",
    seoTitle: "The Ultimate Guide to Kundli Reading | Acharya TN Khurana",
    seoDescription: "Step-by-step masterclass on how to read Vedic astrology charts and planetary Dashas.",
    seoKeywords: "kundli reading book, astrology study guide, acharya book"
  },
  {
    id: "bo_02",
    title: "Sacred Vastu Shastra Blueprints",
    author: "Acharya TN Khurana",
    desc: "Harmonize the energy vortex of your home or workspace without demolition. Easy remedies included.",
    price: 699,
    salePrice: 499,
    category: "Vastu Shastra",
    coverImage: "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&q=80&w=600",
    images: [
      "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=600"
    ],
    stock: 22,
    isFeatured: true,
    isBestseller: false,
    status: "Available",
    slug: "sacred-vastu-blueprints",
    seoTitle: "Sacred Vastu Shastra Blueprints book by Acharya TN Khurana",
    seoDescription: "Unlock flow of finance, health and peace with quick residential & business Vastu corrections.",
    seoKeywords: "vastu shastra blueprints, home energy correction, vastu remedies"
  },
  {
    id: "bo_03",
    title: "Numerology & Your Secret Code to Success",
    author: "Acharya TN Khurana",
    desc: "Discover how your date of birth and letters of your name holds the secret codes to your financial destiny.",
    price: 350,
    category: "Numerology",
    coverImage: "https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&q=80&w=600",
    images: [
      "https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&q=80&w=600"
    ],
    stock: 12,
    isFeatured: false,
    isBestseller: true,
    status: "Available",
    slug: "numerology-destiny-code",
    seoTitle: "Numerology & Your Secret Code | Best Selling Book",
    seoDescription: "Calculate your Destiny Number, Life Path Number, and apply name corrections.",
    seoKeywords: "numerology calculator, cosmic code, name correction destiny"
  },
  {
    id: "bo_04",
    title: "Tarot Arcana Mastery",
    author: "Acharya TN Khurana",
    desc: "A beginner-to-advanced visual anthology for reading major and minor arcane spreads accurately.",
    price: 599,
    salePrice: 449,
    category: "Tarot Reading",
    coverImage: "https://images.unsplash.com/photo-1572945281861-68b291979f20?auto=format&fit=crop&q=80&w=600",
    images: [
      "https://images.unsplash.com/photo-1572945281861-68b291979f20?auto=format&fit=crop&q=80&w=600"
    ],
    stock: 0,
    isFeatured: false,
    isBestseller: false,
    status: "Out of Stock",
    slug: "tarot-arcana-mastery",
    seoTitle: "Tarot Arcana Mastery Practical Guide Book",
    seoDescription: "Unlock professional guidelines for major spreads and intuitive predictions.",
    seoKeywords: "tarot card interpretation, tarot layout guide, psychic guidelines book"
  }
];

const defaultCategories: BookCategory[] = [
  { id: "cat_01", name: "Vedic Astrology", slug: "vedic-astrology" },
  { id: "cat_02", name: "Vastu Shastra", slug: "vastu-shastra" },
  { id: "cat_03", name: "Numerology", slug: "numerology" },
  { id: "cat_04", name: "Tarot Reading", slug: "tarot-reading" }
];

const defaultBookImages: BookImage[] = [
  { id: "img_01", bookId: "bo_01", url: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600", altText: "Kundli Reading Book Cover" },
  { id: "img_02", bookId: "bo_01", url: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=600", altText: "Kundli Reading Open Page" },
  { id: "img_03", bookId: "bo_02", url: "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&q=80&w=600", altText: "Vastu Shastra Blueprints" }
];

const defaultCoupons: Coupon[] = [
  { id: "cp_1", code: "VEDIC10", discountType: "percentage", value: 10, active: true },
  { id: "cp_2", code: "SHANTI50", discountType: "fixed", value: 50, active: true },
  { id: "cp_3", code: "GURU20", discountType: "percentage", value: 20, active: false }
];

const defaultOrders: Order[] = [
  {
    id: "or_1",
    invoiceNumber: "INV-2026-601",
    customerName: "Ramesh Patel",
    customerPhone: "+91 91111 22222",
    customerEmail: "ramesh.patel@gmail.com",
    customerAddress: "Flat 104, Sector 15, Rohini, New Delhi - 110085",
    items: [
      { bookId: "bo_01", title: "The Ultimate Guide to Kundli Reading", quantity: 1, price: 399 }
    ],
    subtotal: 399,
    discountAmount: 0,
    total: 399,
    status: "Delivered",
    trackingNumber: "DTDC-49382103",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "or_2",
    invoiceNumber: "INV-2026-602",
    customerName: "Sushma Swaraj",
    customerPhone: "+91 85555 77777",
    customerEmail: "sushma.s@outlook.com",
    customerAddress: "Sandalwood Residency, Block C, Jayanagar, Bangalore - 560041",
    items: [
      { bookId: "bo_01", title: "The Ultimate Guide to Kundli Reading", quantity: 1, price: 399 },
      { bookId: "bo_02", title: "Sacred Vastu Shastra Blueprints", quantity: 1, price: 499 }
    ],
    subtotal: 898,
    discountAmount: 89.8,
    total: 808.2,
    couponUsed: "VEDIC10",
    status: "Shipped",
    trackingNumber: "BLUE-7731920",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  }
];

const defaultCustomers: Customer[] = [
  {
    id: "cust_01",
    name: "Ramesh Patel",
    phone: "+91 91111 22222",
    email: "ramesh.patel@gmail.com",
    address: "Flat 104, Sector 15, Rohini, New Delhi - 110085",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "cust_02",
    name: "Sushma Swaraj",
    phone: "+91 85555 77777",
    email: "sushma.s@outlook.com",
    address: "Sandalwood Residency, Block C, Jayanagar, Bangalore - 560041",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  }
];

const defaultInquiries: Inquiry[] = [
  {
    id: "inq_01",
    name: "Ananya Dixit",
    phone: "+91 74444 88888",
    email: "ananya.dixit@gmail.com",
    message: "Is the printed Kundli book available in Hindi language version as well?",
    bookId: "bo_01",
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
  }
];

const defaultWishlists: WishlistItem[] = [
  {
    id: "wl_01",
    customerEmail: "ramesh.patel@gmail.com",
    bookId: "bo_02",
    createdAt: new Date().toISOString()
  }
];

const defaultUsers: User[] = [
  {
    id: "usr_01",
    name: "Siddharth Roy",
    email: "sid.roy@gmail.com",
    phone: "+91 99887 76655",
    city: "New Delhi",
    address: "Flat 401, Outer Circle, Connaught Place, New Delhi 110001",
    registeredDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    loginCount: 5
  },
  {
    id: "usr_02",
    name: "Ramesh Patel",
    email: "ramesh.patel@gmail.com",
    phone: "+91 91111 22222",
    city: "New Delhi",
    address: "Flat 104, Sector 15, Rohini, New Delhi - 110085",
    registeredDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    loginCount: 2
  }
];

const defaultLeads: Lead[] = [
  {
    id: "ld_01",
    name: "Ananya Dixit",
    email: "ananya.dixit@gmail.com",
    phone: "+91 74444 88888",
    city: "Noida",
    message: "Is the printed Kundli book available in Hindi language version as well?",
    source: "Book Store",
    bookId: "bo_01",
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    followUpStatus: "New",
    notes: "Requires follow up of hindi version release date"
  },
  {
    id: "ld_02",
    name: "Sushma Swaraj",
    email: "sushma.s@outlook.com",
    phone: "+91 85555 77777",
    city: "Bangalore",
    message: "Requested emergency consultation regarding home Vastu",
    source: "Service",
    service: "Vastu Consultation",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    followUpStatus: "In Progress",
    notes: "Client is in a hurry, scheduled for thursday morning"
  }
];

const defaultSMTP: SMTPConfig = {
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false,
  username: '',
  password: '',
  senderEmail: '',
  senderName: 'Acharya TN Khurana Astrologer',
  serviceType: 'Brevo'
};

const defaultSubscribers: Subscriber[] = [
  { id: "sub_01", email: "ramesh.patel@gmail.com", subscribedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), active: true },
  { id: "sub_02", email: "sushma.s@outlook.com", subscribedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), active: true }
];

const defaultActivityLogs: UserActivityLog[] = [
  {
    id: "act_01",
    email: "sid.roy@gmail.com",
    action: "Login",
    details: "Authenticated via Email OTP successfully.",
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString()
  },
  {
    id: "act_02",
    email: "ramesh.patel@gmail.com",
    action: "View Book",
    details: "Viewed product page of 'The Ultimate Guide to Kundli Reading'",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  }
];

// Read from JSON file
export function readDB(): Database {
  try {
    if (!fs.existsSync(DB_FILE)) {
      writeDB({
        books: defaultBooks,
        book_categories: defaultCategories,
        book_images: defaultBookImages,
        orders: defaultOrders,
        customers: defaultCustomers,
        inquiries: defaultInquiries,
        wishlist: defaultWishlists,
        coupons: defaultCoupons,
        users: defaultUsers,
        leads: defaultLeads,
        smtp: defaultSMTP,
        email_logs: [],
        campaigns: [],
        subscribers: defaultSubscribers,
        activity_logs: defaultActivityLogs,
        views_logs: []
      });
    }
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(data) as Database;
    // Fallbacks to guarantee fields exist
    if (!parsed.books) parsed.books = [];
    if (!parsed.book_categories) parsed.book_categories = [];
    if (!parsed.book_images) parsed.book_images = [];
    if (!parsed.orders) parsed.orders = [];
    if (!parsed.customers) parsed.customers = [];
    if (!parsed.inquiries) parsed.inquiries = [];
    if (!parsed.wishlist) parsed.wishlist = [];
    if (!parsed.coupons) parsed.coupons = [];
    if (!parsed.users) parsed.users = defaultUsers;
    if (!parsed.leads) parsed.leads = defaultLeads;
    if (!parsed.smtp) parsed.smtp = defaultSMTP;
    if (!parsed.email_logs) parsed.email_logs = [];
    if (!parsed.campaigns) parsed.campaigns = [];
    if (!parsed.subscribers) parsed.subscribers = defaultSubscribers;
    if (!parsed.activity_logs) parsed.activity_logs = defaultActivityLogs;
    if (!parsed.views_logs) parsed.views_logs = [];
    if (!parsed.bookings) parsed.bookings = [];
    if (!parsed.notifications) parsed.notifications = [
      {
        id: "notif_01",
        title: "Welcome Astro Admin Portal",
        message: "Your real-time sound notification center is online and active.",
        type: "New User",
        status: "unread",
        soundAlertPlayed: true,
        createdAt: new Date().toISOString()
      }
    ];
    if (!parsed.notification_settings) parsed.notification_settings = { soundEnabled: true, volume: 0.8 };
    if (!parsed.ai_guru_chats) parsed.ai_guru_chats = [];
    if (!parsed.astrology_toolkit_settings) parsed.astrology_toolkit_settings = {
      activeTools: [
        'birth_chart', 'kundli', 'horoscope', 'numerology', 'compatibility', 
        'manglik', 'gemstone', 'lucky_calculator', 'muhurat', 'panchang', 'transit', 'dasha'
      ]
    };
    if (!parsed.social_media) parsed.social_media = {
        instagram: '',
        x: '',
        facebook: '',
        youtube: '',
        linkedin: '',
        threads: ''
    };
    return parsed;
  } catch (err) {
    console.error("Failed to read database.json, using fallback", err);
    return {
      books: defaultBooks,
      book_categories: defaultCategories,
      book_images: defaultBookImages,
      orders: defaultOrders,
      customers: defaultCustomers,
      inquiries: defaultInquiries,
      wishlist: defaultWishlists,
      coupons: defaultCoupons,
      users: defaultUsers,
      leads: defaultLeads,
      smtp: defaultSMTP,
      email_logs: [],
      campaigns: [],
      subscribers: defaultSubscribers,
      activity_logs: defaultActivityLogs,
      views_logs: [],
      bookings: [],
      notifications: [],
      notification_settings: { soundEnabled: true, volume: 0.8 },
      ai_guru_chats: [],
      astrology_toolkit_settings: {
        activeTools: [
          'birth_chart', 'kundli', 'horoscope', 'numerology', 'compatibility', 
          'manglik', 'gemstone', 'lucky_calculator', 'muhurat', 'panchang', 'transit', 'dasha'
        ]
      },
      social_media: {
        instagram: '',
        x: '',
        facebook: '',
        youtube: '',
        linkedin: '',
        threads: ''
      }
    };
  }
}

// Write to JSON file
export function writeDB(db: Database): void {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error("Critical: Failed to persist database.json updates!", err);
  }
}
