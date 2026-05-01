"use client";
import React, { useState, useMemo, useEffect } from 'react';
import { Search, Download, ChevronUp, ChevronDown, Eye, X } from 'lucide-react';
import { Card, CardHead, Badge, Avatar, Stars, Tbl, TRow, ActionBtn, downloadCSV } from '../components/helpers';
import { Pagination, usePagination } from '../components/Pagination';

const EXAMS = ['Barchasi','IELTS','Cambridge','TOEFL','CEFR','SAT'];
const TYPES = ['Barchasi','Full Mock','Practice','Skill'];

const INIT_RESULTS = [
  { id:1,  user:'Zulfiya Hamidova',   avatar:'ZH', exam:'IELTS',     type:'Full Mock',  score:8.0,  band:'C2', date:'2024-12-15', duration:'2h 45m', sections:{L:8.5,R:8.0,W:7.5,S:8.0}, passed:true  },
  { id:2,  user:'Otabek Normatov',    avatar:'ON', exam:'TOEFL',     type:'Full Mock',  score:110,  band:'B2', date:'2024-12-14', duration:'3h 00m', sections:{L:28,R:29,W:26,S:27},   passed:true  },
  { id:3,  user:'Malika Yusupova',    avatar:'MY', exam:'Cambridge',  type:'Practice',   score:74,   band:'B2', date:'2024-12-13', duration:'1h 20m', sections:{L:18,R:20,W:18,S:18},   passed:false },
  { id:4,  user:'Jasur Toshmatov',    avatar:'JT', exam:'IELTS',     type:'Skill',      score:7.5,  band:'C1', date:'2024-12-13', duration:'1h 00m', sections:{L:7.5,R:7.5,W:null,S:null}, passed:true },
  { id:5,  user:'Nilufar Rashidova',  avatar:'NR', exam:'CEFR',      type:'Full Mock',  score:82,   band:'B2', date:'2024-12-12', duration:'2h 00m', sections:{L:22,R:21,W:20,S:19},   passed:true  },
  { id:6,  user:'Abdurakhmon J.',     avatar:'AJ', exam:'SAT',       type:'Full Mock',  score:1320, band:null, date:'2024-12-12', duration:'3h 15m', sections:{L:680,R:640,W:null,S:null}, passed:true },
  { id:7,  user:'Dilorom Karimova',   avatar:'DK', exam:'IELTS',     type:'Full Mock',  score:6.0,  band:'B2', date:'2024-12-11', duration:'2h 45m', sections:{L:6.0,R:5.5,W:6.0,S:6.5}, passed:false },
  { id:8,  user:'Sardor Yusupov',     avatar:'SY', exam:'Cambridge',  type:'Practice',   score:88,   band:'C1', date:'2024-12-10', duration:'1h 30m', sections:{L:22,R:23,W:22,S:21},   passed:true  },
  { id:9,  user:'Feruza Mirzayeva',   avatar:'FM', exam:'TOEFL',     type:'Skill',      score:26,   band:null, date:'2024-12-09', duration:'30m',    sections:{L:26,R:null,W:null,S:null}, passed:true },
  { id:10, user:'Bobur Komilov',      avatar:'BK', exam:'IELTS',     type:'Full Mock',  score:7.0,  band:'C1', date:'2024-12-08', duration:'2h 45m', sections:{L:7.0,R:7.5,W:6.5,S:7.0}, passed:true  },
  { id:11, user:'Lola Tursunova',     avatar:'LT', exam:'SAT',       type:'Practice',   score:1100, band:null, date:'2024-12-07', duration:'2h 00m', sections:{L:560,R:540,W:null,S:null}, passed:false },
  { id:12, user:'Nodir Hasanov',      avatar:'NH', exam:'CEFR',      type:'Full Mock',  score:71,   band:'B1', date:'2024-12-06', duration:'2h 00m', sections:{L:19,R:18,W:17,S:17},   passed:false },
  { id:13, user:'Kamola Ergasheva',   avatar:'KE', exam:'IELTS',     type:'Skill',      score:8.0,  band:'C2', date:'2024-12-05', duration:'1h 00m', sections:{L:null,R:8.0,W:null,S:null}, passed:true },
  { id:14, user:'Ulugbek Rakhimov',   avatar:'UR', exam:'Cambridge',  type:'Full Mock',  score:60,   band:'B1', date:'2024-12-04', duration:'2h 30m', sections:{L:14,R:16,W:15,S:15},   passed:false },
  { id:15, user:'Shakhnoza Kenja',    avatar:'SK', exam:'TOEFL',     type:'Full Mock',  score:95,   band:'B2', date:'2024-12-03', duration:'3h 00m', sections:{L:24,R:25,W:23,S:23},   passed:true  },
];

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const adminFetch = path => fetch(API_URL + path, {
  headers: { Authorization: `Bearer ${sessionStorage.getItem('ep_admin_token')}` },
});
const mapResult = r => ({
  id: r.id,
  user: r.user,
  avatar: r.user.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase(),
  exam: r.exam || 'IELTS',
  type: r.section || 'Practice',
  score: r.score,
  band: r.band || null,
  date: r.date ? r.date.split('T')[0] : '—',
  duration: r.duration || '—',
  sections: {},
  passed: r.score >= 6,
});

const EXAM_COLORS = { IELTS:'#2563eb', Cambridge:'#7c3aed', TOEFL:'#0891b2', CEFR:'#059669', SAT:'#ea580c' };
const SECTION_LABELS = { L:'Listening', R:'Reading', W:'Writing', S:'Speaking' };

function ScoreBadge({ exam, score }) {
  const c = EXAM_COLORS[exam] || '#64748b';
  return (
    <span style={{ fontWeight:800, color:c, background:`${c}18`, border:`1px solid ${c}33`, borderRadius:9, padding:'3px 10px', fontSize:13 }}>
      {score}
    </span>
  );
}

function DetailModal({ result, onClose }) {
  if (!result) return null;
  const c = EXAM_COLORS[result.exam] || '#2563eb';
  const secs = Object.entries(result.sections).filter(([,v]) => v !== null);
  return (
    <div style={{ position:'fixed',inset:0,zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center',background:'rgba(15,23,42,0.55)',backdropFilter:'blur(4px)' }}
      onClick={onClose}>
      <div style={{ background:'#fff',borderRadius:20,padding:28,width:480,maxWidth:'calc(100vw - 32px)',boxShadow:'0 24px 60px rgba(0,0,0,0.2)',position:'relative' }}
        onClick={e=>e.stopPropagation()}>
        <button onClick={onClose} style={{ position:'absolute',top:14,right:14,background:'#f1f5f9',border:'none',borderRadius:8,width:30,height:30,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer' }}>
          <X size={15} color="#64748b"/>
        </button>
        <div style={{ display:'flex',alignItems:'center',gap:14,marginBottom:20 }}>
          <div style={{ width:48,height:48,borderRadius:14,background:`linear-gradient(135deg,${c},${c}99)`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,fontWeight:800,color:'#fff' }}>{result.avatar}</div>
          <div>
            <div style={{ fontSize:16,fontWeight:800,color:'#0f172a' }}>{result.user}</div>
            <div style={{ fontSize:12,color:'#94a3b8',marginTop:2 }}>{result.exam} · {result.type} · {result.date}</div>
          </div>
          <div style={{ marginLeft:'auto' }}>
            <ScoreBadge exam={result.exam} score={result.score}/>
          </div>
        </div>

        <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:18 }}>
          {[
            { label:'Umumiy ball', val: result.score },
            { label:'Davomiyligi', val: result.duration },
            { label:'Holat', val: result.passed ? '✅ O\'tdi' : '❌ O\'tmadi' },
            { label:'Band/Level', val: result.band || '—' },
          ].map(({ label, val }) => (
            <div key={label} style={{ background:'#f8fafc',borderRadius:12,padding:'12px 14px' }}>
              <div style={{ fontSize:10,color:'#94a3b8',fontWeight:600,marginBottom:4 }}>{label}</div>
              <div style={{ fontSize:14,fontWeight:800,color:'#0f172a' }}>{val}</div>
            </div>
          ))}
        </div>

        {secs.length > 0 && (
          <div>
            <div style={{ fontSize:12,fontWeight:700,color:'#64748b',marginBottom:10 }}>Bo'limlar bo'yicha</div>
            <div style={{ display:'flex',flexDirection:'column',gap:8 }}>
              {secs.map(([k,v]) => {
                const max = result.exam === 'SAT' ? 800 : result.exam === 'TOEFL' ? 30 : result.exam === 'IELTS' ? 9 : 30;
                const pct = Math.min(100, (Number(v)/max)*100);
                return (
                  <div key={k}>
                    <div style={{ display:'flex',justifyContent:'space-between',marginBottom:4 }}>
                      <span style={{ fontSize:12,fontWeight:600,color:'#0f172a' }}>{SECTION_LABELS[k]}</span>
                      <span style={{ fontSize:12,fontWeight:800,color:c }}>{v}</span>
                    </div>
                    <div style={{ height:6,background:'#f1f5f9',borderRadius:99,overflow:'hidden' }}>
                      <div style={{ width:`${pct}%`,height:'100%',background:c,borderRadius:99,transition:'width .6s' }}/>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ResultsSection({ toast }) {
  const [results, setResults] = useState(INIT_RESULTS);
  const [search, setSearch]   = useState('');
  const [exam, setExam]       = useState('Barchasi');
  const [type, setType]       = useState('Barchasi');
  const [dateFrom, setFrom]   = useState('');
  const [dateTo, setTo]       = useState('');
  const [sortKey, setSortKey] = useState('date');
  const [sortDir, setSortDir] = useState('desc');
  const [detail, setDetail]   = useState(null);

  useEffect(() => {
    adminFetch('/api/dashboard/admin/results')
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data && data.length) setResults(data.map(mapResult)); })
      .catch(() => {});
  }, []);

  const filtered = useMemo(() => {
    let d = [...results];
    if (search)          d = d.filter(r => r.user.toLowerCase().includes(search.toLowerCase()));
    if (exam !== 'Barchasi') d = d.filter(r => r.exam === exam);
    if (type !== 'Barchasi') d = d.filter(r => r.type === type);
    if (dateFrom)        d = d.filter(r => r.date >= dateFrom);
    if (dateTo)          d = d.filter(r => r.date <= dateTo);
    d.sort((a,b) => {
      let av = a[sortKey], bv = b[sortKey];
      if (typeof av === 'string') return sortDir==='asc' ? av.localeCompare(bv) : bv.localeCompare(av);
      return sortDir==='asc' ? av-bv : bv-av;
    });
    return d;
  }, [search, exam, type, dateFrom, dateTo, sortKey, sortDir]);

  const { page, setPage, total, sliced, reset } = usePagination(filtered, 8);
  const toggleSort = key => {
    if (sortKey === key) setSortDir(d => d==='asc'?'desc':'asc');
    else { setSortKey(key); setSortDir('desc'); }
    reset();
  };
  const SortIcon = ({ k }) => sortKey===k
    ? (sortDir==='asc' ? <ChevronUp size={13}/> : <ChevronDown size={13}/>)
    : <ChevronDown size={13} style={{ opacity:.3 }}/>;

  const handleExport = () => {
    downloadCSV('natijalar.csv',
      ['#','Foydalanuvchi','Exam','Tur','Ball','Holat','Sana','Davomiylik'],
      filtered.map((r,i) => [i+1, r.user, r.exam, r.type, r.score, r.passed?'O\'tdi':'O\'tmadi', r.date, r.duration])
    );
    toast('CSV yuklandi ✓');
  };

  const stats = useMemo(() => ({
    total: INIT_RESULTS.length,
    passed: INIT_RESULTS.filter(r=>r.passed).length,
    avgScore: (INIT_RESULTS.reduce((s,r)=>{
      const norm = r.exam==='IELTS'?r.score*100/9 : r.exam==='TOEFL'?r.score*100/120 : r.exam==='SAT'?r.score*100/1600 : r.score;
      return s+norm;
    },0)/INIT_RESULTS.length).toFixed(1),
  }), []);

  return (
    <div style={{ display:'flex',flexDirection:'column',gap:16 }}>
      {/* stat row */}
      <div style={{ display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12 }}>
        {[
          { label:'Jami natijalar', val:stats.total,  sub:'Barcha vaqt', color:'#2563eb' },
          { label:"O'tganlar",      val:stats.passed, sub:`${Math.round(stats.passed/stats.total*100)}% o'tish darajasi`, color:'#059669' },
          { label:"O'rtacha ball",  val:stats.avgScore+'%', sub:'Normalizatsiya qilingan', color:'#f59e0b' },
        ].map(s => (
          <Card key={s.label}>
            <div style={{ padding:'16px 20px' }}>
              <div style={{ fontSize:11,color:'#94a3b8',fontWeight:600,marginBottom:4 }}>{s.label}</div>
              <div style={{ fontSize:26,fontWeight:900,color:s.color }}>{s.val}</div>
              <div style={{ fontSize:11,color:'#94a3b8',marginTop:2 }}>{s.sub}</div>
            </div>
          </Card>
        ))}
      </div>

      <Card>
        {/* filters */}
        <div style={{ padding:'16px 18px',borderBottom:'1.5px solid #f8fafc',display:'flex',gap:10,flexWrap:'wrap',alignItems:'center' }}>
          <div style={{ position:'relative',flex:'1',minWidth:180 }}>
            <Search size={13} color="#94a3b8" style={{ position:'absolute',left:11,top:'50%',transform:'translateY(-50%)' }}/>
            <input value={search} onChange={e=>{setSearch(e.target.value);reset();}}
              placeholder="Foydalanuvchi qidirish..."
              style={{ width:'100%',padding:'8px 12px 8px 32px',border:'1.5px solid #f1f5f9',borderRadius:10,fontSize:13,outline:'none',boxSizing:'border-box',background:'#f8fafc' }}/>
          </div>
          {[['exam',exam,setExam,EXAMS],['type',type,setType,TYPES]].map(([id,val,set,opts]) => (
            <select key={id} value={val} onChange={e=>{set(e.target.value);reset();}}
              style={{ padding:'8px 12px',border:'1.5px solid #f1f5f9',borderRadius:10,fontSize:13,outline:'none',background:'#f8fafc',cursor:'pointer' }}>
              {opts.map(o=><option key={o}>{o}</option>)}
            </select>
          ))}
          <input type="date" value={dateFrom} onChange={e=>{setFrom(e.target.value);reset();}}
            style={{ padding:'8px 10px',border:'1.5px solid #f1f5f9',borderRadius:10,fontSize:12,outline:'none',background:'#f8fafc' }}/>
          <span style={{ color:'#94a3b8',fontSize:12 }}>—</span>
          <input type="date" value={dateTo} onChange={e=>{setTo(e.target.value);reset();}}
            style={{ padding:'8px 10px',border:'1.5px solid #f1f5f9',borderRadius:10,fontSize:12,outline:'none',background:'#f8fafc' }}/>
          <button onClick={handleExport}
            style={{ display:'flex',alignItems:'center',gap:6,padding:'8px 14px',background:'linear-gradient(135deg,#059669,#047857)',border:'none',borderRadius:10,color:'#fff',fontSize:12,fontWeight:700,cursor:'pointer',fontFamily:'inherit' }}>
            <Download size={13}/>CSV
          </button>
        </div>

        {/* table */}
        <Tbl headers={[
          { label:'#', width:40 },
          { label:'Foydalanuvchi', sortKey:'user', onClick:()=>toggleSort('user'), Icon:()=><SortIcon k="user"/> },
          { label:'Exam', sortKey:'exam', onClick:()=>toggleSort('exam'), Icon:()=><SortIcon k="exam"/> },
          { label:'Tur' },
          { label:'Ball', sortKey:'score', onClick:()=>toggleSort('score'), Icon:()=><SortIcon k="score"/> },
          { label:'Holat' },
          { label:'Sana', sortKey:'date', onClick:()=>toggleSort('date'), Icon:()=><SortIcon k="date"/> },
          { label:'Davom.' },
          { label:'Ko\'rish', width:70 },
        ]}>
          {sliced.map((r, i) => (
            <TRow key={r.id}>
              <td style={{ padding:'10px 16px',fontSize:12,color:'#94a3b8',fontWeight:600 }}>{(page-1)*8+i+1}</td>
              <td style={{ padding:'10px 16px' }}>
                <div style={{ display:'flex',alignItems:'center',gap:9 }}>
                  <div style={{ width:30,height:30,borderRadius:9,background:`linear-gradient(135deg,${EXAM_COLORS[r.exam]||'#64748b'},${EXAM_COLORS[r.exam]||'#64748b'}88)`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:800,color:'#fff',flexShrink:0 }}>{r.avatar}</div>
                  <span style={{ fontSize:13,fontWeight:700,color:'#0f172a' }}>{r.user}</span>
                </div>
              </td>
              <td style={{ padding:'10px 16px' }}>
                <span style={{ fontSize:12,fontWeight:700,color:EXAM_COLORS[r.exam],background:`${EXAM_COLORS[r.exam]}18`,borderRadius:7,padding:'3px 9px' }}>{r.exam}</span>
              </td>
              <td style={{ padding:'10px 16px',fontSize:12,color:'#64748b' }}>{r.type}</td>
              <td style={{ padding:'10px 16px' }}><ScoreBadge exam={r.exam} score={r.score}/></td>
              <td style={{ padding:'10px 16px' }}>
                <span style={{ fontSize:11,fontWeight:700,color:r.passed?'#059669':'#dc2626',background:r.passed?'#dcfce7':'#fee2e2',borderRadius:7,padding:'3px 9px' }}>
                  {r.passed?"O'tdi":"O'tmadi"}
                </span>
              </td>
              <td style={{ padding:'10px 16px',fontSize:12,color:'#64748b' }}>{r.date}</td>
              <td style={{ padding:'10px 16px',fontSize:12,color:'#64748b' }}>{r.duration}</td>
              <td style={{ padding:'10px 16px' }}>
                <ActionBtn icon={Eye} color="#2563eb" title="Ko'rish" onClick={()=>setDetail(r)}/>
              </td>
            </TRow>
          ))}
        </Tbl>

        <Pagination page={page} total={total} perPage={8} onChange={setPage}/>
      </Card>

      <DetailModal result={detail} onClose={()=>setDetail(null)}/>
    </div>
  );
}
