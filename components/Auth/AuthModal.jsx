"use client";
import { useState } from 'react';
import { X, Mail, Lock, User, Eye, EyeOff, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const BRAND = '#007bff';

export default function AuthModal() {
  const { isAuthModalOpen, authMode, setAuthMode, closeAuthModal, login, register, isLoading } = useAuth();

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName]   = useState('');
  const [showPass, setShowPass]   = useState(false);
  const [error, setError]         = useState('');

  if (!isAuthModalOpen) return null;

  const reset = () => {
    setEmail(''); setPassword(''); setFirstName(''); setLastName('');
    setError(''); setShowPass(false);
  };

  const handleClose = () => { reset(); closeAuthModal(); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (authMode === 'login') {
        await login(email, password);
      } else {
        await register(email, password, { firstName, lastName });
      }
      reset();
    } catch (err) {
      setError(err.message || 'Something went wrong');
    }
  };

  const switchMode = (mode) => { reset(); setAuthMode(mode); };

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)', padding: '16px' }}
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div style={{ background: '#fff', borderRadius: 24, padding: '40px 36px', width: '100%', maxWidth: 420, position: 'relative', boxShadow: '0 24px 80px rgba(0,0,0,0.18)' }}>

        {/* Close */}
        <button onClick={handleClose} style={{ position: 'absolute', top: 16, right: 16, background: '#f1f5f9', border: 'none', borderRadius: '50%', width: 36, height: 36, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <X size={18} color="#64748b" />
        </button>

        {/* Logo */}
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
          {/* Name fields — register only */}
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

          {/* Email */}
          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>Email</label>
            <div style={inputWrap}>
              <Mail size={15} color="#94a3b8" />
              <input style={inputStyle} type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
          </div>

          {/* Password */}
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

          {/* Error */}
          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: '#dc2626', fontWeight: 600 }}>
              {error}
            </div>
          )}

          {/* Submit */}
          <button type="submit" disabled={isLoading} style={{
            width: '100%', background: isLoading ? '#93c5fd' : BRAND, color: '#fff', border: 'none',
            borderRadius: 13, padding: '14px 0', fontSize: 15, fontWeight: 800, cursor: isLoading ? 'not-allowed' : 'pointer',
            fontFamily: 'inherit', transition: 'all .15s',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}>
            {isLoading ? 'Please wait...' : (authMode === 'login' ? 'Log in' : 'Create account')}
          </button>
        </form>

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
