"use client";
import React, { useState, useEffect } from 'react';
import {
  Headphones, BookOpen, PenTool, Mic, Clock,
  Play, Lock, Star, Users, Trophy,
  BarChart2, Target, Search, GraduationCap,
  Globe, BookMarked, Layers, Calculator, Sparkles,
  ChevronRight, CheckCircle2, TrendingUp, Zap, Crown, X
} from 'lucide-react';
import dynamic from 'next/dynamic';
import { useAuth } from '@/contexts/AuthContext';
const ExamEngine = dynamic(() => import('./engines/ExamEngine'), { ssr: false });

const BRAND = '#007bff';
const FREE_LIMIT = 2;

const EXAMS = [
  { id:'IELTS',     label:'IELTS',      sub:'Academic & General',  icon:GraduationCap, tests:12, users:'18K+' },
  { id:'CAMBRIDGE', label:'Cambridge',  sub:'C1 · C2 · B2 First',  icon:BookMarked,    tests:8,  users:'9K+'  },
  { id:'TOEFL',     label:'TOEFL iBT',  sub:'Internet-Based Test',  icon:Globe,         tests:6,  users:'7K+'  },
  { id:'CEFR',      label:'CEFR',       sub:'A1 → C2 All Levels',   icon:Layers,        tests:12, users:'22K+' },
  { id:'SAT',       label:'SAT',        sub:'College Board · USA',  icon:Calculator,    tests:10, users:'11K+' },
];

const TESTS = {
  IELTS: [
    { id:'i1', title:'Academic Mock Test 1',  type:'mock',     level:'Band 6.5+', q:160, time:'165 min', diff:3, done:8420, rating:4.8, new:false, sections:['Listening','Reading','Writing','Speaking'] },
    { id:'i2', title:'Academic Mock Test 2',  type:'mock',     level:'Band 7+',   q:160, time:'165 min', diff:4, done:6231, rating:4.9, new:false, sections:['Listening','Reading','Writing','Speaking'] },
    { id:'i3', title:'Academic Mock Test 3',  type:'mock',     level:'Band 7.5+', q:160, time:'165 min', diff:4, done:4102, rating:4.7, new:true,  sections:['Listening','Reading','Writing','Speaking'] },
    { id:'i4', title:'General Training 1',    type:'mock',     level:'Band 6+',   q:160, time:'165 min', diff:3, done:3890, rating:4.6, new:false, sections:['Listening','Reading','Writing','Speaking'] },
    { id:'i5', title:'General Training 2',    type:'mock',     level:'Band 7+',   q:160, time:'165 min', diff:4, done:2740, rating:4.8, new:true,  sections:['Listening','Reading','Writing','Speaking'] },
    { id:'i6', title:'Listening Only',        type:'practice', level:'All',       q:40,  time:'30 min',  diff:2, done:12300,rating:4.9, new:false, sections:['Listening'] },
    { id:'i7', title:'Reading Only',          type:'practice', level:'Band 6+',   q:40,  time:'60 min',  diff:3, done:9870, rating:4.7, new:false, sections:['Reading'] },
    { id:'i8', title:'Writing Task 1',        type:'practice', level:'Band 6.5+', q:2,   time:'20 min',  diff:3, done:5600, rating:4.8, new:false, sections:['Writing'] },
    { id:'i9', title:'Writing Task 2',        type:'practice', level:'Band 7+',   q:2,   time:'40 min',  diff:4, done:4900, rating:4.9, new:false, sections:['Writing'] },
    { id:'ia', title:'Speaking Simulation',   type:'practice', level:'Band 7+',   q:15,  time:'15 min',  diff:4, done:3100, rating:4.8, new:true,  sections:['Speaking'] },
    { id:'ib', title:'Vocabulary Builder',    type:'skill',    level:'All',       q:60,  time:'45 min',  diff:2, done:15200,rating:4.6, new:false, sections:['Vocabulary'] },
    { id:'ic', title:'Grammar Mastery',       type:'skill',    level:'All',       q:80,  time:'60 min',  diff:3, done:11000,rating:4.7, new:false, sections:['Grammar'] },
  ],
  CAMBRIDGE: [
    { id:'c1', title:'C2 Proficiency Full',   type:'mock',     level:'C2',   q:140, time:'180 min', diff:5, done:2100, rating:4.9, new:false, sections:['Reading','Writing','Listening','Speaking'] },
    { id:'c2', title:'C1 Advanced Full',      type:'mock',     level:'C1',   q:140, time:'190 min', diff:4, done:3400, rating:4.8, new:false, sections:['Reading','Writing','Listening','Speaking'] },
    { id:'c3', title:'B2 First Full',         type:'mock',     level:'B2',   q:130, time:'175 min', diff:3, done:5600, rating:4.7, new:false, sections:['Reading','Writing','Listening','Speaking'] },
    { id:'c4', title:'B2 Reading & Use',      type:'practice', level:'B2',   q:52,  time:'75 min',  diff:3, done:4200, rating:4.8, new:false, sections:['Reading'] },
    { id:'c5', title:'C1 Listening',          type:'practice', level:'C1',   q:30,  time:'40 min',  diff:4, done:2800, rating:4.7, new:true,  sections:['Listening'] },
    { id:'c6', title:'C2 Writing',            type:'practice', level:'C2',   q:2,   time:'90 min',  diff:5, done:1900, rating:4.9, new:false, sections:['Writing'] },
    { id:'c7', title:'C1 Speaking',           type:'practice', level:'C1',   q:10,  time:'15 min',  diff:4, done:2300, rating:4.8, new:true,  sections:['Speaking'] },
    { id:'c8', title:'B2 Grammar & Vocab',    type:'skill',    level:'B2',   q:60,  time:'40 min',  diff:3, done:6700, rating:4.6, new:false, sections:['Grammar','Vocabulary'] },
  ],
  TOEFL: [
    { id:'t1', title:'iBT Full Mock 1',       type:'mock',     level:'90+',  q:144, time:'185 min', diff:3, done:4800, rating:4.8, new:false, sections:['Reading','Listening','Speaking','Writing'] },
    { id:'t2', title:'iBT Full Mock 2',        type:'mock',     level:'100+', q:144, time:'185 min', diff:4, done:3200, rating:4.9, new:false, sections:['Reading','Listening','Speaking','Writing'] },
    { id:'t3', title:'iBT Full Mock 3',        type:'mock',     level:'110+', q:144, time:'185 min', diff:5, done:1900, rating:4.7, new:true,  sections:['Reading','Listening','Speaking','Writing'] },
    { id:'t4', title:'Reading Practice',       type:'practice', level:'90+',  q:36,  time:'54 min',  diff:3, done:6100, rating:4.7, new:false, sections:['Reading'] },
    { id:'t5', title:'Listening Practice',     type:'practice', level:'90+',  q:28,  time:'41 min',  diff:3, done:5400, rating:4.8, new:false, sections:['Listening'] },
    { id:'t6', title:'Speaking Tasks 1–4',     type:'practice', level:'24+',  q:4,   time:'17 min',  diff:4, done:3300, rating:4.9, new:false, sections:['Speaking'] },
  ],
  CEFR: [
    { id:'f1', title:'A1 Starter',            type:'mock', level:'A1',    q:60,  time:'60 min',  diff:1, done:9800, rating:4.6,  new:false, sections:['Grammar','Vocabulary','Reading','Listening'] },
    { id:'f2', title:'A2 Elementary',         type:'mock', level:'A2',    q:70,  time:'70 min',  diff:1, done:8900, rating:4.7,  new:false, sections:['Grammar','Vocabulary','Reading','Listening'] },
    { id:'f3', title:'B1 Intermediate',       type:'mock', level:'B1',    q:80,  time:'90 min',  diff:2, done:12400,rating:4.8,  new:false, sections:['Grammar','Vocabulary','Reading','Listening'] },
    { id:'f4', title:'B2 Upper-Int',          type:'mock', level:'B2',    q:90,  time:'100 min', diff:3, done:7600, rating:4.8,  new:false, sections:['Grammar','Vocabulary','Reading','Listening'] },
    { id:'f5', title:'C1 Advanced',           type:'mock', level:'C1',    q:100, time:'110 min', diff:4, done:4300, rating:4.9,  new:true,  sections:['Grammar','Vocabulary','Reading','Listening'] },
    { id:'f6', title:'C2 Mastery',            type:'mock', level:'C2',    q:110, time:'120 min', diff:5, done:2100, rating:4.9,  new:false, sections:['Grammar','Vocabulary','Reading','Listening'] },
    { id:'f7', title:'A1–A2 Grammar',         type:'practice', level:'A1–A2', q:50, time:'40 min', diff:1, done:14200,rating:4.5, new:false, sections:['Grammar'] },
    { id:'f8', title:'B1–B2 Vocabulary',      type:'practice', level:'B1–B2', q:60, time:'45 min', diff:2, done:11300,rating:4.7, new:false, sections:['Vocabulary'] },
    { id:'f9', title:'C1–C2 Reading',         type:'practice', level:'C1–C2', q:40, time:'50 min', diff:4, done:3900, rating:4.8, new:true,  sections:['Reading'] },
    { id:'fa', title:'Level Placement',       type:'skill', level:'A1→C2', q:80,  time:'60 min',  diff:3, done:28000,rating:4.9, new:false, sections:['Grammar','Vocabulary','Reading','Listening'] },
    { id:'fb', title:'B1 Listening',          type:'practice', level:'B1', q:30,  time:'35 min',  diff:2, done:8400, rating:4.6, new:false, sections:['Listening'] },
    { id:'fc', title:'B2 Writing',            type:'practice', level:'B2', q:3,   time:'60 min',  diff:3, done:4100, rating:4.7, new:false, sections:['Writing'] },
  ],
  SAT: [
    { id:'s1', title:'Full Practice Test 1',  type:'mock', level:'1200+', q:98, time:'134 min', diff:3, done:7400, rating:4.8, new:false, sections:['Math','Reading & Writing'] },
    { id:'s2', title:'Full Practice Test 2',  type:'mock', level:'1350+', q:98, time:'134 min', diff:4, done:5100, rating:4.9, new:false, sections:['Math','Reading & Writing'] },
    { id:'s3', title:'Full Practice Test 3',  type:'mock', level:'1450+', q:98, time:'134 min', diff:4, done:3600, rating:4.7, new:true,  sections:['Math','Reading & Writing'] },
    { id:'s4', title:'Full Practice Test 4',  type:'mock', level:'1500+', q:98, time:'134 min', diff:5, done:2200, rating:4.8, new:false, sections:['Math','Reading & Writing'] },
    { id:'s5', title:'Math — Algebra',         type:'practice', level:'600–800', q:44, time:'55 min', diff:3, done:9800, rating:4.7, new:false, sections:['Math'] },
    { id:'s6', title:'Math — Problem Solving', type:'practice', level:'600–800', q:30, time:'40 min', diff:3, done:8200, rating:4.8, new:false, sections:['Math'] },
    { id:'s7', title:'Math — Advanced',        type:'practice', level:'700–800', q:24, time:'30 min', diff:4, done:4900, rating:4.9, new:false, sections:['Math'] },
    { id:'s8', title:'Reading & Writing',      type:'practice', level:'600–800', q:54, time:'64 min', diff:3, done:7100, rating:4.7, new:false, sections:['Reading & Writing'] },
    { id:'s9', title:'Expression of Ideas',    type:'practice', level:'600–800', q:27, time:'32 min', diff:3, done:5600, rating:4.6, new:true,  sections:['Reading & Writing'] },
    { id:'sa', title:'SAT Essay Guide',        type:'skill',    level:'All',     q:3,  time:'50 min', diff:3, done:12300,rating:4.8, new:false, sections:['Essay'] },
  ],
};

const FILTERS = [
  { id:'all',      label:'All Tests' },
  { id:'mock',     label:'Full Mock' },
  { id:'practice', label:'Practice'  },
  { id:'skill',    label:'Skills'    },
];

const DIFF_LABEL = ['','Beginner','Elementary','Intermediate','Advanced','Expert'];
const DIFF_COLOR = ['','#16a34a','#2563eb','#d97706','#dc2626','#7c3aed'];
const SEC_ICON = { Listening:Headphones, Reading:BookOpen, Writing:PenTool, Speaking:Mic, Math:Calculator, Grammar:BookOpen, Vocabulary:Star, 'Reading & Writing':BookOpen, Essay:PenTool };

// helpers
const getTestsUsed = (userId) => {
  if (typeof window === 'undefined' || !userId) return 0;
  return parseInt(localStorage.getItem(`ep_used_${userId}`) || '0', 10);
};
const incTestsUsed = (userId) => {
  if (typeof window === 'undefined' || !userId) return;
  localStorage.setItem(`ep_used_${userId}`, getTestsUsed(userId) + 1);
};

// ─── Upgrade Modal ────────────────────────────────────────────────────────────
function UpgradeModal({ onClose, reason }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)',
      zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        background: '#fff', borderRadius: 20, padding: '40px 36px', maxWidth: 440, width: '90%',
        boxShadow: '0 20px 60px rgba(0,0,0,0.18)', textAlign: 'center', position: 'relative',
      }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', cursor: 'pointer' }}>
          <X size={20} color="#94a3b8" />
        </button>
        <div style={{ width: 60, height: 60, borderRadius: 18, background: 'linear-gradient(135deg,#f59e0b,#f97316)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <Crown size={28} color="#fff" />
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', margin: '0 0 10px' }}>Upgrade to Pro</h2>
        <p style={{ fontSize: 14, color: '#64748b', margin: '0 0 24px', lineHeight: 1.6 }}>
          {reason || 'You have used your 2 free tests.'} Unlock unlimited tests, AI tutoring, and detailed analytics.
        </p>
        <div style={{ background: '#f8faff', borderRadius: 14, padding: '16px 20px', marginBottom: 24, textAlign: 'left' }}>
          {['Unlimited tests across all exam types', 'AI Tutor — personalized coaching', 'AI Writing & Speaking evaluation', 'Progress analytics & leaderboard'].map((f, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: i < 3 ? 10 : 0 }}>
              <CheckCircle2 size={15} color={BRAND} />
              <span style={{ fontSize: 13, color: '#334155', fontWeight: 600 }}>{f}</span>
            </div>
          ))}
        </div>
        <a href="/pricing" style={{
          display: 'block', background: BRAND, color: '#fff', borderRadius: 12,
          padding: '14px 0', fontSize: 15, fontWeight: 800, textDecoration: 'none',
          marginBottom: 10,
        }}>View Plans</a>
        <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 13, color: '#94a3b8', cursor: 'pointer', fontFamily: 'inherit' }}>
          Maybe later
        </button>
      </div>
    </div>
  );
}

// ─── Row Component ────────────────────────────────────────────────────────────
function TestRow({ t, onStart, freeUsed, isAuth, isPro }) {
  const [hov, setHov] = useState(false);
  const isLocked = isAuth && !isPro && freeUsed >= FREE_LIMIT;
  const isProTest = isLocked;

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 110px 90px 90px 90px 110px',
        alignItems: 'center',
        gap: 12,
        padding: '14px 20px',
        borderBottom: '1px solid #f1f5f9',
        background: hov ? '#f8faff' : '#fff',
        transition: 'background .15s',
        cursor: 'pointer',
        opacity: isProTest ? 0.85 : 1,
      }}
      onClick={() => onStart(t)}
    >
      {/* Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ display: 'flex', gap: 4 }}>
          {t.sections.slice(0, 4).map(s => {
            const Icon = SEC_ICON[s] || BookOpen;
            return <Icon key={s} size={13} color="#94a3b8" />;
          })}
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>{t.title}</span>
            {t.new && <span style={{ fontSize: 9, fontWeight: 800, color: '#fff', background: '#f59e0b', padding: '1px 6px', borderRadius: 10 }}>NEW</span>}
            {isProTest && <Crown size={11} color="#f59e0b" />}
          </div>
          <div style={{ display: 'flex', gap: 6, marginTop: 3 }}>
            {t.sections.map(s => (
              <span key={s} style={{ fontSize: 10, color: '#64748b', background: '#f1f5f9', padding: '1px 7px', borderRadius: 6, fontWeight: 600 }}>{s}</span>
            ))}
          </div>
        </div>
      </div>

      <span style={{ fontSize: 12, fontWeight: 700, color: BRAND, background: '#eff6ff', padding: '4px 10px', borderRadius: 8, textAlign: 'center', whiteSpace: 'nowrap' }}>{t.level}</span>
      <span style={{ fontSize: 11, fontWeight: 700, color: DIFF_COLOR[t.diff], textAlign: 'center' }}>{DIFF_LABEL[t.diff]}</span>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#334155' }}>{t.q}</div>
        <div style={{ fontSize: 10, color: '#94a3b8' }}>questions</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#334155' }}>{t.time}</div>
        <div style={{ fontSize: 10, color: '#94a3b8' }}>duration</div>
      </div>

      <div style={{ textAlign: 'right' }}>
        <button style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          background: isProTest ? '#f8faff' : (hov ? BRAND : '#eff6ff'),
          color: isProTest ? '#f59e0b' : (hov ? '#fff' : BRAND),
          border: isProTest ? '1.5px solid #fde68a' : `1.5px solid ${hov ? BRAND : '#bfdbfe'}`,
          borderRadius: 10, padding: '8px 16px',
          fontSize: 12, fontWeight: 700, cursor: 'pointer',
          transition: 'all .15s',
        }}>
          {isProTest ? <><Crown size={11} fill="currentColor" /> Pro</> : <><Play size={11} fill="currentColor" color="currentColor" /> Start</>}
        </button>
      </div>
    </div>
  );
}

// ─── Mobile Test Card ─────────────────────────────────────────────────────────
function TestCard({ t, onStart, freeUsed, isAuth, isPro }) {
  const isLocked = isAuth && !isPro && freeUsed >= FREE_LIMIT;
  return (
    <div
      onClick={() => onStart(t)}
      style={{ background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: 14, padding: '16px', marginBottom: 10, cursor: 'pointer' }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>{t.title}</span>
            {t.new && <span style={{ fontSize: 9, fontWeight: 800, color: '#fff', background: '#f59e0b', padding: '1px 6px', borderRadius: 10 }}>NEW</span>}
            {isLocked && <Crown size={11} color="#f59e0b" />}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 8 }}>
            {t.sections.map(s => (
              <span key={s} style={{ fontSize: 10, color: '#64748b', background: '#f1f5f9', padding: '2px 8px', borderRadius: 6, fontWeight: 600 }}>{s}</span>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: BRAND, background: '#eff6ff', padding: '3px 8px', borderRadius: 6 }}>{t.level}</span>
            <span style={{ fontSize: 11, color: '#64748b' }}>{t.q} Q · {t.time}</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: DIFF_COLOR[t.diff] }}>{DIFF_LABEL[t.diff]}</span>
          </div>
        </div>
        <button style={{
          flexShrink: 0, display: 'flex', alignItems: 'center', gap: 4,
          background: isLocked ? '#fef3c7' : BRAND, color: isLocked ? '#f59e0b' : '#fff',
          border: 'none', borderRadius: 10, padding: '8px 14px',
          fontSize: 12, fontWeight: 700, cursor: 'pointer',
        }}>
          {isLocked ? <><Crown size={11} /> Pro</> : <><Play size={11} fill="#fff" /> Start</>}
        </button>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function ExamHub() {
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const [active, setActive]       = useState('IELTS');
  const [filter, setFilter]       = useState('all');
  const [search, setSearch]       = useState('');
  const [started, setStarted]     = useState(null);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [isMobile, setIsMobile]   = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const isPro = user?.plan === 'pro' || user?.is_premium || false;
  const freeUsed = user ? getTestsUsed(user.id || user.email) : 0;
  const userId = user?.id || user?.email;

  const handleStart = (t) => {
    if (!isAuthenticated) {
      openAuthModal('register');
      return;
    }
    if (!isPro && freeUsed >= FREE_LIMIT) {
      setShowUpgrade(true);
      return;
    }
    if (!isPro) {
      incTestsUsed(userId);
    }
    setStarted(t);
  };

  const exam = EXAMS.find(x => x.id === active);
  const all  = TESTS[active] || [];
  const list = all.filter(t =>
    (filter === 'all' || t.type === filter) &&
    t.title.toLowerCase().includes(search.toLowerCase())
  );

  if (started) return (
    <ExamEngine examType={active} testId={started.id} onExit={() => setStarted(null)} />
  );

  return (
    <div style={{ minHeight: '100vh', background: '#f8faff', fontFamily: "'Inter', system-ui, sans-serif" }}>
      <style>{`
        * { box-sizing: border-box; }
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-thumb { background: #dbeafe; border-radius: 4px; }
      `}</style>

      {showUpgrade && <UpgradeModal onClose={() => setShowUpgrade(false)} />}

      {/* Top header bar */}
      <div style={{ background: BRAND, padding: '0 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 52 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Sparkles size={16} color="rgba(255,255,255,0.9)" />
          <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: 13, fontWeight: 700 }}>ExamPulse Test Center</span>
        </div>
        <div style={{ display: 'flex', gap: 24 }}>
          {[{ I: Trophy, v: '56 Tests' }, { I: Users, v: '67K+ Users' }, { I: TrendingUp, v: '98% Pass Rate' }].map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'rgba(255,255,255,0.85)', fontSize: 12, fontWeight: 600 }}>
              <s.I size={13} color="rgba(255,255,255,0.7)" /> {s.v}
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: isMobile ? '16px 12px 60px' : '32px 24px 80px' }}>

        {/* Free tests banner — show for logged-in free users */}
        {isAuthenticated && !isPro && (
          <div style={{
            background: 'linear-gradient(135deg,#eff6ff,#dbeafe)', border: '1.5px solid #bfdbfe',
            borderRadius: 14, padding: '14px 20px', marginBottom: 24,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Zap size={18} color={BRAND} />
              <span style={{ fontSize: 13, fontWeight: 700, color: '#1e40af' }}>
                Free plan: {Math.max(0, FREE_LIMIT - freeUsed)} of {FREE_LIMIT} free tests remaining
              </span>
            </div>
            <a href="/pricing" style={{
              background: BRAND, color: '#fff', borderRadius: 8, padding: '7px 16px',
              fontSize: 12, fontWeight: 800, textDecoration: 'none',
              display: 'flex', alignItems: 'center', gap: 5,
            }}>
              <Crown size={12} /> Upgrade to Pro
            </a>
          </div>
        )}

        {/* Not logged in banner */}
        {!isAuthenticated && (
          <div style={{
            background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: 14,
            padding: '16px 20px', marginBottom: 24, display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', flexWrap: 'wrap', gap: 10,
          }}>
            <span style={{ fontSize: 13, color: '#475569', fontWeight: 600 }}>
              Register for free and get 2 full practice tests
            </span>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => openAuthModal('login')} style={{
                background: '#f1f5f9', color: '#334155', border: '1.5px solid #e2e8f0',
                borderRadius: 8, padding: '7px 16px', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
              }}>Log in</button>
              <button onClick={() => openAuthModal('register')} style={{
                background: BRAND, color: '#fff', border: 'none',
                borderRadius: 8, padding: '7px 16px', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
              }}>Register Free</button>
            </div>
          </div>
        )}

        {/* Exam type tabs */}
        <div style={{ display: 'flex', gap: 0, marginBottom: 28, background: '#fff', borderRadius: 14, border: '1.5px solid #e2e8f0', overflowX: 'auto', overflowY: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
          {EXAMS.map((ex, i) => {
            const on = active === ex.id;
            const Icon = ex.icon;
            return (
              <div
                key={ex.id}
                onClick={() => { setActive(ex.id); setFilter('all'); setSearch(''); }}
                style={{
                  flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  padding: '16px 12px', cursor: 'pointer', position: 'relative',
                  borderRight: i < EXAMS.length - 1 ? '1.5px solid #f1f5f9' : 'none',
                  background: on ? BRAND : '#fff',
                  transition: 'all .18s',
                }}
              >
                {on && <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, background: '#fff', borderRadius: '3px 3px 0 0' }} />}
                <div style={{ width: 34, height: 34, borderRadius: 10, background: on ? 'rgba(255,255,255,0.2)' : '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
                  <Icon size={16} color={on ? '#fff' : BRAND} />
                </div>
                <div style={{ fontSize: 13, fontWeight: 800, color: on ? '#fff' : '#1e293b', marginBottom: 2 }}>{ex.label}</div>
                <div style={{ fontSize: 10, color: on ? 'rgba(255,255,255,0.75)' : '#94a3b8', fontWeight: 500, textAlign: 'center' }}>{ex.sub}</div>
                <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
                  <span style={{ fontSize: 9, fontWeight: 700, color: on ? 'rgba(255,255,255,0.85)' : BRAND, background: on ? 'rgba(255,255,255,0.18)' : '#dbeafe', padding: '2px 6px', borderRadius: 6 }}>{ex.tests} tests</span>
                  <span style={{ fontSize: 9, fontWeight: 700, color: on ? 'rgba(255,255,255,0.85)' : '#64748b', background: on ? 'rgba(255,255,255,0.12)' : '#f1f5f9', padding: '2px 6px', borderRadius: 6 }}>{ex.users}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Section header */}
        <div style={{ marginBottom: 20 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', margin: '0 0 4px' }}>{exam?.label} Practice Tests</h2>
          <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>Choose a test below to start practicing</p>
        </div>

        {/* Filter + Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: 4, background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: 10, padding: 4 }}>
            {FILTERS.map(f => (
              <button key={f.id} onClick={() => setFilter(f.id)} style={{
                padding: '6px 14px', borderRadius: 8, border: 'none',
                fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
                background: filter === f.id ? BRAND : 'transparent',
                color: filter === f.id ? '#fff' : '#64748b',
                transition: 'all .15s',
              }}>{f.label}</button>
            ))}
          </div>
          <div style={{ flex: 1, maxWidth: 280, display: 'flex', alignItems: 'center', gap: 8, background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: 10, padding: '7px 14px' }}>
            <Search size={14} color="#94a3b8" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search tests..."
              style={{ flex: 1, border: 'none', outline: 'none', fontSize: 13, color: '#334155', background: 'transparent', fontFamily: 'inherit' }}
            />
          </div>
          <span style={{ marginLeft: 'auto', fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>{list.length} test{list.length !== 1 ? 's' : ''} found</span>
        </div>

        {/* Table (desktop) / Cards (mobile) */}
        {isMobile ? (
          <div>
            {list.length === 0 ? (
              <div style={{ padding: '40px 20px', textAlign: 'center', color: '#94a3b8' }}>
                <BookOpen size={28} color="#e2e8f0" style={{ marginBottom: 10 }} />
                <div style={{ fontWeight: 700 }}>No tests found</div>
              </div>
            ) : list.map(t => (
              <TestCard key={t.id} t={t} onStart={handleStart} freeUsed={freeUsed} isAuth={isAuthenticated} isPro={isPro} />
            ))}
          </div>
        ) : (
          <div style={{ background: '#fff', borderRadius: 16, border: '1.5px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 2px 16px rgba(0,0,0,0.04)' }}>
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 110px 90px 90px 90px 110px',
              gap: 12, padding: '11px 20px',
              background: '#f8faff', borderBottom: '2px solid #e2e8f0',
            }}>
              {['Test Name', 'Level', 'Difficulty', 'Questions', 'Duration', ''].map((h, i) => (
                <span key={i} style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.6px', textAlign: i > 0 ? 'center' : 'left' }}>{h}</span>
              ))}
            </div>
            {list.length === 0 ? (
              <div style={{ padding: '60px 20px', textAlign: 'center', color: '#94a3b8' }}>
                <BookOpen size={32} color="#e2e8f0" style={{ marginBottom: 12 }} />
                <div style={{ fontWeight: 700 }}>No tests found</div>
              </div>
            ) : (
              list.map(t => (
                <TestRow key={t.id} t={t} onStart={handleStart} freeUsed={freeUsed} isAuth={isAuthenticated} isPro={isPro} />
              ))
            )}
          </div>
        )}

        {/* Info cards */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)', gap: 16, marginTop: 24 }}>
          {[
            { icon: <CheckCircle2 size={20} color={BRAND} />, title: 'Adaptive Scoring', desc: 'Real band scores calculated after each test' },
            { icon: <Zap size={20} color="#f59e0b" />, title: 'AI Feedback', desc: 'Instant AI analysis for writing & speaking (Pro)' },
            { icon: <BarChart2 size={20} color="#10b981" />, title: 'Progress Tracking', desc: 'All results saved to your dashboard' },
          ].map((c, i) => (
            <div key={i} style={{ background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: 14, padding: '18px 20px', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: '#f8faff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{c.icon}</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>{c.title}</div>
                <div style={{ fontSize: 12, color: '#64748b', lineHeight: 1.5 }}>{c.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
