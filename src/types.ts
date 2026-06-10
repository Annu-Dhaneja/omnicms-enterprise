export interface SiteConfig {
  name: string;
  tagline: string;
  phone: string;
  email: string;
  whatsapp: string;
}

export interface PageSEOPair {
  pageId: string;
  title: string;
  description: string;
  keywords: string;
  slug: string;
  ogImage?: string;
  twitterCard?: 'summary' | 'summary_large_image';
  canonicalUrl?: string;
  schemaMarkup?: string;
  imageAlt?: string;
}

export interface WhatsAppDept {
  id: string;
  name: string;
  phone: string;
  label: string;
}

export interface WhatsAppConfig {
  enabled: boolean;
  number: string;
  primaryMsg: string;
  showWidget: boolean;
  departments: WhatsAppDept[];
}

export interface MapBranch {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  phone?: string;
}

export interface MapConfig {
  enabled: boolean;
  lat: number;
  lng: number;
  zoom: number;
  markerText: string;
  branches: MapBranch[];
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
  bio?: string;
}

export interface JourneyMilestone {
  id: string;
  year: string;
  title: string;
  desc: string;
}

export interface HeroContent {
  badge: string;
  title: string;
  name: string;
  subtitle: string;
  cta1: string;
  cta2: string;
}

export interface AboutContent {
  eyebrow: string;
  title: string;
  intro: string;
  text1: string;
  text2: string;
  goldMedalist: string;
  tvPanelist: string;
  author: string;
  awardWinner: string;
  // Dynamic Biography
  biography: string;
  mission: string;
  vision: string;
  experience: string;
  achievements: string[];
  certifications: string[];
  team: TeamMember[];
  timeline: JourneyMilestone[];
  videoUrl?: string;
  image?: string;
}

export interface ContactInfo {
  title: string;
  description: string;
  address: string;
  hours: string;
}

export type SectionId = 
  | 'hero' 
  | 'trust' 
  | 'services' 
  | 'about' 
  | 'why' 
  | 'testimonials' 
  | 'horoscope' 
  | 'panchang' 
  | 'ai-features' 
  | 'reports' 
  | 'blog' 
  | 'books'
  | 'faq' 
  | 'contact';

export interface SectionOrder {
  id: SectionId;
  name: string;
  visible: boolean;
}

export interface ThemeConfig {
  mode: 'dark' | 'light';
  palette: 'default' | 'royal-blue' | 'divine-emerald' | 'amber-sunset' | 'cosmic-purple';
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  borderRadius: string; // 'rounded-none' | 'rounded-md' | 'rounded-lg' | 'rounded-2xl' | 'rounded-full'
  shadows: 'shadow-sm' | 'shadow-md' | 'shadow-lg' | 'shadow-xl' | 'shadow-2xl' | 'shadow-none';
  headerStyle: 'fixed' | 'sticky' | 'glass';
  footerStyle: 'minimal' | 'detailed' | 'cosmic';
}

export interface Service {
  id: string;
  icon: string;
  name: string;
  desc: string;
  price: string;
  duration: string;
  category?: string;
  active: boolean;
}

export interface WhyChooseUsItem {
  id: string;
  num: string;
  icon: string;
  title: string;
  text: string;
}

export interface Testimonial {
  id: string;
  text: string;
  stars: number;
  name: string;
  location: string;
  service: string;
  initials: string;
}

export interface RatingMetric {
  label: string;
  val: number;
}

export interface ZodiacForecast {
  sign: string;
  name: string;
  dates: string;
  reading: string;
  rating: string;
  ratings: RatingMetric[];
}

export interface PanchangData {
  tithi: string;
  samvat: string;
  nakshatra: string;
  nakshatraLord: string;
  yoga: string;
  karana: string;
  sunrise: string;
  sunset: string;
  moonSign: string;
  rahukalam: string;
  auspicious: string;
  gulikal: string;
}

export interface PremiumReport {
  id: string;
  icon: string;
  name: string;
  price: string;
  orig: string;
  desc: string;
}

export interface BlogPost {
  id: string;
  icon: string;
  category: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  readTime: string;
  author: string;
  status: 'draft' | 'published';
  tags: string[];
  image?: string;
  desc?: string;
  comments?: { author: string; comment: string; text?: string }[];
}

export interface FAQItem {
  id: string;
  q: string;
  a: string;
}

export type LeadStatus = 'New' | 'Contacted' | 'In-Progress' | 'Consulted' | 'Cancelled';

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  service: string;
  date: string; // birth date
  time?: string; // birth time
  place: string; // birth place
  message: string;
  status: LeadStatus;
  notes: string;
  bookingDate?: string; // date of consultation booking
  bookingTime?: string; // time slot of booking
  amountPaid?: string;
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  user: string;
  action: string;
  details: string;
  timestamp: string;
}

export interface SEOMetadata {
  title: string;
  description: string;
  keywords: string;
  canonicalUrl: string;
  robotsMeta: string;
}

export interface MediaItem {
  id: string;
  url: string;
  name: string;
  altText: string;
  size: string;
}

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

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  value: number;
  active: boolean;
}

export interface Order {
  id: string;
  invoiceNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerAddress: string;
  items: {
    bookId: string;
    title: string;
    quantity: number;
    price: number;
  }[];
  subtotal: number;
  discountAmount: number;
  total: number;
  couponUsed?: string;
  status: 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';
  trackingNumber?: string;
  createdAt: string;
}

export type PageId =
  | 'home'
  | 'about'
  | 'services'
  | 'books'
  | 'book-detail'
  | 'blog'
  | 'blog-detail'
  | 'contact'
  | 'inquiry'
  | 'cart'
  | 'checkout'
  | 'dashboard'
  | 'toolkit';

export interface BackupData {
  version: string;
  timestamp: string;
  site: SiteConfig;
  hero: HeroContent;
  about: AboutContent;
  contactInfo: ContactInfo;
  services: Service[];
  whyCards: WhyChooseUsItem[];
  testimonials: Testimonial[];
  zodiac: ZodiacForecast[];
  panchang: PanchangData;
  reports: PremiumReport[];
  blog: BlogPost[];
  faqs: FAQItem[];
  theme: ThemeConfig;
  sectionOrders: SectionOrder[];
  books?: Book[];
  coupons?: Coupon[];
  orders?: Order[];
  // SEO, Google Maps, and WhatsApp Settings
  pageSeo?: PageSEOPair[];
  whatsapp?: WhatsAppConfig;
  googleMaps?: MapConfig;
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

