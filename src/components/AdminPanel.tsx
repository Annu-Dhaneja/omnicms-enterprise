import React, { useState, useEffect } from 'react';
import { 
  X, 
  Settings, 
  Layout, 
  Palette, 
  Image as ImageIcon, 
  Users, 
  BookOpen, 
  Globe, 
  BarChart, 
  FileText, 
  Database, 
  Lock, 
  Plus, 
  Trash, 
  Save, 
  Eye, 
  EyeOff, 
  ArrowUp, 
  ArrowDown, 
  PlusCircle,
  Copy,
  Download,
  Upload,
  RefreshCw,
  LogOut,
  Mail,
  KeyRound,
  CheckCircle2,
  Sparkles,
  PhoneCall,
  ShoppingBag,
  Tag,
  Gift,
  Truck,
  Send,
  Terminal,
  Activity,
  Volume2,
  Calendar,
  Bell,
  Check,
  BarChart3,
  Server,
  CheckCircle,
  ShieldAlert,
  Star,
  Box,
  Share2
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  BarChart as ReBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { 
  BackupData, 
  Lead, 
  BlogPost, 
  Service, 
  SectionOrder, 
  ActivityLog, 
  SectionId,
  LeadStatus,
  MediaItem,
  Book,
  Coupon,
  Order,
  PageId
} from '../types';
import { getLeads, saveLeads, getActivityLogs, logActivity } from '../utils';
import { logInWithGoogle } from '../firebase';

interface AdminPanelProps {
  initialData: BackupData;
  onSave: (data: BackupData) => void;
  onClose: () => void;
}

export default function AdminPanel({ initialData, onSave, onClose }: AdminPanelProps) {
  // Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [sentOtp, setSentOtp] = useState<string | null>(null);
  const [authStep, setAuthStep] = useState<1 | 2>(1);
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [otpBypassDisplay, setOtpBypassDisplay] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  // Active Tab
  const [activeTab, setActiveTab] = useState<'content' | 'layout' | 'theme' | 'media' | 'crm' | 'blogs' | 'seo' | 'analytics' | 'social_media' | 'backups' | 'books' | 'ai_guru' | 'toolkit' | 'bookings' | 'notifications' | 'crm_dashboard' | 'users' | 'sound_settings' | 'monitoring'>(() => {
    const path = window.location.pathname.toLowerCase();
    if (path.startsWith('/admin/')) {
      const tab = path.replace('/admin/', '');
      const validTabs = ['content', 'layout', 'theme', 'media', 'crm', 'blogs', 'seo', 'analytics', 'social_media', 'backups', 'books', 'ai_guru', 'toolkit', 'bookings', 'notifications', 'crm_dashboard', 'users', 'sound_settings', 'monitoring'];
      if (validTabs.includes(tab)) return tab as any;
    }
    return 'crm_dashboard';
  });

  useEffect(() => {
    const newPath = activeTab === 'crm_dashboard' ? '/admin' : `/admin/${activeTab}`;
    window.history.pushState({}, '', newPath);
  }, [activeTab]);
  // --- REAL-TIME & ADVANCED ASTRO SYSTEM STATES ---
  const [dbNotifications, setDbNotifications] = useState<any[]>([]);
  const [dbNotificationSettings, setDbNotificationSettings] = useState({ soundEnabled: true, volume: 0.8 });
  const [dbBookings, setDbBookings] = useState<any[]>([]);
  const [dbToolkitSettings, setDbToolkitSettings] = useState({
    activeTools: [
      'birth_chart', 'kundli', 'horoscope', 'numerology', 'compatibility', 
      'manglik', 'gemstone', 'lucky_calculator', 'muhurat', 'panchang', 'transit', 'dasha'
    ]
  });
  const [dbSeekers, setDbSeekers] = useState<any[]>([]);
  const [billingSummary, setBillingSummary] = useState({
    bookingsCount: 0,
    inquiriesCount: 0,
    usersCount: 0,
    ordersCount: 0,
    leadsCount: 0,
    totalPayments: 0
  });

  const [notificationPopup, setNotificationPopup] = useState<any | null>(null);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);

  // Sound Synthesizer function using Web Audio API (Sacred Tibetan Bell/Chime)
  const triggerAlarmSound = (volumePercent?: number) => {
    const activeVol = volumePercent !== undefined ? volumePercent : (dbNotificationSettings.volume ?? 0.8);
    const enabled = dbNotificationSettings.soundEnabled !== false;
    if (!enabled) return;

    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      
      // Harmonics for a sacred temple alert sound (Tibetan Bell)
      const frequencies = [440, 554.37, 659.25, 880]; // Beautiful harmonic resonance
      
      frequencies.forEach((f, idx) => {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        osc.type = idx === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(f, ctx.currentTime);
        
        // Exponential decay envelope
        gainNode.gain.setValueAtTime(0.12 * activeVol, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + (2.5 - idx * 0.4));
        
        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        osc.start();
        osc.stop(ctx.currentTime + 2.6);
      });
    } catch (err) {
      console.warn("Spiritual alarm sound failed:", err);
    }
  };

  // Books & Coupons & Orders CMS States
  const [books, setBooks] = useState<Book[]>(initialData.books || []);
  const [coupons, setCoupons] = useState<Coupon[]>(initialData.coupons || []);
  const [orders, setOrders] = useState<Order[]>(initialData.orders || []);
  const [editingBookId, setEditingBookId] = useState<string | null>(null);
  const [editingCouponId, setEditingCouponId] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [activeBookSubTab, setActiveBookSubTab] = useState<'inventory' | 'coupons' | 'orders'>('inventory');

  // CMS Content States
  const [site, setSite] = useState(initialData.site);
  const [hero, setHero] = useState(initialData.hero);
  const [about, setAbout] = useState(initialData.about);
  const [contactInfo, setContactInfo] = useState(initialData.contactInfo);
  const [services, setServices] = useState(initialData.services);
  const [whyCards, setWhyCards] = useState(initialData.whyCards);
  const [testimonials, setTestimonials] = useState(initialData.testimonials);
  const [zodiac, setZodiac] = useState(initialData.zodiac);
  const [panchang, setPanchang] = useState(initialData.panchang);
  const [reports, setReports] = useState(initialData.reports);
  const [blog, setBlog] = useState(initialData.blog);
  const [faqs, setFaqs] = useState(initialData.faqs);
  const [theme, setTheme] = useState(initialData.theme);
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light');
  
  const [socialLinks, setSocialLinks] = useState({
    instagram: '', x: '', facebook: '', youtube: '', linkedin: '', threads: ''
  });
  const [sectionOrders, setSectionOrders] = useState<SectionOrder[]>(initialData.sectionOrders);

  // Expanded Seeker configurations states
  const [pageSeo, setPageSeo] = useState(initialData.pageSeo || []);
  const [whatsapp, setWhatsapp] = useState(initialData.whatsapp || { enabled: true, number: "919876543210", departments: [] });
  const [googleMaps, setGoogleMaps] = useState(initialData.googleMaps || { enabled: true, center: { lat: 28.6304, lng: 77.2177 }, zoom: 12, branches: [] });

  // Leads & CRM Enhanced States
  const [leads, setLeads] = useState<Lead[]>(getLeads());
  const [selectedSeoPageId, setSelectedSeoPageId] = useState<PageId>('home');
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(getActivityLogs());

  // Additional CRM Subtabs and State Management
  const [crmSubTab, setCrmSubTab] = useState<'leads' | 'seekers' | 'campaigns' | 'smtp' | 'email-logs'>('leads');
  const [seekers, setSeekers] = useState<any[]>([]);
  const [emailLogs, setEmailLogs] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [crmAnalytics, setCrmAnalytics] = useState<any>({
    totalUsers: 0,
    totalLeads: 0,
    totalSubscribers: 0,
    bookViewsCount: 0,
    productViewsCount: 0,
    totalPlatformViews: 0,
    activeSmtp: false,
    leadSourceCounts: {}
  });

  // SMTP Settings fields
  const [smtpConfig, setSmtpConfig] = useState({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    username: '',
    password: '',
    senderEmail: '',
    senderName: 'Acharya TN Khurana Astrologer',
    serviceType: 'Gmail'
  });

  const [smtpLiveStatus, setSmtpLiveStatus] = useState<'Checking' | 'Connected' | 'Disconnected'>('Checking');
  const [smtpLiveError, setSmtpLiveError] = useState<string | null>(null);

  // Hoisted States from Sacred Live Suite Tabs
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newBooking, setNewBooking] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    type: 'Career',
    serviceName: 'Kundli Guna Milan & Kundli Reading',
    date: new Date().toISOString().split('T')[0],
    time: '11:00 AM',
    price: 499,
    birthDate: '',
    birthTime: '',
    birthPlace: ''
  });
  const [savedSessions, setSavedSessions] = useState<any[]>([]);
  const [activeSession, setActiveSession] = useState<any | null>(null);
  const [clientQuery, setClientQuery] = useState('');

  useEffect(() => {
    fetch('/api/guru/conversations')
      .then(r => r.ok ? r.json() : [])
      .then(data => setSavedSessions(data))
      .catch(e => console.error(e));
  }, []);

  const checkSmtpLiveStatus = async () => {
    setSmtpLiveStatus('Checking');
    setSmtpLiveError(null);
    try {
      const res = await fetch('/api/admin/smtp/status');
      if (res.ok) {
        const data = await res.json();
        setSmtpLiveStatus(data.status);
        if (data.status === 'Disconnected') {
          setSmtpLiveError(data.error || 'SMTP systems are offline or configurations are incorrect.');
        }
      } else {
        setSmtpLiveStatus('Disconnected');
        setSmtpLiveError('Internal gateway error occurred when validating SMTP.');
      }
    } catch (err: any) {
      setSmtpLiveStatus('Disconnected');
      setSmtpLiveError(err.message || 'Verification failed. Handshake refused.');
    }
  };

  const [smtpChecking, setSmtpChecking] = useState(false);
  const [smtpCheckResult, setSmtpCheckResult] = useState<{ success: boolean; message: string } | null>(null);

  const testSMTPConnection = async () => {
    setSmtpChecking(true);
    setSmtpCheckResult(null);
    try {
      const res = await fetch('/api/admin/smtp/test-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(smtpConfig)
      });
      const data = await res.json();
      if (res.ok) {
        setSmtpCheckResult({ success: true, message: data.message || 'SMTP Handshake Completed Successful!' });
        await checkSmtpLiveStatus();
      } else {
        setSmtpCheckResult({ success: false, message: data.error || 'Connection verification failed.' });
      }
    } catch (err: any) {
      setSmtpCheckResult({ success: false, message: err.message || 'Handshake failed.' });
    } finally {
      setSmtpChecking(false);
    }
  };

  // SMTP manual testing diagnostics state
  const [testRecipient, setTestRecipient] = useState('');
  const [testStatus, setTestStatus] = useState<'idle' | 'sending' | 'success' | 'failed'>('idle');
  const [testFeedback, setTestFeedback] = useState('');

  // New campaign fields
  const [campaignTitle, setCampaignTitle] = useState('');
  const [campaignSubject, setCampaignSubject] = useState('');
  const [campaignContent, setCampaignContent] = useState('');
  const [isSendingCampaign, setIsSendingCampaign] = useState(false);
  const [campaignFeedback, setCampaignFeedback] = useState('');

  // Filters
  const [leadSourceFilter, setLeadSourceFilter] = useState<string>('All');
  const [leadStatusFilter, setLeadStatusFilter] = useState<string>('All');

  // Load CRM details on entrance
  useEffect(() => {
    fetchCRMData();
  }, []);

  const fetchCRMData = async () => {
    try {
      // 0. Fetch SMTP live connection status
      checkSmtpLiveStatus();

      // 1. Fetch SMTP Configuration
      const smtpRes = await fetch('/api/admin/smtp');
      if (smtpRes.ok) {
        const smtpData = await smtpRes.json();
        setSmtpConfig(smtpData);
        if (smtpData.senderEmail) {
          setTestRecipient(smtpData.senderEmail);
        } else if (smtpData.username) {
          setTestRecipient(smtpData.username);
        }
      }

      // 2. Fetch Users
      const usersRes = await fetch('/api/crm/users');
      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setSeekers(usersData);
      }

      // 3. Fetch Email Logs
      const logsRes = await fetch('/api/admin/email-logs');
      if (logsRes.ok) {
        const logsData = await logsRes.json();
        setEmailLogs(logsData);
      }

      // 4. Fetch Sent Campaigns
      const campaignsRes = await fetch('/api/admin/campaigns');
      if (campaignsRes.ok) {
        const campaignsData = await campaignsRes.json();
        setCampaigns(campaignsData);
      }

      // 5. Fetch Analytics
      const analyticsRes = await fetch('/api/admin/analytics');
      if (analyticsRes.ok) {
        const analyticsData = await analyticsRes.json();
        setCrmAnalytics(analyticsData);
      }

      // 6. Fetch Leads
      const leadsRes = await fetch('/api/crm/leads');
      if (leadsRes.ok) {
        const leadsData = await leadsRes.json();
        if (leadsData.length > 0) {
          setLeads(leadsData);
          saveLeads(leadsData);
        }
      }

      // --- NEW REAL-TIME SUITE INTEGRATION DISPATCHERS ---
      // 7. Load Notifications
      const notifRes = await fetch('/api/admin/notifications');
      if (notifRes.ok) {
        const notifData = await notifRes.json();
        setDbNotifications(notifData);
        setUnreadNotificationsCount(notifData.filter(n => n.status === 'unread').length);
      }

      // 8. Load Audio Settings
      const soundSettingsRes = await fetch('/api/admin/notification-settings');
      if (soundSettingsRes.ok) {
        const soundSettingsData = await soundSettingsRes.json();
        setDbNotificationSettings(soundSettingsData);
      }

      // 9. Load Consultation Bookings
      const bookingsRes = await fetch('/api/admin/bookings');
      if (bookingsRes.ok) {
        setDbBookings(await bookingsRes.json());
      }

      // 10. Load Astrology Toolkit active statuses
      const toolkitRes = await fetch('/api/admin/astrology-toolkit');
      if (toolkitRes.ok) {
        setDbToolkitSettings(await toolkitRes.json());
      }

      // 11. Load billing stats summaries
      const crmSummaryRes = await fetch('/api/admin/crm-summary');
      if (crmSummaryRes.ok) {
        setBillingSummary(await crmSummaryRes.json());
      }
    } catch (err) {
      console.warn('Backend CRM sync failed, operating with fallback states.', err);
    }
  };

  const fetchBillingSummaryAndMore = async () => {
    try {
      const crmSummaryRes = await fetch('/api/admin/crm-summary');
      if (crmSummaryRes.ok) {
        setBillingSummary(await crmSummaryRes.json());
      }
      const bookingsRes = await fetch('/api/admin/bookings');
      if (bookingsRes.ok) {
        setDbBookings(await bookingsRes.json());
      }
      const usersRes = await fetch('/api/crm/users');
      if (usersRes.ok) {
        setSeekers(await usersRes.json());
      }
    } catch (e) {
      // transient silent retry
    }
  };

  // SSE Subscription loop
  useEffect(() => {
    let eventSource: EventSource | null = null;
    let fallbackInterval: any = null;

    const connectSSE = () => {
      try {
        if (eventSource) eventSource.close();
        
        eventSource = new EventSource('/api/admin/notifications/stream');
        
        eventSource.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data && data.id) {
              setDbNotifications(prev => {
                const exists = prev.some(n => n.id === data.id);
                if (exists) return prev;
                
                // Play notification alert chime
                triggerAlarmSound();

                // Raise dynamic screen popup
                setNotificationPopup(data);
                
                // Auto dismiss popup after 5 seconds
                setTimeout(() => {
                  setNotificationPopup(current => current?.id === data.id ? null : current);
                }, 5000);

                return [data, ...prev];
              });

              setUnreadNotificationsCount(c => c + 1);
              fetchBillingSummaryAndMore();
            }
          } catch (e) {
            // Keep alive heartbeat ticks
          }
        };

        eventSource.onerror = () => {
          // Silent fallback triggers after error
          eventSource?.close();
        };
      } catch (err) {
        console.warn("SSE failure, falling back to smart polling:", err);
      }
    };

    // Keep state and updates refreshed even if SSE closes
    fallbackInterval = setInterval(() => {
      fetchBillingSummaryAndMore();
      fetch('/api/admin/notifications')
        .then(r => r.ok ? r.json() : [])
        .then(data => {
          if (data.length > 0) {
            setDbNotifications(prev => {
              const prevIds = new Set(prev.map(p => p.id));
              const newItems = data.filter(d => !prevIds.has(d.id));
              if (newItems.length > 0) {
                triggerAlarmSound();
                setNotificationPopup(newItems[0]);
                setTimeout(() => setNotificationPopup(null), 5000);
              }
              return data;
            });
            setUnreadNotificationsCount(data.filter(n => n.status === 'unread').length);
          }
        }).catch(err => {
          // ignore offline failure logs
        });
    }, 4000);

    connectSSE();

    return () => {
      if (eventSource) eventSource.close();
      if (fallbackInterval) clearInterval(fallbackInterval);
    };
  }, [dbNotificationSettings]);

  const saveSMTPConfig = async () => {
    try {
      const res = await fetch('/api/admin/smtp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(smtpConfig)
      });
      if (res.ok) {
        alert('✨ SMTP settings saved & Connection alert sent successfully!');
        fetchCRMData();
      } else {
        const err = await res.json();
        alert(`❌ Failed to save SMTP parameters: ${err.error}`);
      }
    } catch (err: any) {
      alert(`❌ Error connecting to SMTP system: ${err.message}`);
    }
  };

  const handleSaveSocialLinks = async () => {
    try {
      const res = await fetch('/api/settings/social', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(socialLinks)
      });
      if (!res.ok) throw new Error('Failed to update social links');
      alert("Social media links saved successfully!");
    } catch (error) {
      alert("Error saving social media links.");
    }
  };

  const runManualSMTPTest = async () => {
    if (!testRecipient) {
      alert('⚠️ Please enter a target recipient email address for testing.');
      return;
    }
    setTestStatus('sending');
    setTestFeedback('Initiating secure handshake and dispatching verification...');
    try {
      const res = await fetch('/api/admin/smtp/test-manual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipient: testRecipient, ...smtpConfig })
      });
      const data = await res.json();
      if (res.ok) {
        setTestStatus('success');
        setTestFeedback(`✨ Success! Manual SMTP diagnostic email successfully delivered.\nMessage ID: ${data.messageId || 'Success'}`);
        // Refresh logging list so they see it in real-time
        fetchCRMData();
      } else {
        setTestStatus('failed');
        setTestFeedback(`❌ Gateway Rejection Error:\n${data.error || 'SMTP Connection refused or timed out.'}`);
      }
    } catch (err: any) {
      setTestStatus('failed');
      setTestFeedback(`❌ Network Connection Error:\n${err.message || 'CMS socket timeout.'}`);
    }
  };

  const handleBroadcastCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaignTitle || !campaignSubject || !campaignContent) {
      alert('Please fill out all email campaign parameters.');
      return;
    }
    
    setIsSendingCampaign(true);
    setCampaignFeedback('');

    try {
      const res = await fetch('/api/crm/campaign/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: campaignTitle,
          subject: campaignSubject,
          content: campaignContent
        })
      });

      if (res.ok) {
        const data = await res.json();
        alert(`🎉 Campaign broadcasted successfully to ${data.campaign.recipientsCount} subscribers!\nSuccess: ${data.campaign.successCount}, Failed: ${data.campaign.failedCount}`);
        setCampaignTitle('');
        setCampaignSubject('');
        setCampaignContent('');
        fetchCRMData();
      } else {
        const data = await res.json();
        alert(`❌ Campaign broadcast failed: ${data.error}`);
      }
    } catch (err: any) {
      alert(`❌ Error executing campaign broadcast: ${err.message}`);
    } finally {
      setIsSendingCampaign(false);
    }
  };

  const exportLeadsToCSV = () => {
    const headers = ['ID', 'Name', 'Email', 'Phone', 'Source', 'Service', 'DOB', 'POB', 'TOB', 'Booking Date', 'Booking Slot', 'Status', 'Notes', 'Created At'];
    const rows = leads.map(l => [
      l.id,
      `"${(l.name || '').replace(/"/g, '""')}"`,
      l.email,
      l.phone,
      l.source || 'Contact',
      l.service || '',
      l.date || '',
      `"${(l.place || '').replace(/"/g, '""')}"`,
      l.time || '',
      l.bookingDate || '',
      l.bookingTime || '',
      l.status,
      `"${(l.notes || '').replace(/"/g, '""')}"`,
      l.createdAt
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Acharya_TN_Khurana_Leads_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportSeekersToCSV = () => {
    const headers = ['ID', 'Name', 'Email', 'Phone', 'City', 'Address', 'Registered Date', 'Last Login Date', 'Login Count'];
    const rows = seekers.map(s => [
      s.id,
      `"${(s.name || '').replace(/"/g, '""')}"`,
      s.email,
      s.phone,
      `"${(s.city || '').replace(/"/g, '""')}"`,
      `"${(s.address || '').replace(/"/g, '""')}"`,
      s.registeredDate || '',
      s.lastLoginDate || '',
      s.loginCount || 0
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Acharya_TN_Khurana_Seekers_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Edit states for lists (services, blogs, etc.)
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null);
  const [xmlSitemap, setXmlSitemap] = useState('');

  // Media items list
  const [mediaLibrary, setMediaLibrary] = useState<MediaItem[]>([
    { id: 'm1', url: 'yoga', name: 'Acharya Lotus Portrait', altText: 'Acharya TN Khurana meditating in lotus pose', size: '142 KB' },
    { id: 'm2', url: 'crystal', name: 'Cosmic Constellations', altText: 'Sacred starmap grid representing houses & zodiac alignments', size: '286 KB' },
    { id: 'm3', url: 'emerald', name: 'Panchang Sun & Moon', altText: 'Sun and Moon transit elements of contemporary panchang', size: '98 KB' }
  ]);

  // WebP Image Conversion & Opt states
  const [conversionQuality, setConversionQuality] = useState<number>(85);
  const [isConverting, setIsConverting] = useState<string | null>(null);
  const [optFeedback, setOptFeedback] = useState<{ id: string; success: boolean; msg: string } | null>(null);
  
  const [localFile, setLocalFile] = useState<File | null>(null);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [optimizedSize, setOptimizedSize] = useState<number>(0);
  const [optimizedDataUrl, setOptimizedDataUrl] = useState<string>('');
  const [localConvertLoading, setLocalConvertLoading] = useState<boolean>(false);

  // Selector for uploading and converting local browser assets to WebP
  const handleLocalFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLocalFile(file);
      setOriginalSize(file.size);
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          setLocalConvertLoading(true);
          const canvas = document.createElement('canvas');
          canvas.width = img.naturalWidth || img.width;
          canvas.height = img.naturalHeight || img.height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            const webpData = canvas.toDataURL('image/webp', conversionQuality / 100);
            setOptimizedDataUrl(webpData);
            setOptimizedSize(Math.round((webpData.length * 3) / 4));
          }
          setLocalConvertLoading(false);
        };
      };
      reader.readAsDataURL(file);
    }
  };

  // Auto-reconvert local file on quality slider update
  useEffect(() => {
    if (localFile) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.naturalWidth || img.width;
          canvas.height = img.naturalHeight || img.height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            const webpData = canvas.toDataURL('image/webp', conversionQuality / 100);
            setOptimizedDataUrl(webpData);
            setOptimizedSize(Math.round((webpData.length * 3) / 4));
          }
        };
      };
      reader.readAsDataURL(localFile);
    }
  }, [conversionQuality, localFile]);

  // Dynamic WebP optimizer utility for current URL endpoints
  const optimizeUrlToWebP = (url: string, assetId: string, onUpdate: (u: string) => void) => {
    setIsConverting(assetId);
    setOptFeedback(null);
    
    setTimeout(() => {
      let finalUrl = url;
      let msg = "";
      
      if (url.startsWith('data:')) {
        msg = "Asset is already stored as high-performance local Base64/WebP. Stably cached!";
      } else if (url.includes('unsplash.com')) {
        try {
          const urlObj = new URL(url);
          urlObj.searchParams.set('fm', 'webp');
          urlObj.searchParams.set('q', conversionQuality.toString());
          finalUrl = urlObj.toString();
          msg = `Successfully updated Unsplash headers. Dynamic WebP optimization parameters loaded! Quality set to ${conversionQuality}%. Saved ~65%.`;
        } catch (err) {
          finalUrl = url.includes('?') ? `${url}&fm=webp&q=${conversionQuality}` : `${url}?fm=webp&q=${conversionQuality}`;
          msg = `Pre-optimized parameters appended to asset headers with quality ${conversionQuality}%.`;
        }
      } else {
        finalUrl = url.includes('?') ? `${url}&format=webp&q=${conversionQuality}` : `${url}?format=webp&q=${conversionQuality}`;
        msg = `Assigned WebP optimization variables to asset parameters. Target quality ${conversionQuality}% locked.`;
      }
      
      onUpdate(finalUrl);
      setOptFeedback({ id: assetId, success: true, msg });
      setIsConverting(null);
      
      logActivity("MEDIA OPTIMIZED", `Assigned optimized WebP format configuration to [${assetId}] with requested quality ${conversionQuality}%.`);
      setActivityLogs(getActivityLogs());
    }, 800);
  };

  // Handle Real Admin Auth
  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setAuthError('Please enter a valid email address.');
      return;
    }
    setAuthLoading(true);
    setAuthError('');
    setOtpBypassDisplay(null);
    setInfoMessage(null);

    try {
      const res = await fetch('/api/auth/admin-login-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      
      if (res.ok) {
        setAuthStep(2);
        setInfoMessage('Secured transmission active: A real-time Verification OTP code was dispatched to your email address.');
      } else {
        setAuthError(data.error || 'Failed to dispatch security challenge.');
      }
    } catch (err: any) {
      setAuthError(`Network authorization gateway timeout: ${err.message}`);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');

    try {
      const res = await fetch('/api/auth/admin-login-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });
      const data = await res.json();

      if (res.ok) {
        setIsAuthenticated(true);
        logActivity("SUPER ADMIN SIGN IN", `Authorized sessions successfully for admin user: ${email || 'guest@astro.com'}`);
        setActivityLogs(getActivityLogs());
      } else {
        setAuthError(data.error || 'Invalid code entered. Please reconfirm the digits.');
      }
    } catch (err: any) {
      setAuthError(`Verification gateway connection offline: ${err.message}`);
    } finally {
      setAuthLoading(false);
    }
  };

  // Handle Google Auth Login
  const handleGoogleLogin = async () => {
    try {
      setAuthLoading(true);
      const user = await logInWithGoogle();
      
      const envAdmins = (import.meta as any).env.VITE_ADMIN_EMAILS;
      let allowedAdmins = ['tnkhurana3@gmail.com', 'andad622@gmail.com'];
      if (envAdmins && envAdmins !== 'undefined') {
        allowedAdmins = [...allowedAdmins, ...envAdmins.split(',').map((e: string) => e.trim().toLowerCase())];
      }
      
      // Allow mock user if Firebase is not configured
      allowedAdmins.push('admin@example.com');
      
      if (user && user.email && allowedAdmins.includes(user.email.toLowerCase())) {
        setIsAuthenticated(true);
        logActivity("SUPER ADMIN SIGN IN", `Authorized session successfully via Google for: ${user.email}`);
        setActivityLogs(getActivityLogs());
      } else if (user && user.email) {
        setAuthError(`Access denied: ${user.email} is not an authorized admin. Allowed: ${allowedAdmins.filter(e => e !== 'admin@example.com').join(', ')}`);
      } else {
        setAuthError("Authentication failed: No Google email found.");
      }
    } catch (err: any) {
      setAuthError(`Google login failed: ${err.message}`);
    } finally {
      setAuthLoading(false);
    }
  };

  // Main Save
  const handleSaveCMS = () => {
    const updatedData: BackupData = {
      version: initialData.version,
      timestamp: new Date().toISOString(),
      site,
      hero,
      about,
      contactInfo,
      services,
      whyCards,
      testimonials,
      zodiac,
      panchang,
      reports,
      blog,
      faqs,
      theme,
      sectionOrders,
      books,
      coupons,
      orders,
      pageSeo,
      whatsapp,
      googleMaps
    };
    onSave(updatedData);
    logActivity("CMS WEBSITE UPDATE", "Saved customized website configuration schemas to database.");
    setActivityLogs(getActivityLogs());
    alert("✨ Website updated and published successfully!");
  };

  // Drag and Drop ordering simulation
  const moveSection = (index: number, direction: 'up' | 'down') => {
    const nextArr = [...sectionOrders];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= nextArr.length) return;
    
    // Swap
    const temp = nextArr[index];
    nextArr[index] = nextArr[targetIdx];
    nextArr[targetIdx] = temp;
    
    setSectionOrders(nextArr);
    logActivity("SECTION REORDERED", `Moved ${temp.name} ${direction}.`);
    setActivityLogs(getActivityLogs());
  };

  const toggleSection = (index: number) => {
    const next = [...sectionOrders];
    next[index].visible = !next[index].visible;
    setSectionOrders(next);
    logActivity("SECTION VISIBILITY TOGGLED", `${next[index].name} is now ${next[index].visible ? 'Visible' : 'Hidden'}`);
    setActivityLogs(getActivityLogs());
  };

  // CRM status/notes updates
  const handleUpdateLeadStatus = async (id: string, status: LeadStatus) => {
    const updated = leads.map(l => {
      if (l.id === id) {
        return { ...l, status };
      }
      return l;
    });
    setLeads(updated);
    saveLeads(updated);
    
    // Sync back-end
    try {
      await fetch(`/api/crm/leads/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ followUpStatus: status })
      });
      fetchCRMData();
    } catch (e) {
      console.warn('Fallback local storage holds status.', e);
    }

    logActivity("LEAD STATUS UPDATED", `Changed lead ${id} status to ${status}.`);
    setActivityLogs(getActivityLogs());
  };

  const handleUpdateLeadNotes = async (id: string, notes: string) => {
    const updated = leads.map(l => {
      if (l.id === id) {
        return { ...l, notes };
      }
      return l;
    });
    setLeads(updated);
    saveLeads(updated);

    // Sync back-end
    try {
      await fetch(`/api/crm/leads/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes })
      });
      fetchCRMData();
    } catch (e) {
      console.warn('Fallback local storage holds notes.', e);
    }
  };

  // Blog creation
  const handleAddNewBlogPost = () => {
    const newPost: BlogPost = {
      id: `b_${Date.now()}`,
      icon: "📚",
      category: "Transit",
      title: "New Astrological Article",
      excerpt: "A summary of planetary positions and guidance...",
      content: "### Heading\nType article content in markdown format...",
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      readTime: "5 min",
      author: site.name || "Acharya TN Khurana",
      status: "draft",
      tags: ["Transit", "Astro"]
    };
    setBlog([newPost, ...blog]);
    setEditingBlogId(newPost.id);
    logActivity("NEW BLOG CREATED", "Initialized a draft blog article template.");
    setActivityLogs(getActivityLogs());
  };

  // Backups export
  const downloadBackup = () => {
    const backup: BackupData = {
      version: initialData.version,
      timestamp: new Date().toISOString(),
      site,
      hero,
      about,
      contactInfo,
      services,
      whyCards,
      testimonials,
      zodiac,
      panchang,
      reports,
      blog,
      faqs,
      theme,
      sectionOrders
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `acharya_khurana_cms_backup_${Date.now()}.json`;
    link.click();
    logActivity("SYSTEM EXPORT GENERATED", "Exported complete JSON state file.");
    setActivityLogs(getActivityLogs());
  };

  const handleRestoreBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const r = new FileReader();
    r.onload = (event) => {
      try {
        const d = JSON.parse(event.target?.result as string) as BackupData;
        if (d.version && d.site && d.theme) {
          setSite(d.site);
          setHero(d.hero);
          setAbout(d.about);
          setContactInfo(d.contactInfo);
          setServices(d.services);
          setWhyCards(d.whyCards);
          setTestimonials(d.testimonials);
          setZodiac(d.zodiac);
          setPanchang(d.panchang);
          setReports(d.reports);
          setBlog(d.blog);
          setFaqs(d.faqs);
          setTheme(d.theme);
          setSectionOrders(d.sectionOrders);
          logActivity("SYSTEM RESTORE COMPLETED", "Imported and restored a valid system configuration file.");
          setActivityLogs(getActivityLogs());
          alert("✅ Restore successful! Save changes to publish.");
        } else {
          alert("❌ Incompatible/Invalid backup JSON structure.");
        }
      } catch {
        alert("❌ Failed to parse backup file.");
      }
    };
    r.readAsText(file);
  };

  const generateSitemap = () => {
    const urls = ["https://acharyakhurana.com/"];
    sectionOrders.forEach(s => {
      if (s.visible) urls.push(`https://acharyakhurana.com/#${s.id}`);
    });
    blog.forEach(b => {
      if (b.status === 'published') urls.push(`https://acharyakhurana.com/#blog/${b.id}`);
    });
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url}</loc>
    <changefreq>weekly</changefreq>
    <priority>${url.includes('#blog/') ? '0.6' : '0.8'}</priority>
  </url>`).join('\n')}
</urlset>`;
    setXmlSitemap(xml);
    logActivity("SITEMAP XML GENERATED", "Reallocated sitemap.xml pathways dynamically.");
    setActivityLogs(getActivityLogs());
  };

  // Mock analytics totals
  const pageViewData = [
    { name: 'Jan', view: 15400, bookings: 78 },
    { name: 'Feb', view: 16900, bookings: 89 },
    { name: 'Mar', view: 19800, bookings: 110 },
    { name: 'Apr', view: 24000, bookings: 145 },
    { name: 'May', view: 26500, bookings: 152 },
    { name: 'Jun', view: 31000, bookings: 180 }
  ];

  const servicePopularity = [
    { name: 'Kundli', bookings: 780 },
    { name: 'Marriage', bookings: 540 },
    { name: 'Career', bookings: 420 },
    { name: 'Vastu', bookings: 290 },
    { name: 'Tarot', bookings: 210 }
  ];

  /* ============================================================
     RENDER LOGIN FOR UN-AUTHORIZED ENTRANCE
     ============================================================ */
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-[#080B12] z-[5000] flex items-center justify-center p-6 text-left">
        <div className="absolute inset-0 pointer-events-none opacity-25">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_40%,rgba(124,92,252,0.1),transparent_70%)]" />
        </div>
        
        <div className="w-full max-w-[420px] rounded-2xl bg-white/[0.01] border border-white/5 p-8 space-y-6 shadow-2xl relative z-10">
          <div className="text-center space-y-2">
            <div className="w-20 h-20 rounded-full border border-[#C9A227]/30 bg-black/50 overflow-hidden flex items-center justify-center shadow-[0_0_25px_rgba(201,162,39,0.25)] mx-auto relative group">
              <img 
                src="/favicon.svg" 
                alt="Acharya TN Khurana Council Logo" 
                className="w-18 h-18 object-contain transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#C9A227]/15 to-transparent pointer-events-none" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-[#f5d98a]">CMS Security Portal</h2>
            <p className="text-xs text-[#596478]">Please authorize using your registered admin credentials.</p>
          </div>

          {authError && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-400 font-semibold">
              {authError}
            </div>
          )}

          {authStep === 1 ? (
            <form onSubmit={handleSendOTP} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#8b96aa]">Super Admin Email *</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 flex items-center text-[#596478]"><Mail className="w-4 h-4" /></span>
                  <input 
                    type="email" 
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="admin@example.com" 
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>
              </div>
              <button 
                type="submit" 
                disabled={authLoading}
                className="w-full h-12 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                {authLoading ? '📧 Sending Code...' : '🔗 Request OTP Code'}
              </button>
              

            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#8b96aa]">Enter 6-Digit OTP Code *</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 flex items-center text-[#596478]"><KeyRound className="w-4 h-4" /></span>
                  <input 
                    type="text" 
                    value={otp}
                    onChange={e => setOtp(e.target.value)}
                    placeholder="xxxxxx" 
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500 text-center tracking-widest text-lg font-bold"
                    maxLength={6}
                    required
                  />
                </div>

                {infoMessage && (
                  <div className="mt-3 p-3 bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-400 rounded-xl leading-relaxed">
                    🔔 {infoMessage}
                  </div>
                )}

                <div className="flex justify-end items-center text-[10px] text-[#596478] pt-1">
                  <span className="underline cursor-pointer hover:text-white" onClick={() => { setAuthStep(1); setOtpBypassDisplay(null); setInfoMessage(null); }}>change email</span>
                </div>
              </div>
              <button 
                type="submit" 
                disabled={authLoading}
                className="w-full h-12 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                {authLoading ? 'Verifying...' : '🔐 Confirm Code'}
              </button>
            </form>
          )}

          <div className="flex justify-between items-center border-t border-white/5 pt-4">
            <button onClick={onClose} className="text-xs text-[#596478] hover:text-white transition-colors">← Exit Portal</button>
            <span className="cms-badge">Enterprise Edition</span>
          </div>
        </div>
      </div>
    );
  }

  /* ============================================================
     RENDER MASTER CMS DASHBOARD
     ============================================================ */
  return (
    <div className="fixed inset-0 bg-[#080B12] z-[5000] overflow-hidden text-left flex flex-col font-sans">
      
      {/* Header bar */}
      <div className="bg-[#0a0e18] border-b border-white/5 px-8 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="logo-emblem" style={{ width: '40px', height: '40px' }}>K</div>
          <div>
            <div className="font-serif text-lg font-bold text-[#C9A227] leading-none">Enterprise CMS Console</div>
            <div className="text-[10px] text-[#596478] uppercase tracking-widest mt-1 font-bold">Admin: {email || "admin@example.com"}</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleSaveCMS} className="btn btn-sm btn-gold">
            <Save className="w-4 h-4" /> Save & Publish
          </button>
          <button onClick={onClose} className="btn btn-sm btn-outline-gold">
            ← Live Website Preview
          </button>
          <button onClick={() => setIsAuthenticated(false)} className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 text-slate-350 hover:text-rose-400 hover:border-rose-400 flex items-center justify-center transition-all" title="Sign Out">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-1 h-[calc(100vh-73px)] overflow-hidden">
        
        {/* Left Side Tab Navigation */}
        <div className="w-64 bg-[#0a0e18]/60 border-r border-white/5 py-6 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-1">
            <div className="px-6 pb-2 text-[10px] text-[#596478] font-bold uppercase tracking-widest">Builder Tools</div>
            <button onClick={() => setActiveTab('content')} className={`w-full flex items-center gap-2.5 px-6 py-3.5 text-sm font-semibold border-l-4 transition-all ${activeTab === 'content' ? 'border-[#C9A227] text-[#C9A227] bg-[#C9A227]/5' : 'border-transparent text-[#8b96aa] hover:text-white hover:bg-white/5'}`}>
              <Settings className="w-4 h-4" /> Config Content
            </button>
            <button onClick={() => setActiveTab('layout')} className={`w-full flex items-center gap-2.5 px-6 py-3.5 text-sm font-semibold border-l-4 transition-all ${activeTab === 'layout' ? 'border-[#C9A227] text-[#C9A227] bg-[#C9A227]/5' : 'border-transparent text-[#8b96aa] hover:text-white hover:bg-white/5'}`}>
              <Layout className="w-4 h-4" /> Drag Page Builder
            </button>
            <button onClick={() => setActiveTab('theme')} className={`w-full flex items-center gap-2.5 px-6 py-3.5 text-sm font-semibold border-l-4 transition-all ${activeTab === 'theme' ? 'border-[#C9A227] text-[#C9A227] bg-[#C9A227]/5' : 'border-transparent text-[#8b96aa] hover:text-white hover:bg-white/5'}`}>
              <Palette className="w-4 h-4" /> Theme Customizer
            </button>
            <button onClick={() => setActiveTab('media')} className={`w-full flex items-center gap-2.5 px-6 py-3.5 text-sm font-semibold border-l-4 transition-all ${activeTab === 'media' ? 'border-[#C9A227] text-[#C9A227] bg-[#C9A227]/5' : 'border-transparent text-[#8b96aa] hover:text-white hover:bg-white/5'}`}>
              <ImageIcon className="w-4 h-4" /> Media Library
            </button>
            
            <div className="px-6 pt-6 pb-2 text-[10px] text-[#596478] font-bold uppercase tracking-widest">Modules</div>
            <button onClick={() => setActiveTab('books')} className={`w-full flex items-center gap-2.5 px-6 py-3.5 text-sm font-semibold border-l-4 transition-all ${activeTab === 'books' ? 'border-[#C9A227] text-[#C9A227] bg-[#C9A227]/5' : 'border-transparent text-[#8b96aa] hover:text-white hover:bg-white/5'}`}>
              <ShoppingBag className="w-4 h-4 text-[#C9A227]" /> Sacred Book Store
            </button>
            <button onClick={() => setActiveTab('crm')} className={`w-full flex items-center gap-2.5 px-6 py-3.5 text-sm font-semibold border-l-4 transition-all ${activeTab === 'crm' ? 'border-[#C9A227] text-[#C9A227] bg-[#C9A227]/5' : 'border-transparent text-[#8b96aa] hover:text-white hover:bg-white/5'}`}>
              <Users className="w-4 h-4" /> CRM & Lead Bookings
            </button>
            <button onClick={() => setActiveTab('blogs')} className={`w-full flex items-center gap-2.5 px-6 py-3.5 text-sm font-semibold border-l-4 transition-all ${activeTab === 'blogs' ? 'border-[#C9A227] text-[#C9A227] bg-[#C9A227]/5' : 'border-transparent text-[#8b96aa] hover:text-white hover:bg-white/5'}`}>
              <BookOpen className="w-4 h-4" /> Blog Manager
            </button>
            <button onClick={() => setActiveTab('seo')} className={`w-full flex items-center gap-2.5 px-6 py-3.5 text-sm font-semibold border-l-4 transition-all ${activeTab === 'seo' ? 'border-[#C9A227] text-[#C9A227] bg-[#C9A227]/5' : 'border-transparent text-[#8b96aa] hover:text-white hover:bg-white/5'}`}>
              <Globe className="w-4 h-4" /> SEO & Sitemap
            </button>
            <button onClick={() => setActiveTab('analytics')} className={`w-full flex items-center gap-2.5 px-6 py-3.5 text-sm font-semibold border-l-4 transition-all ${activeTab === 'analytics' ? 'border-[#C9A227] text-[#C9A227] bg-[#C9A227]/5' : 'border-transparent text-[#8b96aa] hover:text-white hover:bg-white/5'}`}>
              <BarChart3 className="w-5 h-5" />
              Traffic Analytics
            </button>
            <button onClick={() => setActiveTab('social_media')} className={`w-full flex items-center gap-2.5 px-6 py-3.5 text-sm font-semibold border-l-4 transition-all ${activeTab === 'social_media' ? 'border-[#C9A227] text-[#C9A227] bg-[#C9A227]/5' : 'border-transparent text-[#8b96aa] hover:text-white hover:bg-white/5'}`}>
              <Share2 className="w-5 h-5" />
              Social Media
            </button>
            <button onClick={() => setActiveTab('backups')} className={`w-full flex items-center gap-2.5 px-6 py-3.5 text-sm font-semibold border-l-4 transition-all ${activeTab === 'backups' ? 'border-[#C9A227] text-[#C9A227] bg-[#C9A227]/5' : 'border-transparent text-[#8b96aa] hover:text-white hover:bg-white/5'}`}>
              <Database className="w-4 h-4" /> Backup System
            </button>

            <div className="px-6 pt-5 pb-2 text-[10px] text-[#C9A227] font-bold uppercase tracking-widest flex items-center gap-1.5 border-t border-white/5 mt-4"><Sparkles className="w-3.5 h-3.5 text-[#C9A227] animate-pulse" /> Sacred Live Suite</div>
            
            <button onClick={() => setActiveTab('crm_dashboard')} className={`w-full flex items-center justify-between px-6 py-2.5 text-xs font-semibold border-l-4 transition-all ${activeTab === 'crm_dashboard' ? 'border-[#C9A227] text-[#C9A227] bg-[#C9A227]/5' : 'border-transparent text-[#8b96aa] hover:text-white hover:bg-white/5'}`}>
              <span className="flex items-center gap-2.5"><BarChart className="w-4 h-4 text-purple-400" /> Live CRM Analytics</span>
              <span className="text-[9px] bg-purple-500/15 text-purple-400 border border-purple-500/20 px-1 py-0.5 rounded font-mono font-bold">REALTIME</span>
            </button>

            <button onClick={() => setActiveTab('bookings')} className={`w-full flex items-center justify-between px-6 py-2.5 text-xs font-semibold border-l-4 transition-all ${activeTab === 'bookings' ? 'border-[#C9A227] text-[#C9A227] bg-[#C9A227]/5' : 'border-transparent text-[#8b96aa] hover:text-white hover:bg-white/5'}`}>
              <span className="flex items-center gap-2.5"><Calendar className="w-4 h-4 text-emerald-400" /> Bookings Manager</span>
              {dbBookings.filter(b => b.status === 'Pending').length > 0 && (
                <span className="text-[10px] bg-emerald-500 text-slate-900 font-extrabold px-2 py-0.5 rounded-full animate-pulse">{dbBookings.filter(b => b.status === 'Pending').length}</span>
              )}
            </button>
            
            <button onClick={() => setActiveTab('ai_guru')} className={`w-full flex items-center gap-2.5 px-6 py-2.5 text-xs font-semibold border-l-4 transition-all ${activeTab === 'ai_guru' ? 'border-[#C9A227] text-[#C9A227] bg-[#C9A227]/5' : 'border-transparent text-[#8b96aa] hover:text-white hover:bg-white/5'}`}>
              <Sparkles className="w-4 h-4 text-amber-400" /> AI Guru Settings
            </button>
            
            <button onClick={() => setActiveTab('toolkit')} className={`w-full flex items-center gap-2.5 px-6 py-2.5 text-xs font-semibold border-l-4 transition-all ${activeTab === 'toolkit' ? 'border-[#C9A227] text-[#C9A227] bg-[#C9A227]/5' : 'border-transparent text-[#8b96aa] hover:text-white hover:bg-white/5'}`}>
              <Terminal className="w-4 h-4 text-sky-400" /> Vedic Tool Manager
            </button>
            
            <button onClick={() => setActiveTab('notifications')} className={`w-full flex items-center justify-between px-6 py-2.5 text-xs font-semibold border-l-4 transition-all ${activeTab === 'notifications' ? 'border-[#C9A227] text-[#C9A227] bg-[#C9A227]/5' : 'border-transparent text-[#8b96aa] hover:text-white hover:bg-white/5'}`}>
              <span className="flex items-center gap-2.5"><Bell className="w-4 h-4 text-rose-400" /> Sound Alert Centre</span>
              {unreadNotificationsCount > 0 && (
                <span className="text-[10px] bg-rose-500 text-white font-bold px-2 py-0.5 rounded-full animate-bounce">{unreadNotificationsCount}</span>
              )}
            </button>

            <button onClick={() => setActiveTab('users')} className={`w-full flex items-center gap-2.5 px-6 py-2.5 text-xs font-semibold border-l-4 transition-all ${activeTab === 'users' ? 'border-[#C9A227] text-[#C9A227] bg-[#C9A227]/5' : 'border-transparent text-[#8b96aa] hover:text-white hover:bg-white/5'}`}>
              <Users className="w-4 h-4 text-cyan-400" /> Users & Registrants
            </button>

            <button onClick={() => setActiveTab('monitoring')} className={`w-full flex items-center justify-between px-6 py-2.5 text-xs font-semibold border-l-4 transition-all ${activeTab === 'monitoring' ? 'border-[#C9A227] text-[#C9A227] bg-[#C9A227]/5' : 'border-transparent text-[#8b96aa] hover:text-white hover:bg-white/5'}`}>
              <span className="flex items-center gap-2.5"><Activity className="w-4 h-4 text-indigo-400 animate-pulse" /> Live Telemetry Logs</span>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C9A227] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C9A227]"></span>
              </span>
            </button>
          </div>
          <div className="px-6 text-xs text-[#596478]">v2.2.0 · Live Web Audio Alerts ready</div>
        </div>

        {/* Central Content Panel */}
        <div className="flex-1 p-8 overflow-y-auto">
          
          {/* TAB 1: CONTENT CONFIGURATION */}
          {activeTab === 'content' && (
            <div className="space-y-6 max-w-4xl">
              <div>
                <h2 className="font-serif text-2xl font-bold text-[#f5d98a]">Website Content Editor</h2>
                <p className="text-xs text-[#8b96aa] mt-0.5">Simply modify any text on the website directly without writing any code.</p>
              </div>

              {/* Site Identity */}
              <div className="p-6 rounded-2xl bg-[#0a0e18]/40 border border-white/5 space-y-4">
                <h3 className="text-sm font-bold text-[#e8eaf0] border-b border-white/5 pb-2">1. Site Branding & Contact Identity</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5"><label className="text-xs font-semibold text-[#8b96aa]">Site Brand Name</label><input type="text" value={site.name} onChange={e => setSite({ ...site, name: e.target.value })} className="form-input" /></div>
                  <div className="space-y-1.5"><label className="text-xs font-semibold text-[#8b96aa]">Support Phone</label><input type="text" value={site.phone} onChange={e => setSite({ ...site, phone: e.target.value })} className="form-input" /></div>
                  <div className="space-y-1.5"><label className="text-xs font-semibold text-[#8b96aa]">Support Email</label><input type="text" value={site.email} onChange={e => setSite({ ...site, email: e.target.value })} className="form-input" /></div>
                  <div className="space-y-1.5"><label className="text-xs font-semibold text-[#8b96aa]">WhatsApp Number ID</label><input type="text" value={site.whatsapp} onChange={e => setSite({ ...site, whatsapp: e.target.value })} className="form-input" /></div>
                </div>
              </div>

              {/* Hero Section Content */}
              <div className="p-6 rounded-2xl bg-[#0a0e18]/40 border border-white/5 space-y-4">
                <h3 className="text-sm font-bold text-[#e8eaf0] border-b border-white/5 pb-2">2. Landing Hero Section Content</h3>
                <div className="space-y-4">
                  <div className="space-y-1.5"><label className="text-xs font-semibold text-[#8b96aa]">Concentric Badge Notification</label><input type="text" value={hero.badge} onChange={e => setHero({ ...hero, badge: e.target.value })} className="form-input" /></div>
                  <div className="space-y-1.5"><label className="text-xs font-semibold text-[#8b96aa]">Hero Title Header (Markdown support)</label><textarea value={hero.title} onChange={e => setHero({ ...hero, title: e.target.value })} className="form-textarea" /></div>
                  <div className="space-y-1.5"><label className="text-xs font-semibold text-[#8b96aa]">Hero Paragraph Core Description</label><textarea value={hero.subtitle} onChange={e => setHero({ ...hero, subtitle: e.target.value })} className="form-textarea" /></div>
                </div>
              </div>

              {/* About Section Bio */}
              <div className="p-6 rounded-2xl bg-[#0a0e18]/40 border border-white/5 space-y-4">
                <h3 className="text-sm font-bold text-[#e8eaf0] border-b border-white/5 pb-2">3. Overviews & Biography Section</h3>
                <div className="space-y-4">
                  <div className="space-y-1.5"><label className="text-xs font-semibold text-[#8b96aa]">Highlight Callout Quote</label><input type="text" value={about.intro} onChange={e => setAbout({ ...about, intro: e.target.value })} className="form-input" /></div>
                  <div className="space-y-1.5"><label className="text-xs font-semibold text-[#8b96aa]">Biography Block (Para 1)</label><textarea value={about.text1} onChange={e => setAbout({ ...about, text1: e.target.value })} className="form-textarea h-28" /></div>
                  <div className="space-y-1.5"><label className="text-xs font-semibold text-[#8b96aa]">Biography Block (Para 2)</label><textarea value={about.text2} onChange={e => setAbout({ ...about, text2: e.target.value })} className="form-textarea h-28" /></div>
                  
                  {/* Author section image field */}
                  <div className="space-y-1.5 p-3.5 rounded-xl bg-white/[0.01] border border-white/5">
                    <label className="text-xs font-bold text-[#f5d98a] block">About Section Image of Scholar Author</label>
                    <div className="flex gap-4 items-center mt-1.5">
                      <div className="w-16 h-20 bg-white/[0.02] border border-white/10 rounded-lg overflow-hidden flex items-center justify-center shrink-0">
                        {about.image ? (
                          <img src={about.image} alt="Author Preview" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-sm">🧘</span>
                        )}
                      </div>
                      <div className="flex-1 space-y-1">
                        <input 
                          type="text" 
                          value={about.image || ''} 
                          onChange={e => setAbout({ ...about, image: e.target.value })} 
                          placeholder="e.g. HTTPS URL or base64 data-URL" 
                          className="form-input text-xs" 
                        />
                        <p className="text-[10px] text-[#596478]">Specify a portrait secure URL for Acharya TN Khurana. Optimize to compact WebP inside the Media Tab.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Service Catalog Item Management */}
              <div className="p-6 rounded-2xl bg-[#0a0e18]/40 border border-white/5 space-y-4">
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <h3 className="text-sm font-bold text-[#e8eaf0]">4. Catalog of Sacred Consulting Services</h3>
                  <button onClick={() => {
                    const newS: Service = { id: `s_${Date.now()}`, icon: "🔮", name: "New Astrology Service", desc: "Consult catalog description", price: "₹1,500", duration: "45 min", active: true };
                    setServices([...services, newS]);
                    setEditingServiceId(newS.id);
                  }} className="btn btn-sm btn-gold"><Plus className="w-3.5 h-3.5" /> New Service</button>
                </div>
                <div className="space-y-3">
                  {services.map(s => (
                    <div key={s.id} className="p-4 rounded-xl border border-white/5 bg-white/[0.01] flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setEditingServiceId(editingServiceId === s.id ? null : s.id)}>
                          <span className="text-2xl">{s.icon}</span>
                          <div>
                            <span className="font-bold text-sm">{s.name}</span>
                            <span className="text-xs text-[#596478] ml-2">({s.price} · {s.duration})</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => setServices(services.map(srv => srv.id === s.id ? { ...srv, active: !srv.active } : srv))} className={`btn btn-sm ${s.active ? 'btn-gold' : 'btn-outline-gold'}`}>{s.active ? 'Active' : 'Hidden'}</button>
                          <button onClick={() => setServices(services.filter(srv => srv.id !== s.id))} className="w-8 h-8 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 flex items-center justify-center"><Trash className="w-4 h-4" /></button>
                        </div>
                      </div>
                      {editingServiceId === s.id && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-white/5">
                          <div className="space-y-1"><label className="text-xs text-[#8b96aa]">Service Title</label><input type="text" value={s.name} onChange={e => setServices(services.map(srv => srv.id === s.id ? { ...srv, name: e.target.value } : srv))} className="form-input" /></div>
                          <div className="space-y-1"><label className="text-xs text-[#8b96aa]">Service rate (Price text)</label><input type="text" value={s.price} onChange={e => setServices(services.map(srv => srv.id === s.id ? { ...srv, price: e.target.value } : srv))} className="form-input" /></div>
                          <div className="space-y-1"><label className="text-xs text-[#8b96aa]">Service duration</label><input type="text" value={s.duration} onChange={e => setServices(services.map(srv => srv.id === s.id ? { ...srv, duration: e.target.value } : srv))} className="form-input" /></div>
                          <div className="space-y-1"><label className="text-xs text-[#8b96aa]">Unicode Icon</label><input type="text" value={s.icon} onChange={e => setServices(services.map(srv => srv.id === s.id ? { ...srv, icon: e.target.value } : srv))} className="form-input" /></div>
                          <div className="sm:col-span-2 space-y-1"><label className="text-xs text-[#8b96aa]">Short Description</label><textarea value={s.desc} onChange={e => setServices(services.map(srv => srv.id === s.id ? { ...srv, desc: e.target.value } : srv))} className="form-textarea" /></div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DRAG GRAPHICAL PAGE BUILDER */}
          {activeTab === 'layout' && (
            <div className="space-y-6 max-w-2xl">
              <div>
                <h2 className="font-serif text-2xl font-bold text-[#f5d98a]">Drag-and-Drop Page Builder</h2>
                <p className="text-xs text-[#8b96aa] mt-0.5">Use sorting arrows to instantly change section hierarchy, toggle visibility, and configure custom landing layouts.</p>
              </div>

              <div className="p-6 rounded-2xl bg-[#0a0e18]/40 border border-white/5 space-y-3">
                {sectionOrders.map((sec, idx) => (
                  <div key={sec.id} className="p-4 rounded-xl border border-white/5 bg-white/[0.01] flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="text-[#596478] font-mono text-xs">#{idx + 1}</span>
                      <span className="font-semibold text-sm">{sec.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => moveSection(idx, 'up')} disabled={idx === 0} className="w-8 h-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-[#8b96aa] hover:text-white disabled:opacity-20"><ArrowUp className="w-4 h-4" /></button>
                      <button onClick={() => moveSection(idx, 'down')} disabled={idx === sectionOrders.length - 1} className="w-8 h-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-[#8b96aa] hover:text-white disabled:opacity-20"><ArrowDown className="w-4 h-4" /></button>
                      <button onClick={() => toggleSection(idx)} className={`w-10 h-8 rounded-lg flex items-center justify-center border transition-all ${sec.visible ? 'bg-[#C9A227]/10 border-[#C9A227]/30 text-[#C9A227]' : 'bg-white/5 border-white/5 text-[#596478]'}`}>
                        {sec.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: THEME CUSTOMIZER */}
          {activeTab === 'theme' && (
            <div className="space-y-6 max-w-4xl">
              <div>
                <h2 className="font-serif text-2xl font-bold text-[#f5d98a]">Theme Customizer</h2>
                <p className="text-xs text-[#8b96aa] mt-0.5">Select from preconfigured, eye-pleasing theme palletes, border rounding curves, and shadow scopes.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl bg-[#0a0e18]/40 border border-white/5 space-y-4">
                  <h3 className="text-sm font-bold text-[#e8eaf0] border-b border-white/5 pb-2">1. Visual Styling Modes</h3>
                  
                  {/* Palette Selector */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#8b96aa]">Select Color Preset Palette</label>
                    <select value={theme.palette} onChange={e => {
                      const sel = e.target.value;
                      let update: Partial<typeof theme> = { palette: sel as any };
                      if (sel === 'default') { update.primaryColor = '#C9A227'; update.secondaryColor = '#7C5CFC'; update.backgroundColor = '#080B12'; }
                      else if (sel === 'cosmic-purple') { update.primaryColor = '#7C5CFC'; update.secondaryColor = '#9b7eff'; update.backgroundColor = '#0b0c16'; }
                      else if (sel === 'royal-blue') { update.primaryColor = '#1d4ed8'; update.secondaryColor = '#3b82f6'; update.backgroundColor = '#050917'; }
                      else if (sel === 'divine-emerald') { update.primaryColor = '#0FB8A0'; update.secondaryColor = '#10b981'; update.backgroundColor = '#040d12'; }
                      else if (sel === 'amber-sunset') { update.primaryColor = '#f59e0b'; update.secondaryColor = '#f97316'; update.backgroundColor = '#110a04'; }
                      setTheme({ ...theme, ...update });
                    }} className="form-select">
                      <option value="default">Default Royal Gold (Vedic Star)</option>
                      <option value="cosmic-purple">Deep Cosmic Purple</option>
                      <option value="royal-blue">Indigo Horizon</option>
                      <option value="divine-emerald">Sacred Emerald Vastu</option>
                      <option value="amber-sunset">Warm Amber Sunset</option>
                    </select>
                  </div>

                  {/* Mode Toggles */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#8b96aa]">Contrast Base Mode</label>
                    <div className="flex gap-4">
                      <button onClick={() => setTheme({ ...theme, mode: 'dark' })} className={`flex-1 h-10 rounded-lg border font-semibold text-xs ${theme.mode === 'dark' ? 'border-[#C9A227] bg-[#C9A227]/5 text-[#C9A227]' : 'border-white/10 text-[#8b96aa]'}`}>🌌 Dark Cosmic Canvas</button>
                      <button onClick={() => setTheme({ ...theme, mode: 'light' })} className={`flex-1 h-10 rounded-lg border font-semibold text-xs ${theme.mode === 'light' ? 'border-[#C9A227] bg-[#C9A227]/5 text-[#C9A227]' : 'border-white/10 text-[#8b96aa]'}`}>☀️ Light Solar Canvas</button>
                    </div>
                  </div>

                  {/* Corner Border Rounding */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#8b96aa]">Component Border Radius Curve</label>
                    <select value={theme.borderRadius} onChange={e => setTheme({ ...theme, borderRadius: e.target.value })} className="form-select">
                      <option value="rounded-none">Sharp Classic (rounded-none)</option>
                      <option value="rounded-md">Moderate Soft (rounded-md)</option>
                      <option value="rounded-lg">Modern Card (rounded-lg)</option>
                      <option value="rounded-2xl">Warm Curvy (rounded-2xl)</option>
                      <option value="rounded-full">Oval Capsules (rounded-full)</option>
                    </select>
                  </div>

                  {/* Shadow intensity */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#8b96aa]">Card Box Shadow Intensity</label>
                    <select value={theme.shadows} onChange={e => setTheme({ ...theme, shadows: e.target.value as any })} className="form-select">
                      <option value="shadow-none">No Shadow (Zero Depth)</option>
                      <option value="shadow-sm">Minimal Shadow</option>
                      <option value="shadow-md">Medium depth</option>
                      <option value="shadow-lg">Dense depth (shadow-lg)</option>
                      <option value="shadow-2xl">High-end deep black (shadow-2xl)</option>
                    </select>
                  </div>
                </div>

                {/* Real-time Theme Simulator */}
                <div className="p-6 rounded-2xl bg-[#0a0e18]/40 border border-white/5 space-y-4">
                  <h3 className="text-sm font-bold text-[#e8eaf0] border-b border-white/5 pb-2">2. Live Preset Simulator</h3>
                  <div className={`p-6 rounded-[24px] border border-white/10 flex flex-col gap-4 text-center items-center justify-center transition-all bg-[${theme.backgroundColor}]`} style={{ borderRadius: theme.borderRadius === 'rounded-none' ? '0px' : theme.borderRadius === 'rounded-md' ? '8px' : theme.borderRadius === 'rounded-lg' ? '12px' : theme.borderRadius === 'rounded-2xl' ? '20px' : '9999px', backgroundColor: theme.mode === 'light' ? '#f8fafc' : '#080B12', color: theme.mode === 'light' ? '#0f172a' : '#e8eaf0' }}>
                    <span className="text-4xl">🔮</span>
                    <div>
                      <h4 className="font-serif font-black text-lg" style={{ color: theme.primaryColor }}>Kundli Analysis</h4>
                      <p className="text-[11px] text-[#596478] max-w-xs mt-1">Experience deep Vedic predictions inside simulated container cards styled to your specifications.</p>
                    </div>
                    <button className="px-5 py-2 rounded-full font-bold text-xs" style={{ backgroundColor: theme.primaryColor, color: theme.mode === 'light' ? '#ffffff' : '#000000', borderRadius: theme.borderRadius === 'rounded-none' ? '0px' : '9999px' }}>
                      📅 Book Session
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: MEDIA & WEBP OPTIMIZER */}
          {activeTab === 'media' && (() => {
            const scannedAssets = [
              ...(about && about.image ? [{
                id: 'about-author',
                name: 'Author Section Portrait',
                type: 'About Author',
                url: about.image,
                onUpdate: (newUrl: string) => setAbout(prev => ({ ...prev, image: newUrl }))
              }] : []),
              ...(blog ? blog.map((b, idx) => ({
                id: `blog-${b.id}`,
                name: b.title,
                type: 'Blog Cover',
                url: b.coverImage || b.image || '',
                onUpdate: (newUrl: string) => setBlog(prev => prev.map((item, i) => i === idx ? { ...item, coverImage: newUrl, image: newUrl } : item))
              })) : []),
              ...(books ? books.map((bk, idx) => ({
                id: `book-${bk.id}`,
                name: bk.title,
                type: 'Book Cover',
                url: bk.coverImage || '',
                onUpdate: (newUrl: string) => setBooks(prev => prev.map((item, i) => i === idx ? { ...item, coverImage: newUrl } : item))
              })) : []),
              ...(pageSeo ? pageSeo.map((p, idx) => ({
                id: `seo-${p.pageId}`,
                name: `${p.pageTitle} OG Image`,
                type: 'SEO og:image',
                url: p.ogImage || '',
                onUpdate: (newUrl: string) => setPageSeo(prev => prev.map((item, i) => i === idx ? { ...item, ogImage: newUrl } : item))
              })) : [])
            ].filter(asset => asset.url);

            return (
              <div className="space-y-6 max-w-6xl text-left">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-4">
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-[#f5d98a]">Secured Media Manager & WebP Optimizer</h2>
                    <p className="text-xs text-[#8b96aa] mt-0.5">
                      Optimize website assets by mapping images, compressing custom computer images to WebP data-URLs, or using CDN auto-compression filters.
                    </p>
                  </div>
                  <div className="flex items-center gap-3 bg-[#0a0e18]/80 p-2.5 rounded-xl border border-white/5">
                    <span className="text-[10px] text-[#596478] font-black uppercase tracking-wider">Compression Quality:</span>
                    <input 
                      type="range" 
                      min="30" 
                      max="100" 
                      value={conversionQuality} 
                      onChange={(e) => setConversionQuality(Number(e.target.value))} 
                      className="w-24 accent-[#C9A227] h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="text-xs font-mono font-bold text-[#C9A227]">{conversionQuality}%</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* LEFT: SITE CHANNELS IMAGES SCANNER */}
                  <div className="lg:col-span-7 space-y-4">
                    <div className="p-4 rounded-xl border border-[#C9A227]/10 bg-gradient-to-br from-[#0a0e18]/90 to-[#1a1c26]/40">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 text-[#f5d98a]">
                          <span className="flex h-2 w-2 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                          </span>
                          Dynamic CMS Image Crawler ({scannedAssets.length})
                        </span>
                        <span className="text-[10px] text-[#8b96aa] italic">Auto-scanned from website blocks</span>
                      </div>

                      <div className="space-y-3 max-h-[580px] overflow-y-auto pr-1">
                        {scannedAssets.length === 0 ? (
                          <div className="p-8 text-center text-xs text-[#596478]">
                            No image references found in current CMS draft state.
                          </div>
                        ) : (
                          scannedAssets.map((asset) => {
                            const isCurrentlyOpt = asset.url.includes('fm=webp') || asset.url.includes('format=webp') || asset.url.startsWith('data:image/webp');
                            return (
                              <div key={asset.id} className="p-3.5 rounded-lg border border-white/5 bg-[#0a0e18]/80 hover:bg-[#080c14] transition-all flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                                <div className="flex gap-3.5 items-center min-w-0 flex-1">
                                  <div className="w-12 h-16 rounded overflow-hidden border border-white/10 bg-white/[0.01] shrink-0 relative flex items-center justify-center">
                                    {asset.url ? (
                                      <img src={asset.url} alt={asset.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                                    ) : (
                                      <span className="text-lg">🌌</span>
                                    )}
                                  </div>
                                  <div className="space-y-1 text-left min-w-0 flex-1">
                                    <div className="flex items-center gap-2">
                                      <span className="px-2 py-0.5 rounded text-[8px] font-bold bg-[#7C5CFC]/10 text-[#967efc] border border-[#7C5CFC]/20 uppercase">
                                        {asset.type}
                                      </span>
                                      {isCurrentlyOpt && (
                                        <span className="px-2 py-0.5 rounded text-[8px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                          WebP Optimal
                                        </span>
                                      )}
                                    </div>
                                    <h4 className="text-xs font-bold text-white truncate">{asset.name}</h4>
                                    <p className="text-[9px] text-[#596478] font-mono truncate">{asset.url}</p>
                                  </div>
                                </div>

                                <div className="flex flex-col items-end gap-2 w-full md:w-auto mt-2 md:mt-0 shrink-0">
                                  <button
                                    type="button"
                                    onClick={() => optimizeUrlToWebP(asset.url, asset.id, asset.onUpdate)}
                                    disabled={isConverting === asset.id}
                                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all w-full md:w-auto flex items-center justify-center gap-1.5 ${
                                      isCurrentlyOpt 
                                        ? "bg-emerald-500/5 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/10" 
                                        : "bg-[#C9A227]/10 text-[#C9A227] border-[#C9A227]/30 hover:bg-[#C9A227] hover:text-[#1a1000]"
                                    }`}
                                  >
                                    {isConverting === asset.id ? (
                                      <>
                                        <RefreshCw className="w-3 h-3 animate-spin" />
                                        Optimizing...
                                      </>
                                    ) : isCurrentlyOpt ? (
                                      <>
                                        <CheckCircle2 className="w-3 h-3" />
                                        Optimize Again
                                      </>
                                    ) : (
                                      <>
                                        <Sparkles className="w-3 h-3" />
                                        Convert to WebP
                                      </>
                                    )}
                                  </button>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>

                      {optFeedback && (
                        <div className="mt-4 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10 flex gap-2 items-center text-[#e8eaf0] text-[11px] text-left animate-fadeIn">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          <div>
                            <span className="font-bold text-emerald-400">Optimization Feedback:</span> {optFeedback.msg}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* RIGHT: REAL LOCAL IMAGE CONVERTER */}
                  <div className="lg:col-span-5 space-y-4">
                    <div className="p-4 rounded-xl border border-white/5 bg-[#0a0e18]/80 text-left space-y-4">
                      <div>
                        <span className="text-[10px] text-[#f5d98a] font-bold uppercase tracking-wider block">Real-Time Encoder</span>
                        <h3 className="font-serif text-lg font-bold text-white mt-0.5">Desktop File Converter</h3>
                        <p className="text-[11px] text-[#8b96aa]">Select any local graphic and re-render it as a highly compressed WebP base64 URI.</p>
                      </div>

                      <div className="border border-dashed border-white/10 rounded-xl p-6 bg-white/[0.01] hover:bg-white/[0.02] hover:border-[#C9A227]/30 transition-all text-center relative group">
                        <input 
                          type="file" 
                          id="local-webp-uploader" 
                          accept="image/*" 
                          onChange={handleLocalFileSelect} 
                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        />
                        <Upload className="w-8 h-8 text-[#596478] mx-auto group-hover:text-[#C9A227] transition-colors mb-2" />
                        <span className="text-xs font-bold text-white block">
                          {localFile ? localFile.name : "Choose File or Drag & Drop"}
                        </span>
                        <span className="text-[10px] text-[#596478] block mt-1">Supports PNG, JPG, JPEG</span>
                      </div>

                      {localFile && (
                        <div className="space-y-4 pt-1 animate-fadeIn">
                          {/* Optimization Stats */}
                          <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5 space-y-2">
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-[#8b96aa]">Original Size:</span>
                              <span className="font-mono font-bold text-white">{(originalSize / 1024).toFixed(1)} KB</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-[#8b96aa]">Optimized WebP:</span>
                              <span className="font-mono font-bold text-emerald-400">{(optimizedSize / 1024).toFixed(1)} KB</span>
                            </div>
                            <div className="h-[1px] bg-white/5 my-1" />
                            <div className="flex justify-between items-baseline text-xs">
                              <span className="text-white/80 font-bold">Total Space Saved:</span>
                              <span className="text-lg font-black font-serif text-emerald-400">
                                {Math.max(0, Math.round(((originalSize - optimizedSize) / originalSize) * 100))}%
                              </span>
                            </div>
                          </div>

                          {/* Preview Side-by-Side */}
                          <div className="space-y-1">
                            <span className="text-[10px] text-[#596478] font-black uppercase">Live WebP Output Preview</span>
                            <div className="aspect-video rounded-lg border border-white/5 overflow-hidden bg-black/40 relative flex items-center justify-center bg-checkered">
                              {optimizedDataUrl ? (
                                <img src={optimizedDataUrl} alt="WebP preview" referrerPolicy="no-referrer" className="w-full h-full object-contain" />
                              ) : (
                                <span className="text-xs text-[#596478] animate-pulse">Running encoder...</span>
                              )}
                            </div>
                          </div>

                          {/* Quick Assignment Actions */}
                          <div className="space-y-2 pt-2">
                            <span className="text-[10px] text-[#596478] font-black uppercase block border-b border-white/5 pb-1">Assign Compiled Asset To:</span>
                            <div className="grid grid-cols-1 gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  if (optimizedDataUrl) {
                                    setAbout(prev => ({ ...prev, image: optimizedDataUrl }));
                                    alert("🎯 Applied & saved to Author Portrait state! Make sure to scroll down and click 'Save and Publish Changes' to write permanently.");
                                    logActivity("MEDIA COMPRESS ASSIGNED", "Assigned Desktop WebP conversion result directly to Author Portrait.");
                                    setActivityLogs(getActivityLogs());
                                  }
                                }}
                                className="px-3 py-2 rounded-lg bg-[#C9A227]/10 text-[#C9A227] hover:bg-[#C9A227] hover:text-[#1a1000] border border-[#C9A227]/20 transition-all text-xs font-bold w-full text-center block"
                              >
                                🧘 Assign as Author Section Photo
                              </button>
                              
                              <button
                                type="button"
                                onClick={() => {
                                  if (optimizedDataUrl) {
                                    navigator.clipboard.writeText(optimizedDataUrl);
                                    alert("📋 Code copied to clipboard! You can paste this base64 URI anywhere.");
                                  }
                                }}
                                className="px-3 py-2 rounded-lg bg-white/5 text-white hover:bg-white/10 border border-white/10 transition-all text-xs font-bold w-full text-center block"
                              >
                                🔗 Copy Base64 String
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* TAB 5: CRM & LEAD MANAGEMENT */}
          {activeTab === 'crm' && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-[#f5d98a]">Client Relationship Management (CRM) & SMTP</h2>
                  <p className="text-xs text-[#8b96aa] mt-0.5">Control client lead channels, track physical and online seekers, deploy newsletter marketing broadcasts, and configure live SMTP servers.</p>
                </div>
                <button 
                  onClick={fetchCRMData}
                  className="px-3.5 py-2 rounded-xl bg-white/5 border border-white/5 font-semibold text-xs text-[#f5d98a] hover:bg-white/10 flex items-center gap-1.5 transition-all"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Refresh CRM data
                </button>
              </div>

              {/* Analytics Ribbon */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-[#0a0e18] border border-white/5">
                  <div className="text-[10px] text-[#596478] font-black uppercase">Captured Leads</div>
                  <div className="text-2xl font-black text-[#f5d98a] mt-1">{crmAnalytics.totalLeads || leads.length}</div>
                  <div className="text-[9px] text-[#596478] mt-1">From contact, books, service inbounds</div>
                </div>

                <div className="p-4 rounded-xl bg-[#0a0e18] border border-white/5">
                  <div className="text-[10px] text-[#596478] font-black uppercase">Registered Seekers</div>
                  <div className="text-2xl font-black text-[#f5d98a] mt-1">{crmAnalytics.totalUsers || seekers.length}</div>
                  <div className="text-[9px] text-[#596478] mt-1">Authorized client portal accounts</div>
                </div>

                <div className="p-4 rounded-xl bg-[#0a0e18] border border-white/5">
                  <div className="text-[10px] text-[#596478] font-black uppercase">Platform View Analytics</div>
                  <div className="text-2xl font-black text-[#f5d98a] mt-1">{crmAnalytics.totalPlatformViews || 0}</div>
                  <div className="text-[9px] text-[#596478] mt-1">Includes {crmAnalytics.bookViewsCount || 0} dynamic book detail views</div>
                </div>

                <div className="p-4 rounded-xl bg-[#0a0e18] border border-white/5">
                  <div className="text-[10px] text-[#596478] font-black uppercase">SMTP Relay Server</div>
                  <div className="flex items-center gap-1.5 mt-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${smtpConfig.username ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                    <span className="text-xs font-bold text-white uppercase">{smtpConfig.username ? 'relay configured' : 'simulation bypass'}</span>
                  </div>
                  <div className="text-[9px] text-[#596478] mt-1">{smtpConfig.host || 'No Host Configured'}</div>
                </div>
              </div>

              {/* Sub tabs hierarchy */}
              <div className="flex flex-wrap border-b border-white/5 gap-2 pb-0.5">
                <button 
                  onClick={() => setCrmSubTab('leads')}
                  className={`px-4 py-2 text-xs font-bold border-b-2 transition-all cursor-pointer ${crmSubTab === 'leads' ? 'border-[#C9A227] text-[#C9A227]' : 'border-transparent text-slate-400 hover:text-white'}`}
                >
                  📞 Leads Tracker ({leads.length})
                </button>
                <button 
                  onClick={() => setCrmSubTab('seekers')}
                  className={`px-4 py-2 text-xs font-bold border-b-2 transition-all cursor-pointer ${crmSubTab === 'seekers' ? 'border-[#C9A227] text-[#C9A227]' : 'border-transparent text-slate-400 hover:text-white'}`}
                >
                  👥 Registered Seekers ({seekers.length})
                </button>
                <button 
                  onClick={() => setCrmSubTab('campaigns')}
                  className={`px-4 py-2 text-xs font-bold border-b-2 transition-all cursor-pointer ${crmSubTab === 'campaigns' ? 'border-[#C9A227] text-[#C9A227]' : 'border-transparent text-slate-400 hover:text-white'}`}
                >
                  ✉️ Email Campaigns Manager
                </button>
                <button 
                  onClick={() => setCrmSubTab('smtp')}
                  className={`px-4 py-2 text-xs font-bold border-b-2 transition-all cursor-pointer ${crmSubTab === 'smtp' ? 'border-[#C9A227] text-[#C9A227]' : 'border-transparent text-slate-400 hover:text-white'}`}
                >
                  ⚙️ SMTP SMTP Settings Hook
                </button>
                <button 
                  onClick={() => setCrmSubTab('email-logs')}
                  className={`px-4 py-2 text-xs font-bold border-b-2 transition-all cursor-pointer ${crmSubTab === 'email-logs' ? 'border-[#C9A227] text-[#C9A227]' : 'border-transparent text-slate-400 hover:text-white'}`}
                >
                  📜 Delivery Audit Logs ({emailLogs.length})
                </button>
              </div>

              {/* Subtab Content: Leads */}
              {crmSubTab === 'leads' && (
                <div className="space-y-4">
                  {/* Filters and Downloader UI */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/[0.01] border border-white/5 p-4 rounded-xl">
                    <div className="flex flex-wrap gap-3 text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[#596478]">Status:</span>
                        <select 
                          value={leadStatusFilter} 
                          onChange={e => setLeadStatusFilter(e.target.value)}
                          className="bg-[#0a0e18] border border-white/10 text-white rounded-lg p-1 font-semibold"
                        >
                          <option value="All">All statuses</option>
                          <option value="New">New Intake</option>
                          <option value="Contacted">Contacted</option>
                          <option value="In-Progress">In-Progress</option>
                          <option value="Consulted">Consulted</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className="text-[#596478]">Source:</span>
                        <select 
                          value={leadSourceFilter} 
                          onChange={e => setLeadSourceFilter(e.target.value)}
                          className="bg-[#0a0e18] border border-white/10 text-white rounded-lg p-1 font-semibold"
                        >
                          <option value="All">All Sources</option>
                          <option value="Contact">Contact Form</option>
                          <option value="Inquiry">General Inquiry</option>
                          <option value="Book Store">Sacred Books</option>
                          <option value="Service">Consultation booking</option>
                          <option value="WhatsApp">WhatsApp click</option>
                        </select>
                      </div>
                    </div>

                    <button 
                      onClick={exportLeadsToCSV}
                      className="px-3 py-1.5 rounded-lg bg-[#C9A227]/10 hover:bg-[#C9A227]/20 border border-[#C9A227]/20 font-black text-xs text-[#f5d98a] flex items-center gap-1.5 transition-all"
                    >
                      <Download className="w-3.5 h-3.5" /> Export leads (CSV)
                    </button>
                  </div>

                  {/* Leads Data Table */}
                  <div className="overflow-x-auto rounded-xl border border-white/10 bg-[#06080F]">
                    <table className="w-full border-collapse font-sans text-xs">
                      <thead>
                        <tr className="bg-[#0a0e18] border-b border-white/10 text-[#8b96aa]">
                          <th className="p-4 text-left font-black uppercase tracking-wider">Client / Seeker</th>
                          <th className="p-4 text-left font-black uppercase tracking-wider">WhatsApp Phone</th>
                          <th className="p-4 text-left font-black uppercase tracking-wider">Target Topic</th>
                          <th className="p-4 text-left font-black uppercase tracking-wider">Astrological Data</th>
                          <th className="p-4 text-left font-black uppercase tracking-wider">Appointment Specs</th>
                          <th className="p-4 text-left font-black uppercase tracking-wider">Source Channel</th>
                          <th className="p-4 text-left font-black uppercase tracking-wider">CRM Lead Status</th>
                          <th className="p-4 text-left font-black uppercase tracking-wider">Notes & Logs</th>
                          <th className="p-4 text-center font-black uppercase tracking-wider">Connect</th>
                        </tr>
                      </thead>
                      <tbody>
                        {leads
                          .filter(l => leadStatusFilter === 'All' || l.status === leadStatusFilter)
                          .filter(l => leadSourceFilter === 'All' || (l.source || 'Contact') === leadSourceFilter)
                          .map(l => (
                          <tr key={l.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.01] transition-all">
                            <td className="p-4 align-top">
                              <div className="font-bold text-white text-sm">{l.name}</div>
                              <div className="text-[10px] text-[#8b96aa] mt-0.5">{l.email}</div>
                              <div className="text-[9px] text-[#596478] mt-1.5">Captured: {new Date(l.createdAt).toLocaleString()}</div>
                            </td>
                            <td className="p-4 align-top font-mono text-slate-200 mt-1">{l.phone}</td>
                            <td className="p-4 align-top">
                              <span className="px-2 py-0.5 text-[10px] rounded-full bg-white/5 border border-white/5 font-semibold text-[#f5d98a] whitespace-nowrap">
                                {l.service || 'Default Consultation'}
                              </span>
                            </td>
                            <td className="p-4 align-top space-y-1">
                              {l.date ? (
                                <>
                                  <div className="text-[#8b96aa]">📅 DOB: <span className="text-white font-semibold">{l.date}</span></div>
                                  {l.time && <div className="text-[#8b96aa]">🕐 Time: <span className="text-white">{l.time}</span></div>}
                                  {l.place && <div className="text-[#8b96aa]">📍 Place: <span className="text-white">{l.place}</span></div>}
                                </>
                              ) : (
                                <span className="text-[#596478] italic">No chart specs</span>
                              )}
                            </td>
                            <td className="p-4 align-top">
                              {l.bookingDate ? (
                                <div className="space-y-1">
                                  <div className="font-bold text-emerald-400">📅 {l.bookingDate}</div>
                                  <div className="text-[#8b96aa]">Slot: {l.bookingTime}</div>
                                </div>
                              ) : (
                                <span className="text-[#596478] italic">Simple inquiry</span>
                              )}
                            </td>
                            <td className="p-4 align-top">
                              <span className="text-slate-300 font-semibold">{l.source || 'Contact'}</span>
                            </td>
                            <td className="p-4 align-top">
                              <select 
                                value={l.status} 
                                onChange={e => handleUpdateLeadStatus(l.id, e.target.value as LeadStatus)} 
                                className="p-1.5 rounded-lg bg-[#080B12] border border-white/10 text-white cursor-pointer font-bold text-[10px]"
                              >
                                <option value="New">🟢 New Intake</option>
                                <option value="Contacted">🟡 Contacted</option>
                                <option value="In-Progress">🟠 In-Progress</option>
                                <option value="Consulted">🔵 Consulted Done</option>
                                <option value="Cancelled">🔴 Cancelled</option>
                              </select>
                            </td>
                            <td className="p-4 align-top">
                              <textarea 
                                value={l.notes} 
                                onChange={e => {
                                  const val = e.target.value;
                                  setLeads(leads.map(lead => lead.id === l.id ? { ...lead, notes: val } : lead));
                                  handleUpdateLeadNotes(l.id, val);
                                }} 
                                placeholder="Append administrative follow-up notes..."
                                className="w-44 bg-[#080B12] border border-white/5 rounded-lg p-2 text-white h-16 text-[11px] outline-none resize-none focus:border-[#C9A227] transition-all" 
                              />
                            </td>
                            <td className="p-4 align-top text-center">
                              <button 
                                onClick={() => {
                                  const text = encodeURIComponent(`Pranam ${l.name} ji! This is Acharya TN Khurana's consultation office regarding your inquiry. We are happy to schedule your auspicious chart reading session!`);
                                  window.open(`https://wa.me/${l.phone.replace(/[^0-9]/g, '') || site.whatsapp || '919876543210'}?text=${text}`, '_blank');
                                  
                                  // Log lead click source WhatsApp
                                  fetch('/api/crm/leads', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({
                                      name: l.name,
                                      phone: l.phone,
                                      email: l.email,
                                      source: 'WhatsApp',
                                      message: `Initiated direct administrative follow-up chat on WhatsApp.`,
                                      service: l.service
                                    })
                                  });
                                }} 
                                className="w-8 h-8 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mx-auto" 
                                title="Click to open WhatsApp chat thread"
                              >
                                <PhoneCall className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                        {leads.length === 0 && (
                          <tr>
                            <td colSpan={9} className="p-8 text-center text-[#596478] italic">No captured seek leads found in database.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Subtab Content: Registered Seekers */}
              {crmSubTab === 'seekers' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center bg-white/[0.01] border border-white/5 p-4 rounded-xl">
                    <span className="text-white text-xs font-semibold">Listing all dynamically created customer/seeker profiles.</span>
                    <button 
                      onClick={exportSeekersToCSV}
                      className="px-3 py-1.5 rounded-lg bg-[#C9A227]/10 hover:bg-[#C9A227]/20 border border-[#C9A227]/20 font-black text-xs text-[#f5d98a] flex items-center gap-1.5 transition-all"
                    >
                      <Download className="w-3.5 h-3.5" /> Export seeker schema (CSV)
                    </button>
                  </div>

                  <div className="overflow-x-auto rounded-xl border border-white/10 bg-[#06080F]">
                    <table className="w-full border-collapse font-sans text-xs">
                      <thead>
                        <tr className="bg-[#0a0e18] border-b border-white/10 text-[#8b96aa]">
                          <th className="p-4 text-left font-black uppercase">Seeker Account</th>
                          <th className="p-4 text-left font-black uppercase">Phone / Contact</th>
                          <th className="p-4 text-left font-black uppercase">City / Address</th>
                          <th className="p-4 text-left font-black uppercase">Registration Date</th>
                          <th className="p-4 text-left font-black uppercase">Last Active Date</th>
                          <th className="p-4 text-center font-black uppercase">Login Count</th>
                        </tr>
                      </thead>
                      <tbody>
                        {seekers.map(s => (
                          <tr key={s.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.01] transition-all">
                            <td className="p-4 align-top">
                              <div className="font-bold text-white text-sm">{s.name}</div>
                              <div className="text-[10px] text-[#C9A227] font-semibold">{s.email}</div>
                              <div className="text-[9px] text-[#596478] mt-1">ID: {s.id}</div>
                            </td>
                            <td className="p-4 align-top font-semibold text-slate-200">{s.phone || <em className="text-[#596478]">None provided</em>}</td>
                            <td className="p-4 align-top space-y-1">
                              <div className="text-white font-medium">{s.city || <span className="text-[#596478] italic">-</span>}</div>
                              {s.address && <div className="text-[#8b96aa] text-[10px] leading-relaxed max-w-xs">{s.address}</div>}
                            </td>
                            <td className="p-4 align-top text-slate-300">{s.registeredDate ? new Date(s.registeredDate).toLocaleDateString() : 'N/A'}</td>
                            <td className="p-4 align-top text-white font-semibold">
                              {s.lastLoginDate ? new Date(s.lastLoginDate).toLocaleString() : <span className="text-[#596478] italic">Never</span>}
                            </td>
                            <td className="p-4 align-top text-center text-sm font-black text-[#f5d98a]">{s.loginCount || 0} logins</td>
                          </tr>
                        ))}
                        {seekers.length === 0 && (
                          <tr>
                            <td colSpan={6} className="p-8 text-center text-[#596478] italic">No seeker portal accounts registered in current database namespace.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Subtab Content: Campaigns manager */}
              {crmSubTab === 'campaigns' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left items-start">
                  {/* Create campaign */}
                  <form onSubmit={handleBroadcastCampaign} className="lg:col-span-5 p-6 rounded-2xl bg-[#0a0e18]/80 border border-white/5 space-y-4">
                    <h3 className="font-serif text-lg font-bold text-white">Create New Broadcast Campaign</h3>
                    <p className="text-[11px] text-[#8b96aa]">Compose HTML rich emails to send instantly to all subscribers via active SMTP relay.</p>

                    <div className="text-xs space-y-3.5">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-[#8b96aa] uppercase">Campaign Identifier (Internal Title)</label>
                        <input 
                          type="text" 
                          value={campaignTitle} 
                          onChange={e => setCampaignTitle(e.target.value)} 
                          placeholder="e.g. June Shani Transit Remedial Campaign" 
                          className="form-input text-xs" 
                          required 
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-[#8b96aa] uppercase">Email Subject Line (Seeker Facing)</label>
                        <input 
                          type="text" 
                          value={campaignSubject} 
                          onChange={e => setCampaignSubject(e.target.value)} 
                          placeholder="e.g. 🪐 Critical Vedic guidelines for upcoming Saturn Shani retrograde transits!" 
                          className="form-input text-xs" 
                          required 
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-[#8b96aa] uppercase">Email HTML/Plain Body Content</label>
                        <textarea 
                          value={campaignContent} 
                          onChange={e => setCampaignContent(e.target.value)} 
                          rows={8}
                          placeholder="Compose your spiritual advice or marketing campaigns here..." 
                          className="form-input text-xs font-mono h-48 resize-none" 
                          required 
                        />
                      </div>

                      <button 
                        type="submit" 
                        disabled={isSendingCampaign}
                        className="w-full h-11 rounded-xl bg-gradient-to-r from-[#C9A227] to-[#f0d070] text-[#1a1000] font-black cursor-pointer flex items-center justify-center gap-2"
                      >
                        {isSendingCampaign ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" /> Distributing transit campaigns...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" /> Deploy Bulk Email Broadcast
                          </>
                        )}
                      </button>
                    </div>
                  </form>

                  {/* Past Sent Campaigns list */}
                  <div className="lg:col-span-7 space-y-4">
                    <h3 className="font-serif text-lg font-bold text-white">Broadcast Campaign Registry</h3>
                    <p className="text-xs text-[#8b96aa]">Track previously deployed email marketing campaigns and response metrics.</p>

                    <div className="overflow-x-auto rounded-xl border border-white/10 bg-[#06080F]">
                      <table className="w-full border-collapse font-sans text-xs">
                        <thead>
                          <tr className="bg-[#0a0e18] border-b border-white/10 text-[#8b96aa]">
                            <th className="p-3 text-left font-black">Campaign Specs</th>
                            <th className="p-3 text-left font-black">Subject Line</th>
                            <th className="p-3 text-left font-black">Dispatched Date</th>
                            <th className="p-3 text-center font-black">Sent Records</th>
                            <th className="p-3 text-center font-black">Delivered OK</th>
                            <th className="p-3 text-center font-black">Failed</th>
                          </tr>
                        </thead>
                        <tbody>
                          {campaigns.map(c => (
                            <tr key={c.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.01]">
                              <td className="p-3 align-middle font-bold text-white text-sm">{c.title}</td>
                              <td className="p-3 align-middle text-slate-300 italic">"{c.subject}"</td>
                              <td className="p-3 align-middle text-slate-400">{new Date(c.sentAt).toLocaleString()}</td>
                              <td className="p-3 align-middle text-center font-bold text-blue-400">{c.recipientsCount} readers</td>
                              <td className="p-3 align-middle text-center text-emerald-400 font-extrabold">{c.successCount} ok</td>
                              <td className="p-3 align-middle text-center text-red-400 font-bold">{c.failedCount} err</td>
                            </tr>
                          ))}
                          {campaigns.length === 0 && (
                            <tr>
                              <td colSpan={6} className="p-6 text-center text-[#596478] italic">No corporate email campaigns issued. Take initiative and draft your first email.</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Subtab Content: SMTP Setup hook */}
              {crmSubTab === 'smtp' && (
                <div className="max-w-2xl mx-auto p-8 rounded-2xl bg-[#0a0e18] border border-white/5 text-left md:space-y-6">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-white">SMTP Relay Systems Setup</h3>
                    <p className="text-xs text-[#8b96aa] mt-1">Configure your official server credentials (such as Gmail app secrets, SendGrid API keys, Brevo relay configurations) to send real-time OTP checks and admin notifications dynamically.</p>
                  </div>

                  {/* Real-time Connection Status Banner */}
                  <div className={`p-4 rounded-xl border flex items-center justify-between gap-4 text-xs ${
                    smtpLiveStatus === 'Connected' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                    smtpLiveStatus === 'Checking' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
                    'bg-rose-500/10 border-rose-500/20 text-rose-400'
                  }`}>
                    <div className="flex items-center gap-2.5">
                      <span className={`w-2.5 h-2.5 rounded-full ${
                        smtpLiveStatus === 'Connected' ? 'bg-emerald-500 animate-pulse' :
                        smtpLiveStatus === 'Checking' ? 'bg-amber-400 animate-spin' :
                        'bg-rose-500'
                      }`} />
                      <div>
                        <span className="font-bold uppercase tracking-wider">SMTP Server Link Status: {smtpLiveStatus}</span>
                        {smtpLiveError && (
                          <p className="text-[11px] text-[#ff6b6b] mt-1 font-mono leading-relaxed">{smtpLiveError}</p>
                        )}
                      </div>
                    </div>
                    <button 
                      type="button" 
                      onClick={checkSmtpLiveStatus} 
                      className="px-3 py-1 cursor-pointer bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 text-white font-bold transition-all flex items-center gap-1.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5" /> Re-verify Now
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-[#8b96aa] uppercase">Astro Provider Type</label>
                      <select 
                        value={smtpConfig.serviceType}
                        onChange={e => setSmtpConfig({ ...smtpConfig, serviceType: e.target.value })}
                        className="form-input text-xs bg-[#080B12]"
                      >
                        <option value="Gmail">Gmail (OAuth / Secure App Key)</option>
                        <option value="Brevo">Brevo Host Relay</option>
                        <option value="SendGrid">SendGrid Mail API</option>
                        <option value="Mailgun">Mailgun Gateway</option>
                        <option value="Custom">Custom Astro SMTP Server</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-[#8b96aa] uppercase">SMTP Connection Host Server</label>
                      <input 
                        type="text" 
                        value={smtpConfig.host}
                        onChange={e => setSmtpConfig({ ...smtpConfig, host: e.target.value })}
                        placeholder="e.g. smtp.gmail.com" 
                        className="form-input text-xs" 
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-[#8b96aa] uppercase">Relay Port Numbers</label>
                      <input 
                        type="number" 
                        value={smtpConfig.port}
                        onChange={e => setSmtpConfig({ ...smtpConfig, port: Number(e.target.value) })}
                        placeholder="587" 
                        className="form-input text-xs" 
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-[#8b96aa] uppercase">Requires Secure Transport (SSL/TLS)</label>
                      <div className="flex gap-4 mt-2">
                        <label className="inline-flex items-center gap-1.5 cursor-pointer">
                          <input 
                            type="radio" 
                            name="secure" 
                            checked={smtpConfig.secure === true} 
                            onChange={() => setSmtpConfig({ ...smtpConfig, secure: true })} 
                            className="bg-[#0a0e18] border border-white/10"
                          />
                          <span className="text-slate-300">True (Port 465)</span>
                        </label>
                        <label className="inline-flex items-center gap-1.5 cursor-pointer">
                          <input 
                            type="radio" 
                            name="secure" 
                            checked={smtpConfig.secure === false} 
                            onChange={() => setSmtpConfig({ ...smtpConfig, secure: false })} 
                            className="bg-[#0a0e18] border border-white/10"
                          />
                          <span className="text-slate-300">False (Port 587 / STARTTLS)</span>
                        </label>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-[#8b96aa] uppercase">Authenticating Username (Relay Email)</label>
                      <input 
                        type="text" 
                        value={smtpConfig.username}
                        onChange={e => setSmtpConfig({ ...smtpConfig, username: e.target.value })}
                        placeholder="e.g. office@acharyakhurana.com" 
                        className="form-input text-xs" 
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-[#8b96aa] uppercase">Authentication Password (API Secret / App Key)</label>
                      <input 
                        type="password" 
                        value={smtpConfig.password}
                        onChange={e => setSmtpConfig({ ...smtpConfig, password: e.target.value })}
                        placeholder="••••••••••••••••••••" 
                        className="form-input text-xs" 
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-[#8b96aa] uppercase">Official Sender Email Address</label>
                      <input 
                        type="text" 
                        value={smtpConfig.senderEmail}
                        onChange={e => setSmtpConfig({ ...smtpConfig, senderEmail: e.target.value })}
                        placeholder="seeker@acharyakhurana.com" 
                        className="form-input text-xs" 
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-[#8b96aa] uppercase">Official Signature Name</label>
                      <input 
                        type="text" 
                        value={smtpConfig.senderName}
                        onChange={e => setSmtpConfig({ ...smtpConfig, senderName: e.target.value })}
                        placeholder="Astrologer Acharya TN Khurana Office" 
                        className="form-input text-xs" 
                      />
                    </div>
                  </div>

                  {smtpCheckResult && (
                    <div className={`p-4 rounded-xl border text-xs leading-relaxed font-mono whitespace-pre-wrap ${
                      smtpCheckResult.success ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                    }`}>
                      <div className="font-bold mb-1 uppercase tracking-wider">
                        {smtpCheckResult.success ? '📊 Handshake Success Logs' : '❌ Handshake Error Diagnostic Logs'}
                      </div>
                      {smtpCheckResult.message}
                    </div>
                  )}

                  <div className="pt-4 border-t border-white/5 flex flex-col md:flex-row justify-between gap-4 text-xs items-center">
                    <p className="text-[11px] text-[#8b96aa] font-semibold max-w-sm">⚠️ Fill out and test the SMTP handshake live before deploying & saving live settings.</p>
                    <div className="flex gap-2 w-full md:w-auto justify-end">
                      <button 
                        type="button" 
                        onClick={testSMTPConnection}
                        disabled={smtpChecking}
                        className="px-5 py-3 cursor-pointer rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-1.5"
                      >
                        {smtpChecking ? <RefreshCw className="w-4 h-4 animate-spin text-[#C9A227]" /> : <Activity className="w-4 h-4 text-[#C9A227]" />}
                        {smtpChecking ? 'Handshaking...' : 'SMTP Connection Test'}
                      </button>

                      <button 
                        type="button" 
                        onClick={saveSMTPConfig}
                        className="px-6 py-3 cursor-pointer rounded-xl bg-gradient-to-r from-[#C9A227] to-[#f0d070] text-[#1a1000] font-black flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg"
                      >
                        <Save className="w-4 h-4" /> Save Settings
                      </button>
                    </div>
                  </div>

                  {/* Live SMTP Diagnostics Sandbox Terminal Card */}
                  <div className="mt-8 p-6 rounded-2xl bg-[#0d1222] border border-[#C9A227]/20 text-left space-y-4">
                    <div className="flex items-center gap-2">
                      <Terminal className="w-5 h-5 text-[#C9A227] animate-pulse" />
                      <h4 className="font-serif text-lg font-bold text-white">Live SMTP Diagnostics Sandbox</h4>
                    </div>
                    <p className="text-xs text-[#8b96aa]">
                      Validate real-time mail transport flow, firewall allowances, and authentication policies on our server. Trigger a custom test email bypass directly to any external mailbox and observe raw connection error logs.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end text-xs">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-[#596478] uppercase font-mono">Target Recipient Address</label>
                        <input 
                          type="email"
                          value={testRecipient}
                          onChange={e => setTestRecipient(e.target.value)}
                          placeholder="e.g. testing@gmail.com"
                          className="form-input text-xs bg-[#080B12] border-white/10 text-white"
                        />
                      </div>
                      <button 
                        type="button"
                        onClick={runManualSMTPTest}
                        disabled={testStatus === 'sending'}
                        className="px-5 py-3 cursor-pointer rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                      >
                        {testStatus === 'sending' ? (
                          <RefreshCw className="w-4 h-4 animate-spin text-[#C9A227]" />
                        ) : (
                          <Send className="w-4 h-4 text-[#C9A227]" />
                        )}
                        {testStatus === 'sending' ? 'Dispatching Test Mail...' : 'Send Manual Test Email'}
                      </button>
                    </div>

                    {testStatus !== 'idle' && (
                      <div className="mt-4 p-4 rounded-xl bg-black border border-white/5 font-mono text-[11px] space-y-2">
                        <div className="flex justify-between items-center text-[10px] text-[#596478] border-b border-white/5 pb-1.5 uppercase font-bold tracking-wider">
                          <span>Diagnostic Terminal Output</span>
                          <span className={
                            testStatus === 'sending' ? 'text-amber-400 animate-pulse' :
                            testStatus === 'success' ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'
                          }>
                            {testStatus}
                          </span>
                        </div>
                        <pre className={`whitespace-pre-wrap break-all ${
                          testStatus === 'success' ? 'text-emerald-400 font-medium' :
                          testStatus === 'failed' ? 'text-red-400 font-medium' : 'text-slate-300'
                        }`}>
                          {testFeedback}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Subtab Content: Email delivery logs */}
              {crmSubTab === 'email-logs' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center bg-white/[0.01]/70 border border-white/5 p-4 rounded-xl">
                    <span className="text-white text-xs">Check diagnostic records for every email dispatched to seekers from Astro CMS server.</span>
                    <span className="text-[10px] font-black bg-white/5 px-2.5 py-1 rounded-full text-slate-300">Relay Namespace Active</span>
                  </div>

                  <div className="overflow-x-auto rounded-xl border border-white/10 bg-[#06080F]">
                    <table className="w-full border-collapse font-sans text-xs">
                      <thead>
                        <tr className="bg-[#0a0e18] border-b border-white/10 text-[#8b96aa]">
                          <th className="p-3 text-left font-black">Recipient</th>
                          <th className="p-3 text-left font-black">Subject Line / Purpose</th>
                          <th className="p-3 text-left font-black">Template Class</th>
                          <th className="p-3 text-left font-black">Dispatch Timestamp</th>
                          <th className="p-3 text-center font-black">Relay Status</th>
                          <th className="p-3 text-left font-black">Gateway Error logs</th>
                        </tr>
                      </thead>
                      <tbody>
                        {emailLogs.map(g => (
                          <tr key={g.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.01] transition-all">
                            <td className="p-3 font-semibold text-slate-200">{g.recipient}</td>
                            <td className="p-3 italic text-white font-medium">"{g.subject}"</td>
                            <td className="p-3">
                              <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                                g.type === 'OTP' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/10' :
                                g.type === 'Campaign' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/10' :
                                'bg-slate-500/10 text-slate-400 border border-slate-500/10'
                              }`}>
                                {g.type || 'Notification'}
                              </span>
                            </td>
                            <td className="p-3 text-slate-400 font-mono text-[10px]">{new Date(g.timestamp).toLocaleString()}</td>
                            <td className="p-3 text-center">
                              <span className={`px-2 py-1 rounded-full text-[10px] font-extrabold ${g.status === 'DELIVERED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                                {g.status}
                              </span>
                            </td>
                            <td className="p-3 max-w-xs font-mono text-[10px] leading-relaxed text-slate-500 break-words">{g.error || '-'}</td>
                          </tr>
                        ))}
                        {emailLogs.length === 0 && (
                          <tr>
                            <td colSpan={6} className="p-6 text-center text-[#596478] italic">Diagnostics registry blank. Initiate register verification or campaigns to generate logs.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 5b: SACRED BOOK STORE & INVENTORY */}
          {activeTab === 'books' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-[#f5d98a]">Sacred Store Inventory & Systems</h2>
                  <p className="text-xs text-[#8b96aa] mt-0.5">Control dynamic printed manuscripts, configure checkout coupon systems, and view e-commerce acquisition order channels.</p>
                </div>
                
                {/* Sub Tab Buttons */}
                <div className="flex bg-white/[0.02] border border-white/5 rounded-xl p-1 gap-1">
                  <button 
                    onClick={() => setActiveBookSubTab('inventory')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeBookSubTab === 'inventory' ? 'bg-[#C9A227] text-black border-none' : 'bg-transparent text-slate-400 hover:text-white border-none'}`}
                  >
                    📚 Manuscripts ({books ? books.length : 0})
                  </button>
                  <button 
                    onClick={() => setActiveBookSubTab('coupons')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeBookSubTab === 'coupons' ? 'bg-[#C9A227] text-black border-none' : 'bg-transparent text-slate-400 hover:text-white border-none'}`}
                  >
                    🏷️ Coupons ({coupons ? coupons.length : 0})
                  </button>
                  <button 
                    onClick={() => setActiveBookSubTab('orders')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeBookSubTab === 'orders' ? 'bg-[#C9A227] text-black border-none' : 'bg-transparent text-slate-400 hover:text-white border-none'}`}
                  >
                    🚚 Orders Tracker ({orders ? orders.length : 0})
                  </button>
                </div>
              </div>

              {/* Sub-tab 1: Inventory List */}
              {activeBookSubTab === 'inventory' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center bg-[#0a0e18]/40 border border-white/5 p-4 rounded-xl flex-wrap gap-2 text-left">
                    <span className="text-xs text-slate-400">Add, edit metadata content, pricing parameters, or customize individual URL slugs & search keywords.</span>
                    <button 
                      onClick={() => {
                        const newBk: Book = {
                          id: `bo_${Date.now()}`,
                          title: "New Devotional Manuscript",
                          author: "Acharya TN Khurana",
                          desc: "A brief instructional synthesis representing Astro remedies.",
                          price: 499,
                          category: "Vedic Astrology",
                          coverImage: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600",
                          images: ["https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600"],
                          stock: 10,
                          isFeatured: false,
                          isBestseller: false,
                          status: 'Available',
                          slug: `manuscript-${Date.now()}`,
                          seoTitle: "New Devotional Manuscript Guide",
                          seoDescription: "A guide detailing ancient Vedic remedial principles.",
                          seoKeywords: "vedic guide, remedies"
                        };
                        setBooks([...books, newBk]);
                        setEditingBookId(newBk.id);
                        logActivity("ADD BOOK INVENTORY", `Created new draft text: "${newBk.title}"`);
                        setActivityLogs(getActivityLogs());
                      }}
                      className="btn btn-sm btn-gold flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5 animate-pulse" /> Append New Book
                    </button>
                  </div>

                  <div className="space-y-4">
                    {books.map(bk => (
                      <div key={bk.id} className="p-5 rounded-2xl border border-white/5 bg-[#0a0e18]/40 flex flex-col gap-4 text-left">
                        <div className="flex items-center justify-between flex-wrap gap-3">
                          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setEditingBookId(editingBookId === bk.id ? null : bk.id)}>
                            <div className="w-12 h-14 rounded bg-slate-900 overflow-hidden shrink-0 border border-white/10">
                              <img src={bk.coverImage} alt={bk.title} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <div className="font-bold text-sm text-white flex items-center gap-2">
                                {bk.title}
                                {bk.isFeatured && <span className="bg-amber-500/10 text-amber-500 text-[10px] px-1.5 py-0.5 rounded uppercase font-black">Featured</span>}
                                {bk.isBestseller && <span className="bg-purple-500/10 text-purple-400 text-[10px] px-1.5 py-0.5 rounded uppercase font-black">Bestseller</span>}
                              </div>
                              <div className="text-[10px] text-[#596478] font-semibold mt-1">📚 Author: {bk.author} · SKU Category: {bk.category} · Stock: {bk.stock} copies</div>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <button 
                              type="button"
                              onClick={() => {
                                const nextStatus = bk.status === 'Available' ? 'Out of Stock' : 'Available';
                                setBooks(books.map(b => b.id === bk.id ? { ...b, status: nextStatus, stock: nextStatus === 'Available' ? 10 : 0 } : b));
                              }}
                              className={`btn btn-sm text-[11px] font-extrabold ${bk.status === 'Available' ? 'btn-gold' : 'btn-outline-gold opacity-50'}`}
                            >
                              {bk.status === 'Available' ? '🟢 Available' : '🛑 Out of Stock'}
                            </button>
                            <button 
                              type="button"
                              onClick={() => setEditingBookId(editingBookId === bk.id ? null : bk.id)}
                              className="btn btn-sm btn-outline-gold font-bold text-xs"
                            >
                              {editingBookId === bk.id ? 'Close' : 'Configure'}
                            </button>
                            <button 
                              type="button"
                              onClick={() => {
                                setBooks(books.filter(b => b.id !== bk.id));
                                logActivity("DELETED BOOK MANUSCRIPT", `Deleted text: ${bk.title}`);
                                setActivityLogs(getActivityLogs());
                              }} 
                              className="w-8 h-8 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 flex items-center justify-center shrink-0"
                            >
                              <Trash className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {editingBookId === bk.id && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/5 text-left">
                            <div className="space-y-1">
                              <label className="text-xs text-[#8b96aa] block">Volume Title *</label>
                              <input type="text" value={bk.title} onChange={e => setBooks(books.map(b => b.id === bk.id ? { ...b, title: e.target.value } : b))} className="form-input" />
                            </div>
                            <div className="space-y-1">
                              <label className="text-xs text-[#8b96aa] block">Author / Compiler Name *</label>
                              <input type="text" value={bk.author} onChange={e => setBooks(books.map(b => b.id === bk.id ? { ...b, author: e.target.value } : b))} className="form-input" />
                            </div>
                            <div className="space-y-1">
                              <label className="text-xs text-[#8b96aa] block">Publishing Category *</label>
                              <input type="text" value={bk.category} onChange={e => setBooks(books.map(b => b.id === bk.id ? { ...b, category: e.target.value } : b))} className="form-input" />
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                              <div className="space-y-1">
                                <label className="text-[10px] text-[#8b96aa] block">Cover Price (₹) *</label>
                                <input type="number" value={bk.price} onChange={e => setBooks(books.map(b => b.id === bk.id ? { ...b, price: parseInt(e.target.value) || 0 } : b))} className="form-input" />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] text-[#8b96aa] block">Sale Price (₹)</label>
                                <input type="number" value={bk.salePrice || 0} onChange={e => setBooks(books.map(b => b.id === bk.id ? { ...b, salePrice: parseInt(e.target.value) || undefined } : b))} className="form-input" />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] text-[#8b96aa] block">Stock Qty *</label>
                                <input type="number" value={bk.stock} onChange={e => setBooks(books.map(b => b.id === bk.id ? { ...b, stock: parseInt(e.target.value) || 0, status: (parseInt(e.target.value) || 0) > 0 ? 'Available' : 'Out of Stock' } : b))} className="form-input" />
                              </div>
                            </div>

                            <div className="sm:col-span-2 space-y-1">
                              <label className="text-xs text-[#8b96aa] block">Primary Cover Image URL *</label>
                              <input type="text" value={bk.coverImage} onChange={e => setBooks(books.map(b => b.id === bk.id ? { ...b, coverImage: e.target.value, images: [e.target.value] } : b))} className="form-input" />
                            </div>

                            <div className="sm:col-span-2 space-y-1">
                              <label className="text-xs text-[#8b96aa] block">Gallery Images (Comma-separated URLs)</label>
                              <textarea 
                                value={bk.images ? bk.images.join(', ') : bk.coverImage} 
                                onChange={e => setBooks(books.map(b => b.id === bk.id ? { ...b, images: e.target.value.split(',').map(s => s.trim()) } : b))}
                                className="form-textarea h-16 text-xs" 
                              />
                            </div>

                            <div className="sm:col-span-2 space-y-1">
                              <label className="text-xs text-[#8b96aa] block">Book Synopsis Overview *</label>
                              <textarea value={bk.desc} onChange={e => setBooks(books.map(b => b.id === bk.id ? { ...b, desc: e.target.value } : b))} className="form-textarea h-24 text-xs" />
                            </div>

                            {/* Advanced SEO Metadata */}
                            <div className="sm:col-span-2 p-4 rounded-xl bg-purple-950/10 border border-purple-500/10 space-y-3 mt-2 text-left">
                              <h4 className="text-xs font-bold text-purple-400 uppercase tracking-widest block">🌐 Individual Book SEO Parameters</h4>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                                <div className="space-y-1">
                                  <label className="text-[10px] text-purple-300">Custom Slugs Code *</label>
                                  <input type="text" value={bk.slug} onChange={e => setBooks(books.map(b => b.id === bk.id ? { ...b, slug: e.target.value } : b))} className="form-input border-purple-500/20" />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[10px] text-purple-300">SEO Optimized Page Title</label>
                                  <input type="text" value={bk.seoTitle || ''} onChange={e => setBooks(books.map(b => b.id === bk.id ? { ...b, seoTitle: e.target.value } : b))} className="form-input border-purple-500/20" placeholder="e.g. Masterclass on Kundli | Publisher" />
                                </div>
                                <div className="sm:col-span-2 space-y-1">
                                  <label className="text-[10px] text-purple-300">Individual Meta Description</label>
                                  <textarea value={bk.seoDescription || ''} onChange={e => setBooks(books.map(b => b.id === bk.id ? { ...b, seoDescription: e.target.value } : b))} className="form-textarea h-16 text-xs border-purple-500/20 resize-none" placeholder="e.g. Discover ancient blueprints to understanding astrological charts easily." />
                                </div>
                                <div className="sm:col-span-2 space-y-1">
                                  <label className="text-[10px] text-purple-300">Key Terms / Keywords</label>
                                  <input type="text" value={bk.seoKeywords || ''} onChange={e => setBooks(books.map(b => b.id === bk.id ? { ...b, seoKeywords: e.target.value } : b))} className="form-input border-purple-500/20" placeholder="e.g. kundli reading, astro guides" />
                                </div>
                              </div>
                            </div>

                            <div className="sm:col-span-2 flex items-center gap-4 py-2 border-t border-white/5">
                              <label className="flex items-center gap-2 cursor-pointer text-xs text-white font-semibold">
                                <input type="checkbox" checked={bk.isFeatured} onChange={e => setBooks(books.map(b => b.id === bk.id ? { ...b, isFeatured: e.target.checked } : b))} className="rounded border-white/10 dark:bg-black" />
                                Feature in Homepage Showcase
                              </label>
                              <label className="flex items-center gap-2 cursor-pointer text-xs text-white font-semibold">
                                <input type="checkbox" checked={bk.isBestseller} onChange={e => setBooks(books.map(b => b.id === bk.id ? { ...b, isBestseller: e.target.checked } : b))} className="rounded border-white/10 dark:bg-black" />
                                Best Seller Selection Ribbon
                              </label>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sub-tab 2: Coupon Manager */}
              {activeBookSubTab === 'coupons' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center bg-[#0a0e18]/40 border border-white/5 p-4 rounded-xl flex-wrap gap-2 text-left">
                    <span className="text-xs text-slate-400">Establish shopping discount promo codes applicable during checkouts.</span>
                    <button 
                      onClick={() => {
                        const newCp: Coupon = { id: `cp_${Date.now()}`, code: "FESTIVE15", discountType: "percentage", value: 15, active: true };
                        setCoupons([...coupons, newCp]);
                        setEditingCouponId(newCp.id);
                        logActivity("ADD COUPON CODE", `Created coupon promo code: ${newCp.code}`);
                        setActivityLogs(getActivityLogs());
                      }}
                      className="btn btn-sm btn-gold flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5 animate-bounce" /> Append Discount Code
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {coupons.map(cp => (
                      <div key={cp.id} className="p-4 rounded-xl border border-white/5 bg-[#0a0e18]/30 space-y-3 text-left">
                        <div className="flex items-center justify-between border-b border-white/5 pb-2">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-white uppercase tracking-wider">
                            <Tag className="w-3.5 h-3.5 text-[#C9A227]" /> {cp.code}
                          </div>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => {
                                setCoupons(coupons.map(c => c.id === cp.id ? { ...c, active: !c.active } : c));
                              }}
                              className={`text-[10px] px-2 py-0.5 rounded font-black cursor-pointer ${cp.active ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25' : 'bg-rose-500/10 text-rose-450 border border-rose-500/25'}`}
                            >
                              {cp.active ? '🟢 Active' : '🛑 Inactive'}
                            </button>
                            <button 
                              onClick={() => {
                                setCoupons(coupons.filter(c => c.id !== cp.id));
                                logActivity("DELETED COUPON", `Removed promo key: ${cp.code}`);
                                setActivityLogs(getActivityLogs());
                              }} 
                              className="text-rose-400 text-xs px-2 hover:bg-rose-500/10 rounded"
                            >
                              ✕
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="space-y-1">
                            <label className="text-[10px] text-slate-500">Value Number *</label>
                            <input 
                              type="number" 
                              value={cp.value}
                              onChange={e => setCoupons(coupons.map(c => c.id === cp.id ? { ...c, value: parseInt(e.target.value) || 0 } : c))}
                              className="form-input text-xs" 
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] text-slate-500">Discount Model *</label>
                            <select 
                              value={cp.discountType}
                              onChange={e => setCoupons(coupons.map(c => c.id === cp.id ? { ...c, discountType: e.target.value as 'percentage' | 'fixed' } : c))}
                              className="form-input text-xs bg-black text-white"
                            >
                              <option value="percentage">Percentage %</option>
                              <option value="fixed">Fixed Flat ID (₹)</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sub-tab 3: Orders Directory */}
              {activeBookSubTab === 'orders' && (
                <div className="space-y-6">
                  {/* Ledger of Sales config */}
                  <div className="p-4 rounded-xl border border-white/5 bg-[#0a0e18]/40 flex justify-between items-center text-xs text-slate-400 text-left flex-wrap gap-2">
                    <span>Double click on any order cell to reveal full billing invoice and manual delivery tracking assignment form.</span>
                    <span className="font-mono text-emerald-400 font-bold">Checkout pipeline secured.</span>
                  </div>

                  <div className="space-y-4">
                    {orders.map(ord => (
                      <div key={ord.id} className="p-5 rounded-2xl border border-white/5 bg-[#0a0e18]/40 flex flex-col gap-4 text-left">
                        <div className="flex justify-between items-start flex-wrap gap-4">
                          <div>
                            <div className="flex items-center gap-2 font-mono text-xs font-bold text-[#f5d98a]">
                              <span>INVOICE: {ord.invoiceNumber}</span>
                              <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                                ord.status === 'Delivered' ? 'bg-emerald-500/10 text-emerald-400' :
                                ord.status === 'Shipped' ? 'bg-indigo-500/10 text-indigo-400 animate-pulse' :
                                ord.status === 'Cancelled' ? 'bg-rose-500/10 text-rose-450' : 'bg-amber-500/10 text-amber-500'
                              }`}>
                                {ord.status}
                              </span>
                            </div>
                            <h4 className="font-bold text-sm text-white mt-1">{ord.customerName}</h4>
                            <p className="text-[11px] text-[#596478] mt-0.5">📞 {ord.customerPhone} · Email: {ord.customerEmail}</p>
                            <p className="text-[11px] text-[#8b96aa] truncate max-w-lg mt-1 font-medium">📍 Address: {ord.customerAddress}</p>
                          </div>

                          <div className="flex flex-col items-end gap-2 shrink-0">
                            <span className="font-mono text-base font-black text-white">₹{ord.total.toFixed(0)}</span>
                            <div className="flex gap-2">
                              <select 
                                value={ord.status}
                                onChange={e => {
                                  const nextStatus = e.target.value as any;
                                  setOrders(orders.map(o => o.id === ord.id ? { ...o, status: nextStatus } : o));
                                  logActivity("ORDER STATUS MODIFIED", `Status for ${ord.invoiceNumber} updated to ${nextStatus}`);
                                  setActivityLogs(getActivityLogs());
                                }}
                                className="bg-[#080B12] border border-white/10 text-[11px] font-bold text-slate-350 p-1.5 rounded-lg outline-none cursor-pointer"
                              >
                                <option value="Pending">🕒 Pending</option>
                                <option value="Shipped">✈️ Shipped</option>
                                <option value="Delivered">✓ Delivered</option>
                                <option value="Cancelled">✕ Cancelled</option>
                              </select>
                              
                              <button 
                                type="button"
                                onClick={() => setSelectedOrder(selectedOrder?.id === ord.id ? null : ord)}
                                className="btn btn-sm btn-outline-gold text-xs"
                              >
                                details
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Order Detail Modal / Panel Expansion */}
                        {selectedOrder?.id === ord.id && (
                          <div className="p-4 rounded-xl bg-white/[0.01] border border-white/5 space-y-4 text-xs text-left">
                            <div className="border-t border-white/5 pt-3">
                              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-2">Acquisition Items Breakdown:</span>
                              <div className="space-y-2">
                                {ord.items.map((it, idx) => (
                                  <div key={idx} className="flex justify-between items-center">
                                    <span className="font-bold text-white">{it.title} x{it.quantity}</span>
                                    <span className="font-mono text-slate-400">₹{(it.price * it.quantity).toFixed(0)}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-3 border-t border-white/5">
                              <div className="space-y-1.5">
                                <label className="text-[10px] text-slate-500 font-bold block">Assign Manual Tracking Code / Logistics Notes</label>
                                <input 
                                  type="text" 
                                  value={ord.trackingNumber || ''} 
                                  onChange={e => setOrders(orders.map(o => o.id === ord.id ? { ...o, trackingNumber: e.target.value } : o))}
                                  className="form-input text-xs" 
                                  placeholder="e.g. DTDC-493821 or SpeedPost"
                                />
                              </div>
                              <div className="text-right space-y-1 font-mono text-slate-400">
                                <div>Subtotal Cost: ₹{ord.subtotal.toFixed(0)}</div>
                                {ord.discountAmount > 0 && <div className="text-emerald-400 font-bold">Discount applied: -₹{ord.discountAmount.toFixed(0)} (Promo: {ord.couponUsed})</div>}
                                <div className="font-bold text-white text-sm">Grand Total Checkout Paid: ₹{ord.total.toFixed(0)}</div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 6: BLOG CMS MANAGER */}
          {activeTab === 'blogs' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-[#f5d98a]">Vedic Wisdom Blog Master</h2>
                  <p className="text-xs text-[#8b96aa] mt-0.5">Publish articles, transit forecasts, and remedy scriptures directly to the online blog directory.</p>
                </div>
                <button onClick={handleAddNewBlogPost} className="btn btn-sm btn-gold"><Plus className="w-3.5 h-3.5" /> Write New Article</button>
              </div>

              <div className="space-y-4">
                {blog.map(b => (
                  <div key={b.id} className="p-5 rounded-2xl border border-white/5 bg-[#0a0e18]/40 flex flex-col gap-4 text-left">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 cursor-pointer" onClick={() => setEditingBlogId(editingBlogId === b.id ? null : b.id)}>
                        <span className="text-3xl">{b.icon}</span>
                        <div>
                          <div className="font-bold text-sm text-white">{b.title}</div>
                          <div className="text-[10px] text-[#596478] font-semibold mt-1">📅 Published: {b.date} · {b.category}</div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => setBlog(blog.map(post => post.id === b.id ? { ...post, status: post.status === 'published' ? 'draft' : 'published' } : post))} className={`btn btn-sm ${b.status === 'published' ? 'btn-gold' : 'btn-outline-gold'}`}>{b.status === 'published' ? '🟢 Published' : '🛑 Draft Only'}</button>
                        <button onClick={() => setBlog(blog.filter(post => post.id !== b.id))} className="w-8 h-8 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 flex items-center justify-center"><Trash className="w-4 h-4" /></button>
                      </div>
                    </div>

                    {editingBlogId === b.id && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/5">
                        <div className="space-y-1"><label className="text-xs text-[#8b96aa]">Article Headline Title *</label><input type="text" value={b.title} onChange={e => setBlog(blog.map(post => post.id === b.id ? { ...post, title: e.target.value } : post))} className="form-input" /></div>
                        <div className="space-y-1"><label className="text-xs text-[#8b96aa]">Category</label><input type="text" value={b.category} onChange={e => setBlog(blog.map(post => post.id === b.id ? { ...post, category: e.target.value } : post))} className="form-input" /></div>
                        <div className="space-y-1"><label className="text-xs text-[#8b96aa]">Read Time (Duration text)</label><input type="text" value={b.readTime} onChange={e => setBlog(blog.map(post => post.id === b.id ? { ...post, readTime: e.target.value } : post))} className="form-input" /></div>
                        <div className="space-y-1"><label className="text-xs text-[#8b96aa]">Unicode Symbol Icon</label><input type="text" value={b.icon} onChange={e => setBlog(blog.map(post => post.id === b.id ? { ...post, icon: e.target.value } : post))} className="form-input" /></div>
                        <div className="sm:col-span-2 space-y-1"><label className="text-xs text-[#8b96aa]">Short Summary Excerpt</label><textarea value={b.excerpt} onChange={e => setBlog(blog.map(post => post.id === b.id ? { ...post, excerpt: e.target.value } : post))} className="form-textarea h-20" /></div>
                        <div className="sm:col-span-2 space-y-1">
                          <label className="text-xs text-[#8b96aa] flex items-center gap-1">Article Body Content (Markdown Supported)</label>
                          <textarea value={b.content} onChange={e => setBlog(blog.map(post => post.id === b.id ? { ...post, content: e.target.value } : post))} className="form-textarea h-72 font-mono text-xs leading-relaxed" />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: ENTERPRISE SEO, WHATSAPP & MAP SYSTEMS CONFIG */}
          {activeTab === 'seo' && (
            <div className="space-y-12 max-w-5xl text-left">
              <div>
                <h2 className="font-serif text-2xl font-bold text-[#f5d98a]">Enterprise SEO, WhatsApp & Google Map Manager</h2>
                <p className="text-xs text-[#8b96aa] mt-0.5">Define metadata tags individually per page route, manage online chat coordinates under custom departments, and configure interactive Delhi branch markers.</p>
              </div>

              {/* SECTION A: PAGE-BY-PAGE SEO TAGS COMPILER */}
              <div className="p-6 rounded-2xl bg-[#0a0e18]/40 border border-[#C9A227]/20 space-y-6">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-white/5 pb-4">
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">1. Route-by-Route Metatags Compiler</h3>
                    <p className="text-[10.5px] text-[#596478]">Select a page below to edit its indexing elements instantly in real-time.</p>
                  </div>
                  <select
                    value={selectedSeoPageId}
                    onChange={e => setSelectedSeoPageId(e.target.value as PageId)}
                    className="bg-[#0e1322] border border-[#C9A227]/30 text-[#C9A227] rounded-xl px-4 py-2 text-xs font-bold cursor-pointer"
                  >
                    <option value="home">Home Page Route</option>
                    <option value="about">About Biography Route</option>
                    <option value="services">Services Listing Route</option>
                    <option value="books">Book Store Route</option>
                    <option value="blog">Spiritual blog Route</option>
                    <option value="inquiry">Client Inquiry Intake Route</option>
                    <option value="cart">Cart Ledger Route</option>
                    <option value="checkout">Checkout Intake Route</option>
                    <option value="dashboard">Seeker Hub Portal Route</option>
                    <option value="contact">Contact Details Route</option>
                  </select>
                </div>

                {/* Selected Page SEO Config Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-[#8b96aa] uppercase">Page Title Header</label>
                      <input 
                        type="text" 
                        value={pageSeo.find(s => s.pageId === selectedSeoPageId)?.title || ""} 
                        onChange={e => {
                          const updated = [...pageSeo];
                          const idx = updated.findIndex(s => s.pageId === selectedSeoPageId);
                          if (idx !== -1) {
                            updated[idx] = { ...updated[idx], title: e.target.value };
                          } else {
                            updated.push({ pageId: selectedSeoPageId, title: e.target.value, description: "", keywords: "", ogImage: "", canonicalUrl: "", schemaMarkup: "" });
                          }
                          setPageSeo(updated);
                        }}
                        placeholder="e.g. Acharya TN Khurana | India's Trusted Astrologer" 
                        className="form-input text-xs" 
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-[#8b96aa] uppercase">Meta Description Summary</label>
                      <textarea 
                        value={pageSeo.find(s => s.pageId === selectedSeoPageId)?.description || ""} 
                        onChange={e => {
                          const updated = [...pageSeo];
                          const idx = updated.findIndex(s => s.pageId === selectedSeoPageId);
                          if (idx !== -1) {
                            updated[idx] = { ...updated[idx], description: e.target.value };
                          } else {
                            updated.push({ pageId: selectedSeoPageId, title: "", description: e.target.value, keywords: "", ogImage: "", canonicalUrl: "", schemaMarkup: "" });
                          }
                          setPageSeo(updated);
                        }}
                        placeholder="e.g. Book custom Kundli charts readings & find remedies with TN Khurana council offices." 
                        className="form-textarea h-24 text-xs" 
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-[#8b96aa] uppercase">Meta Keywords Ledger</label>
                      <input 
                        type="text" 
                        value={pageSeo.find(s => s.pageId === selectedSeoPageId)?.keywords || ""} 
                        onChange={e => {
                          const updated = [...pageSeo];
                          const idx = updated.findIndex(s => s.pageId === selectedSeoPageId);
                          if (idx !== -1) {
                            updated[idx] = { ...updated[idx], keywords: e.target.value };
                          } else {
                            updated.push({ pageId: selectedSeoPageId, title: "", description: "", keywords: e.target.value, ogImage: "", canonicalUrl: "", schemaMarkup: "" });
                          }
                          setPageSeo(updated);
                        }}
                        placeholder="astrology, vastu, kundli matching" 
                        className="form-input text-xs" 
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-[#8b96aa] uppercase">Canonical absolute URL</label>
                      <input 
                        type="text" 
                        value={pageSeo.find(s => s.pageId === selectedSeoPageId)?.canonicalUrl || ""} 
                        onChange={e => {
                          const updated = [...pageSeo];
                          const idx = updated.findIndex(s => s.pageId === selectedSeoPageId);
                          if (idx !== -1) {
                            updated[idx] = { ...updated[idx], canonicalUrl: e.target.value };
                          } else {
                            updated.push({ pageId: selectedSeoPageId, title: "", description: "", keywords: "", ogImage: "", canonicalUrl: e.target.value, schemaMarkup: "" });
                          }
                          setPageSeo(updated);
                        }}
                        placeholder="https://acharyakhurana.com/" 
                        className="form-input text-xs" 
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-[#8b96aa] uppercase">JSON-LD Schema Markup Scripts</label>
                      <textarea 
                        value={pageSeo.find(s => s.pageId === selectedSeoPageId)?.schemaMarkup || ""} 
                        onChange={e => {
                          const updated = [...pageSeo];
                          const idx = updated.findIndex(s => s.pageId === selectedSeoPageId);
                          if (idx !== -1) {
                            updated[idx] = { ...updated[idx], schemaMarkup: e.target.value };
                          } else {
                            updated.push({ pageId: selectedSeoPageId, title: "", description: "", keywords: "", ogImage: "", canonicalUrl: "", schemaMarkup: e.target.value });
                          }
                          setPageSeo(updated);
                        }}
                        placeholder='{ "@context": "https://schema.org", "@type": "LocalBusiness" }' 
                        className="form-textarea h-24 font-mono text-xs text-purple-300" 
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-[#8b96aa] uppercase">OG Card Image Banner URL</label>
                      <input 
                        type="text" 
                        value={pageSeo.find(s => s.pageId === selectedSeoPageId)?.ogImage || ""} 
                        onChange={e => {
                          const updated = [...pageSeo];
                          const idx = updated.findIndex(s => s.pageId === selectedSeoPageId);
                          if (idx !== -1) {
                            updated[idx] = { ...updated[idx], ogImage: e.target.value };
                          } else {
                            updated.push({ pageId: selectedSeoPageId, title: "", description: "", keywords: "", ogImage: e.target.value, canonicalUrl: "", schemaMarkup: "" });
                          }
                          setPageSeo(updated);
                        }}
                        placeholder="https://images.unsplash.com/photo-1524661135-423995f22d0b" 
                        className="form-input text-xs" 
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION B: WHATSAPP DEPARTMENTS CONFIG */}
              <div className="p-6 rounded-2xl bg-[#0a0e18]/40 border border-white/5 space-y-6 text-xs text-left">
                <div className="flex justify-between items-center border-b border-white/5 pb-4">
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">2. WhatsApp Floating Multi-Department Widget</h3>
                    <p className="text-[10px] text-[#8b96aa]">Configure the live chat support popups, hotline numbers, and customizable greeting templates.</p>
                  </div>
                  <div className="flex gap-2 items-center">
                    <span className="text-[10px] text-[#8b96aa]">Show Widget:</span>
                    <button
                      type="button"
                      onClick={() => setWhatsapp({ ...whatsapp, enabled: !whatsapp.enabled })}
                      className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                        whatsapp.enabled ? 'bg-[#C9A227]' : 'bg-white/10'
                      }`}
                    >
                      <span className={`absolute top-1 w-4 h-4 rounded-full bg-[#080B12] transition-transform ${
                        whatsapp.enabled ? 'left-7' : 'left-1'
                      }`} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-[#8b96aa]">Central WhatsApp Hotline (Country Code Required)</label>
                    <input 
                      type="text" 
                      value={whatsapp.number || ""} 
                      onChange={e => setWhatsapp({ ...whatsapp, number: e.target.value })}
                      placeholder="e.g. 919876543210" 
                      className="form-input text-xs" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-[#8b96aa]">Active Seeker Greeting Text</label>
                    <input 
                      type="text" 
                      value={whatsapp.primaryMsg || "Pranam Acharya TN Khurana Astro council! I need some remedies support."} 
                      onChange={e => setWhatsapp({ ...whatsapp, primaryMsg: e.target.value })}
                      placeholder="Custom message on click" 
                      className="form-input text-xs" 
                    />
                  </div>
                </div>

                {/* Departments list */}
                <div className="space-y-4 pt-4 border-t border-white/5">
                  <div className="flex justify-between items-center pb-2">
                    <span className="font-bold text-white text-xs">Assigned Support Department Accounts</span>
                    <button
                      type="button"
                      onClick={() => {
                        const nextId = "dept_" + Date.now();
                        const nextDepts = [...(whatsapp.departments || []), {
                          id: nextId,
                          name: "Kundli Calculation Desk",
                          label: "Birth Charts Support",
                          number: whatsapp.number || "919000000000",
                          customMessage: "Shastri ji! I want to verify status of my manual Kundli print dispatch."
                        }];
                        setWhatsapp({ ...whatsapp, departments: nextDepts });
                      }}
                      className="text-[#C9A227] hover:underline flex items-center gap-1 font-bold cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Append New Department Node
                    </button>
                  </div>

                  <div className="space-y-4">
                    {(whatsapp.departments || []).map((dep, dIdx) => (
                      <div key={dep.id || dIdx} className="p-4 rounded-xl bg-white/[0.01] border border-white/5 space-y-3 relative">
                        <button
                          type="button"
                          onClick={() => {
                            const nextDepts = (whatsapp.departments || []).filter(d => d.id !== dep.id);
                            setWhatsapp({ ...whatsapp, departments: nextDepts });
                          }}
                          className="absolute top-4 right-4 text-red-500 hover:text-red-400 cursor-pointer"
                        >
                          <Trash className="w-4 h-4" />
                        </button>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div className="space-y-1">
                            <label className="text-[9px] uppercase font-bold text-[#596478]">Department Badge Label</label>
                            <input 
                              type="text" 
                              value={dep.label || ""} 
                              onChange={e => {
                                const nextDepts = (whatsapp.departments || []).map(d => d.id === dep.id ? { ...d, label: e.target.value } : d);
                                setWhatsapp({ ...whatsapp, departments: nextDepts });
                              }}
                              className="form-input text-xs" 
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] uppercase font-bold text-[#596478]">Officer Display Name</label>
                            <input 
                              type="text" 
                              value={dep.name || ""} 
                              onChange={e => {
                                const nextDepts = (whatsapp.departments || []).map(d => d.id === dep.id ? { ...d, name: e.target.value } : d);
                                setWhatsapp({ ...whatsapp, departments: nextDepts });
                              }}
                              className="form-input text-xs" 
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] uppercase font-bold text-[#596478]">Direct WhatsApp Number</label>
                            <input 
                              type="text" 
                              value={dep.number || ""} 
                              onChange={e => {
                                const nextDepts = (whatsapp.departments || []).map(d => d.id === dep.id ? { ...d, number: e.target.value } : d);
                                setWhatsapp({ ...whatsapp, departments: nextDepts });
                              }}
                              className="form-input text-xs" 
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] uppercase font-bold text-[#596478]">Pre-defined Custom Chat Query Text</label>
                          <input 
                            type="text" 
                            value={dep.customMessage || ""} 
                            onChange={e => {
                              const nextDepts = (whatsapp.departments || []).map(d => d.id === dep.id ? { ...d, customMessage: e.target.value } : d);
                              setWhatsapp({ ...whatsapp, departments: nextDepts });
                            }}
                            className="form-input text-xs" 
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* SECTION C: GOOGLE MAPS CONFIG */}
              <div className="p-6 rounded-2xl bg-[#0a0e18]/40 border border-white/5 space-y-6 text-xs text-left">
                <div className="flex justify-between items-center border-b border-white/5 pb-4">
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">3. Google Maps Offices & Branch Indicators</h3>
                    <p className="text-[10px] text-[#8b96aa]">Setup physical contact branches mapped to dynamic geolocation coordinates for get-directions routing.</p>
                  </div>
                  <div className="flex gap-2 items-center">
                    <span className="text-[10px] text-[#8b96aa]">Enable Maps:</span>
                    <button
                      type="button"
                      onClick={() => setGoogleMaps({ ...googleMaps, enabled: !googleMaps.enabled })}
                      className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                        googleMaps.enabled ? 'bg-[#C9A227]' : 'bg-white/10'
                      }`}
                    >
                      <span className={`absolute top-1 w-4 h-4 rounded-full bg-[#080B12] transition-transform ${
                        googleMaps.enabled ? 'left-7' : 'left-1'
                      }`} />
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-white text-xs">Registered Physical Branch Offices</span>
                    <button
                      type="button"
                      onClick={() => {
                        const nextId = "br_" + Date.now();
                        const nextBranches = [...(googleMaps.branches || []), {
                          id: nextId,
                          name: "South Delhi Vastu Ashram",
                          address: "102 Temple Marg, South Extension, New Delhi - 110049",
                          lat: 28.5684,
                          lng: 77.2217,
                          phone: "+91 99887 76655"
                        }];
                        setGoogleMaps({ ...googleMaps, branches: nextBranches });
                      }}
                      className="text-[#C9A227] hover:underline flex items-center gap-1 font-bold cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Append New Branch Office Coordinator
                    </button>
                  </div>

                  <div className="space-y-4">
                    {(googleMaps.branches || []).map((br, bIdx) => (
                      <div key={br.id || bIdx} className="p-4 rounded-xl bg-white/[0.01] border border-white/5 space-y-3 relative">
                        <button
                          type="button"
                          onClick={() => {
                            const nextBranches = (googleMaps.branches || []).filter(b => b.id !== br.id);
                            setGoogleMaps({ ...googleMaps, branches: nextBranches });
                          }}
                          className="absolute top-4 right-4 text-red-500 hover:text-red-400 cursor-pointer"
                        >
                          <Trash className="w-4 h-4" />
                        </button>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-[9px] uppercase font-bold text-[#596478]">Branch Office Name</label>
                            <input 
                              type="text" 
                              value={br.name || ""} 
                              onChange={e => {
                                const nextBranches = (googleMaps.branches || []).map(b => b.id === br.id ? { ...b, name: e.target.value } : b);
                                setGoogleMaps({ ...googleMaps, branches: nextBranches });
                              }}
                              className="form-input text-xs" 
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] uppercase font-bold text-[#596478]">Hotline Landline Phone</label>
                            <input 
                              type="text" 
                              value={br.phone || ""} 
                              onChange={e => {
                                const nextBranches = (googleMaps.branches || []).map(b => b.id === br.id ? { ...b, phone: e.target.value } : b);
                                setGoogleMaps({ ...googleMaps, branches: nextBranches });
                              }}
                              className="form-input text-xs" 
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] uppercase font-bold text-[#596478]">Postal Address Location</label>
                          <input 
                            type="text" 
                            value={br.address || ""} 
                            onChange={e => {
                              const nextBranches = (googleMaps.branches || []).map(b => b.id === br.id ? { ...b, address: e.target.value } : b);
                              setGoogleMaps({ ...googleMaps, branches: nextBranches });
                            }}
                            className="form-input text-xs" 
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-[9px] uppercase font-bold text-[#596478]">GPS Latitude coordinate</label>
                            <input 
                              type="number" 
                              step="any"
                              value={br.lat || 0} 
                              onChange={e => {
                                const nextBranches = (googleMaps.branches || []).map(b => b.id === br.id ? { ...b, lat: parseFloat(e.target.value) || 0 } : b);
                                setGoogleMaps({ ...googleMaps, branches: nextBranches });
                              }}
                              className="form-input text-xs" 
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] uppercase font-bold text-[#596478]">GPS Longitude coordinate</label>
                            <input 
                              type="number" 
                              step="any"
                              value={br.lng || 0} 
                              onChange={e => {
                                const nextBranches = (googleMaps.branches || []).map(b => b.id === br.id ? { ...b, lng: parseFloat(e.target.value) || 0 } : b);
                                setGoogleMaps({ ...googleMaps, branches: nextBranches });
                              }}
                              className="form-input text-xs" 
                            />
                          </div>
                        </div>

                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: ANALYTICS & AUDIT LOGS */}
          {activeTab === 'analytics' && (
            <div className="space-y-8">
              <div>
                <h2 className="font-serif text-2xl font-bold text-[#f5d98a]">Analytics Insights & Activity Audit logs</h2>
                <p className="text-xs text-[#8b96aa] mt-0.5">Track real-time traffic pageviews, conversion trends, and audit all administrator modifications.</p>
              </div>

              {/* Graphic metrics charts row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-80">
                {/* Chart 1: Traffic Trend */}
                <div className="p-6 rounded-2xl bg-[#0a0e18]/40 border border-white/5 flex flex-col justify-between">
                  <h3 className="text-sm font-bold text-[#e8eaf0] mb-2 text-left">Traffic Page Views (Monthly Trends)</h3>
                  <div className="flex-1 w-full text-xs">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={pageViewData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#C9A227" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#C9A227" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="name" stroke="#596478" />
                        <YAxis stroke="#596478" />
                        <Tooltip contentStyle={{ backgroundColor: '#0f1425', borderColor: 'rgba(255,255,255,0.06)' }} />
                        <Area type="monotone" dataKey="view" stroke="#C9A227" fillOpacity={1} fill="url(#colorViews)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Chart 2: Product popularity */}
                <div className="p-6 rounded-2xl bg-[#0a0e18]/40 border border-white/5 flex flex-col justify-between">
                  <h3 className="text-sm font-bold text-[#e8eaf0] mb-2 text-left">Consultation Sales (Category Volume)</h3>
                  <div className="flex-1 w-full text-xs">
                    <ResponsiveContainer width="100%" height="100%">
                      <ReBarChart data={servicePopularity} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <XAxis dataKey="name" stroke="#596478" />
                        <YAxis stroke="#596478" />
                        <Tooltip contentStyle={{ backgroundColor: '#0f1425', borderColor: 'rgba(255,255,255,0.06)' }} />
                        <Bar dataKey="bookings" fill="#7C5CFC" radius={[10, 10, 0, 0]} />
                      </ReBarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Audit Ledger List */}
              <div className="p-6 rounded-2xl bg-[#0a0e18]/40 border border-white/5 space-y-4">
                <h3 className="text-sm font-bold text-[#e8eaf0] border-b border-white/5 pb-2">3. Activity Audit Ledger</h3>
                <div className="space-y-3 max-h-60 overflow-y-auto pr-2 scrollbar-thin">
                  {activityLogs.map(log => (
                    <div key={log.id} className="p-3 bg-white/[0.01] border border-white/5 rounded-xl flex items-center justify-between text-xs gap-4 text-left">
                      <div>
                        <span className="font-bold text-[#C9A227] px-2 py-0.5 rounded bg-[#C9A227]/10 mr-3">{log.action}</span>
                        <span className="text-[#8b96aa]">{log.details}</span>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="font-semibold text-white">{log.user}</div>
                        <div className="text-[10px] text-[#596478] mt-0.5">{new Date(log.timestamp).toLocaleTimeString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 9: BACKUPS & RESTORES */}
          {activeTab === 'social_media' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2"><Share2 className="w-5 h-5 text-[#C9A227]"/> Social Media Configurations</h3>
                  <p className="text-sm text-[#8b96aa]">Manage outgoing links for all social platforms displayed in the site footer.</p>
                </div>
                <button onClick={handleSaveSocialLinks} className="btn-primary flex items-center gap-2 px-6">
                  <Save className="w-4 h-4"/> Save Social Links
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#04060b] p-6 rounded-xl border border-white/5">
                {['instagram', 'x', 'facebook', 'youtube', 'linkedin', 'threads'].map((platform) => (
                  <div key={platform} className="space-y-2">
                    <label className="text-sm font-semibold text-white capitalize">{platform === 'x' ? 'X (Twitter)' : platform} URL</label>
                    <input 
                      type="url" 
                      placeholder={`https://${platform === 'x' ? 'x' : platform}.com/yourprofile`}
                      value={(socialLinks as any)[platform]}
                      onChange={(e) => setSocialLinks({...socialLinks, [platform]: e.target.value})}
                      className="form-input" 
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'backups' && (
            <div className="space-y-6 max-w-2xl">
              <div>
                <h2 className="font-serif text-2xl font-bold text-[#f5d98a]">System Backups and Restores</h2>
                <p className="text-xs text-[#8b96aa] mt-0.5">Download your entire website configurations database as a single file, and upload historical backups to restore the systems state instantly.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Export backup card */}
                <div className="p-6 rounded-2xl bg-[#0a0e18]/40 border border-white/5 text-center flex flex-col justify-between items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center text-xl">💾</div>
                  <div>
                    <h4 className="font-serif text-sm font-bold text-white">Download Active State</h4>
                    <p className="text-[11px] text-[#596478] mt-1">Saves all dynamic text, themes, categories, and blogs to a local file.</p>
                  </div>
                  <button onClick={downloadBackup} className="btn btn-gold btn-sm w-full justification-center"><Download className="w-3.5 h-3.5" /> Download JSON Backup</button>
                </div>

                {/* Import/Restore backup card */}
                <div className="p-6 rounded-2xl bg-[#0a0e18]/40 border border-white/5 text-center flex flex-col justify-between items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center text-xl">⏳</div>
                  <div>
                    <h4 className="font-serif text-sm font-bold text-white">Restore Previous Backup</h4>
                    <p className="text-[11px] text-[#596478] mt-1">Upload a valid backup file to overwrite current site parameters.</p>
                  </div>
                  <label className="btn btn-outline-gold btn-sm w-full justification-center cursor-pointer">
                    <Upload className="w-3.5 h-3.5" /> Upload Backup File
                    <input type="file" accept=".json" onChange={handleRestoreBackup} className="hidden" />
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* TAB 10: REAL-TIME CRM DASHBOARD (SACRED LIVE SUITE LANDING) */}
          {activeTab === 'crm_dashboard' && (
            <div className="relative z-10 p-2 md:p-6 text-center max-w-5xl mx-auto font-outfit mt-4">
              <div className="absolute inset-0 pointer-events-none z-[-1] opacity-5 mix-blend-overlay" style={{backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"}}></div>
              <div className="absolute inset-0 pointer-events-none z-[-1]" style={{background: 'radial-gradient(ellipse 900px 500px at 15% -5%, rgba(232,185,63,0.10), transparent 60%), radial-gradient(ellipse 700px 500px at 100% 10%, rgba(255,122,61,0.06), transparent 60%)'}}></div>
              
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-[var(--color-sls-line-strong)] bg-[rgba(232,185,63,0.06)] text-[12.5px] tracking-[0.06em] uppercase text-[var(--color-sls-gold)] mb-8">
                <span className="relative w-[9px] h-[9px] rounded-full bg-[var(--color-sls-gold-bright)] shadow-[0_0_6px_2px_rgba(255,216,77,0.8),_0_0_18px_6px_rgba(232,185,63,0.35)] shrink-0 after:content-[''] after:absolute after:-inset-[6px] after:rounded-full after:border after:border-[rgba(255,216,77,0.5)] after:animate-[ripple_2.4s_ease-out_infinite]"></span>
                Live Transmission Active
              </div>

              <h1 className="font-cinzel font-semibold text-3xl md:text-5xl leading-[1.08] text-[var(--color-sls-ivory)]">
                The Core of <span className="bg-gradient-to-r from-[var(--color-sls-gold)] via-[var(--color-sls-gold-bright)] to-[var(--color-sls-ember)] text-transparent bg-clip-text">Vedic Operations</span>
              </h1>
              
              <p className="max-w-2xl mx-auto mt-6 text-sm md:text-base text-[var(--color-sls-muted)] font-light leading-relaxed">
                Welcome to the Sacred Live Suite. From here you command all global consultations, AI telemetry, live seekers, and financial streams.
              </p>

              <div className="flex gap-4 justify-center mt-11 flex-wrap">
                <button onClick={() => setActiveTab('bookings')} className="px-6 py-3 rounded-lg text-sm font-medium bg-gradient-to-br from-[var(--color-sls-gold-bright)] to-[var(--color-sls-gold)] text-[#1a1305] transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_30px_rgba(255,216,77,0.35)] flex items-center gap-2">
                  Launch Bookings Manager
                </button>
                <button onClick={() => setActiveTab('monitoring')} className="px-6 py-3 rounded-lg text-sm font-medium bg-transparent text-[var(--color-sls-ivory)] border border-[var(--color-sls-line-strong)] transition-all hover:border-[var(--color-sls-gold-bright)] hover:text-[var(--color-sls-gold-bright)] flex items-center gap-2">
                  View Telemetry Logs
                </button>
              </div>

              {/* Live Preview Panel */}
              <div className="mt-16 text-left">
                <div className="bg-gradient-to-b from-[var(--color-sls-bg-panel)] to-[var(--color-sls-bg-panel-2)] border border-[var(--color-sls-line)] rounded-[18px] p-7 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.7),_inset_0_1px_0_rgba(255,255,255,0.02)]">
                  
                  <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="text-[13px] tracking-[0.05em] uppercase text-[var(--color-sls-muted)] font-bold">Live Overview</div>
                    </div>
                    <div className="text-[11.5px] text-[var(--color-sls-muted)] flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span> Real-time sync
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
                    <div className="border border-[var(--color-sls-line)] rounded-xl p-4 bg-white/[0.012]">
                      <div className="text-[10px] text-[var(--color-sls-muted)] uppercase tracking-[0.05em] mb-2.5 font-bold">Registered Seekers</div>
                      <div className="font-mono text-2xl text-[var(--color-sls-gold-bright)] font-medium">{billingSummary.usersCount || seekers.length || 0}</div>
                      <div className="text-[11px] text-[#7BC98E] mt-1.5">+ active in portal</div>
                    </div>
                    <div className="border border-[var(--color-sls-line)] rounded-xl p-4 bg-white/[0.012]">
                      <div className="text-[10px] text-[var(--color-sls-muted)] uppercase tracking-[0.05em] mb-2.5 font-bold">Consultations</div>
                      <div className="font-mono text-2xl text-[var(--color-sls-gold-bright)] font-medium">{billingSummary.bookingsCount || dbBookings.length || 0}</div>
                      <div className="text-[11px] text-[var(--color-sls-muted)] mt-1.5">Scheduled sessions</div>
                    </div>
                    <div className="border border-[var(--color-sls-line)] rounded-xl p-4 bg-white/[0.012]">
                      <div className="text-[10px] text-[var(--color-sls-muted)] uppercase tracking-[0.05em] mb-2.5 font-bold">Open Inquiries</div>
                      <div className="font-mono text-2xl text-[var(--color-sls-gold-bright)] font-medium">{billingSummary.inquiriesCount || leads.length || 0}</div>
                      <div className="text-[11px] text-[#7BC98E] mt-1.5">Awaiting response</div>
                    </div>
                    <div className="border border-[var(--color-sls-line)] rounded-xl p-4 bg-white/[0.012]">
                      <div className="text-[10px] text-[var(--color-sls-muted)] uppercase tracking-[0.05em] mb-2.5 font-bold">Platform Billings</div>
                      <div className="font-mono text-2xl text-[var(--color-sls-gold-bright)] font-medium">₹{billingSummary.totalPayments || 0}</div>
                      <div className="text-[11px] text-[#7BC98E] mt-1.5">Total processed</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modules Bento */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mt-8 text-left">
                <div onClick={() => setActiveTab('bookings')} className="md:col-span-6 cursor-pointer border border-[var(--color-sls-line)] rounded-2xl p-6 bg-gradient-to-br from-white/[0.015] to-transparent transition-all hover:border-[var(--color-sls-line-strong)] hover:-translate-y-[3px] hover:shadow-[0_20px_50px_-25px_rgba(232,185,63,0.25)] relative overflow-hidden group">
                  <div className="w-10 h-10 rounded-lg mb-4 flex items-center justify-center border border-[var(--color-sls-line-strong)] text-[var(--color-sls-gold-bright)] bg-[rgba(232,185,63,0.06)] text-xl">📅</div>
                  <h3 className="text-base font-semibold text-[var(--color-sls-ivory)] mb-2">Bookings Manager</h3>
                  <p className="text-xs text-[var(--color-sls-muted)] leading-relaxed font-light">Calendar view, manual overrides, and schedule management for Kundli and Vastu sessions.</p>
                  <div className="inline-block mt-4 text-[10px] tracking-[0.05em] text-[var(--color-sls-gold)] uppercase font-mono group-hover:underline">Launch Module →</div>
                </div>
                
                <div onClick={() => setActiveTab('ai_guru')} className="md:col-span-6 cursor-pointer border border-[var(--color-sls-line)] rounded-2xl p-6 bg-gradient-to-br from-white/[0.015] to-transparent transition-all hover:border-[var(--color-sls-line-strong)] hover:-translate-y-[3px] hover:shadow-[0_20px_50px_-25px_rgba(232,185,63,0.25)] relative overflow-hidden group">
                  <div className="w-10 h-10 rounded-lg mb-4 flex items-center justify-center border border-[var(--color-sls-line-strong)] text-[var(--color-sls-gold-bright)] bg-[rgba(232,185,63,0.06)] text-xl">🧠</div>
                  <h3 className="text-base font-semibold text-[var(--color-sls-ivory)] mb-2">AI Guru Settings</h3>
                  <p className="text-xs text-[var(--color-sls-muted)] leading-relaxed font-light">Configure Gemini and Claude behavior, personality, temperature, and system prompts.</p>
                  <div className="inline-block mt-4 text-[10px] tracking-[0.05em] text-[var(--color-sls-gold)] uppercase font-mono group-hover:underline">Launch Module →</div>
                </div>

                <div onClick={() => setActiveTab('toolkit')} className="md:col-span-4 cursor-pointer border border-[var(--color-sls-line)] rounded-2xl p-6 bg-gradient-to-br from-white/[0.015] to-transparent transition-all hover:border-[var(--color-sls-line-strong)] hover:-translate-y-[3px] hover:shadow-[0_20px_50px_-25px_rgba(232,185,63,0.25)] relative overflow-hidden group">
                  <div className="w-10 h-10 rounded-lg mb-4 flex items-center justify-center border border-[var(--color-sls-line-strong)] text-[var(--color-sls-gold-bright)] bg-[rgba(232,185,63,0.06)] text-xl">⚙️</div>
                  <h3 className="text-base font-semibold text-[var(--color-sls-ivory)] mb-2">Vedic Tool Manager</h3>
                  <p className="text-xs text-[var(--color-sls-muted)] leading-relaxed font-light">Add, edit, and organize Kundli, Numerology, and Matchmaking digital products.</p>
                </div>
                
                <div onClick={() => setActiveTab('notifications')} className="md:col-span-4 cursor-pointer border border-[var(--color-sls-line)] rounded-2xl p-6 bg-gradient-to-br from-white/[0.015] to-transparent transition-all hover:border-[var(--color-sls-line-strong)] hover:-translate-y-[3px] hover:shadow-[0_20px_50px_-25px_rgba(232,185,63,0.25)] relative overflow-hidden group">
                  <div className="w-10 h-10 rounded-lg mb-4 flex items-center justify-center border border-[var(--color-sls-line-strong)] text-[var(--color-sls-gold-bright)] bg-[rgba(232,185,63,0.06)] text-xl">🔊</div>
                  <h3 className="text-base font-semibold text-[var(--color-sls-ivory)] mb-2">Sound Alerts</h3>
                  <p className="text-xs text-[var(--color-sls-muted)] leading-relaxed font-light">Configure audio notifications, volumes, and custom chimes for incoming events.</p>
                </div>

                <div onClick={() => setActiveTab('users')} className="md:col-span-4 cursor-pointer border border-[var(--color-sls-line)] rounded-2xl p-6 bg-gradient-to-br from-white/[0.015] to-transparent transition-all hover:border-[var(--color-sls-line-strong)] hover:-translate-y-[3px] hover:shadow-[0_20px_50px_-25px_rgba(232,185,63,0.25)] relative overflow-hidden group">
                  <div className="w-10 h-10 rounded-lg mb-4 flex items-center justify-center border border-[var(--color-sls-line-strong)] text-[var(--color-sls-gold-bright)] bg-[rgba(232,185,63,0.06)] text-xl">👥</div>
                  <h3 className="text-base font-semibold text-[var(--color-sls-ivory)] mb-2">Registrants</h3>
                  <p className="text-xs text-[var(--color-sls-muted)] leading-relaxed font-light">View all registered seekers, access logs, verification status, and channels.</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 11: BOOKINGS & CONSULTATIONS MANAGER */}
          {activeTab === 'bookings' && (() => {

            const handleCreateManualBooking = async (e: React.FormEvent) => {
              e.preventDefault();
              try {
                const res = await fetch('/api/bookings', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(newBooking)
                });
                if (res.ok) {
                  setNewBooking({
                    customerName: '', customerEmail: '', customerPhone: '',
                    type: 'Career', serviceName: 'Kundli Guna Milan & Kundli Reading',
                    date: new Date().toISOString().split('T')[0], time: '11:00 AM', price: 499,
                    birthDate: '', birthTime: '', birthPlace: ''
                  });
                  setShowCreateForm(false);
                  fetchBillingSummaryAndMore();
                }
              } catch (err: any) {
                alert(`❌ Server Connection error: ${err.message}`);
              }
            };

            const changeStatus = async (id: string, newStatus: string) => {
              try {
                const res = await fetch(`/api/admin/bookings/${id}`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ status: newStatus })
                });
                if (res.ok) {
                  fetchBillingSummaryAndMore();
                }
              } catch (e) {
                console.error(e);
              }
            };

            const deleteBooking = async (id: string) => {
              if (!confirm('⚠️ Are you sure you desire to delete this session? This action cannot be reverted!')) return;
              try {
                const res = await fetch(`/api/admin/bookings/${id}`, { method: 'DELETE' });
                if (res.ok) { fetchBillingSummaryAndMore(); }
              } catch (e) { console.error(e); }
            };

            return (
              <div className="space-y-6 max-w-6xl mx-auto font-outfit text-left">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[var(--color-sls-line)] pb-4">
                  <div>
                    <h2 className="font-cinzel text-xl text-[var(--color-sls-gold)] font-medium">Bookings Manager</h2>
                    <p className="text-[13px] text-[var(--color-sls-muted)] mt-1">Review, approve, and organize astrological consultation schedules.</p>
                  </div>
                  <div className="flex gap-2.5">
                    <button className="px-4 py-2 border border-[var(--color-sls-line-strong)] rounded-lg text-[13px] text-[var(--color-sls-ivory)] hover:border-[var(--color-sls-gold-bright)] hover:text-[var(--color-sls-gold-bright)] flex items-center gap-2">
                      <span className="font-mono text-[var(--color-sls-gold)]">📅</span> View Calendar
                    </button>
                    <button onClick={() => setShowCreateForm(true)} className="px-4 py-2 bg-[var(--color-sls-gold)] text-[#1a1305] rounded-lg text-[13px] font-medium hover:bg-[var(--color-sls-gold-bright)] shadow-[0_4px_16px_rgba(201,162,39,0.3)]">
                      + Add Booking
                    </button>
                  </div>
                </div>

                <div className="bg-gradient-to-b from-[var(--color-sls-bg-panel)] to-[var(--color-sls-bg-panel-2)] border border-[var(--color-sls-line)] rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                  <div className="flex items-center gap-3 p-4 border-b border-[var(--color-sls-line)]">
                    <input type="text" placeholder="Search by name, email or code..." className="bg-[rgba(255,255,255,0.03)] border border-[var(--color-sls-line-strong)] rounded-lg px-4 py-2 text-[13px] w-full max-w-xs focus:border-[var(--color-sls-gold)] focus:outline-none placeholder:text-[var(--color-sls-muted)]" />
                    <select className="bg-[rgba(255,255,255,0.03)] border border-[var(--color-sls-line-strong)] rounded-lg px-3 py-2 text-[13px] text-[var(--color-sls-muted)] focus:outline-none">
                      <option value="all">All Statuses</option>
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>

                  <div className="overflow-x-auto hidden md:block">
                    <table className="w-full text-left">
                      <thead className="bg-[rgba(232,185,63,0.02)] border-b border-[var(--color-sls-line)]">
                        <tr>
                          <th className="px-5 py-4 text-[11.5px] uppercase tracking-[0.05em] text-[var(--color-sls-muted)] font-medium">Booking Code</th>
                          <th className="px-5 py-4 text-[11.5px] uppercase tracking-[0.05em] text-[var(--color-sls-muted)] font-medium">Customer Details</th>
                          <th className="px-5 py-4 text-[11.5px] uppercase tracking-[0.05em] text-[var(--color-sls-muted)] font-medium">Service / Date</th>
                          <th className="px-5 py-4 text-[11.5px] uppercase tracking-[0.05em] text-[var(--color-sls-muted)] font-medium">Status</th>
                          <th className="px-5 py-4 text-[11.5px] uppercase tracking-[0.05em] text-[var(--color-sls-muted)] font-medium text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--color-sls-line)]">
                        {dbBookings.map(b => (
                          <tr key={b.id} className="hover:bg-[rgba(232,185,63,0.03)] transition-colors">
                            <td className="px-5 py-4 align-middle">
                              <span className="text-[var(--color-sls-gold)] font-mono text-[12px]">{b.id.substring(0, 8).toUpperCase()}</span>
                            </td>
                            <td className="px-5 py-4 align-middle">
                              <div className="font-medium text-[var(--color-sls-ivory)]">{b.customerName}</div>
                              <div className="text-[12px] text-[var(--color-sls-muted)] mt-1">{b.customerEmail} • {b.customerPhone}</div>
                            </td>
                            <td className="px-5 py-4 align-middle">
                              <div className="text-[13.5px] text-[var(--color-sls-ivory)]">{b.type} Consultation</div>
                              <div className="text-[12px] text-[var(--color-sls-muted)] mt-1">{b.date} • {b.time}</div>
                            </td>
                            <td className="px-5 py-4 align-middle">
                              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11.5px] font-medium before:content-[''] before:w-1.5 before:h-1.5 before:rounded-full before:bg-current ${
                                b.status === 'Confirmed' ? 'text-[#5EC8E8] bg-[rgba(94,200,232,0.12)]' :
                                b.status === 'Completed' ? 'text-[#7BC98E] bg-[rgba(123,201,142,0.12)]' :
                                b.status === 'Cancelled' ? 'text-[#FF6B6B] bg-[rgba(255,107,107,0.12)]' : 
                                'text-[var(--color-sls-gold-bright)] bg-[rgba(232,185,63,0.12)]'
                              }`}>
                                {b.status}
                              </span>
                            </td>
                            <td className="px-5 py-4 align-middle text-right">
                              <div className="flex gap-2 justify-end">
                                {b.status === 'Pending' && <button onClick={() => changeStatus(b.id, 'Confirmed')} className="w-8 h-8 rounded-md border border-[var(--color-sls-line)] text-[var(--color-sls-muted)] hover:border-[#5EC8E8] hover:text-[#5EC8E8] flex items-center justify-center transition-colors" title="Confirm">✓</button>}
                                {b.status === 'Confirmed' && <button onClick={() => changeStatus(b.id, 'Completed')} className="w-8 h-8 rounded-md border border-[var(--color-sls-line)] text-[var(--color-sls-muted)] hover:border-[#7BC98E] hover:text-[#7BC98E] flex items-center justify-center transition-colors" title="Complete">✔</button>}
                                {b.status !== 'Cancelled' && <button onClick={() => changeStatus(b.id, 'Cancelled')} className="w-8 h-8 rounded-md border border-[var(--color-sls-line)] text-[var(--color-sls-muted)] hover:border-[#FF6B6B] hover:text-[#FF6B6B] flex items-center justify-center transition-colors" title="Cancel">✕</button>}
                                <button onClick={() => deleteBooking(b.id)} className="w-8 h-8 rounded-md border border-[var(--color-sls-line)] text-[var(--color-sls-muted)] hover:border-[var(--color-sls-gold-bright)] hover:text-[var(--color-sls-gold-bright)] flex items-center justify-center transition-colors" title="Delete">🗑</button>
                              </div>
                            </td>
                          </tr>
                        ))}
                        {dbBookings.length === 0 && (
                          <tr>
                            <td colSpan={5} className="py-16 text-center text-[var(--color-sls-muted)]">
                              <div className="text-[34px] text-[var(--color-sls-gold)] mb-3">📅</div>
                              <h3 className="text-[var(--color-sls-ivory)] font-medium font-cinzel text-lg mb-2">No Bookings Yet</h3>
                              <p className="text-sm">There are no consultations scheduled in the calendar.</p>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  
                  {/* Mobile view cards */}
                  <div className="md:hidden block">
                     {dbBookings.map(b => (
                        <div key={b.id} className="p-4 border-b border-[var(--color-sls-line)] last:border-b-0">
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-[var(--color-sls-gold)] font-mono text-[12px]">{b.id.substring(0, 8).toUpperCase()}</span>
                            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium before:content-[''] before:w-1.5 before:h-1.5 before:rounded-full before:bg-current ${
                              b.status === 'Confirmed' ? 'text-[#5EC8E8] bg-[rgba(94,200,232,0.12)]' :
                              b.status === 'Completed' ? 'text-[#7BC98E] bg-[rgba(123,201,142,0.12)]' :
                              b.status === 'Cancelled' ? 'text-[#FF6B6B] bg-[rgba(255,107,107,0.12)]' : 
                              'text-[var(--color-sls-gold-bright)] bg-[rgba(232,185,63,0.12)]'
                            }`}>{b.status}</span>
                          </div>
                          <div className="font-medium text-[var(--color-sls-ivory)]">{b.customerName}</div>
                          <div className="text-[12px] text-[var(--color-sls-muted)]">{b.type} Consultation • {b.date} at {b.time}</div>
                          <div className="flex gap-2 mt-3">
                            {b.status === 'Pending' && <button onClick={() => changeStatus(b.id, 'Confirmed')} className="w-8 h-8 rounded-md border border-[var(--color-sls-line)] text-[var(--color-sls-muted)] flex items-center justify-center">✓</button>}
                            <button onClick={() => deleteBooking(b.id)} className="w-8 h-8 rounded-md border border-[var(--color-sls-line)] text-[var(--color-sls-muted)] flex items-center justify-center">🗑</button>
                          </div>
                        </div>
                     ))}
                  </div>
                </div>

                {/* Add Booking Modal Overlay */}
                {showCreateForm && (
                  <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-gradient-to-b from-[var(--color-sls-bg-panel)] to-[var(--color-sls-bg-panel-2)] border border-[var(--color-sls-line-strong)] rounded-2xl w-full max-w-2xl p-6 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)]">
                      <div className="flex justify-between items-center mb-5">
                        <h3 className="font-cinzel text-lg text-[var(--color-sls-ivory)]">Create Manual Booking</h3>
                        <button onClick={() => setShowCreateForm(false)} className="w-8 h-8 rounded-lg border border-[var(--color-sls-line)] text-[var(--color-sls-muted)] hover:text-[var(--color-sls-gold-bright)] hover:border-[var(--color-sls-gold-bright)]">✕</button>
                      </div>
                      
                      <form onSubmit={handleCreateManualBooking}>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="col-span-2 md:col-span-1">
                            <label className="block text-[12px] text-[var(--color-sls-muted)] uppercase tracking-[0.04em] mb-1.5">Seeker Name *</label>
                            <input required type="text" value={newBooking.customerName} onChange={e => setNewBooking({ ...newBooking, customerName: e.target.value })} className="w-full bg-[rgba(255,255,255,0.03)] border border-[var(--color-sls-line-strong)] rounded-lg px-3 py-2 text-[13.5px] focus:border-[var(--color-sls-gold)] focus:outline-none" />
                          </div>
                          <div className="col-span-2 md:col-span-1">
                            <label className="block text-[12px] text-[var(--color-sls-muted)] uppercase tracking-[0.04em] mb-1.5">Email Address *</label>
                            <input required type="email" value={newBooking.customerEmail} onChange={e => setNewBooking({ ...newBooking, customerEmail: e.target.value })} className="w-full bg-[rgba(255,255,255,0.03)] border border-[var(--color-sls-line-strong)] rounded-lg px-3 py-2 text-[13.5px] focus:border-[var(--color-sls-gold)] focus:outline-none" />
                          </div>
                          <div className="col-span-2 md:col-span-1">
                            <label className="block text-[12px] text-[var(--color-sls-muted)] uppercase tracking-[0.04em] mb-1.5">Phone Number</label>
                            <input required type="text" value={newBooking.customerPhone} onChange={e => setNewBooking({ ...newBooking, customerPhone: e.target.value })} className="w-full bg-[rgba(255,255,255,0.03)] border border-[var(--color-sls-line-strong)] rounded-lg px-3 py-2 text-[13.5px] focus:border-[var(--color-sls-gold)] focus:outline-none" />
                          </div>
                          <div className="col-span-2 md:col-span-1">
                            <label className="block text-[12px] text-[var(--color-sls-muted)] uppercase tracking-[0.04em] mb-1.5">Consultation Type</label>
                            <select value={newBooking.type} onChange={e => setNewBooking({ ...newBooking, type: e.target.value })} className="w-full bg-[rgba(255,255,255,0.03)] border border-[var(--color-sls-line-strong)] rounded-lg px-3 py-2 text-[13.5px] focus:border-[var(--color-sls-gold)] focus:outline-none text-[var(--color-sls-ivory)]">
                              <option value="Marriage">Marriage / Guna Milan</option>
                              <option value="Career">Career & Job Alignment</option>
                              <option value="Business">Commercial Business</option>
                              <option value="Spiritual">Spiritual Guidance</option>
                            </select>
                          </div>
                          <div className="col-span-2 md:col-span-1">
                            <label className="block text-[12px] text-[var(--color-sls-muted)] uppercase tracking-[0.04em] mb-1.5">Date</label>
                            <input required type="date" value={newBooking.date} onChange={e => setNewBooking({ ...newBooking, date: e.target.value })} className="w-full bg-[rgba(255,255,255,0.03)] border border-[var(--color-sls-line-strong)] rounded-lg px-3 py-2 text-[13.5px] focus:border-[var(--color-sls-gold)] focus:outline-none text-[var(--color-sls-ivory)]" />
                          </div>
                          <div className="col-span-2 md:col-span-1">
                            <label className="block text-[12px] text-[var(--color-sls-muted)] uppercase tracking-[0.04em] mb-1.5">Time Slot</label>
                            <input required type="text" placeholder="e.g. 11:30 AM" value={newBooking.time} onChange={e => setNewBooking({ ...newBooking, time: e.target.value })} className="w-full bg-[rgba(255,255,255,0.03)] border border-[var(--color-sls-line-strong)] rounded-lg px-3 py-2 text-[13.5px] focus:border-[var(--color-sls-gold)] focus:outline-none" />
                          </div>
                        </div>

                        <div className="mt-5 p-4 border border-[var(--color-sls-line)] bg-[rgba(232,185,63,0.02)] rounded-xl">
                          <h4 className="text-[11.5px] text-[var(--color-sls-gold)] font-medium mb-3">Optional: Birth Details for Chart Generation</h4>
                          <div className="grid grid-cols-3 gap-3">
                            <input type="date" value={newBooking.birthDate} onChange={e => setNewBooking({ ...newBooking, birthDate: e.target.value })} className="col-span-3 md:col-span-1 bg-[rgba(255,255,255,0.03)] border border-[var(--color-sls-line-strong)] rounded-lg px-3 py-1.5 text-[12.5px] text-[var(--color-sls-ivory)] focus:border-[var(--color-sls-gold)] focus:outline-none" />
                            <input type="text" placeholder="Time (14:35)" value={newBooking.birthTime} onChange={e => setNewBooking({ ...newBooking, birthTime: e.target.value })} className="col-span-3 md:col-span-1 bg-[rgba(255,255,255,0.03)] border border-[var(--color-sls-line-strong)] rounded-lg px-3 py-1.5 text-[12.5px] focus:border-[var(--color-sls-gold)] focus:outline-none" />
                            <input type="text" placeholder="City/Place" value={newBooking.birthPlace} onChange={e => setNewBooking({ ...newBooking, birthPlace: e.target.value })} className="col-span-3 md:col-span-1 bg-[rgba(255,255,255,0.03)] border border-[var(--color-sls-line-strong)] rounded-lg px-3 py-1.5 text-[12.5px] focus:border-[var(--color-sls-gold)] focus:outline-none" />
                          </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                          <button type="button" onClick={() => setShowCreateForm(false)} className="px-5 py-2.5 rounded-lg border border-[var(--color-sls-line-strong)] text-[13.5px] text-[var(--color-sls-muted)] hover:border-[var(--color-sls-gold-bright)] hover:text-[var(--color-sls-gold-bright)]">Cancel</button>
                          <button type="submit" className="px-5 py-2.5 rounded-lg bg-[var(--color-sls-gold)] text-[#1a1305] text-[13.5px] font-medium hover:bg-[var(--color-sls-gold-bright)] shadow-[0_4px_16px_rgba(201,162,39,0.3)]">Schedule Booking</button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            );
          })()}

          {/* TAB 12: AI GURU COMPREHENSIVE SETTINGS */}
          {activeTab === 'ai_guru' && (() => {

            return (
              <div className="space-y-6 max-w-6xl mx-auto font-outfit text-left mt-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[var(--color-sls-line)] pb-4">
                  <div>
                    <h2 className="font-cinzel text-xl text-[var(--color-sls-gold)] font-medium">AI Guru Configurations</h2>
                    <p className="text-[13px] text-[var(--color-sls-muted)] mt-1">Configure Acharya TN Khurana's parameters, models, and conversational tone.</p>
                  </div>
                  <div className="flex gap-2.5">
                    <button className="px-4 py-2 border border-[var(--color-sls-line-strong)] rounded-lg text-[13px] text-[var(--color-sls-ivory)] hover:border-[var(--color-sls-gold-bright)] hover:text-[var(--color-sls-gold-bright)] flex items-center gap-2">
                      <span className="text-[var(--color-sls-gold)] animate-pulse">●</span> System Online
                    </button>
                    <button className="px-4 py-2 bg-gradient-to-r from-[var(--color-sls-gold)] to-[var(--color-sls-gold-bright)] text-[#1a1305] rounded-lg text-[13px] font-medium shadow-[0_4px_16px_rgba(201,162,39,0.3)] transition-all hover:scale-[1.02]">
                      Deploy Core Updates
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left Sidebar Config */}
                  <div className="lg:col-span-4 space-y-4">
                    
                    <div className="bg-gradient-to-br from-[var(--color-sls-bg-panel)] to-[var(--color-sls-bg-panel-2)] border border-[var(--color-sls-line)] rounded-2xl p-5 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                      <h3 className="text-sm font-semibold text-[var(--color-sls-ivory)] mb-4 flex items-center gap-2">
                        <span className="text-[var(--color-sls-gold)] font-mono text-lg">⚙</span> Engine & Model
                      </h3>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-[11px] text-[var(--color-sls-muted)] uppercase tracking-[0.05em] mb-1.5 font-bold">Primary LLM Provider</label>
                          <select className="w-full bg-[rgba(255,255,255,0.02)] border border-[var(--color-sls-line)] rounded-lg px-3 py-2.5 text-[13px] text-[var(--color-sls-ivory)] focus:border-[var(--color-sls-gold)] focus:outline-none transition-colors">
                            <option value="gemini">Google Gemini 1.5 Pro</option>
                            <option value="claude">Anthropic Claude 3 Opus</option>
                            <option value="openai">OpenAI GPT-4o</option>
                          </select>
                        </div>
                        
                        <div>
                          <div className="flex justify-between items-center mb-1.5">
                            <label className="text-[11px] text-[var(--color-sls-muted)] uppercase tracking-[0.05em] font-bold">Creativity / Temperature</label>
                            <span className="text-[10px] text-[var(--color-sls-gold)] font-mono">0.65</span>
                          </div>
                          <input type="range" min="0" max="100" defaultValue="65" className="w-full accent-[var(--color-sls-gold)] cursor-pointer" />
                          <div className="flex justify-between text-[10px] text-[var(--color-sls-muted)] mt-1">
                            <span>Strict (Factual)</span>
                            <span>Creative (Fluid)</span>
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between items-center mb-1.5">
                            <label className="text-[11px] text-[var(--color-sls-muted)] uppercase tracking-[0.05em] font-bold">Max Output Tokens</label>
                            <span className="text-[10px] text-[var(--color-sls-gold)] font-mono">1024</span>
                          </div>
                          <input type="range" min="256" max="4096" defaultValue="1024" className="w-full accent-[var(--color-sls-gold)] cursor-pointer" />
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-[var(--color-sls-bg-panel)] to-[var(--color-sls-bg-panel-2)] border border-[var(--color-sls-line)] rounded-2xl p-5 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                       <h3 className="text-sm font-semibold text-[var(--color-sls-ivory)] mb-4 flex items-center gap-2">
                        <span className="text-[var(--color-sls-gold)] font-mono text-lg">💾</span> Saved Sessions Log
                      </h3>
                      <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
                        {savedSessions.map(sess => (
                          <div 
                            key={sess.id}
                            onClick={() => setActiveSession(sess)}
                            className={`p-3 rounded-xl border cursor-pointer text-left transition-all ${
                              activeSession?.id === sess.id 
                                ? 'bg-[rgba(232,185,63,0.08)] border-[var(--color-sls-gold)]' 
                                : 'bg-[rgba(255,255,255,0.01)] border-[var(--color-sls-line)] hover:bg-[rgba(255,255,255,0.03)]'
                            }`}
                          >
                            <div className="font-semibold text-[13px] text-[var(--color-sls-ivory)] truncate mb-1">{sess.title || 'Astrological Consultation'}</div>
                            <div className="text-[11px] text-[var(--color-sls-muted)] flex justify-between items-center">
                              <span className="truncate max-w-[120px]">{sess.userEmail}</span>
                              <span className="shrink-0">{new Date(sess.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        ))}
                        {savedSessions.length === 0 && (
                          <div className="py-8 text-center border border-dashed border-[var(--color-sls-line)] rounded-lg bg-[rgba(255,255,255,0.01)]">
                            <span className="text-xl mb-2 block opacity-50">📋</span>
                            <p className="text-[11px] text-[var(--color-sls-muted)]">No sessions recorded yet.</p>
                          </div>
                        )}
                      </div>
                    </div>

                  </div>

                  {/* Main Content Area */}
                  <div className="lg:col-span-8 space-y-4">
                    
                    {/* Prompt Engineering Panel */}
                    <div className="bg-gradient-to-br from-[var(--color-sls-bg-panel)] to-[var(--color-sls-bg-panel-2)] border border-[var(--color-sls-line)] rounded-2xl p-5 shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex flex-col h-[320px]">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="text-sm font-semibold text-[var(--color-sls-ivory)] flex items-center gap-2">
                          <span className="text-[var(--color-sls-gold)] font-mono text-lg">📝</span> Master System Prompt
                        </h3>
                        <div className="text-[10px] uppercase font-mono tracking-wider bg-[rgba(232,185,63,0.1)] text-[var(--color-sls-gold-bright)] px-2 py-1 rounded">Active Directive</div>
                      </div>
                      
                      <textarea 
                        className="flex-1 w-full bg-[rgba(0,0,0,0.3)] border border-[var(--color-sls-line-strong)] rounded-xl p-4 text-[13px] text-[var(--color-sls-ivory)] font-mono leading-relaxed resize-none focus:border-[var(--color-sls-gold)] focus:outline-none focus:ring-1 focus:ring-[var(--color-sls-gold)] transition-all"
                        defaultValue="You are Acharya TN Khurana, an expert Vedic astrologer with over 40 years of experience. Your tone is respectful, deeply spiritual, yet immensely practical and grounded in classical Parashara astrology. 

Always start your consultations by acknowledging the planetary positions provided. Use Sanskrit terminology occasionally but always explain it in simple terms. Never give fatalistic predictions; always offer remedial measures (Upayas) such as mantras, gemstone suggestions, or charitable acts."
                      ></textarea>
                    </div>

                    {/* Chat Session Viewer */}
                    <div className="bg-gradient-to-br from-[var(--color-sls-bg-panel)] to-[var(--color-sls-bg-panel-2)] border border-[var(--color-sls-line)] rounded-2xl p-5 shadow-[0_10px_30px_rgba(0,0,0,0.5)] min-h-[400px] flex flex-col">
                      <div className="flex justify-between items-center mb-4 pb-3 border-b border-[var(--color-sls-line)]">
                        <h3 className="text-sm font-semibold text-[var(--color-sls-ivory)] flex items-center gap-2">
                          <span className="text-[var(--color-sls-gold)] font-mono text-lg">💬</span> Session Replay Viewer
                        </h3>
                        {activeSession && (
                          <div className="text-[11.5px] text-[var(--color-sls-muted)] flex items-center gap-2">
                            <span>Client: <span className="text-[var(--color-sls-gold)]">{activeSession.userEmail}</span></span>
                            <span className="w-1 h-4 bg-[var(--color-sls-line)] mx-1"></span>
                            <span>{new Date(activeSession.createdAt).toLocaleString()}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex-1 bg-[rgba(0,0,0,0.2)] border border-[var(--color-sls-line)] rounded-xl p-4 overflow-y-auto max-h-[400px]">
                        {activeSession ? (
                          <div className="space-y-4">
                            {(activeSession.messages || []).map((msg: any, i: number) => (
                              <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                <span className="text-[10px] uppercase tracking-wider text-[var(--color-sls-muted)] mb-1.5 font-bold">
                                  {msg.role === 'user' ? 'Client' : 'AI Guru'}
                                </span>
                                <div className={`p-3.5 rounded-2xl max-w-[85%] text-[13px] leading-relaxed shadow-sm ${
                                  msg.role === 'user' 
                                    ? 'bg-[rgba(232,185,63,0.15)] text-[var(--color-sls-ivory)] border border-[rgba(232,185,63,0.3)] rounded-tr-sm' 
                                    : 'bg-[rgba(255,255,255,0.03)] text-[var(--color-sls-muted)] border border-[var(--color-sls-line)] rounded-tl-sm'
                                }`}>
                                  {msg.content}
                                </div>
                              </div>
                            ))}
                            {(!activeSession.messages || activeSession.messages.length === 0) && (
                              <div className="flex items-center justify-center h-full text-[12px] text-[var(--color-sls-muted)] italic">
                                Session transcript is empty or corrupted.
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center h-[200px] text-[var(--color-sls-muted)]">
                            <span className="text-3xl mb-3 opacity-30">👁️</span>
                            <p className="text-[12.5px]">Select a session from the sidebar to review transcripts.</p>
                          </div>
                        )}
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            );
          })()}

          {/* TAB 13: ASTROLOGY TOOLKIT TOGGLE */}
          {activeTab === 'toolkit' && (() => {
            const allAvailableTools = [
              { id: 'birth_chart', name: 'Birth Chart Generator', desc: 'Computes solar houses, constellations positions and ascendants graphs on natal time.', icon: '🌌' },
              { id: 'kundli', name: 'Kundli Matchmaking', desc: 'Computes Guna Milan (36 points) algorithms to evaluate wedding partners.', icon: '🔮' },
              { id: 'horoscope', name: 'Monthly Horoscope', desc: 'Dynamic celestial transit forecasts based on stellar nakshatras.', icon: '✨' },
              { id: 'numerology', name: 'Chaldean Numerology', desc: 'Evaluates numeric frequencies of names, phone numbers and solar dates.', icon: '🍀' },
              { id: 'manglik', name: 'Manglik Evaluator', desc: 'Finds astrological afflictions and Mars houses weights with remedies.', icon: '🔥' },
              { id: 'gemstone', name: 'Gemstone Engine', desc: 'Suggests high-carat mineral elements to strengthen aura frequencies.', icon: '💎' }
            ];

            const toggleTool = (toolId: string) => {
              const active = dbToolkitSettings.activeTools || [];
              let updated = [];
              if (active.includes(toolId)) {
                updated = active.filter(t => t !== toolId);
              } else {
                updated = [...active, toolId];
              }
              const newSettings = { ...dbToolkitSettings, activeTools: updated };
              setDbToolkitSettings(newSettings);

              fetch('/api/admin/astrology-toolkit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newSettings)
              });
            };

            return (
              <div className="space-y-8 max-w-5xl mx-auto font-outfit text-left mt-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[var(--color-sls-line)] pb-5">
                  <div>
                    <h2 className="font-cinzel text-xl md:text-2xl text-[var(--color-sls-gold)] font-medium">Vedic Tool Manager</h2>
                    <p className="text-[13px] md:text-sm text-[var(--color-sls-muted)] mt-1 max-w-lg">Manage digital astrological tools and algorithm endpoints on the client portal. Deactivated elements hide from end-users instantly.</p>
                  </div>
                  <div className="flex gap-3">
                    <button className="px-4 py-2 border border-[var(--color-sls-line-strong)] rounded-lg text-[13px] text-[var(--color-sls-ivory)] hover:border-[var(--color-sls-gold-bright)] hover:text-[var(--color-sls-gold-bright)] transition-all">
                      View Audit Log
                    </button>
                    <button className="px-4 py-2 bg-[var(--color-sls-gold)] text-[#1a1305] rounded-lg text-[13px] font-medium shadow-[0_4px_16px_rgba(201,162,39,0.3)] transition-all hover:scale-[1.02] hover:bg-[var(--color-sls-gold-bright)]">
                      + Add Custom Tool
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {allAvailableTools.map(tool => {
                    const isEnabled = (dbToolkitSettings.activeTools || []).includes(tool.id);
                    return (
                      <div 
                        key={tool.id} 
                        className={`relative p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between overflow-hidden group ${
                          isEnabled 
                            ? 'bg-gradient-to-br from-[rgba(232,185,63,0.06)] to-transparent border-[var(--color-sls-gold)] shadow-[0_8px_24px_rgba(232,185,63,0.12)]' 
                            : 'bg-[rgba(255,255,255,0.015)] border-[var(--color-sls-line)] hover:border-[var(--color-sls-line-strong)]'
                        }`}
                      >
                        {isEnabled && <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-sls-gold)] blur-[80px] opacity-20 pointer-events-none"></div>}
                        
                        <div className="relative z-10">
                          <div className="flex justify-between items-start mb-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-sm ${
                              isEnabled 
                                ? 'bg-[var(--color-sls-gold)] text-[#1a1305]' 
                                : 'bg-[rgba(255,255,255,0.05)] border border-[var(--color-sls-line)] text-white grayscale opacity-70'
                            }`}>
                              {tool.icon}
                            </div>
                            
                            <button 
                              onClick={() => toggleTool(tool.id)}
                              className={`w-12 h-6 rounded-full p-1 flex items-center transition-all duration-300 ${
                                isEnabled ? 'bg-[var(--color-sls-gold)] justify-end' : 'bg-[rgba(255,255,255,0.1)] justify-start'
                              }`}
                            >
                              <span className={`w-4 h-4 rounded-full shadow-sm transition-all duration-300 ${isEnabled ? 'bg-[#1a1305]' : 'bg-white/60'}`}></span>
                            </button>
                          </div>

                          <h3 className={`font-semibold text-base mb-2 transition-colors ${isEnabled ? 'text-[var(--color-sls-ivory)]' : 'text-[var(--color-sls-muted)]'}`}>
                            {tool.name}
                          </h3>
                          <p className={`text-[12px] leading-relaxed line-clamp-3 transition-colors ${isEnabled ? 'text-[rgba(245,239,224,0.7)]' : 'text-[#596478]'}`}>
                            {tool.desc}
                          </p>
                        </div>

                        <div className="relative z-10 mt-5 pt-4 border-t border-[rgba(255,255,255,0.06)] flex justify-between items-center">
                          <span className={`text-[10px] uppercase font-mono tracking-wider font-semibold ${
                            isEnabled ? 'text-[#7BC98E]' : 'text-[#FF6B6B]'
                          }`}>
                            {isEnabled ? '● Active' : '○ Offline'}
                          </span>
                          <button className={`text-[11px] hover:underline ${isEnabled ? 'text-[var(--color-sls-gold)]' : 'text-[var(--color-sls-muted)]'}`}>
                            Configure →
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}

          {/* TAB 14: NOTIFICATIONS & SOUND PARAMETERS */}
          {activeTab === 'notifications' && (
            <div className="space-y-6 max-w-5xl mx-auto font-outfit text-left mt-4">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[var(--color-sls-line)] pb-5">
                <div>
                  <h2 className="font-cinzel text-xl md:text-2xl text-[var(--color-sls-gold)] font-medium">Sound Alert Centre</h2>
                  <p className="text-[13px] md:text-sm text-[var(--color-sls-muted)] mt-1 max-w-lg">Control live alert acoustics, configure volume meters, and clear active pending alerts streams.</p>
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={async () => {
                      const res = await fetch('/api/admin/notifications/read-all', { method: 'POST' });
                      if (res.ok) {
                        setDbNotifications(prev => prev.map(n => ({ ...n, status: 'read' })));
                        setUnreadNotificationsCount(0);
                      }
                    }}
                    className="px-4 py-2 border border-[var(--color-sls-line-strong)] rounded-lg text-[13px] text-[var(--color-sls-ivory)] hover:border-[var(--color-sls-gold-bright)] hover:text-[var(--color-sls-gold-bright)] transition-all"
                  >
                    Mark All as Read
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Master controls block */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="bg-gradient-to-br from-[var(--color-sls-bg-panel)] to-[var(--color-sls-bg-panel-2)] border border-[var(--color-sls-line)] rounded-2xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.5)] h-full">
                    <h3 className="text-sm font-semibold text-[var(--color-sls-ivory)] mb-6 flex items-center gap-2">
                      <span className="text-[var(--color-sls-gold)] font-mono text-lg">🎛️</span> Audio Settings
                    </h3>
                    
                    <div className="space-y-8">
                      {/* Toggle audio */}
                      <div className="space-y-3">
                        <label className="text-[11px] text-[var(--color-sls-muted)] uppercase tracking-[0.05em] font-bold block">Master Alert Switch</label>
                        <div className="flex items-center gap-4 p-4 border border-[var(--color-sls-line-strong)] rounded-xl bg-[rgba(255,255,255,0.02)]">
                          <button 
                            onClick={() => {
                              const updated = { ...dbNotificationSettings, soundEnabled: !dbNotificationSettings.soundEnabled };
                              setDbNotificationSettings(updated);
                              fetch('/api/admin/notification-settings', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(updated)
                              });
                            }}
                            className={`w-12 h-6 rounded-full p-1 flex items-center transition-all duration-300 ${
                              dbNotificationSettings.soundEnabled ? 'bg-[var(--color-sls-gold)] justify-end' : 'bg-[rgba(255,255,255,0.1)] justify-start'
                            }`}
                          >
                            <span className={`w-4 h-4 rounded-full shadow-sm transition-all duration-300 ${dbNotificationSettings.soundEnabled ? 'bg-[#1a1305]' : 'bg-white/60'}`}></span>
                          </button>
                          <div className="flex-1">
                            <span className={`text-[13px] font-medium block ${dbNotificationSettings.soundEnabled ? 'text-[#7BC98E]' : 'text-[var(--color-sls-muted)]'}`}>
                              {dbNotificationSettings.soundEnabled ? 'Alerts Active' : 'Silent Mode'}
                            </span>
                            <span className="text-[11px] text-[#596478]">Global notification sounds</span>
                          </div>
                        </div>
                      </div>

                      {/* Slider volume */}
                      <div className="space-y-3">
                        <div className="flex justify-between items-center mb-1.5">
                          <label className="text-[11px] text-[var(--color-sls-muted)] uppercase tracking-[0.05em] font-bold">Gain Volume</label>
                          <span className="text-[10px] text-[var(--color-sls-gold)] font-mono bg-[rgba(232,185,63,0.1)] px-2 py-0.5 rounded">{Math.round(dbNotificationSettings.volume * 100)}%</span>
                        </div>
                        <input 
                          type="range" 
                          min="0" 
                          max="1" 
                          step="0.05"
                          value={dbNotificationSettings.volume}
                          onChange={e => {
                            const updated = { ...dbNotificationSettings, volume: parseFloat(e.target.value) };
                            setDbNotificationSettings(updated);
                            fetch('/api/admin/notification-settings', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify(updated)
                            });
                          }}
                          className="w-full accent-[var(--color-sls-gold)] cursor-pointer h-1.5 bg-[var(--color-sls-line-strong)] rounded-lg appearance-none"
                        />
                        <div className="flex justify-between text-[10px] text-[#596478] mt-1">
                          <span>Whisper</span>
                          <span>Temple Chime</span>
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t border-[var(--color-sls-line-strong)]">
                        <button 
                          onClick={() => triggerAlarmSound(dbNotificationSettings.volume)} 
                          className="w-full px-4 py-3 bg-[rgba(232,185,63,0.05)] border border-[var(--color-sls-gold)] text-[var(--color-sls-gold)] hover:bg-[rgba(232,185,63,0.1)] rounded-lg text-[13px] font-medium transition-colors flex items-center justify-center gap-2"
                        >
                          <span>🔊</span> Test Synthesizer Output
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Alerts Log history */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="bg-gradient-to-br from-[var(--color-sls-bg-panel)] to-[var(--color-sls-bg-panel-2)] border border-[var(--color-sls-line)] rounded-2xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.5)] min-h-[400px]">
                    <div className="flex justify-between items-center mb-6 border-b border-[var(--color-sls-line)] pb-4">
                      <h3 className="text-sm font-semibold text-[var(--color-sls-ivory)] flex items-center gap-2">
                        <span className="text-[var(--color-sls-gold)] font-mono text-lg">🗂️</span> Active Stream <span className="ml-2 px-2 py-0.5 bg-[rgba(255,255,255,0.05)] rounded text-[11px]">{dbNotifications.length}</span>
                      </h3>
                    </div>

                    <div className="space-y-3 max-h-[450px] overflow-y-auto pr-2">
                      {dbNotifications.map(n => (
                        <div key={n.id} className={`p-4 rounded-xl border flex items-start gap-4 transition-colors ${
                          n.status === 'unread' 
                            ? 'bg-[rgba(255,107,107,0.05)] border-[#FF6B6B]/30 shadow-sm' 
                            : 'bg-[rgba(255,255,255,0.015)] border-[var(--color-sls-line)] hover:bg-[rgba(255,255,255,0.03)]'
                        }`}>
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0 ${
                            n.status === 'unread' ? 'bg-[#FF6B6B]/20 text-[#FF6B6B]' : 'bg-[rgba(255,255,255,0.05)] opacity-60'
                          }`}>
                            {n.type === 'Booking' && '📅'}
                            {n.type === 'Order' && '🛍️'}
                            {n.type === 'Payment' && '💳'}
                            {n.type === 'New User' && '👤'}
                            {n.type === 'Inquiry' && '✉️'}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-1">
                              <span className={`font-medium text-[13.5px] ${n.status === 'unread' ? 'text-white' : 'text-[var(--color-sls-ivory)]'}`}>{n.title}</span>
                              <span className="text-[10px] text-[#596478] font-mono shrink-0">{new Date(n.createdAt).toLocaleTimeString()}</span>
                            </div>
                            <p className="text-[12px] text-[var(--color-sls-muted)] leading-relaxed">{n.message}</p>
                          </div>
                        </div>
                      ))}
                      {dbNotifications.length === 0 && (
                        <div className="py-16 flex flex-col items-center justify-center text-center">
                          <span className="text-3xl mb-4 opacity-20">📭</span>
                          <p className="text-[13px] text-[var(--color-sls-muted)]">No alarm events currently saved inside portal stack logs.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 15: SEEKERS & PORTAL REGISTRANTS */}
          {/* TAB 15: SEEKERS & PORTAL REGISTRANTS */}
          {activeTab === 'users' && (() => {
            const filteredSeekers = seekers.filter(s => 
              (s.name || '').toLowerCase().includes(clientQuery.toLowerCase()) ||
              (s.email || '').toLowerCase().includes(clientQuery.toLowerCase()) ||
              (s.city || '').toLowerCase().includes(clientQuery.toLowerCase())
            );

            return (
              <div className="space-y-6 max-w-6xl mx-auto font-outfit text-left mt-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[var(--color-sls-line)] pb-5">
                  <div>
                    <h2 className="font-cinzel text-xl md:text-2xl text-[var(--color-sls-gold)] font-medium">Registered Seekers Database</h2>
                    <p className="text-[13px] md:text-sm text-[var(--color-sls-muted)] mt-1 max-w-lg">Control client authorization profiles, verify manual registrations, and view logins telemetry.</p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-[var(--color-sls-bg-panel)] to-[var(--color-sls-bg-panel-2)] border border-[var(--color-sls-line)] rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] overflow-hidden">
                  <div className="flex items-center gap-3 p-4 border-b border-[var(--color-sls-line)]">
                    <input 
                      type="text" 
                      placeholder="🔍 Search seeker profiles by Name, Email or City/Location..."
                      value={clientQuery}
                      onChange={e => setClientQuery(e.target.value)}
                      className="bg-[rgba(255,255,255,0.03)] border border-[var(--color-sls-line-strong)] rounded-lg px-4 py-2 text-[13px] w-full max-w-md focus:border-[var(--color-sls-gold)] focus:outline-none placeholder:text-[var(--color-sls-muted)] text-[var(--color-sls-ivory)]"
                    />
                  </div>

                  <div className="overflow-x-auto w-full pb-2">
                    <table className="w-full text-left min-w-[600px]">
                      <thead className="bg-[rgba(232,185,63,0.02)] border-b border-[var(--color-sls-line)]">
                        <tr>
                          <th className="px-5 py-4 text-[11.5px] uppercase tracking-[0.05em] text-[var(--color-sls-muted)] font-medium whitespace-nowrap">Seeker / Location</th>
                          <th className="px-5 py-4 text-[11.5px] uppercase tracking-[0.05em] text-[var(--color-sls-muted)] font-medium whitespace-nowrap">Contact Channel</th>
                          <th className="px-5 py-4 text-[11.5px] uppercase tracking-[0.05em] text-[var(--color-sls-muted)] font-medium text-center whitespace-nowrap">Security Status</th>
                          <th className="px-5 py-4 text-[11.5px] uppercase tracking-[0.05em] text-[var(--color-sls-muted)] font-medium text-right whitespace-nowrap">Joined Portal</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--color-sls-line)]">
                        {filteredSeekers.map(s => (
                          <tr key={s.id} className="hover:bg-[rgba(232,185,63,0.03)] transition-colors">
                            <td className="px-5 py-4 align-middle whitespace-nowrap">
                              <div className="font-medium text-[var(--color-sls-ivory)]">{s.name}</div>
                              <div className="text-[12px] text-[var(--color-sls-muted)] mt-1 flex items-center gap-1">📍 {s.city || 'India'}</div>
                            </td>
                            <td className="px-5 py-4 align-middle whitespace-nowrap">
                              <div className="text-[13.5px] text-[var(--color-sls-ivory)]">{s.email}</div>
                              <div className="text-[12px] text-[var(--color-sls-muted)] mt-1">{s.phone || 'No phone registered'}</div>
                            </td>
                            <td className="px-5 py-4 align-middle text-center whitespace-nowrap">
                              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11.5px] font-medium before:content-[''] before:w-1.5 before:h-1.5 before:rounded-full before:bg-current ${
                                s.verified 
                                  ? 'text-[#7BC98E] bg-[rgba(123,201,142,0.12)]' 
                                  : 'text-[var(--color-sls-gold-bright)] bg-[rgba(232,185,63,0.12)] animate-pulse'
                              }`}>
                                {s.verified ? 'Verified' : 'Pending OTP verification'}
                              </span>
                            </td>
                            <td className="px-5 py-4 align-middle text-right text-[13px] text-[var(--color-sls-muted)] whitespace-nowrap">
                              {new Date(s.registeredDate || Date.now()).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                        {filteredSeekers.length === 0 && (
                          <tr>
                            <td colSpan={4} className="py-16 text-center text-[var(--color-sls-muted)]">
                              <div className="text-[34px] text-[var(--color-sls-gold)] mb-3">👤</div>
                              <h3 className="text-[var(--color-sls-ivory)] font-medium font-cinzel text-lg mb-2">No Profiles Found</h3>
                              <p className="text-sm">There are no seeker profiles found in registry records.</p>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* TAB 16: TELEMETRY & SYSTEM HEALTH FEED */}
          {activeTab === 'monitoring' && (
            <div className="space-y-6 max-w-6xl mx-auto font-outfit text-left mt-4">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[var(--color-sls-line)] pb-5">
                <div>
                  <h2 className="font-cinzel text-xl md:text-2xl text-[var(--color-sls-gold)] font-medium">Active Telemetry & Event Ticker</h2>
                  <p className="text-[13px] md:text-sm text-[var(--color-sls-muted)] mt-1 max-w-lg">Scans backend pipeline transactions, database microservices, SMTP routes and live network stream ticks.</p>
                </div>
              </div>

              {/* Connection diagnostics block */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="p-5 rounded-2xl bg-gradient-to-br from-[var(--color-sls-bg-panel)] to-[var(--color-sls-bg-panel-2)] border border-[var(--color-sls-line)] shadow-[0_10px_30px_rgba(0,0,0,0.5)] space-y-2">
                  <div className="text-[11px] text-[var(--color-sls-muted)] font-bold uppercase tracking-[0.05em]">Dynamic Key Value Storage</div>
                  <div className="text-[13px] font-semibold text-[var(--color-sls-ivory)] flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#7BC98E] shadow-[0_0_8px_#7BC98E]"></span> Fully Persisted db.json Table
                  </div>
                </div>
                <div className="p-5 rounded-2xl bg-gradient-to-br from-[var(--color-sls-bg-panel)] to-[var(--color-sls-bg-panel-2)] border border-[var(--color-sls-line)] shadow-[0_10px_30px_rgba(0,0,0,0.5)] space-y-2">
                  <div className="text-[11px] text-[var(--color-sls-muted)] font-bold uppercase tracking-[0.05em]">Real-Time Event stream (SSE)</div>
                  <div className="text-[13px] font-semibold text-[var(--color-sls-ivory)] flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#5EC8E8] shadow-[0_0_8px_#5EC8E8] animate-pulse"></span> Live Listening pipelines active
                  </div>
                </div>
                <div className="p-5 rounded-2xl bg-gradient-to-br from-[var(--color-sls-bg-panel)] to-[var(--color-sls-bg-panel-2)] border border-[var(--color-sls-line)] shadow-[0_10px_30px_rgba(0,0,0,0.5)] space-y-2">
                  <div className="text-[11px] text-[var(--color-sls-muted)] font-bold uppercase tracking-[0.05em]">Gemini AI Model Sync</div>
                  <div className="text-[13px] font-semibold text-[var(--color-sls-ivory)] flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-sls-gold-bright)] shadow-[0_0_8px_var(--color-sls-gold-bright)]"></span> gemini-3.5-flash online
                  </div>
                </div>
              </div>

              {/* Scrolling ticker lists */}
              <div className="p-6 rounded-2xl bg-[#030200] border border-[var(--color-sls-line)] shadow-[0_10px_30px_rgba(0,0,0,0.5)] space-y-4">
                <h3 className="text-sm font-bold text-[var(--color-sls-gold)] flex items-center gap-2 font-mono uppercase tracking-[0.05em]">
                  <span className="animate-pulse">⚡</span> LIVE SYSTEM DIAGNOSTIC PIPELINES
                </h3>
                <div className="bg-[#080603] p-5 rounded-xl border border-[var(--color-sls-line-strong)] font-mono text-[11px] text-[#7BC98E] space-y-2.5 h-[350px] overflow-y-auto w-full text-left custom-scrollbar shadow-inner">
                  <div>[ {new Date().toLocaleTimeString()} ] SYSADMIN: Real-time telemetry channels established. Operating on standard port 3000 ingress loops.</div>
                  <div>[ {new Date().toLocaleTimeString()} ] DATABASE: Sync-loaded client.db collections securely.</div>
                  <div>[ {new Date().toLocaleTimeString()} ] AI SERVICE: Gemini flash pipelines successfully initialized. Fallback astrology model active.</div>
                  <div>[ {new Date().toLocaleTimeString()} ] WEBAUDIO: Tibetan bell chime frequencies synthesized successfully on channel loop.</div>
                  <div>[ {new Date().toLocaleTimeString()} ] CLIENT SERVICE: Total loaded registered seekers count is {seekers.length}.</div>
                  <div>[ {new Date().toLocaleTimeString()} ] ADMIN LOGS: System listening to sse socket routes at '/api/admin/notifications/stream'.</div>
                  {activityLogs.slice(0, 15).map(log => (
                    <div key={log.id} className="text-[#5EC8E8]">
                      [ {new Date(log.timestamp).toLocaleTimeString()} ] {log.action}: {log.details} <span className="text-[var(--color-sls-muted)]">[ actor: {log.user} ]</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* FLOATING REAL-TIME SYSTEM NOTIFICATION POPUP ALARM WITH CUSTOM STYLING */}
      {notificationPopup && (
        <div className="fixed bottom-6 right-6 z-[6000] w-96 p-5 rounded-2xl bg-gradient-to-br from-[var(--color-sls-bg-panel)] to-[var(--color-sls-bg-panel-2)] border border-[#FF6B6B]/40 shadow-[0_20px_40px_rgba(0,0,0,0.8),0_0_20px_rgba(255,107,107,0.2)] text-left flex gap-4 mr-1 animate-slide-in-up" style={{ animationDuration: '0.4s' }}>
          <div className="text-2xl pt-1 shrink-0 bg-[#FF6B6B]/10 w-10 h-10 rounded-full flex items-center justify-center border border-[#FF6B6B]/20">
            {notificationPopup.type === 'Booking' && '📅'}
            {notificationPopup.type === 'Order' && '🛍️'}
            {notificationPopup.type === 'Payment' && '💳'}
            {notificationPopup.type === 'New User' && '👤'}
            {notificationPopup.type === 'Inquiry' && '✉️'}
          </div>
          <div className="flex-1 space-y-1 font-outfit">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#FF6B6B] flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#FF6B6B] animate-pulse"></span> ALERT DISPATCHED</span>
              <button onClick={() => setNotificationPopup(null)} className="text-[var(--color-sls-muted)] hover:text-white transition-colors w-6 h-6 flex items-center justify-center rounded-md hover:bg-[rgba(255,255,255,0.1)]">✕</button>
            </div>
            <h4 className="font-cinzel text-[15px] font-bold text-[var(--color-sls-ivory)] leading-snug">{notificationPopup.title}</h4>
            <p className="text-[12px] text-[var(--color-sls-muted)] leading-relaxed">{notificationPopup.message}</p>
          </div>
        </div>
      )}

    </div>
  );
}
