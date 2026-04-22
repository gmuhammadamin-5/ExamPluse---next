"use client";
import React, { useState, useEffect, useRef } from 'react';
import { LayoutDashboard, Users, FileText, BarChart2, CreditCard, Video, Settings, Bell, LogOut, Globe } from 'lucide-react';
import AdminLogin from './AdminLogin';
import { useToast, Toast } from './components/Toast';
import Overview       from './sections/Overview';
import UsersSection   from './sections/UsersSection';
import TestsSection   from './sections/TestsSection';
import ResultsSection from './sections/ResultsSection';
import PaymentsSection from './sections/PaymentsSection';
import LessonsSection  from './sections/LessonsSection';

/* ─── Translations ─────────────────────────────────────────── */
const T = {
  uz: {
    adminPanel:  'Admin Panel',
    overview:    'Dashboard',
    users:       'Foydalanuvchilar',
    tests:       'Testlar',
    results:     'Natijalar',
    payments:    "To'lovlar",
    lessons:     'Video Darslar',
    settings:    'Sozlamalar',
    logout:      'Chiqish',
    notifications: 'Bildirishnomalar',
    markRead:    'Hammasini o\'qildi deb belgilash',
    noNotif:     'Bildirishnoma yo\'q',
    admin:       'Admin',
    // settings labels
    siteSettings:  'Sayt sozlamalari',
    siteName:      'Sayt nomi',
    siteUrl:       'Sayt URL',
    adminEmail:    'Admin email',
    phone:         'Telefon',
    paySettings:   "To'lov sozlamalari",
    paymeMerchant: 'Payme Merchant ID',
    clickMerchant: 'Click Merchant ID',
    proMonthly:    "PRO Oylik (so'm)",
    proYearly:     "PRO Yillik (so'm)",
    aiSettings:    'AI sozlamalari',
    apiKey:        'Claude API Key',
    aiModel:       'AI Model',
    maxTokens:     'Max tokens',
    temperature:   'Temperature',
    security:      'Xavfsizlik',
    adminPass:     'Admin parol',
    sessionTimeout:'Session timeout (min)',
    maxLogin:      'Max login urinish',
    twoFa:         '2FA telefon',
    save:          'Saqlash',
    saved:         'Saqlandi!',
  },
  en: {
    adminPanel:  'Admin Panel',
    overview:    'Dashboard',
    users:       'Users',
    tests:       'Tests',
    results:     'Results',
    payments:    'Payments',
    lessons:     'Video Lessons',
    settings:    'Settings',
    logout:      'Sign Out',
    notifications: 'Notifications',
    markRead:    'Mark all as read',
    noNotif:     'No notifications',
    admin:       'Admin',
    // settings labels
    siteSettings:  'Site Settings',
    siteName:      'Site Name',
    siteUrl:       'Site URL',
    adminEmail:    'Admin Email',
    phone:         'Phone',
    paySettings:   'Payment Settings',
    paymeMerchant: 'Payme Merchant ID',
    clickMerchant: 'Click Merchant ID',
    proMonthly:    'PRO Monthly (UZS)',
    proYearly:     'PRO Yearly (UZS)',
    aiSettings:    'AI Settings',
    apiKey:        'Claude API Key',
    aiModel:       'AI Model',
    maxTokens:     'Max Tokens',
    temperature:   'Temperature',
    security:      'Security',
    adminPass:     'Admin Password',
    sessionTimeout:'Session Timeout (min)',
    maxLogin:      'Max Login Attempts',
    twoFa:         '2FA Phone',
    save:          'Save',
    saved:         'Saved!',
  },
};

/* ─── Notifications data ───────────────────────────────────── */
const NOTIFS_DATA = {
  uz: [
    { id:1, em:'👤', title:'Yangi foydalanuvchi ro\'yxatdan o\'tdi', sub:'Zulfiya H. — 2 daqiqa oldin', read:false },
    { id:2, em:'💰', title:"To'lov qabul qilindi — PRO obuna", sub:'49,900 so\'m · 5 daqiqa oldin', read:false },
    { id:3, em:'✅', title:'IELTS Mock 3 test yakunlandi', sub:'Otabek N. — Band 7.5 · 12 daqiqa oldin', read:false },
    { id:4, em:'⚠️', title:'Yangi xato xabari tushdi', sub:'Speaking module · 1 soat oldin', read:true },
    { id:5, em:'📊', title:"Oylik hisobot tayyor", sub:'Dekabr 2024 · kecha', read:true },
  ],
  en: [
    { id:1, em:'👤', title:'New user registered', sub:'Zulfiya H. — 2 minutes ago', read:false },
    { id:2, em:'💰', title:'Payment received — PRO subscription', sub:'49,900 UZS · 5 minutes ago', read:false },
    { id:3, em:'✅', title:'IELTS Mock 3 test completed', sub:'Otabek N. — Band 7.5 · 12 minutes ago', read:false },
    { id:4, em:'⚠️', title:'New error report received', sub:'Speaking module · 1 hour ago', read:true },
    { id:5, em:'📊', title:'Monthly report is ready', sub:'December 2024 · yesterday', read:true },
  ],
};

/* ─── Avatar ───────────────────────────────────────────────── */
function Avatar({ code, size = 32 }) {
  return (
    <div style={{ width:size, height:size, borderRadius:size/3, background:'linear-gradient(135deg,#2563eb,#7c3aed)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:size*0.34, fontWeight:800, color:'#fff', flexShrink:0 }}>
      {code}
    </div>
  );
}

/* ─── Notifications Dropdown ───────────────────────────────── */
function NotificationsPanel({ lang, onClose }) {
  const t = (k) => T[lang][k];
  const [notifs, setNotifs] = useState(NOTIFS_DATA[lang]);
  const unread = notifs.filter(n => !n.read).length;

  const markAll = () => setNotifs(prev => prev.map(n => ({ ...n, read: true })));

  return (
    <div style={{ position:'absolute', top:'calc(100% + 10px)', right:0, width:340, background:'#fff', borderRadius:18, boxShadow:'0 20px 60px rgba(0,0,0,0.12)', border:'1.5px solid #f1f5f9', zIndex:200, overflow:'hidden' }}>
      <div style={{ padding:'14px 18px', borderBottom:'1.5px solid #f8fafc', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div>
          <span style={{ fontSize:14, fontWeight:800, color:'#0f172a' }}>{t('notifications')}</span>
          {unread > 0 && <span style={{ marginLeft:8, fontSize:10, fontWeight:800, color:'#fff', background:'#ef4444', borderRadius:99, padding:'2px 7px' }}>{unread}</span>}
        </div>
        {unread > 0 && (
          <button onClick={markAll} style={{ fontSize:11, fontWeight:700, color:'#2563eb', background:'none', border:'none', cursor:'pointer', padding:0 }}>
            {t('markRead')}
          </button>
        )}
      </div>
      <div style={{ maxHeight:320, overflowY:'auto' }}>
        {notifs.length === 0 ? (
          <div style={{ padding:32, textAlign:'center', color:'#94a3b8', fontSize:13 }}>{t('noNotif')}</div>
        ) : notifs.map(n => (
          <div key={n.id} onClick={() => setNotifs(prev => prev.map(x => x.id===n.id ? {...x,read:true} : x))}
            style={{ display:'flex', alignItems:'flex-start', gap:12, padding:'12px 18px', borderBottom:'1px solid #f8fafc', cursor:'pointer', background:n.read?'#fff':'#f0f9ff', transition:'background .15s' }}>
            <div style={{ width:36, height:36, borderRadius:11, background:'#f8fafc', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, flexShrink:0 }}>{n.em}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:12, fontWeight: n.read?600:800, color:'#0f172a', lineHeight:1.4 }}>{n.title}</div>
              <div style={{ fontSize:11, color:'#94a3b8', marginTop:3 }}>{n.sub}</div>
            </div>
            {!n.read && <div style={{ width:7, height:7, borderRadius:'50%', background:'#3b82f6', marginTop:5, flexShrink:0 }}/>}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Settings Section ─────────────────────────────────────── */
function SettingsSection({ toast, lang }) {
  const t = (k) => T[lang][k];
  const [saved, setSaved] = useState(false);
  const save = () => { setSaved(true); toast(t('saved') + ' ✓'); setTimeout(() => setSaved(false), 2200); };
  const inputStyle = { width:'100%', padding:'8px 11px', border:'1.5px solid #f1f5f9', borderRadius:9, fontSize:13, color:'#0f172a', outline:'none', transition:'border .2s', boxSizing:'border-box', fontFamily:'inherit' };

  const sections = [
    { title: t('siteSettings'),  fields:[{l:t('siteName'),v:'ExamPulse'},{l:t('siteUrl'),v:'https://exampulse.uz'},{l:t('adminEmail'),v:'admin@exampulse.uz'},{l:t('phone'),v:'+998 90 123 45 67'}] },
    { title: t('paySettings'),   fields:[{l:t('paymeMerchant'),v:'exampulse_merchant'},{l:t('clickMerchant'),v:'12345678'},{l:t('proMonthly'),v:'49900'},{l:t('proYearly'),v:'399900'}] },
    { title: t('aiSettings'),    fields:[{l:t('apiKey'),v:'sk-ant-••••••••••••'},{l:t('aiModel'),v:'claude-sonnet-4-6'},{l:t('maxTokens'),v:'4096'},{l:t('temperature'),v:'0.7'}] },
    { title: t('security'),      fields:[{l:t('adminPass'),v:'••••••••'},{l:t('sessionTimeout'),v:'60'},{l:t('maxLogin'),v:'5'},{l:t('twoFa'),v:'+998 90 123 45 67'}] },
  ];

  return (
    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
      {sections.map((sec, si) => (
        <div key={si} style={{ background:'#fff', borderRadius:18, border:'1.5px solid #f1f5f9', boxShadow:'0 2px 10px rgba(0,0,0,0.04)', overflow:'hidden' }}>
          <div style={{ padding:'16px 20px', borderBottom:'1.5px solid #f8fafc' }}>
            <div style={{ fontSize:14, fontWeight:800, color:'#0f172a' }}>{sec.title}</div>
          </div>
          <div style={{ padding:'16px 20px', display:'flex', flexDirection:'column', gap:12 }}>
            {sec.fields.map((f, i) => (
              <div key={i}>
                <div style={{ fontSize:11, fontWeight:700, color:'#64748b', marginBottom:5 }}>{f.l}</div>
                <input defaultValue={f.v} style={inputStyle}
                  onFocus={e => e.target.style.borderColor='#2563eb'}
                  onBlur={e => e.target.style.borderColor='#f1f5f9'} />
              </div>
            ))}
            <button onClick={save} style={{ padding:'10px', background:saved?'linear-gradient(135deg,#059669,#047857)':'linear-gradient(135deg,#2563eb,#1d4ed8)', border:'none', borderRadius:11, color:'#fff', fontWeight:800, fontSize:13, cursor:'pointer', fontFamily:'inherit', transition:'background .3s' }}>
              {saved ? t('saved') : t('save')}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Main Dashboard ───────────────────────────────────────── */
export default function AdminDashboard() {
  const [authed,   setAuthed]   = useState(false);
  const [page,     setPage]     = useState('overview');
  const [lang,     setLang]     = useState('uz');
  const [notifOpen,setNotifOpen]= useState(false);
  const [notifCount,setNotifCount] = useState(3);
  const notifRef = useRef(null);
  const { toasts, add: addToast, remove: removeToast } = useToast();

  const t = (k) => T[lang][k];

  useEffect(() => {
    if (sessionStorage.getItem('ep_admin') === '1') setAuthed(true);
  }, []);

  // close notif panel on outside click
  useEffect(() => {
    const handler = (e) => { if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => { sessionStorage.removeItem('ep_admin'); setAuthed(false); };

  if (!authed) return <AdminLogin onLogin={() => setAuthed(true)} />;

  const NAV = [
    { id:'overview',  label: t('overview'),  Icon: LayoutDashboard },
    { id:'users',     label: t('users'),     Icon: Users            },
    { id:'tests',     label: t('tests'),     Icon: FileText         },
    { id:'results',   label: t('results'),   Icon: BarChart2        },
    { id:'payments',  label: t('payments'),  Icon: CreditCard       },
    { id:'lessons',   label: t('lessons'),   Icon: Video            },
    { id:'settings',  label: t('settings'),  Icon: Settings         },
  ];

  const SECTION_MAP = {
    overview: <Overview  lang={lang} />,
    users:    <UsersSection   toast={addToast} lang={lang} />,
    tests:    <TestsSection   toast={addToast} lang={lang} />,
    results:  <ResultsSection toast={addToast} lang={lang} />,
    payments: <PaymentsSection toast={addToast} lang={lang} />,
    lessons:  <LessonsSection  toast={addToast} lang={lang} />,
    settings: <SettingsSection toast={addToast} lang={lang} />,
  };

  const curNav = NAV.find(n => n.id === page);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        .adm * { box-sizing:border-box; font-family:'Inter',system-ui,sans-serif; }
        .adm ::-webkit-scrollbar { width:4px; }
        .adm ::-webkit-scrollbar-thumb { background:#e2e8f0; border-radius:4px; }
        .adm-nav-btn:hover { background:rgba(255,255,255,0.06) !important; color:rgba(255,255,255,0.85) !important; }
        .adm-nav-btn:hover svg { opacity:.8; }
        .lang-btn { border:none; cursor:pointer; font-family:inherit; font-weight:800; font-size:11px; padding:5px 10px; border-radius:8px; transition:all .15s; }
      `}</style>

      <div className="adm" style={{ display:'flex', minHeight:'100vh', background:'#f8fafc' }}>

        {/* SIDEBAR */}
        <div style={{ width:220, background:'#0f172a', display:'flex', flexDirection:'column', position:'fixed', top:0, left:0, bottom:0, zIndex:100 }}>
          {/* logo */}
          <div style={{ padding:'20px 18px 16px', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <div style={{ width:34, height:34, borderRadius:10, background:'linear-gradient(135deg,#2563eb,#7c3aed)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:900, color:'#fff' }}>EP</div>
              <div>
                <div style={{ fontSize:13, fontWeight:800, color:'#fff' }}>ExamPulse</div>
                <div style={{ fontSize:10, color:'rgba(255,255,255,0.35)', fontWeight:600 }}>{t('adminPanel')}</div>
              </div>
            </div>
          </div>

          {/* nav */}
          <nav style={{ flex:1, padding:'10px 8px', display:'flex', flexDirection:'column', gap:2, overflowY:'auto' }}>
            {NAV.map(n => {
              const on = page === n.id;
              return (
                <button key={n.id} className="adm-nav-btn" onClick={() => setPage(n.id)}
                  style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 12px', borderRadius:11, border:'none', cursor:'pointer', transition:'all .15s', background:on?'rgba(37,99,235,0.18)':'transparent', color:on?'#93c5fd':'rgba(255,255,255,0.45)', fontWeight:on?700:500, fontSize:13, fontFamily:'inherit', textAlign:'left', width:'100%' }}>
                  <n.Icon size={15} color={on?'#93c5fd':'rgba(255,255,255,0.35)'} />
                  {n.label}
                  {on && <div style={{ width:5, height:5, borderRadius:'50%', background:'#93c5fd', marginLeft:'auto', flexShrink:0 }}/>}
                </button>
              );
            })}
          </nav>

          {/* logout */}
          <div style={{ padding:'12px 8px', borderTop:'1px solid rgba(255,255,255,0.07)' }}>
            <button onClick={handleLogout}
              style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 12px', borderRadius:11, border:'none', cursor:'pointer', background:'transparent', color:'rgba(255,255,255,0.35)', fontSize:13, fontFamily:'inherit', width:'100%', transition:'all .15s' }}>
              <LogOut size={15} color='rgba(255,255,255,0.35)' /> {t('logout')}
            </button>
          </div>
        </div>

        {/* CONTENT */}
        <div style={{ marginLeft:220, flex:1, display:'flex', flexDirection:'column', minHeight:'100vh' }}>
          {/* topbar */}
          <div style={{ height:58, background:'#fff', borderBottom:'1.5px solid #f1f5f9', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 26px', position:'sticky', top:0, zIndex:50, boxShadow:'0 1px 4px rgba(0,0,0,0.04)' }}>
            <span style={{ fontSize:15, fontWeight:800, color:'#0f172a' }}>{curNav?.label}</span>

            <div style={{ display:'flex', alignItems:'center', gap:10 }}>

              {/* Language toggle */}
              <div style={{ display:'flex', background:'#f8fafc', border:'1.5px solid #f1f5f9', borderRadius:11, padding:3, gap:2 }}>
                {['uz','en'].map(l => (
                  <button key={l} className="lang-btn" onClick={() => setLang(l)}
                    style={{ background: lang===l ? '#2563eb' : 'transparent', color: lang===l ? '#fff' : '#94a3b8', textTransform:'uppercase', letterSpacing:'0.5px' }}>
                    {l}
                  </button>
                ))}
              </div>

              {/* Notifications */}
              <div style={{ position:'relative' }} ref={notifRef}>
                <button onClick={() => { setNotifOpen(p=>!p); setNotifCount(0); }}
                  style={{ width:36, height:36, borderRadius:11, background:'#f8fafc', border:'1.5px solid #f1f5f9', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <Bell size={16} color='#64748b' />
                </button>
                {notifCount > 0 && (
                  <div style={{ position:'absolute', top:-3, right:-3, width:16, height:16, borderRadius:'50%', background:'#ef4444', display:'flex', alignItems:'center', justifyContent:'center', fontSize:9, fontWeight:800, color:'#fff', pointerEvents:'none' }}>{notifCount}</div>
                )}
                {notifOpen && <NotificationsPanel lang={lang} onClose={() => setNotifOpen(false)} />}
              </div>

              {/* Admin avatar */}
              <div style={{ display:'flex', alignItems:'center', gap:8, background:'#f8fafc', border:'1.5px solid #f1f5f9', borderRadius:11, padding:'5px 12px' }}>
                <Avatar code="AD" size={26} />
                <span style={{ fontSize:12, fontWeight:700, color:'#0f172a' }}>{t('admin')}</span>
              </div>
            </div>
          </div>

          {/* page content */}
          <div style={{ flex:1, padding:'22px 26px' }}>
            {SECTION_MAP[page]}
          </div>
        </div>
      </div>

      <Toast toasts={toasts} remove={removeToast} />
    </>
  );
}
