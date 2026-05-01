"use client";
import { useState, useEffect, useRef } from 'react';
import { X, Mail, Lock, User, Eye, EyeOff, ArrowLeft, RefreshCw } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const BRAND = '#007bff';
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

export default function AuthModal() {
  const {
    isAuthModalOpen, authMode, setAuthMode, closeAuthModal,
    login, register, verifyEmail, resendOTP, googleLogin, isLoading
  } = useAuth();

  const [step, setStep]           = useState('form'); // 'form' | 'verify'
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName]   = useState('');
  const [showPass, setShowPass]   = useState(false);
  const [error, setError]         = useState('');

  // OTP state
  const [otpEmail, setOtpEmail]     = useState('');
  const [otpCode, setOtpCode]       = useState(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(0);
  const [resending, setResending]   = useState(false);
  const otpRefs = useRef([]);
  const timerRef = useRef(null);
  const googleBtnRef = useRef(null);

  useEffect(() => {
    if (!isAuthModalOpen) return;
    if (!GOOGLE_CLIENT_ID) return;
    const load = () => {
      if (!window.google || !googleBtnRef.current) return;
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: async ({ credential }) => {
          setError('');
          try {
            await googleLogin(credential);
          } catch (err) {
            setError(err.message || 'Google login failed');
          }
        },
      });
      window.google.accounts.id.renderButton(googleBtnRef.current, {
        theme: 'outline', size: 'large', width: 348, text: 'continue_with',
      });
    };
    if (window.google) {
      load();
    } else {
      const el = document.getElementById('google-gsi-script');
      if (el) el.addEventListener('load', load);
    }
  }, [isAuthModalOpen, step]);

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  if (!isAuthModalOpen) return null;

  const startResendTimer = () => {
    setResendTimer(60);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setResendTimer(t => {
        if (t <= 1) { clearInterval(timerRef.current); return 0; }
        return t - 1;
      });
    }, 1000);
  };

  const reset = () => {
    setEmail(''); setPassword(''); setFirstName(''); setLastName('');
    setError(''); setShowPass(false); setStep('form');
    setOtpCode(['', '', '', '', '', '']); setOtpEmail('');
    clearInterval(timerRef.current); setResendTimer(0);
  };

  const handleClose = () => { reset(); closeAuthModal(); };

  const switchMode = (mode) => { reset(); setAuthMode(mode); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (authMode === 'login') {
        const result = await login(email, password);
        if (result?.needsVerification) {
          setOtpEmail(result.email);
          startResendTimer();
          setStep('verify');
          return;
        }
      } else {
        const result = await register(email, password, { firstName, lastName });
        if (result?.needsVerification) {
          setOtpEmail(result.email);
          startResendTimer();
          setStep('verify');
          return;
        }
      }
      reset();
    } catch (err) {
      setError(err.message || 'Something went wrong');
    }
  };

  const handleOtpChange = (i, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otpCode];
    next[i] = val;
    setOtpCode(next);
    if (val && i < 5) otpRefs.current[i + 1]?.focus();
  };

  const handleOtpKey = (i, e) => {
    if (e.key === 'Backspace' && !otpCode[i] && i > 0) otpRefs.current[i - 1]?.focus();
  };

  const handleOtpPaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;
    e.preventDefault();
    const next = pasted.split('').concat(Array(6).fill('')).slice(0, 6);
    setOtpCode(next);
    otpRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const code = otpCode.join('');
    if (code.length < 6) { setError('6 xonali kodni kiriting'); return; }
    setError('');
    try {
      await verifyEmail(otpEmail, code);
      reset();
    } catch (err) {
      setError(err.message || 'Noto\'g\'ri kod');
      setOtpCode(['', '', '', '', '', '']);
      otpRefs.current[0]?.focus();
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0 || resending) return;
    setResending(true);
    setError('');
    try {
      await resendOTP(otpEmail);
      startResendTimer();
    } catch (err) {
      setError(err.message || 'Qayta yuborib bo\'lmadi');
    } finally {
      setResending(false);
    }
  };

  // ── OTP Verify Step ──────────────────────────────────────────────────────────
  if (step === 'verify') {
    return (
      <div
        style={{ position: 'fixed', inset: 0, zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)', padding: '16px' }}
        onClick={(e) => e.target === e.currentTarget && handleClose()}
      >
        <div style={{ background: '#fff', borderRadius: 24, padding: '40px 36px', width: '100%', maxWidth: 420, position: 'relative', boxShadow: '0 24px 80px rgba(0,0,0,0.18)' }}>
          <button onClick={handleClose} style={{ position: 'absolute', top: 16, right: 16, background: '#f1f5f9', border: 'none', borderRadius: '50%', width: 36, height: 36, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={18} color="#64748b" />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
            <div style={{ width: 38, height: 38, background: BRAND, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: 13 }}>EP</div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#0f172a' }}>ExamPulse</div>
              <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>Email tasdiqlash</div>
            </div>
          </div>

          {/* Email icon */}
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <div style={{ width: 64, height: 64, background: '#eff6ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
              <Mail size={28} color={BRAND} />
            </div>
            <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.6 }}>
              <strong style={{ color: '#0f172a' }}>{otpEmail}</strong><br />
              manziliga 6 xonali kod yubordik
            </p>
          </div>

          <form onSubmit={handleVerify}>
            {/* 6 OTP inputs */}
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 20 }} onPaste={handleOtpPaste}>
              {otpCode.map((d, i) => (
                <input
                  key={i}
                  ref={el => otpRefs.current[i] = el}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={d}
                  onChange={e => handleOtpChange(i, e.target.value)}
                  onKeyDown={e => handleOtpKey(i, e)}
                  style={{
                    width: 48, height: 56, textAlign: 'center', fontSize: 22, fontWeight: 800,
                    border: `2px solid ${d ? BRAND : '#e2e8f0'}`, borderRadius: 12,
                    outline: 'none', color: '#0f172a', background: d ? '#eff6ff' : '#f8fafc',
                    fontFamily: 'inherit', transition: 'all .15s',
                  }}
                />
              ))}
            </div>

            {error && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: '#dc2626', fontWeight: 600 }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={isLoading} style={{
              width: '100%', background: isLoading ? '#93c5fd' : BRAND, color: '#fff', border: 'none',
              borderRadius: 13, padding: '14px 0', fontSize: 15, fontWeight: 800, cursor: isLoading ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit', transition: 'all .15s', marginBottom: 14,
            }}>
              {isLoading ? 'Tekshirilmoqda...' : 'Tasdiqlash'}
            </button>
          </form>

          {/* Resend + Back */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <button onClick={() => setStep('form')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: '#64748b', display: 'flex', alignItems: 'center', gap: 5, fontFamily: 'inherit' }}>
              <ArrowLeft size={14} /> Orqaga
            </button>
            <button onClick={handleResend} disabled={resendTimer > 0 || resending} style={{
              background: 'none', border: 'none', cursor: resendTimer > 0 ? 'default' : 'pointer',
              fontSize: 13, fontWeight: 600, color: resendTimer > 0 ? '#94a3b8' : BRAND,
              display: 'flex', alignItems: 'center', gap: 5, fontFamily: 'inherit',
            }}>
              <RefreshCw size={13} />
              {resendTimer > 0 ? `Qayta yuborish (${resendTimer}s)` : 'Qayta yuborish'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Login / Register Form Step ───────────────────────────────────────────────
  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)', padding: '16px' }}
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div style={{ background: '#fff', borderRadius: 24, padding: '40px 36px', width: '100%', maxWidth: 420, position: 'relative', boxShadow: '0 24px 80px rgba(0,0,0,0.18)' }}>

        <button onClick={handleClose} style={{ position: 'absolute', top: 16, right: 16, background: '#f1f5f9', border: 'none', borderRadius: '50%', width: 36, height: 36, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <X size={18} color="#64748b" />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
          <div style={{ width: 38, height: 38, background: BRAND, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: 13 }}>EP</div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#0f172a' }}>ExamPulse</div>
            <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>{authMode === 'login' ? 'Welcome back' : 'Create your account'}</div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: 12, padding: 4, marginBottom: 24 }}>
          {['login', 'register'].map(m => (
            <button key={m} onClick={() => switchMode(m)} style={{
              flex: 1, padding: '9px 0', borderRadius: 9, border: 'none', cursor: 'pointer', fontFamily: 'inherit',
              fontSize: 13, fontWeight: 700,
              background: authMode === m ? '#fff' : 'transparent',
              color: authMode === m ? '#0f172a' : '#64748b',
              boxShadow: authMode === m ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
              transition: 'all .15s',
            }}>
              {m === 'login' ? 'Log in' : 'Register'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          {authMode === 'register' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
              <div>
                <label style={labelStyle}>First name</label>
                <div style={inputWrap}>
                  <User size={15} color="#94a3b8" />
                  <input style={inputStyle} placeholder="John" value={firstName} onChange={e => setFirstName(e.target.value)} required />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Last name</label>
                <div style={inputWrap}>
                  <User size={15} color="#94a3b8" />
                  <input style={inputStyle} placeholder="Doe" value={lastName} onChange={e => setLastName(e.target.value)} />
                </div>
              </div>
            </div>
          )}

          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>Email</label>
            <div style={inputWrap}>
              <Mail size={15} color="#94a3b8" />
              <input style={inputStyle} type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>Password</label>
            <div style={inputWrap}>
              <Lock size={15} color="#94a3b8" />
              <input style={inputStyle} type={showPass ? 'text' : 'password'} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
              <button type="button" onClick={() => setShowPass(!showPass)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}>
                {showPass ? <EyeOff size={15} color="#94a3b8" /> : <Eye size={15} color="#94a3b8" />}
              </button>
            </div>
          </div>

          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: '#dc2626', fontWeight: 600 }}>
              {error}
            </div>
          )}

          <button type="submit" disabled={isLoading} style={{
            width: '100%', background: isLoading ? '#93c5fd' : BRAND, color: '#fff', border: 'none',
            borderRadius: 13, padding: '14px 0', fontSize: 15, fontWeight: 800, cursor: isLoading ? 'not-allowed' : 'pointer',
            fontFamily: 'inherit', transition: 'all .15s',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}>
            {isLoading ? 'Please wait...' : (authMode === 'login' ? 'Log in' : 'Create account')}
          </button>
        </form>

        {/* Divider */}
        {GOOGLE_CLIENT_ID && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '18px 0' }}>
              <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
              <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>yoki</span>
              <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
            </div>
            <div ref={googleBtnRef} style={{ display: 'flex', justifyContent: 'center' }} />
          </>
        )}

        {authMode === 'register' && (
          <p style={{ fontSize: 11, color: '#94a3b8', textAlign: 'center', marginTop: 14, lineHeight: 1.6 }}>
            By registering you get <strong style={{ color: BRAND }}>2 free tests</strong>. No credit card required.
          </p>
        )}
      </div>
    </div>
  );
}

const labelStyle = { fontSize: 12, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 6 };
const inputWrap  = { display: 'flex', alignItems: 'center', gap: 10, background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: 11, padding: '10px 14px' };
const inputStyle = { flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: 14, color: '#0f172a', fontFamily: 'inherit' };
