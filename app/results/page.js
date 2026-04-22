"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import {
  Trophy, Headphones, BookOpen, PenTool, Mic,
  TrendingUp, Calendar, Clock, ChevronRight,
  Sparkles, Lock, BarChart2
} from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const BRAND = '#007bff';

const SEC_META = {
  listening: { label: 'Listening', icon: Headphones, color: '#007bff' },
  reading:   { label: 'Reading',   icon: BookOpen,   color: '#7c3aed' },
  writing:   { label: 'Writing',   icon: PenTool,    color: '#ea580c' },
  speaking:  { label: 'Speaking',  icon: Mic,        color: '#059669' },
};

function ScoreBadge({ score }) {
  const band = parseFloat(score) || 0;
  const color = band >= 7.5 ? '#059669' : band >= 6.5 ? '#007bff' : band >= 5.5 ? '#f59e0b' : '#ef4444';
  return (
    <div style={{ width: 52, height: 52, borderRadius: '50%', border: `3px solid ${color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 15, color, background: `${color}12`, flexShrink: 0 }}>
      {band.toFixed(1)}
    </div>
  );
}

function ResultCard({ r }) {
  const [open, setOpen] = useState(false);
  const meta = SEC_META[r.section] || { label: r.section, icon: Trophy, color: BRAND };
  const Icon = meta.icon;
  const date = new Date(r.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <div style={{ background: '#fff', borderRadius: 16, border: '1.5px solid #e2e8f0', overflow: 'hidden', marginBottom: 12 }}>
      <div
        onClick={() => setOpen(!open)}
        style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 20px', cursor: 'pointer' }}
      >
        <div style={{ width: 44, height: 44, borderRadius: 12, background: `${meta.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Icon size={20} color={meta.color} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>{r.exam_type} — {meta.label}</div>
          <div style={{ display: 'flex', gap: 12, marginTop: 3 }}>
            <span style={{ fontSize: 11, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 4 }}><Calendar size={11} />{date}</span>
            {r.word_count && <span style={{ fontSize: 11, color: '#94a3b8' }}>{r.word_count} words</span>}
          </div>
        </div>
        <ScoreBadge score={r.band_score || (r.score / 11.1).toFixed(1)} />
        <ChevronRight size={16} color="#94a3b8" style={{ transform: open ? 'rotate(90deg)' : 'none', transition: '0.2s' }} />
      </div>

      {open && (
        <div style={{ padding: '0 20px 20px', borderTop: '1px solid #f1f5f9' }}>
          {/* Criteria scores */}
          {r.ai_scores && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 8, marginTop: 14, marginBottom: 14 }}>
              {Object.entries(r.ai_scores).map(([k, v]) => (
                <div key={k} style={{ background: '#f8faff', borderRadius: 10, padding: '10px 14px' }}>
                  <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 }}>
                    {k.replace(/_/g, ' ')}
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 900, color: BRAND }}>{Number(v).toFixed(1)}</div>
                </div>
              ))}
            </div>
          )}
          {/* AI Feedback */}
          {r.ai_feedback && (
            <div style={{ background: '#eff6ff', borderRadius: 12, padding: '14px 16px' }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: BRAND, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Sparkles size={12} /> AI Feedback
              </div>
              <p style={{ fontSize: 13, color: '#1e3a8a', lineHeight: 1.65, margin: 0 }}>{r.ai_feedback}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function ResultsPage() {
  const { isAuthenticated, openAuthModal } = useAuth();
  const router = useRouter();
  const [results, setResults] = useState([]);
  const [stats, setStats]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState('all');

  useEffect(() => {
    if (!isAuthenticated) { setLoading(false); return; }
    const token = localStorage.getItem('access_token');
    const headers = { Authorization: `Bearer ${token}` };

    Promise.all([
      fetch(`${API}/api/results?limit=50`, { headers }).then(r => r.json()).catch(() => []),
      fetch(`${API}/api/results/stats`, { headers }).then(r => r.json()).catch(() => null),
    ]).then(([res, st]) => {
      setResults(Array.isArray(res) ? res : []);
      setStats(st);
      setLoading(false);
    });
  }, [isAuthenticated]);

  const filtered = filter === 'all' ? results : results.filter(r => r.section === filter);

  if (!isAuthenticated) return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8faff' }}>
      <div style={{ background: '#fff', borderRadius: 20, padding: '48px 36px', maxWidth: 420, width: '90%', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.08)' }}>
        <div style={{ width: 60, height: 60, borderRadius: 18, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <Lock size={28} color={BRAND} />
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', margin: '0 0 10px' }}>Login Required</h2>
        <p style={{ fontSize: 14, color: '#64748b', margin: '0 0 24px' }}>Log in to view your test results and AI feedback.</p>
        <button onClick={() => openAuthModal('login')} style={{ background: BRAND, color: '#fff', border: 'none', borderRadius: 12, padding: '13px 32px', fontSize: 15, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit', width: '100%' }}>
          Log in
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#f8faff', fontFamily: "'Inter', system-ui, sans-serif", paddingTop: 80 }}>
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '32px 20px 80px' }}>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: '#0f172a', margin: '0 0 6px' }}>My Results</h1>
          <p style={{ fontSize: 14, color: '#64748b', margin: 0 }}>All your test results with AI feedback</p>
        </div>

        {/* Stats */}
        {stats && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 14, marginBottom: 28 }}>
            {[
              { label: 'Tests taken', value: stats.total_tests || results.length, icon: <Trophy size={18} color={BRAND} /> },
              { label: 'Avg band', value: stats.avg_band ? Number(stats.avg_band).toFixed(1) : '—', icon: <TrendingUp size={18} color="#059669" /> },
              { label: 'Best band', value: stats.best_band ? Number(stats.best_band).toFixed(1) : '—', icon: <Sparkles size={18} color="#f59e0b" /> },
            ].map((s, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: 16, border: '1.5px solid #e2e8f0', padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: '#f8faff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{s.icon}</div>
                <div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: '#0f172a' }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Filter */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 20, flexWrap: 'wrap' }}>
          {['all', 'writing', 'speaking', 'reading', 'listening'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '7px 16px', borderRadius: 10, border: '1.5px solid',
              fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
              background: filter === f ? BRAND : '#fff',
              color: filter === f ? '#fff' : '#64748b',
              borderColor: filter === f ? BRAND : '#e2e8f0',
              transition: 'all .15s',
            }}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Results list */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#94a3b8' }}>Loading results...</div>
        ) : filtered.length === 0 ? (
          <div style={{ background: '#fff', borderRadius: 16, border: '1.5px solid #e2e8f0', padding: '60px 20px', textAlign: 'center' }}>
            <BarChart2 size={40} color="#e2e8f0" style={{ marginBottom: 16 }} />
            <div style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>No results yet</div>
            <p style={{ fontSize: 13, color: '#94a3b8', margin: '0 0 20px' }}>Complete a test to see your results and AI feedback here.</p>
            <button onClick={() => router.push('/tests')} style={{ background: BRAND, color: '#fff', border: 'none', borderRadius: 10, padding: '11px 24px', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
              Go to Tests
            </button>
          </div>
        ) : (
          filtered.map(r => <ResultCard key={r.id} r={r} />)
        )}
      </div>
    </div>
  );
}
