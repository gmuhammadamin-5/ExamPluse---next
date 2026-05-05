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

const BLANK_FORM = {
  title: '', exam_type: 'IELTS', test_type: 'mock',
  level: '', question_count: '', time_minutes: 60,
  difficulty: 3, is_published: true, is_new: true, description: '',
};

function authHeaders() {
  const token = sessionStorage.getItem('ep_admin_token');
  return { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) };
}

export default function TestsSection({ toast }) {
  const [tests,     setTests]     = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState('');
  const [activeTab, setActiveTab] = useState('IELTS_CAMBRIDGE');
  const [typeFilter,setTypeFilter]= useState('all');
  const [showForm,  setShowForm]  = useState(false);
  const [editTest,  setEditTest]  = useState(null);
  const [form,      setForm]      = useState(BLANK_FORM);
  const [saving,    setSaving]    = useState(false);
  const [confirm,   setConfirm]   = useState(null);

  /* ── fetch tests ─────────────────────────────────────────── */
  const loadTests = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/api/admin/tests`, { headers: authHeaders() });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setTests(await res.json());
    } catch (e) {
      setError("Testlarni yuklashda xatolik: " + e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadTests(); }, [loadTests]);

  /* ── filter by tab ───────────────────────────────────────── */
  const currentTab   = EXAM_TABS.find(t => t.id === activeTab);
  const filtered     = tests.filter(t =>
    currentTab.exams.includes(t.exam_type) &&
    (typeFilter === 'all' || t.test_type === typeFilter)
  );
  const { page, setPage, total, sliced, reset } = usePagination(filtered, 10);

  /* ── open add/edit form ──────────────────────────────────── */
  const openAdd = () => {
    const defaultExam = currentTab.exams[0];
    setForm({ ...BLANK_FORM, exam_type: defaultExam });
    setEditTest(null);
    setShowForm(true);
  };

  const openEdit = (t) => {
    setForm({
      title: t.title, exam_type: t.exam_type, test_type: t.test_type,
      level: t.level || '', question_count: t.question_count,
      time_minutes: t.time_minutes, difficulty: t.difficulty,
      is_published: t.is_published, is_new: t.is_new, description: t.description || '',
    });
    setEditTest(t);
    setShowForm(true);
  };

  const closeForm = () => { setShowForm(false); setEditTest(null); setForm(BLANK_FORM); };

  /* ── save ────────────────────────────────────────────────── */
  const saveTest = async () => {
    if (!form.title.trim()) { toast("Test nomini kiriting", 'error'); return; }
    setSaving(true);
    try {
      const payload = {
        ...form,
        question_count: Number(form.question_count) || 0,
        time_minutes:   Number(form.time_minutes)   || 60,
        difficulty:     Number(form.difficulty)     || 3,
      };
      const url    = editTest ? `${API_URL}/api/admin/tests/${editTest.id}` : `${API_URL}/api/admin/tests`;
      const method = editTest ? 'PUT' : 'POST';
      const res    = await fetch(url, { method, headers: authHeaders(), body: JSON.stringify(payload) });
      if (!res.ok) { const d = await res.json(); throw new Error(d.detail || res.status); }
      toast(editTest ? "Test yangilandi ✓" : "Test qo'shildi ✓", 'success');
      closeForm();
      await loadTests();
    } catch (e) {
      toast("Xatolik: " + e.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  /* ── delete ──────────────────────────────────────────────── */
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
          toast("Test o'chirildi", 'success');
          await loadTests();
        } catch (e) {
          toast("O'chirishda xatolik: " + e.message, 'error');
        }
      },
    });
  };

  const f = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));
  const fCheck = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.checked }));

  /* ── exam options for current tab ───────────────────────── */
  const examOptions = currentTab.exams;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* tabs */}
      <div style={{ display: 'flex', gap: 6 }}>
        {EXAM_TABS.map(tab => (
          <button key={tab.id} onClick={() => { setActiveTab(tab.id); reset(); setTypeFilter('all'); }}
            style={{
              padding: '8px 18px', borderRadius: 11, fontWeight: 700, fontSize: 13,
              fontFamily: 'inherit', cursor: 'pointer', border: 'none', transition: 'all .18s',
              background: activeTab === tab.id ? 'linear-gradient(135deg,#2563eb,#1d4ed8)' : '#f8fafc',
              color: activeTab === tab.id ? '#fff' : '#64748b',
              boxShadow: activeTab === tab.id ? '0 4px 14px rgba(37,99,235,0.25)' : 'none',
            }}>{tab.label}</button>
        ))}
      </div>

      {/* add / edit form */}
      {showForm && (
        <Card>
          <CardHead
            title={editTest ? "Testni tahrirlash" : "Yangi test qo'shish"}
            action={
              <button onClick={closeForm}
                style={{ width: 30, height: 30, borderRadius: 8, background: '#fee2e2', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={13} color="#dc2626" />
              </button>
            }
          />
          <div style={{ padding: '16px 20px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <div style={{ gridColumn: '1/-1' }}>
              <Input label="Test nomi *" value={form.title} onChange={f('title')} placeholder="IELTS Academic Mock Test 1" />
            </div>
            <Select label="Exam turi" value={form.exam_type} onChange={f('exam_type')}
              options={examOptions} />
            <Select label="Test turi" value={form.test_type} onChange={f('test_type')}
              options={['mock', 'practice', 'skill']} />
            <Input label="Daraja (level)" value={form.level} onChange={f('level')} placeholder="B2, C1, Band 7..." />
            <Input label="Savollar soni" value={form.question_count} onChange={f('question_count')} placeholder="160" type="number" />
            <Input label="Vaqt (daqiqa)" value={form.time_minutes} onChange={f('time_minutes')} placeholder="60" type="number" />
            <Select label="Qiyinlik (1-5)" value={form.difficulty} onChange={f('difficulty')}
              options={[{value:1,label:'1 — Juda oson'},{value:2,label:'2 — Oson'},{value:3,label:'3 — O\'rta'},{value:4,label:'4 — Qiyin'},{value:5,label:'5 — Juda qiyin'}]} />
            <div style={{ gridColumn: '1/-1' }}>
              <Input label="Tavsif (ixtiyoriy)" value={form.description} onChange={f('description')} placeholder="Bu test haqida qisqacha..." />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, gridColumn: '1/-1' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 7, cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#0f172a' }}>
                <input type="checkbox" checked={form.is_published} onChange={fCheck('is_published')} style={{ width: 16, height: 16, cursor: 'pointer' }} />
                Nashr qilingan (Published)
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 7, cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#0f172a' }}>
                <input type="checkbox" checked={form.is_new} onChange={fCheck('is_new')} style={{ width: 16, height: 16, cursor: 'pointer' }} />
                Yangi (NEW badge)
              </label>
            </div>
            <div style={{ gridColumn: '1/-1', display: 'flex', gap: 10 }}>
              <Btn onClick={saveTest} disabled={saving}>
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
                <option value="all">Barcha turlar</option>
                <option value="mock">Mock</option>
                <option value="practice">Practice</option>
                <option value="skill">Skill</option>
              </select>
              <button onClick={loadTests}
                style={{ padding: '7px 10px', border: '1.5px solid #f1f5f9', borderRadius: 10, fontSize: 12, color: '#64748b', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
                <RefreshCw size={12} />Yangilash
              </button>
              <Btn size="sm" onClick={openAdd}>
                <Plus size={12} />Yangi test
              </Btn>
            </div>
          }
        />

        {/* error */}
        {error && (
          <div style={{ margin: '12px 20px', padding: '10px 14px', background: '#fef2f2', border: '1.5px solid #fecaca', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#dc2626' }}>
            <AlertCircle size={14} />{error}
          </div>
        )}

        {/* loading */}
        {loading ? (
          <div style={{ padding: '40px 20px', textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>
            Yuklanmoqda...
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '40px 20px', textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>
            Bu bo'limda testlar yo'q. "Yangi test" tugmasini bosib qo'shing.
          </div>
        ) : (
          <>
            <Tbl headers={['Test nomi', 'Exam', 'Tur', 'Daraja', 'Savollar', 'Vaqt', 'Qiyinlik', 'Holat', 'Amallar']}>
              {sliced.map(t => (
                <TRow key={t.id} cells={[
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 13 }}>{t.title}</div>
                    {t.is_new && <span style={{ fontSize: 9, fontWeight: 800, color: '#059669', background: '#d1fae5', padding: '1px 6px', borderRadius: 6 }}>NEW</span>}
                  </div>,
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#2563eb', background: '#eff6ff', padding: '2px 7px', borderRadius: 7 }}>{t.exam_type}</span>,
                  <span style={{ fontSize: 11, color: '#64748b', background: '#f8fafc', padding: '2px 7px', borderRadius: 7 }}>{t.test_type}</span>,
                  <span style={{ fontSize: 12, color: '#64748b' }}>{t.level || '—'}</span>,
                  <span style={{ fontWeight: 700 }}>{t.question_count}</span>,
                  <span style={{ fontSize: 12, color: '#64748b' }}>{t.time_minutes} min</span>,
                  <div style={{ display: 'flex', gap: 2 }}>
                    {[1,2,3,4,5].map(i => (
                      <div key={i} style={{ width: 8, height: 8, borderRadius: 2, background: i <= t.difficulty ? '#2563eb' : '#e2e8f0' }} />
                    ))}
                  </div>,
                  <Badge type={t.is_published ? 'live' : 'draft'} />,
                  <div style={{ display: 'flex', gap: 5 }}>
                    <ActionBtn icon={Edit3}  color="#2563eb" bg="#eff6ff" onClick={() => openEdit(t)} title="Tahrirlash" />
                    <ActionBtn icon={Trash2} color="#dc2626" bg="#fee2e2" onClick={() => deleteTest(t)} title="O'chirish" />
                  </div>,
                ]} />
              ))}
            </Tbl>
            <Pagination page={page} total={total} perPage={10} onChange={setPage} />
          </>
        )}
      </Card>

      <ConfirmModal {...(confirm || {})} open={!!confirm} onCancel={() => setConfirm(null)} />
    </div>
  );
}
