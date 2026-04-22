"use client";
import React, { useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

const ICONS = {
  success: { Icon: CheckCircle, color: '#16a34a', bg: '#dcfce7', border: '#bbf7d0' },
  error:   { Icon: XCircle,     color: '#dc2626', bg: '#fee2e2', border: '#fecaca' },
  warning: { Icon: AlertCircle, color: '#a16207', bg: '#fef9c3', border: '#fef08a' },
  info:    { Icon: Info,        color: '#2563eb', bg: '#dbeafe', border: '#bfdbfe' },
};

export function Toast({ toasts, remove }) {
  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
      display: 'flex', flexDirection: 'column', gap: 10,
      pointerEvents: 'none',
    }}>
      {toasts.map(t => {
        const s = ICONS[t.type] || ICONS.info;
        return (
          <div key={t.id} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            background: s.bg, border: `1.5px solid ${s.border}`,
            borderRadius: 14, padding: '12px 16px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            minWidth: 280, maxWidth: 360,
            animation: 'toastIn .25s cubic-bezier(.34,1.4,.64,1)',
            pointerEvents: 'all',
          }}>
            <s.Icon size={18} color={s.color} style={{ flexShrink: 0 }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', flex: 1 }}>{t.msg}</span>
            <button onClick={() => remove(t.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, display: 'flex', alignItems: 'center' }}>
              <X size={14} color={s.color} />
            </button>
          </div>
        );
      })}
      <style>{`@keyframes toastIn{from{opacity:0;transform:translateY(10px) scale(.95)}to{opacity:1;transform:none}}`}</style>
    </div>
  );
}

export function useToast() {
  const [toasts, setToasts] = React.useState([]);
  const add = React.useCallback((msg, type = 'success') => {
    const id = Date.now();
    setToasts(p => [...p, { id, msg, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3500);
  }, []);
  const remove = React.useCallback(id => setToasts(p => p.filter(t => t.id !== id)), []);
  return { toasts, add, remove };
}
