"use client";
import React, { useState, useMemo } from 'react';
import { Search, Plus, Eye, Ban, UserCheck, ChevronUp, ChevronDown, X, Check } from 'lucide-react';
import { Avatar, Badge, Plan, Card, CardHead, Tbl, TRow, ActionBtn, Input, Select, Btn } from '../components/helpers';
import { Pagination, usePagination } from '../components/Pagination';
import { ConfirmModal } from '../components/ConfirmModal';

const INIT_USERS = [
  { id:1, name:'Abdurakhmon Jalolov', email:'abdu@mail.com', plan:'PRO',  score:7.5, tests:14, joined:'2024-01-12', last:'2 soat oldin',  status:'active',  avatar:'AJ', paid:120000, country:'🇺🇿' },
  { id:2, name:'Nilufar Rashidova',   email:'nilu@mail.com', plan:'PRO',  score:8.0, tests:22, joined:'2024-02-08', last:'1 kun oldin',   status:'active',  avatar:'NR', paid:240000, country:'🇺🇿' },
  { id:3, name:'Jasur Toshmatov',     email:'jasr@mail.com', plan:'FREE', score:6.0, tests:5,  joined:'2024-03-15', last:'3 kun oldin',   status:'active',  avatar:'JT', paid:0,      country:'🇰🇿' },
  { id:4, name:'Malika Yusupova',     email:'mali@mail.com', plan:'PRO',  score:7.0, tests:18, joined:'2024-01-28', last:'5 soat oldin',  status:'active',  avatar:'MY', paid:120000, country:'🇺🇿' },
  { id:5, name:'Bobur Mirzayev',      email:'bobr@mail.com', plan:'FREE', score:5.5, tests:3,  joined:'2024-04-02', last:'1 hafta oldin', status:'inactive',avatar:'BM', paid:0,      country:'🇺🇿' },
  { id:6, name:'Zulfiya Hamidova',    email:'zulf@mail.com', plan:'PRO',  score:8.5, tests:31, joined:'2023-12-01', last:'Hozir',         status:'active',  avatar:'ZH', paid:360000, country:'🇺🇿' },
  { id:7, name:'Otabek Normatov',     email:'otab@mail.com', plan:'PRO',  score:7.5, tests:9,  joined:'2024-02-20', last:'2 kun oldin',   status:'active',  avatar:'ON', paid:120000, country:'🇹🇯' },
  { id:8, name:'Shahnoza Ergasheva',  email:'shah@mail.com', plan:'FREE', score:6.5, tests:7,  joined:'2024-03-30', last:'4 kun oldin',   status:'banned',  avatar:'SE', paid:0,      country:'🇺🇿' },
  { id:9, name:'Kamol Umarov',        email:'kamo@mail.com', plan:'PRO',  score:7.0, tests:11, joined:'2024-02-14', last:'3 soat oldin',  status:'active',  avatar:'KU', paid:120000, country:'🇺🇿' },
  { id:10,name:'Dilorom Yusupova',    email:'dilo@mail.com', plan:'FREE', score:6.2, tests:4,  joined:'2024-04-10', last:'2 kun oldin',   status:'active',  avatar:'DY', paid:0,      country:'🇺🇿' },
  { id:11,name:'Sherzod Nazarov',     email:'sher@mail.com', plan:'PRO',  score:7.8, tests:19, joined:'2024-01-05', last:'1 soat oldin',  status:'active',  avatar:'SN', paid:240000, country:'🇺🇿' },
  { id:12,name:'Gulnora Karimova',    email:'guln@mail.com', plan:'FREE', score:5.8, tests:2,  joined:'2024-05-01', last:'5 kun oldin',   status:'inactive',avatar:'GK', paid:0,      country:'🇰🇬' },
];

const RESULTS_BY_USER = {
  1: [{ test:'Academic Mock 1', exam:'IELTS', score:'7.0', date:'2024-05-01', L:'7.5',R:'7.0',W:'6.5',S:'7.0', passed:true }],
  2: [{ test:'Academic Mock 2', exam:'IELTS', score:'8.0', date:'2024-05-02', L:'8.5',R:'8.0',W:'7.5',S:'8.0', passed:true }],
  6: [{ test:'C1 Advanced',     exam:'CAMBRIDGE', score:'C1', date:'2024-05-03', L:'—',R:'—',W:'—',S:'—', passed:true }],
};

export default function UsersSection({ toast }) {
  const [users, setUsers]       = useState(INIT_USERS);
  const [q, setQ]               = useState('');
  const [planFilter, setPlan]   = useState('all');
  const [statusFilter, setStatus] = useState('all');
  const [sortKey, setSortKey]   = useState('name');
  const [sortDir, setSortDir]   = useState('asc');
  const [selected, setSelected] = useState(null);
  const [confirm, setConfirm]   = useState(null);
  const [showAdd, setShowAdd]   = useState(false);
  const [newUser, setNewUser]   = useState({ name:'', email:'', plan:'FREE' });

  /* sort */
  const toggleSort = key => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };
  const SortIcon = ({ k }) => sortKey === k
    ? (sortDir === 'asc' ? <ChevronUp size={11} color="#2563eb" /> : <ChevronDown size={11} color="#2563eb" />)
    : <ChevronUp size={11} color="#e2e8f0" />;

  /* filtered + sorted */
  const filtered = useMemo(() => {
    let list = users.filter(u => {
      const matchQ = u.name.toLowerCase().includes(q.toLowerCase()) || u.email.toLowerCase().includes(q.toLowerCase());
      const matchPlan = planFilter === 'all' || u.plan === planFilter;
      const matchStatus = statusFilter === 'all' || u.status === statusFilter;
      return matchQ && matchPlan && matchStatus;
    });
    list = [...list].sort((a, b) => {
      let va = a[sortKey], vb = b[sortKey];
      if (typeof va === 'string') va = va.toLowerCase(), vb = vb.toLowerCase();
      return sortDir === 'asc' ? (va > vb ? 1 : -1) : (va < vb ? 1 : -1);
    });
    return list;
  }, [users, q, planFilter, statusFilter, sortKey, sortDir]);

  const { page, setPage, total, sliced, reset } = usePagination(filtered, 8);

  const handleBan = (u) => {
    setConfirm({
      title: u.status === 'banned' ? 'Bannni ochish' : "Bannlash",
      message: u.status === 'banned'
        ? `${u.name} uchun bannni olib tashlaysizmi?`
        : `${u.name} ni bannlaysizmi? U tizimga kira olmaydi.`,
      danger: u.status !== 'banned',
      onConfirm: () => {
        setUsers(prev => prev.map(x => x.id === u.id
          ? { ...x, status: x.status === 'banned' ? 'active' : 'banned' }
          : x
        ));
        toast(u.status === 'banned' ? `${u.name} banni olib tashlandi` : `${u.name} bannlandi`, u.status === 'banned' ? 'success' : 'warning');
        setConfirm(null);
      },
    });
  };

  const handleAdd = () => {
    if (!newUser.name || !newUser.email) { toast("Ism va email kiritilishi shart", 'error'); return; }
    const initials = newUser.name.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase();
    const added = { ...newUser, id: Date.now(), score: 0, tests: 0, joined: new Date().toISOString().split('T')[0], last: 'Hozir', status: 'active', avatar: initials, paid: 0, country: '🇺🇿' };
    setUsers(prev => [added, ...prev]);
    setNewUser({ name:'', email:'', plan:'FREE' });
    setShowAdd(false);
    toast(`${added.name} qo'shildi`, 'success');
  };

  /* detail view */
  if (selected) {
    const res = RESULTS_BY_USER[selected.id] || [];
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Btn variant="secondary" onClick={() => setSelected(null)} size="sm">← Orqaga</Btn>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Card>
            <div style={{ padding: 22 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
                <Avatar code={selected.avatar} size={52} />
                <div>
                  <div style={{ fontSize: 17, fontWeight: 800, color: '#0f172a' }}>{selected.name}</div>
                  <div style={{ fontSize: 12, color: '#94a3b8' }}>{selected.email}</div>
                  <div style={{ display: 'flex', gap: 7, marginTop: 5 }}>
                    <Plan p={selected.plan} /><Badge type={selected.status} />
                  </div>
                </div>
              </div>
              {[
                ["Mamlakat", selected.country + " Uzbekistan"],
                ["Qo'shilgan", selected.joined],
                ["Oxirgi faollik", selected.last],
                ["Jami to'lov", selected.paid > 0 ? selected.paid.toLocaleString() + " so'm" : "—"],
              ].map(([k, v], i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid #f8fafc' }}>
                  <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>{k}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#0f172a' }}>{v}</span>
                </div>
              ))}
              <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                <Btn variant={selected.status === 'banned' ? 'success' : 'danger'} size="sm" onClick={() => handleBan(selected)}>
                  {selected.status === 'banned' ? <><UserCheck size={13}/>Bannni ochish</> : <><Ban size={13}/>Bannlash</>}
                </Btn>
              </div>
            </div>
          </Card>
          <Card>
            <CardHead title="Statistika" />
            <div style={{ padding: '14px 18px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[
                { l: 'Jami testlar', v: selected.tests, c: '#2563eb' },
                { l: "O'rt. ball", v: selected.score, c: '#059669' },
                { l: 'Mock testlar', v: Math.floor(selected.tests * 0.6), c: '#7c3aed' },
                { l: 'Practice', v: Math.ceil(selected.tests * 0.4), c: '#ea580c' },
              ].map((s, i) => (
                <div key={i} style={{ background: '#f8fafc', borderRadius: 12, padding: 14, textAlign: 'center' }}>
                  <div style={{ fontSize: 22, fontWeight: 900, color: s.c }}>{s.v}</div>
                  <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600, marginTop: 2 }}>{s.l}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
        <Card>
          <CardHead title="Test natijalari" sub={`${res.length} ta`} />
          {res.length > 0
            ? <Tbl headers={['Test', 'Exam', 'Ball', 'L', 'R', 'W', 'S', 'Sana', 'Holat']}>
                {res.map((r, i) => (
                  <TRow key={i} cells={[
                    <span style={{ fontWeight: 600 }}>{r.test}</span>,
                    <span style={{ fontSize: 10, fontWeight: 700, color: '#2563eb', background: '#eff6ff', padding: '2px 7px', borderRadius: 7 }}>{r.exam}</span>,
                    <span style={{ fontWeight: 900, color: r.passed ? '#059669' : '#dc2626', fontSize: 15 }}>{r.score}</span>,
                    r.L, r.R, r.W, r.S,
                    <span style={{ color: '#94a3b8', fontSize: 11 }}>{r.date}</span>,
                    <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20, background: r.passed ? '#dcfce7' : '#fee2e2', color: r.passed ? '#16a34a' : '#dc2626' }}>{r.passed ? "O'tdi" : "O'tmadi"}</span>,
                  ]} />
                ))}
              </Tbl>
            : <div style={{ padding: 32, textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>Hali test topshirilmagan</div>
          }
        </Card>
        <ConfirmModal {...(confirm || {})} open={!!confirm} onCancel={() => setConfirm(null)} />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* add form */}
      {showAdd && (
        <Card>
          <CardHead title="Yangi foydalanuvchi" action={
            <button onClick={() => setShowAdd(false)} style={{ width: 30, height: 30, borderRadius: 8, background: '#fee2e2', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <X size={13} color="#dc2626" />
            </button>
          } />
          <div style={{ padding: '16px 20px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <Input label="To'liq ism" value={newUser.name} onChange={e => setNewUser(p => ({ ...p, name: e.target.value }))} placeholder="Ism Familiya" />
            <Input label="Email" value={newUser.email} onChange={e => setNewUser(p => ({ ...p, email: e.target.value }))} placeholder="email@mail.com" type="email" />
            <Select label="Plan" value={newUser.plan} onChange={e => setNewUser(p => ({ ...p, plan: e.target.value }))} options={['FREE', 'PRO']} />
            <div style={{ gridColumn: '1/-1', display: 'flex', gap: 10 }}>
              <Btn onClick={handleAdd}><Check size={13} />Saqlash</Btn>
              <Btn variant="secondary" onClick={() => setShowAdd(false)}>Bekor</Btn>
            </div>
          </div>
        </Card>
      )}

      <Card>
        <CardHead
          title="Foydalanuvchilar"
          sub={`Jami ${filtered.length} ta`}
          action={
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {/* search */}
              <div style={{ position: 'relative' }}>
                <Search size={12} color="#cbd5e1" style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)' }} />
                <input value={q} onChange={e => { setQ(e.target.value); reset(); }} placeholder="Qidirish..."
                  style={{ padding: '7px 10px 7px 28px', border: '1.5px solid #f1f5f9', borderRadius: 10, fontSize: 12, width: 160, color: '#0f172a', outline: 'none' }} />
              </div>
              {/* plan filter */}
              <select value={planFilter} onChange={e => { setPlan(e.target.value); reset(); }}
                style={{ padding: '7px 10px', border: '1.5px solid #f1f5f9', borderRadius: 10, fontSize: 12, color: '#64748b', outline: 'none', background: '#fff' }}>
                <option value="all">Barcha planlar</option>
                <option value="PRO">PRO</option>
                <option value="FREE">FREE</option>
              </select>
              {/* status filter */}
              <select value={statusFilter} onChange={e => { setStatus(e.target.value); reset(); }}
                style={{ padding: '7px 10px', border: '1.5px solid #f1f5f9', borderRadius: 10, fontSize: 12, color: '#64748b', outline: 'none', background: '#fff' }}>
                <option value="all">Barcha statuslar</option>
                <option value="active">Faol</option>
                <option value="inactive">Faolsiz</option>
                <option value="banned">Ban</option>
              </select>
              <Btn size="sm" onClick={() => setShowAdd(true)}><Plus size={12} />Qo'shish</Btn>
            </div>
          }
        />

        <Tbl headers={[
          <span onClick={() => toggleSort('name')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>Foydalanuvchi<SortIcon k="name" /></span>,
          'Plan',
          <span onClick={() => toggleSort('score')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>Ball<SortIcon k="score" /></span>,
          <span onClick={() => toggleSort('tests')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>Testlar<SortIcon k="tests" /></span>,
          "To'lov",
          <span onClick={() => toggleSort('joined')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>Qo'shilgan<SortIcon k="joined" /></span>,
          'Oxirgi', 'Holat', 'Amallar',
        ]}>
          {sliced.map(u => (
            <TRow key={u.id} onClick={() => setSelected(u)} cells={[
              <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                <Avatar code={u.avatar} size={32} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>{u.name} {u.country}</div>
                  <div style={{ fontSize: 11, color: '#94a3b8' }}>{u.email}</div>
                </div>
              </div>,
              <Plan p={u.plan} />,
              <span style={{ fontWeight: 800, color: '#2563eb', fontSize: 14 }}>{u.score}</span>,
              <span style={{ fontWeight: 600 }}>{u.tests}</span>,
              <span style={{ fontWeight: 700 }}>{u.paid > 0 ? u.paid.toLocaleString() + " so'm" : '—'}</span>,
              <span style={{ fontSize: 11, color: '#94a3b8' }}>{u.joined}</span>,
              <span style={{ fontSize: 11, color: '#94a3b8' }}>{u.last}</span>,
              <Badge type={u.status} />,
              <div style={{ display: 'flex', gap: 5 }}>
                <ActionBtn icon={Eye} color="#2563eb" bg="#eff6ff" onClick={() => setSelected(u)} title="Ko'rish" />
                <ActionBtn icon={u.status === 'banned' ? UserCheck : Ban} color={u.status === 'banned' ? '#059669' : '#dc2626'} bg={u.status === 'banned' ? '#dcfce7' : '#fee2e2'} onClick={() => handleBan(u)} title={u.status === 'banned' ? 'Bannni ochish' : 'Bannlash'} />
              </div>,
            ]} />
          ))}
        </Tbl>
        <Pagination page={page} total={total} perPage={8} onChange={setPage} />
      </Card>

      <ConfirmModal {...(confirm || {})} open={!!confirm} onCancel={() => setConfirm(null)} />
    </div>
  );
}
