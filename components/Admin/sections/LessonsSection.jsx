"use client";
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Plus, X, Edit3, Trash2, Check, RefreshCw, AlertCircle, Upload, Eye, EyeOff, Play, Film } from 'lucide-react';
import { Card, CardHead, Tbl, TRow, ActionBtn, Input, Select, Btn } from '../components/helpers';
import { Pagination, usePagination } from '../components/Pagination';
import { ConfirmModal } from '../components/ConfirmModal';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const CATS = ['IELTS', 'CAMBRIDGE', 'TOEFL', 'CEFR', 'SAT', 'Umumiy'];
const CAT_COLORS = { IELTS:'#2563eb', CAMBRIDGE:'#7c3aed', TOEFL:'#0891b2', CEFR:'#059669', SAT:'#ea580c', Umumiy:'#64748b' };

const BLANK = { title: '', category: 'IELTS', description: '', duration: '', order: '0', is_visible: true };

function adminToken() { return sessionStorage.getItem('ep_admin_token') || ''; }

function formatBytes(bytes) {
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  if (bytes < 1024 * 1024 * 1024) return (bytes / 1024 / 1024).toFixed(1) + ' MB';
  return (bytes / 1024 / 1024 / 1024).toFixed(2) + ' GB';
}

export default function LessonsSection({ toast }) {
  const [lessons,    setLessons]   = useState([]);
  const [loading,    setLoading]   = useState(true);
  const [error,      setError]     = useState('');
  const [catFilter,  setCatFilter] = useState('all');
  const [showForm,   setShowForm]  = useState(false);
  const [editLesson, setEditLesson]= useState(null);
  const [form,       setForm]      = useState(BLANK);
  const [videoFile,  setVideoFile] = useState(null);
  const [uploading,  setUploading] = useState(false);
  const [uploadPct,  setUploadPct] = useState(0);
  const [confirm,    setConfirm]   = useState(null);
  const [preview,    setPreview]   = useState(null);
  const fileRef = useRef(null);

  /* ── fetch ──────────────────────────────────────────────── */
  const load = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const res = await fetch(`${API_URL}/api/admin/lessons`, {
        headers: { Authorization: `Bearer ${adminToken()}` },
      });
      if (!res.ok) throw new Error(res.status);
      setLessons(await res.json());
    } catch (e) { setError('Yuklab bo\'lmadi: ' + e.message); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  /* ── filter + paginate ──────────────────────────────────── */
  const filtered = catFilter === 'all' ? lessons : lessons.filter(l => l.category === catFilter);
  const { page, setPage, total, sliced, reset } = usePagination(filtered, 10);

  /* ── form helpers ───────────────────────────────────────── */
  const openAdd = () => { setForm(BLANK); setVideoFile(null); setEditLesson(null); setShowForm(true); };
  const openEdit = (l) => {
    setForm({ title: l.title, category: l.category, description: l.description || '', duration: l.duration || '', order: String(l.order), is_visible: l.is_visible });
    setVideoFile(null);
    setEditLesson(l);
    setShowForm(true);
  };
  const closeForm = () => { setShowForm(false); setEditLesson(null); setVideoFile(null); setUploadPct(0); };
  const f = k => e => setForm(p => ({ ...p, [k]: e.target.value }));
  const fCheck = k => e => setForm(p => ({ ...p, [k]: e.target.checked }));

  /* ── upload with XHR (progress tracking) ───────────────── */
  const saveLesson = () => {
    if (!form.title.trim()) { toast('Dars nomini kiriting', 'error'); return; }
    if (!editLesson && !videoFile) { toast('Video fayl tanlang', 'error'); return; }

    setUploading(true);
    setUploadPct(0);

    const data = new FormData();
    data.append('title',       form.title);
    data.append('category',    form.category);
    data.append('description', form.description);
    data.append('duration',    form.duration);
    data.append('order',       form.order || '0');
    data.append('is_visible',  form.is_visible ? 'true' : 'false');
    if (videoFile) data.append('video', videoFile);

    const url    = editLesson ? `${API_URL}/api/admin/lessons/${editLesson.id}` : `${API_URL}/api/admin/lessons`;
    const method = editLesson ? 'PUT' : 'POST';

    const xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.setRequestHeader('Authorization', `Bearer ${adminToken()}`);

    xhr.upload.onprogress = e => {
      if (e.lengthComputable) setUploadPct(Math.round(e.loaded / e.total * 100));
    };

    xhr.onload = async () => {
      setUploading(false);
      if (xhr.status >= 200 && xhr.status < 300) {
        toast(editLesson ? 'Dars yangilandi ✓' : 'Dars qo\'shildi ✓', 'success');
        closeForm();
        load();
      } else {
        try { const d = JSON.parse(xhr.responseText); toast('Xatolik: ' + (d.detail || xhr.status), 'error'); }
        catch { toast('Xatolik: ' + xhr.status, 'error'); }
      }
    };
    xhr.onerror = () => { setUploading(false); toast('Tarmoq xatoligi', 'error'); };
    xhr.send(data);
  };

  /* ── delete ─────────────────────────────────────────────── */
  const deleteLesson = (l) => {
    setConfirm({
      title: 'Darsni o\'chirish',
      message: `"${l.title}" darsini o'chirasizmi? Video ham o'chib ketadi.`,
      danger: true,
      onConfirm: async () => {
        setConfirm(null);
        try {
          const res = await fetch(`${API_URL}/api/admin/lessons/${l.id}`, {
            method: 'DELETE', headers: { Authorization: `Bearer ${adminToken()}` },
          });
          if (!res.ok) throw new Error(res.status);
          toast('Dars o\'chirildi', 'success');
          load();
        } catch (e) { toast('O\'chirishda xatolik: ' + e.message, 'error'); }
      },
    });
  };

  /* ── toggle visibility ──────────────────────────────────── */
  const toggleVisible = async (l) => {
    const data = new FormData();
    data.append('title',       l.title);
    data.append('category',    l.category);
    data.append('description', l.description || '');
    data.append('duration',    l.duration || '');
    data.append('order',       String(l.order));
    data.append('is_visible',  (!l.is_visible).toString());
    try {
      await fetch(`${API_URL}/api/admin/lessons/${l.id}`, {
        method: 'PUT', headers: { Authorization: `Bearer ${adminToken()}` }, body: data,
      });
      load();
    } catch { toast('Xatolik', 'error'); }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Video preview modal */}
      {preview && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={() => setPreview(null)}>
          <div style={{ position: 'relative', width: '90%', maxWidth: 900 }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setPreview(null)}
              style={{ position: 'absolute', top: -40, right: 0, background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 14 }}>
              <X size={22} color="#fff" /> Yopish
            </button>
            <video src={preview} controls autoPlay style={{ width: '100%', borderRadius: 14, maxHeight: '80vh' }} />
          </div>
        </div>
      )}

      {/* add / edit form */}
      {showForm && (
        <Card>
          <CardHead
            title={editLesson ? 'Darsni tahrirlash' : 'Yangi dars qo\'shish'}
            action={
              <button onClick={closeForm} style={{ width: 30, height: 30, borderRadius: 8, background: '#fee2e2', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={13} color="#dc2626" />
              </button>
            }
          />
          <div style={{ padding: '16px 20px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>

            {/* title */}
            <div style={{ gridColumn: '1/-1' }}>
              <Input label="Dars nomi *" value={form.title} onChange={f('title')} placeholder="IELTS Writing Task 2 - Essay yozish" />
            </div>

            <Select label="Kategoriya" value={form.category} onChange={f('category')} options={CATS} />
            <Input label="Davomiyligi" value={form.duration} onChange={f('duration')} placeholder="18:32" />
            <Input label="Tartib raqami" value={form.order} onChange={f('order')} type="number" placeholder="1" />

            <div style={{ gridColumn: '1/-1' }}>
              <Input label="Tavsif (ixtiyoriy)" value={form.description} onChange={f('description')} placeholder="Bu darsda nima o'rganasiz..." />
            </div>

            {/* video file picker */}
            <div style={{ gridColumn: '1/-1' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 8 }}>
                Video fayl {editLesson ? '(yangilash uchun tanlang)' : '*'}
              </div>
              <div
                onClick={() => fileRef.current?.click()}
                style={{
                  border: `2px dashed ${videoFile ? '#2563eb' : '#e2e8f0'}`,
                  borderRadius: 12, padding: '24px 20px', textAlign: 'center', cursor: 'pointer',
                  background: videoFile ? '#eff6ff' : '#fafafa', transition: 'all .2s',
                }}
              >
                <Film size={28} color={videoFile ? '#2563eb' : '#94a3b8'} style={{ marginBottom: 8 }} />
                {videoFile ? (
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: '#0f172a' }}>{videoFile.name}</div>
                    <div style={{ fontSize: 12, color: '#2563eb', marginTop: 4 }}>{formatBytes(videoFile.size)}</div>
                  </div>
                ) : (
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14, color: '#64748b' }}>Video tanlash uchun bosing</div>
                    <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>MP4, WebM, MOV — har qanday o'lcham</div>
                  </div>
                )}
                <input ref={fileRef} type="file" accept="video/*" style={{ display: 'none' }}
                  onChange={e => setVideoFile(e.target.files[0] || null)} />
              </div>

              {/* upload progress */}
              {uploading && (
                <div style={{ marginTop: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 12, fontWeight: 600, color: '#2563eb' }}>
                    <span>Yuklanmoqda...</span><span>{uploadPct}%</span>
                  </div>
                  <div style={{ height: 8, background: '#e2e8f0', borderRadius: 99, overflow: 'hidden' }}>
                    <div style={{ height: '100%', background: 'linear-gradient(90deg,#2563eb,#7c3aed)', borderRadius: 99, width: `${uploadPct}%`, transition: 'width .3s' }} />
                  </div>
                </div>
              )}
            </div>

            {/* checkboxes */}
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#0f172a', gridColumn: '1/-1' }}>
              <input type="checkbox" checked={form.is_visible} onChange={fCheck('is_visible')} style={{ width: 16, height: 16, cursor: 'pointer' }} />
              Ko'rinadigan (Visible)
            </label>

            {/* actions */}
            <div style={{ gridColumn: '1/-1', display: 'flex', gap: 10 }}>
              <Btn onClick={saveLesson} disabled={uploading}>
                {uploading ? <><Upload size={13} />Yuklanmoqda...</> : <><Check size={13} />{editLesson ? 'Yangilash' : 'Saqlash'}</>}
              </Btn>
              <Btn variant="secondary" onClick={closeForm} disabled={uploading}>Bekor</Btn>
            </div>
          </div>
        </Card>
      )}

      {/* lessons table */}
      <Card>
        <CardHead
          title="Video darslar"
          sub={`${filtered.length} ta dars`}
          action={
            <div style={{ display: 'flex', gap: 8 }}>
              <select value={catFilter} onChange={e => { setCatFilter(e.target.value); reset(); }}
                style={{ padding: '7px 10px', border: '1.5px solid #f1f5f9', borderRadius: 10, fontSize: 12, color: '#64748b', outline: 'none', background: '#fff' }}>
                <option value="all">Barcha kategoriyalar</option>
                {CATS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <button onClick={load}
                style={{ padding: '7px 10px', border: '1.5px solid #f1f5f9', borderRadius: 10, fontSize: 12, color: '#64748b', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
                <RefreshCw size={12} />Yangilash
              </button>
              <Btn size="sm" onClick={openAdd}><Plus size={12} />Yangi dars</Btn>
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
          <div style={{ padding: '40px 20px', textAlign: 'center' }}>
            <Film size={40} color="#e2e8f0" style={{ marginBottom: 12 }} />
            <div style={{ color: '#94a3b8', fontSize: 13 }}>Hali darslar yo'q. "Yangi dars" tugmasini bosing.</div>
          </div>
        ) : (
          <>
            <Tbl headers={['Dars nomi', 'Kategoriya', 'Davomiyligi', 'Ko\'rishlar', 'Tartib', 'Holat', 'Amallar']}>
              {sliced.map(l => (
                <TRow key={l.id} cells={[
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 13 }}>{l.title}</div>
                    {l.description && <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 1 }}>{l.description.slice(0, 60)}{l.description.length > 60 ? '...' : ''}</div>}
                  </div>,
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#fff', background: CAT_COLORS[l.category] || '#64748b', padding: '2px 8px', borderRadius: 7 }}>{l.category}</span>,
                  <span style={{ fontSize: 12, color: '#64748b' }}>{l.duration || '—'}</span>,
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#059669' }}>{(l.views || 0).toLocaleString()}</span>,
                  <span style={{ fontSize: 12, color: '#94a3b8' }}>{l.order}</span>,
                  <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 20,
                    color: l.is_visible ? '#16a34a' : '#a16207', background: l.is_visible ? '#dcfce7' : '#fef9c3' }}>
                    {l.is_visible ? 'Ko\'rinadi' : 'Yashirin'}
                  </span>,
                  <div style={{ display: 'flex', gap: 5 }}>
                    <ActionBtn icon={Play}    color="#2563eb" bg="#eff6ff" onClick={() => setPreview(l.video_url)} title="Ko'rish" />
                    <ActionBtn icon={l.is_visible ? EyeOff : Eye} color="#f59e0b" bg="#fffbeb" onClick={() => toggleVisible(l)} title={l.is_visible ? 'Yashirish' : 'Ko\'rsatish'} />
                    <ActionBtn icon={Edit3}   color="#059669" bg="#ecfdf5" onClick={() => openEdit(l)} title="Tahrirlash" />
                    <ActionBtn icon={Trash2}  color="#dc2626" bg="#fee2e2" onClick={() => deleteLesson(l)} title="O'chirish" />
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
