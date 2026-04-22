"use client";
import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

export function ConfirmModal({ open, title, message, confirmLabel = "Ha, o'chirish", cancelLabel = 'Bekor', onConfirm, onCancel, danger = true }) {
  if (!open) return null;
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.55)',
      backdropFilter: 'blur(4px)', zIndex: 8000,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
    }} onClick={onCancel}>
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#fff', borderRadius: 22, padding: '32px 28px',
          maxWidth: 420, width: '100%', textAlign: 'center',
          boxShadow: '0 24px 64px rgba(0,0,0,0.18)',
          animation: 'cmIn .22s cubic-bezier(.34,1.4,.64,1)',
        }}
      >
        <div style={{
          width: 56, height: 56, borderRadius: '50%',
          background: danger ? '#fee2e2' : '#dbeafe',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 16px',
        }}>
          <AlertTriangle size={24} color={danger ? '#dc2626' : '#2563eb'} />
        </div>
        <div style={{ fontSize: 17, fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>{title}</div>
        <div style={{ fontSize: 13, color: '#64748b', marginBottom: 24, lineHeight: 1.6 }}>{message}</div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1, padding: '11px', background: '#f8fafc',
              border: '1.5px solid #f1f5f9', borderRadius: 12,
              fontSize: 13, fontWeight: 700, color: '#64748b', cursor: 'pointer', fontFamily: 'inherit',
            }}
          >{cancelLabel}</button>
          <button
            onClick={onConfirm}
            style={{
              flex: 1, padding: '11px',
              background: danger ? 'linear-gradient(135deg,#ef4444,#dc2626)' : 'linear-gradient(135deg,#2563eb,#1d4ed8)',
              border: 'none', borderRadius: 12,
              fontSize: 13, fontWeight: 800, color: '#fff', cursor: 'pointer', fontFamily: 'inherit',
              boxShadow: danger ? '0 4px 14px rgba(239,68,68,0.4)' : '0 4px 14px rgba(37,99,235,0.4)',
            }}
          >{confirmLabel}</button>
        </div>
      </div>
      <style>{`@keyframes cmIn{from{opacity:0;transform:scale(.9) translateY(10px)}to{opacity:1;transform:none}}`}</style>
    </div>
  );
}
