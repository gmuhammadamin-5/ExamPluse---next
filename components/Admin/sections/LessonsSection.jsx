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
  const [lessons,    setLessons]    = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState('');
  const [catFilter,  setCatFilter]  = useState('all');
  const [showForm,   setShowForm]   = useState(false);
  const [editLesson, setEditLesson] = useState(null);
  const [form,       setForm]       = useState(BLANK);
  const [videoFile,  setVideoFile]  = useState(null);
  const [videoUrl,   setVideoUrl]   = useState('');   // uploaded public URL
  const [uploading,  setUploading]  = useState(false);
  const [uploadPct,  setUploadPct]  = useState(0);
  const [uploadDone, setUploadDone] = useState(false);
  const [saving,     setSaving]     = useState(false);
  const [confirm,    setConfirm]    = useState(null);
  const [preview,    setPreview]    = useState(null);
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
    } catch (e) { setError("Yuklab bo'lmadi: " + e.message); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  /* ── filter + paginate ──────────────────────────────────── */
  const filtered = catFilter === 'all' ? lessons : lessons.filter(l => l.category === catFilter);
  const { page, setPage, total, sliced, reset } = usePagination(filtered, 10);

  /* ── form helpers ───────────────────────────────────────── */
  const openAdd = () => {
    setForm(BLANK); setVideoFile(null); setVideoUrl(''); setUploadDone(false);
    setEditLesson(null); setShowForm(true);
  };
  const openEdit = (l) => {
    setForm({ title: l.title, category: l.category, description: l.description || '',
      duration: l.duration || '', order: String(l.order), is_visible: l.is_visible });
    setVideoFile(null); setVideoUrl(l.video_url || ''); setUploadDone(true);
    setEditLesson(l); setShowForm(true);
  };
  const closeForm = () => {
    setShowForm(false); setEditLesson(null); setVideoFile(null);
    setVideoUrl(''); setUploadDone(false); setUploadPct(0);
  };
  const f = k => e => setForm(p => ({ ...p, [k]: e.target.value }));
  const fCheck = k => e => setForm(p => ({ ...p, [k]: e.target.checked }));

  /* ── Step 1: upload video directly to Supabase ──────────── */
  const uploadVideo = async (file) => {
    setUploading(true); setUploadPct(0); setUploadDone(false); setVideoUrl('');
    try {
      // 1. Get signed upload URL from backend
      const urlRes = await fetch(`${API_URL}/api/admin/lessons/upload-url`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken()}` },
        body: JSON.stringify({ filename: file.name }),
      });
      if (!urlRes.ok) throw new Error('Signed URL olishda xatolik');
      const { signed_url, public_url, token } = await urlRes.json();

      // 2. Upload file directly to Supabase using XHR (for progress)
      await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        // Supabase signed URL upload format
        const uploadUrl = `${signed_url}${token ? `?token=${token}` : ''}`;
        xhr.open('PUT', signed_url);
        xhr.setRequestHeader('Content-Type', file.type || 'video/mp4');
        xhr.upload.onprogress = e => {
          if (e.lengthComputable) setUploadPct(Math.round(e.loaded / e.total * 100));
        };
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) resolve();
          else reject(new Error(`Supabase xatolik: ${xhr.status} ${xhr.responseText}`));
        };
        xhr.onerror = () => reject(new Error('Tarmoq xatoligi'));
        xhr.send(file);
      });

      setVideoUrl(public_url);
      setUploadDone(true);
      toast('Video yuklandi ✓', 'success');
    } catch (e) {
      toast('Video yuklashda xatolik: ' + e.message, 'error');
    } finally {
      setUploading(false);
    }
  };

  const onFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setVideoFile(file);
    uploadVideo(file);
  };

  /* ── Step 2: save metadata to backend ──────────────────── */
  const saveLesson = async () => {
    if (!form.title.trim()) { toast('Dars nomini kiriting', 'error'); return; }
    if (!videoUrl) { toast('Avval video yuklang', 'error'); return; }
    setSaving(true);
    try {
      const payload = {
        title: form.title, category: form.category, description: form.description,
        video_url: videoUrl, duration: form.duration,
        order: Number(form.order) || 0, is_visible: form.is_visible,
      };
      const url    = editLesson ? `${API_URL}/api/admin/lessons/${editLesson.id}` : `${API_URL}/api/admin/lessons`;
      const method = editLesson ? 'PUT' : 'POST';
      const res    = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken()}` },
        body: JSON.stringify(payload),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.detail || res.status); }
      toast(editLesson ? 'Dars yangilandi ✓' : "Dars qo'shildi ✓", 'success');
      closeForm(); load();
    } catch (e) {
      toast('Xatolik: ' + e.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  /* ── delete ─────────────────────────────────────────────── */
  const deleteLesson = (l) => {
    setConfirm({
      title: "Darsni o'chirish",
      message: `"${l.title}" darsini o'chirasizmi?`,
      danger: true,
      onConfirm: async () => {
        setConfirm(null);
        try {
          const res = await fetch(`${API_URL}/api/admin/lessons/${l.id}`, {
            method: 'DELETE', headers: { Authorization: `Bearer ${adminToken()}` },
          });
          if (!res.ok) throw new Error(res.status);
          toast("Dars o'chirildi", 'success'); load();
        } catch (e) { toast("O'chirishda xatolik: " + e.message, 'error'); }
      },
    });
  };

  /* ── toggle visibility ──────────────────────────────────── */
  const toggleVisible = async (l) => {
    try {
      await fetch(`${API_URL}/api/admin/lessons/${l.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken()}` },
        body: JSON.stringify({ title: l.title, category: l.category, description: l.description || '',
          video_url: l.video_url, duration: l.duration || '', order: l.order, is_visible: !l.is_visible }),
      });
      load();
    } catch { toast('Xatolik', 'error'); }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Video preview modal */}
      {preview && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.88)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={() => setPreview(null)}>
          <div style={{ position: 'relative', width: '90%', maxWidth: 960 }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setPreview(null)}
              style={{ position: 'absolute', top: -40, right: 0, background: 'none', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, fontFamily: 'inherit' }}>
              <X size={18} /> Yopish
            </button>
            <video src={preview} controls autoPlay style={{ width: '100%', borderRadius: 14, maxHeight: '80vh', background: '#000' }} />
          </div>
        </div>
      )}

      {/* add / edit form */}
      {showForm && (
        <Card>
          <CardHead
            title={editLesson ? 'Darsni tahrirlash' : "Yangi dars qo'shish"}
            action={
              <button onClick={closeForm} style={{ width: 30, height: 30, borderRadius: 8, background: '#fee2e2', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={13} color="#dc2626" />
              </button>
            }
          />
          <div style={{ padding: '16px 20px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>

            <div style={{ gridColumn: '1/-1' }}>
              <Input label="Dars nomi *" value={form.title} onChange={f('title')} placeholder="IELTS Writing Task 2 - Essay yozish" />
            </div>

            <Select label="Kategoriya" value={form.category} onChange={f('category')} options={CATS} />
            <Input label="Davomiyligi" value={form.duration} onChange={f('duration')} placeholder="18:32" />
            <Input label="Tartib raqami" value={form.order} onChange={f('order')} type="number" placeholder="1" />

            <div style={{ gridColumn: '1/-1' }}>
              <Input label="Tavsif (ixtiyoriy)" value={form.description} onChange={f('description')} placeholder="Bu darsda nima o'rganasiz..." />
            </div>

            {/* Video upload area */}
            <div style={{ gridColumn: '1/-1' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 8 }}>
                Video fayl {editLesson ? '(yangi video yuklash — ixtiyoriy)' : '*'}
              </div>

              {/* Upload box */}
              <div onClick={() => !uploading && fileRef.current?.click()}
                style={{ border: `2px dashed ${uploadDone ? '#059669' : uploading ? '#2563eb' : '#e2e8f0'}`,
                  borderRadius: 12, padding: '28px 20px', textAlign: 'center',
                  cursor: uploading ? 'default' : 'pointer',
                  background: uploadDone ? '#f0fdf4' : uploading ? '#eff6ff' : '#fafafa', transition: 'all .2s' }}>

                {uploadDone ? (
                  <div>
                    <div style={{ fontSize: 32, marginBottom: 8 }}>✅</div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: '#059669' }}>Video yuklandi!</div>
                    <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>
                      {videoFile ? videoFile.name : 'Mavjud video'}
                    </div>
                    <div style={{ fontSize: 11, color: '#2563eb', marginTop: 6, cursor: 'pointer', textDecoration: 'underline' }}>
                      Boshqa video tanlash
                    </div>
                  </div>
                ) : uploading ? (
                  <div>
                    <Upload size={28} color="#2563eb" style={{ marginBottom: 10 }} />
                    <div style={{ fontWeight: 700, fontSize: 14, color: '#2563eb', marginBottom: 12 }}>
                      Supabase ga yuklanmoqda... {uploadPct}%
                    </div>
                    <div style={{ height: 10, background: '#dbeafe', borderRadius: 99, overflow: 'hidden', maxWidth: 300, margin: '0 auto' }}>
                      <div style={{ height: '100%', background: 'linear-gradient(90deg,#2563eb,#7c3aed)',
                        borderRadius: 99, width: `${uploadPct}%`, transition: 'width .3s' }} />
                    </div>
                  </div>
                ) : (
                  <div>
                    <Film size={32} color="#94a3b8" style={{ marginBottom: 10 }} />
                    <div style={{ fontWeight: 600, fontSize: 14, color: '#64748b' }}>Video tanlash uchun bosing</div>
                    <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>MP4, WebM, MOV — har qanday o'lcham</div>
                  </div>
                )}

                <input ref={fileRef} type="file" accept="video/*" style={{ display: 'none' }} onChange={onFileChange} />
              </div>
            </div>

            {/* checkboxes */}
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#0f172a', gridColumn: '1/-1' }}>
              <input type="checkbox" checked={form.is_visible} onChange={fCheck('is_visible')} style={{ width: 16, height: 16, cursor: 'pointer' }} />
              Ko'rinadigan (Visible)
            </label>

            <div style={{ gridColumn: '1/-1', display: 'flex', gap: 10 }}>
              <Btn onClick={saveLesson} disabled={saving || uploading}>
                {saving ? <><Upload size={13} />Saqlanmoqda...</> : <><Check size={13} />{editLesson ? 'Yangilash' : 'Saqlash'}</>}
              </Btn>
              <Btn variant="secondary" onClick={closeForm} disabled={uploading || saving}>Bekor</Btn>
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
            <Tbl headers={['Dars nomi', 'Kategoriya', 'Davomiyligi', "Ko'rishlar", 'Tartib', 'Holat', 'Amallar']}>
              {sliced.map(l => (
                <TRow key={l.id} cells={[
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 13 }}>{l.title}</div>
                    {l.description && <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 1 }}>{l.description.slice(0, 55)}{l.description.length > 55 ? '...' : ''}</div>}
                  </div>,
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#fff', background: CAT_COLORS[l.category] || '#64748b', padding: '2px 8px', borderRadius: 7 }}>{l.category}</span>,
                  <span style={{ fontSize: 12, color: '#64748b' }}>{l.duration || '—'}</span>,
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#059669' }}>{(l.views || 0).toLocaleString()}</span>,
                  <span style={{ fontSize: 12, color: '#94a3b8' }}>{l.order}</span>,
                  <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 20,
                    color: l.is_visible ? '#16a34a' : '#a16207', background: l.is_visible ? '#dcfce7' : '#fef9c3' }}>
                    {l.is_visible ? "Ko'rinadi" : 'Yashirin'}
                  </span>,
                  <div style={{ display: 'flex', gap: 5 }}>
                    <ActionBtn icon={Play}    color="#2563eb" bg="#eff6ff" onClick={() => setPreview(l.video_url)} title="Ko'rish" />
                    <ActionBtn icon={l.is_visible ? EyeOff : Eye} color="#f59e0b" bg="#fffbeb" onClick={() => toggleVisible(l)} title={l.is_visible ? 'Yashirish' : "Ko'rsatish"} />
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
