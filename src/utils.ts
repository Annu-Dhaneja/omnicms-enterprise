import { 
  SiteConfig, 
  HeroContent, 
  AboutContent, 
  ContactInfo, 
  Service, 
  WhyChooseUsItem, 
  Testimonial, 
  ZodiacForecast, 
  PanchangData, 
  PremiumReport, 
  BlogPost, 
  FAQItem, 
  ThemeConfig,
  SectionOrder,
  Lead,
  ActivityLog,
  BackupData,
  Book,
  Coupon,
  Order,
  PageSEOPair,
  WhatsAppConfig,
  MapConfig
} from './types';

// Fallback seed data matching the client's exquisite Vedic Astrology branding
export const defaultSiteConfig: SiteConfig = {
  name: "Acharya TN Khurana",
  tagline: "Vedic Astrologer · Numerologist · Spiritual Guide",
  phone: "+91 12345 67890",
  email: "info@acharyakhurana.com",
  whatsapp: "919876543210"
};

export const defaultHeroContent: HeroContent = {
  badge: "India's Most Trusted Vedic Astrologer",
  title: "Acharya\nTN Khurana",
  name: "Vedic Astrologer · Numerologist · Spiritual Guide",
  subtitle: "Unlock the cosmic secrets of your destiny. With over 30 years of experience in Vedic Astrology, Numerology & Spiritual Sciences — let the stars guide your path to prosperity, love & peace.",
  cta1: "Book Consultation",
  cta2: "Free AI Kundli"
};

export const defaultAboutContent: AboutContent = {
  eyebrow: "🌟 About Acharya",
  title: "Meet Acharya TN Khurana",
  intro: "\"The stars do not control your destiny — they illuminate the path you must choose.\"",
  text1: "Acharya TN Khurana is one of India's most revered Vedic Astrologers with over three decades of experience in Jyotish Shastra, Numerology, Vastu, Tarot & Spiritual Healing. Having guided over 1.5 lakh clients across 60+ countries, he is recognized globally for his precise predictions and transformative remedies.",
  text2: "A Gold Medalist in Vedic Astrology from Bhartiya Vidya Bhavan, New Delhi, Acharya Khurana combines ancient wisdom with modern understanding to deliver actionable cosmic guidance.",
  goldMedalist: "Gold Medalist (Bhartiya Vidya Bhavan, New Delhi)",
  tvPanelist: "TV Panelist on Aaj Tak, Zee News, India TV",
  author: "Published Author of 12+ Books on Vedic Astrology",
  awardWinner: "Best Astrologer India 2023 & 2024",
  biography: "Acharya TN Khurana's life journey has been dedicated to restoring the purity of ancient Vedic astrological rules. Recognizing from an early age that modern living requires adaptive spiritual answers, he studied at the prestigious Bhartiya Vidya Bhavan under the personal guidance of elite scholars. Today, his consultations do not rely on creating fear (Sanskrit: Bhaya), but on building confidence (Sanskrit: Shradha).",
  mission: "To eliminate unscientific misconceptions about Vedic sciences and empower individuals with predictive clarity & practical remedies that resolve critical family, career, and business direction blocks.",
  vision: "To establish a modernized Vedic council that makes age-old horoscope algorithms accessible to corporate planners, couples, and seekers from all walks of life globally.",
  experience: "Over 30 years of elite diagnostic expertise with 1.5 lakh consultations recorded across 60+ countries, serving as panel expert on top television networks.",
  image: "https://images.unsplash.com/photo-1566616213894-2d4e1baee5d8?auto=format&fit=crop&q=80&w=600&h=800",
  achievements: [
    "Gold Medallist, Shastra Rachana (Bhartiya Vidya Bhavan)",
    "Consultant of the Year (Spiritual Sciences Association)",
    "Published 12 high-fidelity textbooks on Kundli and Vastu Remedies",
    "Best Astrologer National Pride Award 2023 & 2024"
  ],
  certifications: [
    "Jyotish Acharya - Certified by Bhartiya Vidya Bhavan",
    "Senior Vastu Consultant Shastra Certification",
    "Advanced Numerological Diagnostic Master",
    "Spiritual Counseling and Karmic Therapist License"
  ],
  team: [
    { id: "tm_1", name: "Acharya TN Khurana", role: "Principal Vedic Consultant & Vastu Expert", image: "🧘", bio: "Founder of the Council with 30+ years of spiritual authority and television predictive panels." },
    { id: "tm_2", name: "Scholar Priyadarshini", role: "Senior Panchang Analyst & Chart Coder", image: "🕉️", bio: "Double Master\'s degree in Sanskrit Literature. Expert in Abhijit Muhurat and precise birth-map calculations." },
    { id: "tm_3", name: "Architect Mohit Sharma", role: "Chief Residential Energy Correcter", image: "🏛️", bio: "Combines modern spatial architectural blueprints with classical Vastu directives for non-destructive energy restoration." }
  ],
  timeline: [
    { id: "tl_1", year: "1994", title: "Inaugural Gurukul Guidance", desc: "Received advanced Jyotish credentials and initiated client consults from a small spiritual ashram in Delhi." },
    { id: "tl_2", year: "2005", title: "Published Kundli Masterpiece", desc: "Bestselling release of \'The Ultimate Guide to Kundli Reading\', modernizing chart-analysis rules without jargon." },
    { id: "tl_3", year: "2015", title: "Global Council Expansion", desc: "Launched high fidelity tele-consultations, serving over 50,000 international seekers across USA, UK and UAE." },
    { id: "tl_4", year: "2024", title: "Launch of AI Vedic Coder", desc: "Integrated state-of-the-art predictive generative modeling to bring personalized daily Panchang instantly to seekers." }
  ],
  videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
};

export const defaultPageSeo: PageSEOPair[] = [
  {
    pageId: 'home',
    title: 'Acharya TN Khurana - Trusted Vedic Astrologer & Vastu Expert',
    description: 'Unlock your destiny with custom Vedic readings, horoscope analysis, daily Panchang, and sacred home Vastu blue-prints with India\'s best astrologer.',
    keywords: 'vedic astrology, kundli reader, daily panchang, vastu expert, astrologer near me',
    slug: 'home',
    ogImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600',
    twitterCard: 'summary_large_image',
    canonicalUrl: 'https://acharyakhurana.com/',
    schemaMarkup: `{ "@context": "https://schema.org", "@type": "LocalBusiness", "name": "Acharya TN Khurana Council" }`,
    imageAlt: 'Acharya Kundli readings'
  },
  {
    pageId: 'about',
    title: 'Biography & Journey of Acharya TN Khurana',
    description: 'Read the golden life history, awards, panel history, and academic accomplishments of India\'s revered Gold Medalist Acharya TN Khurana.',
    keywords: 'acharya bhartiya vidya bhavan, gold medalist astrologer, acharya biography',
    slug: 'about-acharya',
    ogImage: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&q=80&w=600',
    twitterCard: 'summary',
    canonicalUrl: 'https://acharyakhurana.com/about',
    schemaMarkup: `{ "@context": "https://schema.org", "@type": "Person", "name": "Acharya TN Khurana" }`,
    imageAlt: 'Acharya TN Khurana Certification'
  },
  {
    pageId: 'services',
    title: 'Vedic Astrology & Vastu Consultation Services',
    description: 'Book certified direct consultations for Kundli reading, career forecast, marriage matching, business growth, and corrective Vastu setups.',
    keywords: 'marriage matching gun milan, carrier transit remedy, gemstone therapy expert',
    slug: 'services',
    ogImage: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&q=80&w=600',
    twitterCard: 'summary',
    canonicalUrl: 'https://acharyakhurana.com/services',
    schemaMarkup: `{ "@context": "https://schema.org", "@type": "Service", "provider": "Acharya TN Khurana" }`,
    imageAlt: 'Holy Astro Consultations'
  },
  {
    pageId: 'books',
    title: 'Sacred Astro Manuscripts & Vastu Blueprints Book Store',
    description: 'Shop authentic spiritual study books authored directly by Acharya TN Khurana. High fidelity Vedic manuals with remedies.',
    keywords: 'kundli guide book, vastu remedies manual, certified spiritual book store',
    slug: 'book-shelf',
    ogImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600',
    twitterCard: 'summary_large_image',
    canonicalUrl: 'https://acharyakhurana.com/books',
    schemaMarkup: `{ "@context": "https://schema.org", "@type": "BookStore", "name": "Sacred Manuscript Books" }`,
    imageAlt: 'Kundli and Vastu books shelf'
  },
  {
    pageId: 'book-detail',
    title: 'Sacred Literature - Deep Book Insights & Reviews',
    description: 'Explore deep structural description, related literature, multi-angle covers, and detailed reviews written by seekers.',
    keywords: 'book detailed specs, spiritual review chapters',
    slug: 'book-details',
    ogImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600',
    twitterCard: 'summary',
    canonicalUrl: 'https://acharyakhurana.com/book',
    schemaMarkup: `{ "@context": "https://schema.org", "@type": "Book" }`,
    imageAlt: 'Detail Cover visual'
  },
  {
    pageId: 'blog',
    title: 'Vedic Astrology, Transits, and Muhurats Research Blog',
    description: 'Read the latest deep-dive research articles, transit alerts, Saturn Sade Sati advice and planetary mantras published weekly.',
    keywords: 'astrological transit wisdom, shani dasha remedies',
    slug: 'spiritual-insights',
    ogImage: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=600',
    twitterCard: 'summary_large_image',
    canonicalUrl: 'https://acharyakhurana.com/blog',
    schemaMarkup: `{ "@context": "https://schema.org", "@type": "Blog" }`,
    imageAlt: 'Aura of ancient scrolls'
  },
  {
    pageId: 'blog-detail',
    title: 'Full Spiritual Article - Astro Research & Transits',
    description: 'Read the full publication content, canonical references, comments and expert analysis.',
    keywords: 'full research text, expert transit warnings',
    slug: 'article',
    ogImage: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=600',
    twitterCard: 'summary',
    canonicalUrl: 'https://acharyakhurana.com/article',
    schemaMarkup: `{ "@context": "https://schema.org", "@type": "BlogPosting" }`,
    imageAlt: 'Scroll graphics'
  },
  {
    pageId: 'contact',
    title: 'Contact Acharya TN Khurana Council - Delhi Office',
    description: 'Book slots directly, view physical address routes, office phone metrics, and get instant offline directions and hours.',
    keywords: 'acharya khurana contact details, delhi consultation office hours',
    slug: 'contact-details',
    ogImage: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&q=80&w=600',
    twitterCard: 'summary',
    canonicalUrl: 'https://acharyakhurana.com/contact',
    schemaMarkup: `{ "@context": "https://schema.org", "@type": "ContactPage" }`,
    imageAlt: 'Office front view'
  },
  {
    pageId: 'inquiry',
    title: 'Direct Spiritual Guidance Inquiry Council',
    description: 'Submit complex enquiries directly and trace consult registration logs and status callbacks offline in the secure CRM.',
    keywords: 'inquiry registration list, dasha query forms',
    slug: 'guidance-inquiry',
    ogImage: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&q=80&w=600',
    twitterCard: 'summary',
    canonicalUrl: 'https://acharyakhurana.com/inquiry',
    schemaMarkup: `{ "@context": "https://schema.org", "@type": "ContactPoint" }`,
    imageAlt: 'Council enquiry portal'
  },
  {
    pageId: 'cart',
    title: 'Your Shopping Cart - Secure Spiritual Book Checkout',
    description: 'Review your selected manuals, modify cart levels, and redeem divine discount codes for instant spiritual checkout.',
    keywords: 'cart checklist items, coupon code entry page',
    slug: 'shopping-cart',
    ogImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600',
    twitterCard: 'summary',
    canonicalUrl: 'https://acharyakhurana.com/cart',
    schemaMarkup: `{ "@context": "https://schema.org", "@type": "ItemList" }`,
    imageAlt: 'Shopping basket icon'
  },
  {
    pageId: 'checkout',
    title: 'Secure Billing & Shipping Details Checkout',
    description: 'Register billing address credentials, tracking requests, and finalize high security invoice generation.',
    keywords: 'secured bookstore invoice checkout',
    slug: 'checkout',
    ogImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600',
    twitterCard: 'summary',
    canonicalUrl: 'https://acharyakhurana.com/checkout',
    schemaMarkup: `{ "@context": "https://schema.org", "@type": "OrderAction" }`,
    imageAlt: 'Secured checkout lock icon'
  },
  {
    pageId: 'dashboard',
    title: 'Seeker Dashboard - Order Tracking & Sacred Wishlists',
    description: 'Log in securely with client OTP to view past invoicing, courier tracking status, and your curated wishlists.',
    keywords: 'dashboard client accounts, track DTDC astro packages',
    slug: 'seeker-dashboard',
    ogImage: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&q=80&w=600',
    twitterCard: 'summary',
    canonicalUrl: 'https://acharyakhurana.com/dashboard',
    schemaMarkup: `{ "@context": "https://schema.org", "@type": "ProfilePage" }`,
    imageAlt: 'Aura of stars inside dashboard profile'
  }
];

export const defaultWhatsApp: WhatsAppConfig = {
  enabled: true,
  number: "919876543210",
  primaryMsg: "Pranam Acharya Ji, I am seeking spiritual guidance regarding family, finance and career forecasts. Please advise.",
  showWidget: true,
  departments: [
    { id: "dept_01", name: "Astrology & Kundli Dept", phone: "919876543210", label: "Consultation Booking Support" },
    { id: "dept_02", name: "Vastu & Office remedies", phone: "918765432109", label: "Vastu Site Visits & Remedies" },
    { id: "dept_03", name: "Sacred Manuscript Support", phone: "917654321098", label: "Book Order & Delivery Help" }
  ]
};

export const defaultGoogleMaps: MapConfig = {
  enabled: true,
  lat: 28.6304,
  lng: 77.2177,
  zoom: 14,
  markerText: "Acharya TN Khurana Astro Council (Connaught Place, New Delhi)",
  branches: [
    { id: "br_01", name: "Main HQ Council Office", address: "Flat 40B, Inner Circle, Connaught Place, New Delhi - 110001", lat: 28.6304, lng: 77.2177, phone: "+91 98765 43210" },
    { id: "br_02", name: "South Delhi Vastu Ashram", address: "Sector 5, RK Puram, New Delhi - 110022", lat: 28.5701, lng: 77.1852, phone: "+91 87654 32109" },
    { id: "br_03", name: "Noida Spiritual Remedial Hub", address: "Tower C, Sector 62, Noida, Uttar Pradesh - 201301", lat: 28.6253, lng: 77.3719, phone: "+91 76543 21098" }
  ]
};

export const defaultContactInfo: ContactInfo = {
  title: "Contact Details",
  description: "Reach out to Acharya TN Khurana for personal consultations, media enquiries, or spiritual guidance.",
  address: "New Delhi, India – 110001",
  hours: "Mon–Sat: 9 AM – 8 PM IST"
};

export const defaultServices: Service[] = [
  { id: "s1", icon: "🔮", name: "Kundli Reading", desc: "Detailed birth chart analysis with career, health, and relationship predictions", price: "₹2,100", category: "Astrology", duration: "45 mins", active: true },
  { id: "s2", icon: "💑", name: "Marriage Matching", desc: "Kundli matching & compatibility analysis to ensure long-term marital bliss", price: "₹3,500", category: "Astrology", duration: "60 mins", active: true },
  { id: "s3", icon: "💼", name: "Career Astrology", desc: "Job, business expansions, and financial roadmap guidance using your dasha systems", price: "₹2,500", category: "Career", duration: "45 mins", active: true },
  { id: "s4", icon: "❤️", name: "Love Problems", desc: "Vedic astrological solutions to resolve love, family, and relationship conflicts", price: "₹1,500", category: "Relationship", duration: "30 mins", active: true },
  { id: "s5", icon: "🃏", name: "Tarot Reading", desc: "Insightful Tarot spreads for immediate questions and intuitive psychic guidance", price: "₹1,100", category: "Tarot", duration: "30 mins", active: true },
  { id: "s6", icon: "🔢", name: "Numerology", desc: "Life path numbers, name corrections, and mobile number predictions for favorable energy", price: "₹1,800", category: "Numerology", duration: "30 mins", active: true },
  { id: "s7", icon: "🏛", name: "Vastu Consultation", desc: "Vastu Shastra corrections for residential and commercial spaces to clear negative energy", price: "₹4,500", category: "Vastu", duration: "90 mins", active: true },
  { id: "s8", icon: "💎", name: "Gemstone Guidance", desc: "Precise recommendations on which precious gemstones to wear for enhancing weak planets", price: "₹1,200", category: "Remedy", duration: "30 mins", active: true }
];

export const defaultWhyCards: WhyChooseUsItem[] = [
  { id: "w1", num: "01", icon: "📜", title: "30+ Years of Mastery", text: "Three decades of dedicated study and practice in Vedic Jyotish Shastra, Numerology, Vastu and Spiritual Healing." },
  { id: "w2", num: "02", icon: "🎯", title: "93% Accuracy Record", text: "Thousands of verified predictions across career, marriage, health and business with documented accuracy." },
  { id: "w3", num: "03", icon: "🌍", title: "Global Clientele", text: "Trusted by clients across 60+ countries from India to USA, UK, Canada, Australia and beyond." },
  { id: "w4", num: "04", icon: "📺", title: "Media Authority", text: "Featured on Aaj Tak, Zee News, India TV, ABP Live as a recognized astronomy expert." },
  { id: "w5", num: "05", icon: "🔒", title: "100% Confidential", text: "All consultations are strictly private and confidential. Your details are never shared with anyone." },
  { id: "w6", num: "06", icon: "🤖", title: "AI-Enhanced Insights", text: "Combining ancient Vedic wisdom with modern AI technology for deeper, more personalized predictions." }
];

export const defaultTestimonials: Testimonial[] = [
  { id: "t1", text: "Acharya Khurana's Kundli reading changed my life. His prediction about my career transition was spot on. Got promoted within 3 months of following his remedies!", stars: 5, name: "Priya Sharma", location: "Mumbai, India", service: "Kundli Reading", initials: "PS" },
  { id: "t2", text: "I was skeptical initially, but his Marriage Matching analysis revealed things about my partner and me that were astonishing. Our relationship has improved tremendously.", stars: 5, name: "Rajesh Kumar", location: "Delhi, India", service: "Marriage Matching", initials: "RK" },
  { id: "t3", text: "Consulted him from Canada about business expansion. His Vastu and planetary guidance was incredibly accurate. Our business revenue doubled in one year!", stars: 5, name: "Neha Patel", location: "Toronto, Canada", service: "Business Astrology", initials: "NP" },
  { id: "t4", text: "After years of struggles in my career, Acharya ji's guidance helped me identify the right path. The gemstone he recommended brought immediate positive changes.", stars: 5, name: "Arun Mishra", location: "Bangalore, India", service: "Career Astrology", initials: "AM" }
];

export const defaultZodiac: ZodiacForecast[] = [
  { sign: "♈", name: "Aries", dates: "Mar 21–Apr 19", reading: "Mars energizes your ambitions today. A financial opportunity presents itself — act decisively. Relationships demand patience. Lucky color: Red.", rating: "⭐⭐⭐⭐⭐", ratings: [{label:"Career",val:90},{label:"Love",val:75},{label:"Finance",val:85}] },
  { sign: "♉", name: "Taurus", dates: "Apr 20–May 20", reading: "Venus blesses your relationships with warmth. Focus on creative projects for maximum gains. Avoid major investments today. Lucky stone: Emerald.", rating: "⭐⭐⭐⭐", ratings: [{label:"Career",val:70},{label:"Love",val:90},{label:"Finance",val:65}] },
  { sign: " Gemini", name: "Gemini", dates: "May 21–Jun 20", reading: "Mercury sharpens your communication skills. An important conversation brings clarity. Keep your plans flexible. Lucky number: 5.", rating: "⭐⭐⭐⭐", ratings: [{label:"Career",val:85},{label:"Love",val:70},{label:"Finance",val:80}] },
  { sign: "♋", name: "Cancer", dates: "Jun 21–Jul 22", reading: "Moon heightens your intuition. Home and family matters take priority. Trust your gut on important decisions. Lucky day: Monday.", rating: "⭐⭐⭐⭐⭐", ratings: [{label:"Career",val:75},{label:"Love",val:85},{label:"Finance",val:70}] },
  { sign: "♌", name: "Leo", dates: "Jul 23–Aug 22", reading: "Sun radiates confidence through you today. Leadership opportunities arise. Romance is favored after evening. Lucky gem: Ruby.", rating: "⭐⭐⭐⭐⭐", ratings: [{label:"Career",val:95},{label:"Love",val:80},{label:"Finance",val:85}] },
  { sign: "♍", name: "Virgo", dates: "Aug 23–Sep 22", reading: "Mercury brings analytical clarity. Details matter today — review all documents carefully. Health needs attention. Lucky color: Green.", rating: "⭐⭐⭐⭐", ratings: [{label:"Career",val:80},{label:"Love",val:65},{label:"Finance",val:75}] },
  { sign: "♎", name: "Libra", dates: "Sep 23–Oct 22", reading: "Venus harmonizes your social world. Balance is your strength today. Legal matters get resolved favorably. Lucky number: 6.", rating: "⭐⭐⭐⭐", ratings: [{label:"Career",val:70},{label:"Love",val:90},{label:"Finance",val:75}] },
  { sign: "♏", name: "Scorpio", dates: "Oct 23–Nov 21", reading: "Mars and Pluto intensify your focus. Deep transformation is underway. Hidden information comes to light. Lucky stone: Red Coral.", rating: "⭐⭐⭐⭐⭐", ratings: [{label:"Career",val:85},{label:"Love",val:80},{label:"Finance",val:90}] },
  { sign: "♐", name: "Sagittarius", dates: "Nov 22–Dec 21", reading: "Jupiter expands your horizons. Travel or higher education is highlighted. Philosophical discussions inspire you. Lucky day: Thursday.", rating: "⭐⭐⭐⭐", ratings: [{label:"Career",val:80},{label:"Love",val:75},{label:"Finance",val:85}] },
  { sign: "♑", name: "Capricorn", dates: "Dec 22–Jan 19", reading: "Saturn rewards your discipline and hard work. Professional recognition is near. Maintain work-life balance. Lucky gem: Blue Sapphire.", rating: "⭐⭐⭐⭐⭐", ratings: [{label:"Career",val:90},{label:"Love",val:70},{label:"Finance",val:80}] },
  { sign: " Aquarius", name: "Aquarius", dates: "Jan 20–Feb 18", reading: "Uranus sparks innovation and creativity. Join community activities for networking. Technology projects thrive today. Lucky color: Blue.", rating: "⭐⭐⭐⭐", ratings: [{label:"Career",val:85},{label:"Love",val:75},{label:"Finance",val:70}] },
  { sign: "♓", name: "Pisces", dates: "Feb 19–Mar 20", reading: "Neptune deepens your spiritual connections. Meditation and prayer bring profound insights. Artistic expression is rewarded. Lucky stone: Pearl.", rating: "⭐⭐⭐⭐", ratings: [{label:"Career",val:70},{label:"Love",val:85},{label:"Finance",val:65}] }
];

export const defaultPanchang: PanchangData = {
  tithi: "Shukla Ekadashi (Devutthana Ekadashi)",
  samvat: "Vikram Samvat 2081 / Saka 1946",
  nakshatra: "Uttara Ashadha",
  nakshatraLord: "Sun",
  yoga: "Harshana",
  karana: "Vanija",
  sunrise: "05:32 AM IST",
  sunset: "07:21 PM IST",
  moonSign: "Capricorn",
  rahukalam: "03:00 PM – 04:30 PM (Auspicious tasks prohibited)",
  auspicious: "11:45 AM – 12:35 PM (Abhijit Muhurat)",
  gulikal: "12:00 PM – 01:30 PM (Favorable energy)"
};

export const defaultReports: PremiumReport[] = [
  { id: "rep1", icon: "🔮", name: "Comprehensive Kundli Report", price: "₹2,100", orig: "₹4,500", desc: "A detailed 50+ page customized report tracing your Dasha timelines, planetary transits, gem remedies, and career paths." },
  { id: "rep2", icon: "📅", name: "Annual Varshphal Report 2025", price: "₹1,500", orig: "₹3,000", desc: "Your tailored year-ahead forecast. Month-by-month analysis of love, finance, career transitions, and auspicious periods." },
  { id: "rep3", icon: "💑", name: "Devi Matchmaking Report", price: "₹3,500", orig: "₹7,000", desc: "Ashta Koota and Guna Milan report with detailed remedies for Doshas like Manglik and Nadi Dosha." },
  { id: "rep4", icon: "🏛", name: "Personalized Vastu Blueprint", price: "₹2,500", orig: "₹5,000", desc: "A practical guide to balancing directional energies in your home or work space. Non-demolition remedies included." }
];

export const defaultBlog: BlogPost[] = [
  {
    id: "b1",
    icon: "🔮",
    category: "Vedic Wisdom",
    title: "How to Read Your Birth Chart: A Complete Beginner's Guide",
    excerpt: "Understanding the 12 houses, planetary placements, and their immediate impact on your spiritual and career lifecycle through Vedic Jytoshi.",
    content: "### Introduction to Vedic Astrology\nIn Vedic Astrology (Jyotish), the birth chart or Kundli is a snapshot of the heavens at the exact moment of your birth. This map is divided into **12 Houses**, representing different arenas of life such as self, wealth, siblings, mother, children, health, marriage, longevity, destiny, career, gains, and expenses.\n\n### The Ascendant (Lagna)\nThe first house represents your self, personality, and physical health. The sign ruling this house is called your **Lagna** or Ascendant, which lays the foundation of your entire chart.\n\n### The Planets (Grahas)\nEach planet brings specific planetary energy. Jupiter rules wisdom and expansion, Saturn dictates karma and duty, Venus represents love and vehicles, and Mars commands physical drives. Understanding where these planets reside in your chart helps forecast events accurately.",
    date: "June 5, 2026",
    readTime: "8 min",
    author: "Acharya TN Khurana",
    status: "published",
    tags: ["Kundli", "Astrology 101", "Vedic Science"]
  },
  {
    id: "b2",
    icon: "🪐",
    category: "Transits",
    title: "Saturn's Transit 2026: Major Opportunities and Warning Signs",
    excerpt: "Saturn transit governs the grand karmic timeline. Learn about the impact of Shani Dhaiya & Sade Sati on your financial year.",
    content: "### Saturn: The Karmic Overseer\nSaturn is often misunderstood as a negative planet, but in truth, it is the Lord of Justice (Dharmaraja) that rewards hard work, sincerity, and discipline. When Saturn transits, it tests your patience and structures your foundations.\n\n### Sade Sati & Dhaiya\n- **Sade Sati** is the 7.5-year cycle when Saturn passes through the house preceding your Moon sign, your Moon sign, and the house following it.\n- **Dhaiya** is a shorter 2.5-year phase affecting the 4th and 8th houses from the Moon. It demands strict structural audits of your relationships and real estate investments.",
    date: "June 2, 2026",
    readTime: "12 min",
    author: "Acharya TN Khurana",
    status: "published",
    tags: ["Saturn Transit", "Shani", "Sade Sati", "Remedies"]
  },
  {
    id: "b3",
    icon: "💎",
    category: "Remedial Sciences",
    title: "Which Gemstone Should You Wear? Secrets of Astro-Gemology",
    excerpt: "A comprehensive guide on planetary matching, metal selection, and purifying methods for diamonds, Rubies, and Sapphires.",
    content: "### Gems as Cosmic Filters\nIn Vedic culture, gemstones act as natural optical filters that attract positive planetary radiation. Wearing the incorrect gemstone can aggravate negative energies in your chart.\n\n### Gemstone Rules\n1. **Do not wear gemstones of ruling malefic planets** (the 6th, 8th, or 12th lords in your chart).\n2. **Wear gems representing your favorable house lords** (specifically the 1st, 5th, and 9th lords).\n3. **Purification:** Soak the gemstone in raw cow milk and Gangajal on a designated day, then activate it using its respective planetary mantra.",
    date: "May 28, 2026",
    readTime: "10 min",
    author: "Acharya TN Khurana",
    status: "published",
    tags: ["Gemstones", "Remedies", "Rahu", "Ruby"]
  }
];

export const defaultFAQs: FAQItem[] = [
  { id: "f1", q: "How accurate are Acharya Khurana's predictions?", a: "With more than 30 years of training and personal experience consulting over 1.5 lakh individuals worldwide, Acharya TN Khurana's predictions are based on precise mathematical calculations of Vedic Jyotish systems, maintaining a verified accuracy of over 93% on major life events." },
  { id: "f2", q: "What details do I need to map my accurate Kundli?", a: "To generate a accurate Kundli (birth map), we require your exact: (1) Date of Birth, (2) Time of Birth (AM/PM as accurately as possible), and (3) Place of Birth (City, State, and Country)." },
  { id: "f3", q: "What should I expect during a 1-on-1 personal consultation?", a: "You will receive a confidential, highly personalized session. Acharya TN Khurana will thoroughly examine your chart, identify Dasha timelines, analyze your concerns, and suggest practical remedies (such as specific mantras, charities, Vastu, or gemstones)." },
  { id: "f4", q: "Are your remedial Vastu and Astrology guidelines difficult to follow?", a: "No. Acharya Khurana strongly advocates for simple, practical, modern, and non-destructive remedies. The remedies generally involve positive lifestyle discipline, mental exercises, specific charities, chants, or simple directional modifications." }
];

export const defaultBooks: Book[] = [
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

export const defaultCoupons: Coupon[] = [
  { id: "cp_1", code: "VEDIC10", discountType: "percentage", value: 10, active: true },
  { id: "cp_2", code: "SHANTI50", discountType: "fixed", value: 50, active: true },
  { id: "cp_3", code: "GURU20", discountType: "percentage", value: 20, active: false }
];

export const defaultOrders: Order[] = [
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

export const defaultSectionOrders: SectionOrder[] = [
  { id: 'hero', name: 'Hero Banner', visible: true },
  { id: 'trust', name: 'Trust Stats', visible: true },
  { id: 'services', name: 'Sacred Services', visible: true },
  { id: 'books', name: 'Sacred Book Store', visible: true },
  { id: 'about', name: 'Meet Acharya Bio', visible: true },
  { id: 'why', name: 'Why Certified', visible: true },
  { id: 'testimonials', name: 'Testimonials', visible: true },
  { id: 'horoscope', name: 'Zodiac Horoscopes', visible: true },
  { id: 'panchang', name: 'Hindu Daily Panchang', visible: true },
  { id: 'ai-features', name: 'AI Kundli Engine', visible: true },
  { id: 'reports', name: 'Astrological Reports', visible: true },
  { id: 'blog', name: 'Vedic Blogs', visible: true },
  { id: 'faq', name: 'Frequently Asked Questions', visible: true },
  { id: 'contact', name: 'Lead Form & Contacts', visible: true }
];

export const defaultTheme: ThemeConfig = {
  mode: 'dark',
  palette: 'default',
  primaryColor: '#C9A227',
  secondaryColor: '#7C5CFC',
  backgroundColor: '#080B12',
  borderRadius: 'rounded-2xl',
  shadows: 'shadow-2xl',
  headerStyle: 'glass',
  footerStyle: 'cosmic'
};

// Local storage management to enable offline-ready data persistence
const STORAGE_KEY = 'acharya_khurana_cms_data';

export const getInitialBackupData = (): BackupData => {
  return {
    version: "2.1.0",
    timestamp: new Date().toISOString(),
    site: defaultSiteConfig,
    hero: defaultHeroContent,
    about: defaultAboutContent,
    contactInfo: defaultContactInfo,
    services: defaultServices,
    whyCards: defaultWhyCards,
    testimonials: defaultTestimonials,
    zodiac: defaultZodiac,
    panchang: defaultPanchang,
    reports: defaultReports,
    blog: defaultBlog,
    faqs: defaultFAQs,
    theme: defaultTheme,
    sectionOrders: defaultSectionOrders,
    books: defaultBooks,
    coupons: defaultCoupons,
    orders: defaultOrders,
    pageSeo: defaultPageSeo,
    whatsapp: defaultWhatsApp,
    googleMaps: defaultGoogleMaps
  };
};

export const getCMSData = (): BackupData => {
  const local = localStorage.getItem(STORAGE_KEY);
  if (local) {
    try {
      const parsed = JSON.parse(local) as BackupData;
      if (!parsed.books || parsed.books.length === 0) parsed.books = defaultBooks;
      if (!parsed.coupons || parsed.coupons.length === 0) parsed.coupons = defaultCoupons;
      if (!parsed.orders || parsed.orders.length === 0) parsed.orders = defaultOrders;
      if (!parsed.pageSeo || parsed.pageSeo.length === 0) parsed.pageSeo = defaultPageSeo;
      if (!parsed.whatsapp) parsed.whatsapp = defaultWhatsApp;
      if (!parsed.googleMaps) parsed.googleMaps = defaultGoogleMaps;
      if (!parsed.about.image) {
        parsed.about.image = defaultAboutContent.image;
      }
      if (!parsed.about.biography) {
        parsed.about.biography = defaultAboutContent.biography;
        parsed.about.mission = defaultAboutContent.mission;
        parsed.about.vision = defaultAboutContent.vision;
        parsed.about.experience = defaultAboutContent.experience;
        parsed.about.achievements = defaultAboutContent.achievements;
        parsed.about.certifications = defaultAboutContent.certifications;
        parsed.about.team = defaultAboutContent.team;
        parsed.about.timeline = defaultAboutContent.timeline;
        parsed.about.videoUrl = defaultAboutContent.videoUrl;
      }
      if (!parsed.sectionOrders.some(s => s.id === 'books')) {
        const idx = parsed.sectionOrders.findIndex(s => s.id === 'about');
        if (idx !== -1) {
          parsed.sectionOrders.splice(idx, 0, { id: 'books', name: 'Sacred Book Store', visible: true });
        } else {
          parsed.sectionOrders.push({ id: 'books', name: 'Sacred Book Store', visible: true });
        }
      }
      return parsed;
    } catch (e) {
      console.error("Failed to parse local storage data, reverting to defaults.", e);
    }
  }
  
  const initialData = getInitialBackupData();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
  return initialData;
};

export const saveCMSData = (data: BackupData): void => {
  data.timestamp = new Date().toISOString();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const getLeads = (): Lead[] => {
  const local = localStorage.getItem('acharya_khurana_leads');
  if (local) {
    try {
      return JSON.parse(local);
    } catch {
      return [];
    }
  }
  
  // Seed sample leads for CRM simulation on first load
  const seedLeads: Lead[] = [
    {
      id: "lead_01",
      name: "Siddharth Malhotra",
      phone: "+91 98765 43210",
      email: "sid.malhotra@gmail.com",
      service: "marriage-matching",
      date: "1994-01-16",
      time: "08:15",
      place: "New Delhi, India",
      message: "Looking for matrimonial compatibility with my prospective partner's Kundli.",
      status: "Contacted",
      notes: "Called on June 7. Scheduled Kundli matching session for tomorrow at 11 AM.",
      bookingDate: "2026-06-10",
      bookingTime: "11:00 AM",
      amountPaid: "₹3,500",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: "lead_02",
      name: "Meenakshi Iyer",
      phone: "+91 87654 32109",
      email: "meena.iyer@yahoo.com",
      service: "career-astrology",
      date: "1988-11-23",
      time: "14:45",
      place: "Chennai, Tamil Nadu",
      message: "Facing delay in promotions. Need remedial guidance in Shani transit.",
      status: "New",
      notes: "Awaiting birth hour confirmation from parent.",
      createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
    },
    {
      id: "lead_03",
      name: "Richard Peterson",
      phone: "+1 650 555 0199",
      email: "richard.p@astrocorp.com",
      service: "Business Astrology",
      date: "1975-04-02",
      time: "23:10",
      place: "San Francisco, USA",
      message: "Opening a new tech firm in London. Need perfect launch Muhurat and Vastu tips.",
      status: "Consulted",
      notes: "Successfully consulted. Provided Abhijit Muhurats and structural Vastu blueprint.",
      bookingDate: "2026-06-05",
      bookingTime: "4:00 PM",
      amountPaid: "₹5,500",
      createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];
  localStorage.setItem('acharya_khurana_leads', JSON.stringify(seedLeads));
  return seedLeads;
};

export const saveLeads = (leads: Lead[]): void => {
  localStorage.setItem('acharya_khurana_leads', JSON.stringify(leads));
};

export const getActivityLogs = (): ActivityLog[] => {
  const local = localStorage.getItem('acharya_khurana_activity_logs');
  if (local) {
    try {
      return JSON.parse(local);
    } catch {
      return [];
    }
  }

  const seedLogs: ActivityLog[] = [
    { id: "log_01", user: "kanika9694@gmail.com", action: "SEO METADATA UPDATE", details: "Optimized title tags and added structured schema markup for canonical URL.", timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString() },
    { id: "log_02", user: "kanika9694@gmail.com", action: "THEME PALETTE CHANGED", details: "Changed complete theme profile from default to Cosmic Purple with 12px rounded borders.", timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString() },
    { id: "log_03", user: "kanika9694@gmail.com", action: "NEW HERO CONTENT", details: "Updated hero headline text from 'My Google AI Studio' to 'Acharya TN Khurana'.", timestamp: new Date(Date.now() - 1000 * 60 * 600).toISOString() }
  ];
  localStorage.setItem('acharya_khurana_activity_logs', JSON.stringify(seedLogs));
  return seedLogs;
};

export const logActivity = (action: string, details: string, user: string = "kanika9694@gmail.com"): void => {
  const logs = getActivityLogs();
  const nextLog: ActivityLog = {
    id: `log_${Date.now()}`,
    user,
    action,
    details,
    timestamp: new Date().toISOString()
  };
  logs.unshift(nextLog);
  localStorage.setItem('acharya_khurana_activity_logs', JSON.stringify(logs.slice(0, 100))); // Keep last 100 logs
};
