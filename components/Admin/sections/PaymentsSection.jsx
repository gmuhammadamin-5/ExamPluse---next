"use client";
import React, { useState, useMemo } from 'react';
import { Search, Download, ChevronUp, ChevronDown, DollarSign, TrendingUp, Users, CreditCard } from 'lucide-react';
import { Card, CardHead, SparkLine, Tbl, TRow, ActionBtn, downloadCSV } from '../components/helpers';
import { Pagination, usePagination } from '../components/Pagination';

const METHODS = ['Barchasi','Payme','Click','Uzcard','Humo','Visa'];
const STATUSES = ['Barchasi','Muvaffaqiyatli','Kutilmoqda','Rad etilgan'];
const PLANS = ['Barchasi','PRO 1 oy','PRO 3 oy','PRO 1 yil'];

const METHOD_COLORS = { Payme:'#00AAFF', Click:'#2BC8B2', Uzcard:'#E94B35', Humo:'#7B5EA7', Visa:'#1A1F71' };
const STATUS_COLORS = { 'Muvaffaqiyatli':'#059669', 'Kutilmoqda':'#f59e0b', 'Rad etilgan':'#dc2626' };
const STATUS_BG    = { 'Muvaffaqiyatli':'#dcfce7', 'Kutilmoqda':'#fef3c7', 'Rad etilgan':'#fee2e2' };

const INIT_TXN = [
  { id:'TXN-001', user:'Zulfiya Hamidova',   avatar:'ZH', plan:'PRO 1 oy',   amount:49900,  method:'Payme',  status:'Muvaffaqiyatli', date:'2024-12-15' },
  { id:'TXN-002', user:'Otabek Normatov',    avatar:'ON', plan:'PRO 3 oy',   amount:129900, method:'Click',  status:'Muvaffaqiyatli', date:'2024-12-14' },
  { id:'TXN-003', user:'Malika Yusupova',    avatar:'MY', plan:'PRO 1 oy',   amount:49900,  method:'Uzcard', status:'Kutilmoqda',     date:'2024-12-14' },
  { id:'TXN-004', user:'Jasur Toshmatov',    avatar:'JT', plan:'PRO 1 yil',  amount:399900, method:'Visa',   status:'Muvaffaqiyatli', date:'2024-12-13' },
  { id:'TXN-005', user:'Nilufar Rashidova',  avatar:'NR', plan:'PRO 1 oy',   amount:49900,  method:'Payme',  status:'Muvaffaqiyatli', date:'2024-12-13' },
  { id:'TXN-006', user:'Abdurakhmon J.',     avatar:'AJ', plan:'PRO 3 oy',   amount:129900, method:'Click',  status:'Rad etilgan',    date:'2024-12-12' },
  { id:'TXN-007', user:'Dilorom Karimova',   avatar:'DK', plan:'PRO 1 oy',   amount:49900,  method:'Humo',   status:'Muvaffaqiyatli', date:'2024-12-12' },
  { id:'TXN-008', user:'Sardor Yusupov',     avatar:'SY', plan:'PRO 1 yil',  amount:399900, method:'Payme',  status:'Muvaffaqiyatli', date:'2024-12-11' },
  { id:'TXN-009', user:'Feruza Mirzayeva',   avatar:'FM', plan:'PRO 1 oy',   amount:49900,  method:'Click',  status:'Muvaffaqiyatli', date:'2024-12-10' },
  { id:'TXN-010', user:'Bobur Komilov',      avatar:'BK', plan:'PRO 3 oy',   amount:129900, method:'Uzcard', status:'Muvaffaqiyatli', date:'2024-12-09' },
  { id:'TXN-011', user:'Lola Tursunova',     avatar:'LT', plan:'PRO 1 oy',   amount:49900,  method:'Visa',   status:'Kutilmoqda',     date:'2024-12-08' },
  { id:'TXN-012', user:'Nodir Hasanov',      avatar:'NH', plan:'PRO 1 oy',   amount:49900,  method:'Payme',  status:'Muvaffaqiyatli', date:'2024-12-07' },
  { id:'TXN-013', user:'Kamola Ergasheva',   avatar:'KE', plan:'PRO 3 oy',   amount:129900, method:'Click',  status:'Muvaffaqiyatli', date:'2024-12-06' },
  { id:'TXN-014', user:'Ulugbek Rakhimov',   avatar:'UR', plan:'PRO 1 yil',  amount:399900, method:'Humo',   status:'Rad etilgan',    date:'2024-12-05' },
  { id:'TXN-015', user:'Shakhnoza Kenja',    avatar:'SK', plan:'PRO 1 oy',   amount:49900,  method:'Payme',  status:'Muvaffaqiyatli', date:'2024-12-04' },
  { id:'TXN-016', user:'Timur Akhmedov',     avatar:'TA', plan:'PRO 3 oy',   amount:129900, method:'Click',  status:'Muvaffaqiyatli', date:'2024-12-03' },
  { id:'TXN-017', user:'Barno Sodiqova',     avatar:'BS', plan:'PRO 1 oy',   amount:49900,  method:'Uzcard', status:'Muvaffaqiyatli', date:'2024-12-02' },
  { id:'TXN-018', user:'Rustam Nazarov',     avatar:'RN', plan:'PRO 1 yil',  amount:399900, method:'Visa',   status:'Muvaffaqiyatli', date:'2024-12-01' },
];

const MONTHLY_REV = [380,520,490,660,720,810,900,980,1050,1120,1180,1280];

function fmt(n) { return n.toLocaleString('uz-UZ') + ' so\'m'; }

export default function PaymentsSection({ toast }) {
  const [search, setSearch]   = useState('');
  const [method, setMethod]   = useState('Barchasi');
  const [status, setStatus]   = useState('Barchasi');
  const [plan,   setPlan]     = useState('Barchasi');
  const [sortKey, setSortKey] = useState('date');
  const [sortDir, setSortDir] = useState('desc');

  const filtered = useMemo(() => {
    let d = [...INIT_TXN];
    if (search)              d = d.filter(t => t.user.toLowerCase().includes(search.toLowerCase()) || t.id.toLowerCase().includes(search.toLowerCase()));
    if (method !== 'Barchasi') d = d.filter(t => t.method === method);
    if (status !== 'Barchasi') d = d.filter(t => t.status === status);
    if (plan   !== 'Barchasi') d = d.filter(t => t.plan === plan);
    d.sort((a,b) => {
      let av = a[sortKey], bv = b[sortKey];
      if (typeof av === 'string') return sortDir==='asc' ? av.localeCompare(bv) : bv.localeCompare(av);
      return sortDir==='asc' ? av-bv : bv-av;
    });
    return d;
  }, [search, method, status, plan, sortKey, sortDir]);

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
    downloadCSV('tolovlar.csv',
      ['ID','Foydalanuvchi','Tarif','Miqdor','Usul','Holat','Sana'],
      filtered.map(t => [t.id, t.user, t.plan, t.amount, t.method, t.status, t.date])
    );
    toast('CSV yuklandi ✓');
  };

  const successTxn = INIT_TXN.filter(t => t.status==='Muvaffaqiyatli');
  const totalRev   = successTxn.reduce((s,t)=>s+t.amount,0);
  const thisMonth  = successTxn.filter(t=>t.date>='2024-12-01').reduce((s,t)=>s+t.amount,0);

  const methodDist = METHODS.slice(1).map(m => ({
    m, count: INIT_TXN.filter(t=>t.method===m).length,
    rev: INIT_TXN.filter(t=>t.method===m&&t.status==='Muvaffaqiyatli').reduce((s,t)=>s+t.amount,0),
  }));

  return (
    <div style={{ display:'flex',flexDirection:'column',gap:16 }}>
      {/* stat cards */}
      <div style={{ display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12 }}>
        {[
          { label:'Jami daromad',    val:fmt(totalRev),           Icon:DollarSign,  color:'#059669', bg:'#ecfdf5', data:[300,420,380,500,560,650,700,760,800,850,900,980] },
          { label:'Bu oy',           val:fmt(thisMonth),          Icon:TrendingUp,  color:'#2563eb', bg:'#eff6ff', data:[80,100,120,110,140,160,180,170,190,200,210,220]  },
          { label:'Jami tranzaksiya',val:INIT_TXN.length,         Icon:CreditCard,  color:'#7c3aed', bg:'#f5f3ff', data:[5,7,6,9,10,11,13,12,14,15,16,18]                },
          { label:'Muvaffaqiyatli',  val:successTxn.length,       Icon:Users,       color:'#0891b2', bg:'#ecfeff', data:[4,6,5,8,9,10,12,11,13,14,15,16]                 },
        ].map(s => (
          <Card key={s.label}>
            <div style={{ padding:'16px 18px' }}>
              <div style={{ display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:10 }}>
                <div style={{ width:36,height:36,borderRadius:10,background:s.bg,display:'flex',alignItems:'center',justifyContent:'center' }}>
                  <s.Icon size={16} color={s.color}/>
                </div>
              </div>
              <div style={{ fontSize:18,fontWeight:900,color:'#0f172a',marginBottom:2 }}>{s.val}</div>
              <div style={{ fontSize:11,color:'#94a3b8',marginBottom:8 }}>{s.label}</div>
              <SparkLine data={s.data} color={s.color}/>
            </div>
          </Card>
        ))}
      </div>

      {/* method distribution */}
      <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:12 }}>
        <Card>
          <CardHead title="To'lov usullari" sub="Taqsimot"/>
          <div style={{ padding:'14px 18px',display:'flex',flexDirection:'column',gap:10 }}>
            {methodDist.map(({ m, count, rev }) => {
              const c = METHOD_COLORS[m] || '#64748b';
              const pct = Math.round(count/INIT_TXN.length*100);
              return (
                <div key={m}>
                  <div style={{ display:'flex',justifyContent:'space-between',marginBottom:5 }}>
                    <div style={{ display:'flex',alignItems:'center',gap:8 }}>
                      <div style={{ width:8,height:8,borderRadius:'50%',background:c }}/>
                      <span style={{ fontSize:12,fontWeight:700,color:'#0f172a' }}>{m}</span>
                    </div>
                    <span style={{ fontSize:11,color:'#94a3b8' }}>{count} ta · {pct}%</span>
                  </div>
                  <div style={{ height:6,background:'#f1f5f9',borderRadius:99,overflow:'hidden' }}>
                    <div style={{ width:`${pct}%`,height:'100%',background:c,borderRadius:99 }}/>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card>
          <CardHead title="Oylik daromad" sub="So'm · 2024"/>
          <div style={{ padding:'16px 18px',display:'flex',alignItems:'flex-end',gap:5,height:130 }}>
            {MONTHLY_REV.map((v,i) => {
              const max = Math.max(...MONTHLY_REV);
              const MONTHS = ['J','F','M','A','M','I','I','A','S','O','N','D'];
              const isLast = i===MONTHLY_REV.length-1;
              return (
                <div key={i} style={{ flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:3 }}>
                  <div style={{ width:'100%',background:isLast?'linear-gradient(180deg,#2563eb,#60a5fa)':'linear-gradient(180deg,#dbeafe,#bfdbfe)',borderRadius:'4px 4px 0 0',height:`${(v/max)*80}px`,minHeight:3,transition:'height .5s' }}/>
                  <span style={{ fontSize:8,color:'#94a3b8' }}>{MONTHS[i]}</span>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* transactions table */}
      <Card>
        <div style={{ padding:'14px 18px',borderBottom:'1.5px solid #f8fafc',display:'flex',gap:10,flexWrap:'wrap',alignItems:'center' }}>
          <div style={{ position:'relative',flex:1,minWidth:180 }}>
            <Search size={13} color="#94a3b8" style={{ position:'absolute',left:11,top:'50%',transform:'translateY(-50%)' }}/>
            <input value={search} onChange={e=>{setSearch(e.target.value);reset();}}
              placeholder="Foydalanuvchi yoki ID..."
              style={{ width:'100%',padding:'8px 12px 8px 32px',border:'1.5px solid #f1f5f9',borderRadius:10,fontSize:13,outline:'none',boxSizing:'border-box',background:'#f8fafc' }}/>
          </div>
          {[[method,setMethod,METHODS],[status,setStatus,STATUSES],[plan,setPlan,PLANS]].map(([val,set,opts],idx) => (
            <select key={idx} value={val} onChange={e=>{set(e.target.value);reset();}}
              style={{ padding:'8px 12px',border:'1.5px solid #f1f5f9',borderRadius:10,fontSize:13,outline:'none',background:'#f8fafc',cursor:'pointer' }}>
              {opts.map(o=><option key={o}>{o}</option>)}
            </select>
          ))}
          <button onClick={handleExport}
            style={{ display:'flex',alignItems:'center',gap:6,padding:'8px 14px',background:'linear-gradient(135deg,#059669,#047857)',border:'none',borderRadius:10,color:'#fff',fontSize:12,fontWeight:700,cursor:'pointer',fontFamily:'inherit' }}>
            <Download size={13}/>CSV
          </button>
        </div>

        <Tbl headers={[
          { label:'ID' },
          { label:'Foydalanuvchi', sortKey:'user', onClick:()=>toggleSort('user'), Icon:()=><SortIcon k="user"/> },
          { label:'Tarif' },
          { label:'Miqdor', sortKey:'amount', onClick:()=>toggleSort('amount'), Icon:()=><SortIcon k="amount"/> },
          { label:"To'lov usuli" },
          { label:'Holat', sortKey:'status', onClick:()=>toggleSort('status'), Icon:()=><SortIcon k="status"/> },
          { label:'Sana', sortKey:'date', onClick:()=>toggleSort('date'), Icon:()=><SortIcon k="date"/> },
        ]}>
          {sliced.map(t => (
            <TRow key={t.id}>
              <td style={{ padding:'10px 16px',fontSize:11,color:'#94a3b8',fontWeight:700,fontFamily:'monospace' }}>{t.id}</td>
              <td style={{ padding:'10px 16px' }}>
                <div style={{ display:'flex',alignItems:'center',gap:9 }}>
                  <div style={{ width:30,height:30,borderRadius:9,background:'linear-gradient(135deg,#2563eb,#7c3aed)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:800,color:'#fff',flexShrink:0 }}>{t.avatar}</div>
                  <span style={{ fontSize:13,fontWeight:700,color:'#0f172a' }}>{t.user}</span>
                </div>
              </td>
              <td style={{ padding:'10px 16px',fontSize:12,color:'#64748b' }}>{t.plan}</td>
              <td style={{ padding:'10px 16px',fontSize:13,fontWeight:800,color:'#0f172a' }}>{t.amount.toLocaleString()}</td>
              <td style={{ padding:'10px 16px' }}>
                <span style={{ fontSize:11,fontWeight:800,color:METHOD_COLORS[t.method]||'#64748b',background:`${METHOD_COLORS[t.method]||'#64748b'}18`,borderRadius:7,padding:'3px 9px',border:`1px solid ${METHOD_COLORS[t.method]||'#64748b'}33` }}>
                  {t.method}
                </span>
              </td>
              <td style={{ padding:'10px 16px' }}>
                <span style={{ fontSize:11,fontWeight:700,color:STATUS_COLORS[t.status],background:STATUS_BG[t.status],borderRadius:7,padding:'3px 9px' }}>
                  {t.status}
                </span>
              </td>
              <td style={{ padding:'10px 16px',fontSize:12,color:'#64748b' }}>{t.date}</td>
            </TRow>
          ))}
        </Tbl>

        <Pagination page={page} total={total} perPage={8} onChange={setPage}/>
      </Card>
    </div>
  );
}
