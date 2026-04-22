"use client";
import React, { useState, useMemo } from 'react';
import { Plus, X, Edit3, Trash2, ChevronDown, ChevronRight, Check, BookOpen } from 'lucide-react';
import { Badge, Card, CardHead, Tbl, TRow, ActionBtn, Input, Select, Btn } from '../components/helpers';
import { Pagination, usePagination } from '../components/Pagination';
import { ConfirmModal } from '../components/ConfirmModal';

const INIT_TESTS = [
  { id:1, title:'IELTS Academic Mock 1', exam:'IELTS',    type:'mock',    q:160, attempts:8420, avg:'6.8', status:'live',  free:true,  questions:[
    { id:1, text:'The recording mentions that the conference will be held in...', type:'mcq', options:['London','Paris','New York','Berlin'], answer:0 },
    { id:2, text:'Complete the note: The registration fee is ___ dollars.', type:'fill', answer:'50' },
    { id:3, text:'What is the main purpose of the speaker?', type:'mcq', options:['To inform','To persuade','To entertain','To warn'], answer:0 },
  ]},
  { id:2, title:'IELTS Academic Mock 2', exam:'IELTS',    type:'mock',    q:160, attempts:6231, avg:'7.1', status:'live',  free:true,  questions:[]},
  { id:3, title:'Cambridge C1 Advanced', exam:'CAMBRIDGE',type:'mock',    q:140, attempts:3400, avg:'C1',  status:'live',  free:false, questions:[]},
  { id:4, title:'TOEFL iBT Full Mock 1', exam:'TOEFL',    type:'mock',    q:144, attempts:4800, avg:'88',  status:'live',  free:true,  questions:[]},
  { id:5, title:'SAT Full Practice 1',   exam:'SAT',      type:'mock',    q:98,  attempts:7400, avg:'1240',status:'live',  free:true,  questions:[]},
  { id:6, title:'CEFR B2 Complete',      exam:'CEFR',     type:'mock',    q:90,  attempts:7600, avg:'B2',  status:'live',  free:false, questions:[]},
  { id:7, title:'IELTS Writing Task 2',  exam:'IELTS',    type:'practice',q:2,   attempts:4900, avg:'6.5', status:'live',  free:false, questions:[]},
  { id:8, title:'CEFR C1 Advanced',      exam:'CEFR',     type:'mock',    q:100, attempts:4300, avg:'C1',  status:'draft', free:false, questions:[]},
  { id:9, title:'IELTS Listening Set A', exam:'IELTS',    type:'practice',q:40,  attempts:3100, avg:'7.0', status:'live',  free:true,  questions:[]},
  { id:10,title:'Cambridge B2 First',    exam:'CAMBRIDGE',type:'mock',    q:130, attempts:2800, avg:'B2',  status:'draft', free:false, questions:[]},
];

const BLANK_TEST = { title:'', exam:'IELTS', type:'mock', q:'', free:false, status:'draft' };
const BLANK_Q    = { text:'', type:'mcq', options:['','','',''], answer:0 };

export default function TestsSection({ toast }) {
  const [tests, setTests]       = useState(INIT_TESTS);
  const [examFilter, setExamF]  = useState('all');
  const [typeFilter, setTypeF]  = useState('all');
  const [showAdd, setShowAdd]   = useState(false);
  const [editTest, setEditTest] = useState(null);
  const [openQ, setOpenQ]       = useState(null);
  const [form, setForm]         = useState(BLANK_TEST);
  const [newQ, setNewQ]         = useState(BLANK_Q);
  const [confirm, setConfirm]   = useState(null);

  const filtered = useMemo(() => tests.filter(t =>
    (examFilter === 'all' || t.exam === examFilter) &&
    (typeFilter === 'all' || t.type === typeFilter)
  ), [tests, examFilter, typeFilter]);

  const { page, setPage, total, sliced, reset } = usePagination(filtered, 8);

  /* save new test */
  const saveTest = () => {
    if (!form.title) { toast("Test nomini kiriting", 'error'); return; }
    if (editTest) {
      setTests(p => p.map(t => t.id === editTest.id ? { ...t, ...form, q: Number(form.q)||t.q } : t));
      toast("Test yangilandi", 'success');
    } else {
      setTests(p => [{ ...form, id: Date.now(), q: Number(form.q)||0, attempts:0, avg:'—', questions:[] }, ...p]);
      toast("Test qo'shildi", 'success');
    }
    setShowAdd(false); setEditTest(null); setForm(BLANK_TEST);
  };

  /* delete test */
  const deleteTest = (t) => {
    setConfirm({
      title: "Testni o'chirish",
      message: `"${t.title}" testini o'chirasizmi? Bu amalni qaytarib bo'lmaydi.`,
      danger: true,
      onConfirm: () => {
        setTests(p => p.filter(x => x.id !== t.id));
        toast("Test o'chirildi", 'success');
        setConfirm(null);
        if (openQ === t.id) setOpenQ(null);
      },
    });
  };

  /* add question */
  const addQuestion = (testId) => {
    if (!newQ.text) { toast("Savol matni kiriting", 'error'); return; }
    setTests(p => p.map(t => t.id === testId
      ? { ...t, questions: [...(t.questions||[]), { ...newQ, id: Date.now() }], q: t.q + 1 }
      : t
    ));
    setNewQ(BLANK_Q);
    toast("Savol qo'shildi", 'success');
  };

  /* delete question */
  const deleteQ = (testId, qId) => {
    setTests(p => p.map(t => t.id === testId
      ? { ...t, questions: t.questions.filter(q => q.id !== qId), q: Math.max(0, t.q - 1) }
      : t
    ));
    toast("Savol o'chirildi", 'success');
  };

  const openEdit = (t) => {
    setForm({ title: t.title, exam: t.exam, type: t.type, q: t.q, free: t.free, status: t.status });
    setEditTest(t);
    setShowAdd(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* add / edit form */}
      {showAdd && (
        <Card>
          <CardHead
            title={editTest ? "Testni tahrirlash" : "Yangi test qo'shish"}
            action={
              <button onClick={() => { setShowAdd(false); setEditTest(null); setForm(BLANK_TEST); }}
                style={{ width: 30, height: 30, borderRadius: 8, background: '#fee2e2', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={13} color="#dc2626" />
              </button>
            }
          />
          <div style={{ padding: '16px 20px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <div style={{ gridColumn: '1/-1' }}>
              <Input label="Test nomi" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="IELTS Academic Mock Test 1" />
            </div>
            <Select label="Exam" value={form.exam} onChange={e => setForm(p => ({ ...p, exam: e.target.value }))} options={['IELTS','CAMBRIDGE','TOEFL','CEFR','SAT']} />
            <Select label="Turi" value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))} options={['mock','practice','skill']} />
            <Select label="Status" value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))} options={['live','draft']} />
            <Input label="Savollar soni" value={form.q} onChange={e => setForm(p => ({ ...p, q: e.target.value }))} placeholder="160" type="number" />
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, alignSelf: 'flex-end', paddingBottom: 2 }}>
              <input type="checkbox" id="free-t" checked={form.free} onChange={e => setForm(p => ({ ...p, free: e.target.checked }))} style={{ width: 16, height: 16, cursor: 'pointer' }} />
              <label htmlFor="free-t" style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', cursor: 'pointer' }}>Bepul (FREE)</label>
            </div>
            <div style={{ gridColumn: '1/-1', display: 'flex', gap: 10 }}>
              <Btn onClick={saveTest}><Check size={13} />{editTest ? 'Yangilash' : "Saqlash"}</Btn>
              <Btn variant="secondary" onClick={() => { setShowAdd(false); setEditTest(null); setForm(BLANK_TEST); }}>Bekor</Btn>
            </div>
          </div>
        </Card>
      )}

      {/* tests table */}
      <Card>
        <CardHead
          title="Barcha testlar"
          sub={`${filtered.length} ta`}
          action={
            <div style={{ display: 'flex', gap: 8 }}>
              <select value={examFilter} onChange={e => { setExamF(e.target.value); reset(); }}
                style={{ padding: '7px 10px', border: '1.5px solid #f1f5f9', borderRadius: 10, fontSize: 12, color: '#64748b', outline: 'none', background: '#fff' }}>
                <option value="all">Barcha examlar</option>
                {['IELTS','CAMBRIDGE','TOEFL','CEFR','SAT'].map(e => <option key={e} value={e}>{e}</option>)}
              </select>
              <select value={typeFilter} onChange={e => { setTypeF(e.target.value); reset(); }}
                style={{ padding: '7px 10px', border: '1.5px solid #f1f5f9', borderRadius: 10, fontSize: 12, color: '#64748b', outline: 'none', background: '#fff' }}>
                <option value="all">Barcha turlar</option>
                <option value="mock">Mock</option>
                <option value="practice">Practice</option>
                <option value="skill">Skill</option>
              </select>
              <Btn size="sm" onClick={() => { setShowAdd(true); setEditTest(null); setForm(BLANK_TEST); }}>
                <Plus size={12} />Yangi test
              </Btn>
            </div>
          }
        />

        <Tbl headers={['', 'Test nomi', 'Exam', 'Tur', 'Savollar', 'Urinishlar', "O'rt. ball", 'Narx', 'Status', 'Amallar']}>
          {sliced.map(t => (
            <React.Fragment key={t.id}>
              <TRow cells={[
                /* expand */
                <button onClick={() => setOpenQ(openQ === t.id ? null : t.id)}
                  style={{ width: 24, height: 24, borderRadius: 7, background: openQ === t.id ? '#eff6ff' : '#f8fafc', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {openQ === t.id ? <ChevronDown size={12} color="#2563eb" /> : <ChevronRight size={12} color="#94a3b8" />}
                </button>,
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>{t.title}</div>
                  <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 1 }}>{(t.questions||[]).length} savol qo'shilgan</div>
                </div>,
                <span style={{ fontSize: 10, fontWeight: 700, color: '#2563eb', background: '#eff6ff', padding: '2px 7px', borderRadius: 7 }}>{t.exam}</span>,
                <span style={{ fontSize: 11, color: '#64748b', background: '#f8fafc', padding: '2px 7px', borderRadius: 7 }}>{t.type}</span>,
                <span style={{ fontWeight: 700 }}>{t.q}</span>,
                <span style={{ fontWeight: 700, color: '#059669' }}>{t.attempts.toLocaleString()}</span>,
                <span style={{ fontWeight: 800, color: '#2563eb' }}>{t.avg}</span>,
                t.free
                  ? <span style={{ fontSize: 10, fontWeight: 800, color: '#059669', background: '#d1fae5', padding: '2px 8px', borderRadius: 20 }}>FREE</span>
                  : <span style={{ fontSize: 10, fontWeight: 800, color: '#7c3aed', background: '#ede9fe', padding: '2px 8px', borderRadius: 20 }}>PRO</span>,
                <Badge type={t.status} />,
                <div style={{ display: 'flex', gap: 5 }}>
                  <ActionBtn icon={Edit3} color="#2563eb" bg="#eff6ff" onClick={() => openEdit(t)} title="Tahrirlash" />
                  <ActionBtn icon={Trash2} color="#dc2626" bg="#fee2e2" onClick={() => deleteTest(t)} title="O'chirish" />
                </div>,
              ]} />

              {/* question panel */}
              {openQ === t.id && (
                <tr>
                  <td colSpan={10} style={{ padding: 0, background: '#fafcff', borderBottom: '1px solid #f1f5f9' }}>
                    <div style={{ padding: '16px 20px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                        <BookOpen size={14} color="#2563eb" />
                        <span style={{ fontSize: 13, fontWeight: 800, color: '#0f172a' }}>Savollar ({(t.questions||[]).length} ta)</span>
                      </div>

                      {/* existing questions */}
                      {(t.questions||[]).length > 0 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                          {t.questions.map((q, qi) => (
                            <div key={q.id} style={{ background: '#fff', border: '1.5px solid #f1f5f9', borderRadius: 12, padding: '12px 14px', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                              <div style={{ width: 22, height: 22, borderRadius: 7, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: '#2563eb', flexShrink: 0 }}>{qi + 1}</div>
                              <div style={{ flex: 1 }}>
                                <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', marginBottom: 4 }}>{q.text}</div>
                                {q.type === 'mcq' && (
                                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                    {q.options.map((opt, oi) => (
                                      <span key={oi} style={{ fontSize: 11, padding: '2px 9px', borderRadius: 8, background: oi === q.answer ? '#dcfce7' : '#f8fafc', color: oi === q.answer ? '#16a34a' : '#64748b', border: `1px solid ${oi === q.answer ? '#bbf7d0' : '#f1f5f9'}`, fontWeight: oi === q.answer ? 700 : 500 }}>{opt || `Variant ${oi + 1}`}</span>
                                    ))}
                                  </div>
                                )}
                                {q.type === 'fill' && (
                                  <span style={{ fontSize: 11, color: '#059669', fontWeight: 700 }}>Javob: {q.answer}</span>
                                )}
                              </div>
                              <ActionBtn icon={Trash2} color="#dc2626" bg="#fee2e2" onClick={() => deleteQ(t.id, q.id)} title="O'chirish" />
                            </div>
                          ))}
                        </div>
                      )}

                      {/* add question form */}
                      <div style={{ background: '#fff', border: '1.5px dashed #dbeafe', borderRadius: 12, padding: '14px 16px' }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: '#2563eb', marginBottom: 10 }}>+ Yangi savol qo'shish</div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 10, marginBottom: 10 }}>
                          <Input value={newQ.text} onChange={e => setNewQ(p => ({ ...p, text: e.target.value }))} placeholder="Savol matni..." />
                          <Select value={newQ.type} onChange={e => setNewQ(p => ({ ...p, type: e.target.value, options: ['','','',''], answer: 0 }))}
                            options={[{ value:'mcq', label:'Test (MCQ)' }, { value:'fill', label:"To'ldirish" }]} />
                        </div>
                        {newQ.type === 'mcq' && (
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 10 }}>
                            {newQ.options.map((opt, i) => (
                              <div key={i} style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                                <input type="radio" name="correct" checked={newQ.answer === i} onChange={() => setNewQ(p => ({ ...p, answer: i }))} style={{ cursor: 'pointer' }} />
                                <input value={opt} onChange={e => setNewQ(p => { const o = [...p.options]; o[i] = e.target.value; return { ...p, options: o }; })}
                                  placeholder={`Variant ${i + 1}`}
                                  style={{ flex: 1, padding: '6px 10px', border: '1.5px solid #f1f5f9', borderRadius: 8, fontSize: 12, outline: 'none', color: '#0f172a' }} />
                              </div>
                            ))}
                          </div>
                        )}
                        {newQ.type === 'fill' && (
                          <div style={{ marginBottom: 10 }}>
                            <Input value={typeof newQ.answer === 'string' ? newQ.answer : ''} onChange={e => setNewQ(p => ({ ...p, answer: e.target.value }))} placeholder="To'g'ri javob..." />
                          </div>
                        )}
                        <Btn size="sm" onClick={() => addQuestion(t.id)}><Plus size={12} />Savolni qo'shish</Btn>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </Tbl>
        <Pagination page={page} total={total} perPage={8} onChange={setPage} />
      </Card>

      <ConfirmModal {...(confirm || {})} open={!!confirm} onCancel={() => setConfirm(null)} />
    </div>
  );
}
