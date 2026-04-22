"use client";
import { useState, useEffect, useRef } from 'react';
import {
  Zap, BarChart2, Trophy, Brain, Clock, Shield, Globe, Star
} from 'lucide-react';

const FEATURES = [
  {
    Icon: Zap,       color: '#2563eb', bg: '#eff6ff',
    title: 'AI-Powered Scoring',
    desc: 'Every answer is analyzed in real time by AI — giving you an accurate band score instantly.',
  },
  {
    Icon: BarChart2, color: '#7c3aed', bg: '#f5f3ff',
    title: 'Detailed Analytics',
    desc: 'See exactly where you went wrong in each section and what to work on next.',
  },
  {
    Icon: Clock,     color: '#0891b2', bg: '#ecfeff',
    title: 'Real Exam Mode',
    desc: 'Authentic exam conditions: timer, section sequence, and full mock test format.',
  },
  {
    Icon: Brain,     color: '#059669', bg: '#ecfdf5',
    title: 'AI Tutor',
    desc: 'Your personal AI coach for writing and speaking — available anytime, anywhere.',
  },
  {
    Icon: Trophy,    color: '#f59e0b', bg: '#fffbeb',
    title: 'Leaderboard',
    desc: 'Compare your progress with other students and stay motivated to reach the top.',
  },
  {
    Icon: Globe,     color: '#ea580c', bg: '#fff7ed',
    title: '5 Exams Covered',
    desc: 'IELTS, Cambridge, TOEFL, CEFR and SAT — all in one platform.',
  },
  {
    Icon: Shield,    color: '#2563eb', bg: '#eff6ff',
    title: 'Free to Start',
    desc: 'Access many tests without signing up. Upgrade to PRO for unlimited features.',
  },
  {
    Icon: Star,      color: '#7c3aed', bg: '#f5f3ff',
    title: '98.7% Success Rate',
    desc: '98.7% of students who used our platform achieved their target band score.',
  },
];

function FeatureCard({ Icon, color, bg, title, desc, delay }) {
  const [visible, setVisible] = useState(false);
  const [hov, setHov] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.15 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: '#fff',
        border: `1.5px solid ${hov ? color + '44' : '#f1f5f9'}`,
        borderRadius: 20,
        padding: '28px 24px',
        cursor: 'default',
        transition: 'all .3s cubic-bezier(.4,0,.2,1)',
        transform: visible ? (hov ? 'translateY(-6px)' : 'none') : 'translateY(24px)',
        opacity: visible ? 1 : 0,
        transitionDelay: visible ? `${delay}ms` : '0ms',
        boxShadow: hov ? `0 16px 40px ${color}22` : '0 2px 8px rgba(0,0,0,0.05)',
      }}>
      <div style={{ width: 48, height: 48, borderRadius: 14, background: bg, border: `1px solid ${color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
        <Icon size={22} color={color} />
      </div>
      <div style={{ fontSize: 15, fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>{title}</div>
      <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.65 }}>{desc}</div>
    </div>
  );
}

export default function Features() {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} style={{
      padding: '100px 20px',
      background: 'linear-gradient(135deg, #f0f8ff 0%, #e6f7ff 50%, #d6f0ff 100%)',
      fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif",
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        {/* header */}
        <div style={{
          textAlign: 'center', marginBottom: 60,
          transform: visible ? 'none' : 'translateY(20px)',
          opacity: visible ? 1 : 0,
          transition: 'all .6s cubic-bezier(.4,0,.2,1)',
        }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#eff6ff', border: '1px solid rgba(37,99,235,0.2)', borderRadius: 30, padding: '4px 14px', marginBottom: 14 }}>
            <Star size={11} color="#2563eb" />
            <span style={{ fontSize: 11, fontWeight: 800, color: '#2563eb', letterSpacing: '1.5px' }}>FEATURES</span>
          </div>
          <h2 style={{ fontSize: 36, fontWeight: 900, color: '#0f172a', marginBottom: 12, letterSpacing: '-0.5px' }}>
            Why ExamPulse?
          </h2>
          <p style={{ fontSize: 15, color: '#64748b', maxWidth: 520, margin: '0 auto', lineHeight: 1.7 }}>
            The most advanced AI-powered exam preparation platform — simulating the real exam experience.
          </p>
        </div>

        {/* grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
          {FEATURES.map((f, i) => (
            <FeatureCard key={f.title} {...f} delay={i * 60} />
          ))}
        </div>

        {/* bottom stats */}
        <div style={{
          marginTop: 56,
          background: 'linear-gradient(135deg,#2563eb,#7c3aed)',
          borderRadius: 24,
          padding: '36px 40px',
          display: 'grid',
          gridTemplateColumns: 'repeat(4,1fr)',
          gap: 24,
          opacity: visible ? 1 : 0,
          transform: visible ? 'none' : 'translateY(20px)',
          transition: 'all .7s .3s cubic-bezier(.4,0,.2,1)',
        }}>
          {[
            { val: '56+',    label: 'Mock Tests'        },
            { val: '18K+',   label: 'Active Students'   },
            { val: '98.7%',  label: 'Success Rate'      },
            { val: '5',      label: 'International Exams' },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 32, fontWeight: 900, color: '#fff', marginBottom: 4 }}>{s.val}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', fontWeight: 600 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media(max-width:1024px){ .feat-grid{grid-template-columns:repeat(3,1fr)!important} }
        @media(max-width:700px) { .feat-grid{grid-template-columns:repeat(2,1fr)!important} }
        @media(max-width:440px) { .feat-grid{grid-template-columns:1fr!important} }
      `}</style>
    </section>
  );
}
