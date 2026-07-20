import React, { useState, useEffect, useRef } from 'react';
import { Mail, Lock, User, Phone, MapPin, Sparkles, AlertCircle, RefreshCw, CheckCircle2, ArrowLeft } from 'lucide-react';

interface AuthProps {
  onAuthSuccess: (user: any) => void;
  onCancel?: () => void;
}

// Dedicated hook to fetch and check general SMTP Configuration
export function useSMTPConfig() {
  const [smtpStatus, setSmtpStatus] = useState<{ enabled: boolean; provider: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/smtp/status')
      .then(res => {
        if (res.ok) return res.json();
        throw new Error('SMTP Status Unreachable');
      })
      .then(data => {
        const connected = data.status === 'Connected';
        setSmtpStatus({
          enabled: connected,
          provider: connected ? 'Live Connection' : 'Offline'
        });
      })
      .catch(() => {
        setSmtpStatus({ enabled: false, provider: 'Offline' });
      })
      .finally(() => setLoading(false));
  }, []);

  return { smtpStatus, loading };
}

export default function Auth({ onAuthSuccess, onCancel }: AuthProps) {
  const { smtpStatus, loading: smtpLoading } = useSMTPConfig();

  const [mode, setMode] = useState<'login_otp' | 'login_pass' | 'register' | 'forgot_password'>('login_otp');
  const [step, setStep] = useState<'request' | 'verify'>('request');

  // Input States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Status & Timers
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);
  
  // 60-second countdown states
  const [cooldown, setCooldown] = useState(0);
  const cooldownTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (cooldown > 0) {
      cooldownTimerRef.current = setTimeout(() => {
        setCooldown(prev => prev - 1);
      }, 1000);
    }
    return () => {
      if (cooldownTimerRef.current) clearTimeout(cooldownTimerRef.current);
    };
  }, [cooldown]);

  const restartCooldown = () => {
    setCooldown(60);
  };

  // 1. Send OTP Request
  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please input a valid email address.');
      return;
    }
    // Allow OTP attempt even if status pre-check failed (can be unreliable on serverless)
    setError('');
    setInfo('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await res.json();
      if (res.ok) {
        setStep('verify');
        setInfo(data.message || 'Verification OTP dispatched! Please check your mailbox.');
        restartCooldown();
      } else {
        setError(data.error || 'Failed to dispatch email verification.');
      }
    } catch (err: any) {
      setError('Connection to auth servers failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  // 2. Confirm OTP Verification
  const handleConfirmOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) {
      setError('Please enter the 6-digit verification code.');
      return;
    }
    setError('');
    setInfo('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: otp })
      });

      const data = await res.json();
      if (res.ok) {
        setInfo('Identity verified successfully! Syncing client portal...');
        setTimeout(() => {
          onAuthSuccess(data.user);
        }, 800);
      } else {
        setError(data.error || 'Invalid OTP code. Please retry.');
      }
    } catch (err: any) {
      setError('Authentication server error. Try again.');
    } finally {
      setLoading(false);
    }
  };

  // 3. User Password Register
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !name) {
      setError('Please complete all mandatory * fields.');
      return;
    }
    // Allow registration attempt even if status pre-check failed (can be unreliable on serverless)
    setError('');
    setInfo('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          name,
          phone,
          city,
          address
        })
      });

      const data = await res.json();
      if (res.ok) {
        setStep('verify');
        setInfo('Seeker profile registered! Verification OTP dispatched to ' + email + '.');
        restartCooldown();
      } else {
        setError(data.error || 'Registration failed.');
      }
    } catch (err: any) {
      setError('Server connection failure.');
    } finally {
      setLoading(false);
    }
  };

  // 4. Session Login with Password
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Email and password must be filled.');
      return;
    }
    setError('');
    setInfo('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (res.ok) {
        setInfo('Authenticated successfully!');
        setTimeout(() => {
          onAuthSuccess(data.user);
        }, 800);
      } else {
        setError(data.error || 'Incorrect email or password combination.');
      }
    } catch (err: any) {
      setError('Server connection failure.');
    } finally {
      setLoading(false);
    }
  };

  // 5. Send Reset Password Request OTP
  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Email cannot be blank.');
      return;
    }
    // Allow reset attempt even if status pre-check failed (can be unreliable on serverless)
    setError('');
    setInfo('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await res.json();
      if (res.ok) {
        setStep('verify');
        setInfo(data.message || 'Password reset OTP code dispatched to email!');
        restartCooldown();
      } else {
        setError(data.error || 'Failed to dispatch reset code.');
      }
    } catch (err) {
      setError('Failed to reach servers.');
    } finally {
      setLoading(false);
    }
  };

  // 6. Confirm Reset Password with OTP
  const handleResetConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || !newPassword) {
      setError('OTP code and New Password are mandatory.');
      return;
    }
    setError('');
    setInfo('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: otp, newPassword })
      });

      const data = await res.json();
      if (res.ok) {
        setInfo('Password successfully updated! Proceeding to OTP Login tab.');
        setTimeout(() => {
          setMode('login_otp');
          setStep('request');
          setError('');
          setInfo('');
        }, 1500);
      } else {
        setError(data.error || 'Verification failed. Double check code and guidelines.');
      }
    } catch (err) {
      setError('Failed to reach servers.');
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP Helper
  const handleResendOTP = async () => {
    if (cooldown > 0) return;
    setError('');
    setInfo('');
    // Allow resend attempt even if status pre-check failed (can be unreliable on serverless)
    setLoading(true);

    try {
      const route = mode === 'forgot_password' ? '/api/auth/forgot-password' : '/api/auth/resend-otp';
      const res = await fetch(route, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await res.json();
      if (res.ok) {
        setInfo('Verification OTP re-sent successfully!');
        restartCooldown();
      } else {
        setError(data.error || 'Failed to re-send code.');
      }
    } catch (err) {
      setError('Failed to dispatch code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="auth-panel" className="w-full max-w-md mx-auto p-6 rounded-3xl bg-[#0a0e18] border border-white/5 space-y-6 text-left shadow-2xl relative z-10">
      
      {/* Tab toggle */}
      {step === 'request' && (
        <div className="flex bg-white/[0.02] border border-white/10 rounded-2xl p-1 text-xs font-bold text-slate-400">
          <button 
            type="button"
            onClick={() => { setMode('login_otp'); setError(''); setInfo(''); }}
            className={`flex-1 py-2 rounded-xl transition-all border-none cursor-pointer ${mode === 'login_otp' ? 'bg-[#C9A227] text-[#1a1000]' : 'text-[#8b96aa] hover:text-white bg-transparent'}`}
          >
            🔑 OTP Login
          </button>
          <button 
            type="button"
            onClick={() => { setMode('login_pass'); setError(''); setInfo(''); }}
            className={`flex-1 py-2 rounded-xl transition-all border-none cursor-pointer ${mode === 'login_pass' ? 'bg-[#C9A227] text-[#1a1000]' : 'text-[#8b96aa] hover:text-white bg-transparent'}`}
          >
            🔒 Password
          </button>
          <button 
            type="button"
            onClick={() => { setMode('register'); setError(''); setInfo(''); }}
            className={`flex-1 py-2 rounded-xl transition-all border-none cursor-pointer ${mode === 'register' ? 'bg-[#C9A227] text-[#1a1000]' : 'text-[#8b96aa] hover:text-white bg-transparent'}`}
          >
            ✏️ Register
          </button>
        </div>
      )}

      {/* Title with Divine Favicon Logo */}
      <div className="text-center space-y-2 pt-2">
        <div className="w-20 h-20 rounded-full border border-[#C9A227]/30 bg-black/50 overflow-hidden flex items-center justify-center shadow-[0_0_25px_rgba(201,162,39,0.2)] mx-auto relative group">
          <img 
            src="/favicon.jpg" 
            alt="Acharya TN Khurana Astrologer Logo" 
            className="w-18 h-18 object-contain transition-transform duration-700 group-hover:scale-110"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#C9A227]/10 to-transparent pointer-events-none" />
        </div>
        
        <h3 className="font-serif text-xl sm:text-2xl font-black text-[#f5d98a] flex items-center justify-center gap-2">
          {mode === 'register' ? '✦ Seeker Registration' : mode === 'forgot_password' ? '✦ Reset Seeker Key' : '✦ Authorized Seeker'}
        </h3>
        <p className="text-[10px] text-[#8b96aa] uppercase tracking-wider font-extrabold">Acharya TN Khurana Astrologer Portal</p>
      </div>

      {/* SMTP Hook Diagnostics Alert Line */}
      {smtpLoading ? (
        <div className="text-[10px] text-slate-500 text-center animate-pulse">Scanning server mail relay connection...</div>
      ) : smtpStatus && (
        <div className="bg-white/[0.01] border border-white/5 rounded-xl px-3 py-2 flex items-center justify-between text-[10px]">
          <span className="text-[#596478]">Relay System:</span>
          <span className={`font-mono font-bold uppercase transition-all ${smtpStatus.enabled ? 'text-emerald-400' : 'text-amber-400'}`}>
            {smtpStatus.enabled ? `📡 Live ${smtpStatus.provider}` : '⚠️ Email relay may be slow'}
          </span>
        </div>
      )}

      {/* Alert panels */}
      {error && (
        <div className="p-3 bg-red-400/10 border border-red-500/20 text-red-400 rounded-xl text-center text-xs font-semibold flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {info && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-center text-xs font-semibold flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{info}</span>
        </div>
      )}

      {/* Dynamic Forms based on Mode & Step */}
      <div className="space-y-4">
        {step === 'request' && mode === 'login_otp' && (
          <form onSubmit={handleRequestOTP} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="text-[10.5px] uppercase font-black text-[#8b96aa]">Enter Registered Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 text-[#596478] w-4 h-4" />
                <input 
                  type="email" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  placeholder="name@gmail.com" 
                  className="form-input text-xs pl-10" 
                  required 
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full h-11 rounded-xl bg-gradient-to-r from-[#C9A227] to-[#f0d070] text-[#1a1000] font-black cursor-pointer flex items-center justify-center gap-1.5 border-none"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Instantly Dispatch Login OTP'}
            </button>

            <div className="text-center pt-2">
              <button 
                type="button" 
                onClick={() => setMode('forgot_password')} 
                className="text-[11px] text-[#C9A227] font-semibold hover:underline bg-transparent border-none cursor-pointer"
              >
                Forgot your password credentials?
              </button>
            </div>
          </form>
        )}

        {step === 'request' && mode === 'login_pass' && (
          <form onSubmit={handlePasswordLogin} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="text-[10.5px] uppercase font-black text-[#8b96aa]">Registered Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 text-[#596478] w-4 h-4" />
                <input 
                  type="email" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  placeholder="name@gmail.com" 
                  className="form-input text-xs pl-10" 
                  required 
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10.5px] uppercase font-black text-[#8b96aa]">Enter Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 text-[#596478] w-4 h-4" />
                <input 
                  type="password" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  placeholder="••••••••••••" 
                  className="form-input text-xs pl-10" 
                  required 
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full h-11 rounded-xl bg-gradient-to-r from-[#C9A227] to-[#f0d070] text-[#1a1000] font-black cursor-pointer flex items-center justify-center gap-1.5 border-none"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Log In Secure Session'}
            </button>

            <div className="text-center pt-2">
              <button 
                type="button" 
                onClick={() => setMode('forgot_password')} 
                className="text-[11px] text-[#C9A227] font-semibold hover:underline bg-transparent border-none cursor-pointer"
              >
                Reset Password Key
              </button>
            </div>
          </form>
        )}

        {step === 'request' && mode === 'register' && (
          <form onSubmit={handleRegister} className="space-y-3.5 text-xs">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-black text-[#8b96aa]">Full Name *</label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 text-[#596478] w-4 h-4" />
                <input 
                  type="text" 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  placeholder="Full Name" 
                  className="form-input text-xs pl-10" 
                  required 
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-black text-[#8b96aa]">Email Address *</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  placeholder="Email" 
                  className="form-input text-xs" 
                  required 
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-black text-[#8b96aa]">Mobile / WhatsApp Phone</label>
                <input 
                  type="text" 
                  value={phone} 
                  onChange={e => setPhone(e.target.value)} 
                  placeholder="+91 99887 76655" 
                  className="form-input text-xs" 
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-black text-[#8b96aa]">Portal Password (Min 6 Characters) *</label>
              <input 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                placeholder="••••••" 
                className="form-input text-xs" 
                required 
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-black text-[#8b96aa]">Current Location / City</label>
                <input 
                  type="text" 
                  value={city} 
                  onChange={e => setCity(e.target.value)} 
                  placeholder="e.g. New Delhi" 
                  className="form-input text-xs" 
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-black text-[#8b96aa]">Postal Address</label>
                <input 
                  type="text" 
                  value={address} 
                  onChange={e => setAddress(e.target.value)} 
                  placeholder="Address Line" 
                  className="form-input text-xs" 
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full h-11 rounded-xl bg-gradient-to-r from-[#C9A227] to-[#f0d070] text-[#1a1000] font-black cursor-pointer flex items-center justify-center gap-1.5 border-none mt-2"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Verify Email & Create Account'}
            </button>
          </form>
        )}

        {step === 'request' && mode === 'forgot_password' && (
          <form onSubmit={handleResetRequest} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="text-[10.5px] uppercase font-black text-[#8b96aa]">Registered Seeker Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 text-[#596478] w-4 h-4" />
                <input 
                  type="email" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  placeholder="Enter account email" 
                  className="form-input text-xs pl-10" 
                  required 
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full h-11 rounded-xl bg-gradient-to-r from-[#C9A227] to-[#f0d070] text-[#1a1000] font-black cursor-pointer flex items-center justify-center gap-1.5 border-none"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Send Password recovery code'}
            </button>

            <button 
              type="button" 
              onClick={() => setMode('login_otp')}
              className="w-full py-2 bg-transparent text-slate-400 font-bold hover:text-white border-none cursor-pointer flex items-center justify-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to OTP Login
            </button>
          </form>
        )}

        {step === 'verify' && (
          <div className="space-y-4 text-xs">
            <div className="bg-white/[0.01] border border-white/5 p-3 rounded-xl text-center">
              <div className="text-[#596478] text-[10px] uppercase font-extrabold">Active Verification Handle</div>
              <div className="text-white font-mono font-bold mt-0.5">{email}</div>
            </div>

            <form onSubmit={mode === 'forgot_password' ? handleResetConfirm : handleConfirmOTP} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10.5px] uppercase font-black text-[#8b96aa] block text-center">Enter 6-Digit Email OTP passcode</label>
                <input 
                  type="text" 
                  maxLength={6}
                  value={otp} 
                  onChange={e => setOtp(e.target.value.replace(/[^0-9]/g, ''))} 
                  placeholder="xxxxxx" 
                  className="form-input text-center font-mono text-xl tracking-widest text-semibold" 
                  required 
                />
              </div>

              {mode === 'forgot_password' && (
                <div className="space-y-1.5">
                  <label className="text-[10.5px] uppercase font-black text-[#8b96aa]">Define New Secure Password *</label>
                  <input 
                    type="password" 
                    value={newPassword} 
                    onChange={e => setNewPassword(e.target.value)} 
                    placeholder="New password (Min 6 chars)" 
                    className="form-input text-xs" 
                    required 
                  />
                </div>
              )}

              <button 
                type="submit" 
                disabled={loading}
                className="w-full h-11 rounded-xl bg-gradient-to-r from-[#C9A227] to-[#f0d070] text-[#1a1000] font-black cursor-pointer flex items-center justify-center gap-1.5 border-none"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Auspiciously Verify Identity'}
              </button>
            </form>

            <div className="flex justify-between items-center px-1 pt-1">
              <button 
                type="button" 
                onClick={() => { setStep('request'); setError(''); setInfo(''); }}
                className="text-[11px] text-[#8b96aa] font-semibold hover:text-[#C9A227] bg-transparent border-none cursor-pointer flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back change email
              </button>

              <button 
                type="button" 
                onClick={handleResendOTP}
                disabled={cooldown > 0}
                className={`text-[11px] font-bold bg-transparent border-none cursor-pointer transition-all ${cooldown > 0 ? 'text-[#596478]' : 'text-[#C9A227] hover:underline'}`}
              >
                {cooldown > 0 ? `Resend OTP (${cooldown}s)` : 'Resend OTP Code'}
              </button>
            </div>
          </div>
        )}
      </div>

      {onCancel && (
        <button 
          type="button" 
          onClick={onCancel}
          className="w-full py-2 bg-transparent text-slate-500 hover:text-slate-300 font-bold border-none cursor-pointer text-xs flex items-center justify-center gap-1"
        >
          Cancel and return home
        </button>
      )}

    </div>
  );
}
