


import fs from 'fs';
interface Book {
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

interface BookCategory {
  id: string;
  name: string;
  slug: string;
}

interface BookImage {
  id: string;
  bookId: string;
  url: string;
  altText?: string;
}

interface OrderItem {
  bookId: string;
  title: string;
  quantity: number;
  price: number;
}

interface Order {
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

interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  address?: string;
  createdAt: string;
}

interface Inquiry {
  id: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  bookId?: string;
  createdAt: string;
}

interface WishlistItem {
  id: string;
  customerEmail: string;
  bookId: string;
  createdAt: string;
}

interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  value: number;
  active: boolean;
}

interface User {
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

interface Lead {
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

interface SMTPConfig {
  host: string;
  port: number;
  secure: boolean;
  username: string;
  password?: string;
  senderEmail: string;
  senderName: string;
  serviceType: 'Gmail' | 'Brevo' | 'SendGrid' | 'Mailgun' | 'Custom';
}

interface EmailLog {
  id: string;
  recipient: string;
  subject: string;
  status: 'DELIVERED' | 'FAILED' | 'PENDING';
  error?: string;
  timestamp: string;
  type: 'OTP' | 'Notification' | 'Campaign';
}

interface BulkCampaign {
  id: string;
  title: string;
  subject: string;
  content: string;
  sentAt: string;
  recipientsCount: number;
  successCount: number;
  failedCount: number;
}

interface Subscriber {
  id: string;
  email: string;
  subscribedAt: string;
  active: boolean;
}

interface UserActivityLog {
  id: string;
  email?: string;
  action: string;
  details: string;
  timestamp: string;
}

interface ViewLog {
  id: string;
  type: 'book' | 'product' | 'page';
  targetId: string;
  email?: string;
  timestamp: string;
}

interface Booking {
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

interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'Booking' | 'Inquiry' | 'New User' | 'Order' | 'Payment';
  status: 'unread' | 'read';
  soundAlertPlayed: boolean;
  createdAt: string;
}

interface NotificationSettings {
  soundEnabled: boolean;
  volume: number;
  customSoundUrl?: string;
}

interface AIGuruConversation {
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

interface AstrologyToolkitSettings {
  activeTools: string[];
}

interface SocialMediaLinks {
  instagram?: string;
  x?: string;
  facebook?: string;
  youtube?: string;
  linkedin?: string;
  threads?: string;
}

interface Database {
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
function readDB(): Database {
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
function writeDB(db: Database): void {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error("Critical: Failed to persist database.json updates!", err);
  }
}

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
// import { GoogleGenerativeAI } from '@google/generative-ai';
class GoogleGenerativeAI {
  constructor(apiKey: string) {}
  getGenerativeModel(config: any) {
    return {
      generateContent: async (req: any) => {
        return { response: { text: () => "AI is currently disabled for maintenance." }, text: "AI disabled." };
      }
    };
  }
}

import dotenv from 'dotenv';
import nodemailer from 'nodemailer';


// Load environment variables
dotenv.config();

// Configuration Helpers
function getSmtpConfig(db: any) {
  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    let port = parseInt(process.env.SMTP_PORT || '465', 10);
    let secure = process.env.SMTP_SECURE !== 'false';
    
    // Forcibly override user Vercel dashboard mistakes to prevent timeout crashes
    if (process.env.VERCEL) {
      port = 465;
      secure = true;
    }

    return {
      host: process.env.SMTP_HOST,
      port,
      secure,
      username: process.env.SMTP_USER,
      password: process.env.SMTP_PASSWORD || process.env.SMTP_PASS || '',
      senderName: process.env.SMTP_SENDER_NAME || 'Admin',
      senderEmail: process.env.SMTP_SENDER_EMAIL || process.env.SMTP_USER,
    };
  }
  
  // Override db fallback to use 465/true on Vercel to prevent hanging
  if (db?.smtp) {
    return {
      ...db.smtp,
      port: db.smtp.port === 587 && process.env.VERCEL ? 465 : db.smtp.port,
      secure: db.smtp.port === 587 && process.env.VERCEL ? true : db.smtp.secure
    };
  }
  return db?.smtp;
}

function getAllowedAdmins() {
  const envAdmins = process.env.ADMIN_EMAILS;
  let allowedAdmins = ['tnkhurana3@gmail.com', 'andad622@gmail.com'];
  if (envAdmins && envAdmins !== 'undefined') {
    allowedAdmins = [...allowedAdmins, ...envAdmins.split(',').map(e => e.trim().toLowerCase())];
  }
  return allowedAdmins;
}

// Lazily initialize Gemini SDK Client
// Lazily initialize Gemini SDK Client
let aiClient: GoogleGenerativeAI | null = null;
const API_KEY = process.env.GEMINI_API_KEY;

function getGeminiClient(): GoogleGenerativeAI {
  if (!aiClient) {
    if (!API_KEY) {
      console.warn("⚠️ Warning: GEMINI_API_KEY is missing. AI Features will fall back to local responses.");
    }
    aiClient = new GoogleGenerativeAI(API_KEY || 'MOCK_KEY');
  }
  return aiClient;
}

// SMTP SYSTEM EMAIL SENDER & AUDITING LOGGER
async function sendSystemEmail(to: string, subject: string, htmlContent: string, emailType: 'OTP' | 'Notification' | 'Campaign' = 'Notification') {
  const db = readDB();
  const smtp = getSmtpConfig(db);
  
  const logId = `em_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  const logEntry = {
    id: logId,
    recipient: to,
    subject,
    status: 'PENDING' as const,
    timestamp: new Date().toISOString(),
    type: emailType,
  };
  
  if (!db.email_logs) db.email_logs = [];
  db.email_logs.unshift(logEntry);
  writeDB(db);

  if (!smtp || !smtp.host || !smtp.username || !smtp.password) {
    const updatedDb = readDB();
    const l = updatedDb.email_logs.find(x => x.id === logId);
    if (l) {
      l.status = 'FAILED';
      l.error = 'Email service is currently unavailable.';
    }
    writeDB(updatedDb);
    return { success: false, error: 'Email service is currently unavailable.' };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: smtp.host,
      port: smtp.port || 465,
      secure: smtp.secure !== false,
      auth: {
        user: smtp.username,
        pass: smtp.password || ''
      },
      tls: {
        rejectUnauthorized: false
      },
      connectionTimeout: 5000,
      greetingTimeout: 5000,
      socketTimeout: 5000,
      family: 4 // Force IPv4 to prevent Vercel AWS Lambda IPv6 routing hangs
    } as any);

    // Wrap SMTP transport in a strict 4-second timeout to prevent Vercel 500 crash
    const sendPromise = transporter.verify().then(() => {
      return transporter.sendMail({
        from: `"${smtp.senderName || 'Admin'}" <${smtp.senderEmail || smtp.username}>`,
        to,
        subject,
        html: htmlContent
      });
    });
    
    // Prevent unhandled promise rejection if timeout wins the race
    sendPromise.catch(() => {});

    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('SMTP Connection Timed Out. Gmail may be blocking AWS Vercel IPs. Please use an App Password or switch to Resend/Brevo.')), 4000)
    );

    const info = await Promise.race([sendPromise, timeoutPromise]) as any;

    // Log the successful dispatch
    console.log(`✨ Email successfully sent to ${to}: MessageId: ${info.messageId}`);
    
    const updatedDb = readDB();
    const l = updatedDb.email_logs.find(x => x.id === logId);
    if (l) {
      l.status = 'DELIVERED';
      l.error = `Response: ${info.response || 'Success'}`;
    }
    writeDB(updatedDb);
    return { success: true, messageId: info.messageId };
  } catch (err: any) {
    console.error(`❌ SMTP execution error sending mail to ${to}:`, err);
    const updatedDb = readDB();
    const l = updatedDb.email_logs.find(x => x.id === logId);
    if (l) {
      l.status = 'FAILED';
      l.error = err.message || 'Connection timeout or transport block';
    }
    writeDB(updatedDb);
    return { success: false, error: err.message || 'SMTP Connection refused or authentication failed.' };
  }
}

const app = express();

// Real-time SSE alert stream listeners
let sseClients: any[] = [];

const emitNotification = (notification: any) => {
  sseClients.forEach(c => {
    try {
      c.res.write(`data: ${JSON.stringify(notification)}\n\n`);
    } catch (err) {
      // dead client
    }
  });
};

function defineRoutes() {
  const PORT = 3000;

  const createNotification = (db: any, title: string, message: string, type: 'Booking' | 'Inquiry' | 'New User' | 'Order' | 'Payment') => {
    if (!db.notifications) db.notifications = [];
    const notif = {
      id: `notif_${Date.now()}_${Math.floor(Math.random() * 1005)}`,
      title,
      message,
      type,
      status: 'unread' as const,
      soundAlertPlayed: false,
      createdAt: new Date().toISOString()
    };
    db.notifications.unshift(notif);
    emitNotification(notif);
    return notif;
  };

  // Global parse parsers
  app.use(express.json());

  // API Route: Live server checking
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', online: true });
  });

  // ==========================================================
  // DYNAMIC DATABASE-DRIVEN BOOKSTORE REST API
  // ==========================================================

  // 1. GET /api/books - Get all books dynamically from CMS database
  app.get('/api/books', (req, res) => {
    try {
      const db = readDB();
      res.json(db.books || []);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 2. GET /api/books/:slug - Get book by slug
  app.get('/api/books/:slug', (req, res) => {
    try {
      const db = readDB();
      const book = (db.books || []).find(b => b.slug === req.params.slug);
      if (book) {
        res.json(book);
      } else {
        res.status(404).json({ error: 'Sacred text not found' });
      }
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 3. GET /api/featured-books - Get featured dynamic books
  app.get('/api/featured-books', (req, res) => {
    try {
      const db = readDB();
      const featured = (db.books || []).filter(b => b.isFeatured);
      res.json(featured);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 4. GET /api/bestseller-books - Get bestselling dynamic books
  app.get('/api/bestseller-books', (req, res) => {
    try {
      const db = readDB();
      const bestseller = (db.books || []).filter(b => b.isBestseller);
      res.json(bestseller);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 5. POST /api/books - Create new book (CRUD)
  app.post('/api/books', (req, res) => {
    try {
      const db = readDB();
      const newBook = req.body;
      if (!newBook.id) newBook.id = `bo_${Date.now()}`;
      if (!newBook.slug) {
        newBook.slug = newBook.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
      }

      // Automatically sync categories if not already there
      if (newBook.category && !(db.book_categories || []).some(cat => cat.name.toLowerCase() === newBook.category.toLowerCase())) {
        if (!db.book_categories) db.book_categories = [];
        db.book_categories.push({
          id: `cat_${Date.now()}`,
          name: newBook.category,
          slug: newBook.category.toLowerCase().replace(/[^a-z0-9]+/g, '-')
        });
      }

      // Automatically seed images table
      if (newBook.coverImage) {
        if (!db.book_images) db.book_images = [];
        db.book_images.push({
          id: `img_${Date.now()}`,
          bookId: newBook.id,
          url: newBook.coverImage,
          altText: `${newBook.title} Cover`
        });
      }

      if (!db.books) db.books = [];
      db.books.push(newBook);
      writeDB(db);
      res.status(201).json(newBook);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 6. PUT /api/books/:id - Update book (CRUD)
  app.put('/api/books/:id', (req, res) => {
    try {
      const db = readDB();
      const idx = (db.books || []).findIndex(b => b.id === req.params.id);
      if (idx !== -1) {
        db.books[idx] = { ...db.books[idx], ...req.body };
        writeDB(db);
        res.json(db.books[idx]);
      } else {
        res.status(404).json({ error: 'Book key not found' });
      }
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 7. DELETE /api/books/:id - Delete book (CRUD)
  app.delete('/api/books/:id', (req, res) => {
    try {
      const db = readDB();
      db.books = (db.books || []).filter(b => b.id !== req.params.id);
      db.book_images = (db.book_images || []).filter(img => img.bookId !== req.params.id);
      writeDB(db);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 8. GET /api/coupons - List all dynamic coupons
  app.get('/api/coupons', (req, res) => {
    try {
      const db = readDB();
      res.json(db.coupons || []);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 9. POST /api/coupons - Create coupon (CRUD)
  app.post('/api/coupons', (req, res) => {
    try {
      const db = readDB();
      const coupon = req.body;
      if (!coupon.id) coupon.id = `cp_${Date.now()}`;
      if (!db.coupons) db.coupons = [];
      db.coupons.push(coupon);
      writeDB(db);
      res.json(coupon);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 10. PUT /api/coupons/:id - Update coupon (CRUD)
  app.put('/api/coupons/:id', (req, res) => {
    try {
      const db = readDB();
      const idx = (db.coupons || []).findIndex(c => c.id === req.params.id);
      if (idx !== -1) {
        db.coupons[idx] = { ...db.coupons[idx], ...req.body };
        writeDB(db);
        res.json(db.coupons[idx]);
      } else {
        res.status(404).json({ error: 'Coupon not found' });
      }
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 11. DELETE /api/coupons/:id - Delete coupon
  app.delete('/api/coupons/:id', (req, res) => {
    try {
      const db = readDB();
      db.coupons = (db.coupons || []).filter(c => c.id !== req.params.id);
      writeDB(db);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 12. GET /api/categories - List book categories
  app.get('/api/categories', (req, res) => {
    try {
      const db = readDB();
      res.json(db.book_categories || []);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 13. POST /api/categories - Create book category
  app.post('/api/categories', (req, res) => {
    try {
      const db = readDB();
      const cat = req.body;
      if (!cat.id) cat.id = `cat_${Date.now()}`;
      if (!db.book_categories) db.book_categories = [];
      db.book_categories.push(cat);
      writeDB(db);
      res.json(cat);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 14. GET /api/orders - Get all checkouts
  app.get('/api/orders', (req, res) => {
    try {
      const db = readDB();
      res.json(db.orders || []);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 15. POST /api/orders - Checkouts, decreases stock, Sync Customer index
  app.post('/api/orders', (req, res) => {
    try {
      const db = readDB();
      const order = req.body;
      if (!order.id) order.id = `ord_${Date.now()}`;
      if (!order.createdAt) order.createdAt = new Date().toISOString();

      // De-escalate book stocks
      if (order.items) {
        order.items.forEach((item: any) => {
          const book = (db.books || []).find(b => b.id === item.bookId);
          if (book) {
            book.stock = Math.max(0, book.stock - item.quantity);
            book.status = book.stock > 0 ? 'Available' : 'Out of Stock';
          }
        });
      }

      // Synchronize customers table
      if (order.customerEmail) {
        if (!db.customers) db.customers = [];
        const exists = db.customers.find(c => c.email.toLowerCase() === order.customerEmail.toLowerCase());
        if (!exists) {
          db.customers.push({
            id: `cust_${Date.now()}`,
            name: order.customerName,
            phone: order.customerPhone,
            email: order.customerEmail,
            address: order.customerAddress,
            createdAt: new Date().toISOString()
          });
        }
      }

      if (!db.orders) db.orders = [];
      db.orders.unshift(order);

      // Instantly generate system notification events and broadcast to active listening pipelines
      createNotification(db, "New Book Order Received", `A new purchase of ₹${order.total} was completed by ${order.customerName} (Invoice: ${order.invoiceNumber || 'N/A'}).`, "Order");
      createNotification(db, "Payment Received Successfully", `Processed payment of ₹${order.total} from ${order.customerName} for the astrological texts.`, "Payment");

      writeDB(db);
      res.json(order);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 16. PUT /api/orders/:id - Record shipment or tracking number
  app.put('/api/orders/:id', (req, res) => {
    try {
      const db = readDB();
      const idx = (db.orders || []).findIndex(o => o.id === req.params.id);
      if (idx !== -1) {
        db.orders[idx] = { ...db.orders[idx], ...req.body };
        writeDB(db);
        res.json(db.orders[idx]);
      } else {
        res.status(404).json({ error: 'Order key not found' });
      }
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 17. GET /api/inquiries - Get all manual book inquiries
  app.get('/api/inquiries', (req, res) => {
    try {
      const db = readDB();
      res.json(db.inquiries || []);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 18. POST /api/inquiries - Create dynamic inquiry
  app.post('/api/inquiries', (req, res) => {
    try {
      const db = readDB();
      const inq = req.body;
      if (!inq.id) inq.id = `inq_${Date.now()}`;
      if (!inq.createdAt) inq.createdAt = new Date().toISOString();
      if (!db.inquiries) db.inquiries = [];
      db.inquiries.unshift(inq);

      // Create interactive admin alert details
      createNotification(db, "New Inquiry Received", `Inquiry from ${inq.name || 'Anonymous'}: "${inq.message || 'No message contents'}"`, "Inquiry");

      // Also ensure it is registered in CRM leads if not present
      if (!db.leads) db.leads = [];
      const userExists = db.leads.find(l => l.email.toLowerCase() === (inq.email || '').toLowerCase());
      if (!userExists && inq.email) {
        db.leads.unshift({
          id: `ld_${Date.now()}`,
          name: inq.name || 'Inquiry User',
          email: inq.email,
          phone: inq.phone || '',
          city: '',
          message: inq.message || '',
          source: 'Inquiry',
          createdAt: new Date().toISOString(),
          followUpStatus: 'New',
          notes: 'Auto-synchronized from manual customer inquiry form'
        });
      }

      writeDB(db);
      res.json(inq);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 19. GET /api/wishlist/:customerEmail - Get user wishlist
  app.get('/api/wishlist/:customerEmail', (req, res) => {
    try {
      const db = readDB();
      const items = (db.wishlist || []).filter(w => w.customerEmail.toLowerCase() === req.params.customerEmail.toLowerCase());
      res.json(items);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 20. POST /api/wishlist - Toggle dynamic customer wishlist
  app.post('/api/wishlist', (req, res) => {
    try {
      const db = readDB();
      const { customerEmail, bookId } = req.body;
      if (!customerEmail || !bookId) {
        return res.status(400).json({ error: 'Missing customerEmail or bookId parameters' });
      }

      if (!db.wishlist) db.wishlist = [];
      const exactIdx = db.wishlist.findIndex(
        w => w.customerEmail.toLowerCase() === customerEmail.toLowerCase() && w.bookId === bookId
      );

      if (exactIdx !== -1) {
        db.wishlist.splice(exactIdx, 1);
        writeDB(db);
        res.json({ action: 'removed', bookId });
      } else {
        const item = {
          id: `wl_${Date.now()}`,
          customerEmail,
          bookId,
          createdAt: new Date().toISOString()
        };
        db.wishlist.push(item);
        writeDB(db);
        res.json({ action: 'added', item });
      }
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 21. GET /api/customers - Get list of customers
  app.get('/api/customers', (req, res) => {
    try {
      const db = readDB();
      res.json(db.customers || []);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 22. POST /api/sync-books - Bulk save books, coupons & optional orders
  app.post('/api/sync-books', (req, res) => {
    try {
      const db = readDB();
      const { books, coupons, orders } = req.body;
      if (books) db.books = books;
      if (coupons) db.coupons = coupons;
      if (orders) db.orders = orders;
      writeDB(db);
      res.json({ success: true, booksCount: (db.books || []).length });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // ==========================================================
  // SMTP CONFIGURATION ENDPOINTS
  // ==========================================================

  app.get('/api/admin/smtp', (req, res) => {
    try {
      const db = readDB();
      res.json(getSmtpConfig(db) || {
        host: '',
        port: 587,
        secure: false,
        username: 'kanika9694@gmail.com',
        senderEmail: 'kanika9694@gmail.com',
        senderName: 'Acharya TN Khurana Astrologer',
        serviceType: 'Gmail'
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/admin/smtp', async (req, res) => {
    try {
      const db = readDB();
      const config = req.body;
      
      // Temporary override db.smtp to do a real connection test before writing it persistently
      const originalSMTP = db.smtp;
      db.smtp = config;
      
      const html = `
        <div style="font-family: sans-serif; padding: 24px; background: #0a0e18; color: #ffffff; border-radius: 16px; border: 1px solid #C9A227;">
          <h2 style="color: #f5d98a; font-family: serif;">Acharya TN Khurana Council</h2>
          <p style="font-size: 14px; line-height: 1.5; color: #8b96aa;">Your dynamic SMTP connection is now Live and configured!</p>
          <div style="margin: 16px 0; padding: 12px; background: rgba(255,255,255,0.05); border-radius: 8px;">
            <strong>Host:</strong> ${config.host}<br/>
            <strong>Port:</strong> ${config.port}<br/>
            <strong>Username:</strong> ${config.username}<br/>
            <strong>Service Class:</strong> ${config.serviceType}
          </div>
          <p style="font-size: 11px; color: #596478;">Generated automatically on Astro CMS server update.</p>
        </div>
      `;
      
      const testResult = await sendSystemEmail(
        config.senderEmail || config.username || 'kanika9694@gmail.com',
        '🔔 Acharya Khurana SMTP Connection test successful!',
        html,
        'Notification'
      );

      if (!testResult.success) {
        // Rollback configuration since registration test failed
        db.smtp = originalSMTP;
        writeDB(db);
        return res.status(400).json({ error: `Connection diagnostic failed: ${testResult.error || 'Nodemailer connection timeout or bad credentials.'}` });
      }

      // If configuration tests successfully, commit it
      writeDB(db);
      res.json({ success: true, testResult });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/admin/smtp/test-manual', async (req, res) => {
    try {
      const db = readDB();
      const { recipient, host, port, secure, username, password, senderEmail, senderName } = req.body;
      if (!recipient) {
       return res.status(400).json({ error: 'Please enter a target recipient email address.' });
      }

      const smtp = host ? { host, port, secure, username, password, senderEmail, senderName } : getSmtpConfig(db);

      if (!smtp || !smtp.host || !smtp.username || !smtp.password) {
        return res.status(400).json({ error: 'SMTP configurations are incomplete or not provided.' });
      }

      const transporter = nodemailer.createTransport({
        host: smtp.host,
        port: smtp.port || 465,
        secure: smtp.secure !== false,
        auth: {
          user: smtp.username,
          pass: smtp.password || ''
        },
        tls: {
          rejectUnauthorized: false
        },
        connectionTimeout: 5000,
        greetingTimeout: 5000,
        socketTimeout: 5000,
        family: 4
      } as any);

      // Verify connection before dispatching test mail
      await transporter.verify();

      const html = `
        <div style="font-family: sans-serif; padding: 24px; background: #0a0e18; color: #ffffff; border-radius: 16px; border: 1px solid #C9A227; max-width: 500px; margin: 0 auto;">
          <h2 style="color: #f5d98a; font-family: serif; margin-bottom: 4px;">Manual SMTP Diagnostics</h2>
          <p style="font-size: 12px; color: #8b96aa; margin-top: 0;">Automated Mailer Validation Test</p>
          <div style="height: 1px; background: rgba(255,255,255,0.1); margin: 16px 0;"></div>
          <p style="font-size: 14px; line-height: 1.5; color: #ccd0db;">This test validates that your SMTP credentials configured on Astro CMS can reach general public mailboxes successfully.</p>
          <div style="margin: 24px 0; padding:16px; background: rgba(251, 191, 36, 0.05); border: 1px dashed #C9A227; border-radius: 12px;">
            <strong style="color: #f5d98a;">Test Target:</strong> ${recipient}<br/>
            <strong style="color: #f5d98a;">Active Server:</strong> ${smtp.host}:${smtp.port}<br/>
            <strong style="color: #f5d98a;">Sender Identity:</strong> ${smtp.senderName || 'Astrologer office'} &lt;${smtp.senderEmail || smtp.username}&gt;<br/>
            <strong style="color: #f5d98a;">Timestamp:</strong> ${new Date().toLocaleString()}
          </div>
          <p style="font-size: 11px; color: #8b96aa; line-height: 1.4;">Vedic Astrology CMS Automated System Diagnostics.</p>
        </div>
      `;

      try {
        const info = await transporter.sendMail({
          from: `"${smtp.senderName || 'Astrologer Acharya Khurana'}" <${smtp.senderEmail || smtp.username}>`,
          to: recipient,
          subject: '🧪 Astro CMS Manual SMTP Connection Test Successful!',
          html
        });

        // Add email log entry as well for diagnostic records!
        const logId = `eml_test_${Date.now()}`;
        if (!db.email_logs) db.email_logs = [];
        db.email_logs.unshift({
          id: logId,
          recipient,
          subject: '🧪 Astro CMS Manual SMTP Connection Test Successful!',
          status: 'DELIVERED',
          timestamp: new Date().toISOString(),
          type: 'Notification',
          error: `Response: ${info.response || 'Success'}`
        });
        writeDB(db);

        res.json({ success: true, messageId: info.messageId });
      } catch (sendErr: any) {
        // Log failed entry
        const logId = `eml_test_${Date.now()}`;
        if (!db.email_logs) db.email_logs = [];
        db.email_logs.unshift({
          id: logId,
          recipient,
          subject: '🧪 Astro CMS Manual SMTP Connection Test Failed!',
          status: 'FAILED',
          timestamp: new Date().toISOString(),
          type: 'Notification',
          error: sendErr.message || 'SMTP delivery rejected by host'
        });
        writeDB(db);

        throw sendErr;
      }
    } catch (err: any) {
      res.status(400).json({ error: `SMTP Manual test delivery failed: ${err.message}` });
    }
  });

  app.get('/api/admin/smtp/status', async (req, res) => {
    try {
      const db = readDB();
      const smtp = getSmtpConfig(db);
      if (!smtp || !smtp.host || !smtp.username || !smtp.password) {
        return res.json({ status: 'Disconnected', error: 'SMTP settings are not configured.' });
      }

      const transporter = nodemailer.createTransport({
        host: smtp.host,
        port: smtp.port || 465,
        secure: smtp.secure !== false,
        auth: {
          user: smtp.username,
          pass: smtp.password || ''
        },
        tls: {
          rejectUnauthorized: false
        },
        connectionTimeout: 5000,
        greetingTimeout: 5000,
        socketTimeout: 5000,
        family: 4
      } as any);

      await transporter.verify();
      res.json({ status: 'Connected' });
    } catch (err: any) {
      res.json({ status: 'Disconnected', error: err.message || 'Verification failed.' });
    }
  });

  app.post('/api/admin/smtp/test-connection', async (req, res) => {
    try {
      const { host, port, secure, username, password } = req.body;
      if (!host || !username) {
        return res.status(400).json({ error: 'SMTP Connection Host and Username fields are required.' });
      }

      const transporter = nodemailer.createTransport({
        host,
        port: port || 465,
        secure: secure !== false,
        auth: {
          user: username,
          pass: password || ''
        },
        tls: {
          rejectUnauthorized: false
        },
        connectionTimeout: 5000,
        greetingTimeout: 5000,
        socketTimeout: 5000,
        family: 4
      } as any);

      await transporter.verify();
      res.json({ success: true, message: 'SMTP handshake completed successfully. Connection established!' });
    } catch (err: any) {
      res.status(400).json({ error: `SMTP handshake failed: ${err.message || 'Verification timed out.'}` });
    }
  });

  // ==========================================================
  // USER ACCOUNT AUTHENTICATION SYSTEM
  // ==========================================================

  // Generate 6 digit pin
  const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

  app.post('/api/auth/register', async (req, res) => {
    try {
      const db = readDB();
      const { name, email, phone, city, address, password } = req.body;

      if (!name || !email) {
        return res.status(400).json({ error: 'Name and email address are strictly required.' });
      }

      if (!db.users) db.users = [];

      const exists = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (exists) {
        return res.status(400).json({ error: 'An account is already registered with this email address.' });
      }

      const otp = generateOTP();
      const expiry = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 min validity

      const newUser = {
        id: `usr_${Date.now()}`,
        name,
        email,
        phone: phone || '',
        city: city || '',
        address: address || '',
        password: password || '', // optional password fallback
        registeredDate: new Date().toISOString(),
        lastLoginDate: undefined,
        loginCount: 0,
        otp,
        otpExpires: expiry,
        verified: false // Set unverified until OTP validated
      };

      // Send OTP Mail first and verify delivery
      const htmlContent = `
        <div style="font-family: sans-serif; padding: 24px; background: #0a0e18; color: #ffffff; border-radius: 16px; border: 1px solid #C9A227; max-width: 500px;">
          <h2 style="color: #f5d98a; font-family: serif; margin-bottom: 4px;">Welcome Seeker, ${name}!</h2>
          <p style="font-size: 12px; color: #8b96aa; margin-top: 0;">Email Verification Required for Client Seeker Access</p>
          <div style="height: 1px; background: rgba(255,255,255,0.1); margin: 16px 0;"></div>
          <p style="font-size: 14px; line-height: 1.5; color: #ccd0db;">Please use the following single-use authorization code to securely complete your registration setup:</p>
          <div style="margin: 24px 0; padding:16px; text-align: center; background: rgba(251, 191, 36, 0.05); border: 1px dashed #C9A227; border-radius: 12px;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #f5d98a; font-family: monospace;">${otp}</span>
          </div>
          <p style="font-size: 11px; color: #ff6b6b; font-weight: bold;">⚠️ This verification code is single-use and expires in 10 minutes.</p>
          <p style="font-size: 12px; color: #8b96aa; line-height: 1.4;">If you did not issue this, please disregard. For astrological consultations, reach us at any time.</p>
        </div>
      `;

      const mailRes = await sendSystemEmail(email, '🔑 Verify Your Client Email On Portal', htmlContent, 'OTP');
      if (!mailRes.success) {
        return res.status(400).json({ error: mailRes.error });
      }

      // Now that mail is verified as delivered, commit user creation to DB!
      db.users.push(newUser);

      // Create an activity log
      if (!db.activity_logs) db.activity_logs = [];
      db.activity_logs.unshift({
        id: `act_${Date.now()}`,
        email,
        action: 'REGISTER_PENDING',
        details: `Requested initial registration verification. OTP sent successfully.`,
        timestamp: new Date().toISOString()
      });

      // Also auto create as a subscriber if not already
      if (!db.subscribers) db.subscribers = [];
      if (!db.subscribers.some(s => s.email.toLowerCase() === email.toLowerCase())) {
        db.subscribers.push({
          id: `sub_${Date.now()}`,
          email,
          subscribedAt: new Date().toISOString(),
          active: true
        });
      }

      // Add as CRM Lead
      if (!db.leads) db.leads = [];
      db.leads.unshift({
        id: `ld_${Date.now()}`,
        name,
        email,
        phone: phone || '',
        city: city || '',
        message: 'A registered user who initiated verification.',
        source: 'Contact',
        createdAt: new Date().toISOString(),
        followUpStatus: 'New',
        notes: 'User self-registered on the portal.'
      });

      // Generate real-time system notification about registration
      createNotification(db, "New Seeker Registered", `${name} from ${city || 'India'} has created an account on the platform.`, "New User");

      writeDB(db);

      // Send admin alert about new user signup to admin
      const adminHtml = `
        <div style="font-family: sans-serif; padding: 20px; border-radius: 12px; background: #fff; color: #111;">
          <h2>🔔 ASTRO CMS Alert: New Account Sign Up</h2>
          <p>A new user has initiated the registration flow on your portal:</p>
          <ul>
            <li><strong>Name:</strong> ${name}</li>
            <li><strong>Email:</strong> ${email}</li>
            <li><strong>Phone:</strong> ${phone || 'N/A'}</li>
            <li><strong>City:</strong> ${city || 'unspecified'}</li>
          </ul>
          <p>Manage and follow up directly from your CMS CRM.</p>
        </div>
      `;
      // Send notification email to Admin email
      await sendSystemEmail(getSmtpConfig(db)?.senderEmail || 'kanika9694@gmail.com', '🧪 CMS ALERT: New Portal Registrant', adminHtml, 'Notification');

      res.json({ success: true, msg: 'Verification OTP has been sent successfully to your email.' });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/auth/admin-login-request', async (req, res) => {
    try {
      const db = readDB();
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ error: 'Please enter a valid administrator email.' });
      }

      const allowedAdmins = getAllowedAdmins();
      if (!allowedAdmins.includes(email.toLowerCase())) {
        return res.status(403).json({ error: 'Unauthorized: Only registered Super Admins can access this portal.' });
      }

      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiry = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 min validity

      db.admin_otp = {
        otp,
        email: email.toLowerCase(),
        otpExpires: expiry
      };
      writeDB(db);

      const htmlContent = `
        <div style="font-family: sans-serif; padding: 24px; background: #0a0e18; color: #ffffff; border-radius: 16px; border: 1px solid #C9A227; max-width: 500px;">
          <h2 style="color: #f5d98a; font-family: serif; margin-bottom: 4px;">Astro CMS SECURE PORTAL</h2>
          <p style="font-size: 12px; color: #8b96aa; margin-top: 0;">Authorized Administrative Login Verification</p>
          <div style="height: 1px; background: rgba(255,255,255,0.1); margin: 16px 0;"></div>
          <p style="font-size: 14px; line-height: 1.5; color: #ccd0db;">Please use the following 6-digit OTP code to verify your session and access the Enterprise CMS Administrator Panel:</p>
          <div style="margin: 24px 0; padding:16px; text-align: center; background: rgba(251, 191, 36, 0.05); border: 1px dashed #C9A227; border-radius: 12px;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #f5d98a; font-family: monospace;">${otp}</span>
          </div>
          <p style="font-size: 11px; color: #ff6b6b; font-weight: bold;">⚠️ Valid for 10 minutes. Do not share this authentication code.</p>
          <p style="font-size: 12px; color: #8b96aa; line-height: 1.4;">Vedic Astrology CMS Automated System Security.</p>
        </div>
      `;

      // Dispatch real email
      const mailRes = await sendSystemEmail(email, '🔑 Astro CMS Secure Admin OTP Code', htmlContent, 'OTP');

      if (!mailRes.success) {
        return res.status(400).json({ error: mailRes.error });
      }

      res.json({
        success: true,
        emailSent: true,
        msg: 'A secure authentication code has been successfully dispatched to your mailbox.'
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/auth/admin-login-verify', (req, res) => {
    try {
      const db = readDB();
      const { email } = req.body;
      const otp = req.body.otp || req.body.code;

      if (!email || !otp) {
        return res.status(400).json({ error: 'Email and verification code are strictly required.' });
      }

      const allowedAdmins = getAllowedAdmins();
      if (!allowedAdmins.includes(email.toLowerCase())) {
        return res.status(403).json({ error: 'Unauthorized: Only registered Super Admins can access this portal.' });
      }

      const adminOtpObj = db.admin_otp;
      
      const isValid = adminOtpObj && 
                      adminOtpObj.email.toLowerCase() === email.toLowerCase() && 
                      adminOtpObj.otp === otp && 
                      new Date(adminOtpObj.otpExpires || '').getTime() > Date.now();

      if (!isValid) {
        return res.status(400).json({ error: 'Incorrect OTP code. Please enter the valid 6-digit code.' });
      }

      // Consume OTP
      if (db.admin_otp) {
        delete db.admin_otp;
      }

      // Log successful login
      if (!db.activity_logs) db.activity_logs = [];
      db.activity_logs.unshift({
        id: `act_${Date.now()}`,
        email,
        action: 'SUPER_ADMIN_LOGIN',
        details: 'Admin panel authenticated and locked session initiated successfully.',
        timestamp: new Date().toISOString()
      });

      writeDB(db);

      res.json({ success: true, adminEmail: email });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/auth/login-request', async (req, res) => {
    try {
      const db = readDB();
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ error: 'Please enter a registered email address.' });
      }

      if (!db.users) db.users = [];
      const userIndex = db.users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());

      // If user doesn't exist, we can register them passwordlessly
      let user = db.users[userIndex];
      let isNew = false;
      const otp = generateOTP();
      const expiry = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 min expiry

      if (!user) {
        isNew = true;
        user = {
          id: `usr_${Date.now()}`,
          name: email.split('@')[0],
          email,
          phone: '',
          city: '',
          registeredDate: new Date().toISOString(),
          loginCount: 0,
          otp,
          otpExpires: expiry,
          verified: false
        };
      } else {
        user.otp = otp;
        user.otpExpires = expiry;
      }

      // Send OTP Mail
      const htmlContent = `
        <div style="font-family: sans-serif; padding: 24px; background: #0a0e18; color: #ffffff; border-radius: 16px; border: 1px solid #C9A227; max-width: 500px;">
          <h2 style="color: #f5d98a; font-family: serif; margin-bottom: 4px;">Hello Seeker,</h2>
          <p style="font-size: 12px; color: #8b96aa; margin-top: 0;">Secured Authentication Verification</p>
          <div style="height: 1px; background: rgba(255,255,255,0.1); margin: 16px 0;"></div>
          <p style="font-size: 14px; line-height: 1.5; color: #ccd0db;">Use this OTP password to verify your account and safely log inside the Client Portal:</p>
          <div style="margin: 24px 0; padding:16px; text-align: center; background: rgba(251, 191, 36, 0.05); border: 1px dashed #C9A227; border-radius: 12px;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #f5d98a; font-family: monospace;">${otp}</span>
          </div>
          <p style="font-size: 11px; color: #ff6b6b; font-weight: bold;">⚠️ Valid for 10 minutes. Do not share this code.</p>
        </div>
      `;

      const mailRes = await sendSystemEmail(email, '🔑 Access Verification OTP Code', htmlContent, 'OTP');

      if (!mailRes.success) {
        return res.status(400).json({ error: mailRes.error });
      }

      // If email succeeded, save state
      if (isNew) {
        db.users.push(user);
      }

      // activity log
      if (!db.activity_logs) db.activity_logs = [];
      db.activity_logs.unshift({
        id: `act_${Date.now()}`,
        email,
        action: 'OTP_REQUEST',
        details: `Requested a login verification passcode. Sent successfully.`,
        timestamp: new Date().toISOString()
      });

      writeDB(db);

      res.json({ success: true, isNew, msg: 'OTP has been sent to your email.' });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/auth/login-verify', (req, res) => {
    try {
      const db = readDB();
      const { email } = req.body;
      const otp = req.body.otp || req.body.code; // support both otp and code keys seamlessly

      if (!email || !otp) {
        return res.status(400).json({ error: 'Email and OTP code are strictly required.' });
      }

      const userIdx = (db.users || []).findIndex(u => u.email.toLowerCase() === email.toLowerCase());
      if (userIdx === -1) {
        return res.status(404).json({ error: 'Acquirer account not found.' });
      }

      const user = db.users[userIdx];
      const isOTPValid = user.otp === otp && new Date(user.otpExpires || '').getTime() > Date.now();

      if (!isOTPValid) {
        return res.status(400).json({ error: 'Incorrect or expired OTP code.' });
      }

      // Update login statistics
      user.verified = true;
      user.lastLoginDate = new Date().toISOString();
      user.loginCount = (user.loginCount || 0) + 1;
      user.otp = undefined; // consume OTP
      user.otpExpires = undefined;

      if (!db.activity_logs) db.activity_logs = [];
      db.activity_logs.unshift({
        id: `act_${Date.now()}`,
        email,
        action: 'LOGIN_SUCCESS',
        details: 'Secured login completed via Email OTP validation.',
        timestamp: new Date().toISOString()
      });

      writeDB(db);

      res.json({ success: true, user });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/auth/login-password', (req, res) => {
    try {
      const db = readDB();
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email and Password credentials are required.' });
      }

      const user = (db.users || []).find(u => u.email.toLowerCase() === email.toLowerCase());
      if (!user) {
        return res.status(404).json({ error: 'No seeker registered with this email address.' });
      }

      if (user.password !== password) {
        return res.status(400).json({ error: 'Invalid password. Please check credentials or request OTP login.' });
      }

      if (user.verified === false) {
        return res.status(403).json({ error: 'Email address has not been verified yet. Please complete OTP verification first.' });
      }

      user.lastLoginDate = new Date().toISOString();
      user.loginCount = (user.loginCount || 0) + 1;

      if (!db.activity_logs) db.activity_logs = [];
      db.activity_logs.unshift({
        id: `act_${Date.now()}`,
        email,
        action: 'LOGIN_SUCCESS',
        details: 'Login authenticated via password verification.',
        timestamp: new Date().toISOString()
      });

      writeDB(db);

      res.json({ success: true, user });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/auth/resend-otp', async (req, res) => {
    try {
      const db = readDB();
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ error: 'Email parameter has expired or is blank.' });
      }

      const user = (db.users || []).find(u => u.email.toLowerCase() === email.toLowerCase());
      if (!user) {
        return res.status(404).json({ error: 'Acquirer credentials mismatch.' });
      }

      const otp = generateOTP();
      const expiry = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 min validity

      const htmlContent = `
        <div style="font-family: sans-serif; padding: 24px; background: #0a0e18; color: #ffffff; border-radius: 16px; border: 1px solid #C9A227; max-width: 500px;">
          <h2 style="color: #f5d98a; font-family: serif; margin-bottom: 4px;">Resent Verification Passcode</h2>
          <div style="height: 1px; background: rgba(255,255,255,0.1); margin: 16px 0;"></div>
          <p style="font-size: 14px; line-height: 1.5; color: #ccd0db;">Please find your re-generated portal access OTP code as requested:</p>
          <div style="margin: 24px 0; padding:16px; text-align: center; background: rgba(251, 191, 36, 0.05); border: 1px dashed #C9A227; border-radius: 12px;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #f5d98a; font-family: monospace;">${otp}</span>
          </div>
          <p style="font-size: 11px; color: #ff6b6b;">⚠️ Expires in 10 minutes.</p>
        </div>
      `;

      const mailRes = await sendSystemEmail(email, '🔑 Resent Portal Authentication Passcode', htmlContent, 'OTP');
      if (!mailRes.success) {
        return res.status(400).json({ error: mailRes.error });
      }

      // successfully sent, now persist OTP modification to db
      user.otp = otp;
      user.otpExpires = expiry;

      if (!db.activity_logs) db.activity_logs = [];
      db.activity_logs.unshift({
        id: `act_${Date.now()}`,
        email,
        action: 'OTP_RESENT',
        details: 'Re-generated and dispatched verification access OTP code.',
        timestamp: new Date().toISOString()
      });

      writeDB(db);

      res.json({ success: true, msg: 'A fresh OTP code has been successfully dispatched.' });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/auth/forgot-password', async (req, res) => {
    try {
      const db = readDB();
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ error: 'Please enter your registered email address.' });
      }

      const user = (db.users || []).find(u => u.email.toLowerCase() === email.toLowerCase());
      if (!user) {
        return res.status(404).json({ error: 'No seeker found with this email.' });
      }

      const otp = generateOTP();
      const expiry = new Date(Date.now() + 10 * 60 * 1000).toISOString();

      const html = `
        <div style="font-family: sans-serif; padding: 24px; background: #0a0e18; color: #ffffff; border-radius: 16px; border: 1px solid #C9A227;">
          <h2 style="color: #f5d98a;">Spiritual Portal Password Reset</h2>
          <p>You requested a password reset. Verify using the code below:</p>
          <div style="margin: 20px 0; text-align:center; padding:12px; border:1px solid #C9A227; border-radius:8px;">
            <span style="font-size: 28px; font-weight:bold; letter-spacing:5px; color:#f5d98a;">${otp}</span>
          </div>
          <p style="color: #ff6b6b; font-weight: bold;">This code is valid for 10 minutes only.</p>
        </div>
      `;

      const mailRes = await sendSystemEmail(email, '🔑 Seeker Password Recovery Code', html, 'OTP');
      if (!mailRes.success) {
        return res.status(400).json({ error: mailRes.error });
      }

      user.otp = otp;
      user.otpExpires = expiry;
      writeDB(db);

      res.json({ success: true, msg: 'Password reset code has been successfully sent to email.' });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/auth/reset-password', (req, res) => {
    try {
      const db = readDB();
      const { email, password } = req.body;
      const otp = req.body.otp || req.body.code; // support both otp and code keys seamlessly

      if (!email || !otp || !password) {
        return res.status(400).json({ error: 'All fields are strictly required.' });
      }

      const user = (db.users || []).find(u => u.email.toLowerCase() === email.toLowerCase());
      if (!user) {
        return res.status(404).json({ error: 'Account registry mismatch.' });
      }

      const isOTPValid = user.otp === otp && new Date(user.otpExpires || '').getTime() > Date.now();

      if (!isOTPValid) {
        return res.status(400).json({ error: 'Invalid or expired recovery code.' });
      }

      user.password = password;
      user.otp = undefined;
      user.otpExpires = undefined;

      if (!db.activity_logs) db.activity_logs = [];
      db.activity_logs.unshift({
        id: `act_${Date.now()}`,
        email,
        action: 'PASSWORD_RESET',
        details: 'Self-updated account login password successfully.',
        timestamp: new Date().toISOString()
      });

      writeDB(db);
      res.json({ success: true, msg: 'Password has been updated. Please sign in.' });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // ==========================================================
  // PROFILE UPDATE & VIEW TRACKING ENDPOINTS
  // ==========================================================

  app.get('/api/user/profile', (req, res) => {
    try {
      const db = readDB();
      const { email } = req.query;
      if (!email) return res.status(400).json({ error: 'Email parameter input required' });

      const user = (db.users || []).find(u => u.email.toLowerCase() === (email as string).toLowerCase());
      if (!user) return res.status(404).json({ error: 'User profiles matching criteria blank' });

      res.json(user);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.put('/api/user/profile', (req, res) => {
    try {
      const db = readDB();
      const { email, name, phone, city, address, password } = req.body;

      if (!email) return res.status(400).json({ error: 'Email parameter mandatory' });

      const userIdx = (db.users || []).findIndex(u => u.email.toLowerCase() === email.toLowerCase());
      if (userIdx === -1) {
        return res.status(404).json({ error: 'Seeker record not found' });
      }

      db.users[userIdx] = {
        ...db.users[userIdx],
        name: name || db.users[userIdx].name,
        phone: phone || db.users[userIdx].phone,
        city: city || db.users[userIdx].city,
        address: address || db.users[userIdx].address,
        password: password !== undefined ? password : db.users[userIdx].password
      };

      writeDB(db);
      res.json({ success: true, user: db.users[userIdx] });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post('/api/user/track-view', (req, res) => {
    try {
      const db = readDB();
      const { type, targetId, email } = req.body;

      if (!db.views_logs) db.views_logs = [];
      db.views_logs.push({
        id: `vw_${Date.now()}`,
        type,
        targetId,
        email,
        timestamp: new Date().toISOString()
      });

      writeDB(db);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // ==========================================
  // SOCIAL MEDIA LINKS API
  // ==========================================
  app.get('/api/settings/social', (req, res) => {
    try {
      const db = readDB();
      res.json(db.social_media || {});
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch social links' });
    }
  });

  app.post('/api/settings/social', (req, res) => {
    try {
      const db = readDB();
      const newLinks = req.body;
      db.social_media = {
        ...db.social_media,
        ...newLinks
      };
      writeDB(db);
      res.json({ success: true, social_media: db.social_media });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update social links' });
    }
  });

  // ==========================================================
  // LEAD GENERATION & CRM SYSTEM ENDPOINTS
  // ==========================================================

  app.get('/api/crm/leads', (req, res) => {
    try {
      const db = readDB();
      res.json(db.leads || []);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/api/crm/users', (req, res) => {
    try {
      const db = readDB();
      res.json(db.users || []);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/api/crm/subscribers', (req, res) => {
    try {
      const db = readDB();
      res.json(db.subscribers || []);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/crm/leads', async (req, res) => {
    try {
      const db = readDB();
      const leadData = req.body;

      if (!leadData.name || !leadData.phone || !leadData.email) {
        return res.status(400).json({ error: 'Name, phone, and email are strictly required for leads.' });
      }

      if (!db.leads) db.leads = [];

      const newLead = {
        id: `ld_${Date.now()}`,
        name: leadData.name,
        email: leadData.email,
        phone: leadData.phone,
        city: leadData.city || '',
        message: leadData.message || 'No remarks provided.',
        source: leadData.source || 'Contact',
        service: leadData.service,
        bookId: leadData.bookId,
        createdAt: new Date().toISOString(),
        followUpStatus: 'New' as const,
        notes: leadData.notes || ''
      };

      db.leads.unshift(newLead);

      // Create an activity log
      if (!db.activity_logs) db.activity_logs = [];
      db.activity_logs.unshift({
        id: `act_${Date.now()}`,
        email: leadData.email,
        action: 'NEW_LEAD',
        details: `Dispatched fresh inquiry in CRM. Source: ${newLead.source}`,
        timestamp: new Date().toISOString()
      });

      // Maintain database size
      writeDB(db);

      // Notify ADMIN via SMTP
      const adminMailHtml = `
        <div style="font-family: sans-serif; padding: 24px; background: #0a0e18; color: #ffffff; border-radius: 16px; border: 1px solid #C9A227; max-width: 600px;">
          <h2 style="color: #f5d98a; font-family: serif; margin-bottom: 4px;">🚨 New Lead Alert!</h2>
          <p style="font-size: 13px; color: #8b96aa; margin-top: 0;">Captured automatically on dynamic CRM listener</p>
          <div style="h-px; background: rgba(255,255,255,0.1); margin: 16px 0;"></div>
          <table style="width: 100%; border-collapse: collapse; font-size: 13px; color: #ccd0db;">
            <tr><td style="padding: 6px 0; font-weight: bold; width: 120px;">Source:</td><td style="color: #f5d98a; font-weight: bold;">${newLead.source}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold;">Full Name:</td><td>${newLead.name}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold;">Email Address:</td><td>${newLead.email}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold;">Phone Number:</td><td>${newLead.phone}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold;">City Location:</td><td>${newLead.city || 'unspecified'}</td></tr>
            ${newLead.service ? `<tr><td style="padding: 6px 0; font-weight: bold;">Service Interrogated:</td><td>${newLead.service}</td></tr>` : ''}
            ${newLead.bookId ? `<tr><td style="padding: 6px 0; font-weight: bold;">Book Target ID:</td><td>${newLead.bookId}</td></tr>` : ''}
            <tr><td style="padding: 6px 0; font-weight: bold; vertical-align: top;">Remarks/Message:</td><td style="background: rgba(255,255,255,0.03); padding: 8px; border-radius: 6px;">${newLead.message}</td></tr>
          </table>
          <p style="margin-top: 20px; font-size: 12px; text-align: center;"><a href="${req.headers.origin || 'https://acharyakhurana.com'}/admin" style="background:#C9A227; color:#1a1000; text-decoration:none; padding: 10px 18px; border-radius:8px; font-weight:bold;">Open CMS CRM Panel</a></p>
        </div>
      `;

      await sendSystemEmail(
        getSmtpConfig(db)?.senderEmail || 'kanika9694@gmail.com',
        `🧪 Astro CMS: New Lead Alert [${newLead.source}] - ${newLead.name}`,
        adminMailHtml,
        'Notification'
      );

      res.json({ success: true, leadId: newLead.id });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put('/api/crm/leads/:id', (req, res) => {
    try {
      const db = readDB();
      const { followUpStatus, notes } = req.body;

      if (!db.leads) db.leads = [];
      const leadIdx = db.leads.findIndex(l => l.id === req.params.id);

      if (leadIdx === -1) {
        return res.status(404).json({ error: 'Lead registry key mismatch.' });
      }

      db.leads[leadIdx] = {
        ...db.leads[leadIdx],
        followUpStatus: followUpStatus || db.leads[leadIdx].followUpStatus,
        notes: notes !== undefined ? notes : db.leads[leadIdx].notes
      };

      writeDB(db);
      res.json({ success: true, lead: db.leads[leadIdx] });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // ==========================================================
  // BULK EMAIL CAMPAIGNS & NEWSLETTER MARKETING SPECIALTY
  // ==========================================================

  app.post('/api/crm/newsletter/subscribe', async (req, res) => {
    try {
      const db = readDB();
      const { email } = req.body;

      if (!email) return res.status(400).json({ error: 'Please enter a valid email address.' });

      if (!db.subscribers) db.subscribers = [];
      const subscriberExists = db.subscribers.some(s => s.email.toLowerCase() === email.toLowerCase());

      if (subscriberExists) {
        return res.status(400).json({ error: 'You are already subscribed to the Acharya Khurana newsletter.' });
      }

      const newSub = {
        id: `sub_${Date.now()}`,
        email,
        subscribedAt: new Date().toISOString(),
        active: true
      };

      db.subscribers.push(newSub);

      // Create Lead record automatically for CRM
      if (!db.leads) db.leads = [];
      db.leads.unshift({
        id: `sub_ld_${Date.now()}`,
        name: email.split('@')[0],
        email,
        phone: 'unspecified',
        message: 'Newsletter sign up captured.',
        source: 'Contact',
        createdAt: new Date().toISOString(),
        followUpStatus: 'New',
        notes: 'Signed up directly to digital newsletters.'
      });

      writeDB(db);

      // Welcome Confirmation Mailer
      const html = `
        <div style="font-family: sans-serif; padding: 24px; background: #0a0e18; color: #ffffff; border-radius: 16px; border: 1px solid #C9A227; max-width: 500px;">
          <h2 style="color: #f5d98a; font-family: serif;">Acharya TN Khurana Newsletter Council</h2>
          <p>Thank you for subscribing to our planetary transits, auspicious Muhurats, and protective Vastu tips alerts!</p>
          <p style="font-size:13px; color:#8b96aa;">You will receive weekly astrological digests and remedies authored directly by Acharya Khurana.</p>
          <div style="height:1px; background:rgba(255,255,255,0.1); margin: 16px 0;"></div>
          <p style="font-size:11px; color:#596478;">You can unsubscribe at any time from this portal.</p>
        </div>
      `;
      await sendSystemEmail(email, '🕉️ Welcome to Acharya TN Khurana Astrology Journal', html, 'Campaign');

      res.json({ success: true, msg: 'Thank you for subscribing to our spiritual journal!' });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/api/admin/email-logs', (req, res) => {
    try {
      const db = readDB();
      res.json(db.email_logs || []);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/api/admin/campaigns', (req, res) => {
    try {
      const db = readDB();
      res.json(db.campaigns || []);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/crm/campaign/send', async (req, res) => {
    try {
      const db = readDB();
      const { title, subject, content } = req.body;

      if (!title || !subject || !content) {
        return res.status(400).json({ error: 'Title, email subject, and campaign content are necessary.' });
      }

      const activeSubs = (db.subscribers || []).filter(s => s.active);
      if (activeSubs.length === 0) {
        return res.status(400).json({ error: 'There are no active email subscribers to broadcast to.' });
      }

      let successCount = 0;
      let failedCount = 0;

      // Broadcast sequentially
      for (const subscriber of activeSubs) {
        const tailoredHtml = `
          <div style="font-family: sans-serif; padding: 24px; background: #0a0e18; color: #ffffff; border-radius: 16px; border: 1px solid #C9A227; max-width: 600px; margin: 0 auto;">
            <div style="text-align: center; margin-bottom: 20px;">
              <h1 style="color: #f5d98a; font-family: serif; margin-bottom:0;">Acharya TN Khurana</h1>
              <p style="font-size: 11px; text-transform: uppercase; color: #8b96aa; tracking-wider: 2px; margin-top:5px;">Vedic Astrologer & Vastu Council</p>
            </div>
            <div style="height:1.5px; background:linear-gradient(to right, transparent, #C9A227, transparent); margin: 16px 0;"></div>
            <div style="font-size: 14px; line-height: 1.6; color: #cbd5e1;">
              ${content.replace(/\n/g, '<br/>')}
            </div>
            <div style="height:1px; background:rgba(255,255,255,0.08); margin: 24px 0;"></div>
            <p style="font-size: 10px; color: #596478; text-align: center; line-height: 1.4;">
              You received this newsletter subscription email from acharyakhurana.com portal because of account preference.<br/>
              Acharya TN Khurana Council · Sector 15 New Delhi NCR 110001
            </p>
          </div>
        `;

        const mailRes = await sendSystemEmail(subscriber.email, subject, tailoredHtml, 'Campaign');
        if (mailRes.success) {
          successCount++;
        } else {
          failedCount++;
        }
      }

      if (!db.campaigns) db.campaigns = [];
      const newCampaign = {
        id: `cp_${Date.now()}`,
        title,
        subject,
        content,
        sentAt: new Date().toISOString(),
        recipientsCount: activeSubs.length,
        successCount,
        failedCount
      };

      db.campaigns.unshift(newCampaign);

      if (!db.activity_logs) db.activity_logs = [];
      db.activity_logs.unshift({
        id: `act_${Date.now()}`,
        email: 'kanika9694@gmail.com',
        action: 'CAMPAIGN_BROADCAST',
        details: `Dispatched campaign ${title} to ${activeSubs.length} readers. Success: ${successCount}. Failures: ${failedCount}`,
        timestamp: new Date().toISOString()
      });

      writeDB(db);

      res.json({ success: true, campaign: newCampaign });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // ==========================================================
  // CRM ANALYTICS & ACTIVITY LOG INTELLIGENCE
  // ==========================================================

  app.get('/api/admin/activity-logs', (req, res) => {
    try {
      const db = readDB();
      res.json(db.activity_logs || []);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/api/admin/analytics', (req, res) => {
    try {
      const db = readDB();
      const users = db.users || [];
      const leads = db.leads || [];
      const views = db.views_logs || [];
      const subs = db.subscribers || [];

      // Calculate analytic aggregations
      const bookViews = views.filter(v => v.type === 'book').length;
      const productViews = views.filter(v => v.type === 'product').length;
      const totalViews = views.length;

      res.json({
        totalUsers: users.length,
        totalLeads: leads.length,
        totalSubscribers: subs.length,
        bookViewsCount: bookViews,
        productViewsCount: productViews + bookViews, // unify views
        totalPlatformViews: totalViews,
        activeSmtp: !!(getSmtpConfig(db)?.host && getSmtpConfig(db)?.username),
        leadSourceCounts: {
          Contact: leads.filter(l => l.source === 'Contact').length,
          Inquiry: leads.filter(l => l.source === 'Inquiry').length,
          BookStore: leads.filter(l => l.source === 'Book Store').length,
          Service: leads.filter(l => l.source === 'Service').length,
          WhatsApp: leads.filter(l => l.source === 'WhatsApp').length,
        }
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // API Route: AI Astrologer predictions proxy
  app.post('/api/gemini', async (req, res) => {
    try {
      const { action, params } = req.body;
      
      if (!API_KEY || API_KEY === 'MY_GEMINI_API_KEY') {
        return res.status(400).json({ error: 'Config missing, fallback enabled' });
      }

      const client = getGeminiClient();

      if (action === 'kundli') {
        const { name, dob, tob, pob } = params;
        const prompt = `You are a legendary Vedic Astrologer representing India's highest astrological credentials.
Generate a comprehensive, structural, exciting birth chart (Kundli) analysis report for a seeker named "${name}".
Birth details: Date of Birth: ${dob}, Time of Birth: ${tob || 'unspecified'}, Place of Birth: ${pob}.

Your response must be in structured Markdown with distinct, beautiful chapters:
# 🔮 Birth Chart Analysis: ${name}
**Date of Birth:** ${dob} | **Time:** ${tob || 'Not specified'} | **Place:** ${pob}

---

### 1. Ascendant (Lagna) & Core Personality
Interpret their Ascendant sign and core traits.

### 2. The Sun & The Moon (Soul & Mind)
What do their Sun and Moon placements reveal?

### 3. Career & Wealth (10th & 2nd/11th Houses)
Destined career path and financial prosperity.

### 4. Relationships & Marriage (7th House)
Love life and marital prospects.

### 5. Dasha Overview (Current Time Period)
What is the current planetary focus?

### 6. Spiritual Remedies (Upayas)
Provide practical Vedic remedies (Gemstones, Mantras, Donations) for their success.

End with a warm, divine blessing. Keep formatting incredibly clean.`;

        const model = client.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const response = await model.generateContent({
          contents: [{ role: 'user', parts: [{ text: prompt }] }]
        });

        return res.json({ result: response.response.text() });
      } 
      
      if (action === 'chat') {
        const { message, history } = params;
        
        // Format history into context
        const formattedHistory = (history || []).map((h: any) => {
          return `${h.sender === 'user' ? 'User' : 'Astrologer'}: ${h.text}`;
        }).join('\n');

        const prompt = `You are an ancient expert Indian Astrologer, Vastu and Numerology advisor.
Previous Conversation notes:
${formattedHistory}

User's current question: "${message}"

Respond directly to their question in a mystical but practical way, with compassionate guidance, referencing transits, dasha and suggesting remedies where appropriate. Keep the output concise and encouraging.`;

        const model = client.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const response = await model.generateContent({
          contents: [{ role: 'user', parts: [{ text: prompt }] }]
        });

        return res.json({ result: response.response.text() });
      }

      return res.status(400).json({ error: 'Unsupported API action' });
    } catch (err: any) {
      console.error("Gemini API server proxy failed:", err);
      return res.status(500).json({ error: err.message || 'Internal AI Error' });
    }
  });

  // ==========================================================
  // REAL-TIME NOTIFICATIONS STREAMING & MANAGEMENT SYSTEM
  // ==========================================================

  // SSE Real-Time Endpoint, registers listening dashboard admin connections
  app.get('/api/admin/notifications/stream', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    const client = { id: Date.now(), res };
    sseClients.push(client);

    // Keep-alive heartbeat packet immediately to sync client connection state
    res.write(': sse connection registered\n\n');

    req.on('close', () => {
      sseClients = sseClients.filter(c => c.id !== client.id);
    });
  });

  // Fetch all notifications logged
  app.get('/api/admin/notifications', (req, res) => {
    try {
      const db = readDB();
      res.json(db.notifications || []);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Mark all notifications as read
  app.post('/api/admin/notifications/read-all', (req, res) => {
    try {
      const db = readDB();
      if (db.notifications) {
        db.notifications.forEach(n => { n.status = 'read'; });
      }
      writeDB(db);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Mark single notification as read
  app.post('/api/admin/notifications/:id/read', (req, res) => {
    try {
      const db = readDB();
      const notif = (db.notifications || []).find(n => n.id === req.params.id);
      if (notif) {
        notif.status = 'read';
      }
      writeDB(db);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Fetch notification sounds and master audio controls
  app.get('/api/admin/notification-settings', (req, res) => {
    try {
      const db = readDB();
      res.json(db.notification_settings || { soundEnabled: true, volume: 0.8 });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Save new audio settings, volume level or custom sound alerts
  app.post('/api/admin/notification-settings', (req, res) => {
    try {
      const db = readDB();
      db.notification_settings = req.body;
      writeDB(db);
      res.json({ success: true, settings: db.notification_settings });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Test notification sound generation by injecting manual audit alerts
  app.post('/api/admin/notifications/test-trigger', (req, res) => {
    try {
      const db = readDB();
      const { type } = req.body; // 'Booking' | 'Inquiry' | 'New User' | 'Order' | 'Payment'
      let title = "Test System Alert";
      let msg = "A testing sound wave diagnostics notification was dispatched successfully.";
      if (type === 'Booking') {
        title = "New Consultation Booking Test";
        msg = "Pooja Sharma created an appointment for Vedic Marriage Compatibility Matching.";
      } else if (type === 'Inquiry') {
        title = "New Inquiry Alert Test";
        msg = "Acharya, client Nikhil Verma requested details on dynamic gemstones.";
      } else if (type === 'New User') {
        title = "New Registration Alert Test";
        msg = "A new spiritual follower signed up to receive planetary transits.";
      } else if (type === 'Order') {
        title = "New Book Order Placed Test";
        msg = "Order completed for 'The Ultimate Guide to Kundli Reading' (Invoice #INV-2026-610).";
      } else if (type === 'Payment') {
        title = "New Payment Transaction Processed Test";
        msg = "Captured ₹499 payment fee cleanly for online consultation slot.";
      }
      const n = createNotification(db, title, msg, type || 'Booking');
      writeDB(db);
      res.json({ success: true, notification: n });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // ==========================================================
  // REAL BOOKING & CONSULTATION MANAGEMENT SYSTEM
  // ==========================================================

  // Retrieve user bookings or all bookings logged
  app.get('/api/bookings', (req, res) => {
    try {
      const db = readDB();
      const email = req.query.email as string;
      let list = db.bookings || [];
      if (email) {
        list = list.filter(b => b.customerEmail.toLowerCase() === email.toLowerCase());
      }
      res.json(list);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/api/admin/bookings', (req, res) => {
    try {
      const db = readDB();
      res.json(db.bookings || []);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Create real booking with CRM Lead Synchronization
  app.post('/api/bookings', (req, res) => {
    try {
      const db = readDB();
      const booking = req.body;
      if (!booking.id) booking.id = `bk_${Date.now()}`;
      if (!booking.createdAt) booking.createdAt = new Date().toISOString();
      booking.status = booking.status || 'Pending';
      if (!db.bookings) db.bookings = [];
      db.bookings.unshift(booking);

      // Instantly record the lead inside CRM Database
      if (!db.leads) db.leads = [];
      db.leads.unshift({
        id: `ld_${Date.now()}`,
        name: booking.customerName,
        email: booking.customerEmail,
        phone: booking.customerPhone,
        city: booking.birthPlace || '',
        message: `Booked ${booking.type} consultation regarding ${booking.serviceName} scheduled on ${booking.date} at ${booking.time}`,
        source: 'Service',
        service: booking.serviceName,
        createdAt: new Date().toISOString(),
        followUpStatus: 'New',
        notes: `Birth Info: Date: ${booking.birthDate || 'N/A'}, Time: ${booking.birthTime || 'N/A'}, Place: ${booking.birthPlace || 'N/A'}. Booking details slot: ${booking.time}`
      });

      // Synchronize customers table
      if (booking.customerEmail) {
        if (!db.customers) db.customers = [];
        const exists = db.customers.find(c => c.email.toLowerCase() === booking.customerEmail.toLowerCase());
        if (!exists) {
          db.customers.push({
            id: `cust_${Date.now()}`,
            name: booking.customerName,
            phone: booking.customerPhone,
            email: booking.customerEmail,
            address: booking.birthPlace || 'unspecified Place',
            createdAt: new Date().toISOString()
          });
        }
      }

      // Raise booking alarm sound instantly
      createNotification(db, "New Consultation Booked", `${booking.customerName} has scheduled a ${booking.type} consultation for ${booking.serviceName} on ${booking.date} at ${booking.time}.`, "Booking");

      writeDB(db);
      res.json(booking);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Admin edit consultation (Approve, cancel or defer)
  app.post('/api/admin/bookings/:id', (req, res) => {
    try {
      const db = readDB();
      const payload = req.body;
      if (!db.bookings) db.bookings = [];
      const idx = db.bookings.findIndex(b => b.id === req.params.id);
      if (idx !== -1) {
        db.bookings[idx] = { ...db.bookings[idx], ...payload };
      }
      writeDB(db);
      res.json({ success: true, booking: db.bookings[idx] });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Admin delete booking
  app.delete('/api/admin/bookings/:id', (req, res) => {
    try {
      const db = readDB();
      if (db.bookings) {
        db.bookings = db.bookings.filter(b => b.id !== req.params.id);
      }
      writeDB(db);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // ==========================================================
  // ASTROLOGY TOOLKIT MANAGEMENT SYSTEM
  // ==========================================================

  app.get('/api/admin/astrology-toolkit', (req, res) => {
    try {
      const db = readDB();
      res.json(db.astrology_toolkit_settings || {
        activeTools: [
          'birth_chart', 'kundli', 'horoscope', 'numerology', 'compatibility', 
          'manglik', 'gemstone', 'lucky_calculator', 'muhurat', 'panchang', 'transit', 'dasha'
        ]
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/admin/astrology-toolkit', (req, res) => {
    try {
      const db = readDB();
      db.astrology_toolkit_settings = req.body;
      writeDB(db);
      res.json({ success: true, settings: db.astrology_toolkit_settings });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // ==========================================================
  // AI ASTRO GURU CONSULTATION HISTORY & CHAT INTERACTION SERVICES
  // ==========================================================

  app.get('/api/guru/conversations', (req, res) => {
    try {
      const db = readDB();
      const { email } = req.query;
      let chats = db.ai_guru_chats || [];
      if (email) {
        chats = chats.filter(c => c.userEmail.toLowerCase() === (email as string).toLowerCase());
      }
      res.json(chats);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/guru/conversations', (req, res) => {
    try {
      const db = readDB();
      const convo = req.body;
      if (!convo.id) convo.id = `chat_${Date.now()}`;
      if (!convo.createdAt) convo.createdAt = new Date().toISOString();
      
      if (!db.ai_guru_chats) db.ai_guru_chats = [];
      const existingIdx = db.ai_guru_chats.findIndex(c => c.id === convo.id);
      if (existingIdx !== -1) {
        db.ai_guru_chats[existingIdx] = convo;
      } else {
         db.ai_guru_chats.unshift(convo);
      }
      writeDB(db);
      res.json(convo);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/guru/chat', async (req, res) => {
    try {
      const { messages } = req.body;
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: 'Missing messages array parameter' });
      }

      const lastUserMessage = messages[messages.length - 1]?.content || '';

      const sysInst = `You are Acharya TN Khurana's legendary AI Vedic Astrology Assistant, a wise 24/7 Spiritual Guru, Jyotish, Numerology and Kundli expert.
Provide highly accurate, personalized, traditional yet practical astro planetary guidance, relationship compatibility matching (Koota Milan), subha Muhurats, lucky gemstones, and solar transits.
Offer comforting, detailed, and deeply empathetic answers. Try to structures reply with clean gorgeous Markdown chapters, avoiding raw script codes or system calculations. Translate Sanskrit slokas beautifully where relevant to increase the sacred mood.`;

      let replyText = '';
      
      try {
        const client = getGeminiClient();
        const isKeyValid = process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY';
        
        if (isKeyValid) {
          const model = client.getGenerativeModel({ 
            model: 'gemini-1.5-flash',
            systemInstruction: sysInst
          });
          
          const response = await model.generateContent({
            contents: messages.map(m => ({
              role: m.role === 'user' ? 'user' : 'model',
              parts: [{ text: m.content }]
            }))
          });
          
          replyText = response.response.text() || '';
        } else {
          throw new Error("Key is mock or absent. Triggering high-fidelity local Vedic fallback.");
        }
      } catch (apiError) {
        console.warn("⚠️ API Warning: Gemini Call failed, utilizing offline Vedic Astrological Wisdom fallback.", apiError);
        
        // Generate beautiful, realistic, customized Astrological answers offline based on what was typed!
        const q = lastUserMessage.toLowerCase();
        if (q.includes('marriage') || q.includes('love') || q.includes('spouse') || q.includes('marriage matching') || q.includes('compatibility')) {
          replyText = `### 💍 Vedic Relationship Alignment & Compatibility Matching
According to Hindu Vedic Horoscopy (Koota Milan), relationship compatibility is computed through Moon Nakshatra alignment across 8 parameters (Ashta Koota).

Based on your planetary alignments:
1. **Navamsha (D9) Chart Strength:** The Seventh House is currently governed by Venus and Jupiter in beneficial aspect, suggesting a mature, loyal, and spiritually aligned partnership.
2. **Mangal Dosha:** Minimal Mars influence is found in your lagna chart. No major Manglik afflictions are present.
3. **Karmic Timeline:** Sub-dasha of Jupiter (Guru) is active in your karmic chart, which is highly auspicious for relationship stability.

#### 🌟 Recommended Remedial Measures:
- **Puja:** Chant \`Om Namah Shivaya\` 108 times on Mondays to harmonize couples' energies.
- **Saffron Drink:** Wear light yellow or green colors on Thursdays to strengthen Jupiter.
- **Charity:** Feed green grass to cows on Wednesdays for mental compatibility.`;
        } else if (q.includes('career') || q.includes('job') || q.includes('business') || q.includes('money') || q.includes('wealth')) {
          replyText = `### 💼 Vedic Career & Professional Growth Report
The Tenth House (Karma Bhava) in your natal chart represents professional authority and career destiny.

Analysis from your Karmic Houses:
1. **Saturn (Shani) Placement:** Shani is placed favorably in the 11th House of gains, assuring slow but extremely stable long-term career growth.
2. **Suns Alignment (Surya Bal):** Surya is illuminating your Ninth House, suggesting high fortune in administrative roles, consulting, or entrepreneurship.
3. **Current Vimshottari Maha Dasha:** You are under the transit influence of Mercury, which governs commercial wisdom and tactical calculations.

#### 🌟 Powerful Wealth and Career Remedies:
- **Surya Arghya:** Offer fresh water to the rising Sun daily inside a copper vessel with a pinch of vermilion.
- **Budh Remedies:** Carry or wear green-colored accessories on Wednesdays to stimulate executive intellect.
- **Mantra:** Meditate upon the Ganesha Beej Mantra: \`Om Gam Ganapataye Namah\`.`;
        } else if (q.includes('kundli') || q.includes('birth chart') || q.includes('planetary') || q.includes('dasha')) {
          replyText = `### 🌌 Complete Kundli & Mahadasha Synthesis
Vedic astrology charts map the sky at the exact second you took your first breath to formulate your Karmic Map.

Planetary Placements Overview:
- **Lagna (First House):** Ascendant ruled by Jupiter, conferring natural wisdom, teaching attributes, and high intelligence.
- **Chandra (Moon Sign):** Rasi in Taurus (Vrishabha) where the Moon is exalted. This bestows emotional peace and a loving persona.
- **Current Mahadasha Phase:** You are presently navigating Rahu Mahadasha, Saturn Antardasha. This creates occasional mental fog, but ultimately rewards patience with major material breakthrough transformations.

#### 🌟 Holistic Remedies to Stabilize planetary influences:
- **Mantra chanting:** Chant the Shiva Mahamrityunjaya Mantra daily for ultimate protection from Rahu afflictions.
- **Yantra:** Place a silver coin or Sri Yantra in your home sanctuary facing North-East.
- **Fasting:** Fast twice a month on Ekadashi days to purify negative energy fields.`;
        } else {
          replyText = `### 🙏 Namaste and Astro Blessings
I am your **AI Astro Guru**, here to help you unlock the sacred codes of your Vedic birth chart, Kundli, numerological matrices, and planetary Dashas.

My dynamic reading of your planetary configurations:
- **Dharma Alignments:** Your natural path is oriented toward spiritual wisdom and material abundance.
- **Current Transit:** Jupiter is transiting your Fourth House, bringing happiness, peace, and wisdom.
- **Planetary Recommendations:** You are in a highly intuitive phase where meditating at sunrise is exponentially beneficial.

How may I guide your path today? You can ask me specific questions about:
1. **💍 Marriage & Relationship Compatibility**
2. **💼 Career, Business, & Financial Wealth**
3. **🔮 Birth Chart (Kundli) & vimshottari Maha Dasha Analysis**
4. **🍀 Numerology Correction & Lucky Colors/Numbers**`;
        }
      }

      res.json({ reply: replyText });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // ==========================================================
  // EXTENDED CRM INSIGHTS & TOTAL BILLINGS SUMMARY
  // ==========================================================

  app.get('/api/admin/crm-summary', (req, res) => {
    try {
      const db = readDB();
      const bookingsCount = (db.bookings || []).length;
      const inquiriesCount = (db.inquiries || []).length;
      const usersCount = (db.users || []).length;
      const ordersCount = (db.orders || []).length;
      const leadsCount = (db.leads || []).length;
      const totalPayments = (db.orders || []).reduce((acc, o) => acc + (o.total || 0), 0) + 
                            (db.bookings || []).filter(b => b.status === 'Confirmed').reduce((acc, b) => acc + (b.price || 0), 0);
      
      res.json({
        bookingsCount,
        inquiriesCount,
        usersCount,
        ordersCount,
        leadsCount,
        totalPayments
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // End of routes
}

defineRoutes();

// Incorporate Vite middleware inside dev environments
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  (async () => {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
    app.listen(3000, '0.0.0.0', () => {
      console.log(`[SYS ADMIN] Full-stack Node server booted on port 3000`);
    });
  })().catch(err => {
    console.error("Critical server boot failure:", err);
  });
} else {
  // Production asset streaming
  const distPath = path.join(process.cwd(), 'dist');
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
  
  // If not running inside Vercel Serverless, start a regular port listener
  if (!process.env.VERCEL) {
    app.listen(3000, '0.0.0.0', () => {
      console.log(`[SYS ADMIN] Production Node server booted on port 3000`);
    });
  }
}

export default app;
