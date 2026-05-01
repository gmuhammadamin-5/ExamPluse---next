"use client";
import { Check, Zap } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

const plans = [
  {
    name: 'Free', price: { m: 0, y: 0 }, color: '#64748b',
    features: ['2 free tests', 'Basic AI feedback', 'Leaderboard', 'Community chat'],
    cta: 'Get Started', ctaAction: 'tests',
  },
  {
    name: 'Premium', price: { m: 12, y: 8 }, color: '#007bff', popular: true,
    features: ['Unlimited tests', 'Full AI scoring', 'Speaking simulation', 'Writing evaluation', 'Study plan', 'Analytics', 'Priority support'],
    cta: 'Start Free Trial', ctaAction: 'register',
  },
  {
    name: 'Pro', price: { m: 24, y: 16 }, color: '#7c3aed',
    features: ['Everything in Premium', '1-on-1 AI Tutor', 'Band score prediction', 'Mock certificates', 'Offline access'],
    cta: 'Go Pro', ctaAction: 'register',
  },
];

export default function PricingPage() {
  const [yearly, setYearly] = useState(false);
  const router = useRouter();
  const { isAuthenticated, openAuthModal } = useAuth();

  const handleCta = (action) => {
    if (action === 'tests') { router.push('/tests'); return; }
    if (isAuthenticated) { router.push('/tests'); }
    else { openAuthModal('register'); }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#f0f8ff 0%,#e6f7ff 50%,#d6f0ff 100%)', padding: '100px 20px 60px', textAlign: 'center', fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif" }}>
      <style>{`
        .pricing-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:24px; }
        @media(max-width:900px){ .pricing-grid{ grid-template-columns:1fr; max-width:420px; margin:0 auto; } }
        @media(max-width:480px){ .pricing-toggle{ flex-direction:column; gap:8px; } }
      `}</style>

      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#eff6ff', border: '1px solid rgba(0,123,255,0.2)', borderRadius: 30, padding: '4px 14px', marginBottom: 14 }}>
          <Zap size={11} color="#007bff" fill="#007bff" />
          <span style={{ fontSize: 11, fontWeight: 800, color: '#007bff', letterSpacing: '1.5px' }}>PRICING</span>
        </div>
        <h1 style={{ fontSize: 'clamp(1.8rem,5vw,2.5rem)', fontWeight: 900, color: '#0f172a', margin: '0 0 8px', letterSpacing: '-1.5px' }}>Simple, Transparent Pricing</h1>
        <p style={{ color: '#64748b', fontSize: 15, marginBottom: 32 }}>Start free. Upgrade when ready. Cancel anytime.</p>

        <div className="pricing-toggle" style={{ display: 'inline-flex', alignItems: 'center', gap: 12, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 100, padding: '6px 16px', marginBottom: 48 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: yearly ? '#94a3b8' : '#0f172a' }}>Monthly</span>
          <div onClick={() => setYearly(!yearly)} style={{ width: 44, height: 24, background: yearly ? '#007bff' : '#e2e8f0', borderRadius: 100, cursor: 'pointer', position: 'relative', transition: 'background 0.2s' }}>
            <div style={{ width: 18, height: 18, background: '#fff', borderRadius: '50%', position: 'absolute', top: 3, left: yearly ? 23 : 3, transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }} />
          </div>
          <span style={{ fontSize: 13, fontWeight: 600, color: yearly ? '#0f172a' : '#94a3b8' }}>
            Yearly <span style={{ color: '#059669', fontSize: 11, fontWeight: 800 }}>-33%</span>
          </span>
        </div>

        <div className="pricing-grid">
          {plans.map(p => (
            <div key={p.name} style={{ background: '#fff', borderRadius: 20, padding: '32px 28px', border: p.popular ? `2px solid ${p.color}` : '1px solid #e2e8f0', boxShadow: p.popular ? `0 8px 32px ${p.color}22` : 'none', position: 'relative', textAlign: 'left' }}>
              {p.popular && (
                <div style={{ position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)', background: p.color, color: '#fff', fontSize: 11, fontWeight: 800, padding: '4px 16px', borderRadius: 100, whiteSpace: 'nowrap' }}>
                  MOST POPULAR
                </div>
              )}
              <h2 style={{ margin: '0 0 4px', fontSize: 18, fontWeight: 900, color: '#0f172a' }}>{p.name}</h2>
              <div style={{ fontSize: 40, fontWeight: 900, color: p.color, lineHeight: 1, marginBottom: 20 }}>
                {p.price.m === 0 ? 'Free' : `$${yearly ? p.price.y : p.price.m}`}
                {p.price.m > 0 && <span style={{ fontSize: 14, color: '#94a3b8', fontWeight: 600 }}>/mo</span>}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
                {p.features.map(f => (
                  <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#475569' }}>
                    <Check size={15} color={p.color} style={{ flexShrink: 0 }} />{f}
                  </div>
                ))}
              </div>
              <button onClick={() => handleCta(p.ctaAction)}
                style={{ width: '100%', padding: '13px', borderRadius: 12, border: p.popular ? 'none' : `2px solid ${p.color}`, background: p.popular ? p.color : 'transparent', color: p.popular ? '#fff' : p.color, fontSize: 14, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit', transition: 'all .15s' }}>
                {p.cta}
              </button>
            </div>
          ))}
        </div>

        <p style={{ marginTop: 32, fontSize: 13, color: '#94a3b8' }}>
          No credit card required for Free plan · Secure payment via Stripe
        </p>
      </div>
    </div>
  );
}
