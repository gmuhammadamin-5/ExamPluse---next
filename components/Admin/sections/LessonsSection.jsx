"use client";
import React, { useState, useMemo } from 'react';
import { Search, Plus, Trash2, Edit2, Youtube, Eye, EyeOff, ChevronDown, ChevronUp, X, Check } from 'lucide-react';
import { Card, CardHead, Tbl, TRow, ActionBtn, Badge } from '../components/helpers';
import { ConfirmModal } from '../components/ConfirmModal';
import { Pagination, usePagination } from '../components/Pagination';

const CATS = ['Barchasi','IELTS','Cambridge','TOEFL','CEFR','SAT','Umumiy'];
const CAT_COLORS = { IELTS:'#2563eb', Cambridge:'#7c3aed', TOEFL:'#0891b2', CEFR:'#059669', SAT:'#ea580c', Umumiy:'#64748b' };

let _id = 100;
const INIT_LESSONS = [
  { id:1,  title:"IELTS Writing Task 2 - Essay yozish",     cat:'IELTS',     ytId:'dQw4w9WgXcQ', views:4820, duration:'18:32', visible:true,  order:1  },
  { id:2,  title:"IELTS Speaking - Fluency va Coherence",   cat:'IELTS',     ytId:'dQw4w9WgXcQ', views:3610, duration:'22:15', visible:true,  order:2  },
  { id:3,  title:"IELTS Listening - Multiple Choice",       cat:'IELTS',     ytId:'dQw4w9WgXcQ', views:2940, duration:'15:48', visible:true,  order:3  },
  { id:4,  title:"Cambridge C1 Reading - Gapped Text",      cat:'Cambridge', ytId:'dQw4w9WgXcQ', views:2100, duration:'20:00', visible:true,  order:1  },
  { id:5,  title:"Cambridge B2 Use of English",             cat:'Cambridge', ytId:'dQw4w9WgXcQ', views:1850, duration:'25:10', visible:true,  order:2  },
  { id:6,  title:"TOEFL Integrated Writing",                cat:'TOEFL',     ytId:'dQw4w9WgXcQ', views:1620, duration:'16:40', visible:true,  order:1  },
  { id:7,  title:"TOEFL Speaking - Independent Task",       cat:'TOEFL',     ytId:'dQw4w9WgXcQ', views:1440, duration:'12:55', visible:false, order:2  },
  { id:8,  title:"CEFR B1 Grammar - Past Perfect",          cat:'CEFR',      ytId:'dQw4w9WgXcQ', views:980,  duration:'14:20', visible:true,  order:1  },
  { id:9,  title:"SAT Math - Algebra Asoslari",             cat:'SAT',       ytId:'dQw4w9WgXcQ', views:2200, duration:'28:00', visible:true,  order:1  },
  { id:10, title:"SAT Evidence-Based Reading",              cat:'SAT',       ytId:'dQw4w9WgXcQ', views:1950, duration:'23:30', visible:true,  order:2  },
  { id:11, title:"Akademik so'z boyligini oshirish",        cat:'Umumiy',    ytId:'dQw4w9WgXcQ', views:3300, duration:'19:45', visible:true,  order:1  },
  { id:12, title:"IELTS Reading - True/False/Not Given",    cat:'IELTS',     ytId:'dQw4w9WgXcQ', views:2680, duration:'17:15', visible:false, order:4  },
];

const EMPTY_FORM = { title:'', cat:'IELTS', ytId:'', duration:'', order:'', visible:true };

function YtThumb({ ytId, size=50 }) {
  return (
    <div style={{ position:'relative', width:size*1.78, height:size, borderRadius:10, overflow:'hidden', flexShrink:0, background:'#0f172a' }}>
      <img src={`https://img.youtube.com/vi/${ytId}/mqdefault.jpg`} alt=""
        style={{ width:'100%', height:'100%', objectFit:'cover', opacity:.85 }}
        onError={e=>{ e.target.style.display='none'; }}/>
      <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
        <div style={{ width:20, height:20, borderRadius:'50%', background:'rgba(255,0,0,0.85)', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <div style={{ width:0, height:0, borderTop:'5px solid transparent', borderBottom:'5px solid transparent', borderLeft:'8px solid #fff', marginLeft:2 }}/>
        </div>
      </div>
    </div>
  );
}

function LessonForm({ initial, onSave, onCancel, title }) {
  const [form, setForm] = useState(initial);
  const set = (k,v) => setForm(f => ({ ...f, [k]:v }));

  const inputStyle = { width:'100%', padding:'9px 12px', border:'1.5px solid #f1f5f9', borderRadius:10, fontSize:13, outline:'none', boxSizing:'border-box', background:'#f8fafc', fontFamily:'inherit' };
  const labelStyle = { fontSize:11, fontWeight:700, color:'#64748b', marginBottom:4, display:'block' };

  return (
    <div style={{ background:'#f8fafc', border:'1.5px solid #f1f5f9', borderRadius:16, padding:20, marginBottom:14 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
        <span style={{ fontSize:14, fontWeight:800, color:'#0f172a' }}>{title}</span>
        <button onClick={onCancel} style={{ background:'none', border:'none', cursor:'pointer', color:'#94a3b8', display:'flex' }}><X size={16}/></button>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:12 }}>
        <div style={{ gridColumn:'span 2' }}>
          <label style={labelStyle}>Dars nomi</label>
          <input value={form.title} onChange={e=>set('title',e.target.value)} placeholder="Masalan: IELTS Writing Task 2..." style={inputStyle}/>
        </div>
        <div>
          <label style={labelStyle}>Kategoriya</label>
          <select value={form.cat} onChange={e=>set('cat',e.target.value)}
            style={{ ...inputStyle, cursor:'pointer' }}>
            {CATS.slice(1).map(c=><option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>YouTube Video ID</label>
          <input value={form.ytId} onChange={e=>set('ytId',e.target.value)} placeholder="dQw4w9WgXcQ" style={inputStyle}/>
        </div>
        <div>
          <label style={labelStyle}>Davomiyligi</label>
          <input value={form.duration} onChange={e=>set('duration',e.target.value)} placeholder="18:32" style={inputStyle}/>
        </div>
        <div>
          <label style={labelStyle}>Tartib raqami</label>
          <input type="number" value={form.order} onChange={e=>set('order',e.target.value)} placeholder="1" style={inputStyle}/>
        </div>
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
        <button onClick={()=>set('visible',!form.visible)}
          style={{ width:40, height:22, borderRadius:11, background:form.visible?'#2563eb':'#e2e8f0', border:'none', cursor:'pointer', position:'relative', transition:'background .2s', flexShrink:0 }}>
          <div style={{ width:18, height:18, borderRadius:'50%', background:'#fff', position:'absolute', top:2, left:form.visible?20:2, transition:'left .2s', boxShadow:'0 1px 4px rgba(0,0,0,0.2)' }}/>
        </button>
        <span style={{ fontSize:12, fontWeight:600, color:'#64748b' }}>{form.visible ? 'Ko\'rinadigan' : 'Yashirin'}</span>
      </div>
      <div style={{ display:'flex', gap:8 }}>
        <button onClick={()=>onSave(form)}
          style={{ display:'flex', alignItems:'center', gap:6, padding:'9px 18px', background:'linear-gradient(135deg,#2563eb,#1d4ed8)', border:'none', borderRadius:10, color:'#fff', fontSize:13, fontWeight:700, cursor:'pointer', fontFamily:'inherit' }}>
          <Check size={14}/>Saqlash
        </button>
        <button onClick={onCancel}
          style={{ padding:'9px 16px', border:'1.5px solid #e2e8f0', borderRadius:10, background:'#fff', fontSize:13, fontWeight:600, color:'#64748b', cursor:'pointer', fontFamily:'inherit' }}>
          Bekor
        </button>
      </div>
    </div>
  );
}

export default function LessonsSection({ toast }) {
  const [lessons, setLessons]   = useState(INIT_LESSONS);
  const [search, setSearch]     = useState('');
  const [cat, setCat]           = useState('Barchasi');
  const [showAdd, setShowAdd]   = useState(false);
  const [editId, setEditId]     = useState(null);
  const [deleteTarget, setDel]  = useState(null);
  const [sortKey, setSortKey]   = useState('order');
  const [sortDir, setSortDir]   = useState('asc');

  const filtered = useMemo(() => {
    let d = [...lessons];
    if (search)          d = d.filter(l => l.title.toLowerCase().includes(search.toLowerCase()));
    if (cat !== 'Barchasi') d = d.filter(l => l.cat === cat);
    d.sort((a,b) => {
      let av = a[sortKey], bv = b[sortKey];
      if (typeof av === 'string') return sortDir==='asc' ? av.localeCompare(bv) : bv.localeCompare(av);
      return sortDir==='asc' ? av-bv : bv-av;
    });
    return d;
  }, [lessons, search, cat, sortKey, sortDir]);

  const { page, setPage, total, sliced, reset } = usePagination(filtered, 8);

  const toggleSort = key => {
    if (sortKey === key) setSortDir(d => d==='asc'?'desc':'asc');
    else { setSortKey(key); setSortDir('asc'); }
    reset();
  };
  const SortIcon = ({ k }) => sortKey===k
    ? (sortDir==='asc' ? <ChevronUp size={13}/> : <ChevronDown size={13}/>)
    : <ChevronDown size={13} style={{ opacity:.3 }}/>;

  const handleAdd = (form) => {
    if (!form.title.trim() || !form.ytId.trim()) { toast("Nomi va YouTube ID kiritilishi shart", 'error'); return; }
    setLessons(ls => [...ls, { ...form, id:++_id, views:0, order:Number(form.order)||ls.length+1 }]);
    setShowAdd(false);
    toast('Dars qo\'shildi ✓');
  };

  const handleEdit = (form) => {
    if (!form.title.trim() || !form.ytId.trim()) { toast("Nomi va YouTube ID kiritilishi shart", 'error'); return; }
    setLessons(ls => ls.map(l => l.id===editId ? { ...l, ...form, order:Number(form.order)||l.order } : l));
    setEditId(null);
    toast('Dars yangilandi ✓');
  };

  const handleDelete = () => {
    setLessons(ls => ls.filter(l => l.id !== deleteTarget.id));
    setDel(null);
    toast('Dars o\'chirildi');
  };

  const toggleVisible = (id) => {
    setLessons(ls => ls.map(l => l.id===id ? { ...l, visible:!l.visible } : l));
    const lesson = lessons.find(l=>l.id===id);
    toast(lesson?.visible ? 'Dars yashirildi' : 'Dars ko\'rsatildi');
  };

  const editLesson = lessons.find(l=>l.id===editId);

  return (
    <div style={{ display:'flex',flexDirection:'column',gap:14 }}>
      {/* stats row */}
      <div style={{ display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12 }}>
        {[
          { label:'Jami darslar',   val:lessons.length,                          color:'#2563eb' },
          { label:'Ko\'rinadigan',  val:lessons.filter(l=>l.visible).length,     color:'#059669' },
          { label:'Yashirin',       val:lessons.filter(l=>!l.visible).length,    color:'#f59e0b' },
          { label:'Jami ko\'rishlar', val:lessons.reduce((s,l)=>s+l.views,0).toLocaleString(), color:'#7c3aed' },
        ].map(s => (
          <Card key={s.label}>
            <div style={{ padding:'14px 18px' }}>
              <div style={{ fontSize:11,color:'#94a3b8',fontWeight:600,marginBottom:4 }}>{s.label}</div>
              <div style={{ fontSize:24,fontWeight:900,color:s.color }}>{s.val}</div>
            </div>
          </Card>
        ))}
      </div>

      <Card>
        {/* toolbar */}
        <div style={{ padding:'14px 18px',borderBottom:'1.5px solid #f8fafc',display:'flex',gap:10,flexWrap:'wrap',alignItems:'center' }}>
          <div style={{ position:'relative',flex:1,minWidth:180 }}>
            <Search size={13} color="#94a3b8" style={{ position:'absolute',left:11,top:'50%',transform:'translateY(-50%)' }}/>
            <input value={search} onChange={e=>{setSearch(e.target.value);reset();}}
              placeholder="Dars qidirish..."
              style={{ width:'100%',padding:'8px 12px 8px 32px',border:'1.5px solid #f1f5f9',borderRadius:10,fontSize:13,outline:'none',boxSizing:'border-box',background:'#f8fafc' }}/>
          </div>
          <select value={cat} onChange={e=>{setCat(e.target.value);reset();}}
            style={{ padding:'8px 12px',border:'1.5px solid #f1f5f9',borderRadius:10,fontSize:13,outline:'none',background:'#f8fafc',cursor:'pointer' }}>
            {CATS.map(c=><option key={c}>{c}</option>)}
          </select>
          <button onClick={()=>{setShowAdd(true);setEditId(null);}}
            style={{ display:'flex',alignItems:'center',gap:6,padding:'8px 16px',background:'linear-gradient(135deg,#2563eb,#1d4ed8)',border:'none',borderRadius:10,color:'#fff',fontSize:13,fontWeight:700,cursor:'pointer',fontFamily:'inherit' }}>
            <Plus size={14}/>Dars qo'shish
          </button>
        </div>

        <div style={{ padding:'14px 18px 0' }}>
          {showAdd && <LessonForm initial={EMPTY_FORM} onSave={handleAdd} onCancel={()=>setShowAdd(false)} title="Yangi dars qo'shish"/>}
          {editLesson && <LessonForm key={editId} initial={editLesson} onSave={handleEdit} onCancel={()=>setEditId(null)} title="Darsni tahrirlash"/>}
        </div>

        <Tbl headers={[
          { label:'Video' },
          { label:'Nomi', sortKey:'title', onClick:()=>toggleSort('title'), Icon:()=><SortIcon k="title"/> },
          { label:'Kategoriya', sortKey:'cat', onClick:()=>toggleSort('cat'), Icon:()=><SortIcon k="cat"/> },
          { label:'Davomiylik' },
          { label:"Ko'rishlar", sortKey:'views', onClick:()=>toggleSort('views'), Icon:()=><SortIcon k="views"/> },
          { label:'Tartib', sortKey:'order', onClick:()=>toggleSort('order'), Icon:()=><SortIcon k="order"/> },
          { label:'Holat' },
          { label:'Amallar', width:90 },
        ]}>
          {sliced.map(l => (
            <TRow key={l.id}>
              <td style={{ padding:'10px 16px' }}><YtThumb ytId={l.ytId}/></td>
              <td style={{ padding:'10px 16px',maxWidth:240 }}>
                <div style={{ fontSize:13,fontWeight:700,color:'#0f172a',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis' }}>{l.title}</div>
              </td>
              <td style={{ padding:'10px 16px' }}>
                <span style={{ fontSize:11,fontWeight:700,color:CAT_COLORS[l.cat]||'#64748b',background:`${CAT_COLORS[l.cat]||'#64748b'}18`,borderRadius:7,padding:'3px 9px' }}>{l.cat}</span>
              </td>
              <td style={{ padding:'10px 16px',fontSize:12,color:'#64748b' }}>{l.duration}</td>
              <td style={{ padding:'10px 16px',fontSize:13,fontWeight:700,color:'#0f172a' }}>{l.views.toLocaleString()}</td>
              <td style={{ padding:'10px 16px',fontSize:13,fontWeight:700,color:'#64748b',textAlign:'center' }}>{l.order}</td>
              <td style={{ padding:'10px 16px' }}>
                <span style={{ fontSize:11,fontWeight:700,color:l.visible?'#059669':'#94a3b8',background:l.visible?'#dcfce7':'#f1f5f9',borderRadius:7,padding:'3px 9px' }}>
                  {l.visible ? "Ko'rinadigan" : 'Yashirin'}
                </span>
              </td>
              <td style={{ padding:'10px 16px' }}>
                <div style={{ display:'flex',gap:6 }}>
                  <ActionBtn icon={l.visible?EyeOff:Eye} color={l.visible?'#94a3b8':'#059669'} title={l.visible?'Yashirish':'Ko\'rsatish'} onClick={()=>toggleVisible(l.id)}/>
                  <ActionBtn icon={Edit2} color="#2563eb" title="Tahrirlash" onClick={()=>{setEditId(l.id);setShowAdd(false);}}/>
                  <ActionBtn icon={Trash2} color="#dc2626" title="O'chirish" onClick={()=>setDel(l)}/>
                </div>
              </td>
            </TRow>
          ))}
        </Tbl>

        <Pagination page={page} total={total} perPage={8} onChange={setPage}/>
      </Card>

      <ConfirmModal
        open={!!deleteTarget}
        title="Darsni o'chirish"
        message={`"${deleteTarget?.title}" darsini o'chirishni tasdiqlaysizmi?`}
        confirmLabel="O'chirish"
        danger
        onConfirm={handleDelete}
        onCancel={()=>setDel(null)}
      />
    </div>
  );
}
