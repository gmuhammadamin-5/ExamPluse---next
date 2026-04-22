"use client";
import React, { useState } from 'react';
import { Star, Eye, Trash2, Edit3, Ban, Play } from 'lucide-react';

/* ─── Avatar ─────────────────────────────── */
export function Avatar({ code, size = 32 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: Math.round(size / 3),
      background: 'linear-gradient(135deg,#2563eb,#7c3aed)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: Math.round(size * 0.34), fontWeight: 800, color: '#fff', flexShrink: 0,
    }}>{code}</div>
  );
}

/* ─── Badge ──────────────────────────────── */
const ST = {
  active:   { bg: '#dcfce7', c: '#16a34a', t: 'Faol'        },
  inactive: { bg: '#fef9c3', c: '#a16207', t: 'Faolsiz'     },
  banned:   { bg: '#fee2e2', c: '#dc2626', t: 'Ban'         },
  live:     { bg: '#dcfce7', c: '#16a34a', t: 'Live'        },
  draft:    { bg: '#fef9c3', c: '#a16207', t: 'Draft'       },
  paid:     { bg: '#dcfce7', c: '#16a34a', t: "To'landi"    },
  failed:   { bg: '#fee2e2', c: '#dc2626', t: 'Rad etildi'  },
  pending:  { bg: '#fef9c3', c: '#a16207', t: 'Kutilmoqda'  },
};
export function Badge({ type }) {
  const s = ST[type] || ST.active;
  return (
    <span style={{ fontSize: 11, fontWeight: 700, color: s.c, background: s.bg, padding: '2px 9px', borderRadius: 20 }}>
      {s.t}
    </span>
  );
}

/* ─── Plan badge ─────────────────────────── */
export function Plan({ p }) {
  const isPro = p === 'PRO';
  return (
    <span style={{
      fontSize: 11, fontWeight: 800,
      color: isPro ? '#7c3aed' : '#64748b',
      background: isPro ? '#ede9fe' : '#f1f5f9',
      border: `1px solid ${isPro ? '#c4b5fd' : '#e2e8f0'}`,
      padding: '2px 9px', borderRadius: 20,
    }}>{p}</span>
  );
}

/* ─── Stars ──────────────────────────────── */
export function Stars({ rating }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} size={10} fill={i <= Math.round(rating) ? '#f59e0b' : '#e2e8f0'} color={i <= Math.round(rating) ? '#f59e0b' : '#e2e8f0'} />
      ))}
      <span style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', marginLeft: 2 }}>{rating}</span>
    </div>
  );
}

/* ─── Card ───────────────────────────────── */
export function Card({ children, style = {} }) {
  return (
    <div style={{
      background: '#fff', borderRadius: 18,
      border: '1.5px solid #f1f5f9',
      boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
      overflow: 'hidden', ...style,
    }}>{children}</div>
  );
}

/* ─── CardHead ───────────────────────────── */
export function CardHead({ title, sub, action }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '16px 20px', borderBottom: '1.5px solid #f8fafc',
    }}>
      <div>
        <div style={{ fontSize: 14, fontWeight: 800, color: '#0f172a' }}>{title}</div>
        {sub && <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{sub}</div>}
      </div>
      {action}
    </div>
  );
}

/* ─── Table ──────────────────────────────── */
export function Tbl({ headers, children }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1.5px solid #f1f5f9' }}>
            {headers.map((h, i) => {
              const label  = typeof h === 'object' ? h.label  : h;
              const width  = typeof h === 'object' ? h.width  : undefined;
              const Icon   = typeof h === 'object' ? h.Icon   : undefined;
              const onClick= typeof h === 'object' ? h.onClick: undefined;
              return (
                <th key={i} onClick={onClick} style={{
                  padding: '9px 14px', textAlign: 'left',
                  fontSize: 10, fontWeight: 800, color: '#94a3b8',
                  letterSpacing: '0.8px', textTransform: 'uppercase', whiteSpace: 'nowrap',
                  width: width ?? undefined,
                  cursor: onClick ? 'pointer' : 'default',
                }}>
                  <span style={{ display:'inline-flex', alignItems:'center', gap:4 }}>
                    {label}{Icon && <Icon />}
                  </span>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

export function TRow({ cells, onClick }) {
  const [h, setH] = useState(false);
  return (
    <tr
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      onClick={onClick}
      style={{
        borderBottom: '1px solid #f8fafc',
        background: h ? '#fafcff' : 'transparent',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'background .12s',
      }}
    >
      {(cells ?? []).map((c, i) => (
        <td key={i} style={{ padding: '10px 14px', fontSize: 13, color: '#0f172a', whiteSpace: 'nowrap' }}>{c}</td>
      ))}
    </tr>
  );
}

/* ─── Action buttons ─────────────────────── */
export function ActionBtn({ icon: Icon, color, bg, onClick, title }) {
  return (
    <button
      title={title}
      onClick={e => { e.stopPropagation(); onClick && onClick(); }}
      style={{
        width: 28, height: 28, borderRadius: 8, background: bg,
        border: 'none', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'opacity .15s',
      }}
      onMouseEnter={e => e.currentTarget.style.opacity = '0.75'}
      onMouseLeave={e => e.currentTarget.style.opacity = '1'}
    >
      <Icon size={12} color={color} />
    </button>
  );
}

/* ─── Stat mini card ─────────────────────── */
export function MiniStat({ Icon, label, value, color, bg }) {
  return (
    <Card>
      <div style={{ padding: '16px 18px' }}>
        <div style={{ width: 36, height: 36, borderRadius: 11, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
          <Icon size={16} color={color} />
        </div>
        <div style={{ fontSize: 22, fontWeight: 900, color: '#0f172a' }}>{value}</div>
        <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{label}</div>
      </div>
    </Card>
  );
}

/* ─── SparkLine ──────────────────────────── */
export function SparkLine({ data, color }) {
  const max = Math.max(...data), min = Math.min(...data);
  const pts = data.map((v, i) =>
    `${i * (56 / (data.length - 1))},${26 - ((v - min) / (max - min || 1)) * 22}`
  ).join(' ');
  return (
    <svg width="56" height="26">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ─── Input ──────────────────────────────── */
export function Input({ label, value, onChange, placeholder, type = 'text', disabled }) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      {label && <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 5 }}>{label}</div>}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: '100%', padding: '9px 12px',
          border: `1.5px solid ${focused ? '#2563eb' : '#f1f5f9'}`,
          borderRadius: 10, fontSize: 13, color: '#0f172a',
          outline: 'none', background: disabled ? '#f8fafc' : '#fff',
          boxShadow: focused ? '0 0 0 3px rgba(37,99,235,0.1)' : 'none',
          transition: 'all .18s',
        }}
      />
    </div>
  );
}

export function Select({ label, value, onChange, options }) {
  return (
    <div>
      {label && <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 5 }}>{label}</div>}
      <select
        value={value} onChange={onChange}
        style={{
          width: '100%', padding: '9px 12px',
          border: '1.5px solid #f1f5f9', borderRadius: 10,
          fontSize: 13, color: '#0f172a', outline: 'none',
          background: '#fff', cursor: 'pointer',
        }}
      >
        {options.map(o => (
          <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>
        ))}
      </select>
    </div>
  );
}

/* ─── Btn ────────────────────────────────── */
export function Btn({ children, onClick, variant = 'primary', size = 'md', disabled, style: s = {} }) {
  const variants = {
    primary:   { background: 'linear-gradient(135deg,#2563eb,#1d4ed8)', color: '#fff', border: 'none' },
    danger:    { background: 'linear-gradient(135deg,#ef4444,#dc2626)', color: '#fff', border: 'none' },
    secondary: { background: '#f8fafc', color: '#64748b', border: '1.5px solid #f1f5f9' },
    success:   { background: 'linear-gradient(135deg,#059669,#047857)', color: '#fff', border: 'none' },
  };
  const sizes = {
    sm: { padding: '6px 12px', fontSize: 12 },
    md: { padding: '9px 18px', fontSize: 13 },
    lg: { padding: '12px 24px', fontSize: 14 },
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        ...variants[variant], ...sizes[size],
        borderRadius: 11, fontWeight: 700, cursor: disabled ? 'not-allowed' : 'pointer',
        fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center', gap: 6,
        opacity: disabled ? 0.6 : 1, transition: 'all .18s', ...s,
      }}
    >{children}</button>
  );
}

/* ─── Video thumb ────────────────────────── */
export function VideoThumb() {
  return (
    <div style={{ width: 44, height: 32, borderRadius: 7, background: '#1e3a8a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <Play size={12} fill='#fff' color='#fff' />
    </div>
  );
}

/* ─── export CSV util ────────────────────── */
export function downloadCSV(filename, headers, rows) {
  const lines = [headers.join(','), ...rows.map(r => r.map(c => `"${c}"`).join(','))];
  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}
