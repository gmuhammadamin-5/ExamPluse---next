"use client";
import React, { useState, useRef, useEffect } from 'react';
import {
  Camera, User, Mail, Lock, Bell, Globe2, LogOut,
  Check, Eye, EyeOff, Edit3, Save, CheckCircle,
  Target, BookOpen, Mic, PenTool, Headphones, Trash2,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const TABS = [
  { id:'profile', label:'Profil',       icon: <User size={16}/> },
  { id:'account', label:'Hisob',        icon: <Mail size={16}/> },
  { id:'security',label:'Xavfsizlik',   icon: <Lock size={16}/> },
  { id:'notify',  label:'Bildirishnoma',icon: <Bell size={16}/> },
];

export default function ProfileSettings() {
  const { user, logout } = useAuth();

  const defaultProfile = {
    firstName: user?.full_name?.split(' ')[0] || '',
    lastName:  user?.full_name?.split(' ').slice(1).join(' ') || '',
    username:  user?.email?.split('@')[0] || '',
    email:     user?.email || '',
    country:   "O'zbekiston",
    targetBand:'7.5',
    examType:  'IELTS',
    bio:       '',
    avatar:    null,
  };

  const [tab, setTab]           = useState('profile');
  const [profile, setProfile]   = useState(defaultProfile);
  const [form, setForm]         = useState(defaultProfile);
  const [saved, setSaved]       = useState(false);
  const [dragging, setDragging] = useState(false);
  const [showPass, setShowPass] = useState({ cur:false, new:false, con:false });
  const [passForm, setPassForm] = useState({ cur:'', new:'', con:'' });
  const fileRef = useRef(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('ep_profile');
      if (saved) { const p = JSON.parse(saved); setProfile(p); setForm(p); }
    } catch {}
  }, []);

  useEffect(() => {
    if (user) {
      setProfile(p => ({ ...p, email: user.email || p.email, firstName: p.firstName || user.full_name?.split(' ')[0] || '', lastName: p.lastName || user.full_name?.split(' ').slice(1).join(' ') || '' }));
      setForm(p => ({ ...p, email: user.email || p.email }));
    }
  }, [user]);

  const updateProfile = (data) => {
    setProfile(prev => { const next = { ...prev, ...data }; try { localStorage.setItem('ep_profile', JSON.stringify(next)); } catch {} return next; });
  };
  const updateAvatar = (base64) => updateProfile({ avatar: base64 });
  const initials = `${profile.firstName?.[0]||''}${profile.lastName?.[0]||''}`.toUpperCase() || user?.full_name?.[0]?.toUpperCase() || 'ME';

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => updateAvatar(e.target.result);
    reader.readAsDataURL(file);
  };

  const onDrop = (e) => {
    e.preventDefault(); setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const save = () => {
    updateProfile(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const inp = (field) => ({
    value: form[field] || '',
    onChange: e => setForm(p => ({ ...p, [field]: e.target.value })),
  });

  const skills = [
    { id:'speaking',  label:'Speaking',  icon:<Mic size={14}/>,       color:'#0ea5e9' },
    { id:'writing',   label:'Writing',   icon:<PenTool size={14}/>,   color:'#ea580c' },
    { id:'reading',   label:'Reading',   icon:<BookOpen size={14}/>,  color:'#7c3aed' },
    { id:'listening', label:'Listening', icon:<Headphones size={14}/>,color:'#059669' },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        .ps * { box-sizing:border-box; font-family:-apple-system,BlinkMacSystemFont,'Inter',sans-serif; }
        .ps-input { width:100%; padding:11px 14px; border:1.5px solid rgba(0,0,0,0.09); border-radius:12px; font-size:14px; color:#1C1C1E; background:#fff; outline:none; transition:border .2s; }
        .ps-input:focus { border-color:#007AFF; box-shadow:0 0 0 3px rgba(0,122,255,0.10); }
        .ps-tab { display:flex; align-items:center; gap:8px; padding:10px 16px; border-radius:12px; border:none; cursor:pointer; font-size:13px; font-weight:600; transition:all .15s; width:100%; text-align:left; }
        .ps-tab:hover { background:rgba(0,122,255,0.06); }
        .ps-btn { border:none; border-radius:12px; padding:11px 22px; font-size:14px; font-weight:700; cursor:pointer; transition:all .15s; display:flex; align-items:center; gap:7px; }
        .ps-btn:active { transform:scale(.96); }
        .ps-avatar-drop:hover .ps-cam-overlay { opacity:1 !important; }
      `}</style>

      <div className="ps" style={{
        minHeight:'calc(100vh - 70px)',
        background:'linear-gradient(135deg, #f0f8ff 0%, #e6f7ff 50%, #d6f0ff 100%)',
        padding:'32px 24px',
      }}>
        <div style={{ maxWidth:860, margin:'0 auto' }}>

          {/* Title */}
          <div style={{ marginBottom:28 }}>
            <h1 style={{ fontSize:28, fontWeight:800, color:'#1C1C1E', letterSpacing:'-0.5px', margin:0 }}>Profil sozlamalari</h1>
            <p style={{ fontSize:14, color:'#8E8E93', marginTop:4 }}>Ma'lumotlaringizni tahrirlang</p>
          </div>

          <div style={{ display:'flex', gap:20, alignItems:'flex-start' }}>

            {/* ── Sidebar tabs ── */}
            <div style={{ width:200, background:'rgba(255,255,255,0.85)', backdropFilter:'blur(16px)', borderRadius:18, padding:10, flexShrink:0 }}>
              {TABS.map(t => (
                <button key={t.id} className="ps-tab"
                  onClick={()=>setTab(t.id)}
                  style={{ background:tab===t.id?'rgba(0,122,255,0.10)':'transparent', color:tab===t.id?'#007AFF':'#3C3C43' }}>
                  <span style={{ color:tab===t.id?'#007AFF':'#8E8E93' }}>{t.icon}</span>
                  {t.label}
                </button>
              ))}
              <div style={{ height:1, background:'rgba(0,0,0,0.06)', margin:'8px 4px' }}/>
              <button className="ps-tab" style={{ color:'#FF3B30' }}>
                <LogOut size={16}/> Chiqish
              </button>
            </div>

            {/* ── Main content ── */}
            <div style={{ flex:1 }}>

              {/* PROFILE TAB */}
              {tab==='profile' && (
                <div style={{ background:'rgba(255,255,255,0.85)', backdropFilter:'blur(16px)', borderRadius:20, padding:28 }}>

                  {/* Avatar upload */}
                  <div style={{ display:'flex', alignItems:'center', gap:24, marginBottom:32, paddingBottom:28, borderBottom:'1px solid rgba(0,0,0,0.06)' }}>
                    <div
                      className="ps-avatar-drop"
                      onDragOver={e=>{e.preventDefault();setDragging(true)}}
                      onDragLeave={()=>setDragging(false)}
                      onDrop={onDrop}
                      onClick={()=>fileRef.current?.click()}
                      style={{
                        width:96, height:96, borderRadius:'50%', position:'relative', cursor:'pointer',
                        border: dragging?'3px dashed #007AFF':'3px solid transparent',
                        transition:'all .2s',
                      }}>
                      {/* Avatar */}
                      {profile.avatar
                        ? <img src={profile.avatar} alt="avatar" style={{ width:'100%', height:'100%', borderRadius:'50%', objectFit:'cover' }}/>
                        : <div style={{ width:'100%', height:'100%', borderRadius:'50%', background:'linear-gradient(145deg,#007AFF,#5856D6)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:28, fontWeight:800, color:'#fff' }}>{initials}</div>
                      }
                      {/* Camera overlay */}
                      <div className="ps-cam-overlay" style={{
                        position:'absolute', inset:0, borderRadius:'50%',
                        background:'rgba(0,0,0,0.45)', display:'flex', alignItems:'center', justifyContent:'center',
                        opacity:0, transition:'opacity .2s',
                      }}>
                        <Camera size={22} color="#fff"/>
                      </div>
                      {/* Online badge */}
                      <div style={{ position:'absolute', bottom:3, right:3, width:16, height:16, borderRadius:'50%', background:'#34C759', border:'2.5px solid #F2F2F7' }}/>
                    </div>
                    <input ref={fileRef} type="file" accept="image/*" style={{display:'none'}} onChange={e=>handleFile(e.target.files[0])}/>

                    <div>
                      <div style={{ fontSize:18, fontWeight:700, color:'#1C1C1E' }}>{profile.firstName} {profile.lastName}</div>
                      <div style={{ fontSize:13, color:'#8E8E93', marginTop:2 }}>@{profile.username}</div>
                      <div style={{ display:'flex', gap:8, marginTop:10 }}>
                        <button className="ps-btn" onClick={()=>fileRef.current?.click()}
                          style={{ background:'#007AFF', color:'#fff', padding:'7px 16px', fontSize:13 }}>
                          <Camera size={14}/> Rasm yuklash
                        </button>
                        {profile.avatar && (
                          <button className="ps-btn" onClick={()=>updateAvatar(null)}
                            style={{ background:'rgba(255,59,48,0.10)', color:'#FF3B30', padding:'7px 14px', fontSize:13 }}>
                            <Trash2 size={14}/> O'chirish
                          </button>
                        )}
                      </div>
                      <p style={{ fontSize:11, color:'#8E8E93', marginTop:8 }}>JPG, PNG yoki GIF · Max 5MB · Sudrab tashlash ham mumkin</p>
                    </div>
                  </div>

                  {/* Form fields */}
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
                    <div>
                      <label style={{ fontSize:12, fontWeight:600, color:'#8E8E93', display:'block', marginBottom:6 }}>Ism</label>
                      <input className="ps-input" {...inp('firstName')} placeholder="Ismingiz"/>
                    </div>
                    <div>
                      <label style={{ fontSize:12, fontWeight:600, color:'#8E8E93', display:'block', marginBottom:6 }}>Familiya</label>
                      <input className="ps-input" {...inp('lastName')} placeholder="Familiyangiz"/>
                    </div>
                    <div>
                      <label style={{ fontSize:12, fontWeight:600, color:'#8E8E93', display:'block', marginBottom:6 }}>Username</label>
                      <input className="ps-input" {...inp('username')} placeholder="username"/>
                    </div>
                    <div>
                      <label style={{ fontSize:12, fontWeight:600, color:'#8E8E93', display:'block', marginBottom:6 }}>Davlat</label>
                      <input className="ps-input" {...inp('country')} placeholder="Davlat"/>
                    </div>
                    <div style={{ gridColumn:'1/-1' }}>
                      <label style={{ fontSize:12, fontWeight:600, color:'#8E8E93', display:'block', marginBottom:6 }}>Bio</label>
                      <textarea className="ps-input" {...inp('bio')} placeholder="O'zingiz haqida..." rows={3} style={{ resize:'vertical' }}/>
                    </div>
                  </div>

                  {/* Exam target */}
                  <div style={{ marginTop:24, padding:18, background:'rgba(0,122,255,0.05)', borderRadius:14, border:'1px solid rgba(0,122,255,0.10)' }}>
                    <div style={{ fontSize:13, fontWeight:700, color:'#1C1C1E', marginBottom:14, display:'flex', alignItems:'center', gap:7 }}>
                      <Target size={15} color="#007AFF"/> Imtihon maqsadi
                    </div>
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12 }}>
                      <div>
                        <label style={{ fontSize:11, fontWeight:600, color:'#8E8E93', display:'block', marginBottom:5 }}>Imtihon turi</label>
                        <select className="ps-input" value={form.examType||'IELTS'} onChange={e=>setForm(p=>({...p,examType:e.target.value}))}>
                          <option>IELTS</option><option>TOEFL</option><option>SAT</option>
                        </select>
                      </div>
                      <div>
                        <label style={{ fontSize:11, fontWeight:600, color:'#8E8E93', display:'block', marginBottom:5 }}>Maqsad ball</label>
                        <select className="ps-input" value={form.targetBand||'7.0'} onChange={e=>setForm(p=>({...p,targetBand:e.target.value}))}>
                          {['5.0','5.5','6.0','6.5','7.0','7.5','8.0','8.5','9.0'].map(v=><option key={v}>{v}</option>)}
                        </select>
                      </div>
                      <div>
                        <label style={{ fontSize:11, fontWeight:600, color:'#8E8E93', display:'block', marginBottom:5 }}>Imtihon sanasi</label>
                        <input className="ps-input" type="date" {...inp('examDate')}/>
                      </div>
                    </div>
                  </div>

                  {/* Skills focus */}
                  <div style={{ marginTop:20 }}>
                    <div style={{ fontSize:13, fontWeight:700, color:'#1C1C1E', marginBottom:12 }}>Mashq qilinadigan bo'limlar</div>
                    <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
                      {skills.map(s => {
                        const active = form[s.id] !== false;
                        return (
                          <div key={s.id} onClick={()=>setForm(p=>({...p,[s.id]:!active}))}
                            style={{
                              display:'flex', alignItems:'center', gap:6, padding:'8px 14px',
                              borderRadius:20, cursor:'pointer', transition:'all .15s',
                              background:active?s.color:'rgba(0,0,0,0.04)',
                              color:active?'#fff':'#8E8E93',
                              fontSize:13, fontWeight:600,
                              border:`1.5px solid ${active?s.color:'transparent'}`,
                            }}>
                            {s.icon}{s.label}
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Save */}
                  <div style={{ marginTop:24, display:'flex', justifyContent:'flex-end' }}>
                    <button className="ps-btn" onClick={save}
                      style={{ background:saved?'#34C759':'#007AFF', color:'#fff', padding:'12px 28px', fontSize:15 }}>
                      {saved ? <><CheckCircle size={16}/> Saqlandi!</> : <><Save size={16}/> Saqlash</>}
                    </button>
                  </div>
                </div>
              )}

              {/* ACCOUNT TAB */}
              {tab==='account' && (
                <div style={{ background:'rgba(255,255,255,0.85)', backdropFilter:'blur(16px)', borderRadius:20, padding:28 }}>
                  <h3 style={{ fontSize:18, fontWeight:700, color:'#1C1C1E', margin:'0 0 20px' }}>Hisob ma'lumotlari</h3>
                  <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
                    <div>
                      <label style={{ fontSize:12, fontWeight:600, color:'#8E8E93', display:'block', marginBottom:6 }}>Email</label>
                      <input className="ps-input" {...inp('email')} type="email"/>
                    </div>
                    <div>
                      <label style={{ fontSize:12, fontWeight:600, color:'#8E8E93', display:'block', marginBottom:6 }}>Telefon</label>
                      <input className="ps-input" {...inp('phone')} placeholder="+998 90 000 00 00"/>
                    </div>
                  </div>
                  <div style={{ marginTop:24, display:'flex', justifyContent:'flex-end' }}>
                    <button className="ps-btn" onClick={save} style={{ background:saved?'#34C759':'#007AFF', color:'#fff', padding:'12px 28px' }}>
                      {saved?<><CheckCircle size={16}/>Saqlandi!</>:<><Save size={16}/>Saqlash</>}
                    </button>
                  </div>
                </div>
              )}

              {/* SECURITY TAB */}
              {tab==='security' && (
                <div style={{ background:'rgba(255,255,255,0.85)', backdropFilter:'blur(16px)', borderRadius:20, padding:28 }}>
                  <h3 style={{ fontSize:18, fontWeight:700, color:'#1C1C1E', margin:'0 0 20px' }}>Parolni o'zgartirish</h3>
                  <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
                    {[
                      { key:'cur', label:"Joriy parol" },
                      { key:'new', label:"Yangi parol" },
                      { key:'con', label:"Yangi parolni takrorlang" },
                    ].map(f => (
                      <div key={f.key}>
                        <label style={{ fontSize:12, fontWeight:600, color:'#8E8E93', display:'block', marginBottom:6 }}>{f.label}</label>
                        <div style={{ position:'relative' }}>
                          <input className="ps-input"
                            type={showPass[f.key]?'text':'password'}
                            placeholder="••••••••"
                            style={{ paddingRight:44 }}/>
                          <button onClick={()=>setShowPass(p=>({...p,[f.key]:!p[f.key]}))}
                            style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'#8E8E93' }}>
                            {showPass[f.key]?<EyeOff size={16}/>:<Eye size={16}/>}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop:24, display:'flex', justifyContent:'flex-end' }}>
                    <button className="ps-btn" style={{ background:'#007AFF', color:'#fff', padding:'12px 28px' }}>
                      <Lock size={15}/> Parolni yangilash
                    </button>
                  </div>
                </div>
              )}

              {/* NOTIFY TAB */}
              {tab==='notify' && (
                <div style={{ background:'rgba(255,255,255,0.85)', backdropFilter:'blur(16px)', borderRadius:20, padding:28 }}>
                  <h3 style={{ fontSize:18, fontWeight:700, color:'#1C1C1E', margin:'0 0 20px' }}>Bildirishnomalar</h3>
                  {[
                    { key:'notifAll',   label:'Barcha bildirishnomalar',  sub:'Push va email xabarlar' },
                    { key:'notifChat',  label:'Chat xabarlari',           sub:'Yangi xabar kelganda' },
                    { key:'notifStudy', label:'O\'quv eslatmalari',       sub:'Kunlik mashq eslatmasi' },
                    { key:'notifScore', label:'Ball yangilanishi',        sub:'Natijalar chiqanda' },
                  ].map(n => (
                    <div key={n.key} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'14px 0', borderBottom:'1px solid rgba(0,0,0,0.05)' }}>
                      <div>
                        <div style={{ fontSize:15, fontWeight:600, color:'#1C1C1E' }}>{n.label}</div>
                        <div style={{ fontSize:12, color:'#8E8E93', marginTop:2 }}>{n.sub}</div>
                      </div>
                      <div onClick={()=>setForm(p=>({...p,[n.key]:!p[n.key]}))}
                        style={{
                          width:50, height:28, borderRadius:14, cursor:'pointer', transition:'background .2s',
                          background:form[n.key]!==false?'#34C759':'rgba(120,120,128,0.16)',
                          position:'relative',
                        }}>
                        <div style={{
                          position:'absolute', top:3, transition:'left .2s',
                          left:form[n.key]!==false?24:3,
                          width:22, height:22, borderRadius:'50%', background:'#fff',
                          boxShadow:'0 1px 4px rgba(0,0,0,0.15)',
                        }}/>
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </>
  );
}