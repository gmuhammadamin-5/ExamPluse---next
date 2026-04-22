"use client";
import React, { useState } from 'react';
import { Lock, Eye, EyeOff, ShieldCheck, AlertCircle } from 'lucide-react';

const ADMIN_PASSWORD = 'admin123';

export default function AdminLogin({ onLogin }) {
  const [password, setPassword] = useState('');
  const [show, setShow]         = useState(false);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [focused, setFocused]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password) { setError("Parol kiriting"); return; }
    setLoading(true);
    setError('');
    await new Promise(r => setTimeout(r, 600));
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem('ep_admin', '1');
      onLogin();
    } else {
      setError("Noto'g'ri parol. Qaytadan urinib ko'ring.");
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg,#0f172a 0%,#1e293b 60%,#0f172a 100%)',
      fontFamily: "'Inter', system-ui, sans-serif",
      padding: 20,
    }}>
      {/* bg blobs */}
      <div style={{ position:'fixed',top:-150,left:-150,width:500,height:500,borderRadius:'50%',background:'radial-gradient(circle,rgba(37,99,235,0.18) 0%,transparent 70%)',pointerEvents:'none' }}/>
      <div style={{ position:'fixed',bottom:-100,right:-100,width:400,height:400,borderRadius:'50%',background:'radial-gradient(circle,rgba(124,58,237,0.14) 0%,transparent 70%)',pointerEvents:'none' }}/>

      <div style={{
        background: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1.5px solid rgba(255,255,255,0.10)',
        borderRadius: 24, padding: '44px 40px',
        width: '100%', maxWidth: 400,
        boxShadow: '0 32px 80px rgba(0,0,0,0.4)',
        position: 'relative',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 60, height: 60, borderRadius: 18,
            background: 'linear-gradient(135deg,#2563eb,#7c3aed)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: '0 8px 24px rgba(37,99,235,0.4)',
            fontSize: 22, fontWeight: 900, color: '#fff',
          }}>EP</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 4 }}>Admin Panel</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>ExamPulse boshqaruv tizimi</div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* password field */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.6)', marginBottom: 6 }}>Parol</div>
            <div style={{ position: 'relative' }}>
              <Lock size={14} color={focused ? '#60a5fa' : 'rgba(255,255,255,0.3)'} style={{ position:'absolute',left:14,top:'50%',transform:'translateY(-50%)',transition:'color .2s' }}/>
              <input
                type={show ? 'text' : 'password'}
                value={password}
                onChange={e => { setPassword(e.target.value); setError(''); }}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder="Parolni kiriting..."
                style={{
                  width: '100%', padding: '12px 44px 12px 40px',
                  background: 'rgba(255,255,255,0.08)',
                  border: `1.5px solid ${error ? '#ef4444' : focused ? '#3b82f6' : 'rgba(255,255,255,0.12)'}`,
                  borderRadius: 13, fontSize: 14, color: '#fff',
                  outline: 'none', boxSizing: 'border-box',
                  transition: 'all .2s',
                  boxShadow: focused ? '0 0 0 3px rgba(59,130,246,0.2)' : 'none',
                }}
              />
              <button
                type="button"
                onClick={() => setShow(s => !s)}
                style={{ position:'absolute',right:12,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',padding:4,display:'flex',alignItems:'center' }}
              >
                {show ? <EyeOff size={15} color="rgba(255,255,255,0.4)"/> : <Eye size={15} color="rgba(255,255,255,0.4)"/>}
              </button>
            </div>
            {error && (
              <div style={{ display:'flex',alignItems:'center',gap:6,marginTop:8,color:'#f87171',fontSize:12,fontWeight:600 }}>
                <AlertCircle size={13}/>{error}
              </div>
            )}
          </div>

          {/* submit */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '13px',
              background: loading ? 'rgba(37,99,235,0.5)' : 'linear-gradient(135deg,#2563eb,#1d4ed8)',
              border: 'none', borderRadius: 13,
              fontSize: 14, fontWeight: 800, color: '#fff',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit',
              boxShadow: '0 6px 20px rgba(37,99,235,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              transition: 'all .2s',
            }}
          >
            {loading
              ? <><div style={{ width:16,height:16,border:'2px solid rgba(255,255,255,0.3)',borderTopColor:'#fff',borderRadius:'50%',animation:'spin .8s linear infinite' }}/>Tekshirilmoqda...</>
              : <><ShieldCheck size={16}/>Kirish</>
            }
          </button>
        </form>

        <div style={{ marginTop: 20, padding: '12px 16px', background: 'rgba(37,99,235,0.12)', border: '1px solid rgba(37,99,235,0.2)', borderRadius: 12 }}>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>Demo parol:</div>
          <div style={{ fontSize: 13, color: '#93c5fd', fontWeight: 700, marginTop: 2 }}>admin123</div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        * { box-sizing: border-box; }
      `}</style>
    </div>
  );
}
