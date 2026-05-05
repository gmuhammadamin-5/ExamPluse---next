"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { Plus, X, Edit3, Trash2, Check, RefreshCw, AlertCircle } from 'lucide-react';
import { Badge, Card, CardHead, Tbl, TRow, ActionBtn, Input, Select, Btn } from '../components/helpers';
import { Pagination, usePagination } from '../components/Pagination';
import { ConfirmModal } from '../components/ConfirmModal';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const EXAM_TABS = [
  { id: 'IELTS_CAMBRIDGE', label: 'IELTS & Cambridge', exams: ['IELTS', 'CAMBRIDGE'] },
  { id: 'TOEFL',           label: 'TOEFL',             exams: ['TOEFL']              },
  { id: 'SAT',             label: 'SAT',               exams: ['SAT']                },
  { id: 'CEFR',            label: 'CEFR',              exams: ['CEFR']               },
];

/* ── Exam-specific config ──────────────────────────────────────────── */
const EXAM_CONFIG = {
  IELTS: {
    color: '#2563eb', bg: '#eff6ff',
    sections: ['Listening', 'Reading', 'Writing', 'Speaking'],
    levels: ['Band 4.0', 'Band 4.5', 'Band 5.0', 'Band 5.5', 'Band 6.0', 'Band 6.5', 'Band 7.0', 'Band 7.5', 'Band 8.0', 'Band 8.5', 'Band 9.0', 'All Levels'],
    types: [
      { value: 'mock', label: 'Full Mock Test' },
      { value: 'practice', label: 'Practice (qism)' },
      { value: 'skill', label: 'Skill Builder' },
    ],
    defaultTime: 165,
    defaultQ: 160,
    subtypes: ['Academic', 'General Training'],
  },
  CAMBRIDGE: {
    color: '#7c3aed', bg: '#f5f3ff',
    sections: ['Reading & Use of English', 'Writing', 'Listening', 'Speaking'],
    levels: ['B2 First', 'C1 Advanced', 'C2 Proficiency'],
    types: [
      { value: 'mock', label: 'Full Mock Test' },
      { value: 'practice', label: 'Practice (qism)' },
      { value: 'skill', label: 'Skill Builder' },
    ],
    defaultTime: 180,
    defaultQ: 140,
    subtypes: null,
  },
  TOEFL: {
    color: '#0891b2', bg: '#ecfeff',
    sections: ['Reading', 'Listening', 'Speaking', 'Writing'],
    levels: ['Score 60+', 'Score 70+', 'Score 80+', 'Score 90+', 'Score 100+', 'Score 110+', 'Score 120'],
    types: [
      { value: 'mock', label: 'Full iBT Mock' },
      { value: 'practice', label: 'Section Practice' },
      { value: 'skill', label: 'Skill Builder' },
    ],
    defaultTime: 185,
    defaultQ: 144,
    subtypes: null,
  },
  SAT: {
    color: '#ea580c', bg: '#fff7ed',
    sections: ['Math', 'Reading & Writing'],
    levels: ['Score 800+', 'Score 1000+', 'Score 1100+', 'Score 1200+', 'Score 1300+', 'Score 1400+', 'Score 1500+', 'Score 1600'],
    types: [
      { value: 'mock', label: 'Full Practice Test' },
      { value: 'practice', label: 'Section Practice' },
      { value: 'skill', label: 'Skill Builder' },
    ],
    defaultTime: 134,
    defaultQ: 98,
    subtypes: null,
  },
  CEFR: {
    color: '#059669', bg: '#ecfdf5',
    sections: ['Grammar', 'Vocabulary', 'Reading', 'Listening', 'Writing', 'Speaking'],
    levels: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'A1-A2', 'B1-B2', 'C1-C2', 'A1→C2'],
    types: [
      { value: 'mock', label: 'Full Level Test' },
      { value: 'practice', label: 'Skill Practice' },
      { value: 'skill', label: 'Placement Test' },
    ],
    defaultTime: 90,
    defaultQ: 80,
    subtypes: null,
  },
};

function getBlankForm(examType) {
  const cfg = EXAM_CONFIG[examType] || EXAM_CONFIG.IELTS;
  return {
    title: '', exam_type: examType, test_type: 'mock',
    level: cfg.levels[0], sections: [...cfg.sections],
    question_count: cfg.defaultQ, time_minutes: cfg.defaultTime,
    difficulty: 3, is_published: true, is_new: true, description: '',
    subtype: cfg.subtypes?.[0] || '',
  };
}

function authHeaders() {
  const token = sessionStorage.getItem('ep_admin_token');
  return { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) };
}

/* ── Section checkboxes ─────────────────────────────────────────────── */
function SectionPicker({ examType, selected, onChange }) {
  const cfg = EXAM_CONFIG[examType];
  if (!cfg) return null;
  const toggle = (s) => {
    if (selected.includes(s)) onChange(selected.filter(x => x !== s));
    else onChange([...selected, s]);
  };
  return (
    <div>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 8 }}>Bo'limlar (Sections)</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {cfg.sections.map(s => (
          <label key={s} style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer',
            padding: '6px 12px', borderRadius: 10, border: `1.5px solid ${selected.includes(s) ? cfg.color : '#e2e8f0'}`,
            background: selected.includes(s) ? cfg.bg : '#fafafa', fontSize: 12, fontWeight: 600,
            color: selected.includes(s) ? cfg.color : '#64748b', transition: 'all .15s' }}>
            <input type="checkbox" checked={selected.includes(s)} onChange={() => toggle(s)}
              style={{ width: 14, height: 14, accentColor: cfg.color }} />
            {s}
          </label>
        ))}
      </div>
    </div>
  );
}

/* ── Main component ─────────────────────────────────────────────────── */
export default function TestsSection({ toast }) {
  const [tests,     setTests]     = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState('');
  const [activeTab, setActiveTab] = useState('IELTS_CAMBRIDGE');
  const [typeFilter,setTypeFilter]= useState('all');
  const [showForm,  setShowForm]  = useState(false);
  const [editTest,  setEditTest]  = useState(null);
  const [form,      setForm]      = useState(getBlankForm('IELTS'));
  const [saving,    setSaving]    = useState(false);
  const [confirm,   setConfirm]   = useState(null);

  const loadTests = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const res = await fetch(`${API_URL}/api/admin/tests`, { headers: authHeaders() });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setTests(await res.json());
    } catch (e) { setError("Yuklashda xatolik: " + e.message); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { loadTests(); }, [loadTests]);

  const currentTab = EXAM_TABS.find(t => t.id === activeTab);
  const filtered   = tests.filter(t =>
    currentTab.exams.includes(t.exam_type) &&
    (typeFilter === 'all' || t.test_type === typeFilter)
  );
  const { page, setPage, total, sliced, reset } = usePagination(filtered, 10);

  const cfg = EXAM_CONFIG[form.exam_type] || EXAM_CONFIG.IELTS;

  const openAdd = () => {
    const defaultExam = currentTab.exams[0];
    setForm(getBlankForm(defaultExam));
    setEditTest(null); setShowForm(true);
  };

  const openEdit = (t) => {
    setForm({
      title: t.title, exam_type: t.exam_type, test_type: t.test_type,
      level: t.level || '', sections: Array.isArray(t.sections) ? t.sections : [],
      question_count: t.question_count, time_minutes: t.time_minutes,
      difficulty: t.difficulty, is_published: t.is_published, is_new: t.is_new,
      description: t.description || '', subtype: '',
    });
    setEditTest(t); setShowForm(true);
  };

  const closeForm = () => { setShowForm(false); setEditTest(null); };

  const f    = k => e => setForm(p => ({ ...p, [k]: e.target.value }));
  const fNum = k => e => setForm(p => ({ ...p, [k]: Number(e.target.value) }));
  const fChk = k => e => setForm(p => ({ ...p, [k]: e.target.checked }));

  /* exam_type change — reset defaults */
  const changeExam = (e) => {
    const et = e.target.value;
    setForm(p => ({ ...getBlankForm(et), title: p.title, test_type: p.test_type, is_published: p.is_published }));
  };

  const saveTest = async () => {
    if (!form.title.trim()) { toast("Test nomini kiriting", 'error'); return; }
    if (form.sections.length === 0) { toast("Kamida 1 ta bo'lim tanlang", 'error'); return; }
    setSaving(true);
    try {
      const payload = { ...form, question_count: Number(form.question_count) || 0, time_minutes: Number(form.time_minutes) || 60, difficulty: Number(form.difficulty) || 3 };
      const url    = editTest ? `${API_URL}/api/admin/tests/${editTest.id}` : `${API_URL}/api/admin/tests`;
      const method = editTest ? 'PUT' : 'POST';
      const res    = await fetch(url, { method, headers: authHeaders(), body: JSON.stringify(payload) });
      if (!res.ok) { const d = await res.json(); throw new Error(d.detail || res.status); }
      toast(editTest ? "Test yangilandi ✓" : "Test qo'shildi ✓", 'success');
      closeForm(); await loadTests();
    } catch (e) { toast("Xatolik: " + e.message, 'error'); }
    finally { setSaving(false); }
  };

  const deleteTest = (t) => {
    setConfirm({
      title: "Testni o'chirish",
      message: `"${t.title}" testini o'chirasizmi?`,
      danger: true,
      onConfirm: async () => {
        setConfirm(null);
        try {
          const res = await fetch(`${API_URL}/api/admin/tests/${t.id}`, { method: 'DELETE', headers: authHeaders() });
          if (!res.ok) throw new Error(res.status);
          toast("Test o'chirildi", 'success'); await loadTests();
        } catch (e) { toast("Xatolik: " + e.message, 'error'); }
      },
    });
  };

  const examOptions = currentTab.exams;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* tabs */}
      <div style={{ display: 'flex', gap: 6 }}>
        {EXAM_TABS.map(tab => (
          <button key={tab.id} onClick={() => { setActiveTab(tab.id); reset(); setTypeFilter('all'); setShowForm(false); }}
            style={{ padding: '8px 18px', borderRadius: 11, fontWeight: 700, fontSize: 13, fontFamily: 'inherit',
              cursor: 'pointer', border: 'none', transition: 'all .18s',
              background: activeTab === tab.id ? 'linear-gradient(135deg,#2563eb,#1d4ed8)' : '#f8fafc',
              color: activeTab === tab.id ? '#fff' : '#64748b',
              boxShadow: activeTab === tab.id ? '0 4px 14px rgba(37,99,235,0.25)' : 'none',
            }}>{tab.label}</button>
        ))}
      </div>

      {/* add / edit form */}
      {showForm && (
        <Card>
          {/* header with exam color */}
          <div style={{ padding: '14px 20px', borderBottom: '1.5px solid #f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: cfg.bg }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 12, fontWeight: 800, color: cfg.color, background: '#fff', padding: '3px 10px', borderRadius: 8, border: `1.5px solid ${cfg.color}` }}>{form.exam_type}</span>
              <span style={{ fontSize: 14, fontWeight: 800, color: '#0f172a' }}>{editTest ? "Testni tahrirlash" : "Yangi test qo'shish"}</span>
            </div>
            <button onClick={closeForm} style={{ width: 30, height: 30, borderRadius: 8, background: '#fee2e2', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <X size={13} color="#dc2626" />
            </button>
          </div>

          <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>

            {/* Row 1: title */}
            <Input label="Test nomi *" value={form.title} onChange={f('title')}
              placeholder={
                form.exam_type === 'IELTS'     ? 'IELTS Academic Mock Test 1' :
                form.exam_type === 'CAMBRIDGE' ? 'Cambridge C1 Advanced Full Mock' :
                form.exam_type === 'TOEFL'     ? 'TOEFL iBT Full Mock Test 1' :
                form.exam_type === 'SAT'       ? 'SAT Full Practice Test 1' :
                'CEFR B2 Level Test'
              } />

            {/* Row 2: exam type, subtype (if IELTS), test type */}
            <div style={{ display: 'grid', gridTemplateColumns: form.exam_type === 'IELTS' ? '1fr 1fr 1fr' : '1fr 1fr', gap: 12 }}>
              <Select label="Exam turi" value={form.exam_type} onChange={changeExam} options={examOptions} />
              {form.exam_type === 'IELTS' && (
                <Select label="Turi (Academic / General)" value={form.subtype} onChange={f('subtype')}
                  options={['Academic', 'General Training']} />
              )}
              {form.exam_type === 'CAMBRIDGE' && (
                <div /> /* spacer */
              )}
              <Select label="Test formati" value={form.test_type} onChange={f('test_type')}
                options={cfg.types} />
            </div>

            {/* Row 3: level, time, question count */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              <Select label={
                form.exam_type === 'IELTS'     ? 'Band darajasi' :
                form.exam_type === 'CAMBRIDGE' ? 'Imtihon darajasi' :
                form.exam_type === 'TOEFL'     ? 'Score (ball)' :
                form.exam_type === 'SAT'       ? 'Score (ball)' :
                'CEFR darajasi'
              } value={form.level} onChange={f('level')} options={cfg.levels} />
              <Input label="Vaqt (daqiqa)" value={form.time_minutes} onChange={fNum('time_minutes')} type="number"
                placeholder={String(cfg.defaultTime)} />
              <Input label="Savollar soni" value={form.question_count} onChange={fNum('question_count')} type="number"
                placeholder={String(cfg.defaultQ)} />
            </div>

            {/* Row 4: sections */}
            <SectionPicker examType={form.exam_type} selected={form.sections}
              onChange={secs => setForm(p => ({ ...p, sections: secs }))} />

            {/* Row 5: difficulty */}
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 8 }}>Qiyinlik darajasi</div>
              <div style={{ display: 'flex', gap: 8 }}>
                {[
                  { v: 1, label: '1 — Juda oson' },
                  { v: 2, label: '2 — Oson' },
                  { v: 3, label: '3 — O\'rta' },
                  { v: 4, label: '4 — Qiyin' },
                  { v: 5, label: '5 — Expert' },
                ].map(d => (
                  <button key={d.v} onClick={() => setForm(p => ({ ...p, difficulty: d.v }))}
                    style={{ padding: '6px 14px', borderRadius: 10, fontSize: 12, fontWeight: 700,
                      fontFamily: 'inherit', cursor: 'pointer', border: 'none', transition: 'all .15s',
                      background: form.difficulty === d.v ? cfg.color : '#f8fafc',
                      color: form.difficulty === d.v ? '#fff' : '#64748b' }}>
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Row 6: description */}
            <Input label="Tavsif (ixtiyoriy)" value={form.description} onChange={f('description')}
              placeholder="Bu test haqida qisqacha ma'lumot..." />

            {/* Row 7: checkboxes */}
            <div style={{ display: 'flex', gap: 20 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#0f172a' }}>
                <input type="checkbox" checked={form.is_published} onChange={fChk('is_published')} style={{ width: 16, height: 16, cursor: 'pointer', accentColor: cfg.color }} />
                Nashr qilingan (Published)
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#0f172a' }}>
                <input type="checkbox" checked={form.is_new} onChange={fChk('is_new')} style={{ width: 16, height: 16, cursor: 'pointer', accentColor: cfg.color }} />
                Yangi (NEW badge)
              </label>
            </div>

            {/* actions */}
            <div style={{ display: 'flex', gap: 10 }}>
              <Btn onClick={saveTest} disabled={saving} style={{ background: `linear-gradient(135deg,${cfg.color},${cfg.color}cc)` }}>
                <Check size={13} />{saving ? 'Saqlanmoqda...' : (editTest ? 'Yangilash' : 'Saqlash')}
              </Btn>
              <Btn variant="secondary" onClick={closeForm}>Bekor</Btn>
            </div>
          </div>
        </Card>
      )}

      {/* tests table */}
      <Card>
        <CardHead
          title={currentTab.label + " testlari"}
          sub={`${filtered.length} ta test`}
          action={
            <div style={{ display: 'flex', gap: 8 }}>
              <select value={typeFilter} onChange={e => { setTypeFilter(e.target.value); reset(); }}
                style={{ padding: '7px 10px', border: '1.5px solid #f1f5f9', borderRadius: 10, fontSize: 12, color: '#64748b', outline: 'none', background: '#fff' }}>
                <option value="all">Barcha formatlar</option>
                <option value="mock">Full Mock</option>
                <option value="practice">Practice</option>
                <option value="skill">Skill</option>
              </select>
              <button onClick={loadTests}
                style={{ padding: '7px 10px', border: '1.5px solid #f1f5f9', borderRadius: 10, fontSize: 12, color: '#64748b', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
                <RefreshCw size={12} />Yangilash
              </button>
              <Btn size="sm" onClick={openAdd}><Plus size={12} />Yangi test</Btn>
            </div>
          }
        />

        {error && (
          <div style={{ margin: '12px 20px', padding: '10px 14px', background: '#fef2f2', border: '1.5px solid #fecaca', borderRadius: 10, display: 'flex', gap: 8, fontSize: 13, color: '#dc2626' }}>
            <AlertCircle size={14} />{error}
          </div>
        )}

        {loading ? (
          <div style={{ padding: '40px 20px', textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>Yuklanmoqda...</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '40px 20px', textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>
            Testlar yo'q. "Yangi test" tugmasini bosib qo'shing.
          </div>
        ) : (
          <>
            <Tbl headers={['Test nomi', 'Exam', 'Format', 'Daraja', 'Bo\'limlar', 'Savollar', 'Vaqt', 'Qiyinlik', 'Holat', 'Amallar']}>
              {sliced.map(t => {
                const c = EXAM_CONFIG[t.exam_type] || EXAM_CONFIG.IELTS;
                return (
                  <TRow key={t.id} cells={[
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 13 }}>{t.title}</div>
                      {t.is_new && <span style={{ fontSize: 9, fontWeight: 800, color: '#059669', background: '#d1fae5', padding: '1px 6px', borderRadius: 6 }}>NEW</span>}
                      {t.description && <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 2 }}>{t.description.slice(0, 50)}...</div>}
                    </div>,
                    <span style={{ fontSize: 11, fontWeight: 800, color: c.color, background: c.bg, padding: '3px 8px', borderRadius: 7 }}>{t.exam_type}</span>,
                    <span style={{ fontSize: 11, color: '#64748b', background: '#f8fafc', padding: '2px 7px', borderRadius: 7 }}>{t.test_type}</span>,
                    <span style={{ fontSize: 12, fontWeight: 700, color: c.color }}>{t.level || '—'}</span>,
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3, maxWidth: 160 }}>
                      {(Array.isArray(t.sections) ? t.sections : []).map(s => (
                        <span key={s} style={{ fontSize: 9, fontWeight: 700, color: '#64748b', background: '#f1f5f9', padding: '1px 5px', borderRadius: 5 }}>{s}</span>
                      ))}
                    </div>,
                    <span style={{ fontWeight: 700 }}>{t.question_count}</span>,
                    <span style={{ fontSize: 12, color: '#64748b' }}>{t.time_minutes} min</span>,
                    <div style={{ display: 'flex', gap: 2 }}>
                      {[1,2,3,4,5].map(i => (
                        <div key={i} style={{ width: 8, height: 8, borderRadius: 2, background: i <= t.difficulty ? c.color : '#e2e8f0' }} />
                      ))}
                    </div>,
                    <Badge type={t.is_published ? 'live' : 'draft'} />,
                    <div style={{ display: 'flex', gap: 5 }}>
                      <ActionBtn icon={Edit3}  color={c.color} bg={c.bg} onClick={() => openEdit(t)} title="Tahrirlash" />
                      <ActionBtn icon={Trash2} color="#dc2626" bg="#fee2e2" onClick={() => deleteTest(t)} title="O'chirish" />
                    </div>,
                  ]} />
                );
              })}
            </Tbl>
            <Pagination page={page} total={total} perPage={10} onChange={setPage} />
          </>
        )}
      </Card>

      <ConfirmModal {...(confirm || {})} open={!!confirm} onCancel={() => setConfirm(null)} />
    </div>
  );
}
