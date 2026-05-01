"use client";
import React, { useState, useEffect } from 'react';
import { Users, Award, DollarSign, FileText, Activity, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardHead, SparkLine } from '../components/helpers';

const STAT_CARDS = {
  uz: [
    { label: 'Foydalanuvchilar',  val: '1,284', diff: '+124',  up: true, Icon: Users,      color: '#2563eb', bg: '#eff6ff', data: [40,55,48,65,70,80,90,85,95,100,110,124] },
    { label: 'PRO obunalar',      val: '342',   diff: '+28',   up: true, Icon: Award,      color: '#7c3aed', bg: '#f5f3ff', data: [20,25,22,30,35,38,40,42,44,46,50,55]   },
    { label: "Oylik daromad",     val: "6.8M",  diff: '+18%',  up: true, Icon: DollarSign, color: '#059669', bg: '#ecfdf5', data: [300,420,380,500,560,610,650,700,720,760,800,850] },
    { label: 'Bajarilgan testlar',val: '18,420',diff: '+1,240',up: true, Icon: FileText,   color: '#ea580c', bg: '#fff7ed', data: [800,950,1100,1000,1200,1300,1400,1500,1600,1700,1800,1900] },
    { label: "Bugungi aktiv",     val: '87',    diff: '+12',   up: true, Icon: Activity,   color: '#0891b2', bg: '#ecfeff', data: [30,40,50,45,55,60,65,70,75,80,85,87] },
    { label: "O'rt. ball",        val: '6.8',   diff: '+0.2',  up: true, Icon: TrendingUp, color: '#f59e0b', bg: '#fffbeb', data: [6.2,6.3,6.4,6.4,6.5,6.6,6.6,6.7,6.7,6.8,6.8,6.8] },
  ],
  en: [
    { label: 'Total Users',       val: '1,284', diff: '+124',  up: true, Icon: Users,      color: '#2563eb', bg: '#eff6ff', data: [40,55,48,65,70,80,90,85,95,100,110,124] },
    { label: 'PRO Subscriptions', val: '342',   diff: '+28',   up: true, Icon: Award,      color: '#7c3aed', bg: '#f5f3ff', data: [20,25,22,30,35,38,40,42,44,46,50,55]   },
    { label: 'Monthly Revenue',   val: "6.8M",  diff: '+18%',  up: true, Icon: DollarSign, color: '#059669', bg: '#ecfdf5', data: [300,420,380,500,560,610,650,700,720,760,800,850] },
    { label: 'Tests Completed',   val: '18,420',diff: '+1,240',up: true, Icon: FileText,   color: '#ea580c', bg: '#fff7ed', data: [800,950,1100,1000,1200,1300,1400,1500,1600,1700,1800,1900] },
    { label: "Today's Active",    val: '87',    diff: '+12',   up: true, Icon: Activity,   color: '#0891b2', bg: '#ecfeff', data: [30,40,50,45,55,60,65,70,75,80,85,87] },
    { label: "Avg. Band Score",   val: '6.8',   diff: '+0.2',  up: true, Icon: TrendingUp, color: '#f59e0b', bg: '#fffbeb', data: [6.2,6.3,6.4,6.4,6.5,6.6,6.6,6.7,6.7,6.8,6.8,6.8] },
  ],
};

const ACTIVITY = {
  uz: [
    { user: 'Zulfiya H.',     act: "IELTS Mock 2 yakunladi",   score: '8.0',  t: '5 daqiqa oldin',  em: '✅' },
    { user: 'Otabek N.',      act: "PRO obunaga o'tdi",         score: '+30K', t: '12 daqiqa oldin', em: '💎' },
    { user: 'Malika Y.',      act: 'Cambridge C1 boshladi',     score: null,   t: '18 daqiqa oldin', em: '▶️' },
    { user: 'Jasur T.',       act: 'TOEFL Mock 1 yakunladi',    score: '82',   t: '34 daqiqa oldin', em: '✅' },
    { user: 'Nilufar R.',     act: "Speaking darsini ko'rdi",   score: null,   t: '1 soat oldin',    em: '🎬' },
    { user: 'Abdurakhmon J.', act: 'SAT Practice 1 boshladi',   score: null,   t: '1 soat oldin',    em: '▶️' },
  ],
  en: [
    { user: 'Zulfiya H.',     act: 'completed IELTS Mock 2',    score: '8.0',  t: '5 minutes ago',  em: '✅' },
    { user: 'Otabek N.',      act: 'upgraded to PRO',           score: '+30K', t: '12 minutes ago', em: '💎' },
    { user: 'Malika Y.',      act: 'started Cambridge C1',      score: null,   t: '18 minutes ago', em: '▶️' },
    { user: 'Jasur T.',       act: 'completed TOEFL Mock 1',    score: '82',   t: '34 minutes ago', em: '✅' },
    { user: 'Nilufar R.',     act: 'watched Speaking lesson',   score: null,   t: '1 hour ago',     em: '🎬' },
    { user: 'Abdurakhmon J.', act: 'started SAT Practice 1',   score: null,   t: '1 hour ago',     em: '▶️' },
  ],
};

const TOP_USERS = [
  { name: 'Zulfiya Hamidova',    score: 8.5, tests: 31, avatar: 'ZH', medal: '🥇' },
  { name: 'Nilufar Rashidova',   score: 8.0, tests: 22, avatar: 'NR', medal: '🥈' },
  { name: 'Otabek Normatov',     score: 7.5, tests: 9,  avatar: 'ON', medal: '🥉' },
  { name: 'Abdurakhmon Jalolov', score: 7.5, tests: 14, avatar: 'AJ', medal: '4'  },
  { name: 'Malika Yusupova',     score: 7.0, tests: 18, avatar: 'MY', medal: '5'  },
];

const EXAM_DIST = [
  { exam: 'IELTS',     pct: 42, c: '#2563eb', n: 7740 },
  { exam: 'CEFR',      pct: 24, c: '#059669', n: 4420 },
  { exam: 'SAT',       pct: 16, c: '#ea580c', n: 2947 },
  { exam: 'Cambridge', pct: 11, c: '#7c3aed', n: 2026 },
  { exam: 'TOEFL',     pct:  7, c: '#0891b2', n: 1289 },
];

const MONTHLY = [380,520,490,660,720,810,900,980,1050,1120,1180,1280];
const MONTHS  = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const TEXT = {
  uz: {
    recentActivity: "So'nggi faoliyat",
    examDist:       'Exam taqsimoti',
    allTests:       'Barcha testlar',
    monthlyRevenue: 'Oylik daromad',
    currency:       "So'm hisobida · 2024",
    monthly:        'Oylik',
    weekly:         'Haftalik',
    topUsers:       'Top foydalanuvchilar',
    byScore:        'Ball bo\'yicha',
    testsCompleted: 'ta test bajarilgan',
  },
  en: {
    recentActivity: 'Recent Activity',
    examDist:       'Exam Distribution',
    allTests:       'All Tests',
    monthlyRevenue: 'Monthly Revenue',
    currency:       'UZS · 2024',
    monthly:        'Monthly',
    weekly:         'Weekly',
    topUsers:       'Top Users',
    byScore:        'By Band Score',
    testsCompleted: 'tests completed',
  },
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function Overview({ lang = 'uz' }) {
  const [period, setPeriod] = useState('monthly');
  const [live, setLive] = useState(null);
  const tx = TEXT[lang];
  const stats    = STAT_CARDS[lang];
  const activity = ACTIVITY[lang];

  useEffect(() => {
    const token = sessionStorage.getItem('ep_admin_token');
    if (!token) return;
    fetch(`${API_URL}/api/dashboard/admin/overview`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(r => r.ok ? r.json() : null).then(d => { if (d) setLive(d); }).catch(() => {});
  }, []);

  const liveVal = (idx, fallback) => {
    if (!live) return fallback;
    const keys = ['total_users', null, null, 'total_tests', 'active_users', 'avg_score'];
    const k = keys[idx];
    return k ? String(live[k]) : fallback;
  };

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>

      {/* stat cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14 }}>
        {stats.map((s, i) => (
          <Card key={i}>
            <div style={{ padding:'18px 20px' }}>
              <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:12 }}>
                <div style={{ width:38, height:38, borderRadius:11, background:s.bg, display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <s.Icon size={17} color={s.color} />
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:3, background:s.up?'#dcfce7':'#fee2e2', borderRadius:20, padding:'2px 8px' }}>
                  {s.up ? <TrendingUp size={10} color="#16a34a"/> : <TrendingDown size={10} color="#dc2626"/>}
                  <span style={{ fontSize:10, fontWeight:700, color:s.up?'#16a34a':'#dc2626' }}>{s.diff}</span>
                </div>
              </div>
              <div style={{ fontSize:24, fontWeight:900, color:'#0f172a', marginBottom:2 }}>{liveVal(i, s.val)}</div>
              <div style={{ fontSize:11, color:'#94a3b8', marginBottom:10 }}>{s.label}</div>
              <SparkLine data={s.data} color={s.color} />
            </div>
          </Card>
        ))}
      </div>

      {/* activity + distribution */}
      <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:14 }}>
        <Card>
          <CardHead title={tx.recentActivity} sub="Real-time" />
          <div>
            {activity.map((a, i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:12, padding:'11px 18px', borderBottom:i<activity.length-1?'1px solid #f8fafc':'none' }}>
                <div style={{ width:34, height:34, borderRadius:10, background:'#f8fafc', display:'flex', alignItems:'center', justifyContent:'center', fontSize:15, flexShrink:0 }}>{a.em}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, fontWeight:700, color:'#0f172a' }}>
                    {a.user} <span style={{ fontWeight:500, color:'#64748b' }}>{a.act}</span>
                  </div>
                  <div style={{ fontSize:11, color:'#94a3b8', marginTop:2 }}>{a.t}</div>
                </div>
                {a.score && (
                  <span style={{ fontSize:11, fontWeight:800, color:'#2563eb', background:'#eff6ff', padding:'3px 9px', borderRadius:8, flexShrink:0 }}>{a.score}</span>
                )}
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHead title={tx.examDist} sub={tx.allTests} />
          <div style={{ padding:'14px 18px', display:'flex', flexDirection:'column', gap:12 }}>
            {EXAM_DIST.map((r, i) => (
              <div key={i}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
                  <span style={{ fontSize:12, fontWeight:700, color:'#0f172a' }}>{r.exam}</span>
                  <span style={{ fontSize:11, color:'#94a3b8' }}>{r.n.toLocaleString()} · {r.pct}%</span>
                </div>
                <div style={{ height:7, background:'#f1f5f9', borderRadius:99, overflow:'hidden' }}>
                  <div style={{ width:`${r.pct}%`, height:'100%', background:r.c, borderRadius:99, transition:'width 1s' }}/>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* revenue bar chart */}
      <Card>
        <CardHead
          title={tx.monthlyRevenue}
          sub={tx.currency}
          action={
            <div style={{ display:'flex', gap:4, padding:3, background:'#f8fafc', border:'1.5px solid #f1f5f9', borderRadius:10 }}>
              {['monthly','weekly'].map(p => (
                <button key={p} onClick={() => setPeriod(p)} style={{
                  padding:'5px 12px', border:'none', borderRadius:8, fontSize:11, fontWeight:700, cursor:'pointer',
                  fontFamily:'inherit', transition:'all .15s',
                  background: period===p ? '#2563eb' : 'transparent',
                  color: period===p ? '#fff' : '#94a3b8',
                }}>{p==='monthly' ? tx.monthly : tx.weekly}</button>
              ))}
            </div>
          }
        />
        <div style={{ padding:'20px 24px', display:'flex', alignItems:'flex-end', gap:6 }}>
          {MONTHLY.map((v, i) => {
            const max = Math.max(...MONTHLY);
            const isLast = i === MONTHLY.length - 1;
            return (
              <div key={i} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:5 }}>
                <span style={{ fontSize:9, color:isLast?'#2563eb':'#94a3b8', fontWeight:700 }}>{Math.round(v/10)}K</span>
                <div style={{ width:'100%', background:isLast?'linear-gradient(180deg,#2563eb,#60a5fa)':'linear-gradient(180deg,#dbeafe,#bfdbfe)', borderRadius:'5px 5px 0 0', height:`${(v/max)*110}px`, minHeight:4, transition:'height .5s' }}/>
                <span style={{ fontSize:9, color:'#94a3b8' }}>{MONTHS[i]}</span>
              </div>
            );
          })}
        </div>
      </Card>

      {/* top users */}
      <Card>
        <CardHead title={tx.topUsers} sub={tx.byScore} />
        <div style={{ padding:'8px 0' }}>
          {TOP_USERS.map((u, i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap:14, padding:'10px 20px', borderBottom:i<4?'1px solid #f8fafc':'none' }}>
              <div style={{ fontSize:18, width:28, textAlign:'center' }}>{u.medal}</div>
              <div style={{ width:34, height:34, borderRadius:10, background:'linear-gradient(135deg,#2563eb,#7c3aed)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:800, color:'#fff', flexShrink:0 }}>{u.avatar}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13, fontWeight:700, color:'#0f172a' }}>{u.name}</div>
                <div style={{ fontSize:11, color:'#94a3b8', marginTop:1 }}>{u.tests} {tx.testsCompleted}</div>
              </div>
              <div style={{ fontSize:16, fontWeight:900, color:'#2563eb', background:'#eff6ff', border:'1px solid #dbeafe', padding:'4px 12px', borderRadius:10 }}>{u.score}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
