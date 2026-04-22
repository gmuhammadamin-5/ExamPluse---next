"use client";
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function Pagination({ page, total, perPage, onChange }) {
  const totalPages = Math.ceil(total / perPage);
  if (totalPages <= 1) return null;

  const pages = [];
  const delta = 2;
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= page - delta && i <= page + delta)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...');
    }
  }

  const btnStyle = (active) => ({
    minWidth: 32, height: 32, borderRadius: 9,
    border: active ? 'none' : '1.5px solid #f1f5f9',
    background: active ? 'linear-gradient(135deg,#2563eb,#1d4ed8)' : '#fff',
    color: active ? '#fff' : '#64748b',
    fontSize: 13, fontWeight: active ? 700 : 500,
    cursor: 'pointer', fontFamily: 'inherit',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '0 8px',
    boxShadow: active ? '0 2px 8px rgba(37,99,235,0.3)' : 'none',
    transition: 'all .15s',
  });

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderTop: '1.5px solid #f8fafc' }}>
      <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>
        {(page - 1) * perPage + 1}–{Math.min(page * perPage, total)} / {total} ta
      </span>
      <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
        <button
          onClick={() => onChange(page - 1)}
          disabled={page === 1}
          style={{ ...btnStyle(false), opacity: page === 1 ? 0.4 : 1 }}
        ><ChevronLeft size={14} /></button>

        {pages.map((p, i) =>
          p === '...'
            ? <span key={i} style={{ color: '#94a3b8', padding: '0 4px' }}>…</span>
            : <button key={p} onClick={() => onChange(p)} style={btnStyle(p === page)}>{p}</button>
        )}

        <button
          onClick={() => onChange(page + 1)}
          disabled={page === totalPages}
          style={{ ...btnStyle(false), opacity: page === totalPages ? 0.4 : 1 }}
        ><ChevronRight size={14} /></button>
      </div>
    </div>
  );
}

export function usePagination(data, perPage = 10) {
  const [page, setPage] = React.useState(1);
  const total = data.length;
  const sliced = data.slice((page - 1) * perPage, page * perPage);
  const reset = () => setPage(1);
  return { page, setPage, total, sliced, reset };
}
